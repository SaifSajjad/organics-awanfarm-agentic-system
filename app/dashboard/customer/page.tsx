import { CalendarDays, MessageCircle, Milk, PauseCircle } from "lucide-react";
import { AppHeader } from "@/components/app-header";
import { formatCurrency } from "@/lib/utils";

export default function CustomerDashboardPage() {
  const monthlyBill = 2 * 330 * 30;

  return (
    <main className="min-h-screen bg-farm-cream">
      <AppHeader />
      <section className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-farm-leaf">Customer App</p>
        <h1 className="mt-2 text-3xl font-black text-farm-green">My Milk Subscription</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Customer-facing demo for subscription status, billing, and quick support actions.
        </p>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-md border bg-white p-5 shadow-sm md:col-span-2">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-farm-green">Daily Cow Milk</h2>
                <p className="mt-2 text-muted-foreground">Model Town, Lahore</p>
              </div>
              <Milk className="h-7 w-7 text-farm-green" />
            </div>
            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <div className="rounded-md bg-farm-cream p-4">
                <p className="text-sm text-muted-foreground">Daily Qty</p>
                <p className="text-2xl font-bold">2L</p>
              </div>
              <div className="rounded-md bg-farm-cream p-4">
                <p className="text-sm text-muted-foreground">Rate</p>
                <p className="text-2xl font-bold">{formatCurrency(330)}</p>
              </div>
              <div className="rounded-md bg-farm-cream p-4">
                <p className="text-sm text-muted-foreground">Monthly Bill</p>
                <p className="text-2xl font-bold">{formatCurrency(monthlyBill)}</p>
              </div>
            </div>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <button className="inline-flex items-center justify-center gap-2 rounded-md bg-farm-green px-4 py-3 font-semibold text-white">
                <CalendarDays className="h-5 w-5" />
                Request Extra Milk
              </button>
              <button className="inline-flex items-center justify-center gap-2 rounded-md border bg-white px-4 py-3 font-semibold text-farm-green">
                <PauseCircle className="h-5 w-5" />
                Pause Delivery
              </button>
            </div>
          </div>

          <div className="rounded-md border bg-white p-5 shadow-sm">
            <h2 className="text-xl font-bold text-farm-green">Support</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Report missed delivery or ask the support agent for help.
            </p>
            <a
              href="https://wa.me/923395235323"
              className="mt-6 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-md bg-secondary px-4 py-3 font-semibold"
            >
              <MessageCircle className="h-5 w-5" />
              WhatsApp Farm
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
