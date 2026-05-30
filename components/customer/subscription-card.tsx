import Image from "next/image";
import {
  CalendarClock,
  CheckCircle2,
  Home,
  Milk,
  PencilLine,
  Route,
  Settings2,
  Truck
} from "lucide-react";

type SubscriptionCardProps = {
  onDemoAction: (message: string) => void;
};

const detailItems = [
  { label: "Daily quantity", value: "2 Liters" },
  { label: "Frequency", value: "Daily" },
  { label: "Rate", value: "PKR 330 / Liter" },
  { label: "Monthly estimate", value: "PKR 19,800" }
];

export function SubscriptionCard({ onDemoAction }: SubscriptionCardProps) {
  return (
    <section id="subscription" className="customer-card overflow-hidden p-0">
      <div className="grid gap-0 lg:grid-cols-[280px_1fr]">
        <div className="relative min-h-[260px] overflow-hidden bg-farm-heritage">
          <Image
            src="/brand/pure-farm-milk-square.png"
            alt="Fresh cow milk bottle from Organics by Awan Farms"
            fill
            sizes="(min-width: 1024px) 280px, 100vw"
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-farm-heritage/80 via-farm-heritage/10 to-transparent" />
          <div className="absolute bottom-5 left-5 right-5 text-white">
            <p className="font-label text-xs font-bold uppercase tracking-[0.18em] text-farm-gold">Daily essentials</p>
            <h2 className="mt-1 font-display text-3xl font-bold">Fresh Cow Milk</h2>
          </div>
        </div>

        <div className="p-5 sm:p-6 lg:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-farm-heritage px-3 py-1.5 text-xs font-bold uppercase tracking-[0.14em] text-white">
                <CheckCircle2 className="h-4 w-4 text-farm-gold" />
                Active
              </div>
              <h3 className="mt-4 font-display text-3xl font-bold text-farm-heritage">Daily Cow Milk</h3>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-farm-ink/70">
                Heritage-quality cow milk delivered every morning with transparent billing and route updates.
              </p>
            </div>
            <div className="rounded-3xl bg-farm-cream px-5 py-4 text-left sm:text-right">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-farm-ink/60">Next delivery</p>
              <p className="mt-1 text-lg font-black text-farm-heritage">Tomorrow, 7:00 AM</p>
            </div>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {detailItems.map((item) => (
              <div key={item.label} className="rounded-2xl border border-farm-heritage/10 bg-white px-4 py-4">
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-farm-ink/50">{item.label}</p>
                <p className="mt-2 text-base font-black text-farm-heritage">{item.value}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 grid gap-3 md:grid-cols-2">
            <div className="rounded-2xl border border-farm-heritage/10 bg-farm-meadow p-4">
              <p className="flex items-center gap-2 text-sm font-bold text-farm-heritage">
                <Home className="h-4 w-4 text-farm-gold" />
                House 69-E, Model Town, Lahore
              </p>
              <p className="mt-2 text-xs text-farm-ink/60">Default delivery address</p>
            </div>
            <div className="rounded-2xl border border-farm-heritage/10 bg-farm-meadow p-4">
              <p className="flex items-center gap-2 text-sm font-bold text-farm-heritage">
                <Truck className="h-4 w-4 text-farm-gold" />
                Rider assigned: Arshad K.
              </p>
              <p className="mt-2 text-xs text-farm-ink/60">Model Town morning route</p>
            </div>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <button
              type="button"
              onClick={() => onDemoAction("Manage Subscription is a demo placeholder for this UI phase.")}
              className="customer-action-button bg-farm-heritage text-white"
            >
              <Settings2 className="h-4 w-4" />
              Manage Subscription
            </button>
            <button
              type="button"
              onClick={() => onDemoAction("Change Quantity will connect to subscription controls after the backend phase.")}
              className="customer-action-button border border-farm-heritage/20 bg-white text-farm-heritage"
            >
              <Milk className="h-4 w-4" />
              Change Quantity
            </button>
            <button
              type="button"
              onClick={() => onDemoAction("Update Schedule is safely parked as a frontend demo action.")}
              className="customer-action-button border border-farm-heritage/20 bg-white text-farm-heritage"
            >
              <CalendarClock className="h-4 w-4" />
              Update Schedule
            </button>
            <button
              type="button"
              onClick={() => onDemoAction("Update Address will remain local-demo until account-aware APIs are approved.")}
              className="customer-action-button border border-farm-heritage/20 bg-white text-farm-heritage"
            >
              <PencilLine className="h-4 w-4" />
              Update Address
            </button>
          </div>

          <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-farm-gold/15 px-3 py-2 text-xs font-bold uppercase tracking-[0.14em] text-farm-heritage">
            <Route className="h-4 w-4" />
            Trusted route active
          </div>
        </div>
      </div>
    </section>
  );
}
