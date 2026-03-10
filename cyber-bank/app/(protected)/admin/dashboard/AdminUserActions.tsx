'use client';

import { useState } from "react";
import { Check, Eye, User, Mail, Phone, Calendar, Shield, Loader2 } from "lucide-react";
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

interface AdminUserActionsProps {
    user: {
        id: string;
        fullName: string;
        email: string;
        phone: string;
        role: string;
        status: string;
        createdAt: string;
    };
}

export default function AdminUserActions({ user }: AdminUserActionsProps) {
    const [isApproving, setIsApproving] = useState(false);
    const router = useRouter();

    const handleApprove = async () => {
        setIsApproving(true);
        try {
            const response = await fetch(`/api/admin/users/${user.id}/approve`, {
                method: "POST",
            });
            const data = await response.json();

            if (data.success) {
                toast.success("Approved successful", {
                    description: `${user.fullName}'s account is now active.`
                });
                router.refresh();
            } else {
                toast.error("Approval failed", {
                    description: data.message
                });
            }
        } catch (error) {
            toast.error("An error occurred", {
                description: "Could not approve user account."
            });
        } finally {
            setIsApproving(false);
        }
    };

    return (
        <div className="flex items-center gap-3 w-full md:w-auto">
            {/* View Details Dialog */}
            <Dialog>
                <DialogTrigger render={(props) => (
                    <Button
                        {...props}
                        variant="outline"
                        size="icon"
                        className="w-10 h-10 rounded-xl border-white/10 hover:bg-white/5 transition-all"
                    >
                        <Eye className="w-4 h-4 text-blue-400" />
                    </Button>
                )} />
                <DialogContent className="bg-[#0a0a0c] border-white/10 text-white sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold tracking-tight">User Information</DialogTitle>
                        <DialogDescription className="text-gray-400">
                            Complete registration details for the customer.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-6 py-6">
                        <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 shadow-inner">
                            <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                                <User className="w-6 h-6 text-blue-400" />
                            </div>
                            <div>
                                <h4 className="font-bold text-white tracking-tight">{user.fullName}</h4>
                                <p className="text-xs text-blue-400 font-bold uppercase tracking-widest">{user.role}</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center gap-3 text-sm group">
                                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center border border-white/5 group-hover:border-blue-500/30 transition-all">
                                    <Mail className="w-4 h-4 text-gray-500" />
                                </div>
                                <span className="text-gray-300 font-medium">{user.email}</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm group">
                                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center border border-white/5 group-hover:border-blue-500/30 transition-all">
                                    <Phone className="w-4 h-4 text-gray-500" />
                                </div>
                                <span className="text-gray-300 font-medium">{user.phone}</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm group">
                                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center border border-white/5 group-hover:border-blue-500/30 transition-all">
                                    <Calendar className="w-4 h-4 text-gray-500" />
                                </div>
                                <span className="text-gray-300 font-medium">Joined {new Date(user.createdAt).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm group">
                                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center border border-white/5 group-hover:border-blue-500/30 transition-all">
                                    <Shield className="w-4 h-4 text-gray-500" />
                                </div>
                                <span className="text-yellow-500 font-bold uppercase tracking-widest text-[10px]">{user.status}</span>
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Approve Button */}
            <Button
                onClick={handleApprove}
                disabled={isApproving}
                className="flex-1 md:flex-none px-6 py-5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-500/10"
            >
                {isApproving ? (
                    <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Approving...
                    </>
                ) : (
                    <>
                        <Check className="w-4 h-4" />
                        Approve User
                    </>
                )}
            </Button>
        </div>
    );
}
