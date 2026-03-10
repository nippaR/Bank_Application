'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { useUserStore } from '@/store/useUserStore';

export default function Navbar() {
    const { data: session } = useSession();
    const [isOpen, setIsOpen] = useState(false);
    const { setUser, clearUser } = useUserStore();

    useEffect(() => {
        if (session?.user) {
            setUser(session.user as any);
        } else {
            clearUser();
        }
    }, [session, setUser, clearUser]);

    const role = session?.user?.role;
    const dashboardLink = role === 'ADMIN'
        ? '/admin/dashboard'
        : role === 'FINANCE'
            ? '/finance/dashboard'
            : '/customer/dashboard';

    return (
        <nav className="glass-morphism sticky top-0 z-50 px-6 py-4 rounded-xl bg-black/70">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                <Link href="#" className="text-xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                    Cyber Bank
                </Link>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center space-x-8">
                    {session && (
                        <>
                            <Link href={dashboardLink} className="hover:text-primary transition-colors">
                                Dashboard
                            </Link>
                            {
                                role === 'ADMIN' && (
                                    <Link href="/admin/finance-users" className="hover:text-primary transition-colors">
                                        Add New Users
                                    </Link>
                                )
                            }
                            {role === 'CUSTOMER' && (
                                <Link href="/customer/credit-card/apply" className="hover:text-primary transition-colors">
                                    Credit Card
                                </Link>
                            )}
                            {role === 'FINANCE' && (
                                <Link href="/finance/finance-users" className="hover:text-primary transition-colors">
                                    Users
                                </Link>
                            )}
                        </>
                    )}

                    {session ? (
                        <div className="flex items-center space-x-4">
                            <span className="text-sm text-gray-400">{session.user?.email}</span>
                            <button
                                onClick={() => signOut({ callbackUrl: '/login' })}
                                className="bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-lg transition-all text-sm font-medium"
                            >
                                Logout
                            </button>
                        </div>
                    ) : (
                        <Link
                            href="/login"
                            className="bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-lg transition-all text-sm font-medium"
                        >
                            Login
                        </Link>
                    )}
                </div>

                {/* Mobile Toggle */}
                <button
                    className="md:hidden p-2"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {isOpen ? (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        ) : (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                        )}
                    </svg>
                </button>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden mt-4 space-y-4 pb-4 animate-in fade-in slide-in-from-top-4">
                    {session && (
                        <>
                            <Link href={dashboardLink} className="block hover:text-primary transition-colors">
                                Dashboard
                            </Link>
                            {role === 'CUSTOMER' && (
                                <Link href="/customer/credit-card/apply" className="block hover:text-primary transition-colors">
                                    Credit Card
                                </Link>
                            )}
                            {role === 'FINANCE' && (
                                <Link href="/finance/finance-users" className="block hover:text-primary transition-colors">
                                    Users
                                </Link>
                            )}
                        </>
                    )}
                    {session ? (
                        <button
                            onClick={() => signOut({ callbackUrl: '/login' })}
                            className="w-full bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-lg transition-all text-sm font-medium"
                        >
                            Logout
                        </button>
                    ) : (
                        <Link
                            href="/login"
                            className="block w-full bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-lg transition-all text-sm font-medium text-center"
                        >
                            Login
                        </Link>
                    )}
                </div>
            )}
        </nav>
    );
}
