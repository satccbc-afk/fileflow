"use client";



import { Check, Sparkles, Zap, Shield, Crown, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { UpgradeButton } from "@/components/UpgradeButton";
import Link from "next/link";

const plans = [
    {
        name: "Free",
        price: "$0",
        desc: "Perfect for quick, secure sharing.",
        features: [
            "Up to 100GB per transfer",
            "XTS-AES 256 Encryption",
            "7-day link expiry",
            "AI SmartScan Security",
            "Standard Bandwidth"
        ],
        cta: "Start Free",
        popular: false
    },
    {
        name: "Pro",
        price: "$12",
        desc: "For professionals who need more power.",
        features: [
            "Up to 200GB per transfer",
            "1TB Secure Cloud Storage",
            "Custom Brand Portals",
            "Password Protected Links",
            "Ultra-Turbo Bandwidth",
            "Priority AI Support"
        ],
        cta: "Go Pro",
        popular: true
    }
];

export default function PricingPage() {
    return (
        <main className="relative min-h-screen text-share font-sans selection:bg-secure/10">
            <div className="content-wrapper">


                <section className="container mx-auto px-6 pt-56 pb-32 flex flex-col items-center">
                    <div className="text-center mb-24">
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            className="inline-flex items-center gap-2 px-6 py-2 mb-10 rounded-full bg-black text-white shadow-2xl"
                        >
                            <Crown className="w-4 h-4 text-secure animate-bounce" />
                            <span className="text-[10px] font-black uppercase tracking-[0.5em]">Simple Pricing</span>
                        </motion.div>
                        <h1 className="text-[70px] md:text-[120px] font-black tracking-[-0.08em] leading-[0.8] mb-12">
                            PICK YOUR <br />
                            <span className="text-secure">POWER.</span>
                        </h1>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 w-full max-w-5xl">
                        {plans.map((plan, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: i === 0 ? -40 : 40 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.8 }}
                                className={cn(
                                    "matte-card p-16 flex flex-col relative overflow-hidden",
                                    plan.popular ? "border-secure border-2" : ""
                                )}
                            >
                                {plan.popular && (
                                    <div className="absolute top-0 right-0 bg-secure text-white px-8 py-2 font-black text-[10px] uppercase tracking-[0.3em] rounded-bl-3xl shadow-xl">
                                        Most Popular
                                    </div>
                                )}
                                <div className="mb-12">
                                    <h3 className="text-4xl font-black mb-4">{plan.name}</h3>
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-6xl font-black">{plan.price}</span>
                                        <span className="text-seamless font-black uppercase tracking-widest text-xs">/ month</span>
                                    </div>
                                    <p className="text-seamless font-bold mt-6">{plan.desc}</p>
                                </div>

                                <ul className="space-y-6 mb-16 flex-1">
                                    {plan.features.map((feature, j) => (
                                        <li key={j} className="flex items-center gap-4 text-sm font-black text-share/80">
                                            <div className="w-6 h-6 rounded-full bg-secure/10 flex items-center justify-center text-secure">
                                                <Check className="w-3 h-3" />
                                            </div>
                                            {feature}
                                        </li>
                                    ))}
                                </ul>

                                {plan.name === "Pro" ? (
                                    <div className="w-full">
                                        <UpgradeButton />
                                    </div>
                                ) : (
                                    <Link href="/signup" className={cn(
                                        "block text-center w-full py-6 rounded-2xl font-black text-xs uppercase tracking-[0.4em] transition-all shadow-xl active:scale-95",
                                        "bg-share text-white hover:bg-secure"
                                    )}>
                                        {plan.cta}
                                    </Link>
                                )}
                            </motion.div>
                        ))}
                    </div>
                </section>


            </div>
        </main>
    );
}

// Helper for conditional classes
function cn(...classes: string[]) {
    return classes.filter(Boolean).join(' ');
}
