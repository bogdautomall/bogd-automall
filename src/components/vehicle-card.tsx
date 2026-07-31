"use client";

import Link from "next/link";
import Image from "next/image";
import { Car, Gauge, Fuel, ShieldCheck, MapPin, Milestone, Settings, Eye, ChevronLeft, ChevronRight } from "lucide-react";
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

/** Custom hook for mobile touch swipe */
function useSwipe(
  onSwipeLeft: () => void,
  onSwipeRight: () => void,
  enabled: boolean
) {
  const touchStartX = React.useRef<number | null>(null);
  const touchStartY = React.useRef<number | null>(null);
  const touchEndX = React.useRef<number | null>(null);
  const isSwiping = React.useRef(false);

  const handlers = React.useMemo(() => {
    if (!enabled) return {};

    return {
      onTouchStart: (e: React.TouchEvent) => {
        touchStartX.current = e.targetTouches[0].clientX;
        touchStartY.current = e.targetTouches[0].clientY;
        touchEndX.current = null;
        isSwiping.current = false;
      },
      onTouchMove: (e: React.TouchEvent) => {
        if (touchStartX.current === null || touchStartY.current === null) return;
        touchEndX.current = e.targetTouches[0].clientX;

        const deltaX = Math.abs(e.targetTouches[0].clientX - touchStartX.current);
        const deltaY = Math.abs(e.targetTouches[0].clientY - touchStartY.current);

        // If horizontal movement is dominant, prevent vertical scroll and mark as swiping
        if (deltaX > deltaY && deltaX > 10) {
          isSwiping.current = true;
          e.preventDefault();
        }
      },
      onTouchEnd: () => {
        if (
          touchStartX.current === null ||
          touchEndX.current === null ||
          !isSwiping.current
        ) {
          touchStartX.current = null;
          touchStartY.current = null;
          return;
        }

        const diff = touchStartX.current - touchEndX.current;
        const threshold = 50;

        if (diff > threshold) {
          onSwipeLeft(); // swipe left = next
        } else if (diff < -threshold) {
          onSwipeRight(); // swipe right = prev
        }

        touchStartX.current = null;
        touchStartY.current = null;
        touchEndX.current = null;
        isSwiping.current = false;
      },
    };
  }, [onSwipeLeft, onSwipeRight, enabled]);

  return handlers;
}

