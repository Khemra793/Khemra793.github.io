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
      <div className="mx-auto flex h-18 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="font-serif text-2xl tracking-tight text-[var(--accent-strong)]">
          Atelier
        </Link>
        <nav className="flex items-center gap-2 text-sm sm:gap-3">
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
                    ? "rounded-full bg-[var(--ink)] px-3 py-1.5 font-medium text-white"
                    : "rounded-full px-3 py-1.5 text-[var(--muted)] transition hover:bg-white/80 hover:text-[var(--ink)]"
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
            className="rounded-full bg-[var(--accent)] px-4 py-2 text-sm font-medium text-white transition hover:-translate-y-0.5 hover:bg-[var(--accent-hover)]"
          >
            Checkout
          </Link>
          <Link
            href="/admin"
            className="rounded-full border border-[var(--line)] bg-white/80 px-4 py-2 text-sm font-medium text-[var(--muted)] transition hover:-translate-y-0.5 hover:bg-white hover:text-[var(--ink)]"
          >
            Admin
          </Link>
        </nav>
      </div>
    </header>
  );
}
