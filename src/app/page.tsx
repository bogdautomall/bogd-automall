import type { Metadata } from "next";
import { getVehicles, getFilterOptions } from "@/lib/queries/vehicles";
import { HomeContent } from "@/components/home-content";

export const metadata: Metadata = {
  title: "Нүүр - Bogd Automall",
  description: "Bogd Automall-ийн бэлэн байгаа автомашинуудын нүүр хуудас.",
};

type SearchParams = Record<string, string | string[] | undefined>;

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;

  const [
    { vehicles: featured },
    { vehicles: allVehicles },
    options,
  ] = await Promise.all([
    getVehicles({ featuredOnly: true, pageSize: 6 }), // Fetch a pool of featured vehicles
    getVehicles({ pageSize: 1200 }), // Fetch up to 1200 vehicles (practically all available)
    getFilterOptions(),
  ]);

  const flatSearchParams: Record<string, string | undefined> = Object.fromEntries(
    Object.entries(sp).map(([k, v]) => [k, Array.isArray(v) ? v[0] : v])
  );

  return (
    <HomeContent
      featured={featured}
      vehicles={allVehicles}
      searchParams={flatSearchParams}
      filterOptions={options}
    />
  );
}

