"use client";

import { CheckCircle2, MapPin, Phone, XCircle } from "lucide-react";
import { useEffect } from "react";
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
};

const seededDeliveries: RiderDelivery[] = todayDeliveries.map((delivery) => ({
  ...delivery,
  address: `${delivery.customer}, ${delivery.area}, Lahore`,
  phone: "0339-5235323"
}));

export function RiderDashboardClient() {
  const [deliveries, setDeliveries] = useLocalStorageState<RiderDelivery[]>(
    "oaf-admin-deliveries",
    seededDeliveries
  );

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

  async function updateStatus(id: string, status: "Delivered" | "Missed") {
    try {
      await fetch(`/api/deliveries/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status })
      });
    } catch {
      // Keep localStorage fallback.
    }

    setDeliveries((current) =>
      current.map((delivery) => (delivery.id === id ? { ...delivery, status } : delivery))
    );
  }

  if (deliveries.length === 0) {
    return (
      <div className="mt-6 rounded-md border border-dashed bg-white p-6 text-sm text-muted-foreground">
        No deliveries generated yet. Generate today&apos;s deliveries from the Admin Dashboard first.
      </div>
    );
  }

  return (
    <div className="mt-6 grid gap-3">
      {deliveries.map((delivery) => (
        <article key={delivery.id} className="rounded-md border bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-lg font-bold text-farm-green">{delivery.customer}</h2>
                <span className="rounded-md bg-secondary px-2 py-1 text-xs font-semibold text-farm-green">
                  {delivery.status}
                </span>
              </div>
              <p className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                {delivery.address ?? `${delivery.customer}, ${delivery.area}, Lahore`}
              </p>
              <p className="mt-2 text-sm font-semibold">
                {delivery.quantity}L {delivery.product}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">Area: {delivery.area}</p>
              {delivery.phone ? <p className="mt-1 text-sm text-muted-foreground">Phone: {delivery.phone}</p> : null}
            </div>
            <div className="grid grid-cols-[44px_1fr_1fr] gap-2 sm:flex">
              <a
                href={delivery.phone ? `tel:${delivery.phone}` : undefined}
                className="inline-flex h-11 w-11 items-center justify-center rounded-md border bg-white text-farm-green"
              >
                <Phone className="h-5 w-5" />
              </a>
              <button
                onClick={() => updateStatus(delivery.id, "Delivered")}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-farm-green px-4 py-3 text-sm font-semibold text-white"
              >
                <CheckCircle2 className="h-5 w-5" />
                Delivered
              </button>
              <button
                onClick={() => updateStatus(delivery.id, "Missed")}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border bg-white px-4 py-3 text-sm font-semibold text-farm-green"
              >
                <XCircle className="h-5 w-5" />
                Missed
              </button>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
