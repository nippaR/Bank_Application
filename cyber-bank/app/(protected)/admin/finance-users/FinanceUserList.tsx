'use client';

import { useState } from "react";
import { Trash2, User, Mail, Phone, Shield, AlertTriangle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface FinanceUser {
    id: string;
    fullName: string;
    email: string;
    phone: string;
    status: string;
}

interface FinanceUserListProps {
    users: FinanceUser[];
}

export default function FinanceUserList({ users }: FinanceUserListProps) {
    const [isDeleting, setIsDeleting] = useState<string | null>(null);
    const router = useRouter();

    const handleDelete = async (id: string) => {
        setIsDeleting(id);
        try {
            const response = await fetch(`/api/admin/users/${id}`, {
                method: "DELETE",
            });
            const data = await response.json();

            if (data.success) {
                toast.success("User deleted successful", {
                    description: "The finance account has been removed."
                });
                router.refresh();
            } else {
                toast.error("Failed to delete", {
                    description: data.message
                });
            }
        } catch (error) {
            toast.error("An error occurred", {
                description: "Could not complete deletion."
            });
        } finally {
            setIsDeleting(null);
        }
    };

    return (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {users.map((user) => (
                <div key={user.id} className="premium-card p-8 flex flex-col justify-between group rounded-[24px] border border-white/5 hover:border-white/10 transition-all shadow-2xl">
                    <div className="space-y-6">
                        <div className="flex justify-between items-start">
                            <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-400 border border-blue-500/20 group-hover:scale-110 transition-transform duration-500">
                                <Shield className="w-7 h-7" />
                            </div>
                            <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border shadow-inner ${user.status === 'ACTIVE' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
                                }`}>
                                {user.status}
                            </div>
                        </div>

                        <div>
                            <h3 className="text-2xl font-black text-white tracking-tight">{user.fullName}</h3>
                            <div className="space-y-3 mt-4">
                                <div className="flex items-center gap-3 text-sm text-gray-400 font-medium">
                                    <Mail className="w-4 h-4 text-blue-400/50" />
                                    {user.email}
                                </div>
                                <div className="flex items-center gap-3 text-sm text-gray-400 font-medium">
                                    <Phone className="w-4 h-4 text-blue-400/50" />
                                    {user.phone}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-10 pt-6 border-t border-white/5">
                        <AlertDialog>
                            <AlertDialogTrigger render={(props) => (
                                <Button
                                    {...props}
                                    variant="ghost"
                                    className="w-full h-14 rounded-2xl text-red-500 hover:text-white hover:bg-red-600 transition-all font-black text-xs uppercase tracking-widest gap-3 border border-red-500/10 hover:border-red-600"
                                    disabled={isDeleting === user.id}
                                >
                                    {isDeleting === user.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                                    {isDeleting === user.id ? "Processing..." : "Delete Account"}
                                </Button>
                            )} />
                            <AlertDialogContent className="bg-[#0a0a0c]/80 backdrop-blur-[16px] border-white/10 text-white rounded-[32px] sm:max-w-[425px]">
                                <AlertDialogHeader>
                                    <AlertDialogTitle className="text-2xl font-black flex items-center gap-3">
                                        <AlertTriangle className="w-6 h-6 text-red-500" />
                                        Permanent Deletion
                                    </AlertDialogTitle>
                                    <AlertDialogDescription className="text-gray-400 font-medium text-lg leading-relaxed pt-2">
                                        Are you absolutely sure? This will permanently remove the finance account for <span className="text-white font-bold">{user.fullName}</span> and revoke all access.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter className="gap-3 mt-6">
                                    <AlertDialogCancel className="h-14 rounded-2xl bg-white/5 border-white/10 text-white hover:bg-white/10 font-black text-[10px] uppercase tracking-widest transition-all">
                                        Cancel
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                        className="h-14 flex-1 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-black text-[10px] uppercase tracking-widest transition-all shadow-xl shadow-red-600/20"
                                        onClick={() => handleDelete(user.id)}
                                    >
                                        Delete Account
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                </div>
            ))}
        </div>
    );
}
