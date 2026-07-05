"use client";

import Link from "next/link";
import { ShieldCheck, Wallet, Truck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { MountainDivider } from "@/components/mountain-divider";
import { VehicleCard } from "@/components/vehicle-card";
import { useLanguage } from "@/lib/i18n/language-context";
import type { Vehicle } from "@/types/vehicle";

export function HomeContent({ featured }: { featured: Vehicle[] }) {
  const { t } = useLanguage();

  const HIGHLIGHTS = [
    { icon: ShieldCheck, title: t.home.highlight1Title, body: t.home.highlight1Body },
    { icon: Wallet, title: t.home.highlight2Title, body: t.home.highlight2Body },
    { icon: Truck, title: t.home.highlight3Title, body: t.home.highlight3Body },
  ];

  return (
    <main>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-0 h-[36rem] w-[64rem] -translate-x-1/2 -translate-y-1/3 rounded-full bg-primary/20 blur-[120px]"
        />

        <div className="relative mx-auto max-w-4xl px-6 pt-24 pb-20 text-center">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-primary">
            {t.home.eyebrow}
          </p>
          <h1 className="mt-5 text-balance font-display text-4xl font-extrabold tracking-tight sm:text-6xl">
            {t.home.titleLine1}
            <br />
            <span className="text-primary">{t.home.titleLine2}</span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-balance text-muted-foreground">
            {t.home.subtitle}
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
            <Button size="lg" asChild>
              <Link href="/inventory">{t.home.ctaInventory}</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/about">{t.home.ctaAbout}</Link>
            </Button>
          </div>
        </div>

        <MountainDivider variant="fill" className="h-20 text-secondary/60" />
      </section>

      {/* Trust highlights */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-8 sm:grid-cols-3">
          {HIGHLIGHTS.map(({ icon: Icon, title, body }) => (
            <div key={title} className="text-center sm:text-left">
              <div className="mx-auto flex size-11 items-center justify-center rounded-full bg-primary/10 text-primary sm:mx-0">
                <Icon className="size-5" />
              </div>
              <h3 className="mt-4 font-display text-lg font-semibold">
                {title}
              </h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured vehicles or honest placeholder */}
      {featured.length > 0 ? (
        <section className="border-t border-border/60 bg-secondary/30">
          <div className="mx-auto max-w-6xl px-6 py-20">
            <div className="flex items-end justify-between">
              <h2 className="font-display text-2xl font-bold sm:text-3xl">
                {t.home.featuredTitle}
              </h2>
              <Link
                href="/inventory"
                className="text-sm font-medium text-primary hover:underline"
              >
                {t.home.featuredSeeAll}
              </Link>
            </div>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {featured.map((vehicle) => (
                <VehicleCard key={vehicle.id} vehicle={vehicle} />
              ))}
            </div>
          </div>
        </section>
      ) : (
        <section className="border-t border-border/60 bg-secondary/30">
          <div className="mx-auto max-w-4xl px-6 py-20 text-center">
            <h2 className="font-display text-2xl font-bold sm:text-3xl">
              {t.home.comingSoonTitle}
            </h2>
            <p className="mx-auto mt-3 max-w-md text-muted-foreground">
              {t.home.comingSoonBody}
            </p>
            <div className="mt-8">
              <Button asChild>
                <Link href="/contact">{t.home.comingSoonCta}</Link>
              </Button>
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
