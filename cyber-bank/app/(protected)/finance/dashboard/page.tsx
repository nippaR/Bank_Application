import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { CheckCircle2, XCircle, Clock, FileText, LayoutDashboard, History, CheckCheck } from "lucide-react";

type Props = {
    searchParams: Promise<{ tab?: string }>;
};

export default async function FinanceDashboardPage({ searchParams }: Props) {
    const { tab = "pending" } = await searchParams;

    // Fetch all applications and the change requests count
    const [allApplications, changeRequestsCount] = await Promise.all([
        prisma.creditCardApplication.findMany({
            include: {
                customer: true,
            },
            orderBy: {
                submittedAt: "desc",
            },
        }),
        prisma.creditCardApplicationChangeRequest.count({
            where: { status: "PENDING" }
        })
    ]);

    const pendingApplications = allApplications.filter(app => app.status === "PENDING");
    const completedApplications = allApplications.filter(app => app.status !== "PENDING");

    const activeTab = tab === "completed" ? "completed" : "pending";
    const currentApplications = activeTab === "pending" ? pendingApplications : completedApplications;

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                        Finance Dashboard
                    </h1>
                    <p className="text-gray-400 mt-1">Manage and review credit card applications.</p>
                </div>
            </div>

            {/* Quick Stats & Navigation */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <div className="premium-card p-6 border-l-4 border-blue-500 flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="text-gray-400 text-xs font-bold uppercase tracking-widest">Total Active</h3>
                            <p className="text-4xl font-bold mt-2 text-white">{pendingApplications.length}</p>
                        </div>
                        <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400">
                            <LayoutDashboard className="w-5 h-5" />
                        </div>
                    </div>
                </div>

                <Link href="/finance/change-requests" className="premium-card p-6 border-l-4 border-yellow-500 hover:scale-[1.02] flex flex-col justify-between group transition-all">
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="text-gray-400 text-xs font-bold uppercase tracking-widest">Change Requests</h3>
                            <p className="text-4xl font-bold mt-2 text-white">{changeRequestsCount}</p>
                        </div>
                        <div className="w-10 h-10 rounded-lg bg-yellow-500/10 flex items-center justify-center text-yellow-400 group-hover:bg-yellow-500 group-hover:text-white transition-all">
                            <FileText className="w-5 h-5" />
                        </div>
                    </div>
                    <div className="mt-4 text-xs text-yellow-500 font-bold uppercase tracking-tighter flex items-center gap-1 group-hover:gap-2 transition-all">
                        Process Requests
                        <span className="text-lg">→</span>
                    </div>
                </Link>

                <div className="premium-card p-6 border-l-4 border-green-500 flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="text-gray-400 text-xs font-bold uppercase tracking-widest">Lifetime Completed</h3>
                            <p className="text-4xl font-bold mt-2 text-white">{completedApplications.length}</p>
                        </div>
                        <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center text-green-400">
                            <CheckCheck className="w-5 h-5" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Tab Navigation */}
            <div className="flex border-b border-white/5 gap-8">
                <Link
                    href="/finance/dashboard?tab=pending"
                    className={`pb-4 text-sm font-bold uppercase tracking-widest transition-all relative ${activeTab === "pending" ? "text-blue-400" : "text-gray-500 hover:text-gray-300"
                        }`}
                >
                    <div className="flex items-center gap-2">
                        <Clock className={`w-4 h-4 ${activeTab === "pending" ? "animate-pulse" : ""}`} />
                        Tasks Pending Review ({pendingApplications.length})
                    </div>
                    {activeTab === "pending" && (
                        <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.5)]" />
                    )}
                </Link>
                <Link
                    href="/finance/dashboard?tab=completed"
                    className={`pb-4 text-sm font-bold uppercase tracking-widest transition-all relative ${activeTab === "completed" ? "text-green-400" : "text-gray-500 hover:text-gray-300"
                        }`}
                >
                    <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4" />
                        Completed History ({completedApplications.length})
                    </div>
                    {activeTab === "completed" && (
                        <div className="absolute bottom-0 left-0 w-full h-0.5 bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.5)]" />
                    )}
                </Link>
            </div>

            {/* Application List */}
            {currentApplications.length === 0 ? (
                <div className="premium-card p-16 text-center">
                    <div className="bg-gray-500/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/5">
                        {activeTab === "pending" ? <History className="w-8 h-8 text-gray-500" /> : <FileText className="w-8 h-8 text-gray-500" />}
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-1">
                        {activeTab === "pending" ? "Zero Pending Applications" : "No History Records"}
                    </h3>
                    <p className="text-gray-500 text-sm max-w-xs mx-auto">
                        {activeTab === "pending"
                            ? "There are no tasks currently requiring your review. Good job!"
                            : "Applications that have been processed will appear here."}
                    </p>
                </div>
            ) : (
                <div className="grid gap-6">
                    {currentApplications.map((app) => (
                        <div key={app.id} className="premium-card overflow-hidden group hover:border-white/20 transition-all">
                            <div className="p-6 flex flex-col lg:flex-row justify-between gap-8">
                                <div className="space-y-6 flex-1">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500/20 to-blue-600/5 flex items-center justify-center border border-white/10 group-hover:border-blue-500/30">
                                                <LayoutDashboard className="w-6 h-6 text-blue-400" />
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-bold text-white tracking-tight">{app.fullName}</h3>
                                                <div className="flex items-center gap-4 mt-1">
                                                    <span className="text-[10px] font-mono text-gray-500 uppercase tracking-tighter">APP: {app.id}</span>
                                                    <span className="text-[10px] text-gray-500 flex items-center gap-1 font-bold">
                                                        <Clock className="w-3 h-3 opacity-50" />
                                                        {new Date(app.submittedAt).toLocaleDateString()}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className={`px-4 py-1.5 rounded-lg border text-[10px] font-bold uppercase tracking-[0.2em] shadow-sm ${app.status === 'APPROVED' ? 'bg-green-500/10 text-green-500 border-green-500/20' :
                                                app.status === 'REJECTED' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                                                    'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
                                            }`}>
                                            {app.status}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-bold text-gray-600 uppercase tracking-[0.15em]">Contact</p>
                                            <p className="text-sm font-medium text-gray-300 truncate">{app.email}</p>
                                            <p className="text-xs text-gray-500">+{app.mobilePhone}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-bold text-gray-600 uppercase tracking-[0.15em]">Identification</p>
                                            <p className="text-sm font-medium text-white">{app.nicPassportNumber}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-bold text-gray-600 uppercase tracking-[0.15em]">Income</p>
                                            <p className="text-lg font-bold text-white leading-tight">Rs. {app.monthlyIncome.toLocaleString()}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="lg:w-80 border-t lg:border-t-0 lg:border-l border-white/5 pt-6 lg:pt-0 lg:pl-8 flex flex-col justify-center">
                                    {app.status === "PENDING" ? (
                                        <div className="space-y-4">
                                            <form action={`/api/finance/applications/${app.id}/approve`} method="POST">
                                                <button type="submit" className="w-full bg-green-600 hover:bg-green-500 text-white px-6 py-3 rounded-xl transition-all font-bold text-sm shadow-lg shadow-green-900/20 flex items-center justify-center gap-2">
                                                    <CheckCircle2 className="w-4 h-4" />
                                                    Approve Application
                                                </button>
                                            </form>

                                            <form action={`/api/finance/applications/${app.id}/reject`} method="POST" className="space-y-2">
                                                <textarea
                                                    name="reason"
                                                    placeholder="Reason for rejection..."
                                                    required
                                                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-sm focus:ring-1 focus:ring-red-500/50 outline-none transition-all min-h-[80px] text-white placeholder:text-gray-700"
                                                />
                                                <button className="w-full bg-red-600/10 hover:bg-red-600 text-red-600 hover:text-white border border-red-600/20 px-4 py-2 text-sm rounded-xl transition-all font-bold flex items-center justify-center gap-2">
                                                    <XCircle className="w-4 h-4" />
                                                    Reject
                                                </button>
                                            </form>
                                        </div>
                                    ) : (
                                        <div className="text-center space-y-2">
                                            <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">Process Details</p>
                                            <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                                                <div className="flex items-center justify-center gap-2 text-sm font-medium text-gray-400">
                                                    {app.status === 'APPROVED' ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <XCircle className="w-4 h-4 text-red-500" />}
                                                    Decision Finalized
                                                </div>
                                                {app.rejectionReason && (
                                                    <p className="text-xs text-red-400/70 mt-3 italic leading-relaxed">
                                                        "{app.rejectionReason}"
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}