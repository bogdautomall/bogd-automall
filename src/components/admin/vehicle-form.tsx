"use client";

import * as React from "react";
import Image from "next/image";
import { useFormStatus } from "react-dom";
import {
  X,
  ImagePlus,
  Video,
  ChevronLeft,
  ChevronRight,
  Star,
  GripVertical,
} from "lucide-react";

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
import { deleteVehicleImage, deleteVehicleVideo } from "@/lib/actions/vehicles";
import type { VehicleFormOptions } from "@/lib/queries/admin";
import type { Vehicle, VehicleImage, VehicleVideo } from "@/types/vehicle";

const MAX_IMAGES = 20;

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full sm:w-auto min-h-[48px]">
      {pending ? "Хадгалж байна..." : label}
    </Button>
  );
}

// ─── Drag & Drop Image Sorter ──────────────────────────────────

interface DraggableImageItem {
  type: "existing" | "new";
  id: string;
  existingImage?: VehicleImage;
  file?: File;
  previewUrl?: string;
}

function DraggableImageList({
  items,
  onReorder,
  onRemoveExisting,
  onRemoveNew,
}: {
  items: DraggableImageItem[];
  onReorder: (items: DraggableImageItem[]) => void;
  onRemoveExisting: (imageId: string, storagePath: string) => void;
  onRemoveNew: (id: string) => void;
}) {
  const [draggedIndex, setDraggedIndex] = React.useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = React.useState<number | null>(null);
  const [activeIndex, setActiveIndex] = React.useState<number | null>(null);

  // Touch drag state
  const touchStartY = React.useRef<number>(0);
  const touchStartX = React.useRef<number>(0);

  function handleDragStart(e: React.DragEvent, index: number) {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
    const el = e.currentTarget as HTMLElement;
    e.dataTransfer.setDragImage(el, 40, 40);
  }

  function handleDragOver(e: React.DragEvent, index: number) {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverIndex(index);
  }

  function handleDrop(e: React.DragEvent, index: number) {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) {
      setDraggedIndex(null);
      setDragOverIndex(null);
      return;
    }
    const newItems = [...items];
    const [dragged] = newItems.splice(draggedIndex, 1);
    newItems.splice(index, 0, dragged);
    onReorder(newItems);
    setDraggedIndex(null);
    setDragOverIndex(null);
  }

  function handleDragEnd() {
    setDraggedIndex(null);
    setDragOverIndex(null);
  }

  function moveItem(fromIndex: number, direction: "left" | "right") {
    const toIndex = direction === "left" ? fromIndex - 1 : fromIndex + 1;
    if (toIndex < 0 || toIndex >= items.length) return;
    const newItems = [...items];
    const [moved] = newItems.splice(fromIndex, 1);
    newItems.splice(toIndex, 0, moved);
    onReorder(newItems);
    // keep the item selected after move
    setActiveIndex(toIndex);
  }

  function setAsCover(index: number) {
    if (index === 0) return;
    const newItems = [...items];
    const [item] = newItems.splice(index, 1);
    newItems.unshift(item);
    onReorder(newItems);
    setActiveIndex(0);
  }

  if (items.length === 0) return null;

  return (
    <div className="mb-4">
      <p className="mb-2 text-xs text-muted-foreground">
        💡 Зургийг чирч дарааллыг өөрчлөх, эсвэл зургийг дарж засах цэсийг нээнэ үү. Эхний зураг нүүр зураг болно.
      </p>

      {/* Scrollable image strip */}
      <div className="flex gap-3 overflow-x-auto pb-4 pt-2 snap-x snap-mandatory" style={{ scrollbarWidth: "thin" }}>
        {items.map((item, index) => {
          const isDragged = draggedIndex === index;
          const isDragOver = dragOverIndex === index && draggedIndex !== index;
          const isFirst = index === 0;
          const isActive = activeIndex === index;

          const imgSrc =
            item.type === "existing"
              ? getStorageUrl(item.existingImage!.storage_path)
              : item.previewUrl!;

          return (
            <div
              key={item.id}
              className="relative shrink-0 snap-start"
              style={{ width: 100, height: 100 }}
            >
              {/* Cover badge */}
              {isFirst && (
                <span className="absolute -top-2 left-1/2 -translate-x-1/2 z-20 whitespace-nowrap rounded-full bg-primary px-2 py-0.5 text-[9px] font-bold text-primary-foreground shadow-md">
                  ★ Нүүр
                </span>
              )}

              {/* Drag container */}
              <div
                draggable
                onDragStart={(e) => handleDragStart(e, index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDrop={(e) => handleDrop(e, index)}
                onDragEnd={handleDragEnd}
                onClick={() => setActiveIndex(isActive ? null : index)}
                className={[
                  "relative size-full rounded-xl border-2 overflow-hidden cursor-grab active:cursor-grabbing transition-all select-none",
                  isDragged ? "opacity-40 scale-95 border-primary/40" : "",
                  isDragOver ? "border-primary border-dashed scale-105 shadow-lg" : "border-transparent",
                  isFirst ? "ring-2 ring-primary ring-offset-2 shadow-md" : "border-muted",
                  isActive ? "ring-2 ring-blue-500 ring-offset-2" : "",
                ].join(" ")}
              >
                <Image
                  src={imgSrc}
                  alt=""
                  fill
                  className="object-cover pointer-events-none"
                  sizes="100px"
                  unoptimized={item.type === "new"}
                />

                {/* Hover overlay with grip */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/0 hover:bg-black/25 transition-colors rounded-xl">
                  <GripVertical className="size-5 text-white opacity-0 group-hover:opacity-70 drop-shadow transition-opacity" />
                </div>

                {/* Order number */}
                <span className="absolute bottom-1 right-1 rounded-md bg-black/60 px-1.5 py-0.5 text-[9px] font-mono text-white font-bold shadow">
                  {index + 1}
                </span>
              </div>

              {/* Active overlay controls */}
              {isActive && (
                <div className="absolute inset-0 z-30 flex flex-col items-center justify-center gap-1 bg-black/60 rounded-xl">
                  {/* Move left/right */}
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); moveItem(index, "left"); }}
                      disabled={index === 0}
                      title="Зүүн тийш зөөх"
                      className="rounded-lg bg-white/20 hover:bg-white/40 border border-white/40 p-2 text-white disabled:opacity-30 transition-colors"
                    >
                      <ChevronLeft className="size-4" />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); moveItem(index, "right"); }}
                      disabled={index === items.length - 1}
                      title="Баруун тийш зөөх"
                      className="rounded-lg bg-white/20 hover:bg-white/40 border border-white/40 p-2 text-white disabled:opacity-30 transition-colors"
                    >
                      <ChevronRight className="size-4" />
                    </button>
                  </div>

                  {/* Set as cover */}
                  {!isFirst && (
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); setAsCover(index); }}
                      title="Нүүр зураг болгох"
                      className="flex items-center gap-1 rounded-lg bg-yellow-500/80 hover:bg-yellow-500 px-2 py-1 text-[10px] font-bold text-white transition-colors"
                    >
                      <Star className="size-3" /> Нүүр болгох
                    </button>
                  )}

                  {/* Delete */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveIndex(null);
                      if (item.type === "existing") {
                        onRemoveExisting(item.existingImage!.id, item.existingImage!.storage_path);
                      } else {
                        onRemoveNew(item.id);
                      }
                    }}
                    className="flex items-center gap-1 rounded-lg bg-red-500/80 hover:bg-red-600 px-2 py-1 text-[10px] font-bold text-white transition-colors"
                  >
                    <X className="size-3" /> Устгах
                  </button>

                  {/* Close */}
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); setActiveIndex(null); }}
                    className="mt-1 text-[9px] text-white/70 hover:text-white"
                  >
                    хаах
                  </button>
                </div>
              )}

              {/* Quick delete on desktop (top-right corner, only when NOT active) */}
              {!isActive && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (item.type === "existing") {
                      onRemoveExisting(item.existingImage!.id, item.existingImage!.storage_path);
                    } else {
                      onRemoveNew(item.id);
                    }
                  }}
                  className="absolute -right-1 -top-1 z-20 hidden sm:flex rounded-full bg-destructive p-1 text-destructive-foreground shadow opacity-0 hover:opacity-100 group-hover:opacity-100 focus:opacity-100 transition-opacity"
                >
                  <X className="size-3" />
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Mobile hint */}
      <p className="mt-1 text-[10px] text-muted-foreground sm:hidden">
        👆 Зурган дээр дарж засах цэсийг нээнэ үү
      </p>
    </div>
  );
}

