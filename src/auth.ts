import type { DefaultSession } from "next-auth";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

import { db } from "@/lib/db";
import { isDemoAuthAllowed, isPublicProduction } from "@/lib/environment";
import { verifyPassword } from "@/lib/security/passwords";
import { enforceRateLimit } from "@/lib/security/rate-limit";
import { loginSchema } from "@/lib/validation/auth";

type SessionRole = "CLIENT" | "LAWYER" | "ADMIN";

declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      id: string;
      email: string;
      role: SessionRole;
      active: boolean;
      sessionVersion: number;
    };
  }

  interface User {
    role: SessionRole;
    active: boolean;
    sessionVersion: number;
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    role?: SessionRole;
    active?: boolean;
    sessionVersion?: number;
  }
}

function demoLoginAllowed(email: string) {
  if (!email.endsWith("@xs-abogados.local")) return true;
  return isDemoAuthAllowed();
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  secret:
    process.env.AUTH_SECRET ||
    (isPublicProduction()
      ? undefined
      : "xs-abogados-development-auth-secret-change-in-production"),
  trustHost: true,
  session: {
    strategy: "jwt",
    maxAge: 8 * 60 * 60,
    updateAge: 30 * 60,
  },
  pages: {
    signIn: "/portal/iniciar-sesion",
  },
  providers: [
    Credentials({
      name: "Correo y contraseña",
      credentials: {
        email: { label: "Correo", type: "email" },
        password: { label: "Contraseña", type: "password" },
      },
      authorize: async (credentials, request) => {
        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success || !demoLoginAllowed(parsed.data.email))
          return null;

        try {
          await enforceRateLimit({
            request,
            scope: "credentials-login",
            limit: 8,
            windowMs: 15 * 60 * 1000,
            secondaryKey: parsed.data.email,
          });
        } catch {
          return null;
        }

        const user = await db.user.findUnique({
          where: { email: parsed.data.email },
          select: {
            id: true,
            name: true,
            email: true,
            passwordHash: true,
            role: true,
            status: true,
            sessionVersion: true,
          },
        });
        if (!user || user.status !== "ACTIVE") return null;
        if (!(await verifyPassword(parsed.data.password, user.passwordHash)))
          return null;

        await db.user.update({
          where: { id: user.id },
          data: { lastLoginAt: new Date() },
        });
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          active: true,
          sessionVersion: user.sessionVersion,
        };
      },
    }),
  ],
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token.role = user.role;
        token.active = user.active;
        token.sessionVersion = user.sessionVersion;
        return token;
      }

      if (!token.sub) {
        token.active = false;
        return token;
      }

      try {
        const current = await db.user.findUnique({
          where: { id: token.sub },
          select: {
            role: true,
            status: true,
            sessionVersion: true,
            email: true,
          },
        });
        const demoBlocked = current?.email
          ? !demoLoginAllowed(current.email)
          : true;
        token.active = Boolean(
          current &&
          current.status === "ACTIVE" &&
          current.sessionVersion === token.sessionVersion &&
          !demoBlocked,
        );
        if (current) token.role = current.role;
      } catch {
        token.active = false;
      }
      return token;
    },
    session: ({ session, token }) => {
      session.user.id = token.sub ?? "";
      session.user.email = token.email ?? "";
      session.user.role = token.role ?? "CLIENT";
      session.user.active = token.active === true;
      session.user.sessionVersion = token.sessionVersion ?? 0;
      return session;
    },
  },
});
