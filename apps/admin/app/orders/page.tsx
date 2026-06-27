"use client";

import * as React from "react";
import { AdminLayout } from "@/components/admin-layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog } from "@/components/ui/dialog";
import { Select } from "@/components/ui/select";
import { orderService, type Order, type OrderStatus } from "@/services/order.service";

function StatusBadge({ status }: { status: OrderStatus }) {
  const variantMap: Record<string, "success" | "warning" | "primary" | "destructive" | "default"> = {
    pending: "warning",
    confirmed: "primary",
    preparing: "default",
    ready: "primary",
    "out-for-delivery": "primary",
    delivered: "success",
    cancelled: "destructive",
  };
  return <Badge variant={variantMap[status] || "default"}>{status}</Badge>;
}

interface UpdateStatusModalProps {
  open: boolean;
  onClose: () => void;
  orderId: string;
  onUpdate: (status: OrderStatus, notes?: string) => void;
}

function UpdateStatusModal({ open, onClose, orderId, onUpdate }: UpdateStatusModalProps) {
  const [status, setStatus] = React.useState<OrderStatus | "">("");
  const [notes, setNotes] = React.useState("");

  const statusOptions = [
    { value: "pending", label: "Pending" },
    { value: "confirmed", label: "Confirmed" },
    { value: "preparing", label: "Preparing" },
    { value: "ready", label: "Ready" },
    { value: "out-for-delivery", label: "Out for Delivery" },
    { value: "delivered", label: "Delivered" },
    { value: "cancelled", label: "Cancelled" },
  ];

  React.useEffect(() => {
    if (!open) {
      setStatus("");
      setNotes("");
    }
  }, [open]);

  const handleUpdate = () => {
    if (status) {
      onUpdate(status, notes);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="Update Order Status"
      description={`Update status for ${orderId}`}
      footer={
        <>
          <Button variant="ghost" size="sm" onClick={onClose}>Cancel</Button>
          <Button variant="primary" size="sm" disabled={!status} onClick={handleUpdate}>Update Status</Button>
        </>
      }
    >
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium text-gray-700">Order Status</label>
          <Select
            options={statusOptions}
            placeholder="Select status"
            value={status}
            onChange={(e) => setStatus(e.target.value as OrderStatus)}
          />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700">Notes</label>
          <textarea
            placeholder="Add notes (optional)"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 text-sm rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          />
        </div>
      </div>
    </Dialog>
  );
}

function LoadingSkeleton() {
  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
      <table className="w-full text-sm text-left">
        <thead className="bg-gray-50 text-gray-500">
          <tr>
            <th className="px-4 py-3 font-medium whitespace-nowrap">Order ID</th>
            <th className="px-4 py-3 font-medium whitespace-nowrap">Customer</th>
            <th className="px-4 py-3 font-medium whitespace-nowrap">Total</th>
            <th className="px-4 py-3 font-medium whitespace-nowrap">Payment</th>
            <th className="px-4 py-3 font-medium whitespace-nowrap">Status</th>
            <th className="px-4 py-3 font-medium whitespace-nowrap">Date</th>
            <th className="px-4 py-3 font-medium text-right whitespace-nowrap">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {Array.from({ length: 5 }).map((_, i) => (
            <tr key={i} className="animate-pulse">
              <td className="px-4 py-3"><div className="h-4 bg-gray-200 rounded w-20"></div></td>
              <td className="px-4 py-3"><div className="h-4 bg-gray-200 rounded w-24"></div></td>
              <td className="px-4 py-3"><div className="h-4 bg-gray-200 rounded w-16"></div></td>
              <td className="px-4 py-3"><div className="h-4 bg-gray-200 rounded w-20"></div></td>
              <td className="px-4 py-3"><div className="h-4 bg-gray-200 rounded w-16"></div></td>
              <td className="px-4 py-3"><div className="h-4 bg-gray-200 rounded w-20"></div></td>
              <td className="px-4 py-3"><div className="h-4 bg-gray-200 rounded w-32 ml-auto"></div></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ErrorState({ error, onRetry }: { error: string; onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 bg-white rounded-lg border border-gray-200">
      <p className="text-red-600 mb-4">{error}</p>
      <Button variant="outline" size="sm" onClick={onRetry}>Try Again</Button>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-12 bg-white rounded-lg border border-gray-200">
      <p className="text-gray-500">No orders found.</p>
    </div>
  );
}

export default function OrdersPage() {
  const [orders, setOrders] = React.useState<Order[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [modalOpen, setModalOpen] = React.useState(false);
  const [selectedOrderId, setSelectedOrderId] = React.useState("");

  const fetchOrders = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await orderService.getOrders();
      setOrders(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleUpdateStatus = (orderId: string) => {
    setSelectedOrderId(orderId);
    setModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this order?")) {
      try {
        await orderService.deleteOrder(id);
        fetchOrders();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to delete order");
      }
    }
  };

  const handleStatusUpdate = async (status: OrderStatus, notes?: string) => {
    try {
      await orderService.updateOrderStatus(selectedOrderId, status, notes);
      setModalOpen(false);
      fetchOrders();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update order status");
    }
  };

  return (
    <AdminLayout breadcrumbItems={[{ label: "Orders" }]}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
          <p className="mt-1 text-gray-500">Manage customer orders.</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
          <div className="flex flex-col sm:flex-row flex-1 gap-3">
            <input
              type="search"
              placeholder="Search orders..."
              className="px-3 py-2 text-sm rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:max-w-xs"
            />
            <select className="px-3 py-2 text-sm rounded-md border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 sm:w-40">
              <option value="">Status</option>
              <option value="delivered">Delivered</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="preparing">Preparing</option>
              <option value="ready">Ready</option>
              <option value="out-for-delivery">Out for Delivery</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <select className="px-3 py-2 text-sm rounded-md border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 sm:w-44">
              <option value="">Date Range</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="year">This Year</option>
            </select>
          </div>
        </div>

        {loading && <LoadingSkeleton />}
        {error && !loading && <ErrorState error={error} onRetry={fetchOrders} />}
        {!loading && !error && orders.length === 0 && <EmptyState />}
        
        {!loading && !error && orders.length > 0 && (
          <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 text-gray-500">
                <tr>
                  <th className="px-4 py-3 font-medium whitespace-nowrap">Order ID</th>
                  <th className="px-4 py-3 font-medium whitespace-nowrap">Customer</th>
                  <th className="px-4 py-3 font-medium whitespace-nowrap">Total</th>
                  <th className="px-4 py-3 font-medium whitespace-nowrap">Payment</th>
                  <th className="px-4 py-3 font-medium whitespace-nowrap">Status</th>
                  <th className="px-4 py-3 font-medium whitespace-nowrap">Date</th>
                  <th className="px-4 py-3 font-medium text-right whitespace-nowrap">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap">{order.id}</td>
                    <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{order.customer}</td>
                    <td className="px-4 py-3 text-gray-900 whitespace-nowrap">${order.total.toFixed(2)}</td>
                    <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{order.payment}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <StatusBadge status={order.status} />
                    </td>
                    <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{order.date}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2 justify-end">
                        <Button variant="ghost" size="sm">View</Button>
                        <Button variant="outline" size="sm" onClick={() => handleUpdateStatus(order.id)}>Update Status</Button>
                        <Button variant="destructive" size="sm" onClick={() => handleDelete(order.id)}>Delete</Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <UpdateStatusModal open={modalOpen} onClose={() => setModalOpen(false)} orderId={selectedOrderId} onUpdate={handleStatusUpdate} />
    </AdminLayout>
  );
}