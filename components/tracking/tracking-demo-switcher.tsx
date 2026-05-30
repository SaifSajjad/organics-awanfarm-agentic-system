"use client";

import type { TrackingState } from "@/components/tracking/tracking-types";
import { TRACKING_STATES, trackingStatusCopy } from "@/components/tracking/tracking-types";

type TrackingDemoSwitcherProps = {
  controlsEnabled: boolean;
  state: TrackingState;
  onStateChange: (state: TrackingState) => void;
};

export function TrackingDemoSwitcher({ controlsEnabled, state, onStateChange }: TrackingDemoSwitcherProps) {
  if (!controlsEnabled) return null;

  return (
    <aside
      aria-label="Demo state controls"
      className="fixed right-3 top-24 z-50 w-[min(92vw,22rem)] rounded-3xl border border-farm-heritage/10 bg-white/95 p-3 shadow-premium backdrop-blur-xl"
    >
      <p className="rounded-2xl bg-farm-heritage px-3 py-2 font-label text-xs font-bold uppercase tracking-[0.16em] text-white">
        Demo State Controls
      </p>
      <div className="mt-3 grid max-h-[45vh] grid-cols-2 gap-2 overflow-auto">
        {TRACKING_STATES.map((item) => {
          const active = item === state;
          return (
            <button
              key={item}
              type="button"
              aria-pressed={active}
              onClick={() => onStateChange(item)}
              className={`min-h-11 rounded-2xl px-3 py-2 text-left text-xs font-bold transition active:scale-[0.98] ${
                active
                  ? "bg-farm-gold text-farm-heritage"
                  : "bg-farm-cream text-farm-ink/70 hover:bg-farm-sage/20"
              }`}
            >
              {trackingStatusCopy[item].badge}
            </button>
          );
        })}
      </div>
      <p className="mt-3 text-xs leading-5 text-farm-ink/55">
        Visible only with <span className="font-bold">controls=1</span>. Direct state query URLs still work without
        controls.
      </p>
    </aside>
  );
}
