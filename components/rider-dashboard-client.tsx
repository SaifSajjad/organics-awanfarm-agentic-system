"use client";

import { CheckCircle2, Clock3, MapPin, MessageCircle, Navigation, Phone, Truck, XCircle } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { todayDeliveries } from "@/lib/demo-data";
import { useLocalStorageState } from "@/lib/use-local-storage-state";

type RiderDelivery = {
  id: string;
  customer: string;
  area: string;
  address?: string;
  phone?: string;
  product: string;
  quantity: number;
  status: string;
  paymentStatus?: string;
};

const missedReasonOptions = [
  "Customer unavailable",
  "Address not found",
  "Delivery paused by customer",
  "Payment issue",
  "Other rider note"
];

const seededDeliveries: RiderDelivery[] = todayDeliveries.map((delivery) => ({
  ...delivery,
  address: `${delivery.customer}, ${delivery.area}, Lahore`,
  phone: "0339-5235323",
  paymentStatus: delivery.status === "Delivered" ? "Paid" : "Account"
}));

function statusBadgeClass(status: string) {
  const normalized = status.toLowerCase();

  if (normalized.includes("delivered")) return "bg-green-100 text-green-800 ring-green-200";
  if (normalized.includes("missed") || normalized.includes("cancel")) return "bg-red-100 text-red-800 ring-red-200";
  if (normalized.includes("out")) return "bg-blue-100 text-blue-800 ring-blue-200";
  return "bg-amber-100 text-amber-800 ring-amber-200";
}

function paymentBadgeClass(status?: string) {
  const normalized = status?.toLowerCase() ?? "";

  if (normalized.includes("paid")) return "bg-green-100 text-green-800 ring-green-200";
  if (normalized.includes("pending") || normalized.includes("collect")) return "bg-amber-100 text-amber-800 ring-amber-200";
  return "bg-farm-cream text-farm-green ring-farm-green/10";
}

function whatsappHref(phone?: string) {
  const digits = phone?.replace(/\D/g, "");
  if (!digits) return "https://wa.me/923395235323";
  return digits.startsWith("0") ? `https://wa.me/92${digits.slice(1)}` : `https://wa.me/${digits}`;
}

