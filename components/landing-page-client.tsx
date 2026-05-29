"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  BarChart3,
  Bot,
  CalendarCheck,
  CheckCircle2,
  ChevronRight,
  ClipboardCheck,
  Droplets,
  Home,
  Leaf,
  MapPin,
  Menu,
  MessageCircle,
  Minus,
  Navigation,
  Phone,
  Plus,
  ShieldCheck,
  Star,
  Truck,
  X
} from "lucide-react";
import { deliveryAreas, products } from "@/lib/demo-data";

const whatsappUrl = "https://wa.me/923395235323";

const navItems = [
  { label: "Our Milk", href: "#our-milk" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Areas", href: "#areas" },
  { label: "Dashboard", href: "/dashboard/admin" }
];

const qualityPromises = [
  {
    title: "100% Fresh",
    text: "Morning supply planned for family routines.",
    icon: Droplets
  },
  {
    title: "Daily Delivery",
    text: "Reliable route rhythm across Lahore homes.",
    icon: Truck
  },
  {
    title: "Clean Glass",
    text: "Premium bottle-first presentation for trust.",
    icon: ShieldCheck
  },
  {
    title: "Preservative-Free",
    text: "Simple milk, handled with care and clarity.",
    icon: Leaf
  },
  {
    title: "Trusted Routes",
    text: "Area-wise delivery operations with visibility.",
    icon: Navigation
  },
  {
    title: "Transparent Billing",
    text: "Clear subscription amounts and payment status.",
    icon: ClipboardCheck
  }
];

const planCards = [
  {
    id: "cow-milk",
    productName: "Cow Milk",
    badge: "Light & Fresh",
    image: "/brand/milk-bottles-field-pricing.png",
    description: "Perfect for children and daily tea. Smooth, fresh, and naturally light."
  },
  {
    id: "buffalo-milk",
    productName: "Buffalo Milk",
    badge: "Rich & Creamy",
    image: "/brand/premium-buffalo-milk-lahore.png",
    description: "Naturally thick and full-bodied. Ideal for traditional recipes and richer taste."
  }
];

const frequencies = ["Daily", "Alternate", "Weekends"];

const testimonials = [
  {
    area: "Model Town",
    quote: "The morning delivery is consistent, and the milk tastes fresh every day.",
    name: "Family subscription"
  },
  {
    area: "Bahria Town",
    quote: "Simple WhatsApp ordering and clear billing made switching easy for us.",
    name: "Monthly customer"
  },
  {
    area: "Johar Town",
    quote: "The route updates and support response feel much more professional.",
    name: "Daily delivery home"
  }
];

const processSteps = [
  {
    title: "Choose Milk",
    text: "Select cow or buffalo milk based on your household routine.",
    icon: Droplets
  },
  {
    title: "Select Schedule",
    text: "Pick daily, alternate, or weekend delivery for your plan.",
    icon: CalendarCheck
  },
  {
    title: "Confirm Plan",
    text: "Share your address and confirm subscription details.",
    icon: CheckCircle2
  },
  {
    title: "Receive Fresh Delivery",
    text: "Wake up to a planned morning delivery at your doorstep.",
    icon: Home
  }
];

const lahoreAreas = [
  "Model Town",
  "Bahria Town",
  "Johar Town",
  "Cantt",
  "Gulberg",
  "DHA Phase 5",
  "Askari 11",
  "Izmir Town",
  "State Life"
];

const previewCards = [
  {
    title: "Customer Portal",
    text: "Subscriptions, pause requests, billing, and support in one clean self-service space.",
    icon: Home,
    href: "/dashboard/customer"
  },
  {
    title: "Rider App",
    text: "Mobile-first delivery cards for route progress, calls, WhatsApp, and missed delivery notes.",
    icon: Truck,
    href: "/dashboard/rider"
  },
  {
    title: "Operations ERP",
    text: "Admin control center for customers, routes, delivery board, and finance visibility.",
    icon: BarChart3,
    href: "/dashboard/admin"
  }
];

function LogoMark() {
  return (
    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-farm-heritage text-farm-milk shadow-premium">
      <Leaf className="h-6 w-6" aria-hidden="true" />
    </span>
  );
}

function LandingHeader() {
  const [open, setOpen] = useState(false);

  function closeMenu() {
    setOpen(false);
  }

  return (
    <header className="sticky top-0 z-50 border-b border-farm-heritage/10 bg-farm-meadow/95 shadow-[0_8px_32px_rgba(14,36,25,0.08)] backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="flex min-w-0 items-center gap-3" aria-label="Organics by Awan Farms home">
          <LogoMark />
          <span className="font-display text-xl font-bold leading-tight text-farm-heritage sm:text-2xl">
            Organics by Awan Farms
          </span>
        </Link>

        <nav aria-label="Primary navigation" className="hidden items-center gap-1 lg:flex">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="rounded-full px-4 py-2 text-sm font-semibold text-farm-ink transition hover:bg-farm-milk hover:text-farm-heritage focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-farm-gold"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <a
            href={whatsappUrl}
            className="landing-button-secondary inline-flex min-h-11 items-center justify-center gap-2 px-4 text-sm font-bold"
          >
            <MessageCircle className="h-4 w-4" aria-hidden="true" />
            WhatsApp
          </a>
          <Link
            href="/dashboard/customer"
            className="landing-button-primary inline-flex min-h-11 items-center justify-center gap-2 px-4 text-sm font-bold"
          >
            Build Subscription
          </Link>
        </div>

        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((current) => !current)}
          className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-farm-heritage/10 bg-farm-milk text-farm-heritage shadow-sm transition active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-farm-gold lg:hidden"
        >
          {open ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
        </button>
      </div>

      <div
        className={`fixed inset-x-4 top-[76px] z-50 rounded-3xl border border-white/70 bg-farm-milk/95 p-4 shadow-premium backdrop-blur-xl transition-all duration-300 lg:hidden ${
          open ? "translate-y-0 opacity-100" : "pointer-events-none -translate-y-4 opacity-0"
        }`}
      >
        <nav aria-label="Mobile navigation" className="grid gap-2">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              onClick={closeMenu}
              className="flex min-h-12 items-center justify-between rounded-2xl px-4 text-base font-bold text-farm-heritage transition hover:bg-farm-meadow focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-farm-gold"
            >
              {item.label}
              <ChevronRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          ))}
        </nav>
        <div className="mt-4 grid gap-2">
          <a
            href={whatsappUrl}
            onClick={closeMenu}
            className="landing-button-secondary inline-flex min-h-12 items-center justify-center gap-2 px-4 text-sm font-bold"
          >
            <MessageCircle className="h-4 w-4" aria-hidden="true" />
            WhatsApp
          </a>
          <Link
            href="/dashboard/customer"
            onClick={closeMenu}
            className="landing-button-primary inline-flex min-h-12 items-center justify-center gap-2 px-4 text-sm font-bold"
          >
            Build Subscription
          </Link>
        </div>
      </div>
    </header>
  );
}

