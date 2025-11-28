import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized: ({ token }) => !!token,
  },
});

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/task/:path*",
    "/plan/:path*",
    "/integrations/:path*",
    "/goals/:path*",
  ],
};


