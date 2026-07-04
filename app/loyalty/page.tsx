import Link from "next/link";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { BraidDivider } from "@/components/braid-divider";
import { Button } from "@/components/ui/button";
import {
    Star, Gift, Sparkles, ArrowRight,
    CheckCircle2, Crown, Gem, Shield, Zap,
} from "lucide-react";

const tiers = [
    {
        name: "Bronze",
        icon: Shield,
        points: "0 – 499",
        color: "#CD7F32",
        bg: "rgba(205,127,50,0.08)",
        border: "rgba(205,127,50,0.25)",
        perks: [
            "50 welcome bonus points",
            "1 point per K10 spent",
            "Birthday bonus points",
            "Booking confirmation priority",
        ],
    },
    {
        name: "Silver",
        icon: Star,
        points: "500 – 999",
        color: "#A8A9AD",
        bg: "rgba(168,169,173,0.08)",
        border: "rgba(168,169,173,0.25)",
        perks: [
            "Everything in Bronze",
            "Free Wash & Blow Dry",
            "10% off next service",
            "2x points on birthday month",
        ],
    },
    {
        name: "Gold",
        icon: Crown,
        points: "1,000 – 1,999",
        color: "#C9A84C",
        bg: "rgba(201,168,76,0.08)",
        border: "rgba(201,168,76,0.3)",
        perks: [
            "Everything in Silver",
            "Free Unbraiding service",
            "15% off any service",
            "Priority booking slots",
            "Exclusive style previews",
        ],
        featured: true,
    },
    {
        name: "Platinum",
        icon: Gem,
        points: "2,000+",
        color: "#9B7FE8",
        bg: "rgba(155,127,232,0.08)",
        border: "rgba(155,127,232,0.25)",
        perks: [
            "Everything in Gold",
            "K300 free service credit",
            "20% off any service",
            "VIP treatment every visit",
            "Birthday free service",
            "Referral double points",
        ],
    },
];

const ways = [
    { icon: Sparkles, label: "Book a service", points: "K10 = 1 pt" },
    { icon: Star, label: "Refer a friend", points: "+100 pts" },
    { icon: Gift, label: "Birthday month", points: "2× points" },
    { icon: Zap, label: "First booking ever", points: "+50 pts" },
];

const faqs = [
    {
        q: "How do I join Mwezu Rewards?",
        a: "You're automatically enrolled when you book your first appointment — no sign-up needed. Just book and start earning.",
    },
    {
        q: "How do I check my points balance?",
        a: "Your points balance will be shown on your booking confirmation. You can also ask us at the salon or message us on WhatsApp.",
    },
    {
        q: "When do my points expire?",
        a: "Points expire after 90 days of inactivity to encourage regular visits. We'll send you a WhatsApp reminder before they expire.",
    },
    {
        q: "Can I use points on any service?",
        a: "Yes — points can be redeemed against any service at Mwezu Hair Salon. Rewards cannot be used to purchase gift vouchers.",
    },
    {
        q: "How does the referral bonus work?",
        a: "Share your name with a friend when they book. Once their first appointment is complete, you both earn 100 bonus points automatically.",
    },
];

export const metadata = {
    title: "Mwezu Rewards | Mwezu Hair Salon",
    description:
        "Join Mwezu Rewards — earn points on every visit, unlock exclusive perks, and get rewarded for your loyalty at Mwezu Hair Salon.",
};

