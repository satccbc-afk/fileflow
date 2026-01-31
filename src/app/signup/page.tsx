"use client";

import { motion } from "framer-motion";
import { MoveRight, User, Mail, Lock, ShieldCheck, Sparkles, AlertCircle, Loader2 } from "lucide-react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignupPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: ""
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        if (!formData.firstName || !formData.email || !formData.password) {
            setError("All fields are required");
            setIsLoading(false);
            return;
        }

        if (formData.password.length < 6) {
            setError("Password must be at least 6 characters");
            setIsLoading(false);
            return;
        }

        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || "Registration failed");
                return;
            }

            // Auto Sign-in after register
            const signInRes = await signIn("credentials", {
                redirect: false,
                email: formData.email,
                password: formData.password,
            });

            if (signInRes?.ok) {
                router.push("/dashboard");
            } else {
                router.push("/login?success=true");
            }

        } catch (err) {
            setError("Something went wrong. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="relative min-h-screen text-share font-sans selection:bg-secure/10">
            <div className="content-wrapper">
                <section className="container mx-auto px-6 pt-56 pb-20 flex flex-col items-center justify-center min-h-[80vh]">
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        className="w-full max-w-xl monolith p-12 lg:p-16 animate-spatial bg-white border-2 border-black/10 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.2)]"
                    >
                        <div className="text-center mb-12">
                            <div className="w-20 h-20 bg-black text-white rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-2xl">
                                <ShieldCheck className="w-10 h-10" />
                            </div>
                            <h1 className="text-5xl font-black font-heading tracking-[-0.05em] mb-4 text-black">Create Account</h1>
                            <p className="text-[14px] font-bold text-black/40">Join Fileflow and start sharing today</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-8">
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="p-4 rounded-xl bg-red-50 text-red-600 border border-red-100 flex items-center gap-3 text-sm font-bold"
                                >
                                    <AlertCircle className="w-5 h-5" />
                                    {error}
                                </motion.div>
                            )}

                            <div className="grid grid-cols-2 gap-6">
                                <div className="relative group">
                                    <User className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-black/20 group-focus-within:text-secure transition-colors" />
                                    <input
                                        type="text"
                                        placeholder="First Name"
                                        required
                                        value={formData.firstName}
                                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                        className="w-full bg-black/[0.03] border-2 border-black/5 rounded-2xl py-6 pl-16 pr-6 font-bold text-[16px] text-black placeholder:text-black/30 focus:outline-none focus:border-black transition-all"
                                    />
                                </div>
                                <div className="relative group">
                                    <input
                                        type="text"
                                        placeholder="Last Name"
                                        value={formData.lastName}
                                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                        className="w-full bg-black/[0.03] border-2 border-black/5 rounded-2xl py-6 px-8 font-bold text-[16px] text-black placeholder:text-black/30 focus:outline-none focus:border-black transition-all"
                                    />
                                </div>
                            </div>

                            <div className="relative group">
                                <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-black/20 group-focus-within:text-secure transition-colors" />
                                <input
                                    type="email"
                                    placeholder="Email Address"
                                    required
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full bg-black/[0.03] border-2 border-black/5 rounded-2xl py-6 pl-16 pr-6 font-bold text-[16px] text-black placeholder:text-black/30 focus:outline-none focus:border-black transition-all"
                                />
                            </div>

                            <div className="relative group">
                                <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-black/20 group-focus-within:text-secure transition-colors" />
                                <input
                                    type="password"
                                    placeholder="Create Password"
                                    required
                                    minLength={6}
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="w-full bg-black/[0.03] border-2 border-black/5 rounded-2xl py-6 pl-16 pr-6 font-bold text-[16px] text-black placeholder:text-black/30 focus:outline-none focus:border-black transition-all"
                                />
                            </div>

                            <div className="flex items-center gap-6 py-4">
                                <div className="h-0.5 bg-black/10 flex-1" />
                                <span className="text-[12px] font-bold text-black/30 uppercase tracking-widest">Or join with</span>
                                <div className="h-0.5 bg-black/10 flex-1" />
                            </div>

                            <button
                                type="button"
                                onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
                                className="w-full flex items-center justify-center gap-4 bg-white border-2 border-black/5 py-6 rounded-2xl hover:border-secure transition-all group shadow-sm"
                            >
                                <Sparkles className="w-6 h-6 text-secure animate-pulse" />
                                <span className="text-sm font-black uppercase tracking-widest">Join with Google</span>
                            </button>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-black text-white py-7 rounded-2xl font-black text-lg uppercase tracking-wider shadow-2xl hover:bg-secure transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
                                {isLoading ? "Creating Account..." : "Create Account with Email"}
                            </button>

                            <p className="text-[12px] font-medium text-black/30 text-center px-10 leading-relaxed">
                                By signing up, you agree to our <Link href="/terms" className="text-black font-bold underline underline-offset-4 decoration-secure">Terms of Service</Link> and <Link href="/privacy" className="text-black font-bold underline underline-offset-4 decoration-secure">Privacy Policy</Link>.
                            </p>
                        </form>

                        <p className="text-center mt-12 text-[14px] font-medium text-black/40">
                            Already have an account? <Link href="/login" className="text-black font-bold underline underline-offset-4 decoration-2 decoration-secure">Log in</Link>
                        </p>
                    </motion.div>
                </section>
            </div>
        </main>
    );
}
