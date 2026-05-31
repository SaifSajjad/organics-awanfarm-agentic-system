import {
  AlertTriangle,
  Boxes,
  CheckCircle2,
  ClipboardCheck,
  ClipboardList,
  Copy,
  CreditCard,
  FileText,
  Headphones,
  PackageCheck,
  Route,
  ShieldCheck,
  Truck
} from "lucide-react";
import {
  financeSnapshot,
  informationalQueue,
  initialActivity,
  inventorySnapshot,
  kpiCards,
  priorityQueue,
  quickActions,
  routeSummaries
} from "@/components/admin/admin-erp-demo-data";
import type { AdminSectionId, AdminWorkflowType } from "@/components/admin/admin-agent-types";

type AdminDashboardSectionsProps = {
  activity: string[];
  copyMessage: string | null;
  onCopyNote: (text: string, label: string) => void;
  onFocusSection: (section: AdminSectionId) => void;
  onOpenWorkflow: (workflow: AdminWorkflowType) => void;
};

const iconMap = {
  "Today's Dispatch": Truck,
  "Route Readiness": Route,
  "Pending Actions": ClipboardCheck,
  Collections: CreditCard
};

export function KpiStrip() {
  return (
    <section aria-labelledby="admin-kpi-title" className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      <h2 id="admin-kpi-title" className="sr-only">
        Admin KPI strip
      </h2>
      {kpiCards.map((card) => {
        const Icon = iconMap[card.label as keyof typeof iconMap] ?? ShieldCheck;
        return (
          <article key={card.label} className="admin-erp-card p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-label text-xs font-bold uppercase tracking-[0.16em] text-farm-ink/50">
                  {card.label}
                </p>
                <p className="mt-3 font-display text-3xl font-bold text-farm-heritage">{card.value}</p>
                <p className="mt-2 text-sm leading-6 text-farm-ink/65">{card.detail}</p>
              </div>
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-farm-heritage text-white">
                <Icon className="h-5 w-5 text-farm-gold" aria-hidden="true" />
              </span>
            </div>
          </article>
        );
      })}
    </section>
  );
}

