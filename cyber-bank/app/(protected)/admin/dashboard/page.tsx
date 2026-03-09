import { prisma } from "@/lib/prisma";

export default async function AdminDashboardPage() {
    const pendingUsers = await prisma.user.findMany({
        where: {
            role: "CUSTOMER",
            status: "PENDING",
        },
        orderBy: {
            createdAt: "desc",
        },
    });

    return (
        <div className="p-6">
            <h1 className="mb-6 text-2xl font-bold">Admin Dashboard</h1>

            <div className="rounded-lg border p-4">
                <h2 className="mb-4 text-lg font-semibold">Pending Customer Registrations</h2>

                {pendingUsers.length === 0 ? (
                    <p>No pending users.</p>
                ) : (
                    <div className="space-y-4">
                        {pendingUsers.map((user) => (
                            <div
                                key={user.id}
                                className="flex items-center justify-between rounded border p-4"
                            >
                                <div>
                                    <p><strong>Name:</strong> {user.fullName}</p>
                                    <p><strong>Email:</strong> {user.email}</p>
                                    <p><strong>Phone:</strong> {user.phone}</p>
                                    <p><strong>Status:</strong> {user.status}</p>
                                </div>

                                <form action={`/api/admin/users/${user.id}/approve`} method="POST">
                                    <button
                                        type="submit"
                                        className="rounded bg-green-600 px-4 py-2 text-white"
                                    >
                                        Approve
                                    </button>
                                </form>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}