export function RiderDashboardClient() {
  const [deliveries, setDeliveries] = useLocalStorageState<RiderDelivery[]>(
    "oaf-admin-deliveries",
    seededDeliveries
  );
  const [missedReasons, setMissedReasons] = useState<Record<string, string>>({});

  useEffect(() => {
    let active = true;

    async function loadDatabaseDeliveries() {
      try {
        const response = await fetch("/api/deliveries", { cache: "no-store" });
        if (!active || !response.ok) return;
        const dbDeliveries = (await response.json()) as RiderDelivery[];
        if (dbDeliveries.length) setDeliveries(dbDeliveries);
      } catch {
        // Keep localStorage/seed fallback when the database is not ready.
      }
    }

    loadDatabaseDeliveries();

    return () => {
      active = false;
    };
  }, [setDeliveries]);

  const routeStats = useMemo(() => {
    return deliveries.reduce(
      (stats, delivery) => {
        const status = delivery.status.toLowerCase();
        stats.liters += delivery.quantity;
        stats.areas.add(delivery.area);
        if (status.includes("delivered")) stats.delivered += 1;
        else if (status.includes("missed")) stats.missed += 1;
        else stats.pending += 1;
        return stats;
      },
      {
        liters: 0,
        pending: 0,
        delivered: 0,
        missed: 0,
        areas: new Set<string>()
      }
    );
  }, [deliveries]);

  const primaryArea = useMemo(() => {
    const areaCounts = deliveries.reduce((counts, delivery) => {
      counts.set(delivery.area, (counts.get(delivery.area) ?? 0) + 1);
      return counts;
    }, new Map<string, number>());

    return Array.from(areaCounts.entries()).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "Route not generated";
  }, [deliveries]);

  async function updateStatus(id: string, status: "Delivered" | "Missed", missedReason?: string) {
    try {
      await fetch(`/api/deliveries/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status,
          ...(status === "Missed" ? { missedReason: missedReason ?? missedReasonOptions[0] } : {})
        })
      });
    } catch {
      // Keep localStorage fallback.
    }

    setDeliveries((current) =>
      current.map((delivery) => (delivery.id === id ? { ...delivery, status } : delivery))
    );
  }

  function markMissed(id: string) {
    const missedReason = missedReasons[id] ?? missedReasonOptions[0];
    void updateStatus(id, "Missed", missedReason);
  }

  return (
    <div className="space-y-5">
      <section className="glass-card relative overflow-hidden border-farm-green/10 bg-white/76 p-5 sm:p-6">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(200,159,65,0.18),transparent_42%)]" />
        <div className="relative z-10">
          <p className="inline-flex items-center gap-2 rounded-md border border-farm-green/10 bg-farm-cream px-3 py-1.5 text-xs font-black uppercase tracking-[0.16em] text-farm-green">
            <Navigation className="h-4 w-4 text-farm-wheat" />
            Rider Dispatch
          </p>
          <h1 className="mt-3 font-display text-3xl font-black text-farm-green sm:text-4xl">
            Morning Route Console
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
            Mobile-first stop list for delivery completion, customer contact, and missed-delivery notes.
          </p>

          <div className="mt-5 grid gap-3 sm:grid-cols-4">
            <div className="rounded-md border border-farm-green/10 bg-white/80 p-4">
              <p className="text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground">Primary Area</p>
              <p className="mt-1 font-black text-farm-green">{primaryArea}</p>
            </div>
            <div className="rounded-md border border-farm-green/10 bg-white/80 p-4">
              <p className="text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground">Stops</p>
              <p className="mt-1 font-display text-2xl font-black text-farm-green">{deliveries.length}</p>
            </div>
            <div className="rounded-md border border-farm-green/10 bg-white/80 p-4">
              <p className="text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground">Milk Load</p>
              <p className="mt-1 font-display text-2xl font-black text-farm-green">{routeStats.liters}L</p>
            </div>
            <div className="rounded-md border border-farm-green/10 bg-white/80 p-4">
              <p className="text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground">Areas</p>
              <p className="mt-1 font-display text-2xl font-black text-farm-green">{routeStats.areas.size}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-3">
        <div className="glass-card border-farm-green/10 p-4">
          <p className="inline-flex items-center gap-2 text-sm font-bold text-farm-green">
            <Clock3 className="h-4 w-4 text-farm-wheat" />
            Pending
          </p>
          <p className="mt-2 font-display text-3xl font-black text-farm-green">{routeStats.pending}</p>
        </div>
        <div className="glass-card border-farm-green/10 p-4">
          <p className="inline-flex items-center gap-2 text-sm font-bold text-green-800">
            <CheckCircle2 className="h-4 w-4" />
            Delivered
          </p>
          <p className="mt-2 font-display text-3xl font-black text-green-800">{routeStats.delivered}</p>
        </div>
        <div className="glass-card border-farm-green/10 p-4">
          <p className="inline-flex items-center gap-2 text-sm font-bold text-red-800">
            <XCircle className="h-4 w-4" />
            Missed
          </p>
          <p className="mt-2 font-display text-3xl font-black text-red-800">{routeStats.missed}</p>
        </div>
      </section>

      {deliveries.length === 0 ? (
        <div className="rounded-md border border-dashed border-farm-green/20 bg-white p-6 text-sm text-muted-foreground">
          No deliveries generated yet. Generate today&apos;s deliveries from the Admin Dashboard first.
        </div>
      ) : (
        <section className="grid gap-3">
          {deliveries.map((delivery, index) => {
            const missedReason = missedReasons[delivery.id] ?? missedReasonOptions[0];
            const paymentStatus = delivery.paymentStatus ?? "Account";

            return (
              <article key={delivery.id} className="glass-card border-farm-green/10 p-4 sm:p-5">
                <div className="flex flex-col gap-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-xs font-black uppercase tracking-[0.14em] text-farm-wheat">
                        Stop {index + 1}
                      </p>
                      <h2 className="mt-1 text-xl font-black text-farm-green">{delivery.customer}</h2>
                      <p className="mt-2 flex items-start gap-2 text-sm leading-6 text-muted-foreground">
                        <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-farm-wheat" />
                        <span>{delivery.address ?? `${delivery.customer}, ${delivery.area}, Lahore`}</span>
                      </p>
                    </div>
                    <Truck className="h-6 w-6 shrink-0 text-farm-green" />
                  </div>

                  <div className="grid gap-2 sm:grid-cols-4">
                    <div className="rounded-md bg-farm-cream px-3 py-2">
                      <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-muted-foreground">Qty</p>
                      <p className="mt-1 font-black text-farm-green">
                        {delivery.quantity}L {delivery.product}
                      </p>
                    </div>
                    <div className="rounded-md bg-farm-cream px-3 py-2">
                      <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-muted-foreground">Area</p>
                      <p className="mt-1 font-black text-farm-green">{delivery.area}</p>
                    </div>
                    <div className="rounded-md bg-farm-cream px-3 py-2">
                      <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-muted-foreground">Status</p>
                      <span
                        className={`mt-1 inline-flex rounded-md px-2 py-1 text-xs font-bold ring-1 ${statusBadgeClass(
                          delivery.status
                        )}`}
                      >
                        {delivery.status}
                      </span>
                    </div>
                    <div className="rounded-md bg-farm-cream px-3 py-2">
                      <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-muted-foreground">Payment</p>
                      <span
                        className={`mt-1 inline-flex rounded-md px-2 py-1 text-xs font-bold ring-1 ${paymentBadgeClass(
                          paymentStatus
                        )}`}
                      >
                        {paymentStatus}
                      </span>
                    </div>
                  </div>

                  <div className="grid gap-2 sm:grid-cols-[1fr_1fr_1.2fr]">
                    <a
                      href={delivery.phone ? `tel:${delivery.phone}` : "#"}
                      className="premium-button inline-flex min-h-12 items-center justify-center gap-2 rounded-md border border-farm-green/10 bg-white px-4 text-sm font-bold text-farm-green"
                    >
                      <Phone className="h-4 w-4" />
                      Call
                    </a>
                    <a
                      href={whatsappHref(delivery.phone)}
                      className="premium-button inline-flex min-h-12 items-center justify-center gap-2 rounded-md border border-farm-wheat bg-farm-cream px-4 text-sm font-bold text-farm-green"
                    >
                      <MessageCircle className="h-4 w-4" />
                      WhatsApp
                    </a>
                    <button
                      type="button"
                      onClick={() => updateStatus(delivery.id, "Delivered")}
                      className="premium-button inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-farm-green px-4 text-sm font-bold text-white"
                    >
                      <CheckCircle2 className="h-4 w-4" />
                      Mark Delivered
                    </button>
                  </div>

                  <div className="grid gap-2 sm:grid-cols-[1fr_auto] sm:items-end">
                    <label className="block">
                      <span className="text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground">
                        Missed reason
                      </span>
                      <select
                        value={missedReason}
                        onChange={(event) =>
                          setMissedReasons((current) => ({ ...current, [delivery.id]: event.target.value }))
                        }
                        className="mt-1 min-h-11 w-full rounded-md border border-farm-green/10 bg-white px-3 py-2 text-sm outline-none ring-farm-green focus:ring-2"
                      >
                        {missedReasonOptions.map((reason) => (
                          <option key={reason}>{reason}</option>
                        ))}
                      </select>
                    </label>
                    <button
                      type="button"
                      onClick={() => markMissed(delivery.id)}
                      className="premium-button inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-red-200 bg-red-50 px-4 text-sm font-bold text-red-800"
                    >
                      <XCircle className="h-4 w-4" />
                      Mark Missed
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </section>
      )}
    </div>
  );
}
