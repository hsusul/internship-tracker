"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { signupWithEmail } from "@/app/actions/auth";

export default function EmailAuthCard() {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const fd = new FormData(e.currentTarget);
    const email = String(fd.get("email") ?? "");
    const password = String(fd.get("password") ?? "");

    try {
      if (mode === "signup") {
        await signupWithEmail(fd);
      }

      const res = await signIn("credentials", {
        email,
        password,
        redirect: true,
        callbackUrl: "/dashboard",
      });

      if (res?.error) setError("Invalid email or password");
    } catch (err: any) {
      setError(err?.message ?? "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="text-sm font-semibold text-slate-900">
          {mode === "signup" ? "Create account" : "Sign in with email"}
        </div>
        <button
          type="button"
          onClick={() => setMode(mode === "signup" ? "signin" : "signup")}
          className="text-xs text-slate-600 underline hover:text-slate-900"
        >
          {mode === "signup" ? "Have an account? Sign in" : "New? Create account"}
        </button>
      </div>

      <form onSubmit={onSubmit} className="mt-4 space-y-3">
        {mode === "signup" ? (
          <label className="block">
            <div className="text-xs font-medium text-slate-700">Name (optional)</div>
            <input
              name="name"
              className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-4 focus:ring-slate-200"
              placeholder="Henry Su"
            />
          </label>
        ) : null}

        <label className="block">
          <div className="text-xs font-medium text-slate-700">Email</div>
          <input
            name="email"
            type="email"
            required
            className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-4 focus:ring-slate-200"
            placeholder="you@example.com"
          />
        </label>

        <label className="block">
          <div className="text-xs font-medium text-slate-700">Password</div>
          <input
            name="password"
            type="password"
            required
            className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-4 focus:ring-slate-200"
            placeholder="At least 8 characters"
          />
        </label>

        {error ? (
          <div className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">
            {error}
          </div>
        ) : null}

        <button
          disabled={loading}
          className="w-full rounded-2xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-slate-800 disabled:opacity-60"
        >
          {loading ? "Loading..." : mode === "signup" ? "Create account" : "Sign in"}
        </button>
      </form>
    </div>
  );
}
