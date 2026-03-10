"use client";

import { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";

export default function LoginForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [serverError, setServerError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setServerError("");
        setLoading(true);

        const result = await signIn("credentials", {
            email,
            password,
            redirect: false,
        });

        setLoading(false);

        if (result?.error) {
            setServerError(result.error);
            return;
        }

        window.location.href = "/redirect-by-role";
    };

    return (
        <div className="w-full max-w-lg mx-auto p-1 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <form
                onSubmit={handleLogin}
                className="premium-card p-12 space-y-10 border border-white/10 rounded-[24px] relative overflow-hidden shadow-2xl"
            >
                {/* Decorative element */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-3xl animate-pulse" />

                <div className="text-center space-y-3 relative z-10">
                    <h1 className="text-4xl font-extrabold bg-gradient-to-r from-white via-blue-200 to-gray-500 bg-clip-text text-transparent">
                        Welcome Back
                    </h1>
                    <p className="text-gray-400 text-sm font-medium tracking-wide">
                        Secure Access to your Cyber Bank Account
                    </p>
                </div>

                <div className="space-y-5 relative z-10">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">
                            Email Address
                        </label>
                        <div className="relative group">
                            <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-500 group-focus-within:text-primary transition-colors">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.206" />
                                </svg>
                            </span>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="name@company.com"
                                className="w-full bg-black/40 border border-gray-700 rounded-xl pl-12 pr-4 py-4 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-gray-600 backdrop-blur-sm"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between items-center px-1">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                                Password
                            </label>
                        </div>
                        <div className="relative group">
                            <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-500 group-focus-within:text-primary transition-colors">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                            </span>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••••••"
                                className="w-full bg-black/40 border border-gray-700 rounded-xl pl-12 pr-4 py-4 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-gray-600 backdrop-blur-sm"
                                required
                            />
                        </div>
                    </div>
                </div>

                <div className="pt-2 relative z-10">
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-white hover:bg-gray-100 text-black py-4 rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2 hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:scale-[1.02] active:scale-95 shadow-xl"
                    >
                        {loading ? (
                            <div className="flex items-center gap-2">
                                <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                                Identifying...
                            </div>
                        ) : (
                            "Sign In to Account"
                        )}
                    </button>
                </div>

                {serverError && (
                    <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm flex items-center gap-3 animate-in fade-in zoom-in-95 relative z-10">
                        <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="font-medium">{serverError}</span>
                    </div>
                )}

                <p className="text-center text-gray-500 text-xs font-medium relative z-10 pb-2">
                    Don&apos;t have an account? <Link href="/register" className="text-primary hover:text-white transition-colors font-bold ml-1">Create one now</Link>
                </p>
            </form>
        </div>
    );
}