import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { CheckCircle2, XCircle, Clock, FileText, LayoutDashboard, History, CheckCheck, Landmark } from "lucide-react";
import ApplicationActions from "./ApplicationActions";

type Props = {
    searchParams: Promise<{ tab?: string }>;
};

export default async function FinanceDashboardPage({ searchParams }: Props) {
    const { tab = "pending" } = await searchParams;

    // Fetch all applications and the change requests count
    const [allApplicationsRaw, changeRequestsCount] = await Promise.all([
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

    // Fix serialization for Decimal and Dates
    const allApplications = allApplicationsRaw.map(app => ({
        ...app,
        monthlyIncome: Number(app.monthlyIncome),
        dateOfBirth: app.dateOfBirth.toISOString(),
        submittedAt: app.submittedAt.toISOString(),
        updatedAt: app.updatedAt.toISOString(),
    }));

    const pendingApplications = allApplications.filter(app => app.status === "PENDING");
    const completedApplications = allApplications.filter(app => app.status !== "PENDING");

    const activeTab = tab === "completed" ? "completed" : "pending";
    const currentApplications = activeTab === "pending" ? pendingApplications : completedApplications;

    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-8">
                <div className="space-y-2">
                    <div className="flex items-center gap-3 text-blue-500 mb-2">
                        <Landmark className="w-6 h-6" />
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] opacity-60">Finance Central</span>
                    </div>
                    <h1 className="text-4xl font-black bg-gradient-to-r from-white via-white to-gray-600 bg-clip-text text-transparent tracking-tighter">
                        Finance Dashboard
                    </h1>
                </div>
                <div className="bg-blue-500/10 text-blue-400 px-6 py-3 rounded-2xl border border-blue-500/20 text-sm font-bold flex items-center gap-3 backdrop-blur-md shadow-inner">
                    <span className="relative flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-500"></span>
                    </span>
                    {pendingApplications.length} Tasks Pending
                </div>
            </div>

            {/* Quick Stats & Navigation */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <div className="premium-card p-8 border-l-4 border-blue-500 flex flex-col justify-between group rounded-[24px]">
                    <div className="flex justify-between items-start">
                        <div className="space-y-1">
                            <h3 className="text-gray-500 text-[10px] font-black uppercase tracking-widest">Active Intake</h3>
                            <p className="text-4xl font-black mt-2 text-white tracking-tighter group-hover:scale-110 transition-transform origin-left duration-500">{pendingApplications.length}</p>
                        </div>
                        <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-400 border border-blue-500/20 group-hover:rotate-12 transition-all duration-500">
                            <LayoutDashboard className="w-6 h-6" />
                        </div>
                    </div>
                </div>

                <Link href="/finance/change-requests" className="premium-card p-8 border-l-4 border-yellow-500 hover:translate-y-[-4px] flex flex-col justify-between group transition-all rounded-[24px]">
                    <div className="flex justify-between items-start">
                        <div className="space-y-1">
                            <h3 className="text-gray-500 text-[10px] font-black uppercase tracking-widest">Update Requests</h3>
                            <p className="text-4xl font-black mt-2 text-white tracking-tighter group-hover:scale-110 transition-transform origin-left duration-500">{changeRequestsCount}</p>
                        </div>
                        <div className="w-12 h-12 rounded-2xl bg-yellow-500/10 flex items-center justify-center text-yellow-400 border border-yellow-500/20 group-hover:bg-yellow-500 group-hover:text-white transition-all duration-500">
                            <FileText className="w-6 h-6" />
                        </div>
                    </div>
                    <div className="mt-6 text-[10px] text-yellow-500 font-black uppercase tracking-[0.2em] flex items-center gap-2 group-hover:gap-4 transition-all">
                        Review Changes
                        <span className="text-lg">→</span>
                    </div>
                </Link>

                <div className="premium-card p-8 border-l-4 border-green-500 flex flex-col justify-between group rounded-[24px]">
                    <div className="flex justify-between items-start">
                        <div className="space-y-1">
                            <h3 className="text-gray-500 text-[10px] font-black uppercase tracking-widest">Total Resolved</h3>
                            <p className="text-4xl font-black mt-2 text-white tracking-tighter group-hover:scale-110 transition-transform origin-left duration-500">{completedApplications.length}</p>
                        </div>
                        <div className="w-12 h-12 rounded-2xl bg-green-500/10 flex items-center justify-center text-green-400 border border-green-500/20 group-hover:rotate-12 transition-all duration-500">
                            <CheckCheck className="w-6 h-6" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Tab Navigation */}
            <div className="flex border-b border-white/5 gap-12 px-2">
                <Link
                    href="/finance/dashboard?tab=pending"
                    className={`pb-6 text-[10px] font-black uppercase tracking-[0.3em] transition-all relative ${activeTab === "pending" ? "text-blue-400" : "text-gray-500 hover:text-gray-300"
                        }`}
                >
                    <div className="flex items-center gap-3">
                        <Clock className={`w-4 h-4 ${activeTab === "pending" ? "animate-pulse" : ""}`} />
                        Tasks Pending Review ({pendingApplications.length})
                    </div>
                    {activeTab === "pending" && (
                        <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-400 shadow-[0_0_12px_rgba(96,165,250,0.8)]" />
                    )}
                </Link>
                <Link
                    href="/finance/dashboard?tab=completed"
                    className={`pb-6 text-[10px] font-black uppercase tracking-[0.3em] transition-all relative ${activeTab === "completed" ? "text-green-400" : "text-gray-500 hover:text-gray-300"
                        }`}
                >
                    <div className="flex items-center gap-3">
                        <CheckCircle2 className="w-4 h-4" />
                        Completed History ({completedApplications.length})
                    </div>
                    {activeTab === "completed" && (
                        <div className="absolute bottom-0 left-0 w-full h-0.5 bg-green-400 shadow-[0_0_12px_rgba(74,222,128,0.8)]" />
                    )}
                </Link>
            </div>

            {/* Application List */}
            {currentApplications.length === 0 ? (
                <div className="premium-card p-32 text-center border-dashed border-white/10 group hover:border-blue-500/30 transition-all rounded-[32px]">
                    <div className="bg-white/5 w-24 h-24 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 border border-white/5 group-hover:scale-110 transition-all duration-700">
                        {activeTab === "pending" ? <History className="w-12 h-12 text-gray-700 group-hover:text-blue-500/50 transition-colors" /> : <FileText className="w-12 h-12 text-gray-700 group-hover:text-green-500/50 transition-colors" />}
                    </div>
                    <h3 className="text-3xl font-black text-white mb-2 tracking-tight">
                        {activeTab === "pending" ? "Zero Pending Tasks" : "No Archived Records"}
                    </h3>
                    <p className="text-gray-500 text-lg max-w-sm mx-auto leading-relaxed">
                        {activeTab === "pending"
                            ? "All applications have been processed. Great job on clearing the intake!"
                            : "Archive is currently empty. Processed applications will appear here."}
                    </p>
                </div>
            ) : (
                <div className="grid gap-8">
                    {currentApplications.map((app) => (
                        <div key={app.id} className="premium-card overflow-hidden group hover:border-white/10 transition-all shadow-2xl rounded-[24px]">
                            <div className="p-10 flex flex-col lg:flex-row justify-between gap-12">
                                <div className="space-y-10 flex-1">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-6">
                                            <div className="w-16 h-16 rounded-[1.5rem] bg-gradient-to-br from-blue-500/20 to-indigo-600/5 flex items-center justify-center border border-blue-500/20 shadow-inner group-hover:scale-110 transition-transform duration-700">
                                                <LayoutDashboard className="w-8 h-8 text-blue-400" />
                                            </div>
                                            <div>
                                                <h3 className="text-2xl font-black text-white tracking-tight">{app.fullName}</h3>
                                                <div className="flex items-center gap-6 mt-1.5 opacity-60">
                                                    <span className="text-[10px] font-mono font-bold text-gray-500 bg-white/5 px-2 py-0.5 rounded uppercase tracking-tighter">APP-ID: {app.id.slice(-8)}</span>
                                                    <span className="text-[10px] text-gray-500 flex items-center gap-2 font-black uppercase tracking-widest">
                                                        <Clock className="w-3.5 h-3.5 opacity-50" />
                                                        {new Date(app.submittedAt).toLocaleDateString()}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className={`px-5 py-2 rounded-xl border font-black text-[10px] uppercase tracking-[0.2em] shadow-inner ${app.status === 'APPROVED' ? 'bg-green-500/10 text-green-500 border-green-500/20' :
                                            app.status === 'REJECTED' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                                                'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
                                            }`}>
                                            {app.status}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
                                        <div className="space-y-2 p-5 rounded-2xl bg-white/5 border border-white/5 group-hover:border-blue-500/10 transition-colors">
                                            <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Communication</p>
                                            <p className="text-sm font-bold text-gray-300 truncate">{app.email}</p>
                                            <p className="text-xs text-gray-500 font-medium">+{app.mobilePhone}</p>
                                        </div>
                                        <div className="space-y-2 p-5 rounded-2xl bg-white/5 border border-white/5 group-hover:border-blue-500/10 transition-colors">
                                            <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Verified ID</p>
                                            <p className="text-sm font-bold text-white tracking-widest uppercase">{app.nicPassportNumber}</p>
                                        </div>
                                        <div className="space-y-2 p-5 rounded-2xl bg-white/5 border border-white/5 group-hover:border-blue-500/10 transition-colors">
                                            <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Financial Standing</p>
                                            <p className="text-2xl font-black text-white tracking-tighter">Rs. {app.monthlyIncome.toLocaleString()}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="lg:w-80 border-t lg:border-t-0 lg:border-l border-white/5 pt-10 lg:pt-0 lg:pl-10 flex flex-col justify-center gap-6">
                                    <ApplicationActions application={app as any} />

                                    {app.status !== 'PENDING' && (
                                        <div className="p-6 rounded-2xl bg-white/5 border border-white/5 backdrop-blur-sm">
                                            <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest mb-3 text-center">Outcome Recorded</p>
                                            <div className="flex items-center justify-center gap-3 text-sm font-black text-white uppercase tracking-tighter">
                                                {app.status === 'APPROVED' ? <CheckCircle2 className="w-5 h-5 text-green-500" /> : <XCircle className="w-5 h-5 text-red-500" />}
                                                Verification {app.status === 'APPROVED' ? 'Cleared' : 'Halted'}
                                            </div>
                                            {app.rejectionReason && (
                                                <div className="mt-4 pt-4 border-t border-white/5">
                                                    <p className="text-[10px] text-red-500/50 uppercase font-black tracking-widest mb-1">Reason</p>
                                                    <p className="text-xs text-gray-400 italic leading-relaxed">
                                                        "{app.rejectionReason}"
                                                    </p>
                                                </div>
                                            )}
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