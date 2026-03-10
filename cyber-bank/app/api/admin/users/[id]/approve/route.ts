//Approves a user by updating their status to active
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

//Type for the route parameters
type Params = {
    params: Promise<{
        id: string;
    }>;
};

//Handles POST requests to approve a user
export async function POST(_: Request, { params }: Params) {
    try {
        const { id } = await params;

        await prisma.user.update({
            where: { id },
            data: {
                status: "ACTIVE",
            },
        });

        return NextResponse.redirect(new URL("/admin/dashboard", process.env.NEXTAUTH_URL || "http://localhost:3000"));
    } catch (error) {
        console.error("Approve user error:", error);

        return NextResponse.json(
            { success: false, message: "Failed to approve user" },
            { status: 500 }
        );
    }
}