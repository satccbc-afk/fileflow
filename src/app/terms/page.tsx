"use client";

import { motion } from "framer-motion";



export default function TermsPage() {
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
                            Legal v2.1
                        </motion.div>
                        <h1 className="text-[70px] md:text-[120px] font-black tracking-[-0.08em] leading-[0.8] mb-12">
                            SYSTEM <br />
                            <span className="text-secure">TERMS.</span>
                        </h1>

                        <div className="space-y-12 mt-24">
                            <div className="bento-card">
                                <h2 className="text-2xl font-black mb-6 uppercase">1. Usage Protocol</h2>
                                <p className="text-seamless font-bold leading-relaxed">By accessing MyDrop Transfer, you agree to engage with the system as a professional creator. The use of the platform for distributing malicious code or illegal content is prohibited and will result in immediate identity revocation.</p>
                            </div>

                            <div className="bento-card">
                                <h2 className="text-2xl font-black mb-6 uppercase">2. Quantum Limits</h2>
                                <p className="text-seamless font-bold leading-relaxed">Free identities are limited to 100GB per transfer. High-capacity conduits are reserved for Pro identities. We reserve the right to throttle bandwidth if the global mesh network detection system identifies non-human usage patterns.</p>
                            </div>

                            <div className="bento-card">
                                <h2 className="text-2xl font-black mb-6 uppercase">3. Data Stewardship</h2>
                                <p className="text-seamless font-bold leading-relaxed">You retain full ownership of all data pushed through our pipes. MyDrop Transfer Systems acts only as the neutral transmission layer. We do not index, search, or backup your files beyond the specified expiry period.</p>
                            </div>
                        </div>
                    </div>
                </section>


            </div>
        </main>
    );
}
