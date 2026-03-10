import { prisma } from "@/lib/prisma";
import { ArrowLeft, User, Mail, Phone, FileText, Check, X, AlertCircle } from "lucide-react";
import Link from "next/link";

function ComparisonRow({
    label,
    oldValue,
    newValue,
}: {
    label: string;
    oldValue: string;
    newValue: string;
}) {
    const isChanged = oldValue !== newValue;

    return (
        <div className={`grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-4 py-3 border-b border-white/5 last:border-0 transition-colors ${isChanged ? 'bg-blue-500/5' : ''}`}>
            <div className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center">
                {label}
            </div>
            <div className="text-sm text-gray-400 break-all md:break-normal">
                <span className="md:hidden text-[10px] text-gray-600 block mb-0.5">CURRENT</span>
                {oldValue || <span className="italic opacity-30">empty</span>}
            </div>
            <div className={`text-sm break-all md:break-normal font-medium ${isChanged ? 'text-yellow-400' : 'text-gray-400'}`}>
                <span className="md:hidden text-[10px] text-gray-600 block mb-0.5">REQUESTED</span>
                <div className="flex items-center gap-2">
                    {newValue || <span className="italic opacity-30">empty</span>}
                    {isChanged && <AlertCircle className="w-3.5 h-3.5 text-yellow-500/50" />}
                </div>
            </div>
        </div>
    );
}

export default async function FinanceChangeRequestsPage() {
    const changeRequests = await prisma.creditCardApplicationChangeRequest.findMany({
        include: {
            application: true,
            customer: true,
        },
        where: {
            status: "PENDING",
        },
        orderBy: {
            createdAt: "desc",
        },
    });

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <Link
                        href="/finance/dashboard"
                        className="inline-flex items-center text-sm text-gray-400 hover:text-blue-400 transition-colors mb-2 group"
                    >
                        <ArrowLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" />
                        Back to Dashboard
                    </Link>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                        Application Change Review
                    </h1>
                </div>
                <div className="bg-yellow-500/10 text-yellow-500 px-4 py-2 rounded-xl border border-yellow-500/20 text-sm font-medium flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-yellow-500"></span>
                    </span>
                    {changeRequests.length} Pending Review{changeRequests.length !== 1 ? 's' : ''}
                </div>
            </div>

            {changeRequests.length === 0 ? (
                <div className="premium-card p-12 text-center">
                    <div className="bg-gray-500/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FileText className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">Queue is Empty</h3>
                    <p className="text-gray-400 max-w-xs mx-auto">
                        Excellent work! There are no pending change requests waiting for your review.
                    </p>
                </div>
            ) : (
                <div className="grid gap-8">
                    {changeRequests.map((req) => (
                        <div key={req.id} className="premium-card overflow-hidden">
                            {/* Card Header */}
                            <div className="bg-white/5 px-6 py-4 border-b border-white/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center border border-blue-500/20">
                                        <User className="w-5 h-5 text-blue-400" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-white">{req.customer.fullName}</h3>
                                        <p className="text-xs text-gray-500 font-mono tracking-tighter">APP ID: {req.applicationId}</p>
                                    </div>
                                </div>
                                <div className="flex gap-4 text-xs">
                                    <div className="flex items-center gap-1.5 text-gray-400">
                                        <Mail className="w-3.5 h-3.5 text-blue-400/50" />
                                        {req.email}
                                    </div>
                                    <div className="flex items-center gap-1.5 text-gray-400">
                                        <Phone className="w-3.5 h-3.5 text-blue-400/50" />
                                        {req.mobilePhone}
                                    </div>
                                </div>
                            </div>

                            {/* Comparison Table */}
                            <div className="p-6">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] px-2 hidden md:grid">
                                    <div>Attribute</div>
                                    <div>Current Value</div>
                                    <div className="text-yellow-500/70">Requested Value</div>
                                </div>

                                <div className="space-y-0 border border-white/5 rounded-xl overflow-hidden bg-black/20">
                                    <ComparisonRow
                                        label="Full Name"
                                        oldValue={req.application.fullName}
                                        newValue={req.fullName}
                                    />
                                    <ComparisonRow
                                        label="Date of Birth"
                                        oldValue={new Date(req.application.dateOfBirth).toLocaleDateString()}
                                        newValue={new Date(req.dateOfBirth).toLocaleDateString()}
                                    />
                                    <ComparisonRow
                                        label="NIC / Passport"
                                        oldValue={req.application.nicPassportNumber}
                                        newValue={req.nicPassportNumber}
                                    />
                                    <ComparisonRow
                                        label="Residential Address"
                                        oldValue={req.application.residentialAddress}
                                        newValue={req.residentialAddress}
                                    />
                                    <ComparisonRow
                                        label="Employment"
                                        oldValue={req.application.employmentStatus}
                                        newValue={req.employmentStatus}
                                    />
                                    <ComparisonRow
                                        label="Employer"
                                        oldValue={req.application.employerName}
                                        newValue={req.employerName}
                                    />
                                    <ComparisonRow
                                        label="Income"
                                        oldValue={`Rs. ${Number(req.application.monthlyIncome).toLocaleString()}`}
                                        newValue={`Rs. ${Number(req.monthlyIncome).toLocaleString()}`}
                                    />
                                    <ComparisonRow
                                        label="Location"
                                        oldValue={`${req.application.city}, ${req.application.postalCode}`}
                                        newValue={`${req.city}, ${req.postalCode}`}
                                    />
                                </div>
                            </div>

                            {/* Actions Footer */}
                            <div className="bg-black/40 px-6 py-6 border-t border-white/5">
                                <div className="flex flex-col lg:flex-row gap-6 items-end">
                                    <div className="flex-1 w-full">
                                        <p className="text-xs font-bold text-white uppercase tracking-widest mb-3 flex items-center gap-2">
                                            <X className="w-3 h-3 text-red-500/50" />
                                            Rejection Reason (Required for rejection)
                                        </p>
                                        <form id={`reject-form-${req.id}`} action={`/api/finance/change-requests/${req.id}/reject`} method="POST">
                                            <textarea
                                                name="reason"
                                                placeholder="Explain why this change is being rejected..."
                                                required
                                                className="w-full bg-black/60 border border-white rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-red-500/20 focus:border-red-500/50 outline-none transition-all min-h-[100px] text-white placeholder:text-gray-700"
                                            />
                                        </form>
                                    </div>

                                    <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto shrink-0">
                                        <button
                                            form={`reject-form-${req.id}`}
                                            type="submit"
                                            className="px-8 py-3 rounded-xl border border-red-500/30 text-red-500 font-bold text-sm hover:bg-red-500 hover:text-white transition-all flex items-center justify-center gap-2"
                                        >
                                            <X className="w-4 h-4" />
                                            Reject Change
                                        </button>

                                        <form action={`/api/finance/change-requests/${req.id}/approve`} method="POST">
                                            <button className="w-full sm:w-auto px-8 py-3 rounded-xl bg-green-600 hover:bg-green-500 text-white font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-green-900/20">
                                                <Check className="w-4 h-4" />
                                                Approve Changes
                                            </button>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}