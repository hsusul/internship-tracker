"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function signupWithEmail(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const name = String(formData.get("name") ?? "").trim() || null;

  if (!email || !email.includes("@")) throw new Error("Enter a valid email");
  if (password.length < 8) throw new Error("Password must be at least 8 characters");

  const existing = await prisma.user.findUnique({
    where: { email },
    select: { id: true },
  });
  if (existing) throw new Error("Email already in use");

  const passwordHash = await bcrypt.hash(password, 12);

  await prisma.user.create({
    data: { email, name, passwordHash },
  });
}
