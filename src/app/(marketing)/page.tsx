// src/app/(marketing)/page.tsx
import Link from "next/link";
import { authOptions } from "@/auth";
import { getServerSession } from "next-auth";

const features = [
  {
    title: "Multi-milestone tracking",
    desc: "Applied, OA, Interview, Offer, Rejected… toggle milestones per application.",
  },
  {
    title: "Follow-up tracking",
    desc: "Set a follow-up date and highlight apps that are due.",
  },
  {
    title: "Fast daily workflow",
    desc: "Keyboard-friendly UI and a simple dashboard you’ll actually use.",
  },
  {
    title: "Search + filters",
    desc: "Quickly find by company/role and filter views.",
  },
];

const faqs = [
  {
    q: "Where is the actual app?",
    a: "Your dashboard lives at /dashboard after login.",
  },
  {
    q: "Can an app have multiple stages at once?",
    a: "Yes — milestones are additive. “Applied” stays true even after interview/offer.",
  },
  {
    q: "What’s follow-up used for?",
    a: "It’s a reminder date so the dashboard can highlight items that need outreach.",
  },
];

export default async function MarketingPage() {
  const session = await getServerSession(authOptions);

  return (
    <main className="min-h-screen bg-white text-slate-900">

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-slate-50 to-white" />
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:py-20 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-600 shadow-sm">
              Clean tracking • Milestones • Follow-ups
            </p>

            <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
              Stay on top of internship apps without spreadsheets
            </h1>

            <p className="mt-4 max-w-xl text-base text-slate-600 sm:text-lg">
              Track every application, add milestones (Applied → OA → Interview → Offer),
              and set follow-ups so nothing slips.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-5 py-3 text-sm font-medium text-white shadow-sm hover:bg-slate-800"
              >
                Open Dashboard
              </Link>

              {!session ? (
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-medium shadow-sm hover:bg-slate-50"
                >
                  Login
                </Link>
              ) : (
                <span className="inline-flex items-center rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm text-slate-600">
                  You’re signed in
                </span>
              )}
            </div>

            <div className="mt-6 flex flex-wrap gap-2 text-xs text-slate-500">
              <span className="rounded-full bg-slate-50 px-2 py-1">Multi-stage</span>
              <span className="rounded-full bg-slate-50 px-2 py-1">Due highlighting</span>
              <span className="rounded-full bg-slate-50 px-2 py-1">Fast</span>
              <span className="rounded-full bg-slate-50 px-2 py-1">Minimal</span>
            </div>
          </div>

          {/* RIGHT CARD */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-slate-700">Preview</div>
                <div className="mt-1 text-xs text-slate-500">Your dashboard summary</div>
              </div>
              <div className="rounded-xl bg-slate-900 px-3 py-1.5 text-xs font-medium text-white">
                Live
              </div>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="text-xs text-slate-500">Total</div>
                <div className="mt-1 text-2xl font-semibold">38</div>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="text-xs text-slate-500">Interviews</div>
                <div className="mt-1 text-2xl font-semibold">4</div>
              </div>
            </div>

            <div className="mt-3 rounded-2xl border border-slate-200 bg-white p-4">
              <div className="text-xs text-slate-500">Next follow-up</div>
              <div className="mt-1 text-sm font-medium text-slate-800">
                Apple • Jan 22
              </div>
              <div className="mt-1 text-xs text-slate-500">
                Tip: your real dashboard lives at <span className="font-medium">/dashboard</span>.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-14">
          <h2 className="text-2xl font-semibold tracking-tight">Features</h2>
          <p className="mt-2 text-slate-600">
            Built for fast daily usage while recruiting.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {features.map((f) => (
              <div
                key={f.title}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="text-base font-semibold">{f.title}</div>
                <div className="mt-2 text-sm text-slate-600">{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="border-t border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-6xl px-4 py-14">
          <h2 className="text-2xl font-semibold tracking-tight">How it works</h2>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <Step
              n="1"
              title="Add app"
              desc="Company, role, link, source, compensation, follow-up."
            />
            <Step
              n="2"
              title="Toggle milestones"
              desc="Applied → OA → Interview → Offer… add/remove anytime."
            />
            <Step
              n="3"
              title="Follow up on time"
              desc="Dashboard highlights items that are due so you don’t forget."
            />
          </div>

          <div className="mt-8">
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-5 py-3 text-sm font-medium text-white shadow-sm hover:bg-slate-800"
            >
              Start using the dashboard
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-14">
          <h2 className="text-2xl font-semibold tracking-tight">FAQ</h2>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {faqs.map((f) => (
              <div
                key={f.q}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="font-semibold">{f.q}</div>
                <div className="mt-2 text-sm text-slate-600">{f.a}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-10 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm text-slate-600">
            © {new Date().getFullYear()} Internship Tracker. All rights reserved.
          </div>
          <div className="flex gap-5 text-sm text-slate-600">
            <a href="#features" className="hover:text-slate-900">Features</a>
            <a href="#how" className="hover:text-slate-900">How it works</a>
            {!session ? (
              <Link href="/login" className="hover:text-slate-900">Login</Link>
            ) : (
              <Link href="/dashboard" className="hover:text-slate-900">Open App</Link>
            )}
          </div>
        </div>
      </footer>
    </main>
  );
}

function Step({ n, title, desc }: { n: string; title: string; desc: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white">
        {n}
      </div>
      <div className="mt-3 text-base font-semibold">{title}</div>
      <div className="mt-2 text-sm text-slate-600">{desc}</div>
    </div>
  );
}
