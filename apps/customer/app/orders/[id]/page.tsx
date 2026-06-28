'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { PageWrapper } from '../../../src/components/layout/page-wrapper';
import { Card, CardContent, CardHeader, CardFooter } from '../../../src/components/ui/card';
import { EmptyState } from '../../../src/components/ui/empty-state';
import { orderService, type OrderDetail } from '../../../src/services/order.service';
import { ProtectedRoute } from '../../../src/components/ProtectedRoute';

interface TimelineStatus {
  status: OrderDetail['status'];
  label: string;
  date?: string;
}

function StatusTimeline({ status }: { status: OrderDetail['status'] }) {
  const statuses: TimelineStatus[] = [
    { status: 'pending', label: 'Order Placed' },
    { status: 'confirmed', label: 'Confirmed' },
    { status: 'shipped', label: 'Preparing' },
    { status: 'delivered', label: 'Picked Up' },
    { status: 'delivered', label: 'Out For Delivery' },
    { status: 'delivered', label: 'Delivered' },
  ];

  const statusOrder: Record<string, number> = {
    pending: 0,
    confirmed: 1,
    shipped: 2,
    delivered: 5,
    cancelled: -1,
  };

  const activeIndex = statusOrder[status];

  return (
    <div className="space-y-4">
      {statuses.map((s, index) => {
        const isActive = index <= activeIndex && activeIndex >= 0;
        const isCurrent = index === activeIndex && activeIndex >= 0;

        return (
          <div key={index} className="flex items-start gap-4">
            <div className="flex flex-col items-center">
              <div
                className={[
                  'flex h-8 w-8 items-center justify-center rounded-full border-2',
                  isCurrent
                    ? 'border-blue-600 bg-blue-600 text-white'
                    : isActive
                      ? 'border-green-600 bg-green-600 text-white'
                      : 'border-gray-300 bg-white text-gray-400',
                ].join(' ')}
              >
                {isActive && (
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              {index < statuses.length - 1 && (
                <div
                  className={[
                    'mt-1 h-8 w-0.5',
                    index < activeIndex ? 'bg-green-600' : 'bg-gray-300',
                  ].join(' ')}
                />
              )}
            </div>
            <div className="flex-1 pb-4">
              <p
                className={[
                  'font-medium',
                  isCurrent ? 'text-blue-600' : isActive ? 'text-gray-900' : 'text-gray-500',
                ].join(' ')}
              >
                {s.label}
              </p>
              <p className="text-sm text-gray-500">{s.date}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function OrderItem({ item }: { item: { name: string; price: number; quantity: number; image?: string } }) {
  return (
    <div className="flex items-center gap-4 py-3">
      <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md bg-gray-100">
        {item.image ? (
          <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-xs text-gray-500">
            Image
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-medium text-gray-900">{item.name}</h3>
        <p className="text-sm text-gray-500">₹{item.price} × {item.quantity}</p>
      </div>
      <p className="font-medium text-gray-900">₹{item.price * item.quantity}</p>
    </div>
  );
}

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <ProtectedRoute>
      <OrderDetail params={params} />
    </ProtectedRoute>
  );
}

function OrderDetail({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = React.use(params);
  const { id } = resolvedParams;
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrder = useCallback(async () => {
    try {
      const data = await orderService.getOrder(id);
      setOrder(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch order');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchOrder();
    const interval = setInterval(fetchOrder, 5000);
    return () => clearInterval(interval);
  }, [fetchOrder]);

  if (loading) {
    return (
      <PageWrapper title="Order Details" description="Loading order information...">
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
            <p className="mt-4 text-gray-600">Loading order...</p>
          </div>
        </div>
      </PageWrapper>
    );
  }

  if (error || !order) {
    return (
      <PageWrapper title="Order Details">
        <div className="flex min-h-[60vh] items-center justify-center px-4">
          <EmptyState
            title="Order not found"
            description={error || 'Unable to load order details.'}
            actionLabel="Back to Orders"
          />
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper title={`Order #${order.id}`}>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold text-gray-900">Order Summary</h2>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Order ID</span>
                <span className="font-medium text-gray-900">{order.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Date</span>
                <span className="font-medium text-gray-900">{order.date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Status</span>
                <span className="font-medium capitalize text-gray-900">{order.status}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total</span>
                <span className="font-medium text-gray-900">₹{order.grandTotal}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold text-gray-900">Customer Information</h2>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-gray-900">{order.customer.fullName}</p>
              <p className="text-gray-600">{order.customer.phoneNumber}</p>
              <p className="text-gray-600">{order.customer.email}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold text-gray-900">Delivery Address</h2>
            </CardHeader>
            <CardContent>
              <p className="text-gray-900">
                {order.address.houseFlatNo}, {order.address.street}
              </p>
              {order.address.landmark && <p className="text-gray-600">{order.address.landmark}</p>}
              <p className="text-gray-600">
                {order.address.city}, {order.address.state} - {order.address.pincode}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold text-gray-900">Ordered Items</h2>
            </CardHeader>
            <CardContent className="divide-y divide-gray-200">
              {order.items.map((item, index) => (
                <OrderItem key={index} item={item} />
              ))}
            </CardContent>
            <CardFooter>
              <div className="w-full space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="text-gray-900">₹{order.subtotal}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Delivery Fee</span>
                  <span className="text-gray-900">₹{order.deliveryFee}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax</span>
                  <span className="text-gray-900">₹{order.tax}</span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Discount</span>
                    <span className="text-green-600">-₹{order.discount}</span>
                  </div>
                )}
                <div className="border-t border-gray-200 pt-2">
                  <div className="flex justify-between font-semibold">
                    <span className="text-gray-900">Grand Total</span>
                    <span className="text-gray-900">₹{order.grandTotal}</span>
                  </div>
                </div>
              </div>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold text-gray-900">Payment Method</h2>
            </CardHeader>
            <CardContent>
              <p className="capitalize text-gray-900">{order.paymentMethod}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold text-gray-900">Status Timeline</h2>
            </CardHeader>
            <CardContent>
              <StatusTimeline status={order.status} />
            </CardContent>
          </Card>
        </div>
      </div>
    </PageWrapper>
  );
}