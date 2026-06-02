import { ChevronDown } from "lucide-react";
import type { RiderCue, RiderRouteStop, RiderStopStatus } from "./rider-types";

type RiderRouteListProps = {
  title: string;
  description?: string;
  stops: RiderRouteStop[];
  footer?: "view-all" | "more-stops";
  onViewAll?: () => void;
};

function statusClass(status: RiderStopStatus) {
  if (status === "Delivered") return "border-[#1b4332] bg-white text-[#1b4332]";
  if (status === "Missed") return "border-[#ffdad6] bg-[#fff3f1] text-[#93000a]";
  if (status === "Active") return "border-[#012d1d] bg-[#012d1d] text-white";
  return "border-[#c1c8c2] bg-[#f5f3ee] text-[#414844]";
}

function cueClass(cue: RiderCue) {
  if (cue === "Cash Required") return "border-[#ffb781] bg-[#ffdcc4] text-[#3a2000]";
  if (cue === "Bottle Return") return "border-[#a5d0b9] bg-[#c1ecd4] text-[#002114]";
  return "border-[#c1c8c2] bg-[#f0eee9] text-[#1b1c19]";
}

export function RiderRouteList({ title, description, stops, footer, onViewAll }: RiderRouteListProps) {
  return (
    <section className="space-y-3">
      <div>
        <h2 className="font-display text-[1.7rem] font-black leading-tight text-[#012d1d]">{title}</h2>
        {description ? <p className="mt-1 text-base leading-6 text-[#414844]">{description}</p> : null}
      </div>

      <div className="grid gap-2.5">
        {stops.map((stop) => (
          <article
            key={stop.sequence}
            className={`rounded-2xl border bg-white p-3.5 shadow-[0_4px_18px_rgba(27,67,50,0.04)] sm:p-4 ${
              stop.status === "Active" ? "border-[#012d1d]" : stop.status === "Missed" ? "border-[#ffb4ab]" : "border-[#e4e2dd]"
            }`}
          >
            <div className="grid grid-cols-[1.75rem_1fr_auto] gap-2.5 sm:grid-cols-[2rem_1fr_auto] sm:gap-3">
              <span className="pt-1 text-sm font-black text-[#717973]">{stop.sequence}</span>
              <div className="min-w-0">
                <h3 className="break-words text-base font-semibold leading-6 text-[#1b1c19] sm:text-lg">
                  {stop.initials} — {stop.area}
                </h3>
                <p className="mt-0.5 text-sm font-black leading-5 text-[#012d1d]">{stop.order}</p>
                {stop.cues.length > 0 ? (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {stop.cues.map((cue) => (
                      <span
                        key={cue}
                        className={`rounded-lg border px-2 py-1 text-[11px] font-black leading-none ${cueClass(cue)}`}
                      >
                        {cue}
                      </span>
                    ))}
                  </div>
                ) : null}
              </div>
              <span
                className={`inline-flex h-7 items-center rounded-lg border px-2 text-[11px] font-black ${statusClass(
                  stop.status
                )}`}
              >
                {stop.status}
              </span>
            </div>
          </article>
        ))}
      </div>

      {footer === "view-all" ? (
        <button
          type="button"
          onClick={onViewAll}
          className="inline-flex min-h-14 w-full items-center justify-center rounded-xl border-2 border-[#012d1d] bg-[#fbf9f4] px-4 text-base font-black text-[#012d1d]"
        >
          View All 12 Stops
        </button>
      ) : null}

      {footer === "more-stops" ? (
        <button
          type="button"
          className="mx-auto inline-flex min-h-12 items-center justify-center gap-2 rounded-xl px-4 text-base font-black text-[#012d1d]"
        >
          5 more stops
          <ChevronDown className="h-5 w-5" aria-hidden="true" />
        </button>
      ) : null}
    </section>
  );
}
