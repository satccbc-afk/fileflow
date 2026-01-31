"use client";

import { motion } from "framer-motion";
import { Activity, CheckCircle2, AlertCircle, Clock } from "lucide-react";



const services = [
    { name: "File Upload Core", status: "Operational", uptime: "99.99%" },
    { name: "Global Mesh Network", status: "Operational", uptime: "100%" },
    { name: "Pro Identity System", status: "Operational", uptime: "99.98%" },
    { name: "API Layer", status: "Operational", uptime: "100%" },
];

export default function StatusPage() {
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
                            System Health
                        </motion.div>
                        <h1 className="text-[70px] md:text-[120px] font-black tracking-[-0.08em] leading-[0.8] mb-12 text-black">
                            LIVE <br />
                            <span className="text-secure">STATUS.</span>
                        </h1>
                        <div className="flex items-center gap-4 bg-green-500/10 text-green-600 px-8 py-5 rounded-2xl w-fit">
                            <CheckCircle2 className="w-6 h-6" />
                            <span className="text-lg font-black uppercase tracking-widest">All Systems Operational</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {services.map((service, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                viewport={{ once: true }}
                                className="bento-card group flex items-center justify-between"
                            >
                                <div>
                                    <h3 className="text-xl font-black mb-1 uppercase text-black">{service.name}</h3>
                                    <p className="text-[10px] font-bold text-black/20 uppercase tracking-widest">Uptime: {service.uptime}</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-green-600">{service.status}</span>
                                    <div className="w-3 h-3 bg-green-500 rounded-full" />
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    <div className="mt-32 bento-card border-none bg-black text-white p-16">
                        <div className="flex items-start gap-12">
                            <Activity className="w-12 h-12 text-secure flex-shrink-0" />
                            <div>
                                <h2 className="text-3xl font-black mb-4 uppercase tracking-tighter">Current Network Performance</h2>
                                <p className="text-white/40 font-bold max-w-2xl leading-relaxed">
                                    We are currently processing 1.2TB of data per second globally. No bottlenecks detected. Neural encryption latency is holding steady at 1.4ms.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                
            </div>
        </main>
    );
}
