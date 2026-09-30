"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

const links = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/catalog", label: "Catalog" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/add-item", label: "Add item" },
];

export function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="mx-auto max-w-7xl pb-8">
      <div className="grid gap-6 lg:grid-cols-[180px_1fr]">
        <aside className="print:hidden border-b border-[var(--line)] pb-4 lg:border-b-0 lg:border-r lg:pr-5">
          <p className="text-lg font-semibold text-[var(--ink)]">Admin</p>
          <p className="mt-1 text-xs text-[var(--muted)]">Store management</p>
          <nav className="mt-5 flex gap-1 overflow-x-auto text-sm lg:mt-8 lg:block lg:space-y-1">
            {links.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`block whitespace-nowrap rounded-lg px-3 py-2 ${
                    active
                      ? "bg-[var(--surface-soft)] font-medium text-[var(--accent)]"
                      : "text-[var(--muted)] hover:bg-[var(--surface-soft)]"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </aside>
        <main className="min-w-0">{children}</main>
      </div>
    </div>
  );
}
