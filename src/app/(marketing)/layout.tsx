import Link from "next/link";
import { authOptions } from "@/auth";
import { getServerSession } from "next-auth";
import SignOutButton from "@/components/SignOutButton";

export const dynamic = "force-dynamic";

export default async function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  return (
    <>
      <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link href="/" className="text-lg font-semibold tracking-tight">
            Internship Tracker
          </Link>

          <nav className="hidden items-center gap-6 text-sm text-slate-600 sm:flex">
            <a href="#features" className="hover:text-slate-900">
              Features
            </a>
            <a href="#how" className="hover:text-slate-900">
              How it works
            </a>
            <a href="#faq" className="hover:text-slate-900">
              FAQ
            </a>
          </nav>

          <div className="flex items-center gap-2">
            {!session ? (
              <>
                <Link
                  href="/login"
                  className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium shadow-sm hover:bg-slate-50"
                >
                  Login
                </Link>
                <Link
                  href="/dashboard"
                  className="rounded-xl bg-slate-900 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-slate-800"
                >
                  Open App
                </Link>
              </>
            ) : (
              <>
                <span className="hidden text-sm text-slate-600 sm:inline">
                  {session.user?.name ?? session.user?.email ?? "Signed in"}
                </span>
                <Link
                  href="/dashboard"
                  className="rounded-xl bg-slate-900 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-slate-800"
                >
                  Open App
                </Link>
                <SignOutButton />
              </>
            )}
          </div>
        </div>
      </header>

      {children}
    </>
  );
}
