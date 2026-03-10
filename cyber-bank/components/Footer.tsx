'use client';

import Link from 'next/link';
import { Shield, Mail, Phone, MapPin, Twitter, Linkedin, Github, Facebook } from 'lucide-react';

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="mt-24 border-t border-white/10 bg-black/60 backdrop-blur-[16px] relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                    {/* Brand Section */}
                    <div className="space-y-6">
                        <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                            Cyber Bank
                        </Link>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            Experience the Sri Lanka future of digital banking with Cyber Bank. Secure, fast, and built for your modern lifestyle.
                        </p>
                        <div className="flex items-center gap-4">
                            <a href="#" className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:bg-blue-500/10 hover:text-blue-400 hover:border-blue-500/20 transition-all">
                                <Twitter className="w-4 h-4" />
                            </a>
                            <a href="#" className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:bg-blue-500/10 hover:text-blue-400 hover:border-blue-500/20 transition-all">
                                <Linkedin className="w-4 h-4" />
                            </a>
                            <a href="#" className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:bg-blue-500/10 hover:text-blue-400 hover:border-blue-500/20 transition-all">
                                <Github className="w-4 h-4" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-white font-bold mb-6">Quick Links</h4>
                        <ul className="space-y-4">
                            <li><Link href="/" className="text-gray-400 hover:text-blue-400 text-sm transition-colors">Home</Link></li>
                            <li><Link href="/customer/dashboard" className="text-gray-400 hover:text-blue-400 text-sm transition-colors">Dashboard</Link></li>
                            <li><Link href="/customer/credit-card/apply" className="text-gray-400 hover:text-blue-400 text-sm transition-colors">Credit Cards</Link></li>
                            <li><Link href="#" className="text-gray-400 hover:text-blue-400 text-sm transition-colors">Financial Services</Link></li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h4 className="text-white font-bold mb-6">Support</h4>
                        <ul className="space-y-4">
                            <li><Link href="#" className="text-gray-400 hover:text-blue-400 text-sm transition-colors">Help Center</Link></li>
                            <li><Link href="#" className="text-gray-400 hover:text-blue-400 text-sm transition-colors">Contact Us</Link></li>
                            <li><Link href="#" className="text-gray-400 hover:text-blue-400 text-sm transition-colors">Security Details</Link></li>
                            <li><Link href="#" className="text-gray-400 hover:text-blue-400 text-sm transition-colors">Fraud Prevention</Link></li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 className="text-white font-bold mb-6">Contact Us</h4>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3 text-sm text-gray-400">
                                <MapPin className="w-4 h-4 text-blue-400 mt-0.5 shrink-0" />
                                <span>The Optimize Galle Road,<br />Kollupitiya</span>
                            </li>
                            <li className="flex items-center gap-3 text-sm text-gray-400">
                                <Phone className="w-4 h-4 text-blue-400 shrink-0" />
                                <span>+94 77 1234 567</span>
                            </li>
                            <li className="flex items-center gap-3 text-sm text-gray-400">
                                <Mail className="w-4 h-4 text-blue-400 shrink-0" />
                                <span>support@cyberbank.com</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-gray-500 text-xs">
                        © {currentYear} Cyber Bank. All rights reserved. Built with precision for digital excellence.
                    </p>
                    <div className="flex gap-6">
                        <Link href="#" className="text-gray-500 hover:text-gray-400 text-xs transition-colors">Privacy Policy</Link>
                        <Link href="#" className="text-gray-500 hover:text-gray-400 text-xs transition-colors">Terms of Service</Link>
                        <Link href="#" className="text-gray-500 hover:text-gray-400 text-xs transition-colors">Cookie Policy</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
