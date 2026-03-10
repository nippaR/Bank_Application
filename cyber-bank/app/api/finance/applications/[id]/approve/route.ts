import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { generateApprovalPdf } from "@/lib/pdf";
import { sendMailWithAttachment } from "@/lib/mail";

type Params = {
    params: Promise<{ id: string }>;
};

export async function POST(_: Request, { params }: Params) {
    try {
        const { id } = await params;

        const application = await prisma.creditCardApplication.update({
            where: { id },
            data: {
                status: "APPROVED",
            },
        });

        // Generate approval PDF
        const pdfBuffer = await generateApprovalPdf({
            customerName: application.fullName,
            address: application.residentialAddress,
            telephone: application.mobilePhone,
            nic: application.nicPassportNumber,
        });

        // Send approval email
        await sendMailWithAttachment({
            to: application.email,
            subject: "Credit Card Application Approved",
            text: "Congratulations! Your credit card application has been approved. Please find your approval letter attached.",
            pdfBuffer,
            filename: "credit-card-approval-letter.pdf",
        });

        return NextResponse.redirect(
            new URL(
                "/finance/dashboard",
                process.env.NEXTAUTH_URL || "http://localhost:3000"
            )
        );
    } catch (error: any) {
        console.error("Approve application error:", error);

        return NextResponse.json(
            {
                success: false,
                message: error?.message || "Failed to approve application",
            },
            { status: 500 }
        );
    }
}