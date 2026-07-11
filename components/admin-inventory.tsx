"use client";

import { useState } from "react";
import {
    Package, AlertTriangle, TrendingDown, Plus,
    Minus, Search, MessageSquare, CheckCircle2, X,
} from "lucide-react";

const C = {
    surface: "#251D19", elevated: "#2E2520",
    gold: "#C9A84C", goldFaint: "rgba(201,168,76,0.1)", goldBorder: "rgba(201,168,76,0.25)",
    text: "#FAF6EE", muted: "#9B896E", border: "rgba(255,255,255,0.07)",
    success: "#4CAF7D", successFaint: "rgba(76,175,125,0.1)",
    danger: "#E05C5C", dangerFaint: "rgba(224,92,92,0.1)",
    warning: "#E09B4C", warningFaint: "rgba(224,155,76,0.1)",
};

type Product = {
    id: string; name: string; category: string;
    stock: number; reorderAt: number; unit: string;
    unitCost: number; lastRestocked: string; supplier: string;
};

const categories = ["All", "Braiding Hair", "Extensions", "Hair Products", "Tools & Accessories"];

const initialProducts: Product[] = [
    { id: "p1", name: "Knotless Braiding Hair (Black)", category: "Braiding Hair", stock: 18, reorderAt: 6, unit: "packs", unitCost: 45, lastRestocked: "1 Jul", supplier: "Northmead Market" },
    { id: "p2", name: "Knotless Braiding Hair (Brown Mix)", category: "Braiding Hair", stock: 4, reorderAt: 6, unit: "packs", unitCost: 45, lastRestocked: "15 Jun", supplier: "Northmead Market" },
    { id: "p3", name: "Braiding Thread", category: "Braiding Hair", stock: 2, reorderAt: 4, unit: "packs", unitCost: 20, lastRestocked: "1 Jun", supplier: "Northmead Market" },
    { id: "p4", name: "Expression Braiding Hair", category: "Braiding Hair", stock: 10, reorderAt: 5, unit: "packs", unitCost: 35, lastRestocked: "2 Jul", supplier: "Cairo Road Supplier" },
    { id: "p5", name: "Brazilian Straight Hair (20–24 inch)", category: "Extensions", stock: 6, reorderAt: 3, unit: "bundles", unitCost: 180, lastRestocked: "28 Jun", supplier: "Online Supplier" },
    { id: "p6", name: "Deep Wave Hair Extensions", category: "Extensions", stock: 1, reorderAt: 3, unit: "bundles", unitCost: 200, lastRestocked: "10 Jun", supplier: "Online Supplier" },
    { id: "p7", name: "Goddess Curl Hair", category: "Extensions", stock: 3, reorderAt: 4, unit: "packs", unitCost: 120, lastRestocked: "20 Jun", supplier: "Northmead Market" },
    { id: "p8", name: "Remy Hair Extensions", category: "Extensions", stock: 2, reorderAt: 3, unit: "bundles", unitCost: 250, lastRestocked: "5 Jun", supplier: "Online Supplier" },
    { id: "p9", name: "Moisturising Shampoo", category: "Hair Products", stock: 5, reorderAt: 2, unit: "bottles", unitCost: 55, lastRestocked: "25 Jun", supplier: "Shoprite Lusaka" },
    { id: "p10", name: "Deep Conditioner", category: "Hair Products", stock: 3, reorderAt: 2, unit: "bottles", unitCost: 70, lastRestocked: "25 Jun", supplier: "Shoprite Lusaka" },
    { id: "p11", name: "Edge Control Gel", category: "Hair Products", stock: 6, reorderAt: 3, unit: "jars", unitCost: 45, lastRestocked: "1 Jul", supplier: "Shoprite Lusaka" },
    { id: "p12", name: "Hair & Scalp Oil", category: "Hair Products", stock: 4, reorderAt: 2, unit: "bottles", unitCost: 60, lastRestocked: "20 Jun", supplier: "Shoprite Lusaka" },
    { id: "p13", name: "Weave Cap / Wig Cap", category: "Tools & Accessories", stock: 15, reorderAt: 5, unit: "pcs", unitCost: 10, lastRestocked: "2 Jul", supplier: "Northmead Market" },
    { id: "p14", name: "Curved Sewing Needle + Thread", category: "Tools & Accessories", stock: 1, reorderAt: 3, unit: "sets", unitCost: 25, lastRestocked: "1 Jun", supplier: "Northmead Market" },
    { id: "p15", name: "Bobby Pins (assorted)", category: "Tools & Accessories", stock: 8, reorderAt: 3, unit: "packs", unitCost: 12, lastRestocked: "15 Jun", supplier: "Shoprite Lusaka" },
    { id: "p16", name: "Hair Glue (sew-in adhesive)", category: "Tools & Accessories", stock: 2, reorderAt: 3, unit: "tubes", unitCost: 35, lastRestocked: "10 Jun", supplier: "Northmead Market" },
];

