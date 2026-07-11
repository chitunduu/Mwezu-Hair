"use client";

import { useState } from "react";
import { Gift, Check, Sparkles, Copy, MessageSquare } from "lucide-react";

const C = {
    gold: "#C9A84C",
    goldFaint: "rgba(201,168,76,0.1)",
    goldBorder: "rgba(201,168,76,0.25)",
    espresso: "#1C1714",
    cream: "#FAF6EE",
    parchment: "#F0E8D8",
    brown: "#6B5B45",
    border: "#EDE4D4",
    success: "#4CAF7D",
};

const denominations = [
    { value: 150, label: "K150", popular: false, desc: "Perfect for a Wash & Blow Dry" },
    { value: 250, label: "K250", popular: false, desc: "Great for Stitch or Natural Braids" },
    { value: 350, label: "K350", popular: true, desc: "Ideal for Knotless Braids" },
    { value: 500, label: "K500", popular: false, desc: "Perfect for a Luxe Sew-in" },
];

const occasions = [
    "Birthday 🎂", "Christmas 🎄", "Mother's Day 💐", "Valentine's Day 💝",
    "Just because 💛", "Graduation 🎓", "Anniversary 💍", "Other 🎁",
];

type Step = "choose" | "details" | "preview" | "sent";

function VoucherCard({
    amount, recipientName, senderName, message, code,
}: {
    amount: number; recipientName: string; senderName: string;
    message: string; code: string;
}) {
    return (
        <div
            className="relative overflow-hidden rounded-3xl p-8 text-center"
            style={{ background: "linear-gradient(135deg, #1C1714 0%, #2E2520 100%)", border: "2px solid rgba(201,168,76,0.4)" }}
        >
            {/* Decorative circle */}
            <div
                className="pointer-events-none absolute -top-16 -right-16 h-40 w-40 rounded-full"
                style={{ background: "radial-gradient(circle, rgba(201,168,76,0.15), transparent)" }}
            />

            {/* Logo area */}
            <div className="mb-4 flex justify-center">
                <div
                    className="flex h-12 w-12 items-center justify-center rounded-2xl"
                    style={{ background: "rgba(201,168,76,0.15)", border: "1px solid rgba(201,168,76,0.3)" }}
                >
                    <Sparkles size={20} style={{ color: C.gold }} />
                </div>
            </div>

            <div className="text-xs uppercase tracking-widest mb-1" style={{ color: C.gold }}>
                Mwezu Hair Salon
            </div>
            <div className="font-display text-sm mb-5" style={{ color: "#9B896E" }}>
                Gift Voucher
            </div>

            {/* Amount */}
            <div className="font-display text-6xl font-bold mb-1" style={{ color: C.gold }}>
                K{amount}
            </div>
            <div className="text-xs mb-6" style={{ color: "#9B896E" }}>Zambian Kwacha</div>

            {/* Recipient */}
            <div className="rounded-2xl px-5 py-4 mb-4"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
                {recipientName && (
                    <div className="text-sm font-semibold mb-1" style={{ color: C.cream }}>
                        For {recipientName}
                    </div>
                )}
                {message && (
                    <div className="text-xs leading-relaxed italic" style={{ color: "#9B896E" }}>
                        "{message}"
                    </div>
                )}
                {senderName && (
                    <div className="text-xs mt-2" style={{ color: "#9B896E" }}>
                        — With love from {senderName}
                    </div>
                )}
            </div>

            {/* Code */}
            <div
                className="rounded-xl px-4 py-3 mb-4"
                style={{ background: "rgba(201,168,76,0.08)", border: "1px dashed rgba(201,168,76,0.4)" }}
            >
                <div className="text-xs uppercase tracking-widest mb-1" style={{ color: "#9B896E" }}>Voucher Code</div>
                <div className="font-mono font-bold text-lg tracking-wider" style={{ color: C.gold }}>{code}</div>
            </div>

            <div className="text-xs" style={{ color: "#9B896E" }}>
                Valid for 12 months · Redeemable on any service<br />
                Northmead Market, Shop 25, Lusaka
            </div>
        </div>
    );
}

