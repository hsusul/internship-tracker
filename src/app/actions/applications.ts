// src/app/actions/applications.ts
"use server";

import { prisma } from "@/lib/prisma";
import { MilestoneType } from "@/generated/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { authOptions } from "@/auth";
import { getServerSession } from "next-auth";

function parseOptionalDate(value: FormDataEntryValue | null): Date | null {
  const s = typeof value === "string" ? value.trim() : "";
  if (!s) return null;
  const d = new Date(s);
  return Number.isNaN(d.getTime()) ? null : d;
}

function getString(fd: FormData, key: string, required = false) {
  const v = fd.get(key);
  const s = typeof v === "string" ? v.trim() : "";
  if (required && !s) throw new Error(`${key} is required`);
  return s || null;
}

async function requireUserId(): Promise<string> {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email;
  if (!email) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true },
  });

  if (!user) redirect("/login");
  return user.id;
}

/** Create a new application + ensure APPLIED milestone exists */
export async function createApplication(formData: FormData) {
  const userId = await requireUserId();

  const company = getString(formData, "company", true)!;
  const role = getString(formData, "role", true)!;

  let link = getString(formData, "link");
  if (link && !/^https?:\/\//i.test(link)) link = `https://${link}`;

  const location = getString(formData, "location");
  const source = getString(formData, "source");
  const compensation = getString(formData, "compensation");

  const lastContact = parseOptionalDate(formData.get("lastContact"));
  const followUpAt = parseOptionalDate(formData.get("followUpAt"));

  await prisma.application.create({
    data: {
      userId,
      company,
      role,
      location: location ?? undefined,
      link: link ?? undefined,
      source: source ?? undefined,
      compensation: compensation ?? undefined,
      lastContact: lastContact ?? undefined,
      followUpAt: followUpAt ?? undefined,
      milestones: { create: [{ type: MilestoneType.APPLIED }] },
    },
  });

  revalidatePath("/dashboard");
  redirect("/dashboard");
}

export async function updateApplication(id: string, formData: FormData) {
  const userId = await requireUserId();
  if (!id) throw new Error("Missing id");

  const company = getString(formData, "company", true)!;
  const role = getString(formData, "role", true)!;

  let link = getString(formData, "link");
  if (link && !/^https?:\/\//i.test(link)) link = `https://${link}`;

  const location = getString(formData, "location");
  const source = getString(formData, "source");
  const compensation = getString(formData, "compensation");

  const lastContact = parseOptionalDate(formData.get("lastContact"));
  const followUpAt = parseOptionalDate(formData.get("followUpAt"));

  const app = await prisma.application.findFirst({
    where: { id, userId },
    select: { id: true },
  });
  if (!app) throw new Error("Not found");

  await prisma.application.update({
    where: { id },
    data: {
      company,
      role,
      location: location ?? null,
      link: link ?? null,
      source: source ?? null,
      compensation: compensation ?? null,
      lastContact,
      followUpAt,
    },
  });

  revalidatePath("/dashboard");
  revalidatePath(`/dashboard/applications/${id}`);
  redirect("/dashboard");
}

export async function deleteApplication(id: string) {
  const userId = await requireUserId();
  if (!id) throw new Error("Missing id");

  const app = await prisma.application.findFirst({
    where: { id, userId },
    select: { id: true },
  });
  if (!app) throw new Error("Not found");

  await prisma.application.delete({ where: { id } });
  revalidatePath("/dashboard");
}

export async function setMilestone(applicationId: string, type: MilestoneType) {
  const userId = await requireUserId();

  const app = await prisma.application.findFirst({
    where: { id: applicationId, userId },
    select: { id: true },
  });
  if (!app) throw new Error("Not found");

  const conflictsByType: Partial<Record<MilestoneType, MilestoneType[]>> = {
    // REJECTED can clear end-states if you want (keep this)
    REJECTED: ["OFFER", "WITHDREW"],

    // OFFER and WITHDREW should NOT conflict with each other
    OFFER: ["REJECTED"],
    WITHDREW: ["REJECTED"],
  };

  const conflicts = conflictsByType[type] ?? [];

  await prisma.$transaction(async (tx) => {
    if (conflicts.length) {
      await tx.applicationMilestone.deleteMany({
        where: { applicationId, type: { in: conflicts } },
      });
    }

    await tx.applicationMilestone.upsert({
      where: { applicationId_type: { applicationId, type } },
      create: { applicationId, type },
      update: {},
    });
  });

  revalidatePath("/dashboard");
  revalidatePath(`/dashboard/applications/${applicationId}`);
}

export async function removeMilestone(applicationId: string, type: MilestoneType) {
  const userId = await requireUserId();

  const app = await prisma.application.findFirst({
    where: { id: applicationId, userId },
    select: { id: true },
  });
  if (!app) throw new Error("Not found");

  await prisma.applicationMilestone
    .delete({
      where: { applicationId_type: { applicationId, type } },
    })
    .catch(() => {});

  revalidatePath("/dashboard");
  revalidatePath(`/dashboard/applications/${applicationId}`);
}
