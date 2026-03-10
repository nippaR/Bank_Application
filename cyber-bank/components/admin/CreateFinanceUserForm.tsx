"use client";

import { useState } from "react";
import { UserPlus, Mail, Phone, Lock, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function CreateFinanceUserForm() {
    const [form, setForm] = useState({
        fullName: "",
        email: "",
        phone: "",
        password: "",
    });
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch("/api/admin/finance-users", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });

            const result = await response.json();

            if (!response.ok) {
                toast.error("Operation Failed", { description: result.message || "Could not create finance account." });
                return;
            }

            toast.success("Account Provisioned", { description: `${form.fullName}'s finance account is now active.` });
            setForm({ fullName: "", email: "", phone: "", password: "" });
            router.refresh();
        } catch {
            toast.error("Error", { description: "An unexpected error occurred." });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <form
                onSubmit={handleSubmit}
                className="premium-card p-12 space-y-10 border border-white/10 rounded-[32px] relative overflow-hidden shadow-2xl"
            >
                {/* Decorative element */}
                <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/5 rounded-full -mr-24 -mt-24 blur-[80px] pointer-events-none" />

                <div className="text-center space-y-3 relative z-10">
                    <div className="w-16 h-16 rounded-2xl bg-blue-600/10 flex items-center justify-center text-blue-400 mx-auto mb-6 border border-blue-500/20">
                        <UserPlus className="w-8 h-8" />
                    </div>
                    <h1 className="text-3xl font-black bg-gradient-to-r from-white via-white to-gray-500 bg-clip-text text-transparent tracking-tighter">
                        New Finance Identity
                    </h1>
                    <p className="text-gray-500 font-medium text-sm">Create a secure portal for a new finance representative.</p>
                </div>

                <div className="grid gap-6 md:grid-cols-2 relative z-10">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Full Identity</label>
                        <div className="relative">
                            <input
                                name="fullName"
                                value={form.fullName}
                                onChange={handleChange}
                                placeholder="Legal Name"
                                className="w-full bg-black/40 border border-white/10 rounded-2xl px-12 py-4 text-sm focus:ring-1 focus:ring-blue-500/50 outline-none transition-all placeholder:text-gray-700 text-white"
                                required
                            />
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600">
                                <UserPlus className="w-4 h-4" />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Secure Email</label>
                        <div className="relative">
                            <input
                                type="email"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                placeholder="representative@cyberbank.com"
                                className="w-full bg-black/40 border border-white/10 rounded-2xl px-12 py-4 text-sm focus:ring-1 focus:ring-blue-500/50 outline-none transition-all placeholder:text-gray-700 text-white"
                                required
                            />
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600">
                                <Mail className="w-4 h-4" />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Certified Phone</label>
                        <div className="relative">
                            <input
                                name="phone"
                                value={form.phone}
                                onChange={handleChange}
                                placeholder="+94 7X XXX XXXX"
                                className="w-full bg-black/40 border border-white/10 rounded-2xl px-12 py-4 text-sm focus:ring-1 focus:ring-blue-500/50 outline-none transition-all placeholder:text-gray-700 text-white"
                                required
                            />
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600">
                                <Phone className="w-4 h-4" />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Master Password</label>
                        <div className="relative">
                            <input
                                type="password"
                                name="password"
                                value={form.password}
                                onChange={handleChange}
                                placeholder="••••••••"
                                className="w-full bg-black/40 border border-white/10 rounded-2xl px-12 py-4 text-sm focus:ring-1 focus:ring-blue-500/50 outline-none transition-all placeholder:text-gray-700 text-white"
                                required
                            />
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600">
                                <Lock className="w-4 h-4" />
                            </div>
                        </div>
                    </div>
                </div>

                <Button
                    type="submit"
                    disabled={loading}
                    className="w-full h-16 rounded-2xl bg-white hover:bg-white/90 text-black font-black text-xs uppercase tracking-[0.3em] transition-all shadow-xl shadow-white/5 active:scale-95 flex justify-center items-center gap-4 relative z-10"
                >
                    {loading ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                        <>
                            Provision Access
                            <CheckCircle2 className="w-5 h-5" />
                        </>
                    )}
                </Button>
            </form>
        </div>
    );
}