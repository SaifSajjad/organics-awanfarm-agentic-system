"use client";

import { useCallback, useRef, useState } from "react";
import {
  Boxes,
  ClipboardList,
  Headphones,
  Home,
  Menu,
  PackageCheck,
  Route,
  ShieldCheck,
  Sparkles,
  WalletCards,
  X
} from "lucide-react";
import { AdminAgentDrawer } from "@/components/admin/admin-agent-drawer";
import { AdminAgentStrip } from "@/components/admin/admin-agent-strip";
import { initialActivity } from "@/components/admin/admin-erp-demo-data";
import type { AdminAgentMode, AdminAgentState, AdminSectionId, AdminWorkflowType } from "@/components/admin/admin-agent-types";
import {
  FinanceSnapshot,
  InventorySnapshot,
  KpiStrip,
  PriorityActionQueue,
  QuickActions,
  RecentActivity,
  RouteDispatchSummary
} from "@/components/admin/admin-dashboard-sections";
import { AdminWorkflowDrawer } from "@/components/admin/admin-workflow-drawer";

type AdminDashboardClientProps = {
  initialAgent: AdminAgentMode | null;
  initialAgentState: AdminAgentState;
};

const navItems: Array<{ label: string; section: AdminSectionId; icon: typeof Home }> = [
  { label: "Home", section: "home", icon: Home },
  { label: "Approvals", section: "priority", icon: ClipboardList },
  { label: "Dispatch", section: "dispatch", icon: Route },
  { label: "Finance", section: "finance", icon: WalletCards },
  { label: "Inventory", section: "inventory", icon: Boxes },
  { label: "Agents", section: "agents", icon: Sparkles },
  { label: "Support", section: "support", icon: Headphones }
];

