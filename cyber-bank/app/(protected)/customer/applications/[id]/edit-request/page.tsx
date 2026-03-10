import { prisma } from "@/lib/prisma";
import EditRequestForm from "@/components/credit-card/EditRequestForm";

type Params = {
    params: Promise<{ id: string }>;
};

export default async function EditRequestPage({ params }: Params) {
    const { id } = await params;

    const application = await prisma.creditCardApplication.findUnique({
        where: { id },
    });

    if (!application) {
        return <div>Application not found</div>;
    }

    // Convert decimal to number for serialization to Client Components
    const serializableApplication = {
        ...application,
        monthlyIncome: Number(application.monthlyIncome),
        dateOfBirth: application.dateOfBirth.toISOString(),
        submittedAt: application.submittedAt.toISOString(),
        updatedAt: application.updatedAt.toISOString(),
    };

    return (
        <div className="p-6">
            <EditRequestForm application={serializableApplication as any} />
        </div>
    );
}