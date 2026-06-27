import { AdminLayout } from "@/components/admin-layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const stats = [
  { label: "Total Orders", value: "1,234", change: "+12%" },
  { label: "Revenue", value: "$45,230", change: "+8%" },
  { label: "Products", value: "567", change: "+3%" },
  { label: "Customers", value: "3,890", change: "+15%" },
];

const quickActions = [
  { label: "Add Product", icon: "📦" },
  { label: "Manage Categories", icon: "📂" },
  { label: "View Orders", icon: "🛒" },
  { label: "Catering Requests", icon: "🍽️" },
];

const recentOrders = [
  { id: "#ORD-001", customer: "John Doe", status: "Completed", amount: "$120.00" },
  { id: "#ORD-002", customer: "Jane Smith", status: "Pending", amount: "$85.50" },
  { id: "#ORD-003", customer: "Bob Johnson", status: "Shipped", amount: "$210.00" },
  { id: "#ORD-004", customer: "Alice Brown", status: "Processing", amount: "$45.99" },
  { id: "#ORD-005", customer: "Charlie Davis", status: "Completed", amount: "$320.00" },
];

const recentActivity = [
  { action: "New order placed", detail: "Order #ORD-001 by John Doe", time: "2 min ago" },
  { action: "Product updated", detail: "Updated pricing for Chocolate Cake", time: "15 min ago" },
  { action: "Catering request", detail: "New request from ABC Corp", time: "1 hour ago" },
  { action: "Customer registered", detail: "New customer Alice Brown", time: "3 hours ago" },
  { action: "Order shipped", detail: "Order #ORD-003 shipped to Bob Johnson", time: "5 hours ago" },
];

function StatusBadge({ status }: { status: string }) {
  const variantMap: Record<string, "success" | "warning" | "primary" | "default"> = {
    Completed: "success",
    Pending: "warning",
    Shipped: "primary",
    Processing: "default",
  };
  return <Badge variant={variantMap[status] || "default"}>{status}</Badge>;
}

export default function Page() {
  return (
    <AdminLayout breadcrumbItems={[{ label: "Dashboard" }]}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-1 text-gray-500">Welcome back, Admin.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-lg bg-white p-5 shadow-sm border border-gray-100"
            >
              <p className="text-sm text-gray-500">{stat.label}</p>
              <p className="mt-1 text-2xl font-semibold text-gray-900">{stat.value}</p>
              <p className="mt-1 text-sm text-green-600">{stat.change}</p>
            </div>
          ))}
        </div>

        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Quick Actions</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {quickActions.map((action) => (
              <Button
                key={action.label}
                variant="outline"
                className="h-auto flex-col items-start gap-2 p-4"
              >
                <span className="text-2xl">{action.icon}</span>
                <span className="font-medium text-gray-900">{action.label}</span>
              </Button>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Recent Orders</h2>
          <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 text-gray-500">
                <tr>
                  <th className="px-4 py-3 font-medium">Order ID</th>
                  <th className="px-4 py-3 font-medium">Customer</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">{order.id}</td>
                    <td className="px-4 py-3 text-gray-600">{order.customer}</td>
                    <td className="px-4 py-3">
                      <StatusBadge status={order.status} />
                    </td>
                    <td className="px-4 py-3 text-right text-gray-900">{order.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Recent Activity</h2>
          <div className="rounded-lg bg-white p-4 shadow-sm border border-gray-100 space-y-4">
            {recentActivity.map((item, index) => (
              <div
                key={index}
                className="flex items-start gap-3"
              >
                <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-blue-500" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{item.action}</p>
                  <p className="text-sm text-gray-500">{item.detail}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}