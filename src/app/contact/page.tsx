"use client";

import { motion } from "framer-motion";
import { Mail, MessageSquare, Twitter, MapPin, Send } from "lucide-react";



export default function ContactPage() {
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
                            Support Channel
                        </motion.div>
                        <h1 className="text-[70px] md:text-[120px] font-black tracking-[-0.08em] leading-[0.8] mb-12 text-black">
                            GET IN <br />
                            <span className="text-secure">TOUCH.</span>
                        </h1>
                        <p className="text-xl md:text-2xl text-black/40 font-bold max-w-2xl leading-tight">
                            Have a question about a transfer? Need a higher conduit capacity? We're here to help move your data.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
                        <div className="space-y-12">
                            <div className="bento-card">
                                <Mail className="w-8 h-8 text-secure mb-6" />
                                <h3 className="text-xl font-black uppercase text-black mb-2">Email Support</h3>
                                <p className="text-black/40 font-bold mb-6">For general inquiries and pro identity support.</p>
                                <p className="text-lg font-black text-black">satccbc@gmail.com</p>
                            </div>
                            <div className="bento-card">
                                <Twitter className="w-8 h-8 text-secure mb-6" />
                                <h3 className="text-xl font-black uppercase text-black mb-2">Live Pulse</h3>
                                <p className="text-black/40 font-bold mb-6">Get the latest network updates and technical news.</p>
                                <p className="text-lg font-black text-black">@filedash_hq</p>
                            </div>
                        </div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            className="monolith p-12 lg:p-16"
                        >
                            <h2 className="text-3xl font-black mb-10 uppercase tracking-tighter text-black">Send a Message</h2>
                            <div className="space-y-8">
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-black/40 ml-4">Name</label>
                                        <input type="text" placeholder="Your Name" className="w-full bg-black/[0.03] border-2 border-black/5 rounded-2xl py-5 px-6 font-bold text-black focus:outline-none focus:border-black transition-all" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-black/40 ml-4">Email</label>
                                        <input type="email" placeholder="email@example.com" className="w-full bg-black/[0.03] border-2 border-black/5 rounded-2xl py-5 px-6 font-bold text-black focus:outline-none focus:border-black transition-all" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-black/40 ml-4">Message</label>
                                    <textarea rows={4} placeholder="How can we help?" className="w-full bg-black/[0.03] border-2 border-black/5 rounded-2xl py-5 px-6 font-bold text-black focus:outline-none focus:border-black transition-all resize-none" />
                                </div>
                                <button className="w-full bg-black text-white py-6 rounded-2xl font-black uppercase tracking-[0.4em] shadow-2xl hover:bg-secure transition-all text-xs flex items-center justify-center gap-3">
                                    <Send className="w-4 h-4" />
                                    Relay Message
                                </button>
                            </div>
                        </motion.div>
                    </div>
                </section>


            </div>
        </main>
    );
}
