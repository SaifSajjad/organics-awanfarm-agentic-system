"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { CheckCircle2, MessageCircle, ShieldCheck, X } from "lucide-react";
import type { AdminWorkflowType } from "@/components/admin/admin-agent-types";

type AdminWorkflowDrawerProps = {
  workflow: AdminWorkflowType | null;
  onClose: () => void;
  onLocalActivity: (message: string) => void;
};

const workflowContent = {
  "new-subscription": {
    title: "Review New Subscription",
    badge: "Approval Required",
    sections: [
      ["Customer", ["Sara Ahmed", "Model Town", "03XX-XXX-4821", "WhatsApp"]],
      ["Subscription", ["2 L Fresh Cow Milk \u00b7 Daily", "Morning \u00b7 6:00 AM - 8:00 AM", "PKR 19,800 monthly"]],
      ["Route", ["Model Town Morning Route", "Capacity available"]],
      ["Inventory", ["64 L available", "60 L required after approval", "4 L buffer remaining", "Sufficient"]]
    ],
    recommendation: ["Demo Recommendation", "Approve request", "Route capacity is available and cow-milk inventory remains sufficient.", "Admin confirmation required."],
    actions: ["Approve Subscription", "Request Clarification", "Reject Request"]
  },
  "extra-milk": {
    title: "Review Extra Milk Request",
    reference: "#EXM-2042",
    badge: "Approval Required",
    sections: [
      ["Customer", ["Sara Ahmed", "Model Town", "03XX-XXX-4821", "WhatsApp"]],
      [
        "Request",
        [
          "Fresh Cow Milk",
          "Extra quantity: +1 L",
          "Regular volume: 2 L",
          "Updated total: 3 L",
          "Rate: PKR 330 / L",
          "Additional charge: PKR 330",
          "Delivery: Sunday, 1 June",
          "Submitted: Saturday, 31 May \u00b7 8:42 PM",
          "Within Cutoff"
        ]
      ],
      ["Route", ["Model Town Morning Route", "Rider: Ahmed", "After approval: 59 L", "Capacity Available"]],
      ["Inventory", ["64 L available", "59 L required after approval", "5 L buffer remaining", "Sufficient"]]
    ],
    recommendation: ["Demo Recommendation", "Approve request", "The request is within cutoff and inventory remains sufficient.", "Admin confirmation required."],
    actions: ["Approve Extra Milk", "Request Clarification", "Reject Request"]
  },
  "missed-delivery": {
    title: "Resolve Missed Delivery",
    reference: "Case #MIS-3017",
    badge: "Urgent Exception",
    sections: [
      [
        "Customer",
        ["Zainab Khan", "Model Town", "03XX-XXX-7614", "2 L Fresh Cow Milk \u00b7 Daily", "Morning \u00b7 6:00 AM - 8:00 AM"]
      ],
      [
        "Rider report",
        [
          "Reason: Customer unavailable",
          "Attempted: 7:12 AM",
          "Rider: Ahmed",
          "Note: Knocked twice and called once. No response received.",
          "Contact attempt: 1 call attempted"
        ]
      ]
    ],
    resolutionOptions: [
      "Attempt Same-Day Retry",
      "Move to Next Scheduled Delivery",
      "Contact Customer Before Decision"
    ],
    recommendation: [
      "Delivery Planning Agent",
      "Contact customer before retry",
      "Customer Support Agent",
      "Prepare WhatsApp follow-up"
    ],
    actions: ["Confirm Resolution", "Prepare WhatsApp Follow-up", "Keep Case Open"]
  }
} satisfies Record<AdminWorkflowType, Record<string, unknown>>;

