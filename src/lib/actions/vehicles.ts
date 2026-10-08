"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { SupabaseClient } from "@supabase/supabase-js";

import { requireAdmin } from "@/lib/actions/require-admin";

const NEW_PREFIX = "__new__:";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/** Resolves a combobox value (real id, or `__new__:label`) into a real brand id. */
async function resolveBrand(supabase: SupabaseClient, value: string) {
  if (!value.startsWith(NEW_PREFIX)) return value;
  const label = value.slice(NEW_PREFIX.length);

  const { data, error } = await supabase
    .from("brands")
    .upsert({ name_mn: label, name_en: label }, { onConflict: "name_en" })
    .select("id")
    .single();

  if (error) throw new Error(`Марк үүсгэхэд алдаа гарлаа: ${error.message}`);
  return data.id as string;
}

async function resolveModel(
  supabase: SupabaseClient,
  brandId: string,
  value: string
) {
  if (!value.startsWith(NEW_PREFIX)) return value;
  const label = value.slice(NEW_PREFIX.length);

  const { data, error } = await supabase
    .from("models")
    .upsert(
      { brand_id: brandId, name_mn: label, name_en: label },
      { onConflict: "brand_id,name_en" }
    )
    .select("id")
    .single();

  if (error) throw new Error(`Загвар үүсгэхэд алдаа гарлаа: ${error.message}`);
  return data.id as string;
}

async function resolveColor(supabase: SupabaseClient, value: string | null) {
  if (!value) return null;
  if (!value.startsWith(NEW_PREFIX)) return value;
  const label = value.slice(NEW_PREFIX.length);

  const { data, error } = await supabase
    .from("colors")
    .upsert({ name_mn: label, name_en: label }, { onConflict: "name_en" })
    .select("id")
    .single();

  if (error) throw new Error(`Өнгө үүсгэхэд алдаа гарлаа: ${error.message}`);
  return data.id as string;
}

function numOrNull(v: FormDataEntryValue | null): number | null {
  if (!v || v === "") return null;
  const n = Number(v);
  return Number.isNaN(n) ? null : n;
}

function strOrNull(v: FormDataEntryValue | null): string | null {
  if (!v || String(v).trim() === "") return null;
  return String(v);
}

/**
 * Reads a JSON array of storage paths that the browser already uploaded.
 * Only paths under `uploads/` are accepted so a caller can't attach
 * arbitrary objects from the bucket.
 */
function parseUploadedPaths(v: FormDataEntryValue | null): string[] {
  if (!v || typeof v !== "string") return [];
  try {
    const parsed = JSON.parse(v);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (p): p is string =>
        typeof p === "string" && p.startsWith("uploads/") && !p.includes("..")
    );
  } catch {
    return [];
  }
}

async function insertVehicleImages(
  supabase: SupabaseClient,
  vehicleId: string,
  paths: string[],
  sortOrders: number[]
) {
  if (paths.length === 0) return;
  const { error } = await supabase.from("vehicle_images").insert(
    paths.map((storage_path, i) => ({
      vehicle_id: vehicleId,
      storage_path,
      sort_order: sortOrders[i],
    }))
  );
  if (error) {
    await supabase.storage.from("vehicle-media").remove(paths);
    throw new Error(`Зургийн мэдээлэл хадгалахад алдаа: ${error.message}`);
  }
}

async function insertVehicleVideos(
  supabase: SupabaseClient,
  vehicleId: string,
  paths: string[]
) {
  if (paths.length === 0) return;
  const { error } = await supabase
    .from("vehicle_videos")
    .insert(paths.map((storage_path) => ({ vehicle_id: vehicleId, storage_path })));
  if (error) {
    await supabase.storage.from("vehicle-media").remove(paths);
    throw new Error(`Бичлэгийн мэдээлэл хадгалахад алдаа: ${error.message}`);
  }
}

