import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
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
                { success: false, message: "Only customers can apply" },
                { status: 403 }
            );
        }

        const body = await request.json();
        const parsed = creditCardSchema.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json(
                { success: false, errors: parsed.error.flatten() },
                { status: 400 }
            );
        }

        const data = parsed.data;

        const application = await prisma.creditCardApplication.create({
            data: {
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

        return NextResponse.json(
            {
                success: true,
                message: "Credit card application submitted successfully",
                data: {
                    id: application.id,
                    status: application.status,
                },
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Credit card apply error:", error);

        return NextResponse.json(
            { success: false, message: "Internal server error" },
            { status: 500 }
        );
    }
}