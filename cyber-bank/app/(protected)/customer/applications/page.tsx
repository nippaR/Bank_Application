import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ArrowLeft, CreditCard, FileText, Calendar, Mail, AlertCircle, CheckCircle2, XCircle, Clock, Edit2, ShieldQuestion } from "lucide-react";
import ApplicationDetailsView from "./ApplicationDetailsView";

export default async function CustomerApplicationsPage() {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
        return (
            <div className="min-h-screen flex items-center justify-center p-6">
                <div className="premium-card p-12 text-center max-w-md w-full border border-red-500/20 shadow-2xl shadow-red-500/10">
                    <div className="w-20 h-20 rounded-3xl bg-red-500/10 flex items-center justify-center mx-auto mb-6">
                        <AlertCircle className="w-10 h-10 text-red-500" />
                    </div>
                    <h2 className="text-2xl font-black text-white tracking-tight mb-2">Access Denied</h2>
                    <p className="text-gray-400 mb-8 leading-relaxed">Please authenticate to view and manage your credit card applications.</p>
                    <Link href="/login" className="inline-block w-full bg-white text-black font-black py-4 rounded-2xl hover:bg-gray-100 transition-all active:scale-95 shadow-xl">
                        Return to Login
                    </Link>
                </div>
            </div>
        );
    }

    const rawApplications = await prisma.creditCardApplication.findMany({
        where: {
            customerId: (session.user as any).id,
        },
        orderBy: {
            submittedAt: "desc",
        },
    });

    // Fix serialization for Decimal and Dates
    const applications = rawApplications.map(app => ({
        ...app,
        monthlyIncome: Number(app.monthlyIncome),
        dateOfBirth: app.dateOfBirth.toISOString(),
        submittedAt: app.submittedAt.toISOString(),
        updatedAt: app.updatedAt.toISOString(),
    }));

    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-8">
                <div className="space-y-2">
                    <Link
                        href="/customer/dashboard"
                        className="inline-flex items-center text-xs font-black uppercase tracking-[0.2em] text-gray-500 hover:text-blue-400 transition-all mb-4 group"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                        Dashboard
                    </Link>
                    <div className="flex items-center gap-3 text-blue-500 mb-2">
                        <FileText className="w-6 h-6" />
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] opacity-60">Application Tracker</span>
                    </div>
                    <h1 className="text-4xl font-black bg-gradient-to-r from-white via-white to-gray-600 bg-clip-text text-transparent tracking-tighter">
                        My Applications
                    </h1>
                </div>
                <div className="bg-blue-500/10 text-blue-400 px-6 py-3 rounded-2xl border border-blue-500/20 text-sm font-bold flex items-center gap-3 backdrop-blur-md shadow-inner">
                    <CreditCard className="w-4 h-4 opacity-50" />
                    {applications.length} Account Request{applications.length !== 1 ? 's' : ''}
                </div>
            </div>

            {applications.length === 0 ? (
                <div className="premium-card p-24 text-center border-dashed border-white/10 group hover:border-blue-500/30 transition-all">
                    <div className="bg-white/5 w-24 h-24 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 border border-white/5 group-hover:rotate-12 group-hover:scale-110 transition-all duration-700">
                        <ShieldQuestion className="w-12 h-12 text-gray-600 group-hover:text-blue-400/50 transition-colors" />
                    </div>
                    <h3 className="text-3xl font-black text-white mb-3 tracking-tight">No Active Applications</h3>
                    <p className="text-gray-500 max-w-md mx-auto mb-10 text-lg leading-relaxed">
                        Ready to join the elite? Apply for our premium credit cards today and experience the future of banking.
                    </p>
                    <Link
                        href="/customer/credit-card/apply"
                        className="inline-flex items-center gap-3 bg-blue-600 text-white px-10 py-5 rounded-2xl font-black text-sm hover:bg-blue-500 transition-all shadow-2xl shadow-blue-600/20 active:scale-95 group"
                    >
                        Apply for Credit Card
                        <CreditCard className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-500" />
                    </Link>
                </div>
            ) : (
                <div className="grid gap-8">
                    {applications.map((app) => (
                        <div key={app.id} className="premium-card overflow-hidden group hover:border-white/10 transition-all shadow-2xl border border-white/5">
                            <div className="p-8 md:p-10 flex flex-col md:flex-row justify-between gap-10">
                                <div className="space-y-8 flex-1">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                                        <div className="flex items-center gap-5">
                                            <div className="w-16 h-16 rounded-[1.5rem] bg-gradient-to-br from-blue-500/20 to-indigo-600/5 flex items-center justify-center border border-blue-500/20 shadow-inner group-hover:scale-110 transition-transform duration-700">
                                                <CreditCard className="w-8 h-8 text-blue-400" />
                                            </div>
                                            <div>
                                                <h3 className="text-2xl font-black text-white tracking-tight">{app.fullName}</h3>
                                                <div className="flex items-center gap-4 mt-1.5 opacity-60">
                                                    <span className="text-[10px] font-mono font-bold text-gray-400 bg-white/5 px-2 py-0.5 rounded uppercase tracking-tighter">REQ-ID: {app.id.slice(-8)}</span>
                                                    <div className="flex items-center gap-1.5 text-xs text-gray-500 font-bold uppercase tracking-widest">
                                                        <Calendar className="w-3.5 h-3.5 opacity-50" />
                                                        {new Date(app.submittedAt).toLocaleDateString()}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className={`inline-flex items-center gap-2.5 px-4 py-2 rounded-xl border font-black text-[10px] uppercase tracking-[0.2em] shadow-inner ${app.status === 'APPROVED' ? 'bg-green-500/10 text-green-500 border-green-500/20' :
                                            app.status === 'REJECTED' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                                                'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
                                            }`}>
                                            {app.status === 'APPROVED' && <CheckCircle2 className="w-4 h-4" />}
                                            {app.status === 'REJECTED' && <XCircle className="w-4 h-4" />}
                                            {app.status === 'PENDING' && <Clock className="w-4 h-4 animate-pulse text-yellow-500/50" />}
                                            {app.status}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                                        <div className="space-y-2 p-4 rounded-2xl bg-white/5 border border-white/5 transition-colors group-hover:border-blue-500/10">
                                            <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Contact Point</p>
                                            <div className="flex items-center gap-2 text-sm text-gray-300 font-medium">
                                                <Mail className="w-4 h-4 text-blue-400/50" />
                                                {app.email}
                                            </div>
                                        </div>
                                        <div className="space-y-2 p-4 rounded-2xl bg-white/5 border border-white/5 transition-colors group-hover:border-blue-500/10">
                                            <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Declared Income</p>
                                            <div className="text-xl font-black text-white tracking-tight">
                                                Rs. {Number(app.monthlyIncome).toLocaleString()}
                                            </div>
                                        </div>
                                        <div className="space-y-2 p-4 rounded-2xl bg-white/5 border border-white/5 transition-colors group-hover:border-blue-500/10 sm:col-span-2 lg:col-span-1">
                                            <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Last Update</p>
                                            <div className="text-sm font-bold text-gray-400">
                                                {new Date(app.updatedAt).toLocaleDateString()}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="md:w-72 border-t md:border-t-0 md:border-l border-white/5 pt-10 md:pt-0 md:pl-10 flex flex-col justify-center gap-4">
                                    <Link
                                        href={`/customer/applications/${app.id}/edit-request`}
                                        className="w-full bg-blue-600 hover:bg-blue-500 text-white px-6 py-4 rounded-xl transition-all font-black text-sm flex items-center justify-center gap-2 shadow-xl shadow-blue-600/10 group-hover:translate-y-[-2px]"
                                    >
                                        <Edit2 className="w-4 h-4" />
                                        Update Details
                                    </Link>

                                    <ApplicationDetailsView application={app as any} />

                                    <p className="text-[9px] text-gray-600 mt-2 text-center leading-relaxed font-bold uppercase tracking-widest opacity-60">
                                        Secure Management Dashboard
                                    </p>
                                </div>
                            </div>

                            {app.rejectionReason && (
                                <div className="bg-red-500/10 px-10 py-8 border-t border-red-500/20 backdrop-blur-3xl animate-in fade-in slide-in-from-top-4 duration-500">
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center shrink-0">
                                            <AlertCircle className="w-6 h-6 text-red-500" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-red-500/70 uppercase tracking-[0.3em] mb-1">Official Rejection Notice</p>
                                            <p className="text-lg font-bold text-white tracking-tight leading-relaxed">{app.rejectionReason}</p>
                                            <p className="text-xs text-red-400/60 mt-2 font-medium">Please review the reason and submit a new request or contact support.</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}