"use client";

import { useState } from "react";
import Link from "next/link";
import {
    Search, Phone, Scissors, CalendarDays,
    Clock, MapPin, CheckCircle2, AlertTriangle,
    RefreshCw, X, ChevronRight, MessageSquare,
} from "lucide-react";

const C = {
    bg: "#1C1714", surface: "#251D19", elevated: "#2E2520",
    gold: "#C9A84C", goldFaint: "rgba(201,168,76,0.1)", goldBorder: "rgba(201,168,76,0.25)",
    text: "#FAF6EE", muted: "#9B896E", border: "rgba(255,255,255,0.07)",
    success: "#4CAF7D", successFaint: "rgba(76,175,125,0.1)",
    danger: "#E05C5C", dangerFaint: "rgba(224,92,92,0.1)",
    warning: "#E09B4C", warningFaint: "rgba(224,155,76,0.1)",
};

// ─── Mock bookings database ────────────────────────────────
const mockBookings = [
    {
        id: "BK-001", phone: "0977123456", name: "Thandiwe Mwale",
        service: "Knotless Braids", variant: "Medium · Hip length",
        date: "Today", dateObj: "Sat 5 Jul", time: "8:00 AM",
        duration: "4 hrs", price: "K350+", status: "confirmed",
    },
    {
        id: "BK-002", phone: "0966234567", name: "Naledi Phiri",
        service: "Fulani Braids", variant: null,
        date: "Today", dateObj: "Sat 5 Jul", time: "10:00 AM",
        duration: "3 hrs", price: "K400", status: "confirmed",
    },
    {
        id: "BK-003", phone: "0966567890", name: "Namwinga Kasonde",
        service: "Goddess Twists", variant: null,
        date: "Tomorrow", dateObj: "Sun 6 Jul", time: "9:00 AM",
        duration: "3 hrs", price: "K380", status: "confirmed",
    },
    {
        id: "BK-004", phone: "0955678901", name: "Bwalya Mwamba",
        service: "Box Braids", variant: null,
        date: "Tomorrow", dateObj: "Sun 6 Jul", time: "1:00 PM",
        duration: "3 hrs", price: "K300", status: "confirmed",
    },
    {
        id: "BK-005", phone: "0977456789", name: "Mutale Zulu",
        service: "Spanish Curl", variant: null,
        date: "Today", dateObj: "Sat 5 Jul", time: "3:00 PM",
        duration: "3 hrs", price: "K450", status: "confirmed",
    },
];

const cancelReasons = [
    "Something came up / personal reasons",
    "I'm not feeling well",
    "Made a mistake / double-booked",
    "Financial reasons",
    "Need to choose a different date",
    "Other",
];

type Booking = typeof mockBookings[0];
type Step = "lookup" | "found" | "cancel-reason" | "cancel-confirm" | "cancelled" | "reschedule";

// ─── Helpers ───────────────────────────────────────────────
function normalisePhone(p: string) {
    return p.replace(/\s+/g, "").replace(/^0/, "");
}

function ownerWhatsApp(ownerPhone: string, booking: Booking, action: "cancelled" | "rescheduled") {
    const msg = action === "cancelled"
        ? `⚠️ *Booking Cancelled*\n\n👤 ${booking.name} has cancelled their appointment:\n\n✂️ *Service:* ${booking.service}${booking.variant ? ` · ${booking.variant}` : ""}\n📅 *Date:* ${booking.dateObj}\n⏰ *Time:* ${booking.time}\n\nThe slot is now available.`
        : `🔄 *Booking Reschedule Request*\n\n👤 ${booking.name} wants to reschedule:\n\n✂️ *Service:* ${booking.service}${booking.variant ? ` · ${booking.variant}` : ""}\n📅 *Current:* ${booking.dateObj} at ${booking.time}\n\nThey've been redirected to pick a new date.`;
    return `https://wa.me/${ownerPhone}?text=${encodeURIComponent(msg)}`;
}

