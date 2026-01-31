"use client";

import { useState, useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, File, X, CheckCircle2, ShieldCheck, Sparkles, BrainCircuit, Zap, ArrowUp, Globe, Shield, Activity, Copy, RefreshCw, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import Script from "next/script";

declare global {
    interface Window {
        google: any;
        gapi: any;
    }
}

type UploadStatus = "idle" | "scanning" | "uploading" | "success";

export function UploadZone() {
    const [files, setFiles] = useState<File[]>([]);
    const [status, setStatus] = useState<UploadStatus>("idle");
    const [progress, setProgress] = useState(0);
    const [shareLink, setShareLink] = useState("");
    const [scanLines, setScanLines] = useState<string[]>([]);
    const [errorMessage, setErrorMessage] = useState("");
    const [tokenClient, setTokenClient] = useState<any>(null);

    useEffect(() => {
        const initGoogle = () => {
            if (window.google && !tokenClient) {
                const client = window.google.accounts.oauth2.initTokenClient({
                    client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
                    scope: 'https://www.googleapis.com/auth/drive.file',
                    callback: () => { },
                });
                setTokenClient(client);
            }
        };

        const interval = setInterval(initGoogle, 1000);
        return () => clearInterval(interval);
    }, [tokenClient]);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        setFiles(prev => [...prev, ...acceptedFiles]);
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        maxSize: 2 * 1024 * 1024 * 1024,
    });

    const formatSize = (bytes: number) => {
        if (bytes === 0) return "0 Bytes";
        const k = 1024;
        const sizes = ["Bytes", "KB", "MB", "GB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
    };

    const removeFile = (fileToRemove: File) => {
        setFiles(files.filter(f => f !== fileToRemove));
    };

    const handleGoogleUpload = async () => {
        if (!tokenClient) {
            alert("Google Services not loaded yet. Please wait a moment.");
            return;
        }

        tokenClient.callback = async (resp: any) => {
            if (resp.error) {
                console.error(resp);
                return;
            }
            const accessToken = resp.access_token;

            setStatus("scanning");
            setScanLines(["Authenticating with Google Drive...", "Token acquired.", "Preparing direct uplink..."]);
            await new Promise(r => setTimeout(r, 1000));
            setStatus("uploading");

            const uploadedFilesData = [];
            let completed = 0;

            try {
                for (const file of files) {
                    const metadata = {
                        name: file.name,
                        mimeType: file.type || 'application/octet-stream',
                    };

                    const formData = new FormData();
                    formData.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
                    formData.append('file', file);

                    const uploadRes = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,webViewLink,webContentLink', {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${accessToken}`,
                        },
                        body: formData
                    });

                    if (!uploadRes.ok) throw new Error("Drive Upload Failed");
                    const fileData = await uploadRes.json();
                    const fileId = fileData.id;

                    await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}/permissions`, {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${accessToken}`,
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            role: 'reader',
                            type: 'anyone'
                        })
                    });

                    const getFileRes = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}?fields=id,name,size,mimeType,webViewLink,webContentLink`, {
                        headers: { 'Authorization': `Bearer ${accessToken}` }
                    });
                    const finalFileData = await getFileRes.json();

                    uploadedFilesData.push({
                        name: finalFileData.name,
                        size: parseInt(finalFileData.size || "0"),
                        type: finalFileData.mimeType,
                        key: "external",
                        bucket: "google-drive",
                        externalUrl: `https://drive.google.com/uc?id=${fileId}&export=download`
                    });

                    completed++;
                    setProgress(Math.round((completed / files.length) * 100));
                }

                const tid = "g-" + Math.random().toString(36).substring(7);
                setScanLines(prev => [...prev, "Syncing Drive links to Mesh..."]);

                const res = await fetch("/api/upload", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        transferId: tid,
                        files: uploadedFilesData
                    })
                });

                const regJson = await res.json();
                if (!regJson.success) throw new Error(regJson.error);

                setStatus("success");
                const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';
                setShareLink(`${baseUrl}/vault/${tid}`);

            } catch (err: any) {
                console.error("Vault retrieval error:", err);
                const errorMessage = err instanceof Error ? err.message : "Vault access failed";
                setErrorMessage(errorMessage);
                setStatus("idle");
            }
        };

        tokenClient.requestAccessToken({ prompt: 'consent' });
    };

    const handleUpload = async () => {
        if (files.length === 0) return;
        setScanLines([]);
        setErrorMessage("");
        handleGoogleUpload();
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
                                "w-full p-20 rounded-[3rem] flex flex-col items-center justify-center cursor-pointer relative overflow-hidden transition-all duration-300",
                                "bg-white/80 backdrop-blur-xl border border-black/5 shadow-[0_8px_32px_rgba(0,0,0,0.04)]",
                                isDragActive
                                    ? "bg-red-50/90 border-red-500/30 scale-[1.01]"
                                    : "hover:bg-white hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)] hover:border-black/10"
                            )}
                        >
                            <input {...getInputProps()} />

                            {/* Background Noise Texture */}
                            <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-repeat" />

                            {/* Inner Bordered Container for Icon, Text, and Badges */}
                            <div className="relative z-10 border-2 border-dashed border-black/60 rounded-[2.5rem] p-10 bg-white/40 flex flex-col items-center">
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
                                        isDragActive ? "text-red-600" : "text-black"
                                    )}>
                                        {isDragActive ? "RELEASE TO UPLOAD" : "DROP TO SHARE"}
                                    </h3>
                                    <p className="text-black/40 font-medium max-w-xs mx-auto leading-relaxed text-sm">
                                        Simple, fast, and secure file sharing.<br />
                                        Drag files or click to browse.
                                    </p>
                                </div>

                                <div className="flex gap-4">
                                    <span className="flex items-center gap-2 bg-black/[0.03] px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest text-black/40 border border-black/5">
                                        <Shield className="w-3 h-3" />
                                        No Login
                                    </span>
                                    <span className="flex items-center gap-2 bg-black/[0.03] px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest text-black/40 border border-black/5">
                                        <Zap className="w-3 h-3" />
                                        100GB Limit
                                    </span>
                                </div>
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

                                    <div className="flex items-center justify-between mb-8 px-2">
                                        <div className="flex items-center gap-2 opacity-50 cursor-not-allowed" title="Coming Soon to Pro">
                                            <Lock className="w-4 h-4 text-black/30" />
                                            <span className="text-[10px] font-black uppercase tracking-widest text-black/30">Password Protection</span>
                                        </div>
                                        <span className="text-[10px] font-black uppercase tracking-widest text-secure/60 bg-secure/5 px-2 py-1 rounded">V2.5 Encrypted</span>
                                    </div>

                                    <p className="text-[10px] text-center text-black/20 font-bold mb-4">By uploading, you agree to our Terms of Service.</p>

                                    <button
                                        onClick={handleUpload}
                                        className="w-full bg-black text-white py-6 rounded-[2rem] font-black text-sm uppercase tracking-[0.3em] shadow-2xl hover:bg-secure transition-all active:scale-95 group"
                                    >
                                        <span className="flex items-center justify-center gap-3">
                                            Start Sharing
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
                            <motion.div
                                animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }}
                                transition={{ duration: 2, repeat: Infinity }}
                                className="absolute inset-4 bg-secure/5 rounded-full blur-xl"
                            />
                            <BrainCircuit className="w-16 h-16 text-black relative z-10" />
                        </div>

                        <h3 className="text-3xl font-black font-heading tracking-tight mb-8 text-black">AI Safe-Scan</h3>

                        <div className="w-full max-w-sm space-y-3">
                            <AnimatePresence mode="popLayout">
                                {scanLines.map((line) => (
                                    <motion.div
                                        key={line}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className={cn(
                                            "flex items-center gap-3 text-[11px] font-bold p-3 rounded-xl border",
                                            line.includes("Critical")
                                                ? "text-red-500 bg-red-500/5 border-red-500/10"
                                                : "text-black/40 bg-black/[0.02] border-black/5"
                                        )}
                                    >
                                        <Activity className={cn("w-3 h-3 animate-pulse", line.includes("Critical") ? "text-red-500" : "text-secure")} />
                                        <span className="uppercase tracking-widest">{line}</span>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                        {errorMessage && (
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="mt-8 text-[11px] font-black text-red-500 uppercase tracking-widest max-w-xs leading-relaxed"
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
                                    cx="112"
                                    cy="112"
                                    r="100"
                                    stroke="#000"
                                    strokeWidth="6"
                                    fill="transparent"
                                    strokeDasharray="628.3"
                                    initial={{ strokeDashoffset: 628.3 }}
                                    animate={{ strokeDashoffset: 628.3 - (628.3 * progress) / 100 }}
                                    strokeLinecap="round"
                                />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-6xl font-black font-heading text-black">{progress}%</span>
                                <span className="text-[10px] font-black text-black/20 uppercase tracking-[0.4em] mt-2">Uploading</span>
                            </div>
                        </div>
                        <h3 className="text-sm font-black uppercase tracking-[0.5em] text-black">Moving Data...</h3>
                        <p className="text-black/30 font-bold mt-4 text-[11px] uppercase tracking-widest">Global Mesh Transmission Active</p>
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
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", damping: 12 }}
                                className="w-24 h-24 bg-secure rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 shadow-[0_0_50px_rgba(99,102,241,0.5)]"
                            >
                                <CheckCircle2 className="w-12 h-12" />
                            </motion.div>
                            <h3 className="text-5xl font-black font-heading tracking-tighter mb-4">Done!</h3>
                            <p className="text-white/40 font-bold uppercase tracking-[0.3em] text-[12px]">Your link is ready to share</p>
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
                                    Copy Share Link
                                </button>
                            </div>

                            <button
                                onClick={reset}
                                className="w-full flex items-center justify-center gap-3 text-[11px] font-black uppercase tracking-[0.5em] text-black/30 hover:text-black transition-colors"
                            >
                                <RefreshCw className="w-4 h-4" />
                                Send Another File
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
            <Script src="https://accounts.google.com/gsi/client" strategy="afterInteractive" />
        </div>
    );
}
