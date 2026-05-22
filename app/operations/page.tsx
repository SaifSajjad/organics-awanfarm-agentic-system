import { AppHeader } from "@/components/app-header";
import { OperationsClient } from "@/components/operations-client";

export default function OperationsPage() {
  return (
    <main className="min-h-screen bg-farm-cream">
      <AppHeader />
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-farm-leaf">Operations</p>
        <h1 className="mt-2 text-3xl font-black text-farm-green">Orders, Payments & Expenses</h1>
        <p className="mt-3 max-w-3xl text-muted-foreground">
          Manage the demo order board, collect payments, update delivery status, and record daily expenses.
        </p>
        <div className="mt-6">
          <OperationsClient />
        </div>
      </section>
    </main>
  );
}
