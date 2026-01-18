// src/components/ApplicationTable.tsx
import Link from "next/link";
import {
  Application,
  ApplicationMilestone,
  MilestoneType,
} from "@/generated/prisma";
import {
  deleteApplication,
  setMilestone,
  removeMilestone,
} from "@/app/actions/applications";

type AppWithMilestones = Application & { milestones: ApplicationMilestone[] };

function pillClasses(t: MilestoneType) {
  switch (t) {
    case "OFFER":
      return "border-emerald-200 bg-emerald-50 text-emerald-800";
    case "INTERVIEW":
      return "border-sky-200 bg-sky-50 text-sky-800";
    case "OA":
      return "border-violet-200 bg-violet-50 text-violet-800";
    case "REJECTED":
      return "border-rose-200 bg-rose-50 text-rose-800";
    case "WITHDREW":
      return "border-slate-200 bg-slate-50 text-slate-700";
    case "APPLIED":
    default:
      return "border-amber-200 bg-amber-50 text-amber-800";
  }
}

function deriveStage(types: Set<MilestoneType>): MilestoneType {
  if (types.has("REJECTED")) return "REJECTED";
  if (types.has("WITHDREW")) return "WITHDREW";
  if (types.has("OFFER")) return "OFFER";
  if (types.has("INTERVIEW")) return "INTERVIEW";
  if (types.has("OA")) return "OA";
  return "APPLIED";
}

function isFollowUpDue(d: Date | null) {
  if (!d) return false;
  const today = new Date();
  const due = new Date(d);
  today.setHours(0, 0, 0, 0);
  due.setHours(0, 0, 0, 0);
  return due <= today;
}

function normalizeUrl(raw: string) {
  const s = raw.trim();
  if (!s) return null;
  if (s.startsWith("http://") || s.startsWith("https://")) return s;
  return `https://${s}`;
}

function RemovablePill({ appId, type }: { appId: string; type: MilestoneType }) {
  return (
    <form action={removeMilestone.bind(null, appId, type)} className="group inline-flex">
      <span
        className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs ${pillClasses(
          type
        )}`}
      >
        {type}
        <button
          type="submit"
          aria-label={`Remove ${type}`}
          title="Remove"
          className="ml-1 inline-flex h-4 w-4 items-center justify-center rounded-full text-[11px] leading-none
                     text-slate-500 opacity-0 pointer-events-none
                     group-hover:opacity-100 group-hover:pointer-events-auto
                     hover:text-slate-900"
        >
          ×
        </button>
      </span>
    </form>
  );
}

export default function ApplicationTable({ apps }: { apps: AppWithMilestones[] }) {
  const ordered: MilestoneType[] = [
    "APPLIED",
    "OA",
    "INTERVIEW",
    "OFFER",
    "REJECTED",
    "WITHDREW",
  ];

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between p-4">
        <div>
          <h2 className="text-lg font-semibold tracking-tight">Applications</h2>
          <p className="text-sm text-slate-600">{apps.length} shown</p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50 text-slate-700">
            <tr className="text-left">
              <th className="px-4 py-3 font-medium">Company</th>
              <th className="px-4 py-3 font-medium">Role</th>
              <th className="px-4 py-3 font-medium">Milestones</th>
              <th className="px-4 py-3 font-medium">Source</th>
              <th className="px-4 py-3 font-medium">Comp</th>
              <th className="px-4 py-3 font-medium">Follow-up</th>
              <th className="px-4 py-3 text-right font-medium">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {apps.map((a) => {
              const due = isFollowUpDue(a.followUpAt);

              const typeSet = new Set(
                a.milestones.map((m) => m.type as MilestoneType)
              );
              const stage = deriveStage(typeSet);

              // stage is removable if it's present and not APPLIED
              const stageIsRemovable = stage !== "APPLIED" && typeSet.has(stage);

              // show other pills besides stage
              const extras = ordered.filter((t) => typeSet.has(t) && t !== stage);

              const href = a.link ? normalizeUrl(a.link) : null;

              return (
                <tr
                  key={a.id}
                  className={due ? "bg-amber-50/30" : "hover:bg-slate-50/40"}
                >
                  <td className="px-4 py-3 font-medium">{a.company}</td>
                  <td className="px-4 py-3 text-slate-700">{a.role}</td>

                  <td className="px-4 py-3">
                    <div className="flex flex-wrap items-center gap-2">
                      {/* stage pill */}
                      {stageIsRemovable ? (
                        <RemovablePill appId={a.id} type={stage} />
                      ) : (
                        <span
                          className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${pillClasses(
                            stage
                          )}`}
                          title="Current stage (derived)"
                        >
                          {stage}
                        </span>
                      )}

                      {/* extra milestones */}
                      {extras.length ? (
                        <div className="flex flex-wrap items-center gap-2">
                          {extras.map((t) => (
                            <RemovablePill key={t} appId={a.id} type={t} />
                          ))}
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400">—</span>
                      )}

                      {/* add milestone */}
                      <form
                        className="flex items-center gap-2"
                        action={async (fd) => {
                          "use server";
                          const t = fd.get("milestone") as MilestoneType;
                          if (!t) return;
                          await setMilestone(a.id, t);
                        }}
                      >
                        <select
                          name="milestone"
                          defaultValue=""
                          className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs outline-none focus:ring-4 focus:ring-slate-200"
                        >
                          <option value="" disabled>
                            + Add
                          </option>
                          {Object.values(MilestoneType).map((t) => (
                            <option key={t} value={t}>
                              {t}
                            </option>
                          ))}
                        </select>
                        <button
                          type="submit"
                          className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs hover:bg-slate-50"
                        >
                          Save
                        </button>
                      </form>
                    </div>
                  </td>

                  <td className="px-4 py-3 text-slate-700">
                    {a.source ?? <span className="text-slate-400">—</span>}
                  </td>

                  <td className="px-4 py-3 text-slate-700">
                    {a.compensation ?? <span className="text-slate-400">—</span>}
                  </td>

                  <td className="px-4 py-3">
                    {a.followUpAt ? (
                      <span className={due ? "font-medium text-amber-800" : "text-slate-700"}>
                        {new Date(a.followUpAt).toLocaleDateString()}
                        {due ? " (due)" : ""}
                      </span>
                    ) : (
                      <span className="text-slate-400">—</span>
                    )}
                  </td>

                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-3">
                      {href ? (
                        <a
                          className="text-sm text-slate-700 underline decoration-slate-300 hover:text-slate-900"
                          href={href}
                          target="_blank"
                          rel="noreferrer"
                        >
                          Link
                        </a>
                      ) : null}

                      <Link
                        className="text-sm text-slate-700 underline decoration-slate-300 hover:text-slate-900"
                        href={`/dashboard/applications/${a.id}`}
                      >
                        Edit
                      </Link>

                      <form action={deleteApplication.bind(null, a.id)}>
                        <button className="text-sm text-rose-700 underline decoration-rose-200 hover:text-rose-800">
                          Delete
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              );
            })}

            {apps.length === 0 ? (
              <tr>
                <td className="px-4 py-10 text-center text-slate-500" colSpan={7}>
                  No applications yet. Click{" "}
                  <span className="font-medium">New application</span> to add one.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </section>
  );
}
