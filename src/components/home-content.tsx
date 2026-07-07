"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { ShieldCheck, Wallet, Truck, SlidersHorizontal, LayoutGrid, List } from "lucide-react";

import { Button } from "@/components/ui/button";
import { MountainDivider } from "@/components/mountain-divider";
import { VehicleCard } from "@/components/vehicle-card";
import { VehicleListRow } from "@/components/vehicle-list-row";
import { SortSelect } from "@/components/inventory/sort-select";
import { FilterSidebar } from "@/components/inventory/filter-sidebar";
import { InventoryPagination } from "@/components/inventory/pagination";
import { useLanguage } from "@/lib/i18n/language-context";
import { cn } from "@/lib/utils";
import type { Vehicle } from "@/types/vehicle";
import type { FilterOptions } from "@/lib/queries/vehicles";

export function HomeContent({
  featured,
  vehicles = [],
  totalVehicles = 0,
  totalPages = 1,
  currentPage = 1,
  searchParams = {},
  filterOptions,
  brandModelCounts,
}: {
  featured: Vehicle[];
  vehicles?: Vehicle[];
  totalVehicles?: number;
  totalPages?: number;
  currentPage?: number;
  searchParams?: Record<string, string | undefined>;
  filterOptions?: FilterOptions;
  brandModelCounts?: {
    brandCounts: Record<string, number>;
    modelCounts: Record<string, number>;
  };
}) {
  const { t } = useLanguage();
  const router = useRouter();
  const pathname = usePathname();
  const nextSearchParams = useSearchParams();

  const [viewMode, setViewMode] = React.useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = React.useState<boolean>(true);

  const activeBrandId = searchParams.brand || "";
  const activeModelId = searchParams.model || "";

  const activeBrand = filterOptions?.brands.find((b) => b.id === activeBrandId);
  const modelsForActiveBrand = React.useMemo(() => {
    if (!filterOptions || !activeBrandId) return [];
    return filterOptions.models.filter((m) => m.brand_id === activeBrandId);
  }, [filterOptions, activeBrandId]);

  const handleBrandSelect = (brandId: string) => {
    const params = new URLSearchParams(nextSearchParams.toString());
    if (params.get("brand") === brandId) {
      params.delete("brand");
      params.delete("model");
    } else {
      params.set("brand", brandId);
      params.delete("model");
    }
    params.delete("page");
    router.push(`${pathname}?${params.toString()}#listings`);
  };

  const handleModelSelect = (modelId: string) => {
    const params = new URLSearchParams(nextSearchParams.toString());
    if (params.get("model") === modelId) {
      params.delete("model");
    } else {
      params.set("model", modelId);
    }
    params.delete("page");
    router.push(`${pathname}?${params.toString()}#listings`);
  };

  const HIGHLIGHTS = [
    { icon: ShieldCheck, title: t.home.highlight1Title, body: t.home.highlight1Body },
    { icon: Wallet, title: t.home.highlight2Title, body: t.home.highlight2Body },
    { icon: Truck, title: t.home.highlight3Title, body: t.home.highlight3Body },
  ];

  return (
    <main>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-0 h-[36rem] w-[64rem] -translate-x-1/2 -translate-y-1/3 rounded-full bg-primary/20 blur-[120px]"
        />

        <div className="relative mx-auto max-w-4xl px-6 pt-24 pb-20 text-center">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-primary">
            {t.home.eyebrow}
          </p>
          <h1 className="mt-5 text-balance font-display text-4xl font-extrabold tracking-tight sm:text-6xl text-foreground">
            {t.home.titleLine1}
            <br />
            <span className="text-primary">{t.home.titleLine2}</span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-balance text-muted-foreground">
            {t.home.subtitle}
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
            <Button size="lg" asChild className="cursor-pointer">
              <Link href="#listings">{t.home.ctaInventory}</Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="cursor-pointer">
              <Link href="/about">{t.home.ctaAbout}</Link>
            </Button>
          </div>
        </div>

        <MountainDivider variant="fill" className="h-20 text-secondary/60" />
      </section>

      {/* Trust highlights */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-8 sm:grid-cols-3">
          {HIGHLIGHTS.map(({ icon: Icon, title, body }) => (
            <div key={title} className="text-center sm:text-left">
              <div className="mx-auto flex size-11 items-center justify-center rounded-full bg-primary/10 text-primary sm:mx-0">
                <Icon className="size-5" />
              </div>
              <h3 className="mt-4 font-display text-lg font-semibold text-foreground">
                {title}
              </h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Brand lists and vehicle search/catalog */}
      <section id="listings" className="scroll-mt-20 border-t border-border bg-secondary/15">
        <div className="mx-auto max-w-7xl px-6 py-20 pb-28">
          <div className="mb-10 text-center sm:text-left">
            <h2 className="font-display text-3xl font-bold tracking-tight text-foreground">
              Зарагдах автомашинууд
            </h2>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Шүүлтүүр болон брэндээр ангилж харах боломжтой бүх зарын жагсаалт.
            </p>
          </div>

          {/* Brands buttons grid */}
          {filterOptions && brandModelCounts && (
            <div className="mb-10 space-y-6">
              <div>
                <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-4">
                  Брэнд сонгох
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3.5">
                  {filterOptions.brands.map((brand) => {
                    const brandCount = brandModelCounts.brandCounts[brand.id] || 0;
                    const isActive = activeBrandId === brand.id;
                    return (
                      <button
                        key={brand.id}
                        onClick={() => handleBrandSelect(brand.id)}
                        className={cn(
                          "flex items-center justify-between rounded-lg px-4 py-3 text-sm font-semibold border transition-all duration-200 cursor-pointer text-left focus:outline-none focus:ring-2 focus:ring-primary/20",
                          isActive
                            ? "bg-primary text-primary-foreground border-primary shadow-sm hover:bg-primary/95"
                            : "bg-card text-foreground border-border hover:bg-secondary/80 hover:border-muted-foreground/30"
                        )}
                      >
                        <span className="truncate">{brand.name_mn}</span>
                        <span className={cn(
                          "ml-2 text-xs font-bold px-2 py-0.5 rounded-full shrink-0",
                          isActive ? "bg-primary-foreground/20 text-primary-foreground" : "bg-secondary text-muted-foreground"
                        )}>
                          {brandCount}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Models selection buttons */}
              {activeBrandId && modelsForActiveBrand.length > 0 && (
                <div className="p-5 rounded-xl bg-card border border-border shadow-sm space-y-3">
                  <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    {activeBrand?.name_mn} загвар сонгох:
                  </h4>
                  <div className="flex flex-wrap gap-2.5">
                    {modelsForActiveBrand.map((model) => {
                      const modelCount = brandModelCounts.modelCounts[model.id] || 0;
                      const isActive = activeModelId === model.id;
                      return (
                        <button
                          key={model.id}
                          onClick={() => handleModelSelect(model.id)}
                          className={cn(
                            "flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold border transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/20",
                            isActive
                              ? "bg-primary text-primary-foreground border-primary shadow-sm"
                              : "bg-secondary/40 text-foreground border-border hover:bg-secondary"
                          )}
                        >
                          <span>{model.name_mn}</span>
                          <span className={cn(
                            "text-[10px] font-extrabold",
                            isActive ? "text-primary-foreground/90" : "text-muted-foreground"
                          )}>
                            ({modelCount})
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Control Bar (View as, Filter trigger, Sort, Total Count) */}
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-t border-b border-border py-5 bg-card/40 px-5 rounded-lg">
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setViewMode((m) => (m === "grid" ? "list" : "grid"))}
                className="flex items-center gap-2 cursor-pointer font-semibold text-xs h-9"
              >
                {viewMode === "grid" ? (
                  <>
                    <List className="size-4 text-muted-foreground" />
                    <span>Жагсаалтаар харах</span>
                  </>
                ) : (
                  <>
                    <LayoutGrid className="size-4 text-muted-foreground" />
                    <span>Сүлжээгээр харах</span>
                  </>
                )}
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters((s) => !s)}
                className={cn(
                  "flex items-center gap-2 cursor-pointer font-semibold text-xs h-9 transition-colors",
                  showFilters && "bg-secondary text-foreground border-muted-foreground/30 hover:bg-secondary/90"
                )}
              >
                <SlidersHorizontal className="size-4 text-muted-foreground" />
                <span>Шүүлтүүр</span>
              </Button>
            </div>

            <div className="flex items-center justify-between sm:justify-end gap-6">
              <span className="text-sm font-semibold text-muted-foreground font-mono">
                Олдсон: {totalVehicles} автомашин
              </span>
              <SortSelect />
            </div>
          </div>

          {/* Sidebar and Grid/List view */}
          <div className="grid gap-8 lg:grid-cols-[auto_1fr] items-start">
            {showFilters && filterOptions && (
              <div className="w-full lg:w-64 shrink-0 bg-card rounded-xl border border-border p-6 shadow-sm">
                <FilterSidebar options={filterOptions} />
              </div>
            )}

            <div className="flex-1 min-w-0">
              {vehicles.length > 0 ? (
                <div className="space-y-8">
                  {viewMode === "grid" ? (
                    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                      {vehicles.map((vehicle) => (
                        <VehicleCard key={vehicle.id} vehicle={vehicle} />
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col gap-5.5">
                      {vehicles.map((vehicle) => (
                        <VehicleListRow key={vehicle.id} vehicle={vehicle} />
                      ))}
                    </div>
                  )}

                  <InventoryPagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    searchParams={searchParams}
                  />
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-24 text-center bg-card shadow-sm">
                  <p className="font-semibold text-lg text-foreground">Тохирох автомашин олдсонгүй</p>
                  <p className="mt-2 max-w-sm text-sm text-muted-foreground">
                    Шүүлтийн нөхцөлүүдийг өөрчлөх эсвэл цэвэрлэж дахин үзнэ үү.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
