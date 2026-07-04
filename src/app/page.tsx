import Link from "next/link";
import { ShieldCheck, Wallet, Truck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { MountainDivider } from "@/components/mountain-divider";

const HIGHLIGHTS = [
  {
    icon: ShieldCheck,
    title: "Баталгаат чанар",
    body: "Машин бүр манай нарийн шалгуураар нягт нямбай шалгагдсан.",
  },
  {
    icon: Wallet,
    title: "Уян хатан төлбөр",
    body: "Бэлэн мөнгө болон зээлийн уян хатан нөхцлүүд.",
  },
  {
    icon: Truck,
    title: "Хүргэлтийн үйлчилгээ",
    body: "Улаанбаатар хот дотор хүргэж өгөх боломжтой.",
  },
];

export default function HomePage() {
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
            Bogd Automall
          </p>
          <h1 className="mt-5 text-balance font-display text-4xl font-extrabold tracking-tight sm:text-6xl">
            Таны итгэлтэй
            <br />
            <span className="text-primary">автомашины сонголт</span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-balance text-muted-foreground">
            Богд Автомолл — чанар баталгаажсан автомашины том сонголт,
            ил тод үнэ, найдвартай үйлчилгээ нэг дороос.
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
            <Button size="lg" asChild>
              <Link href="/inventory">Каталог үзэх</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/about">Бидний тухай</Link>
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

      {/* Inventory teaser — honest placeholder until vehicles are added */}
      <section className="border-t border-border/60 bg-secondary/30">
        <div className="mx-auto max-w-4xl px-6 py-20 text-center">
          <h2 className="font-display text-2xl font-bold sm:text-3xl">
            Каталог бэлтгэгдэж байна
          </h2>
          <p className="mx-auto mt-3 max-w-md text-muted-foreground">
            Удахгүй манай бүрэн сонголтыг эндээс үзэх боломжтой болно.
            Одоохондоо машин сонголтын талаар лавлах бол бидэнтэй холбогдоно уу.
          </p>
          <div className="mt-8">
            <Button asChild>
              <Link href="/contact">Холбоо барих</Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
