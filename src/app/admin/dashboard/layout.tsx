import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { Car, Users, Settings, LogOut } from "lucide-react";

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
    <div className="flex min-h-screen flex-col md:flex-row">
      {/* ─── Desktop sidebar ─── */}
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

      {/* ─── Main content ─── */}
      <div className="flex flex-1 flex-col min-w-0">
        {/* Mobile top bar */}
        <header className="flex items-center justify-between border-b border-border bg-background px-4 py-3 md:hidden sticky top-0 z-30 shadow-sm">
          <div className="flex items-center gap-2">
            <Image
              src="/logo/logo-256.png"
              alt="Bogd Automall"
              width={28}
              height={28}
              className="rounded-full"
            />
            <span className="font-display text-sm font-bold">BOGD ADMIN</span>
          </div>
          <form action={signOut}>
            <Button variant="ghost" size="sm" type="submit" className="gap-1.5 text-xs">
              <LogOut className="size-4" />
              Гарах
            </Button>
          </form>
        </header>

        {/* Mobile bottom navigation */}
        <nav className="fixed bottom-0 left-0 right-0 z-30 flex border-t border-border bg-background pb-safe md:hidden shadow-[0_-2px_10px_rgba(0,0,0,0.06)]">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-1 flex-col items-center justify-center gap-1 py-3 text-muted-foreground hover:text-primary transition-colors active:scale-95"
            >
              <item.icon className="size-5" />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* Page content — add bottom padding on mobile for the fixed nav */}
        <main className="flex-1 p-4 pb-24 md:p-6 md:pb-6">{children}</main>
      </div>
    </div>
  );
}
