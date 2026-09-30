"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export function CatalogFilters({ categories }: { categories: string[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [q, setQ] = useState(searchParams.get("q") ?? "");
  const activeCategory = searchParams.get("category") ?? "";

  function push(next: { q?: string; category?: string }) {
    const params = new URLSearchParams();
    const query = next.q ?? q;
    const category = next.category ?? activeCategory;
    if (query) params.set("q", query);
    if (category) params.set("category", category);
    const qs = params.toString();
    router.push(qs ? `/products?${qs}` : "/products");
  }

  return (
    <form
      className="glass reveal-up reveal-delay-1 flex flex-col gap-4 rounded-[1.4rem] p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5"
      onSubmit={(event) => {
        event.preventDefault();
        push({ q });
      }}
    >
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => push({ category: "" })}
          className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${
            !activeCategory
              ? "bg-[var(--ink)] text-white"
              : "border border-[var(--line)] bg-white/80 text-[var(--muted)] hover:bg-white"
          }`}
        >
          All
        </button>
        {categories.map((category) => (
          <button
            key={category}
            type="button"
            onClick={() =>
              push({ category: category === activeCategory ? "" : category })
            }
            className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${
              activeCategory === category
                ? "bg-[var(--ink)] text-white"
                : "border border-[var(--line)] bg-white/80 text-[var(--muted)] hover:bg-white"
            }`}
          >
            {category}
          </button>
        ))}
      </div>
      <input
        value={q}
        onChange={(event) => setQ(event.target.value)}
        placeholder="Search products"
        className="w-full rounded-full border border-[var(--line)] bg-white/80 px-4 py-2 text-sm outline-none ring-[var(--accent)]/20 transition focus:ring-4 sm:max-w-xs"
      />
    </form>
  );
}
