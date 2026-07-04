"use client";

import * as React from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import type { FilterOptions } from "@/lib/queries/vehicles";

const ALL = "all";

export function FilterSidebar({ options }: { options: FilterOptions }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [search, setSearch] = React.useState(searchParams.get("search") ?? "");
  const [brandId, setBrandId] = React.useState(searchParams.get("brand") ?? ALL);
  const [modelId, setModelId] = React.useState(searchParams.get("model") ?? ALL);
  const [fuelTypeId, setFuelTypeId] = React.useState(searchParams.get("fuel") ?? ALL);
  const [transmissionId, setTransmissionId] = React.useState(
    searchParams.get("transmission") ?? ALL
  );
  const [driveTypeId, setDriveTypeId] = React.useState(searchParams.get("drive") ?? ALL);
  const [bodyTypeId, setBodyTypeId] = React.useState(searchParams.get("body") ?? ALL);
  const [minYear, setMinYear] = React.useState(searchParams.get("minYear") ?? "");
  const [maxYear, setMaxYear] = React.useState(searchParams.get("maxYear") ?? "");
  const [minPrice, setMinPrice] = React.useState(searchParams.get("minPrice") ?? "");
  const [maxPrice, setMaxPrice] = React.useState(searchParams.get("maxPrice") ?? "");
  const [featuredOnly, setFeaturedOnly] = React.useState(
    searchParams.get("featured") === "true"
  );

  const modelsForBrand = React.useMemo(
    () =>
      brandId === ALL
        ? options.models
        : options.models.filter((m) => m.brand_id === brandId),
    [options.models, brandId]
  );

  function applyFilters() {
    const params = new URLSearchParams();
    if (search.trim()) params.set("search", search.trim());
    if (brandId !== ALL) params.set("brand", brandId);
    if (modelId !== ALL) params.set("model", modelId);
    if (fuelTypeId !== ALL) params.set("fuel", fuelTypeId);
    if (transmissionId !== ALL) params.set("transmission", transmissionId);
    if (driveTypeId !== ALL) params.set("drive", driveTypeId);
    if (bodyTypeId !== ALL) params.set("body", bodyTypeId);
    if (minYear) params.set("minYear", minYear);
    if (maxYear) params.set("maxYear", maxYear);
    if (minPrice) params.set("minPrice", minPrice);
    if (maxPrice) params.set("maxPrice", maxPrice);
    if (featuredOnly) params.set("featured", "true");
    // Preserve sort if already set
    const sort = searchParams.get("sort");
    if (sort) params.set("sort", sort);

    router.push(`${pathname}?${params.toString()}`);
  }

  function clearFilters() {
    setSearch("");
    setBrandId(ALL);
    setModelId(ALL);
    setFuelTypeId(ALL);
    setTransmissionId(ALL);
    setDriveTypeId(ALL);
    setBodyTypeId(ALL);
    setMinYear("");
    setMaxYear("");
    setMinPrice("");
    setMaxPrice("");
    setFeaturedOnly(false);
    router.push(pathname);
  }

  return (
    <aside className="space-y-6">
      <div>
        <Label htmlFor="search" className="mb-1.5">
          Хайх
        </Label>
        <Input
          id="search"
          placeholder="Марк, загвар..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && applyFilters()}
        />
      </div>

      <FilterSelect
        label="Марк"
        value={brandId}
        onChange={(v) => {
          setBrandId(v);
          setModelId(ALL);
        }}
        options={options.brands.map((b) => ({ value: b.id, label: b.name_mn }))}
      />

      <FilterSelect
        label="Загвар"
        value={modelId}
        onChange={setModelId}
        options={modelsForBrand.map((m) => ({ value: m.id, label: m.name_mn }))}
      />

      <FilterSelect
        label="Шатахуун"
        value={fuelTypeId}
        onChange={setFuelTypeId}
        options={options.fuelTypes.map((f) => ({ value: f.id, label: f.name_mn }))}
      />

      <FilterSelect
        label="Хурдны хайрцаг"
        value={transmissionId}
        onChange={setTransmissionId}
        options={options.transmissionTypes.map((t) => ({
          value: t.id,
          label: t.name_mn,
        }))}
      />

      <FilterSelect
        label="Хөтлөгч"
        value={driveTypeId}
        onChange={setDriveTypeId}
        options={options.driveTypes.map((d) => ({ value: d.id, label: d.name_mn }))}
      />

      <FilterSelect
        label="Бүтэц"
        value={bodyTypeId}
        onChange={setBodyTypeId}
        options={options.bodyTypes.map((b) => ({ value: b.id, label: b.name_mn }))}
      />

      <div>
        <Label className="mb-1.5">Үйлдвэрлэсэн он</Label>
        <div className="flex items-center gap-2">
          <Input
            type="number"
            placeholder="Эхлэх"
            value={minYear}
            onChange={(e) => setMinYear(e.target.value)}
          />
          <span className="text-muted-foreground">—</span>
          <Input
            type="number"
            placeholder="Дуусах"
            value={maxYear}
            onChange={(e) => setMaxYear(e.target.value)}
          />
        </div>
      </div>

      <div>
        <Label className="mb-1.5">Үнэ (₮)</Label>
        <div className="flex items-center gap-2">
          <Input
            type="number"
            placeholder="Доод"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
          />
          <span className="text-muted-foreground">—</span>
          <Input
            type="number"
            placeholder="Дээд"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Checkbox
          id="featured"
          checked={featuredOnly}
          onCheckedChange={(v) => setFeaturedOnly(v === true)}
        />
        <Label htmlFor="featured">Зөвхөн онцлох</Label>
      </div>

      <div className="flex gap-2 pt-2">
        <Button onClick={applyFilters} className="flex-1">
          Шүүх
        </Button>
        <Button onClick={clearFilters} variant="outline">
          Цэвэрлэх
        </Button>
      </div>
    </aside>
  );
}

function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div>
      <Label className="mb-1.5">{label}</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-full">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL}>Бүгд</SelectItem>
          {options.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
