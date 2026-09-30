"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { CartItem, Product } from "@/lib/types";

type CartLine = CartItem & { product: Product };

type CartContextValue = {
  items: CartItem[];
  lines: CartLine[];
  count: number;
  subtotal: number;
  ready: boolean;
  add: (productId: string, quantity?: number) => void;
  setQuantity: (productId: string, quantity: number) => void;
  remove: (productId: string) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "shop-cart";

export function CartProvider({
  products,
  children,
}: {
  products: Product[];
  children: ReactNode;
}) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const loadCart = window.setTimeout(() => {
      try {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        if (raw) setItems(JSON.parse(raw) as CartItem[]);
      } catch {
        setItems([]);
      }
      setReady(true);
    }, 0);

    return () => window.clearTimeout(loadCart);
  }, []);

  useEffect(() => {
    if (ready) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, ready]);

  const value = useMemo(() => {
    const productMap = new Map(products.map((product) => [product.id, product]));
    const lines = items
      .map((item) => {
        const product = productMap.get(item.productId);
        return product ? { ...item, product } : null;
      })
      .filter((line): line is CartLine => line !== null);
    const count = lines.reduce((sum, line) => sum + line.quantity, 0);
    const subtotal = lines.reduce(
      (sum, line) => sum + line.product.price * line.quantity,
      0,
    );

    return {
      items,
      lines,
      count,
      subtotal,
      ready,
      add(productId: string, quantity = 1) {
        setItems((current) => {
          const existing = current.find((item) => item.productId === productId);
          if (existing) {
            return current.map((item) =>
              item.productId === productId
                ? { ...item, quantity: item.quantity + quantity }
                : item,
            );
          }
          return [...current, { productId, quantity }];
        });
      },
      setQuantity(productId: string, quantity: number) {
        setItems((current) =>
          quantity < 1
            ? current.filter((item) => item.productId !== productId)
            : current.map((item) =>
                item.productId === productId ? { ...item, quantity } : item,
              ),
        );
      },
      remove(productId: string) {
        setItems((current) =>
          current.filter((item) => item.productId !== productId),
        );
      },
      clear() {
        setItems([]);
      },
    };
  }, [items, products, ready]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used inside CartProvider");
  return context;
}
