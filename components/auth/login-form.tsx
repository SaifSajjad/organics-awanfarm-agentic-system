"use client";

import { signIn, getSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";

function getDashboardPathForRole(role: string | null | undefined): string | null {
  switch (role?.trim().toUpperCase()) {
    case "RIDER":
      return "/dashboard/rider";
    case "ADMIN":
      return "/dashboard/admin";
    case "CUSTOMER":
      return "/dashboard/customer";
    default:
      return null;
  }
}

function getSafeCallbackUrl(value: string | null): string | null {
  if (!value || !value.startsWith("/") || value.startsWith("//") || value.includes("\\")) {
    return null;
  }

  return value;
}

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState(false);
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(false);
    setPending(true);

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "");
    const password = String(formData.get("password") ?? "");
    const callbackUrl = getSafeCallbackUrl(searchParams.get("callbackUrl"));

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false
    });

    if (result?.error) {
      setPending(false);
      setError(true);
      return;
    }

    if (callbackUrl) {
      router.replace(callbackUrl);
      router.refresh();
      return;
    }

    const session = await getSession();
    const dashboardPath = getDashboardPathForRole(session?.user?.role);

    if (!dashboardPath) {
      setPending(false);
      setError(true);
      return;
    }

    router.replace(dashboardPath);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
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
        <label htmlFor="password" className="block text-sm font-semibold text-[#4a2f1b]">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="w-full rounded-lg border border-[#d8c8aa] bg-white px-4 py-3 text-sm text-[#2d1a0f] outline-none transition focus:border-[#8b5e34] focus:ring-2 focus:ring-[#8b5e34]/20"
        />
      </div>

      {error ? (
        <p className="text-sm font-medium text-[#9f2f24]">
          Unable to sign in. Check your credentials and try again.
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-lg bg-[#5b351c] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#432715] disabled:cursor-not-allowed disabled:opacity-70"
      >
        Sign In
      </button>
    </form>
  );
}
