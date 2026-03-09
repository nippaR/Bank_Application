import { prisma } from "@/lib/prisma";

export default async function FinanceDashboardPage() {
    const applications = await prisma.creditCardApplication.findMany({
        include: {
            customer: true,
        },
        orderBy: {
            submittedAt: "desc",
        },
    });

    return (
        <div className="p-6 space-y-6">
            <h1 className="text-2xl font-bold">Finance Dashboard</h1>

            {applications.length === 0 && <p>No applications found.</p>}

            {applications.map((app) => (
                <div key={app.id} className="border rounded p-4 space-y-2">

                    <div className="font-semibold text-lg">
                        {app.fullName}
                    </div>

                    <p><b>Email:</b> {app.email}</p>
                    <p><b>Mobile:</b> {app.mobilePhone}</p>
                    <p><b>NIC:</b> {app.nicPassportNumber}</p>
                    <p><b>Income:</b> {app.monthlyIncome.toString()}</p>
                    <p><b>Status:</b> {app.status}</p>

                    {app.status === "PENDING" && (
                        <div className="flex gap-3 mt-3">

                            <form
                                action={`/api/finance/applications/${app.id}/approve`}
                                method="POST"
                            >
                                <button className="bg-green-600 text-white px-4 py-2 rounded">
                                    Approve
                                </button>
                            </form>

                            <form
                                action={`/api/finance/applications/${app.id}/reject`}
                                method="POST"
                            >
                                <input
                                    name="reason"
                                    placeholder="Reject reason"
                                    required
                                    className="border p-2 mr-2"
                                />

                                <button className="bg-red-600 text-white px-4 py-2 rounded">
                                    Reject
                                </button>
                            </form>

                        </div>
                    )}

                </div>
            ))}
        </div>
    );
}