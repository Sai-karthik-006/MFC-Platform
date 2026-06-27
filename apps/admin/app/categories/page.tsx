"use client";

import * as React from "react";
import { AdminLayout } from "@/components/admin-layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Dialog } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { categoryService } from "@/services/category.service";

function StatusBadge({ status }: { status: string }) {
  const variantMap: Record<string, "success" | "destructive"> = {
    Active: "success",
    Inactive: "destructive",
  };
  return <Badge variant={variantMap[status] || "default"}>{status}</Badge>;
}

function CategoriesTableSkeleton() {
  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
      <table className="w-full text-sm text-left">
        <thead className="bg-gray-50 text-gray-500">
          <tr>
            <th className="px-4 py-3 font-medium">Category Name</th>
            <th className="px-4 py-3 font-medium">Description</th>
            <th className="px-4 py-3 font-medium">Products Count</th>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3 font-medium">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {Array.from({ length: 5 }).map((_, i) => (
            <tr key={i} className="animate-pulse">
              <td className="px-4 py-3">
                <Skeleton variant="text" width={120} />
              </td>
              <td className="px-4 py-3">
                <Skeleton variant="text" width={200} />
              </td>
              <td className="px-4 py-3">
                <Skeleton variant="text" width={40} />
              </td>
              <td className="px-4 py-3">
                <Skeleton variant="rectangular" width={80} height={24} className="rounded-full" />
              </td>
              <td className="px-4 py-3">
                <div className="flex gap-2">
                  <Skeleton variant="rectangular" width={60} height={32} />
                  <Skeleton variant="rectangular" width={60} height={32} />
                  <Skeleton variant="rectangular" width={60} height={32} />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function CategoriesPage() {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [categories, setCategories] = React.useState<Array<{
    id: string;
    name: string;
    description: string | null;
    productsCount: number;
    status: "Active" | "Inactive";
  }>>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [deletingId, setDeletingId] = React.useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [name, setName] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [isActive, setIsActive] = React.useState(true);

  const fetchCategories = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await categoryService.getCategories();
      setCategories(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await categoryService.deleteCategory(id);
      await fetchCategories();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete category');
    } finally {
      setDeletingId(null);
    }
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setName("");
    setDescription("");
    setIsActive(true);
  };
  const handleSave = () => {
    if (name.trim()) {
      closeModal();
    }
  };

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <AdminLayout breadcrumbItems={[{ label: "Categories" }]}>
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
            <p className="mt-1 text-gray-500">Manage all product categories.</p>
          </div>
          <CategoriesTableSkeleton />
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout breadcrumbItems={[{ label: "Categories" }]}>
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
            <p className="mt-1 text-gray-500">Manage all product categories.</p>
          </div>
          <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center">
            <p className="text-red-600">{error}</p>
            <Button variant="secondary" className="mt-4" onClick={fetchCategories}>
              Retry
            </Button>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (categories.length === 0) {
    return (
      <AdminLayout breadcrumbItems={[{ label: "Categories" }]}>
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
            <p className="mt-1 text-gray-500">Manage all product categories.</p>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-12 text-center">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z"
              />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-900">No categories found</h3>
            <p className="mt-1 text-gray-500">Get started by adding a new category.</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout breadcrumbItems={[{ label: "Categories" }]}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
          <p className="mt-1 text-gray-500">Manage all product categories.</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
          <Input
            type="search"
            placeholder="Search categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-sm"
          />
          <Button variant="primary" onClick={openModal}>Add Category</Button>
        </div>

        <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-500">
              <tr>
                <th className="px-4 py-3 font-medium">Category Name</th>
                <th className="px-4 py-3 font-medium">Description</th>
                <th className="px-4 py-3 font-medium">Products Count</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredCategories.map((category) => (
                <tr key={category.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">
                    {category.name}
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {category.description || "-"}
                  </td>
                  <td className="px-4 py-3 text-gray-900">
                    {category.productsCount}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={category.status} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm">View</Button>
                      <Button variant="outline" size="sm">Edit</Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(category.id)}
                        disabled={deletingId === category.id}
                      >
                        {deletingId === category.id ? 'Deleting...' : 'Delete'}
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredCategories.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-8 text-center text-gray-500"
                  >
                    No categories found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <Dialog
          open={isModalOpen}
          onClose={closeModal}
          title="Add Category"
          description="Create a new product category."
          footer={
            <>
              <Button variant="secondary" onClick={closeModal}>Cancel</Button>
              <Button variant="primary" onClick={handleSave} disabled={!name.trim()}>Save Category</Button>
            </>
          }
        >
          <div className="space-y-4">
            <Input
              label="Category Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter category name"
              required
            />
            <Input
              label="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter category description"
            />
            <Checkbox
              label="Active"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
            />
          </div>
        </Dialog>
      </div>
    </AdminLayout>
  );
}