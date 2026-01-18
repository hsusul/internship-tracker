import Link from "next/link";
import { prisma } from "@/lib/prisma";
import ApplicationTable from "@/components/ApplicationTable";
import { MilestoneType } from "@/generated/prisma";
import { authOptions } from "@/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="text-sm text-slate-500">{label}</div>
      <div className="mt-1 text-2xl font-semibold tracking-tight">{value}</div>
    </div>
  );
}

function isMilestoneType(v: unknown): v is MilestoneType {
  return typeof v === "string" && (Object.values(MilestoneType) as string[]).includes(v);
}

export default async function Page({
  searchParams,
}: {
  searchParams?: { q?: string; milestone?: string };
}) {
  // ✅ require auth
  const session = await getServerSession(authOptions);
  const email = session?.user?.email;
  if (!email) redirect("/login");

  // ✅ ensure a User row exists (prevents “redirect loop” when user isn't in DB yet)
  const user = await prisma.user.upsert({
    where: { email },
    update: {
      name: session?.user?.name ?? undefined,
      image: session?.user?.image ?? undefined,
    },
    create: {
      email,
      name: session?.user?.name ?? null,
      image: session?.user?.image ?? null,
    },
    select: { id: true },
  });

  const q = (searchParams?.q ?? "").trim();
  const milestoneRaw = searchParams?.milestone;

  const milestone: MilestoneType | undefined = isMilestoneType(milestoneRaw)
    ? (milestoneRaw as MilestoneType)
    : undefined;

  const where = {
    userId: user.id, // ✅ only show this user's apps
    ...(milestone ? { milestones: { some: { type: milestone } } } : {}),
    ...(q
      ? {
          OR: [
            { company: { contains: q, mode: "insensitive" } },
            { role: { contains: q, mode: "insensitive" } },
          ],
        }
      : {}),
  };

  const [apps, total, applied, interviews, offers] = await Promise.all([
    prisma.application.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: { milestones: true },
    }),
    prisma.application.count({ where }),
    prisma.application.count({
      where: { ...where, milestones: { some: { type: MilestoneType.APPLIED } } },
    }),
    prisma.application.count({
      where: { ...where, milestones: { some: { type: MilestoneType.INTERVIEW } } },
    }),
    prisma.application.count({
      where: { ...where, milestones: { some: { type: MilestoneType.OFFER } } },
    }),
  ]);

  return (
    <main className="space-y-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Internship Tracker</h1>
          <p className="mt-1 text-sm text-slate-600">
            Clean tracking for apps, interviews, offers, and follow-ups.
          </p>
        </div>

        <Link
          href="/dashboard/applications/new"
          className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-slate-800"
        >
          + New application
        </Link>
      </header>

      <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard label="Total" value={total} />
        <StatCard label="Applied" value={applied} />
        <StatCard label="Interviews" value={interviews} />
        <StatCard label="Offers" value={offers} />
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <form className="flex flex-col gap-3 sm:flex-row sm:items-end" action="/dashboard" method="get">
          <label className="flex-1 space-y-1">
            <div className="text-sm font-medium text-slate-700">Search</div>
            <input
              name="q"
              defaultValue={q}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-4 focus:ring-slate-200"
              placeholder="Company or role"
            />
          </label>

          <label className="space-y-1">
            <div className="text-sm font-medium text-slate-700">Milestone</div>
            <select
              name="milestone"
              defaultValue={milestone ?? ""}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-4 focus:ring-slate-200 sm:w-56"
            >
              <option value="">All</option>
              {Object.values(MilestoneType).map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </label>

          <div className="flex gap-2">
            <button
              type="submit"
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm shadow-sm hover:bg-slate-50"
            >
              Filter
            </button>
            <Link
              href="/dashboard"
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm shadow-sm hover:bg-slate-50"
            >
              Reset
            </Link>
          </div>
        </form>
      </section>

      <ApplicationTable apps={apps} />
    </main>
  );
}
