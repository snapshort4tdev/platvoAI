"use client";

import Navbar from "../_common/nav-bar";
import Footer from "../_common/footer";

export default function AboutUs() {
    return (
        <main className="min-h-dvh w-full relative">
            {/* Background */}
            <div className="absolute inset-0 z-0 bg-[radial-gradient(125%_125%_at_50%_90%,#ffffff_40%,#10b981_100%)] dark:bg-[radial-gradient(125%_125%_at_50%_90%,#0f172a_40%,#10b981_100%)]">
                <div
                    className="absolute inset-0 dark:hidden"
                    style={{
                        backgroundImage: `linear-gradient(to right, rgba(226,232,240,0.2) 1px, transparent 1px), linear-gradient(to bottom, rgba(226,232,240,0.2) 1px, transparent 1px)`,
                        backgroundSize: "60px 60px",
                        WebkitMaskImage: "radial-gradient(circle at 50% 40%, rgba(0,0,0,0.9) 70%, transparent 100%)",
                        maskImage: "radial-gradient(circle at 50% 40%, rgba(0,0,0,0.9) 70%, transparent 100%)",
                    }}
                />
                <div
                    className="absolute inset-0 hidden dark:block"
                    style={{
                        backgroundImage: `linear-gradient(to right, rgba(51,65,85,0.25) 1px, transparent 1px), linear-gradient(to bottom, rgba(51,65,85,0.25) 1px, transparent 1px)`,
                        backgroundSize: "60px 60px",
                        WebkitMaskImage: "radial-gradient(circle at 50% 40%, rgba(0,0,0,0.85) 65%, transparent 100%)",
                        maskImage: "radial-gradient(circle at 50% 40%, rgba(0,0,0,0.85) 65%, transparent 100%)",
                    }}
                />
            </div>

            <div className="relative z-10 w-full">
                <div className="mx-auto max-w-5xl px-4 py-8 md:py-12">
                    <Navbar />

                    <div className="mt-16 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-2xl p-8 md:p-12 shadow-xl border border-teal-100 dark:border-teal-900/30">
                        <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-600 to-emerald-500 mb-4 text-center">
                            About Us
                        </h1>
                        <p className="text-center text-slate-500 dark:text-slate-400 mb-12 text-lg">
                            The story behind Platvo AI
                        </p>

                        <div className="flex flex-col md:flex-row gap-12 items-center">
                            <div className="w-full md:w-1/2 space-y-6 text-slate-700 dark:text-slate-300 text-lg leading-relaxed">
                                <p>
                                    At <strong className="text-teal-600 dark:text-teal-400">Platvo AI</strong>, we believe that the power of artificial intelligence should be accessible, seamless, and unified.
                                </p>
                                <p>
                                    Navigating multiple subscriptions, different interfaces, and fragmented tools can decrease productivity. We set out to change that by building a single, cohesive platform that integrates the world&apos;s best AI models under one roof.
                                </p>
                                <p>
                                    Whether you are generating high-quality images, brainstorming with advanced LLMs, or automating deep workflows with tools and agents, we provide an intuitive space to bring your ideas to life.
                                </p>
                            </div>

                            <div className="w-full md:w-1/2 rounded-2xl overflow-hidden shadow-2xl border border-teal-200 dark:border-teal-800 bg-gradient-to-br from-teal-50 to-emerald-50 dark:from-slate-800 dark:to-slate-900 p-8 flex flex-col items-center justify-center text-center gap-6">
                                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Our Mission</h3>
                                <p className="text-slate-600 dark:text-slate-400">
                                    To democratize access to state-of-the-art AI by providing a unified, blazing-fast, and cost-effective platform for creators and developers alike.
                                </p>
                                <div className="flex gap-3 flex-wrap justify-center">
                                    {["Faster", "Smarter", "Unified"].map((tag) => (
                                        <span
                                            key={tag}
                                            className="inline-flex items-center justify-center px-4 py-2 bg-teal-100 dark:bg-teal-900/50 rounded-full text-teal-700 dark:text-teal-400 font-medium text-sm"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Stats */}
                        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 pt-10 border-t border-teal-100 dark:border-teal-900/30">
                            {[
                                { label: "AI Models", value: "13+" },
                                { label: "Happy Users", value: "500+" },
                                { label: "Generations", value: "10K+" },
                                { label: "Uptime", value: "99.9%" },
                            ].map(({ label, value }) => (
                                <div key={label} className="text-center">
                                    <div className="text-3xl font-bold text-teal-600 dark:text-teal-400">{value}</div>
                                    <div className="text-sm text-slate-500 dark:text-slate-400 mt-1">{label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        </main>
    );
}
