import { AlertTriangle, Check, Circle } from "lucide-react";
import type { TrackingState } from "@/components/tracking/tracking-types";

type TimelineStep = {
  id: string;
  label: string;
  helper: string;
};

const defaultSteps: TimelineStep[] = [
  { id: "scheduled", label: "Scheduled", helper: "Morning delivery confirmed" },
  { id: "rider-assigned", label: "Rider Assigned", helper: "Ali is assigned for today" },
  { id: "on-route", label: "On Route", helper: "Ali is on the way" },
  { id: "arriving-soon", label: "Arriving Soon", helper: "Please be ready to receive" },
  { id: "delivered", label: "Delivered", helper: "Fresh milk delivered" }
];

const missedSteps: TimelineStep[] = [
  { id: "scheduled", label: "Scheduled", helper: "Morning delivery confirmed" },
  { id: "rider-assigned", label: "Rider Assigned", helper: "Ali was assigned for today" },
  { id: "on-route", label: "On Route", helper: "Delivery reached the active route stage" },
  { id: "missed", label: "Missed Delivery", helper: "Please contact support for the next step" },
  { id: "delivered", label: "Delivered", helper: "Not completed today" }
];

const stepOrder: Record<string, number> = {
  scheduled: 0,
  "rider-assigned": 1,
  "on-route": 2,
  "arriving-soon": 3,
  delivered: 4
};

function getStepState(stepId: string, state: TrackingState, index: number) {
  if (state === "missed") {
    if (stepId === "missed") return "current";
    if (index < 3) return "complete";
    return "future";
  }

  const activeIndex = stepOrder[state] ?? -1;
  if (state === "delivered") return "complete";
  if (index < activeIndex) return "complete";
  if (index === activeIndex) return "current";
  return "future";
}

export function TrackingTimeline({ state }: { state: TrackingState }) {
  const steps = state === "missed" ? missedSteps : defaultSteps;

  return (
    <section aria-labelledby="tracking-timeline-heading" className="tracking-card tracking-reveal bg-white p-5 sm:p-6">
      <div>
        <p className="font-label text-xs font-bold uppercase tracking-[0.18em] text-farm-ink/50">Delivery progress</p>
        <h2 id="tracking-timeline-heading" className="mt-2 font-display text-3xl font-bold text-farm-heritage">
          Today&apos;s Timeline
        </h2>
      </div>

      <ol aria-label="Delivery progress" className="mt-6 space-y-0">
        {steps.map((step, index) => {
          const status = getStepState(step.id, state, index);
          const isLast = index === steps.length - 1;
          const isCurrent = status === "current";
          const isMissedCurrent = state === "missed" && step.id === "missed";

          return (
            <li
              key={step.id}
              aria-current={isCurrent ? "step" : undefined}
              className="relative flex gap-4 pb-6 last:pb-0"
            >
              {!isLast ? (
                <span
                  aria-hidden="true"
                  className={`absolute left-[15px] top-9 h-[calc(100%-1.75rem)] w-px ${
                    status === "complete" ? "bg-farm-green/50" : "bg-farm-heritage/10"
                  }`}
                />
              ) : null}

              <span
                className={`relative z-10 mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full border text-xs font-bold ${
                  status === "complete"
                    ? "border-farm-green bg-farm-green text-white"
                    : isMissedCurrent
                      ? "border-farm-gold bg-farm-gold/25 text-amber-900"
                      : isCurrent
                        ? "border-farm-gold bg-farm-gold/20 text-farm-heritage ring-4 ring-farm-gold/20"
                        : "border-farm-heritage/15 bg-farm-cream text-farm-ink/40"
                }`}
              >
                {status === "complete" ? (
                  <Check className="h-4 w-4" aria-label="Completed step" />
                ) : isMissedCurrent ? (
                  <AlertTriangle className="h-4 w-4" aria-label="Current missed delivery step" />
                ) : (
                  <Circle className="h-3 w-3" aria-label={isCurrent ? "Current step" : "Upcoming step"} />
                )}
              </span>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p
                    className={`font-bold ${
                      status === "future"
                        ? "text-farm-ink/40"
                        : isMissedCurrent
                          ? "text-amber-900"
                          : "text-farm-heritage"
                    }`}
                  >
                    {step.label}
                  </p>
                  {isCurrent ? (
                    <span className="rounded-full bg-farm-gold/20 px-2 py-0.5 text-[11px] font-bold uppercase tracking-[0.12em] text-farm-heritage">
                      Current
                    </span>
                  ) : null}
                </div>
                <p className={`mt-1 text-sm leading-6 ${status === "future" ? "text-farm-ink/40" : "text-farm-ink/60"}`}>
                  {step.helper}
                </p>
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
