import { auth } from "@/auth";
import { redirect } from "next/navigation";
import dbConnect from "@/lib/mongodb";
import { User } from "@/models/User";
import { UpgradeButton } from "@/components/UpgradeButton";
import { Transfer } from "@/models/Transfer";
import Link from "next/link";
import { File, Clock, ExternalLink, ShieldCheck, Plus, Layers } from "lucide-react";
import { DeleteTransferButton } from "@/components/DeleteTransferButton";

export default async function DashboardPage() {
    const session = await auth();
    if (!session?.user?.email) redirect("/api/auth/signin");

    await dbConnect();
    const user = await User.findOne({ email: session.user.email });
    const transfers = await Transfer.find({ ownerEmail: session.user.email }).sort({ createdAt: -1 });

    return (
        <main className="min-h-screen bg-[#FAFAFA] pt-40 pb-20 px-6 font-sans">
            <div className="max-w-[1200px] mx-auto text-black px-14">
                <div className="flex flex-col md:flex-row items-center justify-between mb-16 gap-8 text-center md:text-left">
                    <div>
                        <div className="flex items-center gap-4 mb-2 justify-center md:justify-start">
                            <div className="w-12 h-12 bg-black text-white rounded-2xl flex items-center justify-center shadow-2xl">
                                <Layers className="w-7 h-7" />
                            </div>
                            <h1 className="text-4xl font-black font-heading tracking-tight">My Archive</h1>
                            {user?.plan === 'pro' && (
                                <span className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-lg">
                                    PRO ACTIVE
                                </span>
                            )}
                        </div>
                        <p className="text-black/40 font-bold uppercase tracking-widest text-[10px]">Secure Storage • {transfers.length} Active transmissions</p>
                    </div>

                    <div className="flex items-center gap-4">
                        {user?.plan !== 'pro' && <UpgradeButton />}

                        {(session.user?.email === "khushboom099@gmail.com" || session.user?.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL) && (
                            <Link
                                href="/admin"
                                className="bg-red-500 text-white px-8 py-5 rounded-[2rem] text-[11px] font-black uppercase tracking-[0.3em] hover:bg-red-600 transition-all shadow-xl shadow-red-500/20 flex items-center gap-3 active:scale-95"
                            >
                                <ShieldCheck className="w-4 h-4" />
                                Admin Panel
                            </Link>
                        )}
                        <Link
                            href="/"
                            className="bg-secure text-white px-10 py-5 rounded-[2rem] text-[11px] font-black uppercase tracking-[0.3em] hover:scale-105 transition-all shadow-2xl shadow-secure/20 flex items-center gap-3 active:scale-95"
                        >
                            <Plus className="w-4 h-4" />
                            New Transfer
                        </Link>
                    </div>
                </div>

                {transfers.length === 0 ? (
                    <div className="monolith p-24 text-center flex flex-col items-center bg-white border border-black/5 rounded-[3rem] shadow-xl">
                        <div className="w-24 h-24 bg-black/5 rounded-[2.5rem] flex items-center justify-center mb-8 border border-black/5 shadow-inner">
                            <File className="w-10 h-10 text-black/10" />
                        </div>
                        <h3 className="text-2xl font-black text-black mb-4">Vault Empty</h3>
                        <p className="text-black/40 font-bold mb-10 max-w-xs uppercase tracking-widest text-[10px] leading-loose">Your encrypted archive is currently waiting for data transmissions.</p>
                        <Link href="/" className="px-12 py-6 bg-black text-white rounded-3xl text-xs font-black uppercase tracking-[0.3em] hover:bg-secure transition-all shadow-xl shadow-black/10">
                            Start First Upload
                        </Link>
                    </div>
                ) : (
                    <div className="grid gap-8">
                        {transfers.map((t) => (
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

                <div className="mt-20 text-center">
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-black/10">End of History</p>
                </div>
            </div>
        </main>
    );
}
