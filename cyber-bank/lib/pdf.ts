import { PDFDocument, StandardFonts, rgb, PDFPage, PDFFont } from "pdf-lib";
import fs from "fs";
import path from "path";

const COLORS = {
    primary: rgb(0.07, 0.14, 0.35), // Deep Navy
    text: rgb(0, 0, 0),
    secondaryText: rgb(0.4, 0.4, 0.4),
    divider: rgb(0.8, 0.8, 0.8),
};

async function drawHeader(page: PDFPage, pdfDoc: PDFDocument, fontBold: PDFFont, title: string) {
    const logoPath = path.join(process.cwd(), "public", "logo.png");
    let logoImage;
    try {
        if (fs.existsSync(logoPath)) {
            const logoBytes = fs.readFileSync(logoPath);
            logoImage = await pdfDoc.embedPng(logoBytes);
        }
    } catch (e) {
        console.error("Failed to load logo:", e);
    }

    if (logoImage) {
        const logoDims = logoImage.scale(0.15);
        page.drawImage(logoImage, {
            x: 50,
            y: 750,
            width: logoDims.width,
            height: logoDims.height,
        });
    }

    page.drawText("CYBER BANK", {
        x: logoImage ? 120 : 50,
        y: 765,
        size: 20,
        font: fontBold,
        color: COLORS.primary,
    });

    page.drawText(title, {
        x: 50,
        y: 710,
        size: 16,
        font: fontBold,
        color: COLORS.text,
    });

    // Divider line
    page.drawLine({
        start: { x: 50, y: 700 },
        end: { x: 545, y: 700 },
        thickness: 1,
        color: COLORS.divider,
    });

    return 670; // Current Y
}

export async function generateApprovalPdf(data: {
    customerName: string;
    address: string;
    telephone: string;
    nic: string;
}) {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([595.28, 841.89]);
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    let y = await drawHeader(page, pdfDoc, fontBold, "Credit Card Approval Letter");

    const drawField = (label: string, value: string) => {
        page.drawText(label, { x: 50, y, size: 10, font: fontBold, color: COLORS.secondaryText });
        page.drawText(value, { x: 180, y, size: 10, font, color: COLORS.text });
        y -= 20;
    };

    drawField("Customer Name:", data.customerName);
    drawField("Address:", data.address);
    drawField("Telephone No:", data.telephone);
    drawField("NIC / Passport No:", data.nic);

    y -= 30;
    page.drawText("Dear Customer,", { x: 50, y, size: 12, font, color: COLORS.text });
    y -= 25;
    page.drawText("We are pleased to inform you that your credit card application has been approved.", { x: 50, y, size: 11, font, color: COLORS.text });
    y -= 15;
    page.drawText("You want to come nearest bank to collect your credit card.", { x: 50, y, size: 11, font, color: COLORS.text });
    y -= 25;
    page.drawText("Thank you for choosing our bank.", { x: 50, y, size: 11, font, color: COLORS.text });

    y -= 50;
    page.drawText("Digitally Signed by:", { x: 50, y, size: 10, font: fontBold, color: COLORS.secondaryText });
    y -= 15;
    page.drawText("Finance Department", { x: 50, y, size: 12, font: fontBold, color: COLORS.primary });
    y -= 12;
    page.drawText("Cyber Bank", { x: 50, y, size: 10, font, color: COLORS.secondaryText });

    const pdfBytes = await pdfDoc.save();
    return Buffer.from(pdfBytes);
}

export async function generateRejectionPdf(data: {
    customerName: string;
    address: string;
    telephone: string;
    nic: string;
    reason: string;
}) {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([595.28, 841.89]);
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    let y = await drawHeader(page, pdfDoc, fontBold, "Credit Card Rejection Letter");

    const drawField = (label: string, value: string) => {
        page.drawText(label, { x: 50, y, size: 10, font: fontBold, color: COLORS.secondaryText });
        page.drawText(value, { x: 180, y, size: 10, font, color: COLORS.text });
        y -= 20;
    };

    drawField("Customer Name:", data.customerName);
    drawField("Address:", data.address);
    drawField("Telephone No:", data.telephone);
    drawField("NIC / Passport No:", data.nic);

    y -= 30;
    page.drawText("Dear Customer,", { x: 50, y, size: 12, font, color: COLORS.text });
    y -= 25;
    page.drawText("We regret to inform you that your credit card application has been rejected.", { x: 50, y, size: 11, font, color: COLORS.text });
    y -= 25;
    page.drawText(`Reason for rejection: ${data.reason}`, { x: 50, y, size: 11, font: fontBold, color: rgb(0.8, 0, 0) });

    y -= 50;
    page.drawText("Digitally Signed by:", { x: 50, y, size: 10, font: fontBold, color: COLORS.secondaryText });
    y -= 15;
    page.drawText("Finance Department", { x: 50, y, size: 12, font: fontBold, color: COLORS.primary });
    y -= 12;
    page.drawText("Cyber Bank", { x: 50, y, size: 10, font, color: COLORS.secondaryText });

    const pdfBytes = await pdfDoc.save();
    return Buffer.from(pdfBytes);
}