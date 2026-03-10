import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
    function middleware(req) {
        const token = req.nextauth.token;
        const isApiRoute = req.nextUrl.pathname.startsWith("/api");
        const isProtectedRoute = req.nextUrl.pathname.startsWith("/(protected)");

        // API Protection Logic
        if (isApiRoute) {
            if (!token) {
                return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
            }

            // Role-based API protection
            if (req.nextUrl.pathname.startsWith("/api/admin") && token.role !== "ADMIN") {
                return NextResponse.json({ message: "Forbidden" }, { status: 403 });
            }

            if (req.nextUrl.pathname.startsWith("/api/finance") && token.role !== "FINANCE" && token.role !== "ADMIN") {
                return NextResponse.json({ message: "Forbidden" }, { status: 403 });
            }
        }

        return NextResponse.next();
    },
    {
        callbacks: {
            authorized: ({ token }) => !!token,
        },
    }
);

export const config = {
    matcher: [
        "/api/admin/:path*",
        "/api/finance/:path*",
        "/api/customer/:path*",
        "/admin/:path*",
        "/finance/:path*",
        "/customer/:path*",
        "/(protected)/:path*",
    ],
};
