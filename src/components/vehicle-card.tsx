import Link from "next/link";
import Image from "next/image";
import { Car, Gauge, Fuel } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { getStorageUrl } from "@/lib/supabase/storage";
import { formatPrice, formatMileage } from "@/lib/format";
import type { Vehicle } from "@/types/vehicle";

export function VehicleCard({ vehicle }: { vehicle: Vehicle }) {
  const cover = vehicle.vehicle_images?.[0];
  const isSold = vehicle.availability_status === "sold";

  return (
    <Link
      href={`/inventory/${vehicle.slug}`}
      className="group block overflow-hidden rounded-lg border border-border bg-card transition-shadow hover:shadow-lg"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-secondary">
        {cover ? (
          <Image
            src={getStorageUrl(cover.storage_path)}
            alt={`${vehicle.brand.name_mn} ${vehicle.model.name_mn}`}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-muted-foreground">
            <Car className="size-10" strokeWidth={1.25} />
          </div>
        )}

        <div className="absolute left-3 top-3 flex gap-2">
          {vehicle.is_featured && <Badge>Онцлох</Badge>}
        </div>
        {isSold && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/60">
            <Badge variant="destructive" className="text-sm">
              Зарагдсан
            </Badge>
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-display font-semibold leading-tight">
          {vehicle.brand.name_mn} {vehicle.model.name_mn}
        </h3>
        <p className="mt-0.5 text-sm text-muted-foreground">
          {vehicle.manufacturing_year} он
          {vehicle.import_year ? ` · ${vehicle.import_year} онд орсон` : ""}
        </p>

        <p className="mt-3 font-mono text-lg font-semibold text-primary">
          {formatPrice(Number(vehicle.price), vehicle.currency)}
        </p>

        <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Gauge className="size-3.5" />
            {formatMileage(vehicle.mileage)}
          </span>
          {vehicle.fuel_type && (
            <span className="flex items-center gap-1">
              <Fuel className="size-3.5" />
              {vehicle.fuel_type.name_mn}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
