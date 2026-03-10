import { prisma } from "@/lib/prisma";
import AdminUserActions from "./AdminUserActions";
import { User, ShieldCheck, Mail, Phone } from "lucide-react";

export default async function AdminDashboardPage() {
    const rawUsers = await prisma.user.findMany({
        where: {
            role: "CUSTOMER",
            status: "PENDING",
        },
        orderBy: {
            createdAt: "desc",
        },
    });

    // Fix serialization for Dates
    const pendingUsers = rawUsers.map(user => ({
        ...user,
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString(),
    }));

    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-1000 pb-24 px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                <div className="space-y-2">
                    <div className="flex items-center gap-3 text-blue-500 mb-2">
                        <ShieldCheck className="w-6 h-6" />
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] opacity-60">Security Hub</span>
                    </div>
                    <h1 className="text-4xl font-black bg-gradient-to-r from-white via-white to-gray-600 bg-clip-text text-transparent tracking-tighter">
                        Admin Overview
                    </h1>
                </div>
                <div className="bg-blue-500/10 text-blue-400 px-6 py-3 rounded-2xl border border-blue-500/20 text-sm font-bold flex items-center gap-3 backdrop-blur-md">
                    <span className="relative flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-500"></span>
                    </span>
                    {pendingUsers.length} Pending Review{pendingUsers.length !== 1 ? 's' : ''}
                </div>
            </div>

            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <div className="h-px flex-1 bg-white/5"></div>
                    <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 whitespace-nowrap">Pending Customer Registrations</h2>
                    <div className="h-px flex-1 bg-white/5"></div>
                </div>

                {pendingUsers.length === 0 ? (
                    <div className="premium-card p-24 text-center border-dashed border-white/10 group hover:border-blue-500/30 transition-all">
                        <div className="bg-blue-500/5 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-white/5 group-hover:scale-110 transition-transform duration-500">
                            <User className="w-10 h-10 text-blue-400/50" />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2 tracking-tight">Cleanup Complete</h3>
                        <p className="text-gray-500 max-w-sm mx-auto text-sm leading-relaxed">
                            There are no pending customer registrations waiting for your attention.
                        </p>
                    </div>
                ) : (
                    <div className="grid gap-6">
                        {pendingUsers.map((user) => (
                            <div
                                key={user.id}
                                className="premium-card p-6 flex flex-col md:flex-row items-center justify-between border border-white/5 hover:border-white/10 transition-all gap-8 group"
                            >
                                <div className="flex items-center gap-6 flex-1 w-full">
                                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500/20 to-indigo-500/10 flex items-center justify-center border border-blue-500/20 shadow-inner group-hover:scale-110 transition-transform duration-500">
                                        <User className="w-7 h-7 text-blue-400" />
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-3">
                                            <h3 className="text-xl font-black text-white tracking-tight">{user.fullName}</h3>
                                            <span className="px-2 py-0.5 rounded text-[10px] font-black bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 uppercase tracking-widest">
                                                {user.status}
                                            </span>
                                        </div>
                                        <div className="flex flex-wrap gap-x-8 gap-y-1 text-xs text-gray-500 font-medium">
                                            <div className="flex items-center gap-2 group-hover:text-gray-300 transition-colors">
                                                <Mail className="w-3.5 h-3.5 text-blue-400/40" />
                                                {user.email}
                                            </div>
                                            <div className="flex items-center gap-2 group-hover:text-gray-300 transition-colors">
                                                <Phone className="w-3.5 h-3.5 text-blue-400/40" />
                                                {user.phone}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <AdminUserActions user={user} />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}