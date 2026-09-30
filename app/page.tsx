import Link from "next/link";
import { ProductCard } from "@/components/product-card";
import { products } from "@/lib/products";

export default function Home() {
  const featured = products.filter((product) => product.featured);

  return (
    <div className="space-y-16 pb-6">
      <section className="soft-grid reveal-up relative overflow-hidden rounded-[2rem] border border-[var(--line)] p-7 sm:p-9 lg:grid lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
        <div className="absolute -right-18 -top-14 h-48 w-48 rounded-full bg-[var(--accent)]/10 blur-3xl" />
        <div className="absolute -bottom-16 left-14 h-44 w-44 rounded-full bg-cyan-300/20 blur-3xl" />
        <div className="relative">
          <p className="text-sm uppercase tracking-[0.24em] text-[var(--muted)]">
            New season
          </p>
          <h1 className="mt-3 max-w-xl font-serif text-5xl leading-tight text-[var(--accent-strong)] sm:text-6xl">
            Built to feel premium. Ready to ship today.
          </h1>
          <p className="mt-5 max-w-xl text-lg text-[var(--muted)]">
            Apparel, home, bags, and audio — mock inventory served from a real
            API, with cart and checkout on the server.
          </p>
        </div>
        <div className="reveal-up reveal-delay-1 relative mt-7 flex flex-wrap gap-3 lg:justify-end">
          <Link
            href="/products"
            className="rounded-full bg-[var(--accent)] px-6 py-3 text-sm font-medium text-white transition hover:-translate-y-0.5 hover:bg-[var(--accent-hover)]"
          >
            Shop the catalog
          </Link>
          <Link
            href="/cart"
            className="rounded-full border border-[var(--line)] bg-white/70 px-6 py-3 text-sm font-medium transition hover:-translate-y-0.5 hover:bg-white"
          >
            View cart
          </Link>
          <Link
            href="/admin"
            className="rounded-full border border-[var(--line)] bg-[var(--surface-soft)] px-6 py-3 text-sm font-medium text-[var(--ink)] transition hover:-translate-y-0.5 hover:bg-white"
          >
            Admin panel
          </Link>
        </div>
      </section>

      <section className="reveal-up reveal-delay-2">
        <div className="mb-6 flex items-end justify-between">
          <h2 className="font-serif text-3xl text-[var(--accent-strong)]">
            Featured
          </h2>
          <Link
            href="/products"
            className="text-sm font-medium text-[var(--muted)] hover:text-[var(--ink)]"
          >
            All products
          </Link>
        </div>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
}
