"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  ClipboardList,
  CreditCard,
  Gauge,
  MapPin,
  Milk,
  PackageCheck,
  Plus,
  RefreshCcw,
  Route,
  ShieldAlert,
  Sparkles,
  TrendingUp,
  WalletCards,
  Truck,
  Users
} from "lucide-react";
import {
  customers as initialCustomers,
  expenses as initialExpenses,
  products,
  todayDeliveries
} from "@/lib/demo-data";
import { useLocalStorageState } from "@/lib/use-local-storage-state";
import { formatCurrency } from "@/lib/utils";

type CustomerRow = {
  id: string;
  name: string;
  area: string;
  address?: string;
  phone?: string;
  product: string;
  quantity: number;
  rate: number;
  status: string;
  pending: number;
};

type DeliveryRow = {
  id: string;
  customer: string;
  area: string;
  address?: string;
  phone?: string;
  product: string;
  quantity: number;
  status: string;
};

type ExpenseRow = {
  id: string;
  type: string;
  amount: number;
  note: string;
};

function badgeClass(status: string) {
  const normalized = status.toLowerCase();

  if (normalized.includes("paid") || normalized.includes("delivered") || normalized.includes("active")) {
    return "bg-green-100 text-green-800 ring-green-200";
  }

  if (normalized.includes("missed") || normalized.includes("unpaid") || normalized.includes("cancel")) {
    return "bg-red-100 text-red-800 ring-red-200";
  }

  if (normalized.includes("out") || normalized.includes("pending")) {
    return "bg-amber-100 text-amber-800 ring-amber-200";
  }

  return "bg-farm-cream text-farm-green ring-farm-green/10";
}

