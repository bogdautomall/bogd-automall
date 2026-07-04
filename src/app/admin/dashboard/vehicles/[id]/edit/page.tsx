import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { getVehicleFormOptions, getVehicleById } from "@/lib/queries/admin";
import { VehicleForm } from "@/components/admin/vehicle-form";
import { updateVehicle } from "@/lib/actions/vehicles";

export default async function EditVehiclePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [options, vehicle] = await Promise.all([
    getVehicleFormOptions(),
    getVehicleById(id),
  ]);

  if (!vehicle) notFound();

  const boundUpdate = updateVehicle.bind(null, id);

  return (
    <div className="mx-auto max-w-3xl">
      <Link
        href="/admin/dashboard"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary"
      >
        <ArrowLeft className="size-4" /> Буцах
      </Link>
      <h1 className="font-display text-2xl font-bold">
        {vehicle.brand.name_mn} {vehicle.model.name_mn} — засах
      </h1>
      <div className="mt-6">
        <VehicleForm options={options} vehicle={vehicle} action={boundUpdate} />
      </div>
    </div>
  );
}