function generateCode() {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    return "MH-" + Array.from({ length: 8 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
}

export function VoucherFlow() {
    const [step, setStep] = useState<Step>("choose");
    const [amount, setAmount] = useState<number | null>(null);
    const [customAmount, setCustomAmount] = useState("");
    const [useCustom, setUseCustom] = useState(false);
    const [recipientName, setRecipientName] = useState("");
    const [recipientPhone, setRecipientPhone] = useState("");
    const [senderName, setSenderName] = useState("");
    const [occasion, setOccasion] = useState("");
    const [message, setMessage] = useState("");
    const [code] = useState(generateCode);
    const [copied, setCopied] = useState(false);

    const finalAmount = useCustom ? parseInt(customAmount) : amount;

    const ownerMsg = `🎁 *Gift Voucher Purchase Request*\n\n💛 A client wants to buy a Mwezu Hair gift voucher!\n\n💰 *Amount:* K${finalAmount}\n👤 *For:* ${recipientName || "—"}\n📱 *Recipient's phone:* ${recipientPhone || "—"}\n🎉 *Occasion:* ${occasion || "—"}\n💌 *Message:* ${message || "—"}\n\n*Voucher Code to send:* ${code}\n\nPlease confirm payment and send the voucher via WhatsApp!`;

    const recipientMsg = `🎁 *You've received a Mwezu Hair Gift Voucher!*\n\n${senderName ? `*From:* ${senderName}\n` : ""}${message ? `*Message:* "${message}"\n\n` : "\n"}✨ *Your voucher:*\n💰 Value: K${finalAmount}\n🔑 Code: *${code}*\n\n✂️ Redeemable on any service at Mwezu Hair Salon\n📍 Northmead Market, Shop 25, Lusaka\n⏰ Valid for 12 months\n\nBook your appointment: mwezu-hair.vercel.app/book\nMention your code when booking 💛`;

    function copyCode() {
        navigator.clipboard.writeText(code).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    }

    // ── Step 1: Choose amount ────────────────────────────────
    if (step === "choose") {
        return (
            <div>
                <div className="text-center mb-10">
                    <p className="text-xs uppercase tracking-widest text-primary mb-2">Step 1 of 3</p>
                    <h2 className="font-display text-3xl font-bold text-foreground">Choose an Amount</h2>
                    <p className="mt-2 text-sm text-muted-foreground">Pick a denomination or enter a custom amount.</p>
                </div>

                {/* Denomination cards */}
                <div className="grid grid-cols-2 gap-4 mb-5">
                    {denominations.map(d => (
                        <button
                            key={d.value}
                            onClick={() => { setAmount(d.value); setUseCustom(false); }}
                            className="relative rounded-2xl p-5 text-left transition-all"
                            style={{
                                background: amount === d.value && !useCustom ? "#1C1714" : "#fff",
                                border: `2px solid ${amount === d.value && !useCustom ? C.gold : "#EDE4D4"}`,
                                boxShadow: amount === d.value && !useCustom ? `0 8px 24px rgba(201,168,76,0.15)` : "none",
                            }}
                        >
                            {d.popular && (
                                <div
                                    className="absolute -top-2.5 left-4 rounded-full px-2.5 py-0.5 text-xs font-bold"
                                    style={{ background: C.gold, color: "#1C1714" }}
                                >
                                    Popular
                                </div>
                            )}
                            <div
                                className="font-display text-3xl font-bold mb-1"
                                style={{ color: amount === d.value && !useCustom ? C.gold : "#1C1714" }}
                            >
                                {d.label}
                            </div>
                            <div className="text-xs leading-relaxed" style={{ color: "#6B5B45" }}>{d.desc}</div>
                            {amount === d.value && !useCustom && (
                                <div className="absolute top-3 right-3">
                                    <Check size={16} style={{ color: C.gold }} />
                                </div>
                            )}
                        </button>
                    ))}
                </div>

                {/* Custom amount */}
                <div
                    className="rounded-2xl p-5 mb-8 border border-border bg-card cursor-pointer transition-all"
                    onClick={() => setUseCustom(true)}
                    style={{ border: useCustom ? `2px solid ${C.gold}` : "2px solid #EDE4D4" }}
                >
                    <div className="text-sm font-semibold text-foreground mb-2">Custom Amount</div>
                    <div className="flex items-center gap-2">
                        <span className="text-muted-foreground font-bold">K</span>
                        <input
                            type="number"
                            placeholder="e.g. 450"
                            min={50}
                            value={customAmount}
                            onFocus={() => setUseCustom(true)}
                            onChange={e => { setCustomAmount(e.target.value); setUseCustom(true); setAmount(null); }}
                            className="flex-1 bg-transparent outline-none text-foreground text-xl font-display font-bold"
                            style={{ caretColor: C.gold }}
                        />
                    </div>
                    <div className="text-xs mt-1 text-muted-foreground">Minimum K50</div>
                </div>

                <button
                    disabled={!(amount || (useCustom && parseInt(customAmount) >= 50))}
                    onClick={() => setStep("details")}
                    className="w-full rounded-full py-4 text-sm font-semibold transition-opacity"
                    style={{
                        background: C.gold,
                        color: "#1C1714",
                        opacity: (amount || (useCustom && parseInt(customAmount) >= 50)) ? 1 : 0.4,
                        cursor: (amount || (useCustom && parseInt(customAmount) >= 50)) ? "pointer" : "not-allowed",
                    }}
                >
                    Continue → {finalAmount ? `K${finalAmount}` : ""}
                </button>
            </div>
        );
    }

    // ── Step 2: Details ──────────────────────────────────────
    if (step === "details") {
        return (
            <div>
                <div className="text-center mb-10">
                    <p className="text-xs uppercase tracking-widest text-primary mb-2">Step 2 of 3</p>
                    <h2 className="font-display text-3xl font-bold text-foreground">Personalise Your Gift</h2>
                    <p className="mt-2 text-sm text-muted-foreground">Tell us who it's for and add a personal message.</p>
                </div>

                <div className="flex flex-col gap-4 mb-8">
                    {[
                        { label: "Recipient's Name *", key: "recipientName", val: recipientName, set: setRecipientName, placeholder: "e.g. Thandiwe", type: "text" },
                        { label: "Recipient's WhatsApp *", key: "recipientPhone", val: recipientPhone, set: setRecipientPhone, placeholder: "e.g. 0977 000 000", type: "tel" },
                        { label: "Your Name (Gift From)", key: "senderName", val: senderName, set: setSenderName, placeholder: "e.g. Naledi", type: "text" },
                    ].map(({ label, val, set, placeholder, type, key }) => (
                        <div key={key}>
                            <label className="block text-xs uppercase tracking-widest text-primary mb-2">{label}</label>
                            <input
                                type={type}
                                placeholder={placeholder}
                                value={val}
                                onChange={e => set(e.target.value)}
                                className="w-full rounded-xl border border-border bg-card px-4 py-3.5 text-sm text-foreground outline-none focus:ring-2 transition-all"
                                style={{ caretColor: C.gold }}
                            />
                        </div>
                    ))}

                    {/* Occasion */}
                    <div>
                        <label className="block text-xs uppercase tracking-widest text-primary mb-2">Occasion</label>
                        <div className="flex flex-wrap gap-2">
                            {occasions.map(o => (
                                <button
                                    key={o}
                                    onClick={() => setOccasion(o === occasion ? "" : o)}
                                    className="rounded-full px-3 py-1.5 text-xs font-medium border transition-all"
                                    style={{
                                        background: occasion === o ? "#1C1714" : "#fff",
                                        color: occasion === o ? C.gold : "#6B5B45",
                                        borderColor: occasion === o ? C.gold : "#EDE4D4",
                                    }}
                                >
                                    {o}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Personal message */}
                    <div>
                        <label className="block text-xs uppercase tracking-widest text-primary mb-2">
                            Personal Message (optional)
                        </label>
                        <textarea
                            placeholder="Write a heartfelt message..."
                            value={message}
                            onChange={e => setMessage(e.target.value)}
                            rows={3}
                            className="w-full rounded-xl border border-border bg-card px-4 py-3.5 text-sm text-foreground outline-none resize-none"
                            style={{ caretColor: C.gold }}
                        />
                    </div>
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={() => setStep("choose")}
                        className="rounded-full px-6 py-4 text-sm border border-border text-muted-foreground hover:bg-card transition-colors"
                    >
                        Back
                    </button>
                    <button
                        disabled={!recipientName || !recipientPhone}
                        onClick={() => setStep("preview")}
                        className="flex-1 rounded-full py-4 text-sm font-semibold transition-opacity"
                        style={{
                            background: C.gold, color: "#1C1714",
                            opacity: recipientName && recipientPhone ? 1 : 0.4,
                            cursor: recipientName && recipientPhone ? "pointer" : "not-allowed",
                        }}
                    >
                        Preview Voucher →
                    </button>
                </div>
            </div>
        );
    }

    // ── Step 3: Preview ──────────────────────────────────────
    if (step === "preview") {
        return (
            <div>
                <div className="text-center mb-8">
                    <p className="text-xs uppercase tracking-widest text-primary mb-2">Step 3 of 3</p>
                    <h2 className="font-display text-3xl font-bold text-foreground">Your Gift Voucher</h2>
                    <p className="mt-2 text-sm text-muted-foreground">
                        Looking good! Complete the purchase via WhatsApp to activate.
                    </p>
                </div>

                {/* Voucher preview */}
                <div className="mb-6">
                    <VoucherCard
                        amount={finalAmount!}
                        recipientName={recipientName}
                        senderName={senderName}
                        message={message}
                        code={code}
                    />
                </div>

                {/* How it works */}
                <div
                    className="rounded-2xl p-5 mb-6"
                    style={{ background: C.goldFaint, border: `1px solid ${C.goldBorder}` }}
                >
                    <div className="text-xs uppercase tracking-widest mb-3" style={{ color: C.gold }}>
                        How It Works
                    </div>
                    <div className="flex flex-col gap-2.5">
                        {[
                            "Tap 'Purchase via WhatsApp' below — a message goes to the salon owners",
                            "Complete payment via mobile money or bank transfer",
                            "We send the voucher code to your recipient's WhatsApp instantly",
                            "They book any service and mention the code!",
                        ].map((step, i) => (
                            <div key={i} className="flex items-start gap-3 text-sm" style={{ color: "#6B5B45" }}>
                                <div
                                    className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs font-bold"
                                    style={{ background: C.gold, color: "#1C1714", marginTop: "1px" }}
                                >
                                    {i + 1}
                                </div>
                                {step}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-3">
                    <a
                        href={`https://wa.me/260977000001?text=${encodeURIComponent(ownerMsg)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <button
                            onClick={() => setTimeout(() => setStep("sent"), 500)}
                            className="w-full rounded-full py-4 text-sm font-semibold flex items-center justify-center gap-2 transition-opacity hover:opacity-90"
                            style={{ background: C.gold, color: "#1C1714" }}
                        >
                            <MessageSquare size={16} /> Purchase via WhatsApp — K{finalAmount}
                        </button>
                    </a>

                <button
                    onClick={copyCode}
                    className="w-full rounded-full py-3 text-sm font-medium border border-border flex items-center justify-center gap-2 transition-colors hover:bg-card"
                >
                    {copied ? <Check size={14} /> : <Copy size={14} />}
                    {copied ? "Code Copied!" : `Copy Voucher Code: ${code}`}
                </button>

                <button
                    onClick={() => setStep("details")}
                    className="text-xs text-muted-foreground transition-opacity hover:opacity-70"
                >
                    Go back and edit details
                </button>
            </div>
      </div >
    );
    }

    // ── Step 4: Sent ─────────────────────────────────────────
    if (step === "sent") {
        return (
            <div className="flex flex-col items-center text-center py-6">
                <div
                    className="flex h-16 w-16 items-center justify-center rounded-full mb-5"
                    style={{ background: "rgba(76,175,125,0.1)", border: "1px solid rgba(76,175,125,0.3)" }}
                >
                    <Check size={28} style={{ color: "#4CAF7D" }} />
                </div>

                <h2 className="font-display text-3xl font-bold text-foreground mb-2">
                    Request Sent! 🎁
                </h2>
                <p className="text-sm text-muted-foreground mb-6 max-w-sm">
                    The salon has been notified. Once your payment is confirmed,
                    <span className="font-semibold text-foreground"> {recipientName}</span> will
                    receive their K{finalAmount} voucher via WhatsApp.
                </p>

                {/* Mini voucher */}
                <div className="w-full max-w-sm mb-8">
                    <VoucherCard
                        amount={finalAmount!}
                        recipientName={recipientName}
                        senderName={senderName}
                        message={message}
                        code={code}
                    />
                </div>

                <button
                    onClick={copyCode}
                    className="mb-4 rounded-full px-6 py-3 text-sm font-medium border border-border flex items-center gap-2 mx-auto transition-colors hover:bg-card"
                >
                    {copied ? <Check size={14} /> : <Copy size={14} />}
                    {copied ? "Copied!" : `Copy Code: ${code}`}
                </button>

                <button
                    onClick={() => { setStep("choose"); setAmount(null); setRecipientName(""); setRecipientPhone(""); setSenderName(""); setOccasion(""); setMessage(""); }}
                    className="text-sm text-primary hover:underline"
                >
                    Buy another voucher
                </button>
            </div>
        );
    }

    return null;
}