export async function createVehicle(formData: FormData) {
  const { supabase } = await requireAdmin();

  const brandId = await resolveBrand(supabase, String(formData.get("brand")));
  const modelId = await resolveModel(
    supabase,
    brandId,
    String(formData.get("model"))
  );
  const exteriorColorId = await resolveColor(
    supabase,
    strOrNull(formData.get("exterior_color"))
  );
  const interiorColorId = await resolveColor(
    supabase,
    strOrNull(formData.get("interior_color"))
  );

  const images = parseUploadedPaths(formData.get("image_paths"));
  if (images.length > 20) {
    throw new Error("Нэг машинд хамгийн ихдээ 20 зураг байршуулах боломжтой.");
  }

  const videos = parseUploadedPaths(formData.get("video_paths"));

  // new_image_positions contains the display position (sort_order) for each new file
  const newImagePositionsStr = formData.get("new_image_positions");
  let newImagePositions: number[] = images.map((_, i) => i); // default: sequential
  if (newImagePositionsStr && typeof newImagePositionsStr === "string") {
    try {
      const parsed = JSON.parse(newImagePositionsStr) as number[];
      if (Array.isArray(parsed) && parsed.length === images.length) {
        newImagePositions = parsed;
      }
    } catch {
      // keep defaults
    }
  }

  // Build a unique, SEO-friendly slug from brand + model + year.
  const [{ data: brandRow }, { data: modelRow }] = await Promise.all([
    supabase.from("brands").select("name_en").eq("id", brandId).single(),
    supabase.from("models").select("name_en").eq("id", modelId).single(),
  ]);
  const year = String(formData.get("manufacturing_year"));
  const baseSlug = slugify(`${brandRow?.name_en}-${modelRow?.name_en}-${year}`);
  const slug = `${baseSlug}-${crypto.randomUUID().slice(0, 6)}`;

  const { data: vehicle, error } = await supabase
    .from("vehicles")
    .insert({
      slug,
      brand_id: brandId,
      model_id: modelId,
      manufacturing_year: Number(year),
      import_year: numOrNull(formData.get("import_year")),
      mileage: numOrNull(formData.get("mileage")),
      fuel_type_id: strOrNull(formData.get("fuel_type")),
      transmission_id: strOrNull(formData.get("transmission")),
      drive_type_id: strOrNull(formData.get("drive_type")),
      body_type_id: strOrNull(formData.get("body_type")),
      engine_size: numOrNull(formData.get("engine_size")),
      engine_type: strOrNull(formData.get("engine_type")),
      steering_position: strOrNull(formData.get("steering_position")),
      exterior_color_id: exteriorColorId,
      interior_color_id: interiorColorId,
      price: Number(formData.get("price")),
      availability_status: String(formData.get("availability_status") || "available"),
      is_featured: formData.get("is_featured") === "on",
      description_mn: strOrNull(formData.get("description_mn")),
      description_en: strOrNull(formData.get("description_en")),
    })
    .select("id")
    .single();

  if (error) {
    await supabase.storage.from("vehicle-media").remove([...images, ...videos]);
    throw new Error(`Машин үүсгэхэд алдаа гарлаа: ${error.message}`);
  }

  await insertVehicleImages(
    supabase,
    vehicle.id,
    images,
    images.map((_, i) => newImagePositions[i] ?? i)
  );
  await insertVehicleVideos(supabase, vehicle.id, videos);

  revalidatePath("/admin/dashboard");
  revalidatePath("/");
  redirect("/admin/dashboard");
}

export async function updateVehicle(vehicleId: string, formData: FormData) {
  const { supabase } = await requireAdmin();

  const brandId = await resolveBrand(supabase, String(formData.get("brand")));
  const modelId = await resolveModel(
    supabase,
    brandId,
    String(formData.get("model"))
  );
  const exteriorColorId = await resolveColor(
    supabase,
    strOrNull(formData.get("exterior_color"))
  );
  const interiorColorId = await resolveColor(
    supabase,
    strOrNull(formData.get("interior_color"))
  );

  const { count: existingCount } = await supabase
    .from("vehicle_images")
    .select("id", { count: "exact", head: true })
    .eq("vehicle_id", vehicleId);

  const newImages = parseUploadedPaths(formData.get("image_paths"));
  if ((existingCount ?? 0) + newImages.length > 20) {
    throw new Error(
      `Нэг машинд хамгийн ихдээ 20 зураг байршуулах боломжтой (одоо ${existingCount} байна).`
    );
  }

  const newVideos = parseUploadedPaths(formData.get("video_paths"));

  // Apply image reorder for existing images
  const imageOrderStr = formData.get("image_order");
  if (imageOrderStr && typeof imageOrderStr === "string") {
    try {
      const orderData = JSON.parse(imageOrderStr) as { id: string; sort_order: number }[];
      if (Array.isArray(orderData) && orderData.length > 0 && orderData[0]?.id) {
        // Update all existing images in parallel
        await Promise.all(
          orderData.map((item) =>
            supabase
              .from("vehicle_images")
              .update({ sort_order: item.sort_order })
              .eq("id", item.id)
          )
        );
      }
    } catch {
      // ignore parse errors
    }
  }

  // Parse new image positions (position in the combined display list)
  const newImagePositionsStr = formData.get("new_image_positions");
  let newImagePositions: number[] | null = null;
  if (newImagePositionsStr && typeof newImagePositionsStr === "string") {
    try {
      const parsed = JSON.parse(newImagePositionsStr) as number[];
      if (Array.isArray(parsed)) newImagePositions = parsed;
    } catch {
      // keep null
    }
  }

  const { error } = await supabase
    .from("vehicles")
    .update({
      brand_id: brandId,
      model_id: modelId,
      manufacturing_year: Number(formData.get("manufacturing_year")),
      import_year: numOrNull(formData.get("import_year")),
      mileage: numOrNull(formData.get("mileage")),
      fuel_type_id: strOrNull(formData.get("fuel_type")),
      transmission_id: strOrNull(formData.get("transmission")),
      drive_type_id: strOrNull(formData.get("drive_type")),
      body_type_id: strOrNull(formData.get("body_type")),
      engine_size: numOrNull(formData.get("engine_size")),
      engine_type: strOrNull(formData.get("engine_type")),
      steering_position: strOrNull(formData.get("steering_position")),
      exterior_color_id: exteriorColorId,
      interior_color_id: interiorColorId,
      price: Number(formData.get("price")),
      availability_status: String(formData.get("availability_status") || "available"),
      is_featured: formData.get("is_featured") === "on",
      description_mn: strOrNull(formData.get("description_mn")),
      description_en: strOrNull(formData.get("description_en")),
    })
    .eq("id", vehicleId);

  if (error) {
    await supabase.storage.from("vehicle-media").remove([...newImages, ...newVideos]);
    throw new Error(`Машин шинэчлэхэд алдаа гарлаа: ${error.message}`);
  }

  await insertVehicleImages(
    supabase,
    vehicleId,
    newImages,
    newImages.map((_, i) => newImagePositions?.[i] ?? (existingCount ?? 0) + i)
  );
  await insertVehicleVideos(supabase, vehicleId, newVideos);

  revalidatePath("/admin/dashboard");
  revalidatePath("/");
  revalidatePath(`/admin/dashboard/vehicles/${vehicleId}/edit`);
  redirect("/admin/dashboard");
}

