"use client";

import { useState } from "react";
import Link from "next/link";
import { File, Clock, ExternalLink, ShieldCheck, Trash2, Loader2 } from "lucide-react";
import { DeleteTransferButton } from "@/components/DeleteTransferButton";

export function TransferList({ initialTransfers }: { initialTransfers: any[] }) {
    const [transfers, setTransfers] = useState(initialTransfers);
    const [search, setSearch] = useState("");

    const filteredTransfers = transfers.filter(t =>
        t.files[0]?.name.toLowerCase().includes(search.toLowerCase()) ||
        t.transferId.includes(search)
    );

    return (
        <div className="space-y-8">
            {/* Search Bar */}
            <div className="flex items-center justify-end">
                <input
                    type="text"
                    placeholder="Search your archive..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="bg-white border border-black/10 rounded-2xl px-6 py-4 text-sm font-bold w-full md:w-96 focus:ring-2 focus:ring-black/10 outline-none shadow-sm transition-all"
                />
            </div>

            {filteredTransfers.length === 0 ? (
                <div className="text-center py-20 opacity-50 font-bold">
                    {search ? "No matches found." : "No transfers yet."}
                </div>
            ) : (
                <div className="grid gap-8">
                    {filteredTransfers.map((t) => (
                        <div key={t._id} className="group bg-white p-10 rounded-[3rem] border border-black/5 shadow-xl hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.1)] transition-all flex flex-col md:flex-row items-center justify-between gap-10 border-l-[12px] border-l-black hover:border-l-secure">
                            <div className="flex items-center gap-8 w-full md:w-auto">
                                <div className="w-16 h-16 bg-share/5 rounded-[2rem] flex items-center justify-center text-share group-hover:bg-secure/10 group-hover:text-secure transition-colors shadow-inner">
                                    <File className="w-8 h-8" />
                                </div>
                                <div className="min-w-0">
                                    <h3 className="text-xl font-black text-black mb-1 truncate max-w-[200px] md:max-w-md">
                                        {t.files[0]?.name} {t.files.length > 1 && <span className="text-black/20 text-sm ml-2">+{t.files.length - 1}</span>}
                                    </h3>
                                    <div className="flex items-center gap-5 text-[10px] font-black uppercase tracking-[0.2em] text-black/30">
                                        <span className="flex items-center gap-1.5"><Clock className="w-3 h-3" /> Expires: {new Date(t.expiresAt).toLocaleDateString()}</span>
                                        <span className="flex items-center gap-1.5 text-secure"><ShieldCheck className="w-3.5 h-3.5" /> {t.downloadCount || 0} Downloads</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <DeleteTransferButton transferId={t.transferId} />
                                <button
                                    onClick={() => {
                                        navigator.clipboard.writeText(`${window.location.origin}/vault/${t.transferId}`);
                                        alert("Link copied!");
                                    }}
                                    className="text-[10px] font-black uppercase tracking-widest text-black/40 hover:text-black transition-colors"
                                >
                                    Copy Link
                                </button>
                            </div>
                            <div className="flex flex-col items-end mr-4">
                                <span className="text-[9px] font-black uppercase tracking-widest text-black/20 mb-1">Vault Key</span>
                                <code className="text-[11px] font-mono text-black/60 bg-black/5 px-3 py-1 rounded-lg">
                                    {t.transferId}
                                </code>
                            </div>
                            <Link
                                href={`/vault/${t.transferId}`}
                                className="w-16 h-16 rounded-[2rem] bg-black text-white flex items-center justify-center hover:bg-secure transition-all shadow-xl hover:-rotate-6 active:scale-95"
                                title="Enter Vault"
                            >
                                <ExternalLink className="w-7 h-7" />
                            </Link>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
