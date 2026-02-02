"use client";

import { motion } from "framer-motion";
import { Book, Search, FileText, HelpCircle } from "lucide-react";



const articles = [
    { title: "Getting Started", desc: "Learn how to send your first file in seconds." },
    { title: "Pro Accounts", desc: "Unlock massive transmission pipes and branding." },
    { title: "Security Guide", desc: "Understand how our zero-knowledge system works." },
    { title: "API Reference", desc: "Technical details for integrating FileDash." },
];

export default function DocsPage() {
    return (
        <main className="relative min-h-screen text-share font-sans selection:bg-secure/10">
            <div className="content-wrapper">


                <section className="container mx-auto px-6 pt-56 pb-40">
                    <div className="max-w-4xl mb-32">
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            className="pill mb-10 w-fit"
                        >
                            Knowledge Base
                        </motion.div>
                        <h1 className="text-[70px] md:text-[120px] font-black tracking-[-0.08em] leading-[0.8] mb-12 text-black">
                            HELP <br />
                            <span className="text-secure">CENTER.</span>
                        </h1>
                        <div className="relative max-w-xl group mt-12">
                            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-black/20 group-focus-within:text-secure transition-colors" />
                            <input
                                type="text"
                                placeholder="Ask a question..."
                                className="w-full bg-white border-2 border-black/5 rounded-2xl py-6 pl-16 pr-6 font-bold text-lg text-black placeholder:text-black/20 focus:outline-none focus:border-black transition-all shadow-sm"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {articles.map((article, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                viewport={{ once: true }}
                                className="bento-card group flex items-center gap-10"
                            >
                                <div className="w-20 h-20 bg-black/[0.03] rounded-3xl flex-shrink-0 flex items-center justify-center group-hover:bg-secure group-hover:text-white transition-all duration-500">
                                    <FileText className="w-8 h-8" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-black mb-1 tracking-tighter text-black uppercase">{article.title}</h3>
                                    <p className="text-sm text-black/40 font-bold leading-relaxed">{article.desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </section>


            </div>
        </main>
    );
}
