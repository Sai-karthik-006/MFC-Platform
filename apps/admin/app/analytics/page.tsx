"use client";

import * as React from "react";
import { AdminLayout } from "@/components/admin-layout";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  analyticsService,
  type AnalyticsResponse,
} from "@/services/analytics.service";

const kpiSkeleton = (
  <div className="animate-pulse space-y-6">
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="rounded-lg border border-gray-200 bg-white p-5">
          <div className="h-4 w-24 bg-gray-200 rounded" />
          <div className="mt-4 h-8 w-32 bg-gray-200 rounded" />
          <div className="mt-3 h-3 w-20 bg-gray-200 rounded" />
        </div>
      ))}
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div className="rounded-lg border border-gray-200 bg-white p-5">
        <div className="h-4 w-32 bg-gray-200 rounded mb-4" />
        <div className="h-[300px] bg-gray-100 rounded" />
      </div>
      <div className="rounded-lg border border-gray-200 bg-white p-5">
        <div className="h-4 w-32 bg-gray-200 rounded mb-4" />
        <div className="h-[300px] bg-gray-100 rounded" />
      </div>
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div className="rounded-lg border border-gray-200 bg-white p-5">
        <div className="h-4 w-32 bg-gray-200 rounded mb-4" />
        <div className="h-[300px] bg-gray-100 rounded" />
      </div>
      <div className="rounded-lg border border-gray-200 bg-white p-5">
        <div className="h-4 w-32 bg-gray-200 rounded mb-4" />
        <div className="h-[300px] bg-gray-100 rounded" />
      </div>
    </div>
  </div>
);

const errorState = (
  <div className="flex flex-col items-center justify-center py-20">
    <svg className="w-12 h-12 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
    </svg>
    <p className="mt-4 text-gray-900 font-semibold">Failed to load analytics</p>
    <p className="mt-1 text-sm text-gray-500">Please try again later.</p>
  </div>
);

const emptyState = (
  <div className="flex flex-col items-center justify-center py-20">
    <svg className="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6m6 0h6m-6 0V9a2 2 0 012-2h2a2 2 0 012 2v10m6 0v-4a2 2 0 00-2-2h-2a2 2 0 00-2 2v4" />
    </svg>
    <p className="mt-4 text-gray-900 font-semibold">No data available</p>
    <p className="mt-1 text-sm text-gray-500">There are no analytics for the selected period.</p>
  </div>
);

const dateRanges = [
  { value: "today", label: "Today" },
  { value: "week", label: "This Week" },
  { value: "month", label: "This Month" },
  { value: "year", label: "This Year" },
  { value: "custom", label: "Custom" },
];

const PIE_COLORS = ["#3b82f6", "#6366f1", "#8b5cf6", "#d946ef", "#f43f5e"];

function KpiCards({ data }: { data: AnalyticsResponse["kpi"] }) {
  const cards = [
    { title: "Total Revenue", value: data.revenue, change: data.revenueChange, positive: !data.revenueChange.startsWith("-") },
    { title: "Total Orders", value: data.orders.toLocaleString(), change: data.ordersChange, positive: !data.ordersChange.startsWith("-") },
    { title: "Total Customers", value: data.customers.toLocaleString(), change: data.customersChange, positive: !data.customersChange.startsWith("-") },
    { title: "Total Products", value: data.products.toLocaleString(), change: "+0%", positive: true },
  ];
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => (
        <div key={card.title} className="rounded-lg border border-gray-200 bg-white p-5">
          <p className="text-sm text-gray-500">{card.title}</p>
          <p className="mt-2 text-2xl font-bold text-gray-900">{card.value}</p>
          <p className={`mt-2 text-sm ${card.positive ? "text-green-600" : "text-red-600"}`}>
            {card.change} <span className="text-gray-400 font-normal">vs last period</span>
          </p>
        </div>
      ))}
    </div>
  );
}

