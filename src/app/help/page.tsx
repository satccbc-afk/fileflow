"use client";

import { motion } from "framer-motion";
import { LifeBuoy, MessageSquare, Book, FileQuestion, Mail, Search, ArrowRight } from "lucide-react";
import { useState } from "react";

export default function HelpPage() {
    const [searchQuery, setSearchQuery] = useState("");

    return (
        <main className="relative min-h-screen text-share font-sans selection:bg-secure/10">
            <div className="content-wrapper">
                <section className="container mx-auto px-6 pt-56 pb-40">
                    <div className="max-w-4xl mx-auto text-center mb-24">
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            className="pill mb-10 w-fit mx-auto"
                        >
                            Support Center
                        </motion.div>
                        <h1 className="text-[60px] md:text-[100px] font-black tracking-[-0.08em] leading-[0.8] mb-12 text-black">
                            HOW CAN WE <br />
                            <span className="text-secure">HELP?</span>
                        </h1>

                        <div className="relative max-w-2xl mx-auto">
                            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-black/30" />
                            <input
                                type="text"
                                placeholder="Search guides, tutorials, and articles..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-white border border-black/10 rounded-2xl py-6 pl-16 pr-6 text-lg font-bold placeholder:text-black/30 focus:outline-none focus:ring-2 focus:ring-secure/20 shadow-xl"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        <div className="bento-card group cursor-pointer hover:border-secure/30 transition-colors">
                            <Book className="w-10 h-10 text-secure mb-6 group-hover:scale-110 transition-transform" />
                            <h3 className="text-2xl font-black mb-4 uppercase tracking-tighter text-black">Documentation</h3>
                            <p className="text-black/40 font-bold leading-relaxed mb-8">Detailed technical guides for integrating FileDash into your workflow.</p>
                            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-secure">
                                Read Docs <ArrowRight className="w-4 h-4" />
                            </div>
                        </div>

                        <div className="bento-card group cursor-pointer hover:border-secure/30 transition-colors">
                            <FileQuestion className="w-10 h-10 text-secure mb-6 group-hover:scale-110 transition-transform" />
                            <h3 className="text-2xl font-black mb-4 uppercase tracking-tighter text-black">FAQs</h3>
                            <p className="text-black/40 font-bold leading-relaxed mb-8">Common questions about security, limits, and Pro accounts.</p>
                            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-secure">
                                View FAQs <ArrowRight className="w-4 h-4" />
                            </div>
                        </div>

                        <div className="bento-card group cursor-pointer hover:border-secure/30 transition-colors">
                            <Mail className="w-10 h-10 text-secure mb-6 group-hover:scale-110 transition-transform" />
                            <h3 className="text-2xl font-black mb-4 uppercase tracking-tighter text-black">Contact Support</h3>
                            <p className="text-black/40 font-bold leading-relaxed mb-8">Direct line to our engineering team for critical issues.</p>
                            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-secure">
                                Email Us <ArrowRight className="w-4 h-4" />
                            </div>
                        </div>
                    </div>

                    <div className="mt-24 text-center">
                        <p className="text-black/30 font-bold uppercase tracking-widest text-sm mb-4">System Status</p>
                        <div className="inline-flex items-center gap-3 px-6 py-3 bg-green-500/10 rounded-full border border-green-500/20 text-green-600 font-bold text-xs uppercase tracking-widest">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                            All Systems Operational
                        </div>
                    </div>
                </section>
            </div>
        </main>
    );
}
