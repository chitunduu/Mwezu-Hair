import { BraidDivider } from "@/components/braid-divider";
import { MapPin, Clock, Phone, AtSign } from "lucide-react";

const details = [
    {
        icon: MapPin,
        label: "Address",
        value: "Northmead Market, Shop 25, Lusaka, Zambia",
        link: "https://maps.google.com/?q=Northmead+Market+Lusaka+Zambia",
        linkLabel: "Get Directions",
    },
    {
        icon: Clock,
        label: "Hours",
        value: "Mon – Sat: 8:00am – 7:00pm\nSun: 9:00am – 4:00pm",
    },
    {
        icon: Phone,
        label: "WhatsApp",
        value: "Chat with us on WhatsApp",
        link: "https://wa.me/message/VN7W2GUDBRPGM1",
        linkLabel: "Open WhatsApp",
    },
    {
        icon: AtSign,
        label: "Instagram",
        value: "@mwezu_hair",
        link: "https://instagram.com/mwezu_hair",
        linkLabel: "Follow Us",
    },
];

export function Location() {
    return (
        <section id="location" className="bg-background px-6 py-24">
            <div className="mx-auto max-w-6xl">
                {/* Heading */}
                <div className="mb-12 text-center">
                    <p className="mb-3 text-xs uppercase tracking-widest text-primary">
                        Find Us
                    </p>
                    <h2 className="font-display text-4xl font-bold text-foreground md:text-5xl">
                        Come Visit Us
                    </h2>
                    <p className="mt-4 text-muted-foreground">
                        Walk-ins welcome. Bookings guaranteed.
                    </p>
                </div>

                <div className="grid gap-10 md:grid-cols-2 md:items-start">
                    {/* Map embed */}
                    <div className="overflow-hidden rounded-3xl border border-border shadow-sm">
                        <iframe
                            title="Mwezu Hair Salon Location"
                            src="https://maps.google.com/maps?q=Northmead+Market,Lusaka,Zambia&t=&z=15&ie=UTF8&iwloc=&output=embed"
                            width="100%"
                            height="420"
                            style={{ border: 0, display: "block" }}
                            allowFullScreen
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                        />
                    </div>

                    {/* Details */}
                    <div className="flex flex-col gap-5">
                        {details.map(({ icon: Icon, label, value, link, linkLabel }) => (
                            <div
                                key={label}
                                className="flex gap-5 rounded-2xl border border-border bg-card p-6 shadow-sm"
                            >
                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/10">
                                    <Icon size={20} className="text-primary" />
                                </div>
                                <div>
                                    <p className="text-xs uppercase tracking-widest text-muted-foreground">
                                        {label}
                                    </p>
                                    <p className="mt-1 whitespace-pre-line text-sm font-medium text-foreground">
                                        {value}
                                    </p>
                                    {link && linkLabel && (
                                        <a
                                            href={link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="mt-1.5 inline-block text-sm font-medium text-primary hover:underline"
                                        >
                                            {linkLabel} {"->"}
                                        </a>
                                    )}
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