// src/auth.ts
import type { NextAuthOptions, Session, User } from "next-auth";
import type { JWT } from "next-auth/jwt";

import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

/**
 * Put these OUTSIDE authOptions (types cannot be declared inside object literals)
 */
type TokenWithUserId = JWT & { userId?: string };
type SessionWithUserId = Session & {
  user?: Session["user"] & { id?: string };
};

export const authOptions: NextAuthOptions = {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    Credentials({
      name: "Email and Password",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        const email = (credentials?.email ?? "").trim().toLowerCase();
        const password = credentials?.password ?? "";

        if (!email || !password) return null;

        const user = await prisma.user.findUnique({
          where: { email },
          select: { id: true, email: true, name: true, passwordHash: true },
        });

        if (!user?.passwordHash) return null;

        const ok = await bcrypt.compare(password, user.passwordHash);
        if (!ok) return null;

        // Must include id for NextAuth
        return {
          id: user.id,
          email: user.email,
          name: user.name ?? undefined,
        };
      },
    }),
  ],

  session: { strategy: "jwt" },
  pages: { signIn: "/login" },

  // Keep this (important in prod)
  secret: process.env.NEXTAUTH_SECRET,

  callbacks: {
    async jwt({ token, user }: { token: JWT; user?: User }) {
      const t = token as TokenWithUserId;

      // `user` exists at sign-in time; it should include id for both Google + Credentials
      if (user && "id" in user) {
        t.userId = (user as User & { id: string }).id;
      }

      return t;
    },

    async session({ session, token }: { session: Session; token: JWT }) {
      const s = session as SessionWithUserId;
      const t = token as TokenWithUserId;

      if (s.user && t.userId) {
        s.user.id = t.userId;
      }

      return s;
    },
  },
};
