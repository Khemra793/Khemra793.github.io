import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AddToCart } from "@/components/add-to-cart";
import { formatMoney } from "@/lib/format";
import { getProduct, products } from "@/lib/products";

export function generateStaticParams() {
  return products.map((product) => ({ id: product.id }));
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = getProduct(id);
  if (!product) notFound();

  const stockLabel =
    product.stock < 1
      ? "Sold out"
      : product.stock < 8
        ? `Only ${product.stock} left`
        : `${product.stock} in stock`;

  return (
    <div className="grid gap-8 pb-8 lg:grid-cols-[1.08fr_0.92fr] lg:gap-12">
      <div className="reveal-up relative overflow-hidden rounded-[2rem] border border-[var(--line)] bg-[var(--surface)] p-3 shadow-[0_20px_44px_rgb(15_23_42_/_0.12)]">
        <div className="relative aspect-[4/5] overflow-hidden rounded-[1.45rem]">
          <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-t from-black/28 via-transparent to-transparent" />
          <Image
            src={product.image}
            alt={product.name}
            fill
            priority
            sizes="(min-width: 1024px) 52vw, 100vw"
            className="object-cover"
          />
        </div>
        <div className="absolute left-7 top-7 z-20 rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-[var(--accent-strong)] backdrop-blur-sm">
          {product.category}
        </div>
        <div className="absolute bottom-7 right-7 z-20 rounded-full bg-black/50 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
          Product ID: {product.id.toUpperCase()}
        </div>
      </div>

      <div className="reveal-up reveal-delay-1 flex flex-col justify-center">
        <Link
          href="/products"
          className="inline-flex w-fit items-center gap-2 text-sm text-[var(--muted)] transition hover:text-[var(--ink)]"
        >
          ← Catalog
        </Link>

        <h1 className="mt-5 font-serif text-4xl leading-tight text-[var(--accent-strong)] sm:text-5xl">
          {product.name}
        </h1>

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <p className="rounded-full bg-[var(--surface-soft)] px-4 py-1.5 text-lg font-semibold text-[var(--accent-strong)]">
            {formatMoney(product.price)}
          </p>
          <p className="rounded-full border border-[var(--line)] bg-white/85 px-4 py-1.5 text-sm font-medium text-[var(--muted)]">
            {stockLabel}
          </p>
        </div>

        <p className="mt-6 max-w-xl leading-7 text-[var(--muted)]">
          {product.description}
        </p>

        <div className="mt-7 grid gap-3 sm:grid-cols-3">
          <div className="glass rounded-2xl px-4 py-3">
            <p className="text-xs uppercase tracking-[0.15em] text-[var(--muted)]">
              Category
            </p>
            <p className="mt-1 text-sm font-semibold text-[var(--ink)]">
              {product.category}
            </p>
          </div>
          <div className="glass rounded-2xl px-4 py-3">
            <p className="text-xs uppercase tracking-[0.15em] text-[var(--muted)]">
              Dispatch
            </p>
            <p className="mt-1 text-sm font-semibold text-[var(--ink)]">
              24 hours
            </p>
          </div>
          <div className="glass rounded-2xl px-4 py-3">
            <p className="text-xs uppercase tracking-[0.15em] text-[var(--muted)]">
              Returns
            </p>
            <p className="mt-1 text-sm font-semibold text-[var(--ink)]">
              30 days
            </p>
          </div>
        </div>

        <div className="mt-8 flex items-center gap-4">
          <AddToCart product={product} />
          <p className="text-sm text-[var(--muted)]">Secure checkout, no live payment.</p>
        </div>
      </div>
    </div>
  );
}
