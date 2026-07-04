export function formatPrice(price: number, currency: string = "MNT"): string {
  if (currency === "MNT") {
    return `${new Intl.NumberFormat("mn-MN").format(price)}₮`;
  }
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(price);
}

export function formatMileage(km: number | null): string {
  if (km === null || km === undefined) return "—";
  return `${new Intl.NumberFormat("mn-MN").format(km)} км`;
}
