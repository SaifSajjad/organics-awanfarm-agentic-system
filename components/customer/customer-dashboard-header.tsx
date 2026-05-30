"use client";

import Link from "next/link";
import { Bell, Menu, UserCircle2, X } from "lucide-react";
import { useEffect, useState } from "react";

const navItems = [
  { href: "#dashboard", label: "Dashboard" },
  { href: "#subscription", label: "My Subscription" },
  { href: "#deliveries", label: "Deliveries" },
  { href: "#billing", label: "Billing" },
  { href: "#support", label: "Support" }
];

export function CustomerDashboardHeader() {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!menuOpen) return;

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    }

    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [menuOpen]);

  return (
    <header className="sticky top-0 z-40 border-b border-farm-heritage/10 bg-farm-meadow/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="group flex min-w-0 items-center gap-3" aria-label="Go to Organics by Awan Farms home">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-farm-heritage text-sm font-black text-farm-milk shadow-soft-card transition-transform group-hover:-translate-y-0.5">
            OA
          </span>
          <span className="truncate font-display text-xl font-bold text-farm-heritage">
            Organics by Awan Farms
          </span>
        </Link>

        <nav className="hidden items-center gap-7 lg:flex" aria-label="Customer dashboard sections">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="font-label text-xs font-bold uppercase tracking-[0.16em] text-farm-ink/70 transition-colors hover:text-farm-heritage"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-4 lg:flex">
          <button
            type="button"
            aria-label="View notifications, 2 unread"
            className="relative grid h-11 w-11 place-items-center rounded-full border border-farm-heritage/10 bg-white text-farm-heritage shadow-soft-card transition-transform hover:-translate-y-0.5"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute -right-0.5 -top-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-farm-gold px-1 text-[10px] font-black text-farm-heritage">
              2
            </span>
          </button>
          <div className="flex items-center gap-3 rounded-full border border-farm-heritage/10 bg-white px-4 py-2 shadow-soft-card">
            <UserCircle2 className="h-8 w-8 text-farm-heritage" />
            <div className="leading-tight">
              <p className="text-sm font-bold text-farm-heritage">Sarah J.</p>
              <p className="text-xs text-farm-ink/60">Lahore</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <button
            type="button"
            aria-label="View notifications, 2 unread"
            className="relative grid h-10 w-10 place-items-center rounded-full border border-farm-heritage/10 bg-white text-farm-heritage"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute right-1 top-1 h-2.5 w-2.5 rounded-full bg-farm-gold" />
          </button>
          <button
            type="button"
            aria-expanded={menuOpen}
            aria-controls="customer-mobile-menu"
            aria-label={menuOpen ? "Close customer menu" : "Open customer menu"}
            onClick={() => setMenuOpen((value) => !value)}
            className="grid h-10 w-10 place-items-center rounded-full border border-farm-heritage/10 bg-white text-farm-heritage"
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <div
        id="customer-mobile-menu"
        className={`customer-mobile-menu lg:hidden ${menuOpen ? "customer-mobile-menu-open" : ""}`}
      >
        <div className="mx-4 mb-4 rounded-3xl border border-farm-heritage/10 bg-white p-4 shadow-premium">
          <div className="mb-4 flex items-center gap-3 rounded-2xl bg-farm-cream p-3">
            <UserCircle2 className="h-9 w-9 text-farm-heritage" />
            <div>
              <p className="font-bold text-farm-heritage">Sarah J.</p>
              <p className="text-sm text-farm-ink/60">Model Town, Lahore</p>
            </div>
          </div>
          <nav className="grid gap-2" aria-label="Mobile customer dashboard sections">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="rounded-2xl px-4 py-3 text-sm font-bold text-farm-heritage transition-colors hover:bg-farm-cream"
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}
