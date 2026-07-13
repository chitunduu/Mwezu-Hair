"use client";

import { useState } from "react";
import { X, CheckCircle, ChevronRight, Tag, Gift, CreditCard, Smartphone, Wallet, Star, Package, MessageCircle, Check } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Booking {
  id: string;
  client: string;
  phone: string;
  service: string;
  stylist: string;
  date: string;
  time: string;
  price: number;
  ref: string;
}

interface Product {
  id: string;
  name: string;
  category: string;
  stock: number;
  cost: number;
}

interface CheckoutProps {
  booking: Booking;
  onClose: () => void;
  onComplete: (result: CheckoutResult) => void;
}

interface CheckoutResult {
  bookingId: string;
  totalPaid: number;
  paymentMethod: string;
  pointsAwarded: number;
  productsUsed: Product[];
  voucherApplied: string | null;
  discount: number;
}

// ─── Mock data (replace with real data from Supabase later) ──────────────────

const MOCK_PRODUCTS: Product[] = [
  { id: "p1", name: "X-Pression Braiding Hair (Black)", category: "Braiding Hair", stock: 24, cost: 35 },
  { id: "p2", name: "X-Pression Braiding Hair (Brown)", category: "Braiding Hair", stock: 18, cost: 35 },
  { id: "p3", name: "Darling Braid (Natural Black)", category: "Braiding Hair", stock: 30, cost: 28 },
  { id: "p4", name: "Brazilian Remy Weave (18\")", category: "Extensions", stock: 6, cost: 380 },
  { id: "p5", name: "Closure 4x4 (Natural Black)", category: "Extensions", stock: 4, cost: 220 },
  { id: "p6", name: "ORS Hair Mayonnaise", category: "Hair Products", stock: 8, cost: 65 },
  { id: "p7", name: "Cantu Shea Butter Leave-In", category: "Hair Products", stock: 12, cost: 55 },
  { id: "p8", name: "Eco Styler Gel (Olive Oil)", category: "Hair Products", stock: 15, cost: 45 },
  { id: "p9", name: "Rattail Comb", category: "Tools", stock: 20, cost: 18 },
  { id: "p10", name: "Edge Brush", category: "Tools", stock: 14, cost: 22 },
];

const MOCK_VOUCHERS: Record<string, number> = {
  "MH-A1B2C3D4": 150,
  "MH-X9Y8Z7W6": 250,
  "MH-Q3R4S5T6": 350,
};

// K10 = 1 point
const KWACHA_PER_POINT = 10;

// ─── Step indicator ───────────────────────────────────────────────────────────

const STEPS = ["Review", "Products", "Discounts", "Payment", "Done"];

function StepBar({ current }: { current: number }) {
  return (
    <div className="flex items-center gap-0 mb-8">
      {STEPS.map((label, i) => (
        <div key={label} className="flex items-center flex-1 last:flex-none">
          <div className="flex flex-col items-center gap-1">
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300"
              style={{
                background: i < current ? "#C9A84C" : i === current ? "#C9A84C" : "#2C2420",
                color: i <= current ? "#1C1714" : "#6B5B45",
                boxShadow: i === current ? "0 0 0 3px rgba(201,168,76,0.25)" : "none",
              }}
            >
              {i < current ? <Check size={12} /> : i + 1}
            </div>
            <span className="text-xs whitespace-nowrap" style={{ color: i <= current ? "#C9A84C" : "#6B5B45" }}>
              {label}
            </span>
          </div>
          {i < STEPS.length - 1 && (
            <div
              className="h-px flex-1 mx-1 mb-4 transition-all duration-300"
              style={{ background: i < current ? "#C9A84C" : "#2C2420" }}
            />
          )}
        </div>
      ))}
    </div>
  );
}

// ─── Step 1: Review appointment ───────────────────────────────────────────────

