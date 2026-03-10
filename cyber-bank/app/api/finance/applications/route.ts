import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const applications = await prisma.creditCardApplication.findMany({
            orderBy: {
                submittedAt: "desc",
            },
            include: {
                customer: {
                    select: {
                        fullName: true,
                        email: true,
                    }
                }
            }
        });

        return NextResponse.json({
            success: true,
            data: applications,
        });
    } catch (error) {
        console.error("Fetch applications error:", error);
        return NextResponse.json(
            {
                success: false,
                message: "Internal server error",
            },
            { status: 500 }
        );
    }
}
