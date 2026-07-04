export interface LookupItem {
  id: string;
  name_mn: string;
  name_en: string;
}

export interface Color extends LookupItem {
  hex_code: string | null;
}

export interface Brand extends LookupItem {}

export interface Model extends LookupItem {
  brand_id: string;
}

export type AvailabilityStatus = "available" | "reserved" | "sold" | "archived";

export interface VehicleImage {
  id: string;
  storage_path: string;
  sort_order: number;
}

export interface VehicleVideo {
  id: string;
  storage_path: string;
}

/** Shape returned by list/detail queries after joining lookup tables. */
export interface Vehicle {
  id: string;
  slug: string;
  manufacturing_year: number;
  import_year: number | null;
  mileage: number | null;
  engine_size: number | null;
  engine_type: string | null;
  steering_position: "left" | "right" | null;
  price: number;
  currency: string;
  availability_status: AvailabilityStatus;
  is_featured: boolean;
  description_mn: string | null;
  description_en: string | null;
  created_at: string;

  brand: Brand;
  model: Model;
  fuel_type: LookupItem | null;
  transmission: LookupItem | null;
  drive_type: LookupItem | null;
  body_type: LookupItem | null;
  exterior_color: Color | null;
  interior_color: Color | null;

  vehicle_images: VehicleImage[];
  vehicle_videos?: VehicleVideo[];
}

export interface VehicleFilters {
  search?: string;
  brandId?: string;
  modelId?: string;
  fuelTypeId?: string;
  transmissionId?: string;
  driveTypeId?: string;
  bodyTypeId?: string;
  minYear?: number;
  maxYear?: number;
  minPrice?: number;
  maxPrice?: number;
  featuredOnly?: boolean;
  sort?: "newest" | "price_asc" | "price_desc" | "year_desc" | "mileage_asc";
  page?: number;
  pageSize?: number;
}
