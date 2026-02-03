"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, ExternalLink, Download } from "lucide-react";

interface FilePreviewProps {
    file: { name: string; url: string; type: string };
    onClose: () => void;
}

export function FilePreview({ file, onClose }: FilePreviewProps) {
    const isImage = file.type?.startsWith("image/");
    const isVideo = file.type?.startsWith("video/");
    const isPdf = file.type === "application/pdf";

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10 bg-black/60 backdrop-blur-xl"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                className="relative w-full max-w-5xl h-full max-h-[85vh] bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="p-6 border-b border-black/5 flex items-center justify-between bg-white/80 backdrop-blur-md">
                    <div className="flex flex-col">
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-black/20 mb-1">Previewing</span>
                        <h3 className="font-bold text-sm text-black truncate max-w-[300px]">{file.name}</h3>
                    </div>
                    <div className="flex items-center gap-3">
                        <a
                            href={file.url}
                            target="_blank"
                            className="p-3 rounded-2xl bg-black/5 hover:bg-black/10 transition-colors text-black/40 hover:text-black"
                            title="Open in new tab"
                        >
                            <ExternalLink className="w-5 h-5" />
                        </a>
                        <button
                            onClick={onClose}
                            className="p-3 rounded-2xl bg-black text-white hover:bg-secure transition-colors shadow-lg"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 bg-black/5 overflow-auto flex items-center justify-center p-4 min-h-0">
                    {isImage && (
                        <img src={file.url} alt={file.name} className="max-w-full max-h-full object-contain rounded-xl shadow-2xl" />
                    )}
                    {isVideo && (
                        <video src={file.url} controls className="max-w-full max-h-full rounded-xl shadow-2xl" autoPlay />
                    )}
                    {isPdf && (
                        <iframe src={`${file.url}#toolbar=0`} className="w-full h-full rounded-xl border-none" />
                    )}
                    {!isImage && !isVideo && !isPdf && (
                        <div className="text-center p-20">
                            <div className="w-20 h-20 bg-black/5 rounded-3xl flex items-center justify-center mx-auto mb-6">
                                <Download className="w-10 h-10 text-black/20" />
                            </div>
                            <p className="font-bold text-black/40 uppercase tracking-widest text-xs">Preview not available for this file type</p>
                            <a href={file.url} download={file.name} className="mt-8 inline-block px-8 py-4 bg-black text-white rounded-2xl font-black uppercase tracking-widest text-[11px] hover:bg-secure transition-all shadow-xl">
                                Download to View
                            </a>
                        </div>
                    )}
                </div>
            </motion.div>
        </motion.div>
    );
}
