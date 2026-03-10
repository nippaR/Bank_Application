import { prisma } from "@/lib/prisma";
import { ArrowLeft, User, Mail, Phone, FileText, AlertCircle } from "lucide-react";
import Link from "next/link";
import ChangeRequestActions from "./ChangeRequestActions";

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
        <div className={`grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-4 py-4 border-b border-white/5 last:border-0 transition-all ${isChanged ? 'bg-blue-500/5' : ''}`}>
            <div className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] flex items-center px-4 md:px-0">
                {label}
            </div>
            <div className="text-sm text-gray-400 break-all md:break-normal px-4 md:px-0">
                <span className="md:hidden text-[10px] text-gray-600 block mb-1 font-bold uppercase tracking-widest">CURRENT</span>
                {oldValue || <span className="italic opacity-30 tracking-tight">empty</span>}
            </div>
            <div className={`text-sm break-all md:break-normal font-medium px-4 md:px-0 ${isChanged ? 'text-yellow-400' : 'text-gray-400'}`}>
                <span className="md:hidden text-[10px] text-gray-600 block mb-1 font-bold uppercase tracking-widest">REQUESTED</span>
                <div className="flex items-center gap-2">
                    {newValue || <span className="italic opacity-30 tracking-tight">empty</span>}
                    {isChanged && <AlertCircle className="w-3.5 h-3.5 text-yellow-500/50" />}
                </div>
            </div>
        </div>
    );
}

export default async function FinanceChangeRequestsPage() {
    const rawRequests = await prisma.creditCardApplicationChangeRequest.findMany({
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

    // Fix serialization for Decimal and Dates
    const changeRequests = rawRequests.map(req => ({
        ...req,
        monthlyIncome: Number(req.monthlyIncome),
        dateOfBirth: req.dateOfBirth.toISOString(),
        createdAt: req.createdAt.toISOString(),
        updatedAt: req.updatedAt.toISOString(),
        application: {
            ...req.application,
            monthlyIncome: Number(req.application.monthlyIncome),
            dateOfBirth: req.application.dateOfBirth.toISOString(),
            submittedAt: req.application.submittedAt.toISOString(),
            updatedAt: req.application.updatedAt.toISOString(),
        }
    }));

    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-1000 pb-24 px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                <div className="space-y-2">
                    <Link
                        href="/finance/dashboard"
                        className="inline-flex items-center text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-blue-400 transition-all mb-4 group"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                        Back to Dashboard
                    </Link>
                    <h1 className="text-4xl font-black bg-gradient-to-r from-white via-white to-gray-600 bg-clip-text text-transparent tracking-tighter">
                        Review Changes
                    </h1>
                </div>
                <div className="bg-yellow-500/10 text-yellow-500 px-6 py-3 rounded-2xl border border-yellow-500/20 text-sm font-bold flex items-center gap-3 backdrop-blur-md">
                    <span className="relative flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-yellow-500"></span>
                    </span>
                    {changeRequests.length} Pending Review{changeRequests.length !== 1 ? 's' : ''}
                </div>
            </div>

            {changeRequests.length === 0 ? (
                <div className="premium-card p-24 text-center border-dashed border-white/10 group hover:border-blue-500/30 transition-all">
                    <div className="bg-blue-500/5 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-white/5 group-hover:scale-110 transition-transform duration-500">
                        <FileText className="w-10 h-10 text-blue-400/50" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2 tracking-tight">Queue is Clear</h3>
                    <p className="text-gray-500 max-w-sm mx-auto text-sm leading-relaxed">
                        There are no pending profile update requests. All customer data is currently up to date.
                    </p>
                </div>
            ) : (
                <div className="grid gap-12">
                    {changeRequests.map((req) => (
                        <div key={req.id} className="premium-card overflow-hidden border border-white/5 hover:border-white/10 transition-all rounded-[32px] shadow-2xl">
                            {/* Card Header */}
                            <div className="bg-white/5 px-8 py-6 border-b border-white/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500/20 to-indigo-500/10 flex items-center justify-center border border-blue-500/20 shadow-inner">
                                        <User className="w-6 h-6 text-blue-400" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-black text-white tracking-tight">{req.customer.fullName}</h3>
                                        <p className="text-[10px] text-gray-500 font-mono tracking-widest uppercase mt-0.5 opacity-60">APP ID: {req.applicationId}</p>
                                    </div>
                                </div>
                                <div className="flex flex-wrap gap-6 text-xs font-medium">
                                    <div className="flex items-center gap-2.5 text-gray-400 group cursor-default">
                                        <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center border border-white/5 group-hover:border-blue-500/20 transition-all">
                                            <Mail className="w-3.5 h-3.5 text-blue-400 opacity-60" />
                                        </div>
                                        {req.email}
                                    </div>
                                    <div className="flex items-center gap-2.5 text-gray-400 group cursor-default">
                                        <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center border border-white/5 group-hover:border-blue-500/20 transition-all">
                                            <Phone className="w-3.5 h-3.5 text-blue-400 opacity-60" />
                                        </div>
                                        {req.mobilePhone}
                                    </div>
                                </div>
                            </div>

                            {/* Comparison Table */}
                            <div className="p-8">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6 px-4 hidden md:grid">
                                    <div className="text-[10px] font-black text-gray-600 uppercase tracking-[0.3em]">Field</div>
                                    <div className="text-[10px] font-black text-gray-600 uppercase tracking-[0.3em] pl-4 border-l border-white/5 text-center">Original Value</div>
                                    <div className="text-[10px] font-black text-yellow-500/40 uppercase tracking-[0.3em] pl-4 border-l border-white/5 text-center">Requested Update</div>
                                </div>

                                <div className="space-y-0 border border-white/5 rounded-2xl overflow-hidden bg-black/40 backdrop-blur-xl shadow-inner">
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
                            <div className="bg-black/60 px-8 py-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
                                <div className="flex items-center gap-4 text-gray-500">
                                    <AlertCircle className="w-5 h-5 opacity-30" />
                                    <p className="text-sm font-medium leading-relaxed max-w-md">
                                        Review these changes carefully. Approving will permanently overwrite the customer's current data.
                                    </p>
                                </div>
                                <ChangeRequestActions requestId={req.id} />
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}