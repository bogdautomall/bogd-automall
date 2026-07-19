"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function signIn(
  _prevState: { error: string | null },
  formData: FormData
): Promise<{ error: string | null }> {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Имэйл болон нууц үгээ оруулна уу." };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: "Имэйл эсвэл нууц үг буруу байна." };
  }

  // Confirm this user is actually a registered admin, not just any
  // Supabase Auth user — auth success alone doesn't grant panel access.
  const { data: adminRow } = await supabase
    .from("admin_users")
    .select("id")
    .eq("id", data.user.id)
    .single();

  if (!adminRow) {
    await supabase.auth.signOut();
    return { error: "Энэ хаяг админы эрхгүй байна." };
  }

  redirect("/admin/dashboard");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}
