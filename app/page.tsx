import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  CheckCircle2,
  Clock3,
  Droplets,
  Leaf,
  MapPin,
  MessageCircle,
  Milk,
  ShieldCheck,
  Sparkles,
  Truck
} from "lucide-react";
import { deliveryAreas, products } from "@/lib/demo-data";

const navItems = [
  { label: "Products", href: "#products" },
  { label: "Promise", href: "#promise" },
  { label: "Areas", href: "#areas" },
  { label: "Order", href: "#order" }
];

const productAssets: Record<string, string> = {
  "cow-milk": "/brand/milk-bottles-field-pricing.png",
  "buffalo-milk": "/brand/premium-buffalo-milk-lahore.png"
};

const productNotes: Record<string, string[]> = {
  "cow-milk": ["Light daily taste", "Ideal for tea and children", "Morning delivery"],
  "buffalo-milk": ["Naturally rich texture", "Perfect for yogurt and desserts", "Fresh route batches"]
};

const qualityPromises = [
  {
    title: "Fresh Morning Runs",
    text: "Milk is packed for early Lahore routes with a simple daily delivery rhythm.",
    icon: Clock3
  },
  {
    title: "Cow And Buffalo Choices",
    text: "Choose lighter cow milk or richer buffalo milk for your household plan.",
    icon: Milk
  },
  {
    title: "Clean Handling",
    text: "Every subscription is treated as a family order, with careful packing and clear records.",
    icon: ShieldCheck
  },
  {
    title: "Route-Aware Support",
    text: "WhatsApp ordering keeps delivery notes, changes, and follow-ups close to the farm team.",
    icon: MessageCircle
  }
];

const subscriptionSteps = [
  "Pick cow or buffalo milk",
  "Choose daily liters",
  "Share your Lahore address",
  "Confirm on WhatsApp"
];

