import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, Leaf, MapPin, MessageCircle, ShieldCheck, Truck } from "lucide-react";
import { AppHeader } from "@/components/app-header";
import { deliveryAreas, products } from "@/lib/demo-data";

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <AppHeader />
      <section className="relative overflow-hidden bg-farm-cream">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_0.9fr] lg:px-8 lg:py-16">
          <div className="flex flex-col justify-center">
            <p className="mb-3 text-sm font-bold uppercase tracking-[0.18em] text-farm-leaf">
              Pure. Fresh. Trusted.
            </p>
            <h1 className="max-w-3xl text-4xl font-black leading-tight text-farm-green sm:text-5xl lg:text-6xl">
              Pure Milk. Pure Promise.
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-farm-ink/80">
              Fresh cow and buffalo milk delivered from our farm to your home across Lahore.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <a
                href="https://wa.me/923395235323"
                className="inline-flex items-center justify-center gap-2 rounded-md bg-farm-green px-5 py-3 font-semibold text-white shadow-soft"
              >
                <MessageCircle className="h-5 w-5" />
                Order on WhatsApp
              </a>
              <Link
                href="/dashboard/admin"
                className="inline-flex items-center justify-center gap-2 rounded-md border bg-white px-5 py-3 font-semibold text-farm-green"
              >
                View Demo Dashboard
              </Link>
            </div>
            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {[
                ["100% Pure", Leaf],
                ["Daily Delivery", Truck],
                ["Family Trusted", ShieldCheck]
              ].map(([label, Icon]) => (
                <div key={label as string} className="flex items-center gap-2 rounded-md bg-white p-3">
                  <Icon className="h-5 w-5 text-farm-green" />
                  <span className="text-sm font-semibold">{label as string}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="relative min-h-[420px] overflow-hidden rounded-md border bg-white shadow-soft">
            <Image
              src="/brand/pure-love-model-town.png"
              alt="Organics by Awan Farms milk delivery"
              fill
              priority
              className="object-cover"
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-farm-leaf">Products</p>
            <h2 className="mt-2 text-3xl font-bold text-farm-green">Milk Plans</h2>
          </div>
          <Link href="/dashboard/customer" className="rounded-md bg-secondary px-4 py-2 text-sm font-semibold">
            Start Subscription
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {products.map((product) => (
            <article key={product.id} className="rounded-md border bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h3 className="text-2xl font-bold text-farm-green">{product.name}</h3>
                  <p className="mt-2 text-muted-foreground">{product.description}</p>
                </div>
                <div className="rounded-md bg-farm-green px-4 py-3 text-right text-white">
                  <p className="text-xs uppercase">PKR</p>
                  <p className="text-3xl font-black">{product.price}</p>
                  <p className="text-xs">/{product.unit}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-white py-12">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[0.85fr_1fr] lg:px-8">
          <div className="relative min-h-[360px] overflow-hidden rounded-md border">
            <Image
              src="/brand/refer-and-save-monthly-bill.png"
              alt="Refer and save campaign"
              fill
              className="object-cover"
            />
          </div>
          <div className="flex flex-col justify-center">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-farm-leaf">Delivery Areas</p>
            <h2 className="mt-2 text-3xl font-bold text-farm-green">Serving Lahore Routes</h2>
            <p className="mt-3 text-muted-foreground">
              The MVP demo includes active delivery routes from the current farm records.
            </p>
            <div className="mt-6 grid gap-2 sm:grid-cols-2">
              {deliveryAreas.slice(0, 10).map((area) => (
                <div key={area} className="flex items-center gap-2 rounded-md border bg-farm-cream p-3">
                  <MapPin className="h-4 w-4 text-farm-green" />
                  <span className="text-sm font-medium">{area}</span>
                </div>
              ))}
            </div>
            <div className="mt-6 flex items-center gap-2 rounded-md bg-secondary p-4">
              <CheckCircle2 className="h-5 w-5 text-farm-green" />
              <p className="text-sm font-semibold">
                Referral offer: 10% off monthly bill for nearby referred homes.
              </p>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-farm-green px-4 py-6 text-center text-sm text-white">
        Order on WhatsApp: 0339-5235323
      </footer>
    </main>
  );
}
