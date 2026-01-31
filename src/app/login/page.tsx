"use client";

import { motion } from "framer-motion";
import { MoveRight, Lock, Mail, Github, Sparkles, Loader2, AlertCircle } from "lucide-react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(searchParams.get("error") === "CredentialsSignin" ? "Invalid email or password" : "");
    const success = searchParams.get("success");

    const handleGoogleSignIn = () => {
        signIn("google", { callbackUrl: "/dashboard" });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        if (!email || !password) {
            setError("Please fill in all fields.");
            setIsLoading(false);
            return;
        }

        try {
            const res = await signIn("credentials", {
                redirect: false,
                email,
                password,
            });

            if (res?.error) {
                setError("Invalid email or password.");
            } else {
                router.push("/dashboard");
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
                        className="w-full max-w-lg monolith p-12 lg:p-16 animate-spatial bg-white border-2 border-black/10 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.2)]"
                    >
                        <div className="text-center mb-12">
                            <div className="w-20 h-20 bg-black text-white rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-2xl">
                                <Lock className="w-10 h-10" />
                            </div>
                            <h1 className="text-5xl font-black font-heading tracking-[-0.05em] mb-4 text-black">Welcome Back</h1>
                            <p className="text-[14px] font-bold text-black/40">Enter your details to sign in</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-8">
                            {success && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="p-4 rounded-xl bg-green-50 text-green-600 border border-green-100 flex items-center gap-3 text-sm font-bold"
                                >
                                    <Sparkles className="w-5 h-5" />
                                    Account created! You can now log in.
                                </motion.div>
                            )}

                            {error && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="p-4 rounded-xl bg-red-50 text-red-600 border border-red-100 flex items-center gap-3 text-sm font-bold"
                                >
                                    <AlertCircle className="w-5 h-5" />
                                    {error}
                                </motion.div>
                            )}

                            <div className="relative group">
                                <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-black/20 group-focus-within:text-secure transition-colors" />
                                <input
                                    type="email"
                                    placeholder="Email Address"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="w-full bg-black/[0.03] border-2 border-black/5 rounded-2xl py-6 pl-16 pr-6 font-bold text-[16px] text-black placeholder:text-black/30 focus:outline-none focus:border-black transition-all"
                                />
                            </div>

                            <div className="relative group">
                                <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-black/20 group-focus-within:text-secure transition-colors" />
                                <input
                                    type="password"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="w-full bg-black/[0.03] border-2 border-black/5 rounded-2xl py-6 pl-16 pr-6 font-bold text-[16px] text-black placeholder:text-black/30 focus:outline-none focus:border-black transition-all"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-black text-white py-7 rounded-2xl font-black text-lg uppercase tracking-wider shadow-2xl hover:bg-secure transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
                                {isLoading ? "Logging In..." : "Log In"}
                            </button>

                            <div className="flex items-center gap-6 py-4">
                                <div className="h-0.5 bg-black/10 flex-1" />
                                <span className="text-[12px] font-bold text-black/30 uppercase tracking-widest">Or sign in with</span>
                                <div className="h-0.5 bg-black/10 flex-1" />
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <button type="button" className="flex items-center justify-center gap-4 bg-white border-2 border-black/5 py-5 rounded-2xl hover:border-black transition-all group shadow-sm opacity-50 cursor-not-allowed" title="Coming Soon">
                                    <Github className="w-5 h-5" />
                                    <span className="text-[13px] font-bold uppercase tracking-widest">Github</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={handleGoogleSignIn}
                                    className="flex items-center justify-center gap-4 bg-white border-2 border-black/5 py-5 rounded-2xl hover:border-secure transition-all group shadow-sm"
                                >
                                    <Sparkles className="w-5 h-5 text-secure" />
                                    <span className="text-[13px] font-bold uppercase tracking-widest">Google</span>
                                </button>
                            </div>
                        </form>

                        <p className="text-center mt-12 text-[14px] font-medium text-black/40">
                            Don't have an account? <Link href="/signup" className="text-black font-bold underline underline-offset-4 decoration-2 decoration-secure">Create one</Link>
                        </p>
                    </motion.div>
                </section>
            </div>
        </main>
    );
}
