import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-[var(--line)] bg-white/60">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-8 text-sm text-[var(--muted)] sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p>Atelier — a sample store with a real checkout API, not live payments.</p>
        <Link
          href="/products"
          className="font-medium text-[var(--accent)] hover:text-[var(--accent-hover)]"
        >
          Browse the catalog
        </Link>
      </div>
    </footer>
  );
}
