"use client";

import { FormEvent, useState } from "react";

const genericError = "Unable to create rider account.";

export function AdminCreateRiderForm() {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccess(false);
    setPending(true);

    const form = event.currentTarget;
    const formData = new FormData(form);
    const response = await fetch("/api/admin/riders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name: String(formData.get("name") ?? ""),
        email: String(formData.get("email") ?? ""),
        phone: String(formData.get("phone") ?? ""),
        password: String(formData.get("password") ?? "")
      })
    });

    setPending(false);

    if (!response.ok) {
      setError(genericError);
      return;
    }

    form.reset();
    setSuccess(true);
  }

  return (
    <section className="admin-erp-reveal w-full rounded-3xl border border-farm-heritage/10 bg-white p-4 text-farm-ink shadow-soft-card sm:p-5">
      <h2 className="font-display text-xl font-bold text-farm-heritage">Create Rider Account</h2>
      <form onSubmit={handleSubmit} className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <div className="space-y-1.5">
          <label htmlFor="rider-name" className="block text-xs font-semibold text-[#4a2f1b]">
            Rider Name
          </label>
          <input
            id="rider-name"
            name="name"
            type="text"
            autoComplete="off"
            required
            className="w-full rounded-lg border border-[#d8c8aa] bg-white px-3 py-2 text-sm outline-none focus:border-[#8b5e34] focus:ring-2 focus:ring-[#8b5e34]/20"
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="rider-email" className="block text-xs font-semibold text-[#4a2f1b]">
            Email
          </label>
          <input
            id="rider-email"
            name="email"
            type="email"
            autoComplete="off"
            required
            className="w-full rounded-lg border border-[#d8c8aa] bg-white px-3 py-2 text-sm outline-none focus:border-[#8b5e34] focus:ring-2 focus:ring-[#8b5e34]/20"
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="rider-phone" className="block text-xs font-semibold text-[#4a2f1b]">
            Phone (optional)
          </label>
          <input
            id="rider-phone"
            name="phone"
            type="tel"
            autoComplete="off"
            className="w-full rounded-lg border border-[#d8c8aa] bg-white px-3 py-2 text-sm outline-none focus:border-[#8b5e34] focus:ring-2 focus:ring-[#8b5e34]/20"
          />
        </div>

        <div className="space-y-1.5">
          <label
            htmlFor="rider-password"
            className="block text-xs font-semibold text-[#4a2f1b]"
          >
            Temporary Password
          </label>
          <input
            id="rider-password"
            name="password"
            type="password"
            autoComplete="new-password"
            minLength={8}
            required
            className="w-full rounded-lg border border-[#d8c8aa] bg-white px-3 py-2 text-sm outline-none focus:border-[#8b5e34] focus:ring-2 focus:ring-[#8b5e34]/20"
          />
        </div>

        {error ? <p className="text-xs font-medium text-[#9f2f24] md:col-span-2 xl:col-span-4">{error}</p> : null}
        {success ? (
          <p className="text-xs font-medium text-[#2f6b3d] md:col-span-2 xl:col-span-4">
            Rider account created.
          </p>
        ) : null}

        <button
          type="submit"
          disabled={pending}
          className="min-h-10 w-full rounded-lg bg-[#5b351c] px-3 py-2 text-sm font-semibold text-white transition hover:bg-[#432715] disabled:cursor-not-allowed disabled:opacity-70 md:col-span-2 xl:col-span-4 xl:max-w-xs"
        >
          Create Rider
        </button>
      </form>
    </section>
  );
}
