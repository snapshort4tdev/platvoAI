"use client";

import Navbar from "../_common/nav-bar";
import Footer from "../_common/footer";

export default function TermsOfService() {
    return (
        <main className="min-h-dvh w-full relative">
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

            <div className="relative">
                <div className="mx-auto max-w-4xl px-4 py-8 md:py-12">
                    <Navbar />

                    <div className="mt-16 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-2xl p-8 md:p-12 shadow-xl border border-teal-100 dark:border-teal-900/30">
                        <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-600 to-emerald-500 mb-8">
                            Terms of Service
                        </h1>

                        <div className="prose prose-teal dark:prose-invert max-w-none space-y-6 text-slate-700 dark:text-slate-300">
                            <p>Last updated: {new Date().toLocaleDateString()}</p>

                            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mt-8 mb-4">1. Acceptance of Terms</h2>
                            <p>By accessing or using our services, you agree to be bound by these Terms. If you disagree with any part of the terms, you may not access the service.</p>

                            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mt-8 mb-4">2. Description of Service</h2>
                            <p>We provide a platform for accessing various AI models (text, images, tools) through a single unified interface. The services are provided &quot;as is&quot; and &quot;as available&quot;.</p>

                            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mt-8 mb-4">3. User Conduct</h2>
                            <p>You agree not to use the service for any unlawful purpose or in any way that interrupts, damages, or impairs the service. You take full responsibility for prompts provided to the AI and the generated output.</p>

                            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mt-8 mb-4">4. Payment and Billing</h2>
                            <p>Certain features of our service may require a paid subscription. All subscriptions are billed in advance on a recurring basis. We use standard third-party payment processors like Stripe.</p>

                            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mt-8 mb-4">5. Limitation of Liability</h2>
                            <p>We shall not be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of the service.</p>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        </main>
    );
}
