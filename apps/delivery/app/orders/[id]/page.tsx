"use client";

import * as React from "react";
import { deliveryService, type Order, type OrderStatus } from '@/services/delivery.service';

interface TimelineStep {
  status: string;
  active: boolean;
}

function Button({
  variant = "primary",
  size = "md",
  className = "",
  children,
  disabled,
  ...props
}: {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "destructive";
  size?: "sm" | "md" | "lg";
  className?: string;
  children: React.ReactNode;
  disabled?: boolean;
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
      disabled={disabled}
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
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="h-8 w-48 bg-gray-200 rounded animate-pulse mb-2" />
            <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
          </div>
          <div className="flex flex-wrap gap-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-8 w-24 bg-gray-200 rounded-md animate-pulse" />
            ))}
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            {[...Array(3)].map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <div className="h-6 w-40 bg-gray-200 rounded animate-pulse" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[...Array(3)].map((_, j) => (
                      <div key={j} className="h-4 w-full bg-gray-200 rounded animate-pulse" />
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div>
            <Card>
              <CardHeader>
                <div className="h-6 w-32 bg-gray-200 rounded animate-pulse" />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-12 w-full bg-gray-200 rounded animate-pulse" />
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8 flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="text-red-600 text-6xl">⚠</div>
        <h2 className="text-xl font-semibold text-gray-900">Error Loading Order</h2>
        <p className="text-gray-600">{message}</p>
        <Button variant="primary" onClick={onRetry}>Try Again</Button>
      </div>
    </div>
  );
}

function getTimeline(status: OrderStatus): TimelineStep[] {
  const steps: TimelineStep[] = [
    { status: "Assigned", active: false },
    { status: "Accepted", active: false },
    { status: "Picked Up", active: false },
    { status: "Delivered", active: false },
  ];

  switch (status) {
    case "READY":
      steps[0].active = true;
      break;
    case "IN_TRANSIT":
      steps[0].active = true;
      steps[1].active = true;
      steps[2].active = true;
      break;
    case "COMPLETED":
      steps.forEach(step => step.active = true);
      break;
  }

  return steps;
}

export default function OrderDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = React.use(params);
  const orderId = resolvedParams.id;
  const [order, setOrder] = React.useState<Order | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const fetchOrder = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await deliveryService.getOrder(orderId);
      setOrder(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch order");
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  React.useEffect(() => {
    fetchOrder();
    const interval = setInterval(fetchOrder, 5000);
    return () => clearInterval(interval);
  }, [fetchOrder]);

  const handleAction = async (action: 'accept' | 'picked-up' | 'delivered') => {
    try {
      switch (action) {
        case 'accept':
          await deliveryService.acceptOrder(orderId);
          break;
        case 'picked-up':
          await deliveryService.markPickedUp(orderId);
          break;
        case 'delivered':
          await deliveryService.markDelivered(orderId);
          break;
      }
      fetchOrder();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Action failed");
    }
  };

  if (loading) {
    return <LoadingSkeleton />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={fetchOrder} />;
  }

  if (!order) {
    return <ErrorState message="Order not found" onRetry={fetchOrder} />;
  }

  const timeline = getTimeline(order.status as OrderStatus);

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      <div className="mx-auto max-w-4xl space-y-6">
        <header className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">Order {order.id}</h1>
            <p className="text-gray-600">Delivery Details</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => handleAction('accept')}
              disabled={order.status !== 'READY'}
            >
              Accept
            </Button>
            <Button variant="destructive" size="sm">Reject</Button>
            <Button 
              variant="secondary" 
              size="sm" 
              onClick={() => handleAction('picked-up')}
              disabled={order.status !== 'IN_TRANSIT'}
            >
              Picked Up
            </Button>
            <Button 
              variant="secondary" 
              size="sm" 
              onClick={() => handleAction('delivered')}
              disabled={order.status !== 'IN_TRANSIT'}
            >
              Delivered
            </Button>
          </div>
        </header>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <h2 className="text-lg font-semibold text-gray-900">Customer Information</h2>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-500">Customer Name</p>
                    <p className="font-medium text-gray-900">{order.customer}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="font-medium text-gray-900">{order.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Delivery Address</p>
                    <p className="font-medium text-gray-900">{order.address}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <h2 className="text-lg font-semibold text-gray-900">Order Items</h2>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b border-gray-200 bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Item</th>
                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Qty</th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Price</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {order.items.map((item) => (
                        <tr key={item.id}>
                          <td className="px-4 py-4 text-sm font-medium text-gray-900">{item.name}</td>
                          <td className="px-4 py-4 text-center text-sm text-gray-600">{item.quantity}</td>
                          <td className="px-4 py-4 text-right text-sm font-medium text-gray-900">{item.price}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-gray-50">
                      <tr>
                        <td colSpan={2} className="px-4 py-3 text-sm font-medium text-gray-700">Total</td>
                        <td className="px-4 py-3 text-right text-lg font-bold text-gray-900">{order.total}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <h2 className="text-lg font-semibold text-gray-900">Payment & Notes</h2>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Payment Method</p>
                  <p className="font-medium text-gray-900">{order.paymentMethod}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Delivery Notes</p>
                  <p className="font-medium text-gray-900">{order.notes || "No notes"}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader>
                <h2 className="text-lg font-semibold text-gray-900">Delivery Timeline</h2>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {timeline.map((step, index) => (
                    <div key={step.status} className="flex items-start gap-3">
                      <div className="flex flex-col items-center">
                        <div
                          className={[
                            "flex h-8 w-8 items-center justify-center rounded-full",
                            step.active ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-500",
                          ].join(" ")}
                        >
                          <span className="text-sm font-medium">{index + 1}</span>
                        </div>
                        {index < timeline.length - 1 && (
                          <div className="h-8 w-0.5 bg-gray-200" />
                        )}
                      </div>
                      <div className="flex-1 pb-4">
                        <p className={["font-medium", step.active ? "text-gray-900" : "text-gray-500"].join(" ")}>
                          {step.status}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}