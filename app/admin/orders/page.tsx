import { AdminShell } from "@/components/admin-shell";
import { AdminOrders } from "@/components/admin-sections";

export default function AdminOrdersPage() {
  return (
    <AdminShell>
      <AdminOrders />
    </AdminShell>
  );
}
