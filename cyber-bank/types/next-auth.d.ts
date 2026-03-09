import { DefaultSession } from "next-auth";
import { DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
    interface Session {
        user: {
            id: string;
            role: "ADMIN" | "CUSTOMER" | "FINANCE";
            status: "PENDING" | "ACTIVE" | "INACTIVE";
        } & DefaultSession["user"];
    }

    interface User {
        id: string;
        role: "ADMIN" | "CUSTOMER" | "FINANCE";
        status: "PENDING" | "ACTIVE" | "INACTIVE";
    }
}

declare module "next-auth/jwt" {
    interface JWT extends DefaultJWT {
        id: string;
        role: "ADMIN" | "CUSTOMER" | "FINANCE";
        status: "PENDING" | "ACTIVE" | "INACTIVE";
    }
}