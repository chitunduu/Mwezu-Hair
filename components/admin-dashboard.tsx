"use client";

import { useState } from "react";
import { BarChart2 } from "lucide-react";
import { AdminReports } from "@/components/admin-reports";
import { AdminClients } from "@/components/admin-clients";
import { AdminLoyalty } from "@/components/admin-loyalty";
import { AdminMessages } from "@/components/admin-messages";
import Image from "next/image";
import Link from "next/link";
import {
    LayoutDashboard, CalendarDays, ClipboardList,
    Clock, LogOut, ChevronLeft, ChevronRight,
    Phone, Scissors, CheckCircle2, AlertCircle,
    Ban, Menu, X, TrendingUp, Users, Banknote, Lock, Gift, MessageSquare,
} from "lucide-react";

// ─── Color tokens ──────────────────────────────────────────
const C = {
    bg: "#1C1714", surface: "#251D19", elevated: "#2E2520",
    sidebar: "#161210", gold: "#C9A84C",
    goldFaint: "rgba(201,168,76,0.1)", goldBorder: "rgba(201,168,76,0.25)",
    text: "#FAF6EE", muted: "#9B896E", border: "rgba(255,255,255,0.07)",
    success: "#4CAF7D", successFaint: "rgba(76,175,125,0.1)",
    warning: "#E09B4C", warningFaint: "rgba(224,155,76,0.1)",
    danger: "#E05C5C", dangerFaint: "rgba(224,92,92,0.1)",
};

// ─── Types ─────────────────────────────────────────────────
type BookingStatus = "confirmed" | "pending" | "completed" | "cancelled";
type SlotStatus = "available" | "booked" | "blocked";

type Booking = {
    id: string; client: string; phone: string;
    service: string; variant?: string; price: string;
    priceNum: number; date: string; dateObj: Date;
    time: string; duration: string; status: BookingStatus; notes?: string;
};

type TimeSlot = {
    time: string; status: SlotStatus;
    bookingId?: string; blockReason?: string;
};

// ─── Mock data ─────────────────────────────────────────────
const today = new Date();
const d1 = new Date(today); d1.setDate(today.getDate() + 1);
const d2 = new Date(today); d2.setDate(today.getDate() + 2);
const d3 = new Date(today); d3.setDate(today.getDate() + 3);
const d4 = new Date(today); d4.setDate(today.getDate() + 4);

function fmtDate(d: Date) {
    return d.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" });
}

const mockBookings: Booking[] = [
    { id: "1", client: "Thandiwe Mwale", phone: "0977 123 456", service: "Knotless Braids", variant: "Medium · Hip", price: "K350", priceNum: 350, date: fmtDate(today), dateObj: today, time: "8:00 AM", duration: "4 hrs", status: "confirmed" },
    { id: "2", client: "Naledi Phiri", phone: "0966 234 567", service: "Fulani Braids", price: "K400", priceNum: 400, date: fmtDate(today), dateObj: today, time: "10:00 AM", duration: "3 hrs", status: "confirmed" },
    { id: "3", client: "Chanda Banda", phone: "0955 345 678", service: "Luxe Sew-in", price: "K500", priceNum: 500, date: fmtDate(today), dateObj: today, time: "1:00 PM", duration: "4 hrs", status: "pending" },
    { id: "4", client: "Mutale Zulu", phone: "0977 456 789", service: "Spanish Curl", price: "K450", priceNum: 450, date: fmtDate(today), dateObj: today, time: "3:00 PM", duration: "3 hrs", status: "confirmed" },
    { id: "5", client: "Namwinga Kasonde", phone: "0966 567 890", service: "Goddess Twists", price: "K380", priceNum: 380, date: fmtDate(d1), dateObj: d1, time: "9:00 AM", duration: "3 hrs", status: "confirmed" },
    { id: "6", client: "Bwalya Mwamba", phone: "0955 678 901", service: "Box Braids", price: "K300", priceNum: 300, date: fmtDate(d1), dateObj: d1, time: "1:00 PM", duration: "3 hrs", status: "confirmed" },
    { id: "7", client: "Mwila Chitalu", phone: "0977 789 012", service: "Wash & Blow Dry", price: "K120", priceNum: 120, date: fmtDate(d2), dateObj: d2, time: "10:00 AM", duration: "1 hr", status: "pending" },
    { id: "8", client: "Kapasa Tembo", phone: "0966 890 123", service: "Fulani + Spanish Curl", price: "K480", priceNum: 480, date: fmtDate(d2), dateObj: d2, time: "2:00 PM", duration: "4 hrs", status: "confirmed" },
    { id: "9", client: "Mutinta Ngosa", phone: "0977 901 234", service: "Goddess Braids", price: "K420", priceNum: 420, date: fmtDate(d3), dateObj: d3, time: "11:00 AM", duration: "3 hrs", status: "confirmed" },
    { id: "10", client: "Chibwe Musonda", phone: "0955 012 345", service: "Stitch Braids", price: "K280", priceNum: 280, date: fmtDate(d4), dateObj: d4, time: "9:00 AM", duration: "2 hrs", status: "pending" },
];

