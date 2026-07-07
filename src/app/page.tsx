import type { Metadata } from "next";
import { getVehicles, getFilterOptions, getBrandModelCounts } from "@/lib/queries/vehicles";
import { HomeContent } from "@/components/home-content";
import type { VehicleFilters } from "@/types/vehicle";

export const metadata: Metadata = {
  title: "Нүүр - Bogd Automall",
  description: "Bogd Automall-ийн бэлэн байгаа автомашинуудын нүүр хуудас.",
};

const PAGE_SIZE = 12;

type SearchParams = Record<string, string | string[] | undefined>;

function parseFilters(sp: SearchParams): VehicleFilters {
  const get = (key: string) => {
    const v = sp[key];
    return Array.isArray(v) ? v[0] : v;
  };

  return {
    search: get("search"),
    brandId: get("brand"),
    modelId: get("model"),
    fuelTypeId: get("fuel"),
    transmissionId: get("transmission"),
    driveTypeId: get("drive"),
    bodyTypeId: get("body"),
    minYear: get("minYear") ? Number(get("minYear")) : undefined,
    maxYear: get("maxYear") ? Number(get("maxYear")) : undefined,
    minPrice: get("minPrice") ? Number(get("minPrice")) : undefined,
    maxPrice: get("maxPrice") ? Number(get("maxPrice")) : undefined,
    featuredOnly: get("featured") === "true",
    sort: (get("sort") as VehicleFilters["sort"]) ?? "newest",
    page: get("page") ? Number(get("page")) : 1,
    pageSize: PAGE_SIZE,
  };
}

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;
  const filters = parseFilters(sp);

  const [
    { vehicles: featured },
    { vehicles, total },
    options,
    brandModelCounts,
  ] = await Promise.all([
    getVehicles({ featuredOnly: true, pageSize: 3 }),
    getVehicles(filters),
    getFilterOptions(),
    getBrandModelCounts(),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const currentPage = filters.page ?? 1;

  const flatSearchParams: Record<string, string | undefined> = Object.fromEntries(
    Object.entries(sp).map(([k, v]) => [k, Array.isArray(v) ? v[0] : v])
  );

  return (
    <HomeContent
      featured={featured}
      vehicles={vehicles}
      totalVehicles={total}
      totalPages={totalPages}
      currentPage={currentPage}
      searchParams={flatSearchParams}
      filterOptions={options}
      brandModelCounts={brandModelCounts}
    />
  );
}