function StepReview({ booking, onNext }: { booking: Booking; onNext: () => void }) {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-1" style={{ color: "#FAF6EE", fontFamily: "var(--font-display)" }}>
        Review Appointment
      </h3>
      <p className="text-sm mb-6" style={{ color: "#6B5B45" }}>Confirm the details before checking out.</p>

      <div className="rounded-xl p-5 mb-4 space-y-3" style={{ background: "#241D1A", border: "1px solid #3A2E28" }}>
        <Row label="Client" value={booking.client} highlight />
        <Row label="Service" value={booking.service} />
        <Row label="Stylist" value={booking.stylist} />
        <Row label="Date" value={booking.date} />
        <Row label="Time" value={booking.time} />
        <Row label="Ref" value={booking.ref} mono />
        <div className="pt-3 mt-1 border-t" style={{ borderColor: "#3A2E28" }}>
          <div className="flex justify-between items-center">
            <span className="text-sm" style={{ color: "#6B5B45" }}>Service price</span>
            <span className="text-xl font-bold" style={{ color: "#C9A84C" }}>K{booking.price.toLocaleString()}</span>
          </div>
        </div>
      </div>

      <button
        onClick={onNext}
        className="w-full py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-opacity hover:opacity-90"
        style={{ background: "#C9A84C", color: "#1C1714" }}
      >
        Continue to Products <ChevronRight size={16} />
      </button>
    </div>
  );
}

// ─── Step 2: Products used ────────────────────────────────────────────────────

