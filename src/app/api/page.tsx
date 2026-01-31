"use client";

import { motion } from "framer-motion";
import { Code2, Terminal, Globe, Zap } from "lucide-react";



export default function APIPage() {
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
                            Developer Access
                        </motion.div>
                        <h1 className="text-[70px] md:text-[120px] font-black tracking-[-0.08em] leading-[0.8] mb-12 text-black">
                            SIMPLE <br />
                            <span className="text-secure">API.</span>
                        </h1>
                        <p className="text-xl md:text-2xl text-black/40 font-bold max-w-2xl leading-tight">
                            Connect your apps to Fileflow. Send and receive files automatically with just a few lines of code.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="bento-card bg-black text-white">
                            <Terminal className="w-12 h-12 text-secure mb-8" />
                            <h3 className="text-3xl font-black mb-4 uppercase tracking-tighter">Fast Integration</h3>
                            <p className="text-white/40 font-bold mb-10 leading-relaxed">Use our official library to get started in minutes. It handles encryption, chunking, and delivery for you.</p>
                            <div className="bg-white/5 p-8 rounded-3xl font-mono text-sm text-green-400 border border-white/10">
                                <pre>{`flow.send(file, {
  onProgress: (p) => console.log(p),
  secure: true
});`}</pre>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-8">
                            <div className="bento-card">
                                <Code2 className="w-8 h-8 text-secure mb-4" />
                                <h3 className="text-xl font-black uppercase text-black">REST Support</h3>
                                <p className="text-sm text-black/40 font-bold leading-relaxed">Universal endpoints compatible with any language. Use simple POST requests to move data.</p>
                            </div>
                            <div className="bento-card">
                                <Zap className="w-8 h-8 text-secure mb-4" />
                                <h3 className="text-xl font-black uppercase text-black">Instant Pings</h3>
                                <p className="text-sm text-black/40 font-bold leading-relaxed">Register webhooks to receive real-time updates when files are uploaded or downloaded.</p>
                            </div>
                        </div>
                    </div>
                </section>

                
            </div>
        </main>
    );
}
