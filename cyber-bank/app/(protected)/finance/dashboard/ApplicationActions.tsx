'use client';

import { useState } from "react";
import { Check, X, Eye, User, IndianRupee, Mail, Phone, Calendar, Shield, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface ApplicationActionsProps {
    application: {
        id: string;
        fullName: string;
        email: string;
        mobilePhone: string;
        nicPassportNumber: string;
        monthlyIncome: number;
        status: string;
        dateOfBirth: string;
        employerName: string;
        employmentStatus: string;
        residentialAddress: string;
        city: string;
        postalCode: string;
    };
}

export default function ApplicationActions({ application }: ApplicationActionsProps) {
    const [isApproving, setIsApproving] = useState(false);
    const [isRejecting, setIsRejecting] = useState(false);
    const [rejectionReason, setRejectionReason] = useState("");
    const [showRejectDialog, setShowRejectDialog] = useState(false);
    const router = useRouter();

    const handleApprove = async () => {
        setIsApproving(true);
        try {
            const response = await fetch(`/api/finance/applications/${application.id}/approve`, {
                method: "POST",
            });
            const data = await response.json();

            if (data.success) {
                toast.success("Approved successful", {
                    description: `Application for ${application.fullName} has been approved.`
                });
                router.refresh();
            } else {
                toast.error("Approval failed", { description: data.message });
            }
        } catch (error) {
            toast.error("An error occurred", { description: "Could not approve application." });
        } finally {
            setIsApproving(false);
        }
    };

    const handleReject = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsRejecting(true);
        try {
            const response = await fetch(`/api/finance/applications/${application.id}/reject`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ reason: rejectionReason }),
            });
            const data = await response.json();

            if (data.success) {
                toast.success("Application Rejected", {
                    description: `Rejection notice sent to ${application.fullName}.`
                });
                setShowRejectDialog(false);
                router.refresh();
            } else {
                toast.error("Rejection failed", { description: data.message });
            }
        } catch (error) {
            toast.error("An error occurred", { description: "Could not reject application." });
        } finally {
            setIsRejecting(false);
        }
    };

    return (
        <div className="flex items-center gap-3 w-full">
            <Dialog>
                <DialogTrigger render={(props) => (
                    <Button
                        {...props}
                        variant="outline"
                        size="icon"
                        className="w-12 h-12 rounded-2xl border-white/10 hover:bg-white/5 transition-all group"
                    >
                        <Eye className="w-5 h-5 text-blue-400 group-hover:scale-110 transition-transform" />
                    </Button>
                )} />
                <DialogContent className="bg-[#0a0a0c]/80 backdrop-blur-[16px] border-white/10 text-white sm:max-w-[700px] max-h-[90vh] overflow-y-auto custom-scrollbar p-0 rounded-[32px]">
                    <div className="sticky top-0 bg-[#0a0a0c]/60 backdrop-blur-xl z-20 px-8 py-6 border-b border-white/5">
                        <DialogHeader>
                            <DialogTitle className="text-2xl font-black tracking-tight">Application Review</DialogTitle>
                            <DialogDescription className="text-gray-400 font-medium"> Detailed view of the credit card request.</DialogDescription>
                        </DialogHeader>
                    </div>

                    <div className="p-8 space-y-10">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-6">
                                <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-500">Applicant Details</h4>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3 text-sm">
                                        <User className="w-4 h-4 text-gray-500" />
                                        <span className="text-gray-300">{application.fullName}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm">
                                        <Mail className="w-4 h-4 text-gray-500" />
                                        <span className="text-gray-300">{application.email}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm">
                                        <Phone className="w-4 h-4 text-gray-500" />
                                        <span className="text-gray-300">+{application.mobilePhone}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm">
                                        <Shield className="w-4 h-4 text-gray-500" />
                                        <span className="text-gray-300">NIC/Passport: {application.nicPassportNumber}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-500">Financial Profile</h4>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3 text-sm">
                                        <IndianRupee className="w-4 h-4 text-gray-500" />
                                        <span className="text-white font-bold">Monthly: {application.monthlyIncome.toLocaleString()}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm">
                                        <Calendar className="w-4 h-4 text-gray-500" />
                                        <span className="text-gray-300">DOB: {new Date(application.dateOfBirth).toLocaleDateString()}</span>
                                    </div>
                                    <div className="text-sm">
                                        <p className="text-[10px] text-gray-600 uppercase font-black tracking-widest mb-1">Employer</p>
                                        <p className="text-gray-300">{application.employerName} ({application.employmentStatus})</p>
                                    </div>
                                </div>
                            </div>

                            <div className="md:col-span-2 space-y-6 pt-4 border-t border-white/5">
                                <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-500">Residential Address</h4>
                                <p className="text-sm text-gray-300 leading-relaxed bg-white/5 p-4 rounded-2xl border border-white/5">
                                    {application.residentialAddress}, {application.city}, {application.postalCode}
                                </p>
                            </div>
                        </div>

                        {application.status === 'PENDING' && (
                            <div className="flex gap-4 pt-6 border-t border-white/5">
                                <Button
                                    onClick={handleApprove}
                                    disabled={isApproving || isRejecting}
                                    className="flex-1 h-14 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-blue-600/10"
                                >
                                    {isApproving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Approve Application"}
                                </Button>

                                <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
                                    <DialogTrigger render={(props) => (
                                        <Button
                                            {...props}
                                            disabled={isApproving || isRejecting}
                                            variant="outline"
                                            className="flex-1 h-14 rounded-2xl border-red-500/20 bg-red-500/5 hover:bg-red-500 text-red-500 hover:text-white font-black text-xs uppercase tracking-widest transition-all"
                                        >
                                            Reject
                                        </Button>
                                    )} />
                                    <DialogContent className="bg-[#0a0a0c]/90 backdrop-blur-2xl border-white/10 text-white sm:max-w-[425px] rounded-[32px]">
                                        <DialogHeader>
                                            <DialogTitle className="text-2xl font-black flex items-center gap-3">
                                                <AlertCircle className="w-6 h-6 text-red-500" />
                                                Reject Application
                                            </DialogTitle>
                                            <DialogDescription className="text-gray-400 font-medium pt-2">
                                                Please specify why this application is being rejected. The customer will receive this reason via email.
                                            </DialogDescription>
                                        </DialogHeader>
                                        <form onSubmit={handleReject} className="space-y-6 py-6">
                                            <div className="space-y-2">
                                                <Label htmlFor="reason" className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Rejection Reason</Label>
                                                <Textarea
                                                    id="reason"
                                                    value={rejectionReason}
                                                    onChange={(e) => setRejectionReason(e.target.value)}
                                                    placeholder="e.g., Insufficient income documentation..."
                                                    className="bg-black/40 border-white/10 rounded-2xl min-h-[120px] focus:ring-red-500/50 outline-none transition-all placeholder:text-gray-700"
                                                    required
                                                />
                                            </div>
                                            <Button
                                                type="submit"
                                                disabled={isRejecting}
                                                className="w-full h-14 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-red-600/10"
                                            >
                                                {isRejecting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Confirm Rejection"}
                                            </Button>
                                        </form>
                                    </DialogContent>
                                </Dialog>
                            </div>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
