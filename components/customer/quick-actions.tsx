import {
  CalendarOff,
  Download,
  History,
  MapPin,
  MessageCircle,
  Milk,
  ReceiptText
} from "lucide-react";

type QuickActionsProps = {
  onExtraMilk: () => void;
  onVacationMode: () => void;
  onSupport: () => void;
  onDemoAction: (message: string) => void;
};

export function QuickActions({ onExtraMilk, onVacationMode, onSupport, onDemoAction }: QuickActionsProps) {
  const actions = [
    {
      label: "Request Extra Milk",
      description: "Add liters to an upcoming route",
      icon: Milk,
      onClick: onExtraMilk
    },
    {
      label: "Pause Delivery",
      description: "Set Vacation Mode",
      icon: CalendarOff,
      onClick: onVacationMode
    },
    {
      label: "Download Invoice",
      description: "Demo receipt action",
      icon: Download,
      onClick: () => onDemoAction("Invoice download is a safe demo state in this phase.")
    },
    {
      label: "Contact Support",
      description: "Open Farm Support Assistant",
      icon: MessageCircle,
      onClick: onSupport
    },
    {
      label: "Update Address",
      description: "Account-aware update later",
      icon: MapPin,
      onClick: () => onDemoAction("Address changes will be enabled after the auth/API phase.")
    },
    {
      label: "View Delivery History",
      description: "Jump to recent deliveries",
      icon: History,
      onClick: () => {
        document.getElementById("deliveries")?.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  ];

  return (
    <section aria-labelledby="quick-actions-title">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 id="quick-actions-title" className="font-label text-sm font-bold uppercase tracking-[0.18em] text-farm-heritage">
          Quick Actions
        </h2>
        <ReceiptText className="h-5 w-5 text-farm-gold" aria-hidden="true" />
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <button
              key={action.label}
              type="button"
              onClick={action.onClick}
              aria-label={`${action.label}: ${action.description}`}
              className="customer-card group flex min-h-[132px] flex-col items-center justify-center gap-3 p-4 text-center transition-transform hover:-translate-y-1 active:scale-[0.98]"
            >
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-farm-cream text-farm-heritage transition-colors group-hover:bg-farm-heritage group-hover:text-white">
                <Icon className="h-5 w-5" />
              </span>
              <span className="text-sm font-black text-farm-heritage">{action.label}</span>
              <span className="text-xs leading-5 text-farm-ink/60">{action.description}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
