"use client";



import { Shield, Lock, EyeOff, Server, Terminal, Cpu } from "lucide-react";
import { motion } from "framer-motion";

export default function SecurityPage() {
    return (
        <main className="relative min-h-screen text-share font-sans selection:bg-secure/10">
            <div className="content-wrapper">
                

                <section className="container mx-auto px-6 pt-56 pb-32">
                    <div className="max-w-5xl mb-40">
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            className="inline-flex items-center gap-2 px-6 py-2 mb-10 rounded-full bg-black text-white shadow-2xl"
                        >
                            <Shield className="w-4 h-4 text-secure animate-pulse" />
                            <span className="text-[10px] font-black uppercase tracking-[0.5em]">Hardened Infrastructure</span>
                        </motion.div>
                        <h1 className="text-[70px] md:text-[140px] font-black tracking-[-0.08em] leading-[0.75] mb-12">
                            ZERO <br />
                            <span className="text-secure">VULNERABILITY.</span>
                        </h1>
                        <p className="text-2xl md:text-3xl text-seamless font-black uppercase tracking-tighter max-w-3xl leading-tight">
                            Enterprise-grade encryption for everyone. We build for the most paranoid, so you can share with peace of mind.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 mb-40">
                        <div className="space-y-24">
                            {[
                                {
                                    icon: <Lock className="w-12 h-12" />,
                                    title: "End-to-End Encryption",
                                    text: "Your files are encrypted using XTS-AES-256 before upload. The encryption keys never leave your browser, ensuring zero-knowledge privacy."
                                },
                                {
                                    icon: <EyeOff className="w-12 h-12" />,
                                    title: "Anonymous Transfers",
                                    text: "We do not track IP addresses, browser fingerprints, or metadata. Your identity is as secure as your data."
                                },
                                {
                                    icon: <Terminal className="w-12 h-12" />,
                                    title: "AI Threat Detection",
                                    text: "Our heuristic engine identifies malicious binary patterns in real-time without ever decrypting the underlying content."
                                }
                            ].map((item, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ x: -40, opacity: 0 }}
                                    whileInView={{ x: 0, opacity: 1 }}
                                    className="flex gap-10 items-start"
                                >
                                    <div className="w-24 h-24 bg-matte-bg rounded-3xl flex items-center justify-center shrink-0 shadow-lg shadow-black/5">
                                        {item.icon}
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-black mb-4 uppercase tracking-tighter">{item.title}</h3>
                                        <p className="text-seamless font-bold leading-relaxed">{item.text}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            whileInView={{ scale: 1, opacity: 1 }}
                            className="matte-card p-16 bg-black text-white relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-12">
                                <Server className="w-16 h-16 text-secure opacity-30" />
                            </div>
                            <h2 className="text-5xl font-black mb-12 tracking-tighter">THE INFRASTRUCTURE</h2>
                            <div className="space-y-12">
                                <div className="flex gap-6">
                                    <Cpu className="w-6 h-6 text-secure shrink-0" />
                                    <div>
                                        <h4 className="font-black text-xs uppercase tracking-[0.2em] mb-2">Distributed Mesh</h4>
                                        <p className="text-sm text-white/60 font-medium">Regional routing ensures data is never stored in a single point of failure.</p>
                                    </div>
                                </div>
                                <div className="flex gap-6">
                                    <Shield className="w-6 h-6 text-secure shrink-0" />
                                    <div>
                                        <h4 className="font-black text-xs uppercase tracking-[0.2em] mb-2">SOC2 Type II Ready</h4>
                                        <p className="text-sm text-white/60 font-medium">Compliance-first architecture designed for legal and medical industries.</p>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-20 p-8 bg-white/5 rounded-2xl border border-white/10 font-mono text-[10px] text-green-400">
                                {`> SYSTEM_LOG: BOOTING_NEURAL_SHIELD\n> STATUS: 100%_SECURE\n> ENCRYPTION_LAYER: ACTIVE\n> THREAT_LEVEL: ZERO`}
                            </div>
                        </motion.div>
                    </div>
                </section>

                
            </div>
        </main>
    );
}
