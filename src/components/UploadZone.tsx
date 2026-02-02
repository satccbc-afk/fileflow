"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, File, X, CheckCircle2, ShieldCheck, Sparkles, BrainCircuit, Zap, ArrowUp, Globe, Shield, Activity, Copy, RefreshCw, Lock, Package, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { generateKey, exportKey, encryptFile, arrayBufferToBase64 } from "@/lib/crypto";

type UploadStatus = "idle" | "scanning" | "uploading" | "success";

export function UploadZone() {
    const [files, setFiles] = useState<File[]>([]);
    const [status, setStatus] = useState<UploadStatus>("idle");
    const [progress, setProgress] = useState(0);
    const [shareLink, setShareLink] = useState("");
    const [scanLines, setScanLines] = useState<string[]>([]);
    const [errorMessage, setErrorMessage] = useState("");

    const onDrop = useCallback((acceptedFiles: File[]) => {
        setFiles(prev => [...prev, ...acceptedFiles]);
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        maxSize: 1024 * 1024 * 1024 * 1024, // 1TB cap (backend enforces real limit)
    });

    const formatSize = (bytes: number) => {
        if (bytes === 0) return "0 Bytes";
        const k = 1024;
        const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
    };

    const removeFile = (fileToRemove: File) => {
        setFiles(files.filter(f => f !== fileToRemove));
    };

    const handleUpload = async () => {
        if (files.length === 0) return;
        setScanLines([]);
        setErrorMessage("");

        try {
            setStatus("scanning");
            setScanLines(["Analyzing file structure...", "Optimizing encryption..."]);

            // 1. Authorize & Get Presigned URLs
            const authRes = await fetch("/api/upload/authorize", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    files: files.map(f => ({ name: f.name, type: f.type, size: f.size }))
                })
            });

            const authData = await authRes.json();
            if (!authData.success) {
                if (authData.error?.includes("Quota")) {
                    setScanLines(prev => [...prev, "CRITICAL: Storage Limit Exceeded"]);
                }
                throw new Error(authData.error);
            }

            setScanLines(prev => [...prev, "Uplink established.", "Beginning S3 payload transfer..."]);
            await new Promise(r => setTimeout(r, 800)); // Cinematic pause

            setStatus("uploading");

            setScanLines(prev => [...prev, "Generating 256-bit AES-GCM Neural Key...", "Encrypting payload in real-time..."]);

            // 0. Generate Encryption Key
            const key = await generateKey();
            const exportedKey = await exportKey(key);

            // 2. Encrypt & Upload to S3
            const uploadedFilesData = [];
            let completedBytes = 0;
            // Note: We use original size for progress tracking, but encrypted size will be slightly larger (+tag)
            const totalBytes = files.reduce((acc, f) => acc + f.size, 0);

            for (let i = 0; i < files.length; i++) {
                const file = files[i];

                // Encrypt
                // In a real app, use streams for large files to avoid memory crash. 
                // For this demo, we assume memory is sufficient for <500MB
                const { encryptedBlob, iv } = await encryptFile(file, key);
                const ivString = arrayBufferToBase64(iv.buffer as ArrayBuffer);

                const presigned = authData.files[i];

                await fetch(presigned.url, {
                    method: "PUT",
                    body: encryptedBlob,
                    headers: { "Content-Type": "application/octet-stream" } // Generic type for encrypted blob
                });

                uploadedFilesData.push({
                    name: presigned.name,
                    size: file.size, // Store original size for UI
                    type: file.type, // Store original type
                    key: presigned.key,
                    bucket: presigned.bucket,
                    iv: ivString // Store IV for decryption
                });

                completedBytes += file.size;
                setProgress(Math.round((completedBytes / totalBytes) * 100));
            }

            // 3. Register Transfer
            const tid = "v-" + Math.random().toString(36).substring(7);
            const regRes = await fetch("/api/upload", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    transferId: tid,
                    files: uploadedFilesData,
                    password: (document.getElementById('transfer-password') as HTMLInputElement)?.value,
                    expiresIn: (document.getElementById('transfer-expiry') as HTMLSelectElement)?.value || "1"
                })
            });

            const regJson = await regRes.json();
            if (!regJson.success) throw new Error(regJson.error);

            setStatus("success");
            const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000'; // Fallback
            // Append Key to URL Fragment
            setShareLink(`${baseUrl}/vault/${tid}#key=${exportedKey}`);

        } catch (err: any) {
            console.error("Upload error:", err);
            setStatus("idle");
            setErrorMessage(err.message || "Upload Failed");
        }
    };

    const reset = () => {
        setFiles([]);
        setStatus("idle");
        setProgress(0);
        setShareLink("");
        setScanLines([]);
        setErrorMessage("");
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(shareLink);
    };

    return (
        <div className="w-full max-w-2xl mx-auto">
            <AnimatePresence mode="wait">
                {status === "idle" && (
                    <motion.div
                        key="idle"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="relative group"
                    >
                        <div
                            {...getRootProps()}
                            className={cn(
                                "w-full p-20 rounded-[3rem] flex flex-col items-center justify-center cursor-pointer relative overflow-hidden transition-all duration-500",
                                "bg-white backdrop-blur-2xl border border-black/10 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.15)]", // Increased authority
                                isDragActive
                                    ? "bg-red-50/50 border-red-500/20 scale-[1.01]"
                                    : "hover:bg-white hover:shadow-[0_40px_100px_-30px_rgba(0,0,0,0.2)] hover:border-black/20"
                            )}
                        >
                            <input {...getInputProps()} />
                            <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-repeat" />
                            <div className="relative z-10 border-2 border-dashed border-black/10 rounded-[2.5rem] p-10 bg-white/40 flex flex-col items-center w-full max-w-sm transition-colors duration-300 group-hover:border-black/20">
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className={cn(
                                        "w-24 h-24 rounded-[2rem] flex items-center justify-center shadow-xl mb-8 transition-all duration-300",
                                        isDragActive
                                            ? "bg-red-500 text-white shadow-red-500/20"
                                            : "bg-white text-black shadow-black/5"
                                    )}
                                >
                                    <Upload className={cn(
                                        "w-10 h-10 transition-all duration-300",
                                        isDragActive ? "scale-110" : ""
                                    )} />
                                </motion.div>

                                <div className="text-center space-y-3 mb-10">
                                    <h3 className={cn(
                                        "text-3xl font-black font-heading tracking-tighter transition-colors duration-300",
                                        isDragActive ? "text-red-500" : "text-black"
                                    )}>
                                        {isDragActive ? "RELEASE TO UPLOAD" : "DROP TO SHARE"}
                                    </h3>
                                    <p className="text-black/40 font-medium max-w-xs mx-auto leading-relaxed text-sm">
                                        Simple, fast, and secure file sharing.<br />
                                        Drag files or click to browse.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Trust Signals Row */}
                        <div className="flex items-center justify-center gap-8 mt-8 opacity-60">
                            <div className="flex items-center gap-2">
                                <Lock className="w-3 h-3 text-black" />
                                <span className="text-[10px] font-bold uppercase tracking-widest text-black">End-to-end Encrypted</span>
                            </div>
                            <div className="w-px h-3 bg-black/10" />
                            <div className="flex items-center gap-2">
                                <Zap className="w-3 h-3 text-black" />
                                <span className="text-[10px] font-bold uppercase tracking-widest text-black">Fast Transfers</span>
                            </div>
                            <div className="w-px h-3 bg-black/10" />
                            <div className="flex items-center gap-2">
                                <Package className="w-3 h-3 text-black" />
                                <span className="text-[10px] font-bold uppercase tracking-widest text-black">100GB Free</span>
                            </div>
                        </div>

                        {files.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                className="w-full mt-10 space-y-4"
                            >
                                <div className="bento-card p-8 border-2 border-black/5">
                                    <div className="flex items-center justify-between mb-8">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-secure/10 rounded-xl flex items-center justify-center text-secure">
                                                <Sparkles className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-black text-black">READY TO SEND</h4>
                                                <p className="text-[10px] font-bold text-black/30 uppercase tracking-widest">{files.length} items selected</p>
                                            </div>
                                        </div>
                                        <button onClick={reset} className="text-[10px] font-black uppercase text-black/20 hover:text-black transition-colors">Clear All</button>
                                    </div>

                                    <div className="max-h-60 overflow-y-auto px-2 space-y-3 custom-scrollbar mb-8">
                                        {files.map((file, i) => (
                                            <motion.div
                                                initial={{ x: -10, opacity: 0 }}
                                                animate={{ x: 0, opacity: 1 }}
                                                key={i}
                                                className="flex items-center justify-between p-4 bg-black/[0.02] rounded-2xl group/file"
                                            >
                                                <div className="flex items-center gap-3 truncate">
                                                    <File className="w-4 h-4 text-black/20 group-hover/file:text-black transition-colors" />
                                                    <span className="text-xs font-bold text-black/70 truncate max-w-[200px]">{file.name}</span>
                                                    <span className="text-[10px] font-bold text-black/30 uppercase tracking-widest">{formatSize(file.size)}</span>
                                                </div>
                                                <button onClick={() => removeFile(file)} className="p-2 hover:bg-red-500/10 rounded-full group transition-colors">
                                                    <X className="w-4 h-4 text-black/20 group-hover:text-red-500 transition-colors" />
                                                </button>
                                            </motion.div>
                                        ))}
                                    </div>

                                    <div className="flex items-center justify-between mb-8 px-2 gap-4">
                                        <div className="flex items-center gap-2">
                                            <Lock className="w-4 h-4 text-black/30" />
                                            <input
                                                id="transfer-password"
                                                type="text"
                                                placeholder="OPTIONAL PASSWORD"
                                                className="bg-transparent text-[10px] font-black uppercase tracking-widest text-black placeholder:text-black/30 focus:outline-none w-32"
                                            />
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <Clock className="w-4 h-4 text-black/30" />
                                            <select
                                                id="transfer-expiry"
                                                className="bg-transparent text-[10px] font-black uppercase tracking-widest text-black focus:outline-none cursor-pointer"
                                                defaultValue="1"
                                            >
                                                <option value="1">24 Hours</option>
                                                <option value="3">3 Days</option>
                                                <option value="7">7 Days</option>
                                                <option value="30">30 Days</option>
                                            </select>
                                        </div>

                                        <span className="text-[10px] font-black uppercase tracking-widest text-secure/60 bg-secure/5 px-2 py-1 rounded">V3.0 Encrypted Cloud</span>
                                    </div>

                                    <button
                                        onClick={handleUpload}
                                        className="w-full bg-black text-white py-6 rounded-[2rem] font-black text-sm uppercase tracking-[0.3em] shadow-2xl hover:bg-secure transition-all active:scale-95 group"
                                    >
                                        <span className="flex items-center justify-center gap-3">
                                            Start Upload
                                            <motion.div animate={{ x: [0, 5, 0] }} transition={{ repeat: Infinity }}>
                                                <ArrowUp className="w-4 h-4" />
                                            </motion.div>
                                        </span>
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </motion.div>
                )}

                {status === "scanning" && (
                    <motion.div
                        key="scanning"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="monolith p-20 flex flex-col items-center"
                    >
                        <div className="relative w-40 h-40 flex items-center justify-center mb-12">
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                                className="absolute inset-0 border-2 border-dashed border-secure/20 rounded-full"
                            />
                            <BrainCircuit className="w-16 h-16 text-black relative z-10" />
                        </div>
                        <h3 className="text-3xl font-black font-heading tracking-tight mb-8 text-black">Authorizing...</h3>
                        <div className="w-full max-w-sm space-y-3">
                            <AnimatePresence mode="popLayout">
                                {scanLines.map((line, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className={cn(
                                            "flex items-center gap-3 text-[11px] font-bold p-3 rounded-xl border",
                                            line.includes("CRITICAL")
                                                ? "text-red-500 bg-red-500/5 border-red-500/10"
                                                : "text-black/40 bg-black/[0.02] border-black/5"
                                        )}
                                    >
                                        <Activity className={cn("w-3 h-3 animate-pulse", line.includes("CRITICAL") ? "text-red-500" : "text-secure")} />
                                        <span className="uppercase tracking-widest">{line}</span>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                        {errorMessage && (
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="mt-8 text-[11px] font-black text-red-500 uppercase tracking-widest max-w-xs leading-relaxed text-center"
                            >
                                {errorMessage}
                            </motion.p>
                        )}
                    </motion.div>
                )}

                {status === "uploading" && (
                    <motion.div
                        key="uploading"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="monolith p-20 text-center"
                    >
                        <div className="relative w-56 h-56 mx-auto mb-16">
                            <svg className="w-full h-full transform -rotate-90">
                                <circle cx="112" cy="112" r="100" stroke="rgba(0,0,0,0.03)" strokeWidth="4" fill="transparent" />
                                <motion.circle
                                    cx="112" cy="112" r="100"
                                    stroke="#000" strokeWidth="6" fill="transparent"
                                    strokeDasharray="628.3"
                                    strokeDashoffset={628.3 - (628.3 * progress) / 100}
                                    strokeLinecap="round"
                                />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-6xl font-black font-heading text-black">{progress}%</span>
                                <span className="text-[10px] font-black text-black/20 uppercase tracking-[0.4em] mt-2">S3 Uplink</span>
                            </div>
                        </div>
                        <h3 className="text-sm font-black uppercase tracking-[0.5em] text-black">Uploading to Secure Vault...</h3>
                    </motion.div>
                )}

                {status === "success" && (
                    <motion.div
                        key="success"
                        initial={{ opacity: 0, scale: 0.9, y: 30 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        className="monolith p-0 overflow-hidden"
                    >
                        <div className="bg-black p-16 text-center text-white relative">
                            <div className="w-24 h-24 bg-secure rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 shadow-[0_0_50px_rgba(99,102,241,0.5)]">
                                <CheckCircle2 className="w-12 h-12" />
                            </div>
                            <h3 className="text-5xl font-black font-heading tracking-tighter mb-4">Transfer Complete</h3>
                        </div>
                        <div className="p-12 space-y-8">
                            <div className="bg-black/[0.02] border-2 border-black/5 p-8 rounded-[2.5rem] relative group">
                                <div className="text-[10px] font-black text-black/20 uppercase tracking-widest mb-4">Secure Link</div>
                                <div className="text-lg font-bold text-black truncate mb-8 font-mono tracking-tight">{shareLink}</div>
                                <button
                                    onClick={copyToClipboard}
                                    className="w-full bg-black text-white py-6 rounded-2xl font-black text-xs uppercase tracking-[0.4em] shadow-xl hover:bg-secure transition-all flex items-center justify-center gap-3 group/btn"
                                >
                                    <Copy className="w-4 h-4 group-hover/btn:rotate-12 transition-transform" />
                                    Copy Link
                                </button>
                            </div>
                            <button onClick={reset} className="w-full flex items-center justify-center gap-3 text-[11px] font-black uppercase tracking-[0.5em] text-black/30 hover:text-black transition-colors">
                                <RefreshCw className="w-4 h-4" />
                                Send Another
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
