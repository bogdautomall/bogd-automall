"use client";

import Link from "next/link";
import Image from "next/image";
import { Car, Gauge, Fuel, ShieldCheck, MapPin, Milestone, Settings, Eye } from "lucide-react";
import * as React from "react";

import { Badge } from "@/components/ui/badge";
import { getStorageUrl } from "@/lib/supabase/storage";
import { formatPrice, formatMileage } from "@/lib/format";
import { useLanguage } from "@/lib/i18n/language-context";
import type { Vehicle } from "@/types/vehicle";
import { cn } from "@/lib/utils";

interface VehicleCardProps {
  vehicle: Vehicle;
  layout?: "grid" | "compact" | "list";
}

export function VehicleCard({ vehicle, layout = "grid" }: VehicleCardProps) {
  const { locale, t } = useLanguage();
  const cover = vehicle.vehicle_images?.[0];
  const isSold = vehicle.availability_status === "sold";
  const isReserved = vehicle.availability_status === "reserved";

  // Localized field helpers
  const brandName = locale === "en" ? vehicle.brand.name_en : vehicle.brand.name_mn;
  const modelName = locale === "en" ? vehicle.model.name_en : vehicle.model.name_mn;
  const fuelName = vehicle.fuel_type ? (locale === "en" ? vehicle.fuel_type.name_en : vehicle.fuel_type.name_mn) : "";
  const transmissionName = vehicle.transmission ? (locale === "en" ? vehicle.transmission.name_en : vehicle.transmission.name_mn) : "";
  const driveName = vehicle.drive_type ? (locale === "en" ? vehicle.drive_type.name_en : vehicle.drive_type.name_mn) : "";

  const steeringText = vehicle.steering_position === "left"
    ? (locale === "en" ? "Left" : "Зүүн")
    : vehicle.steering_position === "right"
      ? (locale === "en" ? "Right" : "Баруун")
      : "—";

  const locationText = locale === "en" ? "Ulaanbaatar Yard" : "Улаанбаатар дахь хашаа";

  if (layout === "list") {
    return (
      <Link
        href={`/inventory/${vehicle.slug}`}
        className="group flex flex-col md:flex-row overflow-hidden rounded-xl border border-border bg-card shadow-xs transition-all duration-300 hover:-translate-y-1 hover:shadow-lg active:scale-[0.99] w-full"
      >
        {/* Image holder */}
        <div className="relative aspect-[16/10] md:aspect-auto md:w-80 shrink-0 overflow-hidden bg-secondary">
          {cover ? (
            <Image
              src={getStorageUrl(cover.storage_path)}
              alt={`${brandName} ${modelName}`}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 320px"
              loading="lazy"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-muted-foreground min-h-[200px]">
              <Car className="size-12" strokeWidth={1} />
            </div>
          )}

          {/* Badges */}
          <div className="absolute left-3 top-3 flex flex-col gap-1.5 z-10">
            {vehicle.is_featured && (
              <Badge className="bg-[#B9860B] hover:bg-[#B9860B]/90 text-white font-semibold shadow-sm">
                {locale === "en" ? "Featured" : "Онцлох"}
              </Badge>
            )}
          </div>

          {isSold && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/60 z-20 backdrop-blur-[1px]">
              <Badge variant="destructive" className="px-4 py-1.5 text-xs font-bold uppercase tracking-wider shadow-md">
                {locale === "en" ? "Sold Out" : "Зарагдсан"}
              </Badge>
            </div>
          )}

          {isReserved && !isSold && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 z-20 backdrop-blur-[1px]">
              <Badge variant="secondary" className="bg-amber-500 hover:bg-amber-600 text-white border-none px-4 py-1.5 text-xs font-bold uppercase tracking-wider shadow-md">
                {locale === "en" ? "Reserved" : "Захиалгатай"}
              </Badge>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 p-6 flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 border-b border-border/40 pb-4">
              <div>
                <span className="text-[11px] font-bold text-[#B9860B] uppercase tracking-widest font-mono">
                  {brandName}
                </span>
                <h3 className="font-display text-xl font-bold text-foreground leading-snug group-hover:text-[#B9860B] transition-colors mt-0.5">
                  {brandName} {modelName}
                </h3>
                <p className="mt-1 text-xs text-muted-foreground flex flex-wrap items-center gap-2">
                  <span className="font-semibold text-foreground/80">{vehicle.manufacturing_year} он</span>
                  {vehicle.import_year && (
                    <>
                      <span className="text-border">•</span>
                      <span>{vehicle.import_year} онд орсон</span>
                    </>
                  )}
                  <span className="text-border">•</span>
                  <span className="flex items-center gap-1">
                    <MapPin className="size-3 text-muted-foreground" />
                    {locationText}
                  </span>
                </p>
              </div>

              <div className="sm:text-right shrink-0">
                <p className="font-mono text-2xl font-black text-[#B9860B] tracking-tight">
                  {formatPrice(Number(vehicle.price), vehicle.currency)}
                </p>
              </div>
            </div>

            {/* Specifications Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-4 gap-y-3 pt-5 text-xs">
              <div className="flex flex-col gap-0.5">
                <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">{locale === "en" ? "Mileage" : "Гүйлт"}</span>
                <span className="font-mono font-bold text-foreground/90 flex items-center gap-1.5">
                  <Gauge className="size-3.5 text-[#B9860B]" />
                  {formatMileage(vehicle.mileage)}
                </span>
              </div>

              {transmissionName && (
                <div className="flex flex-col gap-0.5">
                  <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">{locale === "en" ? "Transmission" : "Хурдны хайрцаг"}</span>
                  <span className="font-bold text-foreground/90 flex items-center gap-1.5">
                    <Settings className="size-3.5 text-[#B9860B]" />
                    {transmissionName}
                  </span>
                </div>
              )}

              {fuelName && (
                <div className="flex flex-col gap-0.5">
                  <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">{locale === "en" ? "Fuel" : "Шатахуун"}</span>
                  <span className="font-bold text-foreground/90 flex items-center gap-1.5">
                    <Fuel className="size-3.5 text-[#B9860B]" />
                    {fuelName}
                  </span>
                </div>
              )}

              {driveName && (
                <div className="flex flex-col gap-0.5">
                  <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">{locale === "en" ? "Drive Type" : "Хөтлөгч"}</span>
                  <span className="font-bold text-foreground/90 flex items-center gap-1.5">
                    <Milestone className="size-3.5 text-[#B9860B]" />
                    {driveName}
                  </span>
                </div>
              )}

              {(vehicle.engine_size || vehicle.engine_type) && (
                <div className="flex flex-col gap-0.5">
                  <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">{locale === "en" ? "Engine" : "Хөдөлгүүр"}</span>
                  <span className="font-mono font-bold text-foreground/90 flex items-center gap-1.5">
                    <Car className="size-3.5 text-[#B9860B]" />
                    {vehicle.engine_size ? `${vehicle.engine_size}L` : ""} {vehicle.engine_type || ""}
                  </span>
                </div>
              )}

              <div className="flex flex-col gap-0.5">
                <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">{locale === "en" ? "Steering" : "Жолооны хүрд"}</span>
                <span className="font-bold text-foreground/90 flex items-center gap-1.5">
                  <ShieldCheck className="size-3.5 text-[#B9860B]" />
                  {steeringText}
                </span>
              </div>

              {vehicle.exterior_color && (
                <div className="flex flex-col gap-0.5">
                  <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">{locale === "en" ? "Color" : "Өнгө"}</span>
                  <span className="font-bold text-foreground/90 flex items-center gap-1.5">
                    <span
                      className="size-3 rounded-full border border-border shrink-0"
                      style={{ backgroundColor: vehicle.exterior_color.hex_code ?? "#CCCCCC" }}
                    />
                    {locale === "en" ? vehicle.exterior_color.name_en : vehicle.exterior_color.name_mn}
                  </span>
                </div>
              )}

              {vehicle.body_type && (
                <div className="flex flex-col gap-0.5">
                  <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">{locale === "en" ? "Type" : "Бүтэц"}</span>
                  <span className="font-bold text-foreground/90 flex items-center gap-1.5">
                    <Eye className="size-3.5 text-[#B9860B]" />
                    {locale === "en" ? vehicle.body_type.name_en : vehicle.body_type.name_mn}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </Link>
    );
  }

  // Grid or Compact Views
  const isCompact = layout === "compact";

  return (
    <Link
      href={`/inventory/${vehicle.slug}`}
      className="group block overflow-hidden rounded-xl border border-border bg-card shadow-xs transition-all duration-300 hover:-translate-y-1 hover:shadow-lg active:scale-[0.99]"
    >
      {/* Image container */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-secondary">
        {cover ? (
          <Image
            src={getStorageUrl(cover.storage_path)}
            alt={`${brandName} ${modelName}`}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-muted-foreground">
            <Car className="size-12" strokeWidth={1} />
          </div>
        )}

        {/* Badges */}
        <div className="absolute left-3 top-3 flex flex-col gap-1.5 z-10">
          {vehicle.is_featured && (
            <Badge className="bg-[#B9860B] hover:bg-[#B9860B]/90 text-white font-semibold shadow-xs">
              {locale === "en" ? "Featured" : "Онцлох"}
            </Badge>
          )}
        </div>

        {isSold && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60 z-20 backdrop-blur-[1px]">
            <Badge variant="destructive" className="px-3.5 py-1 text-xs font-bold uppercase tracking-wider shadow-sm">
              {locale === "en" ? "Sold Out" : "Зарагдсан"}
            </Badge>
          </div>
        )}

        {isReserved && !isSold && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 z-20 backdrop-blur-[1px]">
            <Badge variant="secondary" className="bg-amber-500 hover:bg-amber-600 text-white border-none px-3.5 py-1 text-xs font-bold uppercase tracking-wider shadow-sm">
              {locale === "en" ? "Reserved" : "Захиалгатай"}
            </Badge>
          </div>
        )}
      </div>

      {/* Info details */}
      <div className={cn("p-5", isCompact ? "space-y-2.5 p-4" : "space-y-4")}>
        <div>
          <span className="text-[10px] font-bold text-[#B9860B] uppercase tracking-widest font-mono">
            {brandName}
          </span>
          <h3 className="font-display font-bold text-foreground leading-snug group-hover:text-[#B9860B] transition-colors mt-0.5 truncate">
            {brandName} {modelName}
          </h3>
          <p className="mt-0.5 text-xs text-muted-foreground flex flex-wrap gap-x-2 gap-y-0.5 items-center">
            <span className="font-semibold text-foreground/80">{vehicle.manufacturing_year} он</span>
            {vehicle.import_year && (
              <>
                <span className="text-border">•</span>
                <span>{vehicle.import_year} орсон</span>
              </>
            )}
          </p>
        </div>

        <div>
          <p className="font-mono text-xl font-black text-[#B9860B] tracking-tight">
            {formatPrice(Number(vehicle.price), vehicle.currency)}
          </p>
        </div>

        {/* Spec list representation */}
        {!isCompact ? (
          <div className="grid grid-cols-2 gap-x-3 gap-y-2 border-t border-border/40 pt-4 text-[11px] text-muted-foreground">
            <div className="flex items-center gap-1.5 min-w-0 font-medium">
              <Gauge className="size-3.5 text-[#B9860B] shrink-0" />
              <span className="truncate">{formatMileage(vehicle.mileage)}</span>
            </div>

            {transmissionName && (
              <div className="flex items-center gap-1.5 min-w-0 font-medium">
                <Settings className="size-3.5 text-[#B9860B] shrink-0" />
                <span className="truncate">{transmissionName}</span>
              </div>
            )}

            {fuelName && (
              <div className="flex items-center gap-1.5 min-w-0 font-medium">
                <Fuel className="size-3.5 text-[#B9860B] shrink-0" />
                <span className="truncate">{fuelName}</span>
              </div>
            )}

            {driveName && (
              <div className="flex items-center gap-1.5 min-w-0 font-medium">
                <Milestone className="size-3.5 text-[#B9860B] shrink-0" />
                <span className="truncate">{driveName}</span>
              </div>
            )}

            {(vehicle.engine_size || vehicle.engine_type) && (
              <div className="flex items-center gap-1.5 min-w-0 font-medium col-span-2">
                <Car className="size-3.5 text-[#B9860B] shrink-0" />
                <span className="truncate font-mono">
                  {vehicle.engine_size ? `${vehicle.engine_size}L` : ""} {vehicle.engine_type || ""}
                </span>
              </div>
            )}

            <div className="flex items-center gap-1.5 min-w-0 font-medium">
              <ShieldCheck className="size-3.5 text-[#B9860B] shrink-0" />
              <span className="truncate">{steeringText} {locale === "en" ? "wheel" : "хүрд"}</span>
            </div>

            <div className="flex items-center gap-1.5 min-w-0 font-medium">
              <MapPin className="size-3.5 text-[#B9860B] shrink-0" />
              <span className="truncate">{locale === "en" ? "UB" : "УБ"}</span>
            </div>
          </div>
        ) : (
          /* Compact View Specs showing only mileage and transmission in simple badge layout */
          <div className="flex flex-wrap gap-1.5 pt-1 text-[10px]">
            <span className="px-2 py-0.5 roundedbg-secondary text-muted-foreground font-mono font-medium">
              {formatMileage(vehicle.mileage)}
            </span>
            {transmissionName && (
              <span className="px-2 py-0.5 rounded bg-secondary text-muted-foreground font-medium">
                {transmissionName}
              </span>
            )}
            {fuelName && (
              <span className="px-2 py-0.5 rounded bg-secondary text-muted-foreground font-medium">
                {fuelName}
              </span>
            )}
            <span className="px-2 py-0.5 rounded bg-secondary text-muted-foreground font-medium flex items-center gap-1">
              <ShieldCheck className="size-3 text-[#B9860B]" />
              {steeringText}
            </span>
          </div>
        )}
      </div>
    </Link>
  );
}
