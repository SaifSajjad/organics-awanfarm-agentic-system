"use client";

import { X } from "lucide-react";
import { useState } from "react";
import { missedReasonOptions } from "./rider-demo-data";
import { useRiderDialogFocus } from "./rider-stop-detail-sheet";
import type { MissedReason } from "./rider-types";

type RiderMissedDeliverySheetProps = {
  onCancel: () => void;
  onSubmit: (reason: MissedReason, note: string, triedCall: boolean) => void;
};

export function RiderMissedDeliverySheet({ onCancel, onSubmit }: RiderMissedDeliverySheetProps) {
  const dialogRef = useRiderDialogFocus(onCancel);
  const [selectedReason, setSelectedReason] = useState<MissedReason | "">("");
  const [note, setNote] = useState("");
  const [triedCall, setTriedCall] = useState(false);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 px-0 sm:items-center sm:px-6 sm:py-8">
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="rider-missed-title"
        className="max-h-[92vh] w-full max-w-[42rem] overflow-y-auto rounded-t-[2rem] bg-[#fbf9f4] shadow-[0_-18px_70px_rgba(14,36,25,0.22)] outline-none sm:max-h-[86vh] sm:rounded-2xl"
        tabIndex={-1}
      >
        <div className="sticky top-0 z-10 bg-[#fbf9f4] px-4 pb-4 pt-3 sm:px-6">
          <div className="mx-auto h-1.5 w-16 rounded-full bg-[#c1c8c2]" aria-hidden="true" />
          <div className="mt-4 flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-black tracking-[0.16em] text-[#924c00]">Active Stop</p>
              <h2 id="rider-missed-title" className="mt-1 font-display text-3xl font-black text-[#012d1d]">
                Missed Delivery
              </h2>
              <p className="mt-2 text-lg leading-7 text-[#414844] sm:text-xl sm:leading-8">
                Report the attempted delivery for Fatima B.
              </p>
            </div>
            <button
              type="button"
              onClick={onCancel}
              aria-label="Close missed delivery"
              className="inline-flex min-h-12 min-w-12 items-center justify-center rounded-xl text-[#414844]"
            >
              <X className="h-7 w-7" aria-hidden="true" />
            </button>
          </div>
        </div>

        <div className="space-y-5 px-4 pb-5 pt-2 sm:px-6">
          <fieldset>
            <legend className="text-[1.35rem] font-black text-[#012d1d] sm:text-2xl">Reason</legend>
            <p className="mt-1 text-base font-black text-[#414844]">Select one reason</p>
            <div className="mt-3 grid gap-2.5">
              {missedReasonOptions.map((reason) => (
                <label
                  key={reason}
                  className="flex min-h-14 items-center gap-3 rounded-2xl border border-[#c1c8c2] bg-white px-4 text-base font-semibold text-[#1b1c19] sm:min-h-16 sm:gap-4 sm:text-lg"
                >
                  <input
                    type="radio"
                    name="missed-reason"
                    value={reason}
                    checked={selectedReason === reason}
                    onChange={() => setSelectedReason(reason)}
                    className="h-6 w-6 accent-[#012d1d]"
                  />
                  <span>{reason}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <label className="block">
            <span className="text-[1.35rem] font-black text-[#012d1d] sm:text-2xl">Optional Note</span>
            <span className="mt-1 block text-base leading-6 text-[#414844]">Add a short note for admin review only.</span>
            <textarea
              value={note}
              onChange={(event) => setNote(event.target.value)}
              placeholder="Type a short note…"
              className="mt-3 min-h-24 w-full rounded-2xl border border-[#c1c8c2] bg-white px-4 py-3 text-base text-[#1b1c19] outline-none ring-[#012d1d] focus:ring-2 sm:min-h-28"
            />
          </label>

          <label className="flex min-h-14 items-center gap-3 rounded-2xl border border-[#c1c8c2] bg-white px-4 text-base font-semibold text-[#1b1c19]">
            <input
              type="checkbox"
              checked={triedCall}
              onChange={(event) => setTriedCall(event.target.checked)}
              className="h-5 w-5 rounded accent-[#012d1d]"
            />
            <span>I tried to call the customer.</span>
          </label>

          <div className="rounded-2xl border border-[#c1c8c2] bg-[#f0eee9] p-4">
            <p className="text-sm font-black tracking-[0.12em] text-[#414844]">Customer-facing status</p>
            <p className="mt-2 text-lg font-black text-[#012d1d]">Missed Delivery — our team will follow up.</p>
          </div>
        </div>

        <div className="sticky bottom-0 z-10 grid gap-3 border-t border-[#c1c8c2] bg-[#fbf9f4] px-4 py-4 sm:px-6">
          <button
            type="button"
            disabled={!selectedReason}
            onClick={() => {
              if (selectedReason) onSubmit(selectedReason, note, triedCall);
            }}
            className="inline-flex min-h-14 items-center justify-center rounded-xl bg-[#1b4332] px-4 text-lg font-black text-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            Submit Missed Attempt
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex min-h-14 items-center justify-center rounded-xl border border-[#717973] bg-[#fbf9f4] px-4 text-lg font-black text-[#012d1d]"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
