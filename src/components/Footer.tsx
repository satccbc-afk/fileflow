"use client";

import Link from "next/link";
import { Twitter, Github, Linkedin, ArrowUpRight } from "lucide-react";

export function Footer() {
    return (
        <footer className="relative z-10 bg-[#fafafa] border-t border-black/5 pt-48 pb-24 overflow-hidden">
            <div className="container mx-auto px-6 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-24 mb-32">
                    <div className="col-span-1 lg:col-span-2">
                        <h2 className="text-4xl font-black font-heading mb-10 tracking-tighter text-share">Fileflow_</h2>
                        <p className="text-seamless text-xl max-w-sm leading-relaxed mb-12 font-black uppercase tracking-tighter">
                            World class infrastructure for high speed data movement. Secure by design.
                        </p>
                        <div className="flex gap-4">
                            {[Twitter, Github, Linkedin].map((Icon, idx) => (
                                <a
                                    key={idx}
                                    href="#"
                                    className="w-14 h-14 rounded-2xl bg-white border border-black/5 flex items-center justify-center text-seamless hover:text-secure shadow-sm hover:shadow-xl transition-all duration-500"
                                >
                                    <Icon className="w-5 h-5" />
                                </a>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h4 className="font-black mb-10 text-[10px] uppercase tracking-[0.5em] text-share/20">SYSTEM</h4>
                        <ul className="space-y-6 text-xs font-black uppercase tracking-widest text-[#DC2626]">
                            <li><Link href="/features" className="hover:text-black transition-colors">Features</Link></li>
                            <li><Link href="/security" className="hover:text-black transition-colors">Security</Link></li>
                            <li><Link href="/nodes" className="hover:text-black transition-colors">Nodes</Link></li>
                            <li><Link href="/api" className="hover:text-black transition-colors">API</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-black mb-10 text-[10px] uppercase tracking-[0.5em] text-share/20">SUPPORT</h4>
                        <ul className="space-y-6 text-xs font-black uppercase tracking-widest text-[#DC2626]">
                            <li><Link href="/docs" className="hover:text-black transition-colors">Docs</Link></li>
                            <li><Link href="/guide" className="hover:text-black transition-colors">Guide</Link></li>
                            <li><Link href="/status" className="hover:text-black transition-colors">Status</Link></li>
                            <li><Link href="/contact" className="hover:text-black transition-colors">Contact</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-black mb-10 text-[10px] uppercase tracking-[0.5em] text-share/20">LEGAL</h4>
                        <ul className="space-y-6 text-xs font-black uppercase tracking-widest text-[#DC2626]">
                            <li><Link href="/privacy" className="hover:text-black transition-colors">Privacy</Link></li>
                            <li><Link href="/terms" className="hover:text-black transition-colors">Terms</Link></li>
                            <li><Link href="/compliance" className="hover:text-black transition-colors">Compliance</Link></li>
                            <li><Link href="/gdpr" className="hover:text-black transition-colors">GDPR</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="pt-12 border-t border-black/5 flex flex-col md:flex-row justify-between items-center gap-10">
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-share/20">
                        © 2026 FILEFLOW SYSTEMS <span className="mx-6">//</span> MATTE_V2.0
                    </p>
                    <div className="flex items-center gap-12">
                        <span className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.4em] text-green-600/40">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                            EDGE: ONLINE
                        </span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
