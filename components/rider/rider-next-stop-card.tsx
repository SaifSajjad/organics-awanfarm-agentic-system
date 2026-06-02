import { ClipboardCheck, Info, Play, Route } from "lucide-react";
import type { RiderCue, RiderStopDetail } from "./rider-types";
import { RIDER_ROUTE_META } from "./rider-demo-data";

type RiderNextStopCardProps = {
  stop: RiderStopDetail;
  onViewDetails: () => void;
  onContinueRoute: () => void;
};

function cueClass(cue: RiderCue) {
  if (cue === "Cash Required") return "bg-[#ffdcc4] text-[#3a2000]";
  if (cue === "Bottle Return") return "bg-[#c1ecd4] text-[#002114]";
  return "bg-[#f0eee9] text-[#1b1c19]";
}

export function RiderNextStopCard({ stop, onViewDetails, onContinueRoute }: RiderNextStopCardProps) {
  return (
    <section className="rounded-2xl bg-[#1b4332] p-5 text-white shadow-[0_14px_34px_rgba(27,67,50,0.18)] sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-black tracking-[0.12em] text-[#a5d0b9]">Next Stop</p>
          <h2 className="mt-1 font-display text-3xl font-black leading-tight">
            Stop {stop.sequence} of {RIDER_ROUTE_META.totalStops}
          </h2>
        </div>
        <span className="inline-flex min-h-9 items-center rounded-xl border border-white/20 px-3 text-xs font-black">
          {stop.status}
        </span>
      </div>

      <div className="mt-6 border-t border-white/20 pt-5">
        <h3 className="text-2xl font-black leading-tight">{stop.customerName}</h3>
        <p className="mt-1 text-base text-white/86">{stop.area}</p>
        <p className="mt-5 flex items-center gap-2 text-base font-semibold">
          <Route className="h-5 w-5" aria-hidden="true" />
          {stop.order}
        </p>
        {stop.cues.length > 0 ? (
          <div className="mt-3 flex flex-wrap gap-2">
            {stop.cues.map((cue) => (
              <span key={cue} className={`rounded-lg px-2 py-1 text-xs font-black leading-none ${cueClass(cue)}`}>
                {cue}
              </span>
            ))}
          </div>
        ) : null}
      </div>

      <div className="mt-6 grid gap-3">
        <button
          type="button"
          onClick={onViewDetails}
          className="inline-flex min-h-14 items-center justify-center gap-2 rounded-xl bg-white px-4 text-base font-black text-[#012d1d]"
        >
          <Info className="h-5 w-5" aria-hidden="true" />
          View Stop Details
        </button>
        <button
          type="button"
          onClick={onContinueRoute}
          className="inline-flex min-h-14 items-center justify-center gap-2 rounded-xl border border-white/24 bg-[#012d1d] px-4 text-base font-black text-white"
        >
          <Play className="h-5 w-5" aria-hidden="true" />
          Continue Route
        </button>
      </div>

      <p className="mt-5 flex items-center justify-center gap-2 text-sm font-black text-[#c1ecd4]">
        <ClipboardCheck className="h-4 w-4" aria-hidden="true" />
        Ready for delivery
      </p>
    </section>
  );
}
