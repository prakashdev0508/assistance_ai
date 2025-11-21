import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { createCaller } from "~/server/api/root";
import { createTRPCContext } from "~/server/api/trpc";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.email = user.email;
        token.name = user.name;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.email = token.email!;
        session.user.name = token.name!;
      }
      return session;
    },
  },
  events: {
    async signIn({ user }) {
      if (!user?.email) {
        return;
      }

      try {
        const caller = createCaller(
          await createTRPCContext({ headers: new Headers() }),
        );

        await caller.user.updateOrCreateUser({
          email: user.email,
          name: user.name ?? user.email.split("@")[0] ?? "Unknown user",
        });
      } catch (err) {
        console.error("[auth] Failed to update or create user", err);
      }
    },
  },
};