export default function LoyaltyPage() {
    return (
        <>
            <Header />
            <main>
                {/* ── Hero ──────────────────────────────────────── */}
                <section
                    className="relative overflow-hidden py-24 px-6 text-center"
                    style={{ background: "linear-gradient(160deg, #1C1714 0%, #2E2520 50%, #1C1714 100%)" }}
                >
                    {/* Decorative glow */}
                    <div
                        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full"
                        style={{ background: "radial-gradient(circle, rgba(201,168,76,0.12) 0%, transparent 70%)" }}
                    />

                    <div className="relative mx-auto max-w-3xl">
                        <div
                            className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl"
                            style={{ background: "rgba(201,168,76,0.1)", border: "1px solid rgba(201,168,76,0.3)" }}
                        >
                            <Crown size={28} style={{ color: "#C9A84C" }} />
                        </div>

                        <div className="mb-4 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs"
                            style={{ background: "rgba(201,168,76,0.1)", color: "#C9A84C", border: "1px solid rgba(201,168,76,0.25)" }}>
                            <Sparkles size={11} /> Introducing Mwezu Rewards
                        </div>

                        <h1 className="font-display text-5xl font-bold leading-tight mb-4 md:text-6xl"
                            style={{ color: "#FAF6EE" }}>
                            Beauty Should Be{" "}
                            <span style={{ color: "#C9A84C" }}>Rewarding</span>
                        </h1>

                        <p className="text-lg leading-relaxed mb-10 max-w-xl mx-auto"
                            style={{ color: "#9B896E" }}>
                            Earn points on every visit. Unlock exclusive perks, free services,
                            and VIP treatment — the more you visit, the more you earn.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link href="/book">
                                <Button size="lg" className="rounded-full px-8 py-6 text-base shadow-lg">
                                    Book & Start Earning
                                </Button>
                            </Link>
                            <a href="#tiers">
                                <Button size="lg" variant="outline"
                                    className="rounded-full px-8 py-6 text-base"
                                    style={{ borderColor: "rgba(201,168,76,0.3)", color: "#9B896E" }}>
                                    View All Tiers
                                </Button>
                            </a>
                        </div>

                        {/* Stats */}
                        <div className="mt-14 flex flex-wrap justify-center gap-8">
                            {[
                                { value: "K10 = 1pt", label: "Earning rate" },
                                { value: "100pts = K10", label: "Redemption value" },
                                { value: "4 Tiers", label: "Bronze to Platinum" },
                                { value: "Free", label: "No sign-up needed" },
                            ].map(({ value, label }) => (
                                <div key={label} className="text-center">
                                    <div className="font-display text-2xl font-bold" style={{ color: "#C9A84C" }}>{value}</div>
                                    <div className="text-xs mt-1 uppercase tracking-widest" style={{ color: "#9B896E" }}>{label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ── How it works ──────────────────────────────── */}
                <section className="py-20 px-6 bg-background">
                    <div className="mx-auto max-w-4xl">
                        <div className="text-center mb-12">
                            <p className="text-xs uppercase tracking-widest text-primary mb-2">Simple & Automatic</p>
                            <h2 className="font-display text-4xl font-bold text-foreground">How It Works</h2>
                            <p className="mt-3 text-muted-foreground">No app, no sign-up — just book and earn.</p>
                        </div>

                        <div className="grid sm:grid-cols-3 gap-6 mb-8">
                            {[
                                { step: "1", title: "Book a Service", desc: "Book any service at Mwezu Hair — online or walk-in. Points are automatically credited to your name." },
                                { step: "2", title: "Earn Points", desc: "Earn 1 point for every K10 you spend. Bonus points for referrals, birthdays, and your first booking." },
                                { step: "3", title: "Unlock Rewards", desc: "Reach a tier and unlock free services, discounts, and VIP perks. Redeem any time at the salon." },
                            ].map(({ step, title, desc }) => (
                                <div key={step} className="relative rounded-3xl p-6 text-center border border-border bg-card">
                                    <div
                                        className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl font-display text-xl font-bold"
                                        style={{ background: "rgba(201,168,76,0.1)", color: "#C9A84C", border: "1px solid rgba(201,168,76,0.25)" }}
                                    >
                                        {step}
                                    </div>
                                    <h3 className="font-display text-lg font-semibold text-foreground mb-2">{title}</h3>
                                    <p className="text-sm leading-relaxed text-muted-foreground">{desc}</p>
                                </div>
                            ))}
                        </div>

                        {/* Ways to earn */}
                        <div className="rounded-3xl border border-border bg-card p-6">
                            <h3 className="font-display text-lg font-semibold text-foreground mb-5 text-center">
                                Ways to Earn Points
                            </h3>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                {ways.map(({ icon: Icon, label, points }) => (
                                    <div
                                        key={label}
                                        className="flex flex-col items-center text-center rounded-2xl p-4"
                                        style={{ background: "#FAF6EE", border: "1px solid #EDE4D4" }}
                                    >
                                        <div
                                            className="flex h-10 w-10 items-center justify-center rounded-xl mb-3"
                                            style={{ background: "rgba(201,168,76,0.1)" }}
                                        >
                                            <Icon size={18} style={{ color: "#C9A84C" }} />
                                        </div>
                                        <div className="text-xs font-medium text-foreground mb-1">{label}</div>
                                        <div className="font-display text-sm font-bold" style={{ color: "#C9A84C" }}>{points}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <BraidDivider className="mt-16" />
                </section>

                {/* ── Tiers ─────────────────────────────────────── */}
                <section id="tiers" className="py-20 px-6 bg-secondary">
                    <div className="mx-auto max-w-5xl">
                        <div className="text-center mb-12">
                            <p className="text-xs uppercase tracking-widest text-primary mb-2">Membership Tiers</p>
                            <h2 className="font-display text-4xl font-bold text-foreground">The More You Visit,<br />The More You Earn</h2>
                            <p className="mt-3 text-muted-foreground">Four tiers, each with escalating rewards and exclusive perks.</p>
                        </div>

                        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            {tiers.map(({ name, icon: Icon, points, color, bg, border, perks, featured }) => (
                                <div
                                    key={name}
                                    className="relative rounded-3xl p-5 flex flex-col"
                                    style={{
                                        background: featured ? "#1C1714" : "#fff",
                                        border: `2px solid ${featured ? color : border}`,
                                        boxShadow: featured ? `0 8px 32px rgba(201,168,76,0.2)` : "none",
                                    }}
                                >
                                    {featured && (
                                        <div
                                            className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full px-3 py-0.5 text-xs font-bold"
                                            style={{ background: color, color: "#1C1714" }}
                                        >
                                            Most Popular
                                        </div>
                                    )}

                                    <div className="flex items-center gap-3 mb-4">
                                        <div
                                            className="flex h-10 w-10 items-center justify-center rounded-2xl"
                                            style={{ background: bg, border: `1px solid ${border}` }}
                                        >
                                            <Icon size={18} style={{ color }} />
                                        </div>
                                        <div>
                                            <div className="font-display font-bold text-base"
                                                style={{ color: featured ? "#FAF6EE" : "#1C1714" }}>
                                                {name}
                                            </div>
                                            <div className="text-xs" style={{ color: featured ? "#9B896E" : "#6B5B45" }}>
                                                {points} pts
                                            </div>
                                        </div>
                                    </div>

                                    <ul className="flex flex-col gap-2.5 flex-1">
                                        {perks.map(perk => (
                                            <li key={perk} className="flex items-start gap-2 text-xs">
                                                <CheckCircle2 size={13} style={{ color, marginTop: "1px", flexShrink: 0 }} />
                                                <span style={{ color: featured ? "#9B896E" : "#6B5B45" }}>{perk}</span>
                                            </li>
                                        ))}
                                    </ul>

                                    <Link href="/book" className="mt-5 block">
                                        <button
                                            className="w-full rounded-full py-2.5 text-xs font-semibold transition-opacity hover:opacity-90"
                                            style={{
                                                background: featured ? color : bg,
                                                color: featured ? "#1C1714" : color,
                                                border: `1px solid ${border}`,
                                            }}
                                        >
                                            Start Earning <ArrowRight size={12} className="inline ml-1" />
                                        </button>
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </div>

                    <BraidDivider className="mt-16" />
                </section>

                {/* ── FAQ ───────────────────────────────────────── */}
                <section className="py-20 px-6 bg-background">
                    <div className="mx-auto max-w-2xl">
                        <div className="text-center mb-12">
                            <p className="text-xs uppercase tracking-widest text-primary mb-2">Got Questions?</p>
                            <h2 className="font-display text-4xl font-bold text-foreground">FAQs</h2>
                        </div>

                        <div className="flex flex-col gap-4">
                            {faqs.map(({ q, a }) => (
                                <div key={q} className="rounded-2xl border border-border bg-card p-5">
                                    <h3 className="font-display font-semibold text-foreground mb-2">{q}</h3>
                                    <p className="text-sm leading-relaxed text-muted-foreground">{a}</p>
                                </div>
                            ))}
                        </div>

                        <div className="mt-12 text-center rounded-3xl p-8"
                            style={{ background: "linear-gradient(135deg, #1C1714, #2E2520)", border: "1px solid rgba(201,168,76,0.2)" }}>
                            <Crown size={28} style={{ color: "#C9A84C" }} className="mx-auto mb-4" />
                            <h3 className="font-display text-2xl font-bold mb-2" style={{ color: "#FAF6EE" }}>
                                Ready to Start Earning?
                            </h3>
                            <p className="text-sm mb-6" style={{ color: "#9B896E" }}>
                                Book your next appointment and your rewards journey begins automatically.
                            </p>
                            <Link href="/book">
                                <Button className="rounded-full px-8">
                                    Book an Appointment
                                </Button>
                            </Link>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
}