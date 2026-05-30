"use client";

import Link from "next/link";
import {
  AlertCircle,
  BellRing,
  CalendarCheck,
  CheckCircle2,
  Clock3,
  CreditCard,
  Download,
  FileText,
  Info,
  MessageCircle,
  Milk,
  ReceiptText,
  Truck
} from "lucide-react";
import { useEffect, useState } from "react";
import { CustomerDashboardHeader } from "@/components/customer/customer-dashboard-header";
import { ExtraMilkDrawer } from "@/components/customer/extra-milk-drawer";
import { FarmSupportAssistant } from "@/components/customer/farm-support-assistant";
import { QuickActions } from "@/components/customer/quick-actions";
import { SubscriptionCard } from "@/components/customer/subscription-card";
import { VacationModeDrawer } from "@/components/customer/vacation-mode-drawer";
import { formatCurrency } from "@/lib/utils";

const monthlyBalance = 19800;

const deliveryRows = [
  { id: "d1", status: "Delivered", item: "2 L Cow Milk", detail: "7:08 AM", tone: "success" },
  { id: "d2", status: "Delivered", item: "2 L Cow Milk", detail: "7:14 AM", tone: "success" },
  { id: "d3", status: "Missed", item: "Customer unavailable", detail: "Yesterday", tone: "danger" },
  { id: "d4", status: "Pending", item: "Tomorrow 7:00 AM", detail: "Rider assigned", tone: "pending" }
];

const updates = [
  {
    id: "u1",
    title: "Rider assigned",
    copy: "Arshad K. is assigned to tomorrow's Model Town route.",
    icon: Truck
  },
  {
    id: "u2",
    title: "June invoice available",
    copy: "Your current balance is ready for review.",
    icon: ReceiptText
  },
  {
    id: "u3",
    title: "Extra milk request confirmed",
    copy: "Your recent demo request is visible in this workspace.",
    icon: Milk
  },
  {
    id: "u4",
    title: "Vacation Mode resume date",
    copy: "Paused deliveries resume automatically on 16 June.",
    icon: CalendarCheck
  }
];

