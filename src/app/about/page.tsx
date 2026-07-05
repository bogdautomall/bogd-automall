"use client";

import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { MountainDivider } from "@/components/mountain-divider";
import { useLanguage } from "@/lib/i18n/language-context";

export default function AboutPage() {
  const { t } = useLanguage();

  const points = [t.about.point1, t.about.point2, t.about.point3, t.about.point4];

  return (
    <main>
      <section className="mx-auto max-w-3xl px-6 pt-16 pb-10 text-center">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-primary">
          {t.about.slogan}
        </p>
        <h1 className="mt-4 font-display text-3xl font-bold sm:text-4xl">
          {t.about.title}
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-muted-foreground">
          {t.about.intro}
        </p>
      </section>

      <MountainDivider variant="line" className="mx-auto h-10 max-w-3xl text-primary/40" />

      <section className="mx-auto max-w-3xl px-6 py-14">
        <h2 className="font-display text-xl font-semibold">{t.about.body1Title}</h2>
        <p className="mt-3 text-muted-foreground">{t.about.body1}</p>

        <h2 className="mt-10 font-display text-xl font-semibold">
          {t.about.body2Title}
        </h2>
        <ul className="mt-4 space-y-3">
          {points.map((point) => (
            <li key={point} className="flex items-start gap-3 text-sm">
              <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
              <span>{point}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="border-t border-border/60 bg-secondary/30">
        <div className="mx-auto max-w-3xl px-6 py-14 text-center">
          <h2 className="font-display text-xl font-bold sm:text-2xl">
            {t.about.ctaTitle}
          </h2>
          <div className="mt-6">
            <Button asChild size="lg">
              <Link href="/inventory">{t.about.ctaButton}</Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
