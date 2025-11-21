import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/login",
  },
});

export const config = {
  matcher: [
    "/protected/:path*",
    "/dashboard/:path*",
    "/task/:path*",
    "/plan/:path*",
    "/integrations/:path*",
  ],
};


