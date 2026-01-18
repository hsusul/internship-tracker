import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";

import LoginCard from "@/components/LoginCard";
import EmailAuthCard from "@/components/EmailAuthCard";

export default async function LoginPage() {
  const session = await getServerSession(authOptions);
  if (session) redirect("/dashboard");

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      {/* top bar */}
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <div className="font-semibold">Internship Tracker</div>
          <Link href="/" className="text-sm text-slate-600 hover:text-slate-900">
            ← Back to home
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-2xl px-4 py-14">
        <div className="flex flex-col items-center text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-sm">
            IT
          </div>
          <h1 className="mt-6 text-3xl font-semibold tracking-tight">
            Sign in to continue
          </h1>
          <p className="mt-2 text-slate-600">
            Access your dashboard to track applications, milestones, and follow-ups.
          </p>
          <p className="mt-4 text-xs text-slate-500">
            Signing in may take a few seconds on first load (dev + cold start).
          </p>
        </div>

        <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="text-sm font-semibold text-slate-900">Continue with Google</div>
          <div className="mt-1 text-sm text-slate-600">
            We’ll create an account tied to your Google email.
          </div>

          <div className="mt-4">
            <LoginCard />
          </div>

          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-slate-200" />
            <div className="text-xs text-slate-500">or</div>
            <div className="h-px flex-1 bg-slate-200" />
          </div>

          {/* Email + password sign in / create account */}
          <EmailAuthCard />

          <div className="mt-4 text-xs text-slate-500">
            By signing in, you agree to store your applications in your account.
          </div>
        </div>

        <div className="mt-10 text-center">
          <Link href="/" className="text-sm text-slate-600 hover:text-slate-900">
            ← Back to home
          </Link>
        </div>
      </div>
    </main>
  );
}