function StepProducts({
  selected,
  onToggle,
  onNext,
  onBack,
}: {
  selected: Set<string>;
  onToggle: (id: string) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const [search, setSearch] = useState("");
  const categories = Array.from(new Set(MOCK_PRODUCTS.map(p => p.category)));

  const filtered = MOCK_PRODUCTS.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <h3 className="text-lg font-semibold mb-1" style={{ color: "#FAF6EE", fontFamily: "var(--font-display)" }}>
        Products Used
      </h3>
      <p className="text-sm mb-4" style={{ color: "#6B5B45" }}>
        Select items used during this appointment. Stock will be deducted automatically.
      </p>

      <input
        type="text"
        placeholder="Search products..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="w-full rounded-lg px-3 py-2 text-sm mb-4 outline-none"
        style={{ background: "#241D1A", border: "1px solid #3A2E28", color: "#FAF6EE" }}
      />

      <div className="space-y-4 max-h-64 overflow-y-auto pr-1 mb-4">
        {categories.map(cat => {
          const items = filtered.filter(p => p.category === cat);
          if (!items.length) return null;
          return (
            <div key={cat}>
              <div className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "#6B5B45" }}>
                <Package size={10} className="inline mr-1" />{cat}
              </div>
              <div className="space-y-1">
                {items.map(p => (
                  <button
                    key={p.id}
                    onClick={() => onToggle(p.id)}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors"
                    style={{
                      background: selected.has(p.id) ? "rgba(201,168,76,0.12)" : "#241D1A",
                      border: `1px solid ${selected.has(p.id) ? "#C9A84C" : "#3A2E28"}`,
                    }}
                  >
                    <div
                      className="w-4 h-4 rounded flex items-center justify-center flex-shrink-0"
                      style={{
                        background: selected.has(p.id) ? "#C9A84C" : "transparent",
                        border: `1.5px solid ${selected.has(p.id) ? "#C9A84C" : "#6B5B45"}`,
                      }}
                    >
                      {selected.has(p.id) && <Check size={10} color="#1C1714" />}
                    </div>
                    <span className="flex-1 text-sm" style={{ color: "#FAF6EE" }}>{p.name}</span>
                    <span className="text-xs" style={{ color: "#6B5B45" }}>
                      {p.stock} in stock
                    </span>
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {selected.size > 0 && (
        <div className="rounded-lg px-3 py-2 mb-4 text-sm" style={{ background: "rgba(201,168,76,0.08)", border: "1px solid rgba(201,168,76,0.2)" }}>
          <span style={{ color: "#C9A84C" }}>{selected.size} product{selected.size > 1 ? "s" : ""} selected</span>
          <span style={{ color: "#6B5B45" }}> — stock will be deducted on completion</span>
        </div>
      )}

      <div className="flex gap-2">
        <button onClick={onBack} className="px-4 py-3 rounded-xl text-sm flex-1 transition-opacity hover:opacity-80" style={{ background: "#241D1A", color: "#6B5B45", border: "1px solid #3A2E28" }}>
          Back
        </button>
        <button onClick={onNext} className="py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 flex-[2] transition-opacity hover:opacity-90" style={{ background: "#C9A84C", color: "#1C1714" }}>
          Continue <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}

// ─── Step 3: Discounts (voucher + loyalty) ────────────────────────────────────

function StepDiscounts({
  servicePrice,
  voucherCode,
  setVoucherCode,
  voucherDiscount,
  setVoucherDiscount,
  voucherError,
  setVoucherError,
  redeemPoints,
  setRedeemPoints,
  clientPoints,
  onNext,
  onBack,
}: {
  servicePrice: number;
  voucherCode: string;
  setVoucherCode: (v: string) => void;
  voucherDiscount: number;
  setVoucherDiscount: (v: number) => void;
  voucherError: string;
  setVoucherError: (v: string) => void;
  redeemPoints: boolean;
  setRedeemPoints: (v: boolean) => void;
  clientPoints: number;
  onNext: () => void;
  onBack: () => void;
}) {
  const pointsValue = Math.min(clientPoints * KWACHA_PER_POINT, servicePrice * 0.5); // max 50% off via points
  const totalDiscount = voucherDiscount + (redeemPoints ? pointsValue : 0);
  const finalTotal = Math.max(0, servicePrice - totalDiscount);

  function applyVoucher() {
    const code = voucherCode.trim().toUpperCase();
    if (MOCK_VOUCHERS[code]) {
      setVoucherDiscount(MOCK_VOUCHERS[code]);
      setVoucherError("");
    } else {
      setVoucherDiscount(0);
      setVoucherError("Invalid or expired voucher code.");
    }
  }

  return (
    <div>
      <h3 className="text-lg font-semibold mb-1" style={{ color: "#FAF6EE", fontFamily: "var(--font-display)" }}>
        Discounts
      </h3>
      <p className="text-sm mb-6" style={{ color: "#6B5B45" }}>Apply a gift voucher or redeem loyalty points.</p>

      {/* Voucher */}
      <div className="rounded-xl p-4 mb-4" style={{ background: "#241D1A", border: "1px solid #3A2E28" }}>
        <div className="flex items-center gap-2 mb-3">
          <Gift size={14} style={{ color: "#C9A84C" }} />
          <span className="text-sm font-semibold" style={{ color: "#FAF6EE" }}>Gift Voucher</span>
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="MH-XXXXXXXX"
            value={voucherCode}
            onChange={e => { setVoucherCode(e.target.value.toUpperCase()); setVoucherError(""); setVoucherDiscount(0); }}
            className="flex-1 rounded-lg px-3 py-2 text-sm outline-none font-mono"
            style={{ background: "#1C1714", border: "1px solid #3A2E28", color: "#FAF6EE" }}
          />
          <button
            onClick={applyVoucher}
            className="px-4 py-2 rounded-lg text-sm font-semibold transition-opacity hover:opacity-90"
            style={{ background: voucherDiscount ? "#2A3D2A" : "#C9A84C", color: voucherDiscount ? "#4CAF50" : "#1C1714" }}
          >
            {voucherDiscount ? "Applied ✓" : "Apply"}
          </button>
        </div>
        {voucherError && <p className="text-xs mt-2" style={{ color: "#E57373" }}>{voucherError}</p>}
        {voucherDiscount > 0 && (
          <p className="text-xs mt-2" style={{ color: "#4CAF50" }}>Voucher applied — K{voucherDiscount} off</p>
        )}
      </div>

      {/* Loyalty points */}
      <div className="rounded-xl p-4 mb-6" style={{ background: "#241D1A", border: "1px solid #3A2E28" }}>
        <div className="flex items-center gap-2 mb-3">
          <Star size={14} style={{ color: "#C9A84C" }} />
          <span className="text-sm font-semibold" style={{ color: "#FAF6EE" }}>Loyalty Points</span>
        </div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm" style={{ color: "#6B5B45" }}>
            Client has <span style={{ color: "#C9A84C" }}>{clientPoints} pts</span> (worth K{clientPoints * KWACHA_PER_POINT})
          </span>
        </div>
        {clientPoints > 0 ? (
          <button
            onClick={() => setRedeemPoints(!redeemPoints)}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors"
            style={{
              background: redeemPoints ? "rgba(201,168,76,0.12)" : "transparent",
              border: `1px solid ${redeemPoints ? "#C9A84C" : "#3A2E28"}`,
            }}
          >
            <div
              className="w-4 h-4 rounded flex items-center justify-center flex-shrink-0"
              style={{
                background: redeemPoints ? "#C9A84C" : "transparent",
                border: `1.5px solid ${redeemPoints ? "#C9A84C" : "#6B5B45"}`,
              }}
            >
              {redeemPoints && <Check size={10} color="#1C1714" />}
            </div>
            <span className="text-sm" style={{ color: "#FAF6EE" }}>
              Redeem {Math.floor(pointsValue / KWACHA_PER_POINT)} pts for K{pointsValue} off
            </span>
          </button>
        ) : (
          <p className="text-xs" style={{ color: "#6B5B45" }}>Client has no redeemable points yet.</p>
        )}
      </div>

      {/* Total preview */}
      <div className="rounded-xl p-4 mb-4 space-y-2" style={{ background: "#241D1A", border: "1px solid #3A2E28" }}>
        <Row label="Service price" value={`K${servicePrice.toLocaleString()}`} />
        {voucherDiscount > 0 && <Row label="Voucher discount" value={`-K${voucherDiscount}`} valueColor="#4CAF50" />}
        {redeemPoints && <Row label="Points redeemed" value={`-K${pointsValue}`} valueColor="#4CAF50" />}
        <div className="pt-2 border-t" style={{ borderColor: "#3A2E28" }}>
          <div className="flex justify-between">
            <span className="text-sm font-semibold" style={{ color: "#FAF6EE" }}>Total to collect</span>
            <span className="text-xl font-bold" style={{ color: "#C9A84C" }}>K{finalTotal.toLocaleString()}</span>
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        <button onClick={onBack} className="px-4 py-3 rounded-xl text-sm flex-1 transition-opacity hover:opacity-80" style={{ background: "#241D1A", color: "#6B5B45", border: "1px solid #3A2E28" }}>
          Back
        </button>
        <button onClick={onNext} className="py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 flex-[2] transition-opacity hover:opacity-90" style={{ background: "#C9A84C", color: "#1C1714" }}>
          Continue <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}

// ─── Step 4: Payment ──────────────────────────────────────────────────────────

function StepPayment({
  total,
  paymentMethod,
  setPaymentMethod,
  cashReceived,
  setCashReceived,
  onComplete,
  onBack,
  loading,
}: {
  total: number;
  paymentMethod: string;
  setPaymentMethod: (v: string) => void;
  cashReceived: string;
  setCashReceived: (v: string) => void;
  onComplete: () => void;
  onBack: () => void;
  loading: boolean;
}) {
  const change = Math.max(0, parseFloat(cashReceived || "0") - total);
  const cashValid = paymentMethod !== "Cash" || parseFloat(cashReceived || "0") >= total;

  const methods = [
    { id: "Cash", icon: <Wallet size={18} />, label: "Cash" },
    { id: "MTN MoMo", icon: <Smartphone size={18} />, label: "MTN MoMo" },
    { id: "Card", icon: <CreditCard size={18} />, label: "Card" },
  ];

  return (
    <div>
      <h3 className="text-lg font-semibold mb-1" style={{ color: "#FAF6EE", fontFamily: "var(--font-display)" }}>
        Payment
      </h3>
      <p className="text-sm mb-6" style={{ color: "#6B5B45" }}>Collect payment and complete the appointment.</p>

      {/* Amount due */}
      <div className="rounded-xl p-4 mb-5 text-center" style={{ background: "#241D1A", border: "1px solid #3A2E28" }}>
        <div className="text-xs uppercase tracking-widest mb-1" style={{ color: "#6B5B45" }}>Amount Due</div>
        <div className="text-4xl font-bold" style={{ color: "#C9A84C", fontFamily: "var(--font-display)" }}>
          K{total.toLocaleString()}
        </div>
      </div>

      {/* Payment method */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        {methods.map(m => (
          <button
            key={m.id}
            onClick={() => setPaymentMethod(m.id)}
            className="flex flex-col items-center gap-2 py-4 rounded-xl transition-all"
            style={{
              background: paymentMethod === m.id ? "rgba(201,168,76,0.12)" : "#241D1A",
              border: `1.5px solid ${paymentMethod === m.id ? "#C9A84C" : "#3A2E28"}`,
              color: paymentMethod === m.id ? "#C9A84C" : "#6B5B45",
            }}
          >
            {m.icon}
            <span className="text-xs font-semibold">{m.label}</span>
          </button>
        ))}
      </div>

      {/* Cash calculator */}
      {paymentMethod === "Cash" && (
        <div className="rounded-xl p-4 mb-4" style={{ background: "#241D1A", border: "1px solid #3A2E28" }}>
          <label className="text-xs font-semibold uppercase tracking-wider block mb-2" style={{ color: "#6B5B45" }}>
            Cash Received (K)
          </label>
          <input
            type="number"
            value={cashReceived}
            onChange={e => setCashReceived(e.target.value)}
            placeholder="0.00"
            className="w-full rounded-lg px-3 py-2 text-lg font-bold outline-none mb-3"
            style={{ background: "#1C1714", border: "1px solid #3A2E28", color: "#FAF6EE" }}
          />
          {parseFloat(cashReceived || "0") >= total && (
            <div className="flex justify-between items-center">
              <span className="text-sm" style={{ color: "#6B5B45" }}>Change to give</span>
              <span className="text-lg font-bold" style={{ color: "#4CAF50" }}>K{change.toFixed(2)}</span>
            </div>
          )}
          {parseFloat(cashReceived || "0") > 0 && parseFloat(cashReceived || "0") < total && (
            <p className="text-xs" style={{ color: "#E57373" }}>
              Short by K{(total - parseFloat(cashReceived)).toFixed(2)}
            </p>
          )}
        </div>
      )}

      {paymentMethod === "MTN MoMo" && (
        <div className="rounded-lg px-4 py-3 mb-4 text-sm" style={{ background: "rgba(255,199,0,0.08)", border: "1px solid rgba(255,199,0,0.2)" }}>
          <p style={{ color: "#FFC700" }}>Ask client to send <strong>K{total}</strong> to the salon MoMo number, then confirm receipt before completing.</p>
        </div>
      )}

      <div className="flex gap-2">
        <button onClick={onBack} className="px-4 py-3 rounded-xl text-sm flex-1 transition-opacity hover:opacity-80" style={{ background: "#241D1A", color: "#6B5B45", border: "1px solid #3A2E28" }}>
          Back
        </button>
        <button
          onClick={onComplete}
          disabled={!paymentMethod || !cashValid || loading}
          className="py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 flex-[2] transition-opacity"
          style={{
            background: (!paymentMethod || !cashValid || loading) ? "#2C2420" : "#C9A84C",
            color: (!paymentMethod || !cashValid || loading) ? "#6B5B45" : "#1C1714",
            cursor: (!paymentMethod || !cashValid || loading) ? "not-allowed" : "pointer",
          }}
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: "#6B5B45", borderTopColor: "transparent" }} />
              Processing…
            </span>
          ) : (
            <>Complete Checkout <CheckCircle size={16} /></>
          )}
        </button>
      </div>
    </div>
  );
}

// ─── Step 5: Done ─────────────────────────────────────────────────────────────

function StepDone({
  booking,
  result,
  onClose,
}: {
  booking: Booking;
  result: CheckoutResult;
  onClose: () => void;
}) {
  const waMessage = encodeURIComponent(
    `Hi ${booking.client}! 🌟\n\nThank you for visiting Mwezu Hair Salon today! It was such a pleasure having you.\n\nYour service: ${booking.service}\nAmount paid: K${result.totalPaid} (${result.paymentMethod})\n\nYou've earned ${result.pointsAwarded} loyalty points on today's visit! 🏆\n\nWe'd love to see you again — book your next appointment at:\nmwezu-hair.vercel.app/book\n\nDon't forget to share your look and tag us @mwezu_hair! 📸\n\nWith love,\nMwezu Hair Salon ✨`
  );

  const waUrl = `https://wa.me/+${booking.phone.replace(/\D/g, "")}?text=${waMessage}`;

  return (
    <div className="text-center">
      {/* Success icon */}
      <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: "rgba(201,168,76,0.15)", border: "2px solid #C9A84C" }}>
        <CheckCircle size={32} style={{ color: "#C9A84C" }} />
      </div>

      <h3 className="text-xl font-bold mb-1" style={{ color: "#FAF6EE", fontFamily: "var(--font-display)" }}>
        Appointment Complete
      </h3>
      <p className="text-sm mb-6" style={{ color: "#6B5B45" }}>
        {booking.client}&apos;s checkout is done.
      </p>

      {/* Summary */}
      <div className="rounded-xl p-4 mb-4 text-left space-y-2" style={{ background: "#241D1A", border: "1px solid #3A2E28" }}>
        <Row label="Total collected" value={`K${result.totalPaid.toLocaleString()}`} highlight />
        <Row label="Payment method" value={result.paymentMethod} />
        {result.voucherApplied && <Row label="Voucher used" value={result.voucherApplied} mono />}
        {result.discount > 0 && <Row label="Total discount" value={`-K${result.discount}`} valueColor="#4CAF50" />}
        <Row label="Points awarded" value={`+${result.pointsAwarded} pts`} valueColor="#C9A84C" />
        {result.productsUsed.length > 0 && (
          <Row label="Stock deducted" value={`${result.productsUsed.length} product${result.productsUsed.length > 1 ? "s" : ""}`} />
        )}
      </div>

      {/* WhatsApp thank-you */}
      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="w-full py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 mb-3 transition-opacity hover:opacity-90"
        style={{ background: "#25D366", color: "#fff", display: "flex" }}
      >
        <MessageCircle size={16} />
        Send Thank-You to {booking.client}
      </a>

      <button
        onClick={onClose}
        className="w-full py-3 rounded-xl text-sm transition-opacity hover:opacity-80"
        style={{ background: "#241D1A", color: "#6B5B45", border: "1px solid #3A2E28" }}
      >
        Close
      </button>
    </div>
  );
}

// ─── Helper: label/value row ──────────────────────────────────────────────────

function Row({
  label,
  value,
  highlight,
  mono,
  valueColor,
}: {
  label: string;
  value: string;
  highlight?: boolean;
  mono?: boolean;
  valueColor?: string;
}) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-sm" style={{ color: "#6B5B45" }}>{label}</span>
      <span
        className={`text-sm font-semibold ${mono ? "font-mono" : ""}`}
        style={{ color: valueColor ?? (highlight ? "#C9A84C" : "#FAF6EE") }}
      >
        {value}
      </span>
    </div>
  );
}

