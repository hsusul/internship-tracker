"use server";

import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

function getRequired(fd: FormData, key: string) {
  const v = fd.get(key);
  const s = typeof v === "string" ? v.trim() : "";
  if (!s) throw new Error(`${key} is required`);
  return s;
}

export async function signup(fd: FormData) {
  const email = getRequired(fd, "email").toLowerCase();
  const password = getRequired(fd, "password");
  const name = (fd.get("name")?.toString().trim() || null);

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) throw new Error("Email already in use");

  const passwordHash = await bcrypt.hash(password, 10);

  await prisma.user.create({
    data: { email, name, passwordHash },
  });

  redirect("/login");
}
