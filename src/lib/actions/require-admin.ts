import { createClient } from "@/lib/supabase/server";

/**
 * Verifies the caller is a logged-in admin before allowing a mutation.
 * The dashboard layout already blocks non-admins from reaching these
 * pages, but Server Actions are callable directly, so every mutating
 * action re-checks here too.
 */
export async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Нэвтрээгүй байна.");

  const { data: admin } = await supabase
    .from("admin_users")
    .select("id, role")
    .eq("id", user.id)
    .single();

  if (!admin) throw new Error("Админы эрхгүй байна.");

  return { supabase, user, admin };
}
