import Link from "next/link";
import { AlertTriangle, Clock3, Link2Off, MessageCircle, RefreshCcw, ShieldAlert } from "lucide-react";
import type { TrackingState } from "@/components/tracking/tracking-types";
import { trackingDemoData, trackingStatusCopy } from "@/components/tracking/tracking-types";

type TrackingFullStateScreenProps = {
  state: Extract<TrackingState, "loading" | "expired" | "invalid" | "error">;
  onRetry: () => void;
};

export function TrackingFullStateScreen({ state, onRetry }: TrackingFullStateScreenProps) {
  if (state === "loading") return <TrackingLoadingScreen />;

  const copy = trackingStatusCopy[state];
  const Icon = state === "expired" ? Link2Off : state === "invalid" ? ShieldAlert : AlertTriangle;
  const softAmber = state === "error";

  return (
    <section
      aria-labelledby="tracking-full-state-heading"
      className="tracking-card tracking-reveal mx-auto max-w-2xl bg-white p-6 text-center sm:p-10"
    >
      <span
        className={`mx-auto grid h-16 w-16 place-items-center rounded-3xl ${
          softAmber ? "bg-farm-gold/15 text-farm-heritage" : "bg-farm-cream text-farm-heritage"
        }`}
      >
        <Icon className="h-8 w-8" aria-hidden="true" />
      </span>
      <span className="mt-6 inline-flex rounded-full bg-farm-cream px-4 py-2 font-label text-xs font-bold uppercase tracking-[0.14em] text-farm-heritage">
        {copy.badge}
      </span>
      <h1 id="tracking-full-state-heading" className="mt-5 font-display text-4xl font-bold leading-tight text-farm-heritage sm:text-5xl">
        {copy.headline}
      </h1>
      <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-farm-ink/70">{copy.body}</p>

      <div className="mx-auto mt-7 grid max-w-sm gap-3">
        {state === "expired" ? (
          <>
            <Link href={trackingDemoData.dashboardUrl} className="tracking-primary-button inline-flex min-h-12 items-center justify-center rounded-2xl px-5 text-sm font-bold">
              Go to My Dashboard
            </Link>
            <a
              href={trackingDemoData.whatsappUrl}
              aria-label="Contact support on WhatsApp about your delivery"
              className="tracking-secondary-button inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl px-5 text-sm font-bold"
              rel="noopener noreferrer"
              target="_blank"
            >
              <MessageCircle className="h-4 w-4" aria-hidden="true" />
              Questions? Contact Us
            </a>
          </>
        ) : null}

        {state === "invalid" ? (
          <>
            <a
              href={trackingDemoData.whatsappUrl}
              aria-label="Contact support on WhatsApp about your delivery"
              className="tracking-whatsapp-button inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl px-5 text-sm font-bold text-white"
              rel="noopener noreferrer"
              target="_blank"
            >
              <MessageCircle className="h-4 w-4" aria-hidden="true" />
              Contact Support on WhatsApp
            </a>
            <Link href={trackingDemoData.dashboardUrl} className="tracking-secondary-button inline-flex min-h-12 items-center justify-center rounded-2xl px-5 text-sm font-bold">
              Go to My Dashboard
            </Link>
          </>
        ) : null}

        {state === "error" ? (
          <>
            <button
              type="button"
              onClick={onRetry}
              className="tracking-primary-button inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl px-5 text-sm font-bold"
            >
              <RefreshCcw className="h-4 w-4" aria-hidden="true" />
              Try Again
            </button>
            <a
              href={trackingDemoData.whatsappUrl}
              aria-label="Contact support on WhatsApp about your delivery"
              className="tracking-secondary-button inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl px-5 text-sm font-bold"
              rel="noopener noreferrer"
              target="_blank"
            >
              <MessageCircle className="h-4 w-4" aria-hidden="true" />
              Contact Support on WhatsApp
            </a>
          </>
        ) : null}
      </div>
    </section>
  );
}

function TrackingLoadingScreen() {
  return (
    <section
      aria-busy="true"
      aria-label="Loading delivery status"
      className="mx-auto grid max-w-2xl gap-5"
      role="status"
    >
      <div className="tracking-card bg-white p-6">
        <div className="flex items-center gap-4">
          <div className="tracking-skeleton h-14 w-14 rounded-2xl" />
          <div className="min-w-0 flex-1 space-y-3">
            <div className="tracking-skeleton h-5 w-36 rounded-full" />
            <div className="tracking-skeleton h-8 w-3/4 rounded-xl" />
            <div className="tracking-skeleton h-4 w-full rounded-full" />
          </div>
        </div>
      </div>

      <div className="tracking-card bg-white p-6">
        <div className="tracking-skeleton h-4 w-40 rounded-full" />
        <div className="mt-5 grid gap-3">
          <div className="tracking-skeleton h-14 rounded-2xl" />
          <div className="tracking-skeleton h-14 rounded-2xl" />
          <div className="tracking-skeleton h-14 rounded-2xl" />
        </div>
      </div>

      <div className="tracking-card bg-white p-6">
        <div className="flex gap-4">
          <div className="flex flex-col items-center gap-4">
            {[1, 2, 3].map((item) => (
              <div key={item} className="tracking-skeleton h-8 w-8 rounded-full" />
            ))}
          </div>
          <div className="grid flex-1 gap-4">
            {[1, 2, 3].map((item) => (
              <div key={item} className="space-y-2">
                <div className="tracking-skeleton h-5 w-44 rounded-full" />
                <div className="tracking-skeleton h-4 w-2/3 rounded-full" />
              </div>
            ))}
          </div>
        </div>
      </div>

      <p className="inline-flex items-center justify-center gap-2 text-sm font-semibold text-farm-ink/60">
        <Clock3 className="h-4 w-4" aria-hidden="true" />
        Loading your delivery status...
      </p>
    </section>
  );
}
