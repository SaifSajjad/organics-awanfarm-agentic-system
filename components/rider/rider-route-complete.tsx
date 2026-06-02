import { CheckCircle2, Home, ListChecks } from "lucide-react";
import { RIDER_ROUTE_META, routeCompleteSummary } from "./rider-demo-data";

type RiderRouteCompleteProps = {
  onReturnHome: () => void;
};

export function RiderRouteComplete({ onReturnHome }: RiderRouteCompleteProps) {
  return (
    <section className="mx-auto grid max-w-2xl gap-8">
      <div className="text-center">
        <div className="mx-auto grid h-24 w-24 place-items-center rounded-full border-4 border-[#1b4332] text-[#1b4332]">
          <CheckCircle2 className="h-12 w-12" aria-hidden="true" />
        </div>
        <p className="mt-6 text-sm font-black tracking-[0.16em] text-[#924c00]">Today’s Route</p>
        <h2 className="mt-2 font-display text-4xl font-black text-[#012d1d]">Route Complete</h2>
        <p className="mx-auto mt-4 max-w-lg text-xl leading-8 text-[#414844]">
          {RIDER_ROUTE_META.routeName} has been completed for this demo.
        </p>
      </div>

      <section>
        <h3 className="font-display text-3xl font-black text-[#012d1d]">Route Summary</h3>
        <div className="mt-5 overflow-hidden rounded-2xl border border-[#c1c8c2] bg-white">
          {routeCompleteSummary.map(([label, value]) => (
            <div
              key={label}
              className="grid grid-cols-[1fr_auto] items-center gap-4 border-b border-[#c1c8c2] px-5 py-5 last:border-b-0"
            >
              <p className="flex items-center gap-3 text-lg font-semibold text-[#1b1c19]">
                <ListChecks className="h-5 w-5 text-[#012d1d]" aria-hidden="true" />
                {label}
              </p>
              <p className={`text-xl font-black ${label === "Missed" ? "text-[#ba1a1a]" : "text-[#012d1d]"}`}>
                {value}
              </p>
            </div>
          ))}
        </div>
      </section>

      <button
        type="button"
        onClick={onReturnHome}
        className="inline-flex min-h-14 items-center justify-center gap-2 rounded-xl bg-[#1b4332] px-4 text-base font-black text-white"
      >
        <Home className="h-5 w-5" aria-hidden="true" />
        Return to Rider Home
      </button>
    </section>
  );
}
