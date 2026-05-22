"use client";

import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, Fuel, PackagePlus, ReceiptText, WalletCards } from "lucide-react";
import { expenses as initialExpenses, orders as initialOrders } from "@/lib/demo-data";
import { useLocalStorageState } from "@/lib/use-local-storage-state";
import { formatCurrency } from "@/lib/utils";

type OrderRow = (typeof initialOrders)[number];
type ExpenseRow = (typeof initialExpenses)[number];

export function OperationsClient() {
  const [orders, setOrders, resetOrders] = useLocalStorageState<OrderRow[]>("oaf-operations-orders", initialOrders);
  const [expenses, setExpenses, resetExpenses] = useLocalStorageState<ExpenseRow[]>(
    "oaf-operations-expenses",
    initialExpenses
  );
  const [expenseForm, setExpenseForm] = useState({ type: "Fuel", amount: "500", note: "" });

  useEffect(() => {
    let active = true;

    async function loadDatabaseData() {
      try {
        const [ordersResponse, expensesResponse] = await Promise.all([
          fetch("/api/orders", { cache: "no-store" }),
          fetch("/api/expenses", { cache: "no-store" })
        ]);

        if (!active || !ordersResponse.ok || !expensesResponse.ok) return;

        const dbOrders = (await ordersResponse.json()) as OrderRow[];
        const dbExpenses = (await expensesResponse.json()) as ExpenseRow[];
        if (dbOrders.length) setOrders(dbOrders);
        if (dbExpenses.length) setExpenses(dbExpenses);
      } catch {
        // Keep localStorage/seed fallback when the database is not ready.
      }
    }

    loadDatabaseData();

    return () => {
      active = false;
    };
  }, [setOrders, setExpenses]);

  const totals = useMemo(() => {
    const revenue = orders.reduce((sum, order) => sum + order.total, 0);
    const paid = orders
      .filter((order) => order.paymentStatus === "Paid")
      .reduce((sum, order) => sum + order.total, 0);
    const expenseTotal = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    return {
      revenue,
      paid,
      pending: revenue - paid,
      expenses: expenseTotal,
      profit: paid - expenseTotal
    };
  }, [orders, expenses]);

  async function markPaid(id: string) {
    try {
      await fetch(`/api/orders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentStatus: "Paid" })
      });
    } catch {
      // Keep localStorage fallback.
    }

    setOrders((current) =>
      current.map((order) => (order.id === id ? { ...order, paymentStatus: "Paid" } : order))
    );
  }

  async function markDelivered(id: string) {
    try {
      await fetch(`/api/orders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ deliveryStatus: "Delivered" })
      });
    } catch {
      // Keep localStorage fallback.
    }

    setOrders((current) =>
      current.map((order) => (order.id === id ? { ...order, deliveryStatus: "Delivered" } : order))
    );
  }

  async function addExpense() {
    const amount = Number(expenseForm.amount);
    if (!amount) return;
    let expense: ExpenseRow = {
      id: `e-${Date.now()}`,
      type: expenseForm.type,
      amount,
      note: expenseForm.note || "Demo expense"
    };

    try {
      const response = await fetch("/api/expenses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(expense)
      });
      if (response.ok) expense = (await response.json()) as ExpenseRow;
    } catch {
      // Keep localStorage fallback.
    }

    setExpenses((current) => [expense, ...current]);
    setExpenseForm({ type: "Fuel", amount: "500", note: "" });
  }

  function resetDemoData() {
    resetOrders();
    resetExpenses();
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <button
          onClick={resetDemoData}
          className="min-h-11 rounded-md border bg-white px-4 py-3 text-sm font-semibold text-farm-green shadow-sm"
        >
          Reset Demo Data
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        {[
          ["Total Orders", formatCurrency(totals.revenue), ReceiptText],
          ["Paid", formatCurrency(totals.paid), CheckCircle2],
          ["Pending", formatCurrency(totals.pending), WalletCards],
          ["Expenses", formatCurrency(totals.expenses), Fuel]
        ].map(([label, value, Icon]) => (
          <div key={label as string} className="rounded-md border bg-white p-4 shadow-sm">
            <Icon className="h-5 w-5 text-farm-green" />
            <p className="mt-3 text-sm text-muted-foreground">{label as string}</p>
            <p className="mt-1 text-2xl font-bold text-farm-green">{value as string}</p>
          </div>
        ))}
      </div>

      <section className="rounded-md border bg-white p-5 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-farm-green">Orders & Payments</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Mark payment and delivery status. Changes persist after refresh.
          </p>
        </div>
        {orders.length > 0 ? (
          <div className="mt-4 overflow-x-auto rounded-md border">
            <table className="w-full min-w-[780px] text-left text-sm">
              <thead className="border-b bg-farm-cream text-farm-green">
                <tr>
                  <th className="p-3">Customer</th>
                  <th className="p-3">Area</th>
                  <th className="p-3">Product</th>
                  <th className="p-3">Qty</th>
                  <th className="p-3">Total</th>
                  <th className="p-3">Payment</th>
                  <th className="p-3">Delivery</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="border-b last:border-0 hover:bg-farm-cream/60">
                    <td className="p-3 font-semibold">{order.customer}</td>
                    <td className="p-3">{order.area}</td>
                    <td className="p-3">{order.product}</td>
                    <td className="p-3">{order.quantity}L</td>
                    <td className="p-3 font-semibold">{formatCurrency(order.total)}</td>
                    <td className="p-3">{order.paymentStatus}</td>
                    <td className="p-3">{order.deliveryStatus}</td>
                    <td className="p-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => markPaid(order.id)}
                          className="min-h-9 rounded-md bg-secondary px-3 py-2 text-xs font-semibold text-farm-green"
                        >
                          Mark Paid
                        </button>
                        <button
                          onClick={() => markDelivered(order.id)}
                          className="min-h-9 rounded-md bg-farm-green px-3 py-2 text-xs font-semibold text-white"
                        >
                          Mark Delivered
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="mt-4 rounded-md border border-dashed bg-farm-cream p-6 text-sm text-muted-foreground">
            No orders available. Reset demo data to reload seed orders.
          </div>
        )}
      </section>

      <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        <section className="rounded-md border bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <PackagePlus className="h-5 w-5 text-farm-green" />
            <h2 className="text-xl font-bold text-farm-green">Add Expense</h2>
          </div>
          <div className="mt-4 space-y-3">
            <select
              value={expenseForm.type}
              onChange={(event) => setExpenseForm((current) => ({ ...current, type: event.target.value }))}
              className="w-full rounded-md border bg-white px-3 py-2 outline-none ring-farm-green focus:ring-2"
            >
              <option>Fuel</option>
              <option>Rider</option>
              <option>Packaging</option>
              <option>Milk Purchase</option>
              <option>Misc</option>
            </select>
            <input
              value={expenseForm.amount}
              onChange={(event) => setExpenseForm((current) => ({ ...current, amount: event.target.value }))}
              type="number"
              className="w-full rounded-md border bg-white px-3 py-2 outline-none ring-farm-green focus:ring-2"
            />
            <input
              value={expenseForm.note}
              onChange={(event) => setExpenseForm((current) => ({ ...current, note: event.target.value }))}
              placeholder="Expense note"
              className="w-full rounded-md border bg-white px-3 py-2 outline-none ring-farm-green focus:ring-2"
            />
            <button
              onClick={addExpense}
              className="min-h-11 w-full rounded-md bg-farm-green px-4 py-3 font-semibold text-white"
            >
              Add Expense
            </button>
          </div>
        </section>

        <section className="rounded-md border bg-white p-5 shadow-sm">
          <h2 className="text-xl font-bold text-farm-green">Expense Ledger</h2>
          <p className="mt-1 text-sm text-muted-foreground">Fuel, rider, packaging, and other demo costs.</p>
          {expenses.length > 0 ? (
            <div className="mt-4 space-y-2">
              {expenses.map((expense) => (
                <div key={expense.id} className="flex items-center justify-between gap-4 rounded-md bg-farm-cream p-3">
                  <div>
                    <p className="font-semibold">{expense.type}</p>
                    <p className="text-sm text-muted-foreground">{expense.note}</p>
                  </div>
                  <p className="font-bold text-farm-green">{formatCurrency(expense.amount)}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-4 rounded-md border border-dashed bg-farm-cream p-6 text-sm text-muted-foreground">
              No expenses yet. Add fuel, rider, or packaging expenses from the form.
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
