// scripts/dedupeMilestones.ts
import { PrismaClient } from "../src/generated/prisma";

const prisma = new PrismaClient();

async function main() {
  // ✅ If your Prisma model is named `Milestone`, keep this:
  const all = await prisma.applicationMilestone.findMany({
    orderBy: { createdAt: "desc" }, // newest first
  });

  // Keep newest per (applicationId, type)
  const seen = new Set<string>();
  const toDelete: string[] = [];

  for (const m of all) {
    const key = `${m.applicationId}:${m.type}`;
    if (seen.has(key)) toDelete.push(m.id);
    else seen.add(key);
  }

  if (toDelete.length) {
    await prisma.applicationMilestone.deleteMany({
      where: { id: { in: toDelete } },
    });
  }

  console.log(`Deleted ${toDelete.length} duplicate milestones`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
