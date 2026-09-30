import { Suspense } from "react";
import { unstable_noStore as noStore } from "next/cache";
import { CatalogFilters } from "@/components/catalog-filters";
import { ProductCard } from "@/components/product-card";
import { getCategories, listProducts } from "@/lib/products";

export const dynamic = "force-dynamic";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string }>;
}) {
  noStore();
  const { q, category } = await searchParams;
  const catalog = listProducts({ q, category });
  const categories = getCategories();
  const activeFilter = category?.trim() || "All";
  const queryLabel = q?.trim() || "Any";

  return (
    <div className="space-y-8 pb-8">
      <div className="reveal-up soft-grid relative overflow-hidden rounded-[2rem] border border-[var(--line)] bg-[var(--surface)]/80 p-6 sm:p-8">
        <div className="pointer-events-none absolute -right-14 -top-16 h-48 w-48 rounded-full bg-[var(--accent)]/14 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 left-24 h-52 w-52 rounded-full bg-cyan-300/18 blur-3xl" />
        <div className="relative">
          <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted)]">
            Product index
          </p>
          <h1 className="mt-2 font-serif text-4xl text-[var(--accent-strong)] sm:text-5xl">
            Discover your next favorite item.
          </h1>
          <p className="mt-3 max-w-2xl text-[var(--muted)]">
            Filter by category or search. Data comes from{" "}
            <code className="text-sm">GET /api/products</code>.
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <div className="glass rounded-2xl px-4 py-3">
              <p className="text-xs uppercase tracking-[0.16em] text-[var(--muted)]">
                Results
              </p>
              <p className="mt-1 text-2xl font-semibold text-[var(--accent-strong)]">
                {catalog.length}
              </p>
            </div>
            <div className="glass rounded-2xl px-4 py-3">
              <p className="text-xs uppercase tracking-[0.16em] text-[var(--muted)]">
                Category
              </p>
              <p className="mt-1 truncate text-lg font-semibold text-[var(--ink)]">
                {activeFilter}
              </p>
            </div>
            <div className="glass rounded-2xl px-4 py-3">
              <p className="text-xs uppercase tracking-[0.16em] text-[var(--muted)]">
                Search
              </p>
              <p className="mt-1 truncate text-lg font-semibold text-[var(--ink)]">
                {queryLabel}
              </p>
            </div>
          </div>
        </div>
      </div>
      <Suspense>
        <CatalogFilters categories={categories} />
      </Suspense>
      {catalog.length === 0 ? (
        <div className="glass rounded-3xl p-8 text-center">
          <p className="font-serif text-3xl text-[var(--accent-strong)]">
            No matching products
          </p>
          <p className="mt-2 text-[var(--muted)]">
            Try a broader term or switch back to another category.
          </p>
        </div>
      ) : (
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {catalog.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>
      )}
    </div>
  );
}
