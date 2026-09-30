import { NextResponse } from "next/server";
import { getProduct, products, saveProducts } from "@/lib/products";
import type { Product } from "@/lib/types";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const product = getProduct(id);

  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  return NextResponse.json({ product });
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const current = getProduct(id);

  if (!current) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

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

    if (!Number.isFinite(price) || price <= 0 || !Number.isFinite(stock) || stock < 0) {
      return NextResponse.json({ error: "Price must be positive and stock must be zero or more." }, { status: 400 });
    }

    const updated: Product = {
      ...current,
      name,
      description,
      category,
      image,
      price,
      stock,
      featured: Boolean(body.featured),
    };

    saveProducts(products.map((product) => (product.id === id ? updated : product)));
    return NextResponse.json({ product: updated });
  } catch {
    return NextResponse.json({ error: "Invalid product payload." }, { status: 400 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  if (!getProduct(id)) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  saveProducts(products.filter((product) => product.id !== id));
  return NextResponse.json({ ok: true });
}