// ─── Main checkout modal ──────────────────────────────────────────────────────

export function AdminCheckout({ booking, onClose, onComplete }: CheckoutProps) {
  const [step, setStep] = useState(0);
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(new Set());
  const [voucherCode, setVoucherCode] = useState("");
  const [voucherDiscount, setVoucherDiscount] = useState(0);
  const [voucherError, setVoucherError] = useState("");
  const [redeemPoints, setRedeemPoints] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [cashReceived, setCashReceived] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CheckoutResult | null>(null);

  // Mock: client has 45 points
  const clientPoints = 45;

  const pointsValue = Math.min(clientPoints * KWACHA_PER_POINT, booking.price * 0.5);
  const totalDiscount = voucherDiscount + (redeemPoints ? pointsValue : 0);
  const finalTotal = Math.max(0, booking.price - totalDiscount);
  const pointsAwarded = Math.floor(finalTotal / KWACHA_PER_POINT);

  function toggleProduct(id: string) {
    setSelectedProducts(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  async function handleComplete() {
    setLoading(true);
    // Simulate async (Supabase writes will go here)
    await new Promise(r => setTimeout(r, 1200));

    const checkoutResult: CheckoutResult = {
      bookingId: booking.id,
      totalPaid: finalTotal,
      paymentMethod,
      pointsAwarded,
      productsUsed: MOCK_PRODUCTS.filter(p => selectedProducts.has(p.id)),
      voucherApplied: voucherDiscount > 0 ? voucherCode : null,
      discount: totalDiscount,
    };

    setResult(checkoutResult);
    setLoading(false);
    setStep(4);
    onComplete(checkoutResult);
  }

  return (
    // Backdrop
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(4px)" }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      {/* Modal */}
      <div
        className="w-full max-w-md rounded-2xl p-6 relative overflow-y-auto"
        style={{
          background: "#1C1714",
          border: "1px solid #3A2E28",
          maxHeight: "90vh",
          boxShadow: "0 25px 60px rgba(0,0,0,0.6)",
        }}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg transition-colors hover:bg-white/5"
          style={{ color: "#6B5B45" }}
        >
          <X size={18} />
        </button>

        {/* Header */}
        <div className="mb-6">
          <div className="text-xs uppercase tracking-widest mb-1" style={{ color: "#C9A84C" }}>
            Checkout
          </div>
          <div className="text-base font-semibold" style={{ color: "#FAF6EE" }}>
            {booking.client} · {booking.service}
          </div>
        </div>

        {/* Step bar (hide on done screen) */}
        {step < 4 && <StepBar current={step} />}

        {/* Steps */}
        {step === 0 && (
          <StepReview booking={booking} onNext={() => setStep(1)} />
        )}
        {step === 1 && (
          <StepProducts
            selected={selectedProducts}
            onToggle={toggleProduct}
            onNext={() => setStep(2)}
            onBack={() => setStep(0)}
          />
        )}
        {step === 2 && (
          <StepDiscounts
            servicePrice={booking.price}
            voucherCode={voucherCode}
            setVoucherCode={setVoucherCode}
            voucherDiscount={voucherDiscount}
            setVoucherDiscount={setVoucherDiscount}
            voucherError={voucherError}
            setVoucherError={setVoucherError}
            redeemPoints={redeemPoints}
            setRedeemPoints={setRedeemPoints}
            clientPoints={clientPoints}
            onNext={() => setStep(3)}
            onBack={() => setStep(1)}
          />
        )}
        {step === 3 && (
          <StepPayment
            total={finalTotal}
            paymentMethod={paymentMethod}
            setPaymentMethod={setPaymentMethod}
            cashReceived={cashReceived}
            setCashReceived={setCashReceived}
            onComplete={handleComplete}
            onBack={() => setStep(2)}
            loading={loading}
          />
        )}
        {step === 4 && result && (
          <StepDone booking={booking} result={result} onClose={onClose} />
        )}
      </div>
    </div>
  );
}

// ─── Demo wrapper (for testing — remove when integrating into admin) ──────────

const DEMO_BOOKING: Booking = {
  id: "bk-001",
  client: "Natasha Mwale",
  phone: "260977123456",
  service: "Knotless Braids (Medium, Hip Length)",
  stylist: "Thandeka",
  date: "Saturday, 12 July 2025",
  time: "10:00 AM",
  price: 650,
  ref: "MH-2025-0042",
};

export default function AdminCheckoutDemo() {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "#1C1714" }}>
      <div className="text-center">
        <div className="mb-2 text-xs uppercase tracking-widest" style={{ color: "#C9A84C" }}>
          Admin · Bookings
        </div>
        <h1 className="text-2xl font-bold mb-1" style={{ color: "#FAF6EE", fontFamily: "var(--font-display)" }}>
          Service Checkout Flow
        </h1>
        <p className="text-sm mb-8" style={{ color: "#6B5B45" }}>
          Click below to open the checkout for a demo booking.
        </p>

        {/* Demo booking card */}
        <div
          className="rounded-2xl p-5 mb-6 text-left max-w-xs mx-auto"
          style={{ background: "#241D1A", border: "1px solid #3A2E28" }}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="font-semibold" style={{ color: "#FAF6EE" }}>{DEMO_BOOKING.client}</span>
            <span className="text-xs px-2 py-1 rounded-full" style={{ background: "rgba(201,168,76,0.15)", color: "#C9A84C" }}>
              Confirmed
            </span>
          </div>
          <div className="text-sm mb-1" style={{ color: "#6B5B45" }}>{DEMO_BOOKING.service}</div>
          <div className="text-sm mb-3" style={{ color: "#6B5B45" }}>{DEMO_BOOKING.time}</div>
          <div className="flex justify-between items-center">
            <span className="font-mono text-xs" style={{ color: "#6B5B45" }}>{DEMO_BOOKING.ref}</span>
            <span className="font-bold" style={{ color: "#C9A84C" }}>K{DEMO_BOOKING.price}</span>
          </div>
        </div>

        <button
          onClick={() => setOpen(true)}
          className="px-8 py-3 rounded-xl font-semibold text-sm flex items-center gap-2 mx-auto transition-opacity hover:opacity-90"
          style={{ background: "#C9A84C", color: "#1C1714" }}
        >
          <Tag size={16} />
          Checkout This Appointment
        </button>
      </div>

      {open && (
        <AdminCheckout
          booking={DEMO_BOOKING}
          onClose={() => setOpen(false)}
          onComplete={result => {
            console.log("Checkout complete:", result);
            // In real app: update Supabase booking status, deduct inventory, award points
          }}
        />
      )}
    </div>
  );
}
