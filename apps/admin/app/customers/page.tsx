"use client";

import * as React from "react";
import { AdminLayout } from "@/components/admin-layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { customerService, type Customer } from "@/services/customer.service";

function StatusBadge({ status }: { status: string }) {
  const variantMap: Record<string, "success" | "warning" | "destructive"> = {
    Active: "success",
    Inactive: "warning",
    Suspended: "destructive",
  };
  return <Badge variant={variantMap[status] || "default"}>{status}</Badge>;
}

function CustomerTableSkeleton() {
  return (
    <tbody className="divide-y divide-gray-100">
      {Array.from({ length: 5 }).map((_, i) => (
        <tr key={i} className="hover:bg-gray-50">
          <td className="px-4 py-3">
            <Skeleton variant="text" width="70%" height={16} />
          </td>
          <td className="px-4 py-3">
            <Skeleton variant="text" width="80%" height={16} />
          </td>
          <td className="px-4 py-3">
            <Skeleton variant="text" width="60%" height={16} />
          </td>
          <td className="px-4 py-3">
            <Skeleton variant="text" width="30%" height={16} />
          </td>
          <td className="px-4 py-3">
            <Skeleton variant="text" width="50%" height={16} />
          </td>
          <td className="px-4 py-3">
            <Skeleton variant="rectangular" width={80} height={22} />
          </td>
          <td className="px-4 py-3">
            <Skeleton variant="rectangular" width={120} height={32} />
          </td>
        </tr>
      ))}
    </tbody>
  );
}

export default function CustomersPage() {
  const [customers, setCustomers] = React.useState<Customer[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const fetchCustomers = React.useCallback(async () => {
    try {
      setError(null);
      const data = await customerService.getCustomers();
      setCustomers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load customers');
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  const handleDisable = React.useCallback(
    async (id: string) => {
      try {
        await customerService.disableCustomer(id);
        setCustomers((prev) =>
          prev.map((customer) =>
            customer.id === id ? { ...customer, status: 'Inactive' as const } : customer
          )
        );
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to disable customer');
      }
    },
    []
  );

  return (
    <AdminLayout breadcrumbItems={[{ label: "Customers" }]}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Customers</h1>
          <p className="mt-1 text-gray-500">Manage registered customers.</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
          <div className="flex flex-1 flex-col sm:flex-row gap-3">
            <input
              type="search"
              placeholder="Search customers..."
              className="flex-1 px-3 py-2 text-sm rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <select className="px-3 py-2 text-sm rounded-md border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-500">
              <tr>
                <th className="px-4 py-3 font-medium">Customer Name</th>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Phone</th>
                <th className="px-4 py-3 font-medium">Total Orders</th>
                <th className="px-4 py-3 font-medium">Total Spent</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            {loading ? (
              <CustomerTableSkeleton />
            ) : error ? (
              <tbody>
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <p className="text-red-600 font-medium">Failed to load customers</p>
                      <p className="mt-1 text-gray-500 text-sm">{error}</p>
                      <Button onClick={fetchCustomers} className="mt-4">
                        Retry
                      </Button>
                    </div>
                  </td>
                </tr>
              </tbody>
            ) : customers.length === 0 ? (
              <tbody>
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <p className="text-gray-900 font-medium">No customers found</p>
                      <p className="mt-1 text-gray-500 text-sm">There are no customers to display.</p>
                    </div>
                  </td>
                </tr>
              </tbody>
            ) : (
              <tbody className="divide-y divide-gray-100">
                {customers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">{customer.name}</td>
                    <td className="px-4 py-3 text-gray-600">{customer.email}</td>
                    <td className="px-4 py-3 text-gray-600">{customer.phone}</td>
                    <td className="px-4 py-3 text-gray-900">{customer.totalOrders}</td>
                    <td className="px-4 py-3 text-gray-900">${customer.totalSpent.toFixed(2)}</td>
                    <td className="px-4 py-3">
                      <StatusBadge status={customer.status} />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm">View</Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDisable(customer.id)}
                        >
                          Disable
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            )}
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
