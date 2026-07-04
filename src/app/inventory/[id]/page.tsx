/**
 * Vehicle detail page — image gallery, specs, description, related vehicles.
 *
 * Phase 1 placeholder. Real implementation (gallery with zoom/fullscreen,
 * video support, structured data/SEO, Supabase fetch by id) is built in
 * Phase 3.
 */
export default async function VehicleDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <main className="mx-auto max-w-6xl px-6 py-16">
      <h1 className="text-3xl font-bold tracking-tight">
        Vehicle #{id}
      </h1>
      <p className="text-muted-foreground mt-2">
        Full vehicle detail page (gallery, specs, description) will be built
        here in Phase 3.
      </p>
    </main>
  );
}
