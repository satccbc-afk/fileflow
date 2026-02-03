import { auth } from "@/auth";
import { redirect } from "next/navigation";
import dbConnect from "@/lib/mongodb";
import { User } from "@/models/User";
import { UpgradeButton } from "@/components/UpgradeButton";
import { Transfer } from "@/models/Transfer";
import Link from "next/link";
import { File, Clock, ExternalLink, ShieldCheck, Plus, Layers } from "lucide-react";
import { DeleteTransferButton } from "@/components/DeleteTransferButton";
import { TransferList } from "@/components/TransferList";

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

                <div className="mb-12">
                    {/* Storage Meter */}
                    <div className="bg-white p-8 rounded-[2rem] border border-black/5 shadow-md mb-8 flex flex-col md:flex-row items-center gap-6">
                        <div className="w-16 h-16 bg-black/5 rounded-2xl flex items-center justify-center">
                            <Layers className="w-8 h-8 text-black/20" />
                        </div>
                        <div className="flex-1 w-full">
                            <div className="flex justify-between items-end mb-2">
                                <span className="text-[11px] font-black uppercase tracking-widest text-black/40">Storage Used</span>
                                <span className="text-sm font-bold">
                                    {(user.storageUsed / (1024 * 1024)).toFixed(2)} MB <span className="text-black/30">/ {user.plan === 'pro' ? '1 TB' : '2 GB'}</span>
                                </span>
                            </div>
                            <div className="w-full h-3 bg-black/5 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-black rounded-full transition-all duration-1000 ease-out"
                                    style={{ width: `${Math.min((user.storageUsed / (user.plan === 'pro' ? 1024 * 1024 * 1024 * 1024 : 2 * 1024 * 1024 * 1024)) * 100, 100)}%` }}
                                />
                            </div>
                        </div>
                        <Link href="/settings" className="px-6 py-3 bg-black/5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-black hover:text-white transition-colors">
                            Manage Account
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
                    <TransferList initialTransfers={JSON.parse(JSON.stringify(transfers))} />
                )}

                <div className="mt-20 text-center">
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-black/10">End of History</p>
                </div>
            </div>
        </main>
    );
}