const initialSlots: TimeSlot[] = [
    { time: "8:00 AM", status: "booked", bookingId: "1" },
    { time: "9:00 AM", status: "blocked", blockReason: "Break" },
    { time: "10:00 AM", status: "booked", bookingId: "2" },
    { time: "11:00 AM", status: "available" },
    { time: "12:00 PM", status: "blocked", blockReason: "Lunch" },
    { time: "1:00 PM", status: "booked", bookingId: "3" },
    { time: "2:00 PM", status: "available" },
    { time: "3:00 PM", status: "booked", bookingId: "4" },
    { time: "4:00 PM", status: "available" },
    { time: "5:00 PM", status: "available" },
];

const ALL_TIMES = ["8:00 AM", "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM"];

// ─── Helpers ───────────────────────────────────────────────
function getWeekDays(offset: number) {
    const base = new Date();
    base.setDate(base.getDate() + offset * 7);
    const day = base.getDay();
    const monday = new Date(base);
    monday.setDate(base.getDate() - ((day + 6) % 7));
    return Array.from({ length: 7 }, (_, i) => {
        const d = new Date(monday);
        d.setDate(monday.getDate() + i);
        return d;
    });
}

function isToday(d: Date) {
    const t = new Date();
    return d.getDate() === t.getDate() && d.getMonth() === t.getMonth() && d.getFullYear() === t.getFullYear();
}

function isSameDay(a: Date, b: Date) {
    return a.getDate() === b.getDate() && a.getMonth() === b.getMonth() && a.getFullYear() === b.getFullYear();
}

// ─── Sub-components ────────────────────────────────────────
function StatCard({ icon: Icon, label, value, sub, color }: {
    icon: React.ElementType; label: string; value: string; sub?: string; color: string;
}) {
    return (
        <div className="rounded-2xl p-5" style={{ background: C.surface, border: `1px solid ${C.border}` }}>
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl" style={{ background: `${color}20` }}>
                <Icon size={18} style={{ color }} />
            </div>
            <div className="font-display text-2xl font-bold mb-0.5" style={{ color: C.text }}>{value}</div>
            <div className="text-xs" style={{ color: C.muted }}>{label}</div>
            {sub && <div className="text-xs mt-1 font-medium" style={{ color }}>{sub}</div>}
        </div>
    );
}

function StatusBadge({ status }: { status: BookingStatus }) {
    const map: Record<BookingStatus, { label: string; bg: string; color: string }> = {
        confirmed: { label: "Confirmed", bg: C.successFaint, color: C.success },
        pending: { label: "Pending", bg: C.warningFaint, color: C.warning },
        completed: { label: "Completed", bg: C.goldFaint, color: C.gold },
        cancelled: { label: "Cancelled", bg: C.dangerFaint, color: C.danger },
    };
    const s = map[status];
    return (
        <span className="rounded-full px-2.5 py-0.5 text-xs font-medium"
            style={{ background: s.bg, color: s.color }}>
            {s.label}
        </span>
    );
}

