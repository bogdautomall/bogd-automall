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

/**
 * Admin login page.
 *
 * Phase 1 placeholder — real Supabase Auth wiring (email/password or
 * Google sign-in, session handling, redirect on success) is built in
 * Phase 5 (Admin Panel).
 */
export default function AdminLoginPage() {
  return (
    <main className="flex min-h-[80vh] items-center justify-center px-6">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Admin Sign In</CardTitle>
          <CardDescription>
            Bogd Automall staff access only.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="you@bogdautomall.mn" disabled />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" disabled />
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full" disabled>
            Sign In (wired up in Phase 5)
          </Button>
        </CardFooter>
      </Card>
    </main>
  );
}
