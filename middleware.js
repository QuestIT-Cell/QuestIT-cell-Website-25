import { NextResponse } from "next/server";

// Stricter guard for /admin routes: redirect to /admin/login when admin cookie is missing
export async function middleware(request) {
  const { pathname } = request.nextUrl;
  const loginPath = "/admin/login";

  // Only guard /admin routes (except the login page itself)
  if (!pathname.startsWith("/admin")) return NextResponse.next();
  if (pathname === loginPath) return NextResponse.next();

  // Strict: rely solely on framework cookies API (no raw header fallback)
  const adminCookie = request.cookies.get("admin")?.value || "";
  console.info(`[middleware] Guarding path: ${pathname}`);
  console.info(`[middleware] Admin cookie present: ${Boolean(adminCookie)}`);
  const secret = process.env.ADMIN_SECRET || "";

  const redirectToLogin = () => {
    const url = new URL(loginPath, request.url);
    url.searchParams.set("next", pathname);
    console.warn("[middleware] Redirecting to /admin/login");
    const res = NextResponse.redirect(url);
    // // Make middleware activity observable via headers/cookies
    // res.headers.set("x-middleware", "redirect-login");
    // res.headers.set("x-middleware-path", pathname);
    // // Non-HttpOnly for quick visibility in DevTools (remove in prod)
    // res.cookies.set("mw-debug", "redirect", { path: "/", httpOnly: false });
    return res;
  };

  // If cookie missing, immediately redirect to login
  if (!adminCookie) {
    console.warn("[middleware] Missing admin cookie");
    return redirectToLogin();
  }

  // If ADMIN_SECRET is provided, verify cookie matches SHA-256(secret)
  if (secret) {
    try {
      const encoder = new TextEncoder();
      const data = encoder.encode(secret);
      const digest = await crypto.subtle.digest("SHA-256", data);
      const bytes = new Uint8Array(digest);
      const expected = Array.from(bytes)
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");

      if (adminCookie !== expected) {
        console.warn("[middleware] Invalid admin cookie value");
        return redirectToLogin();
      }
    } catch (_err) {
      console.error("[middleware] Error hashing ADMIN_SECRET", _err);
      return redirectToLogin();
    }
  }

  console.info(`[middleware] Access granted for: ${pathname}`);
  const res = NextResponse.next();
  // Make middleware activity observable via headers/cookies
//   res.headers.set("x-middleware", "pass");
//   res.headers.set("x-middleware-path", pathname);
//   // Non-HttpOnly for quick visibility in DevTools (remove in prod)
//   res.cookies.set("mw-debug", "pass", { path: "/", httpOnly: false });
  return res;
}

export const config = {
  matcher: ["/admin/:path*"],
};
