"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Clock, CheckCircle2, CalendarDays, Scissors, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";

// ─── Color tokens ─────────────────────────────────────────
const C = {
    bg: "#1C1714",
    surface: "#251D19",
    elevated: "#2E2520",
    gold: "#C9A84C",
    goldFaint: "rgba(201,168,76,0.12)",
    goldBorder: "rgba(201,168,76,0.3)",
    text: "#FAF6EE",
    muted: "#9B896E",
    border: "rgba(255,255,255,0.07)",
    danger: "#E05C5C",
};

// ─── Types ────────────────────────────────────────────────
type Variant = { size: string; length: string };
type Service = {
    name: string;
    category: string;
    price: string;
    duration: string;
    description: string;
    popular?: boolean;
    hasVariants?: boolean;
};
type FormData = { name: string; phone: string; notes: string };

// ─── Data ─────────────────────────────────────────────────
const categories = ["All", "Protective Braids", "Statement Styles", "Twists & Naturals", "Sew-ins & Extensions", "Hair Care"];

const services: Service[] = [
    { name: "Knotless Braids", category: "Protective Braids", price: "K350+", duration: "3–5 hrs", description: "Clean, natural-looking braids with no tension at the root.", popular: true, hasVariants: true },
    { name: "Box Braids", category: "Protective Braids", price: "K300", duration: "3–4 hrs", description: "Classic square-parted braids, timeless and versatile." },
    { name: "Stitch Braids", category: "Protective Braids", price: "K280", duration: "2–3 hrs", description: "Feed-in style with precise stitch partings for a sleek finish." },
    { name: "Deep Wave Braids", category: "Protective Braids", price: "K400", duration: "3–4 hrs", description: "Braids blended with deep wave extensions for a textured look." },
    { name: "Bone Straight Braids", category: "Protective Braids", price: "K350", duration: "3 hrs", description: "Ultra-sleek, straight braids for a polished finish." },
    { name: "Remy Braids", category: "Protective Braids", price: "K450", duration: "3–4 hrs", description: "Premium Remy hair extensions braided for a natural feel." },
    { name: "Patewo Braids", category: "Protective Braids", price: "K250", duration: "2 hrs", description: "Wide, flat cornrows styled close to the scalp." },
    { name: "Koroba Braids", category: "Protective Braids", price: "K380", duration: "3 hrs", description: "Bold bucket-shaped braid style — a true statement look.", popular: true },
    { name: "Fulani Braids", category: "Statement Styles", price: "K400", duration: "3–4 hrs", description: "Heritage-inspired braids with centre parts and wrap details.", popular: true },
    { name: "Fulani + Spanish Curl", category: "Statement Styles", price: "K480", duration: "4–5 hrs", description: "Fulani braids with curly ends for a romantic, boho finish.", popular: true },
    { name: "Goddess Braids", category: "Statement Styles", price: "K420", duration: "3–4 hrs", description: "Oversized, sculptural braids with an ethereal goddess-like feel." },
    { name: "Caribbean Twists", category: "Statement Styles", price: "K350", duration: "3 hrs", description: "Springy, bouncy twists inspired by Caribbean style." },
    { name: "Spanish Curl", category: "Statement Styles", price: "K450", duration: "3–4 hrs", description: "Luscious, defined curls for a dramatic, glamorous look.", popular: true },
    { name: "Natural Twists", category: "Twists & Naturals", price: "K200", duration: "1.5–2 hrs", description: "Two-strand twists that celebrate and protect your natural hair." },
    { name: "Micro Natural Twists", category: "Twists & Naturals", price: "K280", duration: "2–3 hrs", description: "Finer, more delicate twists for an intricate, detailed look." },
    { name: "Goddess Twists", category: "Twists & Naturals", price: "K380", duration: "3 hrs", description: "Chunky twists with curly ends — bohemian and beautiful.", popular: true },
    { name: "Luxe Sew-in", category: "Sew-ins & Extensions", price: "K500", duration: "3–4 hrs", description: "Premium full sew-in weave for a flawless, natural finish.", popular: true },
    { name: "Mocha Sew-in", category: "Sew-ins & Extensions", price: "K480", duration: "3–4 hrs", description: "Rich, warm-toned weave installation for a sun-kissed look." },
    { name: "Remy Fusion Sew-in", category: "Sew-ins & Extensions", price: "K580", duration: "4–5 hrs", description: "Remy hair fused seamlessly with your natural hair." },
    { name: "Wash & Blow Dry", category: "Hair Care", price: "K120", duration: "1 hr", description: "Deep cleanse and professional blow dry to refresh your hair." },
    { name: "Unbraiding", category: "Hair Care", price: "K100", duration: "1–2 hrs", description: "Careful, damage-free removal of braids or extensions." },
];

