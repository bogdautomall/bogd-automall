import { cn } from "@/lib/utils";

/**
 * Signature visual motif: a mountain-ridge horizon line, echoing the
 * literal Bogd Khan mountain the dealership is named after (and the
 * peak shape in the logo). Used as a section divider throughout the
 * site — hero bottom, footer top — so the brand's namesake recurs as
 * a structural device rather than a one-off decoration.
 *
 * variant="line"  — thin stroked ridge, sits inside a section as a divider
 * variant="fill"  — solid silhouette, used to transition into a section
 */
export function MountainDivider({
  className,
  variant = "line",
  flip = false,
}: {
  className?: string;
  variant?: "line" | "fill";
  flip?: boolean;
}) {
  const ridge =
    "M0,150 L90,120 L170,145 L260,80 L340,130 L430,55 L520,135 L610,95 L700,150 L790,70 L880,140 L970,100 L1060,150 L1150,115 L1250,145 L1340,90 L1440,130";

  return (
    <svg
      viewBox="0 0 1440 200"
      preserveAspectRatio="none"
      className={cn("w-full", flip && "-scale-y-100", className)}
      aria-hidden="true"
    >
      {variant === "fill" ? (
        <path
          d={`${ridge} L1440,200 L0,200 Z`}
          className="fill-current"
        />
      ) : (
        <path
          d={ridge}
          fill="none"
          className="stroke-current"
          strokeWidth={2}
          strokeLinejoin="round"
          strokeLinecap="round"
        />
      )}
    </svg>
  );
}
