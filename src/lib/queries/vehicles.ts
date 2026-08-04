import { createClient } from "@/lib/supabase/server";
import type { Vehicle, VehicleFilters, Brand, Model, LookupItem, Color } from "@/types/vehicle";

const VEHICLE_SELECT = `
  *,
  brand:brands(*),
  model:models(*),
  fuel_type:fuel_types(*),
  transmission:transmission_types(*),
  drive_type:drive_types(*),
  body_type:body_types(*),
  exterior_color:colors!vehicles_exterior_color_id_fkey(*),
  interior_color:colors!vehicles_interior_color_id_fkey(*),
  vehicle_images(id, storage_path, sort_order)
`;

const PAGE_SIZE_DEFAULT = 12;

export async function getVehicles(
  filters: VehicleFilters = {}
): Promise<{ vehicles: Vehicle[]; total: number }> {
  const supabase = await createClient();
  const page = filters.page ?? 1;
  const pageSize = filters.pageSize ?? PAGE_SIZE_DEFAULT;

  let query = supabase
    .from("vehicles")
    .select(VEHICLE_SELECT, { count: "exact" })
    .neq("availability_status", "archived");

  if (filters.brandId) query = query.eq("brand_id", filters.brandId);
  if (filters.modelId) query = query.eq("model_id", filters.modelId);
  if (filters.fuelTypeId) query = query.eq("fuel_type_id", filters.fuelTypeId);
  if (filters.transmissionId)
    query = query.eq("transmission_id", filters.transmissionId);
  if (filters.driveTypeId) query = query.eq("drive_type_id", filters.driveTypeId);
  if (filters.bodyTypeId) query = query.eq("body_type_id", filters.bodyTypeId);
  if (filters.minYear) query = query.gte("manufacturing_year", filters.minYear);
  if (filters.maxYear) query = query.lte("manufacturing_year", filters.maxYear);
  if (filters.minPrice) query = query.gte("price", filters.minPrice);
  if (filters.maxPrice) query = query.lte("price", filters.maxPrice);
  if (filters.featuredOnly) query = query.eq("is_featured", true);

  // Free-text search: resolve matching brand/model ids first, then filter
  // vehicles by those (joined-table text search isn't reliable via
  // PostgREST without an inner join, so this two-step approach is safer).
  if (filters.search && filters.search.trim().length > 0) {
    const term = `%${filters.search.trim()}%`;
    const [{ data: matchedBrands }, { data: matchedModels }] = await Promise.all([
      supabase.from("brands").select("id").or(`name_mn.ilike.${term},name_en.ilike.${term}`),
      supabase.from("models").select("id").or(`name_mn.ilike.${term},name_en.ilike.${term}`),
    ]);
    const brandIds = (matchedBrands ?? []).map((b) => b.id);
    const modelIds = (matchedModels ?? []).map((m) => m.id);

    if (brandIds.length === 0 && modelIds.length === 0) {
      // Nothing matches the search term at all.
      return { vehicles: [], total: 0 };
    }

    const orParts = [
      ...brandIds.map((id) => `brand_id.eq.${id}`),
      ...modelIds.map((id) => `model_id.eq.${id}`),
    ];
    query = query.or(orParts.join(","));
  }

  // Featured vehicles always bubble to the top regardless of sort
  query = query.order("is_featured", { ascending: false });

  switch (filters.sort) {
    case "price_asc":
      query = query.order("price", { ascending: true });
      break;
    case "price_desc":
      query = query.order("price", { ascending: false });
      break;
    case "year_desc":
      query = query.order("manufacturing_year", { ascending: false });
      break;
    case "mileage_asc":
      query = query.order("mileage", { ascending: true, nullsFirst: false });
      break;
    case "newest":
    default:
      query = query.order("created_at", { ascending: false });
      break;
  }

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  query = query.range(from, to);

  const { data, error, count } = await query;

  if (error) {
    console.error("getVehicles error:", error.message);
    return { vehicles: [], total: 0 };
  }

  return { vehicles: (data ?? []) as unknown as Vehicle[], total: count ?? 0 };
}

export async function getVehicleBySlug(slug: string): Promise<Vehicle | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("vehicles")
    .select(`${VEHICLE_SELECT}, vehicle_videos(id, storage_path)`)
    .eq("slug", slug)
    .single();

  if (error) {
    if (error.code !== "PGRST116") {
      console.error("getVehicleBySlug error:", error.message);
    }
    return null;
  }

  return data as unknown as Vehicle;
}

export async function getRelatedVehicles(
  vehicle: Vehicle,
  limit = 3
): Promise<Vehicle[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("vehicles")
    .select(VEHICLE_SELECT)
    .eq("brand_id", vehicle.brand.id)
    .neq("id", vehicle.id)
    .neq("availability_status", "archived")
    .limit(limit);

  if (error) {
    console.error("getRelatedVehicles error:", error.message);
    return [];
  }

  return (data ?? []) as unknown as Vehicle[];
}

export interface FilterOptions {
  brands: Brand[];
  models: Model[];
  fuelTypes: LookupItem[];
  transmissionTypes: LookupItem[];
  driveTypes: LookupItem[];
  bodyTypes: LookupItem[];
  colors: Color[];
  priceBounds: { min: number; max: number };
}

export async function getFilterOptions(): Promise<FilterOptions> {
  const supabase = await createClient();

  const [
    { data: brands },
    { data: models },
    { data: fuelTypes },
    { data: transmissionTypes },
    { data: driveTypes },
    { data: bodyTypes },
    { data: colors },
    { data: priceRows },
  ] = await Promise.all([
    supabase.from("brands").select("*").order("name_en"),
    supabase.from("models").select("*").order("name_en"),
    supabase.from("fuel_types").select("*").order("name_en"),
    supabase.from("transmission_types").select("*").order("name_en"),
    supabase.from("drive_types").select("*").order("name_en"),
    supabase.from("body_types").select("*").order("name_en"),
    supabase.from("colors").select("*").order("name_en"),
    supabase
      .from("vehicles")
      .select("price")
      .neq("availability_status", "archived"),
  ]);

  const prices = (priceRows ?? []).map((r) => Number(r.price));
  const priceBounds = {
    min: prices.length ? Math.min(...prices) : 0,
    max: prices.length ? Math.max(...prices) : 0,
  };

  return {
    brands: (brands ?? []) as Brand[],
    models: (models ?? []) as Model[],
    fuelTypes: (fuelTypes ?? []) as LookupItem[],
    transmissionTypes: (transmissionTypes ?? []) as LookupItem[],
    driveTypes: (driveTypes ?? []) as LookupItem[],
    bodyTypes: (bodyTypes ?? []) as LookupItem[],
    colors: (colors ?? []) as Color[],
    priceBounds,
  };
}

export async function getBrandModelCounts(): Promise<{
  brandCounts: Record<string, number>;
  modelCounts: Record<string, number>;
}> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("vehicles")
    .select("brand_id, model_id")
    .neq("availability_status", "archived");

  if (error) {
    console.error("getBrandModelCounts error:", error.message);
    return { brandCounts: {}, modelCounts: {} };
  }

  const brandCounts: Record<string, number> = {};
  const modelCounts: Record<string, number> = {};

  (data ?? []).forEach((v) => {
    if (v.brand_id) {
      brandCounts[v.brand_id] = (brandCounts[v.brand_id] || 0) + 1;
    }
    if (v.model_id) {
      modelCounts[v.model_id] = (modelCounts[v.model_id] || 0) + 1;
    }
  });

  return { brandCounts, modelCounts };
}

