import Link from "next/link";
import { Leaf, ShieldCheck } from "lucide-react";

export function TrackingHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-farm-heritage/10 bg-farm-meadow/95 shadow-[0_8px_30px_rgba(14,36,25,0.06)] backdrop-blur-xl">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="flex min-w-0 items-center gap-3" aria-label="Organics by Awan Farms home">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-farm-heritage text-white shadow-soft-card">
            <Leaf className="h-5 w-5" aria-hidden="true" />
          </span>
          <span className="min-w-0">
            <span className="block truncate font-display text-xl font-bold leading-tight text-farm-heritage sm:text-2xl">
              Organics by Awan Farms
            </span>
            <span className="mt-0.5 hidden font-label text-[11px] font-bold uppercase tracking-[0.16em] text-farm-ink/55 sm:block">
              Customer delivery update
            </span>
          </span>
        </Link>

        <span className="inline-flex min-h-10 shrink-0 items-center gap-2 rounded-full border border-farm-heritage/10 bg-white/80 px-3 font-label text-[11px] font-bold uppercase tracking-[0.14em] text-farm-heritage shadow-soft-card">
          <ShieldCheck className="h-4 w-4 text-farm-gold" aria-hidden="true" />
          <span className="hidden sm:inline">Secure Delivery Tracking</span>
          <span className="sm:hidden">Secure</span>
        </span>
      </div>
    </header>
  );
}