function SectionHeading({
  eyebrow,
  title,
  text
}: {
  eyebrow?: string;
  title: string;
  text?: string;
}) {
  return (
    <div className="mx-auto max-w-3xl text-center">
      {eyebrow ? (
        <p className="font-label text-xs font-bold uppercase tracking-[0.18em] text-farm-gold">{eyebrow}</p>
      ) : null}
      <h2 className="mt-3 font-display text-3xl font-bold leading-tight text-farm-heritage md:text-5xl">{title}</h2>
      {text ? <p className="mt-4 text-base leading-7 text-farm-ink/70 md:text-lg">{text}</p> : null}
    </div>
  );
}

function MilkPlans() {
  const [quantities, setQuantities] = useState<Record<string, number>>({
    "cow-milk": 1,
    "buffalo-milk": 1
  });
  const [selectedFrequencies, setSelectedFrequencies] = useState<Record<string, string>>({
    "cow-milk": "Daily",
    "buffalo-milk": "Daily"
  });

  const productByName = useMemo(() => {
    return new Map(products.map((product) => [product.name, product]));
  }, []);

  function changeQuantity(id: string, delta: number) {
    setQuantities((current) => ({
      ...current,
      [id]: Math.max(1, Math.min(12, (current[id] ?? 1) + delta))
    }));
  }

  return (
    <section id="our-milk" className="landing-section bg-farm-milk">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Our Milk"
          title="Choose Your Daily Essential"
          text="Tailor your morning ritual with premium subscriptions, selected quantity, and delivery rhythm."
        />

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          {planCards.map((plan) => {
            const product = productByName.get(plan.productName);
            const quantity = quantities[plan.id] ?? 1;
            const selectedFrequency = selectedFrequencies[plan.id] ?? "Daily";
            const dark = plan.id === "buffalo-milk";

            return (
              <article
                key={plan.id}
                className={`landing-card group overflow-hidden p-4 transition duration-300 hover:-translate-y-1 hover:shadow-premium-lg md:p-5 ${
                  dark ? "bg-farm-heritage text-farm-milk" : "bg-white text-farm-ink"
                }`}
              >
                <div className="relative aspect-[1.25] overflow-hidden rounded-3xl">
                  <Image
                    src={plan.image}
                    alt={`${plan.productName} bottle for Organics by Awan Farms`}
                    fill
                    sizes="(min-width: 1024px) 45vw, 100vw"
                    className="object-cover transition duration-500 group-hover:scale-[1.03]"
                  />
                </div>
                <div className="mt-5">
                  <span
                    className={`inline-flex rounded-full px-3 py-1 font-label text-[11px] font-bold uppercase tracking-[0.14em] ${
                      dark ? "bg-farm-gold text-farm-heritage" : "bg-farm-sage/20 text-farm-green"
                    }`}
                  >
                    {plan.badge}
                  </span>
                  <div className="mt-4 flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-display text-2xl font-bold">{plan.productName}</h3>
                      <p className={`mt-2 text-sm leading-6 ${dark ? "text-farm-milk/75" : "text-farm-ink/70"}`}>
                        {plan.description}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className={`font-label text-[11px] uppercase ${dark ? "text-farm-milk/60" : "text-farm-ink/60"}`}>
                        PKR
                      </p>
                      <p className="font-display text-3xl font-bold">{product?.price ?? 0}</p>
                      <p className={`text-xs ${dark ? "text-farm-milk/60" : "text-farm-ink/60"}`}>/ Liter</p>
                    </div>
                  </div>

                  <div className="mt-5 flex flex-wrap gap-2">
                    {frequencies.map((frequency) => {
                      const active = selectedFrequency === frequency;
                      return (
                        <button
                          key={frequency}
                          type="button"
                          aria-pressed={active}
                          onClick={() =>
                            setSelectedFrequencies((current) => ({
                              ...current,
                              [plan.id]: frequency
                            }))
                          }
                          className={`min-h-10 rounded-full px-4 text-xs font-bold transition active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-farm-gold ${
                            active
                              ? dark
                                ? "bg-farm-gold text-farm-heritage"
                                : "bg-farm-heritage text-white"
                              : dark
                                ? "bg-white/10 text-farm-milk"
                                : "bg-farm-meadow text-farm-heritage"
                          }`}
                        >
                          {frequency}
                        </button>
                      );
                    })}
                  </div>

                  <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div
                      className={`inline-flex h-12 w-fit items-center rounded-full border ${
                        dark ? "border-white/20 bg-white/10" : "border-farm-heritage/10 bg-farm-meadow"
                      }`}
                    >
                      <button
                        type="button"
                        aria-label={`Decrease ${plan.productName} quantity`}
                        onClick={() => changeQuantity(plan.id, -1)}
                        className="flex h-12 w-12 items-center justify-center rounded-full transition active:scale-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-farm-gold"
                      >
                        <Minus className="h-4 w-4" aria-hidden="true" />
                      </button>
                      <span key={`${plan.id}-${quantity}`} className="animate-quantity-pop px-2 text-sm font-bold">
                        {quantity} Liter
                      </span>
                      <button
                        type="button"
                        aria-label={`Increase ${plan.productName} quantity`}
                        onClick={() => changeQuantity(plan.id, 1)}
                        className="flex h-12 w-12 items-center justify-center rounded-full transition active:scale-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-farm-gold"
                      >
                        <Plus className="h-4 w-4" aria-hidden="true" />
                      </button>
                    </div>
                    <Link
                      href="/dashboard/customer"
                      className={`inline-flex min-h-12 items-center justify-center rounded-2xl px-5 text-sm font-bold transition active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-farm-gold ${
                        dark
                          ? "bg-farm-gold text-farm-heritage hover:bg-farm-gold/90"
                          : "bg-farm-heritage text-white hover:bg-farm-green"
                      }`}
                    >
                      Add to Subscription
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function LandingPageClient() {
  const visibleAreas = lahoreAreas.filter((area) => deliveryAreas.includes(area) || area === "DHA Phase 5");

  return (
    <main className="min-h-screen overflow-x-hidden bg-farm-meadow text-farm-ink">
      <LandingHeader />

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(203,167,47,0.20),transparent_34%),linear-gradient(180deg,#FDFCF7_0%,#F6F1DF_100%)]" />
        <div className="relative mx-auto grid min-h-[calc(100vh-72px)] max-w-7xl items-center gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[0.92fr_1.08fr] lg:px-8 lg:py-20">
          <div className="max-w-2xl">
            <p className="animate-fade-in-up font-label text-xs font-bold uppercase tracking-[0.18em] text-farm-gold">
              Pure. Fresh. Trusted.
            </p>
            <h1 className="mt-5 animate-fade-in-up-delay-1 font-display text-5xl font-bold leading-[1.05] text-farm-heritage md:text-6xl xl:text-7xl">
              Pure Milk. Pure Promise. Delivered Fresh.
            </h1>
            <p className="mt-6 animate-fade-in-up-delay-2 max-w-xl text-lg leading-8 text-farm-ink/70">
              Fresh cow and buffalo milk delivered daily from trusted local farms across Lahore. Simple subscriptions,
              reliable delivery, and smarter service.
            </p>
            <div className="mt-8 flex animate-fade-in-up-delay-3 flex-col gap-3 sm:flex-row">
              <Link
                href="/dashboard/customer"
                className="landing-button-primary inline-flex min-h-12 items-center justify-center gap-2 px-5 text-sm font-bold"
              >
                Build Your Subscription
                <ChevronRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <a
                href={whatsappUrl}
                className="landing-button-secondary inline-flex min-h-12 items-center justify-center gap-2 px-5 text-sm font-bold"
              >
                <MessageCircle className="h-4 w-4" aria-hidden="true" />
                Order on WhatsApp
              </a>
            </div>
            <div className="mt-9 grid animate-fade-in-up-delay-3 gap-3 sm:grid-cols-3">
              {["No preservatives", "Daily Lahore routes", "Clear billing"].map((item) => (
                <div key={item} className="rounded-2xl border border-farm-heritage/10 bg-white/70 p-4 shadow-soft-card backdrop-blur">
                  <CheckCircle2 className="h-5 w-5 text-farm-gold" aria-hidden="true" />
                  <p className="mt-2 text-sm font-bold text-farm-heritage">{item}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative animate-fade-in-up-delay-2">
            <div className="animate-soft-float overflow-hidden rounded-[2rem] border border-white/70 bg-white/55 p-3 shadow-premium backdrop-blur">
              <div className="relative aspect-[4/5] overflow-hidden rounded-[1.5rem] sm:hidden">
                <Image
                  src="/brand/pure-promise-portrait.png"
                  alt="Premium milk bottles from Organics by Awan Farms"
                  fill
                  priority
                  sizes="100vw"
                  className="object-cover"
                />
              </div>
              <div className="relative hidden aspect-[1.12] overflow-hidden rounded-[1.5rem] sm:block">
                <Image
                  src="/brand/pure-promise-landscape.png"
                  alt="Fresh milk bottle delivery by Organics by Awan Farms"
                  fill
                  priority
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover"
                />
              </div>
            </div>
            <div className="absolute -bottom-5 left-5 rounded-2xl border border-white/70 bg-white/90 p-4 shadow-premium backdrop-blur">
              <p className="font-label text-[11px] font-bold uppercase tracking-[0.14em] text-farm-gold">
                Morning promise
              </p>
              <p className="mt-1 font-display text-2xl font-bold text-farm-heritage">0339-5235323</p>
            </div>
          </div>
        </div>
      </section>

      <section className="landing-section">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Quality Promise"
            title="Our Quality Promise"
            text="From cold handling to clear billing, every step is built around trust."
          />
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {qualityPromises.map((promise) => {
              const Icon = promise.icon;
              return (
                <article key={promise.title} className="landing-card group min-h-[180px] p-6 transition duration-300 hover:-translate-y-1 hover:shadow-premium">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-farm-heritage text-farm-milk transition group-hover:bg-farm-gold group-hover:text-farm-heritage">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <h3 className="mt-5 font-display text-2xl font-bold text-farm-heritage">{promise.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-farm-ink/70">{promise.text}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <MilkPlans />

      <section className="landing-section">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading title="Trusted by Families Across Lahore" />
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {testimonials.map((testimonial) => (
              <article key={testimonial.area} className="landing-card animate-fade-in-up p-6">
                <div className="flex gap-1 text-farm-gold" aria-label="Five star testimonial">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="h-4 w-4 fill-current" aria-hidden="true" />
                  ))}
                </div>
                <p className="mt-5 text-base leading-7 text-farm-ink/75">&quot;{testimonial.quote}&quot;</p>
                <div className="mt-6 flex items-center justify-between gap-4">
                  <div>
                    <p className="font-bold text-farm-heritage">{testimonial.area}</p>
                    <p className="text-sm text-farm-ink/60">{testimonial.name}</p>
                  </div>
                  <Leaf className="h-5 w-5 text-farm-green" aria-hidden="true" />
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="landing-section bg-farm-milk">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="How It Works"
            title="The Purity Journey"
            text="A simple subscription flow designed for predictable mornings."
          />
          <div className="mt-12 grid gap-4 md:grid-cols-4">
            {processSteps.map((step, index) => {
              const Icon = step.icon;
              return (
                <article key={step.title} className="relative landing-card p-5 text-center">
                  <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-farm-heritage text-farm-milk">
                    <Icon className="h-6 w-6" aria-hidden="true" />
                  </span>
                  <span className="absolute right-4 top-4 rounded-full bg-farm-gold px-2 py-1 text-xs font-bold text-farm-heritage">
                    {index + 1}
                  </span>
                  <h3 className="mt-5 font-display text-xl font-bold text-farm-heritage">{step.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-farm-ink/70">{step.text}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section id="areas" className="landing-section">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
          <div className="landing-card relative min-h-[360px] overflow-hidden bg-farm-heritage p-6 text-farm-milk">
            <div className="absolute inset-0 opacity-20">
              <Image
                src="/brand/brand-collage-rice-wheat-milk.png"
                alt="Organic farm ingredients and milk collage"
                fill
                sizes="(min-width: 1024px) 42vw, 100vw"
                className="object-cover"
              />
            </div>
            <div className="absolute left-[18%] top-[24%] h-4 w-4 animate-pin-pulse rounded-full bg-farm-gold" />
            <div className="absolute left-[56%] top-[42%] h-4 w-4 animate-pin-pulse rounded-full bg-farm-gold [animation-delay:180ms]" />
            <div className="absolute left-[34%] top-[68%] h-4 w-4 animate-pin-pulse rounded-full bg-farm-gold [animation-delay:360ms]" />
            <div className="relative z-10 flex h-full min-h-[310px] flex-col justify-end">
              <p className="font-label text-xs font-bold uppercase tracking-[0.18em] text-farm-gold">Route Coverage</p>
              <h2 className="mt-3 font-display text-4xl font-bold">Serving Lahore</h2>
              <p className="mt-3 max-w-sm text-sm leading-6 text-farm-milk/75">
                Area-wise delivery planning for premium residential routes.
              </p>
            </div>
          </div>

          <div>
            <p className="font-label text-xs font-bold uppercase tracking-[0.18em] text-farm-gold">Areas</p>
            <h2 className="mt-3 font-display text-3xl font-bold leading-tight text-farm-heritage md:text-5xl">
              Expanding Across Premium Localities
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-7 text-farm-ink/70">
              We currently serve key Lahore neighborhoods with a route model designed for freshness and reliability.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              {visibleAreas.map((area) => (
                <span
                  key={area}
                  className="inline-flex min-h-10 items-center gap-2 rounded-full border border-farm-heritage/10 bg-white px-4 text-sm font-bold text-farm-heritage shadow-soft-card"
                >
                  <MapPin className="h-4 w-4 text-farm-gold" aria-hidden="true" />
                  {area}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="landing-section bg-farm-milk">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Smart Dairy Management"
            title="More Than a Milk Delivery Website"
            text="A polished preview of the customer, rider, and operations surfaces behind the service."
          />
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {previewCards.map((card) => {
              const Icon = card.icon;
              return (
                <Link key={card.title} href={card.href} className="landing-card group block p-6 transition duration-300 hover:-translate-y-1 hover:shadow-premium">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-farm-meadow text-farm-heritage">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <h3 className="mt-6 font-display text-2xl font-bold text-farm-heritage">{card.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-farm-ink/70">{card.text}</p>
                  <span className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-farm-green">
                    Preview workspace
                    <ChevronRight className="h-4 w-4 transition group-hover:translate-x-1" aria-hidden="true" />
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl overflow-hidden rounded-[2rem] bg-farm-heritage p-8 text-center text-farm-milk shadow-premium md:p-12">
          <p className="font-label text-xs font-bold uppercase tracking-[0.18em] text-farm-gold">WhatsApp Support</p>
          <h2 className="mt-4 font-display text-3xl font-bold md:text-5xl">Need Help Choosing Your Plan?</h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-farm-milk/75">
            Chat with our team and start your fresh milk subscription today.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href={whatsappUrl}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-farm-gold px-6 text-sm font-bold text-farm-heritage transition hover:bg-farm-gold/90 active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-farm-milk"
            >
              <MessageCircle className="h-4 w-4" aria-hidden="true" />
              Talk to a Farm Agent
            </a>
            <span className="inline-flex min-h-12 items-center gap-2 rounded-2xl border border-white/15 px-5 text-sm font-bold">
              <Phone className="h-4 w-4 text-farm-gold" aria-hidden="true" />
              0339-5235323
            </span>
          </div>
        </div>
      </section>

      <footer className="bg-[#062115] px-4 pb-28 pt-12 text-farm-milk md:pb-10">
        <div className="mx-auto grid max-w-7xl gap-10 sm:px-6 lg:grid-cols-[1.2fr_0.8fr_0.8fr_1fr] lg:px-8">
          <div>
            <div className="flex items-center gap-3">
              <LogoMark />
              <p className="font-display text-2xl font-bold">Organics by Awan Farms</p>
            </div>
            <p className="mt-5 max-w-sm text-sm leading-6 text-farm-milk/60">
              Fresh cow and buffalo milk subscriptions for Lahore families, supported by smarter dairy operations.
            </p>
            <div className="mt-5 flex gap-2">
              {[MessageCircle, Phone, Leaf].map((Icon, index) => (
                <span
                  key={index}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/10 text-farm-gold"
                >
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </span>
              ))}
            </div>
          </div>
          <div>
            <h3 className="font-label text-xs font-bold uppercase tracking-[0.16em] text-farm-gold">Products</h3>
            <div className="mt-4 grid gap-3 text-sm text-farm-milk/70">
              <Link href="#our-milk">Cow Milk</Link>
              <Link href="#our-milk">Buffalo Milk</Link>
              <Link href="/dashboard/customer">Build Subscription</Link>
            </div>
          </div>
          <div>
            <h3 className="font-label text-xs font-bold uppercase tracking-[0.16em] text-farm-gold">Company</h3>
            <div className="mt-4 grid gap-3 text-sm text-farm-milk/70">
              <Link href="#how-it-works">How It Works</Link>
              <Link href="#areas">Lahore Coverage</Link>
              <Link href="/dashboard/admin">Dashboard</Link>
            </div>
          </div>
          <div>
            <h3 className="font-label text-xs font-bold uppercase tracking-[0.16em] text-farm-gold">Contact</h3>
            <div className="mt-4 grid gap-3 text-sm text-farm-milk/70">
              <a href={whatsappUrl}>WhatsApp: 0339-5235323</a>
              <span>Lahore coverage: Model Town, Bahria Town, Johar Town, Cantt, Gulberg, DHA Phase 5.</span>
              <div className="flex gap-4 pt-2">
                <Link href="#">Privacy Policy</Link>
                <Link href="#">Terms of Service</Link>
              </div>
            </div>
          </div>
        </div>
        <p className="mx-auto mt-10 max-w-7xl border-t border-white/10 pt-6 text-center text-xs text-farm-milk/40">
          © 2026 Organics by Awan Farms. Lahore, Pakistan.
        </p>
      </footer>

      <Link
        href="/agents"
        aria-label="Open demo AI support"
        className="fixed bottom-24 right-4 z-40 flex h-14 w-14 animate-ai-pulse items-center justify-center rounded-2xl bg-farm-heritage text-farm-milk shadow-premium transition hover:-translate-y-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-farm-gold md:bottom-6 md:right-6"
      >
        <Bot className="h-6 w-6" aria-hidden="true" />
      </Link>

      <div className="fixed inset-x-0 bottom-0 z-40 grid animate-sticky-rise grid-cols-2 gap-2 border-t border-farm-heritage/10 bg-farm-milk/94 p-3 shadow-[0_-16px_40px_rgba(14,36,25,0.12)] backdrop-blur md:hidden">
        <a
          href={whatsappUrl}
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-farm-heritage/10 bg-white text-sm font-bold text-farm-heritage"
        >
          <MessageCircle className="h-4 w-4" aria-hidden="true" />
          WhatsApp
        </a>
        <Link
          href="/dashboard/customer"
          className="inline-flex min-h-12 items-center justify-center rounded-2xl bg-farm-heritage px-4 text-sm font-bold text-white"
        >
          Build Subscription
        </Link>
      </div>
    </main>
  );
}
