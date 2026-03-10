const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
    const reqs = await prisma.creditCardApplicationChangeRequest.findMany({
        take: 5,
        select: { id: true, applicationId: true }
    });
    console.log(JSON.stringify(reqs, null, 2));
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
        process.exit(0);
    });
