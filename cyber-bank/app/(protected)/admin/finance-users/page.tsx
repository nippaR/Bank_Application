import CreateFinanceUserForm from "@/components/admin/CreateFinanceUserForm";
import { prisma } from "@/lib/prisma";

export default async function FinanceUsersPage() {
    const financeUsers = await prisma.user.findMany({
        where: {
            role: "FINANCE",
        },
        orderBy: {
            createdAt: "desc",
        },
    });

    return (
        <div className="p-6 space-y-8">
            <CreateFinanceUserForm />

            <div className="rounded-lg border p-6">
                <h2 className="mb-4 text-xl font-semibold">Finance Users</h2>

                {financeUsers.length === 0 ? (
                    <p>No finance users found.</p>
                ) : (
                    <div className="space-y-4">
                        {financeUsers.map((user) => (
                            <div key={user.id} className="rounded border p-4">
                                <p><strong>Name:</strong> {user.fullName}</p>
                                <p><strong>Email:</strong> {user.email}</p>
                                <p><strong>Phone:</strong> {user.phone}</p>
                                <p><strong>Status:</strong> {user.status}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}