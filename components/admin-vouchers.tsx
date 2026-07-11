"use client";

import { useState } from "react";
import { Gift, Check, X, Clock, Banknote, Copy } from "lucide-react";

const C = {
    surface: "#251D19", elevated: "#2E2520",
    gold: "#C9A84C", goldFaint: "rgba(201,168,76,0.1)", goldBorder: "rgba(201,168,76,0.25)",
    text: "#FAF6EE", muted: "#9B896E", border: "rgba(255,255,255,0.07)",
    success: "#4CAF7D", successFaint: "rgba(76,175,125,0.1)",
    danger: "#E05C5C", dangerFaint: "rgba(224,92,92,0.1)",
    warning: "#E09B4C", warningFaint: "rgba(224,155,76,0.1)",
};

type VoucherStatus = "active" | "redeemed" | "expired";

type Voucher = {
    id: string; code: string; amount: number;
    recipient: string; recipientPhone: string;
    sender: string; occasion: string;
    issued: string; expires: string;
    status: VoucherStatus; redeemedOn?: string;
    redeemedService?: string;
};

const mockVouchers: Voucher[] = [
    { id: "v1", code: "MH-K3F9P2QR", amount: 350, recipient: "Chanda Mwale", recipientPhone: "0977 111 222", sender: "Naledi Phiri", occasion: "Birthday 🎂", issued: "Today", expires: "5 Jul 2026", status: "active" },
    { id: "v2", code: "MH-B7T4MNXY", amount: 500, recipient: "Mutinta Banda", recipientPhone: "0966 333 444", sender: "Anonymous", occasion: "Christmas 🎄", issued: "20 Dec 2024", expires: "20 Dec 2025", status: "redeemed", redeemedOn: "14 Feb 2025", redeemedService: "Luxe Sew-in" },
    { id: "v3", code: "MH-QW8RLEZP", amount: 150, recipient: "Bupe Tembo", recipientPhone: "0955 555 666", sender: "Chibwe Musonda", occasion: "Just because 💛", issued: "10 Jan 2025", expires: "10 Jan 2026", status: "active" },
    { id: "v4", code: "MH-YH2VPNKS", amount: 250, recipient: "Mwenya Zulu", recipientPhone: "0977 777 888", sender: "Thandiwe Mwale", occasion: "Graduation 🎓", issued: "5 Nov 2024", expires: "5 Nov 2025", status: "expired" },
];

