// src/app/applications/[id]/page.tsx
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ApplicationForm from "@/components/ApplicationForm";
import { updateApplication } from "@/app/actions/applications";

export default async function EditApplicationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (!id) return notFound();

  const app = await prisma.application.findUnique({ where: { id } });
  if (!app) return notFound();

  return (
    <main className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Edit application</h1>
          <p className="text-sm text-slate-600">
            Update details for <span className="font-medium">{app.company}</span>
          </p>
        </div>

        <Link
          href="/"
          className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm hover:bg-slate-50"
        >
          Back
        </Link>
      </div>

      <ApplicationForm
        defaultValues={{
          company: app.company,
          role: app.role,
          location: app.location,
          link: app.link,
          source: app.source,
          compensation: app.compensation,
          lastContact: app.lastContact,
          followUpAt: app.followUpAt,
        }}
        action={updateApplication.bind(null, id)}
        submitLabel="Save changes"
      />
    </main>
  );
}
