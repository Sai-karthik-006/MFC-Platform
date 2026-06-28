'use client';

import { useEffect, useState } from 'react';
import { PageWrapper } from '../../src/components/layout/page-wrapper';
import { Card, CardContent } from '../../src/components/ui/card';
import { EmptyState } from '../../src/components/ui/empty-state';
import { orderService, type Order } from '../../src/services/order.service';
import { ProtectedRoute } from '../../src/components/ProtectedRoute';

function StatusBadge({ status }: { status: Order['status'] }) {
  const statusStyles: Record<Order['status'], string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-blue-100 text-blue-800',
    shipped: 'bg-purple-100 text-purple-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
  };

  const statusLabels: Record<Order['status'], string> = {
    pending: 'Pending',
    confirmed: 'Confirmed',
    shipped: 'Shipped',
    delivered: 'Delivered',
    cancelled: 'Cancelled',
  };

  return (
    <span className={[
      'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize',
      statusStyles[status],
    ].join(' ')}>
      {statusLabels[status]}
    </span>
  );
}

function OrderCard({ order }: { order: Order }) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <div>
              <p className="text-sm text-gray-500">Order ID</p>
              <p className="font-semibold text-gray-900">{order.id}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Date</p>
              <p className="text-gray-900">{order.date}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm text-gray-500">Total</p>
              <p className="font-semibold text-gray-900">₹{order.total}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Items</p>
              <p className="text-gray-900">{order.itemCount}</p>
            </div>
            <StatusBadge status={order.status} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function OrdersPage() {
  return (
    <ProtectedRoute>
      <OrdersList />
    </ProtectedRoute>
  );
}

function OrdersList() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    orderService
      .getOrders()
      .then(setOrders)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <PageWrapper title="My Orders" description="View your order history">
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
            <p className="mt-4 text-gray-600">Loading orders...</p>
          </div>
        </div>
      </PageWrapper>
    );
  }

  if (error) {
    return (
      <PageWrapper title="My Orders" description="View your order history">
        <div className="flex min-h-[60vh] items-center justify-center px-4">
          <EmptyState
            title="Failed to load orders"
            description={error}
            actionLabel="Try Again"
            onAction={() => window.location.reload()}
          />
        </div>
      </PageWrapper>
    );
  }

  if (orders.length === 0) {
    return (
      <PageWrapper title="My Orders" description="View your order history">
        <div className="flex min-h-[60vh] items-center justify-center px-4">
          <EmptyState
            title="No orders found"
            description="You haven't placed any orders yet."
            actionLabel="Start Shopping"
          />
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper title="My Orders" description="View your order history">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="space-y-4">
          {orders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      </div>
    </PageWrapper>
  );
}