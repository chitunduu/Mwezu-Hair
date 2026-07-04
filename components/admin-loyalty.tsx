"use client";

import { useState } from "react";
import {
    Crown, Shield, Star, Gem, Gift,
    TrendingUp, Users, Zap, Plus, X, CheckCircle2,
} from "lucide-react";

const C = {
    bg: "#1C1714", surface: "#251D19", elevated: "#2E2520",
    gold: "#C9A84C", goldFaint: "rgba(201,168,76,0.1)", goldBorder: "rgba(201,168,76,0.25)",
    text: "#FAF6EE", muted: "#9B896E", border: "rgba(255,255,255,0.07)",
    success: "#4CAF7D", successFaint: "rgba(76,175,125,0.1)",
    bronze: "#CD7F32", silver: "#A8A9AD", platinum: "#9B7FE8",
};

type Tier = "Bronze" | "Silver" | "Gold" | "Platinum";

type Member = {
    id: string; name: string; initials: string;
    phone: string; points: number; tier: Tier;
    totalSpent: number; visits: number;
    lastVisit: string; joinDate: string;
    recentActivity: { date: string; action: string; points: number }[];
};

const tierConfig: Record<Tier, { color: string; icon: React.ElementType; min: number; max: number | null }> = {
    Bronze: { color: C.bronze, icon: Shield, min: 0, max: 499 },
    Silver: { color: C.silver, icon: Star, min: 500, max: 999 },
    Gold: { color: C.gold, icon: Crown, min: 1000, max: 1999 },
    Platinum: { color: C.platinum, icon: Gem, min: 2000, max: null },
};

function getTier(points: number): Tier {
    if (points >= 2000) return "Platinum";
    if (points >= 1000) return "Gold";
    if (points >= 500) return "Silver";
    return "Bronze";
}

const mockMembers: Member[] = [
    {
        id: "m1", name: "Thandiwe Mwale", initials: "TM", phone: "0977 123 456",
        points: 1240, tier: "Gold", totalSpent: 2800, visits: 8,
        lastVisit: "Today", joinDate: "Jan 2024",
        recentActivity: [
            { date: "Today", action: "Knotless Braids · Medium Hip", points: 35 },
            { date: "12 May", action: "Knotless Braids · Medium Hip", points: 35 },
            { date: "3 Mar", action: "Knotless Braids · Small Bum", points: 40 },
        ],
    },
    {
        id: "m2", name: "Namwinga Kasonde", initials: "NK", phone: "0966 567 890",
        points: 980, tier: "Silver", totalSpent: 2250, visits: 6,
        lastVisit: "Tomorrow", joinDate: "Feb 2024",
        recentActivity: [
            { date: "Tomorrow", action: "Goddess Twists (upcoming)", points: 38 },
            { date: "10 Apr", action: "Goddess Twists", points: 38 },
            { date: "18 Feb", action: "Natural Twists", points: 20 },
        ],
    },
    {
        id: "m3", name: "Naledi Phiri", initials: "NP", phone: "0966 234 567",
        points: 870, tier: "Silver", totalSpent: 2050, visits: 5,
        lastVisit: "Today", joinDate: "Mar 2024",
        recentActivity: [
            { date: "Today", action: "Fulani Braids", points: 40 },
            { date: "8 Apr", action: "Fulani + Spanish Curl", points: 48 },
            { date: "15 Feb", action: "Fulani Braids", points: 40 },
        ],
    },
    {
        id: "m4", name: "Chanda Banda", initials: "CB", phone: "0955 345 678",
        points: 760, tier: "Silver", totalSpent: 2000, visits: 4,
        lastVisit: "Today", joinDate: "Jun 2024",
        recentActivity: [
            { date: "Today", action: "Luxe Sew-in", points: 50 },
            { date: "2 May", action: "Luxe Sew-in", points: 50 },
            { date: "14 Feb", action: "Remy Fusion Sew-in", points: 58 },
        ],
    },
    {
        id: "m5", name: "Mutale Zulu", initials: "MZ", phone: "0977 456 789",
        points: 480, tier: "Bronze", totalSpent: 1350, visits: 3,
        lastVisit: "Today", joinDate: "Sep 2024",
        recentActivity: [
            { date: "Today", action: "Spanish Curl", points: 45 },
            { date: "20 Apr", action: "Spanish Curl", points: 45 },
            { date: "5 Feb", action: "Goddess Twists", points: 38 },
        ],
    },
    {
        id: "m6", name: "Bwalya Mwamba", initials: "BM", phone: "0955 678 901",
        points: 390, tier: "Bronze", totalSpent: 1200, visits: 4,
        lastVisit: "Tomorrow", joinDate: "Apr 2024",
        recentActivity: [
            { date: "Tomorrow", action: "Box Braids (upcoming)", points: 30 },
            { date: "5 Mar", action: "Box Braids", points: 30 },
            { date: "12 Dec", action: "Box Braids", points: 30 },
        ],
    },
    {
        id: "m7", name: "Kapasa Tembo", initials: "KT", phone: "0966 890 123",
        points: 2180, tier: "Platinum", totalSpent: 960, visits: 2,
        lastVisit: "In 2 days", joinDate: "Jan 2025",
        recentActivity: [
            { date: "In 2 days", action: "Fulani + Spanish Curl (upcoming)", points: 48 },
            { date: "10 Mar", action: "Fulani + Spanish Curl", points: 48 },
            { date: "Join bonus", action: "Welcome to Mwezu Rewards!", points: 50 },
        ],
    },
];