const timeSlots = [
    { time: "8:00 AM", available: true },
    { time: "9:00 AM", available: false },
    { time: "10:00 AM", available: true },
    { time: "11:00 AM", available: true },
    { time: "12:00 PM", available: false },
    { time: "1:00 PM", available: true },
    { time: "2:00 PM", available: false },
    { time: "3:00 PM", available: true },
    { time: "4:00 PM", available: true },
    { time: "5:00 PM", available: true },
];

function getNext14Days() {
    return Array.from({ length: 14 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() + i + 1);
        return d;
    });
}

function formatDate(d: Date) {
    return d.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" });
}

// ─── Step Indicator ───────────────────────────────────────
function StepIndicator({ step }: { step: number }) {
    const steps = ["Choose Service", "Date & Time", "Your Details"];
    return (
        <div className="mb-10 flex items-center justify-center gap-0">
            {steps.map((label, i) => {
                const num = i + 1;
                const active = step === num;
                const done = step > num;
                return (
                    <div key={label} className="flex items-center">
                        <div className="flex flex-col items-center gap-1.5">
                            <div
                                className="flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold transition-all"
                                style={{
                                    background: done || active ? C.gold : C.elevated,
                                    color: done || active ? "#1C1714" : C.muted,
                                    boxShadow: active ? `0 0 0 4px rgba(201,168,76,0.2)` : "none",
                                }}
                            >
                                {done ? <CheckCircle2 size={16} /> : num}
                            </div>
                            <span className="text-xs font-medium" style={{ color: active ? C.text : C.muted }}>
                                {label}
                            </span>
                        </div>
                        {i < steps.length - 1 && (
                            <div
                                className="mb-5 mx-2 h-px w-10 sm:w-16 transition-all"
                                style={{ background: step > num ? C.gold : C.border }}
                            />
                        )}
                    </div>
                );
            })}
        </div>
    );
}

// ─── Summary Bar ──────────────────────────────────────────
function SummaryBar({ service, variant, date, time }: {
    service: Service | null;
    variant: Variant | null;
    date: Date | null;
    time: string | null;
}) {
    if (!service) return null;
    return (
        <div
            className="mb-6 flex flex-wrap items-center gap-3 rounded-2xl px-5 py-4"
            style={{ background: C.surface, border: `1px solid ${C.goldBorder}` }}
        >
            <Scissors size={14} style={{ color: C.gold }} className="shrink-0" />
            <span className="text-sm font-semibold" style={{ color: C.text }}>{service.name}</span>
            {variant && <span className="text-sm" style={{ color: C.muted }}>· {variant.size} · {variant.length}</span>}
            <span className="text-sm font-bold" style={{ color: C.gold }}>{service.price}</span>
            {date && (
                <>
                    <span style={{ color: C.border }}>·</span>
                    <div className="flex items-center gap-1 text-sm" style={{ color: C.muted }}>
                        <CalendarDays size={13} />{formatDate(date)}
                    </div>
                </>
            )}
            {time && (
                <>
                    <span style={{ color: C.border }}>·</span>
                    <div className="flex items-center gap-1 text-sm" style={{ color: C.muted }}>
                        <Clock size={13} />{time}
                    </div>
                </>
            )}
        </div>
    );
}

