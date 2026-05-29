import { AppHeader } from "@/components/app-header";
import { RiderDashboardClient } from "@/components/rider-dashboard-client";

export default function RiderDashboardPage() {
  return (
    <main className="min-h-screen bg-farm-cream">
      <AppHeader />
      <section className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
        <RiderDashboardClient />
      </section>
    </main>
  );
}
