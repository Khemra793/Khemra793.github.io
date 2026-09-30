import Link from "next/link";
import { notFound } from "next/navigation";
import { formatMoney } from "@/lib/format";
import { getOrder } from "@/lib/orders";
import type { OrderStatus } from "@/lib/types";

const fulfillmentSteps: { status: OrderStatus; label: string; description: string }[] = [
  { status: "confirmed", label: "Order received", description: "Your details are safely recorded." },
  { status: "preparing", label: "Preparing your parcel", description: "Your items are being prepared." },
  { status: "ready", label: "Ready for customer", description: "Your order is ready for collection or delivery." },
  { status: "completed", label: "Completed", description: "This order has been completed." },
];

export default async function OrderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = getOrder(id);
  if (!order) notFound();
  const currentStep = fulfillmentSteps.findIndex((step) => step.status === order.status);
  const activeStep = currentStep === -1 ? 0 : currentStep;
  const statusLabel = order.status === "cancelled" ? "Cancelled" : fulfillmentSteps[activeStep].label;

  return (
    <div className="mx-auto max-w-5xl space-y-7 pb-8">
      <section className="soft-grid reveal-up relative overflow-hidden rounded-[2rem] border border-[var(--line)] bg-white/75 p-6 sm:p-9">
        <div className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full bg-cyan-300/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 left-1/3 h-52 w-52 rounded-full bg-[var(--accent)]/10 blur-3xl" />
        <div className="relative flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700 ring-8 ring-emerald-50">
              <svg viewBox="0 0 24 24" aria-hidden="true" className="h-6 w-6 fill-none stroke-current stroke-2">
                <path strokeLinecap="round" strokeLinejoin="round" d="m5 12 4 4L19 6" />
              </svg>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-[var(--muted)]">Order confirmed</p>
              <h1 className="mt-2 font-serif text-4xl leading-tight text-[var(--accent-strong)] sm:text-5xl">
                Thanks, {order.customer.name}.
              </h1>
              <p className="mt-3 max-w-xl text-[var(--muted)]">
                {order.status === "cancelled" ? "This order has been cancelled." : `${statusLabel}. We do not process live payments in this demo.`}
              </p>
            </div>
          </div>
          <span className="w-fit rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-emerald-700">
            Confirmed
          </span>
        </div>
        <div className="relative mt-7 flex flex-col gap-1 border-t border-[var(--line)] pt-4 text-xs text-[var(--muted)] sm:flex-row sm:items-center sm:justify-between">
          <span>Order reference</span>
          <span className="font-mono text-[var(--ink)]">{order.id}</span>
        </div>
      </section>

      <div className="grid gap-7 lg:grid-cols-[1.35fr_0.65fr]">
        <div className="space-y-7">
          <section className="glass reveal-up reveal-delay-1 rounded-3xl p-5 sm:p-7">
            <div className="flex items-end justify-between gap-4 border-b border-[var(--line)] pb-4">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted)]">Your selection</p>
                <h2 className="mt-1 text-xl font-semibold text-[var(--ink)]">Order summary</h2>
              </div>
              <span className="text-sm text-[var(--muted)]">{order.items.length} item{order.items.length === 1 ? "" : "s"}</span>
            </div>
            <ul className="divide-y divide-[var(--line)]">
              {order.items.map((item) => (
                <li key={item.productId} className="flex items-center justify-between gap-4 py-4 text-sm">
                  <div>
                    <p className="font-medium text-[var(--ink)]">{item.name}</p>
                    <p className="mt-1 text-xs text-[var(--muted)]">Quantity {item.quantity}</p>
                  </div>
                  <span className="shrink-0 font-medium text-[var(--ink)]">{formatMoney(item.price * item.quantity)}</span>
                </li>
              ))}
            </ul>
            <div className="mt-2 flex justify-between border-t border-[var(--line)] pt-4 text-base font-semibold text-[var(--ink)]">
              <span>Total</span>
              <span>{formatMoney(order.total)}</span>
            </div>
          </section>

          <section className="reveal-up reveal-delay-2 relative overflow-hidden rounded-3xl border border-[var(--accent)]/20 bg-[var(--accent-strong)] p-5 text-white sm:p-7">
            <div className="pointer-events-none absolute -right-10 -top-16 h-44 w-44 rounded-full border-[20px] border-white/5" />
            <div className="relative flex gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-cyan-200 ring-1 ring-white/15">
                <svg viewBox="0 0 24 24" aria-hidden="true" className="h-6 w-6 fill-none stroke-current stroke-2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 21s7-5.4 7-12a7 7 0 1 0-14 0c0 6.6 7 12 7 12Z" />
                  <circle cx="12" cy="9" r="2.25" />
                </svg>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-cyan-200">Delivery location</p>
                <h2 className="mt-1 text-xl font-semibold">Shipping to you</h2>
                <p className="mt-3 max-w-md text-sm leading-6 text-blue-100">
                  {order.customer.address}, {order.customer.city} {order.customer.postalCode}
                </p>
                <p className="mt-2 text-xs text-blue-200">
                  Phone: {order.customer.phone ?? "Not provided"}
                  {order.customer.email ? ` · ${order.customer.email}` : ""}
                </p>
              </div>
            </div>
            <div className="relative mt-6 grid grid-cols-2 gap-4 border-t border-white/15 pt-4 text-sm">
              <div><p className="text-xs text-blue-200">Dispatch</p><p className="mt-1 font-medium">Within 24 hours</p></div>
              <div><p className="text-xs text-blue-200">Returns</p><p className="mt-1 font-medium">30 days</p></div>
            </div>
          </section>
        </div>

        <aside className="reveal-up reveal-delay-1 h-fit rounded-3xl border border-[var(--line)] bg-white/80 p-5 sm:p-6">
          <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted)]">Next steps</p>
          <div className="mt-5 space-y-5">
            {fulfillmentSteps.map((step, index) => {
              const complete = index <= activeStep && order.status !== "cancelled";
              return <div key={step.status} className="flex gap-3"><span className={`mt-1 h-2.5 w-2.5 rounded-full ring-4 ${complete ? "bg-emerald-500 ring-emerald-100" : "bg-slate-200 ring-slate-100"}`} /><div><p className={`text-sm font-semibold ${complete ? "text-[var(--ink)]" : "text-[var(--muted)]"}`}>{step.label}</p><p className="mt-1 text-xs leading-5 text-[var(--muted)]">{step.description}</p></div></div>;
            })}
            {order.status === "cancelled" ? <div className="flex gap-3"><span className="mt-1 h-2.5 w-2.5 rounded-full bg-red-500 ring-4 ring-red-100" /><div><p className="text-sm font-semibold text-red-700">Cancelled</p><p className="mt-1 text-xs leading-5 text-[var(--muted)]">Please contact support if you need help.</p></div></div> : null}
          </div>
          <Link href="/products" className="mt-7 inline-flex w-full items-center justify-center rounded-xl bg-[var(--accent)] px-5 py-3 text-sm font-medium text-white transition hover:bg-[var(--accent-hover)]">
            Keep shopping
          </Link>
        </aside>
      </div>
    </div>
  );
}
