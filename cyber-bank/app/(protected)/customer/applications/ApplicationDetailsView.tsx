'use client';

import { Eye, CreditCard, User, Mail, Phone, Calendar, Shield, MapPin, Briefcase, IndianRupee } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

interface ApplicationDetailsViewProps {
    application: {
        id: string;
        fullName: string;
        email: string;
        mobilePhone: string;
        dateOfBirth: string;
        nicPassportNumber: string;
        residentialAddress: string;
        employmentStatus: string;
        employerName: string;
        monthlyIncome: number;
        city: string;
        postalCode: string;
        status: string;
        submittedAt: string;
        rejectionReason?: string | null;
    };
}

export default function ApplicationDetailsView({ application }: ApplicationDetailsViewProps) {
    return (
        <Dialog>
            <DialogTrigger render={(props) => (
                <Button
                    {...props}
                    variant="outline"
                    className="w-full bg-white/5 hover:bg-white/10 text-white px-6 py-4 rounded-xl transition-all font-bold text-sm flex items-center justify-center gap-2 border border-white/10 group-hover:border-blue-500/30 shadow-lg mt-4"
                >
                    <Eye className="w-4 h-4 text-blue-400" />
                    View Details
                </Button>
            )} />
            <DialogContent className="bg-[#0a0a0c]/80 backdrop-blur-[16px] border-white/10 text-white sm:max-w-[700px] max-h-[85vh] overflow-y-auto custom-scrollbar p-0 rounded-[32px]">
                <div className="sticky top-0 bg-[#0a0a0c]/80 backdrop-blur-xl z-20 px-8 py-6 border-b border-white/5">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-black tracking-tight flex items-center gap-3">
                            <CreditCard className="w-6 h-6 text-blue-400" />
                            Application Profile
                        </DialogTitle>
                        <DialogDescription className="text-gray-500 font-medium">
                            Full application data submitted on {new Date(application.submittedAt).toLocaleDateString()}
                        </DialogDescription>
                    </DialogHeader>
                </div>

                <div className="p-8 space-y-12">
                    {/* Personal Information */}
                    <div className="space-y-6">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-400 flex items-center gap-3">
                            <User className="w-3.5 h-3.5" />
                            Personal Information
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                            <div className="space-y-1.5 p-4 rounded-2xl bg-white/5 border border-white/5">
                                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Full Name</p>
                                <p className="text-sm font-semibold text-white">{application.fullName}</p>
                            </div>
                            <div className="space-y-1.5 p-4 rounded-2xl bg-white/5 border border-white/5">
                                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Date of Birth</p>
                                <p className="text-sm font-semibold text-white">{new Date(application.dateOfBirth).toLocaleDateString()}</p>
                            </div>
                            <div className="space-y-1.5 p-4 rounded-2xl bg-white/5 border border-white/5">
                                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">NIC / Passport</p>
                                <p className="text-sm font-semibold text-white font-mono">{application.nicPassportNumber}</p>
                            </div>
                            <div className="space-y-1.5 p-4 rounded-2xl bg-white/5 border border-white/5">
                                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Contact Number</p>
                                <p className="text-sm font-semibold text-white">{application.mobilePhone}</p>
                            </div>
                        </div>
                    </div>

                    {/* Financial/Employment */}
                    <div className="space-y-6">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-400 flex items-center gap-3">
                            <Briefcase className="w-3.5 h-3.5" />
                            Professional & Income
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                            <div className="space-y-1.5 p-4 rounded-2xl bg-white/5 border border-white/5">
                                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Employment Status</p>
                                <p className="text-sm font-semibold text-white">{application.employmentStatus}</p>
                            </div>
                            <div className="space-y-1.5 p-4 rounded-2xl bg-white/5 border border-white/5">
                                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Monthly Income</p>
                                <p className="text-sm font-semibold text-green-400 flex items-center gap-1">
                                    <IndianRupee className="w-3.5 h-3.5" />
                                    {application.monthlyIncome.toLocaleString()}
                                </p>
                            </div>
                            <div className="sm:col-span-2 space-y-1.5 p-4 rounded-2xl bg-white/5 border border-white/5">
                                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Employer Name</p>
                                <p className="text-sm font-semibold text-white">{application.employerName}</p>
                            </div>
                        </div>
                    </div>

                    {/* Residential */}
                    <div className="space-y-6">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-400 flex items-center gap-3">
                            <MapPin className="w-3.5 h-3.5" />
                            Residential Details
                        </h4>
                        <div className="space-y-4">
                            <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-1.5">
                                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Full Address</p>
                                <p className="text-sm font-semibold text-white leading-relaxed">{application.residentialAddress}</p>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-1.5">
                                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">City</p>
                                    <p className="text-sm font-semibold text-white">{application.city}</p>
                                </div>
                                <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-1.5">
                                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Postal Code</p>
                                    <p className="text-sm font-semibold text-white font-mono">{application.postalCode}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
