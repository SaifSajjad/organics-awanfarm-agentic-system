import { AlertTriangle, CheckCircle2, ClipboardList, RotateCcw, WalletCards } from "lucide-react";

type RiderSummaryItem = {
  label: string;
  value: string;
  tone?: "green" | "amber" | "red";
};

type RiderRouteSummaryProps = {
  mode: "before" | "active";
  items: RiderSummaryItem[];
};

const iconByLabel: Record<string, typeof ClipboardList> = {
  "Total Stops": ClipboardList,
  Completed: CheckCircle2,
  Remaining: RotateCcw,
  Missed: AlertTriangle,
  "Cash Required Stops": WalletCards,
  "Bottle Return Stops": RotateCcw
};

function toneClass(tone?: RiderSummaryItem["tone"]) {
  if (tone === "red") return "text-[#93000a]";
  if (tone === "amber") return "text-[#703800]";
  return "text-[#012d1d]";
}

export function RiderRouteSummary({ mode, items }: RiderRouteSummaryProps) {
  const cueItems = items.filter((item) => item.label.includes("Stops") && item.label !== "Total Stops");
  const statItems = items.filter((item) => !cueItems.includes(item));

  return (
    <section className="rounded-2xl border border-[#d8d5ca] bg-white p-4 shadow-[0_4px_18px_rgba(27,67,50,0.05)] sm:p-5">
      <div className="flex items-center gap-2.5">
        <ClipboardList className="h-5 w-5 text-[#012d1d]" aria-hidden="true" />
        <h2 className="font-display text-[1.7rem] font-black leading-tight text-[#012d1d]">Today’s Route</h2>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
        {statItems.map((item) => {
          const Icon = iconByLabel[item.label] ?? ClipboardList;

          return (
            <div key={item.label} className="rounded-xl border border-[#e4e2dd] bg-[#fbf9f4] p-3">
              <p className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-xs font-black tracking-[0.04em] text-[#717973]">
                <Icon className="h-4 w-4" aria-hidden="true" />
                <span>{item.label}</span>
                <span aria-hidden="true">—</span>
                <span>{item.value}</span>
              </p>
              <p
                aria-hidden="true"
                className={`mt-2 font-display text-[2rem] font-black leading-none ${toneClass(item.tone)}`}
              >
                {item.value}
              </p>
            </div>
          );
        })}
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {cueItems.map((item) => {
          const Icon = iconByLabel[item.label] ?? ClipboardList;
          const label = mode === "before" ? `${item.value} ${item.label}` : `${item.label} — ${item.value}`;

          return (
            <span
              key={item.label}
              className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-[#c1c8c2] bg-[#f5f3ee] px-3 text-sm font-black text-[#1b1c19]"
            >
              <Icon className="h-4 w-4 text-[#012d1d]" aria-hidden="true" />
              {label}
            </span>
          );
        })}
      </div>
    </section>
  );
}
