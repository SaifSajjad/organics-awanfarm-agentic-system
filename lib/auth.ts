import NextAuth, { type NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";

import { prisma } from "@/lib/prisma";
import { verifyPassword } from "@/lib/password";

export type DashboardRole = "RIDER" | "ADMIN" | "CUSTOMER";

const dashboardRoles = new Set<DashboardRole>(["RIDER", "ADMIN", "CUSTOMER"]);

export function normalizeUserRole(role: string | null | undefined): DashboardRole | null {
  const normalizedRole = role?.trim().toUpperCase();

  if (!normalizedRole || !dashboardRoles.has(normalizedRole as DashboardRole)) {
    return null;
  }

  return normalizedRole as DashboardRole;
}

function readCredential(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

export const authConfig = {
  session: {
    strategy: "jwt"
  },
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        const email = readCredential(credentials?.email).toLowerCase();
        const password = readCredential(credentials?.password);

        if (!email || !password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email },
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            passwordHash: true
          }
        });

        if (!user) {
          return null;
        }

        const passwordVerified = await verifyPassword(password, user.passwordHash);

        if (!passwordVerified) {
          return null;
        }

        const role = normalizeUserRole(user.role);

        if (!role) {
          return null;
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role
        };
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = normalizeUserRole(user.role) ?? "";
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = typeof token.id === "string" ? token.id : token.sub ?? "";
        session.user.role =
          typeof token.role === "string" ? normalizeUserRole(token.role) ?? "" : "";
      }

      return session;
    }
  }
} satisfies NextAuthConfig;

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);
export const { GET, POST } = handlers;
