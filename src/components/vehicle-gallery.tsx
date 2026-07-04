"use client";

import * as React from "react";
import Image from "next/image";
import { Car, Expand } from "lucide-react";

import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { getStorageUrl } from "@/lib/supabase/storage";
import { cn } from "@/lib/utils";
import type { VehicleImage } from "@/types/vehicle";

export function VehicleGallery({
  images,
  alt,
}: {
  images: VehicleImage[];
  alt: string;
}) {
  const [activeIndex, setActiveIndex] = React.useState(0);

  if (images.length === 0) {
    return (
      <div className="flex aspect-[16/10] w-full items-center justify-center rounded-lg bg-secondary text-muted-foreground">
        <Car className="size-16" strokeWidth={1} />
      </div>
    );
  }

  const active = images[activeIndex];

  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
          <button className="group relative block aspect-[16/10] w-full overflow-hidden rounded-lg bg-secondary">
            <Image
              src={getStorageUrl(active.storage_path)}
              alt={alt}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 66vw"
              priority
            />
            <span className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-md bg-background/80 px-2.5 py-1.5 text-xs font-medium opacity-0 backdrop-blur transition-opacity group-hover:opacity-100">
              <Expand className="size-3.5" /> Томруулах
            </span>
          </button>
        </DialogTrigger>
        <DialogContent className="max-w-4xl border-none bg-transparent p-0 shadow-none">
          <div className="relative aspect-[16/10] w-full overflow-hidden rounded-lg">
            <Image
              src={getStorageUrl(active.storage_path)}
              alt={alt}
              fill
              className="object-contain bg-black"
              sizes="100vw"
            />
          </div>
        </DialogContent>
      </Dialog>

      {images.length > 1 && (
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {images.map((img, i) => (
            <button
              key={img.id}
              onClick={() => setActiveIndex(i)}
              className={cn(
                "relative size-16 shrink-0 overflow-hidden rounded-md ring-2 ring-transparent transition-all",
                i === activeIndex && "ring-primary"
              )}
            >
              <Image
                src={getStorageUrl(img.storage_path)}
                alt={`${alt} — зураг ${i + 1}`}
                fill
                className="object-cover"
                sizes="64px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