function BookingCard({ booking, onSelect }: { booking: Booking; onSelect: (b: Booking) => void }) {
    return (
        <button
            onClick={() => onSelect(booking)}
            className="w-full text-left rounded-2xl p-4 transition-all hover:border-opacity-60"
            style={{ background: C.surface, border: `1px solid ${C.border}` }}
        >
            <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-sm truncate" style={{ color: C.text }}>{booking.client}</span>
                        <StatusBadge status={booking.status} />
                    </div>
                    <div className="flex items-center gap-1 text-xs mb-1" style={{ color: C.muted }}>
                        <Scissors size={11} />
                        {booking.service}{booking.variant ? ` · ${booking.variant}` : ""}
                    </div>
                    <div className="flex items-center gap-3 text-xs" style={{ color: C.muted }}>
                        <span className="flex items-center gap-1"><Clock size={11} />{booking.time}</span>
                        <span className="flex items-center gap-1"><Phone size={11} />{booking.phone}</span>
                    </div>
                </div>
                <div className="text-right shrink-0">
                    <div className="font-display font-bold" style={{ color: C.gold }}>{booking.price}</div>
                    <div className="text-xs mt-0.5" style={{ color: C.muted }}>{booking.duration}</div>
                </div>
            </div>
        </button>
    );
}

// ─── Booking Detail Modal ──────────────────────────────────
function BookingModal({ booking, onClose, onStatusChange }: {
    booking: Booking;
    onClose: () => void;
    onStatusChange: (id: string, status: BookingStatus) => void;
}) {
    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: "rgba(0,0,0,0.7)" }}
            onClick={onClose}
        >
            <div
                className="w-full max-w-sm rounded-3xl p-6"
                style={{ background: C.surface, border: `1px solid ${C.goldBorder}` }}
                onClick={e => e.stopPropagation()}
            >
                <div className="flex items-start justify-between mb-5">
                    <div>
                        <h3 className="font-display text-xl font-bold" style={{ color: C.text }}>{booking.client}</h3>
                        <p className="text-sm mt-0.5" style={{ color: C.muted }}>{booking.date} · {booking.time}</p>
                    </div>
                    <button onClick={onClose} style={{ color: C.muted }}>
                        <X size={20} />
                    </button>
                </div>

                <div className="rounded-2xl p-4 mb-5" style={{ background: C.elevated }}>
                    {[
                        { label: "Service", value: booking.service + (booking.variant ? ` · ${booking.variant}` : "") },
                        { label: "Price", value: booking.price, gold: true },
                        { label: "Duration", value: booking.duration },
                        { label: "Phone", value: booking.phone },
                        { label: "Status", value: booking.status },
                    ].map(({ label, value, gold }) => (
                        <div key={label} className="flex justify-between py-2 text-sm"
                            style={{ borderBottom: `1px solid ${C.border}` }}>
                            <span style={{ color: C.muted }}>{label}</span>
                            <span className="font-medium" style={{ color: gold ? C.gold : C.text }}>{value}</span>
                        </div>
                    ))}
                </div>

                <div className="flex flex-col gap-2">
                    <button
                        onClick={() => window.open(`https://wa.me/${booking.phone.replace(/\s/g, "")}`)}
                        className="w-full rounded-full py-3 text-sm font-semibold"
                        style={{ background: C.gold, color: "#1C1714" }}
                    >
                        Message on WhatsApp
                    </button>
                    <div className="grid grid-cols-2 gap-2">
                        <button
                            onClick={() => { onStatusChange(booking.id, "confirmed"); onClose(); }}
                            className="rounded-full py-2.5 text-xs font-medium"
                            style={{ background: C.successFaint, color: C.success, border: `1px solid ${C.success}30` }}
                        >
                            ✓ Confirm
                        </button>
                        <button
                            onClick={() => { onStatusChange(booking.id, "cancelled"); onClose(); }}
                            className="rounded-full py-2.5 text-xs font-medium"
                            style={{ background: C.dangerFaint, color: C.danger, border: `1px solid ${C.danger}30` }}
                        >
                            ✕ Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ─── Main Dashboard ────────────────────────────────────────
