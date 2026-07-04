"use client";

import { useState } from "react";
import {
    Search, Phone, Scissors, Calendar,
    Banknote, Star, MessageSquare, X,
    ChevronRight, Clock, StickyNote, Plus,
} from "lucide-react";

const C = {
    bg: "#1C1714", surface: "#251D19", elevated: "#2E2520",
    gold: "#C9A84C", goldFaint: "rgba(201,168,76,0.1)", goldBorder: "rgba(201,168,76,0.25)",
    text: "#FAF6EE", muted: "#9B896E", border: "rgba(255,255,255,0.07)",
    success: "#4CAF7D", successFaint: "rgba(76,175,125,0.1)",
    warning: "#E09B4C", warningFaint: "rgba(224,155,76,0.1)",
    danger: "#E05C5C", dangerFaint: "rgba(224,92,92,0.1)",
};

// ─── Types ─────────────────────────────────────────────────
type ClientStatus = "active" | "at-risk" | "new";

type ServiceRecord = {
    date: string; service: string; variant?: string;
    price: number; duration: string; status: "completed" | "confirmed" | "cancelled";
};

type Client = {
    id: string; name: string; phone: string; initials: string;
    memberSince: string; preferredService: string;
    status: ClientStatus; notes: string;
    totalVisits: number; totalSpent: number;
    lastVisit: string; history: ServiceRecord[];
};

