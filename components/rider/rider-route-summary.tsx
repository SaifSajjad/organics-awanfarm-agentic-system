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
    <section className="rounded-2xl border border-[#d8d5ca] bg-white p-5 shadow-[0_4px_20px_rgba(27,67,50,0.06)] sm:p-6">
      <div className="flex items-center gap-3">
        <ClipboardList className="h-6 w-6 text-[#012d1d]" aria-hidden="true" />
        <h2 className="font-display text-2xl font-black text-[#012d1d]">Today’s Route</h2>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {statItems.map((item) => {
          const Icon = iconByLabel[item.label] ?? ClipboardList;

          return (
            <div key={item.label} className="rounded-xl border border-[#e4e2dd] bg-[#fbf9f4] p-4">
              <p className="flex items-center gap-2 text-xs font-black tracking-[0.08em] text-[#717973]">
                <Icon className="h-4 w-4" aria-hidden="true" />
                <span>{item.label}</span>
                <span aria-hidden="true">—</span>
                <span>{item.value}</span>
              </p>
              <p
                aria-hidden="true"
                className={`mt-2 font-display text-3xl font-black leading-none ${toneClass(item.tone)}`}
              >
                {item.value}
              </p>
            </div>
          );
        })}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {cueItems.map((item) => {
          const Icon = iconByLabel[item.label] ?? ClipboardList;
          const label = mode === "before" ? `${item.value} ${item.label}` : `${item.label} — ${item.value}`;

          return (
            <span
              key={item.label}
              className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-[#c1c8c2] bg-[#f5f3ee] px-3 text-sm font-black text-[#1b1c19]"
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
