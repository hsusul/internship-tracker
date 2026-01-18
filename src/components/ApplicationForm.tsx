// src/components/ApplicationForm.tsx
import React from "react";
import { MilestoneType } from "@/generated/prisma";

type Props = {
  defaultValues?: {
    company?: string | null;
    role?: string | null;
    location?: string | null;
    link?: string | null;
    source?: string | null;
    compensation?: string | null;

    // milestone-based (replaces status)
    milestone?: MilestoneType | null;

    lastContact?: Date | null;
    followUpAt?: Date | null;
  };
  action: (formData: FormData) => void;
  submitLabel: string;
};

function toDateInput(d?: Date | null) {
  if (!d) return "";
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function Field({
  label,
  children,
  hint,
}: {
  label: string;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <label className="space-y-1">
      <div className="text-sm font-medium text-slate-700">{label}</div>
      {children}
      {hint ? <div className="text-xs text-slate-500">{hint}</div> : null}
    </label>
  );
}

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-4 focus:ring-slate-200";

export default function ApplicationForm({ defaultValues, action, submitLabel }: Props) {
  return (
    <form action={action} className="space-y-5">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Field label="Company *">
            <input
              name="company"
              defaultValue={defaultValues?.company ?? ""}
              className={inputClass}
              required
            />
          </Field>

          <Field label="Role *">
            <input
              name="role"
              defaultValue={defaultValues?.role ?? ""}
              className={inputClass}
              required
            />
          </Field>

          <Field label="Location">
            <input
              name="location"
              defaultValue={defaultValues?.location ?? ""}
              className={inputClass}
            />
          </Field>

          {/* Milestone selector (optional) */}
          <Field label="Milestone (optional)" hint="Adds a milestone on save (you can also manage milestones from the table).">
            <select
              name="milestone"
              defaultValue={(defaultValues?.milestone ?? "") as any}
              className={inputClass}
            >
              <option value="">None</option>
              {Object.values(MilestoneType).map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Link" hint="Job posting URL, Greenhouse, Workday, etc.">
            <input
              type="url"
              name="link"
              defaultValue={defaultValues?.link ?? ""}
              className={inputClass}
              placeholder="https://..."
            />
          </Field>

          <Field label="Source" hint="LinkedIn, referral, company site…">
            <input
              name="source"
              defaultValue={defaultValues?.source ?? ""}
              className={inputClass}
            />
          </Field>

          <Field label="Compensation" hint="Optional, e.g. $30/hr or $6k/mo">
            <input
              name="compensation"
              defaultValue={defaultValues?.compensation ?? ""}
              className={inputClass}
            />
          </Field>

          <Field label="Last contact">
            <input
              type="date"
              name="lastContact"
              defaultValue={toDateInput(defaultValues?.lastContact)}
              className={inputClass}
            />
          </Field>

          <Field label="Follow-up date" hint="Highlights on dashboard when due.">
            <input
              type="date"
              name="followUpAt"
              defaultValue={toDateInput(defaultValues?.followUpAt)}
              className={inputClass}
            />
          </Field>
        </div>

        <div className="mt-6 flex items-center gap-3">
          <button
            type="submit"
            className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-slate-800"
          >
            {submitLabel}
          </button>

          <div className="text-xs text-slate-500">
            Tip: set a follow-up date so it shows up as due on the dashboard.
          </div>
        </div>
      </div>
    </form>
  );
}
