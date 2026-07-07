import { redirect } from "next/navigation";

type SearchParams = Record<string, string | string[] | undefined>;

export default async function InventoryPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;
  const params = new URLSearchParams();

  Object.entries(sp).forEach(([key, val]) => {
    if (val !== undefined) {
      const actualVal = Array.isArray(val) ? val[0] : val;
      if (actualVal) {
        params.set(key, actualVal);
      }
    }
  });

  const queryStr = params.toString();
  redirect(`/${queryStr ? `?${queryStr}` : ""}#listings`);
}
