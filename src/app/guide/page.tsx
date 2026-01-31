"use client";

import { motion } from "framer-motion";
import { Compass, Play, ArrowRight, Zap } from "lucide-react";



const steps = [
    { title: "Stage 1: Selection", desc: "Select your files or drag them into the Monolith portal. No size limits for Pro identities." },
    { title: "Stage 2: Processing", desc: "Our neural network encrypts your data instantly with XTS-AES 256 armor." },
    { title: "Stage 3: Launch", desc: "Files are distributed across our global mesh network for lightning fast access." },
    { title: "Stage 4: Retrieval", desc: "Send your secure downlink. Files are decrypted locally upon receipt." },
];

export default function GuidePage() {
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
                            System Guide
                        </motion.div>
                        <h1 className="text-[70px] md:text-[120px] font-black tracking-[-0.08em] leading-[0.8] mb-12 text-black">
                            HOW IT <br />
                            <span className="text-secure">WORKS.</span>
                        </h1>
                        <p className="text-xl md:text-2xl text-black/40 font-bold max-w-2xl leading-tight">
                            A step-by-step guide to moving your data across the world with ultimate peace of mind.
                        </p>
                    </div>

                    <div className="space-y-12">
                        {steps.map((step, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.1 }}
                                viewport={{ once: true }}
                                className="bento-card flex flex-col md:flex-row items-start md:items-center gap-12 group"
                            >
                                <div className="text-[80px] font-black leading-none text-black/5 group-hover:text-secure/20 transition-colors duration-500">
                                    0{i + 1}
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-3xl font-black mb-2 tracking-tighter text-black uppercase">{step.title}</h3>
                                    <p className="text-lg text-black/40 font-bold leading-tight">{step.desc}</p>
                                </div>
                                <div className="w-16 h-16 rounded-full bg-black/5 flex items-center justify-center group-hover:bg-black group-hover:text-white transition-all cursor-pointer">
                                    <ArrowRight className="w-6 h-6" />
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    <div className="mt-32 bento-card bg-secure text-white p-16 flex flex-col md:flex-row items-center justify-between gap-12">
                        <h2 className="text-4xl font-black tracking-tighter uppercase max-w-md">Ready to start your first transfer?</h2>
                        <button className="bg-white text-black px-12 py-6 rounded-2xl font-black uppercase tracking-widest hover:scale-105 transition-transform shadow-2xl">
                            Open Portal
                        </button>
                    </div>
                </section>

                
            </div>
        </main>
    );
}
