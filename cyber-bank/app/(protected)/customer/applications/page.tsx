import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ArrowLeft, CreditCard, FileText, Calendar, Mail, AlertCircle, CheckCircle2, XCircle, Clock, Edit2 } from "lucide-react";

export default async function CustomerApplicationsPage() {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
        return (
            <div className="premium-card p-8 text-center">
                <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <h2 className="text-xl font-bold text-white">Unauthorized</h2>
                <p className="text-gray-400">Please sign in to view your applications.</p>
            </div>
        );
    }

    const applications = await prisma.creditCardApplication.findMany({
        where: {
            customerId: (session.user as any).id,
        },
        orderBy: {
            submittedAt: "desc",
        },
    });

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <Link
                        href="/customer/dashboard"
                        className="inline-flex items-center text-sm text-gray-400 hover:text-blue-400 transition-colors mb-2 group"
                    >
                        <ArrowLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" />
                        Back to Dashboard
                    </Link>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                        My Applications
                    </h1>
                </div>
                <div className="bg-blue-500/10 text-blue-400 px-4 py-2 rounded-xl border border-blue-500/20 text-sm font-medium">
                    {applications.length} Total Submitted
                </div>
            </div>

            {applications.length === 0 ? (
                <div className="premium-card p-12 text-center">
                    <div className="bg-gray-500/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FileText className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">No Applications Yet</h3>
                    <p className="text-gray-400 max-w-xs mx-auto mb-6">
                        You haven't submitted any credit card applications. Ready to get your premium card?
                    </p>
                    <Link
                        href="/customer/credit-card/apply"
                        className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-blue-500 transition-colors shadow-lg shadow-blue-500/20"
                    >
                        Apply Now
                        <CreditCard className="w-4 h-4" />
                    </Link>
                </div>
            ) : (
                <div className="grid gap-6">
                    {applications.map((app) => (
                        <div key={app.id} className="premium-card overflow-hidden hover:scale-[1.005] transition-all group">
                            <div className="p-6 md:p-8 flex flex-col md:flex-row justify-between gap-6">
                                <div className="space-y-6 flex-1">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500/20 to-blue-600/5 flex items-center justify-center border border-blue-500/20 shadow-inner">
                                                <CreditCard className="w-6 h-6 text-blue-400" />
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-bold text-white tracking-tight">{app.fullName}</h3>
                                                <div className="flex items-center gap-4 mt-1">
                                                    <span className="text-[10px] font-mono text-gray-500 bg-white/5 px-1.5 py-0.5 rounded uppercase tracking-tighter">ID: {app.id}</span>
                                                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                                                        <Calendar className="w-3.5 h-3.5 opacity-50" />
                                                        {new Date(app.submittedAt).toLocaleDateString()}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border font-bold text-xs uppercase tracking-widest ${app.status === 'APPROVED' ? 'bg-green-500/10 text-green-500 border-green-500/20' :
                                                app.status === 'REJECTED' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                                                    'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
                                            }`}>
                                            {app.status === 'APPROVED' && <CheckCircle2 className="w-4 h-4" />}
                                            {app.status === 'REJECTED' && <XCircle className="w-4 h-4" />}
                                            {app.status === 'PENDING' && <Clock className="w-4 h-4 animate-pulse" />}
                                            {app.status}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-4">
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">Contact Info</p>
                                            <div className="flex items-center gap-2 text-sm text-gray-300">
                                                <Mail className="w-4 h-4 text-blue-400" />
                                                {app.email}
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">Monthly Income</p>
                                            <div className="text-lg font-semibold text-white">
                                                Rs. {Number(app.monthlyIncome).toLocaleString()}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="md:w-64 border-t md:border-t-0 md:border-l border-white/5 pt-6 md:pt-0 md:pl-8 flex flex-col justify-center">
                                    <Link
                                        href={`/customer/applications/${app.id}/edit-request`}
                                        className="w-full bg-white/5 hover:bg-white/10 text-white px-6 py-3 rounded-xl transition-all font-bold text-sm flex items-center justify-center gap-2 border border-white/10 group-hover:border-blue-500/30 shadow-lg"
                                    >
                                        <Edit2 className="w-4 h-4 text-blue-400" />
                                        Request Edit
                                    </Link>
                                    <p className="text-[10px] text-gray-500 mt-4 text-center leading-relaxed font-medium">
                                        Found an error in your application? Submit an edit request for review.
                                    </p>
                                </div>
                            </div>

                            {app.rejectionReason && (
                                <div className="bg-red-500/5 px-6 py-4 border-t border-red-500/10">
                                    <div className="flex items-start gap-3">
                                        <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
                                        <div>
                                            <p className="text-[10px] font-bold text-red-500/70 uppercase tracking-widest">Reason for Rejection</p>
                                            <p className="text-sm text-red-200 mt-1">{app.rejectionReason}</p>
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