function TierBadge({ tier }: { tier: Tier }) {
    const { color, icon: Icon } = tierConfig[tier];
    return (
        <span className="flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold"
            style={{ background: `${color}15`, color, border: `1px solid ${color}30` }}>
            <Icon size={10} /> {tier}
        </span>
    );
}

function ProgressToNextTier({ points, tier }: { points: number; tier: Tier }) {
    const config = tierConfig[tier];
    if (!config.max) return (
        <div className="text-xs" style={{ color: C.platinum }}>🎉 Maximum tier reached!</div>
    );
    const pct = Math.round(((points - config.min) / (config.max - config.min + 1)) * 100);
    const needed = config.max - points + 1;
    const nextTier = tier === "Bronze" ? "Silver" : tier === "Silver" ? "Gold" : "Platinum";
    return (
        <div>
            <div className="flex justify-between text-xs mb-1.5">
                <span style={{ color: C.muted }}>{needed} pts to {nextTier}</span>
                <span style={{ color: C.muted }}>{pct}%</span>
            </div>
            <div className="h-1.5 rounded-full overflow-hidden" style={{ background: C.elevated }}>
                <div className="h-full rounded-full transition-all"
                    style={{ width: `${pct}%`, background: tierConfig[tier].color }} />
            </div>
        </div>
    );
}

