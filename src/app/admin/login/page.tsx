"use client";

import { useActionState } from "react";
import Image from "next/image";

import { signIn } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

export default function AdminLoginPage() {
  const [state, formAction, pending] = useActionState(signIn, { error: null });

  return (
    <main className="flex min-h-[80vh] items-center justify-center px-6">
      <Card className="w-full max-w-sm">
        <CardHeader className="items-center text-center">
          <Image
            src="/logo/logo-256.png"
            alt="Bogd Automall"
            width={56}
            height={56}
            className="rounded-full"
          />
          <CardTitle className="mt-2">Admin нэвтрэх</CardTitle>
          <CardDescription>Зөвхөн Bogd Automall ажилтнуудад зориулав.</CardDescription>
        </CardHeader>
        <form action={formAction}>
          <CardContent className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="email">Имэйл</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="admin@bogdautomall.mn"
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="password">Нууц үг</Label>
              <Input id="password" name="password" type="password" required />
            </div>
            {state?.error && (
              <p className="text-sm text-destructive">{state.error}</p>
            )}
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={pending}>
              {pending ? "Нэвтэрч байна..." : "Нэвтрэх"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </main>
  );
}