export function AdminDashboard() {
    const [tab, setTab] = useState<"dashboard" | "calendar" | "bookings" | "slots" | "clients" | "reports" | "loyalty" | "messages">("dashboard");
    const [slots, setSlots] = useState<TimeSlot[]>(initialSlots);
    const [bookings, setBookings] = useState<Booking[]>(mockBookings);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [bookingFilter, setBookingFilter] = useState<"today" | "week" | "all">("today");
    const [weekOffset, setWeekOffset] = useState(0);
    const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

    const todayBookings = bookings.filter(b => isSameDay(b.dateObj, today));
    const todayRevenue = todayBookings.filter(b => b.status === "confirmed").reduce((s, b) => s + b.priceNum, 0);
    const nextAppt = todayBookings.find(b => b.status === "confirmed" || b.status === "pending");
    const openSlots = slots.filter(s => s.status === "available").length;
    const weekDays = getWeekDays(weekOffset);

    const filteredBookings = bookings.filter(b => {
        if (bookingFilter === "today") return isSameDay(b.dateObj, today);
        if (bookingFilter === "week") {
            const diff = Math.floor((b.dateObj.getTime() - today.getTime()) / 86400000);
            return diff >= 0 && diff < 7;
        }
        return true;
    });

    function toggleSlot(index: number) {
        setSlots(prev => prev.map((s, i) => {
            if (i !== index || s.status === "booked") return s;
            return { ...s, status: s.status === "available" ? "blocked" : "available", blockReason: s.status === "available" ? "Blocked" : undefined };
        }));
    }

    function updateBookingStatus(id: string, status: BookingStatus) {
        setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b));
    }

    const navItems = [
        { id: "dashboard", icon: LayoutDashboard, label: "Dashboard" },
        { id: "calendar", icon: CalendarDays, label: "Calendar" },
        { id: "bookings", icon: ClipboardList, label: "Bookings" },
        { id: "slots", icon: Clock, label: "Slots" },
        { id: "clients", icon: Users, label: "Clients" },
        { id: "reports", icon: BarChart2, label: "Reports" },
        { id: "loyalty", icon: Gift, label: "Loyalty" },
        { id: "messages", icon: MessageSquare, label: "Messages" },
    ] as const;

    return (
        <div className="flex min-h-screen" style={{ background: C.bg }}>
            {/* ── Sidebar ─────────────────────────────────────── */}
            <>
                {/* Mobile overlay */}
                {sidebarOpen && (
                    <div
                        className="fixed inset-0 z-40 md:hidden"
                        style={{ background: "rgba(0,0,0,0.6)" }}
                        onClick={() => setSidebarOpen(false)}
                    />
                )}

                <aside
                    className={`fixed top-0 left-0 z-50 flex h-full w-56 flex-col transition-transform md:translate-x-0 md:static md:z-auto ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
                    style={{ background: C.sidebar, borderRight: `1px solid ${C.border}` }}
                >
                    {/* Logo */}
                    <div className="flex items-center gap-3 px-5 py-6" style={{ borderBottom: `1px solid ${C.border}` }}>
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10">
                            <Image src="/logo1.jpg" alt="Mwezu" width={32} height={32} className="h-full w-full object-contain" />
                        </div>
                        <div>
                            <div className="font-display text-sm font-bold" style={{ color: C.text }}>Mwezu Hair</div>
                            <div className="text-xs" style={{ color: C.muted }}>Admin</div>
                        </div>
                    </div>

                    {/* Nav */}
                    <nav className="flex flex-col gap-1 flex-1 p-3">
                        {navItems.map(({ id, icon: Icon, label }) => (
                            <button
                                key={id}
                                onClick={() => { setTab(id); setSidebarOpen(false); }}
                                className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all text-left"
                                style={{
                                    background: tab === id ? C.goldFaint : "transparent",
                                    color: tab === id ? C.gold : C.muted,
                                    border: `1px solid ${tab === id ? C.goldBorder : "transparent"}`,
                                }}
                            >
                                <Icon size={16} />
                                {label}
                            </button>
                        ))}
                    </nav>

                    {/* Footer */}
                    <div className="p-3" style={{ borderTop: `1px solid ${C.border}` }}>
                        <Link
                            href="/"
                            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-opacity hover:opacity-80"
                            style={{ color: C.muted }}
                        >
                            <LogOut size={16} />
                            Back to Site
                        </Link>
                    </div>
                </aside>
            </>

            {/* ── Main content ────────────────────────────────── */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Top bar */}
                <header
                    className="flex items-center justify-between px-5 py-4 sticky top-0 z-30"
                    style={{ background: C.bg, borderBottom: `1px solid ${C.border}` }}
                >
                    <div className="flex items-center gap-3">
                        <button
                            className="md:hidden flex items-center justify-center h-9 w-9 rounded-xl"
                            style={{ background: C.surface }}
                            onClick={() => setSidebarOpen(true)}
                        >
                            <Menu size={18} style={{ color: C.text }} />
                        </button>
                        <div>
                            <h1 className="font-display font-bold text-lg capitalize" style={{ color: C.text }}>
                                {tab === "dashboard" ? "Dashboard" : tab === "calendar" ? "Calendar" : tab === "bookings" ? "Bookings" : "Manage Slots"}
                            </h1>
                            <p className="text-xs" style={{ color: C.muted }}>{fmtDate(today)}</p>
                        </div>
                    </div>
                    <div
                        className="flex items-center gap-2 rounded-full px-3 py-1.5 text-xs"
                        style={{ background: C.successFaint, color: C.success, border: `1px solid ${C.success}30` }}
                    >
                        <div className="h-1.5 w-1.5 rounded-full" style={{ background: C.success }} />
                        Salon Open
                    </div>
                </header>

                {/* Content */}
                <main className="flex-1 overflow-auto p-5">

                    {/* ── DASHBOARD TAB ─────────────────────────── */}
                    {tab === "dashboard" && (
                        <div>
                            {/* Stats grid */}
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
                                <StatCard icon={Users} label="Today's Bookings" value={`${todayBookings.length}`} sub={`${todayBookings.filter(b => b.status === "confirmed").length} confirmed`} color={C.gold} />
                                <StatCard icon={Banknote} label="Today's Revenue" value={`K${todayRevenue}`} sub="Confirmed only" color={C.success} />
                                <StatCard icon={Clock} label="Next Appointment" value={nextAppt?.time ?? "—"} sub={nextAppt?.client} color={C.warning} />
                                <StatCard icon={TrendingUp} label="Open Slots" value={`${openSlots}`} sub="Available today" color={C.muted} />
                            </div>

                            {/* Today's schedule */}
                            <div className="mb-2 flex items-center justify-between">
                                <h2 className="font-display text-lg font-bold" style={{ color: C.text }}>Today&apos;s Schedule</h2>
                                <span className="text-xs" style={{ color: C.muted }}>{fmtDate(today)}</span>
                            </div>

                            <div className="flex flex-col gap-2 mb-8">
                                {slots.map((slot, i) => {
                                    const booking = slot.bookingId ? bookings.find(b => b.id === slot.bookingId) : null;
                                    return (
                                        <div
                                            key={slot.time}
                                            className="flex items-center gap-4 rounded-2xl px-4 py-3 transition-all"
                                            style={{
                                                background: slot.status === "booked" ? C.goldFaint : slot.status === "blocked" ? C.dangerFaint : C.surface,
                                                border: `1px solid ${slot.status === "booked" ? C.goldBorder : slot.status === "blocked" ? `${C.danger}25` : C.border}`,
                                                cursor: slot.status === "booked" ? "pointer" : "default",
                                            }}
                                            onClick={() => booking && setSelectedBooking(booking)}
                                        >
                                            <div className="w-16 shrink-0 text-xs font-medium" style={{ color: C.muted }}>{slot.time}</div>
                                            <div className="h-4 w-px" style={{ background: slot.status === "booked" ? C.gold : slot.status === "blocked" ? C.danger : C.border }} />
                                            {slot.status === "booked" && booking ? (
                                                <div className="flex flex-1 items-center justify-between gap-3">
                                                    <div>
                                                        <div className="text-sm font-semibold" style={{ color: C.text }}>{booking.client}</div>
                                                        <div className="text-xs" style={{ color: C.muted }}>{booking.service}{booking.variant ? ` · ${booking.variant}` : ""} · {booking.duration}</div>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="text-sm font-bold" style={{ color: C.gold }}>{booking.price}</div>
                                                        <StatusBadge status={booking.status} />
                                                    </div>
                                                </div>
                                            ) : slot.status === "blocked" ? (
                                                <div className="flex items-center gap-2 text-sm" style={{ color: C.danger }}>
                                                    <Ban size={14} /> {slot.blockReason ?? "Blocked"}
                                                </div>
                                            ) : (
                                                <div className="text-sm" style={{ color: C.muted }}>Available</div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Upcoming bookings preview */}
                            <h2 className="font-display text-lg font-bold mb-3" style={{ color: C.text }}>Upcoming This Week</h2>
                            <div className="flex flex-col gap-2">
                                {bookings.filter(b => !isSameDay(b.dateObj, today)).slice(0, 4).map(b => (
                                    <BookingCard key={b.id} booking={b} onSelect={setSelectedBooking} />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* ── CALENDAR TAB ──────────────────────────── */}
                    {tab === "calendar" && (
                        <div>
                            {/* Week navigation */}
                            <div className="flex items-center justify-between mb-5">
                                <button
                                    onClick={() => setWeekOffset(w => w - 1)}
                                    className="flex h-9 w-9 items-center justify-center rounded-xl transition-opacity hover:opacity-80"
                                    style={{ background: C.surface, border: `1px solid ${C.border}` }}
                                >
                                    <ChevronLeft size={18} style={{ color: C.text }} />
                                </button>
                                <span className="font-display font-semibold text-sm" style={{ color: C.text }}>
                                    {weekDays[0].toLocaleDateString("en-GB", { day: "numeric", month: "short" })} — {weekDays[6].toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                                </span>
                                <button
                                    onClick={() => setWeekOffset(w => w + 1)}
                                    className="flex h-9 w-9 items-center justify-center rounded-xl transition-opacity hover:opacity-80"
                                    style={{ background: C.surface, border: `1px solid ${C.border}` }}
                                >
                                    <ChevronRight size={18} style={{ color: C.text }} />
                                </button>
                            </div>

                            {/* Calendar grid */}
                            <div className="overflow-x-auto rounded-2xl" style={{ border: `1px solid ${C.border}` }}>
                                <div style={{ minWidth: "600px" }}>
                                    {/* Day headers */}
                                    <div className="grid" style={{ gridTemplateColumns: "64px repeat(7, 1fr)", background: C.surface }}>
                                        <div className="p-3" />
                                        {weekDays.map(d => (
                                            <div
                                                key={d.toISOString()}
                                                className="p-3 text-center"
                                                style={{ borderLeft: `1px solid ${C.border}` }}
                                            >
                                                <div className="text-xs mb-1" style={{ color: C.muted }}>
                                                    {d.toLocaleDateString("en-GB", { weekday: "short" })}
                                                </div>
                                                <div
                                                    className="mx-auto flex h-7 w-7 items-center justify-center rounded-full text-sm font-bold"
                                                    style={{
                                                        background: isToday(d) ? C.gold : "transparent",
                                                        color: isToday(d) ? "#1C1714" : C.text,
                                                    }}
                                                >
                                                    {d.getDate()}
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Time rows */}
                                    {ALL_TIMES.map((time, ti) => (
                                        <div
                                            key={time}
                                            className="grid"
                                            style={{ gridTemplateColumns: "64px repeat(7, 1fr)", borderTop: `1px solid ${C.border}` }}
                                        >
                                            <div className="p-3 text-xs" style={{ color: C.muted }}>{time}</div>
                                            {weekDays.map(d => {
                                                const booking = bookings.find(b => isSameDay(b.dateObj, d) && b.time === time);
                                                const todaySlot = isToday(d) ? slots[ti] : null;
                                                const isBlocked = todaySlot?.status === "blocked";

                                                return (
                                                    <div
                                                        key={d.toISOString()}
                                                        className="p-1.5 min-h-[52px]"
                                                        style={{ borderLeft: `1px solid ${C.border}`, background: isToday(d) ? "rgba(201,168,76,0.03)" : "transparent" }}
                                                    >
                                                        {booking ? (
                                                            <button
                                                                onClick={() => setSelectedBooking(booking)}
                                                                className="w-full h-full rounded-lg px-2 py-1 text-left transition-opacity hover:opacity-80"
                                                                style={{ background: C.goldFaint, border: `1px solid ${C.goldBorder}` }}
                                                            >
                                                                <div className="text-xs font-semibold truncate" style={{ color: C.gold }}>{booking.client.split(" ")[0]}</div>
                                                                <div className="text-xs truncate" style={{ color: C.muted }}>{booking.service.split(" ").slice(0, 2).join(" ")}</div>
                                                            </button>
                                                        ) : isBlocked ? (
                                                            <div
                                                                className="w-full h-full rounded-lg px-2 py-1 flex items-center"
                                                                style={{ background: C.dangerFaint, border: `1px solid ${C.danger}20` }}
                                                            >
                                                                <span className="text-xs" style={{ color: C.danger }}>{todaySlot?.blockReason ?? "Blocked"}</span>
                                                            </div>
                                                        ) : null}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Legend */}
                            <div className="flex items-center gap-5 mt-4">
                                {[
                                    { color: C.gold, label: "Booked" },
                                    { color: C.danger, label: "Blocked" },
                                    { color: C.border, label: "Available" },
                                ].map(({ color, label }) => (
                                    <div key={label} className="flex items-center gap-2 text-xs" style={{ color: C.muted }}>
                                        <div className="h-3 w-3 rounded-sm" style={{ background: `${color}50`, border: `1px solid ${color}` }} />
                                        {label}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* ── BOOKINGS TAB ──────────────────────────── */}
                    {tab === "bookings" && (
                        <div>
                            {/* Filter tabs */}
                            <div className="flex gap-2 mb-6">
                                {(["today", "week", "all"] as const).map(f => (
                                    <button
                                        key={f}
                                        onClick={() => setBookingFilter(f)}
                                        className="rounded-full px-4 py-2 text-xs font-medium capitalize transition-all"
                                        style={{
                                            background: bookingFilter === f ? C.gold : C.surface,
                                            color: bookingFilter === f ? "#1C1714" : C.muted,
                                            border: `1px solid ${bookingFilter === f ? C.gold : C.border}`,
                                        }}
                                    >
                                        {f === "today" ? "Today" : f === "week" ? "This Week" : "All Bookings"}
                                    </button>
                                ))}
                                <div className="ml-auto flex items-center gap-2 text-xs" style={{ color: C.muted }}>
                                    {filteredBookings.length} booking{filteredBookings.length !== 1 ? "s" : ""}
                                </div>
                            </div>

                            {filteredBookings.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-16 text-center">
                                    <div className="text-4xl mb-3">📅</div>
                                    <div className="font-display text-lg font-bold mb-1" style={{ color: C.text }}>No bookings</div>
                                    <div className="text-sm" style={{ color: C.muted }}>Nothing scheduled for this period.</div>
                                </div>
                            ) : (
                                <div className="flex flex-col gap-2">
                                    {filteredBookings.map(b => (
                                        <BookingCard key={b.id} booking={b} onSelect={setSelectedBooking} />
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* ── SLOTS TAB ─────────────────────────────── */}
                    {tab === "slots" && (
                        <div>
                            <div className="mb-6 rounded-2xl p-4" style={{ background: C.surface, border: `1px solid ${C.goldBorder}` }}>
                                <p className="text-sm" style={{ color: C.muted }}>
                                    Tap any <span style={{ color: C.text }}>available</span> slot to block it off (e.g. for breaks). Tap a <span style={{ color: C.danger }}>blocked</span> slot to reopen it. <span style={{ color: C.gold }}>Booked</span> slots cannot be changed here.
                                </p>
                            </div>

                            <h2 className="font-display text-lg font-bold mb-4" style={{ color: C.text }}>
                                Today — {fmtDate(today)}
                            </h2>

                            <div className="flex flex-col gap-2">
                                {slots.map((slot, i) => {
                                    const booking = slot.bookingId ? bookings.find(b => b.id === slot.bookingId) : null;
                                    return (
                                        <button
                                            key={slot.time}
                                            onClick={() => toggleSlot(i)}
                                            disabled={slot.status === "booked"}
                                            className="flex items-center gap-4 rounded-2xl px-5 py-4 transition-all text-left"
                                            style={{
                                                background: slot.status === "booked" ? C.goldFaint : slot.status === "blocked" ? C.dangerFaint : C.surface,
                                                border: `1px solid ${slot.status === "booked" ? C.goldBorder : slot.status === "blocked" ? `${C.danger}30` : C.border}`,
                                                cursor: slot.status === "booked" ? "not-allowed" : "pointer",
                                                opacity: slot.status === "booked" ? 0.9 : 1,
                                            }}
                                        >
                                            <div className="w-20 shrink-0 font-medium text-sm" style={{ color: C.muted }}>{slot.time}</div>

                                            {slot.status === "booked" && booking ? (
                                                <>
                                                    <CheckCircle2 size={16} style={{ color: C.gold }} />
                                                    <div className="flex-1">
                                                        <div className="text-sm font-semibold" style={{ color: C.text }}>{booking.client}</div>
                                                        <div className="text-xs" style={{ color: C.muted }}>{booking.service}</div>
                                                    </div>
                                                    <span className="text-xs" style={{ color: C.gold }}>Booked</span>
                                                </>
                                            ) : slot.status === "blocked" ? (
                                                <>
                                                    <Ban size={16} style={{ color: C.danger }} />
                                                    <div className="flex-1 text-sm" style={{ color: C.danger }}>{slot.blockReason ?? "Blocked"}</div>
                                                    <span className="text-xs" style={{ color: C.danger }}>Tap to open</span>
                                                </>
                                            ) : (
                                                <>
                                                    <div className="h-2 w-2 rounded-full" style={{ background: C.success }} />
                                                    <div className="flex-1 text-sm" style={{ color: C.muted }}>Available</div>
                                                    <span className="text-xs" style={{ color: C.muted }}>Tap to block</span>
                                                </>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Summary */}
                            <div className="mt-6 grid grid-cols-3 gap-3">
                                {[
                                    { label: "Booked", count: slots.filter(s => s.status === "booked").length, color: C.gold },
                                    { label: "Available", count: slots.filter(s => s.status === "available").length, color: C.success },
                                    { label: "Blocked", count: slots.filter(s => s.status === "blocked").length, color: C.danger },
                                ].map(({ label, count, color }) => (
                                    <div
                                        key={label}
                                        className="rounded-2xl p-4 text-center"
                                        style={{ background: C.surface, border: `1px solid ${C.border}` }}
                                    >
                                        <div className="font-display text-2xl font-bold" style={{ color }}>{count}</div>
                                        <div className="text-xs mt-1" style={{ color: C.muted }}>{label}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    {tab === "clients" && <AdminClients />}
                    {tab === "reports" && <AdminReports />}
                    {tab === "loyalty" && <AdminLoyalty />}
                    {tab === "messages" && <AdminMessages />}
                </main>
            </div>

            {/* Booking detail modal */}
            {selectedBooking && (
                <BookingModal
                    booking={selectedBooking}
                    onClose={() => setSelectedBooking(null)}
                    onStatusChange={updateBookingStatus}
                />
            )}
        </div>
    );
}