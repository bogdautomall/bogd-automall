"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

const SORT_OPTIONS = [
  { value: "newest", label: "Хамгийн шинэ" },
  { value: "price_asc", label: "Үнэ: багаас их" },
  { value: "price_desc", label: "Үнэ: ихээс бага" },
  { value: "year_desc", label: "Он: шинээс хуучин" },
  { value: "mileage_asc", label: "Гүйлт: багаас их" },
];

export function SortSelect() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentSort = searchParams.get("sort") ?? "newest";

  function handleChange(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "newest") {
      params.delete("sort");
    } else {
      params.set("sort", value);
    }
    params.delete("page");
    router.push(`${pathname}?${params.toString()}#listings`);
  }

  return (
    <Select value={currentSort} onValueChange={handleChange}>
      <SelectTrigger className="w-[200px]">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {SORT_OPTIONS.map((opt) => (
          <SelectItem key={opt.value} value={opt.value}>
            {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
