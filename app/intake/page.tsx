import { IntakeForm } from "../../components/intake-form";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export const metadata = {
    title: "Client Consultation Form | Mwezu Hair Salon",
    description: "Complete your Mwezu Hair consultation form before your first appointment.",
};

export default function IntakePage() {
    return (
        <div style={{ background: "#1C1714", minHeight: "100vh" }}>
            <header
                className="sticky top-0 z-50"
                style={{ borderBottom: "1px solid rgba(201,168,76,0.15)", background: "#1C1714" }}
            >
                <div className="mx-auto flex max-w-2xl items-center justify-between px-6 py-4">
                    <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 p-1">
                            <Image src="/logo1.jpg" alt="Mwezu Hair" width={36} height={36}
                                className="h-full w-full object-contain" />
                        </div>
                        <span className="font-display text-lg tracking-wide" style={{ color: "#FAF6EE" }}>
                            Mwezu Hair
                        </span>
                    </div>
                    <Link href="/"
                        className="flex items-center gap-1 text-sm transition-opacity hover:opacity-100"
                        style={{ color: "#9B896E" }}>
                        <ChevronLeft size={15} /> Back to site
                    </Link>
                </div>
            </header>

            <main className="mx-auto max-w-xl px-4 py-12">
                <div className="mb-10 text-center">
                    <p className="mb-2 text-xs uppercase tracking-widest" style={{ color: "#C9A84C" }}>
                        New Client
                    </p>
                    <h1 className="font-display text-4xl font-bold" style={{ color: "#FAF6EE" }}>
                        Consultation Form
                    </h1>
                    <p className="mt-3 text-sm max-w-sm mx-auto" style={{ color: "#9B896E" }}>
                        Help us give you the best possible service. Takes about 3 minutes to complete.
                    </p>
                </div>
                <IntakeForm />
            </main>
        </div>
    );
}