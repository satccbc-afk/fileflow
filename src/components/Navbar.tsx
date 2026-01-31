"use client";

import Link from "next/link";
import { MoveRight, Sparkles, Orbit } from "lucide-react";
import { motion } from "framer-motion";

import { UserNav } from "./UserNav";

export function Navbar({ session }: { session?: any }) {
  return (
    <motion.nav
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 left-0 w-full z-50 px-6 py-10 flex justify-center"
    >
      <div className="bento-card px-10 py-5 flex items-center justify-between w-full max-w-[1200px] border border-black/5 shadow-2xl">
        <Link href="/" className="group flex items-center gap-4 min-w-[200px]">
          <div className="w-12 h-12 rounded-2xl bg-share flex items-center justify-center text-white transition-all group-hover:bg-secure group-hover:rotate-[-45deg] shadow-xl">
            <MoveRight className="w-6 h-6" />
          </div>
          <div className="flex flex-col">
            <span className="text-3xl font-black font-heading tracking-tighter text-share leading-none">Fileflow</span>
            <div className="flex items-center gap-1.5">
              <Orbit className="w-3 h-3 text-secure animate-spin-slow" />
              <span className="text-[9px] font-black uppercase tracking-[0.4em] text-secure">Spatial OS v2.5</span>
            </div>
          </div>
        </Link>

        <div className="hidden lg:flex items-center gap-10 min-w-[300px] justify-center">
          {['Features', 'Security', 'Pricing'].map((item) => (
            <Link
              key={item}
              href={`/${item.toLowerCase()}`}
              className="text-share/40 hover:text-share text-[10px] font-black uppercase tracking-[0.4em] transition-all relative group"
            >
              {item}
              <motion.div className="absolute -bottom-1 left-0 w-0 h-px bg-secure transition-all group-hover:w-full" />
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-8 min-w-[300px] justify-end">
          <UserNav session={session} />
          <Link href="/pricing" className="bg-secure text-white px-8 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-[0.4em] hover:bg-share transition-all shadow-xl shadow-secure/20 active:scale-95 flex items-center gap-2 group">
            <Sparkles className="w-3 h-3 group-hover:rotate-12 transition-transform" />
            Go Pro
          </Link>
        </div>
      </div>
    </motion.nav>
  );
}
