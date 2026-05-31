import { Boxes, ClipboardList, CreditCard, Headphones, Route } from "lucide-react";
import { operationalAgents } from "@/components/admin/admin-erp-demo-data";
import type { AdminAgentMode, AdminSectionId } from "@/components/admin/admin-agent-types";

type AdminAgentStripProps = {
  onFocusSection: (section: AdminSectionId) => void;
  onOpenAgent: (agent: AdminAgentMode) => void;
};

const icons = {
  support: Headphones,
  orders: ClipboardList,
  delivery: Route,
  finance: CreditCard,
  inventory: Boxes
};

export function AdminAgentStrip({ onFocusSection, onOpenAgent }: AdminAgentStripProps) {
  return (
    <section id="agents" tabIndex={-1} aria-labelledby="agents-title" className="admin-erp-card p-5 sm:p-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="admin-erp-eyebrow">Recommendation only</p>
          <h2 id="agents-title" className="mt-2 font-display text-3xl font-bold text-farm-heritage">
            Operational Agents
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-farm-ink/65">
            Deterministic demo recommendations. Every action requires admin confirmation.
          </p>
        </div>
      </div>

      <div className="mt-5 flex snap-x gap-3 overflow-x-auto pb-2 lg:grid lg:grid-cols-5 lg:overflow-visible lg:pb-0">
        {operationalAgents.map((agent) => {
          const Icon = icons[agent.id as keyof typeof icons] ?? Headphones;
          return (
            <article
              key={agent.id}
              className="admin-erp-card min-w-[78vw] snap-start p-4 sm:min-w-[18rem] lg:min-w-0"
            >
              <span className="grid h-11 w-11 place-items-center rounded-2xl bg-farm-cream text-farm-heritage">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <h3 className="mt-4 min-h-12 font-bold leading-6 text-farm-heritage">{agent.title}</h3>
              <p className="mt-2 min-h-10 text-sm leading-5 text-farm-ink/65">{agent.summary}</p>
              <button
                type="button"
                onClick={() => {
                  if ("mode" in agent && agent.mode) onOpenAgent(agent.mode as AdminAgentMode);
                  if ("section" in agent && agent.section) onFocusSection(agent.section as AdminSectionId);
                }}
                className="admin-erp-secondary mt-4 w-full"
              >
                {agent.cta}
              </button>
            </article>
          );
        })}
      </div>
    </section>
  );
}
