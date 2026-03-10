"use client";

import { useState } from "react";
import {
    User, Mail, Phone, Calendar, Briefcase,
    Building2, MapPin, Hash, IndianRupee,
    ArrowLeft, Send, AlertCircle, CheckCircle2
} from "lucide-react";
import Link from "next/link";

type Props = {
    application: {
        id: string;
        fullName: string;
        dateOfBirth: string | Date;
        nicPassportNumber: string;
        residentialAddress: string;
        mobilePhone: string;
        email: string;
        employmentStatus: "EMPLOYED" | "SELF_EMPLOYED" | "STUDENT" | "UNEMPLOYED";
        employerName: string;
        monthlyIncome: number;
        city: string;
        postalCode: string;
    };
};

export default function EditRequestForm({ application }: Props) {
    const [form, setForm] = useState({
        fullName: application.fullName,
        dateOfBirth: new Date(application.dateOfBirth).toISOString().split("T")[0],
        nicPassportNumber: application.nicPassportNumber,
        residentialAddress: application.residentialAddress,
        mobilePhone: application.mobilePhone,
        email: application.email,
        employmentStatus: application.employmentStatus,
        employerName: application.employerName,
        monthlyIncome: application.monthlyIncome.toString(),
        city: application.city,
        postalCode: application.postalCode,
    });

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        setForm((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");
        setError("");

        try {
            const response = await fetch(`/api/credit-card/update-request`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    applicationId: application.id,
                    ...form,
                }),
            });

            const result = await response.json();

            if (!response.ok) {
                if (result.errors) {
                    const firstError = Object.values(result.errors.fieldErrors)[0] as string[];
                    setError(firstError?.[0] || "Validation failed");
                } else {
                    setError(result.message || "Failed to submit edit request");
                }
                return;
            }

            setMessage(result.message || "Your edit request has been submitted for review.");
        } catch (err) {
            setError("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const InputWrapper = ({ label, icon: Icon, children }: { label: string, icon: any, children: React.ReactNode }) => (
        <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2 ml-1">
                <Icon className="w-3 h-3 text-blue-400" />
                {label}
            </label>
            {children}
        </div>
    );

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <Link
                        href="/customer/applications"
                        className="inline-flex items-center text-sm text-gray-400 hover:text-blue-400 transition-colors mb-2 group"
                    >
                        <ArrowLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" />
                        Back to Applications
                    </Link>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                        Request Application Edit
                    </h1>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="premium-card p-6 md:p-8 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                    {/* Personal Information */}
                    <div className="space-y-6">
                        <h3 className="text-sm font-bold text-white/50 border-b border-white/5 pb-2 uppercase tracking-widest">Personal Details</h3>

                        <InputWrapper label="Full Name" icon={User}>
                            <input
                                name="fullName"
                                value={form.fullName}
                                onChange={handleChange}
                                required
                                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 outline-none transition-all"
                            />
                        </InputWrapper>

                        <InputWrapper label="Date of Birth" icon={Calendar}>
                            <input
                                type="date"
                                name="dateOfBirth"
                                value={form.dateOfBirth}
                                onChange={handleChange}
                                required
                                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 outline-none transition-all [color-scheme:dark]"
                            />
                        </InputWrapper>

                        <InputWrapper label="NIC / Passport" icon={Hash}>
                            <input
                                name="nicPassportNumber"
                                value={form.nicPassportNumber}
                                onChange={handleChange}
                                required
                                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 outline-none transition-all font-mono"
                            />
                        </InputWrapper>

                        <div className="grid grid-cols-2 gap-4">
                            <InputWrapper label="Mobile Phone" icon={Phone}>
                                <input
                                    name="mobilePhone"
                                    value={form.mobilePhone}
                                    onChange={handleChange}
                                    required
                                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 outline-none transition-all"
                                />
                            </InputWrapper>
                            <InputWrapper label="Email" icon={Mail}>
                                <input
                                    type="email"
                                    name="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    required
                                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 outline-none transition-all"
                                />
                            </InputWrapper>
                        </div>
                    </div>

                    {/* Professional & Location */}
                    <div className="space-y-6">
                        <h3 className="text-sm font-bold text-white/50 border-b border-white/5 pb-2 uppercase tracking-widest">Professional & Location</h3>

                        <div className="grid grid-cols-2 gap-4">
                            <InputWrapper label="Employment Status" icon={Briefcase}>
                                <select
                                    name="employmentStatus"
                                    value={form.employmentStatus}
                                    onChange={handleChange}
                                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 outline-none transition-all"
                                >
                                    <option value="EMPLOYED">Employed</option>
                                    <option value="SELF_EMPLOYED">Self Employed</option>
                                    <option value="STUDENT">Student</option>
                                    <option value="UNEMPLOYED">Unemployed</option>
                                </select>
                            </InputWrapper>
                            <InputWrapper label="Monthly Income" icon={IndianRupee}>
                                <input
                                    type="number"
                                    name="monthlyIncome"
                                    value={form.monthlyIncome}
                                    onChange={handleChange}
                                    required
                                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 outline-none transition-all font-semibold"
                                />
                            </InputWrapper>
                        </div>

                        <InputWrapper label="Employer Name" icon={Building2}>
                            <input
                                name="employerName"
                                value={form.employerName}
                                onChange={handleChange}
                                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 outline-none transition-all"
                            />
                        </InputWrapper>

                        <InputWrapper label="Residential Address" icon={MapPin}>
                            <textarea
                                name="residentialAddress"
                                value={form.residentialAddress}
                                onChange={handleChange}
                                required
                                rows={2}
                                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 outline-none transition-all resize-none"
                            />
                        </InputWrapper>

                        <div className="grid grid-cols-2 gap-4">
                            <InputWrapper label="City" icon={Building2}>
                                <input
                                    name="city"
                                    value={form.city}
                                    onChange={handleChange}
                                    required
                                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 outline-none transition-all"
                                />
                            </InputWrapper>
                            <InputWrapper label="Postal Code" icon={Hash}>
                                <input
                                    name="postalCode"
                                    value={form.postalCode}
                                    onChange={handleChange}
                                    required
                                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 outline-none transition-all"
                                />
                            </InputWrapper>
                        </div>
                    </div>
                </div>

                <div className="pt-6 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="text-gray-500 text-xs flex items-start gap-2 max-w-md">
                        <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                        <p>Changes will be submitted for manual review by our finance team. You will be notified once the review is complete.</p>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full md:w-auto bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-8 py-3 rounded-xl transition-all font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-900/20 group"
                    >
                        {loading ? "Processing..." : "Submit Edit Request"}
                        <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-0.5 transition-transform" />
                    </button>
                </div>

                {message && (
                    <div className="bg-green-500/10 border border-green-500/20 p-4 rounded-xl flex items-center gap-3 text-green-400 animate-in zoom-in-95 duration-300">
                        <CheckCircle2 className="w-5 h-5" />
                        <p className="text-sm font-medium">{message}</p>
                    </div>
                )}

                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl flex items-center gap-3 text-red-400 animate-in zoom-in-95 duration-300">
                        <AlertCircle className="w-5 h-5" />
                        <p className="text-sm font-medium">{error}</p>
                    </div>
                )}
            </form>
        </div>
    );
}