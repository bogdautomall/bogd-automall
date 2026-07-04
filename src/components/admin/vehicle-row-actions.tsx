"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Star, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { setAvailability, toggleFeatured, deleteVehicle } from "@/lib/actions/vehicles";
import type { AvailabilityStatus } from "@/types/vehicle";

export function VehicleRowActions({
  vehicleId,
  status,
  isFeatured,
}: {
  vehicleId: string;
  status: AvailabilityStatus;
  isFeatured: boolean;
}) {
  const router = useRouter();
  const [pending, setPending] = React.useState(false);

  async function handleStatusChange(value: string) {
    setPending(true);
    await setAvailability(vehicleId, value as AvailabilityStatus);
    router.refresh();
    setPending(false);
  }

  async function handleToggleFeatured() {
    setPending(true);
    await toggleFeatured(vehicleId, !isFeatured);
    router.refresh();
    setPending(false);
  }

  async function handleDelete() {
    if (!confirm("Энэ машиныг бүрмөсөн устгах уу? Энэ үйлдлийг буцаах боломжгүй."))
      return;
    setPending(true);
    await deleteVehicle(vehicleId);
    router.refresh();
    setPending(false);
  }

  return (
    <div className="flex items-center gap-2">
      <Select value={status} onValueChange={handleStatusChange} disabled={pending}>
        <SelectTrigger size="sm" className="w-[130px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="available">Боломжтой</SelectItem>
          <SelectItem value="reserved">Захиалгатай</SelectItem>
          <SelectItem value="sold">Зарагдсан</SelectItem>
          <SelectItem value="archived">Архивласан</SelectItem>
        </SelectContent>
      </Select>

      <Button
        variant="ghost"
        size="icon"
        disabled={pending}
        onClick={handleToggleFeatured}
        aria-label="Онцлох"
      >
        <Star
          className={isFeatured ? "size-4 fill-primary text-primary" : "size-4"}
        />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        disabled={pending}
        onClick={handleDelete}
        aria-label="Устгах"
      >
        <Trash2 className="size-4 text-destructive" />
      </Button>
    </div>
  );
}
