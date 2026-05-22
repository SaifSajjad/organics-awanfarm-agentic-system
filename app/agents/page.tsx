import { AppHeader } from "@/components/app-header";
import { AgentsClient } from "@/components/agents-client";

export default function AgentsPage() {
  return (
    <main className="min-h-screen bg-farm-cream">
      <AppHeader />
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-farm-leaf">Agentic AI Layer</p>
        <h1 className="mt-2 text-3xl font-black text-farm-green">AI Agents Demo Center</h1>
        <p className="mt-3 max-w-3xl text-muted-foreground">
          Run deterministic demo agents for customer support, delivery planning, and finance summaries. Delivery and
          finance agents use the latest saved demo state from Admin and Operations.
        </p>
        <AgentsClient />
      </section>
    </main>
  );
}
