"use client";

import { Sparkles, Loader2 } from "lucide-react";
import { useState } from "react";

export function UpgradeButton() {
    const [loading, setLoading] = useState(false);

    const handleUpgrade = async () => {
        try {
            setLoading(true);
            const response = await fetch("/api/stripe/checkout", {
                method: "POST",
            });
            if (response.status === 401) {
                window.location.href = "/api/auth/signin?callbackUrl=/dashboard";
                return;
            }

            let data;
            try {
                data = await response.json();
            } catch (e) {
                throw new Error(`Server returned status ${response.status}`);
            }

            if (data.url) {
                window.location.href = data.url;
            } else {
                alert(`Error: ${data.error || data.message || "Failed to create checkout session"}`);
            }
        } catch (error: any) {
            console.error(error);
            alert(error.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handleUpgrade}
            disabled={loading}
            className="w-full group relative px-6 py-6 bg-black text-white rounded-[2rem] font-black uppercase text-[10px] tracking-widest hover:scale-105 transition-all shadow-xl active:scale-95 disabled:opacity-50 disabled:pointer-events-none overflow-hidden"
        >
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-20 group-hover:opacity-40 transition-opacity" />
            <span className="relative z-10 flex items-center gap-2">
                {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                    <Sparkles className="w-4 h-4 text-purple-300" />
                )}
                Upgrade to Pro
            </span>
        </button>
    );
}
