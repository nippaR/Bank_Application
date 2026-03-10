"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { registerSchema, type RegisterInput } from "@/validations/register";

export default function RegisterForm() {
    const [serverMessage, setServerMessage] = useState("");
    const [serverError, setServerError] = useState("");

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<RegisterInput>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            fullName: "",
            email: "",
            phone: "",
            password: "",
            confirmPassword: "",
        },
    });

    const onSubmit = async (values: RegisterInput) => {
        setServerMessage("");
        setServerError("");

        try {
            const response = await fetch("/api/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(values),
            });

            const result = await response.json();

            if (!response.ok) {
                setServerError(result.message || "Registration failed");
                return;
            }

            setServerMessage(result.message || "Registration successful");
            reset();
        } catch {
            setServerError("Something went wrong");
        }
    };

    return (
        <div className="w-full max-w-lg mx-auto p-1 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="premium-card p-8 space-y-6 border-2 border-gray-400 rounded-2xl shadow-2xl relative overflow-hidden"
            >
                {/* Decorative element */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-3xl animate-pulse" />

                <div className="text-center space-y-2 relative z-10">
                    <h1 className="text-3xl font-extrabold bg-gradient-to-r from-white via-blue-200 to-gray-500 bg-clip-text text-transparent">
                        Create Account
                    </h1>
                    <p className="text-gray-400 text-sm font-medium tracking-wide">
                        Join Cyber Bank for a premium financial experience
                    </p>
                </div>

                <div className="space-y-4 relative z-10">
                    {/* Full Name */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                        <div className="relative group">
                            <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-500 group-focus-within:text-primary transition-colors">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </span>
                            <input
                                {...register("fullName")}
                                placeholder="John Doe"
                                className="w-full bg-black/40 border border-gray-700 rounded-xl pl-12 pr-4 py-3.5 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-gray-600 backdrop-blur-sm"
                            />
                        </div>
                        {errors.fullName && (
                            <p className="mt-1 text-xs text-red-500 ml-1 font-medium">{errors.fullName.message}</p>
                        )}
                    </div>

                    {/* Email */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
                        <div className="relative group">
                            <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-500 group-focus-within:text-primary transition-colors">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                            </span>
                            <input
                                type="email"
                                {...register("email")}
                                placeholder="john@example.com"
                                className="w-full bg-black/40 border border-gray-700 rounded-xl pl-12 pr-4 py-3.5 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-gray-600 backdrop-blur-sm"
                            />
                        </div>
                        {errors.email && (
                            <p className="mt-1 text-xs text-red-500 ml-1 font-medium">{errors.email.message}</p>
                        )}
                    </div>

                    {/* Phone */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Phone Number</label>
                        <div className="relative group">
                            <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-500 group-focus-within:text-primary transition-colors">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                            </span>
                            <input
                                {...register("phone")}
                                placeholder="+94 7X XXX XXXX"
                                className="w-full bg-black/40 border border-gray-700 rounded-xl pl-12 pr-4 py-3.5 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-gray-600 backdrop-blur-sm"
                            />
                        </div>
                        {errors.phone && (
                            <p className="mt-1 text-xs text-red-500 ml-1 font-medium">{errors.phone.message}</p>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Password */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Password</label>
                            <div className="relative group">
                                <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-500 group-focus-within:text-primary transition-colors">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                </span>
                                <input
                                    type="password"
                                    {...register("password")}
                                    placeholder="••••••••"
                                    className="w-full bg-black/40 border border-gray-700 rounded-xl pl-11 pr-4 py-3.5 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-gray-600 backdrop-blur-sm"
                                />
                            </div>
                            {errors.password && (
                                <p className="mt-1 text-xs text-red-500 ml-1 font-medium">{errors.password.message}</p>
                            )}
                        </div>

                        {/* Confirm Password */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Confirm</label>
                            <div className="relative group">
                                <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-500 group-focus-within:text-primary transition-colors">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.055 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                    </svg>
                                </span>
                                <input
                                    type="password"
                                    {...register("confirmPassword")}
                                    placeholder="••••••••"
                                    className="w-full bg-black/40 border border-gray-700 rounded-xl pl-11 pr-4 py-3.5 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-gray-600 backdrop-blur-sm"
                                />
                            </div>
                            {errors.confirmPassword && (
                                <p className="mt-1 text-xs text-red-500 ml-1 font-medium italic">
                                    {errors.confirmPassword.message}
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                <div className="pt-2 relative z-10">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-white hover:bg-gray-100 text-black py-4 rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2 hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:scale-[1.02] active:scale-95 shadow-xl"
                    >
                        {isSubmitting ? (
                            <div className="flex items-center gap-2">
                                <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                                Processing...
                            </div>
                        ) : (
                            "Create Your Account"
                        )}
                    </button>
                </div>

                {serverMessage && (
                    <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-500 text-sm flex items-center gap-3 animate-in fade-in zoom-in-95 relative z-10">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="font-medium">{serverMessage}</span>
                    </div>
                )}

                {serverError && (
                    <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm flex items-center gap-3 animate-in fade-in zoom-in-95 relative z-10">
                        <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="font-medium">{serverError}</span>
                    </div>
                )}

                <p className="text-center text-gray-500 text-xs font-medium relative z-10 pb-2">
                    Already have an account? <Link href="/login" className="text-primary hover:text-white transition-colors font-bold ml-1">Sign In</Link>
                </p>
            </form>
        </div>
    );
}