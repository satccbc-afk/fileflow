"use client";

import { motion } from "framer-motion";
import { Shield, EyeOff, Lock, Footprints } from "lucide-react";



export default function PrivacyPage() {
    return (
        <main className="relative min-h-screen text-share font-sans selection:bg-secure/10">
            <div className="content-wrapper">
                

                <section className="container mx-auto px-6 pt-56 pb-40">
                    <div className="max-w-4xl mx-auto">
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            className="pill mb-10 w-fit"
                        >
                            Protocol v1.0
                        </motion.div>
                        <h1 className="text-[70px] md:text-[120px] font-black tracking-[-0.08em] leading-[0.8] mb-12">
                            NEURAL <br />
                            <span className="text-secure">PRIVACY.</span>
                        </h1>

                        <div className="space-y-20 mt-24">
                            <div className="bento-card">
                                <h2 className="text-3xl font-black mb-6 uppercase tracking-tighter">Zero-Knowledge Commitment</h2>
                                <p className="text-seamless font-bold leading-relaxed text-lg">
                                    We believe that privacy is a fundamental human right. Our architecture is built so that we never have access to your encryption keys, your files, or your identity. Data is encrypted locally before transmission.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="bento-card">
                                    <Footprints className="w-10 h-10 text-secure mb-6" />
                                    <h3 className="text-xl font-black mb-4 uppercase">No Tracking</h3>
                                    <p className="text-sm text-seamless font-bold">We do not store IP addresses, browser fingerprints, or metadata. Your digital footprint is non-existent within our network.</p>
                                </div>
                                <div className="bento-card">
                                    <Lock className="w-10 h-10 text-secure mb-6" />
                                    <h3 className="text-xl font-black mb-4 uppercase">Ephemeral Storage</h3>
                                    <p className="text-sm text-seamless font-bold">Files are automatically purged from our global mesh network the moment they expire. No residual data, ever.</p>
                                </div>
                            </div>

                            <div className="bento-card border-none bg-black text-white p-16">
                                <h2 className="text-3xl font-black mb-8 uppercase tracking-tighter text-secure">GDPR & CCPA READY</h2>
                                <p className="text-white/60 font-medium leading-loose">
                                    Fileflow Systems is fully compliant with global data protection regulations. We don't just follow the law; we set the standard for how data should be treated in the 21st century.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                
            </div>
        </main>
    );
}
