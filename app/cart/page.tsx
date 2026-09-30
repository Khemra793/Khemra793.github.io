"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/components/cart-provider";
import { formatMoney } from "@/lib/format";

export default function CartPage() {
  const { lines, subtotal, setQuantity, remove, ready } = useCart();

  const totalItems = lines.reduce((sum, line) => sum + line.quantity, 0);

  function decrease(productId: string, quantity: number) {
    setQuantity(productId, quantity - 1);
  }

  function increase(productId: string, quantity: number, stock: number) {
    setQuantity(productId, Math.min(stock, quantity + 1));
  }

  if (!ready) {
    return (
      <div className="max-w-2xl space-y-4 rounded-[2rem] border border-[var(--line)] bg-white/80 p-8 shadow-[0_14px_36px_rgb(15_23_42_/_0.08)]">
        <h1 className="font-serif text-4xl text-[var(--accent-strong)]">Cart</h1>
        <p className="text-[var(--muted)]">Loading your bag…</p>
      </div>
    );
  }

  if (lines.length === 0) {
    return (
      <div className="soft-grid max-w-2xl overflow-hidden rounded-[2rem] border border-[var(--line)] bg-white/85 p-8 shadow-[0_20px_44px_rgb(15_23_42_/_0.08)] sm:p-10">
        <p className="text-xs uppercase tracking-[0.22em] text-[var(--muted)]">
          Shopping bag
        </p>
        <h1 className="mt-2 font-serif text-4xl text-[var(--accent-strong)] sm:text-5xl">
          Your cart is waiting.
        </h1>
        <p className="mt-3 max-w-xl text-[var(--muted)]">
          Nothing in the bag yet. Discover new arrivals and add your favorites.
        </p>
        <Link
          href="/products"
          className="mt-7 inline-flex rounded-full bg-[var(--accent)] px-6 py-3 text-sm font-medium text-white transition hover:-translate-y-0.5 hover:bg-[var(--accent-hover)]"
        >
          Continue shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-10 pb-8 lg:grid-cols-[1.25fr_0.75fr]">
      <div className="space-y-6">
        <div className="rounded-[1.8rem] border border-[var(--line)] bg-white/85 p-6 sm:p-7">
          <p className="text-xs uppercase tracking-[0.22em] text-[var(--muted)]">
            Shopping bag
          </p>
          <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
            <h1 className="font-serif text-4xl text-[var(--accent-strong)]">Cart</h1>
            <p className="rounded-full border border-[var(--line)] bg-[var(--surface-soft)] px-3 py-1 text-sm font-medium text-[var(--accent-strong)]">
              {totalItems} item{totalItems > 1 ? "s" : ""}
            </p>
          </div>
        </div>

        <ul className="space-y-4">
          {lines.map((line) => (
            <li
              key={line.productId}
              className="group rounded-3xl border border-[var(--line)] bg-white/85 p-4 shadow-[0_10px_28px_rgb(15_23_42_/_0.06)] transition hover:-translate-y-0.5 hover:shadow-[0_18px_38px_rgb(15_23_42_/_0.1)]"
            >
              <div className="flex gap-4">
                <div className="relative h-28 w-24 overflow-hidden rounded-2xl bg-[var(--surface)]">
                <Image
                  src={line.product.image}
                  alt={line.product.name}
                  fill
                  sizes="96px"
                  className="object-cover"
                />
                </div>
                <div className="flex flex-1 flex-col justify-between">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <Link
                        href={`/products/${line.product.id}`}
                        className="font-semibold text-[var(--ink)] transition group-hover:text-[var(--accent)]"
                      >
                        {line.product.name}
                      </Link>
                      <p className="mt-1 text-sm text-[var(--muted)]">
                        {formatMoney(line.product.price)} each
                      </p>
                    </div>
                    <p className="rounded-full bg-[var(--surface-soft)] px-3 py-1 text-sm font-semibold text-[var(--accent-strong)]">
                      {formatMoney(line.product.price * line.quantity)}
                    </p>
                  </div>

                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                    <div className="inline-flex items-center rounded-full border border-[var(--line)] bg-white">
                      <button
                        type="button"
                        onClick={() => decrease(line.productId, line.quantity)}
                        className="px-3 py-1.5 text-sm text-[var(--muted)] transition hover:text-[var(--ink)]"
                        aria-label={`Decrease quantity of ${line.product.name}`}
                      >
                        -
                      </button>
                      <span className="min-w-8 text-center text-sm font-medium">
                        {line.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          increase(
                            line.productId,
                            line.quantity,
                            line.product.stock,
                          )
                        }
                        className="px-3 py-1.5 text-sm text-[var(--muted)] transition hover:text-[var(--ink)]"
                        aria-label={`Increase quantity of ${line.product.name}`}
                      >
                        +
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => remove(line.productId)}
                      className="text-sm font-medium text-[var(--muted)] transition hover:text-[var(--ink)]"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <aside className="glass h-fit rounded-[1.8rem] p-6 lg:sticky lg:top-24">
        <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">
          Order summary
        </p>
        <div className="mt-5 space-y-2 border-b border-[var(--line)] pb-5 text-sm">
          <p className="flex justify-between">
            <span>Items</span>
            <span>{totalItems}</span>
          </p>
          <p className="flex justify-between font-medium text-[var(--ink)]">
            <span>Subtotal</span>
            <span>{formatMoney(subtotal)}</span>
          </p>
        </div>
        <p className="mt-4 text-sm text-[var(--muted)]">
          Shipping is calculated as free in this demo. Totals are confirmed by the
          server at checkout.
        </p>
        <Link
          href="/checkout"
          className="mt-6 block rounded-full bg-[var(--accent)] px-5 py-3 text-center text-sm font-medium text-white transition hover:-translate-y-0.5 hover:bg-[var(--accent-hover)]"
        >
          Continue to checkout
        </Link>

        <div className="mt-4 rounded-2xl border border-[var(--line)] bg-white/70 px-4 py-3 text-xs text-[var(--muted)]">
          Secure flow. This demo does not process real payments.
        </div>
      </aside>
    </div>
  );
}
