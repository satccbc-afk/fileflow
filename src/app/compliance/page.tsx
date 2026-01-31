"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Scale, FileCheck, Lock } from "lucide-react";



export default function CompliancePage() {
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
                            Regulatory Standards
                        </motion.div>
                        <h1 className="text-[70px] md:text-[120px] font-black tracking-[-0.08em] leading-[0.8] mb-12 text-black">
                            TRUSTED <br />
                            <span className="text-secure">STANDARDS.</span>
                        </h1>

                        <div className="space-y-12 mt-24">
                            <div className="bento-card">
                                <ShieldCheck className="w-10 h-10 text-secure mb-6" />
                                <h2 className="text-3xl font-black mb-6 uppercase tracking-tighter text-black">Industry Certifications</h2>
                                <p className="text-black/40 font-bold leading-relaxed text-lg">
                                    Fileflow Systems undergoes rigorous third-party audits annually to maintain our SOC 2 Type II and ISO 27001 certifications. We ensure that our internal protocols exceed global enterprise security standards.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="bento-card">
                                    <h3 className="text-xl font-black mb-4 uppercase text-black">SOC 2 TYPE II</h3>
                                    <p className="text-sm text-black/40 font-bold leading-relaxed">Verified security, availability, and confidentiality controls for enterprise-grade data handling.</p>
                                </div>
                                <div className="bento-card">
                                    <h3 className="text-xl font-black mb-4 uppercase text-black">ISO 27001</h3>
                                    <p className="text-sm text-black/40 font-bold leading-relaxed">International standard for managing information security systems and data protection.</p>
                                </div>
                            </div>

                            <div className="bento-card border-none bg-black text-white p-16">
                                <h2 className="text-3xl font-black mb-4 uppercase tracking-tighter text-secure">Zero-Liability Infrastructure</h2>
                                <p className="text-white/40 font-medium leading-relaxed">
                                    Because we never store your encryption keys, we cannot be forced to disclose your data. Our infrastructure is legally and technically designed to protect your privacy at all costs.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                
            </div>
        </main>
    );
}
