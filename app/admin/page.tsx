import { AdminShell } from "@/components/admin-shell";
import { AdminOverview } from "@/components/admin-sections";

export default function AdminPage() {
  return (
    <AdminShell>
      <AdminOverview />
    </AdminShell>
  );
}
