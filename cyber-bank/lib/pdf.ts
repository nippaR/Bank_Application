import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

export async function generateApprovalPdf(data: {
    customerName: string;
    address: string;
    telephone: string;
    nic: string;
}) {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([595.28, 841.89]); // A4
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

    let y = 780;

    const draw = (text: string, size = 12) => {
        page.drawText(text, {
            x: 50,
            y,
            size,
            font,
            color: rgb(0, 0, 0),
        });
        y -= size + 12;
    };

    draw("Credit Card Approval Letter", 18);
    y -= 10;
    draw(`Customer Name: ${data.customerName}`);
    draw(`Address: ${data.address}`);
    draw(`Telephone No: ${data.telephone}`);
    draw(`NIC / Passport No: ${data.nic}`);
    y -= 10;
    draw("Dear Customer,");
    draw("We are pleased to inform you that your credit card application has been approved.");
    draw("Thank you for choosing our bank.");
    y -= 20;
    draw("Finance Department");

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
    const page = pdfDoc.addPage([595.28, 841.89]); // A4
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

    let y = 780;

    const draw = (text: string, size = 12) => {
        page.drawText(text, {
            x: 50,
            y,
            size,
            font,
            color: rgb(0, 0, 0),
        });
        y -= size + 12;
    };

    draw("Credit Card Rejection Letter", 18);
    y -= 10;
    draw(`Customer Name: ${data.customerName}`);
    draw(`Address: ${data.address}`);
    draw(`Telephone No: ${data.telephone}`);
    draw(`NIC / Passport No: ${data.nic}`);
    y -= 10;
    draw("Dear Customer,");
    draw("We regret to inform you that your credit card application has been rejected.");
    draw(`Reason: ${data.reason}`);
    y -= 20;
    draw("Finance Department");

    const pdfBytes = await pdfDoc.save();
    return Buffer.from(pdfBytes);
}