"use client";

import { useEffect, useState, type FormEvent } from "react";
import { formatMoney } from "@/lib/format";
import type { OrderStatus } from "@/lib/types";

type Product = { id: string; name: string; description: string; category: string; image: string; stock: number; price: number };
type Order = { id: string; customer: { name: string; email: string; phone?: string; address: string; city: string; postalCode: string }; items: { productId: string; name: string; quantity: number }[]; total: number; createdAt: string; status: OrderStatus };
type ProductForm = { name: string; description: string; category: string; image: string; price: string; stock: string };

const orderStatuses: { value: OrderStatus; label: string }[] = [
  { value: "confirmed", label: "Confirmed" },
  { value: "preparing", label: "Preparing" },
  { value: "ready", label: "Ready for customer" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

const statusStyles: Record<OrderStatus, string> = {
  confirmed: "border-blue-200 bg-blue-50 text-blue-700",
  preparing: "border-amber-200 bg-amber-50 text-amber-700",
  ready: "border-cyan-200 bg-cyan-50 text-cyan-700",
  completed: "border-emerald-200 bg-emerald-50 text-emerald-700",
  cancelled: "border-red-200 bg-red-50 text-red-700",
};

const statusEdges: Record<OrderStatus, string> = {
  confirmed: "border-l-blue-400",
  preparing: "border-l-amber-400",
  ready: "border-l-cyan-400",
  completed: "border-l-emerald-400",
  cancelled: "border-l-red-400",
};

const emptyForm: ProductForm = { name: "", description: "", category: "", image: "", price: "", stock: "" };

function useAdminData() {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  async function loadData() {
    try {
      const [productResponse, orderResponse] = await Promise.all([fetch("/api/products"), fetch("/api/orders")]);
      const productData = (await productResponse.json()) as { products?: Product[] };
      const orderData = (await orderResponse.json()) as { orders?: Order[] };
      setProducts(Array.isArray(productData.products) ? productData.products : []);
      setOrders(Array.isArray(orderData.orders) ? orderData.orders : []);
    } catch {
      setProducts([]);
      setOrders([]);
    }
  }

  useEffect(() => {
    let active = true;
    void Promise.all([fetch("/api/products"), fetch("/api/orders")])
      .then(async ([productResponse, orderResponse]) => {
        const productData = (await productResponse.json()) as { products?: Product[] };
        const orderData = (await orderResponse.json()) as { orders?: Order[] };
        if (!active) return;
        setProducts(Array.isArray(productData.products) ? productData.products : []);
        setOrders(Array.isArray(orderData.orders) ? orderData.orders : []);
      })
      .catch(() => {
        if (!active) return;
        setProducts([]);
        setOrders([]);
      });
    return () => { active = false; };
  }, []);

  return { products, orders, loadData };
}

function PageHeading({ title, description }: { title: string; description: string }) {
  return (
    <header className="flex flex-col gap-1 border-b border-[var(--line)] pb-5">
      <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted)]">Store management</p>
      <h1 className="text-3xl font-semibold tracking-tight text-[var(--ink)]">{title}</h1>
      <p className="text-sm text-[var(--muted)]">{description}</p>
    </header>
  );
}

export function AdminOverview() {
  const { products, orders } = useAdminData();
  const revenue = orders.reduce((sum, order) => sum + order.total, 0);
  const lowStock = products.filter((product) => product.stock < 10).length;

  return (
    <div className="space-y-6">
      <PageHeading title="Overview" description="A quick view of your store activity." />
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {[
          ["Catalog items", products.length, "border-[var(--accent)]"],
          ["Orders", orders.length, "border-emerald-500"],
          ["Sales", formatMoney(revenue), "border-amber-500"],
          ["Needs attention", lowStock, "border-slate-400"],
        ].map(([label, value, border]) => (
          <div key={String(label)} className={`border-l-2 ${border} bg-white/70 px-4 py-3`}>
            <p className="text-xs text-[var(--muted)]">{label}</p>
            <p className="mt-1 text-2xl font-semibold text-[var(--ink)]">{value}</p>
          </div>
        ))}
      </div>
      <div className="border border-[var(--line)] bg-white/80 p-5">
        <h2 className="font-semibold text-[var(--ink)]">Getting started</h2>
        <p className="mt-2 text-sm text-[var(--muted)]">Add items to your catalog, then monitor orders from the separate sections in the admin menu.</p>
      </div>
    </div>
  );
}

