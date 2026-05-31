"use client";

import { useEffect, useRef, useState } from "react";
import { AlertTriangle, Copy, ExternalLink, FileText, ShieldCheck, X } from "lucide-react";
import { agentContent } from "@/components/admin/admin-erp-demo-data";
import type { AdminAgentMode, AdminAgentState, AdminWorkflowType } from "@/components/admin/admin-agent-types";

type AdminAgentDrawerProps = {
  mode: AdminAgentMode | null;
  state: AdminAgentState;
  onClose: () => void;
  onCopy: (text: string, label: string) => void;
  onFocusFinance: () => void;
  onFocusRouteDispatch: () => void;
  onOpenWorkflow: (workflow: AdminWorkflowType) => void;
};

type AgentContent = (typeof agentContent)[AdminAgentMode];

const stateCopy = {
  loading: {
    title: "Preparing demo summary...",
    body: "Loading the local fixture for this recommendation."
  },
  empty: {
    title: "Nothing needs your attention right now.",
    body: "No demo alerts are available for this agent."
  },
  error: {
    title: "Demo summary could not load.",
    body: "The local fixture could not be prepared. Try again or close the assistant."
  },
  unavailable: {
    title: "Demo summary unavailable.",
    body: "This local fixture is not available for the selected agent."
  }
};

export function AdminAgentDrawer({
  mode,
  state,
  onClose,
  onCopy,
  onFocusFinance,
  onFocusRouteDispatch,
  onOpenWorkflow
}: AdminAgentDrawerProps) {
  const panelRef = useRef<HTMLElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);
  const [viewState, setViewState] = useState<AdminAgentState>(state);
  const [selectedChip, setSelectedChip] = useState<string>("");

  useEffect(() => {
    if (!mode) return;
    const content = agentContent[mode] as AgentContent;
    setViewState(state);
    setSelectedChip(String(content.defaultChip));
  }, [mode, state]);

  useEffect(() => {
    if (!mode) return;
    returnFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const timeout = window.setTimeout(() => {
      panelRef.current?.querySelector<HTMLElement>("button, [href], [tabindex]:not([tabindex='-1'])")?.focus();
    }, 0);

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
      if (event.key !== "Tab" || !panelRef.current) return;
      const focusable = Array.from(
        panelRef.current.querySelectorAll<HTMLElement>(
          "button:not([disabled]), [href], textarea, input, select, [tabindex]:not([tabindex='-1'])"
        )
      );
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => {
      window.clearTimeout(timeout);
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      returnFocusRef.current?.focus();
    };
  }, [mode, onClose]);

  if (!mode) return null;

  const content = agentContent[mode] as AgentContent;
  const prepared = String(content.prepared ?? "");

  function handleAction(action: string) {
    if (action === "Copy Draft" || action === "Copy Assignment Note" || action === "Copy Reconciliation Note") {
      onCopy(prepared, `${action.replace("Copy ", "")} copied for manual review.`);
      return;
    }

    if (action === "Open WhatsApp Manually") {
      window.open("https://web.whatsapp.com/", "_blank", "noopener,noreferrer");
      return;
    }

    if (action === "Open Missed Delivery Drawer") {
      onOpenWorkflow("missed-delivery");
      return;
    }

    if (action === "Review Route Dispatch") {
      onClose();
      onFocusRouteDispatch();
      return;
    }

    if (action === "Open Finance Snapshot") {
      onClose();
      onFocusFinance();
    }
  }

  return (
    <div className="fixed inset-0 z-[110]">
      <div className="admin-erp-overlay-fade absolute inset-0 bg-farm-heritage/45" aria-hidden="true" />
      <section
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="admin-agent-title"
        className="admin-agent-panel fixed inset-x-0 bottom-0 z-[111] flex max-h-[92vh] flex-col overflow-hidden rounded-t-[2rem] bg-white shadow-premium-lg md:inset-y-0 md:left-auto md:right-0 md:max-h-none md:w-[480px] md:rounded-none"
      >
        <div className="mx-auto mt-3 h-1.5 w-16 rounded-full bg-farm-heritage/15 md:hidden" aria-hidden="true" />
        <header className="sticky top-0 z-10 border-b border-farm-heritage/10 bg-white px-5 py-4 sm:px-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="admin-erp-eyebrow">{String(content.eyebrow)}</p>
              <h2 id="admin-agent-title" className="mt-1 font-display text-3xl font-bold text-farm-heritage">
                {String(content.title)}
              </h2>
              <p className="mt-2 text-sm leading-6 text-farm-ink/65">{String(content.description)}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <span className="admin-erp-badge">Demo data</span>
                <span className="admin-erp-badge">Recommendation only</span>
              </div>
            </div>
            <button type="button" onClick={onClose} aria-label="Close assistant" className="admin-erp-icon-button">
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto px-5 py-5 sm:px-6">
          {viewState === "ready" ? (
            <div className="admin-agent-response-fade space-y-5">
              <p className="rounded-2xl border border-farm-heritage/10 bg-farm-cream p-4 text-sm font-semibold leading-6 text-farm-heritage">
                <ShieldCheck className="mr-2 inline h-4 w-4 text-farm-gold" aria-hidden="true" />
                {String(content.safety)}
              </p>

              <div className="grid grid-cols-2 gap-3">
                {(content.summary as string[][]).map(([label, value]) => (
                  <article key={label} className="rounded-2xl border border-farm-heritage/10 bg-farm-meadow p-3">
                    <p className="text-xs font-bold uppercase tracking-[0.12em] text-farm-ink/50">{label}</p>
                    <p className="mt-2 font-display text-xl font-bold text-farm-heritage">{value}</p>
                  </article>
                ))}
              </div>

              <article className="rounded-3xl border border-farm-warning/25 bg-farm-warning/10 p-4">
                <p className="flex items-center gap-2 font-bold text-amber-900">
                  <AlertTriangle className="h-4 w-4" aria-hidden="true" />
                  {String(content.alertTitle)}
                </p>
                <div className="mt-3 space-y-1 text-sm leading-6 text-farm-ink/75">
                  {(content.alertLines as string[]).map((line) => (
                    <p key={line}>{line}</p>
                  ))}
                </div>
                {"helper" in content ? (
                  <p className="mt-3 rounded-2xl bg-white/80 px-3 py-2 text-sm font-semibold text-farm-heritage">
                    {String(content.helper)}
                  </p>
                ) : null}
              </article>

              <div>
                <h3 className="text-sm font-bold text-farm-heritage">Prompt chips</h3>
                <div className="mt-3 flex snap-x gap-2 overflow-x-auto pb-2">
                  {(content.chips as string[]).map((chip) => (
                    <button
                      key={chip}
                      type="button"
                      onClick={() => setSelectedChip(chip)}
                      aria-pressed={selectedChip === chip}
                      className={`min-h-11 shrink-0 snap-start rounded-full px-4 text-sm font-bold ${
                        selectedChip === chip
                          ? "bg-farm-heritage text-white"
                          : "border border-farm-heritage/15 bg-white text-farm-heritage"
                      }`}
                    >
                      {chip}
                    </button>
                  ))}
                </div>
              </div>

              <article aria-live="polite" className="rounded-3xl border border-farm-heritage/10 bg-farm-meadow p-4">
                <h3 className="flex items-center gap-2 font-bold text-farm-heritage">
                  <FileText className="h-4 w-4 text-farm-gold" aria-hidden="true" />
                  Deterministic response
                </h3>
                <p className="mt-3 whitespace-pre-line text-sm leading-6 text-farm-ink/75">
                  {selectedChip === content.defaultChip
                    ? String(content.response)
                    : `${selectedChip}\n\nThis local demo recommendation summarizes the selected topic for admin review only. No record has been changed.`}
                </p>
              </article>

              {prepared ? (
                <article className="rounded-3xl border border-farm-heritage/10 bg-white p-4">
                  <h3 className="font-bold text-farm-heritage">{String(content.preparedTitle)}</h3>
                  <p className="mt-3 text-sm leading-6 text-farm-ink/75">{prepared}</p>
                </article>
              ) : null}

              {"secondaryLines" in content ? (
                <article className="rounded-3xl border border-farm-heritage/10 bg-white p-4">
                  <h3 className="font-bold text-farm-heritage">{String(content.secondaryTitle)}</h3>
                  <div className="mt-3 space-y-1 text-sm leading-6 text-farm-ink/70">
                    {(content.secondaryLines as string[]).map((line) => (
                      <p key={line}>{line}</p>
                    ))}
                  </div>
                </article>
              ) : null}
            </div>
          ) : (
            <AgentStatePanel state={viewState} onReady={() => setViewState("ready")} onClose={onClose} />
          )}
        </div>

        <footer className="sticky bottom-0 border-t border-farm-heritage/10 bg-white px-5 py-4 shadow-[0_-16px_36px_rgba(14,36,25,0.08)] sm:px-6">
          {viewState === "ready" ? (
            <div className="grid gap-2">
              {(content.actions as string[]).map((action) => (
                <button
                  key={action}
                  type="button"
                  onClick={() => handleAction(action)}
                  className={action.startsWith("Copy") ? "admin-erp-secondary" : "admin-erp-primary"}
                >
                  {action.startsWith("Copy") ? <Copy className="h-4 w-4" aria-hidden="true" /> : null}
                  {action === "Open WhatsApp Manually" ? <ExternalLink className="h-4 w-4" aria-hidden="true" /> : null}
                  {action}
                </button>
              ))}
              <p className="text-center text-xs font-semibold text-farm-ink/55">
                Agent recommends - admin reviews - workflow drawer opens - confirmation happens later.
              </p>
            </div>
          ) : null}
        </footer>
      </section>
    </div>
  );
}

