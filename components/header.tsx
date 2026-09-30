"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "./cart-provider";

const links = [
  { href: "/products", label: "Shop" },
  { href: "/cart", label: "Cart" },
];

export function Header() {
  const pathname = usePathname();
  const { count } = useCart();
  const cartCount = count;

  return (
    <header className="sticky top-0 z-30 border-b border-[var(--line)] bg-[color-mix(in_oklab,var(--background)_86%,transparent)] backdrop-blur-md">
      <div className="mx-auto flex h-16 min-w-0 max-w-6xl items-center justify-between gap-2 px-3 sm:h-18 sm:px-6">
        <Link href="/" className="shrink-0 font-serif text-[1.35rem] tracking-tight text-[var(--accent-strong)] sm:text-2xl">
          H&K
        </Link>
        <nav className="flex min-w-0 shrink items-center justify-end gap-0.5 text-xs sm:gap-3 sm:text-sm">
          {links.map((link) => {
            const isCartLink = link.href === "/cart";
            const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));

            return (
              <Link
                key={link.href}
                href={link.href}
                aria-label={isCartLink ? `Cart with ${cartCount} items` : link.label}
                className={
                  isActive
                    ? "rounded-full bg-[var(--ink)] px-2 py-1.5 font-medium text-white sm:px-3"
                    : "rounded-full px-2 py-1.5 text-[var(--muted)] transition hover:bg-white/80 hover:text-[var(--ink)] sm:px-3"
                }
              >
                <span className="inline-flex items-center gap-2">
                  {link.label}
                  {isCartLink && cartCount > 0 && (
                    <span
                      aria-live="polite"
                      className="relative flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white shadow-lg ring-2 ring-white"
                    >
                      {cartCount}
                    </span>
                  )}
                </span>
              </Link>
            );
          })}
          <Link
            href="/checkout"
            className="shrink-0 rounded-full bg-[var(--accent)] px-2.5 py-2 text-xs font-medium text-white transition hover:-translate-y-0.5 hover:bg-[var(--accent-hover)] sm:px-4 sm:text-sm"
          >
            Checkout
          </Link>
          <Link
            href="/admin"
            className="shrink-0 rounded-full border border-[var(--line)] bg-white/80 px-2.5 py-2 text-xs font-medium text-[var(--muted)] transition hover:-translate-y-0.5 hover:bg-white hover:text-[var(--ink)] sm:px-4 sm:text-sm"
          >
            Admin
          </Link>
        </nav>
      </div>
    </header>
  );
}