export function AdminCatalog() {
  const { products } = useAdminData();
  return (
    <div className="space-y-6">
      <PageHeading title="Catalog" description="Manage food, clothing, electronics, and any other product type." />
      <div className="overflow-x-auto border border-[var(--line)] bg-white/80">
        <table className="w-full min-w-[520px] text-left text-sm">
          <thead className="bg-[var(--surface-soft)] text-xs text-[var(--muted)]"><tr><th className="px-4 py-3 font-medium">Item</th><th className="px-4 py-3 font-medium">Category</th><th className="px-4 py-3 font-medium">Price</th><th className="px-4 py-3 font-medium">Stock</th></tr></thead>
          <tbody className="divide-y divide-[var(--line)]">
            {products.length === 0 ? <tr><td colSpan={4} className="px-4 py-6 text-[var(--muted)]">No catalog items yet.</td></tr> : products.map((product) => (
              <tr key={product.id} className="hover:bg-[var(--surface-soft)]/50"><td className="px-4 py-3 font-medium text-[var(--ink)]">{product.name}</td><td className="px-4 py-3 text-[var(--muted)]">{product.category}</td><td className="px-4 py-3 text-[var(--ink)]">{formatMoney(product.price)}</td><td className={`px-4 py-3 ${product.stock < 10 ? "font-medium text-amber-600" : "text-[var(--muted)]"}`}>{product.stock}</td></tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function AdminOrders() {
  const { orders, loadData } = useAdminData();
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<"all" | OrderStatus>("all");
  const [printOrderId, setPrintOrderId] = useState<string | null>(null);
  const filteredOrders = statusFilter === "all" ? orders : orders.filter((order) => order.status === statusFilter);

  async function updateStatus(id: string, status: OrderStatus) {
    setUpdatingId(id);
    try {
      const response = await fetch(`/api/orders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!response.ok) throw new Error("Status update failed");
      await loadData();
    } finally {
      setUpdatingId(null);
    }
  }

  function printLabel(id: string) {
    setPrintOrderId(id);
    window.setTimeout(() => window.print(), 0);
  }

  const printOrder = orders.find((order) => order.id === printOrderId);

  return (
    <div className="space-y-6">
      <div className="print:hidden space-y-6">
        <PageHeading title="Orders" description="Prepare, complete, or cancel customer orders from one queue." />
        <div className="flex flex-wrap gap-2 rounded-2xl border border-[var(--line)] bg-white/75 p-2">
          <button type="button" onClick={() => setStatusFilter("all")} className={`rounded-xl px-3 py-2 text-xs font-semibold transition ${statusFilter === "all" ? "bg-[var(--ink)] text-white" : "text-[var(--muted)] hover:bg-[var(--surface-soft)]"}`}>All <span className="ml-1 opacity-70">{orders.length}</span></button>
          {orderStatuses.map((status) => {
            const count = orders.filter((order) => order.status === status.value).length;
            return <button key={status.value} type="button" onClick={() => setStatusFilter(status.value)} className={`rounded-xl border px-3 py-2 text-xs font-semibold transition ${statusStyles[status.value]} ${statusFilter === status.value ? "ring-2 ring-current ring-offset-1" : "opacity-75 hover:opacity-100"}`}>{status.label} <span className="ml-1 opacity-70">{count}</span></button>;
          })}
        </div>
        <div className="divide-y divide-[var(--line)] border border-[var(--line)] bg-white/80">
          {filteredOrders.length === 0 ? <p className="px-4 py-6 text-sm text-[var(--muted)]">{orders.length === 0 ? "No orders yet." : "No orders match this status."}</p> : filteredOrders.map((order) => (
            <div key={order.id} className={`flex flex-col gap-4 border-l-4 px-4 py-4 sm:flex-row sm:items-start sm:justify-between ${statusEdges[order.status]}`}><div className="min-w-0"><div className="flex flex-wrap items-center gap-x-3 gap-y-1"><p className="font-medium text-[var(--ink)]">{order.customer.name}</p><p className="font-mono text-[10px] text-[var(--muted)]">#{order.id.slice(0, 8)}</p><span className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${statusStyles[order.status]}`}>{orderStatuses.find((status) => status.value === order.status)?.label}</span></div><p className="mt-1 text-xs text-[var(--muted)]">{order.customer.phone ?? "No phone"}{order.customer.email ? ` · ${order.customer.email}` : " · No email"} · {new Date(order.createdAt).toLocaleDateString()}</p><p className="mt-3 text-sm text-[var(--ink)]">{order.items.map((item) => `${item.name} x${item.quantity}`).join(" · ")}</p><p className="mt-1 text-xs text-[var(--muted)]">Deliver to {order.customer.address}, {order.customer.city} {order.customer.postalCode}</p></div><div className="flex shrink-0 flex-wrap items-center gap-3 text-sm"><span className="font-semibold text-[var(--ink)]">{formatMoney(order.total)}</span><select aria-label={`Update order ${order.id} status`} value={order.status} disabled={updatingId === order.id} onChange={(event) => void updateStatus(order.id, event.target.value as OrderStatus)} className="rounded-lg border border-[var(--line)] bg-white px-3 py-2 text-xs font-medium text-[var(--ink)] outline-none focus:ring-4 focus:ring-[var(--accent)]/15 disabled:opacity-60">{orderStatuses.map((status) => <option key={status.value} value={status.value}>{status.label}</option>)}</select><button type="button" onClick={() => printLabel(order.id)} className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--line)] bg-white px-3 py-2 text-xs font-semibold text-[var(--ink)] transition hover:bg-[var(--surface-soft)]" aria-label={`Print packing label for order ${order.id}`}><svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 fill-none stroke-current stroke-2"><path strokeLinecap="round" strokeLinejoin="round" d="M6 9V3h12v6M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2M6 14h12v7H6z" /></svg>Print label</button></div></div>
          ))}
        </div>
      </div>
      {printOrder ? (
        <section className="packing-label hidden bg-white text-black print:block">
          <div className="packing-header">
            <div className="packing-brand">A<span>t</span>elier</div>
            <div className="packing-to"><p className="packing-kicker">TO:</p><div><p className="packing-recipient">{printOrder.customer.name}</p><p>{printOrder.customer.address}</p><p>{printOrder.customer.city}{printOrder.customer.postalCode ? `, ${printOrder.customer.postalCode}` : ""}</p></div></div>
          </div>
          <div className="packing-priority">PRIORITY PACKING</div>
          <div className="packing-from"><p className="packing-kicker">FROM:</p><div><p className="font-semibold">ATELIER SHOP</p><p>Customer order desk</p><p>{printOrder.customer.phone ?? "Phone not provided"}</p></div></div>
          <div className="packing-grid">
            <div className="packing-cell"><p className="packing-kicker">ORDER NR:</p><p className="packing-value">{printOrder.id.slice(0, 8).toUpperCase()}</p><div className="packing-barcode mt-3" /><p className="packing-code">{printOrder.id}</p></div>
            <div className="packing-cell"><p className="packing-kicker">SHIP DATE:</p><p className="packing-value">{new Date(printOrder.createdAt).toLocaleDateString()}</p><p className="packing-kicker mt-6">STATUS:</p><p className="packing-value">{orderStatuses.find((status) => status.value === printOrder.status)?.label}</p></div>
            <div className="packing-cell packing-items"><p className="packing-kicker">ITEMS TO PACK:</p><ul className="mt-3 space-y-2">{printOrder.items.map((item) => <li key={item.productId} className="flex justify-between gap-4"><span>{item.name}</span><strong>x{item.quantity}</strong></li>)}</ul></div>
            <div className="packing-cell"><p className="packing-kicker">CONTACT PHONE:</p><p className="packing-value break-all">{printOrder.customer.phone ?? "Not provided"}</p><p className="packing-kicker mt-6">TOTAL:</p><p className="packing-value">{formatMoney(printOrder.total)}</p></div>
          </div>
          <div className="packing-footer"><div className="packing-handling"><span className="packing-symbol">↑↑</span><span>HANDLE WITH CARE</span></div><div className="packing-barcode packing-barcode-wide" /><p className="packing-thanks">Thank you for shopping with Atelier.</p></div>
        </section>
      ) : null}
    </div>
  );
}

export function AdminAddItem() {
  const { products, loadData } = useAdminData();
  const [form, setForm] = useState<ProductForm>(emptyForm);
  const [message, setMessage] = useState<{ type: "error" | "success"; text: string } | null>(null);
  const [pending, setPending] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  function editProduct(product: Product) {
    setEditingId(product.id);
    setForm({
      name: product.name,
      description: product.description,
      category: product.category,
      image: product.image,
      price: String(product.price),
      stock: String(product.stock),
    });
    setImageFile(null);
    setMessage(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function deleteProduct(product: Product) {
    if (!window.confirm(`Delete ${product.name}?`)) return;
    setPending(true);
    setMessage(null);
    try {
      const response = await fetch(`/api/products/${product.id}`, { method: "DELETE" });
      const data = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(data.error ?? "Delete failed.");
      if (editingId === product.id) {
        setEditingId(null);
        setForm(emptyForm);
        setImageFile(null);
      }
      setMessage({ type: "success", text: `${product.name} deleted.` });
      await loadData();
    } catch (error) {
      setMessage({ type: "error", text: error instanceof Error ? error.message : "Delete failed." });
    } finally {
      setPending(false);
    }
  }

  async function submit(event: FormEvent) {
    event.preventDefault(); setMessage(null); setPending(true);
    try {
      let image = form.image;
      if (imageFile) {
        const uploadData = new FormData();
        uploadData.append("file", imageFile);
        const uploadResponse = await fetch("/api/uploads", { method: "POST", body: uploadData });
        const uploadResult = (await uploadResponse.json()) as { error?: string; url?: string };
        if (!uploadResponse.ok || !uploadResult.url) throw new Error(uploadResult.error ?? "Image upload failed.");
        image = uploadResult.url;
      }

      const response = await fetch(editingId ? `/api/products/${editingId}` : "/api/products", {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, image, price: Number(form.price), stock: Number(form.stock) }),
      });
      const data = (await response.json()) as { error?: string; product?: { name: string } };
      if (!response.ok || !data.product) throw new Error(data.error ?? "Product upload failed.");
      setMessage({ type: "success", text: `${data.product.name} ${editingId ? "updated" : "added"} successfully.` });
      setEditingId(null); setForm(emptyForm); setImageFile(null); await loadData();
    } catch (error) { setMessage({ type: "error", text: error instanceof Error ? error.message : "Upload failed." }); }
    finally { setPending(false); }
  }

  const inputClass = "mt-1.5 w-full rounded-lg border border-[var(--line)] bg-white px-3 py-2.5 text-[var(--ink)] outline-none ring-[var(--accent)]/20 focus:ring-4";
  return (
    <div className="space-y-6">
      <PageHeading title="Items" description="Create, update, or remove products from your catalog." />
      <form onSubmit={submit} className="grid gap-4 border border-[var(--line)] bg-white/80 p-5 lg:grid-cols-2">
        <div className="lg:col-span-2 flex items-center justify-between border-b border-[var(--line)] pb-3"><h2 className="font-semibold text-[var(--ink)]">{editingId ? "Edit item" : "Create item"}</h2>{editingId ? <button type="button" onClick={() => { setEditingId(null); setForm(emptyForm); setImageFile(null); }} className="text-sm text-[var(--muted)] hover:text-[var(--ink)]">Cancel edit</button> : null}</div>
        <label className="text-sm"><span className="text-[var(--muted)]">Name</span><input required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} className={inputClass} /></label>
        <label className="text-sm"><span className="text-[var(--muted)]">Category</span><input required placeholder="Food, clothing, electronics..." value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })} className={inputClass} /></label>
        <label className="text-sm lg:col-span-2"><span className="text-[var(--muted)]">Description</span><textarea required rows={4} value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} className={inputClass} /></label>
        <label className="text-sm"><span className="text-[var(--muted)]">Price</span><input required type="number" min="1" value={form.price} onChange={(event) => setForm({ ...form, price: event.target.value })} className={inputClass} /></label>
        <label className="text-sm"><span className="text-[var(--muted)]">Stock</span><input required type="number" min="0" value={form.stock} onChange={(event) => setForm({ ...form, stock: event.target.value })} className={inputClass} /></label>
        <label className="text-sm lg:col-span-2"><span className="text-[var(--muted)]">Upload photo</span><input type="file" accept="image/png,image/jpeg,image/webp,image/gif" onChange={(event) => setImageFile(event.target.files?.[0] ?? null)} className={`${inputClass} file:mr-3 file:rounded-md file:border-0 file:bg-[var(--surface-soft)] file:px-3 file:py-1.5 file:text-xs file:font-medium`} /><span className="mt-1 block text-xs text-[var(--muted)]">JPG, PNG, WEBP, or GIF up to 5 MB.</span></label>
        <label className="text-sm lg:col-span-2"><span className="text-[var(--muted)]">Or use image URL</span><input required={!imageFile} type="url" value={form.image} onChange={(event) => setForm({ ...form, image: event.target.value })} className={inputClass} /></label>
        {message ? <p className={`lg:col-span-2 rounded-lg px-3 py-2 text-sm ${message.type === "error" ? "border border-red-200 bg-red-50 text-red-700" : "border border-emerald-200 bg-emerald-50 text-emerald-700"}`}>{message.text}</p> : null}
        <button type="submit" disabled={pending} className="w-fit rounded-lg bg-[var(--accent)] px-5 py-2.5 text-sm font-medium text-white hover:bg-[var(--accent-hover)] disabled:opacity-60">{pending ? "Saving..." : editingId ? "Update item" : "Create item"}</button>
      </form>

      <section className="border border-[var(--line)] bg-white/80">
        <div className="border-b border-[var(--line)] px-4 py-3"><h2 className="font-semibold text-[var(--ink)]">Items list</h2><p className="text-xs text-[var(--muted)]">{products.length} catalog items</p></div>
        <div className="divide-y divide-[var(--line)]">
          {products.length === 0 ? <p className="px-4 py-6 text-sm text-[var(--muted)]">No items yet.</p> : products.map((product) => (
            <div key={product.id} className="flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
              <div><p className="font-medium text-[var(--ink)]">{product.name}</p><p className="text-xs text-[var(--muted)]">{product.category} · {formatMoney(product.price)} · {product.stock} in stock</p></div>
              <div className="flex gap-2"><button type="button" onClick={() => editProduct(product)} className="rounded-lg border border-[var(--line)] px-3 py-1.5 text-xs font-medium text-[var(--ink)] hover:bg-[var(--surface-soft)]">Edit</button><button type="button" disabled={pending} onClick={() => void deleteProduct(product)} className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-50 disabled:opacity-50">Delete</button></div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
