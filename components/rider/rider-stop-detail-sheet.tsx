"use client";

import { CheckCircle2, Headphones, Info, MapPin, MapPinned, Phone, X } from "lucide-react";
import { useEffect, useMemo, useRef } from "react";
import { RIDER_ROUTE_META } from "./rider-demo-data";
import type { RiderCue, RiderStopDetail } from "./rider-types";

type RiderStopDetailSheetProps = {
  stop: RiderStopDetail;
  onClose: () => void;
  onMarkDelivered: () => void;
  onMissedDelivery: () => void;
};

const focusableSelector =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function useRiderDialogFocus(onClose: () => void) {
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;

    function getFocusableElements() {
      return Array.from(dialog?.querySelectorAll<HTMLElement>(focusableSelector) ?? []).filter(
        (element) => !element.hasAttribute("disabled")
      );
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== "Tab") return;

      const focusableElements = getFocusableElements();
      if (focusableElements.length === 0) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    }

    getFocusableElements()[0]?.focus();
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      if (previousFocus && document.contains(previousFocus)) {
        previousFocus.focus();
      }
    };
  }, [onClose]);

  return dialogRef;
}

function cueClass(cue: RiderCue) {
  if (cue === "Cash Required") return "border-[#ffb781] bg-[#ffdcc4] text-[#3a2000]";
  if (cue === "Bottle Return") return "border-[#a5d0b9] bg-[#c1ecd4] text-[#002114]";
  return "border-[#c1c8c2] bg-[#f0eee9] text-[#1b1c19]";
}