export function CustomerDashboardClient() {
  const [extraMilkOpen, setExtraMilkOpen] = useState(false);
  const [vacationOpen, setVacationOpen] = useState(false);
  const [assistantOpen, setAssistantOpen] = useState(false);
  const [vacationActive, setVacationActive] = useState(false);
  const [demoMessage, setDemoMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!demoMessage) return;
    const timeout = window.setTimeout(() => setDemoMessage(null), 3200);
    return () => window.clearTimeout(timeout);
  }, [demoMessage]);

  function openSupportFromOverlay() {
    setExtraMilkOpen(false);
    setVacationOpen(false);
    setAssistantOpen(true);
  }

  return (
    <main id="dashboard" className="min-h-screen overflow-x-hidden bg-farm-meadow text-farm-ink">
      <CustomerDashboardHeader />

      <div className="mx-auto max-w-7xl px-4 pb-24 pt-8 sm:px-6 lg:px-8 lg:pb-16 lg:pt-12">
        <section className="customer-reveal mb-8 grid gap-5 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <p className="font-label text-xs font-bold uppercase tracking-[0.22em] text-farm-ink/55">Welcome back</p>
            <h1 className="mt-3 font-display text-4xl font-bold text-farm-heritage sm:text-5xl lg:text-6xl">
              Good Morning, Sarah.
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-farm-ink/70">
              Your fresh milk subscription is active and tomorrow&apos;s delivery is on schedule.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <span className="customer-status-pill bg-farm-heritage text-white">
              <CheckCircle2 className="h-4 w-4 text-farm-gold" />
              Subscription Active
            </span>
            <span className="customer-status-pill bg-farm-gold/30 text-farm-heritage">
              <Clock3 className="h-4 w-4" />
              Next Delivery: Tomorrow, 7:00 AM
            </span>
          </div>
        </section>

        {vacationActive ? (
          <section className="customer-reveal mb-6 rounded-3xl border border-farm-gold/30 bg-farm-gold/10 p-5 shadow-soft-card">
            <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <span className="inline-flex items-center gap-2 rounded-full bg-farm-gold/30 px-3 py-1.5 text-sm font-bold text-farm-heritage">
                  <CalendarCheck className="h-4 w-4" />
                  Vacation Mode Active
                </span>
                <p className="mt-3 text-sm leading-6 text-farm-ink/70">
                  Deliveries are paused through 15 June. Regular delivery resumes automatically on 16 June at 7:00 AM.
                </p>
              </div>
              <div className="flex flex-col gap-2 sm:flex-row">
                <button type="button" onClick={() => setVacationOpen(true)} className="customer-secondary-cta">
                  Edit Pause Dates
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setVacationActive(false);
                    setDemoMessage("Vacation Mode resumed early in local demo state.");
                  }}
                  className="customer-primary-compact"
                >
                  Resume Early
                </button>
              </div>
            </div>
          </section>
        ) : null}

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
          <div className="space-y-6">
            <div className="customer-reveal">
              <TodaysDeliveryCard />
            </div>

            <div className="customer-reveal">
              <SubscriptionCard onDemoAction={setDemoMessage} />
            </div>

            <div className="customer-reveal">
              <QuickActions
                onExtraMilk={() => setExtraMilkOpen(true)}
                onVacationMode={() => setVacationOpen(true)}
                onSupport={() => setAssistantOpen(true)}
                onDemoAction={setDemoMessage}
              />
            </div>

            <section id="deliveries" className="customer-reveal customer-card p-5 sm:p-6">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-label text-xs font-bold uppercase tracking-[0.18em] text-farm-ink/50">
                    Recent Deliveries
                  </p>
                  <h2 className="mt-2 font-display text-3xl font-bold text-farm-heritage">Delivery History</h2>
                </div>
                <button
                  type="button"
                  onClick={() => setDemoMessage("Full delivery history is a demo placeholder in this UI phase.")}
                  className="customer-secondary-cta"
                >
                  View All
                </button>
              </div>

              <div className="mt-5 overflow-hidden rounded-3xl border border-farm-heritage/10">
                {deliveryRows.map((row) => (
                  <div
                    key={row.id}
                    className="grid gap-3 border-b border-farm-heritage/10 bg-white p-4 last:border-b-0 sm:grid-cols-[1fr_auto_auto] sm:items-center"
                  >
                    <div className="flex items-center gap-3">
                      <StatusIcon tone={row.tone} />
                      <div>
                        <p className="font-bold text-farm-heritage">{row.status}</p>
                        <p className="text-sm text-farm-ink/60">{row.item}</p>
                      </div>
                    </div>
                    <p className="text-sm font-semibold text-farm-ink/70">{row.detail}</p>
                    <span
                      className={`w-fit rounded-full px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] ${
                        row.tone === "success"
                          ? "bg-green-100 text-green-700"
                          : row.tone === "danger"
                            ? "bg-red-100 text-red-700"
                            : "bg-farm-gold/20 text-farm-heritage"
                      }`}
                    >
                      {row.status}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <aside className="space-y-6">
            <section id="billing" className="customer-reveal customer-card p-5 sm:p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-label text-xs font-bold uppercase tracking-[0.18em] text-farm-ink/50">June 2026</p>
                  <h2 className="mt-2 font-display text-3xl font-bold text-farm-heritage">Billing Summary</h2>
                </div>
                <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] text-red-700">
                  Pending
                </span>
              </div>

              <div className="mt-5 rounded-3xl bg-farm-cream p-5">
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-farm-ink/50">Current balance</p>
                <p className="mt-2 font-display text-4xl font-bold text-farm-heritage">{formatCurrency(monthlyBalance)}</p>
                <p className="mt-2 text-sm text-farm-ink/65">Due date: 05 July 2026</p>
                <p className="mt-3 rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-farm-heritage">
                  Previous payment: Paid — {formatCurrency(18600)}
                </p>
              </div>

              <div className="mt-5 grid gap-3">
                <button type="button" onClick={() => setDemoMessage("Invoice preview is a safe demo action.")} className="customer-primary-compact">
                  <FileText className="h-4 w-4" />
                  View Invoice
                </button>
                <button type="button" onClick={() => setDemoMessage("Receipt download is disabled in this demo UI phase.")} className="customer-secondary-cta">
                  <Download className="h-4 w-4" />
                  Download Receipt
                </button>
                <button type="button" onClick={() => setDemoMessage("All billing history will connect after account APIs are approved.")} className="customer-secondary-cta">
                  <CreditCard className="h-4 w-4" />
                  View All Billing
                </button>
              </div>
            </section>

            <section className="customer-reveal customer-card p-5 sm:p-6">
              <div className="flex items-center justify-between gap-3">
                <h2 className="font-display text-3xl font-bold text-farm-heritage">Farm Updates</h2>
                <BellRing className="h-5 w-5 text-farm-gold" />
              </div>
              <div className="mt-5 space-y-4">
                {updates.map((update) => {
                  const Icon = update.icon;
                  return (
                    <article key={update.id} className="flex gap-3 rounded-3xl border border-farm-heritage/10 bg-white p-4">
                      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-farm-gold/20 text-farm-heritage">
                        <Icon className="h-5 w-5" />
                      </span>
                      <div>
                        <h3 className="font-bold text-farm-heritage">{update.title}</h3>
                        <p className="mt-1 text-sm leading-6 text-farm-ink/65">{update.copy}</p>
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>

            <section id="support" className="customer-reveal rounded-3xl bg-farm-heritage p-6 text-white shadow-premium">
              <SparkleHeading />
              <p className="mt-4 text-sm leading-6 text-white/75">
                Ask about late deliveries, pending bills, pause windows, or extra milk requests.
              </p>
              <button
                type="button"
                onClick={() => setAssistantOpen(true)}
                className="mt-5 flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-farm-gold px-4 font-bold text-farm-heritage transition-transform hover:-translate-y-0.5"
              >
                <MessageCircle className="h-5 w-5" />
                Open Farm Support
              </button>
            </section>
          </aside>
        </div>
      </div>

      {demoMessage ? (
        <div
          role="status"
          aria-live="polite"
          className="fixed left-4 right-4 top-24 z-[95] mx-auto max-w-xl rounded-2xl border border-farm-heritage/10 bg-white px-4 py-3 text-sm font-semibold text-farm-heritage shadow-premium"
        >
          {demoMessage}
        </div>
      ) : null}

      <ExtraMilkDrawer
        isOpen={extraMilkOpen}
        onClose={() => setExtraMilkOpen(false)}
        onContactSupport={openSupportFromOverlay}
      />
      <VacationModeDrawer
        isOpen={vacationOpen}
        onClose={() => setVacationOpen(false)}
        onContactSupport={openSupportFromOverlay}
        onVacationActivated={() => {
          setVacationActive(true);
          setDemoMessage("Vacation Mode is active in local demo state.");
        }}
        onVacationResumed={() => {
          setVacationActive(false);
          setDemoMessage("Deliveries resumed early in local demo state.");
        }}
      />
      <FarmSupportAssistant isOpen={assistantOpen} onOpenChange={setAssistantOpen} />
    </main>
  );
}

function TodaysDeliveryCard() {
  return (
    <section aria-labelledby="todays-delivery-title" className="customer-card overflow-hidden p-5 sm:p-6">
      <div className="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-center">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <p className="font-label text-xs font-bold uppercase tracking-[0.18em] text-farm-ink/50">Live tracking</p>
            <span className="inline-flex min-h-9 items-center gap-2 rounded-full bg-farm-heritage px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] text-white">
              <Truck className="h-4 w-4 text-farm-gold" aria-hidden="true" />
              On Route
            </span>
          </div>
          <h2 id="todays-delivery-title" className="mt-3 font-display text-3xl font-bold text-farm-heritage">
            Today&apos;s Delivery
          </h2>
          <div className="mt-4 grid gap-3 text-sm leading-6 text-farm-ink/70 sm:grid-cols-2">
            <p className="rounded-2xl bg-farm-cream px-4 py-3">
              <span className="block text-xs font-bold uppercase tracking-[0.14em] text-farm-ink/50">Status</span>
              <span className="mt-1 block font-black text-farm-heritage">On Route</span>
            </p>
            <p className="rounded-2xl bg-farm-cream px-4 py-3">
              <span className="block text-xs font-bold uppercase tracking-[0.14em] text-farm-ink/50">Expected window</span>
              <span className="mt-1 block font-black text-farm-heritage">6:00 AM &ndash; 7:30 AM</span>
            </p>
          </div>
          <p className="mt-4 text-base font-semibold text-farm-heritage">Ali is completing nearby deliveries.</p>
          <p className="mt-2 text-sm text-farm-ink/60">Updated 2 minutes ago</p>
          <p className="mt-3 text-sm text-farm-ink/60">Apni delivery ka status check karein.</p>
        </div>

        <div className="rounded-3xl border border-farm-heritage/10 bg-white p-4 shadow-soft-card lg:w-72">
          <div className="flex items-center gap-3 rounded-2xl bg-farm-meadow p-4">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-farm-gold/25 text-farm-heritage">
              <Clock3 className="h-5 w-5" aria-hidden="true" />
            </span>
            <p className="text-sm font-semibold leading-6 text-farm-ink/70">Track your morning delivery securely.</p>
          </div>
          <Link href="/track/demo" className="customer-primary-cta mt-4">
            <Truck className="h-5 w-5" aria-hidden="true" />
            Track My Delivery
          </Link>
        </div>
      </div>
    </section>
  );
}

function StatusIcon({ tone }: { tone: string }) {
  if (tone === "danger") {
    return (
      <span className="grid h-10 w-10 place-items-center rounded-full bg-red-100 text-red-700">
        <AlertCircle className="h-5 w-5" />
      </span>
    );
  }

  if (tone === "pending") {
    return (
      <span className="grid h-10 w-10 place-items-center rounded-full bg-farm-gold/20 text-farm-heritage">
        <Clock3 className="h-5 w-5" />
      </span>
    );
  }

  return (
    <span className="grid h-10 w-10 place-items-center rounded-full bg-green-100 text-green-700">
      <CheckCircle2 className="h-5 w-5" />
    </span>
  );
}

function SparkleHeading() {
  return (
    <div>
      <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-farm-gold">
        <Info className="h-4 w-4" />
        Customer Support Agent
      </p>
      <h2 className="mt-4 font-display text-3xl font-bold text-farm-gold">Farm Support Assistant</h2>
    </div>
  );
}
