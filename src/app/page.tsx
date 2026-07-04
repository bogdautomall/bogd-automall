import { Button } from "@/components/ui/button";

/**
 * Home page.
 *
 * Phase 1 placeholder — this will become the marketing homepage:
 * hero section, featured vehicles, brand highlights, CTA to inventory.
 * Real content and design system are built in Phase 3 (Core Public Site).
 */
export default function HomePage() {
  return (
    <main className="flex min-h-[80vh] flex-col items-center justify-center gap-6 px-6 text-center">
      <h1 className="text-4xl font-bold tracking-tight">Bogd Automall</h1>
      <p className="text-muted-foreground max-w-md">
        Premium vehicle dealership platform — under construction. This
        placeholder will be replaced with the full homepage in Phase 3.
      </p>
      <Button size="lg">View Inventory</Button>
    </main>
  );
}
