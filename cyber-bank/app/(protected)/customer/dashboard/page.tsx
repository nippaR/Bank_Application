import Link from "next/link"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { CreditCard, History, Wallet, ArrowRight, LayoutDashboard, FileText } from "lucide-react"

export default async function CustomerDashboard() {
    const session = await getServerSession(authOptions);
    const applicationCount = await prisma.creditCardApplication.count({
        where: { customerId: (session?.user as any).id }
    });
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                        Welcome Back
                    </h1>
                    <p className="text-gray-400 mt-1">Manage your accounts and credit card applications.</p>
                </div>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                <Link href="/customer/applications" className="premium-card p-8 flex flex-col justify-between group hover:translate-y-[-4px] transition-all border-l-4 border-blue-600 rounded-[24px]">
                    <div className="space-y-6">
                        <div className="flex justify-between items-start">
                            <div className="w-14 h-14 rounded-2xl bg-blue-600/10 flex items-center justify-center text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500">
                                <FileText className="w-7 h-7" />
                            </div>
                            <span className="bg-blue-600/10 text-blue-500 text-[10px] px-3 py-1 rounded-full border border-blue-500/20 font-black tracking-widest">TRACK</span>
                        </div>
                        <div>
                            <h3 className="text-2xl font-black text-white tracking-tight">My Applications</h3>
                            <p className="text-5xl font-black mt-3 text-white tracking-tighter group-hover:scale-110 transition-transform origin-left duration-500">{applicationCount}</p>
                            <p className="text-[10px] text-gray-500 mt-2 font-black uppercase tracking-[0.2em]">Total Submitted</p>
                        </div>
                    </div>
                    <div className="mt-8 text-blue-400 font-bold text-sm group-hover:text-blue-300 flex items-center gap-2 group-hover:gap-4 transition-all uppercase tracking-widest">
                        View List
                        <ArrowRight className="w-4 h-4" />
                    </div>
                </Link>

                <div className="premium-card p-8 flex flex-col justify-between group rounded-[24px] hover:border-purple-500/20">
                    <div className="space-y-6">
                        <div className="w-14 h-14 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-400 group-hover:bg-purple-600 group-hover:text-white transition-all duration-500">
                            <Wallet className="w-7 h-7" />
                        </div>
                        <div>
                            <h3 className="text-2xl font-black text-white tracking-tight">Accounts</h3>
                            <p className="text-sm text-gray-400 mt-2 font-medium leading-relaxed">Check your balance and transaction history in real-time.</p>
                        </div>
                    </div>
                    <button className="mt-8 text-purple-400 font-bold text-sm hover:text-purple-300 flex items-center gap-2 group-hover:translate-x-2 transition-transform uppercase tracking-widest">
                        Explore
                        <ArrowRight className="w-4 h-4" />
                    </button>
                </div>

                <div className="premium-card p-8 flex flex-col justify-between group border-dashed border-2 border-white/5 opacity-60 rounded-[24px]">
                    <div className="space-y-6">
                        <div className="w-14 h-14 rounded-2xl bg-gray-500/10 flex items-center justify-center text-gray-500">
                            <History className="w-7 h-7" />
                        </div>
                        <div>
                            <h3 className="text-2xl font-black text-white/50 tracking-tight">History</h3>
                            <p className="text-sm text-gray-600 mt-2 font-medium italic">Coming soon: Full ledger view.</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid gap-8 md:grid-cols-2">
                <Link href="/customer/credit-card/apply" className="premium-card p-10 bg-gradient-to-br from-blue-600/20 to-transparent border border-blue-500/20 group hover:translate-y-[-4px] transition-all rounded-[32px] overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 rounded-full -mr-32 -mt-32 blur-[80px] pointer-events-none" />
                    <div className="flex justify-between items-start relative z-10">
                        <div className="space-y-6">
                            <h2 className="text-3xl font-black text-white tracking-tighter">Need a New Card?</h2>
                            <p className="text-gray-400 max-w-sm text-lg leading-relaxed">Apply for our premium credit cards with exclusive benefits and fast-track approval.</p>
                            <div className="inline-flex items-center gap-3 bg-white text-black px-8 py-4 rounded-2xl font-black text-sm group-hover:bg-blue-600 group-hover:text-white transition-all shadow-2xl">
                                Apply Now
                                <CreditCard className="w-5 h-5" />
                            </div>
                        </div>
                        <CreditCard className="w-24 h-24 text-blue-500/10 group-hover:text-blue-500/40 transition-all duration-700 group-hover:rotate-12 translate-x-4" />
                    </div>
                </Link>

                <div className="premium-card p-10 bg-white/5 border border-white/5 flex flex-col justify-center rounded-[32px] group">
                    <h2 className="text-2xl font-black text-white mb-3 tracking-tight">Elite Support</h2>
                    <p className="text-gray-400 text-lg mb-8 leading-relaxed">Professional assistance available 24/7 for our distinguished customers.</p>
                    <div className="flex gap-8">
                        <button className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 hover:text-white transition-colors underline underline-offset-8 decoration-blue-600/30">Knowledge Base</button>
                        <button className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 hover:text-white transition-colors underline underline-offset-8 decoration-blue-600/30">Secure Chat</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
