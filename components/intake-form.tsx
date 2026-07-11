"use client";

import { useState } from "react";
import { CheckCircle2, ChevronLeft, ChevronRight, Scissors, Heart, Sparkles, MessageSquare } from "lucide-react";

const C = {
    bg: "#1C1714", surface: "#251D19", elevated: "#2E2520",
    gold: "#C9A84C", goldFaint: "rgba(201,168,76,0.1)", goldBorder: "rgba(201,168,76,0.25)",
    text: "#FAF6EE", muted: "#9B896E", border: "rgba(255,255,255,0.07)",
    success: "#4CAF7D", successFaint: "rgba(76,175,125,0.1)",
    danger: "#E05C5C",
};

type Step = 1 | 2 | 3 | "done";

type FormData = {
    // Personal
    name: string; phone: string;
    // Hair profile
    hairType: string; hairTexture: string; hairLength: string;
    scalpCondition: string[];
    // Health & safety
    allergies: string[]; otherAllergy: string;
    previousReactions: string; reactionDetails: string;
    scalpConditions: string; isPregnant: string;
    // Style
    interestedServices: string[];
    styleInspo: string; referralSource: string;
    specialRequests: string; agreed: boolean;
};

const initialForm: FormData = {
    name: "", phone: "",
    hairType: "", hairTexture: "", hairLength: "",
    scalpCondition: [],
    allergies: [], otherAllergy: "",
    previousReactions: "", reactionDetails: "",
    scalpConditions: "", isPregnant: "",
    interestedServices: [],
    styleInspo: "", referralSource: "",
    specialRequests: "", agreed: false,
};

// ─── Helpers ───────────────────────────────────────────────
function RadioGroup({ label, options, value, onChange }: {
    label: string; options: string[]; value: string;
    onChange: (v: string) => void;
}) {
    return (
        <div>
            <label className="block text-xs uppercase tracking-widest mb-3" style={{ color: C.gold }}>
                {label}
            </label>
            <div className="flex flex-wrap gap-2">
                {options.map(opt => (
                    <button
                        key={opt}
                        type="button"
                        onClick={() => onChange(opt)}
                        className="rounded-full px-4 py-2 text-xs font-medium transition-all"
                        style={{
                            background: value === opt ? C.gold : C.elevated,
                            color: value === opt ? "#1C1714" : C.muted,
                            border: `1px solid ${value === opt ? C.gold : C.border}`,
                        }}
                    >
                        {opt}
                    </button>
                ))}
            </div>
        </div>
    );
}

function CheckGroup({ label, options, values, onChange }: {
    label: string; options: string[]; values: string[];
    onChange: (v: string[]) => void;
}) {
    function toggle(opt: string) {
        onChange(values.includes(opt) ? values.filter(v => v !== opt) : [...values, opt]);
    }
    return (
        <div>
            <label className="block text-xs uppercase tracking-widest mb-3" style={{ color: C.gold }}>
                {label}
            </label>
            <div className="flex flex-wrap gap-2">
                {options.map(opt => (
                    <button
                        key={opt}
                        type="button"
                        onClick={() => toggle(opt)}
                        className="rounded-full px-4 py-2 text-xs font-medium transition-all"
                        style={{
                            background: values.includes(opt) ? C.gold : C.elevated,
                            color: values.includes(opt) ? "#1C1714" : C.muted,
                            border: `1px solid ${values.includes(opt) ? C.gold : C.border}`,
                        }}
                    >
                        {opt}
                    </button>
                ))}
            </div>
        </div>
    );
}

function TextInput({ label, placeholder, value, onChange, type = "text", required }: {
    label: string; placeholder: string; value: string;
    onChange: (v: string) => void; type?: string; required?: boolean;
}) {
    return (
        <div>
            <label className="block text-xs uppercase tracking-widest mb-2" style={{ color: C.gold }}>
                {label}{required && " *"}
            </label>
            <input
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={e => onChange(e.target.value)}
                className="w-full rounded-xl px-4 py-3.5 text-sm outline-none"
                style={{ background: C.elevated, border: `1px solid ${C.border}`, color: C.text, caretColor: C.gold }}
                onFocus={e => { e.target.style.borderColor = C.gold; e.target.style.boxShadow = `0 0 0 3px ${C.goldFaint}`; }}
                onBlur={e => { e.target.style.borderColor = C.border; e.target.style.boxShadow = "none"; }}
            />
        </div>
    );
}