export function AdminDashboardClient({ initialAgent, initialAgentState }: AdminDashboardClientProps) {
  const sectionRefs = useRef<Partial<Record<AdminSectionId, HTMLElement | null>>>({});
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [agentMode, setAgentMode] = useState<AdminAgentMode | null>(initialAgent);
  const [agentState, setAgentState] = useState<AdminAgentState>(initialAgentState);
  const [workflow, setWorkflow] = useState<AdminWorkflowType | null>(null);
  const [activity, setActivity] = useState(initialActivity);
  const [copyMessage, setCopyMessage] = useState<string | null>(null);

  const registerSection = useCallback((section: AdminSectionId) => {
    return (node: HTMLElement | null) => {
      sectionRefs.current[section] = node;
    };
  }, []);

  function focusSection(section: AdminSectionId) {
    const target = sectionRefs.current[section] ?? document.getElementById(section);
    target?.scrollIntoView({ behavior: "smooth", block: "start" });
    window.setTimeout(() => target?.focus({ preventScroll: true }), 260);
    setMobileNavOpen(false);
  }

  function openAgent(mode: AdminAgentMode, state: AdminAgentState = "ready") {
    setAgentMode(mode);
    setAgentState(state);
  }

  async function copyToClipboard(text: string, label: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopyMessage(label);
    } catch {
      setCopyMessage("Copy is unavailable in this browser. Text remains visible for manual selection.");
    }
    window.setTimeout(() => setCopyMessage(null), 2600);
  }

  function addActivity(message: string) {
    setActivity((current) => [`${message} - Demo activity only`, ...current].slice(0, 7));
  }

  const sharedSectionProps = {
    activity,
    copyMessage,
    onCopyNote: copyToClipboard,
    onFocusSection: focusSection,
    onOpenWorkflow: setWorkflow
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-farm-meadow text-farm-ink">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 flex-col overflow-y-auto bg-farm-heritage px-5 py-6 text-white shadow-premium lg:flex">
        <div className="shrink-0">
          <p className="font-display text-2xl font-bold text-farm-gold">Organics by Awan Farms</p>
          <p className="mt-2 text-sm leading-6 text-white/65">Admin ERP Control Center</p>
        </div>
        <nav aria-label="Admin dashboard" className="mt-10 shrink-0 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.label}
                type="button"
                onClick={() => focusSection(item.section)}
                className="flex min-h-12 w-full items-center gap-3 rounded-2xl px-4 text-left text-sm font-bold text-white/75 transition-colors hover:bg-white/10 hover:text-white focus-visible:text-white"
              >
                <Icon className="h-5 w-5 text-farm-gold" aria-hidden="true" />
                {item.label}
              </button>
            );
          })}
        </nav>
        <div className="mt-8 rounded-3xl border border-white/10 bg-white/10 p-4">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-farm-gold">Safety rule</p>
          <p className="mt-2 text-sm leading-6 text-white/70">
            Agent recommends - admin reviews - workflow drawer opens - admin confirms later.
          </p>
        </div>
      </aside>

      <div className="lg:pl-72">
        <header
          id="home"
          ref={registerSection("home")}
          tabIndex={-1}
          className="sticky top-0 z-30 border-b border-farm-heritage/10 bg-farm-meadow/92 px-4 py-4 backdrop-blur-xl sm:px-6 lg:px-8"
        >
          <div className="mx-auto flex max-w-[1500px] items-center justify-between gap-4">
            <div>
              <p className="font-label text-xs font-bold uppercase tracking-[0.18em] text-farm-ink/50">
                Admin ERP Control Center
              </p>
              <h1 className="mt-1 font-display text-2xl font-bold text-farm-heritage sm:text-3xl">
                Organics by Awan Farms
              </h1>
            </div>
            <div className="hidden items-center gap-3 md:flex">
              <span className="admin-erp-badge">
                <ShieldCheck className="h-4 w-4" aria-hidden="true" />
                Demo data
              </span>
              <span className="admin-erp-badge">
                <PackageCheck className="h-4 w-4" aria-hidden="true" />
                Recommendation only
              </span>
            </div>
            <button
              type="button"
              onClick={() => setMobileNavOpen((current) => !current)}
              className="admin-erp-icon-button lg:hidden"
              aria-expanded={mobileNavOpen}
              aria-controls="admin-mobile-nav"
              aria-label="Toggle admin navigation"
            >
              {mobileNavOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
          {mobileNavOpen ? (
            <nav id="admin-mobile-nav" aria-label="Admin mobile navigation" className="mx-auto mt-4 grid max-w-[1500px] gap-2 sm:grid-cols-2 lg:hidden">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => focusSection(item.section)}
                    className="flex min-h-12 items-center gap-3 rounded-2xl border border-farm-heritage/10 bg-white px-4 text-left text-sm font-bold text-farm-heritage shadow-soft-card"
                  >
                    <Icon className="h-5 w-5 text-farm-gold" aria-hidden="true" />
                    {item.label}
                  </button>
                );
              })}
            </nav>
          ) : null}
        </header>

        <main className="mx-auto max-w-[1500px] space-y-6 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <section className="admin-erp-reveal rounded-[2rem] bg-farm-heritage p-6 text-white shadow-premium sm:p-8">
            <div className="grid gap-6 xl:grid-cols-[1fr_auto] xl:items-end">
              <div>
                <p className="font-label text-xs font-bold uppercase tracking-[0.18em] text-farm-gold">
                  Operational Heritage
                </p>
                <h2 className="mt-3 font-display text-4xl font-bold sm:text-5xl">Morning Operations State</h2>
                <p className="mt-4 max-w-3xl text-sm leading-7 text-white/72 sm:text-base">
                  A controlled UI-only ERP dashboard for approvals, dispatch review, finance checks, inventory
                  snapshots, and deterministic demo agent recommendations.
                </p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/10 p-4 text-sm leading-6 text-white/75 xl:w-96">
                <p className="font-bold text-farm-gold">Permanent UX rule</p>
                <p className="mt-2">
                  Agent recommends - admin reviews - relevant workflow drawer opens - admin explicitly confirms later -
                  system mutation later.
                </p>
              </div>
            </div>
          </section>

          <KpiStrip />

          <div ref={registerSection("priority")}>
            <PriorityActionQueue {...sharedSectionProps} />
          </div>

          <div ref={registerSection("dispatch")}>
            <RouteDispatchSummary {...sharedSectionProps} />
          </div>

          <div ref={registerSection("agents")}>
            <AdminAgentStrip onFocusSection={focusSection} onOpenAgent={openAgent} />
          </div>

          <QuickActions {...sharedSectionProps} />

          <div className="grid gap-6 xl:grid-cols-[minmax(0,0.92fr)_minmax(0,0.92fr)_minmax(340px,0.8fr)]">
            <div ref={registerSection("finance")} className="min-w-0">
              <FinanceSnapshot />
            </div>
            <div ref={registerSection("inventory")} className="min-w-0">
              <InventorySnapshot />
            </div>
            <div ref={registerSection("support")} className="min-w-0">
              <RecentActivity {...sharedSectionProps} />
            </div>
          </div>
        </main>
      </div>

      {copyMessage ? (
        <p
          role="status"
          aria-live="polite"
          className="admin-agent-copy-confirm fixed left-4 right-4 top-24 z-[140] mx-auto max-w-xl rounded-2xl border border-farm-gold/30 bg-white px-4 py-3 text-sm font-bold text-farm-heritage shadow-premium"
        >
          {copyMessage}
        </p>
      ) : null}

      <AdminAgentDrawer
        mode={agentMode}
        state={agentState}
        onClose={() => setAgentMode(null)}
        onCopy={copyToClipboard}
        onFocusFinance={() => focusSection("finance")}
        onFocusRouteDispatch={() => focusSection("dispatch")}
        onOpenWorkflow={(nextWorkflow) => {
          setAgentMode(null);
          setWorkflow(nextWorkflow);
        }}
      />
      <AdminWorkflowDrawer
        workflow={workflow}
        onClose={() => setWorkflow(null)}
        onLocalActivity={addActivity}
      />
    </div>
  );
}
