"use client";

import * as React from "react";
import Image from "next/image";
import { useFormStatus } from "react-dom";
import { X, ImagePlus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { CreatableCombobox } from "@/components/admin/creatable-combobox";
import { getStorageUrl } from "@/lib/supabase/storage";
import { deleteVehicleImage } from "@/lib/actions/vehicles";
import type { VehicleFormOptions } from "@/lib/queries/admin";
import type { Vehicle } from "@/types/vehicle";

const MAX_IMAGES = 20;

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Хадгалж байна..." : label}
    </Button>
  );
}

export function VehicleForm({
  options,
  vehicle,
  action,
}: {
  options: VehicleFormOptions;
  vehicle?: Vehicle;
  action: (formData: FormData) => void | Promise<void>;
}) {
  const [brand, setBrand] = React.useState(vehicle?.brand?.id ?? "");
  const [model, setModel] = React.useState(vehicle?.model?.id ?? "");
  const [exteriorColor, setExteriorColor] = React.useState(
    vehicle?.exterior_color?.id ?? ""
  );
  const [interiorColor, setInteriorColor] = React.useState(
    vehicle?.interior_color?.id ?? ""
  );
  const [newFiles, setNewFiles] = React.useState<File[]>([]);
  const [existingImages, setExistingImages] = React.useState(
    vehicle?.vehicle_images ?? []
  );

  const modelOptions = options.models
    .filter((m) => !brand.startsWith("__new__:") && m.brand_id === brand)
    .map((m) => ({ value: m.id, label: m.name_mn }));

  const totalImageCount = existingImages.length + newFiles.length;

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const picked = Array.from(e.target.files ?? []);
    const allowed = MAX_IMAGES - existingImages.length;
    if (picked.length > allowed) {
      alert(
        `Хамгийн ихдээ ${MAX_IMAGES} зураг байршуулах боломжтой. Та дахин ${allowed} зураг сонгож болно.`
      );
      setNewFiles(picked.slice(0, allowed));
    } else {
      setNewFiles(picked);
    }
  }

  async function handleDeleteExisting(imageId: string, storagePath: string) {
    if (!confirm("Энэ зургийг устгах уу?")) return;
    await deleteVehicleImage(imageId, storagePath);
    setExistingImages((prev) => prev.filter((img) => img.id !== imageId));
  }

  return (
    <form action={action} className="space-y-8">
      {/* Hidden inputs mirror combobox state into the form submission */}
      <input type="hidden" name="brand" value={brand} />
      <input type="hidden" name="model" value={model} />
      <input type="hidden" name="exterior_color" value={exteriorColor} />
      <input type="hidden" name="interior_color" value={interiorColor} />

      <section className="grid gap-6 sm:grid-cols-2">
        <div>
          <Label className="mb-1.5">Марк *</Label>
          <CreatableCombobox
            value={brand}
            onChange={(v) => {
              setBrand(v);
              setModel(""); // reset model when brand changes
            }}
            options={options.brands.map((b) => ({ value: b.id, label: b.name_mn }))}
            placeholder="Марк сонгох..."
          />
        </div>

        <div>
          <Label className="mb-1.5">Загвар *</Label>
          <CreatableCombobox
            value={model}
            onChange={setModel}
            options={modelOptions}
            placeholder="Загвар сонгох..."
          />
        </div>

        <div>
          <Label htmlFor="manufacturing_year" className="mb-1.5">
            Үйлдвэрлэсэн он *
          </Label>
          <Input
            id="manufacturing_year"
            name="manufacturing_year"
            type="number"
            required
            defaultValue={vehicle?.manufacturing_year}
          />
        </div>

        <div>
          <Label htmlFor="import_year" className="mb-1.5">
            Монголд орж ирсэн он
          </Label>
          <Input
            id="import_year"
            name="import_year"
            type="number"
            defaultValue={vehicle?.import_year ?? undefined}
          />
        </div>

        <div>
          <Label htmlFor="mileage" className="mb-1.5">
            Гүйлт (км)
          </Label>
          <Input
            id="mileage"
            name="mileage"
            type="number"
            defaultValue={vehicle?.mileage ?? undefined}
          />
        </div>

        <div>
          <Label htmlFor="price" className="mb-1.5">
            Үнэ (₮) *
          </Label>
          <Input
            id="price"
            name="price"
            type="number"
            required
            defaultValue={vehicle?.price}
          />
        </div>

        <div>
          <Label className="mb-1.5">Шатахуун</Label>
          <Select name="fuel_type" defaultValue={vehicle?.fuel_type?.id}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Сонгох" />
            </SelectTrigger>
            <SelectContent>
              {options.fuelTypes.map((f) => (
                <SelectItem key={f.id} value={f.id}>
                  {f.name_mn}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="mb-1.5">Хурдны хайрцаг</Label>
          <Select name="transmission" defaultValue={vehicle?.transmission?.id}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Сонгох" />
            </SelectTrigger>
            <SelectContent>
              {options.transmissionTypes.map((t) => (
                <SelectItem key={t.id} value={t.id}>
                  {t.name_mn}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="mb-1.5">Хөтлөгч</Label>
          <Select name="drive_type" defaultValue={vehicle?.drive_type?.id}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Сонгох" />
            </SelectTrigger>
            <SelectContent>
              {options.driveTypes.map((d) => (
                <SelectItem key={d.id} value={d.id}>
                  {d.name_mn}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="mb-1.5">Бүтэц</Label>
          <Select name="body_type" defaultValue={vehicle?.body_type?.id}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Сонгох" />
            </SelectTrigger>
            <SelectContent>
              {options.bodyTypes.map((b) => (
                <SelectItem key={b.id} value={b.id}>
                  {b.name_mn}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="engine_size" className="mb-1.5">
            Хөдөлгүүрийн багтаамж (Л)
          </Label>
          <Input
            id="engine_size"
            name="engine_size"
            type="number"
            step="0.1"
            defaultValue={vehicle?.engine_size ?? undefined}
          />
        </div>

        <div>
          <Label htmlFor="engine_type" className="mb-1.5">
            Хөдөлгүүрийн төрөл
          </Label>
          <Input
            id="engine_type"
            name="engine_type"
            placeholder="Жишээ: V6 Turbo"
            defaultValue={vehicle?.engine_type ?? undefined}
          />
        </div>

        <div>
          <Label className="mb-1.5">Жолооны хүрд</Label>
          <Select
            name="steering_position"
            defaultValue={vehicle?.steering_position ?? undefined}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Сонгох" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="left">Зүүн</SelectItem>
              <SelectItem value="right">Баруун</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="mb-1.5">Гадна өнгө</Label>
          <CreatableCombobox
            value={exteriorColor}
            onChange={setExteriorColor}
            options={options.colors.map((c) => ({ value: c.id, label: c.name_mn }))}
            placeholder="Өнгө сонгох..."
          />
        </div>

        <div>
          <Label className="mb-1.5">Дотор өнгө</Label>
          <CreatableCombobox
            value={interiorColor}
            onChange={setInteriorColor}
            options={options.colors.map((c) => ({ value: c.id, label: c.name_mn }))}
            placeholder="Өнгө сонгох..."
          />
        </div>

        <div>
          <Label className="mb-1.5">Төлөв</Label>
          <Select
            name="availability_status"
            defaultValue={vehicle?.availability_status ?? "available"}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="available">Боломжтой</SelectItem>
              <SelectItem value="reserved">Захиалгатай</SelectItem>
              <SelectItem value="sold">Зарагдсан</SelectItem>
              <SelectItem value="archived">Архивласан</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2 pt-6">
          <Checkbox
            id="is_featured"
            name="is_featured"
            defaultChecked={vehicle?.is_featured}
          />
          <Label htmlFor="is_featured">Онцлох машин болгох</Label>
        </div>
      </section>

      <section>
        <Label htmlFor="description_mn" className="mb-1.5">
          Тайлбар (Монгол)
        </Label>
        <Textarea
          id="description_mn"
          name="description_mn"
          rows={4}
          defaultValue={vehicle?.description_mn ?? undefined}
        />
      </section>

      <section>
        <Label htmlFor="description_en" className="mb-1.5">
          Тайлбар (Англи)
        </Label>
        <Textarea
          id="description_en"
          name="description_en"
          rows={4}
          defaultValue={vehicle?.description_en ?? undefined}
        />
      </section>

      <section>
        <Label className="mb-1.5">
          Зураг ({totalImageCount}/{MAX_IMAGES})
        </Label>

        {existingImages.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-3">
            {existingImages.map((img) => (
              <div key={img.id} className="group relative size-20">
                <Image
                  src={getStorageUrl(img.storage_path)}
                  alt=""
                  fill
                  className="rounded-md object-cover"
                  sizes="80px"
                />
                <button
                  type="button"
                  onClick={() => handleDeleteExisting(img.id, img.storage_path)}
                  className="absolute -right-1.5 -top-1.5 rounded-full bg-destructive p-1 text-destructive-foreground opacity-0 transition-opacity group-hover:opacity-100"
                >
                  <X className="size-3" />
                </button>
              </div>
            ))}
          </div>
        )}

        {newFiles.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-3">
            {newFiles.map((file, i) => (
              <div key={i} className="relative size-20">
                <Image
                  src={URL.createObjectURL(file)}
                  alt=""
                  fill
                  className="rounded-md object-cover"
                  sizes="80px"
                  unoptimized
                />
              </div>
            ))}
          </div>
        )}

        {totalImageCount < MAX_IMAGES && (
          <label className="flex w-fit cursor-pointer items-center gap-2 rounded-md border border-dashed border-border px-4 py-3 text-sm text-muted-foreground hover:border-primary hover:text-primary">
            <ImagePlus className="size-4" />
            Зураг нэмэх
            <input
              type="file"
              name="images"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleFileChange}
            />
          </label>
        )}
        <p className="mt-1.5 text-xs text-muted-foreground">
          Нэг машинд хамгийн ихдээ 20 зураг байршуулах боломжтой.
        </p>
      </section>

      <SubmitButton label={vehicle ? "Хадгалах" : "Машин нэмэх"} />
    </form>
  );
}
