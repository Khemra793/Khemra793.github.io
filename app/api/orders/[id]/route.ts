import { NextResponse } from "next/server";
import { getOrder, updateOrderStatus } from "@/lib/orders";
import type { OrderStatus } from "@/lib/types";

const orderStatuses: OrderStatus[] = [
  "confirmed",
  "preparing",
  "ready",
  "completed",
  "cancelled",
];

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const order = getOrder(id);

  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  return NextResponse.json({ order });
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  let body: { status?: OrderStatus };

  try {
    body = (await request.json()) as { status?: OrderStatus };
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!body.status || !orderStatuses.includes(body.status)) {
    return NextResponse.json({ error: "Invalid order status" }, { status: 400 });
  }

  const order = updateOrderStatus(id, body.status);
  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  return NextResponse.json({ order });
}
