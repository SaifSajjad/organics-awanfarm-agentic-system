import Link from "next/link";
import { BarChart3, Bot, ClipboardList, Milk, Sparkles, Truck } from "lucide-react";

const navItems = [
  { href: "/", label: "Website", icon: Milk },
  { href: "/dashboard/admin", label: "Admin", icon: BarChart3 },
  { href: "/operations", label: "Operations", icon: ClipboardList },
  { href: "/agents", label: "Agents", icon: Sparkles },
  { href: "/dashboard/customer", label: "Customer", icon: Bot },
  { href: "/dashboard/rider", label: "Rider", icon: Truck }
];

export function AppHeader() {
  return (
    <header className="sticky top-0 z-40 border-b bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
        <Link href="/" className="flex items-center gap-2 font-semibold text-farm-green">
          <span className="flex h-9 w-9 items-center justify-center rounded-md bg-farm-green text-white">
            OA
          </span>
          <span>Organics by Awan Farms</span>
        </Link>
        <nav className="flex w-full items-center gap-1 overflow-x-auto pb-1 md:w-auto md:pb-0">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex shrink-0 items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-farm-ink hover:bg-secondary"
              >
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
