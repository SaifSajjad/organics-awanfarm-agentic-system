import type { ComponentType } from "react";
import {
  AlertTriangle,
  BellRing,
  CalendarClock,
  CheckCircle2,
  Clock3,
  Truck,
  UserCheck
} from "lucide-react";
import type { TrackingState } from "@/components/tracking/tracking-types";
import { trackingDemoData, trackingStatusCopy } from "@/components/tracking/tracking-types";

const stateIcons: Record<TrackingState, ComponentType<{ className?: string }>> = {
  loading: Clock3,
  scheduled: CalendarClock,
  "rider-assigned": UserCheck,
  "on-route": Truck,
  "arriving-soon": BellRing,
  delivered: CheckCircle2,
  missed: AlertTriangle,
  expired: Clock3,
  invalid: AlertTriangle,
  error: AlertTriangle
};

const badgeClasses: Record<TrackingState, string> = {
  loading: "bg-farm-cream text-farm-ink",
  scheduled: "bg-farm-sage/25 text-farm-heritage",
  "rider-assigned": "bg-farm-gold/20 text-farm-heritage",
  "on-route": "bg-farm-sage text-farm-heritage",
  "arriving-soon": "bg-farm-warning/15 text-amber-800",
  delivered: "bg-green-100 text-green-800",
  missed: "bg-farm-gold/20 text-amber-900",
  expired: "bg-farm-cream text-farm-ink",
  invalid: "bg-farm-cream text-farm-ink",
  error: "bg-farm-gold/15 text-farm-heritage"
};

const iconShellClasses: Record<TrackingState, string> = {
  loading: "bg-farm-cream text-farm-ink",
  scheduled: "bg-farm-sage/25 text-farm-heritage",
  "rider-assigned": "bg-farm-gold/20 text-farm-heritage",
  "on-route": "bg-farm-sage text-farm-heritage tracking-on-route-pulse",
  "arriving-soon": "bg-farm-warning/15 text-amber-800 tracking-amber-pulse",
  delivered: "bg-green-100 text-green-800 tracking-check-reveal",
  missed: "bg-farm-gold/20 text-amber-900 tracking-missed-fade",
  expired: "bg-farm-cream text-farm-ink",
  invalid: "bg-farm-cream text-farm-ink",
  error: "bg-farm-gold/15 text-farm-heritage"
};

export function TrackingStatusCard({ state }: { state: TrackingState }) {
  const copy = trackingStatusCopy[state];
  const Icon = stateIcons[state];
  const dark = state === "on-route";
  const showLastUpdated = state === "on-route";

  return (
    <section
      aria-labelledby="tracking-status-heading"
      aria-live="polite"
      className={`tracking-card tracking-reveal relative overflow-hidden p-6 sm:p-8 ${
        dark ? "bg-farm-heritage text-white" : "bg-white text-farm-ink"
      }`}
      role="status"
    >
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
        <span
          className={`grid h-14 w-14 shrink-0 place-items-center rounded-2xl ${iconShellClasses[state]}`}
          aria-hidden="true"
        >
          <Icon className="h-7 w-7" />
        </span>

        <div className="min-w-0 flex-1">
          <span className={`inline-flex rounded-full px-3 py-1.5 font-label text-xs font-bold uppercase tracking-[0.14em] ${badgeClasses[state]}`}>
            {copy.badge}
          </span>
          <h1
            id="tracking-status-heading"
            className={`mt-5 font-display text-4xl font-bold leading-tight sm:text-5xl ${
              dark ? "text-white" : "text-farm-heritage"
            }`}
          >
            {copy.headline}
          </h1>
          <p className={`mt-4 max-w-xl text-base leading-7 ${dark ? "text-white/70" : "text-farm-ink/70"}`}>
            {copy.body}
          </p>

          {copy.secondary ? (
            <p className={`mt-3 text-base font-semibold ${dark ? "text-white/80" : "text-farm-ink/75"}`}>
              {copy.secondary}
            </p>
          ) : null}

          {copy.romanUrdu ? (
            <p className={`mt-4 text-base font-semibold italic ${dark ? "text-white/80" : "text-farm-ink/60"}`}>
              {copy.romanUrdu}
            </p>
          ) : null}
        </div>
      </div>

      {copy.eta || copy.statusLine || copy.zone || showLastUpdated || copy.reason ? (
        <div className={`mt-6 grid gap-3 border-t pt-5 ${dark ? "border-white/15" : "border-farm-heritage/10"}`}>
          {copy.eta ? (
            <span
              className={`inline-flex w-fit min-h-11 items-center gap-2 rounded-full px-4 text-sm font-bold ${
                dark ? "bg-white/10 text-white" : "bg-farm-sage/20 text-farm-heritage"
              }`}
            >
              <Clock3 className="h-4 w-4" aria-hidden="true" />
              {copy.eta}
            </span>
          ) : null}

          {copy.statusLine ? (
            <span className="inline-flex w-fit min-h-11 items-center gap-2 rounded-full bg-farm-warning/15 px-4 text-sm font-bold text-amber-900">
              <BellRing className="h-4 w-4" aria-hidden="true" />
              {copy.statusLine}
            </span>
          ) : null}

          {copy.zone ? (
            <p className="inline-flex items-center gap-2 text-sm font-bold text-farm-sage">
              <Truck className="h-4 w-4" aria-hidden="true" />
              {copy.zone}
            </p>
          ) : null}

          {showLastUpdated ? (
            <p className={dark ? "text-sm text-white/55" : "text-sm text-farm-ink/55"}>
              {trackingDemoData.lastUpdated}
            </p>
          ) : null}

          {copy.reason ? (
            <div className="rounded-2xl border border-farm-gold/30 bg-farm-gold/10 p-4">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-farm-ink/55">Reason</p>
              <p className="mt-1 text-base font-bold text-farm-heritage">{copy.reason}</p>
            </div>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}
