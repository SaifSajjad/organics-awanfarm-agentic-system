"use client";

import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

const genericError = "Unable to create account. Check your details and try again.";

export function CustomerSignupForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setPending(true);

    const formData = new FormData(event.currentTarget);
    const password = String(formData.get("password") ?? "");
    const confirmPassword = String(formData.get("confirmPassword") ?? "");

    if (password !== confirmPassword) {
      setPending(false);
      setError(genericError);
      return;
    }

    const email = String(formData.get("email") ?? "");
    const response = await fetch("/api/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name: String(formData.get("name") ?? ""),
        email,
        phone: String(formData.get("phone") ?? ""),
        password
      })
    });

    if (!response.ok) {
      setPending(false);
      setError(genericError);
      return;
    }

    const signInResult = await signIn("credentials", {
      email,
      password,
      redirect: false
    });

    if (signInResult?.error) {
      router.replace("/login");
      return;
    }

    router.replace("/dashboard/customer");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-2">
        <label htmlFor="name" className="block text-sm font-semibold text-[#4a2f1b]">
          Full Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          autoComplete="name"
          required
          className="w-full rounded-lg border border-[#d8c8aa] bg-white px-4 py-3 text-sm text-[#2d1a0f] outline-none transition focus:border-[#8b5e34] focus:ring-2 focus:ring-[#8b5e34]/20"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="email" className="block text-sm font-semibold text-[#4a2f1b]">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          className="w-full rounded-lg border border-[#d8c8aa] bg-white px-4 py-3 text-sm text-[#2d1a0f] outline-none transition focus:border-[#8b5e34] focus:ring-2 focus:ring-[#8b5e34]/20"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="phone" className="block text-sm font-semibold text-[#4a2f1b]">
          Phone
        </label>
        <input
          id="phone"
          name="phone"
          type="tel"
          autoComplete="tel"
          required
          className="w-full rounded-lg border border-[#d8c8aa] bg-white px-4 py-3 text-sm text-[#2d1a0f] outline-none transition focus:border-[#8b5e34] focus:ring-2 focus:ring-[#8b5e34]/20"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="password" className="block text-sm font-semibold text-[#4a2f1b]">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          minLength={8}
          required
          className="w-full rounded-lg border border-[#d8c8aa] bg-white px-4 py-3 text-sm text-[#2d1a0f] outline-none transition focus:border-[#8b5e34] focus:ring-2 focus:ring-[#8b5e34]/20"
        />
      </div>

      <div className="space-y-2">
        <label
          htmlFor="confirmPassword"
          className="block text-sm font-semibold text-[#4a2f1b]"
        >
          Confirm Password
        </label>
        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          minLength={8}
          required
          className="w-full rounded-lg border border-[#d8c8aa] bg-white px-4 py-3 text-sm text-[#2d1a0f] outline-none transition focus:border-[#8b5e34] focus:ring-2 focus:ring-[#8b5e34]/20"
        />
      </div>

      {error ? <p className="text-sm font-medium text-[#9f2f24]">{error}</p> : null}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-lg bg-[#5b351c] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#432715] disabled:cursor-not-allowed disabled:opacity-70"
      >
        Create Account
      </button>

      <p className="text-center text-sm text-[#6f5a45]">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-[#5b351c] hover:underline">
          Sign in
        </Link>
      </p>
    </form>
  );
}
