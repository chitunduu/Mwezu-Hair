import { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { BookingFlow } from "@/components/booking-flow";
import { ChevronLeft } from "lucide-react";

export const metadata = {
    title: "Book an Appointment | Mwezu Hair Salon",
    description: "Book your next style at Mwezu Hair Salon.",
};

export default function BookPage() {
    return (
        <div style={{ background: "#1C1714", minHeight: "100vh" }}>
            <header
                className="sticky top-0 z-50"
                style={{ borderBottom: "1px solid rgba(201,168,76,0.15)", background: "#1C1714" }}
            >
                <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4">
                    <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 p-1">
                            <Image
                                src="/logo1.jpg"
                                alt="Mwezu Hair"
                                width={36}
                                height={36}
                                className="h-full w-full object-contain"
                            />
                        </div>
                        <span className="font-display text-lg tracking-wide" style={{ color: "#FAF6EE" }}>
                            Mwezu Hair
                        </span>
                    </div>
                    <Link
                        href="/"
                        className="flex items-center gap-1 text-sm transition-opacity hover:opacity-100"
                        style={{ color: "#9B896E" }}
                    >
                        <ChevronLeft size={15} />
                        Back to site
                    </Link>
                </div>
            </header>

            <main className="mx-auto max-w-2xl px-4 py-12">
                <div className="mb-10 text-center">
                    <p className="mb-2 text-xs uppercase tracking-widest" style={{ color: "#C9A84C" }}>
                        Mwezu Hair Salon
                    </p>
                    <h1 className="font-display text-4xl font-bold" style={{ color: "#FAF6EE" }}>
                        Book an Appointment
                    </h1>
                    <p className="mt-3 text-sm" style={{ color: "#9B896E" }}>
                        Northmead Market · Shop 25 · Lusaka
                    </p>
                </div>
                <Suspense fallback={
                    <div className="flex items-center justify-center py-20">
                        <div className="text-sm" style={{ color: "#9B896E" }}>Loading...</div>
                    </div>
                }>
                    <BookingFlow />
                </Suspense>
            </main>
        </div>
    );
}