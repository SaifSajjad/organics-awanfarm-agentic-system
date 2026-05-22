import { Truck } from "lucide-react";
import { AppHeader } from "@/components/app-header";
import { RiderDashboardClient } from "@/components/rider-dashboard-client";

export default function RiderDashboardPage() {
  return (
    <main className="min-h-screen bg-farm-cream">
      <AppHeader />
      <section className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-farm-leaf">Rider App</p>
            <h1 className="mt-2 text-3xl font-black text-farm-green">Today&apos;s Route</h1>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
              Mobile-focused delivery list for route checking and delivery completion.
            </p>
          </div>
          <Truck className="h-8 w-8 text-farm-green" />
        </div>

        <RiderDashboardClient />
      </section>
    </main>
  );
}