export function RiderStopDetailSheet({
  stop,
  onClose,
  onMarkDelivered,
  onMissedDelivery
}: RiderStopDetailSheetProps) {
  const dialogRef = useRiderDialogFocus(onClose);
  const mapsUrl = useMemo(
    () => `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(stop.address)}`,
    [stop.address]
  );
  const orderCues = stop.cues.filter((cue) => cue === "Extra Milk");
  const operationalCues = stop.cues.filter((cue) => cue !== "Extra Milk");

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 px-0 sm:items-center sm:px-6 sm:py-8">
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="rider-stop-detail-title"
        className="max-h-[92vh] w-full max-w-[42rem] overflow-y-auto rounded-t-[2rem] bg-[#fbf9f4] shadow-[0_-18px_70px_rgba(14,36,25,0.22)] outline-none sm:max-h-[86vh] sm:rounded-2xl"
        tabIndex={-1}
      >
        <div className="sticky top-0 z-10 border-b border-[#c1c8c2] bg-[#fbf9f4] px-4 pb-4 pt-3 sm:px-6">
          <div className="mx-auto h-1.5 w-16 rounded-full bg-[#c1c8c2]" aria-hidden="true" />
          <div className="mt-4 flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-black tracking-[0.16em] text-[#924c00]">Active Stop</p>
              <h2 id="rider-stop-detail-title" className="mt-1 font-display text-3xl font-black text-[#012d1d]">
                Stop Details
              </h2>
              <p className="mt-0.5 text-lg text-[#414844]">Stop {stop.sequence} of 12</p>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close stop details"
              className="inline-flex min-h-12 min-w-12 items-center justify-center rounded-xl text-[#414844]"
            >
              <X className="h-7 w-7" aria-hidden="true" />
            </button>
          </div>
        </div>

        <div className="space-y-4 px-4 py-5 sm:px-6">
          <section className="rounded-2xl border border-[#c1c8c2] bg-white p-4 sm:p-5">
            <p className="text-sm font-black tracking-[0.12em] text-[#717973]">Customer</p>
            <div className="mt-3">
              <h3 className="text-2xl font-black leading-tight text-[#1b1c19] sm:text-3xl">{stop.customerName}</h3>
              <p className="mt-1 text-lg text-[#414844] sm:text-xl">{stop.area}</p>
            </div>

            <div className="mt-5 grid gap-2">
              <p className="flex items-center gap-2 text-sm font-black tracking-[0.12em] text-[#924c00]">
                <MapPin className="h-5 w-5 text-[#012d1d]" aria-hidden="true" />
                Delivery Address
              </p>
              <p className="rounded-lg border border-[#c1c8c2] bg-[#f0eee9] px-3 py-1 text-sm font-bold text-[#414844]">
                Demo address
              </p>
              <p className="text-lg leading-7 text-[#1b1c19] sm:text-xl">{stop.address}</p>
            </div>

            <div className="mt-4 rounded-2xl border-l-4 border-[#012d1d] bg-[#f0eee9] p-4">
              <p className="flex items-center gap-2 text-sm font-black tracking-[0.12em] text-[#012d1d]">
                <Info className="h-5 w-5" aria-hidden="true" />
                Access Note
              </p>
              <p className="mt-2 text-base italic leading-7 text-[#1b1c19] sm:text-lg">{stop.accessNote}</p>
            </div>
          </section>

          <section className="rounded-2xl border border-[#c1c8c2] bg-white p-4 sm:p-5">
            <h3 className="text-sm font-black tracking-[0.12em] text-[#414844]">Today’s Order</h3>
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <p className="text-xl font-black text-[#012d1d] sm:text-2xl">{stop.order}</p>
              <div className="flex flex-wrap gap-2">
                {orderCues.map((cue) => (
                  <span key={cue} className={`rounded-xl border px-3 py-2 text-sm font-black ${cueClass(cue)}`}>
                    {cue}
                  </span>
                ))}
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-[#c1c8c2] bg-white p-4 sm:p-5">
            <h3 className="text-sm font-black tracking-[0.12em] text-[#414844]">Operational Cues</h3>
            <div className="mt-4 flex flex-wrap gap-2">
              {operationalCues.map((cue) => (
                <span key={cue} className={`rounded-xl border px-3 py-2 text-sm font-black ${cueClass(cue)}`}>
                  {cue}
                </span>
              ))}
            </div>
          </section>

          <section className="grid gap-3">
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-14 items-center justify-center gap-2 rounded-xl border border-[#012d1d] bg-white px-4 text-base font-black text-[#012d1d]"
            >
              <MapPinned className="h-5 w-5" aria-hidden="true" />
              Open in Google Maps
            </a>
            <a
              href={RIDER_ROUTE_META.customerCallHref}
              className="inline-flex min-h-14 items-center justify-center gap-2 rounded-xl border border-[#012d1d] bg-white px-4 text-base font-black text-[#012d1d]"
            >
              <Phone className="h-5 w-5" aria-hidden="true" />
              Call Customer
            </a>
            <a
              href={RIDER_ROUTE_META.adminSupportHref}
              className="inline-flex min-h-14 items-center justify-center gap-2 rounded-xl border border-[#012d1d] bg-white px-4 text-base font-black text-[#012d1d]"
            >
              <Headphones className="h-5 w-5" aria-hidden="true" />
              Contact Admin Support
            </a>
          </section>
        </div>

        <div className="sticky bottom-0 z-10 grid gap-3 border-t border-[#c1c8c2] bg-[#fbf9f4] px-4 py-4 sm:px-6">
          <button
            type="button"
            onClick={onMarkDelivered}
            className="inline-flex min-h-14 items-center justify-center gap-2 rounded-xl bg-[#1b4332] px-4 text-lg font-black text-white"
          >
            <CheckCircle2 className="h-5 w-5" aria-hidden="true" />
            Mark Delivered
          </button>
          <button
            type="button"
            onClick={onMissedDelivery}
            className="inline-flex min-h-14 items-center justify-center rounded-xl border border-[#717973] bg-[#fbf9f4] px-4 text-lg font-black text-[#717973]"
          >
            Missed Delivery
          </button>
        </div>
      </div>
    </div>
  );
}
