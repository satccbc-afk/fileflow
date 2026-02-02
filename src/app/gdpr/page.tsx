"use client";

import { motion } from "framer-motion";
import { Shield, FileText, UserCheck, Lock, Globe } from "lucide-react";



export default function GDPRPage() {
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
                            Data Protection
                        </motion.div>
                        <h1 className="text-[70px] md:text-[120px] font-black tracking-[-0.08em] leading-[0.8] mb-12 text-black">
                            GDPR <br />
                            <span className="text-secure">COMPLIANT.</span>
                        </h1>

                        <div className="space-y-12 mt-24">
                            <div className="bento-card">
                                <Globe className="w-10 h-10 text-secure mb-6" />
                                <h2 className="text-3xl font-black mb-6 uppercase tracking-tighter text-black">Your Privacy Rights</h2>
                                <p className="text-black/40 font-bold leading-relaxed text-lg">
                                    We are fully committed to the General Data Protection Regulation (GDPR). Our platform is designed with "Privacy by Design" at its core, ensuring that your data is always under your control.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="bento-card">
                                    <FileText className="w-8 h-8 text-secure mb-4" />
                                    <h3 className="text-xl font-black uppercase text-black">Right to Erasure</h3>
                                    <p className="text-sm text-black/40 font-bold leading-relaxed">You have the absolute right to have your data purged. On FileDash, this is automated—files are deleted permanently after expiry.</p>
                                </div>
                                <div className="bento-card">
                                    <UserCheck className="w-8 h-8 text-secure mb-4" />
                                    <h3 className="text-xl font-black uppercase text-black">Data Portability</h3>
                                    <p className="text-sm text-black/40 font-bold leading-relaxed">You can always retrieve your data in its original format. We never lock you into proprietary formats or systems.</p>
                                </div>
                            </div>

                            <div className="bento-card">
                                <Shield className="w-10 h-10 text-secure mb-6" />
                                <h2 className="text-2xl font-black mb-4 uppercase text-black">Data Protection Officer</h2>
                                <p className="text-black/40 font-bold leading-relaxed">
                                    Our dedicated DPO ensures that FileDash adheres to the highest standards of data security and regulatory compliance every single day.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>


            </div>
        </main>
    );
}
