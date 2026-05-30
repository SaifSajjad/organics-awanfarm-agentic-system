"use client";

import {
  AlertTriangle,
  CalendarCheck,
  CalendarClock,
  Check,
  ChevronLeft,
  Info,
  MessageCircle,
  PlayCircle,
  RotateCcw,
  X
} from "lucide-react";
import { useEffect, useState } from "react";

type VacationPreset = "1 Day" | "3 Days" | "7 Days" | "Custom Dates";
type VacationFlowState = "idle" | "success" | "active" | "resumeEarly" | "error";

type VacationModeDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
  onContactSupport: () => void;
  onVacationActivated: () => void;
  onVacationResumed: () => void;
};

const presets: VacationPreset[] = ["1 Day", "3 Days", "7 Days", "Custom Dates"];

const calendarDays = [
  "31",
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "11",
  "12",
  "13",
  "14",
  "15",
  "16",
  "17",
  "18",
  "19",
  "20",
  "21",
  "22",
  "23",
  "24",
  "25",
  "26",
  "27",
  "28",
  "29",
  "30"
];

export function VacationModeDrawer({
  isOpen,
  onClose,
  onContactSupport,
  onVacationActivated,
  onVacationResumed
}: VacationModeDrawerProps) {
  const [preset, setPreset] = useState<VacationPreset>("7 Days");
  const [reason, setReason] = useState("Traveling");
  const [note, setNote] = useState("");
  const [flowState, setFlowState] = useState<VacationFlowState>("idle");

  useEffect(() => {
    if (!isOpen) return;

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) {
      setFlowState("idle");
      setNote("");
      setReason("Traveling");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  function confirmVacation() {
    if (preset === "1 Day") {
      setFlowState("error");
      return;
    }
    setFlowState("success");
  }

  function activateVacation() {
    onVacationActivated();
    setFlowState("active");
  }

  function resumeTomorrow() {
    onVacationResumed();
    setFlowState("idle");
    onClose();
  }

  return (
    <div className="fixed inset-0 z-[80]" role="presentation">
      <button
        type="button"
        aria-label="Close Vacation Mode"
        className="absolute inset-0 bg-farm-heritage/35 backdrop-blur-[3px]"
        onClick={onClose}
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="vacation-mode-title"
        className="customer-sheet customer-drawer-panel"
      >
        {flowState === "success" ? (
          <VacationSuccess onDone={activateVacation} onResumeEarly={() => setFlowState("resumeEarly")} />
        ) : flowState === "active" ? (
          <VacationActive onResumeEarly={() => setFlowState("resumeEarly")} onEditDates={() => setFlowState("idle")} />
        ) : flowState === "resumeEarly" ? (
          <ResumeEarly onResumeTomorrow={resumeTomorrow} onKeepVacation={() => setFlowState("active")} />
        ) : flowState === "error" ? (
          <VacationError onTryAgain={() => setFlowState("idle")} onSupport={onContactSupport} onGoBack={() => setFlowState("idle")} />
        ) : (
          <div className="flex h-full flex-col">
            <div className="flex items-start justify-between gap-4 border-b border-farm-heritage/10 p-6 sm:p-8">
              <div>
                <h2 id="vacation-mode-title" className="font-display text-4xl font-bold text-farm-heritage">
                  Vacation Mode
                </h2>
                <p className="mt-3 max-w-xl text-sm leading-6 text-farm-ink/70">
                  Pause your milk deliveries while you are away. Your regular subscription will resume automatically.
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close Vacation Mode"
                className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-farm-cream text-farm-heritage transition-colors hover:bg-farm-heritage hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 pb-32 sm:p-8">
              <section aria-labelledby="quick-pause-title">
                <h3 id="quick-pause-title" className="customer-step-label">
                  Quick Pause
                </h3>
                <div className="mt-4 flex flex-wrap gap-3">
                  {presets.map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setPreset(item)}
                      aria-pressed={preset === item}
                      className={`min-h-12 rounded-full border px-5 font-bold transition-all ${
                        preset === item
                          ? "border-farm-heritage bg-farm-heritage text-white shadow-soft-card"
                          : "border-farm-heritage/20 bg-white text-farm-heritage"
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
                <p className="mt-3 text-xs text-farm-ink/50">
                  Demo note: selecting 1 Day previews the route-finalized scheduling conflict.
                </p>
              </section>

              <section className="mt-8" aria-labelledby="select-dates-title">
                <div className="flex items-center justify-between gap-4">
                  <h3 id="select-dates-title" className="customer-step-label">
                    Select Dates
                  </h3>
                  <p className="font-bold text-farm-heritage">June 2026</p>
                </div>
                <div className="mt-4 rounded-3xl border border-farm-heritage/10 bg-white p-4 shadow-soft-card">
                  <div className="grid grid-cols-7 text-center text-xs font-bold uppercase tracking-[0.12em] text-farm-ink/45">
                    {["S", "M", "T", "W", "T", "F", "S"].map((day) => (
                      <span key={day} className="py-3">
                        {day}
                      </span>
                    ))}
                  </div>
                  <div className="grid grid-cols-7 text-center text-sm text-farm-ink">
                    {calendarDays.map((day, index) => {
                      const selected = ["12", "13", "14", "15"].includes(day);
                      const edge = day === "12" || day === "15";
                      return (
                        <button
                          key={`${day}-${index}`}
                          type="button"
                          className={`min-h-12 rounded-xl font-semibold ${
                            selected
                              ? edge
                                ? "bg-farm-heritage text-white"
                                : "bg-farm-heritage/10 text-farm-heritage"
                              : index === 0
                                ? "text-farm-ink/25"
                                : "text-farm-ink"
                          }`}
                          aria-label={`${day} June 2026${selected ? ", selected pause range" : ""}`}
                        >
                          {day}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </section>

              <section className="mt-8 rounded-3xl border border-farm-gold/30 bg-farm-gold/10 p-5">
                <p className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.14em] text-farm-heritage">
                  <CalendarClock className="h-5 w-5 text-farm-gold" />
                  Pause Summary
                </p>
                <p className="mt-4 font-display text-2xl font-bold text-farm-heritage">
                  12 June 2026 - 15 June 2026
                </p>
                <p className="mt-2 text-sm text-farm-ink/70">Deliveries resume on 16 June 2026.</p>
              </section>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <label className="grid gap-2 text-sm font-bold text-farm-heritage">
                  Reason
                  <select
                    value={reason}
                    onChange={(event) => setReason(event.target.value)}
                    className="rounded-2xl border border-farm-heritage/10 bg-white px-4 py-3 text-sm text-farm-ink outline-none ring-farm-gold/40 focus:ring-2"
                  >
                    <option>Traveling</option>
                    <option>Family visit</option>
                    <option>Temporary pause</option>
                  </select>
                </label>
                <div className="rounded-2xl border border-farm-heritage/10 bg-white p-4">
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-farm-ink/50">Subscription affected</p>
                  <p className="mt-2 font-bold text-farm-heritage">Daily Premium Mix</p>
                  <p className="mt-1 text-sm text-farm-ink/60">House 69-E, Model Town, Lahore</p>
                </div>
              </div>

              <label className="mt-6 grid gap-2 text-sm font-bold text-farm-heritage">
                Optional note
                <textarea
                  value={note}
                  onChange={(event) => setNote(event.target.value)}
                  placeholder="Example: Resume all active deliveries automatically."
                  className="min-h-24 rounded-3xl border border-farm-heritage/10 bg-white px-4 py-3 text-sm text-farm-ink outline-none ring-farm-gold/40 focus:ring-2"
                />
              </label>

              <div className="mt-6 rounded-2xl border border-farm-heritage/10 bg-farm-cream p-4 text-sm leading-6 text-farm-ink/70">
                <strong className="text-farm-heritage">Billing note:</strong> Paused delivery days will not be charged.
              </div>
            </div>

            <div className="border-t border-farm-heritage/10 bg-white/95 p-4 backdrop-blur-xl sm:p-6">
              <button type="button" onClick={confirmVacation} className="customer-primary-cta">
                <CalendarCheck className="h-5 w-5" />
                Confirm Vacation Mode
              </button>
              <button
                type="button"
                onClick={onClose}
                className="mt-3 min-h-12 w-full rounded-2xl bg-farm-cream px-5 font-bold text-farm-heritage"
              >
                Cancel and Go Back
              </button>
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}

function VacationSuccess({ onDone, onResumeEarly }: { onDone: () => void; onResumeEarly: () => void }) {
  return (
    <div className="flex h-full flex-col overflow-y-auto p-6 text-center sm:p-8" aria-live="polite">
      <div className="mx-auto mt-8 grid h-24 w-24 place-items-center rounded-full bg-farm-success/20">
        <div className="customer-success-check grid h-16 w-16 place-items-center rounded-full bg-farm-success text-white">
          <Check className="h-8 w-8" />
        </div>
      </div>
      <h2 className="mt-8 font-display text-5xl font-bold text-farm-heritage">Vacation Mode Activated</h2>
      <p className="mx-auto mt-5 max-w-lg text-lg leading-8 text-farm-ink/70">
        Your deliveries are paused from 12 June to 15 June. Regular delivery resumes on 16 June.
      </p>
      <div className="mt-8 rounded-3xl border border-farm-heritage/10 bg-white p-5 text-left shadow-soft-card">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-farm-ink/50">Status</p>
            <p className="mt-2 inline-flex rounded-full bg-farm-gold/30 px-3 py-1 text-sm font-bold text-farm-heritage">
              Paused
            </p>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-farm-ink/50">Resume date</p>
            <p className="mt-2 text-lg font-black text-farm-heritage">16 June 2026</p>
          </div>
        </div>
        <div className="mt-5 rounded-2xl bg-farm-cream p-4 text-sm leading-6 text-farm-ink/70">
          Your subscription credits will be extended automatically. No charges will occur for the paused period.
        </div>
      </div>
      <div className="mt-auto grid gap-3 pt-8">
        <button type="button" onClick={onDone} className="customer-primary-cta justify-center">
          Done
        </button>
        <button
          type="button"
          onClick={onResumeEarly}
          className="min-h-14 rounded-2xl border border-farm-heritage/20 bg-white px-5 font-bold text-farm-heritage"
        >
          Resume Deliveries Early
        </button>
      </div>
    </div>
  );
}

function VacationActive({ onResumeEarly, onEditDates }: { onResumeEarly: () => void; onEditDates: () => void }) {
  return (
    <div className="flex h-full flex-col overflow-y-auto p-6 sm:p-8" aria-live="polite">
      <span className="inline-flex w-fit items-center gap-2 rounded-full bg-farm-gold/20 px-4 py-2 text-sm font-bold text-farm-heritage">
        <CalendarCheck className="h-4 w-4" />
        Vacation Mode Active
      </span>
      <h2 className="mt-8 font-display text-4xl font-bold text-farm-heritage">Deliveries are paused</h2>
      <p className="mt-4 text-lg leading-8 text-farm-ink/70">
        Your regular delivery resumes automatically on 16 June.
      </p>
      <div className="mt-8 rounded-3xl border border-farm-heritage/10 bg-farm-cream p-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-farm-ink/50">Next delivery</p>
            <p className="mt-2 font-display text-2xl font-bold text-farm-heritage">16 Jun</p>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-farm-ink/50">Estimated arrival</p>
            <p className="mt-2 font-display text-2xl font-bold text-farm-heritage">7:00 AM</p>
          </div>
        </div>
      </div>
      <div className="mt-auto grid gap-3 pt-8">
        <button type="button" onClick={onResumeEarly} className="customer-primary-cta justify-center">
          <PlayCircle className="h-5 w-5" />
          Resume Early
        </button>
        <button
          type="button"
          onClick={onEditDates}
          className="min-h-14 rounded-2xl border border-farm-heritage/20 bg-white px-5 font-bold text-farm-heritage"
        >
          Edit Pause Dates
        </button>
      </div>
    </div>
  );
}

function ResumeEarly({ onResumeTomorrow, onKeepVacation }: { onResumeTomorrow: () => void; onKeepVacation: () => void }) {
  return (
    <div className="flex h-full flex-col overflow-y-auto p-6 sm:p-8">
      <button
        type="button"
        onClick={onKeepVacation}
        aria-label="Go back to active Vacation Mode"
        className="grid h-12 w-12 place-items-center rounded-full bg-farm-cream text-farm-heritage"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <div className="mt-8 grid h-24 w-24 place-items-center rounded-3xl bg-farm-success/20 text-farm-heritage">
        <PlayCircle className="h-10 w-10" />
      </div>
      <h2 className="mt-8 font-display text-4xl font-bold text-farm-heritage">Resume Deliveries Early?</h2>
      <p className="mt-4 text-lg leading-8 text-farm-ink/70">
        Your regular morning delivery can resume from the next available route.
      </p>
      <div className="mt-8 rounded-3xl border border-farm-heritage/10 bg-farm-cream p-5">
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-farm-ink/50">Earliest route</p>
        <p className="mt-2 font-display text-3xl font-bold text-farm-heritage">Tomorrow, 7:00 AM</p>
        <p className="mt-5 border-t border-farm-heritage/10 pt-5 text-sm font-bold text-farm-heritage">
          House 69-E, Model Town, Lahore
        </p>
      </div>
      <div className="mt-auto grid gap-3 pt-8">
        <button type="button" onClick={onResumeTomorrow} className="customer-primary-cta justify-center">
          Resume Tomorrow
        </button>
        <button
          type="button"
          onClick={onKeepVacation}
          className="min-h-14 rounded-2xl border border-farm-heritage/20 bg-white px-5 font-bold text-farm-heritage"
        >
          Keep Vacation Mode
        </button>
      </div>
    </div>
  );
}

function VacationError({
  onTryAgain,
  onSupport,
  onGoBack
}: {
  onTryAgain: () => void;
  onSupport: () => void;
  onGoBack: () => void;
}) {
  return (
    <div className="flex h-full flex-col items-center justify-center overflow-y-auto p-6 text-center sm:p-8" aria-live="assertive">
      <div className="grid h-20 w-20 place-items-center rounded-full bg-farm-warning/15 text-amber-700">
        <AlertTriangle className="h-9 w-9" />
      </div>
      <h2 className="mt-8 font-display text-4xl font-bold text-farm-heritage">Scheduling Conflict</h2>
      <p className="mt-5 max-w-md text-lg leading-8 text-farm-ink/70">
        Today&apos;s route is already finalized. Vacation Mode can begin tomorrow.
      </p>
      <div className="mt-8 rounded-2xl border border-farm-heritage/10 bg-farm-cream p-4 text-left text-sm leading-6 text-farm-ink/70">
        <Info className="mb-2 h-5 w-5 text-farm-gold" />
        Orders are finalized by 6:00 AM daily to ensure peak freshness for delivery.
      </div>
      <div className="mt-8 grid w-full max-w-md gap-3">
        <button type="button" onClick={onTryAgain} className="customer-primary-cta justify-center">
          <RotateCcw className="h-5 w-5" />
          Try Again
        </button>
        <button
          type="button"
          onClick={onSupport}
          className="flex min-h-14 items-center justify-center gap-2 rounded-2xl border border-farm-heritage/20 bg-white px-5 font-bold text-farm-heritage"
        >
          <MessageCircle className="h-5 w-5" />
          Chat with Support
        </button>
        <button
          type="button"
          onClick={onGoBack}
          className="min-h-14 rounded-2xl bg-farm-cream px-5 font-bold text-farm-heritage"
        >
          Go Back
        </button>
      </div>
    </div>
  );
}
