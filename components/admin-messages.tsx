"use client";

import { useState } from "react";
import {
    MessageSquare, Phone, Settings, Send,
    Copy, Check, Users, Bell, Zap,
    Heart, Gift, Crown, AlertTriangle, ChevronRight, RefreshCw,
    ClipboardList, Star,
} from "lucide-react";

const C = {
    bg: "#1C1714", surface: "#251D19", elevated: "#2E2520",
    gold: "#C9A84C", goldFaint: "rgba(201,168,76,0.1)", goldBorder: "rgba(201,168,76,0.25)",
    text: "#FAF6EE", muted: "#9B896E", border: "rgba(255,255,255,0.07)",
    success: "#4CAF7D", successFaint: "rgba(76,175,125,0.1)",
    danger: "#E05C5C", dangerFaint: "rgba(224,92,92,0.1)",
    warning: "#E09B4C", warningFaint: "rgba(224,155,76,0.1)",
};

// â”€â”€â”€ Types â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
type Owner = { name: string; phone: string; role: string };
type Tab = "client" | "owners" | "campaigns";
type TemplateCat = "all" | "reminders" | "followup" | "winback" | "birthday" | "loyalty";

type Template = {
    id: string; title: string; category: TemplateCat;
    icon: React.ElementType; iconColor: string;
    description: string;
    body: (vars: Record<string, string>) => string;
};

// â”€â”€â”€ Mock data â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const mockClients = [
    { id: "1", name: "Thandiwe Mwale", phone: "0977 123 456", service: "Knotless Braids Â· Medium Hip", date: "Today", time: "8:00 AM", tier: "Gold", points: 1240 },
    { id: "2", name: "Naledi Phiri", phone: "0966 234 567", service: "Fulani Braids", date: "Today", time: "10:00 AM", tier: "Silver", points: 870 },
    { id: "3", name: "Chanda Banda", phone: "0955 345 678", service: "Luxe Sew-in", date: "Today", time: "1:00 PM", tier: "Silver", points: 760 },
    { id: "4", name: "Mutale Zulu", phone: "0977 456 789", service: "Spanish Curl", date: "Today", time: "3:00 PM", tier: "Bronze", points: 480 },
    { id: "5", name: "Namwinga Kasonde", phone: "0966 567 890", service: "Goddess Twists", date: "Tomorrow", time: "9:00 AM", tier: "Silver", points: 980 },
    { id: "6", name: "Bwalya Mwamba", phone: "0955 678 901", service: "Box Braids", date: "Tomorrow", time: "1:00 PM", tier: "Bronze", points: 390 },
    { id: "7", name: "Mwila Chitalu", phone: "0977 789 012", service: "Wash & Blow Dry", date: "4 Feb 2025", time: "â€”", tier: "Bronze", points: 120, atRisk: true },
];

