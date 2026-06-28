"use client";

import * as React from "react";
import { AdminLayout } from "@/components/admin-layout";
import { Button } from "@/components/ui/button";
import { reportsService, type ReportResponse } from "@/services/reports.service";

interface ReportCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  onGenerate: () => Promise<ReportResponse>;
  onExportCsv: () => Promise<void>;
  onExportPdf: () => Promise<void>;
}

function ReportCard({ title, description, icon, onGenerate, onExportCsv, onExportPdf }: ReportCardProps) {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [report, setReport] = React.useState<ReportResponse | null>(null);
  const [exportingCsv, setExportingCsv] = React.useState(false);
  const [exportingPdf, setExportingPdf] = React.useState(false);
  const [exportError, setExportError] = React.useState<string | null>(null);

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    setReport(null);
    setExportError(null);
    try {
      const data = await onGenerate();
      setReport(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : `Failed to load ${title.toLowerCase()}`);
    } finally {
      setLoading(false);
    }
  };

  const handleExportCsv = async () => {
    setExportingCsv(true);
    setExportError(null);
    try {
      await onExportCsv();
    } catch (err) {
      setExportError(err instanceof Error ? err.message : `Failed to export ${title.toLowerCase()} CSV`);
    } finally {
      setExportingCsv(false);
    }
  };

  const handleExportPdf = async () => {
    setExportingPdf(true);
    setExportError(null);
    try {
      await onExportPdf();
    } catch (err) {
      setExportError(err instanceof Error ? err.message : `Failed to export ${title.toLowerCase()} PDF`);
    } finally {
      setExportingPdf(false);
    }
  };

  const previewColumns = report?.preview.length ? Object.keys(report.preview[0]) : [];
  const summaryEntries = report ? Object.entries(report.summary) : [];

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 flex flex-col">
      <div className="flex items-center gap-3 mb-3">
        {icon}
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      </div>
      <p className="text-sm text-gray-600 mb-4 flex-1">{description}</p>

      {!report && !loading && !error && (
        <div className="flex gap-2">
          <Button variant="primary" size="sm" onClick={handleGenerate}>
            Generate
          </Button>
        </div>
      )}

      {loading && (
        <div className="mt-4 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="animate-pulse h-16 bg-gray-100 rounded-md" />
            <div className="animate-pulse h-16 bg-gray-100 rounded-md" />
            <div className="animate-pulse h-16 bg-gray-100 rounded-md" />
            <div className="animate-pulse h-16 bg-gray-100 rounded-md" />
          </div>
          <div className="animate-pulse h-32 bg-gray-100 rounded-md" />
        </div>
      )}

      {error && (
        <div className="mt-4 rounded-md border border-red-200 bg-red-50 p-4 text-sm">
          <p className="text-red-800 font-medium">Error</p>
          <p className="mt-1 text-red-600">{error}</p>
          <Button variant="outline" size="sm" className="mt-3" onClick={handleGenerate}>
            Retry
          </Button>
        </div>
      )}

      {report && !loading && !error && (
        <div className="mt-4 space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">
              {report.totalRecords} record{report.totalRecords !== 1 ? "s" : ""} &middot; Generated{" "}
              {new Date(report.generatedAt).toLocaleTimeString()}
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleExportCsv}
                disabled={exportingCsv}
              >
                {exportingCsv ? 'Exporting...' : 'Export CSV'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleExportPdf}
                disabled={exportingPdf}
              >
                {exportingPdf ? 'Exporting...' : 'Export PDF'}
              </Button>
              <Button variant="ghost" size="sm" onClick={() => { setReport(null); setExportError(null); }}>
                Clear
              </Button>
            </div>
          </div>

          {exportError && (
            <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm">
              <p className="text-red-600">{exportError}</p>
              <Button variant="outline" size="sm" className="mt-2" onClick={handleExportCsv}>
                Retry
              </Button>
            </div>
          )}

          {summaryEntries.length > 0 && (
            <div className="rounded-md bg-gray-50 p-3">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Summary</p>
              <div className="space-y-1">
                {summaryEntries.map(([key, value]) => (
                  <div key={key} className="flex justify-between text-sm">
                    <span className="text-gray-600">{key}</span>
                    <span className="text-gray-900 font-medium">
                      {typeof value === "object" ? JSON.stringify(value) : String(value)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {previewColumns.length > 0 && (
            <div className="overflow-x-auto rounded-md border border-gray-200">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 text-gray-500">
                  <tr>
                    {previewColumns.map((col) => (
                      <th key={col} className="px-3 py-2 font-medium whitespace-nowrap">{col}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {report.preview.slice(0, 10).map((row, i) => (
                    <tr key={i} className="hover:bg-gray-50">
                      {previewColumns.map((col) => (
                        <td key={col} className="px-3 py-2 text-gray-700 whitespace-nowrap">
                          {typeof row[col] === "object" ? JSON.stringify(row[col]) : String(row[col] ?? "")}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {report.preview.length === 0 && (
            <div className="text-center py-8 text-sm text-gray-500">No data available for this report.</div>
          )}
        </div>
      )}
    </div>
  );
}

export default function ReportsPage() {
  const reportCards = [
    {
      title: "Sales Report",
      description: "View and analyze sales data, revenue trends, and performance metrics.",
      icon: (
        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .896-3 2s1.343 2 3 2 3-.896 3-2-1.343-2-3-2zM3 10h18M3 6h18M3 14h18M3 18h18" />
        </svg>
      ),
      generate: () => reportsService.getSalesReport({ dateRange: "month" }),
      exportCsv: () => reportsService.downloadSalesCsv({ dateRange: "month" }),
      exportPdf: () => reportsService.downloadSalesPdf({ dateRange: "month" }),
    },
    {
      title: "Orders Report",
      description: "Track order history, status changes, and fulfillment metrics.",
      icon: (
        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H5a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-4m-6 0V3a2 2 0 012-2h4a2 2 0 012 2v2M9 5h6" />
        </svg>
      ),
      generate: () => reportsService.getOrdersReport({ dateRange: "month" }),
      exportCsv: () => reportsService.downloadOrdersCsv({ dateRange: "month" }),
      exportPdf: () => reportsService.downloadOrdersPdf({ dateRange: "month" }),
    },
    {
      title: "Customer Report",
      description: "Analyze customer demographics, purchase history, and engagement.",
      icon: (
        <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292 7 7 0 110 9.585 7 7 0 110-9.585 4 4 0 11-5.292-5.292A4 4 0 0112 4.354z" />
        </svg>
      ),
      generate: () => reportsService.getCustomersReport({ dateRange: "month" }),
      exportCsv: () => reportsService.downloadCustomersCsv({ dateRange: "month" }),
      exportPdf: () => reportsService.downloadCustomersPdf({ dateRange: "month" }),
    },
    {
      title: "Product Report",
      description: "Monitor product performance, inventory levels, and category sales.",
      icon: (
        <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4-8-4m16 0v10l-8 4-8-4V7l8 4 8-4z" />
        </svg>
      ),
      generate: () => reportsService.getProductsReport({ dateRange: "month" }),
      exportCsv: () => reportsService.downloadProductsCsv({ dateRange: "month" }),
      exportPdf: () => reportsService.downloadProductsPdf({ dateRange: "month" }),
    },
    {
      title: "Catering Report",
      description: "Review catering orders, menus, and event scheduling details.",
      icon: (
        <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .896-3 2s1.343 2 3 2 3-.896 3-2-1.343-2-3-2zM3 10h18M5 8V6a2 2 0 012-2h6M5 8v10a2 2 0 002 2h6m-8-4l4 4 4-4" />
        </svg>
      ),
      generate: () => reportsService.getCateringReport({ dateRange: "month" }),
      exportCsv: () => reportsService.downloadCateringCsv({ dateRange: "month" }),
      exportPdf: () => reportsService.downloadCateringPdf({ dateRange: "month" }),
    },
  ];

  return (
    <AdminLayout breadcrumbItems={[{ label: "Reports" }]}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
          <p className="mt-1 text-gray-500">Generate business reports.</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" size="sm">Today</Button>
          <Button variant="outline" size="sm">This Week</Button>
          <Button variant="outline" size="sm">This Month</Button>
          <Button variant="outline" size="sm">Custom Range</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reportCards.map((card) => (
            <ReportCard
              key={card.title}
              title={card.title}
              description={card.description}
              icon={card.icon}
              onGenerate={card.generate}
              onExportCsv={card.exportCsv}
              onExportPdf={card.exportPdf}
            />
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