function MemberModal({ member, onClose, onAdjust }: {
    member: Member;
    onClose: () => void;
    onAdjust: (id: string, amount: number, reason: string) => void;
}) {
    const [adjustAmount, setAdjustAmount] = useState("");
    const [adjustReason, setAdjustReason] = useState("");
    const [showAdjust, setShowAdjust] = useState(false);
    const { color, icon: Icon } = tierConfig[member.tier];

    return (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 overflow-y-auto"
            style={{ background: "rgba(0,0,0,0.75)" }}
            onClick={onClose}>
            <div className="w-full max-w-sm rounded-3xl my-8"
                style={{ background: C.surface, border: `1px solid ${C.goldBorder}` }}
                onClick={e => e.stopPropagation()}>

                {/* Header */}
                <div className="p-6" style={{ borderBottom: `1px solid ${C.border}` }}>
                    <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl text-lg font-bold"
                                style={{ background: C.goldFaint, color: C.gold, border: `1px solid ${C.goldBorder}` }}>
                                {member.initials}
                            </div>
                            <div>
                                <div className="font-display text-lg font-bold" style={{ color: C.text }}>{member.name}</div>
                                <div className="text-xs mt-0.5" style={{ color: C.muted }}>Member since {member.joinDate}</div>
                            </div>
                        </div>
                        <button onClick={onClose} style={{ color: C.muted }}><X size={20} /></button>
                    </div>
                    <TierBadge tier={member.tier} />
                </div>

                {/* Points display */}
                <div className="p-6" style={{ borderBottom: `1px solid ${C.border}` }}>
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <div className="font-display text-4xl font-bold" style={{ color }}>{member.points.toLocaleString()}</div>
                            <div className="text-xs mt-0.5" style={{ color: C.muted }}>Total Points</div>
                        </div>
                        <div
                            className="flex h-14 w-14 items-center justify-center rounded-2xl"
                            style={{ background: `${color}15`, border: `1px solid ${color}30` }}
                        >
                            <Icon size={24} style={{ color }} />
                        </div>
                    </div>
                    <ProgressToNextTier points={member.points} tier={member.tier} />
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 p-4 gap-2" style={{ borderBottom: `1px solid ${C.border}` }}>
                    {[
                        { label: "Visits", value: member.visits },
                        { label: "Spent", value: `K${member.totalSpent.toLocaleString()}` },
                        { label: "Avg/Visit", value: `K${Math.round(member.totalSpent / member.visits)}` },
                    ].map(({ label, value }) => (
                        <div key={label} className="text-center rounded-xl py-2.5"
                            style={{ background: C.elevated }}>
                            <div className="font-display text-lg font-bold" style={{ color: C.gold }}>{value}</div>
                            <div className="text-xs" style={{ color: C.muted }}>{label}</div>
                        </div>
                    ))}
                </div>

                {/* Recent activity */}
                <div className="p-5" style={{ borderBottom: `1px solid ${C.border}` }}>
                    <div className="text-xs uppercase tracking-widest mb-3" style={{ color: C.gold }}>
                        Recent Activity
                    </div>
                    <div className="flex flex-col gap-2">
                        {member.recentActivity.map((a, i) => (
                            <div key={i} className="flex items-center justify-between text-sm">
                                <div>
                                    <div style={{ color: C.text }}>{a.action}</div>
                                    <div className="text-xs" style={{ color: C.muted }}>{a.date}</div>
                                </div>
                                <div className="font-semibold" style={{ color: C.gold }}>+{a.points} pts</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Adjust points */}
                <div className="p-5">
                    {!showAdjust ? (
                        <button
                            onClick={() => setShowAdjust(true)}
                            className="w-full rounded-full py-3 text-sm font-semibold flex items-center justify-center gap-2"
                            style={{ background: C.goldFaint, color: C.gold, border: `1px solid ${C.goldBorder}` }}
                        >
                            <Plus size={15} /> Adjust Points Manually
                        </button>
                    ) : (
                        <div>
                            <div className="text-xs uppercase tracking-widest mb-3" style={{ color: C.gold }}>Adjust Points</div>
                            <div className="flex flex-col gap-3">
                                <input
                                    type="number"
                                    placeholder="Points (e.g. 50 or -20)"
                                    value={adjustAmount}
                                    onChange={e => setAdjustAmount(e.target.value)}
                                    className="w-full rounded-xl px-4 py-3 text-sm outline-none"
                                    style={{ background: C.elevated, border: `1px solid ${C.border}`, color: C.text }}
                                />
                                <input
                                    type="text"
                                    placeholder="Reason (e.g. Birthday bonus)"
                                    value={adjustReason}
                                    onChange={e => setAdjustReason(e.target.value)}
                                    className="w-full rounded-xl px-4 py-3 text-sm outline-none"
                                    style={{ background: C.elevated, border: `1px solid ${C.border}`, color: C.text }}
                                />
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => {
                                            if (adjustAmount && adjustReason) {
                                                onAdjust(member.id, parseInt(adjustAmount), adjustReason);
                                                setAdjustAmount(""); setAdjustReason(""); setShowAdjust(false);
                                            }
                                        }}
                                        className="flex-1 rounded-full py-2.5 text-sm font-semibold"
                                        style={{ background: C.gold, color: "#1C1714" }}
                                    >
                                        <CheckCircle2 size={14} className="inline mr-1" /> Apply
                                    </button>
                                    <button
                                        onClick={() => setShowAdjust(false)}
                                        className="rounded-full px-4 py-2.5 text-sm"
                                        style={{ background: C.elevated, color: C.muted }}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export function AdminLoyalty() {
    const [members, setMembers] = useState<Member[]>(mockMembers);
    const [selected, setSelected] = useState<Member | null>(null);
    const [filterTier, setFilterTier] = useState<Tier | "All">("All");

    const filtered = filterTier === "All" ? members : members.filter(m => m.tier === filterTier);
    const totalPoints = members.reduce((s, m) => s + m.points, 0);
    const tierCounts = { Bronze: 0, Silver: 0, Gold: 0, Platinum: 0 };
    members.forEach(m => tierCounts[m.tier]++);

    function handleAdjust(id: string, amount: number, reason: string) {
        setMembers(prev => prev.map(m => {
            if (m.id !== id) return m;
            const newPoints = Math.max(0, m.points + amount);
            return {
                ...m, points: newPoints, tier: getTier(newPoints),
                recentActivity: [
                    { date: "Now", action: reason, points: amount },
                    ...m.recentActivity.slice(0, 2),
                ],
            };
        }));
        setSelected(prev => {
            if (!prev || prev.id !== id) return prev;
            const newPoints = Math.max(0, prev.points + amount);
            return { ...prev, points: newPoints, tier: getTier(newPoints) };
        });
    }

    return (
        <div>
            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-7">
                {[
                    { label: "Total Members", value: members.length.toString(), color: C.gold, icon: Users },
                    { label: "Points Issued", value: totalPoints.toLocaleString(), color: C.success, icon: Zap },
                    { label: "Gold Members", value: tierCounts.Gold.toString(), color: C.gold, icon: Crown },
                    { label: "Platinum", value: tierCounts.Platinum.toString(), color: C.platinum, icon: Gem },
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

            {/* Tier breakdown */}
            <div className="rounded-2xl p-5 mb-6" style={{ background: C.surface, border: `1px solid ${C.border}` }}>
                <div className="flex items-center gap-2 mb-4">
                    <TrendingUp size={15} style={{ color: C.gold }} />
                    <h3 className="font-display font-bold" style={{ color: C.text }}>Tier Breakdown</h3>
                </div>
                <div className="grid grid-cols-4 gap-3">
                    {(["Bronze", "Silver", "Gold", "Platinum"] as Tier[]).map(tier => {
                        const { color, icon: Icon } = tierConfig[tier];
                        const count = tierCounts[tier];
                        return (
                            <div key={tier} className="rounded-xl p-3 text-center"
                                style={{ background: C.elevated, border: `1px solid ${color}20` }}>
                                <Icon size={20} style={{ color }} className="mx-auto mb-2" />
                                <div className="font-display text-xl font-bold" style={{ color }}>{count}</div>
                                <div className="text-xs" style={{ color: C.muted }}>{tier}</div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Filter + leaderboard */}
            <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
                <h3 className="font-display font-bold" style={{ color: C.text }}>Member Leaderboard</h3>
                <div className="flex gap-2">
                    {(["All", "Platinum", "Gold", "Silver", "Bronze"] as const).map(t => (
                        <button
                            key={t}
                            onClick={() => setFilterTier(t)}
                            className="rounded-full px-3 py-1.5 text-xs font-medium transition-all"
                            style={{
                                background: filterTier === t ? C.gold : C.surface,
                                color: filterTier === t ? "#1C1714" : C.muted,
                                border: `1px solid ${filterTier === t ? C.gold : C.border}`,
                            }}
                        >
                            {t}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex flex-col gap-2">
                {filtered
                    .sort((a, b) => b.points - a.points)
                    .map((member, i) => {
                        const { color } = tierConfig[member.tier];
                        return (
                            <button
                                key={member.id}
                                onClick={() => setSelected(member)}
                                className="group w-full text-left rounded-2xl p-4 transition-all"
                                style={{ background: C.surface, border: `1px solid ${C.border}` }}
                            >
                                <div className="flex items-center gap-4">
                                    {/* Rank */}
                                    <div
                                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-sm font-bold"
                                        style={{
                                            background: i === 0 ? C.goldFaint : C.elevated,
                                            color: i === 0 ? C.gold : C.muted,
                                            border: `1px solid ${i === 0 ? C.goldBorder : C.border}`,
                                        }}
                                    >
                                        {i + 1}
                                    </div>

                                    {/* Avatar */}
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl text-sm font-bold"
                                        style={{ background: C.goldFaint, color: C.gold, border: `1px solid ${C.goldBorder}` }}>
                                        {member.initials}
                                    </div>

                                    {/* Details */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-0.5">
                                            <span className="font-semibold text-sm" style={{ color: C.text }}>{member.name}</span>
                                            <TierBadge tier={member.tier} />
                                        </div>
                                        <div className="text-xs" style={{ color: C.muted }}>
                                            Last visit: {member.lastVisit} · {member.visits} visits
                                        </div>
                                    </div>

                                    {/* Points */}
                                    <div className="text-right shrink-0">
                                        <div className="font-display font-bold text-lg" style={{ color }}>{member.points.toLocaleString()}</div>
                                        <div className="text-xs" style={{ color: C.muted }}>points</div>
                                    </div>
                                </div>

                                {/* Progress bar */}
                                <div className="mt-3 ml-12">
                                    <ProgressToNextTier points={member.points} tier={member.tier} />
                                </div>
                            </button>
                        );
                    })}
            </div>

            {selected && (
                <MemberModal
                    member={selected}
                    onClose={() => setSelected(null)}
                    onAdjust={handleAdjust}
                />
            )}
        </div>
    );
}