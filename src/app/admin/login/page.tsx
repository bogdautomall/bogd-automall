"use client";

import { useActionState } from "react";
import Image from "next/image";

import { signIn } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function AdminLoginPage() {
  const [state, formAction, pending] = useActionState(signIn, { error: null });

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background to-secondary/30 px-4 py-12">
      <div className="w-full max-w-sm">
        {/* Logo & title */}
        <div className="mb-8 flex flex-col items-center gap-3 text-center">
          <Image
            src="/logo/logo-256.png"
            alt="Bogd Automall"
            width={64}
            height={64}
            className="rounded-2xl shadow-lg"
          />
          <div>
            <h1 className="font-display text-2xl font-bold tracking-tight">
              BOGD ADMIN
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Зөвхөн Bogd Automall ажилтнуудад
            </p>
          </div>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-border bg-card shadow-xl px-6 py-8">
          <form action={formAction} className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Имэйл
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="admin@bogdautomall.mn"
                required
                autoComplete="email"
                className="min-h-[48px] text-base"
                inputMode="email"
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="password" className="text-sm font-medium">
                Нууц үг
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                autoComplete="current-password"
                className="min-h-[48px] text-base"
              />
            </div>

            {state?.error && (
              <div className="rounded-lg bg-destructive/10 border border-destructive/20 px-4 py-3">
                <p className="text-sm text-destructive font-medium">{state.error}</p>
              </div>
            )}

            <Button
              type="submit"
              className="mt-1 min-h-[52px] w-full rounded-xl text-base font-semibold"
              disabled={pending}
            >
              {pending ? "Нэвтэрч байна..." : "Нэвтрэх"}
            </Button>
          </form>
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} Bogd Automall
        </p>
      </div>
    </main>
  );
}