// ─── Main Form ─────────────────────────────────────────────────

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

  // Image state: merge existing + new into draggable items
  const [imageItems, setImageItems] = React.useState<DraggableImageItem[]>(() => {
    return (vehicle?.vehicle_images ?? [])
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((img) => ({
        type: "existing" as const,
        id: img.id,
        existingImage: img,
      }));
  });

  // Video state
  const [existingVideos, setExistingVideos] = React.useState<VehicleVideo[]>(
    vehicle?.vehicle_videos ?? []
  );
  const [newVideoFiles, setNewVideoFiles] = React.useState<File[]>([]);

  // Hidden file input refs
  const imageInputRef = React.useRef<HTMLInputElement>(null);
  const videoInputRef = React.useRef<HTMLInputElement>(null);

  const modelOptions = options.models
    .filter((m) => !brand.startsWith("__new__:") && m.brand_id === brand)
    .map((m) => ({ value: m.id, label: m.name_mn }));

  const totalImageCount = imageItems.length;

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const picked = Array.from(e.target.files ?? []);
    if (picked.length === 0) return;

    const allowed = MAX_IMAGES - totalImageCount;
    const filesToAdd = picked.slice(0, allowed);

    if (picked.length > allowed) {
      alert(
        `Хамгийн ихдээ ${MAX_IMAGES} зураг байршуулах боломжтой. Та дахин ${allowed} зураг сонгож болно.`
      );
    }

    const newItems: DraggableImageItem[] = filesToAdd.map((file) => ({
      type: "new" as const,
      id: crypto.randomUUID(),
      file,
      previewUrl: URL.createObjectURL(file),
    }));

    setImageItems((prev) => [...prev, ...newItems]);

    // Reset so same files can be selected again
    if (imageInputRef.current) {
      imageInputRef.current.value = "";
    }
  }

  function handleVideoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const picked = Array.from(e.target.files ?? []);
    if (picked.length === 0) return;
    setNewVideoFiles((prev) => [...prev, ...picked]);
    if (videoInputRef.current) {
      videoInputRef.current.value = "";
    }
  }

  async function handleDeleteExisting(imageId: string, storagePath: string) {
    if (!confirm("Энэ зургийг устгах уу?")) return;
    await deleteVehicleImage(imageId, storagePath);
    setImageItems((prev) => prev.filter((item) => item.id !== imageId));
  }

  function handleRemoveNew(id: string) {
    setImageItems((prev) => {
      const item = prev.find((i) => i.id === id);
      if (item?.previewUrl) URL.revokeObjectURL(item.previewUrl);
      return prev.filter((i) => i.id !== id);
    });
  }

  async function handleDeleteExistingVideo(videoId: string, storagePath: string) {
    if (!confirm("Энэ бичлэгийг устгах уу?")) return;
    await deleteVehicleVideo(videoId, storagePath);
    setExistingVideos((prev) => prev.filter((v) => v.id !== videoId));
  }

  function handleRemoveNewVideo(index: number) {
    setNewVideoFiles((prev) => prev.filter((_, i) => i !== index));
  }

  // Build FormData with correct ordering
  function handleFormAction(formData: FormData) {
    // Remove any auto-added entries
    formData.delete("images");
    formData.delete("videos");
    formData.delete("image_order");
    formData.delete("new_image_positions");

    // Separate items by type while preserving display order
    const newFilesInOrder: File[] = [];
    const existingOrderData: { id: string; sort_order: number }[] = [];
    // Tracks position of each new file in the combined list (for create mode)
    const newImagePositions: number[] = [];

    imageItems.forEach((item, displayIndex) => {
      if (item.type === "new" && item.file) {
        newFilesInOrder.push(item.file);
        newImagePositions.push(displayIndex);
        formData.append("images", item.file);
      } else if (item.type === "existing") {
        existingOrderData.push({ id: item.id, sort_order: displayIndex });
      }
    });

    // Send existing image reorder data
    if (existingOrderData.length > 0) {
      formData.set("image_order", JSON.stringify(existingOrderData));
    }

    // Send new image position data so server knows where each new file goes
    if (newImagePositions.length > 0) {
      formData.set("new_image_positions", JSON.stringify(newImagePositions));
    }

    // Add video files
    for (const file of newVideoFiles) {
      formData.append("videos", file);
    }

    return action(formData);
  }

  return (
    <form action={handleFormAction} className="space-y-8">
      {/* Hidden inputs mirror combobox state */}
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
              setModel("");
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
            inputMode="numeric"
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
            inputMode="numeric"
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
            inputMode="numeric"
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
            inputMode="numeric"
          />
        </div>

        <div>
          <Label className="mb-1.5">Шатахуун</Label>
          <Select name="fuel_type" defaultValue={vehicle?.fuel_type?.id}>
            <SelectTrigger className="w-full min-h-[44px]">
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
            <SelectTrigger className="w-full min-h-[44px]">
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
            <SelectTrigger className="w-full min-h-[44px]">
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
            <SelectTrigger className="w-full min-h-[44px]">
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
            inputMode="decimal"
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
            <SelectTrigger className="w-full min-h-[44px]">
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
            <SelectTrigger className="w-full min-h-[44px]">
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

        <div className="flex items-center gap-3 pt-6">
          <Checkbox
            id="is_featured"
            name="is_featured"
            defaultChecked={vehicle?.is_featured}
            className="size-5"
          />
          <Label htmlFor="is_featured" className="text-base cursor-pointer">
            Онцлох машин болгох
          </Label>
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

      {/* ─── Images Section ─── */}
      <section>
        <div className="mb-2 flex items-center justify-between">
          <Label>
            Зураг ({totalImageCount}/{MAX_IMAGES})
          </Label>
          {totalImageCount > 0 && (
            <span className="text-xs text-muted-foreground">
              {totalImageCount > 0 ? "Зургийг дарж засна" : ""}
            </span>
          )}
        </div>

        <DraggableImageList
          items={imageItems}
          onReorder={setImageItems}
          onRemoveExisting={handleDeleteExisting}
          onRemoveNew={handleRemoveNew}
        />

        {totalImageCount < MAX_IMAGES && (
          <label className="flex w-full sm:w-fit cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border px-4 py-4 text-sm text-muted-foreground hover:border-primary hover:text-primary hover:bg-primary/5 transition-all active:scale-95 min-h-[52px]">
            <ImagePlus className="size-5" />
            Зураг нэмэх
            <input
              ref={imageInputRef}
              type="file"
              name="images"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleFileChange}
            />
          </label>
        )}
        <p className="mt-2 text-xs text-muted-foreground">
          Нэг машинд хамгийн ихдээ 20 зураг байршуулах боломжтой.
          Дэлгэцэн дээр чирж, гар утсан дээр дарж дарааллыг нь өөрчилнэ.
        </p>
      </section>

      {/* ─── Videos Section ─── */}
      <section>
        <Label className="mb-2 block">
          Бичлэг ({existingVideos.length + newVideoFiles.length})
        </Label>

        {existingVideos.length > 0 && (
          <div className="mb-3 space-y-3">
            {existingVideos.map((video) => (
              <div key={video.id} className="group relative rounded-xl overflow-hidden bg-black border border-border">
                <video
                  src={getStorageUrl(video.storage_path)}
                  controls
                  playsInline
                  className="w-full max-h-48 rounded-xl"
                />
                <button
                  type="button"
                  onClick={() => handleDeleteExistingVideo(video.id, video.storage_path)}
                  className="absolute right-2 top-2 rounded-full bg-destructive p-2 text-destructive-foreground opacity-80 hover:opacity-100 transition-opacity shadow-md"
                >
                  <X className="size-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        {newVideoFiles.length > 0 && (
          <div className="mb-3 space-y-2">
            {newVideoFiles.map((file, i) => (
              <div
                key={i}
                className="group flex items-center gap-3 rounded-xl border border-border p-3 bg-muted/30"
              >
                <Video className="size-8 text-muted-foreground shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{file.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {(file.size / (1024 * 1024)).toFixed(1)} MB
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveNewVideo(i)}
                  className="rounded-full bg-destructive p-1.5 text-destructive-foreground shrink-0"
                >
                  <X className="size-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        <label className="flex w-full sm:w-fit cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border px-4 py-4 text-sm text-muted-foreground hover:border-primary hover:text-primary hover:bg-primary/5 transition-all active:scale-95 min-h-[52px]">
          <Video className="size-5" />
          Бичлэг нэмэх
          <input
            ref={videoInputRef}
            type="file"
            name="videos"
            accept="video/*"
            multiple
            className="hidden"
            onChange={handleVideoChange}
          />
        </label>
        <p className="mt-2 text-xs text-muted-foreground">
          MP4, MOV, WebM зэрэг форматууд дэмжинэ.
        </p>
      </section>

      <div className="pt-2">
        <SubmitButton label={vehicle ? "Хадгалах" : "Машин нэмэх"} />
      </div>
    </form>
  );
}
