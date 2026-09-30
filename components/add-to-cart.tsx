"use client";

import { useState } from "react";
import { useCart } from "./cart-provider";
import type { Product } from "@/lib/types";

export function AddToCart({ product }: { product: Product }) {
  const { add } = useCart();
  const [added, setAdded] = useState(false);

  if (product.stock < 1) {
    return (
      <p className="rounded-full border border-[var(--line)] px-5 py-3 text-sm text-[var(--muted)]">
        Sold out
      </p>
    );
  }

  return (
    <button
      type="button"
      onClick={() => {
        add(product.id);
        setAdded(true);
        window.setTimeout(() => setAdded(false), 1200);
      }}
      className="rounded-full bg-[var(--accent)] px-6 py-3 text-sm text-white hover:bg-[var(--accent-hover)]"
    >
      {added ? "Added" : "Add to cart"}
    </button>
  );
}
