import Link from "next/link";
import { BadgeCheck, LayoutDashboard, MessageCircle, Milk, ShieldCheck } from "lucide-react";
import type { TrackingState } from "@/components/tracking/tracking-types";
import { canShowRiderCard, trackingDemoData } from "@/components/tracking/tracking-types";

export function TrackingSidePanels({ state }: { state: TrackingState }) {
  return (
    <aside className="space-y-4 lg:sticky lg:top-24">
      <DeliverySummary />
      {canShowRiderCard(state) ? <RiderCard /> : null}
      <TrackingSupportActions state={state} />
    </aside>
  );
}

export function DeliverySummary() {
  return (
    <section aria-labelledby="tracking-delivery-summary" className="tracking-card tracking-reveal bg-white p-5 sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-label text-xs font-bold uppercase tracking-[0.18em] text-farm-ink/50">Today&apos;s Delivery</p>
          <h2 id="tracking-delivery-summary" className="mt-2 font-display text-3xl font-bold text-farm-heritage">
            Fresh Morning Milk
          </h2>
        </div>
        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-farm-sage/20 text-farm-heritage">
          <Milk className="h-6 w-6" aria-hidden="true" />
        </span>
      </div>

      <div className="mt-5 grid gap-3">
        <InfoRow label="Milk type" value={trackingDemoData.delivery.product} />
        <InfoRow label="Quantity" value={trackingDemoData.delivery.quantity} />
        <InfoRow label="Timing" value={trackingDemoData.delivery.timing} />
        <InfoRow label="Subscription" value={trackingDemoData.delivery.subscriptionStatus} />
      </div>
    </section>
  );
}

function RiderCard() {
  return (
    <section aria-labelledby="tracking-rider-card" className="tracking-card tracking-reveal bg-white p-5 sm:p-6">
      <p className="font-label text-xs font-bold uppercase tracking-[0.18em] text-farm-ink/50">Rider assigned</p>
      <div className="mt-4 flex items-center gap-4">
        <span
          aria-label={`Rider: ${trackingDemoData.rider.firstName}`}
          className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-farm-heritage font-display text-2xl font-bold text-white"
        >
          {trackingDemoData.rider.initials}
        </span>
        <div className="min-w-0">
          <h2 id="tracking-rider-card" className="text-xl font-bold text-farm-heritage">
            {trackingDemoData.rider.firstName}
          </h2>
          <p className="mt-1 text-sm leading-6 text-farm-ink/60">{trackingDemoData.rider.role}</p>
        </div>
      </div>
      <p className="mt-5 inline-flex min-h-9 items-center gap-2 rounded-full bg-farm-cream px-3 text-sm font-bold text-farm-heritage">
        <BadgeCheck className="h-4 w-4 text-farm-gold" aria-hidden="true" />
        {trackingDemoData.rider.label}
      </p>
    </section>
  );
}

export function TrackingSupportActions({ state }: { state: TrackingState }) {
  return (
    <section aria-label="Tracking support actions" className="tracking-card tracking-reveal bg-white p-5 sm:p-6">
      <div className="flex items-center gap-3">
        <span className="grid h-11 w-11 place-items-center rounded-2xl bg-farm-heritage text-white">
          <ShieldCheck className="h-5 w-5" aria-hidden="true" />
        </span>
        <div>
          <h2 className="font-display text-2xl font-bold text-farm-heritage">Need help?</h2>
          <p className="text-sm text-farm-ink/60">Our farm team can help with today&apos;s delivery.</p>
        </div>
      </div>

      <div className="mt-5 grid gap-3">
        <a
          href={trackingDemoData.whatsappUrl}
          aria-label="Contact support on WhatsApp about your delivery"
          className="tracking-whatsapp-button hidden min-h-12 items-center justify-center gap-2 rounded-2xl px-4 text-sm font-bold text-white lg:inline-flex"
          rel="noopener noreferrer"
          target="_blank"
        >
          <MessageCircle className="h-5 w-5" aria-hidden="true" />
          Contact Support on WhatsApp
        </a>
        <Link
          href={trackingDemoData.dashboardUrl}
          className="tracking-secondary-button inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl px-4 text-sm font-bold"
        >
          <LayoutDashboard className="h-5 w-5" aria-hidden="true" />
          View My Subscription
        </Link>
      </div>

      {state === "missed" ? (
        <p className="mt-4 text-center text-sm font-semibold italic text-farm-ink/60">
          Koi pareshani? Hum se WhatsApp par baat karein.
        </p>
      ) : null}
    </section>
  );
}

export function TrackingMobileSupportBar({ state }: { state: TrackingState }) {
  if (state === "loading") return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 bg-gradient-to-t from-farm-meadow via-farm-meadow/95 to-transparent px-4 pb-4 pt-8 lg:hidden">
      <a
        href={trackingDemoData.whatsappUrl}
        aria-label="Contact support on WhatsApp about your delivery"
        className="tracking-whatsapp-button mx-auto flex min-h-14 max-w-xl items-center justify-center gap-2 rounded-3xl px-5 text-base font-bold text-white shadow-premium"
        rel="noopener noreferrer"
        target="_blank"
      >
        <MessageCircle className="h-5 w-5" aria-hidden="true" />
        Contact Support on WhatsApp
      </a>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl bg-farm-cream px-4 py-3">
      <span className="text-sm font-semibold text-farm-ink/55">{label}</span>
      <span className="text-right text-sm font-bold text-farm-heritage">{value}</span>
    </div>
  );
}