// ─── Mock client data ──────────────────────────────────────
const mockClients: Client[] = [
    {
        id: "c1", name: "Thandiwe Mwale", phone: "0977 123 456",
        initials: "TM", memberSince: "Jan 2024",
        preferredService: "Knotless Braids", status: "active",
        notes: "Prefers medium knotless braids, always hip length. Very punctual. Bring inspo pics from Pinterest.",
        totalVisits: 8, totalSpent: 2800, lastVisit: "Today",
        history: [
            { date: "Today", service: "Knotless Braids", variant: "Medium · Hip", price: 350, duration: "4 hrs", status: "confirmed" },
            { date: "12 May 2025", service: "Knotless Braids", variant: "Medium · Hip", price: 350, duration: "4 hrs", status: "completed" },
            { date: "3 Mar 2025", service: "Knotless Braids", variant: "Small · Bum", price: 400, duration: "5 hrs", status: "completed" },
            { date: "10 Jan 2025", service: "Fulani Braids", price: 400, duration: "3 hrs", status: "completed" },
            { date: "5 Nov 2024", service: "Knotless Braids", variant: "Medium · Hip", price: 350, duration: "4 hrs", status: "completed" },
        ],
    },
    {
        id: "c2", name: "Naledi Phiri", phone: "0966 234 567",
        initials: "NP", memberSince: "Mar 2024",
        preferredService: "Fulani Braids", status: "active",
        notes: "Loves Fulani styles. Always books on Saturdays. Has fine hair — be gentle with tension.",
        totalVisits: 5, totalSpent: 2050, lastVisit: "Today",
        history: [
            { date: "Today", service: "Fulani Braids", price: 400, duration: "3 hrs", status: "confirmed" },
            { date: "8 Apr 2025", service: "Fulani + Spanish Curl", price: 480, duration: "4 hrs", status: "completed" },
            { date: "15 Feb 2025", service: "Fulani Braids", price: 400, duration: "3 hrs", status: "completed" },
            { date: "20 Dec 2024", service: "Goddess Braids", price: 420, duration: "3 hrs", status: "completed" },
            { date: "1 Nov 2024", service: "Fulani Braids", price: 350, duration: "3 hrs", status: "completed" },
        ],
    },
    {
        id: "c3", name: "Chanda Banda", phone: "0955 345 678",
        initials: "CB", memberSince: "Jun 2024",
        preferredService: "Luxe Sew-in", status: "active",
        notes: "Prefers Brazilian straight hair. Allergic to certain glues — check before sew-in. Usually tips well.",
        totalVisits: 4, totalSpent: 2000, lastVisit: "Today",
        history: [
            { date: "Today", service: "Luxe Sew-in", price: 500, duration: "4 hrs", status: "confirmed" },
            { date: "2 May 2025", service: "Luxe Sew-in", price: 500, duration: "4 hrs", status: "completed" },
            { date: "14 Feb 2025", service: "Remy Fusion Sew-in", price: 580, duration: "5 hrs", status: "completed" },
            { date: "10 Nov 2024", service: "Mocha Sew-in", price: 420, duration: "4 hrs", status: "completed" },
        ],
    },
    {
        id: "c4", name: "Mutale Zulu", phone: "0977 456 789",
        initials: "MZ", memberSince: "Sep 2024",
        preferredService: "Spanish Curl", status: "active",
        notes: "Always wants the Spanish Curl. Prefers volume over length. Books same-day sometimes.",
        totalVisits: 3, totalSpent: 1350, lastVisit: "Today",
        history: [
            { date: "Today", service: "Spanish Curl", price: 450, duration: "3 hrs", status: "confirmed" },
            { date: "20 Apr 2025", service: "Spanish Curl", price: 450, duration: "3 hrs", status: "completed" },
            { date: "5 Feb 2025", service: "Goddess Twists", price: 380, duration: "3 hrs", status: "completed" },
        ],
    },
    {
        id: "c5", name: "Namwinga Kasonde", phone: "0966 567 890",
        initials: "NK", memberSince: "Feb 2024",
        preferredService: "Goddess Twists", status: "active",
        notes: "Regular client. Prefers chunky goddess twists. Very specific about parting — take time.",
        totalVisits: 6, totalSpent: 2250, lastVisit: "Tomorrow",
        history: [
            { date: "Tomorrow", service: "Goddess Twists", price: 380, duration: "3 hrs", status: "confirmed" },
            { date: "10 Apr 2025", service: "Goddess Twists", price: 380, duration: "3 hrs", status: "completed" },
            { date: "18 Feb 2025", service: "Natural Twists", price: 200, duration: "2 hrs", status: "completed" },
            { date: "5 Dec 2024", service: "Goddess Twists", price: 380, duration: "3 hrs", status: "completed" },
            { date: "3 Oct 2024", service: "Micro Natural Twists", price: 280, duration: "2 hrs", status: "completed" },
            { date: "15 Jul 2024", service: "Goddess Twists", price: 380, duration: "3 hrs", status: "completed" },
        ],
    },
    {
        id: "c6", name: "Bwalya Mwamba", phone: "0955 678 901",
        initials: "BM", memberSince: "Apr 2024",
        preferredService: "Box Braids", status: "active",
        notes: "Likes box braids in dark brown. Student — sometimes reschedules. Call before appointment day.",
        totalVisits: 4, totalSpent: 1200, lastVisit: "Tomorrow",
        history: [
            { date: "Tomorrow", service: "Box Braids", price: 300, duration: "3 hrs", status: "confirmed" },
            { date: "5 Mar 2025", service: "Box Braids", price: 300, duration: "3 hrs", status: "completed" },
            { date: "12 Dec 2024", service: "Box Braids", price: 300, duration: "3 hrs", status: "completed" },
            { date: "2 Sep 2024", service: "Stitch Braids", price: 280, duration: "2 hrs", status: "completed" },
        ],
    },
    {
        id: "c7", name: "Mwila Chitalu", phone: "0977 789 012",
        initials: "MC", memberSince: "Nov 2023",
        preferredService: "Wash & Blow Dry", status: "at-risk",
        notes: "Long-time client. Used to come every 3 weeks for wash & blow dry. Hasn't booked since Feb.",
        totalVisits: 12, totalSpent: 1560, lastVisit: "4 Feb 2025",
        history: [
            { date: "4 Feb 2025", service: "Wash & Blow Dry", price: 120, duration: "1 hr", status: "completed" },
            { date: "14 Jan 2025", service: "Wash & Blow Dry", price: 120, duration: "1 hr", status: "completed" },
            { date: "24 Dec 2024", service: "Wash & Blow Dry", price: 120, duration: "1 hr", status: "completed" },
            { date: "3 Dec 2024", service: "Wash & Blow Dry", price: 120, duration: "1 hr", status: "completed" },
        ],
    },
    {
        id: "c8", name: "Kapasa Tembo", phone: "0966 890 123",
        initials: "KT", memberSince: "Jan 2025",
        preferredService: "Fulani + Spanish Curl", status: "active",
        notes: "New favourite — Fulani + Spanish Curl combo. Books well in advance. Very happy with results.",
        totalVisits: 2, totalSpent: 960, lastVisit: "In 2 days",
        history: [
            { date: "In 2 days", service: "Fulani + Spanish Curl", price: 480, duration: "4 hrs", status: "confirmed" },
            { date: "10 Mar 2025", service: "Fulani + Spanish Curl", price: 480, duration: "4 hrs", status: "completed" },
        ],
    },
    {
        id: "c9", name: "Mutinta Ngosa", phone: "0977 901 234",
        initials: "MN", memberSince: "May 2025",
        preferredService: "Goddess Braids", status: "new",
        notes: "First-time client. Referred by Thandiwe Mwale. Mentioned interest in Fulani braids next time.",
        totalVisits: 1, totalSpent: 420, lastVisit: "In 3 days",
        history: [
            { date: "In 3 days", service: "Goddess Braids", price: 420, duration: "3 hrs", status: "confirmed" },
        ],
    },
    {
        id: "c10", name: "Chibwe Musonda", phone: "0955 012 345",
        initials: "CM", memberSince: "Jun 2025",
        preferredService: "Stitch Braids", status: "new",
        notes: "Brand new client. Booked online. No additional notes yet.",
        totalVisits: 1, totalSpent: 280, lastVisit: "In 4 days",
        history: [
            { date: "In 4 days", service: "Stitch Braids", price: 280, duration: "2 hrs", status: "confirmed" },
        ],
    },
];