export function AdminDashboardClient() {
  const [customers, setCustomers, resetCustomers] = useLocalStorageState<CustomerRow[]>(
    "oaf-admin-customers",
    initialCustomers
  );
  const [deliveries, setDeliveries, resetDeliveries] = useLocalStorageState<DeliveryRow[]>(
    "oaf-admin-deliveries",
    todayDeliveries
  );
  const [expenses] = useLocalStorageState<ExpenseRow[]>("oaf-operations-expenses", initialExpenses);
  const [form, setForm] = useState({
    name: "",
    area: "Model Town",
    product: "Cow Milk",
    quantity: "1",
    frequency: "Daily"
  });

  const selectedProduct = products.find((product) => product.name === form.product) ?? products[0];

  useEffect(() => {
    let active = true;

    async function loadDatabaseData() {
      try {
        const [customerResponse, deliveryResponse] = await Promise.all([
          fetch("/api/customers", { cache: "no-store" }),
          fetch("/api/deliveries", { cache: "no-store" })
        ]);

        if (!active || !customerResponse.ok || !deliveryResponse.ok) return;

        const dbCustomers = (await customerResponse.json()) as CustomerRow[];
        const dbDeliveries = (await deliveryResponse.json()) as DeliveryRow[];

        if (dbCustomers.length) setCustomers(dbCustomers);
        if (dbDeliveries.length) setDeliveries(dbDeliveries);
      } catch {
        // Keep localStorage/seed fallback when the database is not ready.
      }
    }

    loadDatabaseData();

    return () => {
      active = false;
    };
  }, [setCustomers, setDeliveries]);

  const totals = useMemo(() => {
    const monthlyRevenue = customers.reduce((sum, customer) => sum + customer.quantity * customer.rate * 30, 0);
    const pending = customers.reduce((sum, customer) => sum + customer.pending, 0);
    const liters = deliveries.reduce((sum, delivery) => sum + delivery.quantity, 0);
    const expenseTotal = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    return {
      monthlyRevenue,
      pending,
      liters,
      expenseTotal,
      netProfit: monthlyRevenue - expenseTotal
    };
  }, [customers, deliveries, expenses]);

  const deliveryCounts = useMemo(() => {
    return deliveries.reduce(
      (counts, delivery) => {
        const status = delivery.status.toLowerCase();
        if (status.includes("delivered")) counts.delivered += 1;
        else if (status.includes("missed")) counts.missed += 1;
        else counts.pending += 1;
        return counts;
      },
      { delivered: 0, missed: 0, pending: 0 }
    );
  }, [deliveries]);

  const routeSummary = useMemo(() => {
    const buckets = new Map<string, { area: string; deliveries: number; liters: number; pending: number }>();

    deliveries.forEach((delivery) => {
      const current = buckets.get(delivery.area) ?? {
        area: delivery.area,
        deliveries: 0,
        liters: 0,
        pending: 0
      };

      current.deliveries += 1;
      current.liters += delivery.quantity;
      if (!delivery.status.toLowerCase().includes("delivered")) current.pending += 1;
      buckets.set(delivery.area, current);
    });

    return Array.from(buckets.values()).sort((a, b) => b.liters - a.liters);
  }, [deliveries]);

  const attentionCustomers = customers.filter((customer) => customer.pending > 0).slice(0, 3);

  async function addCustomer() {
    if (!form.name.trim()) return;

    const quantity = Number(form.quantity) || 1;
    const monthlyCost = selectedProduct.price * quantity * 30;
    let customer: CustomerRow = {
      id: `c-${Date.now()}`,
      name: form.name.trim(),
      area: form.area,
      address: `${form.name.trim()}, ${form.area}, Lahore`,
      phone: "0339-5235323",
      product: form.product,
      quantity,
      rate: selectedProduct.price,
      status: "Unpaid",
      pending: monthlyCost
    };

    try {
      const response = await fetch("/api/customers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(customer)
      });
      if (response.ok) {
        customer = (await response.json()) as CustomerRow;
      }
    } catch {
      // Keep localStorage fallback.
    }

    setCustomers((current) => [customer, ...current]);
    setForm((current) => ({ ...current, name: "", quantity: "1" }));
  }

  async function generateDeliveries() {
    let generated: DeliveryRow[] = customers.map((customer) => ({
      id: `d-${customer.id}`,
      customer: customer.name,
      area: customer.area,
      address: customer.address ?? `${customer.name}, ${customer.area}, Lahore`,
      phone: customer.phone ?? "0339-5235323",
      product: customer.product,
      quantity: customer.quantity,
      status: "Pending"
    }));

    try {
      const response = await fetch("/api/deliveries", { method: "POST" });
      if (response.ok) {
        const dbDeliveries = (await response.json()) as DeliveryRow[];
        if (dbDeliveries.length) generated = dbDeliveries;
      }
    } catch {
      // Keep localStorage fallback.
    }

    setDeliveries(generated);
  }

  async function markDelivered(id: string) {
    try {
      await fetch(`/api/deliveries/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "Delivered" })
      });
    } catch {
      // Keep localStorage fallback.
    }

    setDeliveries((current) =>
      current.map((delivery) => (delivery.id === id ? { ...delivery, status: "Delivered" } : delivery))
    );
  }

  function resetDemoData() {
    resetCustomers();
    resetDeliveries();
  }

  const executiveCards = [
    {
      label: "Monthly Revenue",
      value: formatCurrency(totals.monthlyRevenue),
      detail: "Subscription run-rate",
      icon: CreditCard
    },
    {
      label: "Net Profit",
      value: formatCurrency(totals.netProfit),
      detail: `${formatCurrency(totals.expenseTotal)} expenses`,
      icon: PackageCheck
    },
    {
      label: "Active Customers",
      value: String(customers.length),
      detail: "Customer ledger records",
      icon: Users
    },
    {
      label: "Today Deliveries",
      value: String(deliveries.length),
      detail: `${deliveryCounts.pending} pending`,
      icon: Truck
    },
    {
      label: "Pending Amount",
      value: formatCurrency(totals.pending),
      detail: "Collection priority",
      icon: WalletCards
    },
    {
      label: "Today Liters",
      value: `${totals.liters}L`,
      detail: "Milk loaded for route",
      icon: Milk
    }
  ];

  return (
    <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="glass-card relative overflow-hidden border-farm-green/10 bg-white/76 p-6 sm:p-7">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(200,159,65,0.18),transparent_42%)]" />
        <div className="relative z-10 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="inline-flex items-center gap-2 rounded-md border border-farm-green/10 bg-farm-cream px-3 py-1.5 text-xs font-black uppercase tracking-[0.16em] text-farm-green">
              <Sparkles className="h-4 w-4 text-farm-wheat" />
              Admin Command Center
            </p>
            <h1 className="mt-3 font-display text-3xl font-black text-farm-green sm:text-4xl">
              Farm Operations Control Room
            </h1>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-muted-foreground sm:text-base">
              Monitor subscriptions, route dispatch, ledger exceptions, and daily milk movement from one premium
              operations workspace.
            </p>
          </div>

          <div className="grid gap-2 sm:grid-cols-3 lg:min-w-[600px]">
            <button
              type="button"
              onClick={generateDeliveries}
              className="premium-button inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-farm-green px-4 py-3 text-sm font-semibold text-white shadow-sm"
            >
              <Route className="h-4 w-4" />
              Generate Route
            </button>
            <Link
              href="/operations"
              className="premium-button inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-farm-wheat bg-farm-cream px-4 py-3 text-sm font-semibold text-farm-green shadow-sm"
            >
              <ClipboardList className="h-4 w-4" />
              Operations
            </Link>
            <button
              type="button"
              onClick={resetDemoData}
              className="premium-button inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-farm-green/10 bg-white px-4 py-3 text-sm font-semibold text-farm-green shadow-sm"
            >
              <RefreshCcw className="h-4 w-4" />
              Reset Demo
            </button>
          </div>
        </div>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {executiveCards.map((card) => {
          const Icon = card.icon;
          return (
            <article key={card.label} className="glass-card border-farm-green/10 p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground">{card.label}</p>
                  <p className="mt-2 font-display text-3xl font-black text-farm-green">{card.value}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{card.detail}</p>
                </div>
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-farm-green text-white">
                  <Icon className="h-5 w-5" />
                </span>
              </div>
            </article>
          );
        })}
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-[1.12fr_0.88fr]">
        <section className="glass-card border-farm-green/10 p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.12em] text-farm-wheat">Route dispatch</p>
              <h2 className="mt-2 text-2xl font-black text-farm-green">Today&apos;s Delivery Run</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Route demand grouped by area, using the current saved delivery board.
              </p>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="rounded-md bg-farm-cream px-3 py-2">
                <p className="text-lg font-black text-farm-green">{deliveryCounts.pending}</p>
                <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-muted-foreground">Pending</p>
              </div>
              <div className="rounded-md bg-green-50 px-3 py-2">
                <p className="text-lg font-black text-green-800">{deliveryCounts.delivered}</p>
                <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-green-700">Done</p>
              </div>
              <div className="rounded-md bg-red-50 px-3 py-2">
                <p className="text-lg font-black text-red-800">{deliveryCounts.missed}</p>
                <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-red-700">Missed</p>
              </div>
            </div>
          </div>

          {routeSummary.length > 0 ? (
            <div className="mt-5 grid gap-3 md:grid-cols-2">
              {routeSummary.map((route) => (
                <div key={route.area} className="rounded-md border border-farm-green/10 bg-white/80 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="inline-flex items-center gap-2 font-bold text-farm-green">
                      <MapPin className="h-4 w-4 text-farm-wheat" />
                      {route.area}
                    </p>
                    <span className="rounded-md bg-farm-green px-2 py-1 text-xs font-black text-white">
                      {route.liters}L
                    </span>
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                    <div className="rounded-md bg-farm-cream px-3 py-2">
                      <p className="font-black text-farm-green">{route.deliveries}</p>
                      <p className="text-xs text-muted-foreground">Stops</p>
                    </div>
                    <div className="rounded-md bg-farm-cream px-3 py-2">
                      <p className="font-black text-farm-green">{route.pending}</p>
                      <p className="text-xs text-muted-foreground">Open</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-5 rounded-md border border-dashed border-farm-green/20 bg-farm-cream p-6 text-sm text-muted-foreground">
              No route demand yet. Generate deliveries after customer subscriptions are ready.
            </div>
          )}
        </section>

        <section className="glass-card border-farm-green/10 p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.12em] text-farm-wheat">Quick add</p>
              <h2 className="mt-2 text-2xl font-black text-farm-green">New Subscription</h2>
            </div>
            <span className="flex h-10 w-10 items-center justify-center rounded-md bg-farm-green text-white">
              <Plus className="h-5 w-5" />
            </span>
          </div>

          <div className="mt-5 space-y-4">
            <label className="block">
              <span className="text-sm font-semibold text-farm-ink">Customer / House</span>
              <input
                value={form.name}
                onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
                placeholder="e.g. 52 E Model Town"
                className="mt-1 min-h-11 w-full rounded-md border border-farm-green/10 bg-white px-3 py-2 text-sm outline-none ring-farm-green focus:ring-2"
              />
            </label>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="block">
                <span className="text-sm font-semibold text-farm-ink">Area</span>
                <select
                  value={form.area}
                  onChange={(event) => setForm((current) => ({ ...current, area: event.target.value }))}
                  className="mt-1 min-h-11 w-full rounded-md border border-farm-green/10 bg-white px-3 py-2 text-sm outline-none ring-farm-green focus:ring-2"
                >
                  {["Model Town", "Bahria", "Gulberg", "Johar Town", "Cantt", "Iqbal Town"].map((area) => (
                    <option key={area}>{area}</option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="text-sm font-semibold text-farm-ink">Product</span>
                <select
                  value={form.product}
                  onChange={(event) => setForm((current) => ({ ...current, product: event.target.value }))}
                  className="mt-1 min-h-11 w-full rounded-md border border-farm-green/10 bg-white px-3 py-2 text-sm outline-none ring-farm-green focus:ring-2"
                >
                  {products.map((product) => (
                    <option key={product.id}>{product.name}</option>
                  ))}
                </select>
              </label>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="block">
                <span className="text-sm font-semibold text-farm-ink">Daily Quantity</span>
                <input
                  value={form.quantity}
                  onChange={(event) => setForm((current) => ({ ...current, quantity: event.target.value }))}
                  type="number"
                  min="1"
                  className="mt-1 min-h-11 w-full rounded-md border border-farm-green/10 bg-white px-3 py-2 text-sm outline-none ring-farm-green focus:ring-2"
                />
              </label>
              <label className="block">
                <span className="text-sm font-semibold text-farm-ink">Frequency</span>
                <select
                  value={form.frequency}
                  onChange={(event) => setForm((current) => ({ ...current, frequency: event.target.value }))}
                  className="mt-1 min-h-11 w-full rounded-md border border-farm-green/10 bg-white px-3 py-2 text-sm outline-none ring-farm-green focus:ring-2"
                >
                  <option>Daily</option>
                  <option>Weekly</option>
                  <option>Custom</option>
                </select>
              </label>
            </div>
            <div className="rounded-md border border-farm-green/10 bg-farm-cream p-3 text-sm">
              <span className="text-muted-foreground">Estimated monthly bill</span>
              <span className="ml-2 font-black text-farm-green">
                {formatCurrency((Number(form.quantity) || 1) * selectedProduct.price * 30)}
              </span>
            </div>
            <button
              type="button"
              onClick={addCustomer}
              className="premium-button inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-md bg-farm-green px-4 py-3 font-semibold text-white"
            >
              <Plus className="h-4 w-4" />
              Add Customer Subscription
            </button>
          </div>
        </section>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
        <section className="glass-card border-farm-green/10 p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.12em] text-farm-wheat">AI audit</p>
              <h2 className="mt-2 text-2xl font-black text-farm-green">Ledger Exceptions</h2>
              <p className="mt-2 text-sm text-muted-foreground">Finance checks surfaced for admin review.</p>
            </div>
            <span className="flex h-10 w-10 items-center justify-center rounded-md bg-amber-100 text-amber-800">
              <ShieldAlert className="h-5 w-5" />
            </span>
          </div>
          <div className="mt-5 space-y-3">
            <div className="rounded-md border border-amber-200 bg-amber-50 p-4">
              <p className="inline-flex items-center gap-2 font-semibold text-amber-900">
                <AlertTriangle className="h-4 w-4" />
                Payment contradiction detected
              </p>
              <p className="mt-2 text-sm leading-6 text-amber-800">
                69 E Model Town is marked Paid, but pending amount is still {formatCurrency(40920)}.
              </p>
            </div>
            <div className="rounded-md border border-farm-green/10 bg-white/80 p-4">
              <p className="font-semibold text-farm-green">Pending collection</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Current pending ledger amount is {formatCurrency(totals.pending)}.
              </p>
            </div>
            <div className="rounded-md border border-farm-green/10 bg-white/80 p-4">
              <p className="font-semibold text-farm-green">Milk demand</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Dispatch requires {totals.liters} liters across {routeSummary.length} route areas.
              </p>
            </div>
          </div>
        </section>

        <section className="glass-card border-farm-green/10 p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.12em] text-farm-wheat">Collection queue</p>
              <h2 className="mt-2 text-2xl font-black text-farm-green">Priority Customers</h2>
              <p className="mt-2 text-sm text-muted-foreground">Largest pending balances from the current ledger.</p>
            </div>
            <span className="flex h-10 w-10 items-center justify-center rounded-md bg-farm-green text-white">
              <TrendingUp className="h-5 w-5" />
            </span>
          </div>
          {attentionCustomers.length > 0 ? (
            <div className="mt-5 grid gap-3">
              {attentionCustomers.map((customer) => (
                <div
                  key={customer.id}
                  className="flex flex-col gap-3 rounded-md border border-farm-green/10 bg-white/80 p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="font-bold text-farm-green">{customer.name}</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {customer.area} - {customer.quantity}L {customer.product}
                    </p>
                  </div>
                  <div className="text-left sm:text-right">
                    <p className="font-black text-farm-green">{formatCurrency(customer.pending)}</p>
                    <span
                      className={`mt-2 inline-flex rounded-md px-2 py-1 text-xs font-bold ring-1 ${badgeClass(
                        customer.status
                      )}`}
                    >
                      {customer.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-5 rounded-md border border-dashed border-farm-green/20 bg-farm-cream p-6 text-sm text-muted-foreground">
              No pending balances in the current ledger.
            </div>
          )}
        </section>
      </div>

      <section className="glass-card mt-5 border-farm-green/10 p-5">
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-farm-wheat">Customer ledger</p>
            <h2 className="mt-2 text-2xl font-black text-farm-green">Subscriptions & Balances</h2>
          </div>
          <span className="inline-flex w-fit items-center gap-2 rounded-md bg-farm-cream px-3 py-2 text-sm font-bold text-farm-green">
            <Gauge className="h-4 w-4 text-farm-wheat" />
            {customers.length} records
          </span>
        </div>
        {customers.length > 0 ? (
          <div className="overflow-x-auto rounded-md border border-farm-green/10 bg-white/80">
            <table className="w-full min-w-[780px] text-left text-sm">
              <thead className="border-b border-farm-green/10 bg-farm-cream text-farm-green">
                <tr>
                  <th className="p-3">Customer</th>
                  <th className="p-3">Area</th>
                  <th className="p-3">Product</th>
                  <th className="p-3">Qty</th>
                  <th className="p-3">Rate</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Pending</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((customer) => (
                  <tr key={customer.id} className="border-b border-farm-green/10 last:border-0 hover:bg-farm-cream/60">
                    <td className="p-3 font-semibold text-farm-ink">{customer.name}</td>
                    <td className="p-3 text-muted-foreground">{customer.area}</td>
                    <td className="p-3">{customer.product}</td>
                    <td className="p-3">{customer.quantity} L</td>
                    <td className="p-3">{formatCurrency(customer.rate)}</td>
                    <td className="p-3">
                      <span
                        className={`inline-flex rounded-md px-2 py-1 text-xs font-bold ring-1 ${badgeClass(
                          customer.status
                        )}`}
                      >
                        {customer.status}
                      </span>
                    </td>
                    <td className="p-3 text-right font-black text-farm-green">{formatCurrency(customer.pending)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="rounded-md border border-dashed border-farm-green/20 bg-farm-cream p-6 text-sm text-muted-foreground">
            No customers yet. Add a subscription using the quick form.
          </div>
        )}
      </section>

      <section className="glass-card mt-5 border-farm-green/10 p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-farm-wheat">Delivery board</p>
            <h2 className="mt-2 text-2xl font-black text-farm-green">Today&apos;s Stops</h2>
            <p className="mt-2 text-sm text-muted-foreground">Generated deliveries stay saved after refresh.</p>
          </div>
          <span className="inline-flex w-fit items-center gap-2 rounded-md bg-farm-green px-3 py-2 text-sm font-bold text-white">
            <Truck className="h-4 w-4 text-farm-wheat" />
            {totals.liters}L loaded
          </span>
        </div>
        {deliveries.length > 0 ? (
          <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {deliveries.map((delivery) => (
              <article key={delivery.id} className="rounded-md border border-farm-green/10 bg-white/80 p-4 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-bold text-farm-green">{delivery.customer}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{delivery.area}</p>
                  </div>
                  <span className={`rounded-md px-2 py-1 text-xs font-bold ring-1 ${badgeClass(delivery.status)}`}>
                    {delivery.status}
                  </span>
                </div>
                <p className="mt-4 text-sm font-semibold text-farm-ink">
                  {delivery.quantity}L {delivery.product}
                </p>
                <button
                  type="button"
                  onClick={() => markDelivered(delivery.id)}
                  className="premium-button mt-4 inline-flex min-h-10 w-full items-center justify-center rounded-md bg-farm-green px-3 py-2 text-xs font-semibold text-white"
                >
                  Mark Delivered
                </button>
              </article>
            ))}
          </div>
        ) : (
          <div className="mt-5 rounded-md border border-dashed border-farm-green/20 bg-farm-cream p-6 text-sm text-muted-foreground">
            No deliveries generated. Use Generate Route when subscriptions are ready.
          </div>
        )}
      </section>
    </section>
  );
}
