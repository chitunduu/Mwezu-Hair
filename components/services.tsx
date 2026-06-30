"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BraidDivider } from "@/components/braid-divider";
import { ArrowRight } from "lucide-react";

const categories = [
    "All",
    "Protective Braids",
    "Statement Styles",
    "Twists & Naturals",
    "Sew-ins & Extensions",
    "Hair Care",
];

const services = [
    {
        name: "Knotless Braids",
        category: "Protective Braids",
        description: "Clean, natural-looking braids with no tension at the root.",
        options: ["Small · Medium · Jumbo", "Normal · Hip · Bum length"],
        popular: true,
    },
    {
        name: "Box Braids",
        category: "Protective Braids",
        description: "Classic square-parted braids, timeless and versatile.",
        popular: false,
    },
    {
        name: "Stitch Braids",
        category: "Protective Braids",
        description: "Feed-in style with precise stitch partings for a sleek finish.",
        popular: false,
    },
    {
        name: "Deep Wave Braids",
        category: "Protective Braids",
        description: "Braids blended with deep wave extensions for a textured look.",
        popular: false,
    },
    {
        name: "Bone Straight Braids",
        category: "Protective Braids",
        description: "Ultra-sleek, straight braids for a polished, sharp finish.",
        popular: false,
    },
    {
        name: "Remy Braids",
        category: "Protective Braids",
        description: "Premium Remy hair extensions braided for a natural feel.",
        popular: false,
    },
    {
        name: "Patewo Braids",
        category: "Protective Braids",
        description: "Wide, flat cornrows styled close to the scalp.",
        popular: false,
    },
    {
        name: "Koroba Braids",
        category: "Protective Braids",
        description: "Bold bucket-shaped braid style — a true statement look.",
        popular: true,
    },
    {
        name: "Fulani Braids",
        category: "Statement Styles",
        description: "Heritage-inspired braids with centre parts and wrap details.",
        popular: true,
    },
    {
        name: "Fulani + Spanish Curl",
        category: "Statement Styles",
        description: "Fulani braids with curly ends for a romantic, boho finish.",
        popular: true,
    },
    {
        name: "Goddess Braids",
        category: "Statement Styles",
        description: "Oversized, sculptural braids with an ethereal, goddess-like feel.",
        popular: false,
    },
    {
        name: "Caribbean Twists",
        category: "Statement Styles",
        description: "Springy, bouncy twists inspired by Caribbean style.",
        popular: false,
    },
    {
        name: "Spanish Curl",
        category: "Statement Styles",
        description: "Luscious, defined curls for a dramatic, glamorous look.",
        popular: true,
    },
    {
        name: "Natural Twists",
        category: "Twists & Naturals",
        description: "Two-strand twists that celebrate and protect your natural hair.",
        popular: false,
    },
    {
        name: "Micro Natural Twists",
        category: "Twists & Naturals",
        description: "Finer, more delicate twists for an intricate, detailed look.",
        popular: false,
    },
    {
        name: "Goddess Twists",
        category: "Twists & Naturals",
        description: "Chunky twists with curly ends — bohemian and beautiful.",
        popular: true,
    },
    {
        name: "Luxe Sew-in",
        category: "Sew-ins & Extensions",
        description: "Premium full sew-in weave for a flawless, natural finish.",
        popular: true,
    },
    {
        name: "Mocha Sew-in",
        category: "Sew-ins & Extensions",
        description: "Rich, warm-toned weave installation for a sun-kissed look.",
        popular: false,
    },
    {
        name: "Remy Fusion Sew-in",
        category: "Sew-ins & Extensions",
        description: "Remy hair fused seamlessly with your natural hair for length and volume.",
        popular: false,
    },
    {
        name: "Wash & Blow Dry",
        category: "Hair Care",
        description: "Deep cleanse and professional blow dry to refresh your hair.",
        popular: false,
    },
    {
        name: "Unbraiding",
        category: "Hair Care",
        description: "Careful, damage-free removal of braids or extensions.",
        popular: false,
    },
];

export function Services() {
    const [active, setActive] = useState("All");

    const filtered =
        active === "All"
            ? services
            : services.filter((s) => s.category === active);

    return (
        <section id="services" className="bg-background px-6 py-24">
            <div className="mx-auto max-w-6xl">
                {/* Heading */}
                <div className="mb-12 text-center">
                    <p className="mb-3 text-xs uppercase tracking-widest text-primary">
                        What We Offer
                    </p>
                    <h2 className="font-display text-4xl font-bold text-foreground md:text-5xl">
                        Our Services
                    </h2>
                    <p className="mt-4 text-muted-foreground">
                        From protective styles to premium extensions — crafted with care.
                    </p>
                </div>

                {/* Category filter */}
                <div className="mb-10 flex flex-wrap justify-center gap-2">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setActive(cat)}
                            className={`rounded-full px-5 py-2 text-sm font-medium transition-all ${active === cat
                                    ? "bg-primary text-primary-foreground shadow-md"
                                    : "border border-border bg-card text-muted-foreground hover:border-primary hover:text-foreground"
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Service cards grid */}
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {filtered.map((service) => (
                        <Card
                            key={service.name}
                            className="group relative overflow-hidden border-border transition-shadow hover:shadow-lg"
                        >
                            {/* Gold accent bar on hover */}
                            <div className="absolute left-0 top-0 h-full w-1 bg-primary opacity-0 transition-opacity group-hover:opacity-100" />

                            <CardContent className="p-6">
                                <div className="mb-3 flex items-start justify-between gap-2">
                                    <h3 className="font-display text-lg font-semibold text-foreground">
                                        {service.name}
                                    </h3>
                                    {service.popular && (
                                        <Badge className="shrink-0 rounded-full text-xs">
                                            Popular
                                        </Badge>
                                    )}
                                </div>

                                <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
                                    {service.description}
                                </p>

                                {/* Options (Knotless Braids etc.) */}
                                {service.options && (
                                    <div className="mb-4 flex flex-col gap-1.5">
                                        {service.options.map((opt) => (
                                            <span
                                                key={opt}
                                                className="inline-block rounded-md bg-secondary px-3 py-1 text-xs text-muted-foreground"
                                            >
                                                {opt}
                                            </span>
                                        ))}
                                    </div>
                                )}

                                <button className="flex items-center gap-1.5 text-sm font-medium text-primary transition-all hover:gap-2.5">
                                    Book this style
                                    <ArrowRight size={14} />
                                </button>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* View all CTA */}
                <div className="mt-14 text-center">
                    <Button variant="outline" size="lg" className="rounded-full px-8">
                        View Full Price List
                    </Button>
                </div>

                <BraidDivider className="mt-16" />
            </div>
        </section>
    );
}