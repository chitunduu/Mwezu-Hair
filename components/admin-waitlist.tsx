"use client";

import { useState } from "react";
import {
    UserPlus, MessageSquare, Check, Clock,
    X, AlertTriangle, Scissors, CalendarDays,
} from "lucide-react";

const C = {
    surface: "#251D19", elevated: "#2E2520",
    gold: "#C9A84C", goldFaint: "rgba(201,168,76,0.1)", goldBorder: "rgba(201,168,76,0.25)",
    text: "#FAF6EE", muted: "#9B896E", border: "rgba(255,255,255,0.07)",
    success: "#4CAF7D", successFaint: "rgba(76,175,125,0.1)",
    danger: "#E05C5C", dangerFaint: "rgba(224,92,92,0.1)",
    warning: "#E09B4C", warningFaint: "rgba(224,155,76,0.1)",
};

type WaitlistStatus = "waiting" | "notified" | "filled" | "expired";

type WaitlistEntry = {
    id: string; name: string; phone: string;
    service: string; preferredDate: string;
    joinedOn: string; status: WaitlistStatus;
    notifiedOn?: string;
};

const mockWaitlist: WaitlistEntry[] = [
    { id: "w1", name: "Nchimunya Banda", phone: "0977 345 678", service: "Knotless Braids", preferredDate: "Sat 5 Jul", joinedOn: "Today", status: "waiting" },
    { id: "w2", name: "Lweendo Phiri", phone: "0966 456 789", service: "Luxe Sew-in", preferredDate: "Sat 5 Jul", joinedOn: "Yesterday", status: "notified", notifiedOn: "Today" },
    { id: "w3", name: "Mutinta Kasonde", phone: "0955 567 890", service: "Fulani Braids", preferredDate: "Sun 6 Jul", joinedOn: "2 Jul", status: "waiting" },
    { id: "w4", name: "Bupe Mwila", phone: "0977 678 901", service: "Spanish Curl", preferredDate: "Mon 7 Jul", joinedOn: "1 Jul", status: "filled" },
    { id: "w5", name: "Namukolo Tembo", phone: "0966 789 012", service: "Goddess Twists", preferredDate: "Wed 2 Jul", joinedOn: "1 Jun", status: "expired" },
];

function StatusBadge({ status }: { status: WaitlistStatus }) {
    const map: Record<WaitlistStatus, { label: string; bg: string; color: string }> = {
        waiting: { label: "Waiting", bg: C.warningFaint, color: C.warning },
        notified: { label: "Notified", bg: C.goldFaint, color: C.gold },
        filled: { label: "Filled ✓", bg: C.successFaint, color: C.success },
        expired: { label: "Expired", bg: C.dangerFaint, color: C.danger },
    };
    const s = map[status];
    return (
        <span className="rounded-full px-2.5 py-0.5 text-xs font-semibold"
            style={{ background: s.bg, color: s.color }}>
            {s.label}
        </span>
    );
}

