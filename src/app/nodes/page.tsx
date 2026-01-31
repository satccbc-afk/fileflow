"use client";

import { motion } from "framer-motion";
import { Server, Globe, Cpu, Zap } from "lucide-react";



const nodes = [
    { region: "North America", status: "Active", latency: "12ms", load: "42%" },
    { region: "Europe Central", status: "Active", latency: "8ms", load: "38%" },
    { region: "Asia Pacific", status: "Active", latency: "24ms", load: "56%" },
    { region: "South America", status: "Active", latency: "45ms", load: "12%" },
    { region: "Africa", status: "Active", latency: "62ms", load: "8%" },
    { region: "Australia", status: "Active", latency: "38ms", load: "22%" },
];

export default function NodesPage() {
    return (
        <main className="relative min-h-screen text-share font-sans selection:bg-secure/10">
            <div className="content-wrapper">
                

                <section className="container mx-auto px-6 pt-56 pb-40">
                    <div className="max-w-4xl mb-32">
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            className="pill mb-10 w-fit"
                        >
                            Network Infrastructure
                        </motion.div>
                        <h1 className="text-[70px] md:text-[120px] font-black tracking-[-0.08em] leading-[0.8] mb-12 text-black">
                            GLOBAL <br />
                            <span className="text-secure">NODES.</span>
                        </h1>
                        <p className="text-xl md:text-2xl text-black/40 font-bold max-w-2xl leading-tight">
                            Our decentralized mesh network spans across 6 continents, providing the fastest file transfer speeds on the planet.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {nodes.map((node, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                viewport={{ once: true }}
                                className="bento-card group"
                            >
                                <div className="flex justify-between items-start mb-10">
                                    <div className="w-16 h-16 bg-black/[0.03] rounded-2xl flex items-center justify-center group-hover:bg-secure group-hover:text-white transition-all duration-500">
                                        <Server className="w-8 h-8" />
                                    </div>
                                    <div className="flex items-center gap-2 bg-green-500/10 text-green-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">
                                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                                        {node.status}
                                    </div>
                                </div>
                                <h3 className="text-2xl font-black mb-1 tracking-tighter text-black uppercase">{node.region}</h3>
                                <div className="flex gap-6 mt-8">
                                    <div>
                                        <p className="text-[10px] font-bold text-black/20 uppercase tracking-widest mb-1">Latency</p>
                                        <p className="text-lg font-black text-black">{node.latency}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-black/20 uppercase tracking-widest mb-1">Load</p>
                                        <p className="text-lg font-black text-black">{node.load}</p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </section>

                
            </div>
        </main>
    );
}
