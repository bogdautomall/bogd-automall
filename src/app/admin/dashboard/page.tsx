import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

/**
 * Admin dashboard — vehicle management, image/video upload, user
 * management, settings, audit logs.
 *
 * Phase 1 placeholder. Real implementation, protected by Supabase Auth
 * + role-based permissions, is built in Phase 5.
 */
export default function AdminDashboardPage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-16">
      <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
      <p className="text-muted-foreground mt-2 mb-8">
        Vehicle management, uploads, and settings will be built here in
        Phase 5.
      </p>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Vehicles</CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground text-sm">
            Coming in Phase 5
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Users</CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground text-sm">
            Coming in Phase 5
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Settings</CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground text-sm">
            Coming in Phase 5
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
