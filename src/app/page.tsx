"use client";

import { UploadZone } from "@/components/UploadZone";
import { MinimalBackground } from "@/components/MinimalBackground";

import { Shield, Zap, Globe, Share2, BrainCircuit, Sparkles, Wand2, ArrowUpRight, BarChart3, Database } from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  // Spotlight Effect Logic
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const cards = document.getElementsByClassName("bento-card");
    for (const card of cards) {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      (card as HTMLElement).style.setProperty("--mouse-x", `${x}px`);
      (card as HTMLElement).style.setProperty("--mouse-y", `${y}px`);
    }
  };

  return (
    <main className="relative min-h-screen text-share font-sans selection:bg-secure/10"
      onMouseMove={handleMouseMove}
    >
      <MinimalBackground />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "Fileflow",
            "applicationCategory": "ProductivityApplication",
            "operatingSystem": "Web",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            },
            "description": "Send large files up to 100GB for free. The secure, fast, and beautiful WeTransfer alternative.",
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.9",
              "ratingCount": "1200"
            }
          })
        }}
      />
      <div className="content-wrapper relative z-10">


        {/* HERO SECTION: SPATIAL SPLIT */}
        <section className="container mx-auto px-6 pt-52 pb-32 min-h-screen flex flex-col lg:flex-row items-center gap-24">
          <div className="flex-1 text-left">
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="pill mb-10 w-fit"
            >
              Quantum Systems v2.5
            </motion.div>

            <h1 className="text-[100px] md:text-[180px] font-black tracking-[-0.08em] leading-[0.75] text-share mb-12">
              <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.6 }}>
                Share.
              </motion.div>
              <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.6, delay: 0.1 }} className="text-secure">
                Secure.
              </motion.div>
              <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.6, delay: 0.2 }} className="text-seamless font-light italic">
                Seamless.
              </motion.div>
            </h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.8 }}
              className="text-2xl text-seamless max-w-lg font-black uppercase tracking-tighter leading-tight mb-16"
            >
              The world's most advanced file movement protocol. <br />
              <span className="text-share">Encrypted by AI.</span> Distributed by Mesh.
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="flex items-center gap-10"
            >
              <div className="flex flex-col">
                <span className="text-3xl font-black">100GB</span>
                <span className="text-[10px] font-black uppercase text-seamless tracking-widest">Free Limit</span>
              </div>
              <div className="w-px h-12 bg-black/10" />
              <div className="flex flex-col">
                <span className="text-3xl font-black">0s</span>
                <span className="text-[10px] font-black uppercase text-seamless tracking-widest">Setup Time</span>
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="flex-1 w-full max-w-xl animate-spatial"
          >
            <UploadZone />
          </motion.div>
        </section>

        {/* BENTO GRID: THE STACK */}
        <section id="features" className="container mx-auto px-6 py-40">
          <div className="mb-24">
            <h2 className="text-5xl md:text-8xl font-black tracking-tight mb-8">THE <span className="text-secure">STACK.</span></h2>
            <p className="text-xl text-seamless font-black uppercase tracking-widest">Future-Proofed Infrastructure</p>
          </div>

          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            variants={{
              hidden: { opacity: 0 },
              show: { opacity: 1, transition: { staggerChildren: 0.15 } }
            }}
            className="grid grid-cols-1 md:grid-cols-6 lg:grid-cols-12 gap-8 auto-rows-[300px]"
          >
            {/* Feature 1: Large Bento */}
            <motion.div
              variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
              whileHover={{ y: -5 }}
              className="md:col-span-6 lg:col-span-8 bento-card flex flex-col justify-between"
            >
              <div className="flex justify-between items-start">
                <div className="p-4 bg-secure/10 rounded-2xl text-secure">
                  <Zap className="w-8 h-8" />
                </div>
                <ArrowUpRight className="w-6 h-6 text-black/10" />
              </div>
              <div>
                <h3 className="text-4xl font-black mb-4 tracking-tighter">Parallel Mesh Network</h3>
                <p className="text-seamless font-bold text-sm max-w-md">Our proprietary routing algorithm splits your files into encrypted shards and sends them simultaneously through the fastest network nodes globally.</p>
              </div>
            </motion.div>

            {/* Feature 2: Small Bento (Security) */}
            <motion.div
              variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
              className="md:col-span-3 lg:col-span-4 bento-card group"
            >
              <Shield className="w-10 h-10 text-secure mb-8 group-hover:scale-110 transition-transform duration-300" />
              <h3 className="text-2xl font-black mb-4 tracking-tighter">Neural Vault</h3>
              <p className="text-black font-bold text-xs uppercase tracking-widest">XTS-AES 256 Hardened</p>
            </motion.div>

            {/* Feature 3: Small Bento (Analytics) */}
            <motion.div
              variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
              className="md:col-span-3 lg:col-span-4 bento-card group"
            >
              <BarChart3 className="w-10 h-10 text-secure mb-8 group-hover:scale-110 transition-transform duration-300" />
              <h3 className="text-2xl font-black mb-4 tracking-tighter">Live Insights</h3>
              <p className="text-seamless font-bold text-xs">Track your delivery in real-time with pixel-perfect precision.</p>
            </motion.div>

            {/* Feature 4: Large Bento (AI) */}
            <motion.div
              variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
              className="md:col-span-6 lg:col-span-8 bento-card flex items-center gap-12 group"
            >
              <div className="flex-1">
                <h3 className="text-4xl font-black mb-4 tracking-tighter">SmartScan AI Agent</h3>
                <p className="text-seamless font-bold text-sm">Every packet is analyzed by our heuristic engine to ensure zero threats reach your destination.</p>
              </div>
              <div className="hidden md:flex w-48 h-48 bg-light-gray rounded-[3rem] items-center justify-center">
                <BrainCircuit className="w-20 h-20 text-secure opacity-20" />
              </div>
            </motion.div>
          </motion.div>
        </section>

        {/* Cinematic CTA */}
        <section className="container mx-auto px-6 py-60 text-center relative">
          <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none">
            <h2 className="text-[200px] md:text-[400px] font-black text-black/[0.02] tracking-[-0.1em] whitespace-nowrap animate-spatial">
              FILEFLOW SYSTEMS
            </h2>
          </div>
          <div className="relative z-10">
            <h2 className="text-6xl md:text-9xl font-black tracking-tighter mb-16 leading-none">
              READY TO <br /> <span className="text-secure">FLOW?</span>
            </h2>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="bg-share text-white px-20 py-6 rounded-3xl font-black text-xl uppercase tracking-widest shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] hover:scale-105 transition-all active:scale-95"
            >
              Launch Portal
            </button>
          </div>
        </section>


      </div>
    </main>
  );
}