function TextArea({ label, placeholder, value, onChange }: {
    label: string; placeholder: string; value: string; onChange: (v: string) => void;
}) {
    return (
        <div>
            <label className="block text-xs uppercase tracking-widest mb-2" style={{ color: C.gold }}>
                {label}
            </label>
            <textarea
                placeholder={placeholder}
                value={value}
                onChange={e => onChange(e.target.value)}
                rows={3}
                className="w-full rounded-xl px-4 py-3 text-sm outline-none resize-none"
                style={{ background: C.elevated, border: `1px solid ${C.border}`, color: C.text, caretColor: C.gold }}
                onFocus={e => { e.target.style.borderColor = C.gold; e.target.style.boxShadow = `0 0 0 3px ${C.goldFaint}`; }}
                onBlur={e => { e.target.style.borderColor = C.border; e.target.style.boxShadow = "none"; }}
            />
        </div>
    );
}

// ─── Step indicator ────────────────────────────────────────
function StepBar({ step }: { step: Step }) {
    const steps = [
        { n: 1, label: "Your Hair", icon: Scissors },
        { n: 2, label: "Health Info", icon: Heart },
        { n: 3, label: "Style & Prefs", icon: Sparkles },
    ];
    return (
        <div className="mb-10 flex items-center justify-center gap-0">
            {steps.map(({ n, label, icon: Icon }, i) => {
                const active = step === n;
                const done = typeof step === "number" && step > n || step === "done";
                return (
                    <div key={n} className="flex items-center">
                        <div className="flex flex-col items-center gap-1.5">
                            <div
                                className="flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold transition-all"
                                style={{
                                    background: done || active ? C.gold : C.elevated,
                                    color: done || active ? "#1C1714" : C.muted,
                                    boxShadow: active ? `0 0 0 4px rgba(201,168,76,0.2)` : "none",
                                }}
                            >
                                {done ? <CheckCircle2 size={16} /> : <Icon size={15} />}
                            </div>
                            <span className="text-xs font-medium" style={{ color: active ? C.text : C.muted }}>
                                {label}
                            </span>
                        </div>
                        {i < steps.length - 1 && (
                            <div
                                className="mb-5 mx-2 h-px w-10 sm:w-16 transition-all"
                                style={{ background: typeof step === "number" && step > n || step === "done" ? C.gold : C.border }}
                            />
                        )}
                    </div>
                );
            })}
        </div>
    );
}

