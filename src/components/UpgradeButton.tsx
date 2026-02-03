"use client";

import { Sparkles, Loader2, CreditCard, ShieldCheck, X } from "lucide-react";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";

declare global {
    interface Window {
        Razorpay: any;
    }
}

export function UpgradeButton() {
    const { data: session } = useSession();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState<string | null>(null);

    const handleStripeUpgrade = async () => {
        try {
            setLoading('stripe');
            const response = await fetch("/api/stripe/checkout", {
                method: "POST",
            });
            if (response.status === 401) {
                window.location.href = "/api/auth/signin?callbackUrl=/dashboard";
                return;
            }

            const data = await response.json();
            if (data.url) {
                window.location.href = data.url;
            } else {
                alert(data.error || "Stripe checkout failed");
            }
        } catch (error: any) {
            alert(error.message || "Something went wrong");
        } finally {
            setLoading(null);
        }
    };

    const handleRazorpayUpgrade = async () => {
        if (!session) {
            window.location.href = "/login?callbackUrl=/dashboard";
            return;
        }

        try {
            setLoading('razorpay');

            const orderRes = await fetch("/api/razorpay/order", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ amount: 999 }), // 999 INR
            });

            const order = await orderRes.json();
            if (order.error) throw new Error(order.error);

            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                amount: order.amount,
                currency: order.currency,
                name: "MyDrop Transfer",
                description: "Pro Plan Lifetime/Subscription",
                order_id: order.id,
                handler: async function (response: any) {
                    const verifyRes = await fetch("/api/razorpay/verify", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                        }),
                    });

                    const verification = await verifyRes.json();
                    if (verification.success) {
                        alert("Upgrade Successful! Welcome to Pro.");
                        window.location.reload();
                    } else {
                        alert("Verification failed");
                    }
                },
                prefill: {
                    name: session.user?.name,
                    email: session.user?.email,
                },
                theme: { color: "#000000" },
            };

            const rzp = new window.Razorpay(options);
            rzp.open();

        } catch (error: any) {
            console.error(error);
            alert(error.message || "Razorpay initialization failed");
        } finally {
            setLoading(null);
        }
    };

    return (
        <>
            <button
                onClick={() => setIsModalOpen(true)}
                className="group relative px-8 py-5 bg-black text-white rounded-[2rem] font-black uppercase text-[10px] tracking-[0.2em] hover:scale-105 transition-all shadow-2xl active:scale-95 overflow-hidden"
            >
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-20 group-hover:opacity-40 transition-opacity" />
                <span className="relative z-10 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-purple-300" />
                    Unlock Pro
                </span>
            </button>

            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/40 backdrop-blur-xl">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="bg-white rounded-[3rem] w-full max-w-md overflow-hidden shadow-2xl border border-black/5"
                        >
                            <div className="p-10 text-center relative">
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="absolute top-8 right-8 p-2 hover:bg-black/5 rounded-full transition-colors"
                                >
                                    <X className="w-5 h-5 opacity-20" />
                                </button>

                                <div className="w-20 h-20 bg-black rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-2xl">
                                    <Sparkles className="w-10 h-10 text-white" />
                                </div>
                                <h2 className="text-3xl font-black tracking-tight mb-2">Upgrade to Pro</h2>
                                <p className="text-[10px] font-black uppercase tracking-widest text-black/30 mb-10">Choose your preferred gateway</p>

                                <div className="space-y-4 text-left mb-10">
                                    {[
                                        "1TB Encrypted Storage",
                                        "100GB Single File Upload",
                                        "Custom Expiry & Passwords",
                                        "Priority Support Network"
                                    ].map((feature, i) => (
                                        <div key={i} className="flex items-center gap-3 text-xs font-bold text-black/60">
                                            <ShieldCheck className="w-4 h-4 text-secure" />
                                            {feature}
                                        </div>
                                    ))}
                                </div>

                                <div className="grid gap-4">
                                    <button
                                        onClick={handleStripeUpgrade}
                                        disabled={!!loading}
                                        className="w-full group relative py-6 bg-black text-white rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-indigo-600 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                                    >
                                        {loading === 'stripe' ? <Loader2 className="w-4 h-4 animate-spin" /> : <CreditCard className="w-4 h-4" />}
                                        Pay with Stripe (USD)
                                    </button>

                                    <button
                                        onClick={handleRazorpayUpgrade}
                                        disabled={!!loading}
                                        className="w-full group relative py-6 bg-secure text-white rounded-2xl font-black uppercase text-[10px] tracking-widest hover:brightness-110 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                                    >
                                        {loading === 'razorpay' ? <Loader2 className="w-4 h-4 animate-spin" /> : <CreditCard className="w-4 h-4" />}
                                        Pay with Razorpay (INR)
                                    </button>
                                </div>

                                <p className="mt-8 text-[9px] font-bold text-black/20 uppercase tracking-widest">Secure Checkout • Instant Access</p>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
}
