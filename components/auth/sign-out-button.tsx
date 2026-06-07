"use client";

import { signOut } from "next-auth/react";

export function SignOutButton() {
  return (
    <button
      type="button"
      onClick={() => signOut({ callbackUrl: "/login" })}
      className="rounded-lg border border-[#d8c8aa] bg-white/90 px-3 py-2 text-xs font-semibold text-[#4a2f1b] shadow-sm transition hover:border-[#8b5e34] hover:text-[#2d1a0f]"
    >
      Sign out
    </button>
  );
}
