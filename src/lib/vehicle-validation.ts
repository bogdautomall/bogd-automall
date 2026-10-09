// Shared by the admin form (native input limits, checked before any upload
// starts) and the save actions (server-side backstop).

export const MIN_VEHICLE_YEAR = 1900;
export const MAX_MILEAGE_KM = 999_999;
export const MAX_ENGINE_SIZE_LITERS = 20;

export function maxVehicleYear(): number {
  return new Date().getFullYear() + 1;
}

interface NumberRule {
  name: string;
  label: string;
  required?: boolean;
  min: number;
  max: number;
  hint?: string;
}

function rules(): NumberRule[] {
  return [
    { name: "manufacturing_year", label: "Үйлдвэрлэсэн он", required: true, min: MIN_VEHICLE_YEAR, max: maxVehicleYear() },
    { name: "import_year", label: "Монголд орж ирсэн он", min: MIN_VEHICLE_YEAR, max: maxVehicleYear() },
    { name: "mileage", label: "Гүйлт", min: 0, max: MAX_MILEAGE_KM },
    {
      name: "engine_size",
      label: "Хөдөлгүүрийн багтаамж",
      min: 0.1,
      max: MAX_ENGINE_SIZE_LITERS,
      hint: "Литрээр бичнэ үү (жишээ нь 1.5 эсвэл 2.0), куб см-ээр биш.",
    },
    { name: "price", label: "Үнэ", required: true, min: 0, max: Number.MAX_SAFE_INTEGER },
  ];
}

/** Returns a Mongolian message for the first bad numeric field, or null. */
export function validateVehicleNumbers(formData: FormData): string | null {
  for (const rule of rules()) {
    const raw = String(formData.get(rule.name) ?? "").trim();
    if (raw === "") {
      if (rule.required) return `${rule.label} оруулна уу.`;
      continue;
    }
    const n = Number(raw);
    if (!Number.isFinite(n)) return `${rule.label}: "${raw}" буруу тоо байна.`;
    if (n < rule.min || n > rule.max) {
      const range =
        rule.max === Number.MAX_SAFE_INTEGER ? `${rule.min}-аас дээш` : `${rule.min}–${rule.max}`;
      return `${rule.label}: ${raw} нь зөвшөөрөгдөх хязгаараас (${range}) гадуур байна.${rule.hint ? ` ${rule.hint}` : ""}`;
    }
  }
  return null;
}

/**
 * Postgres reports "numeric field overflow" without saying which column.
 * Echo the submitted numbers so the admin can spot the bad one.
 */
export function describeSaveError(
  action: string,
  error: { code?: string; message: string },
  formData: FormData
): string {
  if (error.code === "22003" || /numeric field overflow/i.test(error.message)) {
    const show = (name: string) => String(formData.get(name) ?? "").trim() || "—";
    return (
      `${action}: тоон талбарын утга хэт том байна. Оруулсан утгууд — ` +
      `Үнэ: ${show("price")}, Гүйлт: ${show("mileage")}, ` +
      `Хөдөлгүүрийн багтаамж: ${show("engine_size")}, ` +
      `Үйлдвэрлэсэн он: ${show("manufacturing_year")}, Орж ирсэн он: ${show("import_year")}.`
    );
  }
  return `${action}: ${error.message}`;
}
