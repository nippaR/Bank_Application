'use client';

import { useState } from "react";
import { Check, X, AlertTriangle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface ChangeRequestActionsProps {
    requestId: string;
}

export default function ChangeRequestActions({ requestId }: ChangeRequestActionsProps) {
    const [isApprovig, setIsApproving] = useState(false);
    const [isRejecting, setIsRejecting] = useState(false);
    const [rejectionReason, setRejectionReason] = useState("");
    const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
    const router = useRouter();

    const handleApprove = async () => {
        setIsApproving(true);
        try {
            const response = await fetch(`/api/finance/change-requests/${requestId}/approve`, {
                method: "POST",
            });
            const data = await response.json();

            if (data.success) {
                toast.success("Approved successful", {
                    description: "Application changes have been applied."
                });
                router.refresh();
            } else {
                toast.error("Approval failed", {
                    description: data.message
                });
            }
        } catch (error) {
            toast.error("An error occurred", {
                description: "Could not approve changes."
            });
        } finally {
            setIsApproving(false);
        }
    };

    const handleReject = async () => {
        if (!rejectionReason.trim()) {
            toast.error("Reason required", {
                description: "Please provide a reason for rejection."
            });
            return;
        }

        setIsRejecting(true);
        try {
            const response = await fetch(`/api/finance/change-requests/${requestId}/reject`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ reason: rejectionReason }),
            });
            const data = await response.json();

            if (data.success) {
                toast.success("Rejected successful", {
                    description: "Change request has been rejected."
                });
                setIsRejectDialogOpen(false);
                router.refresh();
            } else {
                toast.error("Rejection failed", {
                    description: data.message
                });
            }
        } catch (error) {
            toast.error("An error occurred", {
                description: "Could not reject changes."
            });
        } finally {
            setIsRejecting(false);
        }
    };

    return (
        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto shrink-0">
            {/* Reject Button & Dialog */}
            <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
                <DialogTrigger render={(props) => (
                    <Button
                        {...props}
                        variant="outline"
                        className="px-8 py-6 rounded-2xl border-red-500/20 text-red-500 font-black text-xs uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all flex items-center justify-center gap-2 group"
                        disabled={isApprovig || isRejecting}
                    >
                        <X className="w-4 h-4 group-hover:scale-110 transition-transform" />
                        Reject Change
                    </Button>
                )} />
                <DialogContent className="bg-[#0a0a0c]/80 backdrop-blur-[16px] border-white/10 text-white sm:max-w-[425px] rounded-[32px]">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-black flex items-center gap-3">
                            <AlertTriangle className="w-6 h-6 text-red-500" />
                            Reject Changes
                        </DialogTitle>
                        <DialogDescription className="text-gray-400 font-medium pt-2">
                            Please provide a reason for rejecting these changes. This will be emailed to the customer.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-6 py-6">
                        <div className="space-y-2">
                            <Label htmlFor="reason" className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">
                                Rejection Reason
                            </Label>
                            <Textarea
                                id="reason"
                                placeholder="e.g., Provided NIC information does not match our records."
                                className="bg-black/40 border-white/10 rounded-2xl text-white placeholder:text-gray-700 focus:ring-red-500/50 outline-none transition-all min-h-[140px]"
                                value={rejectionReason}
                                onChange={(e) => setRejectionReason(e.target.value)}
                            />
                        </div>
                    </div>
                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button
                            variant="ghost"
                            onClick={() => setIsRejectDialogOpen(false)}
                            className="h-14 rounded-2xl text-gray-400 hover:text-white hover:bg-white/5 font-black text-[10px] uppercase tracking-widest"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleReject}
                            disabled={isRejecting}
                            className="h-14 flex-1 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-red-600/10"
                        >
                            {isRejecting ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                "Confirm Rejection"
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Approve Button */}
            <Button
                onClick={handleApprove}
                disabled={isApprovig || isRejecting}
                className="w-full sm:w-auto px-10 py-6 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-xl shadow-blue-500/20 group hover:translate-y-[-2px]"
            >
                {isApprovig ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                    <>
                        <Check className="w-4 h-4 group-hover:scale-110 transition-transform" />
                        Approve Changes
                    </>
                )}
            </Button>
        </div>
    );
}
