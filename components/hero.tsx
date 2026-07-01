import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BraidDivider } from "@/components/braid-divider";
import { Sparkles } from "lucide-react";

export function Hero() {
    return (
        <section className="relative overflow-hidden bg-background">
            <div className="pointer-events-none absolute -top-32 -right-32 h-[500px] w-[500px] rounded-full bg-primary/5" />
            <div className="pointer-events-none absolute -bottom-24 -left-24 h-[360px] w-[360px] rounded-full bg-primary/5" />

            <div className="relative mx-auto flex max-w-6xl flex-col items-center px-6 py-24 text-center md:py-36">

                <div className="mb-6 flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-xs text-muted-foreground shadow-sm">
                    <Sparkles size={12} className="text-primary" />
                    Northmead Market · Shop 25 · Lusaka
                </div>

                <h1 className="font-display max-w-3xl text-5xl font-bold leading-tight tracking-tight text-foreground md:text-7xl">
                    Where Beauty{" "}
                    <span className="relative inline-block text-primary">
                        Meets
                        <span
                            className="absolute -bottom-1 left-0 h-0.5 w-full"
                            style={{ background: "var(--mwezu-gold)", opacity: 0.4 }}
                        />
                    </span>{" "}
                    Expertise.
                </h1>

                <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
                    Braids, sew-ins, twists and extensions crafted by a team that lives
                    and breathes hair. Walk in or book your slot — your next style is
                    waiting.
                </p>

                <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
                    <Link href="/book">
                        <Button size="lg" className="rounded-full px-8 py-6 text-base shadow-md">
                            Book an Appointment
                        </Button>
                    </Link>
                    <Link href="#services">
                        <Button size="lg" variant="outline" className="rounded-full px-8 py-6 text-base">
                            View Services
                        </Button>
                    </Link>
                </div>

                <div className="mt-14 flex flex-wrap items-center justify-center gap-8 text-sm text-muted-foreground">
                    {[
                        { value: "1,000+", label: "Happy Clients" },
                        { value: "5+", label: "Years of Expertise" },
                        { value: "21", label: "Services Offered" },
                        { value: "2–5", label: "Expert Stylists" },
                    ].map(({ value, label }) => (
                        <div key={label} className="flex flex-col items-center gap-1">
                            <span className="font-display text-2xl font-bold text-primary">{value}</span>
                            <span className="text-xs uppercase tracking-widest">{label}</span>
                        </div>
                    ))}
                </div>

                <BraidDivider className="mt-16" />
            </div>
        </section>
    );
}