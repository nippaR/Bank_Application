import { prisma } from "../../../../../../lib/prisma";
import { NextResponse } from "next/server";
import { sendSimpleMail } from "@/lib/mail";

type Params = {
    params: Promise<{ id: string }>;
};

export async function POST(_: Request, { params }: Params) {
    try {
        const { id } = await params;

        const changeRequest = await prisma.creditCardApplicationChangeRequest.findUnique({
            where: { id },
        });

        if (!changeRequest) {
            return NextResponse.json(
                { success: false, message: "Change request not found" },
                { status: 404 }
            );
        }

        await prisma.creditCardApplication.update({
            where: { id: changeRequest.applicationId },
            data: {
                fullName: changeRequest.fullName,
                dateOfBirth: changeRequest.dateOfBirth,
                nicPassportNumber: changeRequest.nicPassportNumber,
                residentialAddress: changeRequest.residentialAddress,
                mobilePhone: changeRequest.mobilePhone,
                email: changeRequest.email,
                employmentStatus: changeRequest.employmentStatus,
                employerName: changeRequest.employerName,
                monthlyIncome: changeRequest.monthlyIncome,
                city: changeRequest.city,
                postalCode: changeRequest.postalCode,
            },
        });

        await prisma.creditCardApplicationChangeRequest.update({
            where: { id },
            data: {
                status: "APPROVED",
            },
        });

        try {
            await sendSimpleMail({
                to: changeRequest.email,
                subject: "Credit Card Application Changes Approved",
                text: `Dear Customer, your requested changes for the credit card application (ID: ${changeRequest.applicationId}) have been approved and updated in our system.`,
            });
        } catch (mailError) {
            console.error("Approve change request email failed:", mailError);
        }

        return NextResponse.redirect(
            new URL("/finance/change-requests", process.env.NEXTAUTH_URL || "http://localhost:3000")
        );
    } catch (error: any) {
        console.error("Approve change request error:", error);

        return NextResponse.json(
            {
                success: false,
                message: error?.message || "Failed to approve change request",
            },
            { status: 500 }
        );
    }
}