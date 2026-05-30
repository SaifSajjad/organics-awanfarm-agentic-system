"use client";

import Image from "next/image";
import { AlertTriangle, CalendarDays, Check, ChevronLeft, GlassWater, MessageCircle, Minus, Plus, Truck, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { formatCurrency } from "@/lib/utils";

type ExtraMilkStatus = "idle" | "success" | "routeFinalized";
type MilkProductId = "cow" | "buffalo";
type DeliveryDateId = "tomorrow" | "next" | "later";

type ExtraMilkDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
  onContactSupport: () => void;
};

const products = [
  {
    id: "cow" as const,
    name: "Cow Milk",
    displayName: "Premium Cow Milk",
    rate: 330,
    description: "Pasteurized, farm fresh",
    image: "/brand/pure-farm-milk-square.png"
  },
  {
    id: "buffalo" as const,
    name: "Buffalo Milk",
    displayName: "Premium Buffalo Milk",
    rate: 430,
    description: "Rich, high-cream content",
    image: "/brand/premium-buffalo-milk-lahore.png"
  }
];

const deliveryDates = [
  { id: "tomorrow" as const, label: "Tomorrow", date: "31 May", note: "6:30 AM - 8:00 AM" },
  { id: "next" as const, label: "Next route", date: "01 Jun", note: "Available morning route" },
  { id: "later" as const, label: "Another date", date: "02 Jun", note: "Demo option" }
];