const templates: Template[] = [
    {
        id: "t1", title: "Booking Confirmation", category: "reminders",
        icon: Check, iconColor: C.success, description: "Sent immediately after booking",
        body: (v) => `Hi ${v.name} ðŸ’›\n\nYour appointment at *Mwezu Hair Salon* is confirmed!\n\nâœ‚ï¸ *Service:* ${v.service}\nðŸ“… *Date:* ${v.date}\nâ° *Time:* ${v.time}\nðŸ“ Northmead Market, Shop 25\n\nSee you soon! Reply if you have any questions ðŸŒ¸`,
    },
    {
        id: "t2", title: "24-Hour Reminder", category: "reminders",
        icon: Bell, iconColor: C.gold, description: "Sent the day before the appointment",
        body: (v) => `Hi ${v.name} ðŸ˜Š\n\nJust a reminder â€” your Mwezu Hair appointment is *TOMORROW!*\n\nâœ‚ï¸ ${v.service}\nâ° ${v.time}\nðŸ“ Northmead Market, Shop 25\n\nPlease arrive 5 minutes early. We can't wait to see you! ðŸ’›`,
    },
    {
        id: "t3", title: "2-Hour Reminder", category: "reminders",
        icon: Bell, iconColor: C.warning, description: "Sent 2 hours before appointment",
        body: (v) => `Hi ${v.name} â°\n\nYour Mwezu Hair appointment is in *2 hours!*\n\nâœ‚ï¸ ${v.service} at ${v.time}\nðŸ“ Northmead Market, Shop 25\n\nSee you very soon! ðŸ’›`,
    },
    {
        id: "t4", title: "Thank You Message", category: "followup",
        icon: Heart, iconColor: "#E05C8A", description: "Sent after the appointment",
        body: (v) => `Hi ${v.name} ðŸ’›\n\nThank you so much for visiting *Mwezu Hair Salon* today!\n\nWe hope you absolutely love your ${v.service}. âœ¨\n\nDon't forget â€” you've earned points towards your *Mwezu Rewards* ðŸ†\n\nWe'd love to see you again soon! Book your next appointment anytime ðŸŒ¸`,
    },
    {
        id: "t5", title: "Review Request", category: "followup",
        icon: Heart, iconColor: C.warning, description: "Ask for feedback after visit",
        body: (v) => `Hi ${v.name} ðŸ˜Š\n\nWe hope you're loving your new look from Mwezu Hair! âœ¨\n\nIf you enjoyed your experience, we'd be so grateful if you could share a quick review or post your style and tag us:\n\nðŸ“¸ Instagram: *@mwezu_hair*\n\nYour support means everything to us! ðŸ’›`,
    },
    {
        id: "t6", title: "Win-Back Message", category: "winback",
        icon: Zap, iconColor: C.danger, description: "For clients 45+ days inactive",
        body: (v) => `Hi ${v.name} ðŸ’›\n\nWe miss you at *Mwezu Hair!* ðŸŒ¸\n\nIt's been a while since your last visit and we'd love to see you again.\n\nYour loyalty points are still waiting for you ðŸ†\n\nBook your next appointment:\nðŸ‘‰ mwezuhair.vercel.app/book\n\nWe can't wait to have you back! âœ¨`,
    },
    {
        id: "t7", title: "Special Offer (Win-back)", category: "winback",
        icon: Gift, iconColor: C.danger, description: "Win-back with a special incentive",
        body: (v) => `Hi ${v.name}! ðŸŽ\n\nWe haven't seen you in a while and we miss you!\n\nAs a special thank you for being a loyal Mwezu client, we'd love to offer you *double loyalty points* on your next visit ðŸ†\n\nBook today:\nðŸ‘‰ mwezuhair.vercel.app/book\n\nThis offer is just for you, ${v.name}! ðŸ’›`,
    },
    {
        id: "t8", title: "Birthday Greeting", category: "birthday",
        icon: Gift, iconColor: "#E05C8A", description: "Sent on client's birthday",
        body: (v) => `ðŸŽ‚ *Happy Birthday, ${v.name}!* ðŸŽ‰\n\nFrom all of us at *Mwezu Hair Salon*, we're wishing you the most beautiful day!\n\nðŸŽ *Your birthday gift:* Double loyalty points on ANY booking this month!\n\nTreat yourself â€” you deserve it! ðŸ’›\n\nBook now: mwezuhair.vercel.app/book`,
    },
    {
        id: "t9", title: "Loyalty Tier Upgrade", category: "loyalty",
        icon: Crown, iconColor: C.gold, description: "Sent when client reaches a new tier",
        body: (v) => `ðŸ† *Congratulations, ${v.name}!*\n\nYou've just reached *${v.tier} status* on Mwezu Rewards! âœ¨\n\nYou've unlocked exclusive new perks on your next visit.\n\nThank you for your loyalty â€” you deserve every reward! ðŸ’›\n\nSee your full benefits at:\nðŸ‘‰ mwezuhair.vercel.app/loyalty`,
    },
    {
        id: "t10", title: "Points Balance Update", category: "loyalty",
        icon: Crown, iconColor: C.gold, description: "After earning points",
        body: (v) => `Hi ${v.name} ðŸ†\n\nGreat news â€” you just earned points from your visit!\n\nâ­ *Current Balance:* ${v.points} points\nðŸŽ¯ *Your Tier:* ${v.tier}\n\nKeep visiting to unlock more exclusive rewards!\n\nðŸ‘‰ mwezuhair.vercel.app/loyalty`,
    },
    {
        id: "t11", title: "Manage Booking Link", category: "reminders",
        icon: RefreshCw, iconColor: C.muted, description: "Send client a link to cancel or reschedule",
        body: (v) => `Hi ${v.name} ðŸ’›\n\nIf you ever need to reschedule or cancel your Mwezu Hair appointment, you can do it easily here:\n\nðŸ‘‰ mwezu-hair.vercel.app/manage\n\nJust enter your phone number and we'll find your booking.\n\nSee you soon! ðŸŒ¸`,
    },
    {
        id: "t12", title: "Send Intake Form Link", category: "reminders",
        icon: ClipboardList, iconColor: "#9B7FE8", description: "Send new clients a link to fill out their consultation form",
        body: (v) => `Hi ${v.name} 🌸\n\nWelcome to *Mwezu Hair!* We're so excited to have you.\n\nBefore your first appointment, please take 3 minutes to fill out our client consultation form so we can give you the best possible service:\n\n📋 mwezu-hair.vercel.app/intake\n\nSee you soon! 💛`,
    },
    {
        id: "t13", title: "Rebooking Reminder", category: "reminders",
        icon: RefreshCw, iconColor: C.warning, description: "Send 6–8 weeks after last visit to encourage rebooking",
        body: (v) => `Hi ${v.name} 💛\n\nIt's been a while since your last visit at *Mwezu Hair* and we'd love to see you again!\n\nYour hair is probably ready for some love 🌸\n\nBook your next appointment:\n👉 mwezu-hair.vercel.app/book\n\nDon't forget — you're earning *Mwezu Rewards* points every time you visit! 🏆`,
    },
    {
        id: "t14", title: "Google Review Request", category: "followup",
        icon: Star, iconColor: C.warning, description: "Ask happy clients to leave a Google review after their visit",
        body: (v) => `Hi ${v.name} 😊\n\nWe hope you're absolutely loving your new look from *Mwezu Hair!* ✨\n\nIf you had a wonderful experience, would you mind leaving us a quick Google review? It takes less than a minute and means the world to us! 💛\n\n⭐ Leave a review:\nhttps://g.page/r/mwezuhair/review\n\nThank you so much — we can't wait to see you again! 🌸`,
    },
];