export function AdminWaitlist() {
    const [entries, setEntries] = useState<WaitlistEntry[]>(mockWaitlist);
    const [filter, setFilter] = useState<WaitlistStatus | "all">("all");

    const filtered = filter === "all" ? entries : entries.filter(e => e.status === filter);
    const waitingCount = entries.filter(e => e.status === "waiting").length;
    const notifiedCount = entries.filter(e => e.status === "notified").length;
    const filledCount = entries.filter(e => e.status === "filled").length;

    function notifyClient(id: string) {
        const entry = entries.find(e => e.id === id);
        if (!entry) return;
        const msg = `Hi ${entry.name} 🌸\n\nGreat news! A slot has just opened up at *Mwezu Hair Salon* for your preferred date!\n\n✂️ *Service:* ${entry.service}\n📅 *Date:* ${entry.preferredDate}\n\nBook now before it's taken:\n👉 mwezu-hair.vercel.app/book\n\nFirst come, first served! 💛`;
        window.open(`https://wa.me/${entry.phone.replace(/\s/g, "").replace(/^0/, "260")}?text=${encodeURIComponent(msg)}`);
        setEntries(prev => prev.map(e => e.id === id ? { ...e, status: "notified", notifiedOn: "Today" } : e));
    }

    function markFilled(id: string) {
        setEntries(prev => prev.map(e => e.id === id ? { ...e, status: "filled" } : e));
    }

    function removeEntry(id: string) {
        setEntries(prev => prev.filter(e => e.id !== id));
    }

    return (
        <div>
            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-7">
                {[
                    { label: "Total Waiting", value: waitingCount.toString(), color: C.warning, icon: UserPlus },
                    { label: "Notified", value: notifiedCount.toString(), color: C.gold, icon: MessageSquare },
                    { label: "Slots Filled", value: filledCount.toString(), color: C.success, icon: Check },
                    { label: "Total Entries", value: entries.length.toString(), color: C.muted, icon: Clock },
                ].map(({ label, value, color, icon: Icon }) => (
                    <div key={label} className="rounded-2xl p-5" style={{ background: C.surface, border: `1px solid ${C.border}` }}>
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl mb-3" style={{ background: `${color}20` }}>
                            <Icon size={18} style={{ color }} />
                        </div>
                        <div className="font-display text-2xl font-bold" style={{ color: C.text }}>{value}</div>
                        <div className="text-xs mt-0.5" style={{ color: C.muted }}>{label}</div>
                    </div>
                ))}
            </div>

            {/* How it works */}
            <div
                className="flex items-start gap-3 rounded-2xl p-4 mb-6"
                style={{ background: C.goldFaint, border: `1px solid ${C.goldBorder}` }}
            >
                <AlertTriangle size={16} style={{ color: C.gold, marginTop: "2px" }} />
                <div className="text-sm leading-relaxed" style={{ color: C.muted }}>
                    When a slot opens up (e.g. via a cancellation), tap{" "}
                    <span style={{ color: C.gold, fontWeight: 600 }}>Notify via WhatsApp</span>{" "}
                    to send that client a message instantly. First to respond gets the slot!
                    Entries expire automatically after 8 weeks.
                </div>
            </div>

            {/* Filter */}
            <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
                <h3 className="font-display font-bold" style={{ color: C.text }}>Waitlist Entries</h3>
                <div className="flex gap-2 flex-wrap">
                    {(["all", "waiting", "notified", "filled", "expired"] as const).map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className="rounded-full px-3 py-1.5 text-xs font-medium capitalize transition-all"
                            style={{
                                background: filter === f ? C.gold : C.surface,
                                color: filter === f ? "#1C1714" : C.muted,
                                border: `1px solid ${filter === f ? C.gold : C.border}`,
                            }}
                        >
                            {f === "all" ? "All" : f.charAt(0).toUpperCase() + f.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            {filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                    <div className="text-4xl mb-3">🎉</div>
                    <div className="font-display text-lg font-bold mb-1" style={{ color: C.text }}>No entries here</div>
                    <div className="text-sm" style={{ color: C.muted }}>Nobody waiting for this filter.</div>
                </div>
            ) : (
                <div className="flex flex-col gap-3">
                    {filtered.map(entry => (
                        <div
                            key={entry.id}
                            className="rounded-2xl p-5"
                            style={{
                                background: C.surface,
                                border: `1px solid ${entry.status === "waiting" ? `${C.warning}30` : C.border}`,
                            }}
                        >
                            <div className="flex items-start justify-between gap-3 mb-3">
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                                        <span className="font-semibold text-sm" style={{ color: C.text }}>{entry.name}</span>
                                        <StatusBadge status={entry.status} />
                                    </div>
                                    <div className="flex items-center gap-3 text-xs flex-wrap" style={{ color: C.muted }}>
                                        <span className="flex items-center gap-1"><Scissors size={11} />{entry.service}</span>
                                        <span className="flex items-center gap-1"><CalendarDays size={11} />{entry.preferredDate}</span>
                                        <span className="flex items-center gap-1"><Clock size={11} />Joined: {entry.joinedOn}</span>
                                    </div>
                                    {entry.notifiedOn && (
                                        <div className="text-xs mt-1" style={{ color: C.gold }}>
                                            Notified on {entry.notifiedOn}
                                        </div>
                                    )}
                                </div>
                                <button
                                    onClick={() => removeEntry(entry.id)}
                                    className="opacity-40 hover:opacity-80 transition-opacity shrink-0"
                                    style={{ color: C.muted }}
                                >
                                    <X size={16} />
                                </button>
                            </div>

                            {/* Actions */}
                            {(entry.status === "waiting" || entry.status === "notified") && (
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => notifyClient(entry.id)}
                                        className="flex items-center gap-1.5 rounded-full px-4 py-2.5 text-xs font-semibold flex-1 justify-center transition-opacity hover:opacity-90"
                                        style={{ background: C.gold, color: "#1C1714" }}
                                    >
                                        <MessageSquare size={12} />
                                        {entry.status === "notified" ? "Re-notify" : "Notify via WhatsApp"}
                                    </button>
                                    <button
                                        onClick={() => markFilled(entry.id)}
                                        className="flex items-center gap-1.5 rounded-full px-4 py-2.5 text-xs font-medium transition-opacity hover:opacity-80"
                                        style={{ background: C.successFaint, color: C.success, border: `1px solid ${C.success}30` }}
                                    >
                                        <Check size={12} /> Filled
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}