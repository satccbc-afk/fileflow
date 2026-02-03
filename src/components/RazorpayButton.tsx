"use client";

import { CreditCard, Loader2 } from "lucide-react";
import { useState } from "react";
import { useSession } from "next-auth/react";

declare global {
    interface Window {
        Razorpay: any;
    }
}

export function RazorpayButton() {
    const { data: session } = useSession();
    const [loading, setLoading] = useState(false);

    const handlePayment = async () => {
        if (!session) {
            window.location.href = "/login?callbackUrl=/dashboard";
            return;
        }

        try {
            setLoading(true);

            // 1. Create order on server
            const orderRes = await fetch("/api/razorpay/order", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ amount: 999 }), // Example 999 INR
            });

            const order = await orderRes.json();
            if (order.error) throw new Error(order.error);

            // 2. Initialize Razorpay Checkout
            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                amount: order.amount,
                currency: order.currency,
                name: "MyDrop Transfer",
                description: "Pro Plan Subscription",
                order_id: order.id,
                handler: async function (response: any) {
                    // 3. Verify payment on server
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
                        alert("Upgrade Successful!");
                        window.location.reload();
                    } else {
                        alert("Payment Verification Failed");
                    }
                },
                prefill: {
                    name: session.user?.name,
                    email: session.user?.email,
                },
                theme: {
                    color: "#000000",
                },
            };

            const rzp = new window.Razorpay(options);
            rzp.open();

        } catch (error: any) {
            console.error(error);
            alert(error.message || "Payment initialization failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handlePayment}
            disabled={loading}
            className="w-full group relative px-6 py-6 bg-secure text-white rounded-[2rem] font-black uppercase text-[10px] tracking-widest hover:scale-105 transition-all shadow-xl active:scale-95 disabled:opacity-50 disabled:pointer-events-none mt-4 overflow-hidden"
        >
            <span className="relative z-10 flex items-center gap-2 justify-center">
                {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                    <CreditCard className="w-4 h-4" />
                )}
                Pay with Razorpay (INR)
            </span>
        </button>
    );
}
