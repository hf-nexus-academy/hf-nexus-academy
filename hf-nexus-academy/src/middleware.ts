import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

// Route prefix -> roles allowed to access it
const ROLE_PROTECTED_ROUTES: { prefix: string; roles: string[] }[] = [
  { prefix: "/admin", roles: ["ADMIN"] },
  { prefix: "/teacher", roles: ["TEACHER", "ADMIN"] },
  { prefix: "/student", roles: ["STUDENT", "ADMIN"] },
];

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const userRole = req.auth?.user?.role;

  const matchedRule = ROLE_PROTECTED_ROUTES.find((rule) =>
    nextUrl.pathname.startsWith(rule.prefix)
  );

  if (!matchedRule) {
    return NextResponse.next();
  }

  if (!isLoggedIn) {
    const loginUrl = new URL("/login", nextUrl.origin);
    loginUrl.searchParams.set("callbackUrl", nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (!userRole || !matchedRule.roles.includes(userRole)) {
    return NextResponse.redirect(new URL("/unauthorized", nextUrl.origin));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/admin/:path*", "/teacher/:path*", "/student/:path*"],
};
