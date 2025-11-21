import NextAuth from "next-auth";
import { authOptions } from "~/lib/auth";

// NextAuth's default export is currently typed as `any` in the public types.
// Casting through `unknown` avoids eslint's unsafe assignment warning while
// retaining the handler shape NextAuth expects.
// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
const handler = NextAuth(authOptions) as unknown as ReturnType<typeof NextAuth>;

export { handler as GET, handler as POST };
