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
  },
  secret: process.env.NEXTAUTH_SECRET,
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


