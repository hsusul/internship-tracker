import Link from "next/link";
import { createApplication } from "@/app/actions/applications";
import ApplicationForm from "@/components/ApplicationForm";

export default function NewApplicationPage() {
  return (
    <main className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">New application</h1>
          <p className="text-sm text-slate-600">Add a role you applied to.</p>
        </div>

        <Link
          href="/dashboard"
          className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm hover:bg-slate-50"
        >
          Back
        </Link>
      </div>

      <ApplicationForm action={createApplication} submitLabel="Create application" />
    </main>
  );
}