// ─── Helpers ───────────────────────────────────────────────
function getStatusConfig(status: ClientStatus) {
    const map = {
        active: { label: "Active", bg: C.successFaint, color: C.success },
        "at-risk": { label: "At Risk ⚠️", bg: C.dangerFaint, color: C.danger },
        new: { label: "New", bg: C.goldFaint, color: C.gold },
    };
    return map[status];
}

function getHistoryStatusColor(status: ServiceRecord["status"]) {
    if (status === "completed") return C.success;
    if (status === "confirmed") return C.gold;
    return C.danger;
}

// ─── Client Detail Modal ───────────────────────────────────
function ClientModal({ client, onClose, onNoteAdd }: {
    client: Client;
    onClose: () => void;
    onNoteAdd: (id: string, note: string) => void;
}) {
    const [note, setNote] = useState("");
    const [addingNote, setAddingNote] = useState(false);
    const statusConfig = getStatusConfig(client.status);

    return (
        <div
            className="fixed inset-0 z-50 flex items-start justify-center p-4 overflow-y-auto"
            style={{ background: "rgba(0,0,0,0.75)" }}
            onClick={onClose}
        >
            <div
                className="w-full max-w-md rounded-3xl my-8"
                style={{ background: C.surface, border: `1px solid ${C.goldBorder}` }}
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="p-6 border-b" style={{ borderColor: C.border }}>
                    <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div
                                className="flex h-12 w-12 items-center justify-center rounded-2xl text-lg font-bold shrink-0"
                                style={{ background: C.goldFaint, color: C.gold, border: `1px solid ${C.goldBorder}` }}
                            >
                                {client.initials}
                            </div>
                            <div>
                                <h3 className="font-display text-xl font-bold" style={{ color: C.text }}>{client.name}</h3>
                                <p className="text-sm" style={{ color: C.muted }}>Client since {client.memberSince}</p>
                            </div>
                        </div>
                        <button onClick={onClose} style={{ color: C.muted }}><X size={20} /></button>
                    </div>

                    {/* Status + preferred service */}
                    <div className="flex items-center gap-2 flex-wrap">
                        <span
                            className="rounded-full px-3 py-1 text-xs font-semibold"
                            style={{ background: statusConfig.bg, color: statusConfig.color }}
                        >
                            {statusConfig.label}
                        </span>
                        <span
                            className="flex items-center gap-1 rounded-full px-3 py-1 text-xs"
                            style={{ background: C.elevated, color: C.muted }}
                        >
                            <Star size={10} style={{ color: C.gold }} />
                            Prefers {client.preferredService}
                        </span>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-0" style={{ borderBottom: `1px solid ${C.border}` }}>
                    {[
                        { label: "Total Visits", value: `${client.totalVisits}`, icon: Calendar },
                        { label: "Total Spent", value: `K${client.totalSpent.toLocaleString()}`, icon: Banknote },
                        { label: "Avg/Visit", value: `K${Math.round(client.totalSpent / client.totalVisits)}`, icon: Scissors },
                    ].map(({ label, value, icon: Icon }, i) => (
                        <div
                            key={label}
                            className="flex flex-col items-center py-4 px-3 text-center"
                            style={{ borderRight: i < 2 ? `1px solid ${C.border}` : "none" }}
                        >
                            <div className="font-display text-xl font-bold mb-0.5" style={{ color: C.gold }}>{value}</div>
                            <div className="text-xs" style={{ color: C.muted }}>{label}</div>
                        </div>
                    ))}
                </div>

                {/* Contact */}
                <div className="px-6 pt-5 pb-3">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2 text-sm" style={{ color: C.muted }}>
                            <Phone size={13} />{client.phone}
                        </div>
                        <button
                            onClick={() => window.open(`https://wa.me/${client.phone.replace(/\s/g, "")}`)}
                            className="flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold transition-opacity hover:opacity-90"
                            style={{ background: C.gold, color: "#1C1714" }}
                        >
                            <MessageSquare size={12} /> WhatsApp
                        </button>
                    </div>

                    {/* Last visit */}
                    <div
                        className="flex items-center gap-2 rounded-xl px-3 py-2 mb-5 text-sm"
                        style={{ background: client.status === "at-risk" ? C.dangerFaint : C.elevated }}
                    >
                        <Clock size={13} style={{ color: client.status === "at-risk" ? C.danger : C.muted }} />
                        <span style={{ color: client.status === "at-risk" ? C.danger : C.muted }}>
                            Last visit: <span className="font-medium">{client.lastVisit}</span>
                            {client.status === "at-risk" && " — Consider reaching out!"}
                        </span>
                    </div>
                </div>

                {/* Notes */}
                <div className="px-6 pb-5" style={{ borderBottom: `1px solid ${C.border}` }}>
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2 text-xs uppercase tracking-widest" style={{ color: C.gold }}>
                            <StickyNote size={12} /> Notes
                        </div>
                        <button
                            onClick={() => setAddingNote(!addingNote)}
                            className="flex items-center gap-1 text-xs rounded-full px-3 py-1 transition-opacity hover:opacity-80"
                            style={{ background: C.elevated, color: C.muted }}
                        >
                            <Plus size={11} /> Add
                        </button>
                    </div>
                    <p className="text-sm leading-relaxed" style={{ color: C.muted }}>{client.notes}</p>

                    {addingNote && (
                        <div className="mt-3">
                            <textarea
                                value={note}
                                onChange={e => setNote(e.target.value)}
                                placeholder="Add a note about this client..."
                                rows={2}
                                className="w-full rounded-xl px-3 py-2.5 text-sm outline-none resize-none"
                                style={{ background: C.elevated, border: `1px solid ${C.goldBorder}`, color: C.text, caretColor: C.gold }}
                            />
                            <div className="flex gap-2 mt-2">
                                <button
                                    onClick={() => { if (note.trim()) { onNoteAdd(client.id, note); setNote(""); setAddingNote(false); } }}
                                    className="rounded-full px-4 py-2 text-xs font-semibold"
                                    style={{ background: C.gold, color: "#1C1714" }}
                                >
                                    Save Note
                                </button>
                                <button
                                    onClick={() => { setNote(""); setAddingNote(false); }}
                                    className="rounded-full px-4 py-2 text-xs"
                                    style={{ background: C.elevated, color: C.muted }}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Service history */}
                <div className="p-6">
                    <div className="text-xs uppercase tracking-widest mb-4" style={{ color: C.gold }}>
                        Service History
                    </div>
                    <div className="flex flex-col gap-2">
                        {client.history.map((h, i) => (
                            <div
                                key={i}
                                className="flex items-start justify-between gap-3 rounded-xl px-4 py-3"
                                style={{ background: C.elevated, border: `1px solid ${C.border}` }}
                            >
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-0.5">
                                        <div
                                            className="h-1.5 w-1.5 rounded-full shrink-0"
                                            style={{ background: getHistoryStatusColor(h.status) }}
                                        />
                                        <span className="text-sm font-semibold truncate" style={{ color: C.text }}>
                                            {h.service}
                                        </span>
                                    </div>
                                    {h.variant && (
                                        <div className="text-xs ml-3.5" style={{ color: C.muted }}>{h.variant}</div>
                                    )}
                                    <div className="flex items-center gap-3 text-xs mt-1 ml-3.5" style={{ color: C.muted }}>
                                        <span>{h.date}</span>
                                        <span className="flex items-center gap-1"><Clock size={10} />{h.duration}</span>
                                    </div>
                                </div>
                                <div className="text-sm font-bold shrink-0" style={{ color: C.gold }}>
                                    K{h.price}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

// ─── Main Clients Component ────────────────────────────────
export function AdminClients() {
    const [clients, setClients] = useState<Client[]>(mockClients);
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState<"all" | "active" | "at-risk" | "new">("all");
    const [selected, setSelected] = useState<Client | null>(null);

    const filtered = clients.filter(c => {
        const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) ||
            c.phone.includes(search) || c.preferredService.toLowerCase().includes(search.toLowerCase());
        const matchFilter = filter === "all" || c.status === filter;
        return matchSearch && matchFilter;
    });

    function handleNoteAdd(id: string, note: string) {
        setClients(prev => prev.map(c =>
            c.id === id ? { ...c, notes: c.notes + "\n\n" + note } : c
        ));
        setSelected(prev => prev?.id === id ? { ...prev, notes: prev.notes + "\n\n" + note } : prev);
    }

    const atRiskCount = clients.filter(c => c.status === "at-risk").length;
    const activeCount = clients.filter(c => c.status === "active").length;
    const newCount = clients.filter(c => c.status === "new").length;
    const totalRevenue = clients.reduce((s, c) => s + c.totalSpent, 0);

    return (
        <div>
            {/* Stats strip */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-7">
                {[
                    { label: "Total Clients", value: clients.length.toString(), color: C.gold },
                    { label: "Active", value: activeCount.toString(), color: C.success },
                    { label: "At Risk", value: atRiskCount.toString(), color: C.danger },
                    { label: "Lifetime Revenue", value: `K${totalRevenue.toLocaleString()}`, color: C.gold },
                ].map(({ label, value, color }) => (
                    <div
                        key={label}
                        className="rounded-2xl p-4"
                        style={{ background: C.surface, border: `1px solid ${C.border}` }}
                    >
                        <div className="font-display text-2xl font-bold" style={{ color }}>{value}</div>
                        <div className="text-xs mt-0.5" style={{ color: C.muted }}>{label}</div>
                    </div>
                ))}
            </div>

            {/* At-risk alert */}
            {atRiskCount > 0 && (
                <div
                    className="flex items-center gap-3 rounded-2xl px-5 py-4 mb-6"
                    style={{ background: C.dangerFaint, border: `1px solid ${C.danger}30` }}
                >
                    <div className="text-lg">⚠️</div>
                    <div>
                        <div className="text-sm font-semibold" style={{ color: C.danger }}>
                            {atRiskCount} client{atRiskCount > 1 ? "s" : ""} at risk of churning
                        </div>
                        <div className="text-xs mt-0.5" style={{ color: C.muted }}>
                            These clients haven&apos;t booked in 45+ days. Consider reaching out on WhatsApp.
                        </div>
                    </div>
                    <button
                        onClick={() => setFilter("at-risk")}
                        className="ml-auto text-xs font-semibold shrink-0 flex items-center gap-1"
                        style={{ color: C.danger }}
                    >
                        View <ChevronRight size={13} />
                    </button>
                </div>
            )}

            {/* Search + filters */}
            <div className="flex flex-col sm:flex-row gap-3 mb-5">
                <div className="relative flex-1">
                    <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: C.muted }} />
                    <input
                        type="text"
                        placeholder="Search by name, phone or service..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="w-full rounded-xl py-3 pl-9 pr-4 text-sm outline-none"
                        style={{ background: C.surface, border: `1px solid ${C.border}`, color: C.text, caretColor: C.gold }}
                        onFocus={e => { e.target.style.borderColor = C.gold; e.target.style.boxShadow = `0 0 0 3px ${C.goldFaint}`; }}
                        onBlur={e => { e.target.style.borderColor = C.border; e.target.style.boxShadow = "none"; }}
                    />
                </div>

                <div className="flex gap-2">
                    {([
                        { id: "all", label: "All" },
                        { id: "active", label: "Active" },
                        { id: "at-risk", label: "At Risk" },
                        { id: "new", label: "New" },
                    ] as const).map(({ id, label }) => (
                        <button
                            key={id}
                            onClick={() => setFilter(id)}
                            className="rounded-full px-4 py-2.5 text-xs font-medium transition-all whitespace-nowrap"
                            style={{
                                background: filter === id ? C.gold : C.surface,
                                color: filter === id ? "#1C1714" : C.muted,
                                border: `1px solid ${filter === id ? C.gold : C.border}`,
                            }}
                        >
                            {label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Client count */}
            <div className="mb-3 text-xs" style={{ color: C.muted }}>
                {filtered.length} client{filtered.length !== 1 ? "s" : ""}
                {search && ` matching "${search}"`}
            </div>

            {/* Client list */}
            {filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                    <div className="text-4xl mb-3">👤</div>
                    <div className="font-display text-lg font-bold mb-1" style={{ color: C.text }}>No clients found</div>
                    <div className="text-sm" style={{ color: C.muted }}>Try a different search or filter.</div>
                </div>
            ) : (
                <div className="flex flex-col gap-2">
                    {filtered.map(client => {
                        const statusConfig = getStatusConfig(client.status);
                        return (
                            <button
                                key={client.id}
                                onClick={() => setSelected(client)}
                                className="group w-full text-left rounded-2xl p-4 transition-all"
                                style={{
                                    background: C.surface,
                                    border: `1px solid ${client.status === "at-risk" ? `${C.danger}30` : C.border}`,
                                }}
                            >
                                <div className="flex items-center gap-4">
                                    {/* Avatar */}
                                    <div
                                        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-sm font-bold"
                                        style={{ background: C.goldFaint, color: C.gold, border: `1px solid ${C.goldBorder}` }}
                                    >
                                        {client.initials}
                                    </div>

                                    {/* Details */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-0.5">
                                            <span className="font-semibold text-sm" style={{ color: C.text }}>{client.name}</span>
                                            <span
                                                className="rounded-full px-2 py-0.5 text-xs font-medium"
                                                style={{ background: statusConfig.bg, color: statusConfig.color }}
                                            >
                                                {statusConfig.label}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-3 text-xs" style={{ color: C.muted }}>
                                            <span className="flex items-center gap-1"><Phone size={10} />{client.phone}</span>
                                            <span className="flex items-center gap-1"><Star size={10} style={{ color: C.gold }} />{client.preferredService}</span>
                                        </div>
                                    </div>

                                    {/* Stats */}
                                    <div className="hidden sm:flex flex-col items-end gap-1 shrink-0">
                                        <div className="font-display font-bold text-sm" style={{ color: C.gold }}>
                                            K{client.totalSpent.toLocaleString()}
                                        </div>
                                        <div className="text-xs" style={{ color: C.muted }}>
                                            {client.totalVisits} visit{client.totalVisits !== 1 ? "s" : ""}
                                        </div>
                                    </div>

                                    <ChevronRight
                                        size={15}
                                        style={{ color: C.muted }}
                                        className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                                    />
                                </div>
                            </button>
                        );
                    })}
                </div>
            )}

            {/* Client detail modal */}
            {selected && (
                <ClientModal
                    client={selected}
                    onClose={() => setSelected(null)}
                    onNoteAdd={handleNoteAdd}
                />
            )}
        </div>
    );
}