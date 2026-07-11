import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { VoucherFlow } from "@/components/voucher-flow";
import { BraidDivider } from "@/components/braid-divider";
import { Gift, Sparkles, Clock, Heart } from "lucide-react";
import Link from "next/link";

export const metadata = {
    title: "Gift Vouchers | Mwezu Hair Salon",
    description:
        "Give the gift of beautiful hair. Buy a Mwezu Hair gift voucher for someone special — redeemable on any service.",
};

const perks = [
    { icon: Gift, text: "Redeemable on any service" },
    { icon: Clock, text: "Valid for 12 months" },
    { icon: Sparkles, text: "Delivered instantly via WhatsApp" },
    { icon: Heart, text: "Perfect gift for any occasion" },
];

export default function VouchersPage() {
    return (
        <>
            <Header />
            <main>
                {/* Hero */}
                <section
                    className="relative overflow-hidden py-20 px-6 text-center"
                    style={{ background: "linear-gradient(160deg, #1C1714 0%, #2E2520 60%, #1C1714 100%)" }}
                >
                    <div
                        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[400px] w-[400px] rounded-full"
                        style={{ background: "radial-gradient(circle, rgba(201,168,76,0.1) 0%, transparent 70%)" }}
                    />
                    <div className="relative mx-auto max-w-2xl">
                        <div
                            className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl"
                            style={{ background: "rgba(201,168,76,0.1)", border: "1px solid rgba(201,168,76,0.3)" }}
                        >
                            <Gift size={26} style={{ color: "#C9A84C" }} />
                        </div>
                        <div
                            className="mb-4 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs"
                            style={{ background: "rgba(201,168,76,0.1)", color: "#C9A84C", border: "1px solid rgba(201,168,76,0.25)" }}
                        >
                            <Sparkles size={11} /> The Gift of Beautiful Hair
                        </div>
                        <h1
                            className="font-display text-5xl font-bold leading-tight mb-4"
                            style={{ color: "#FAF6EE" }}
                        >
                            Give the Gift of <span style={{ color: "#C9A84C" }}>Mwezu</span>
                        </h1>
                        <p className="text-base leading-relaxed mb-8 max-w-lg mx-auto" style={{ color: "#9B896E" }}>
                            Treat someone special to a Mwezu Hair experience.
                            Gift vouchers are redeemable on any service and delivered instantly via WhatsApp.
                        </p>
                        <div className="flex flex-wrap justify-center gap-4">
                            {perks.map(({ icon: Icon, text }) => (
                                <div key={text} className="flex items-center gap-2 text-sm" style={{ color: "#9B896E" }}>
                                    <Icon size={14} style={{ color: "#C9A84C" }} />
                                    {text}
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Main flow */}
                <section className="py-16 px-6 bg-background">
                    <div className="mx-auto max-w-2xl">
                        <VoucherFlow />
                    </div>
                    <BraidDivider className="mt-16" />
                </section>

                {/* Redeem section */}
                <section className="py-16 px-6 bg-secondary">
                    <div className="mx-auto max-w-2xl text-center">
                        <p className="text-xs uppercase tracking-widest text-primary mb-2">Already have a voucher?</p>
                        <h2 className="font-display text-3xl font-bold text-foreground mb-3">Redeem Your Voucher</h2>
                        <p className="text-muted-foreground text-sm mb-8 max-w-md mx-auto">
                            Ready to use your gift voucher? Book an appointment and mention your voucher code
                            at the salon — or include it in your booking notes.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                            <Link href="/book">
                                <button
                                    className="rounded-full px-8 py-4 text-sm font-semibold transition-opacity hover:opacity-90"
                                    style={{ background: "#C9A84C", color: "#1C1714" }}
                                >
                                    Book with Voucher
                                </button>
                            </Link>

                            <a
                                href="https://wa.me/260977000001"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="rounded-full px-8 py-4 text-sm font-medium border border-border text-foreground hover:bg-card transition-colors"
                            >
                                Ask Us on WhatsApp
                            </a>
                        </div>
                    </div>
                </section>
            </main >
            <Footer />
        </>
    );
}