function StatusBadge({ status }: { status: VoucherStatus }) {
    const map = {
        active: { label: "Active", bg: C.successFaint, color: C.success },
        redeemed: { label: "Redeemed", bg: C.goldFaint, color: C.gold },
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

export function AdminVouchers() {
    const [vouchers, setVouchers] = useState(mockVouchers);
    const [filter, setFilter] = useState<VoucherStatus | "all">("all");
    const [redeemCode, setRedeemCode] = useState("");
    const [redeemMsg, setRedeemMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
    const [copied, setCopied] = useState<string | null>(null);

    const filtered = filter === "all" ? vouchers : vouchers.filter(v => v.status === filter);
    const totalIssued = vouchers.reduce((s, v) => s + v.amount, 0);
    const totalRedeemed = vouchers.filter(v => v.status === "redeemed").reduce((s, v) => s + v.amount, 0);
    const activeCount = vouchers.filter(v => v.status === "active").length;

    function handleRedeem() {
        const found = vouchers.find(v => v.code === redeemCode.toUpperCase() && v.status === "active");
        if (found) {
            setVouchers(prev => prev.map(v => v.id === found.id
                ? { ...v, status: "redeemed" as VoucherStatus, redeemedOn: "Today", redeemedService: "In-salon" }
                : v
            ));
            setRedeemMsg({ type: "success", text: `✓ Voucher ${found.code} redeemed! Value: K${found.amount} for ${found.recipient}` });
        } else {
            const alreadyUsed = vouchers.find(v => v.code === redeemCode.toUpperCase());
            setRedeemMsg({
                type: "error",
                text: alreadyUsed ? `This voucher has already been ${alreadyUsed.status}.` : "Voucher code not found. Please check and try again.",
            });
        }
        setRedeemCode("");
    }

    function copyCode(code: string) {
        navigator.clipboard.writeText(code).then(() => {
            setCopied(code);
            setTimeout(() => setCopied(null), 2000);
        });
    }

    return (
        <div>
            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-7">
                {[
                    { label: "Total Issued", value: vouchers.length.toString(), color: C.gold, icon: Gift },
                    { label: "Active Vouchers", value: activeCount.toString(), color: C.success, icon: Check },
                    { label: "Value Issued", value: `K${totalIssued}`, color: C.gold, icon: Banknote },
                    { label: "Value Redeemed", value: `K${totalRedeemed}`, color: C.warning, icon: Clock },
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

            {/* Redeem a voucher */}
            <div className="rounded-2xl p-5 mb-6" style={{ background: C.surface, border: `1px solid ${C.goldBorder}` }}>
                <div className="flex items-center gap-2 mb-3">
                    <Check size={15} style={{ color: C.gold }} />
                    <h3 className="font-display font-bold" style={{ color: C.text }}>Redeem a Voucher</h3>
                </div>
                <p className="text-xs mb-4" style={{ color: C.muted }}>
                    When a client presents a voucher code at the salon, enter it here to mark it as redeemed.
                </p>
                <div className="flex gap-2">
                    <input
                        type="text"
                        placeholder="Enter voucher code e.g. MH-K3F9P2QR"
                        value={redeemCode}
                        onChange={e => { setRedeemCode(e.target.value.toUpperCase()); setRedeemMsg(null); }}
                        onKeyDown={e => e.key === "Enter" && handleRedeem()}
                        className="flex-1 rounded-xl px-4 py-3 text-sm font-mono outline-none"
                        style={{ background: C.elevated, border: `1px solid ${C.border}`, color: C.text, caretColor: C.gold }}
                    />
                    <button
                        onClick={handleRedeem}
                        disabled={!redeemCode}
                        className="rounded-xl px-5 py-3 text-sm font-semibold transition-opacity"
                        style={{ background: C.gold, color: "#1C1714", opacity: redeemCode ? 1 : 0.5 }}
                    >
                        Redeem
                    </button>
                </div>
                {redeemMsg && (
                    <div
                        className="mt-3 rounded-xl px-4 py-3 text-sm"
                        style={{
                            background: redeemMsg.type === "success" ? C.successFaint : C.dangerFaint,
                            color: redeemMsg.type === "success" ? C.success : C.danger,
                            border: `1px solid ${redeemMsg.type === "success" ? C.success : C.danger}30`,
                        }}
                    >
                        {redeemMsg.text}
                    </div>
                )}
            </div>

            {/* Voucher list */}
            <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
                <h3 className="font-display font-bold" style={{ color: C.text }}>All Vouchers</h3>
                <div className="flex gap-2">
                    {(["all", "active", "redeemed", "expired"] as const).map(f => (
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

            <div className="flex flex-col gap-3">
                {filtered.map(v => (
                    <div key={v.id} className="rounded-2xl p-5"
                        style={{ background: C.surface, border: `1px solid ${C.border}` }}>
                        <div className="flex items-start justify-between gap-3 mb-3">
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="font-display font-bold text-lg" style={{ color: C.gold }}>K{v.amount}</span>
                                    <StatusBadge status={v.status} />
                                </div>
                                <div className="text-sm font-medium" style={{ color: C.text }}>For {v.recipient}</div>
                                <div className="text-xs" style={{ color: C.muted }}>From {v.sender} · {v.occasion}</div>
                            </div>
                            <button
                                onClick={() => copyCode(v.code)}
                                className="flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-mono font-bold transition-all"
                                style={{
                                    background: C.goldFaint, color: copied === v.code ? C.success : C.gold,
                                    border: `1px solid ${C.goldBorder}`,
                                }}
                            >
                                {copied === v.code ? <Check size={11} /> : <Copy size={11} />}
                                {v.code}
                            </button>
                        </div>

                        <div className="flex flex-wrap gap-4 text-xs" style={{ color: C.muted }}>
                            <span>📅 Issued: {v.issued}</span>
                            <span>⏰ Expires: {v.expires}</span>
                            {v.redeemedOn && <span>✓ Redeemed: {v.redeemedOn} · {v.redeemedService}</span>}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}