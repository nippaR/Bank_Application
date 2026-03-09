import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

export async function sendMailWithAttachment({
    to,
    subject,
    text,
    pdfBuffer,
    filename,
}: {
    to: string;
    subject: string;
    text: string;
    pdfBuffer: Buffer;
    filename: string;
}) {
    await transporter.verify();
    console.log("Mailer verified successfully");

    await transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to,
        subject,
        text,
        attachments: [
            {
                filename,
                content: pdfBuffer,
                contentType: "application/pdf",
            },
        ],
    });
}