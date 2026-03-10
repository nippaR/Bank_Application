import CreateFinanceUserForm from "@/components/admin/CreateFinanceUserForm";
import { prisma } from "@/lib/prisma";
import FinanceUserList from "./FinanceUserList";
import { Users, UserPlus } from "lucide-react";

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
        <div className="space-y-16 animate-in fade-in slide-in-from-bottom-8 duration-1000 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-8">
                <div className="space-y-2">
                    <div className="flex items-center gap-3 text-blue-500 mb-2">
                        <Users className="w-6 h-6" />
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] opacity-60">System Administration</span>
                    </div>
                    <h1 className="text-4xl font-black bg-gradient-to-r from-white via-white to-gray-600 bg-clip-text text-transparent tracking-tighter">
                        Finance User Management
                    </h1>
                </div>
                <div className="bg-blue-500/10 text-blue-400 px-6 py-3 rounded-2xl border border-blue-500/20 text-sm font-bold flex items-center gap-3 backdrop-blur-md shadow-inner">
                    <span className="relative flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-500"></span>
                    </span>
                    {financeUsers.length} Active Accounts
                </div>
            </div>

            {/* Creation Section */}
            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <div className="h-px flex-1 bg-white/5"></div>
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 whitespace-nowrap">
                        <UserPlus className="w-3.5 h-3.5" />
                        Provision New Account
                    </div>
                    <div className="h-px flex-1 bg-white/5"></div>
                </div>
                <div className="max-w-3xl mx-auto w-full">
                    <CreateFinanceUserForm />
                </div>
            </div>

            {/* List Section */}
            <div className="space-y-8">
                <div className="flex items-center gap-4">
                    <div className="h-px flex-1 bg-white/5"></div>
                    <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 whitespace-nowrap">Existing Finance Access</h2>
                    <div className="h-px flex-1 bg-white/5"></div>
                </div>

                {financeUsers.length === 0 ? (
                    <div className="premium-card p-24 text-center border-dashed border-white/10 group hover:border-blue-500/30 transition-all rounded-[32px]">
                        <div className="bg-blue-500/5 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-white/5 group-hover:scale-110 transition-transform duration-500">
                            <Users className="w-10 h-10 text-blue-400/30" />
                        </div>
                        <h3 className="text-2xl font-black text-white mb-2 tracking-tight">No Accounts Found</h3>
                        <p className="text-gray-500 max-w-sm mx-auto text-sm leading-relaxed">
                            No finance users have been provisioned in the system yet.
                        </p>
                    </div>
                ) : (
                    <FinanceUserList users={financeUsers as any} />
                )}
            </div>
        </div>
    );
}