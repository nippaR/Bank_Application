import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { Prisma } from "@prisma/client";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { creditCardSchema } from "@/validations/credit-card";

export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return NextResponse.json(
                { success: false, message: "Unauthorized" },
                { status: 401 }
            );
        }

        if ((session.user as any).role !== "CUSTOMER") {
            return NextResponse.json(
                { success: false, message: "Forbidden" },
                { status: 403 }
            );
        }

        const body = await request.json();
        const { applicationId, ...formData } = body;

        const parsed = creditCardSchema.safeParse(formData);

        if (!parsed.success) {
            return NextResponse.json(
                { success: false, errors: parsed.error.flatten() },
                { status: 400 }
            );
        }

        const application = await prisma.creditCardApplication.findUnique({
            where: { id: applicationId },
        });

        if (!application) {
            return NextResponse.json(
                { success: false, message: "Application not found" },
                { status: 404 }
            );
        }

        if (application.customerId !== (session.user as any).id) {
            return NextResponse.json(
                { success: false, message: "Not your application" },
                { status: 403 }
            );
        }

        const data = parsed.data;

        await prisma.creditCardApplicationChangeRequest.create({
            data: {
                applicationId,
                customerId: (session.user as any).id,
                fullName: data.fullName,
                dateOfBirth: new Date(data.dateOfBirth),
                nicPassportNumber: data.nicPassportNumber,
                residentialAddress: data.residentialAddress,
                mobilePhone: data.mobilePhone,
                email: data.email,
                employmentStatus: data.employmentStatus,
                employerName: data.employerName,
                monthlyIncome: new Prisma.Decimal(data.monthlyIncome),
                city: data.city,
                postalCode: data.postalCode,
                status: "PENDING",
            },
        });

        return NextResponse.json({
            success: true,
            message: "Edit request submitted for finance approval",
        });
    } catch (error: any) {
        console.error("Update request error:", error);

        return NextResponse.json(
            { success: false, message: error?.message || "Internal server error" },
            { status: 500 }
        );
    }
}