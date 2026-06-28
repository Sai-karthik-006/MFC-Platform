"use client";

import * as React from "react";
import { AdminLayout } from "@/components/admin-layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog } from "@/components/ui/dialog";
import { Select } from "@/components/ui/select";

import { cateringService, type CateringRequest, type CateringDetail, type CateringStatus } from "@/services/catering.service";


function StatusBadge({ status }: { status: string }) {
  const variantMap: Record<string, "success" | "warning" | "destructive"> = {
    Confirmed: "success",
    Pending: "warning",
    Completed: "success",
    Rejected: "destructive",
  };
  return <Badge variant={variantMap[status] || "default"}>{status}</Badge>;
}

export default function CateringPage() {
  const [requests, setRequests] = React.useState<CateringRequest[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [viewId, setViewId] = React.useState<string | null>(null);
  const [statusId, setStatusId] = React.useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = React.useState<CateringStatus | "">("");
  const [notes, setNotes] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);

  const detail = viewId ? (requests.find((r) => r.id === viewId) as CateringDetail | undefined) ?? null : null;
  const statusOptions: CateringStatus[] = ["New", "Contacted", "Quotation Sent", "Confirmed", "Completed", "Cancelled"];

  const fetchRequests = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await cateringService.getRequests();
      setRequests(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load catering requests");
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const handleOpenView = (id: string) => setViewId(id);
  const handleOpenStatus = (id: string) => {
    setStatusId(id);
    setSelectedStatus("");
    setNotes("");
  };
  const handleCloseView = () => setViewId(null);
  const handleCloseStatus = () => {
    setStatusId(null);
    setSubmitting(false);
  };

  const handleUpdateStatus = async () => {
    if (!statusId || !selectedStatus) return;
    setSubmitting(true);
    try {
      await cateringService.updateRequestStatus(statusId, selectedStatus, notes);
      setRequests((prev) => prev.map((r) => (r.id === statusId ? { ...r, status: selectedStatus } : r)));
      handleCloseStatus();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update status");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await cateringService.deleteRequest(id);
      setRequests((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete request");
    }
  };

  return (
    <AdminLayout breadcrumbItems={[{ label: "Catering" }]}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Catering Requests</h1>
          <p className="mt-1 text-gray-500">Manage corporate and event catering requests.</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
          <div className="flex flex-1 flex-col sm:flex-row gap-3">
            <input
              type="search"
              placeholder="Search requests..."
              className="flex-1 px-3 py-2 text-sm rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <select className="px-3 py-2 text-sm rounded-md border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">Status</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="completed">Completed</option>
              <option value="rejected">Rejected</option>
            </select>
            <input
              type="date"
              className="px-3 py-2 text-sm rounded-md border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {error && (
          <div className="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
            <button
              type="button"
              onClick={fetchRequests}
              className="ml-4 underline"
            >
              Retry
            </button>
          </div>
        )}

        <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-500">
              <tr>
                <th className="px-4 py-3 font-medium">Request ID</th>
                <th className="px-4 py-3 font-medium">Company / Customer</th>
                <th className="px-4 py-3 font-medium">Event Date</th>
                <th className="px-4 py-3 font-medium">Guests</th>
                <th className="px-4 py-3 font-medium">Budget</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    <td className="px-4 py-3"><Skeleton className="h-4 w-16" /></td>
                    <td className="px-4 py-3"><Skeleton className="h-4 w-32" /></td>
                    <td className="px-4 py-3"><Skeleton className="h-4 w-24" /></td>
                    <td className="px-4 py-3"><Skeleton className="h-4 w-12" /></td>
                    <td className="px-4 py-3"><Skeleton className="h-4 w-16" /></td>
                    <td className="px-4 py-3"><Skeleton className="h-6 w-20" /></td>
                    <td className="px-4 py-3"><Skeleton className="h-8 w-36" /></td>
                  </tr>
                ))
              ) : requests.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-gray-500">
                    No catering requests found.
                  </td>
                </tr>
              ) : (
                requests.map((request) => (
                  <tr key={request.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">{request.id}</td>
                    <td className="px-4 py-3 text-gray-600">{request.company}</td>
                    <td className="px-4 py-3 text-gray-600">{request.eventDate}</td>
                    <td className="px-4 py-3 text-gray-900">{request.guests}</td>
                    <td className="px-4 py-3 text-gray-900">${request.budget.toLocaleString()}</td>
                    <td className="px-4 py-3">
                      <StatusBadge status={request.status} />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" onClick={() => handleOpenView(request.id)}>View</Button>
                        <Button variant="outline" size="sm" onClick={() => handleOpenStatus(request.id)}>Update Status</Button>
                        <Button variant="destructive" size="sm" onClick={() => handleDelete(request.id)}>Delete</Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <Dialog open={!!viewId} onClose={handleCloseView} title="Request Details">
          {detail && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-500">Company / Customer</label>
                  <p className="text-sm font-medium text-gray-900">{detail.company}</p>
                </div>
                <div>
                  <label className="text-xs text-gray-500">Contact Person</label>
                  <p className="text-sm font-medium text-gray-900">{detail.contactPerson || "—"}</p>
                </div>
                <div>
                  <label className="text-xs text-gray-500">Phone</label>
                  <p className="text-sm font-medium text-gray-900">{detail.phone || "—"}</p>
                </div>
                <div>
                  <label className="text-xs text-gray-500">Email</label>
                  <p className="text-sm font-medium text-gray-900">{detail.email || "—"}</p>
                </div>
                <div>
                  <label className="text-xs text-gray-500">Event Date</label>
                  <p className="text-sm font-medium text-gray-900">{detail.eventDate}</p>
                </div>
                <div>
                  <label className="text-xs text-gray-500">Event Time</label>
                  <p className="text-sm font-medium text-gray-900">{detail.eventTime || "—"}</p>
                </div>
                <div className="col-span-2">
                  <label className="text-xs text-gray-500">Venue</label>
                  <p className="text-sm font-medium text-gray-900">{detail.venue || "—"}</p>
                </div>
                <div>
                  <label className="text-xs text-gray-500">Guest Count</label>
                  <p className="text-sm font-medium text-gray-900">{detail.guests}</p>
                </div>
                <div>
                  <label className="text-xs text-gray-500">Budget</label>
                  <p className="text-sm font-medium text-gray-900">${detail.budget.toLocaleString()}</p>
                </div>
                <div className="col-span-2">
                  <label className="text-xs text-gray-500">Selected Menu</label>
                  <p className="text-sm font-medium text-gray-900">{detail.selectedMenu || "—"}</p>
                </div>
                <div className="col-span-2">
                  <label className="text-xs text-gray-500">Special Instructions</label>
                  <p className="text-sm font-medium text-gray-900">{detail.specialInstructions || "—"}</p>
                </div>
              </div>
            </div>
          )}
        </Dialog>

        <Dialog open={!!statusId} onClose={handleCloseStatus} title="Update Status" footer={
          <>
            <Button variant="outline" onClick={handleCloseStatus}>Cancel</Button>
            <Button disabled={!selectedStatus || submitting} onClick={handleUpdateStatus}>Update</Button>
          </>
        }>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Status</label>
              <Select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value as CateringStatus)}
                options={statusOptions.map((s) => ({ value: s, label: s }))}
                placeholder="Select a status"
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Notes</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add optional notes..."
                className="mt-1 w-full px-3 py-2 text-sm rounded-md border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </Dialog>
      </div>
    </AdminLayout>
  );
}