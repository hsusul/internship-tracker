// src/components/LoginCard.tsx
"use client";

import { signIn } from "next-auth/react";

export default function LoginCard() {
  return (
    <button
      type="button"
      onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
      className="inline-flex w-full items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-slate-900 shadow-sm hover:bg-slate-50 active:scale-[0.99]"
    >
      {/* simple “G” mark (no extra deps) */}
      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-xs font-bold">
        G
      </span>
      Continue with Google
    </button>
  );
}
