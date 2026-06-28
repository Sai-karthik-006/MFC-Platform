"use client";

import * as React from "react";

interface Order {
  id: string;
  orderNumber?: string;
  customer: string;
  address: string;
  amount: string;
  distance: string;
  status: "assigned" | "pending" | "in-progress" | "delivered";
  createdAt?: string;
}

const statusVariantMap: Record<Order["status"], string> = {
  assigned: "bg-blue-100 text-blue-800",
  pending: "bg-yellow-100 text-yellow-800",
  "in-progress": "bg-gray-100 text-gray-800",
  delivered: "bg-green-100 text-green-800",
};

const statusLabelMap: Record<Order["status"], string> = {
  assigned: "Assigned",
  pending: "Pending",
  "in-progress": "In Progress",
  delivered: "Delivered",
};

function Badge({
  variant,
  className = "",
  children,
  ...props
}: { variant?: string; className?: string; children: React.ReactNode } & React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={[
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        variant,
        className,
      ].join(" ")}
      {...props}
    >
      {children}
    </span>
  );
}

function Button({
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...props
}: {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "destructive";
  size?: "sm" | "md" | "lg";
  className?: string;
  children: React.ReactNode;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const variantStyles: Record<string, string> = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
    secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-500",
    outline: "border border-gray-300 bg-transparent text-gray-700 hover:bg-gray-50 focus:ring-gray-500",
    ghost: "bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-gray-500",
    destructive: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
  };

  const sizeStyles: Record<string, string> = {
    sm: "h-8 px-3 text-sm rounded-md",
    md: "h-10 px-4 text-sm rounded-md",
    lg: "h-12 px-6 text-base rounded-lg",
  };

  return (
    <button
      className={[
        "inline-flex items-center justify-center gap-2 font-medium",
        "transition-colors duration-150",
        "focus:outline-none focus:ring-2 focus:ring-offset-2",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        variantStyles[variant],
        sizeStyles[size],
        className,
      ].join(" ")}
      {...props}
    >
      {children}
    </button>
  );
}

function Card({ className = "", children, ...props }: { className?: string; children: React.ReactNode } & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={["rounded-lg border border-gray-200 bg-white shadow-sm", className].join(" ")}
      {...props}
    >
      {children}
    </div>
  );
}

function CardHeader({ className = "", children, ...props }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={["p-4 pb-0", className].join(" ")} {...props}>
      {children}
    </div>
  );
}

function CardContent({ className = "", children, ...props }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={["p-4", className].join(" ")} {...props}>
      {children}
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="space-y-1">
          <div className="h-8 w-64 bg-gray-200 rounded animate-pulse" />
          <div className="h-4 w-48 bg-gray-200 rounded animate-pulse" />
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="text-center">
              <CardContent className="p-4 space-y-2">
                <div className="h-8 w-12 bg-gray-200 rounded animate-pulse mx-auto" />
                <div className="h-3 w-20 bg-gray-200 rounded animate-pulse mx-auto" />
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <div className="h-6 w-20 bg-gray-200 rounded animate-pulse" />
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-gray-200">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="p-4 grid grid-cols-5 gap-4">
                  <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
                  <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
                  <div className="h-4 w-48 bg-gray-200 rounded animate-pulse" />
                  <div className="h-4 w-12 bg-gray-200 rounded animate-pulse" />
                  <div className="h-4 w-16 bg-gray-200 rounded animate-pulse justify-self-end" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8 flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="text-red-600 text-6xl">⚠</div>
        <h2 className="text-xl font-semibold text-gray-900">Error Loading Orders</h2>
        <p className="text-gray-600">{message}</p>
        <Button variant="primary" onClick={onRetry}>Try Again</Button>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8 flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="text-gray-400 text-6xl">📦</div>
        <h2 className="text-xl font-semibold text-gray-900">No Orders Available</h2>
        <p className="text-gray-600">There are no assigned orders at the moment.</p>
      </div>
    </div>
  );
}

function OrderRow({ order }: { order: Order }) {
  return (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="px-4 py-4 text-sm font-medium text-gray-900">{order.orderNumber || order.id}</td>
      <td className="px-4 py-4 text-sm text-gray-700">{order.customer}</td>
      <td className="hidden md:table-cell px-4 py-4 text-sm text-gray-600">{order.address}</td>
      <td className="px-4 py-4 text-sm font-medium text-gray-900">{order.amount}</td>
      <td className="hidden sm:table-cell px-4 py-4 text-sm text-gray-600">{order.distance}</td>
      <td className="px-4 py-4">
        <Badge variant={statusVariantMap[order.status]}>{statusLabelMap[order.status]}</Badge>
      </td>
      <td className="px-4 py-4 text-right">
        <div className="flex items-center justify-end gap-2">
          <Button variant="ghost" size="sm">View</Button>
        </div>
      </td>
    </tr>
  );
}

export default function DeliveryDashboard() {
  const [orders, setOrders] = React.useState<Order[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const fetchOrders = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/delivery/orders");
      if (!response.ok) {
        throw new Error("Failed to fetch orders");
      }
      const data = await response.json();
      setOrders(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const stats = [
    { label: "Assigned Orders", value: orders.filter(o => o.status === "assigned").length.toString() },
    { label: "Active Deliveries", value: orders.filter(o => o.status === "in-progress").length.toString() },
    { label: "Completed Today", value: "8" },
    { label: "Earnings Today", value: "$124.50" },
  ];

  if (loading) {
    return <LoadingSkeleton />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={fetchOrders} />;
  }

  if (orders.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="space-y-1">
          <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">Delivery Dashboard</h1>
          <p className="text-gray-600">Manage your assigned deliveries.</p>
        </header>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.label} className="text-center">
              <CardContent className="p-4">
                <p className="text-2xl font-bold text-gray-900 md:text-3xl">{stat.value}</p>
                <p className="text-sm text-gray-600">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-gray-900">Orders</h2>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full min-w-full table-auto">
                <thead className="border-b border-gray-200 bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                    <th className="hidden md:table-cell px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                    <th className="hidden sm:table-cell px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Distance</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {orders.map((order) => (
                    <OrderRow key={order.id} order={order} />
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}