// ─── Main component ───────────────────────────────────────
export function BookingFlow() {
    const [step, setStep] = useState(1);
    const [activeCategory, setActiveCategory] = useState("All");
    const [selectedService, setSelectedService] = useState<Service | null>(null);
    const [showVariants, setShowVariants] = useState(false);
    const [variant, setVariant] = useState<Variant>({ size: "Medium", length: "Normal" });
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    const [formData, setFormData] = useState<FormData>({ name: "", phone: "", notes: "" });
    const [confirmed, setConfirmed] = useState(false);

    const searchParams = useSearchParams();

    useEffect(() => {
        const serviceParam = searchParams.get("service");
        if (serviceParam) {
            const found = services.find(s => s.name === serviceParam);
            if (found) {
                setSelectedService(found);
                if (found.hasVariants) {
                    setShowVariants(true);
                } else {
                    setStep(2);
                }
            }
        }
    }, [searchParams]);

    const dates = getNext14Days();
    const filtered = activeCategory === "All" ? services : services.filter(s => s.category === activeCategory);

    function handleSelectService(s: Service) {
        setSelectedService(s);
        if (s.hasVariants) { setShowVariants(true); }
        else { setShowVariants(false); setStep(2); }
    }

    // ── Confirmation ─────────────────────────────────────────
    if (confirmed) {
        return (
            <div className="flex flex-col items-center text-center py-8 px-4">
                <div
                    className="flex h-20 w-20 items-center justify-center rounded-full mb-6"
                    style={{ background: C.goldFaint, border: `2px solid ${C.gold}` }}
                >
                    <CheckCircle2 size={36} style={{ color: C.gold }} />
                </div>
                <h2 className="font-display text-3xl font-bold mb-2" style={{ color: C.text }}>
                    You&apos;re booked!
                </h2>
                <p className="mb-8 max-w-sm text-sm leading-relaxed" style={{ color: C.muted }}>
                    We&apos;ll see you soon at Mwezu Hair Salon. We&apos;ll reach out via WhatsApp to confirm your slot.
                </p>

                {/* Summary card */}
                <div
                    className="w-full max-w-sm rounded-2xl p-6 mb-8 text-left"
                    style={{ background: C.surface, border: `1px solid ${C.goldBorder}` }}
                >
                    {[
                        { label: "Service", value: selectedService?.name + (selectedService?.hasVariants ? ` · ${variant.size} · ${variant.length}` : "") },
                        { label: "Price", value: selectedService?.price },
                        { label: "Duration", value: selectedService?.duration },
                        { label: "Date", value: selectedDate ? formatDate(selectedDate) : "" },
                        { label: "Time", value: selectedTime ?? "" },
                        { label: "Name", value: formData.name },
                        { label: "Phone", value: formData.phone },
                        { label: "Location", value: "Northmead Market, Shop 25" },
                    ].map(({ label, value }) => (
                        <div
                            key={label}
                            className="flex justify-between py-2.5 text-sm"
                            style={{ borderBottom: `1px solid ${C.border}` }}
                        >
                            <span style={{ color: C.muted }}>{label}</span>
                            <span className="font-medium" style={{ color: label === "Price" ? C.gold : C.text }}>{value}</span>
                        </div>
                    ))}
                </div>

                <div className="flex flex-col gap-3 w-full max-w-sm">
                    <button
                        onClick={() => window.open("https://wa.me/message/VN7W2GUDBRPGM1")}
                        className="w-full rounded-full py-4 text-sm font-semibold transition-opacity hover:opacity-90"
                        style={{ background: C.gold, color: "#1C1714" }}
                    >
                        Message Us on WhatsApp
                    </button>
                    <button
                        onClick={() => { setConfirmed(false); setStep(1); setSelectedService(null); setSelectedDate(null); setSelectedTime(null); setFormData({ name: "", phone: "", notes: "" }); }}
                        className="w-full rounded-full py-4 text-sm font-medium transition-opacity hover:opacity-80"
                        style={{ background: C.elevated, color: C.text, border: `1px solid ${C.border}` }}
                    >
                        Book Another Appointment
                    </button>

                    {/* Owner notification */}
                    <div
                        className="rounded-2xl p-4 mt-2"
                        style={{ background: "rgba(201,168,76,0.05)", border: "1px solid rgba(201,168,76,0.2)" }}
                    >
                        <p className="text-xs uppercase tracking-widest mb-1" style={{ color: C.gold }}>
                            Notify the Salon
                        </p>
                        <p className="text-xs mb-3" style={{ color: C.muted }}>
                            Tap to send your booking details to both salon owners via WhatsApp.
                        </p>
                        <div className="flex gap-2">
                            {[
                                { label: "Notify Owner 1", phone: "260977000001" },
                                { label: "Notify Owner 2", phone: "260977000002" },
                            ].map(({ label, phone }) => {
                                const msg = `🔔 *New Mwezu Hair Booking!*\n\n👤 *Client:* ${formData.name}\n📱 *Phone:* ${formData.phone}\n✂️ *Service:* ${selectedService?.name}${selectedService?.hasVariants ? ` · ${variant.size} · ${variant.length}` : ""}\n📅 *Date:* ${selectedDate ? formatDate(selectedDate) : ""}\n⏰ *Time:* ${selectedTime}\n\nPlease check the admin dashboard for full details.`;
                                return (
                                    <button
                                        key={label}
                                        onClick={() => window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`)}
                                        className="flex-1 rounded-full py-2.5 text-xs font-semibold transition-opacity hover:opacity-90"
                                        style={{ background: "rgba(201,168,76,0.1)", color: "#C9A84C", border: "1px solid rgba(201,168,76,0.3)" }}
                                    >
                                        {label}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div>
            <StepIndicator step={step} />
            <SummaryBar
                service={selectedService}
                variant={selectedService?.hasVariants ? variant : null}
                date={selectedDate}
                time={selectedTime}
            />

            {/* ── STEP 1 ───────────────────────────────────────── */}
            {step === 1 && (
                <div>
                    {/* Variant picker */}
                    {showVariants && selectedService && (
                        <div
                            className="rounded-2xl p-6 mb-4"
                            style={{ background: C.surface, border: `1px solid ${C.goldBorder}` }}
                        >
                            <h3 className="font-display text-lg font-semibold mb-1" style={{ color: C.text }}>
                                Customise your {selectedService.name}
                            </h3>
                            <p className="text-sm mb-6" style={{ color: C.muted }}>Choose your preferred size and length.</p>

                            <div className="mb-5">
                                <p className="text-xs uppercase tracking-widest mb-3" style={{ color: C.gold }}>Size</p>
                                <div className="flex gap-2 flex-wrap">
                                    {["Small", "Medium", "Jumbo"].map(s => (
                                        <button
                                            key={s}
                                            onClick={() => setVariant(v => ({ ...v, size: s }))}
                                            className="rounded-full px-5 py-2 text-sm font-medium transition-all"
                                            style={{
                                                background: variant.size === s ? C.gold : C.elevated,
                                                color: variant.size === s ? "#1C1714" : C.muted,
                                                border: `1px solid ${variant.size === s ? C.gold : C.border}`,
                                            }}
                                        >
                                            {s}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="mb-7">
                                <p className="text-xs uppercase tracking-widest mb-3" style={{ color: C.gold }}>Length</p>
                                <div className="flex gap-2 flex-wrap">
                                    {["Normal", "Hip", "Bum"].map(l => (
                                        <button
                                            key={l}
                                            onClick={() => setVariant(v => ({ ...v, length: l }))}
                                            className="rounded-full px-5 py-2 text-sm font-medium transition-all"
                                            style={{
                                                background: variant.length === l ? C.gold : C.elevated,
                                                color: variant.length === l ? "#1C1714" : C.muted,
                                                border: `1px solid ${variant.length === l ? C.gold : C.border}`,
                                            }}
                                        >
                                            {l}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => { setShowVariants(false); setStep(2); }}
                                    className="flex-1 rounded-full py-3.5 text-sm font-semibold transition-opacity hover:opacity-90"
                                    style={{ background: C.gold, color: "#1C1714" }}
                                >
                                    Continue — {selectedService.price}
                                </button>
                                <button
                                    onClick={() => { setShowVariants(false); setSelectedService(null); }}
                                    className="rounded-full px-5 py-3.5 text-sm font-medium transition-opacity hover:opacity-80"
                                    style={{ background: C.elevated, color: C.muted, border: `1px solid ${C.border}` }}
                                >
                                    Back
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Category tabs */}
                    {!showVariants && (
                        <>
                            <div className="mb-5 flex flex-wrap gap-2">
                                {categories.map(cat => (
                                    <button
                                        key={cat}
                                        onClick={() => setActiveCategory(cat)}
                                        className="rounded-full px-4 py-2 text-xs font-medium transition-all"
                                        style={{
                                            background: activeCategory === cat ? C.gold : C.elevated,
                                            color: activeCategory === cat ? "#1C1714" : C.muted,
                                            border: `1px solid ${activeCategory === cat ? C.gold : C.border}`,
                                        }}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>

                            <div className="flex flex-col gap-3">
                                {filtered.map(s => {
                                    const isSelected = selectedService?.name === s.name;
                                    return (
                                        <button
                                            key={s.name}
                                            onClick={() => handleSelectService(s)}
                                            className="group w-full text-left rounded-2xl p-5 transition-all"
                                            style={{
                                                background: isSelected ? C.goldFaint : C.surface,
                                                border: `1px solid ${isSelected ? C.gold : C.border}`,
                                                boxShadow: isSelected ? `0 0 0 1px ${C.gold}` : "none",
                                            }}
                                        >
                                            <div className="flex items-start justify-between gap-3">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-1.5">
                                                        <span className="font-display font-semibold text-base" style={{ color: C.text }}>
                                                            {s.name}
                                                        </span>
                                                        {s.popular && (
                                                            <span
                                                                className="flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium"
                                                                style={{ background: C.goldFaint, color: C.gold, border: `1px solid ${C.goldBorder}` }}
                                                            >
                                                                <Sparkles size={9} /> Popular
                                                            </span>
                                                        )}
                                                    </div>
                                                    <p className="text-sm leading-relaxed mb-2" style={{ color: C.muted }}>{s.description}</p>
                                                    <div className="flex items-center gap-1 text-xs" style={{ color: C.muted }}>
                                                        <Clock size={11} />{s.duration}
                                                    </div>
                                                </div>
                                                <div className="shrink-0 text-right flex flex-col items-end gap-1">
                                                    <span className="font-display font-bold text-xl" style={{ color: C.gold }}>{s.price}</span>
                                                    <ChevronRight size={15} style={{ color: C.muted }} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                                                </div>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </>
                    )}
                </div>
            )}

            {/* ── STEP 2 ───────────────────────────────────────── */}
            {step === 2 && (
                <div>
                    <button
                        onClick={() => { setStep(1); setSelectedDate(null); setSelectedTime(null); }}
                        className="flex items-center gap-1 text-sm mb-7 transition-opacity hover:opacity-80"
                        style={{ color: C.muted }}
                    >
                        <ChevronLeft size={15} /> Back to services
                    </button>

                    <h2 className="font-display text-2xl font-bold mb-1" style={{ color: C.text }}>Pick a date</h2>
                    <p className="text-sm mb-6" style={{ color: C.muted }}>Choose from the next available days.</p>

                    {/* Date scroll */}
                    <div className="flex gap-2 overflow-x-auto pb-3 mb-8" style={{ scrollbarWidth: "none" }}>
                        {dates.map((d, i) => {
                            const fullyBooked = i % 6 === 0;
                            const isSelected = selectedDate?.toDateString() === d.toDateString();
                            return (
                                <button
                                    key={d.toISOString()}
                                    disabled={fullyBooked}
                                    onClick={() => { setSelectedDate(d); setSelectedTime(null); }}
                                    className="flex flex-col items-center shrink-0 rounded-2xl px-4 py-3 min-w-[68px] transition-all"
                                    style={{
                                        background: isSelected ? C.gold : C.surface,
                                        color: isSelected ? "#1C1714" : fullyBooked ? C.muted : C.text,
                                        border: `1px solid ${isSelected ? C.gold : C.border}`,
                                        opacity: fullyBooked ? 0.4 : 1,
                                        cursor: fullyBooked ? "not-allowed" : "pointer",
                                        boxShadow: isSelected ? `0 4px 16px rgba(201,168,76,0.25)` : "none",
                                    }}
                                >
                                    <span className="text-xs font-medium" style={{ opacity: 0.7 }}>
                                        {d.toLocaleDateString("en-GB", { weekday: "short" })}
                                    </span>
                                    <span className="text-xl font-bold leading-tight">{d.getDate()}</span>
                                    <span className="text-xs" style={{ opacity: 0.7 }}>
                                        {d.toLocaleDateString("en-GB", { month: "short" })}
                                    </span>
                                    {fullyBooked && <span className="text-[10px] mt-0.5 opacity-60">Full</span>}
                                </button>
                            );
                        })}
                    </div>

                    {/* Time slots */}
                    {selectedDate && (
                        <>
                            <h3 className="font-display text-lg font-semibold mb-1" style={{ color: C.text }}>
                                Available times
                            </h3>
                            <p className="text-sm mb-5" style={{ color: C.muted }}>{formatDate(selectedDate)}</p>
                            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 mb-8">
                                {timeSlots.map(({ time, available }) => {
                                    const isSelected = selectedTime === time;
                                    return (
                                        <button
                                            key={time}
                                            disabled={!available}
                                            onClick={() => setSelectedTime(time)}
                                            className="rounded-xl py-3 text-sm font-medium transition-all"
                                            style={{
                                                background: isSelected ? C.gold : available ? C.surface : C.elevated,
                                                color: isSelected ? "#1C1714" : available ? C.text : C.muted,
                                                border: `1px solid ${isSelected ? C.gold : C.border}`,
                                                opacity: available ? 1 : 0.35,
                                                cursor: available ? "pointer" : "not-allowed",
                                                textDecoration: available ? "none" : "line-through",
                                                boxShadow: isSelected ? `0 4px 12px rgba(201,168,76,0.2)` : "none",
                                            }}
                                        >
                                            {time}
                                        </button>
                                    );
                                })}
                            </div>

                            <button
                                disabled={!selectedTime}
                                onClick={() => setStep(3)}
                                className="w-full rounded-full py-4 text-sm font-semibold flex items-center justify-center gap-2 transition-opacity"
                                style={{
                                    background: selectedTime ? C.gold : C.elevated,
                                    color: selectedTime ? "#1C1714" : C.muted,
                                    cursor: selectedTime ? "pointer" : "not-allowed",
                                    opacity: selectedTime ? 1 : 0.5,
                                }}
                            >
                                Continue {selectedTime ? `— ${selectedTime}` : ""}
                                <ChevronRight size={16} />
                            </button>
                        </>
                    )}
                </div>
            )}

            {/* ── STEP 3 ───────────────────────────────────────── */}
            {step === 3 && (
                <div>
                    <button
                        onClick={() => setStep(2)}
                        className="flex items-center gap-1 text-sm mb-7 transition-opacity hover:opacity-80"
                        style={{ color: C.muted }}
                    >
                        <ChevronLeft size={15} /> Back to date & time
                    </button>

                    <h2 className="font-display text-2xl font-bold mb-1" style={{ color: C.text }}>Your details</h2>
                    <p className="text-sm mb-7" style={{ color: C.muted }}>No account needed — just your name and number.</p>

                    <div className="flex flex-col gap-4 mb-7">
                        {[
                            { label: "Full Name", key: "name", type: "text", placeholder: "e.g. Thandiwe Mwale", required: true },
                            { label: "Phone / WhatsApp", key: "phone", type: "tel", placeholder: "e.g. 0977 000 000", required: true },
                        ].map(({ label, key, type, placeholder }) => (
                            <div key={key}>
                                <label className="block text-xs uppercase tracking-widest mb-2" style={{ color: C.gold }}>
                                    {label} *
                                </label>
                                <input
                                    type={type}
                                    placeholder={placeholder}
                                    value={formData[key as keyof FormData]}
                                    onChange={e => setFormData(f => ({ ...f, [key]: e.target.value }))}
                                    className="w-full rounded-xl px-4 py-3.5 text-sm outline-none transition-all"
                                    style={{
                                        background: C.surface,
                                        border: `1px solid ${C.border}`,
                                        color: C.text,
                                        caretColor: C.gold,
                                    }}
                                    onFocus={e => { e.target.style.border = `1px solid ${C.gold}`; e.target.style.boxShadow = `0 0 0 3px rgba(201,168,76,0.15)`; }}
                                    onBlur={e => { e.target.style.border = `1px solid ${C.border}`; e.target.style.boxShadow = "none"; }}
                                />
                            </div>
                        ))}

                        <div>
                            <label className="block text-xs uppercase tracking-widest mb-2" style={{ color: C.gold }}>
                                Notes (optional)
                            </label>
                            <textarea
                                placeholder="Any details we should know? e.g. style references, hair concerns..."
                                value={formData.notes}
                                onChange={e => setFormData(f => ({ ...f, notes: e.target.value }))}
                                rows={3}
                                className="w-full rounded-xl px-4 py-3.5 text-sm outline-none transition-all resize-none"
                                style={{ background: C.surface, border: `1px solid ${C.border}`, color: C.text, caretColor: C.gold }}
                                onFocus={e => { e.target.style.border = `1px solid ${C.gold}`; e.target.style.boxShadow = `0 0 0 3px rgba(201,168,76,0.15)`; }}
                                onBlur={e => { e.target.style.border = `1px solid ${C.border}`; e.target.style.boxShadow = "none"; }}
                            />
                        </div>
                    </div>

                    {/* Appointment summary */}
                    <div
                        className="rounded-2xl p-5 mb-6"
                        style={{ background: C.surface, border: `1px solid ${C.goldBorder}` }}
                    >
                        <p className="text-xs uppercase tracking-widest mb-4" style={{ color: C.gold }}>
                            Appointment Summary
                        </p>
                        {[
                            { label: "Service", value: selectedService?.name + (selectedService?.hasVariants ? ` · ${variant.size} · ${variant.length}` : "") },
                            { label: "Price", value: selectedService?.price, gold: true },
                            { label: "Duration", value: selectedService?.duration },
                            { label: "Date", value: selectedDate ? formatDate(selectedDate) : "" },
                            { label: "Time", value: selectedTime ?? "" },
                            { label: "Location", value: "Northmead Market, Shop 25" },
                        ].map(({ label, value, gold }) => (
                            <div
                                key={label}
                                className="flex justify-between py-2.5 text-sm"
                                style={{ borderBottom: `1px solid ${C.border}` }}
                            >
                                <span style={{ color: C.muted }}>{label}</span>
                                <span className="font-medium" style={{ color: gold ? C.gold : C.text }}>{value}</span>
                            </div>
                        ))}
                    </div>

                    <button
                        disabled={!formData.name || !formData.phone}
                        onClick={() => setConfirmed(true)}
                        className="w-full rounded-full py-4 text-sm font-semibold transition-opacity mb-4"
                        style={{
                            background: formData.name && formData.phone ? C.gold : C.elevated,
                            color: formData.name && formData.phone ? "#1C1714" : C.muted,
                            cursor: formData.name && formData.phone ? "pointer" : "not-allowed",
                            opacity: formData.name && formData.phone ? 1 : 0.5,
                        }}
                    >
                        Confirm Appointment
                    </button>

                    <p className="text-center text-xs" style={{ color: C.muted }}>
                        By confirming, you agree to our cancellation policy. We&apos;ll reach out via WhatsApp to confirm your slot.
                    </p>
                </div>
            )}
        </div>
    );
}