export function ExtraMilkDrawer({ isOpen, onClose, onContactSupport }: ExtraMilkDrawerProps) {
  const [selectedProduct, setSelectedProduct] = useState<MilkProductId>("cow");
  const [selectedDate, setSelectedDate] = useState<DeliveryDateId>("tomorrow");
  const [quantity, setQuantity] = useState(2);
  const [note, setNote] = useState("");
  const [status, setStatus] = useState<ExtraMilkStatus>("idle");

  const product = products.find((item) => item.id === selectedProduct) ?? products[0];
  const date = deliveryDates.find((item) => item.id === selectedDate) ?? deliveryDates[0];
  const estimatedCost = useMemo(() => product.rate * quantity, [product.rate, quantity]);

  useEffect(() => {
    if (!isOpen) return;

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) {
      setStatus("idle");
      setNote("");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  function confirmRequest() {
    if (selectedDate === "tomorrow" && quantity === 5) {
      setStatus("routeFinalized");
      return;
    }
    setStatus("success");
  }

  function closeAndReset() {
    setStatus("idle");
    onClose();
  }

  return (
    <div className="fixed inset-0 z-[80]" role="presentation">
      <button
        type="button"
        aria-label="Close extra milk request"
        className="absolute inset-0 bg-farm-heritage/35 backdrop-blur-[3px]"
        onClick={onClose}
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="extra-milk-title"
        className="customer-sheet customer-drawer-panel"
      >
        {status === "success" ? (
          <SuccessState
            product={product.name}
            quantity={quantity}
            date={date.label}
            cost={estimatedCost}
            onDone={closeAndReset}
            onRequestMore={() => setStatus("idle")}
          />
        ) : status === "routeFinalized" ? (
          <ErrorState
            onSelectAnotherDate={() => {
              setSelectedDate("next");
              setStatus("idle");
            }}
            onContactSupport={onContactSupport}
            onGoBack={() => setStatus("idle")}
          />
        ) : (
          <div className="flex h-full flex-col">
            <div className="flex items-start justify-between gap-4 border-b border-farm-heritage/10 p-6 sm:p-8">
              <div>
                <span className="inline-flex rounded-full bg-farm-gold/20 px-3 py-1 text-xs font-black uppercase tracking-[0.16em] text-farm-heritage">
                  Fasttrack
                </span>
                <h2 id="extra-milk-title" className="mt-5 font-display text-4xl font-bold text-farm-heritage">
                  Request Extra Milk
                </h2>
                <p className="mt-3 max-w-xl text-sm leading-6 text-farm-ink/70">
                  Add extra milk to an upcoming delivery without changing your regular subscription.
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close extra milk request"
                className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-farm-cream text-farm-heritage transition-colors hover:bg-farm-heritage hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 pb-32 sm:p-8">
              <section aria-labelledby="milk-product-title">
                <h3 id="milk-product-title" className="customer-step-label">
                  1. Select Product
                </h3>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {products.map((item) => {
                    const selected = item.id === selectedProduct;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setSelectedProduct(item.id)}
                        aria-pressed={selected}
                        className={`relative rounded-3xl border p-4 text-left transition-all hover:-translate-y-0.5 ${
                          selected
                            ? "border-farm-heritage bg-white shadow-soft-card"
                            : "border-farm-heritage/10 bg-white/70"
                        }`}
                      >
                        {selected ? (
                          <span className="absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-full bg-farm-heritage text-white">
                            <Check className="h-4 w-4" />
                          </span>
                        ) : null}
                        <div className="relative h-20 w-20 overflow-hidden rounded-2xl bg-farm-cream">
                          <Image src={item.image} alt={item.displayName} fill sizes="80px" className="object-cover" />
                        </div>
                        <p className="mt-4 text-lg font-black text-farm-heritage">{item.name}</p>
                        <p className="mt-1 text-sm text-farm-ink/70">{formatCurrency(item.rate)} / Liter</p>
                        <p className="mt-2 text-xs text-farm-ink/55">{item.description}</p>
                      </button>
                    );
                  })}
                </div>
              </section>

              <section className="mt-8" aria-labelledby="milk-quantity-title">
                <div className="flex items-center justify-between">
                  <h3 id="milk-quantity-title" className="customer-step-label">
                    2. Quantity
                  </h3>
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-farm-ink/50">Max 5 liters</p>
                </div>
                <div className="mt-4 flex items-center justify-between rounded-3xl bg-farm-cream p-4">
                  <button
                    type="button"
                    aria-label="Decrease extra milk quantity"
                    onClick={() => setQuantity((value) => Math.max(1, value - 1))}
                    className="grid h-14 w-14 place-items-center rounded-2xl border border-farm-heritage/10 bg-white text-farm-heritage"
                  >
                    <Minus className="h-5 w-5" />
                  </button>
                  <p key={quantity} className="animate-quantity-pop font-display text-3xl font-bold text-farm-heritage">
                    {quantity} Liters
                  </p>
                  <button
                    type="button"
                    aria-label="Increase extra milk quantity"
                    onClick={() => setQuantity((value) => Math.min(5, value + 1))}
                    className="grid h-14 w-14 place-items-center rounded-2xl bg-farm-heritage text-white shadow-soft-card"
                  >
                    <Plus className="h-5 w-5" />
                  </button>
                </div>
              </section>

              <section className="mt-8" aria-labelledby="milk-date-title">
                <h3 id="milk-date-title" className="customer-step-label">
                  3. Delivery Date
                </h3>
                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                  {deliveryDates.map((item) => {
                    const selected = item.id === selectedDate;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setSelectedDate(item.id)}
                        aria-pressed={selected}
                        className={`min-h-28 rounded-3xl border p-4 text-left transition-all ${
                          selected
                            ? "border-farm-heritage bg-white text-farm-heritage shadow-soft-card"
                            : "border-farm-heritage/10 bg-white/70 text-farm-ink/70"
                        }`}
                      >
                        <p className="text-sm font-bold">{item.label}</p>
                        <p className="mt-2 font-display text-2xl font-bold">{item.date}</p>
                        <p className="mt-2 text-xs">{item.note}</p>
                      </button>
                    );
                  })}
                </div>
              </section>

              <section className="mt-8" aria-labelledby="milk-note-title">
                <h3 id="milk-note-title" className="customer-step-label">
                  4. Optional Note
                </h3>
                <textarea
                  value={note}
                  onChange={(event) => setNote(event.target.value)}
                  placeholder="Example: Please leave with the morning delivery."
                  className="mt-4 min-h-24 w-full rounded-3xl border border-farm-heritage/10 bg-white px-4 py-3 text-sm text-farm-ink outline-none ring-farm-gold/40 transition focus:ring-2"
                />
              </section>
            </div>

            <div className="border-t border-farm-heritage/10 bg-white/95 p-4 backdrop-blur-xl sm:p-6">
              <div className="mb-4 flex items-center justify-between gap-4 rounded-2xl bg-farm-cream px-4 py-3">
                <span className="text-sm font-bold text-farm-ink/70">Estimated extra charge</span>
                <span className="font-display text-2xl font-bold text-farm-heritage">{formatCurrency(estimatedCost)}</span>
              </div>
              <button
                type="button"
                onClick={confirmRequest}
                className="customer-primary-cta"
              >
                <Truck className="h-5 w-5" />
                Confirm Extra Milk Request
              </button>
              <p className="mt-3 text-center text-xs text-farm-ink/50">
                Demo note: set quantity to 5L for tomorrow to preview the finalized-route error state.
              </p>
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}

type SuccessStateProps = {
  product: string;
  quantity: number;
  date: string;
  cost: number;
  onDone: () => void;
  onRequestMore: () => void;
};

function SuccessState({ product, quantity, date, cost, onDone, onRequestMore }: SuccessStateProps) {
  return (
    <div className="flex h-full flex-col overflow-y-auto p-6 sm:p-8" aria-live="polite">
      <div className="mx-auto mt-8 grid h-24 w-24 place-items-center rounded-full bg-farm-success/20">
        <div className="customer-success-check grid h-16 w-16 place-items-center rounded-full bg-farm-success text-white">
          <Check className="h-8 w-8" />
        </div>
      </div>
      <div className="mt-8 text-center">
        <h2 className="font-display text-4xl font-bold text-farm-heritage">Extra Milk Request Confirmed</h2>
        <p className="mx-auto mt-4 max-w-md text-base leading-7 text-farm-ink/70">
          Your extra milk request has been added to the selected morning delivery.
        </p>
      </div>
      <div className="mt-8 rounded-3xl border border-farm-heritage/10 bg-white p-5 shadow-soft-card">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="grid h-14 w-14 place-items-center rounded-2xl bg-farm-cream text-farm-heritage">
              <GlassWater className="h-6 w-6" />
            </span>
            <div>
              <p className="font-bold text-farm-heritage">
                {quantity}L {product}
              </p>
              <p className="text-sm text-farm-ink/60">Premium quality</p>
            </div>
          </div>
          <p className="font-display text-2xl font-bold text-farm-heritage">{formatCurrency(cost)}</p>
        </div>
        <div className="mt-5 grid gap-4 border-t border-farm-heritage/10 pt-5 sm:grid-cols-2">
          <p className="flex items-center gap-2 text-sm font-bold text-farm-heritage">
            <CalendarDays className="h-4 w-4 text-farm-gold" />
            Delivery: {date}
          </p>
          <p className="flex items-center gap-2 text-sm font-bold text-farm-heritage">
            <Truck className="h-4 w-4 text-farm-gold" />
            Route: Model Town
          </p>
        </div>
      </div>
      <div className="mt-auto grid gap-3 pt-8">
        <button type="button" onClick={onDone} className="customer-primary-cta justify-center">
          Done
        </button>
        <button
          type="button"
          onClick={onRequestMore}
          className="min-h-14 rounded-2xl border border-farm-heritage/20 bg-white px-5 font-bold text-farm-heritage"
        >
          Request More Milk
        </button>
        <button
          type="button"
          onClick={onDone}
          className="min-h-14 rounded-2xl bg-farm-cream px-5 font-bold text-farm-heritage"
        >
          View Delivery Details
        </button>
      </div>
    </div>
  );
}

type ErrorStateProps = {
  onSelectAnotherDate: () => void;
  onContactSupport: () => void;
  onGoBack: () => void;
};

function ErrorState({ onSelectAnotherDate, onContactSupport, onGoBack }: ErrorStateProps) {
  return (
    <div className="flex h-full flex-col items-center justify-center overflow-y-auto p-6 text-center sm:p-8" aria-live="assertive">
      <div className="grid h-20 w-20 place-items-center rounded-full bg-red-100 text-red-700">
        <AlertTriangle className="h-9 w-9" />
      </div>
      <h2 className="mt-8 font-display text-5xl font-bold text-farm-heritage">Route Finalized</h2>
      <p className="mt-5 max-w-md text-lg leading-8 text-farm-ink/70">
        Tomorrow&apos;s route is already finalized. Please select another delivery date.
      </p>
      <div className="mt-10 grid w-full max-w-md gap-3">
        <button type="button" onClick={onSelectAnotherDate} className="customer-primary-cta justify-center">
          Select Another Date
        </button>
        <button
          type="button"
          onClick={onContactSupport}
          className="flex min-h-14 items-center justify-center gap-2 rounded-2xl border border-farm-heritage/20 bg-white px-5 font-bold text-farm-heritage"
        >
          <MessageCircle className="h-5 w-5" />
          Contact Support
        </button>
        <button
          type="button"
          onClick={onGoBack}
          className="flex min-h-14 items-center justify-center gap-2 rounded-2xl bg-farm-cream px-5 font-bold text-farm-heritage"
        >
          <ChevronLeft className="h-5 w-5" />
          Go Back
        </button>
      </div>
    </div>
  );
}
