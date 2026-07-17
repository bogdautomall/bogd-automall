"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  SlidersHorizontal, LayoutGrid, List, Columns,
  Search, X, RotateCcw, ShieldCheck, MapPin, Gauge, Fuel, Car, ChevronDown, Check
} from "lucide-react";

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
import {
  Dialog,
  DialogTrigger,
  DialogContent,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { VehicleCard } from "@/components/vehicle-card";
import { useLanguage } from "@/lib/i18n/language-context";
import { cn } from "@/lib/utils";
import type { Vehicle } from "@/types/vehicle";
import type { FilterOptions } from "@/lib/queries/vehicles";

const ALL = "all";
const ITEMS_PER_PAGE = 12;

interface ClientFilters {
  brandId: string;
  modelId: string;
  fuelTypeId: string;
  transmissionId: string;
  driveTypeId: string;
  bodyTypeId: string;
  minYear: string;
  maxYear: string;
  minPrice: string;
  maxPrice: string;
  minMileage: string;
  maxMileage: string;
  importedMinYear: string;
  importedMaxYear: string;
  steeringPosition: string;
  engineType: string;
  minEngineSize: string;
  maxEngineSize: string;
  colorId: string;
  availability: string;
  condition: string;
  featuredOnly: boolean;
  search: string;
  sort: string;
}

export function HomeContent({
  featured = [],
  vehicles = [],
  filterOptions,
  searchParams: initialSearchParams,
}: {
  featured?: Vehicle[];
  vehicles?: Vehicle[];
  filterOptions?: FilterOptions;
  searchParams?: Record<string, string | undefined>;
}) {
  const { locale, t } = useLanguage();
  const searchParams = useSearchParams();
  const router = useRouter();

  // 1. Initial State from Search Params
  const getInitialFilters = (): ClientFilters => {
    const get = (key: string) => {
      if (initialSearchParams && initialSearchParams[key] !== undefined) {
        return initialSearchParams[key];
      }
      return searchParams ? searchParams.get(key) : null;
    };
    return {
      brandId: get("brand") || "",
      modelId: get("model") || "",
      fuelTypeId: get("fuel") || "",
      transmissionId: get("transmission") || "",
      driveTypeId: get("drive") || "",
      bodyTypeId: get("body") || "",
      minYear: get("minYear") || "",
      maxYear: get("maxYear") || "",
      minPrice: get("minPrice") || "",
      maxPrice: get("maxPrice") || "",
      minMileage: get("minMileage") || "",
      maxMileage: get("maxMileage") || "",
      importedMinYear: get("importedMinYear") || "",
      importedMaxYear: get("importedMaxYear") || "",
      steeringPosition: get("steering") || "all",
      engineType: get("engineType") || "",
      minEngineSize: get("minEngineSize") || "",
      maxEngineSize: get("maxEngineSize") || "",
      colorId: get("color") || "",
      availability: get("availability") || "all",
      condition: get("condition") || "all",
      featuredOnly: get("featured") === "true",
      search: get("search") || "",
      sort: get("sort") || "newest",
    };
  };

  const [filters, setFilters] = React.useState<ClientFilters>(getInitialFilters);
  const [viewMode, setViewMode] = React.useState<"grid" | "compact" | "list">("grid");
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);
  const [currentPage, setCurrentPage] = React.useState(1);

  // Sync state with search params if URL changes externally
  React.useEffect(() => {
    setFilters(getInitialFilters());
  }, [searchParams]);

  // Update URL query parameters on filter changes without full-page reloads
  const updateUrlParams = (updatedFilters: ClientFilters) => {
    const params = new URLSearchParams();
    if (updatedFilters.brandId) params.set("brand", updatedFilters.brandId);
    if (updatedFilters.modelId) params.set("model", updatedFilters.modelId);
    if (updatedFilters.fuelTypeId) params.set("fuel", updatedFilters.fuelTypeId);
    if (updatedFilters.transmissionId) params.set("transmission", updatedFilters.transmissionId);
    if (updatedFilters.driveTypeId) params.set("drive", updatedFilters.driveTypeId);
    if (updatedFilters.bodyTypeId) params.set("body", updatedFilters.bodyTypeId);
    if (updatedFilters.minYear) params.set("minYear", updatedFilters.minYear);
    if (updatedFilters.maxYear) params.set("maxYear", updatedFilters.maxYear);
    if (updatedFilters.minPrice) params.set("minPrice", updatedFilters.minPrice);
    if (updatedFilters.maxPrice) params.set("maxPrice", updatedFilters.maxPrice);
    if (updatedFilters.minMileage) params.set("minMileage", updatedFilters.minMileage);
    if (updatedFilters.maxMileage) params.set("maxMileage", updatedFilters.maxMileage);
    if (updatedFilters.importedMinYear) params.set("importedMinYear", updatedFilters.importedMinYear);
    if (updatedFilters.importedMaxYear) params.set("importedMaxYear", updatedFilters.importedMaxYear);
    if (updatedFilters.steeringPosition !== "all") params.set("steering", updatedFilters.steeringPosition);
    if (updatedFilters.engineType) params.set("engineType", updatedFilters.engineType);
    if (updatedFilters.minEngineSize) params.set("minEngineSize", updatedFilters.minEngineSize);
    if (updatedFilters.maxEngineSize) params.set("maxEngineSize", updatedFilters.maxEngineSize);
    if (updatedFilters.colorId) params.set("color", updatedFilters.colorId);
    if (updatedFilters.availability !== "all") params.set("availability", updatedFilters.availability);
    if (updatedFilters.condition !== "all") params.set("condition", updatedFilters.condition);
    if (updatedFilters.featuredOnly) params.set("featured", "true");
    if (updatedFilters.search) params.set("search", updatedFilters.search);
    if (updatedFilters.sort !== "newest") params.set("sort", updatedFilters.sort);

    const oldUrl = window.location.search;
    const newUrlParams = params.toString();
    const newUrl = `${window.location.pathname}${newUrlParams ? `?${newUrlParams}` : ""}`;

    if (oldUrl !== `?${newUrlParams}`) {
      window.history.replaceState({ ...window.history.state, as: newUrl, url: newUrl }, "", newUrl);
    }
  };

  // Helper to update a filter item
  const setFilterItem = <K extends keyof ClientFilters>(key: K, value: ClientFilters[K]) => {
    setFilters((prev) => {
      const next = { ...prev, [key]: value };
      // Cascading logic: reset model if brand changes
      if (key === "brandId" && value !== prev.brandId) {
        next.modelId = "";
      }
      updateUrlParams(next);
      return next;
    });
    setCurrentPage(1);
  };

  const handleClearAll = () => {
    const empty: ClientFilters = {
      brandId: "",
      modelId: "",
      fuelTypeId: "",
      transmissionId: "",
      driveTypeId: "",
      bodyTypeId: "",
      minYear: "",
      maxYear: "",
      minPrice: "",
      maxPrice: "",
      minMileage: "",
      maxMileage: "",
      importedMinYear: "",
      importedMaxYear: "",
      steeringPosition: "all",
      engineType: "",
      minEngineSize: "",
      maxEngineSize: "",
      colorId: "",
      availability: "all",
      condition: "all",
      featuredOnly: false,
      search: "",
      sort: "newest",
    };
    setFilters(empty);
    updateUrlParams(empty);
    setCurrentPage(1);
    setIsDrawerOpen(false);
  };

  // Local translations mapper
  const localT = React.useMemo(() => {
    return {
      mn: {
        quickBrands: "Брэндүүд",
        selectModel: "Загвар сонгох",
        results: "Илэрцүүд",
        viewAs: "Харагдац",
        filters: "Шүүлтүүрүүд",
        clearAll: "Шүүлтүүр цэвэрлэх",
        sortBy: "Эрэмбэлэх",
        foundCount: "Нийт {count} автомашин олдлоо",
        noMatch: "Тохирох автомашин олдсонгүй",
        noMatchSub: "Шүүлтийн нөхцөлийг өөрчлөх эсвэл шүүлтүүрүүдээ цэвэрлэнэ үү.",
        grid: "Grid харагдац",
        compact: "Сүлжээ компакт",
        list: "Жагсаалтаар",
        all: "Бүгд",
        search: "Хайх",
        searchPlaceholder: "Загвар, хөдөлгүүр хайх...",
        left: "Зүүн жолоо",
        right: "Баруун жолоо",
        conditionNew: "Шинэ",
        conditionUsed: "Ашигласан",
        featured: "Онцлох",
        mileage: "Гүйлт",
        year: "Үйлдвэрлэсэн он",
        imported: "Орж ирсэн он",
        price: "Үнэ",
        steering: "Жолооны байрлал",
        availability: "Бэлэн байдал",
        engine: "Хөдөлгүүрийн багтаамж",
        engineType: "Хөдөлгүүр",
        color: "Өнгө",
        closeFilters: "Шүүх",
        transmission: "Хурдны хайрцаг",
        fuel: "Шатахууны төрөл",
        drive: "Хөтлөгч",
        body: "Бүтэц",
        featuredOnly: "Зөвхөн онцлох зарууд",
      },
      en: {
        quickBrands: "Available Brands",
        selectModel: "Select Model",
        results: "Listings",
        viewAs: "View As",
        filters: "Advanced Filters",
        clearAll: "Clear Filters",
        sortBy: "Sorting",
        foundCount: "{count} vehicles matching",
        noMatch: "No Matching Vehicles Found",
        noMatchSub: "Try widening your criteria or clearing parameters.",
        grid: "Grid View",
        compact: "Compact Mode",
        list: "List Row",
        all: "All",
        search: "Search",
        searchPlaceholder: "Search models, engines...",
        left: "Left-Hand Side",
        right: "Right-Hand Side",
        conditionNew: "Unused / Import",
        conditionUsed: "Pre-owned",
        featured: "Featured",
        mileage: "Mileage Limit",
        year: "Model Year",
        imported: "Imported Year",
        price: "Price bounds",
        steering: "Steering Position",
        availability: "Stock Level",
        engine: "Engine Displacement (L)",
        engineType: "Motor/Fuel System",
        color: "Exterior Color",
        closeFilters: "Search Now",
        transmission: "Gearbox Type",
        fuel: "Engine Fuel",
        drive: "Wheel Drive",
        body: "Body Type",
        featuredOnly: "Promoted Listings Only",
      }
    }[locale === "en" ? "en" : "mn"];
  }, [locale]);

  // Extract dynamically unique engine types of listed vehicles
  const engineTypes = React.useMemo(() => {
    const list = new Set<string>();
    vehicles.forEach((v) => {
      if (v.engine_type?.trim()) {
        list.add(v.engine_type.trim());
      }
    });
    return Array.from(list).sort();
  }, [vehicles]);

  // Calculate faceted counts dynamically
  const brandCounts = React.useMemo(() => {
    const counts: Record<string, number> = {};
    vehicles.forEach((v) => {
      const match =
        (!filters.fuelTypeId || v.fuel_type?.id === filters.fuelTypeId) &&
        (!filters.transmissionId || v.transmission?.id === filters.transmissionId) &&
        (!filters.driveTypeId || v.drive_type?.id === filters.driveTypeId) &&
        (!filters.bodyTypeId || v.body_type?.id === filters.bodyTypeId) &&
        (!filters.minYear || v.manufacturing_year >= parseInt(filters.minYear)) &&
        (!filters.maxYear || v.manufacturing_year <= parseInt(filters.maxYear)) &&
        (!filters.importedMinYear || (v.import_year && v.import_year >= parseInt(filters.importedMinYear))) &&
        (!filters.importedMaxYear || (v.import_year && v.import_year <= parseInt(filters.importedMaxYear))) &&
        (!filters.minPrice || v.price >= parseFloat(filters.minPrice)) &&
        (!filters.maxPrice || v.price <= parseFloat(filters.maxPrice)) &&
        (!filters.minMileage || (v.mileage !== null && v.mileage >= parseInt(filters.minMileage))) &&
        (!filters.maxMileage || (v.mileage !== null && v.mileage <= parseInt(filters.maxMileage))) &&
        (filters.steeringPosition === "all" || v.steering_position === filters.steeringPosition) &&
        (!filters.engineType || v.engine_type === filters.engineType) &&
        (!filters.minEngineSize || (v.engine_size !== null && v.engine_size >= parseFloat(filters.minEngineSize))) &&
        (!filters.maxEngineSize || (v.engine_size !== null && v.engine_size <= parseFloat(filters.maxEngineSize))) &&
        (!filters.colorId || v.exterior_color?.id === filters.colorId) &&
        (filters.availability === "all" || v.availability_status === filters.availability) &&
        (filters.condition === "all" || (filters.condition === "new" ? (v.mileage || 0) <= 100 : (v.mileage || 0) > 100)) &&
        (!filters.featuredOnly || v.is_featured) &&
        (!filters.search ||
          v.brand.name_en.toLowerCase().includes(filters.search.toLowerCase()) ||
          v.brand.name_mn.toLowerCase().includes(filters.search.toLowerCase()) ||
          v.model.name_en.toLowerCase().includes(filters.search.toLowerCase()) ||
          v.model.name_mn.toLowerCase().includes(filters.search.toLowerCase())
        );
      if (match) {
        counts[v.brand.id] = (counts[v.brand.id] || 0) + 1;
      }
    });
    return counts;
  }, [vehicles, filters]);

  const modelCounts = React.useMemo(() => {
    const counts: Record<string, number> = {};
    vehicles.forEach((v) => {
      const match =
        (!filters.brandId || v.brand.id === filters.brandId) &&
        (!filters.fuelTypeId || v.fuel_type?.id === filters.fuelTypeId) &&
        (!filters.transmissionId || v.transmission?.id === filters.transmissionId) &&
        (!filters.driveTypeId || v.drive_type?.id === filters.driveTypeId) &&
        (!filters.bodyTypeId || v.body_type?.id === filters.bodyTypeId) &&
        (!filters.minYear || v.manufacturing_year >= parseInt(filters.minYear)) &&
        (!filters.maxYear || v.manufacturing_year <= parseInt(filters.maxYear)) &&
        (!filters.importedMinYear || (v.import_year && v.import_year >= parseInt(filters.importedMinYear))) &&
        (!filters.importedMaxYear || (v.import_year && v.import_year <= parseInt(filters.importedMaxYear))) &&
        (!filters.minPrice || v.price >= parseFloat(filters.minPrice)) &&
        (!filters.maxPrice || v.price <= parseFloat(filters.maxPrice)) &&
        (!filters.minMileage || (v.mileage !== null && v.mileage >= parseInt(filters.minMileage))) &&
        (!filters.maxMileage || (v.mileage !== null && v.mileage <= parseInt(filters.maxMileage))) &&
        (filters.steeringPosition === "all" || v.steering_position === filters.steeringPosition) &&
        (!filters.engineType || v.engine_type === filters.engineType) &&
        (!filters.minEngineSize || (v.engine_size !== null && v.engine_size >= parseFloat(filters.minEngineSize))) &&
        (!filters.maxEngineSize || (v.engine_size !== null && v.engine_size <= parseFloat(filters.maxEngineSize))) &&
        (!filters.colorId || v.exterior_color?.id === filters.colorId) &&
        (filters.availability === "all" || v.availability_status === filters.availability) &&
        (filters.condition === "all" || (filters.condition === "new" ? (v.mileage || 0) <= 100 : (v.mileage || 0) > 100)) &&
        (!filters.featuredOnly || v.is_featured) &&
        (!filters.search ||
          v.brand.name_en.toLowerCase().includes(filters.search.toLowerCase()) ||
          v.brand.name_mn.toLowerCase().includes(filters.search.toLowerCase()) ||
          v.model.name_en.toLowerCase().includes(filters.search.toLowerCase()) ||
          v.model.name_mn.toLowerCase().includes(filters.search.toLowerCase())
        );
      if (match) {
        counts[v.model.id] = (counts[v.model.id] || 0) + 1;
      }
    });
    return counts;
  }, [vehicles, filters]);

  // Sort brands/models by available counts descending (Encar pattern)
  const sortedBrands = React.useMemo(() => {
    if (!filterOptions?.brands) return [];
    return [...filterOptions.brands].sort((a, b) => {
      const countA = brandCounts[a.id] || 0;
      const countB = brandCounts[b.id] || 0;
      if (countB !== countA) return countB - countA;
      return a.name_en.localeCompare(b.name_en);
    });
  }, [filterOptions?.brands, brandCounts]);

  const sortedModels = React.useMemo(() => {
    if (!filters.brandId || !filterOptions?.models) return [];
    const filtered = filterOptions.models.filter((m) => m.brand_id === filters.brandId);
    return filtered.sort((a, b) => {
      const countA = modelCounts[a.id] || 0;
      const countB = modelCounts[b.id] || 0;
      if (countB !== countA) return countB - countA;
      return a.name_en.localeCompare(b.name_en);
    });
  }, [filters.brandId, filterOptions?.models, modelCounts]);

  // Get matching filtered and sorted list
  const filteredVehicles = React.useMemo(() => {
    let result = vehicles.filter((v) => {
      if (filters.brandId && v.brand.id !== filters.brandId) return false;
      if (filters.modelId && v.model.id !== filters.modelId) return false;
      if (filters.fuelTypeId && v.fuel_type?.id !== filters.fuelTypeId) return false;
      if (filters.transmissionId && v.transmission?.id !== filters.transmissionId) return false;
      if (filters.driveTypeId && v.drive_type?.id !== filters.driveTypeId) return false;
      if (filters.bodyTypeId && v.body_type?.id !== filters.bodyTypeId) return false;
      if (filters.minYear && v.manufacturing_year < parseInt(filters.minYear)) return false;
      if (filters.maxYear && v.manufacturing_year > parseInt(filters.maxYear)) return false;
      if (filters.importedMinYear && (!v.import_year || v.import_year < parseInt(filters.importedMinYear))) return false;
      if (filters.importedMaxYear && (!v.import_year || v.import_year > parseInt(filters.importedMaxYear))) return false;
      if (filters.minPrice && v.price < parseFloat(filters.minPrice)) return false;
      if (filters.maxPrice && v.price > parseFloat(filters.maxPrice)) return false;
      if (filters.minMileage && (v.mileage === null || v.mileage < parseInt(filters.minMileage))) return false;
      if (filters.maxMileage && (v.mileage === null || v.mileage > parseInt(filters.maxMileage))) return false;
      if (filters.steeringPosition !== "all" && v.steering_position !== filters.steeringPosition) return false;
      if (filters.engineType && v.engine_type !== filters.engineType) return false;
      if (filters.minEngineSize && (v.engine_size === null || v.engine_size < parseFloat(filters.minEngineSize))) return false;
      if (filters.maxEngineSize && (v.engine_size === null || v.engine_size > parseFloat(filters.maxEngineSize))) return false;
      if (filters.colorId && v.exterior_color?.id !== filters.colorId) return false;
      if (filters.availability !== "all" && v.availability_status !== filters.availability) return false;
      if (filters.condition !== "all") {
        const mileageVal = v.mileage || 0;
        if (filters.condition === "new" && mileageVal > 100) return false;
        if (filters.condition === "used" && mileageVal <= 100) return false;
      }
      if (filters.featuredOnly && !v.is_featured) return false;
      if (filters.search) {
        const query = filters.search.toLowerCase();
        const brandMatch = v.brand.name_mn.toLowerCase().includes(query) || v.brand.name_en.toLowerCase().includes(query);
        const modelMatch = v.model.name_mn.toLowerCase().includes(query) || v.model.name_en.toLowerCase().includes(query);
        const engineMatch = v.engine_type?.toLowerCase().includes(query);
        if (!brandMatch && !modelMatch && !engineMatch) return false;
      }
      return true;
    });

    // Sorting
    return [...result].sort((a, b) => {
      switch (filters.sort) {
        case "price_asc":
          return a.price - b.price;
        case "price_desc":
          return b.price - a.price;
        case "year_desc":
          return b.manufacturing_year - a.manufacturing_year;
        case "mileage_asc":
          return (a.mileage || 0) - (b.mileage || 0);
        case "newest":
        default:
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
    });
  }, [vehicles, filters]);

  // Client pagination
  const totalPages = Math.max(1, Math.ceil(filteredVehicles.length / ITEMS_PER_PAGE));
  const paginatedVehicles = React.useMemo(() => {
    const from = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredVehicles.slice(from, from + ITEMS_PER_PAGE);
  }, [filteredVehicles, currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    const element = document.getElementById("vehicle-listings-head");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const activeBrandObj = filterOptions?.brands.find((b) => b.id === filters.brandId);
  const activeModelObj = filterOptions?.models.find((m) => m.id === filters.modelId);

  return (
    <main className="min-h-screen bg-background">
      {/* Brand list (Section 1) */}
      <section className="border-b border-border bg-card/60 backdrop-blur-xs py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
              {localT.quickBrands}
            </h2>
            {filters.brandId && (
              <button
                onClick={() => setFilters(prev => {
                  const next = { ...prev, brandId: "", modelId: "" };
                  updateUrlParams(next);
                  return next;
                })}
                className="text-xs font-semibold text-[#B9860B] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="size-3.5" />
                {locale === "en" ? "Clear Select" : "Сонголтыг цуцлах"}
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-x-6 gap-y-2.5">
            {sortedBrands.map((brand) => {
              const name = locale === "en" ? brand.name_en : brand.name_mn;
              const count = brandCounts[brand.id] || 0;
              const isActive = filters.brandId === brand.id;

              return (
                <button
                  key={brand.id}
                  onClick={() => {
                    if (isActive) {
                      setFilterItem("brandId", "");
                    } else {
                      setFilterItem("brandId", brand.id);
                    }
                  }}
                  className={cn(
                    "flex items-center w-full group py-2 px-3 rounded-lg transition-all duration-200 text-xs font-bold text-left cursor-pointer",
                    isActive
                      ? "text-white bg-[#B9860B] hover:bg-[#B9860B]/90 shadow-xs"
                      : "text-foreground/80 hover:text-foreground hover:bg-secondary/60 border border-transparent hover:border-border"
                  )}
                >
                  <span className="truncate">{name}</span>
                  <span className={cn(
                    "flex-1 border-b border-dotted mx-2 self-end mb-1",
                    isActive ? "border-white/30" : "border-muted-foreground/30"
                  )}></span>
                  <span className={cn(
                    "font-mono font-black",
                    isActive ? "text-white" : "text-muted-foreground group-hover:text-foreground"
                  )}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Model Selection (Section 2) */}
      {filters.brandId && activeBrandObj && sortedModels.length > 0 && (
        <section className="border-b border-border bg-[#F7F5F1]/40 py-6 animate-in fade-in duration-300">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#B9860B] mb-4">
              {locale === "en" ? activeBrandObj.name_en : activeBrandObj.name_mn} — {localT.selectModel}
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-x-6 gap-y-2">
              {sortedModels.map((model) => {
                const name = locale === "en" ? model.name_en : model.name_mn;
                const count = modelCounts[model.id] || 0;
                const isActive = filters.modelId === model.id;

                return (
                  <button
                    key={model.id}
                    onClick={() => {
                      if (isActive) {
                        setFilterItem("modelId", "");
                      } else {
                        setFilterItem("modelId", model.id);
                      }
                    }}
                    className={cn(
                      "flex items-center w-full group py-1.5 px-2.5 rounded-md transition-all duration-200 text-xs font-semibold text-left cursor-pointer",
                      isActive
                        ? "text-[#B9860B] bg-[#B9860B]/10 font-bold border border-[#B9860B]/20"
                        : "text-foreground/80 hover:text-foreground hover:bg-secondary/40 border border-transparent"
                    )}
                  >
                    <span className="truncate">{name}</span>
                    <span className="flex-1 border-b border-dotted border-muted-foreground/20 mx-2 self-end mb-1"></span>
                    <span className={cn(
                      "font-mono font-bold",
                      isActive ? "text-[#B9860B]" : "text-muted-foreground group-hover:text-foreground"
                    )}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Advanced Drawer & Vehicle Grid listings (Section 3) */}
      <section id="vehicle-listings-head" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">

        {/* Title, Search & Filter row */}
        <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="font-display text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
              {locale === "en" ? "Catalog Directory" : "Худалдах автомашинууд"}
            </h2>
            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1.5">
              <span>{localT.foundCount.replace("{count}", String(filteredVehicles.length))}</span>
              {filters.brandId && (
                <>
                  <span className="text-muted-foreground/45">•</span>
                  <span className="text-[#B9860B] font-bold">{locale === "en" ? activeBrandObj?.name_en : activeBrandObj?.name_mn}</span>
                </>
              )}
              {filters.modelId && (
                <>
                  <span className="text-muted-foreground/45">•</span>
                  <span className="text-[#B9860B] font-bold">{locale === "en" ? activeModelObj?.name_en : activeModelObj?.name_mn}</span>
                </>
              )}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative flex-1 md:w-64 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder={localT.searchPlaceholder}
                className="pl-9 pr-8"
                value={filters.search}
                onChange={(e) => setFilterItem("search", e.target.value)}
              />
              {filters.search && (
                <button
                  onClick={() => setFilterItem("search", "")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  <X className="size-4" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Filters control bar */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-t border-b border-border py-4 bg-card/20 px-4 rounded-xl">
          <div className="flex items-center gap-3">
            {/* View options selectors */}
            <div className="flex items-center border border-border rounded-lg bg-card overflow-hidden h-9">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setViewMode("grid")}
                className={cn("size-9 rounded-none cursor-pointer", viewMode === "grid" ? "bg-secondary text-[#B9860B]" : "text-muted-foreground")}
                aria-label={localT.grid}
              >
                <LayoutGrid className="size-4.5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setViewMode("compact")}
                className={cn("size-9 rounded-none cursor-pointer", viewMode === "compact" ? "bg-secondary text-[#B9860B]" : "text-muted-foreground")}
                aria-label={localT.compact}
              >
                <Columns className="size-4.5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setViewMode("list")}
                className={cn("size-9 rounded-none cursor-pointer", viewMode === "list" ? "bg-secondary text-[#B9860B]" : "text-muted-foreground")}
                aria-label={localT.list}
              >
                <List className="size-4.5" />
              </Button>
            </div>

            {/* Dialog panel toggle */}
            <Dialog open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className={cn(
                    "flex items-center gap-2 cursor-pointer font-bold text-xs h-9 transition-colors",
                    isDrawerOpen && "bg-secondary border-muted-foreground/30 text-foreground"
                  )}
                >
                  <SlidersHorizontal className="size-4 text-[#B9860B]" />
                  <span>{localT.filters}</span>
                </Button>
              </DialogTrigger>

              {/* Filter drawer box content */}
              <DialogContent className="fixed right-0 top-0 bottom-0 h-full w-full sm:max-w-md bg-background border-l shadow-2xl p-0 flex flex-col translate-x-0 rounded-none z-50 animate-in slide-in-from-right duration-350">
                <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-card">
                  <h3 className="font-display text-lg font-bold text-foreground flex items-center gap-2">
                    <SlidersHorizontal className="size-5 text-[#B9860B]" />
                    {localT.filters}
                  </h3>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={handleClearAll}
                      className="text-xs font-semibold text-muted-foreground hover:text-foreground flex items-center gap-1 cursor-pointer"
                    >
                      <RotateCcw className="size-3" />
                      {locale === "en" ? "Reset" : "Цэвэрлэх"}
                    </button>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-6 focus:outline-none">
                  {/* Brand select */}
                  <div>
                    <Label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-muted-foreground">{localT.transmission} & {localT.fuel}</Label>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label className="text-[10px] text-muted-foreground font-semibold mb-1 block">{localT.transmission}</Label>
                        <Select
                          value={filters.transmissionId || ALL}
                          onValueChange={(v) => setFilterItem("transmissionId", v === ALL ? "" : v)}
                        >
                          <SelectTrigger className="h-9 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value={ALL}>{localT.all}</SelectItem>
                            {filterOptions?.transmissionTypes.map((t) => (
                              <SelectItem key={t.id} value={t.id} className="text-xs">
                                {locale === "en" ? t.name_en : t.name_mn}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label className="text-[10px] text-muted-foreground font-semibold mb-1 block">{localT.fuel}</Label>
                        <Select
                          value={filters.fuelTypeId || ALL}
                          onValueChange={(v) => setFilterItem("fuelTypeId", v === ALL ? "" : v)}
                        >
                          <SelectTrigger className="h-9 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value={ALL}>{localT.all}</SelectItem>
                            {filterOptions?.fuelTypes.map((f) => (
                              <SelectItem key={f.id} value={f.id} className="text-xs">
                                {locale === "en" ? f.name_en : f.name_mn}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  {/* Drive & Body Types */}
                  <div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider mb-1 block">{localT.drive}</Label>
                        <Select
                          value={filters.driveTypeId || ALL}
                          onValueChange={(v) => setFilterItem("driveTypeId", v === ALL ? "" : v)}
                        >
                          <SelectTrigger className="h-9 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value={ALL}>{localT.all}</SelectItem>
                            {filterOptions?.driveTypes.map((d) => (
                              <SelectItem key={d.id} value={d.id} className="text-xs">
                                {locale === "en" ? d.name_en : d.name_mn}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider mb-1 block">{localT.body}</Label>
                        <Select
                          value={filters.bodyTypeId || ALL}
                          onValueChange={(v) => setFilterItem("bodyTypeId", v === ALL ? "" : v)}
                        >
                          <SelectTrigger className="h-9 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value={ALL}>{localT.all}</SelectItem>
                            {filterOptions?.bodyTypes.map((b) => (
                              <SelectItem key={b.id} value={b.id} className="text-xs">
                                {locale === "en" ? b.name_en : b.name_mn}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  {/* Manufacture Year */}
                  <div>
                    <Label className="mb-1 text-xs font-bold uppercase tracking-wider text-muted-foreground">{localT.year}</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        placeholder="Min"
                        className="h-9 text-xs"
                        value={filters.minYear}
                        onChange={(e) => setFilterItem("minYear", e.target.value)}
                      />
                      <span className="text-muted-foreground text-xs">—</span>
                      <Input
                        type="number"
                        placeholder="Max"
                        className="h-9 text-xs"
                        value={filters.maxYear}
                        onChange={(e) => setFilterItem("maxYear", e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Imported Year */}
                  <div>
                    <Label className="mb-1 text-xs font-bold uppercase tracking-wider text-muted-foreground">{localT.imported}</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        placeholder="Min"
                        className="h-9 text-xs"
                        value={filters.importedMinYear}
                        onChange={(e) => setFilterItem("importedMinYear", e.target.value)}
                      />
                      <span className="text-muted-foreground text-xs">—</span>
                      <Input
                        type="number"
                        placeholder="Max"
                        className="h-9 text-xs"
                        value={filters.importedMaxYear}
                        onChange={(e) => setFilterItem("importedMaxYear", e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Mileage */}
                  <div>
                    <Label className="mb-1 text-xs font-bold uppercase tracking-wider text-muted-foreground">{localT.mileage} (km)</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        placeholder="Min km"
                        className="h-9 text-xs"
                        value={filters.minMileage}
                        onChange={(e) => setFilterItem("minMileage", e.target.value)}
                      />
                      <span className="text-muted-foreground text-xs">—</span>
                      <Input
                        type="number"
                        placeholder="Max km"
                        className="h-9 text-xs"
                        value={filters.maxMileage}
                        onChange={(e) => setFilterItem("maxMileage", e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Engine capacity (Engine size) */}
                  <div>
                    <Label className="mb-1 text-xs font-bold uppercase tracking-wider text-muted-foreground">{localT.engine} (L)</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        step="0.1"
                        placeholder="Min L"
                        className="h-9 text-xs"
                        value={filters.minEngineSize}
                        onChange={(e) => setFilterItem("minEngineSize", e.target.value)}
                      />
                      <span className="text-muted-foreground text-xs">—</span>
                      <Input
                        type="number"
                        step="0.1"
                        placeholder="Max L"
                        className="h-9 text-xs"
                        value={filters.maxEngineSize}
                        onChange={(e) => setFilterItem("maxEngineSize", e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Specific engine type selector listing */}
                  {engineTypes.length > 0 && (
                    <div>
                      <Label className="mb-1 text-xs font-bold uppercase tracking-wider text-muted-foreground">{localT.engineType}</Label>
                      <Select
                        value={filters.engineType || ALL}
                        onValueChange={(v) => setFilterItem("engineType", v === ALL ? "" : v)}
                      >
                        <SelectTrigger className="h-9 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={ALL}>{localT.all}</SelectItem>
                          {engineTypes.map((type) => (
                            <SelectItem key={type} value={type} className="text-xs">
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {/* Exterior color searcher grid */}
                  {filterOptions?.colors && filterOptions.colors.length > 0 && (
                    <div>
                      <Label className="mb-1 text-xs font-bold uppercase tracking-wider text-muted-foreground">{localT.color}</Label>
                      <Select
                        value={filters.colorId || ALL}
                        onValueChange={(v) => setFilterItem("colorId", v === ALL ? "" : v)}
                      >
                        <SelectTrigger className="h-9 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={ALL}>{localT.all}</SelectItem>
                          {filterOptions.colors.map((c) => (
                            <SelectItem key={c.id} value={c.id} className="text-xs">
                              <div className="flex items-center gap-2">
                                <span
                                  className="size-3.5 rounded-full border border-border/80 shrink-0"
                                  style={{ backgroundColor: c.hex_code ?? "#FFFFFF" }}
                                />
                                <span>{locale === "en" ? c.name_en : c.name_mn}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {/* Pricing Ranges */}
                  <div>
                    <Label className="mb-1 text-xs font-bold uppercase tracking-wider text-muted-foreground">{localT.price} (₮)</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        placeholder="Min ₮"
                        className="h-9 text-xs"
                        value={filters.minPrice}
                        onChange={(e) => setFilterItem("minPrice", e.target.value)}
                      />
                      <span className="text-muted-foreground text-xs">—</span>
                      <Input
                        type="number"
                        placeholder="Max ₮"
                        className="h-9 text-xs"
                        value={filters.maxPrice}
                        onChange={(e) => setFilterItem("maxPrice", e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Steering, condition, Availability */}
                  <div>
                    <Label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-muted-foreground">{localT.steering} & {localT.availability}</Label>
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <Label className="text-[10px] text-muted-foreground font-semibold mb-1 block">{localT.steering}</Label>
                        <Select
                          value={filters.steeringPosition}
                          onValueChange={(v) => setFilterItem("steeringPosition", v)}
                        >
                          <SelectTrigger className="h-9 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">{localT.all}</SelectItem>
                            <SelectItem value="left">{localT.left}</SelectItem>
                            <SelectItem value="right">{localT.right}</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label className="text-[10px] text-muted-foreground font-semibold mb-1 block">{locale === "en" ? "Condition" : "Нөхцөл"}</Label>
                        <Select
                          value={filters.condition}
                          onValueChange={(v) => setFilterItem("condition", v)}
                        >
                          <SelectTrigger className="h-9 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">{localT.all}</SelectItem>
                            <SelectItem value="new">{localT.conditionNew}</SelectItem>
                            <SelectItem value="used">{localT.conditionUsed}</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  {/* Availability Status */}
                  <div>
                    <Label className="mb-1 text-xs font-bold uppercase tracking-wider text-muted-foreground">{localT.availability}</Label>
                    <Select
                      value={filters.availability}
                      onValueChange={(v) => setFilterItem("availability", v)}
                    >
                      <SelectTrigger className="h-9 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">{localT.all}</SelectItem>
                        <SelectItem value="available">{locale === "en" ? "Available" : "Зөвхөн бэлэн"}</SelectItem>
                        <SelectItem value="reserved">{locale === "en" ? "Reserved" : "Захиалгатай"}</SelectItem>
                        <SelectItem value="sold">{locale === "en" ? "Sold out" : "Зарагдсан"}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Featured toggle */}
                  <div className="flex items-center gap-2 pt-2">
                    <Checkbox
                      id="featuredOnly"
                      checked={filters.featuredOnly}
                      onCheckedChange={(checked) => setFilterItem("featuredOnly", checked === true)}
                    />
                    <Label htmlFor="featuredOnly" className="text-xs font-bold text-foreground cursor-pointer select-none">
                      {localT.featuredOnly}
                    </Label>
                  </div>
                </div>

                <div className="p-4 border-t border-border bg-card flex gap-3">
                  <Button
                    onClick={handleClearAll}
                    variant="outline"
                    className="flex-1 cursor-pointer h-10 font-semibold"
                  >
                    {locale === "en" ? "Reset All" : "Цэвэрлэх"}
                  </Button>
                  <Button
                    onClick={() => setIsDrawerOpen(false)}
                    className="flex-1 bg-[#B9860B] hover:bg-[#B9860B]/90 text-white font-bold h-10 cursor-pointer"
                  >
                    {localT.closeFilters}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Sorting selection and count */}
          <div className="flex items-center justify-between sm:justify-end gap-5">
            <span className="text-xs font-bold text-muted-foreground font-mono">
              {filteredVehicles.length} {locale === "en" ? "matching" : "машин"}
            </span>

            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground font-bold shrink-0 hidden md:inline">{localT.sortBy}:</span>
              <Select
                value={filters.sort}
                onValueChange={(v) => setFilterItem("sort", v)}
              >
                <SelectTrigger className="h-9 text-xs w-[180px] bg-card">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest" className="text-xs">{locale === "en" ? "Newest First" : "Шинэ нь эхэндээ"}</SelectItem>
                  <SelectItem value="price_asc" className="text-xs">{locale === "en" ? "Price: Low to High" : "Үнэ: Багаас их рүү"}</SelectItem>
                  <SelectItem value="price_desc" className="text-xs">{locale === "en" ? "Price: High to Low" : "Үнэ: Ихээс бага руу"}</SelectItem>
                  <SelectItem value="year_desc" className="text-xs">{locale === "en" ? "Model Year: New to Old" : "Он: Шинэ нь эхэндээ"}</SelectItem>
                  <SelectItem value="mileage_asc" className="text-xs">{locale === "en" ? "Mileage: Low to High" : "Гүйлт: Багаас их рүү"}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Selected parameters badges */}
        {Object.entries(filters).some(([key, val]) => {
          if (key === "sort" || key === "steeringPosition" || key === "availability" || key === "condition") return false;
          if (typeof val === "boolean") return val;
          return val !== "";
        }) && (
            <div className="flex flex-wrap gap-2 mb-6 items-center">
              <span className="text-[10px] font-bold text-muted-foreground uppercase">{locale === "en" ? "Active Filters:" : "Идэвхтэй шүүлтүүр:"}</span>
              {filters.brandId && activeBrandObj && (
                <Badge variant="secondary" className="flex items-center gap-1 text-xs">
                  <span>{locale === "en" ? activeBrandObj.name_en : activeBrandObj.name_mn}</span>
                  <X className="size-3 cursor-pointer text-muted-foreground hover:text-foreground" onClick={() => setFilterItem("brandId", "")} />
                </Badge>
              )}
              {filters.modelId && activeModelObj && (
                <Badge variant="secondary" className="flex items-center gap-1 text-xs">
                  <span>{locale === "en" ? activeModelObj.name_en : activeModelObj.name_mn}</span>
                  <X className="size-3 cursor-pointer text-muted-foreground hover:text-foreground" onClick={() => setFilterItem("modelId", "")} />
                </Badge>
              )}
              {filters.fuelTypeId && (
                <Badge variant="secondary" className="flex items-center gap-1 text-xs">
                  <span>{locale === "en" ? filterOptions?.fuelTypes.find(f => f.id === filters.fuelTypeId)?.name_en : filterOptions?.fuelTypes.find(f => f.id === filters.fuelTypeId)?.name_mn}</span>
                  <X className="size-3 cursor-pointer text-muted-foreground hover:text-foreground" onClick={() => setFilterItem("fuelTypeId", "")} />
                </Badge>
              )}
              {filters.transmissionId && (
                <Badge variant="secondary" className="flex items-center gap-1 text-xs">
                  <span>{locale === "en" ? filterOptions?.transmissionTypes.find(t => t.id === filters.transmissionId)?.name_en : filterOptions?.transmissionTypes.find(t => t.id === filters.transmissionId)?.name_mn}</span>
                  <X className="size-3 cursor-pointer text-muted-foreground hover:text-foreground" onClick={() => setFilterItem("transmissionId", "")} />
                </Badge>
              )}
              {filters.driveTypeId && (
                <Badge variant="secondary" className="flex items-center gap-1 text-xs">
                  <span>{locale === "en" ? filterOptions?.driveTypes.find(d => d.id === filters.driveTypeId)?.name_en : filterOptions?.driveTypes.find(d => d.id === filters.driveTypeId)?.name_mn}</span>
                  <X className="size-3 cursor-pointer text-muted-foreground hover:text-foreground" onClick={() => setFilterItem("driveTypeId", "")} />
                </Badge>
              )}
              {filters.bodyTypeId && (
                <Badge variant="secondary" className="flex items-center gap-1 text-xs">
                  <span>{locale === "en" ? filterOptions?.bodyTypes.find(b => b.id === filters.bodyTypeId)?.name_en : filterOptions?.bodyTypes.find(b => b.id === filters.bodyTypeId)?.name_mn}</span>
                  <X className="size-3 cursor-pointer text-muted-foreground hover:text-foreground" onClick={() => setFilterItem("bodyTypeId", "")} />
                </Badge>
              )}
              {filters.minYear && (
                <Badge variant="secondary" className="flex items-center gap-1 text-xs">
                  <span>{filters.minYear} он хойш</span>
                  <X className="size-3 cursor-pointer text-muted-foreground hover:text-foreground" onClick={() => setFilterItem("minYear", "")} />
                </Badge>
              )}
              {filters.maxYear && (
                <Badge variant="secondary" className="flex items-center gap-1 text-xs">
                  <span>{filters.maxYear} он хүртэл</span>
                  <X className="size-3 cursor-pointer text-muted-foreground hover:text-foreground" onClick={() => setFilterItem("maxYear", "")} />
                </Badge>
              )}
              {filters.minPrice && (
                <Badge variant="secondary" className="flex items-center gap-1 text-xs">
                  <span>&gt;= {filters.minPrice} ₮</span>
                  <X className="size-3 cursor-pointer text-muted-foreground hover:text-foreground" onClick={() => setFilterItem("minPrice", "")} />
                </Badge>
              )}
              {filters.maxPrice && (
                <Badge variant="secondary" className="flex items-center gap-1 text-xs">
                  <span>&lt;= {filters.maxPrice} ₮</span>
                  <X className="size-3 cursor-pointer text-muted-foreground hover:text-foreground" onClick={() => setFilterItem("maxPrice", "")} />
                </Badge>
              )}
              {filters.minMileage && (
                <Badge variant="secondary" className="flex items-center gap-1 text-xs">
                  <span>&gt;= {filters.minMileage} km</span>
                  <X className="size-3 cursor-pointer text-muted-foreground hover:text-foreground" onClick={() => setFilterItem("minMileage", "")} />
                </Badge>
              )}
              {filters.maxMileage && (
                <Badge variant="secondary" className="flex items-center gap-1 text-xs">
                  <span>&lt;= {filters.maxMileage} km</span>
                  <X className="size-3 cursor-pointer text-muted-foreground hover:text-foreground" onClick={() => setFilterItem("maxMileage", "")} />
                </Badge>
              )}
              {filters.featuredOnly && (
                <Badge variant="secondary" className="flex items-center gap-1 text-xs">
                  <span>{localT.featured}</span>
                  <X className="size-3 cursor-pointer text-muted-foreground hover:text-foreground" onClick={() => setFilterItem("featuredOnly", false)} />
                </Badge>
              )}
              {filters.search && (
                <Badge variant="secondary" className="flex items-center gap-1 text-xs">
                  <span>"{filters.search}"</span>
                  <X className="size-3 cursor-pointer text-muted-foreground hover:text-foreground" onClick={() => setFilterItem("search", "")} />
                </Badge>
              )}
              <button
                onClick={handleClearAll}
                className="text-xs font-bold text-[#B9860B] hover:underline cursor-pointer ml-1"
              >
                {localT.clearAll}
              </button>
            </div>
          )}

        {/* Vehicles Listings layouts (Section 3 lists grid) */}
        {paginatedVehicles.length > 0 ? (
          <div className="space-y-10 animate-in fade-in duration-300">
            {viewMode === "grid" && (
              <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4">
                {paginatedVehicles.map((vehicle) => (
                  <VehicleCard key={vehicle.id} vehicle={vehicle} layout="grid" />
                ))}
              </div>
            )}

            {viewMode === "compact" && (
              <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                {paginatedVehicles.map((vehicle) => (
                  <VehicleCard key={vehicle.id} vehicle={vehicle} layout="compact" />
                ))}
              </div>
            )}

            {viewMode === "list" && (
              <div className="flex flex-col gap-5">
                {paginatedVehicles.map((vehicle) => (
                  <VehicleCard key={vehicle.id} vehicle={vehicle} layout="list" />
                ))}
              </div>
            )}

            {/* Client-side layout pagination */}
            {totalPages > 1 && (
              <div className="mt-12 flex items-center justify-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage <= 1}
                  onClick={() => handlePageChange(currentPage - 1)}
                  className="cursor-pointer"
                >
                  {locale === "en" ? "Previous" : "Өмнөх"}
                </Button>

                <span className="px-3.5 py-1.5 rounded-lg bg-secondary text-xs text-muted-foreground font-bold font-mono">
                  {currentPage} / {totalPages}
                </span>

                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage >= totalPages}
                  onClick={() => handlePageChange(currentPage + 1)}
                  className="cursor-pointer"
                >
                  {locale === "en" ? "Next" : "Дараах"}
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-24 text-center bg-card shadow-xs animate-in fade-in duration-350">
            <Car className="size-16 text-muted-foreground/60 mb-4" strokeWidth={1} />
            <h3 className="font-semibold text-lg text-foreground">{localT.noMatch}</h3>
            <p className="mt-2 max-w-sm text-sm text-muted-foreground">
              {localT.noMatchSub}
            </p>
            <Button onClick={handleClearAll} className="mt-5 bg-[#B9860B] hover:bg-[#B9860B]/90 text-white cursor-pointer font-bold">
              {localT.clearAll}
            </Button>
          </div>
        )}
      </section>
    </main>
  );
}
