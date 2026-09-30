import Image from "next/image";
import Link from "next/link";
import { formatMoney } from "@/lib/format";
import type { Product } from "@/lib/types";

export function ProductCard({
  product,
  index,
}: {
  product: Product;
  index?: number;
}) {
  const delay = `${Math.min(index ?? 0, 8) * 70}ms`;
  const isLowStock = product.stock <= 10;
  const shortDescription =
    product.description.length > 64
      ? `${product.description.slice(0, 64)}...`
      : product.description;

  return (
    <Link
      href={`/products/${product.id}`}
      className="group reveal-up block"
      style={{ animationDelay: delay }}
    >
      <article className="relative overflow-hidden rounded-[1.8rem] border border-white/70 bg-white/70 shadow-[0_10px_36px_rgb(8_47_73_/_0.12)] backdrop-blur-sm transition duration-500 group-hover:-translate-y-1.5 group-hover:shadow-[0_20px_54px_rgb(8_47_73_/_0.2)]">
        <div className="relative aspect-[4/5] overflow-hidden">
          <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-t from-black/70 via-black/25 to-transparent opacity-75 transition duration-500 group-hover:opacity-90" />
          <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-br from-cyan-300/20 via-transparent to-blue-400/10 opacity-90" />
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition duration-[900ms] group-hover:scale-[1.1]"
          />
          <div className="absolute left-3 top-3 z-20 flex flex-wrap gap-2">
            <span className="rounded-full border border-white/50 bg-white/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--accent-strong)] backdrop-blur-sm">
              {product.category}
            </span>
            <span
              className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] backdrop-blur-sm ${
                isLowStock
                  ? "border border-amber-200/70 bg-amber-50/90 text-amber-700"
                  : "border border-emerald-200/70 bg-emerald-50/90 text-emerald-700"
              }`}
            >
              {isLowStock ? `Only ${product.stock} left` : "Ready to ship"}
            </span>
          </div>

          <div className="absolute inset-x-3 bottom-3 z-20 rounded-xl border border-white/35 bg-white/16 p-2.5 text-white shadow-[0_8px_24px_rgb(2_6_23_/_0.25)] backdrop-blur-md transition duration-500 group-hover:bg-white/20">
            <h3 className="font-serif text-xl leading-tight tracking-tight">
              {product.name}
            </h3>
            <p className="mt-1 text-xs text-blue-50/95">{shortDescription}</p>
            <div className="mt-2 flex items-center justify-between">
              <p className="rounded-full bg-white/90 px-2.5 py-0.5 text-xs font-semibold text-[var(--accent-strong)]">
                {formatMoney(product.price)}
              </p>
              <span className="text-xs font-medium text-white/95 transition group-hover:translate-x-1">
                View product
              </span>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}
