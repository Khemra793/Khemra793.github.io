import { mkdirSync, readFileSync, writeFileSync } from "fs";
import path from "path";
import type { Order, OrderStatus } from "./types";

const dataDir = process.env.SHOP_DATA_DIR || path.join(process.cwd(), "data");
const ordersFile = path.join(dataDir, "orders.json");

function readOrders(): Order[] {
  try {
    return JSON.parse(readFileSync(ordersFile, "utf8")) as Order[];
  } catch {
    return [];
  }
}

function writeOrders(orders: Order[]) {
  mkdirSync(dataDir, { recursive: true });
  writeFileSync(ordersFile, JSON.stringify(orders, null, 2), "utf8");
}

export function listOrders() {
  return readOrders();
}

export function createOrder(order: Order) {
  const orders = readOrders();
  orders.unshift(order);
  writeOrders(orders);
  return order;
}

export function getOrder(id: string) {
  return readOrders().find((order) => order.id === id);
}

export function updateOrderStatus(id: string, status: OrderStatus) {
  const orders = readOrders();
  const order = orders.find((currentOrder) => currentOrder.id === id);
  if (!order) return undefined;

  order.status = status;
  writeOrders(orders);
  return order;
}