export default function HomePage() {
  return (
    <main className="min-h-screen overflow-hidden bg-farm-cream text-farm-ink">
      <header className="absolute inset-x-0 top-0 z-30">
        <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/" className="group flex min-w-0 items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-white/30 bg-white/88 text-farm-green shadow-sm backdrop-blur">
              <Leaf className="h-5 w-5" />
            </span>
            <span className="min-w-0">
              <span className="block truncate font-display text-base font-black text-white sm:text-lg">
                Organics by Awan Farms
              </span>
              <span className="hidden text-xs font-semibold uppercase tracking-[0.16em] text-white/72 sm:block">
                Lahore dairy delivery
              </span>
            </span>
          </Link>

          <div className="hidden items-center gap-1 rounded-md border border-white/18 bg-white/12 p-1 text-sm font-semibold text-white shadow-sm backdrop-blur-xl md:flex">
            {navItems.map((item) => (
              <a key={item.href} href={item.href} className="rounded-md px-3 py-2 transition hover:bg-white/14">
                {item.label}
              </a>
            ))}
          </div>

          <Link
            href="/dashboard/admin"
            className="premium-button inline-flex min-h-10 items-center justify-center rounded-md border border-white/25 bg-white px-4 text-sm font-bold text-farm-green shadow-sm"
          >
            Demo
          </Link>
        </nav>
      </header>

      <section className="relative isolate flex min-h-[86svh] items-center overflow-hidden bg-farm-green px-4 pb-14 pt-28 text-white sm:px-6 lg:px-8">
        <Image
          src="/brand/pure-promise-landscape.png"
          alt="Organics by Awan Farms fresh milk delivery"
          fill
          priority
          sizes="100vw"
          className="absolute inset-0 -z-20 object-cover"
        />
        <div className="absolute inset-0 -z-10 bg-farm-green/64" />
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(15,77,35,0.92),rgba(15,77,35,0.64),rgba(15,77,35,0.22))]" />

        <div className="mx-auto w-full max-w-7xl">
          <div className="max-w-3xl">
            <p className="inline-flex items-center gap-2 rounded-md border border-white/24 bg-white/12 px-3 py-2 text-xs font-black uppercase tracking-[0.16em] text-white shadow-sm backdrop-blur">
              <Sparkles className="h-4 w-4 text-farm-wheat" />
              Pure milk. Pure promise.
            </p>
            <h1 className="mt-6 font-display text-5xl font-black leading-tight text-white sm:text-6xl lg:text-7xl">
              Organics by Awan Farms
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-white/84 sm:text-xl">
              Premium cow and buffalo milk subscriptions delivered fresh across Lahore, with family-grade care and
              simple WhatsApp ordering.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href="https://wa.me/923395235323"
                className="premium-button inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-farm-wheat px-5 font-black text-farm-green shadow-soft"
              >
                <MessageCircle className="h-5 w-5" />
                Order on WhatsApp
              </a>
              <a
                href="#products"
                className="premium-button inline-flex min-h-12 items-center justify-center gap-2 rounded-md border border-white/30 bg-white/12 px-5 font-bold text-white backdrop-blur"
              >
                See Milk Plans
                <ArrowRight className="h-5 w-5" />
              </a>
            </div>

            <div className="mt-10 grid max-w-3xl gap-3 sm:grid-cols-3">
              {[
                ["PKR 330", "Cow milk per liter"],
                ["PKR 430", "Buffalo milk per liter"],
                ["14+", "Lahore delivery areas"]
              ].map(([value, label]) => (
                <div key={label} className="rounded-md border border-white/18 bg-white/12 p-4 shadow-sm backdrop-blur-xl">
                  <p className="font-display text-2xl font-black text-white">{value}</p>
                  <p className="mt-1 text-sm font-medium text-white/72">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="products" className="bg-farm-cream px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.16em] text-farm-wheat">Select your plan</p>
              <h2 className="mt-2 font-display text-3xl font-black text-farm-green sm:text-4xl">
                Fresh milk for the daily table
              </h2>
            </div>
            <Link
              href="/dashboard/customer"
              className="premium-button inline-flex min-h-11 w-fit items-center justify-center gap-2 rounded-md border border-farm-wheat bg-white px-4 font-bold text-farm-green"
            >
              Preview Subscription
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-8 grid gap-5 lg:grid-cols-2">
            {products.map((product) => (
              <article key={product.id} className="glass-card overflow-hidden">
                <div className="grid gap-0 md:grid-cols-[0.92fr_1.08fr]">
                  <div className="relative min-h-64 overflow-hidden bg-farm-green">
                    <Image
                      src={productAssets[product.id] ?? "/brand/pure-farm-milk-square.png"}
                      alt={`${product.name} from Organics by Awan Farms`}
                      fill
                      sizes="(min-width: 1024px) 35vw, 100vw"
                      className="object-cover transition duration-500 hover:scale-[1.03]"
                    />
                  </div>
                  <div className="flex flex-col justify-between p-6">
                    <div>
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="font-display text-3xl font-black text-farm-green">{product.name}</h3>
                          <p className="mt-2 leading-7 text-muted-foreground">{product.description}</p>
                        </div>
                        <div className="shrink-0 rounded-md bg-farm-green px-4 py-3 text-right text-white">
                          <p className="text-xs font-black uppercase tracking-[0.12em] text-farm-wheat">PKR</p>
                          <p className="font-display text-3xl font-black">{product.price}</p>
                          <p className="text-xs font-semibold text-white/72">/{product.unit}</p>
                        </div>
                      </div>

                      <div className="mt-6 grid gap-2">
                        {(productNotes[product.id] ?? []).map((note) => (
                          <div key={note} className="flex items-center gap-2 text-sm font-semibold text-farm-ink">
                            <CheckCircle2 className="h-4 w-4 text-farm-leaf" />
                            {note}
                          </div>
                        ))}
                      </div>
                    </div>

                    <a
                      href="https://wa.me/923395235323"
                      className="premium-button mt-7 inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-farm-green px-4 font-bold text-white"
                    >
                      Subscribe Now
                      <MessageCircle className="h-4 w-4" />
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
          <div className="relative min-h-[360px] overflow-hidden rounded-md border border-farm-green/10 shadow-soft">
            <Image
              src="/brand/pure-love-model-town.png"
              alt="Fresh dairy subscription delivery in Lahore"
              fill
              sizes="(min-width: 1024px) 40vw, 100vw"
              className="object-cover"
            />
          </div>

          <div>
            <p className="text-sm font-black uppercase tracking-[0.16em] text-farm-wheat">Daily subscription</p>
            <h2 className="mt-2 font-display text-3xl font-black text-farm-green sm:text-4xl">
              Build a simple morning milk routine
            </h2>
            <p className="mt-4 max-w-2xl leading-8 text-muted-foreground">
              Start with your preferred milk, daily liters, and route address. The farm team confirms everything on
              WhatsApp before your first delivery.
            </p>

            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              {subscriptionSteps.map((step, index) => (
                <div key={step} className="glass-card flex items-center gap-3 p-4">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-farm-green font-black text-white">
                    {index + 1}
                  </span>
                  <span className="font-bold text-farm-ink">{step}</span>
                </div>
              ))}
            </div>

            <a
              href="https://wa.me/923395235323"
              className="premium-button mt-7 inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-farm-wheat px-5 font-black text-farm-green"
            >
              Build Your Subscription
              <ArrowRight className="h-5 w-5" />
            </a>
          </div>
        </div>
      </section>

      <section id="promise" className="bg-farm-green px-4 py-16 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <p className="text-sm font-black uppercase tracking-[0.16em] text-farm-wheat">Our quality promise</p>
            <h2 className="mt-2 font-display text-3xl font-black sm:text-4xl">
              Premium care from farm packing to doorstep handoff
            </h2>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {qualityPromises.map((item) => (
              <article key={item.title} className="rounded-md border border-white/14 bg-white/10 p-5 shadow-sm backdrop-blur-xl">
                <item.icon className="h-7 w-7 text-farm-wheat" />
                <h3 className="mt-5 font-display text-xl font-black">{item.title}</h3>
                <p className="mt-3 text-sm leading-6 text-white/74">{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="areas" className="bg-white px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.16em] text-farm-wheat">Active Lahore routes</p>
            <h2 className="mt-2 font-display text-3xl font-black text-farm-green sm:text-4xl">
              Serving the neighborhoods that order fresh
            </h2>
            <p className="mt-4 leading-8 text-muted-foreground">
              Core delivery routes cover daily homes in Model Town, Bahria, Johar Town, and nearby Lahore communities.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <span className="inline-flex items-center gap-2 rounded-md bg-farm-cream px-3 py-2 text-sm font-bold text-farm-green">
                <Truck className="h-4 w-4" />
                Morning dispatch
              </span>
              <span className="inline-flex items-center gap-2 rounded-md bg-farm-cream px-3 py-2 text-sm font-bold text-farm-green">
                <Droplets className="h-4 w-4" />
                Fresh milk batches
              </span>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {deliveryAreas.map((area) => (
              <div key={area} className="glass-card flex min-h-14 items-center gap-3 px-4 py-3">
                <MapPin className="h-4 w-4 shrink-0 text-farm-wheat" />
                <span className="font-semibold text-farm-ink">{area}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="order" className="bg-farm-cream px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl overflow-hidden rounded-md border border-farm-green/10 bg-white shadow-soft lg:grid-cols-[1.05fr_0.95fr]">
          <div className="p-6 sm:p-8 lg:p-10">
            <p className="inline-flex items-center gap-2 rounded-md bg-farm-cream px-3 py-2 text-xs font-black uppercase tracking-[0.14em] text-farm-green">
              <BadgeCheck className="h-4 w-4 text-farm-wheat" />
              Custom orders welcome
            </p>
            <h2 className="mt-5 font-display text-3xl font-black text-farm-green sm:text-4xl">
              Ready for tomorrow morning&apos;s milk?
            </h2>
            <p className="mt-4 max-w-2xl leading-8 text-muted-foreground">
              Share your milk type, liters, delivery area, and preferred start date. The farm team will confirm your
              plan directly on WhatsApp.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <a
                href="https://wa.me/923395235323"
                className="premium-button inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-farm-green px-5 font-black text-white"
              >
                <MessageCircle className="h-5 w-5" />
                Chat on WhatsApp
              </a>
              <Link
                href="/dashboard/admin"
                className="premium-button inline-flex min-h-12 items-center justify-center gap-2 rounded-md border border-farm-wheat bg-farm-cream px-5 font-bold text-farm-green"
              >
                View System Demo
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </div>
          <div className="relative min-h-72 bg-farm-green">
            <Image
              src="/brand/brand-collage-rice-wheat-milk.png"
              alt="Organics by Awan Farms products"
              fill
              sizes="(min-width: 1024px) 40vw, 100vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      <footer className="bg-farm-green px-4 py-8 text-white sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-display text-lg font-black">Organics by Awan Farms</p>
            <p className="mt-1 text-sm text-white/68">Fresh cow and buffalo milk delivered across Lahore.</p>
          </div>
          <div className="flex flex-col gap-2 text-sm font-semibold text-white/80 sm:items-end">
            <a href="https://wa.me/923395235323" className="inline-flex items-center gap-2 hover:text-white">
              <MessageCircle className="h-4 w-4 text-farm-wheat" />
              0339-5235323
            </a>
            <span className="inline-flex items-center gap-2">
              <Leaf className="h-4 w-4 text-farm-wheat" />
              Farm fresh dairy subscriptions
            </span>
          </div>
        </div>
      </footer>
    </main>
  );
}
