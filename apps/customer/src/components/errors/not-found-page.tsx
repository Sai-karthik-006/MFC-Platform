'use client';

import * as React from 'react';
import Link from 'next/link';
import { Button } from '../ui/button';

interface NotFoundPageProps {
  title?: string;
  description?: string;
  backHref?: string;
}

export function NotFoundPage({
  title = 'Page not found',
  description,
  backHref = '/',
}: NotFoundPageProps) {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center p-6 text-center">
      <h1 className="text-4xl font-bold text-gray-900">404</h1>
      <h2 className="mt-2 text-2xl font-semibold text-gray-800">{title}</h2>
      {description && <p className="mt-4 text-gray-600">{description}</p>}
      <Link href={backHref}>
        <Button className="mt-6">Go back home</Button>
      </Link>
    </div>
  );
}