export function AdminWorkflowDrawer({ workflow, onClose, onLocalActivity }: AdminWorkflowDrawerProps) {
  const panelRef = useRef<HTMLElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);
  const [selectedResolution, setSelectedResolution] = useState("Contact Customer Before Decision");
  const [localResult, setLocalResult] = useState<string | null>(null);

  const content = useMemo(() => (workflow ? workflowContent[workflow] : null), [workflow]);

  useEffect(() => {
    if (!workflow) return;
    setLocalResult(null);
    setSelectedResolution("Contact Customer Before Decision");
  }, [workflow]);

  useEffect(() => {
    if (!workflow) return;
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
  }, [workflow, onClose]);

  if (!workflow || !content) return null;

  function chooseAction(action: string) {
    const suffix =
      workflow === "missed-delivery"
        ? `${selectedResolution} selected for local demo review.`
        : `${action} selected for local demo review.`;
    setLocalResult(`${suffix} No production record has been changed.`);
    onLocalActivity(`${action} prepared for review`);
  }

  return (
    <div className="fixed inset-0 z-[120]">
      <div className="admin-erp-overlay-fade absolute inset-0 bg-farm-heritage/45" aria-hidden="true" />
      <section
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="admin-workflow-title"
        className="admin-erp-drawer fixed inset-x-0 bottom-0 z-[121] flex max-h-[92vh] flex-col overflow-hidden rounded-t-[2rem] bg-white shadow-premium-lg md:inset-y-0 md:left-auto md:right-0 md:max-h-none md:w-[500px] md:rounded-none"
      >
        <div className="mx-auto mt-3 h-1.5 w-16 rounded-full bg-farm-heritage/15 md:hidden" aria-hidden="true" />
        <header className="sticky top-0 z-10 border-b border-farm-heritage/10 bg-white px-5 py-4 sm:px-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="admin-erp-eyebrow">{String(content.badge)}</p>
              <h2 id="admin-workflow-title" className="mt-1 font-display text-3xl font-bold text-farm-heritage">
                {String(content.title)}
              </h2>
              {"reference" in content ? (
                <p className="mt-2 text-sm font-bold text-farm-ink/60">{String(content.reference)}</p>
              ) : null}
            </div>
            <button type="button" onClick={onClose} aria-label="Close workflow drawer" className="admin-erp-icon-button">
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto px-5 py-5 sm:px-6">
          <div className="space-y-4">
            {(content.sections as [string, string[]][]).map(([title, rows]) => (
              <article key={title} className="rounded-3xl border border-farm-heritage/10 bg-farm-meadow p-4">
                <h3 className="font-bold text-farm-heritage">{title}</h3>
                <div className="mt-3 space-y-1 text-sm leading-6 text-farm-ink/70">
                  {rows.map((row) => (
                    <p key={row}>{row}</p>
                  ))}
                </div>
              </article>
            ))}

            {"resolutionOptions" in content ? (
              <article className="rounded-3xl border border-farm-heritage/10 bg-white p-4">
                <h3 className="font-bold text-farm-heritage">Resolution options</h3>
                <div className="mt-3 grid gap-2">
                  {(content.resolutionOptions as string[]).map((option) => (
                    <button
                      key={option}
                      type="button"
                      aria-pressed={selectedResolution === option}
                      onClick={() => setSelectedResolution(option)}
                      className={`min-h-11 rounded-2xl border px-4 text-left text-sm font-bold ${
                        selectedResolution === option
                          ? "border-farm-heritage bg-farm-heritage text-white"
                          : "border-farm-heritage/15 bg-white text-farm-heritage"
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </article>
            ) : null}

            <article className="rounded-3xl border-l-4 border-farm-heritage bg-farm-sage/25 p-4">
              <h3 className="flex items-center gap-2 font-bold text-farm-heritage">
                <ShieldCheck className="h-4 w-4 text-farm-gold" aria-hidden="true" />
                Agent recommendation
              </h3>
              <div className="mt-3 space-y-1 text-sm leading-6 text-farm-ink/75">
                {(content.recommendation as string[]).map((row) => (
                  <p key={row}>{row}</p>
                ))}
              </div>
            </article>

            {localResult ? (
              <p
                role="status"
                aria-live="polite"
                className="admin-agent-copy-confirm rounded-2xl border border-farm-gold/30 bg-farm-gold/10 p-4 text-sm font-semibold leading-6 text-farm-heritage"
              >
                <CheckCircle2 className="mr-2 inline h-4 w-4" aria-hidden="true" />
                {localResult}
              </p>
            ) : null}
          </div>
        </div>

        <footer className="sticky bottom-0 border-t border-farm-heritage/10 bg-white px-5 py-4 shadow-[0_-16px_36px_rgba(14,36,25,0.08)] sm:px-6">
          <div className="grid gap-2">
            {(content.actions as string[]).map((action) => (
              <button
                key={action}
                type="button"
                onClick={() => chooseAction(action)}
                className={action.includes("Reject") || action.includes("Keep") ? "admin-erp-secondary" : "admin-erp-primary"}
              >
                {action.includes("WhatsApp") ? <MessageCircle className="h-4 w-4" aria-hidden="true" /> : null}
                {action}
              </button>
            ))}
            <p className="text-center text-xs font-semibold text-farm-ink/55">
              Local demo state only. Admin confirmation workflows will connect later.
            </p>
          </div>
        </footer>
      </section>
    </div>
  );
}
