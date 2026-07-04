import Link from "next/link";
import Image from "next/image";
import { Plus, Car } from "lucide-react";

import { getAllVehiclesForAdmin } from "@/lib/queries/admin";
import { getStorageUrl } from "@/lib/supabase/storage";
import { formatPrice, formatMileage } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { VehicleRowActions } from "@/components/admin/vehicle-row-actions";

export default async function AdminVehiclesPage() {
  const vehicles = await getAllVehiclesForAdmin();

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold">Машинууд</h1>
          <p className="text-sm text-muted-foreground">
            Нийт {vehicles.length} машин
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/dashboard/vehicles/new">
            <Plus className="size-4" /> Машин нэмэх
          </Link>
        </Button>
      </div>

      {vehicles.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-24 text-center">
          <Car className="size-10 text-muted-foreground" strokeWidth={1.25} />
          <p className="mt-4 font-medium">Одоогоор машин алга</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Эхний машинаа нэмээд эхэлцгээе.
          </p>
          <Button asChild className="mt-4">
            <Link href="/admin/dashboard/vehicles/new">
              <Plus className="size-4" /> Машин нэмэх
            </Link>
          </Button>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full text-sm">
            <thead className="bg-secondary/50 text-left text-xs uppercase text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">Машин</th>
                <th className="px-4 py-3 font-medium">Он</th>
                <th className="px-4 py-3 font-medium">Гүйлт</th>
                <th className="px-4 py-3 font-medium">Үнэ</th>
                <th className="px-4 py-3 font-medium">Төлөв / Онцлох</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {vehicles.map((vehicle) => {
                const cover = vehicle.vehicle_images?.[0];
                return (
                  <tr key={vehicle.id}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="relative size-12 shrink-0 overflow-hidden rounded-md bg-secondary">
                          {cover ? (
                            <Image
                              src={getStorageUrl(cover.storage_path)}
                              alt=""
                              fill
                              className="object-cover"
                              sizes="48px"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center text-muted-foreground">
                              <Car className="size-5" />
                            </div>
                          )}
                        </div>
                        <Link
                          href={`/admin/dashboard/vehicles/${vehicle.id}/edit`}
                          className="font-medium hover:text-primary"
                        >
                          {vehicle.brand.name_mn} {vehicle.model.name_mn}
                        </Link>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-mono">
                      {vehicle.manufacturing_year}
                    </td>
                    <td className="px-4 py-3 font-mono">
                      {formatMileage(vehicle.mileage)}
                    </td>
                    <td className="px-4 py-3 font-mono">
                      {formatPrice(Number(vehicle.price), vehicle.currency)}
                    </td>
                    <td className="px-4 py-3">
                      <VehicleRowActions
                        vehicleId={vehicle.id}
                        status={vehicle.availability_status}
                        isFeatured={vehicle.is_featured}
                      />
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/admin/dashboard/vehicles/${vehicle.id}/edit`}>
                          Засах
                        </Link>
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
