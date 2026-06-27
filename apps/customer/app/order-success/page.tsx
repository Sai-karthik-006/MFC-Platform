'use client';

import { PageWrapper } from '../../src/components/layout/page-wrapper';
import { Button } from '../../src/components/ui/button';

export default function OrderSuccessPage() {
  return (
    <PageWrapper>
      <div className="flex min-h-[70vh] items-center justify-center px-4">
        <div className="text-center">
          <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-green-100">
            <svg className="h-12 w-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-label="Success">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <h1 className="mb-2 text-3xl font-bold text-gray-900">Order placed successfully</h1>
          <p className="mb-8 text-lg text-gray-600">Thank you for your purchase!</p>

          <div className="mb-8 space-y-4">
            <div className="rounded-lg bg-gray-50 px-6 py-4">
              <p className="text-sm text-gray-500">Order Number</p>
              <p className="text-xl font-semibold text-gray-900">#ORD-2024-001234</p>
            </div>

            <div className="rounded-lg bg-gray-50 px-6 py-4">
              <p className="text-sm text-gray-500">Estimated delivery time</p>
              <p className="text-xl font-semibold text-gray-900">3-5 business days</p>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button variant="outline" size="lg">
              Track Order
            </Button>
            <Button size="lg">
              Continue Shopping
            </Button>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}