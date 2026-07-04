"use client";

import { useState } from "react";
import {
    TrendingUp, Banknote, Users, Scissors,
    Clock, Star, BarChart2, RefreshCw,
} from "lucide-react";

const C = {
    bg: "#1C1714", surface: "#251D19", elevated: "#2E2520",
    gold: "#C9A84C", goldFaint: "rgba(201,168,76,0.1)", goldBorder: "rgba(201,168,76,0.25)",
    text: "#FAF6EE", muted: "#9B896E", border: "rgba(255,255,255,0.07)",
    success: "#4CAF7D", successFaint: "rgba(76,175,125,0.1)",
    warning: "#E09B4C", warningFaint: "rgba(224,155,76,0.1)",
    danger: "#E05C5C",
};

type Period = "today" | "week" | "month";

// ─── Mock data by period ───────────────────────────────────
const periodData = {
    today: {
        revenue: 1700, appointments: 4, avgValue: 425,
        newClients: 0, returningClients: 4,
        rebookingRate: 75,
    },
    week: {
        revenue: 3680, appointments: 10, avgValue: 368,
        newClients: 2, returningClients: 8,
        rebookingRate: 68,
    },
    month: {
        revenue: 9240, appointments: 26, avgValue: 355,
        newClients: 5, returningClients: 21,
        rebookingRate: 72,
    },
};

const categoryData = [
    { name: "Protective Braids", revenue: 5240, bookings: 14, color: C.gold },
    { name: "Sew-ins & Extensions", revenue: 2960, bookings: 6, color: "#9B7FE8" },
    { name: "Statement Styles", revenue: 3100, bookings: 7, color: "#4CAF7D" },
    { name: "Twists & Naturals", revenue: 1820, bookings: 5, color: "#E09B4C" },
    { name: "Hair Care", revenue: 750, bookings: 6, color: "#E05C5C" },
];

const topServices = [
    { name: "Knotless Braids", bookings: 8, revenue: 2800, category: "Protective Braids" },
    { name: "Luxe Sew-in", bookings: 4, revenue: 2000, category: "Sew-ins & Extensions" },
    { name: "Fulani + Spanish Curl", bookings: 4, revenue: 1920, category: "Statement Styles" },
    { name: "Spanish Curl", bookings: 4, revenue: 1800, category: "Statement Styles" },
    { name: "Fulani Braids", bookings: 5, revenue: 2000, category: "Statement Styles" },
];

const timeSlotData = [
    { time: "8 AM", bookings: 12 },
    { time: "9 AM", bookings: 4 },
    { time: "10 AM", bookings: 18 },
    { time: "11 AM", bookings: 14 },
    { time: "12 PM", bookings: 6 },
    { time: "1 PM", bookings: 16 },
    { time: "2 PM", bookings: 8 },
    { time: "3 PM", bookings: 15 },
    { time: "4 PM", bookings: 10 },
    { time: "5 PM", bookings: 7 },
];

const weekdayData = [
    { day: "Mon", bookings: 8 },
    { day: "Tue", bookings: 12 },
    { day: "Wed", bookings: 10 },
    { day: "Thu", bookings: 15 },
    { day: "Fri", bookings: 18 },
    { day: "Sat", bookings: 22 },
    { day: "Sun", bookings: 6 },
];

// ─── Sub-components ────────────────────────────────────────
function StatCard({ icon: Icon, label, value, sub, color, trend }: {
    icon: React.ElementType; label: string; value: string;
    sub?: string; color: string; trend?: string;
}) {
    return (
        <div className="rounded-2xl p-5" style={{ background: C.surface, border: `1px solid ${C.border}` }}>
            <div className="flex items-start justify-between mb-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ background: `${color}20` }}>
                    <Icon size={18} style={{ color }} />
                </div>
                {trend && (
                    <span className="text-xs font-medium rounded-full px-2 py-0.5" style={{ background: C.successFaint, color: C.success }}>
                        {trend}
                    </span>
                )}
            </div>
            <div className="font-display text-2xl font-bold mb-0.5" style={{ color: C.text }}>{value}</div>
            <div className="text-xs" style={{ color: C.muted }}>{label}</div>
            {sub && <div className="text-xs mt-1 font-medium" style={{ color }}>{sub}</div>}
        </div>
    );
}

