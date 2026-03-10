import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { sendSimpleMail } from "@/lib/mail";

type Params = {
    params: Promise<{ slug: string[] }>;
};

export async function POST(req: Request, { params }: Params) {
    try {
        const { slug } = await params;
        console.log("Change Request API catch-all hit with slug:", slug);

        // Possible formats:
        // [id, "approve"]
        // [id, "reject"]
        // [applicationId, id, "approve"]
        // [applicationId, id, "reject"]

        let id = "";
        let action = "";

        if (slug.length === 2) {
            id = slug[0];
            action = slug[1];
        } else if (slug.length === 3) {
            id = slug[1]; // The second segment is likely the change request ID
            action = slug[2];
        } else {
            return NextResponse.json({ success: false, message: "Invalid URL format" }, { status: 400 });
        }

        if (action === "approve") {
            const changeReq = await prisma.creditCardApplicationChangeRequest.findUnique({
                where: { id },
            });

            if (!changeReq) {
                return NextResponse.json({ success: false, message: "Change request not found: " + id }, { status: 404 });
            }

            await prisma.creditCardApplication.update({
                where: { id: changeReq.applicationId },
                data: {
                    fullName: changeReq.fullName,
                    dateOfBirth: changeReq.dateOfBirth,
                    nicPassportNumber: changeReq.nicPassportNumber,
                    residentialAddress: changeReq.residentialAddress,
                    mobilePhone: changeReq.mobilePhone,
                    email: changeReq.email,
                    employmentStatus: changeReq.employmentStatus,
                    employerName: changeReq.employerName,
                    monthlyIncome: changeReq.monthlyIncome,
                    city: changeReq.city,
                    postalCode: changeReq.postalCode,
                },
            });

            await prisma.creditCardApplicationChangeRequest.update({
                where: { id },
                data: { status: "APPROVED" },
            });

            await sendSimpleMail({
                to: changeReq.email,
                subject: "Credit Card Application Changes Approved",
                text: `Dear Customer, your requested changes for the credit card application (ID: ${changeReq.applicationId}) have been approved.`,
            });

            return NextResponse.redirect(new URL("/finance/dashboard", req.url));

        } else if (action === "reject") {
            const formData = await req.formData();
            const reason = String(formData.get("reason") || "").trim();

            if (!reason) {
                return NextResponse.json({ success: false, message: "Reject reason is required" }, { status: 400 });
            }

            const changeReq = await prisma.creditCardApplicationChangeRequest.update({
                where: { id },
                data: {
                    status: "REJECTED",
                    rejectionReason: reason,
                },
            });

            await sendSimpleMail({
                to: changeReq.email,
                subject: "Credit Card Application Change Request Rejected",
                text: `Dear Customer, your requested changes for the credit card application (ID: ${changeReq.applicationId}) have been rejected.\n\nReason: ${reason}`,
            });

            return NextResponse.redirect(new URL("/finance/dashboard", req.url));
        }

        return NextResponse.json({ success: false, message: "Invalid action" }, { status: 400 });

    } catch (error: any) {
        console.error("Catch-all change request error:", error);
        return NextResponse.json(
            { success: false, message: error?.message || "Internal server error" },
            { status: 500 }
        );
    }
}
