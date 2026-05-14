import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const isLoggedIn = !!req.auth;

  const pathname = req.nextUrl.pathname;

  // หน้า login
  const isLoginPage = pathname === "/bgdk/login";

  // กัน route bgdk
//   if (
//     !isLoggedIn &&
//     pathname.startsWith("/bgdk") &&
//     !isLoginPage
//   ) {
//     return NextResponse.redirect(
//       new URL("/next/bgdk/login", req.url)
//     );
//   }

//   // login แล้วกลับหน้า login
//   if (isLoggedIn && isLoginPage) {
//     return NextResponse.redirect(
//       new URL("/next/bgdk", req.url)
//     );
//   }

  return NextResponse.next();
});

export const config = {
  matcher: ["/bgdk/:path*"],
};