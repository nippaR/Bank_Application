"use client";

import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    creditCardSchema,
    type CreditCardInput,
} from "@/validations/credit-card";

export default function CreditCardForm() {
    const [serverMessage, setServerMessage] = useState("");
    const [serverError, setServerError] = useState("");

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<CreditCardInput>({
        resolver: zodResolver(creditCardSchema),
        defaultValues: {
            fullName: "",
            dateOfBirth: "",
            nicPassportNumber: "",
            residentialAddress: "",
            mobilePhone: "",
            email: "",
            employmentStatus: "EMPLOYED",
            employerName: "",
            monthlyIncome: "",
            city: "",
            postalCode: "",
        },
    });

    const onSubmit: SubmitHandler<CreditCardInput> = async (values) => {
        setServerMessage("");
        setServerError("");

        try {
            const response = await fetch("/api/credit-card/apply", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(values),
            });

            const result = await response.json();

            if (!response.ok) {
                setServerError(result.message || "Submission failed");
                return;
            }

            setServerMessage(result.message || "Application submitted");
            reset();
        } catch {
            setServerError("Something went wrong");
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto p-1 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="premium-card p-8 space-y-10 border-2 border-gray-400 rounded-3xl shadow-2xl relative overflow-hidden"
            >
                {/* Decorative background element */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -mr-32 -mt-32 blur-3xl animate-pulse" />

                <div className="text-center space-y-3 relative z-10 border-b border-gray-800 pb-8">
                    <h1 className="text-4xl font-extrabold bg-gradient-to-r from-white via-blue-200 to-gray-500 bg-clip-text text-transparent italic">
                        Elite Credit Card Application
                    </h1>
                    <p className="text-gray-400 text-sm font-medium tracking-widest uppercase">
                        Secure your financial future with Cyber Bank
                    </p>
                </div>

                <div className="space-y-12 relative z-10">
                    {/* Section 1: Personal Information */}
                    <section className="space-y-6">
                        <div className="flex items-center gap-3 border-l-4 border-primary pl-4">
                            <h2 className="text-lg font-bold text-white uppercase tracking-wider">Personal Details</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Full Name</label>
                                <div className="relative group">
                                    <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-500 group-focus-within:text-primary transition-colors">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                    </span>
                                    <input
                                        {...register("fullName")}
                                        placeholder="Enter your full name"
                                        className="w-full bg-black/40 border border-gray-700 rounded-2xl pl-12 pr-4 py-4 text-sm focus:ring-2 focus:ring-primary/40 focus:border-primary outline-none transition-all placeholder:text-gray-600 backdrop-blur-sm"
                                    />
                                </div>
                                {errors.fullName && <p className="text-[10px] text-red-500 ml-2 font-bold uppercase">{errors.fullName.message}</p>}
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Date of Birth</label>
                                <div className="relative group">
                                    <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-500 group-focus-within:text-primary transition-colors">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                    </span>
                                    <input
                                        type="date"
                                        {...register("dateOfBirth")}
                                        className="w-full bg-black/40 border border-gray-700 rounded-2xl pl-12 pr-4 py-4 text-sm focus:ring-2 focus:ring-primary/40 focus:border-primary outline-none transition-all placeholder:text-gray-600 backdrop-blur-sm [color-scheme:dark]"
                                    />
                                </div>
                                {errors.dateOfBirth && <p className="text-[10px] text-red-500 ml-2 font-bold uppercase">{errors.dateOfBirth.message}</p>}
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">NIC / Passport Number</label>
                                <div className="relative group">
                                    <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-500 group-focus-within:text-primary transition-colors">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 012-2h2a2 2 0 012 2v1m-6 0a2 2 0 002 2h2a2 2 0 002-2m-6 0V4a2 2 0 012-2h2a2 2 0 012 2v2" />
                                        </svg>
                                    </span>
                                    <input
                                        {...register("nicPassportNumber")}
                                        placeholder="Identity Number"
                                        className="w-full bg-black/40 border border-gray-700 rounded-2xl pl-12 pr-4 py-4 text-sm focus:ring-2 focus:ring-primary/40 focus:border-primary outline-none transition-all placeholder:text-gray-600 backdrop-blur-sm"
                                    />
                                </div>
                                {errors.nicPassportNumber && <p className="text-[10px] text-red-500 ml-2 font-bold uppercase">{errors.nicPassportNumber.message}</p>}
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Mobile Phone</label>
                                <div className="relative group">
                                    <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-500 group-focus-within:text-primary transition-colors">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                        </svg>
                                    </span>
                                    <input
                                        {...register("mobilePhone")}
                                        placeholder="+94 7X XXX XXXX"
                                        className="w-full bg-black/40 border border-gray-700 rounded-2xl pl-12 pr-4 py-4 text-sm focus:ring-2 focus:ring-primary/40 focus:border-primary outline-none transition-all placeholder:text-gray-600 backdrop-blur-sm"
                                    />
                                </div>
                                {errors.mobilePhone && <p className="text-[10px] text-red-500 ml-2 font-bold uppercase">{errors.mobilePhone.message}</p>}
                            </div>

                            <div className="md:col-span-2 space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Email Address</label>
                                <div className="relative group">
                                    <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-500 group-focus-within:text-primary transition-colors">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                    </span>
                                    <input
                                        type="email"
                                        {...register("email")}
                                        placeholder="yourname@domain.com"
                                        className="w-full bg-black/40 border border-gray-700 rounded-2xl pl-12 pr-4 py-4 text-sm focus:ring-2 focus:ring-primary/40 focus:border-primary outline-none transition-all placeholder:text-gray-600 backdrop-blur-sm"
                                    />
                                </div>
                                {errors.email && <p className="text-[10px] text-red-500 ml-2 font-bold uppercase">{errors.email.message}</p>}
                            </div>

                            <div className="md:col-span-2 space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Residential Address</label>
                                <div className="relative group">
                                    <span className="absolute top-4 left-4 text-gray-500 group-focus-within:text-primary transition-colors">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                    </span>
                                    <textarea
                                        {...register("residentialAddress")}
                                        placeholder="Street, City, Province"
                                        rows={3}
                                        className="w-full bg-black/40 border border-gray-700 rounded-2xl pl-12 pr-4 py-4 text-sm focus:ring-2 focus:ring-primary/40 focus:border-primary outline-none transition-all placeholder:text-gray-600 backdrop-blur-sm resize-none"
                                    />
                                </div>
                                {errors.residentialAddress && <p className="text-[10px] text-red-500 ml-2 font-bold uppercase">{errors.residentialAddress.message}</p>}
                            </div>
                        </div>
                    </section>

                    {/* Section 2: Employment & Income */}
                    <section className="space-y-6">
                        <div className="flex items-center gap-3 border-l-4 border-blue-400 pl-4">
                            <h2 className="text-lg font-bold text-white uppercase tracking-wider">Financial Status</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Employment Status</label>
                                <div className="relative group">
                                    <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-500 group-focus-within:text-primary transition-colors">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                    </span>
                                    <select
                                        {...register("employmentStatus")}
                                        className="w-full bg-black/40 border border-gray-700 rounded-2xl pl-12 pr-4 py-4 text-sm focus:ring-2 focus:ring-primary/40 focus:border-primary outline-none transition-all appearance-none cursor-pointer backdrop-blur-sm"
                                    >
                                        <option value="EMPLOYED" className="bg-gray-900">Employed</option>
                                        <option value="SELF_EMPLOYED" className="bg-gray-900">Self Employed</option>
                                        <option value="STUDENT" className="bg-gray-900">Student</option>
                                        <option value="UNEMPLOYED" className="bg-gray-900">Unemployed</option>
                                    </select>
                                    <span className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-gray-500">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </span>
                                </div>
                                {errors.employmentStatus && <p className="text-[10px] text-red-500 ml-2 font-bold uppercase">{errors.employmentStatus.message}</p>}
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Employer / Company</label>
                                <div className="relative group">
                                    <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-500 group-focus-within:text-primary transition-colors">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                        </svg>
                                    </span>
                                    <input
                                        {...register("employerName")}
                                        placeholder="Organization Name"
                                        className="w-full bg-black/40 border border-gray-700 rounded-2xl pl-12 pr-4 py-4 text-sm focus:ring-2 focus:ring-primary/40 focus:border-primary outline-none transition-all placeholder:text-gray-600 backdrop-blur-sm"
                                    />
                                </div>
                                {errors.employerName && <p className="text-[10px] text-red-500 ml-2 font-bold uppercase">{errors.employerName.message}</p>}
                            </div>

                            <div className="md:col-span-2 space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Monthly Income (LKR)</label>
                                <div className="relative group">
                                    <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-500 group-focus-within:text-primary transition-colors font-bold">
                                        Rs.
                                    </span>
                                    <input
                                        type="number"
                                        step="0.01"
                                        {...register("monthlyIncome")}
                                        placeholder="0.00"
                                        className="w-full bg-black/40 border border-gray-700 rounded-2xl pl-12 pr-4 py-4 text-sm focus:ring-2 focus:ring-primary/40 focus:border-primary outline-none transition-all placeholder:text-gray-600 backdrop-blur-sm"
                                    />
                                </div>
                                {errors.monthlyIncome && <p className="text-[10px] text-red-500 ml-2 font-bold uppercase">{errors.monthlyIncome.message}</p>}
                            </div>
                        </div>
                    </section>

                    {/* Section 3: Localization */}
                    <section className="space-y-6 pb-4">
                        <div className="flex items-center gap-3 border-l-4 border-blue-600 pl-4">
                            <h2 className="text-lg font-bold text-white uppercase tracking-wider">Regional Data</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">City</label>
                                <input
                                    {...register("city")}
                                    placeholder="Enter City"
                                    className="w-full bg-black/40 border border-gray-700 rounded-2xl px-6 py-4 text-sm focus:ring-2 focus:ring-primary/40 focus:border-primary outline-none transition-all placeholder:text-gray-600 backdrop-blur-sm"
                                />
                                {errors.city && <p className="text-[10px] text-red-500 ml-2 font-bold uppercase">{errors.city.message}</p>}
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Postal Code</label>
                                <input
                                    {...register("postalCode")}
                                    placeholder="XXXXX"
                                    className="w-full bg-black/40 border border-gray-700 rounded-2xl px-6 py-4 text-sm focus:ring-2 focus:ring-primary/40 focus:border-primary outline-none transition-all placeholder:text-gray-600 backdrop-blur-sm"
                                />
                                {errors.postalCode && <p className="text-[10px] text-red-500 ml-2 font-bold uppercase">{errors.postalCode.message}</p>}
                            </div>
                        </div>
                    </section>
                </div>

                <div className="pt-6 border-t border-gray-800 relative z-10">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-white hover:bg-gray-100 text-black py-4 rounded-2xl font-black uppercase tracking-[0.2em] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-3 hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:scale-[1.01] active:scale-95 shadow-2xl group"
                    >
                        {isSubmitting ? (
                            <>
                                <div className="w-5 h-5 border-3 border-black/20 border-t-black rounded-full animate-spin" />
                                <span className="animate-pulse">Processing Application...</span>
                            </>
                        ) : (
                            <>
                                Submit Application
                                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                            </>
                        )}
                    </button>
                </div>

                {serverMessage && (
                    <div className="p-5 rounded-2xl bg-green-500/10 border border-green-500/20 text-green-500 text-sm flex items-center gap-4 animate-in fade-in zoom-in-95 relative z-10 shadow-lg">
                        <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center shrink-0">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <div>
                            <p className="font-black uppercase tracking-widest text-xs">Success</p>
                            <p className="opacity-80">{serverMessage}</p>
                        </div>
                    </div>
                )}

                {serverError && (
                    <div className="p-5 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm flex items-center gap-4 animate-in fade-in zoom-in-95 relative z-10 shadow-lg">
                        <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center shrink-0">
                            <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div>
                            <p className="font-black uppercase tracking-widest text-xs">Error</p>
                            <p className="opacity-80">{serverError}</p>
                        </div>
                    </div>
                )}
            </form>
        </div>
    );
}