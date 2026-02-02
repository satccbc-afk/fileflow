"use client";

import Link from "next/link";
import { Twitter, Github, Linkedin, Instagram } from "lucide-react";

export function Footer() {
    return (
        <footer className="relative z-10 bg-[#fafafa] border-t border-black/5 pt-48 pb-24 overflow-hidden">
            <div className="container mx-auto px-6 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-24 mb-32">
                    <div className="col-span-1 lg:col-span-2">
                        <h2 className="text-4xl font-black font-heading mb-10 tracking-tighter text-share">MyDrop Transfer_</h2>
                        <p className="text-seamless text-xl max-w-sm leading-relaxed mb-12 font-black uppercase tracking-tighter">
                            World class infrastructure for high speed data movement. Secure by design.
                        </p>
                        <div className="flex gap-4 mb-20">
                            {[
                                { icon: Instagram, href: "#" },
                                { icon: Twitter, href: "#" },
                                { icon: Github, href: "#" },
                                { icon: Linkedin, href: "#" }
                            ].map((item, i) => (
                                <a
                                    key={i}
                                    href={item.href}
                                    className="w-10 h-10 bg-black/5 rounded-full flex items-center justify-center text-black/40 hover:bg-black hover:text-white transition-all hover:-translate-y-1"
                                >
                                    <item.icon className="w-4 h-4" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Links Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
                        {[
                            {
                                head: "Product",
                                links: [
                                    { name: "Features", href: "#" },
                                    { name: "Security", href: "#" },
                                    { name: "Pricing", href: "#" },
                                    { name: "API", href: "/docs" }
                                ]
                            },
                            {
                                head: "Company",
                                links: [
                                    { name: "About", href: "/about" },
                                    { name: "Careers", href: "#" },
                                    { name: "Blog", href: "#" },
                                    { name: "Contact", href: "/contact" }
                                ]
                            },
                            {
                                head: "Legal",
                                links: [
                                    { name: "Privacy", href: "/privacy" },
                                    { name: "Terms", href: "/terms" },
                                    { name: "GDPR", href: "/gdpr" },
                                    { name: "Compliance", href: "/compliance" }
                                ]
                            },
                            {
                                head: "Resources",
                                links: [
                                    { name: "Help Center", href: "/help" },
                                    { name: "Status", href: "#" },
                                    { name: "Report Abuse", href: "#" },
                                    { name: "Community", href: "#" }
                                ]
                            }
                        ].map((col, i) => (
                            <div key={i}>
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-black/30 mb-6">{col.head}</h4>
                                <ul className="space-y-4">
                                    {col.links.map((link, j) => (
                                        <li key={j}>
                                            <Link href={link.href} className="text-[11px] font-bold uppercase tracking-wider text-black/60 hover:text-secure transition-colors">
                                                {link.name}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-black/5 pt-10 flex flex-col md:flex-row items-center justify-between gap-6 text-[9px] font-black uppercase tracking-[0.2em] text-black/20">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        <span>All Systems Operational</span>
                    </div>
                    <div>
                        © 2026 MYDROP TRANSFER <span className="mx-6">//</span> MATTE_V2.0
                    </div>
                </div>
            </div>
        </footer>
    );
}
