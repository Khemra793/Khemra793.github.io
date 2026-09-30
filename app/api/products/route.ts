import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { addProduct, getCategories, listProducts, products } from "@/lib/products";
import type { Product } from "@/lib/types";

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60) || "new-product";
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") ?? undefined;
  const category = searchParams.get("category") ?? undefined;

  return NextResponse.json({
    products: listProducts({ q, category }),
    categories: getCategories(),
  });
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<Product>;
    const name = String(body.name ?? "").trim();
    const description = String(body.description ?? "").trim();
    const category = String(body.category ?? "").trim();
    const image = String(body.image ?? "").trim();
    const price = Number(body.price);
    const stock = Number(body.stock);

    if (!name || !description || !category || !image) {
      return NextResponse.json({ error: "Name, description, category, and image are required." }, { status: 400 });
    }

    if (!Number.isFinite(price) || price <= 0) {
      return NextResponse.json({ error: "Price must be a positive number." }, { status: 400 });
    }

    if (!Number.isFinite(stock) || stock < 0) {
      return NextResponse.json({ error: "Stock must be zero or more." }, { status: 400 });
    }

    const product: Product = {
      id: String(body.id ?? `${slugify(name)}-${randomUUID().slice(0, 8)}`),
      slug: String(body.slug ?? slugify(name)),
      name,
      description,
      price,
      category,
      image,
      stock,
      featured: Boolean(body.featured),
    };

    const exists = products.some((item) => item.id === product.id || item.slug === product.slug);
    if (exists) {
      return NextResponse.json({ error: "A product with the same ID or slug already exists." }, { status: 409 });
    }

    addProduct(product);
    return NextResponse.json({ product }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Invalid product payload." }, { status: 400 });
  }
}
