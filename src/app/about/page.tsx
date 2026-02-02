"use client";



import { Globe, Heart, Shield, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export default function AboutPage() {
    return (
        <main className="relative min-h-screen text-share font-sans selection:bg-secure/10">
            <div className="content-wrapper">


                <section className="container mx-auto px-6 pt-56 pb-32">
                    <div className="max-w-5xl mx-auto text-center mb-40">
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            className="inline-flex items-center gap-2 px-6 py-2 mb-10 rounded-full bg-black text-white shadow-2xl"
                        >
                            <Heart className="w-4 h-4 text-secure animate-pulse" />
                            <span className="text-[10px] font-black uppercase tracking-[0.5em]">The Philosophy</span>
                        </motion.div>
                        <h1 className="text-[70px] md:text-[140px] font-black tracking-[-0.08em] leading-[0.75] mb-12">
                            WE BELIEVE IN <br />
                            <span className="text-secure">FLOW.</span>
                        </h1>
                        <p className="text-2xl md:text-3xl text-seamless font-black uppercase tracking-tighter max-w-3xl mx-auto leading-tight">
                            A minimalist revolution in data movement. Built for creators who refuse to be slowed down by legacy systems.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-24 items-center mb-40">
                        <motion.div
                            initial={{ x: -40, opacity: 0 }}
                            whileInView={{ x: 0, opacity: 1 }}
                            className="matte-card p-16"
                        >
                            <h2 className="text-4xl font-black mb-8 underline decoration-secure decoration-8 underline-offset-[10px]">The Original Idea</h2>
                            <p className="text-lg text-seamless font-bold leading-relaxed">
                                MyDrop Transfer started as a simple question: "Why is moving large files so painful?" <br /><br />
                                Legacy platforms are cluttered with ads, slow speeds, and intrusive tracking. We wanted to build a portal that was as invisible as it was powerful. A place where data moves at the speed of thought.
                            </p>
                        </motion.div>
                        <div className="space-y-12">
                            {[
                                { icon: <Globe className="w-10 h-10" />, title: "Decentralized Vision", text: "By spreading our nodes globally, we ensure your files are always close to your recipient." },
                                { icon: <Shield className="w-10 h-10" />, title: "Absolute Privacy", text: "We believe privacy is a human right, not a feature. Our encryption is non-negotiable." },
                                { icon: <Sparkles className="w-10 h-10" />, title: "Aesthetic Excellence", text: "We believe beautiful tools inspire beautiful work." }
                            ].map((item, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ x: 40, opacity: 0 }}
                                    whileInView={{ x: 0, opacity: 1 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="flex gap-8 group"
                                >
                                    <div className="w-20 h-20 bg-matte-bg rounded-3xl flex items-center justify-center shrink-0 group-hover:bg-secure group-hover:text-white transition-all duration-500 shadow-sm shadow-black/5">
                                        {item.icon}
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-black mb-2 uppercase tracking-tight">{item.title}</h3>
                                        <p className="text-sm text-seamless font-bold">{item.text}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>


            </div>
        </main>
    );
}