// ─── Main component ────────────────────────────────────────
export function ManageFlow() {
    const [step, setStep] = useState<Step>("lookup");
    const [phone, setPhone] = useState("");
    const [error, setError] = useState("");
    const [booking, setBooking] = useState<Booking | null>(null);
    const [cancelReason, setCancelReason] = useState("");
    const [customReason, setCustomReason] = useState("");

    // ── Lookup ──────────────────────────────────────────────
    function handleLookup() {
        if (!phone.trim()) { setError("Please enter your phone number."); return; }
        const norm = normalisePhone(phone);
        const found = mockBookings.find(b => normalisePhone(b.phone) === norm || normalisePhone(b.phone).endsWith(norm));
        if (found) {
            setBooking(found);
            setStep("found");
            setError("");
        } else {
            setError("No upcoming booking found for that number. Try a different number or contact us on WhatsApp.");
        }
    }

    // ── Step: Lookup ─────────────────────────────────────────
    if (step === "lookup") {
        return (
            <div>
                <div className="rounded-2xl p-6" style={{ background: C.surface, border: `1px solid ${C.border}` }}>
                    <div className="flex items-center gap-2 mb-5">
                        <Phone size={15} style={{ color: C.gold }} />
                        <h2 className="font-display font-bold" style={{ color: C.text }}>Find Your Booking</h2>
                    </div>

                    <label className="block text-xs uppercase tracking-widest mb-2" style={{ color: C.gold }}>
                        Your Phone / WhatsApp Number
                    </label>
                    <input
                        type="tel"
                        placeholder="e.g. 0977 123 456"
                        value={phone}
                        onChange={e => { setPhone(e.target.value); setError(""); }}
                        onKeyDown={e => e.key === "Enter" && handleLookup()}
                        className="w-full rounded-xl px-4 py-3.5 text-sm outline-none mb-4"
                        style={{
                            background: C.elevated, border: `1px solid ${error ? C.danger : C.border}`,
                            color: C.text, caretColor: C.gold,
                        }}
                        onFocus={e => { e.target.style.borderColor = C.gold; e.target.style.boxShadow = `0 0 0 3px ${C.goldFaint}`; }}
                        onBlur={e => { e.target.style.borderColor = error ? C.danger : C.border; e.target.style.boxShadow = "none"; }}
                    />

                    {error && (
                        <div className="flex items-start gap-2 rounded-xl px-4 py-3 mb-4 text-sm"
                            style={{ background: C.dangerFaint, border: `1px solid ${C.danger}30`, color: C.danger }}>
                            <AlertTriangle size={14} className="shrink-0 mt-0.5" />
                            {error}
                        </div>
                    )}

                    <button
                        onClick={handleLookup}
                        className="w-full rounded-full py-4 text-sm font-semibold flex items-center justify-center gap-2 transition-opacity hover:opacity-90"
                        style={{ background: C.gold, color: "#1C1714" }}
                    >
                        <Search size={15} /> Find My Booking
                    </button>
                </div>

                {/* Demo helper */}
                <div className="mt-4 rounded-2xl p-4" style={{ background: C.elevated, border: `1px solid ${C.border}` }}>
                    <p className="text-xs" style={{ color: C.muted }}>
                        <span style={{ color: C.gold }}>Demo tip:</span> Try <span className="font-mono" style={{ color: C.text }}>0977 123 456</span> or <span className="font-mono" style={{ color: C.text }}>0966 234 567</span>
                    </p>
                </div>

                {/* Can't find it? */}
                <div className="mt-5 text-center">
                    <p className="text-xs mb-2" style={{ color: C.muted }}>Can't find your booking?</p>

                    <a
                        href="https://wa.me/260977000001"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-semibold transition-opacity hover:opacity-80"
                        style={{ background: C.goldFaint, color: C.gold, border: `1px solid ${C.goldBorder}` }}
                    >
                        <MessageSquare size={12} /> Message Us on WhatsApp
                    </a>
                </div>
            </div >
        );
    }

    // ── Step: Found ──────────────────────────────────────────
    if (step === "found" && booking) {
        return (
            <div>
                <div
                    className="flex items-start gap-3 rounded-2xl px-5 py-4 mb-5"
                    style={{ background: C.successFaint, border: `1px solid ${C.success}30` }}
                >
                    <CheckCircle2 size={16} style={{ color: C.success, marginTop: "1px" }} />
                    <div className="text-sm" style={{ color: C.success }}>
                        Booking found for <span className="font-semibold">{booking.name}</span>
                    </div>
                </div>

                {/* Booking card */}
                <div className="rounded-2xl p-6 mb-6" style={{ background: C.surface, border: `1px solid ${C.goldBorder}` }}>
                    <div className="flex items-center gap-2 mb-5">
                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl"
                            style={{ background: C.goldFaint, border: `1px solid ${C.goldBorder}` }}>
                            <Scissors size={18} style={{ color: C.gold }} />
                        </div>
                        <div>
                            <div className="font-display font-bold text-lg" style={{ color: C.text }}>{booking.service}</div>
                            {booking.variant && <div className="text-xs" style={{ color: C.muted }}>{booking.variant}</div>}
                        </div>
                        <div className="ml-auto font-display font-bold text-xl" style={{ color: C.gold }}>{booking.price}</div>
                    </div>

                    <div className="flex flex-col gap-3">
                        {[
                            { icon: CalendarDays, label: "Date", value: booking.dateObj },
                            { icon: Clock, label: "Time", value: `${booking.time} · ${booking.duration}` },
                            { icon: MapPin, label: "Location", value: "Northmead Market, Shop 25, Lusaka" },
                        ].map(({ icon: Icon, label, value }) => (
                            <div key={label} className="flex items-center gap-3 text-sm">
                                <Icon size={14} style={{ color: C.muted, flexShrink: 0 }} />
                                <span style={{ color: C.muted }}>{label}</span>
                                <span className="ml-auto font-medium" style={{ color: C.text }}>{value}</span>
                            </div>
                        ))}
                    </div>

                    {/* Booking ref */}
                    <div className="mt-4 pt-4 flex items-center justify-between text-xs"
                        style={{ borderTop: `1px solid ${C.border}` }}>
                        <span style={{ color: C.muted }}>Booking Ref</span>
                        <span className="font-mono font-bold" style={{ color: C.gold }}>{booking.id}</span>
                    </div>
                </div>

                {/* Client check-in */}
                <div
                    className="rounded-2xl p-5 mb-5"
                    style={{ background: C.goldFaint, border: `1px solid ${C.goldBorder}` }}
                >
                    <h3 className="font-display font-bold text-base mb-1" style={{ color: C.text }}>
                        Already at the salon?
                    </h3>
                    <p className="text-sm mb-4" style={{ color: C.muted }}>
                        Tap below to let the team know you've arrived — they'll be with you shortly!
                    </p>
                    <div className="flex gap-2">
                        {[
                            { label: "Notify Owner 1", phone: "260977000001" },
                            { label: "Notify Owner 2", phone: "260977000002" },
                        ].map(({ label, phone }) => {
                            const msg = `✅ *Client Check-In!*\n\n👤 *${booking.name}* has arrived for their appointment!\n\n✂️ ${booking.service}${booking.variant ? ` · ${booking.variant}` : ""}\n⏰ ${booking.time}\n\nThey're waiting at the salon! 🌸`;
                            return (
                                <button
                                    key={label}
                                    onClick={() => window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`)}
                                    className="flex-1 flex items-center justify-center gap-2 rounded-full py-3 text-xs font-semibold transition-opacity hover:opacity-90"
                                    style={{ background: C.gold, color: "#1C1714" }}
                                >
                                    <CheckCircle2 size={13} /> {label}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Policy reminder */}
                <div className="rounded-2xl px-5 py-4 mb-6 text-sm"
                    style={{ background: C.warningFaint, border: `1px solid ${C.warning}30`, color: C.muted }}>
                    <span style={{ color: C.warning, fontWeight: 600 }}>Cancellation Policy: </span>
                    Please give at least <strong style={{ color: C.text }}>24 hours' notice</strong> for cancellations
                    or rescheduling. Late cancellations may incur a fee.
                </div>

                {/* Action buttons */}
                <div className="flex flex-col gap-3">
                    <button
                        onClick={() => setStep("reschedule")}
                        className="w-full flex items-center justify-center gap-2 rounded-full py-4 text-sm font-semibold transition-opacity hover:opacity-90"
                        style={{ background: C.gold, color: "#1C1714" }}
                    >
                        <RefreshCw size={15} /> Reschedule Appointment
                    </button>
                    <button
                        onClick={() => setStep("cancel-reason")}
                        className="w-full flex items-center justify-center gap-2 rounded-full py-4 text-sm font-medium transition-opacity hover:opacity-80"
                        style={{ background: C.dangerFaint, color: C.danger, border: `1px solid ${C.danger}30` }}
                    >
                        <X size={15} /> Cancel Appointment
                    </button>
                    <button
                        onClick={() => { setStep("lookup"); setPhone(""); setBooking(null); }}
                        className="w-full rounded-full py-3 text-xs transition-opacity hover:opacity-70"
                        style={{ color: C.muted }}
                    >
                        Look up a different booking
                    </button>
                </div>
            </div>
        );
    }

    // ── Step: Reschedule ─────────────────────────────────────
    if (step === "reschedule" && booking) {
        return (
            <div>
                <div className="rounded-2xl p-6 mb-5" style={{ background: C.surface, border: `1px solid ${C.border}` }}>
                    <div className="flex items-center gap-2 mb-4">
                        <RefreshCw size={16} style={{ color: C.gold }} />
                        <h2 className="font-display font-bold text-lg" style={{ color: C.text }}>Reschedule Your Appointment</h2>
                    </div>
                    <p className="text-sm leading-relaxed mb-5" style={{ color: C.muted }}>
                        You're rescheduling your <span style={{ color: C.text, fontWeight: 600 }}>{booking.service}</span>.
                        We'll take you back to the booking flow to pick a new date and time.
                        Your service will already be selected.
                    </p>

                    <div className="rounded-xl p-4 mb-5"
                        style={{ background: C.elevated, border: `1px solid ${C.border}` }}>
                        <div className="text-xs uppercase tracking-widest mb-2" style={{ color: C.gold }}>
                            Current Appointment
                        </div>
                        <div className="text-sm font-medium" style={{ color: C.text }}>
                            {booking.service} · {booking.dateObj} at {booking.time}
                        </div>
                    </div>

                    <p className="text-xs mb-5" style={{ color: C.muted }}>
                        Both salon owners will be notified of your reschedule request via WhatsApp.
                    </p>

                    <Link
                        href={`/book?service=${encodeURIComponent(booking.service)}`}
                        onClick={() => {
                            window.open(ownerWhatsApp("260977000001", booking, "rescheduled"), "_blank");
                            window.open(ownerWhatsApp("260977000002", booking, "rescheduled"), "_blank");
                        }}
                    >
                        <button
                            className="w-full rounded-full py-4 text-sm font-semibold flex items-center justify-center gap-2 mb-3"
                            style={{ background: C.gold, color: "#1C1714" }}
                        >
                            <RefreshCw size={15} /> Pick a New Date & Time <ChevronRight size={15} />
                        </button>
                    </Link>

                    <button
                        onClick={() => setStep("found")}
                        className="w-full rounded-full py-3 text-xs transition-opacity hover:opacity-70"
                        style={{ color: C.muted }}
                    >
                        Go back
                    </button>
                </div>
            </div>
        );
    }

    // ── Step: Cancel reason ──────────────────────────────────
    if (step === "cancel-reason" && booking) {
        return (
            <div>
                <div className="rounded-2xl p-6" style={{ background: C.surface, border: `1px solid ${C.border}` }}>
                    <div className="flex items-center gap-2 mb-2">
                        <X size={16} style={{ color: C.danger }} />
                        <h2 className="font-display font-bold text-lg" style={{ color: C.text }}>Cancel Appointment</h2>
                    </div>
                    <p className="text-sm mb-5" style={{ color: C.muted }}>
                        Before you go — can you tell us why you need to cancel?
                    </p>

                    <div className="flex flex-col gap-2 mb-6">
                        {cancelReasons.map(reason => (
                            <button
                                key={reason}
                                onClick={() => setCancelReason(reason)}
                                className="flex items-center gap-3 rounded-xl px-4 py-3.5 text-left text-sm transition-all"
                                style={{
                                    background: cancelReason === reason ? C.dangerFaint : C.elevated,
                                    border: `1px solid ${cancelReason === reason ? C.danger + "50" : C.border}`,
                                    color: cancelReason === reason ? C.danger : C.muted,
                                }}
                            >
                                <div
                                    className="h-4 w-4 shrink-0 rounded-full flex items-center justify-center"
                                    style={{
                                        border: `2px solid ${cancelReason === reason ? C.danger : C.border}`,
                                        background: cancelReason === reason ? C.danger : "transparent",
                                    }}
                                >
                                    {cancelReason === reason && (
                                        <div className="h-1.5 w-1.5 rounded-full" style={{ background: "#fff" }} />
                                    )}
                                </div>
                                {reason}
                            </button>
                        ))}
                    </div>

                    {cancelReason === "Other" && (
                        <textarea
                            placeholder="Please tell us more..."
                            value={customReason}
                            onChange={e => setCustomReason(e.target.value)}
                            rows={3}
                            className="w-full rounded-xl px-4 py-3 text-sm outline-none resize-none mb-5"
                            style={{ background: C.elevated, border: `1px solid ${C.border}`, color: C.text, caretColor: C.gold }}
                        />
                    )}

                    <div className="flex gap-3">
                        <button
                            disabled={!cancelReason}
                            onClick={() => setStep("cancel-confirm")}
                            className="flex-1 rounded-full py-3.5 text-sm font-semibold transition-all"
                            style={{
                                background: cancelReason ? C.danger : C.elevated,
                                color: cancelReason ? "#fff" : C.muted,
                                opacity: cancelReason ? 1 : 0.5,
                                cursor: cancelReason ? "pointer" : "not-allowed",
                            }}
                        >
                            Continue
                        </button>
                        <button
                            onClick={() => { setStep("found"); setCancelReason(""); }}
                            className="rounded-full px-5 py-3.5 text-sm transition-opacity hover:opacity-70"
                            style={{ background: C.elevated, color: C.muted }}
                        >
                            Go back
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // ── Step: Cancel confirm ─────────────────────────────────
    if (step === "cancel-confirm" && booking) {
        return (
            <div>
                <div className="rounded-2xl p-6" style={{ background: C.surface, border: `1px solid ${C.border}` }}>
                    <h2 className="font-display font-bold text-xl mb-2" style={{ color: C.text }}>
                        Confirm Cancellation
                    </h2>
                    <p className="text-sm mb-5" style={{ color: C.muted }}>
                        Are you sure you want to cancel this appointment? This action cannot be undone.
                    </p>

                    {/* Summary */}
                    <div className="rounded-xl p-4 mb-5"
                        style={{ background: C.elevated, border: `1px solid ${C.danger}25` }}>
                        {[
                            { label: "Service", value: booking.service + (booking.variant ? ` · ${booking.variant}` : "") },
                            { label: "Date", value: booking.dateObj },
                            { label: "Time", value: booking.time },
                            { label: "Reason", value: cancelReason === "Other" ? customReason || "Other" : cancelReason },
                        ].map(({ label, value }) => (
                            <div key={label} className="flex justify-between py-2 text-sm"
                                style={{ borderBottom: `1px solid ${C.border}` }}>
                                <span style={{ color: C.muted }}>{label}</span>
                                <span className="font-medium text-right ml-4" style={{ color: C.text }}>{value}</span>
                            </div>
                        ))}
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={() => setStep("cancelled")}
                            className="flex-1 rounded-full py-3.5 text-sm font-semibold"
                            style={{ background: C.danger, color: "#fff" }}
                        >
                            Yes, Cancel It
                        </button>
                        <button
                            onClick={() => setStep("found")}
                            className="rounded-full px-5 py-3.5 text-sm"
                            style={{ background: C.elevated, color: C.muted }}
                        >
                            Keep It
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // ── Step: Cancelled ──────────────────────────────────────
    if (step === "cancelled" && booking) {
        return (
            <div className="flex flex-col items-center text-center py-4">
                <div
                    className="flex h-16 w-16 items-center justify-center rounded-full mb-5"
                    style={{ background: C.successFaint, border: `1px solid ${C.success}40` }}
                >
                    <CheckCircle2 size={28} style={{ color: C.success }} />
                </div>

                <h2 className="font-display text-3xl font-bold mb-2" style={{ color: C.text }}>
                    Booking Cancelled
                </h2>
                <p className="text-sm mb-2 max-w-sm" style={{ color: C.muted }}>
                    Your <span style={{ color: C.text }}>{booking.service}</span> appointment
                    on <span style={{ color: C.text }}>{booking.dateObj} at {booking.time}</span> has been cancelled.
                </p>
                <p className="text-sm mb-8" style={{ color: C.muted }}>
                    Please notify the salon below so they can free up your slot.
                </p>

                {/* Notify owners */}
                <div
                    className="w-full max-w-sm rounded-2xl p-5 mb-6"
                    style={{ background: C.surface, border: `1px solid ${C.goldBorder}` }}
                >
                    <p className="text-xs uppercase tracking-widest mb-3" style={{ color: C.gold }}>
                        Notify the Salon
                    </p>
                    <p className="text-xs mb-4" style={{ color: C.muted }}>
                        Tap to send your cancellation to both salon owners via WhatsApp.
                    </p>
                    <div className="flex gap-2">
                        {[
                            { label: "Notify Owner 1", phone: "260977000001" },
                            { label: "Notify Owner 2", phone: "260977000002" },
                        ].map(({ label, phone }) => (
                            <button
                                key={label}
                                onClick={() => window.open(ownerWhatsApp(phone, booking, "cancelled"))}
                                className="flex-1 rounded-full py-2.5 text-xs font-semibold transition-opacity hover:opacity-90"
                                style={{ background: C.goldFaint, color: C.gold, border: `1px solid ${C.goldBorder}` }}
                            >
                                {label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Rebook CTA */}
                <Link href={`/book?service=${encodeURIComponent(booking.service)}`} className="w-full max-w-sm">
                    <button
                        className="w-full rounded-full py-4 text-sm font-semibold mb-3 transition-opacity hover:opacity-90"
                        style={{ background: C.gold, color: "#1C1714" }}
                    >
                        Book a New Appointment
                    </button>
                </Link>
                <Link href="/" className="text-xs transition-opacity hover:opacity-70" style={{ color: C.muted }}>
                    Back to homepage
                </Link>
            </div>
        );
    }

    return null;
}