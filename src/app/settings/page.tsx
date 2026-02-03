"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Loader2, User, Shield, CreditCard, Save } from "lucide-react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";

export default function SettingsPage() {
    const { data: session, update } = useSession();
    const router = useRouter();
    const [name, setName] = useState(session?.user?.name || "");
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState("");

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage("");

        try {
            const res = await fetch("/api/user/update", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name }),
            });

            if (res.ok) {
                await update({ name }); // Update session
                setMessage("Profile updated successfully!");
                router.refresh();
            } else {
                setMessage("Failed to update profile.");
            }
        } catch (error) {
            setMessage("An error occurred.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-[#FAFAFA] pb-20 font-sans">
            <Navbar session={session} />
            <div className="pt-40 px-6 max-w-4xl mx-auto">
                <h1 className="text-4xl font-black font-heading mb-8">Settings</h1>

                <div className="grid gap-8">
                    {/* PROFILE CARD */}
                    <div className="bg-white p-8 rounded-[2rem] border border-black/5 shadow-xl">
                        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-black/5">
                            <div className="w-12 h-12 bg-black/5 rounded-xl flex items-center justify-center text-black/40">
                                <User className="w-6 h-6" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold">Profile Details</h2>
                                <p className="text-xs text-black/40 font-bold uppercase tracking-wider">Manage your public identity</p>
                            </div>
                        </div>

                        <form onSubmit={handleUpdateProfile} className="space-y-6 max-w-lg">
                            <div>
                                <label className="text-[10px] font-black uppercase tracking-widest text-black/30 mb-2 block">Full Name</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full bg-black/5 border-none rounded-xl px-4 py-3 font-bold focus:ring-2 focus:ring-black/10 outline-none transition-all"
                                    placeholder="Enter your name"
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-black uppercase tracking-widest text-black/30 mb-2 block">Email Address</label>
                                <input
                                    type="email"
                                    value={session?.user?.email || ""}
                                    disabled
                                    className="w-full bg-black/5 border-none rounded-xl px-4 py-3 font-bold text-black/40 cursor-not-allowed"
                                />
                            </div>

                            {message && (
                                <div className={`text-xs font-bold ${message.includes("success") ? "text-green-600" : "text-red-500"}`}>
                                    {message}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="bg-black text-white px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-secure transition-all shadow-xl active:scale-95 disabled:opacity-50 flex items-center gap-2"
                            >
                                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                Save Changes
                            </button>
                        </form>
                    </div>

                    {/* SUBSCRIPTION CARD */}
                    <div className="bg-white p-8 rounded-[2rem] border border-black/5 shadow-xl opacity-75 hover:opacity-100 transition-opacity">
                        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-black/5">
                            <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-500">
                                <CreditCard className="w-6 h-6" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold">Subscription</h2>
                                <p className="text-xs text-black/40 font-bold uppercase tracking-wider">Manage your billing and plan</p>
                            </div>
                        </div>

                        <div className="flex items-center justify-between bg-black/5 p-6 rounded-xl">
                            <div>
                                <div className="text-[11px] font-black uppercase tracking-widest text-black/30 mb-1">Current Plan</div>
                                <div className="text-2xl font-black">Free Plan</div>
                            </div>
                            <Link href="/pricing" className="text-xs font-bold underline hover:text-secure">
                                Upgrade to Pro
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