function BarChart({ data, maxValue, colorFn, labelKey, valueKey, prefix = "" }: {
    data: Record<string, unknown>[];
    maxValue: number;
    colorFn: (item: Record<string, unknown>, index: number) => string;
    labelKey: string;
    valueKey: string;
    prefix?: string;
}) {
    return (
        <div className="flex flex-col gap-3">
            {data.map((item, i) => {
                const value = item[valueKey] as number;
                const label = item[labelKey] as string;
                const pct = Math.round((value / maxValue) * 100);
                return (
                    <div key={label}>
                        <div className="flex items-center justify-between mb-1.5">
                            <span className="text-xs font-medium" style={{ color: C.text }}>{label}</span>
                            <span className="text-xs font-bold" style={{ color: C.gold }}>{prefix}{value.toLocaleString()}</span>
                        </div>
                        <div className="h-2 rounded-full overflow-hidden" style={{ background: C.elevated }}>
                            <div
                                className="h-full rounded-full transition-all"
                                style={{ width: `${pct}%`, background: colorFn(item, i) }}
                            />
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

// ─── Main Reports Component ────────────────────────────────
export function AdminReports() {
    const [period, setPeriod] = useState<Period>("week");
    const data = periodData[period];
    const maxCatRevenue = Math.max(...categoryData.map(c => c.revenue));
    const maxTimeBookings = Math.max(...timeSlotData.map(t => t.bookings));
    const maxDayBookings = Math.max(...weekdayData.map(d => d.bookings));
    const totalRevenue = categoryData.reduce((s, c) => s + c.revenue, 0);

    return (
        <div>
            {/* Period selector */}
            <div className="flex items-center justify-between mb-7 flex-wrap gap-3">
                <div className="flex gap-2">
                    {(["today", "week", "month"] as Period[]).map(p => (
                        <button
                            key={p}
                            onClick={() => setPeriod(p)}
                            className="rounded-full px-4 py-2 text-xs font-medium capitalize transition-all"
                            style={{
                                background: period === p ? C.gold : C.surface,
                                color: period === p ? "#1C1714" : C.muted,
                                border: `1px solid ${period === p ? C.gold : C.border}`,
                            }}
                        >
                            {p === "today" ? "Today" : p === "week" ? "This Week" : "This Month"}
                        </button>
                    ))}
                </div>
                <div
                    className="flex items-center gap-2 text-xs rounded-full px-3 py-1.5"
                    style={{ background: C.goldFaint, color: C.gold, border: `1px solid ${C.goldBorder}` }}
                >
                    <BarChart2 size={12} /> Mock data · updates with Supabase
                </div>
            </div>

            {/* Stats strip */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
                <StatCard
                    icon={Banknote} label="Revenue" color={C.gold}
                    value={`K${data.revenue.toLocaleString()}`}
                    sub={period === "today" ? "Today" : period === "week" ? "This week" : "This month"}
                    trend="+12%"
                />
                <StatCard
                    icon={Scissors} label="Appointments" color={C.success}
                    value={`${data.appointments}`}
                    sub={`Avg K${data.avgValue} per visit`}
                    trend="+5%"
                />
                <StatCard
                    icon={Users} label="New Clients" color={C.warning}
                    value={`${data.newClients}`}
                    sub={`${data.returningClients} returning`}
                />
                <StatCard
                    icon={RefreshCw} label="Rebooking Rate" color="#9B7FE8"
                    value={`${data.rebookingRate}%`}
                    sub="Of clients rebooked"
                    trend="+3%"
                />
            </div>

            <div className="grid gap-6 md:grid-cols-2 mb-6">
                {/* Revenue by category */}
                <div className="rounded-2xl p-6" style={{ background: C.surface, border: `1px solid ${C.border}` }}>
                    <div className="flex items-center gap-2 mb-5">
                        <TrendingUp size={16} style={{ color: C.gold }} />
                        <h3 className="font-display font-bold text-base" style={{ color: C.text }}>Revenue by Category</h3>
                    </div>

                    <div className="flex flex-col gap-4">
                        {categoryData
                            .sort((a, b) => b.revenue - a.revenue)
                            .map(cat => {
                                const pct = Math.round((cat.revenue / maxCatRevenue) * 100);
                                const share = Math.round((cat.revenue / totalRevenue) * 100);
                                return (
                                    <div key={cat.name}>
                                        <div className="flex items-center justify-between mb-1.5">
                                            <div className="flex items-center gap-2">
                                                <div className="h-2 w-2 rounded-full shrink-0" style={{ background: cat.color }} />
                                                <span className="text-xs font-medium" style={{ color: C.text }}>{cat.name}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs" style={{ color: C.muted }}>{share}%</span>
                                                <span className="text-xs font-bold" style={{ color: C.gold }}>K{cat.revenue.toLocaleString()}</span>
                                            </div>
                                        </div>
                                        <div className="h-2 rounded-full overflow-hidden" style={{ background: C.elevated }}>
                                            <div className="h-full rounded-full" style={{ width: `${pct}%`, background: cat.color }} />
                                        </div>
                                    </div>
                                );
                            })}
                    </div>

                    {/* Total */}
                    <div
                        className="flex justify-between items-center mt-5 pt-4 text-sm"
                        style={{ borderTop: `1px solid ${C.border}` }}
                    >
                        <span style={{ color: C.muted }}>Total (All Time)</span>
                        <span className="font-display font-bold text-lg" style={{ color: C.gold }}>
                            K{totalRevenue.toLocaleString()}
                        </span>
                    </div>
                </div>

                {/* Top services */}
                <div className="rounded-2xl p-6" style={{ background: C.surface, border: `1px solid ${C.border}` }}>
                    <div className="flex items-center gap-2 mb-5">
                        <Star size={16} style={{ color: C.gold }} />
                        <h3 className="font-display font-bold text-base" style={{ color: C.text }}>Top Services</h3>
                    </div>

                    <div className="flex flex-col gap-3">
                        {topServices
                            .sort((a, b) => b.revenue - a.revenue)
                            .slice(0, 5)
                            .map((service, i) => (
                                <div
                                    key={service.name}
                                    className="flex items-center gap-3 rounded-xl p-3"
                                    style={{ background: C.elevated, border: `1px solid ${C.border}` }}
                                >
                                    <div
                                        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-bold"
                                        style={{
                                            background: i === 0 ? C.goldFaint : C.surface,
                                            color: i === 0 ? C.gold : C.muted,
                                            border: `1px solid ${i === 0 ? C.goldBorder : C.border}`,
                                        }}
                                    >
                                        {i + 1}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="text-sm font-semibold truncate" style={{ color: C.text }}>{service.name}</div>
                                        <div className="text-xs" style={{ color: C.muted }}>{service.bookings} bookings</div>
                                    </div>
                                    <div className="text-sm font-bold shrink-0" style={{ color: C.gold }}>
                                        K{service.revenue.toLocaleString()}
                                    </div>
                                </div>
                            ))}
                    </div>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 mb-6">
                {/* Busiest time slots */}
                <div className="rounded-2xl p-6" style={{ background: C.surface, border: `1px solid ${C.border}` }}>
                    <div className="flex items-center gap-2 mb-5">
                        <Clock size={16} style={{ color: C.gold }} />
                        <h3 className="font-display font-bold text-base" style={{ color: C.text }}>Busiest Time Slots</h3>
                    </div>

                    <div className="flex items-end gap-1.5 h-28 mb-3">
                        {timeSlotData.map(({ time, bookings }) => {
                            const pct = (bookings / maxTimeBookings) * 100;
                            const isPeak = bookings === maxTimeBookings;
                            return (
                                <div key={time} className="flex flex-col items-center gap-1 flex-1">
                                    <div className="w-full rounded-t-md" style={{
                                        height: `${pct}%`,
                                        background: isPeak ? C.gold : C.elevated,
                                        border: `1px solid ${isPeak ? C.goldBorder : C.border}`,
                                        minHeight: "4px",
                                    }} />
                                </div>
                            );
                        })}
                    </div>
                    <div className="flex items-center gap-1.5">
                        {timeSlotData.map(({ time }) => (
                            <div key={time} className="flex-1 text-center text-xs" style={{ color: C.muted, fontSize: "9px" }}>
                                {time.replace(" AM", "").replace(" PM", "")}
                            </div>
                        ))}
                    </div>
                    <div className="mt-3 text-xs" style={{ color: C.muted }}>
                        Peak: <span style={{ color: C.gold, fontWeight: 600 }}>10:00 AM</span> &
                        <span style={{ color: C.gold, fontWeight: 600 }}> 1:00 PM</span>
                    </div>
                </div>

                {/* Busiest days */}
                <div className="rounded-2xl p-6" style={{ background: C.surface, border: `1px solid ${C.border}` }}>
                    <div className="flex items-center gap-2 mb-5">
                        <BarChart2 size={16} style={{ color: C.gold }} />
                        <h3 className="font-display font-bold text-base" style={{ color: C.text }}>Busiest Days</h3>
                    </div>

                    <div className="flex items-end gap-2 h-28 mb-3">
                        {weekdayData.map(({ day, bookings }) => {
                            const pct = (bookings / maxDayBookings) * 100;
                            const isPeak = bookings === maxDayBookings;
                            return (
                                <div key={day} className="flex flex-col items-center gap-1 flex-1">
                                    <div className="w-full rounded-t-md transition-all" style={{
                                        height: `${pct}%`,
                                        background: isPeak ? C.gold : day === "Sat" || day === "Fri" ? `${C.gold}60` : C.elevated,
                                        border: `1px solid ${isPeak ? C.goldBorder : C.border}`,
                                        minHeight: "4px",
                                    }} />
                                </div>
                            );
                        })}
                    </div>
                    <div className="flex items-center gap-2">
                        {weekdayData.map(({ day }) => (
                            <div key={day} className="flex-1 text-center text-xs" style={{ color: C.muted }}>{day}</div>
                        ))}
                    </div>
                    <div className="mt-3 text-xs" style={{ color: C.muted }}>
                        Peak: <span style={{ color: C.gold, fontWeight: 600 }}>Saturday</span> is your busiest day
                    </div>
                </div>
            </div>

            {/* Client breakdown */}
            <div className="rounded-2xl p-6" style={{ background: C.surface, border: `1px solid ${C.border}` }}>
                <div className="flex items-center gap-2 mb-5">
                    <Users size={16} style={{ color: C.gold }} />
                    <h3 className="font-display font-bold text-base" style={{ color: C.text }}>Client Overview</h3>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        { label: "Total Clients", value: "10", color: C.gold, sub: "All time" },
                        { label: "Active", value: "7", color: C.success, sub: "Visited in 30 days" },
                        { label: "At Risk", value: "1", color: C.danger, sub: "45+ days inactive" },
                        { label: "New This Month", value: "2", color: C.warning, sub: "First-time clients" },
                    ].map(({ label, value, color, sub }) => (
                        <div
                            key={label}
                            className="rounded-2xl p-4 text-center"
                            style={{ background: C.elevated, border: `1px solid ${C.border}` }}
                        >
                            <div className="font-display text-3xl font-bold mb-1" style={{ color }}>{value}</div>
                            <div className="text-xs font-semibold mb-0.5" style={{ color: C.text }}>{label}</div>
                            <div className="text-xs" style={{ color: C.muted }}>{sub}</div>
                        </div>
                    ))}
                </div>

                {/* Retention bar */}
                <div className="mt-5 pt-5" style={{ borderTop: `1px solid ${C.border}` }}>
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs" style={{ color: C.muted }}>Client Retention Rate</span>
                        <span className="text-sm font-bold" style={{ color: C.gold }}>70%</span>
                    </div>
                    <div className="h-2.5 rounded-full overflow-hidden" style={{ background: C.elevated }}>
                        <div className="h-full rounded-full" style={{ width: "70%", background: `linear-gradient(90deg, ${C.gold}, ${C.success})` }} />
                    </div>
                    <p className="text-xs mt-2" style={{ color: C.muted }}>
                        Industry average is 45–55%. You&apos;re above average — keep it up! 🎉
                    </p>
                </div>
            </div>
        </div>
    );
}