const campaignTemplates = [
    {
        id: "c1", title: "Win-Back Campaign", icon: Zap, color: C.danger,
        description: "Send to all clients who haven't visited in 45+ days",
        target: "at-risk", count: 1,
        body: (name: string) => `Hi ${name} ðŸ’›\n\nWe miss you at *Mwezu Hair!* ðŸŒ¸\n\nIt's been a while since your last visit and we'd love to see you again.\n\nYour loyalty points are still waiting for you ðŸ†\n\nBook your next appointment:\nðŸ‘‰ mwezuhair.vercel.app/book`,
    },
    {
        id: "c2", title: "New Client Welcome", icon: Heart, color: "#E05C8A",
        description: "Welcome message for first-time clients after their appointment",
        target: "new", count: 2,
        body: (name: string) => `Hi ${name} ðŸŒ¸\n\nWelcome to the *Mwezu Hair family!* ðŸ’›\n\nWe hope you loved your first visit with us. You've been automatically enrolled in *Mwezu Rewards* â€” so every visit earns you points towards free services! ðŸ†\n\nWe can't wait to see you again!\n\nðŸ‘‰ mwezuhair.vercel.app/loyalty`,
    },
    {
        id: "c3", title: "Loyalty Reminder", icon: Crown, color: C.gold,
        description: "Remind clients close to their next tier",
        target: "near-tier", count: 2,
        body: (name: string) => `Hi ${name} ðŸ†\n\nYou're *SO close* to your next Mwezu Rewards tier!\n\nJust a few more visits and you'll unlock exclusive new perks âœ¨\n\nBook your next appointment:\nðŸ‘‰ mwezuhair.vercel.app/book\n\nWe can't wait to reward your loyalty! ðŸ’›`,
    },
];

