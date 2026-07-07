import Link from "next/link";
import Image from "next/image";
import { Car, Gauge, Fuel } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { getStorageUrl } from "@/lib/supabase/storage";
import { formatPrice, formatMileage } from "@/lib/format";
import type { Vehicle } from "@/types/vehicle";

export function VehicleListRow({ vehicle }: { vehicle: Vehicle }) {
    const cover = vehicle.vehicle_images?.[0];
    const isSold = vehicle.availability_status === "sold";

    return (
        <Link
            href={`/inventory/${vehicle.slug}`}
            className="group flex flex-col sm:flex-row overflow-hidden rounded-lg border border-border bg-card transition-shadow hover:shadow-lg w-full"
        >
            {/* Image container */}
            <div className="relative aspect-[4/3] sm:aspect-[16/10] w-full sm:w-60 shrink-0 overflow-hidden bg-secondary">
                {cover ? (
                    <Image
                        src={getStorageUrl(cover.storage_path)}
                        alt={`${vehicle.brand.name_mn} ${vehicle.model.name_mn}`}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, 240px"
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

            {/* Info container */}
            <div className="flex-1 p-5 flex flex-col justify-between">
                <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                        <div>
                            <h3 className="font-display text-lg font-bold leading-tight group-hover:text-primary transition-colors">
                                {vehicle.brand.name_mn} {vehicle.model.name_mn}
                            </h3>
                            <p className="mt-1 text-sm text-muted-foreground flex flex-wrap gap-x-2 gap-y-1 items-center">
                                <span>{vehicle.manufacturing_year} он</span>
                                {vehicle.import_year && (
                                    <>
                                        <span className="text-border">•</span>
                                        <span>{vehicle.import_year} онд орсон</span>
                                    </>
                                )}
                                {vehicle.transmission && (
                                    <>
                                        <span className="text-border">•</span>
                                        <span>{vehicle.transmission.name_mn}</span>
                                    </>
                                )}
                                {vehicle.drive_type && (
                                    <>
                                        <span className="text-border">•</span>
                                        <span>{vehicle.drive_type.name_mn}</span>
                                    </>
                                )}
                            </p>
                        </div>

                        <div className="sm:text-right">
                            <p className="font-mono text-xl font-bold text-primary">
                                {formatPrice(Number(vehicle.price), vehicle.currency)}
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 border-t border-border/40 pt-4">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
                            <Gauge className="size-3.5 text-primary/80" />
                            <span>Гүйлт: {formatMileage(vehicle.mileage)}</span>
                        </div>
                        {vehicle.fuel_type && (
                            <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
                                <Fuel className="size-3.5 text-primary/80" />
                                <span>Шатахуун: {vehicle.fuel_type.name_mn}</span>
                            </div>
                        )}
                        {vehicle.engine_size && (
                            <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
                                <Car className="size-3.5 text-primary/80" />
                                <span>Хөдөлгүүр: {vehicle.engine_size}L {vehicle.engine_type || ""}</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Link>
    );
}
