"use client";

import { useState } from "react";
import Image from "next/image";
import { AdminDashboard } from "../../components/admin-dashboard";
import { AdminInventory } from "@/components/admin-inventory";
import { AdminWaitlist } from "@/components/admin-waitlist";
import { AdminCheckout } from "@/components/admin-checkout";
import { Lock } from "lucide-react";

const ADMIN_PIN = "1234";

export default function AdminPage() {
    const [pin, setPin] = useState("");
    const [unlocked, setUnlocked] = useState(false);
    const [error, setError] = useState(false);

    function handleUnlock() {
        if (pin === ADMIN_PIN) {
            setUnlocked(true);
            setError(false);
        } else {
            setError(true);
            setPin("");
        }
    }

    if (unlocked) return <AdminDashboard />;

    return (
        <div
            className="flex min-h-screen items-center justify-center px-4"
            style={{ background: "#1C1714" }}
        >
            <div
                className="w-full max-w-sm rounded-3xl p-8 text-center"
                style={{ background: "#251D19", border: "1px solid rgba(201,168,76,0.2)" }}
            >
                {/* Logo */}
                <div className="mb-6 flex justify-center">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 p-1.5">
                        <Image
                            src="/logo1.jpg"
                            alt="Mwezu Hair"
                            width={48}
                            height={48}
                            className="h-full w-full object-contain"
                        />
                    </div>
                </div>

                <div
                    className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full"
                    style={{ background: "rgba(201,168,76,0.1)", border: "1px solid rgba(201,168,76,0.3)" }}
                >
                    <Lock size={20} style={{ color: "#C9A84C" }} />
                </div>

                <h1 className="font-display text-2xl font-bold mb-1" style={{ color: "#FAF6EE" }}>
                    Admin Access
                </h1>
                <p className="text-sm mb-8" style={{ color: "#9B896E" }}>
                    Enter your PIN to access the Mwezu Hair dashboard
                </p>

                {/* PIN dots display */}
                <div className="flex justify-center gap-3 mb-6">
                    {[0, 1, 2, 3].map((i) => (
                        <div
                            key={i}
                            className="h-3 w-3 rounded-full transition-all"
                            style={{
                                background: pin.length > i ? "#C9A84C" : "rgba(255,255,255,0.1)",
                                border: `1px solid ${pin.length > i ? "#C9A84C" : "rgba(255,255,255,0.15)"}`,
                            }}
                        />
                    ))}
                </div>

                {/* PIN pad */}
                <div className="grid grid-cols-3 gap-3 mb-4">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, null, 0, "⌫"].map((key, i) => (
                        <button
                            key={i}
                            onClick={() => {
                                if (key === null) return;
                                if (key === "⌫") {
                                    setPin((p) => p.slice(0, -1));
                                    setError(false);
                                } else if (pin.length < 4) {
                                    const newPin = pin + key.toString();
                                    setPin(newPin);
                                    if (newPin.length === 4) {
                                        setTimeout(() => {
                                            if (newPin === ADMIN_PIN) {
                                                setUnlocked(true);
                                            } else {
                                                setError(true);
                                                setPin("");
                                            }
                                        }, 150);
                                    }
                                }
                            }}
                            className={`rounded-2xl py-4 text-lg font-semibold transition-all ${key === null ? "invisible" : ""
                                }`}
                            style={{
                                background:
                                    key === null
                                        ? "transparent"
                                        : error
                                            ? "rgba(224,92,92,0.1)"
                                            : "rgba(255,255,255,0.05)",
                                color: error ? "#E05C5C" : "#FAF6EE",
                                border: `1px solid ${error ? "rgba(224,92,92,0.2)" : "rgba(255,255,255,0.08)"}`,
                            }}
                        >
                            {key}
                        </button>
                    ))}
                </div>

                {error && (
                    <p className="text-sm" style={{ color: "#E05C5C" }}>
                        Incorrect PIN. Try again.
                    </p>
                )}

                <button
                    onClick={handleUnlock}
                    className="mt-4 w-full rounded-full py-3.5 text-sm font-semibold transition-opacity hover:opacity-90"
                    style={{ background: "#C9A84C", color: "#1C1714" }}
                >
                    Unlock Dashboard
                </button>

                <p className="mt-6 text-xs" style={{ color: "#9B896E" }}>
                    Default PIN: 1234 · Change in settings
                </p>
            </div>
        </div>
    );
}