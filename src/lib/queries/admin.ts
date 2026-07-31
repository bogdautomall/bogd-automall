import { createClient } from "@/lib/supabase/server";
import type { Brand, Model, Color, LookupItem, Vehicle } from "@/types/vehicle";

export interface VehicleFormOptions {
  brands: Brand[];
  models: Model[];
  colors: Color[];
  fuelTypes: LookupItem[];
  transmissionTypes: LookupItem[];
  driveTypes: LookupItem[];
  bodyTypes: LookupItem[];
}

export async function getVehicleFormOptions(): Promise<VehicleFormOptions> {
  const supabase = await createClient();

  const [
    { data: brands },
    { data: models },
    { data: colors },
    { data: fuelTypes },
    { data: transmissionTypes },
    { data: driveTypes },
    { data: bodyTypes },
  ] = await Promise.all([
    supabase.from("brands").select("*").order("name_mn"),
    supabase.from("models").select("*").order("name_mn"),
    supabase.from("colors").select("*").order("name_mn"),
    supabase.from("fuel_types").select("*").order("name_mn"),
    supabase.from("transmission_types").select("*").order("name_mn"),
    supabase.from("drive_types").select("*").order("name_mn"),
    supabase.from("body_types").select("*").order("name_mn"),
  ]);

  return {
    brands: (brands ?? []) as Brand[],
    models: (models ?? []) as Model[],
    colors: (colors ?? []) as Color[],
    fuelTypes: (fuelTypes ?? []) as LookupItem[],
    transmissionTypes: (transmissionTypes ?? []) as LookupItem[],
    driveTypes: (driveTypes ?? []) as LookupItem[],
    bodyTypes: (bodyTypes ?? []) as LookupItem[],
  };
}

export async function getVehicleById(id: string): Promise<Vehicle | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("vehicles")
    .select(
      `*,
      brand:brands(*),
      model:models(*),
      fuel_type:fuel_types(*),
      transmission:transmission_types(*),
      drive_type:drive_types(*),
      body_type:body_types(*),
      exterior_color:colors!vehicles_exterior_color_id_fkey(*),
      interior_color:colors!vehicles_interior_color_id_fkey(*),
      vehicle_images(id, storage_path, sort_order),
      vehicle_videos(id, storage_path)`
    )
    .eq("id", id)
    .single();

  if (error) {
    console.error("getVehicleById error:", error.message);
    return null;
  }

  return data as unknown as Vehicle;
}

export async function getAllVehiclesForAdmin(): Promise<Vehicle[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("vehicles")
    .select(
      `*, brand:brands(*), model:models(*), vehicle_images(id, storage_path, sort_order)`
    )
    .order("created_at", { ascending: false });

  if (error) {
    console.error("getAllVehiclesForAdmin error:", error.message);
    return [];
  }

  return (data ?? []) as unknown as Vehicle[];
}
