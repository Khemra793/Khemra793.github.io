import type { Metadata } from "next";
import { DM_Sans, Fraunces } from "next/font/google";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { CartProvider } from "@/components/cart-provider";
import { products } from "@/lib/products";
import "./globals.css";

const sans = DM_Sans({
  variable: "--font-dm",
  subsets: ["latin"],
});

const serif = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "H&K — Shop",
  description: "A full-stack sample store with catalog, cart, and checkout API.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${sans.variable} ${serif.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <div aria-hidden className="light-lines" />
        <CartProvider products={products}>
          <Header />
          <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6">
            {children}
          </main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
