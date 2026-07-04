import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { getVehicleFormOptions } from "@/lib/queries/admin";
import { VehicleForm } from "@/components/admin/vehicle-form";
import { createVehicle } from "@/lib/actions/vehicles";

export default async function NewVehiclePage() {
  const options = await getVehicleFormOptions();

  return (
    <div className="mx-auto max-w-3xl">
      <Link
        href="/admin/dashboard"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary"
      >
        <ArrowLeft className="size-4" /> Буцах
      </Link>
      <h1 className="font-display text-2xl font-bold">Шинэ машин нэмэх</h1>
      <div className="mt-6">
        <VehicleForm options={options} action={createVehicle} />
      </div>
    </div>
  );
}
