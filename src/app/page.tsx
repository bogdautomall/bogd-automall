import { getVehicles } from "@/lib/queries/vehicles";
import { HomeContent } from "@/components/home-content";

export default async function HomePage() {
  const { vehicles: featured } = await getVehicles({
    featuredOnly: true,
    pageSize: 3,
  });

  return <HomeContent featured={featured} />;
}
