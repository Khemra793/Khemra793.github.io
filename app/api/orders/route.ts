import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { createOrder, listOrders } from "@/lib/orders";
import { getProduct } from "@/lib/products";
import type { CartItem, Customer, OrderItem } from "@/lib/types";

type CheckoutBody = {
  customer?: Customer;
  items?: CartItem[];
};

function isCustomer(value: Customer | undefined): value is Customer {
  return Boolean(
    value?.name?.trim() &&
      value?.phone?.trim() &&
      value?.address?.trim() &&
      value?.city?.trim(),
  );
}

export async function GET() {
  return NextResponse.json({ orders: listOrders() });
}

export async function POST(request: Request) {
  let body: CheckoutBody;

  try {
    body = (await request.json()) as CheckoutBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!isCustomer(body.customer)) {
    return NextResponse.json(
      { error: "Please fill in every shipping field." },
      { status: 400 },
    );
  }

  if (!body.items?.length) {
    return NextResponse.json({ error: "Your cart is empty." }, { status: 400 });
  }

  const orderItems: OrderItem[] = [];

  for (const item of body.items) {
    if (!item.productId || item.quantity < 1) {
      return NextResponse.json({ error: "Invalid cart item." }, { status: 400 });
    }

    const product = getProduct(item.productId);
    if (!product) {
      return NextResponse.json(
        { error: "A product in your cart is no longer available." },
        { status: 400 },
      );
    }

    if (item.quantity > product.stock) {
      return NextResponse.json(
        { error: `${product.name} only has ${product.stock} left.` },
        { status: 400 },
      );
    }

    product.stock -= item.quantity;
    orderItems.push({
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: item.quantity,
    });
  }

  const total = orderItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  const order = createOrder({
    id: randomUUID(),
    createdAt: new Date().toISOString(),
    customer: {
      name: body.customer.name.trim(),
      email: body.customer.email?.trim() ?? "",
      phone: body.customer.phone.trim(),
      address: body.customer.address.trim(),
      city: body.customer.city.trim(),
      postalCode: body.customer.postalCode?.trim() ?? "",
    },
    items: orderItems,
    total,
    status: "confirmed",
  });

  return NextResponse.json({ order }, { status: 201 });
}
