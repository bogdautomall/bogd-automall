import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { LayoutDashboard, Car, Users, Settings, LogOut } from "lucide-react";

import { createClient } from "@/lib/supabase/server";
import { signOut } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/admin/login");

  const { data: admin } = await supabase
    .from("admin_users")
    .select("id, full_name, role")
    .eq("id", user.id)
    .single();

  if (!admin) redirect("/admin/login");

  const NAV = [
    { href: "/admin/dashboard", label: "Машинууд", icon: Car },
    { href: "/admin/dashboard/users", label: "Хэрэглэгчид", icon: Users },
    { href: "/admin/dashboard/settings", label: "Тохиргоо", icon: Settings },
  ];

  return (
    <div className="flex min-h-screen">
      <aside className="hidden w-64 shrink-0 border-r border-border bg-secondary/30 md:flex md:flex-col">
        <div className="flex items-center gap-2 border-b border-border px-6 py-5">
          <Image
            src="/logo/logo-256.png"
            alt="Bogd Automall"
            width={32}
            height={32}
            className="rounded-full"
          />
          <span className="font-display text-sm font-bold">BOGD ADMIN</span>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-4">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium text-foreground/80 transition-colors hover:bg-secondary hover:text-foreground"
            >
              <item.icon className="size-4" />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="border-t border-border p-4">
          <p className="truncate text-xs text-muted-foreground">
            {admin.full_name || user.email}
          </p>
          <p className="text-xs font-medium text-primary">{admin.role}</p>
          <form action={signOut} className="mt-3">
            <Button variant="outline" size="sm" className="w-full" type="submit">
              <LogOut className="size-4" /> Гарах
            </Button>
          </form>
        </div>
      </aside>

      <div className="flex-1">
        <header className="flex items-center justify-between border-b border-border px-6 py-4 md:hidden">
          <div className="flex items-center gap-2">
            <LayoutDashboard className="size-5 text-primary" />
            <span className="font-display font-bold">BOGD ADMIN</span>
          </div>
          <form action={signOut}>
            <Button variant="ghost" size="icon" type="submit">
              <LogOut className="size-4" />
            </Button>
          </form>
        </header>

        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