function StockBar({ stock, reorderAt }: { stock: number; reorderAt: number }) {
    const max = Math.max(stock, reorderAt * 3);
    const pct = Math.min((stock / max) * 100, 100);
    const isLow = stock <= reorderAt;
    const isOut = stock === 0;
    const color = isOut ? C.danger : isLow ? C.warning : C.success;
    return (
        <div className="h-1.5 rounded-full overflow-hidden mt-1.5" style={{ background: C.elevated }}>
            <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: color }} />
        </div>
    );
}

export function AdminInventory() {
    const [products, setProducts] = useState<Product[]>(initialProducts);
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("All");
    const [showAdd, setShowAdd] = useState(false);
    const [newProduct, setNewProduct] = useState({
        name: "", category: "Braiding Hair", unit: "packs",
        stock: "", reorderAt: "", unitCost: "", supplier: "",
    });

    const lowStock = products.filter(p => p.stock <= p.reorderAt && p.stock > 0);
    const outOfStock = products.filter(p => p.stock === 0);
    const totalValue = products.reduce((s, p) => s + p.stock * p.unitCost, 0);

    const filtered = products.filter(p => {
        const matchCat = category === "All" || p.category === category;
        const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
            p.category.toLowerCase().includes(search.toLowerCase());
        return matchCat && matchSearch;
    });

    function adjustStock(id: string, delta: number) {
        setProducts(prev => prev.map(p =>
            p.id === id ? { ...p, stock: Math.max(0, p.stock + delta) } : p
        ));
    }

    function addProduct() {
        if (!newProduct.name || !newProduct.stock) return;
        const product: Product = {
            id: `p${Date.now()}`,
            name: newProduct.name,
            category: newProduct.category,
            unit: newProduct.unit,
            stock: parseInt(newProduct.stock) || 0,
            reorderAt: parseInt(newProduct.reorderAt) || 2,
            unitCost: parseInt(newProduct.unitCost) || 0,
            supplier: newProduct.supplier || "—",
            lastRestocked: "Today",
        };
        setProducts(prev => [...prev, product]);
        setNewProduct({ name: "", category: "Braiding Hair", unit: "packs", stock: "", reorderAt: "", unitCost: "", supplier: "" });
        setShowAdd(false);
    }

    function reorderWhatsApp(p: Product) {
        const msg = `🛒 *Stock Reorder Request — Mwezu Hair*\n\n📦 *Product:* ${p.name}\n🏷️ *Category:* ${p.category}\n📉 *Current Stock:* ${p.stock} ${p.unit}\n🔔 *Reorder Level:* ${p.reorderAt} ${p.unit}\n\nPlease reorder as soon as possible. Thank you!`;
        window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`);
    }

    return (
        <div>
            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-7">
                {[
                    { label: "Total Products", value: `${products.length}`, color: C.gold, icon: Package },
                    { label: "Low Stock", value: `${lowStock.length}`, color: C.warning, icon: TrendingDown },
                    { label: "Out of Stock", value: `${outOfStock.length}`, color: C.danger, icon: AlertTriangle },
                    { label: "Stock Value", value: `K${totalValue.toLocaleString()}`, color: C.success, icon: Package },
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

            {/* Low stock alerts */}
            {(lowStock.length > 0 || outOfStock.length > 0) && (
                <div
                    className="rounded-2xl p-5 mb-6"
                    style={{ background: C.dangerFaint, border: `1px solid ${C.danger}30` }}
                >
                    <div className="flex items-center gap-2 mb-3">
                        <AlertTriangle size={16} style={{ color: C.danger }} />
                        <h3 className="font-display font-bold text-sm" style={{ color: C.danger }}>
                            {outOfStock.length > 0 ? `${outOfStock.length} item(s) out of stock · ` : ""}
                            {lowStock.length} item(s) running low
                        </h3>
                    </div>
                    <div className="flex flex-col gap-2">
                        {[...outOfStock, ...lowStock].slice(0, 5).map(p => (
                            <div key={p.id} className="flex items-center justify-between gap-3">
                                <div>
                                    <span className="text-sm font-medium" style={{ color: C.text }}>{p.name}</span>
                                    <span className="text-xs ml-2" style={{ color: p.stock === 0 ? C.danger : C.warning }}>
                                        {p.stock === 0 ? "Out of stock" : `${p.stock} ${p.unit} left (reorder at ${p.reorderAt})`}
                                    </span>
                                </div>
                                <button
                                    onClick={() => reorderWhatsApp(p)}
                                    className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold shrink-0 transition-opacity hover:opacity-90"
                                    style={{ background: C.gold, color: "#1C1714" }}
                                >
                                    <MessageSquare size={11} /> Reorder
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Search + filter + add */}
            <div className="flex flex-col sm:flex-row gap-3 mb-5">
                <div className="relative flex-1">
                    <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: C.muted }} />
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="w-full rounded-xl py-3 pl-9 pr-4 text-sm outline-none"
                        style={{ background: C.surface, border: `1px solid ${C.border}`, color: C.text, caretColor: C.gold }}
                    />
                </div>
                <button
                    onClick={() => setShowAdd(!showAdd)}
                    className="flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition-opacity hover:opacity-90"
                    style={{ background: C.gold, color: "#1C1714" }}
                >
                    <Plus size={15} /> Add Product
                </button>
            </div>

            {/* Category tabs */}
            <div className="flex gap-2 mb-5 flex-wrap">
                {categories.map(cat => (
                    <button
                        key={cat}
                        onClick={() => setCategory(cat)}
                        className="rounded-full px-4 py-2 text-xs font-medium transition-all"
                        style={{
                            background: category === cat ? C.gold : C.surface,
                            color: category === cat ? "#1C1714" : C.muted,
                            border: `1px solid ${category === cat ? C.gold : C.border}`,
                        }}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Add product form */}
            {showAdd && (
                <div
                    className="rounded-2xl p-5 mb-5"
                    style={{ background: C.surface, border: `1px solid ${C.goldBorder}` }}
                >
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-display font-bold" style={{ color: C.text }}>Add New Product</h3>
                        <button onClick={() => setShowAdd(false)} style={{ color: C.muted }}><X size={18} /></button>
                    </div>
                    <div className="grid grid-cols-2 gap-3 mb-4">
                        {[
                            { label: "Product Name *", key: "name", placeholder: "e.g. Knotless Braiding Hair", type: "text" },
                            { label: "Supplier", key: "supplier", placeholder: "e.g. Northmead Market", type: "text" },
                            { label: "Current Stock *", key: "stock", placeholder: "e.g. 10", type: "number" },
                            { label: "Reorder At", key: "reorderAt", placeholder: "e.g. 3", type: "number" },
                            { label: "Unit Cost (K)", key: "unitCost", placeholder: "e.g. 45", type: "number" },
                        ].map(({ label, key, placeholder, type }) => (
                            <div key={key}>
                                <label className="block text-xs uppercase tracking-widest mb-1.5" style={{ color: C.gold }}>
                                    {label}
                                </label>
                                <input
                                    type={type}
                                    placeholder={placeholder}
                                    value={newProduct[key as keyof typeof newProduct]}
                                    onChange={e => setNewProduct(p => ({ ...p, [key]: e.target.value }))}
                                    className="w-full rounded-xl px-3 py-2.5 text-sm outline-none"
                                    style={{ background: C.elevated, border: `1px solid ${C.border}`, color: C.text, caretColor: C.gold }}
                                />
                            </div>
                        ))}
                        <div>
                            <label className="block text-xs uppercase tracking-widest mb-1.5" style={{ color: C.gold }}>
                                Category
                            </label>
                            <select
                                value={newProduct.category}
                                onChange={e => setNewProduct(p => ({ ...p, category: e.target.value }))}
                                className="w-full rounded-xl px-3 py-2.5 text-sm outline-none"
                                style={{ background: C.elevated, border: `1px solid ${C.border}`, color: C.text }}
                            >
                                {["Braiding Hair", "Extensions", "Hair Products", "Tools & Accessories"].map(c => (
                                    <option key={c} value={c}>{c}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <button
                        onClick={addProduct}
                        disabled={!newProduct.name || !newProduct.stock}
                        className="w-full rounded-full py-3 text-sm font-semibold transition-opacity"
                        style={{
                            background: newProduct.name && newProduct.stock ? C.gold : C.elevated,
                            color: newProduct.name && newProduct.stock ? "#1C1714" : C.muted,
                            opacity: newProduct.name && newProduct.stock ? 1 : 0.5,
                        }}
                    >
                        <Plus size={14} className="inline mr-1" /> Add to Inventory
                    </button>
                </div>
            )}

            {/* Product list */}
            <div className="flex flex-col gap-2">
                {filtered.map(product => {
                    const isLow = product.stock <= product.reorderAt && product.stock > 0;
                    const isOut = product.stock === 0;
                    const statusColor = isOut ? C.danger : isLow ? C.warning : C.success;

                    return (
                        <div
                            key={product.id}
                            className="rounded-2xl p-4"
                            style={{
                                background: C.surface,
                                border: `1px solid ${isOut ? `${C.danger}40` : isLow ? `${C.warning}30` : C.border}`,
                            }}
                        >
                            <div className="flex items-start justify-between gap-3">
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                                        <span className="font-semibold text-sm" style={{ color: C.text }}>{product.name}</span>
                                        {(isLow || isOut) && (
                                            <span
                                                className="rounded-full px-2 py-0.5 text-xs font-semibold"
                                                style={{ background: `${statusColor}15`, color: statusColor }}
                                            >
                                                {isOut ? "Out of Stock" : "Low Stock"}
                                            </span>
                                        )}
                                    </div>
                                    <div className="text-xs mb-2" style={{ color: C.muted }}>
                                        {product.category} · {product.supplier} · Restocked: {product.lastRestocked}
                                    </div>

                                    {/* Stock bar */}
                                    <StockBar stock={product.stock} reorderAt={product.reorderAt} />
                                    <div className="flex justify-between text-xs mt-1" style={{ color: C.muted }}>
                                        <span style={{ color: statusColor }}>{product.stock} {product.unit} remaining</span>
                                        <span>Reorder at {product.reorderAt}</span>
                                    </div>
                                </div>

                                <div className="flex flex-col items-end gap-2 shrink-0">
                                    <div className="text-sm font-bold" style={{ color: C.gold }}>
                                        K{product.unitCost}/{product.unit.replace(/s$/, "")}
                                    </div>
                                    {/* Stock adjust */}
                                    <div className="flex items-center gap-1">
                                        <button
                                            onClick={() => adjustStock(product.id, -1)}
                                            className="flex h-7 w-7 items-center justify-center rounded-lg transition-opacity hover:opacity-80"
                                            style={{ background: C.elevated, color: C.text }}
                                        >
                                            <Minus size={12} />
                                        </button>
                                        <span
                                            className="w-8 text-center text-sm font-bold"
                                            style={{ color: statusColor }}
                                        >
                                            {product.stock}
                                        </span>
                                        <button
                                            onClick={() => adjustStock(product.id, 1)}
                                            className="flex h-7 w-7 items-center justify-center rounded-lg transition-opacity hover:opacity-80"
                                            style={{ background: C.elevated, color: C.text }}
                                        >
                                            <Plus size={12} />
                                        </button>
                                    </div>
                                    {(isLow || isOut) && (
                                        <button
                                            onClick={() => reorderWhatsApp(product)}
                                            className="flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-semibold transition-opacity hover:opacity-90"
                                            style={{ background: C.goldFaint, color: C.gold, border: `1px solid ${C.goldBorder}` }}
                                        >
                                            <MessageSquare size={10} /> Reorder
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}

                {filtered.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                        <div className="text-4xl mb-3">📦</div>
                        <div className="font-display text-lg font-bold mb-1" style={{ color: C.text }}>No products found</div>
                        <div className="text-sm" style={{ color: C.muted }}>Try a different search or category.</div>
                    </div>
                )}
            </div>
        </div>
    );
}