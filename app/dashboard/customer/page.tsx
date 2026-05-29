import {
  AlertTriangle,
  Bot,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Droplets,
  GlassWater,
  MessageCircle,
  PauseCircle,
  Plus,
  Sparkles,
  Wallet
} from "lucide-react";
import { AppHeader } from "@/components/app-header";
import { formatCurrency } from "@/lib/utils";

export default function CustomerDashboardPage() {
  const dailyLiters = 2;
  const ratePerLiter = 330;
  const monthlyBill = dailyLiters * ratePerLiter * 30;

  const deliveryHistory = [
    { date: "May 28, 2026", quantity: "2L", status: "Delivered", payment: "Paid" },
    { date: "May 27, 2026", quantity: "2L", status: "Delivered", payment: "Paid" },
    { date: "May 26, 2026", quantity: "2L", status: "Delivered", payment: "Pending" }
  ];

  return (
    <main className="min-h-screen bg-farm-cream">
      <AppHeader />

      <section className="relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
          <div className="glass-card relative overflow-hidden border-farm-green/10 bg-white/70 p-6 sm:p-7">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(200,159,65,0.16),transparent_42%)]" />
            <div className="relative z-10">
              <p className="inline-flex items-center gap-2 rounded-md border border-farm-green/10 bg-farm-cream px-3 py-1.5 text-xs font-black uppercase tracking-[0.16em] text-farm-green">
                <Sparkles className="h-4 w-4 text-farm-wheat" />
                Customer Dashboard
              </p>
              <h1 className="mt-3 font-display text-3xl font-black text-farm-green sm:text-4xl">
                Morning Milk, Simplified
              </h1>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-muted-foreground sm:text-base">
                Manage your subscription, billing, and support requests from one premium self-service workspace.
              </p>

              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                <div className="rounded-md border border-farm-green/10 bg-white/80 p-4 backdrop-blur">
                  <p className="text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground">Plan</p>
                  <p className="mt-1 text-lg font-black text-farm-green">Daily Cow Milk</p>
                </div>
                <div className="rounded-md border border-farm-green/10 bg-white/80 p-4 backdrop-blur">
                  <p className="text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground">Next Delivery</p>
                  <p className="mt-1 text-lg font-black text-farm-green">Tomorrow 7:00 AM</p>
                </div>
                <div className="rounded-md border border-farm-green/10 bg-white/80 p-4 backdrop-blur">
                  <p className="text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground">Current Balance</p>
                  <p className="mt-1 text-lg font-black text-farm-green">{formatCurrency(monthlyBill)}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-3">
            <article className="glass-card border-farm-green/10 p-5 lg:col-span-2">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.12em] text-farm-wheat">Active subscription</p>
                  <h2 className="mt-2 text-2xl font-black text-farm-green">Daily Cow Milk</h2>
                  <p className="mt-2 text-sm text-muted-foreground">69 E Model Town, Lahore</p>
                </div>
                <div className="rounded-md bg-farm-green px-3 py-2 text-white">
                  <div className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-[0.12em]">
                    <CheckCircle2 className="h-4 w-4 text-farm-leaf" />
                    Active
                  </div>
                </div>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                <div className="rounded-md border border-farm-green/10 bg-white/80 p-4">
                  <p className="text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground">Daily Qty</p>
                  <p className="mt-2 text-2xl font-black text-farm-green">{dailyLiters}L</p>
                </div>
                <div className="rounded-md border border-farm-green/10 bg-white/80 p-4">
                  <p className="text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground">Rate</p>
                  <p className="mt-2 text-2xl font-black text-farm-green">{formatCurrency(ratePerLiter)}</p>
                </div>
                <div className="rounded-md border border-farm-green/10 bg-white/80 p-4">
                  <p className="text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground">Monthly</p>
                  <p className="mt-2 text-2xl font-black text-farm-green">{formatCurrency(monthlyBill)}</p>
                </div>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  className="premium-button inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-farm-green px-4 font-semibold text-white"
                >
                  <Plus className="h-4 w-4" />
                  Request Extra Milk
                </button>
                <button
                  type="button"
                  className="premium-button inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-farm-wheat bg-farm-cream px-4 font-semibold text-farm-green"
                >
                  <PauseCircle className="h-4 w-4" />
                  Pause Delivery
                </button>
              </div>
            </article>

            <article className="glass-card border-farm-green/10 p-5">
              <p className="text-xs font-bold uppercase tracking-[0.12em] text-farm-wheat">Monthly bill summary</p>
              <h2 className="mt-2 text-xl font-black text-farm-green">Billing & Receipts</h2>
              <div className="mt-4 space-y-3 rounded-md border border-farm-green/10 bg-white/80 p-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Unpaid Balance</span>
                  <span className="font-black text-farm-green">{formatCurrency(monthlyBill)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Billing Period</span>
                  <span className="font-semibold text-farm-ink">May 2026</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Due Date</span>
                  <span className="font-semibold text-farm-ink">June 05, 2026</span>
                </div>
              </div>
              <button
                type="button"
                className="premium-button mt-4 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-md bg-farm-wheat px-4 font-semibold text-farm-green"
              >
                <Wallet className="h-4 w-4" />
                Pay Invoice (Static)
              </button>
            </article>
          </div>

          <div className="mt-4 grid gap-4 lg:grid-cols-3">
            <article className="glass-card border-farm-green/10 p-5 lg:col-span-2">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-black text-farm-green">Delivery History Preview</h2>
                <span className="rounded-md bg-farm-cream px-2 py-1 text-xs font-bold uppercase tracking-[0.12em] text-farm-green">
                  Last 3
                </span>
              </div>
              <div className="mt-4 space-y-3">
                {deliveryHistory.map((item) => (
                  <div
                    key={item.date}
                    className="flex flex-col gap-2 rounded-md border border-farm-green/10 bg-white/80 p-3 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <Droplets className="h-4 w-4 text-farm-wheat" />
                      <div>
                        <p className="text-sm font-semibold text-farm-ink">{item.date}</p>
                        <p className="text-xs text-muted-foreground">{item.quantity} delivered</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="rounded-md bg-farm-cream px-2 py-1 font-semibold text-farm-green">{item.status}</span>
                      <span
                        className={
                          item.payment === "Paid"
                            ? "rounded-md bg-green-100 px-2 py-1 font-semibold text-green-700"
                            : "rounded-md bg-red-100 px-2 py-1 font-semibold text-red-700"
                        }
                      >
                        {item.payment}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </article>

            <article className="glass-card border-farm-green/10 p-5">
              <h2 className="text-xl font-black text-farm-green">Customer AI Assistant</h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Ask support about pause windows, extra liters, or delivery timing.
              </p>
              <div className="mt-4 rounded-md border border-farm-green/10 bg-white/80 p-4">
                <p className="inline-flex items-center gap-2 text-sm font-semibold text-farm-green">
                  <Bot className="h-4 w-4" />
                  Assistant (UI Demo)
                </p>
                <p className="mt-2 text-sm text-farm-ink">
                  &quot;Hi Sarah, tomorrow&apos;s delivery is scheduled for 7:00 AM. Want to add 1L extra?&quot;
                </p>
              </div>
              <button
                type="button"
                className="premium-button mt-4 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-md bg-farm-green px-4 font-semibold text-white"
              >
                <MessageCircle className="h-4 w-4" />
                Open Assistant (Static)
              </button>
            </article>
          </div>

          <div className="mt-4 grid gap-4 md:grid-cols-3">
            <article className="glass-card border-farm-green/10 p-5">
              <h3 className="text-lg font-black text-farm-green">Vacation Hold</h3>
              <p className="mt-2 text-sm text-muted-foreground">Pause delivery while you are away.</p>
              <div className="mt-4 rounded-md border border-farm-green/10 bg-white/80 p-3 text-sm text-farm-ink">
                May 28, 2026 - Jun 02, 2026
              </div>
              <button
                type="button"
                className="premium-button mt-4 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-md border border-farm-wheat bg-farm-cream px-4 font-semibold text-farm-green"
              >
                <CalendarDays className="h-4 w-4" />
                Submit Pause Request
              </button>
            </article>

            <article className="glass-card border-farm-green/10 p-5">
              <h3 className="text-lg font-black text-farm-green">Extra Milk Request</h3>
              <p className="mt-2 text-sm text-muted-foreground">Need more liters for tomorrow?</p>
              <div className="mt-4 flex items-center justify-center gap-3 rounded-md border border-farm-green/10 bg-white/80 p-3">
                <button
                  type="button"
                  aria-label="Decrease extra milk quantity"
                  className="h-8 w-8 rounded-md border border-farm-green/20 bg-farm-cream font-bold text-farm-green"
                >
                  -
                </button>
                <span className="inline-flex min-w-12 items-center justify-center text-lg font-black text-farm-green">1L</span>
                <button
                  type="button"
                  aria-label="Increase extra milk quantity"
                  className="h-8 w-8 rounded-md border border-farm-green/20 bg-farm-cream font-bold text-farm-green"
                >
                  +
                </button>
              </div>
              <button
                type="button"
                className="premium-button mt-4 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-md bg-farm-green px-4 font-semibold text-white"
              >
                <GlassWater className="h-4 w-4" />
                Request Extra Liters
              </button>
            </article>

            <article className="glass-card border-farm-green/10 p-5">
              <h3 className="text-lg font-black text-farm-green">Complaint & Support</h3>
              <p className="mt-2 text-sm text-muted-foreground">Report delivery issues or ask for help.</p>
              <div className="mt-4 rounded-md border border-red-100 bg-red-50 p-3 text-sm text-red-700">
                <p className="inline-flex items-center gap-2 font-semibold">
                  <AlertTriangle className="h-4 w-4" />
                  Delivery alert
                </p>
                <p className="mt-1">Rider is en route. ETA 07:15 AM.</p>
              </div>
              <a
                href="https://wa.me/923395235323"
                className="premium-button mt-4 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-md bg-farm-wheat px-4 font-semibold text-farm-green"
              >
                <MessageCircle className="h-4 w-4" />
                WhatsApp Farm Support
              </a>
            </article>
          </div>

          <div className="mt-4 rounded-md border border-farm-green/10 bg-farm-green px-4 py-3 text-white">
            <p className="inline-flex items-center gap-2 text-sm font-semibold">
              <Clock3 className="h-4 w-4 text-farm-wheat" />
              Delivery update: Rider assigned. Estimated arrival tomorrow at 07:00 AM.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
