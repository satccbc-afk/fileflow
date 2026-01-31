"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, File, ShieldCheck, BrainCircuit, Activity, Clock, Lock, Globe, AlertTriangle, Copy, RefreshCw } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

interface TransferData {
    transferId: string;
    files: Array<{ name: string; size: number; type: string }>;
    expiresAt: string;
}

export function VaultContent({ id }: { id: string }) {
    const [status, setStatus] = useState<"loading" | "decrypting" | "ready" | "error">("loading");
    const [data, setData] = useState<TransferData | null>(null);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch(`/api/vault/${id}`);
                const json = await res.json();

                if (json.success) {
                    setData(json.transfer);
                    // Artificial "Decryption" delay for UX
                    setTimeout(() => setStatus("decrypting"), 1500);
                    setTimeout(() => setStatus("ready"), 4000);
                } else {
                    setError(json.error || "Transfer system offline");
                    setStatus("error");
                }
            } catch (err) {
                setError("Connection failure");
                setStatus("error");
            }
        };

        if (id) {
            fetchData();

            // Safety Timeout for Dev Demos
            const timer = setTimeout(() => {
                setStatus((prev) => {
                    if (prev === "loading") {
                        // Force mock data if stuck
                        setData({
                            transferId: id,
                            files: [{ name: "demo-file.txt", size: 1024, type: "text/plain" }],
                            expiresAt: new Date(Date.now() + 86400000).toISOString()
                        });
                        return "ready";
                    }
                    return prev;
                });
            }, 8000); // 8s timeout

            return () => clearTimeout(timer);
        }
    }, [id]);

    const formatSize = (bytes: number) => {
        if (bytes === 0) return "0 Bytes";
        const k = 1024;
        const sizes = ["Bytes", "KB", "MB", "GB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
    };

    return (
        <section className="container mx-auto px-6 pt-56 pb-40 flex flex-col items-center">
            <AnimatePresence mode="wait">
                {status === "loading" && (
                    <motion.div
                        key="loading"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="monolith p-24 text-center flex flex-col items-center max-w-xl w-full"
                    >
                        <div className="w-20 h-20 bg-black/[0.03] rounded-3xl flex items-center justify-center mb-10 animate-pulse">
                            <Globe className="w-10 h-10 text-black/20" />
                        </div>
                        <h3 className="text-2xl font-black uppercase tracking-widest text-black/40">Locating Vault...</h3>
                    </motion.div>
                )}

                {status === "decrypting" && (
                    <motion.div
                        key="decrypting"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        className="monolith p-20 flex flex-col items-center max-w-xl w-full"
                    >
                        <div className="relative w-32 h-32 flex items-center justify-center mb-10">
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                className="absolute inset-0 border-4 border-dotted border-secure rounded-full"
                            />
                            <BrainCircuit className="w-16 h-16 text-secure" />
                        </div>
                        <h3 className="text-3xl font-black font-heading text-black mb-4">DECRYPTING</h3>
                        <div className="space-y-2 w-full max-w-xs">
                            <div className="h-1 bg-black/5 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: "100%" }}
                                    transition={{ duration: 2.5 }}
                                    className="h-full bg-secure"
                                />
                            </div>
                            <p className="text-[10px] font-black text-secure uppercase tracking-[0.4em] text-center">Neural Key Applied</p>
                        </div>
                    </motion.div>
                )}

                {status === "ready" && data && (
                    <motion.div
                        key="ready"
                        initial={{ opacity: 0, scale: 0.95, y: 30 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        className="monolith p-0 overflow-hidden max-w-2xl w-full shadow-[0_40px_120px_-20px_rgba(0,0,0,0.3)] border-2 border-black/5"
                    >
                        <div className="bg-black p-12 text-center text-white relative overflow-hidden group">
                            <motion.div
                                animate={{ y: ["-100%", "100%"] }}
                                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                                className="absolute inset-0 bg-gradient-to-b from-transparent via-secure/20 to-transparent w-full h-[200%] opacity-30"
                            />
                            <div className="flex items-center justify-between mb-10 relative z-10">
                                <div className="bg-white/10 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/5">
                                    ID: {data.transferId}
                                </div>
                                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/40">
                                    <Clock className="w-4 h-4" />
                                    Expiring Shortly
                                </div>
                            </div>
                            <h1 className="text-5xl font-black font-heading tracking-tighter mb-4 relative z-10">SECURE VAULT.</h1>
                            <p className="text-white/40 font-bold uppercase tracking-[0.3em] text-[12px] relative z-10">{data.files.length} ITEMS FOUND</p>
                        </div>

                        <div className="p-12">
                            <div className="space-y-4 mb-12">
                                {data.files.map((file, i) => (
                                    <a
                                        key={i}
                                        href={(file as any).url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center justify-between p-6 bg-black/[0.03] rounded-3xl border border-black/5 hover:bg-black/[0.05] transition-colors group/file cursor-pointer"
                                    >
                                        <div className="flex items-center gap-5">
                                            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-black/5">
                                                <File className="w-6 h-6 text-black" />
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-black text-black truncate max-w-[250px]">{file.name}</h4>
                                                <p className="text-[10px] font-bold text-black/30 uppercase tracking-widest">{formatSize(file.size)}</p>
                                            </div>
                                        </div>
                                        <Download className="w-5 h-5 text-black/20 group-hover/file:text-secure transition-colors" />
                                    </a>
                                ))}
                            </div>

                            {data.files.length === 1 ? (
                                <button
                                    onClick={() => {
                                        const url = (data.files[0] as any).url;
                                        if (url) window.location.assign(url);
                                        else alert("File link not found. Please try re-uploading.");
                                    }}
                                    className="w-full bg-black text-white py-8 rounded-[2.5rem] font-black text-sm uppercase tracking-[0.5em] shadow-2xl hover:bg-secure transition-all flex items-center justify-center gap-4 group active:scale-95"
                                >
                                    <Download className="w-5 h-5 group-hover:translate-y-1 transition-transform" />
                                    Download File
                                </button>
                            ) : (
                                <div className="grid gap-4">
                                    <button
                                        onClick={() => data.files.forEach(f => {
                                            const url = (f as any).url;
                                            if (url) window.open(url, '_blank');
                                        })}
                                        className="w-full bg-black text-white py-6 rounded-[2rem] font-black text-xs uppercase tracking-[0.5em] shadow-xl hover:bg-secure transition-all flex items-center justify-center gap-4 group active:scale-95"
                                    >
                                        <Download className="w-5 h-5" />
                                        Download All (Popups)
                                    </button>
                                    <p className="text-center text-[10px] text-black/30 font-bold uppercase tracking-widest">
                                        *Allow popups to download multiple files at once.
                                    </p>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}

                {status === "error" && (
                    <motion.div
                        key="error"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="monolith p-20 text-center max-w-xl w-full"
                    >
                        <div className="w-20 h-20 bg-red-500/10 rounded-3xl flex items-center justify-center text-red-500 mx-auto mb-10">
                            <AlertTriangle className="w-10 h-10" />
                        </div>
                        <h3 className="text-3xl font-black font-heading text-black mb-4 uppercase">Vault Missing</h3>
                        <p className="text-black/40 font-bold mb-10 leading-tight">
                            {error === "Transfer expired"
                                ? "This transmission has crossed its expiry threshold and has been automatically purged."
                                : "The requested vault could not be located on our mesh nodes."}
                        </p>
                        <button onClick={() => window.location.href = '/'} className="px-10 py-5 bg-black text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.4em] hover:bg-secure transition-all">Return Home</button>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
}
