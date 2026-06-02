import { Headphones } from "lucide-react";
import { RIDER_ROUTE_META } from "./rider-demo-data";

export function RiderHeader() {
  return (
    <header className="border-b border-[#c1c8c2] pb-4 lg:pb-5">
      <div className="grid gap-4 rounded-2xl bg-[#fbf9f4] lg:grid-cols-[1fr_auto] lg:items-center">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <h1 className="font-display text-2xl font-black leading-tight text-[#012d1d] sm:text-4xl lg:text-[42px] lg:leading-[1.05] xl:text-[46px]">
              {RIDER_ROUTE_META.brand}
            </h1>
            <span className="rounded-xl bg-[#ffdcc4] px-3 py-1.5 text-sm font-black leading-none text-[#3a2000]">
              {RIDER_ROUTE_META.demoBadge}
            </span>
          </div>
          <p className="mt-3 text-lg leading-7 text-[#1b1c19] sm:text-xl lg:mt-4 lg:text-[22px]">
            {RIDER_ROUTE_META.greeting}
          </p>
          <p className="mt-0.5 text-2xl font-black leading-tight text-[#012d1d] lg:text-[26px]">
            {RIDER_ROUTE_META.routeName}
          </p>
          <p className="mt-0.5 text-base font-bold leading-6 text-[#414844] lg:text-[17px]">
            {RIDER_ROUTE_META.routeDate}
          </p>
        </div>

        <a
          href={RIDER_ROUTE_META.adminSupportHref}
          className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl border border-[#012d1d] bg-white px-4 text-center text-sm font-black text-[#012d1d] sm:w-auto lg:self-end"
        >
          <Headphones className="h-5 w-5" aria-hidden="true" />
          <span>Contact Admin Support</span>
        </a>
      </div>
    </header>
  );
}
