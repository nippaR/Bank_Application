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
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                    Admin Dashboard
                </h1>
                <div className="text-sm text-gray-400">
                    Pending Registrations: {pendingUsers.length}
                </div>
            </div>

            <div className="premium-card p-6">
                <h2 className="text-xl font-semibold mb-6 text-blue-400">Pending Customer Registrations</h2>

                {pendingUsers.length === 0 ? (
                    <div className="py-12 text-center text-gray-400">
                        No pending user registrations at the moment.
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {pendingUsers.map((user) => (
                            <div
                                key={user.id}
                                className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 rounded-xl border border-border bg-background/50 hover:border-blue-500/50 transition-all gap-4"
                            >
                                <div className="space-y-1">
                                    <p className="font-semibold text-white">{user.fullName}</p>
                                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-400">
                                        <p><span>Email:</span> {user.email}</p>
                                        <p><span>Phone:</span> {user.phone}</p>
                                    </div>
                                    <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 uppercase">
                                        {user.status}
                                    </span>
                                </div>

                                <form action={`/api/admin/users/${user.id}/approve`} method="POST" className="w-full md:w-auto">
                                    <button
                                        type="submit"
                                        className="w-full md:w-auto bg-primary hover:bg-primary-hover text-white px-6 py-2 rounded-lg transition-all font-medium text-sm shadow-lg shadow-blue-500/20"
                                    >
                                        Approve User
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