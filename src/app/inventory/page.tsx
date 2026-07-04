import type { Metadata } from "next";
import { PackageSearch } from "lucide-react";

import { getVehicles, getFilterOptions } from "@/lib/queries/vehicles";
import { VehicleCard } from "@/components/vehicle-card";
import { FilterSidebar } from "@/components/inventory/filter-sidebar";
import { SortSelect } from "@/components/inventory/sort-select";
import { InventoryPagination } from "@/components/inventory/pagination";
import type { VehicleFilters } from "@/types/vehicle";

export const metadata: Metadata = {
  title: "Каталог",
  description: "Bogd Automall-ийн бэлэн байгаа автомашинуудын бүрэн жагсаалт.",
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

export default async function InventoryPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;
  const filters = parseFilters(sp);

  const [{ vehicles, total }, options] = await Promise.all([
    getVehicles(filters),
    getFilterOptions(),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const currentPage = filters.page ?? 1;

  const flatSearchParams: Record<string, string | undefined> = Object.fromEntries(
    Object.entries(sp).map(([k, v]) => [k, Array.isArray(v) ? v[0] : v])
  );

  return (
    <main className="mx-auto max-w-7xl px-6 py-12">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold">Каталог</h1>
        <p className="mt-1 text-muted-foreground">
          {total > 0
            ? `${total} автомашин олдлоо`
            : "Одоогоор тохирох автомашин олдсонгүй"}
        </p>
      </div>

      <div className="grid gap-10 lg:grid-cols-[260px_1fr]">
        <FilterSidebar options={options} />

        <div>
          <div className="mb-6 flex items-center justify-end">
            <SortSelect />
          </div>

          {vehicles.length > 0 ? (
            <>
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {vehicles.map((vehicle) => (
                  <VehicleCard key={vehicle.id} vehicle={vehicle} />
                ))}
              </div>
              <InventoryPagination
                currentPage={currentPage}
                totalPages={totalPages}
                searchParams={flatSearchParams}
              />
            </>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-24 text-center">
              <PackageSearch className="size-10 text-muted-foreground" strokeWidth={1.25} />
              <p className="mt-4 font-medium">Тохирох автомашин олдсонгүй</p>
              <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                Шүүлтүүрээ өөрчлөх эсвэл цэвэрлэж дахин үзнэ үү.
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
