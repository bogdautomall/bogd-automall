"use client";

import * as tus from "tus-js-client";

import { createClient } from "@/lib/supabase/client";

/**
 * Browser-side media uploads straight to Supabase Storage. Files never go
 * through a Server Action: Vercel rejects request bodies over 4.5MB.
 *
 * - Images are downscaled/re-encoded on the device first (a 5MB phone photo
 *   becomes ~0.5MB), uploaded a few at a time, and retried on failure.
 * - Videos use Supabase's resumable (TUS) endpoint in 6MB chunks, so a
 *   flaky mobile connection resumes instead of starting over.
 */

const BUCKET = "vehicle-media";
const IMAGE_MAX_DIMENSION = 2000;
const IMAGE_QUALITY = 0.85;
const IMAGE_CONCURRENCY = 3;
const IMAGE_ATTEMPTS = 3;
const TUS_CHUNK_SIZE = 6 * 1024 * 1024; // Supabase requires exactly 6MB

/** Supabase free plan caps a single file at 50MB. Raise if the plan allows. */
export const MAX_VIDEO_MB = 50;

type Supabase = ReturnType<typeof createClient>;

function extOf(name: string, fallback: string) {
  const ext = name.split(".").pop();
  return ext && ext !== name ? ext.toLowerCase() : fallback;
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

/**
 * Re-encodes an image as JPEG no larger than IMAGE_MAX_DIMENSION on its
 * longest side. Falls back to the original file if the browser can't
 * decode it or if compression wouldn't make it smaller.
 */
async function compressImage(file: File): Promise<File> {
  if (file.type === "image/gif" || file.size < 400 * 1024) return file;

  const url = URL.createObjectURL(file);
  try {
    const img = new Image();
    img.src = url;
    await img.decode();

    const scale = Math.min(
      1,
      IMAGE_MAX_DIMENSION / Math.max(img.naturalWidth, img.naturalHeight)
    );
    const width = Math.round(img.naturalWidth * scale);
    const height = Math.round(img.naturalHeight * scale);

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return file;
    ctx.drawImage(img, 0, 0, width, height);

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/jpeg", IMAGE_QUALITY)
    );
    // Release canvas memory early — matters on iPhones with 20 photos.
    canvas.width = 0;
    canvas.height = 0;

    if (!blob || blob.size >= file.size) return file;
    const base = file.name.replace(/\.[^.]+$/, "") || "image";
    return new File([blob], `${base}.jpg`, { type: "image/jpeg" });
  } catch {
    return file;
  } finally {
    URL.revokeObjectURL(url);
  }
}

async function uploadImage(supabase: Supabase, original: File): Promise<string> {
  const file = await compressImage(original);
  const path = `uploads/${crypto.randomUUID()}.${extOf(file.name, "jpg")}`;

  let lastError = "";
  for (let attempt = 1; attempt <= IMAGE_ATTEMPTS; attempt++) {
    const { error } = await supabase.storage
      .from(BUCKET)
      .upload(path, file, { contentType: file.type || undefined });
    if (!error) return path;
    // A retry after a request that actually landed reports a duplicate.
    if (/already exists|duplicate/i.test(error.message)) return path;
    lastError = error.message;
    if (attempt < IMAGE_ATTEMPTS) await sleep(1000 * attempt * attempt);
  }
  throw new Error(`${original.name}: ${lastError}`);
}

/**
 * Uploads images with limited concurrency. Returns storage paths in the
 * same order as `files`.
 */
export async function uploadImages(
  files: File[],
  onProgress: (done: number, total: number) => void
): Promise<string[]> {
  const supabase = createClient();
  const paths: string[] = new Array(files.length);
  let next = 0;
  let done = 0;
  onProgress(0, files.length);

  async function worker() {
    while (next < files.length) {
      const i = next++;
      paths[i] = await uploadImage(supabase, files[i]);
      onProgress(++done, files.length);
    }
  }

  await Promise.all(
    Array.from({ length: Math.min(IMAGE_CONCURRENCY, files.length) }, worker)
  );
  return paths;
}

/** Resumable upload of one video. `onProgress` receives 0–100. */
export async function uploadVideo(
  file: File,
  onProgress: (percent: number) => void
): Promise<string> {
  const supabase = createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) throw new Error("Нэвтрэх хугацаа дууссан. Дахин нэвтэрнэ үү.");

  const path = `uploads/videos/${crypto.randomUUID()}.${extOf(file.name, "mp4")}`;

  return new Promise<string>((resolve, reject) => {
    const upload = new tus.Upload(file, {
      endpoint: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/upload/resumable`,
      retryDelays: [0, 2000, 5000, 10000, 20000, 30000],
      headers: {
        authorization: `Bearer ${session.access_token}`,
        "x-upsert": "false",
      },
      uploadDataDuringCreation: true,
      removeFingerprintOnSuccess: true,
      chunkSize: TUS_CHUNK_SIZE,
      metadata: {
        bucketName: BUCKET,
        objectName: path,
        contentType: file.type || "video/mp4",
        cacheControl: "3600",
      },
      onProgress(sent, total) {
        onProgress(total ? Math.round((sent / total) * 100) : 0);
      },
      onError(err) {
        reject(new Error(`${file.name}: ${err.message}`));
      },
      onSuccess() {
        resolve(path);
      },
    });
    upload.start();
  });
}

/** Best-effort removal of files uploaded for a save that then failed. */
export async function removeUploaded(paths: string[]) {
  if (paths.length === 0) return;
  try {
    await createClient().storage.from(BUCKET).remove(paths);
  } catch {
    // ignore — orphaned files are harmless
  }
}
