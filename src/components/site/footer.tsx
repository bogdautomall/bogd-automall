"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Phone, Mail, MapPin } from "lucide-react";

import { MountainDivider } from "@/components/mountain-divider";

export function Footer() {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) return null;

  return (
    <footer className="relative border-t border-border/60 bg-secondary/40">
      <MountainDivider
        variant="line"
        flip
        className="absolute -top-px left-0 h-6 text-primary/50"
      />

      <div className="mx-auto max-w-7xl px-6 py-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-3">
              <Image
                src="/logo/logo-256.png"
                alt="Bogd Automall"
                width={36}
                height={36}
                className="rounded-full"
              />
              <span className="font-display text-base font-bold tracking-wide">
                BOGD AUTOMALL
              </span>
            </div>
            <p className="mt-4 text-sm text-muted-foreground max-w-xs">
              Таны итгэлтэй хамтрагч — чанартай автомашин сонголт, найдвартай
              үйлчилгээ.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold tracking-wide uppercase text-foreground/90">
              Шуурхай холбоос
            </h3>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/inventory" className="hover:text-primary">
                  Каталог
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-primary">
                  Бидний тухай
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-primary">
                  Холбоо барих
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold tracking-wide uppercase text-foreground/90">
              Эрх зүй
            </h3>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/privacy" className="hover:text-primary">
                  Нууцлалын бодлого
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-primary">
                  Үйлчилгээний нөхцөл
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold tracking-wide uppercase text-foreground/90">
              Холбоо барих
            </h3>
            <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <Phone className="size-4 text-primary" />
                <span>+976 XXXX XXXX</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="size-4 text-primary" />
                <span>info@bogdautomall.mn</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="size-4 text-primary" />
                <span>Улаанбаатар, Монгол</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-border/60 pt-6 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} Bogd Automall. Бүх эрх хуулиар
          хамгаалагдсан.
        </div>
      </div>
    </footer>
  );
}