// â”€â”€â”€ Helper: copy to clipboard â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function useCopy() {
    const [copied, setCopied] = useState<string | null>(null);
    function copy(text: string, id: string) {
        navigator.clipboard.writeText(text).then(() => {
            setCopied(id);
            setTimeout(() => setCopied(null), 2000);
        });
    }
    return { copied, copy };
}

function openWhatsApp(phone: string, message: string) {
    const clean = phone.replace(/\s/g, "").replace(/^0/, "260");
    window.open(`https://wa.me/${clean}?text=${encodeURIComponent(message)}`);
}


// â”€â”€â”€ Template Card â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function TemplateCard({ template, client, onSend }: {
    template: Template;
    client: typeof mockClients[0] | null;
    onSend: (msg: string, phone: string) => void;
}) {
    const { copied, copy } = useCopy();
    const vars = {
        name: client?.name ?? "[Client Name]",
        service: client?.service ?? "[Service]",
        date: client?.date ?? "[Date]",
        time: client?.time ?? "[Time]",
        phone: client?.phone ?? "[Phone]",
        tier: client?.tier ?? "[Tier]",
        points: client?.points?.toString() ?? "[Points]",
    };
    const message = template.body(vars);
    const Icon = template.icon;

    return (
        <div className="rounded-2xl p-5" style={{ background: C.surface, border: `1px solid ${C.border}` }}>
            <div className="flex items-start gap-3 mb-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
                    style={{ background: `${template.iconColor}15`, border: `1px solid ${template.iconColor}25` }}>
                    <Icon size={16} style={{ color: template.iconColor }} />
                </div>
                <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm" style={{ color: C.text }}>{template.title}</div>
                    <div className="text-xs mt-0.5" style={{ color: C.muted }}>{template.description}</div>
                </div>
            </div>

            {/* Message preview */}
            <div className="rounded-xl p-3 mb-4 text-xs leading-relaxed whitespace-pre-line"
                style={{ background: C.elevated, color: C.muted, border: `1px solid ${C.border}` }}>
                {message.slice(0, 120)}{message.length > 120 ? "..." : ""}
            </div>

            <div className="flex gap-2">
                <button
                    onClick={() => copy(message, template.id)}
                    className="flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-medium transition-all flex-1 justify-center"
                    style={{ background: C.elevated, color: copied === template.id ? C.success : C.muted, border: `1px solid ${C.border}` }}
                >
                    {copied === template.id ? <Check size={12} /> : <Copy size={12} />}
                    {copied === template.id ? "Copied!" : "Copy"}
                </button>
                <button
                    onClick={() => client ? openWhatsApp(client.phone, message) : null}
                    disabled={!client}
                    className="flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold transition-all flex-1 justify-center"
                    style={{
                        background: client ? C.gold : C.elevated,
                        color: client ? "#1C1714" : C.muted,
                        cursor: client ? "pointer" : "not-allowed",
                        opacity: client ? 1 : 0.5,
                    }}
                >
                    <MessageSquare size={12} />
                    WhatsApp
                </button>
            </div>
        </div>
    );
}

