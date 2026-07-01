import Link from "next/link";
import { BraidDivider } from "@/components/braid-divider";
import { Button } from "@/components/ui/button";
import { Heart, Sparkles, Users } from "lucide-react";

const values = [
    {
        icon: Heart,
        title: "Passion for Hair",
        description:
            "Every style we create is approached with genuine love for the craft. Hair isn't just what we do — it's who we are.",
    },
    {
        icon: Sparkles,
        title: "Premium Quality",
        description:
            "We use only quality hair products and take our time with every client. No rushing, no cutting corners.",
    },
    {
        icon: Users,
        title: "A Team That Cares",
        description:
            "Our small, skilled team means you get personal attention every single visit — not a conveyor belt experience.",
    },
];

export function About() {
    return (
        <section id="about" className="bg-secondary px-6 py-24">
            <div className="mx-auto max-w-6xl">
                <div className="grid gap-16 md:grid-cols-2 md:items-center">

                    {/* Text side */}
                    <div>
                        <p className="mb-3 text-xs uppercase tracking-widest text-primary">
                            Our Story
                        </p>
                        <h2 className="font-display text-4xl font-bold leading-tight text-foreground md:text-5xl">
                            More Than a Salon.{" "}
                            <span className="text-primary">A Safe Space.</span>
                        </h2>
                        <p className="mt-6 text-base leading-relaxed text-muted-foreground">
                            Mwezu Hair Salon was born from a simple belief — that every woman
                            deserves to feel beautiful, seen, and taken care of. Nestled in
                            Northmead Market, Shop 25, we've built a space where the girlies
                            come not just to get their hair done, but to feel at home.
                        </p>
                        <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                            From intricate knotless braids to stunning sew-ins, our team of
                            2–5 skilled stylists brings expertise, warmth, and creativity to
                            every appointment. Walk-ins are always welcome, and bookings
                            guarantee your slot.
                        </p>

                        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                            <Link href="/book">
                                <Button className="rounded-full px-6">Book an Appointment</Button>
                            </Link>
                            <Button variant="outline" className="rounded-full px-6">
                                Find Us on the Map
                            </Button>
                        </div>
                    </div>

                    {/* Values side */}
                    <div className="flex flex-col gap-6">
                        {values.map(({ icon: Icon, title, description }) => (
                            <div
                                key={title}
                                className="flex gap-5 rounded-2xl border border-border bg-card p-6 shadow-sm transition-shadow hover:shadow-md"
                            >
                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/10">
                                    <Icon size={20} className="text-primary" />
                                </div>
                                <div>
                                    <h3 className="font-display text-base font-semibold text-foreground">
                                        {title}
                                    </h3>
                                    <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                                        {description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <BraidDivider className="mt-16" />
            </div>
        </section>
    );
}