// ─── Main component ────────────────────────────────────────
export function IntakeForm() {
    const [step, setStep] = useState<Step>(1);
    const [form, setForm] = useState<FormData>(initialForm);

    function set<K extends keyof FormData>(key: K, value: FormData[K]) {
        setForm(f => ({ ...f, [key]: value }));
    }

    const step1Valid = form.name && form.phone && form.hairType && form.hairTexture && form.hairLength;
    const step2Valid = form.previousReactions && form.isPregnant;
    const step3Valid = form.referralSource && form.agreed;

    function buildOwnerMsg() {
        return `📋 *New Client Consultation Form*\n\n👤 *Name:* ${form.name}\n📱 *Phone:* ${form.phone}\n\n✂️ *Hair Profile:*\n• Type: ${form.hairType}\n• Texture: ${form.hairTexture}\n• Length: ${form.hairLength}\n• Scalp: ${form.scalpCondition.join(", ") || "Normal"}\n\n⚕️ *Health & Safety:*\n• Allergies: ${form.allergies.join(", ") || "None known"}\n• Previous reactions: ${form.previousReactions}\n• Pregnant/postpartum: ${form.isPregnant}\n\n💅 *Style Preferences:*\n• Interested in: ${form.interestedServices.join(", ") || "General"}\n• How found us: ${form.referralSource}\n• Notes: ${form.specialRequests || "None"}\n\nPlease save in the client's profile!`;
    }

    // ── Confirmation ──────────────────────────────────────────
    if (step === "done") {
        return (
            <div className="flex flex-col items-center text-center py-6">
                <div
                    className="flex h-16 w-16 items-center justify-center rounded-full mb-5"
                    style={{ background: C.successFaint, border: `1px solid rgba(76,175,125,0.4)` }}
                >
                    <CheckCircle2 size={28} style={{ color: C.success }} />
                </div>
                <h2 className="font-display text-3xl font-bold mb-2" style={{ color: C.text }}>
                    Form Submitted! 🌸
                </h2>
                <p className="text-sm mb-8 max-w-sm" style={{ color: C.muted }}>
                    Thank you, <span style={{ color: C.text }}>{form.name}</span>! Your consultation form has been received.
                    We&apos;ll review it before your appointment so we can give you the best possible service.
                </p>

                {/* Summary card */}
                <div
                    className="w-full rounded-2xl p-5 mb-6 text-left"
                    style={{ background: C.surface, border: `1px solid ${C.goldBorder}` }}
                >
                    <p className="text-xs uppercase tracking-widest mb-4" style={{ color: C.gold }}>
                        Your Submission Summary
                    </p>
                    {[
                        { label: "Name", value: form.name },
                        { label: "Phone", value: form.phone },
                        { label: "Hair Type", value: form.hairType },
                        { label: "Texture", value: form.hairTexture },
                        { label: "Length", value: form.hairLength },
                        { label: "Allergies", value: form.allergies.length ? form.allergies.join(", ") : "None known" },
                        { label: "Interested In", value: form.interestedServices.length ? form.interestedServices.join(", ") : "To discuss" },
                    ].map(({ label, value }) => (
                        <div key={label} className="flex justify-between py-2 text-sm"
                            style={{ borderBottom: `1px solid ${C.border}` }}>
                            <span style={{ color: C.muted }}>{label}</span>
                            <span className="font-medium text-right ml-4" style={{ color: C.text }}>{value}</span>
                        </div>
                    ))}
                </div>

                {/* Notify owners */}
                <div
                    className="w-full rounded-2xl p-4 mb-6"
                    style={{ background: C.goldFaint, border: `1px solid ${C.goldBorder}` }}
                >
                    <p className="text-xs uppercase tracking-widest mb-2" style={{ color: C.gold }}>Notify the Salon</p>
                    <p className="text-xs mb-4" style={{ color: C.muted }}>
                        Tap to send your form to both salon owners via WhatsApp.
                    </p>
                    <div className="flex gap-2">
                        {[
                            { label: "Notify Owner 1", phone: "260977000001" },
                            { label: "Notify Owner 2", phone: "260977000002" },
                        ].map(({ label, phone }) => (
                            <button
                                key={label}
                                onClick={() => window.open(`https://wa.me/${phone}?text=${encodeURIComponent(buildOwnerMsg())}`)}
                                className="flex-1 flex items-center justify-center gap-1.5 rounded-full py-2.5 text-xs font-semibold transition-opacity hover:opacity-90"
                                style={{ background: C.gold, color: "#1C1714" }}
                            >
                                <MessageSquare size={11} /> {label}
                            </button>
                        ))}
                    </div>
                </div>

                <a href="/book" className="w-full">
                    <button
                        className="w-full rounded-full py-4 text-sm font-semibold transition-opacity hover:opacity-90"
                        style={{ background: C.elevated, color: C.text, border: `1px solid ${C.border}` }}
                    >
                        Book an Appointment →
                    </button>
                </a>
            </div>
        );
    }

    return (
        <div>
            <StepBar step={step} />

            {/* ── STEP 1: Your Hair ───────────────────────────── */}
            {step === 1 && (
                <div className="flex flex-col gap-6">
                    <div className="text-center mb-2">
                        <h2 className="font-display text-2xl font-bold" style={{ color: C.text }}>About Your Hair</h2>
                        <p className="text-sm mt-1" style={{ color: C.muted }}>Help us understand your hair before you arrive.</p>
                    </div>

                    <TextInput label="Your Full Name" placeholder="e.g. Thandiwe Mwale" value={form.name}
                        onChange={v => set("name", v)} required />
                    <TextInput label="Your WhatsApp Number" placeholder="e.g. 0977 000 000" value={form.phone}
                        onChange={v => set("phone", v)} type="tel" required />

                    <RadioGroup
                        label="Hair Type *"
                        options={["Natural", "Relaxed", "Transitioning", "Colour-treated", "Other"]}
                        value={form.hairType}
                        onChange={v => set("hairType", v)}
                    />
                    <RadioGroup
                        label="Hair Texture *"
                        options={["Fine", "Medium", "Coarse", "Mixed"]}
                        value={form.hairTexture}
                        onChange={v => set("hairTexture", v)}
                    />
                    <RadioGroup
                        label="Current Hair Length *"
                        options={["Short", "Ear-length", "Shoulder", "Mid-back", "Long / Waist"]}
                        value={form.hairLength}
                        onChange={v => set("hairLength", v)}
                    />
                    <CheckGroup
                        label="Scalp Condition (select all that apply)"
                        options={["Normal", "Dry", "Oily", "Sensitive", "Flaky / Dandruff", "Itchy"]}
                        values={form.scalpCondition}
                        onChange={v => set("scalpCondition", v)}
                    />

                    <button
                        disabled={!step1Valid}
                        onClick={() => setStep(2)}
                        className="w-full rounded-full py-4 text-sm font-semibold flex items-center justify-center gap-2 transition-opacity"
                        style={{
                            background: step1Valid ? C.gold : C.elevated,
                            color: step1Valid ? "#1C1714" : C.muted,
                            opacity: step1Valid ? 1 : 0.5,
                            cursor: step1Valid ? "pointer" : "not-allowed",
                        }}
                    >
                        Continue <ChevronRight size={15} />
                    </button>
                </div>
            )}

            {/* ── STEP 2: Health & Safety ─────────────────────── */}
            {step === 2 && (
                <div className="flex flex-col gap-6">
                    <div className="text-center mb-2">
                        <h2 className="font-display text-2xl font-bold" style={{ color: C.text }}>Health & Safety</h2>
                        <p className="text-sm mt-1" style={{ color: C.muted }}>This helps us keep your appointment safe and comfortable.</p>
                    </div>

                    <CheckGroup
                        label="Known Allergies (select all that apply)"
                        options={["Hair products", "Glue / Adhesives", "Latex", "Fragrances / Perfumes", "Dyes / Colours", "None known"]}
                        values={form.allergies}
                        onChange={v => set("allergies", v)}
                    />

                    {form.allergies.some(a => !["None known", "Hair products", "Glue / Adhesives", "Latex", "Fragrances / Perfumes", "Dyes / Colours"].includes(a)) && (
                        <TextInput label="Other allergies — please describe" placeholder="Describe your allergy..."
                            value={form.otherAllergy} onChange={v => set("otherAllergy", v)} />
                    )}

                    <RadioGroup
                        label="Have you had a previous reaction to a hair service? *"
                        options={["Yes", "No", "Not sure"]}
                        value={form.previousReactions}
                        onChange={v => set("previousReactions", v)}
                    />

                    {form.previousReactions === "Yes" && (
                        <TextArea label="Please describe what happened"
                            placeholder="What service caused the reaction and what symptoms did you have?"
                            value={form.reactionDetails} onChange={v => set("reactionDetails", v)} />
                    )}

                    <TextArea label="Any scalp conditions we should know about? (optional)"
                        placeholder="e.g. eczema, psoriasis, sensitive areas, recent injury..."
                        value={form.scalpConditions} onChange={v => set("scalpConditions", v)} />

                    <RadioGroup
                        label="Are you currently pregnant or recently given birth? *"
                        options={["Yes", "No", "Prefer not to say"]}
                        value={form.isPregnant}
                        onChange={v => set("isPregnant", v)}
                    />

                    <div className="flex gap-3">
                        <button
                            onClick={() => setStep(1)}
                            className="rounded-full px-6 py-4 text-sm transition-opacity hover:opacity-70"
                            style={{ background: C.elevated, color: C.muted, border: `1px solid ${C.border}` }}
                        >
                            <ChevronLeft size={15} className="inline mr-1" /> Back
                        </button>
                        <button
                            disabled={!step2Valid}
                            onClick={() => setStep(3)}
                            className="flex-1 rounded-full py-4 text-sm font-semibold flex items-center justify-center gap-2 transition-opacity"
                            style={{
                                background: step2Valid ? C.gold : C.elevated,
                                color: step2Valid ? "#1C1714" : C.muted,
                                opacity: step2Valid ? 1 : 0.5,
                                cursor: step2Valid ? "pointer" : "not-allowed",
                            }}
                        >
                            Continue <ChevronRight size={15} />
                        </button>
                    </div>
                </div>
            )}

            {/* ── STEP 3: Style Preferences ───────────────────── */}
            {step === 3 && (
                <div className="flex flex-col gap-6">
                    <div className="text-center mb-2">
                        <h2 className="font-display text-2xl font-bold" style={{ color: C.text }}>Style & Preferences</h2>
                        <p className="text-sm mt-1" style={{ color: C.muted }}>Tell us what you love and how you found us.</p>
                    </div>

                    <CheckGroup
                        label="Services you're interested in"
                        options={["Knotless Braids", "Box Braids", "Fulani Braids", "Goddess Braids", "Sew-in", "Natural Twists", "Spanish Curl", "Wash & Blow Dry", "Other"]}
                        values={form.interestedServices}
                        onChange={v => set("interestedServices", v)}
                    />

                    <TextArea
                        label="Style inspiration / references (optional)"
                        placeholder="Describe your dream style or paste a link to an inspo photo..."
                        value={form.styleInspo}
                        onChange={v => set("styleInspo", v)}
                    />

                    <RadioGroup
                        label="How did you hear about Mwezu Hair? *"
                        options={["Instagram", "WhatsApp", "Word of mouth", "Google", "Walked past", "TikTok", "Other"]}
                        value={form.referralSource}
                        onChange={v => set("referralSource", v)}
                    />

                    <TextArea
                        label="Special requests or anything else we should know (optional)"
                        placeholder="e.g. I prefer a quieter environment / I have a specific stylist preference / I'm attending an event on..."
                        value={form.specialRequests}
                        onChange={v => set("specialRequests", v)}
                    />

                    {/* Agreement */}
                    <div
                        className="rounded-2xl p-5"
                        style={{ background: C.surface, border: `1px solid ${C.goldBorder}` }}
                    >
                        <p className="text-xs mb-4" style={{ color: C.muted }}>
                            By submitting this form you confirm that all information provided is accurate to the best of your knowledge.
                            You agree to Mwezu Hair&apos;s service policies, including our 24-hour cancellation policy.
                        </p>
                        <button
                            type="button"
                            onClick={() => set("agreed", !form.agreed)}
                            className="flex items-start gap-3 w-full text-left"
                        >
                            <div
                                className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md mt-0.5 transition-all"
                                style={{
                                    background: form.agreed ? C.gold : C.elevated,
                                    border: `2px solid ${form.agreed ? C.gold : C.border}`,
                                }}
                            >
                                {form.agreed && <CheckCircle2 size={12} style={{ color: "#1C1714" }} />}
                            </div>
                            <span className="text-xs leading-relaxed font-medium" style={{ color: form.agreed ? C.text : C.muted }}>
                                I confirm the above information is accurate and I agree to Mwezu Hair&apos;s policies. *
                            </span>
                        </button>
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={() => setStep(2)}
                            className="rounded-full px-6 py-4 text-sm transition-opacity hover:opacity-70"
                            style={{ background: C.elevated, color: C.muted, border: `1px solid ${C.border}` }}
                        >
                            <ChevronLeft size={15} className="inline mr-1" /> Back
                        </button>
                        <button
                            disabled={!step3Valid}
                            onClick={() => setStep("done")}
                            className="flex-1 rounded-full py-4 text-sm font-semibold transition-opacity"
                            style={{
                                background: step3Valid ? C.gold : C.elevated,
                                color: step3Valid ? "#1C1714" : C.muted,
                                opacity: step3Valid ? 1 : 0.5,
                                cursor: step3Valid ? "pointer" : "not-allowed",
                            }}
                        >
                            Submit Form ✓
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}