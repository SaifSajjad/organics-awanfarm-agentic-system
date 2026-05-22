import { AppHeader } from "@/components/app-header";
import { AdminDashboardClient } from "@/components/admin-dashboard-client";

export default function AdminDashboardPage() {
  return (
    <main className="min-h-screen bg-farm-cream">
      <AppHeader />
      <AdminDashboardClient />
    </main>
  );
}
