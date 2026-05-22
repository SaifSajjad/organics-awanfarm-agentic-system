"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  CreditCard,
  Milk,
  PackageCheck,
  Plus,
  Route,
  WalletCards,
  Truck,
  Users
} from "lucide-react";
import { StatCard } from "@/components/stat-card";
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

  return (
    <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-farm-leaf">Admin Dashboard</p>
          <h1 className="text-3xl font-black text-farm-green">Today&apos;s Farm Control Center</h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Add subscriptions, generate delivery work, and review finance alerts from one screen.
          </p>
        </div>
        <div className="grid gap-2 sm:grid-cols-3 lg:min-w-[560px]">
          <button
            onClick={generateDeliveries}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-farm-green px-4 py-3 text-sm font-semibold text-white shadow-sm"
          >
            <Route className="h-5 w-5" />
            Generate Deliveries
          </button>
          <Link
            href="/operations"
            className="inline-flex min-h-11 items-center justify-center rounded-md border bg-white px-4 py-3 text-sm font-semibold text-farm-green shadow-sm"
          >
            Open Operations
          </Link>
          <button
            onClick={resetDemoData}
            className="inline-flex min-h-11 items-center justify-center rounded-md border bg-white px-4 py-3 text-sm font-semibold text-farm-green shadow-sm"
          >
            Reset Demo
          </button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <StatCard
          label="Monthly Revenue"
          value={formatCurrency(totals.monthlyRevenue)}
          detail="Calculated from saved subscriptions"
          icon={<CreditCard className="h-5 w-5" />}
        />
        <StatCard
          label="Net Profit"
          value={formatCurrency(totals.netProfit)}
          detail={`${formatCurrency(totals.expenseTotal)} expenses`}
          icon={<PackageCheck className="h-5 w-5" />}
        />
        <StatCard
          label="Active Customers"
          value={String(customers.length)}
          detail="Live demo records"
          icon={<Users className="h-5 w-5" />}
        />
        <StatCard
          label="Today Deliveries"
          value={String(deliveries.length)}
          detail={`${deliveries.length} deliveries`}
          icon={<Truck className="h-5 w-5" />}
        />
        <StatCard
          label="Pending Payments"
          value={formatCurrency(totals.pending)}
          detail="From saved customer ledger"
          icon={<WalletCards className="h-5 w-5" />}
        />
        <StatCard
          label="Today Liters"
          value={`${totals.liters}L`}
          detail="From saved delivery board"
          icon={<Milk className="h-5 w-5" />}
        />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <section className="rounded-md border bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-farm-green">Create Subscription</h2>
              <p className="text-sm text-muted-foreground">Fast MVP form for live demo</p>
            </div>
            <Plus className="h-5 w-5 text-farm-green" />
          </div>

          <div className="space-y-4">
            <label className="block">
              <span className="text-sm font-semibold">Customer / House</span>
              <input
                value={form.name}
                onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
                placeholder="e.g. 52 E Model Town"
                className="mt-1 w-full rounded-md border bg-white px-3 py-2 outline-none ring-farm-green focus:ring-2"
              />
            </label>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="block">
                <span className="text-sm font-semibold">Area</span>
                <select
                  value={form.area}
                  onChange={(event) => setForm((current) => ({ ...current, area: event.target.value }))}
                  className="mt-1 w-full rounded-md border bg-white px-3 py-2 outline-none ring-farm-green focus:ring-2"
                >
                  {["Model Town", "Bahria", "Gulberg", "Johar Town", "Cantt", "Iqbal Town"].map((area) => (
                    <option key={area}>{area}</option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="text-sm font-semibold">Product</span>
                <select
                  value={form.product}
                  onChange={(event) => setForm((current) => ({ ...current, product: event.target.value }))}
                  className="mt-1 w-full rounded-md border bg-white px-3 py-2 outline-none ring-farm-green focus:ring-2"
                >
                  {products.map((product) => (
                    <option key={product.id}>{product.name}</option>
                  ))}
                </select>
              </label>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="block">
                <span className="text-sm font-semibold">Daily Quantity</span>
                <input
                  value={form.quantity}
                  onChange={(event) => setForm((current) => ({ ...current, quantity: event.target.value }))}
                  type="number"
                  min="1"
                  className="mt-1 w-full rounded-md border bg-white px-3 py-2 outline-none ring-farm-green focus:ring-2"
                />
              </label>
              <label className="block">
                <span className="text-sm font-semibold">Frequency</span>
                <select
                  value={form.frequency}
                  onChange={(event) => setForm((current) => ({ ...current, frequency: event.target.value }))}
                  className="mt-1 w-full rounded-md border bg-white px-3 py-2 outline-none ring-farm-green focus:ring-2"
                >
                  <option>Daily</option>
                  <option>Weekly</option>
                  <option>Custom</option>
                </select>
              </label>
            </div>
            <div className="rounded-md bg-farm-cream p-3 text-sm">
              Estimated monthly bill:{" "}
              <span className="font-bold text-farm-green">
                {formatCurrency((Number(form.quantity) || 1) * selectedProduct.price * 30)}
              </span>
            </div>
            <button
              onClick={addCustomer}
              className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-md bg-farm-green px-4 py-3 font-semibold text-white"
            >
              <Plus className="h-5 w-5" />
              Add Customer Subscription
            </button>
          </div>
        </section>

        <section className="rounded-md border bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-farm-green">AI Alerts</h2>
              <p className="text-sm text-muted-foreground">Finance agent style checks</p>
            </div>
            <AlertTriangle className="h-5 w-5 text-amber-700" />
          </div>
          <div className="space-y-3">
            <div className="rounded-md border border-amber-200 bg-amber-50 p-4">
              <p className="font-semibold text-amber-900">Payment contradiction detected</p>
              <p className="mt-1 text-sm text-amber-800">
                69 E Model Town is marked Paid, but pending amount is still {formatCurrency(40920)}.
              </p>
            </div>
            <div className="rounded-md bg-farm-cream p-4">
              <p className="font-semibold text-farm-green">Pending collection</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Current demo pending amount is {formatCurrency(totals.pending)}.
              </p>
            </div>
            <div className="rounded-md bg-farm-cream p-4">
              <p className="font-semibold text-farm-green">Today milk demand</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Generated deliveries require {totals.liters} liters across {new Set(deliveries.map((d) => d.area)).size}{" "}
                route areas.
              </p>
            </div>
          </div>
        </section>
      </div>

      <section className="mt-6 rounded-md border bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-farm-green">Customer Ledger</h2>
            <p className="text-sm text-muted-foreground">Add customer above and it appears here</p>
          </div>
          <Milk className="h-5 w-5 text-farm-green" />
        </div>
        {customers.length > 0 ? (
          <div className="overflow-x-auto rounded-md border">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="border-b bg-farm-cream text-farm-green">
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
                  <tr key={customer.id} className="border-b last:border-0 hover:bg-farm-cream/60">
                    <td className="p-3 font-semibold">{customer.name}</td>
                    <td className="p-3">{customer.area}</td>
                    <td className="p-3">{customer.product}</td>
                    <td className="p-3">{customer.quantity} L</td>
                    <td className="p-3">{formatCurrency(customer.rate)}</td>
                    <td className="p-3">
                      <span className="rounded-md bg-secondary px-2 py-1 text-xs font-semibold">
                        {customer.status}
                      </span>
                    </td>
                    <td className="p-3 text-right font-semibold">{formatCurrency(customer.pending)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="rounded-md border border-dashed bg-farm-cream p-6 text-sm text-muted-foreground">
            No customers yet. Add a subscription using the form above.
          </div>
        )}
      </section>

      <section className="mt-6 rounded-md border bg-white p-5 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-farm-green">Today Delivery Board</h2>
          <p className="mt-1 text-sm text-muted-foreground">Generated deliveries are saved after refresh.</p>
        </div>
        {deliveries.length > 0 ? (
          <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {deliveries.map((delivery) => (
              <article key={delivery.id} className="rounded-md border bg-farm-cream p-4">
                <p className="font-bold text-farm-green">{delivery.customer}</p>
                <p className="mt-1 text-sm text-muted-foreground">{delivery.area}</p>
                <p className="mt-3 text-sm">
                  {delivery.quantity}L {delivery.product}
                </p>
                <div className="mt-3 flex items-center justify-between gap-2">
                  <span className="inline-flex rounded-md bg-white px-2 py-1 text-xs font-semibold">
                    {delivery.status}
                  </span>
                  <button
                    onClick={() => markDelivered(delivery.id)}
                    className="rounded-md bg-farm-green px-3 py-2 text-xs font-semibold text-white"
                  >
                    Mark Delivered
                  </button>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="mt-4 rounded-md border border-dashed bg-farm-cream p-6 text-sm text-muted-foreground">
            No deliveries generated. Click “Generate Today&apos;s Deliveries”.
          </div>
        )}
      </section>
    </section>
  );
}
