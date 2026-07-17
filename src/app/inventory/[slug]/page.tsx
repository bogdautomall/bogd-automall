import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";

import { getVehicleBySlug, getRelatedVehicles } from "@/lib/queries/vehicles";
import { formatPrice, formatMileage } from "@/lib/format";
import { getStorageUrl } from "@/lib/supabase/storage";
import { VehicleGallery } from "@/components/vehicle-gallery";
import { ShareButtons } from "@/components/share-buttons";
import { VehicleCard } from "@/components/vehicle-card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const vehicle = await getVehicleBySlug(slug);

  if (!vehicle) return { title: "Олдсонгүй" };

  const title = `${vehicle.brand.name_mn} ${vehicle.model.name_mn} ${vehicle.manufacturing_year}`;
  const description =
    vehicle.description_mn?.slice(0, 155) ||
    `${title} — ${formatPrice(Number(vehicle.price), vehicle.currency)}. Bogd Automall дээрээс дэлгэрэнгүй үзнэ үү.`;
  const image = vehicle.vehicle_images?.[0]
    ? getStorageUrl(vehicle.vehicle_images[0].storage_path)
    : undefined;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: image ? [{ url: image, width: 1200, height: 630 }] : undefined,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: image ? [image] : undefined,
    },
  };
}

export default async function VehicleDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const vehicle = await getVehicleBySlug(slug);

  if (!vehicle) notFound();

  const related = await getRelatedVehicles(vehicle);
  const title = `${vehicle.brand.name_mn} ${vehicle.model.name_mn}`;

  const specs = [
    ["Үйлдвэрлэсэн он", String(vehicle.manufacturing_year)],
    ["Монголд орж ирсэн он", vehicle.import_year ? String(vehicle.import_year) : "—"],
    ["Гүйлт", formatMileage(vehicle.mileage)],
    ["Шатахуун", vehicle.fuel_type?.name_mn ?? "—"],
    ["Хурдны хайрцаг", vehicle.transmission?.name_mn ?? "—"],
    ["Хөтлөгч", vehicle.drive_type?.name_mn ?? "—"],
    ["Бүтэц", vehicle.body_type?.name_mn ?? "—"],
    [
      "Хөдөлгүүр",
      [vehicle.engine_size ? `${vehicle.engine_size}Л` : null, vehicle.engine_type]
        .filter(Boolean)
        .join(" · ") || "—",
    ],
    [
      "Жолооны хүрд",
      vehicle.steering_position === "left"
        ? "Зүүн"
        : vehicle.steering_position === "right"
          ? "Баруун"
          : "—",
    ],
    ["Гадна өнгө", vehicle.exterior_color?.name_mn ?? "—"],
    ["Дотор өнгө", vehicle.interior_color?.name_mn ?? "—"],
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Vehicle",
    name: `${title} ${vehicle.manufacturing_year}`,
    brand: vehicle.brand.name_en,
    model: vehicle.model.name_en,
    vehicleModelDate: String(vehicle.manufacturing_year),
    mileageFromOdometer: vehicle.mileage
      ? { "@type": "QuantitativeValue", value: vehicle.mileage, unitCode: "KMT" }
      : undefined,
    offers: {
      "@type": "Offer",
      price: vehicle.price,
      priceCurrency: vehicle.currency,
      availability:
        vehicle.availability_status === "available"
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
    },
  };

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      {/* JSON-LD structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-1.5 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-primary">
          Нүүр
        </Link>
        <ChevronRight className="size-3.5" />
        <Link href="/#vehicle-listings-head" className="hover:text-primary">
          Каталог
        </Link>
        <ChevronRight className="size-3.5" />
        <span className="text-foreground">{title}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr]">
        <div>
          <VehicleGallery images={vehicle.vehicle_images} alt={title} />

          {vehicle.vehicle_videos && vehicle.vehicle_videos.length > 0 && (
            <div className="mt-6 space-y-3">
              <h2 className="font-display text-lg font-semibold">Видео</h2>
              {vehicle.vehicle_videos.map((video) => (
                <video
                  key={video.id}
                  controls
                  className="w-full rounded-lg bg-black"
                  src={getStorageUrl(video.storage_path)}
                />
              ))}
            </div>
          )}

          <Separator className="my-8" />

          <div>
            <h2 className="font-display text-lg font-semibold">Тодорхойлолт</h2>
            <p className="mt-3 whitespace-pre-line text-muted-foreground">
              {vehicle.description_mn || "Тодорхойлолт нэмэгдээгүй байна."}
            </p>
          </div>

          <Separator className="my-8" />

          <div>
            <h2 className="font-display text-lg font-semibold">
              Техникийн үзүүлэлт
            </h2>
            <dl className="mt-4 grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-2">
              {specs.map(([label, value]) => (
                <div
                  key={label}
                  className="flex items-center justify-between border-b border-border/60 py-2 text-sm"
                >
                  <dt className="text-muted-foreground">{label}</dt>
                  <dd className="font-mono font-medium">{value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        {/* Sticky price/action panel */}
        <div className="h-fit lg:sticky lg:top-24">
          <div className="rounded-lg border border-border bg-card p-6">
            <div className="flex items-center gap-2">
              {vehicle.is_featured && <Badge>Онцлох</Badge>}
              {vehicle.availability_status === "sold" && (
                <Badge variant="destructive">Зарагдсан</Badge>
              )}
              {vehicle.availability_status === "reserved" && (
                <Badge variant="secondary">Захиалгатай</Badge>
              )}
            </div>

            <h1 className="mt-3 font-display text-2xl font-bold">
              {title} {vehicle.manufacturing_year}
            </h1>

            <p className="mt-2 font-mono text-3xl font-bold text-primary">
              {formatPrice(Number(vehicle.price), vehicle.currency)}
            </p>

            <div className="mt-6 flex gap-2">
              <ShareButtons title={`${title} ${vehicle.manufacturing_year}`} />
            </div>

            <Separator className="my-6" />

            <p className="text-sm text-muted-foreground">
              Энэ машины талаар дэлгэрэнгүй мэдээлэл авах бол бидэнтэй
              холбогдоно уу.
            </p>
            <Link
              href="/contact"
              className="mt-3 inline-block text-sm font-medium text-primary hover:underline"
            >
              Холбоо барих →
            </Link>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <div className="mt-16">
          <h2 className="font-display text-xl font-bold">Төстэй машинууд</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {related.map((v) => (
              <VehicleCard key={v.id} vehicle={v} />
            ))}
          </div>
        </div>
      )}
    </main>
  );
}