// â”€â”€â”€ Main Component â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export function AdminMessages() {
    const [tab, setTab] = useState<Tab>("client");
    const [selectedClient, setSelectedClient] = useState<typeof mockClients[0] | null>(null);
    const [templateCat, setTemplateCat] = useState<TemplateCat>("all");
    const [owners, setOwners] = useState<Owner[]>([
        { name: "Owner 1", phone: "0977 000 001", role: "Head Stylist & Owner" },
        { name: "Owner 2", phone: "0977 000 002", role: "Co-Owner" },
    ]);
    const [editingOwner, setEditingOwner] = useState<number | null>(null);
    const [ownerDraft, setOwnerDraft] = useState<Owner>({ name: "", phone: "", role: "" });
    const { copied, copy } = useCopy();

    const filteredTemplates = templates.filter(t => templateCat === "all" || t.category === templateCat);
    const atRiskClients = mockClients.filter(c => c.atRisk);

    const catTabs: { id: TemplateCat; label: string }[] = [
        { id: "all", label: "All" },
        { id: "reminders", label: "Reminders" },
        { id: "followup", label: "Follow-up" },
        { id: "winback", label: "Win-back" },
        { id: "birthday", label: "Birthday" },
        { id: "loyalty", label: "Loyalty" },
    ];

    function newBookingOwnerMsg(owner: Owner) {
        return `ðŸ”” *New Mwezu Hair Booking!*\n\nHi ${owner.name},\n\nA new appointment has just been booked:\n\nðŸ‘¤ *Client:* [Client Name]\nðŸ“± *Phone:* [Phone]\nâœ‚ï¸ *Service:* [Service]\nðŸ“… *Date:* [Date]\nâ° *Time:* [Time]\n\nPlease check the admin dashboard for full details.`;
    }

    return (
        <div>
            {/* Owner Settings */}
            <div className="rounded-2xl p-5 mb-6" style={{ background: C.surface, border: `1px solid ${C.goldBorder}` }}>
                <div className="flex items-center gap-2 mb-4">
                    <Settings size={15} style={{ color: C.gold }} />
                    <h3 className="font-display font-bold text-sm" style={{ color: C.text }}>Owner Notification Settings</h3>
                    <span className="text-xs ml-1" style={{ color: C.muted }}>
                        â€” Both owners receive WhatsApp alerts for every new booking
                    </span>
                </div>

                <div className="grid sm:grid-cols-2 gap-3">
                    {owners.map((owner, i) => (
                        <div key={i} className="rounded-xl p-4" style={{ background: C.elevated, border: `1px solid ${C.border}` }}>
                            {editingOwner === i ? (
                                <div className="flex flex-col gap-2">
                                    {["name", "role", "phone"].map(field => (
                                        <input
                                            key={field}
                                            type="text"
                                            placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                                            value={ownerDraft[field as keyof Owner]}
                                            onChange={e => setOwnerDraft(d => ({ ...d, [field]: e.target.value }))}
                                            className="w-full rounded-lg px-3 py-2 text-sm outline-none"
                                            style={{ background: C.surface, border: `1px solid ${C.border}`, color: C.text }}
                                        />
                                    ))}
                                    <div className="flex gap-2 mt-1">
                                        <button
                                            onClick={() => {
                                                const updated = [...owners];
                                                updated[i] = ownerDraft;
                                                setOwners(updated);
                                                setEditingOwner(null);
                                            }}
                                            className="flex-1 rounded-full py-2 text-xs font-semibold"
                                            style={{ background: C.gold, color: "#1C1714" }}
                                        >
                                            Save
                                        </button>
                                        <button
                                            onClick={() => setEditingOwner(null)}
                                            className="rounded-full px-4 py-2 text-xs"
                                            style={{ background: C.surface, color: C.muted }}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div>
                                    <div className="flex items-start justify-between mb-2">
                                        <div>
                                            <div className="font-semibold text-sm" style={{ color: C.text }}>{owner.name}</div>
                                            <div className="text-xs mt-0.5" style={{ color: C.muted }}>{owner.role}</div>
                                        </div>
                                        <button
                                            onClick={() => { setOwnerDraft({ ...owner }); setEditingOwner(i); }}
                                            className="text-xs rounded-full px-3 py-1"
                                            style={{ background: C.goldFaint, color: C.gold }}
                                        >
                                            Edit
                                        </button>
                                    </div>
                                    <div className="flex items-center gap-2 mb-3">
                                        <Phone size={12} style={{ color: C.muted }} />
                                        <span className="text-xs" style={{ color: C.muted }}>{owner.phone}</span>
                                    </div>
                                    <button
                                        onClick={() => openWhatsApp(owner.phone, newBookingOwnerMsg(owner))}
                                        className="w-full flex items-center justify-center gap-1.5 rounded-full py-2 text-xs font-semibold"
                                        style={{ background: C.goldFaint, color: C.gold, border: `1px solid ${C.goldBorder}` }}
                                    >
                                        <MessageSquare size={11} /> Test Notification
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Main tabs */}
            <div className="flex gap-2 mb-6 flex-wrap">
                {([
                    { id: "client", icon: Users, label: "Client Messages" },
                    { id: "owners", icon: Bell, label: "Owner Alerts" },
                    { id: "campaigns", icon: Zap, label: "Campaigns" },
                ] as const).map(({ id, icon: Icon, label }) => (
                    <button
                        key={id}
                        onClick={() => setTab(id)}
                        className="flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium transition-all"
                        style={{
                            background: tab === id ? C.gold : C.surface,
                            color: tab === id ? "#1C1714" : C.muted,
                            border: `1px solid ${tab === id ? C.gold : C.border}`,
                        }}
                    >
                        <Icon size={14} /> {label}
                    </button>
                ))}
            </div>

            {/* â”€â”€ CLIENT MESSAGES TAB â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
            {tab === "client" && (
                <div>
                    {/* Client selector */}
                    <div className="rounded-2xl p-5 mb-6" style={{ background: C.surface, border: `1px solid ${C.border}` }}>
                        <div className="text-xs uppercase tracking-widest mb-3" style={{ color: C.gold }}>
                            Select Client
                        </div>
                        <div className="flex flex-col gap-2 max-h-52 overflow-y-auto">
                            <button
                                onClick={() => setSelectedClient(null)}
                                className="flex items-center gap-3 rounded-xl px-4 py-3 text-left transition-all"
                                style={{
                                    background: !selectedClient ? C.goldFaint : C.elevated,
                                    border: `1px solid ${!selectedClient ? C.goldBorder : C.border}`,
                                }}
                            >
                                <div className="text-sm" style={{ color: !selectedClient ? C.gold : C.muted }}>
                                    â€” No client selected (shows template preview)
                                </div>
                            </button>
                            {mockClients.map(client => (
                                <button
                                    key={client.id}
                                    onClick={() => setSelectedClient(client)}
                                    className="flex items-center gap-3 rounded-xl px-4 py-3 text-left transition-all"
                                    style={{
                                        background: selectedClient?.id === client.id ? C.goldFaint : C.elevated,
                                        border: `1px solid ${selectedClient?.id === client.id ? C.goldBorder : C.border}`,
                                    }}
                                >
                                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-xs font-bold"
                                        style={{ background: C.goldFaint, color: C.gold }}>
                                        {client.name.split(" ").map(n => n[0]).join("")}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="text-sm font-medium" style={{ color: C.text }}>{client.name}</div>
                                        <div className="text-xs" style={{ color: C.muted }}>{client.service} Â· {client.date} {client.time !== "â€”" ? `at ${client.time}` : ""}</div>
                                    </div>
                                    {client.atRisk && (
                                        <span className="text-xs shrink-0" style={{ color: C.danger }}>âš ï¸ At Risk</span>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Category filter */}
                    <div className="flex gap-2 mb-5 flex-wrap">
                        {catTabs.map(({ id, label }) => (
                            <button
                                key={id}
                                onClick={() => setTemplateCat(id)}
                                className="rounded-full px-3 py-1.5 text-xs font-medium transition-all"
                                style={{
                                    background: templateCat === id ? C.gold : C.surface,
                                    color: templateCat === id ? "#1C1714" : C.muted,
                                    border: `1px solid ${templateCat === id ? C.gold : C.border}`,
                                }}
                            >
                                {label}
                            </button>
                        ))}
                    </div>

                    {/* Template grid */}
                    <div className="grid sm:grid-cols-2 gap-3">
                        {filteredTemplates.map(template => (
                            <TemplateCard
                                key={template.id}
                                template={template}
                                client={selectedClient}
                                onSend={(msg, phone) => openWhatsApp(phone, msg)}
                            />
                        ))}
                    </div>
                </div>
            )}

            {/* â”€â”€ OWNER ALERTS TAB â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
            {tab === "owners" && (
                <div>
                    <div
                        className="flex items-start gap-3 rounded-2xl p-4 mb-6"
                        style={{ background: C.goldFaint, border: `1px solid ${C.goldBorder}` }}
                    >
                        <Bell size={16} style={{ color: C.gold, marginTop: "2px" }} />
                        <div className="text-sm leading-relaxed" style={{ color: C.muted }}>
                            These templates are pre-filled with booking details and sent to both owners
                            when a new booking arrives. Update owner phone numbers in the settings panel above.
                        </div>
                    </div>

                    <div className="flex flex-col gap-4">
                        {[
                            {
                                id: "new-booking", title: "New Booking Alert", icon: Bell, color: C.success,
                                desc: "Sent to both owners when a client books online",
                                msg: `ðŸ”” *New Mwezu Hair Booking!*\n\nðŸ‘¤ *Client:* [Client Name]\nðŸ“± *Phone:* [Phone]\nâœ‚ï¸ *Service:* [Service]\nðŸ“… *Date:* [Date]\nâ° *Time:* [Time]\n\nPlease check the admin dashboard for full details.`,
                            },
                            {
                                id: "cancellation", title: "Cancellation Alert", icon: AlertTriangle, color: C.danger,
                                desc: "Sent to both owners when a client cancels",
                                msg: `âš ï¸ *Booking Cancelled*\n\nðŸ‘¤ [Client Name] has cancelled their appointment\nâœ‚ï¸ [Service]\nðŸ“… [Date]\nâ° [Time]\n\nThe slot is now available.`,
                            },
                            {
                                id: "new-client", title: "New Client Alert", icon: Users, color: "#9B7FE8",
                                desc: "Sent when a first-time client books",
                                msg: `ðŸŒŸ *New Client Alert!*\n\n[Client Name] has just booked their *first-ever* Mwezu Hair appointment!\n\nâœ‚ï¸ [Service]\nðŸ“… [Date]\nâ° [Time]\nðŸ“± [Phone]\n\nLet's make a great first impression! ðŸ’›`,
                            },
                            {
                                id: "at-risk", title: "At-Risk Client Booked!", icon: Heart, color: C.warning,
                                desc: "Sent when a win-back client returns",
                                msg: `ðŸŽ‰ *Win-Back Success!*\n\nA client we haven't seen in a while just booked!\n\nðŸ‘¤ [Client Name]\nâœ‚ï¸ [Service]\nðŸ“… [Date]\nâ° [Time]\n\nGreat news for the salon! ðŸ’›`,
                            },
                        ].map(({ id, title, icon: Icon, color, desc, msg }) => (
                            <div key={id} className="rounded-2xl p-5" style={{ background: C.surface, border: `1px solid ${C.border}` }}>
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="flex h-9 w-9 items-center justify-center rounded-xl"
                                        style={{ background: `${color}15` }}>
                                        <Icon size={16} style={{ color }} />
                                    </div>
                                    <div>
                                        <div className="font-semibold text-sm" style={{ color: C.text }}>{title}</div>
                                        <div className="text-xs" style={{ color: C.muted }}>{desc}</div>
                                    </div>
                                </div>

                                <div className="rounded-xl p-3 mb-4 text-xs leading-relaxed whitespace-pre-line"
                                    style={{ background: C.elevated, color: C.muted, border: `1px solid ${C.border}` }}>
                                    {msg}
                                </div>

                                <div className="flex gap-2">
                                    <button
                                        onClick={() => copy(msg, id)}
                                        className="flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-medium flex-1 justify-center"
                                        style={{ background: C.elevated, color: copied === id ? C.success : C.muted, border: `1px solid ${C.border}` }}
                                    >
                                        {copied === id ? <Check size={12} /> : <Copy size={12} />}
                                        {copied === id ? "Copied!" : "Copy Template"}
                                    </button>
                                    {owners.map((owner, i) => (
                                        <button
                                            key={i}
                                            onClick={() => openWhatsApp(owner.phone, msg.replace("[Client Name]", "Test Client").replace("[Service]", "Knotless Braids").replace("[Date]", "Today").replace("[Time]", "10:00 AM").replace("[Phone]", owner.phone))}
                                            className="flex items-center gap-1.5 rounded-full px-3 py-2 text-xs font-semibold"
                                            style={{ background: C.goldFaint, color: C.gold, border: `1px solid ${C.goldBorder}` }}
                                        >
                                            <Send size={11} /> {owner.name.split(" ")[0]}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* â”€â”€ CAMPAIGNS TAB â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
            {tab === "campaigns" && (
                <div>
                    <div
                        className="flex items-start gap-3 rounded-2xl p-4 mb-6"
                        style={{ background: C.warningFaint, border: `1px solid ${C.warning}30` }}
                    >
                        <Zap size={16} style={{ color: C.warning, marginTop: "2px" }} />
                        <div className="text-sm leading-relaxed" style={{ color: C.muted }}>
                            Send targeted WhatsApp messages to specific client segments.
                            Each button opens WhatsApp with the message ready â€” no extra steps.
                        </div>
                    </div>

                    <div className="flex flex-col gap-5">
                        {campaignTemplates.map(campaign => {
                            const Icon = campaign.icon;
                            const targetClients = campaign.target === "at-risk"
                                ? mockClients.filter(c => c.atRisk)
                                : campaign.target === "new"
                                    ? mockClients.filter(c => c.service && !c.atRisk).slice(0, 2)
                                    : mockClients.filter(c => (c.points ?? 0) > 400 && (c.points ?? 0) < 600);

                            return (
                                <div key={campaign.id} className="rounded-2xl p-5"
                                    style={{ background: C.surface, border: `1px solid ${C.border}` }}>
                                    <div className="flex items-start gap-3 mb-4">
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                                            style={{ background: `${campaign.color}15` }}>
                                            <Icon size={18} style={{ color: campaign.color }} />
                                        </div>
                                        <div className="flex-1">
                                            <div className="font-display font-bold text-base" style={{ color: C.text }}>{campaign.title}</div>
                                            <div className="text-sm mt-0.5" style={{ color: C.muted }}>{campaign.description}</div>
                                        </div>
                                        <div
                                            className="rounded-full px-3 py-1 text-xs font-bold shrink-0"
                                            style={{ background: `${campaign.color}15`, color: campaign.color }}
                                        >
                                            {targetClients.length} client{targetClients.length !== 1 ? "s" : ""}
                                        </div>
                                    </div>

                                    {/* Message preview */}
                                    <div className="rounded-xl p-3 mb-4 text-xs leading-relaxed whitespace-pre-line"
                                        style={{ background: C.elevated, color: C.muted, border: `1px solid ${C.border}` }}>
                                        {campaign.body("[Name]").slice(0, 150)}...
                                    </div>

                                    {/* Target clients */}
                                    {targetClients.length > 0 && (
                                        <div className="flex flex-col gap-2 mb-4">
                                            <div className="text-xs uppercase tracking-widest" style={{ color: C.gold }}>Target Clients</div>
                                            {targetClients.map(client => (
                                                <div key={client.id} className="flex items-center justify-between rounded-xl px-4 py-3"
                                                    style={{ background: C.elevated, border: `1px solid ${C.border}` }}>
                                                    <div>
                                                        <div className="text-sm font-medium" style={{ color: C.text }}>{client.name}</div>
                                                        <div className="text-xs" style={{ color: C.muted }}>{client.phone}</div>
                                                    </div>
                                                    <button
                                                        onClick={() => openWhatsApp(client.phone, campaign.body(client.name))}
                                                        className="flex items-center gap-1.5 rounded-full px-3 py-2 text-xs font-semibold transition-all"
                                                        style={{ background: C.goldFaint, color: C.gold, border: `1px solid ${C.goldBorder}` }}
                                                    >
                                                        <MessageSquare size={11} /> Send
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {targetClients.length === 0 && (
                                        <div className="text-sm text-center py-4" style={{ color: C.muted }}>
                                            No clients match this campaign right now ðŸŽ‰
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}


