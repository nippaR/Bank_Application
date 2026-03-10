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

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Link href="/customer/applications" className="premium-card p-6 flex flex-col justify-between group hover:scale-[1.02] transition-all border-l-4 border-blue-500">
                    <div className="space-y-4">
                        <div className="flex justify-between items-start">
                            <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-all">
                                <FileText className="w-6 h-6" />
                            </div>
                            <span className="bg-blue-500/10 text-blue-500 text-[10px] px-2 py-0.5 rounded-full border border-blue-500/20 font-bold">MANAGE</span>
                        </div>
                        <div>
                            <h3 className="text-xl font-semibold">My Applications</h3>
                            <p className="text-4xl font-bold mt-2 text-white">{applicationCount}</p>
                            <p className="text-xs text-gray-500 mt-1 uppercase tracking-wider">Total Submitted</p>
                        </div>
                    </div>
                    <div className="mt-6 text-blue-400 font-medium group-hover:text-blue-300 flex items-center gap-2">
                        View Applications
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                </Link>

                <div className="premium-card p-6 flex flex-col justify-between group">
                    <div className="space-y-4">
                        <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400 group-hover:bg-purple-500 group-hover:text-white transition-all">
                            <Wallet className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-xl font-semibold text-white">Accounts</h3>
                            <p className="text-sm text-gray-400 mt-1">Check your balance and transaction history.</p>
                        </div>
                    </div>
                    <button className="mt-6 text-purple-400 font-medium hover:text-purple-300 flex items-center gap-2 group-hover:translate-x-1 transition-transform">
                        Explore
                        <ArrowRight className="w-4 h-4" />
                    </button>
                </div>

                <div className="premium-card p-6 flex flex-col justify-between group border-dashed border-2 border-white/5 opacity-60">
                    <div className="space-y-4">
                        <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center text-green-400">
                            <History className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-xl font-semibold text-white/50">History</h3>
                            <p className="text-sm text-gray-600 mt-1 italic">Coming soon: View your past transactions.</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Link href="/customer/credit-card/apply" className="premium-card p-8 bg-gradient-to-br from-blue-600/20 to-transparent border border-blue-500/20 group hover:scale-[1.01] transition-all">
                    <div className="flex justify-between items-start">
                        <div className="space-y-4">
                            <h2 className="text-2xl font-bold text-white">Need a New Card?</h2>
                            <p className="text-gray-400 max-w-sm">Apply for our premium credit cards with exclusive benefits and fast approval.</p>
                            <div className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-xl font-semibold group-hover:bg-blue-500 transition-colors">
                                Apply Now
                                <CreditCard className="w-4 h-4" />
                            </div>
                        </div>
                        <CreditCard className="w-16 h-16 text-blue-500/20 group-hover:text-blue-500/40 transition-colors" />
                    </div>
                </Link>

                <div className="premium-card p-8 bg-gradient-to-br from-gray-800/50 to-transparent border border-white/5 flex flex-col justify-center">
                    <h2 className="text-xl font-bold text-white mb-2">Help Center</h2>
                    <p className="text-gray-400 text-sm mb-6">Have questions? Our support team is available 24/7 to assist you with your banking needs.</p>
                    <div className="flex gap-4">
                        <button className="text-sm font-medium text-gray-300 hover:text-white underline underline-offset-4">FAQ</button>
                        <button className="text-sm font-medium text-gray-300 hover:text-white underline underline-offset-4">Contact Support</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
