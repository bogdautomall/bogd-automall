import Link from "next/link";
import { Button } from "@/components/ui/button";

export function InventoryPagination({
  currentPage,
  totalPages,
  searchParams,
  basePath = "/",
}: {
  currentPage: number;
  totalPages: number;
  searchParams: Record<string, string | undefined>;
  basePath?: string;
}) {
  if (totalPages <= 1) return null;

  function hrefFor(page: number) {
    const params = new URLSearchParams(
      Object.entries(searchParams).filter(([, v]) => v !== undefined) as [
        string,
        string
      ][]
    );
    params.set("page", String(page));
    return `${basePath}?${params.toString()}#listings`;
  }

  return (
    <div className="mt-10 flex items-center justify-center gap-2">
      <Button
        variant="outline"
        size="sm"
        disabled={currentPage <= 1}
        asChild={currentPage > 1}
      >
        {currentPage > 1 ? (
          <Link href={hrefFor(currentPage - 1)}>Өмнөх</Link>
        ) : (
          <span>Өмнөх</span>
        )}
      </Button>

      <span className="px-3 text-sm text-muted-foreground font-mono">
        {currentPage} / {totalPages}
      </span>

      <Button
        variant="outline"
        size="sm"
        disabled={currentPage >= totalPages}
        asChild={currentPage < totalPages}
      >
        {currentPage < totalPages ? (
          <Link href={hrefFor(currentPage + 1)}>Дараах</Link>
        ) : (
          <span>Дараах</span>
        )}
      </Button>
    </div>
  );
}