function AgentStatePanel({
  state,
  onReady,
  onClose
}: {
  state: Exclude<AdminAgentState, "ready">;
  onReady: () => void;
  onClose: () => void;
}) {
  const copy = stateCopy[state];
  return (
    <div
      className="rounded-3xl border border-farm-heritage/10 bg-farm-meadow p-5"
      aria-busy={state === "loading" ? "true" : undefined}
    >
      {state === "loading" ? (
        <div className="space-y-3">
          <div className="admin-agent-skeleton h-5 w-2/3 rounded-full" />
          <div className="admin-agent-skeleton h-24 rounded-3xl" />
          <div className="admin-agent-skeleton h-12 rounded-2xl" />
        </div>
      ) : null}
      <h3 className="font-display text-2xl font-bold text-farm-heritage">{copy.title}</h3>
      <p className="mt-3 text-sm leading-6 text-farm-ink/65">{copy.body}</p>
      <div className="mt-5 grid gap-2">
        {state === "empty" ? (
          <button type="button" onClick={onReady} className="admin-erp-primary">
            Show Today&apos;s Summary
          </button>
        ) : null}
        {state === "error" ? (
          <button type="button" onClick={onReady} className="admin-erp-primary">
            Retry
          </button>
        ) : null}
        {state === "unavailable" ? (
          <button type="button" onClick={onClose} className="admin-erp-primary">
            Choose Another Agent
          </button>
        ) : null}
        <button type="button" onClick={onClose} className="admin-erp-secondary">
          Close Assistant
        </button>
      </div>
    </div>
  );
}
