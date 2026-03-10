import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { generateRejectionPdf } from "@/lib/pdf";
import { sendMailWithAttachment } from "@/lib/mail";

type Params = {
    params: Promise<{ id: string }>;
};

export async function POST(req: Request, { params }: Params) {
    try {
        const { id } = await params;

        const body = await req.json().catch(() => ({}));
        const reason = String(body.reason || "").trim();

        if (!reason) {
            return NextResponse.json(
                { success: false, message: "Reject reason is required" },
                { status: 400 }
            );
        }

        const application = await prisma.creditCardApplication.update({
            where: { id },
            data: {
                status: "REJECTED",
                rejectionReason: reason,
            },
        });

        const pdfBuffer = await generateRejectionPdf({
            customerName: application.fullName,
            address: application.residentialAddress,
            telephone: application.mobilePhone,
            nic: application.nicPassportNumber,
            reason,
        });

        await sendMailWithAttachment({
            to: application.email,
            subject: "Credit Card Application Rejected",
            text: "Your credit card application has been rejected. Please find the attached PDF letter.",
            pdfBuffer,
            filename: "credit-card-rejection-letter.pdf",
        });

        return NextResponse.json({
            success: true,
            message: "Application rejected successfully",
        });
    } catch (error: any) {
        console.error("Reject application error:", error);

        return NextResponse.json(
            {
                success: false,
                message: error?.message || "Failed to reject application",
            },
            { status: 500 }
        );
    }
}