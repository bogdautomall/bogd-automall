const BUCKET = "vehicle-media";

/**
 * Builds a public URL for a file stored in the `vehicle-media` Supabase
 * Storage bucket. The bucket itself is created in Phase 5 (admin panel +
 * upload wiring) — this helper is ready ahead of that.
 */
export function getStorageUrl(path: string): string {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  return `${base}/storage/v1/object/public/${BUCKET}/${path}`;
}
