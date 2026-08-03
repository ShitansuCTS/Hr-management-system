// import { NextResponse } from "next/server";
// import { jwtVerify } from "jose";


// export async function middleware(req) {
//   const token = req.cookies.get("auth_token")?.value;
//   const pathname = req.nextUrl.pathname;
//   const secret = new TextEncoder().encode(process.env.JWT_SECRET);
//   const isLoginPage = pathname === "/authentication/login/minimal";

//   if (!token && !isLoginPage) {
//     return NextResponse.redirect(new URL("/authentication/login/minimal", req.url));
//   }

//   if (token && isLoginPage) {
//     return NextResponse.redirect(new URL("/", req.url));
//   }


//   if (token) {
//     try {
//       const { payload } = await jwtVerify(token, secret);

//       // ✅ DEBUG (check this once)
//       console.log("Decoded:", payload);

//       if (isLoginPage) {
//         return NextResponse.redirect(new URL("/", req.url));
//       }

//       if (pathname.startsWith("/dashboard")) {
//         if (payload.role !== "ADMIN") {
//           return NextResponse.redirect(
//             new URL("/dashboard/user", req.url)
//           );
//         }
//       }

//     } catch (err) {
//       console.log("JWT ERROR:", err);
//       return NextResponse.redirect(
//         new URL("/authentication/login/minimal", req.url)
//       );
//     }
//   }




//   return NextResponse.next();
// }

// export const config = {
//   // matcher: ["/", "/admin/:path*", "/employee/:path*"],
//   matcher: [
//     "/((?!api|_next/static|_next/image|images|favicon.ico|authentication/login/minimal|authentication/reset/forgot-password|authentication/reset/reset-password).*)",
//   ],
// };




import { NextResponse } from "next/server";
import { jwtVerify } from "jose";
import {
  ROUTE_PERMISSIONS,
  PUBLIC_ROUTES,
} from "@/lib/auth/permissions";

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

const LOGIN_PATH = "/authentication/login/minimal";


export async function middleware(req) {
  const token = req.cookies.get("auth_token")?.value;
  const pathname = req.nextUrl.pathname;

  // =========================
  // Public Routes
  // =========================
  const isPublicRoute = PUBLIC_ROUTES.some((route) =>
    pathname.startsWith(route)
  );

  // =========================
  // No Token
  // =========================
  if (!token) {
    if (isPublicRoute) {
      return NextResponse.next();
    }

    return NextResponse.redirect(new URL(LOGIN_PATH, req.url));
  }

  try {
    const { payload } = await jwtVerify(token, secret);

    const role = payload.role;

    // =========================
    // ROOT (/)
    // =========================
    if (pathname === "/") {
      return NextResponse.redirect(
        new URL(
          role === "ADMIN"
            ? "/dashboard/admin"
            : "/dashboard/user",
          req.url
        )
      );
    }

    // =========================
    // Prevent Login Page
    // =========================
    if (pathname === LOGIN_PATH) {
      return NextResponse.redirect(
        new URL(
          role === "ADMIN"
            ? "/dashboard/admin"
            : "/dashboard/user",
          req.url
        )
      );
    }

    // =========================
    // Dashboard Protection
    // =========================

    if (
      role === "ADMIN" &&
      pathname.startsWith("/dashboard/user")
    ) {
      return NextResponse.redirect(
        new URL("/dashboard/admin", req.url)
      );
    }

    if (
      role === "EMPLOYEE" &&
      pathname.startsWith("/dashboard/admin")
    ) {
      return NextResponse.redirect(
        new URL("/dashboard/user", req.url)
      );
    }


    // =========================
    // Skip Permission Check For Public Routes
    // =========================
    if (isPublicRoute) {
      return NextResponse.next();
    }

    // =========================
    // Route Permission Check
    // =========================

    const rolePermissions = ROUTE_PERMISSIONS[role] || {};

    const allowedRoutes = Object.values(rolePermissions).flat();

    const hasAccess = allowedRoutes.some((route) =>
      pathname.startsWith(route)
    );

    if (!hasAccess) {
      const url = req.nextUrl.clone();
      url.pathname = "/403";

      return NextResponse.rewrite(url);
    }

    return NextResponse.next();
  } catch (error) {
    const response = NextResponse.redirect(
      new URL(LOGIN_PATH, req.url)
    );

    response.cookies.delete("auth_token");

    return response;
  }
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|images|illustrations|favicon.ico).*)",
  ],
};