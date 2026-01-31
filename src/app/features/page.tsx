"use client";



import { Shield, Zap, Globe, Share2, BrainCircuit, Sparkles, Wand2, Lock, MousePointer2, Layers } from "lucide-react";
import { motion } from "framer-motion";

const features = [
    {
        icon: <Zap className="w-8 h-8 text-secure" />,
        title: "Quantum Parallel Uploads",
        desc: "We don't just send files; we splinter them across a global mesh network. Experience 500% faster delivery than traditional cloud storage."
    },
    {
        icon: <Shield className="w-8 h-8 text-secure" />,
        title: "Neural Key XTS-AES 256",
        desc: "Your data is encrypted by AI-hardened protocols before it even leaves your device. Not even we can see what you share."
    },
    {
        icon: <Lock className="w-8 h-8 text-secure" />,
        title: "Self-Destructing Vaults",
        desc: "Set precise expiration dates or single-downlink limits. Your data exists only as long as you want it to."
    },
    {
        icon: <MousePointer2 className="w-8 h-8 text-secure" />,
        title: "Zero-Knowledge Transfer",
        desc: "No accounts, no tracking, no friction. Just drag, drop, and launch. The purest way to move data."
    },
    {
        icon: <Layers className="w-8 h-8 text-secure" />,
        title: "Custom Brand Portals",
        desc: "Impress your clients with a custom background and logo on every transfer page. Professionalism, automated."
    },
    {
        icon: <BrainCircuit className="w-8 h-8 text-secure" />,
        title: "AI SmartScan Defense",
        desc: "Every file is scanned by our heuristic neural network to detect threats without breaching your privacy."
    }
];

export default function FeaturesPage() {
    return (
        <main className="relative min-h-screen text-share font-sans selection:bg-secure/10">
            <div className="content-wrapper">
                

                <section className="container mx-auto px-6 pt-56 pb-32">
                    <div className="max-w-4xl mb-32">
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            className="pill mb-10"
                        >
                            Engineering Excellence
                        </motion.div>
                        <h1 className="text-[70px] md:text-[120px] font-black tracking-[-0.08em] leading-[0.8] mb-12">
                            POWERED BY <br />
                            <span className="text-secure">QUANTUM</span> TECH.
                        </h1>
                        <p className="text-xl md:text-2xl text-seamless font-black uppercase tracking-tighter max-w-2xl leading-tight">
                            A complete rethink of how the world moves data. Faster, safer, and more beautiful than ever before.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {features.map((feature, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                viewport={{ once: true }}
                                className="bento-card group"
                            >
                                <div className="mb-10 w-20 h-20 bg-matte-bg rounded-3xl flex items-center justify-center group-hover:bg-secure group-hover:text-white transition-all duration-500">
                                    {feature.icon}
                                </div>
                                <h3 className="text-2xl font-black mb-4 tracking-tighter">{feature.title}</h3>
                                <p className="text-sm text-seamless font-bold leading-relaxed">{feature.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </section>

                
            </div>
        </main>
    );
}
