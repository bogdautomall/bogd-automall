"use client";

import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/i18n/language-context";

export function LanguageToggle() {
  const { locale, setLocale } = useLanguage();

  return (
    <Button
      variant="ghost"
      size="sm"
      className="font-mono text-xs tracking-wider"
      onClick={() => setLocale(locale === "mn" ? "en" : "mn")}
      aria-label="Switch language"
    >
      {locale === "mn" ? "MN" : "EN"}
    </Button>
  );
}