export function PriorityActionQueue({ onOpenWorkflow, onFocusSection }: AdminDashboardSectionsProps) {
  return (
    <section id="priority" tabIndex={-1} aria-labelledby="priority-title" className="admin-erp-card p-5 sm:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="admin-erp-eyebrow">Admin review queue</p>
          <h2 id="priority-title" className="mt-2 font-display text-3xl font-bold text-farm-heritage">
            Priority Action Queue
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-farm-ink/65">
            Demo items are prepared for admin review. Nothing is approved or changed from this queue.
          </p>
        </div>
        <span className="inline-flex min-h-10 w-fit items-center gap-2 rounded-full bg-farm-gold/20 px-3 py-2 text-sm font-bold text-farm-heritage">
          <AlertTriangle className="h-4 w-4" aria-hidden="true" />
          6 items
        </span>
      </div>

      <div className="mt-5 grid gap-3">
        {priorityQueue.map((item) => (
          <article key={item.id} className={`admin-erp-priority admin-erp-priority-${item.tone}`}>
            <div>
              <h3 className="font-bold text-farm-heritage">{item.title}</h3>
              <p className="mt-1 text-sm font-semibold text-farm-ink/75">{item.customer}</p>
              <p className="mt-1 text-sm text-farm-ink/60">{item.detail}</p>
            </div>
            <button
              type="button"
              onClick={() => onOpenWorkflow(item.workflow)}
              className="admin-erp-primary min-w-28"
            >
              {item.cta}
            </button>
          </article>
        ))}

        <div className="grid gap-3 lg:grid-cols-2">
          {informationalQueue.map((item) => (
            <button
              key={item.title}
              type="button"
              onClick={() => onFocusSection(item.section)}
              className="min-h-20 rounded-2xl border border-farm-heritage/10 bg-farm-cream px-4 py-3 text-left transition-transform hover:-translate-y-0.5 active:scale-[0.99]"
            >
              <span className="block font-bold text-farm-heritage">{item.title}</span>
              <span className="mt-1 block text-sm text-farm-ink/65">{item.detail}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

export function RouteDispatchSummary({ onCopyNote }: AdminDashboardSectionsProps) {
  return (
    <section id="dispatch" tabIndex={-1} aria-labelledby="dispatch-title" className="admin-erp-card p-5 sm:p-6">
      <div>
        <p className="admin-erp-eyebrow">Route dispatch</p>
        <h2 id="dispatch-title" className="mt-2 font-display text-3xl font-bold text-farm-heritage">
          Route Dispatch Summary
        </h2>
        <p className="mt-2 text-sm leading-6 text-farm-ink/65">
          Review route readiness without maps, GPS, ETA claims, or dispatch controls.
        </p>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-3">
        {routeSummaries.map((route) => {
          const reviewRequired = route.status === "Review required";
          return (
            <article key={route.title} className="rounded-3xl border border-farm-heritage/10 bg-white p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-bold text-farm-heritage">{route.title}</h3>
                  <p className="mt-2 text-sm text-farm-ink/65">Rider: {route.rider}</p>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-[0.1em] ${
                    reviewRequired ? "bg-farm-warning/15 text-amber-800" : "bg-green-100 text-green-800"
                  }`}
                >
                  {route.status}
                </span>
              </div>
              <p className="mt-4 font-display text-3xl font-bold text-farm-heritage">{route.stops}</p>
              <p className="text-sm text-farm-ink/60">Stops</p>
              <div className="mt-5 grid gap-2 sm:grid-cols-2 lg:grid-cols-1 2xl:grid-cols-2">
                <button type="button" className="admin-erp-secondary">
                  Review Route
                </button>
                <button
                  type="button"
                  onClick={() => onCopyNote(route.note, "Route note copied for manual review.")}
                  className="admin-erp-secondary"
                >
                  <Copy className="h-4 w-4" aria-hidden="true" />
                  Copy Note
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

export function QuickActions({ onFocusSection }: AdminDashboardSectionsProps) {
  const icons = [Headphones, ClipboardList, Truck, CreditCard, Boxes];
  return (
    <section aria-labelledby="quick-actions-title" className="admin-erp-card p-5 sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="admin-erp-eyebrow">Navigation shortcuts</p>
          <h2 id="quick-actions-title" className="mt-2 font-display text-3xl font-bold text-farm-heritage">
            Quick Actions
          </h2>
        </div>
        <PackageCheck className="h-6 w-6 text-farm-gold" aria-hidden="true" />
      </div>
      <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        {quickActions.map((action, index) => {
          const Icon = icons[index] ?? ClipboardList;
          return (
            <button
              key={action.label}
              type="button"
              onClick={() => onFocusSection(action.section)}
              className="admin-erp-card group min-h-32 p-4 text-left transition-transform hover:-translate-y-1 active:scale-[0.99]"
            >
              <span className="grid h-11 w-11 place-items-center rounded-2xl bg-farm-cream text-farm-heritage group-hover:bg-farm-heritage group-hover:text-white">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <span className="mt-4 block font-bold text-farm-heritage">{action.label}</span>
              <span className="mt-1 block text-sm text-farm-ink/60">Focus section only</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}

export function FinanceSnapshot() {
  return (
    <section id="finance" tabIndex={-1} aria-labelledby="finance-title" className="admin-erp-card p-5 sm:p-6">
      <div>
        <p className="admin-erp-eyebrow">Manual finance review</p>
        <h2 id="finance-title" className="mt-2 font-display text-3xl font-bold text-farm-heritage">
          Finance Snapshot
        </h2>
      </div>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {financeSnapshot.map((item) => (
          <article key={item.label} className="rounded-2xl border border-farm-heritage/10 bg-farm-cream p-4">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-farm-ink/50">{item.label}</p>
            <p className="mt-2 font-display text-2xl font-bold text-farm-heritage">{item.value}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

export function InventorySnapshot() {
  return (
    <section id="inventory" tabIndex={-1} aria-labelledby="inventory-title" className="admin-erp-card p-5 sm:p-6">
      <div>
        <p className="admin-erp-eyebrow">Supply snapshot</p>
        <h2 id="inventory-title" className="mt-2 font-display text-3xl font-bold text-farm-heritage">
          Inventory Snapshot
        </h2>
      </div>
      <div className="mt-5 space-y-4">
        {inventorySnapshot.map((item) => {
          const barClass =
            item.tone === "amber" ? "bg-farm-warning" : item.tone === "gold" ? "bg-farm-gold" : "bg-farm-heritage";
          return (
            <article key={item.label} className="rounded-2xl border border-farm-heritage/10 bg-white p-4">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="font-bold text-farm-heritage">{item.label}</h3>
                  <p className="mt-1 text-sm text-farm-ink/65">{item.available}</p>
                </div>
                <p className="text-sm font-semibold text-farm-ink/70">{item.required}</p>
              </div>
              <div className="mt-4 h-2 overflow-hidden rounded-full bg-farm-cream">
                <div className={`h-full rounded-full ${barClass}`} style={{ width: `${item.bar}%` }} />
              </div>
              <p className="mt-2 text-sm font-semibold text-farm-heritage">{item.buffer}</p>
            </article>
          );
        })}
      </div>
    </section>
  );
}

export function RecentActivity({ activity }: AdminDashboardSectionsProps) {
  const rows = activity.length ? activity : initialActivity;
  return (
    <section aria-labelledby="activity-title" className="admin-erp-card p-5 sm:p-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="admin-erp-eyebrow">Demo activity only</p>
          <h2 id="activity-title" className="mt-2 font-display text-3xl font-bold text-farm-heritage">
            Recent Activity
          </h2>
        </div>
        <FileText className="h-6 w-6 text-farm-gold" aria-hidden="true" />
      </div>
      <div className="mt-5 space-y-3">
        {rows.map((item) => (
          <article key={item} className="flex gap-3 rounded-2xl border border-farm-heritage/10 bg-white p-4">
            <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-farm-sage/35 text-farm-heritage">
              <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
            </span>
            <div>
              <p className="font-semibold text-farm-heritage">{item}</p>
              <p className="mt-1 text-xs font-bold uppercase tracking-[0.12em] text-farm-ink/45">
                Demo activity only
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
