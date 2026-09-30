"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { useCart } from "@/components/cart-provider";
import { formatMoney } from "@/lib/format";
import type { Customer } from "@/lib/types";

const emptyCustomer: Customer = {
  name: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  postalCode: "",
};

export default function CheckoutPage() {
  const router = useRouter();
  const { lines, items, subtotal, clear, ready } = useCart();
  const [customer, setCustomer] = useState(emptyCustomer);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const totalItems = lines.reduce((sum, line) => sum + line.quantity, 0);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setError("");
    setPending(true);

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customer, items }),
      });
      const data = (await response.json()) as {
        order?: { id: string };
        error?: string;
      };

      if (!response.ok || !data.order) {
        throw new Error(data.error ?? "Checkout failed.");
      }

      clear();
      router.push(`/orders/${data.order.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Checkout failed.");
    } finally {
      setPending(false);
    }
  }

  if (!ready) {
    return (
      <div className="max-w-2xl space-y-4 rounded-[2rem] border border-[var(--line)] bg-white/85 p-8 shadow-[0_14px_36px_rgb(15_23_42_/_0.08)]">
        <h1 className="font-serif text-4xl text-[var(--accent-strong)]">Checkout</h1>
        <p className="text-[var(--muted)]">Loading checkout…</p>
      </div>
    );
  }

  if (lines.length === 0) {
    return (
      <div className="soft-grid max-w-2xl rounded-[2rem] border border-[var(--line)] bg-white/85 p-8 shadow-[0_20px_44px_rgb(15_23_42_/_0.08)] sm:p-10">
        <p className="text-xs uppercase tracking-[0.22em] text-[var(--muted)]">
          Checkout
        </p>
        <h1 className="mt-2 font-serif text-4xl text-[var(--accent-strong)] sm:text-5xl">
          Your cart is empty.
        </h1>
        <p className="mt-3 text-[var(--muted)]">
          Add something to the cart first.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-10 pb-8 lg:grid-cols-[1.15fr_0.85fr]">
      <form
        onSubmit={submit}
        className="soft-grid space-y-6 rounded-[1.8rem] border border-[var(--line)] bg-white/90 p-6 shadow-[0_14px_36px_rgb(15_23_42_/_0.08)] sm:p-7"
      >
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-[var(--muted)]">
            Secure checkout
          </p>
          <h1 className="mt-2 font-serif text-4xl text-[var(--accent-strong)]">
            Shipping details
          </h1>
          <p className="mt-2 text-[var(--muted)]">
            Enter your details to place an order. Payment is not required in this demo.
          </p>

          <div className="mt-4 flex flex-wrap gap-2 text-xs">
            <span className="rounded-full bg-[var(--ink)] px-3 py-1 font-medium text-white">
              1. Shipping
            </span>
            <span className="rounded-full border border-[var(--line)] bg-white/80 px-3 py-1 text-[var(--muted)]">
              2. Review
            </span>
            <span className="rounded-full border border-[var(--line)] bg-white/80 px-3 py-1 text-[var(--muted)]">
              3. Confirm
            </span>
          </div>
        </div>

        <div className="grid gap-4 rounded-2xl border border-[var(--line)] bg-white/80 p-4 sm:grid-cols-2 sm:p-5">
          {(
            [
              ["name", "Full name"],
              ["phone", "Phone number"],
              ["address", "Address"],
              ["city", "City"],
            ] as const
          ).map(([key, label]) => (
            <label
              key={key}
              className={`block text-sm ${key === "address" ? "sm:col-span-2" : ""}`}
            >
              <span className="text-[var(--muted)]">{label}</span>
              <input
                required
                type={key === "phone" ? "tel" : "text"}
                value={customer[key]}
                onChange={(event) =>
                  setCustomer((current) => ({
                    ...current,
                    [key]: event.target.value,
                  }))
                }
                className="mt-1.5 w-full rounded-xl border border-[var(--line)] bg-white/85 px-3 py-2.5 text-[var(--ink)] outline-none ring-[var(--accent)]/20 transition focus:ring-4"
              />
            </label>
          ))}
          <div className="sm:col-span-2 border-t border-[var(--line)] pt-4">
            <p className="text-xs uppercase tracking-[0.16em] text-[var(--muted)]">Optional details</p>
            <div className="mt-3 grid gap-4 sm:grid-cols-2">
              {([
                ["email", "Email"],
                ["postalCode", "Postal code"],
              ] as const).map(([key, label]) => (
                <label key={key} className="block text-sm">
                  <span className="text-[var(--muted)]">{label}</span>
                  <input
                    type={key === "email" ? "email" : "text"}
                    value={customer[key]}
                    onChange={(event) =>
                      setCustomer((current) => ({
                        ...current,
                        [key]: event.target.value,
                      }))
                    }
                    className="mt-1.5 w-full rounded-xl border border-[var(--line)] bg-white/85 px-3 py-2.5 text-[var(--ink)] outline-none ring-[var(--accent)]/20 transition focus:ring-4"
                  />
                </label>
              ))}
            </div>
          </div>
        </div>

        {error ? (
          <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        ) : null}

        <div className="rounded-2xl border border-[var(--line)] bg-white/80 p-4 sm:p-5">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2 text-sm">
            <p className="font-medium text-[var(--ink)]">Ready to place your order</p>
            <p className="text-[var(--muted)]">{totalItems} item{totalItems > 1 ? "s" : ""}</p>
          </div>

          <div className="flex flex-wrap items-center gap-4">
          <button
            type="submit"
            disabled={pending}
            className="rounded-full bg-[var(--accent)] px-7 py-3 text-sm font-medium text-white transition hover:-translate-y-0.5 hover:bg-[var(--accent-hover)] disabled:opacity-60"
          >
            {pending ? "Placing order..." : "Place order"}
          </button>
          <p className="text-xs text-[var(--muted)]">
            Demo checkout: no payment processing.
          </p>
          </div>
        </div>
      </form>

      <aside className="glass h-fit rounded-[1.8rem] p-6 lg:sticky lg:top-24">
        <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">
          Order summary
        </p>
        <div className="mt-4 flex items-center justify-between rounded-2xl border border-[var(--line)] bg-white/70 px-4 py-3 text-sm">
          <span className="text-[var(--muted)]">Items</span>
          <span className="font-semibold text-[var(--accent-strong)]">{totalItems}</span>
        </div>
        <div className="mt-3 flex items-center justify-between rounded-2xl border border-[var(--line)] bg-white/70 px-4 py-3 text-sm">
          <span className="text-[var(--muted)]">Shipping</span>
          <span className="font-semibold text-[var(--accent-strong)]">Free</span>
        </div>
        <ul className="mt-4 space-y-3 text-sm">
          {lines.map((line) => (
            <li
              key={line.productId}
              className="flex items-start justify-between gap-4 rounded-xl border border-[var(--line)] bg-white/65 px-3 py-2"
            >
              <span className="text-[var(--ink)]">
                {line.product.name} × {line.quantity}
              </span>
              <span className="font-medium text-[var(--accent-strong)]">
                {formatMoney(line.product.price * line.quantity)}
              </span>
            </li>
          ))}
        </ul>

        <p className="mt-6 flex justify-between border-t border-[var(--line)] pt-4 font-semibold text-[var(--ink)]">
          <span>Total</span>
          <span className="text-[var(--accent-strong)]">{formatMoney(subtotal)}</span>
        </p>

        <p className="mt-3 text-sm text-[var(--muted)]">
          Shipping is free in this demo. Final totals are confirmed by the
          server at checkout.
        </p>

        <div className="mt-4 rounded-2xl border border-[var(--line)] bg-white/70 px-4 py-3 text-xs text-[var(--muted)]">
          Estimated dispatch: within 24 hours after order confirmation.
        </div>
      </aside>
    </div>
  );
}
