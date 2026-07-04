"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";

/**
 * Visual language switch. Currently a display-only toggle between MN/EN —
 * wiring this to actual route-based i18n (so it changes real page content)
 * is a separate Phase 3 task once page copy exists in both languages.
 */
export function LanguageToggle() {
  const [lang, setLang] = React.useState<"MN" | "EN">("MN");

  return (
    <Button
      variant="ghost"
      size="sm"
      className="font-mono text-xs tracking-wider"
      onClick={() => setLang((l) => (l === "MN" ? "EN" : "MN"))}
      aria-label="Switch language"
    >
      {lang}
    </Button>
  );
}