/** Shared image slider component */
function ImageSlider({
  images,
  currentIndex,
  onPrev,
  onNext,
  onDotClick,
  alt,
  sizes,
  className,
  swipeHandlers,
}: {
  images: Vehicle["vehicle_images"];
  currentIndex: number;
  onPrev: (e: React.MouseEvent) => void;
  onNext: (e: React.MouseEvent) => void;
  onDotClick: (e: React.MouseEvent, index: number) => void;
  alt: string;
  sizes: string;
  className?: string;
  swipeHandlers: Record<string, (e: React.TouchEvent) => void>;
}) {
  const hasMultiple = images.length > 1;
  const cover = images[currentIndex];

  return (
    <div className={cn("relative w-full overflow-hidden bg-secondary", className)} {...swipeHandlers}>
      {cover ? (
        <Image
          src={getStorageUrl(cover.storage_path)}
          alt={alt}
          fill
          className="object-cover transition-transform duration-500"
          sizes={sizes}
          loading="lazy"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center text-muted-foreground min-h-[200px]">
          <Car className="size-12" strokeWidth={1} />
        </div>
      )}

      {hasMultiple && (
        <>
          {/* Prev Button - always visible on mobile */}
          <button
            onClick={onPrev}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 flex size-8 items-center justify-center rounded-full bg-black/40 text-white hover:bg-black/60 backdrop-blur-[2px] transition-all md:opacity-0 md:group-hover/img:opacity-100"
            aria-label="Previous image"
          >
            <ChevronLeft className="size-5" />
          </button>

          {/* Next Button - always visible on mobile */}
          <button
            onClick={onNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 flex size-8 items-center justify-center rounded-full bg-black/40 text-white hover:bg-black/60 backdrop-blur-[2px] transition-all md:opacity-0 md:group-hover/img:opacity-100"
            aria-label="Next image"
          >
            <ChevronRight className="size-5" />
          </button>

          {/* Image Counter */}
          <div className="absolute right-3 top-3 z-10 bg-black/50 text-white font-mono text-[10px] px-2 py-0.5 rounded backdrop-blur-[2px] font-semibold">
            {currentIndex + 1} / {images.length}
          </div>

          {/* Dots */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 flex gap-1">
            {images.slice(0, 10).map((_, idx) => (
              <button
                key={idx}
                onClick={(e) => onDotClick(e, idx)}
                className={cn(
                  "size-1.5 rounded-full transition-all duration-300",
                  idx === currentIndex ? "bg-white w-3" : "bg-white/50 hover:bg-white"
                )}
                aria-label={`Go to image ${idx + 1}`}
              />
            ))}
            {images.length > 10 && (
              <span className="text-[8px] text-white/70 self-center ml-0.5">
                +{images.length - 10}
              </span>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export function VehicleCard({ vehicle, layout = "grid" }: VehicleCardProps) {
  const { locale, t } = useLanguage();
  const [currentImageIndex, setCurrentImageIndex] = React.useState(0);

  const images = vehicle.vehicle_images ?? [];
  const hasMultipleImages = images.length > 1;

  const isSold = vehicle.availability_status === "sold";
  const isReserved = vehicle.availability_status === "reserved";

  const handlePrev = React.useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  }, [images.length]);

  const handleNext = React.useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  }, [images.length]);

  const handleDotClick = (e: React.MouseEvent, index: number) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex(index);
  };

  // Swipe handlers for mobile
  const swipeHandlers = useSwipe(
    // Swipe left = next image
    React.useCallback(() => {
      setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    }, [images.length]),
    // Swipe right = prev image
    React.useCallback(() => {
      setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    }, [images.length]),
    hasMultipleImages
  );

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
      <div
        className="group flex flex-col md:flex-row overflow-hidden rounded-xl border border-border bg-card shadow-xs transition-all duration-300 hover:-translate-y-1 hover:shadow-lg active:scale-[0.99] w-full"
      >
        {/* Image holder */}
        <div className="relative aspect-[16/10] md:aspect-auto md:w-80 shrink-0 overflow-hidden bg-secondary group/img">
          <Link href={`/inventory/${vehicle.slug}`} className="absolute inset-0 block z-0">
            {images[currentImageIndex] ? (
              <Image
                src={getStorageUrl(images[currentImageIndex].storage_path)}
                alt={`${brandName} ${modelName}`}
                fill
                className="object-cover transition-transform duration-500 group-hover/img:scale-105"
                sizes="(max-width: 768px) 100vw, 320px"
                loading="lazy"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-muted-foreground min-h-[200px]">
                <Car className="size-12" strokeWidth={1} />
              </div>
            )}
          </Link>

          {/* Touch swipe zone */}
          {hasMultipleImages && (
            <div
              className="absolute inset-0 z-[5]"
              {...swipeHandlers}
              style={{ touchAction: "pan-y" }}
            />
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

          {hasMultipleImages && (
            <>
              {/* Prev Button - visible on mobile */}
              <button
                onClick={handlePrev}
                className="absolute left-2 top-1/2 -translate-y-1/2 z-10 flex size-8 items-center justify-center rounded-full bg-black/40 text-white hover:bg-black/60 backdrop-blur-[2px] transition-all md:opacity-0 md:group-hover/img:opacity-100"
                aria-label="Previous image"
              >
                <ChevronLeft className="size-5" />
              </button>

              {/* Next Button - visible on mobile */}
              <button
                onClick={handleNext}
                className="absolute right-2 top-1/2 -translate-y-1/2 z-10 flex size-8 items-center justify-center rounded-full bg-black/40 text-white hover:bg-black/60 backdrop-blur-[2px] transition-all md:opacity-0 md:group-hover/img:opacity-100"
                aria-label="Next image"
              >
                <ChevronRight className="size-5" />
              </button>

              {/* Image Counter */}
              <div className="absolute right-3 top-3 z-10 bg-black/50 text-white font-mono text-[10px] px-2 py-0.5 rounded backdrop-blur-[2px] font-semibold">
                {currentImageIndex + 1} / {images.length}
              </div>

              {/* Dots */}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 flex gap-1">
                {images.slice(0, 10).map((_, idx) => (
                  <button
                    key={idx}
                    onClick={(e) => handleDotClick(e, idx)}
                    className={cn(
                      "size-1.5 rounded-full transition-all duration-300",
                      idx === currentImageIndex ? "bg-white w-3" : "bg-white/50 hover:bg-white"
                    )}
                    aria-label={`Go to image ${idx + 1}`}
                  />
                ))}
                {images.length > 10 && (
                  <span className="text-[8px] text-white/70 self-center ml-0.5">
                    +{images.length - 10}
                  </span>
                )}
              </div>
            </>
          )}
        </div>

        {/* Info */}
        <Link
          href={`/inventory/${vehicle.slug}`}
          className="flex-1 p-6 flex flex-col justify-between hover:no-underline group/info"
        >
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
        </Link>
      </div>
    );
  }

  // Grid or Compact Views
  const isCompact = layout === "compact";

  return (
    <div
      className="group block overflow-hidden rounded-xl border border-border bg-card shadow-xs transition-all duration-300 hover:-translate-y-1 hover:shadow-lg active:scale-[0.99]"
    >
      {/* Image container */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-secondary group/img">
        <Link href={`/inventory/${vehicle.slug}`} className="absolute inset-0 block z-0">
          {images[currentImageIndex] ? (
            <Image
              src={getStorageUrl(images[currentImageIndex].storage_path)}
              alt={`${brandName} ${modelName}`}
              fill
              className="object-cover transition-transform duration-500 group-hover/img:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              loading="lazy"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-muted-foreground">
              <Car className="size-12" strokeWidth={1} />
            </div>
          )}
        </Link>

        {/* Touch swipe zone - sits above the link on mobile */}
        {hasMultipleImages && (
          <div
            className="absolute inset-0 z-[5] md:pointer-events-none"
            {...swipeHandlers}
            style={{ touchAction: "pan-y" }}
          />
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

        {hasMultipleImages && (
          <>
            {/* Prev Button - visible on mobile */}
            <button
              onClick={handlePrev}
              className="absolute left-2 top-1/2 -translate-y-1/2 z-10 flex size-8 items-center justify-center rounded-full bg-black/40 text-white hover:bg-black/60 backdrop-blur-[2px] transition-all md:opacity-0 md:group-hover/img:opacity-100"
              aria-label="Previous image"
            >
              <ChevronLeft className="size-5" />
            </button>

            {/* Next Button - visible on mobile */}
            <button
              onClick={handleNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 z-10 flex size-8 items-center justify-center rounded-full bg-black/40 text-white hover:bg-black/60 backdrop-blur-[2px] transition-all md:opacity-0 md:group-hover/img:opacity-100"
              aria-label="Next image"
            >
              <ChevronRight className="size-5" />
            </button>

            {/* Image Counter */}
            <div className="absolute right-3 top-3 z-10 bg-black/50 text-white font-mono text-[10px] px-2 py-0.5 rounded backdrop-blur-[2px] font-semibold">
              {currentImageIndex + 1} / {images.length}
            </div>

            {/* Dots */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 flex gap-1">
              {images.slice(0, 10).map((_, idx) => (
                <button
                  key={idx}
                  onClick={(e) => handleDotClick(e, idx)}
                  className={cn(
                    "size-1.5 rounded-full transition-all duration-300",
                    idx === currentImageIndex ? "bg-white w-3" : "bg-white/50 hover:bg-white"
                  )}
                  aria-label={`Go to image ${idx + 1}`}
                />
              ))}
              {images.length > 10 && (
                <span className="text-[8px] text-white/70 self-center ml-0.5">
                  +{images.length - 10}
                </span>
              )}
            </div>
          </>
        )}
      </div>

      {/* Info details */}
      <Link
        href={`/inventory/${vehicle.slug}`}
        className={cn("block p-5 hover:no-underline", isCompact ? "space-y-2.5 p-4" : "space-y-4")}
      >
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
            <span className="px-2 py-0.5 rounded bg-secondary text-muted-foreground font-mono font-medium">
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
      </Link>
    </div>
  );
}
