import {withAuth} from "next-auth/middleware";
import {NextResponse} from "next/server";
import roles from "@/core/roles";
import {jwtDecode} from "jwt-decode";

export default withAuth(
    async function middleware(req) {
        let decodedToken = jwtDecode(req.nextauth.token.token);

        let isEmployee = decodedToken.roles.some(role => role.authority === roles.EMPLOYEE);
        let isCustomer = decodedToken.roles.some(role => role.authority === roles.CUSTOMER);

        if (req.nextUrl.pathname.startsWith("/user") && !isEmployee)
            return NextResponse.rewrite(
                new URL("/api/auth/signin?message=You Are Not Authorized!", req.url)
            );
        if (req.nextUrl.pathname.startsWith("/product") && !isCustomer)
            return NextResponse.rewrite(
                new URL("/api/auth/signin?message=You Are Not Authorized!", req.url)
            );

    },
    {
        callbacks: {
            authorized: ({token}) => !!token,
        },
    }
);

export const config = {
    matcher: ["/user/:path*", "/product/:path*"]
};