import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    const req = await prisma.creditCardApplicationChangeRequest.findFirst();
    console.log("Change Request ID:", req?.id);
    console.log("Application ID:", req?.applicationId);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