function RevenueTrendChart({ data }: { data: AnalyticsResponse["revenueTrend"] }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis dataKey="period" tick={{ fontSize: 12, fill: "#6b7280" }} stroke="#e5e7eb" />
        <YAxis tick={{ fontSize: 12, fill: "#6b7280" }} stroke="#e5e7eb" />
        <Tooltip
          contentStyle={{ borderRadius: 8, border: "1px solid #e5e7eb", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)" }}
          labelStyle={{ color: "#374151", fontWeight: 600 }}
        />
        <Legend wrapperStyle={{ paddingTop: 16 }} />
        <Line
          type="monotone"
          dataKey="revenue"
          name="Revenue"
          stroke="#6366f1"
          strokeWidth={3}
          dot={{ r: 4, fill: "#6366f1" }}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

function OrdersTrendChart({ data }: { data: AnalyticsResponse["ordersTrend"] }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis dataKey="period" tick={{ fontSize: 12, fill: "#6b7280" }} stroke="#e5e7eb" />
        <YAxis tick={{ fontSize: 12, fill: "#6b7280" }} stroke="#e5e7eb" />
        <Tooltip
          contentStyle={{ borderRadius: 8, border: "1px solid #e5e7eb", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)" }}
          labelStyle={{ color: "#374151", fontWeight: 600 }}
        />
        <Legend wrapperStyle={{ paddingTop: 16 }} />
        <Bar dataKey="orders" name="Orders" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

function TopProductsChart({ data }: { data: AnalyticsResponse["topProducts"] }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} layout="vertical" margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
        <XAxis type="number" tick={{ fontSize: 12, fill: "#6b7280" }} stroke="#e5e7eb" />
        <YAxis dataKey="name" type="category" tick={{ fontSize: 12, fill: "#6b7280" }} width={120} stroke="#e5e7eb" />
        <Tooltip
          contentStyle={{ borderRadius: 8, border: "1px solid #e5e7eb", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)" }}
          labelStyle={{ color: "#374151", fontWeight: 600 }}
        />
        <Legend wrapperStyle={{ paddingTop: 16 }} />
        <Bar dataKey="sold" name="Units Sold" fill="#3b82f6" radius={[0, 6, 6, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

function CategoryPieChart({ data }: { data: AnalyticsResponse["categoryDistribution"] }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={100}
          paddingAngle={2}
          dataKey="value"
          nameKey="name"
          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          labelLine={{ stroke: "#9ca3af", strokeWidth: 1 }}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{ borderRadius: 8, border: "1px solid #e5e7eb", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)" }}
          formatter={(value: number, name: string) => [`${value}%`, name]}
        />
        <Legend wrapperStyle={{ paddingTop: 16 }} />
      </PieChart>
    </ResponsiveContainer>
  );
}

function ChartCard({ title, children, className = "" }: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-lg border border-gray-200 bg-white p-5 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
      </div>
      {children}
    </div>
  );
}

export default function AnalyticsPage() {
  const [dateRange, setDateRange] = React.useState<"today" | "week" | "month" | "year" | "custom">("month");
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [data, setData] = React.useState<AnalyticsResponse | null>(null);

  const fetchAnalytics = React.useCallback(
    async (range: "today" | "week" | "month" | "year" | "custom") => {
      setLoading(true);
      setError(null);
      try {
        const result = await analyticsService.getAnalytics({ dateRange: range });
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load analytics");
        setData(null);
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  React.useEffect(() => {
    fetchAnalytics(dateRange);
  }, [dateRange, fetchAnalytics]);

  return (
    <AdminLayout breadcrumbItems={[{ label: "Analytics" }]}>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
            <p className="mt-1 text-gray-500">Monitor business performance.</p>
          </div>
          <div className="w-full sm:w-48">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value as "today" | "week" | "month" | "year" | "custom")}
              className="w-full px-3 py-2 text-sm rounded-md border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {dateRanges.map((range) => (
                <option key={range.value} value={range.value}>
                  {range.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {loading
          ? kpiSkeleton
          : error
          ? errorState
          : !data
          ? emptyState
          : (
            <>
              <KpiCards data={data.kpi} />

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <ChartCard title="Revenue Trend">
                  <RevenueTrendChart data={data.revenueTrend} />
                </ChartCard>
                <ChartCard title="Orders Trend">
                  <OrdersTrendChart data={data.ordersTrend} />
                </ChartCard>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <ChartCard title="Top Selling Products">
                  <TopProductsChart data={data.topProducts} />
                </ChartCard>
                <ChartCard title="Category Distribution">
                  <CategoryPieChart data={data.categoryDistribution} />
                </ChartCard>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="rounded-lg border border-gray-200 bg-white">
                  <div className="p-5 border-b border-gray-100">
                    <h3 className="text-sm font-semibold text-gray-900">Top Customers</h3>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                      <thead className="bg-gray-50 text-gray-500">
                        <tr>
                          <th className="px-5 py-3 font-medium">Customer</th>
                          <th className="px-5 py-3 font-medium">Total Spent</th>
                          <th className="px-5 py-3 font-medium">Orders</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {data.topCustomers.map((customer) => (
                          <tr key={customer.email} className="hover:bg-gray-50">
                            <td className="px-5 py-3">
                              <div>
                                <p className="font-medium text-gray-900">{customer.name}</p>
                                <p className="text-xs text-gray-500">{customer.email}</p>
                              </div>
                            </td>
                            <td className="px-5 py-3 text-gray-900">{customer.spent}</td>
                            <td className="px-5 py-3 text-gray-900">{customer.orders}</td>
                          </tr>
                        ))}
                        {data.topCustomers.length === 0 && (
                          <tr>
                            <td colSpan={3} className="px-5 py-8 text-center text-sm text-gray-500">
                              No customer data
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="rounded-lg border border-gray-200 bg-white">
                  <div className="p-5 border-b border-gray-100">
                    <h3 className="text-sm font-semibold text-gray-900">Recent Sales</h3>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                      <thead className="bg-gray-50 text-gray-500">
                        <tr>
                          <th className="px-5 py-3 font-medium">Order ID</th>
                          <th className="px-5 py-3 font-medium">Customer</th>
                          <th className="px-5 py-3 font-medium">Amount</th>
                          <th className="px-5 py-3 font-medium">Status</th>
                          <th className="px-5 py-3 font-medium">Date</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {data.recentSales.map((sale) => (
                          <tr key={sale.id} className="hover:bg-gray-50">
                            <td className="px-5 py-3 font-medium text-gray-900 whitespace-nowrap">{sale.id}</td>
                            <td className="px-5 py-3 text-gray-600">{sale.customer}</td>
                            <td className="px-5 py-3 text-gray-900">{sale.amount}</td>
                            <td className="px-5 py-3">
                              <span
                                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                  sale.status === "Completed"
                                    ? "bg-green-100 text-green-800"
                                    : sale.status === "Confirmed" || sale.status === "Processing"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : sale.status === "Shipped" || sale.status === "Ready" || sale.status === "Preparing"
                                    ? "bg-blue-100 text-blue-800"
                                    : sale.status === "Cancelled"
                                    ? "bg-red-100 text-red-800"
                                    : "bg-gray-100 text-gray-800"
                                }`}
                              >
                                {sale.status}
                              </span>
                            </td>
                            <td className="px-5 py-3 text-gray-600 whitespace-nowrap">{sale.date}</td>
                          </tr>
                        ))}
                        {data.recentSales.length === 0 && (
                          <tr>
                            <td colSpan={5} className="px-5 py-8 text-center text-sm text-gray-500">
                              No sales data
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </>
          )}
      </div>
    </AdminLayout>
  );
}