export async function deleteVehicleImage(imageId: string, storagePath: string) {
  const { supabase } = await requireAdmin();

  await supabase.storage.from("vehicle-media").remove([storagePath]);
  await supabase.from("vehicle_images").delete().eq("id", imageId);

  revalidatePath("/admin/dashboard");
}

export async function deleteVehicleVideo(videoId: string, storagePath: string) {
  const { supabase } = await requireAdmin();

  await supabase.storage.from("vehicle-media").remove([storagePath]);
  await supabase.from("vehicle_videos").delete().eq("id", videoId);

  revalidatePath("/admin/dashboard");
}

export async function reorderVehicleImages(
  imageOrders: { id: string; sort_order: number }[]
) {
  const { supabase } = await requireAdmin();

  for (const item of imageOrders) {
    const { error } = await supabase
      .from("vehicle_images")
      .update({ sort_order: item.sort_order })
      .eq("id", item.id);

    if (error) {
      throw new Error(`Зургийн дараалал хадгалахад алдаа гарлаа: ${error.message}`);
    }
  }

  revalidatePath("/admin/dashboard");
  revalidatePath("/");
}

export async function deleteVehicle(vehicleId: string) {
  const { supabase } = await requireAdmin();

  // Delete images
  const { data: images } = await supabase
    .from("vehicle_images")
    .select("storage_path")
    .eq("vehicle_id", vehicleId);

  if (images && images.length > 0) {
    await supabase.storage
      .from("vehicle-media")
      .remove(images.map((i) => i.storage_path));
  }

  // Delete videos
  const { data: videos } = await supabase
    .from("vehicle_videos")
    .select("storage_path")
    .eq("vehicle_id", vehicleId);

  if (videos && videos.length > 0) {
    await supabase.storage
      .from("vehicle-media")
      .remove(videos.map((v) => v.storage_path));
  }

  const { error } = await supabase.from("vehicles").delete().eq("id", vehicleId);
  if (error) throw new Error(`Машин устгахад алдаа гарлаа: ${error.message}`);

  revalidatePath("/admin/dashboard");
  revalidatePath("/");
}

export async function setAvailability(
  vehicleId: string,
  status: "available" | "reserved" | "sold" | "archived"
) {
  const { supabase } = await requireAdmin();

  const { error } = await supabase
    .from("vehicles")
    .update({ availability_status: status })
    .eq("id", vehicleId);

  if (error) throw new Error(`Төлөв өөрчлөхөд алдаа гарлаа: ${error.message}`);

  revalidatePath("/admin/dashboard");
  revalidatePath("/");
}

export async function toggleFeatured(vehicleId: string, next: boolean) {
  const { supabase } = await requireAdmin();

  const { error } = await supabase
    .from("vehicles")
    .update({ is_featured: next })
    .eq("id", vehicleId);

  if (error) throw new Error(`Онцлох төлөв өөрчлөхөд алдаа гарлаа: ${error.message}`);

  revalidatePath("/admin/dashboard");
  revalidatePath("/");
}
