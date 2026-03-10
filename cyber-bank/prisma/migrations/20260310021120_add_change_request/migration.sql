-- CreateEnum
CREATE TYPE "ChangeRequestStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateTable
CREATE TABLE "CreditCardApplicationChangeRequest" (
    "id" TEXT NOT NULL,
    "applicationId" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "dateOfBirth" TIMESTAMP(3) NOT NULL,
    "nicPassportNumber" TEXT NOT NULL,
    "residentialAddress" TEXT NOT NULL,
    "mobilePhone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "employmentStatus" "EmploymentStatus" NOT NULL,
    "employerName" TEXT NOT NULL,
    "monthlyIncome" DECIMAL(12,2) NOT NULL,
    "city" TEXT NOT NULL,
    "postalCode" TEXT NOT NULL,
    "status" "ChangeRequestStatus" NOT NULL DEFAULT 'PENDING',
    "rejectionReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CreditCardApplicationChangeRequest_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CreditCardApplicationChangeRequest" ADD CONSTRAINT "CreditCardApplicationChangeRequest_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "CreditCardApplication"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CreditCardApplicationChangeRequest" ADD CONSTRAINT "CreditCardApplicationChangeRequest_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
