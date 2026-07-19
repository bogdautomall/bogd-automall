"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Phone, Mail, MapPin } from "lucide-react";

import { MountainDivider } from "@/components/mountain-divider";
import { FacebookIcon, InstagramIcon } from "@/components/icons";
import { useLanguage } from "@/lib/i18n/language-context";

const PHONE_NUMBERS = ["80892202", "80372202"];
const EMAIL = "bogd.automall@gmail.com";
const FACEBOOK_URL = "https://www.facebook.com/Bogd.Automall";
const INSTAGRAM_URL = "https://www.instagram.com/bogd_automall";

export function Footer() {
  const pathname = usePathname();
  const { t } = useLanguage();
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
              {t.footer.tagline}
            </p>
            <div className="mt-4 flex items-center gap-3">
              <a
                href={FACEBOOK_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="flex size-8 items-center justify-center rounded-full bg-secondary text-foreground/70 transition-colors hover:bg-primary hover:text-primary-foreground"
              >
                <FacebookIcon className="size-4" />
              </a>
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="flex size-8 items-center justify-center rounded-full bg-secondary text-foreground/70 transition-colors hover:bg-primary hover:text-primary-foreground"
              >
                <InstagramIcon className="size-4" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold tracking-wide uppercase text-foreground/90">
              {t.footer.quickLinks}
            </h3>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/#listings" className="hover:text-primary">
                  {t.nav.inventory}
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-primary">
                  {t.nav.about}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-primary">
                  {t.nav.contact}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold tracking-wide uppercase text-foreground/90">
              {t.footer.legal}
            </h3>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/privacy" className="hover:text-primary">
                  {t.footer.privacy}
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-primary">
                  {t.footer.terms}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold tracking-wide uppercase text-foreground/90">
              {t.footer.contact}
            </h3>
            <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <Phone className="mt-0.5 size-4 shrink-0 text-primary" />
                <span>{PHONE_NUMBERS.join(", ")}</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="size-4 shrink-0 text-primary" />
                <a href={`mailto:${EMAIL}`} className="hover:text-primary">
                  {EMAIL}
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 size-4 shrink-0 text-primary" />
                <span>{t.contact.address}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-border/60 pt-6 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} Bogd Automall. {t.footer.rights}
        </div>
      </div>
    </footer>
  );
}
