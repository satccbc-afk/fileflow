"use client";

import Link from "next/link";
import { User, LayoutDashboard, LogOut, ShieldCheck } from "lucide-react";

import { useSession } from "next-auth/react";

export function UserNav({ session: propSession }: { session: any }) {
    const { data: clientSession } = useSession();
    const session = clientSession || propSession;

    if (session) {
        return (
            <div className="flex items-center gap-8">
                <div className="flex items-center gap-6 pr-6 border-r border-black/5">
                    <Link
                        href="/dashboard"
                        className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-share hover:text-secure transition-colors"
                    >
                        <LayoutDashboard className="w-4 h-4" />
                        Dashboard
                    </Link>
                    {(session.user?.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL || session.user?.email === "khushboom099@gmail.com") && (
                        <Link
                            href="/admin"
                            className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-red-500 hover:text-red-700 transition-colors"
                        >
                            <ShieldCheck className="w-4 h-4" />
                            Admin
                        </Link>
                    )}
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex flex-col items-end">
                        <span className="text-[10px] font-black text-black leading-none mb-1">{session.user?.name}</span>
                        <Link href="/api/auth/signout" className="text-[9px] font-bold text-black/40 hover:text-red-500 uppercase tracking-wider flex items-center gap-1 leading-none">
                            <LogOut className="w-3 h-3" /> Sign Out
                        </Link>
                    </div>
                    {session.user?.image ? (
                        <img src={session.user.image} alt="User" className="w-10 h-10 rounded-2xl border-2 border-white shadow-xl ring-1 ring-black/5 object-cover" />
                    ) : (
                        <div className="w-10 h-10 rounded-2xl bg-black text-white flex items-center justify-center shadow-lg">
                            <User className="w-5 h-5" />
                        </div>
                    )}
                </div>
            </div>
        );
    }

    return (
        <Link href="/api/auth/signin" className="bg-white text-black px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center gap-2 border border-black/5">
            <User className="w-3 h-3" />
            Sign In
        </Link>
    );
}
