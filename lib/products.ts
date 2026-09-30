import { mkdirSync, readFileSync, writeFileSync } from "fs";
import path from "path";
import type { Product } from "./types";

const defaultProducts: Product[] = [
  {
    id: "p1",
    slug: "linen-overshirt",
    name: "Linen Overshirt",
    description:
      "A relaxed overshirt in stone-washed linen. Cut for layering with a concealed placket and horn buttons.",
    price: 128,
    category: "Apparel",
    image:
      "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=1200&q=80",
    stock: 18,
    featured: true,
  },
  {
    id: "p2",
    slug: "wool-crewneck",
    name: "Merino Crewneck",
    description:
      "Fine-gauge merino sweater with a clean crew neck. Warm without bulk, made for everyday wear.",
    price: 96,
    category: "Apparel",
    image:
      "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=1200&q=80",
    stock: 24,
    featured: true,
  },
  {
    id: "p3",
    slug: "selvedge-denim",
    name: "Selvedge Denim",
    description:
      "Straight-leg jeans in 13oz Japanese selvedge. Will fade with you if you give them time.",
    price: 158,
    category: "Apparel",
    image:
      "https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=1200&q=80",
    stock: 12,
  },
  {
    id: "p4",
    slug: "canvas-tote",
    name: "Canvas Market Tote",
    description:
      "Heavy cotton canvas tote with a wide base and leather handles. Holds a week's groceries or a laptop.",
    price: 48,
    category: "Bags",
    image:
      "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1200&q=80",
    stock: 40,
    featured: true,
  },
  {
    id: "p5",
    slug: "weekender-bag",
    name: "Leather Weekender",
    description:
      "Full-grain leather holdall with a brass zip and a removable shoulder strap. One bag for overnight trips.",
    price: 240,
    category: "Bags",
    image:
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=1200&q=80",
    stock: 8,
  },
  {
    id: "p6",
    slug: "ceramic-mug",
    name: "Speckled Ceramic Mug",
    description:
      "Hand-thrown mug with a matte glaze and a comfortable handle. Holds 12oz of whatever you need.",
    price: 28,
    category: "Home",
    image:
      "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=1200&q=80",
    stock: 60,
    featured: true,
  },
  {
    id: "p7",
    slug: "linen-napkins",
    name: "Linen Napkin Set",
    description:
      "Set of four stonewashed linen napkins. Soft from the first wash, better with every dinner.",
    price: 42,
    category: "Home",
    image:
      "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=1200&q=80",
    stock: 32,
  },
  {
    id: "p8",
    slug: "oak-tray",
    name: "White Oak Tray",
    description:
      "Solid oak serving tray with carved handles. For coffee in bed or keys by the door.",
    price: 74,
    category: "Home",
    image:
      "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=80",
    stock: 15,
  },
  {
    id: "p9",
    slug: "desktop-speaker",
    name: "Walnut Desktop Speaker",
    description:
      "Compact Bluetooth speaker in walnut veneer. Warm mids, honest volume, no LED circus.",
    price: 189,
    category: "Audio",
    image:
      "https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=1200&q=80",
    stock: 10,
    featured: true,
  },
  {
    id: "p10",
    slug: "studio-headphones",
    name: "Closed-Back Headphones",
    description:
      "Studio-style closed backs with replaceable pads. Isolation without squeezing your temples.",
    price: 210,
    category: "Audio",
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=80",
    stock: 14,
  },
  {
    id: "p11",
    slug: "daylight-lamp",
    name: "Daylight Desk Lamp",
    description:
      "Adjustable brass lamp with a linen shade. Tuned for evening reading, not a nightclub.",
    price: 112,
    category: "Home",
    image:
      "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=1200&q=80",
    stock: 20,
  },
  {
    id: "p12",
    slug: "wool-cap",
    name: "Felted Wool Cap",
    description:
      "Unstructured cap in felted wool. Brim holds its shape; the rest forgets it was ever new.",
    price: 54,
    category: "Apparel",
    image:
      "https://images.unsplash.com/photo-1521369909029-2afed882baee?auto=format&fit=crop&w=1200&q=80",
    stock: 22,
  },
];

const dataDir = process.env.SHOP_DATA_DIR || path.join(process.cwd(), "data");
const productsFile = path.join(dataDir, "products.json");

function readProductsFile(): Product[] {
  try {
    const raw = readFileSync(productsFile, "utf8");
    if (!raw.trim()) return defaultProducts;
    const parsed = JSON.parse(raw) as Product[];
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : defaultProducts;
  } catch {
    return defaultProducts;
  }
}

function writeProductsFile(nextProducts: Product[]) {
  mkdirSync(dataDir, { recursive: true });
  writeFileSync(productsFile, JSON.stringify(nextProducts, null, 2), "utf8");
}

export const products: Product[] = [...readProductsFile()];

function refreshProducts() {
  const latestProducts = readProductsFile();
  products.splice(0, products.length, ...latestProducts);
  return products;
}

export function saveProducts(nextProducts: Product[]) {
  writeProductsFile(nextProducts);
  products.splice(0, products.length, ...nextProducts);
  return nextProducts;
}

export function addProduct(product: Product) {
  return saveProducts([...refreshProducts(), product]);
}

export function listProducts(filters?: {
  q?: string;
  category?: string;
}) {
  const currentProducts = refreshProducts();
  const q = filters?.q?.trim().toLowerCase();
  const category = filters?.category?.trim();

  return currentProducts.filter((product) => {
    const matchesQuery =
      !q ||
      product.name.toLowerCase().includes(q) ||
      product.description.toLowerCase().includes(q);
    const matchesCategory = !category || product.category === category;
    return matchesQuery && matchesCategory;
  });
}

export function getProduct(id: string) {
  return refreshProducts().find((product) => product.id === id);
}

export function getCategories() {
  return [...new Set(refreshProducts().map((product) => product.category))].sort();
}
