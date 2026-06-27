"use client";

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Section } from '../../../src/components/layout/section';
import { Container } from '../../../src/components/layout/container';
import { Badge } from '../../../src/components/ui/badge';
import { Button } from '../../../src/components/ui/button';
import { EmptyState } from '../../../src/components/ui/empty-state';
import { Skeleton } from '../../../src/components/ui/skeleton';
import { productService } from '../../../src/services/product.service';
import { useParams } from 'next/navigation';

function ProductDetailSkeleton() {
  return (
    <Section padding="lg">
      <Container>
        <div className="mb-8">
          <Skeleton variant="rectangular" className="h-8 w-3/4 mb-4" />
          <Skeleton variant="text" lines={2} className="max-w-2xl mb-6" />
        </div>
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <Skeleton variant="rectangular" className="aspect-[4/3] w-full rounded-lg" />
          <div className="space-y-4">
            <Skeleton variant="rectangular" className="h-6 w-20" />
            <Skeleton variant="rectangular" className="h-6 w-24" />
            <Skeleton variant="text" lines={4} />
            <Skeleton variant="rectangular" className="h-10 w-32" />
            <Skeleton variant="rectangular" className="h-10 w-full" />
          </div>
        </div>
      </Container>
    </Section>
  );
}

function ProductGallery({ images }: { images: string[] }) {
  if (images.length === 0) {
    return (
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg bg-gradient-to-br from-gray-100 to-gray-200">
        <div className="flex h-full w-full items-center justify-center text-sm text-gray-500">
          Food Image
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg">
        <img
          src={images[0]}
          alt="Product image"
          className="h-full w-full object-cover"
        />
      </div>
      {images.length > 1 && (
        <div className="flex gap-2">
          {images.slice(1).map((img, idx) => (
            <button
              key={idx}
              className="h-16 w-16 overflow-hidden rounded-md border border-gray-200"
            >
              <img src={img} alt={`Thumbnail ${idx + 1}`} className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function QuantitySelector() {
  const [quantity, setQuantity] = useState(1);

  const increment = () => setQuantity((q) => Math.min(99, q + 1));
  const decrement = () => setQuantity((q) => Math.max(1, q - 1));

  return (
    <div className="inline-flex items-center gap-2">
      <button
        onClick={decrement}
        className="flex h-8 w-8 items-center justify-center rounded-md border border-gray-300 text-gray-600 hover:bg-gray-50"
        aria-label="Decrease quantity"
      >
        -
      </button>
      <span className="text-sm font-medium w-8 text-center">{quantity}</span>
      <button
        onClick={increment}
        className="flex h-8 w-8 items-center justify-center rounded-md border border-gray-300 text-gray-600 hover:bg-gray-50"
        aria-label="Increase quantity"
      >
        +
      </button>
    </div>
  );
}

function StockStatus({ available, stock }: { available: boolean; stock?: number }) {
  const getStockLabel = () => {
    if (!available) return 'Out of Stock';
    if (stock !== undefined && stock <= 5) return 'Low Stock';
    return 'In Stock';
  };

  const getStockVariant = () => {
    if (!available) return 'danger';
    if (stock !== undefined && stock <= 5) return 'warning';
    return 'success';
  };

  return (
    <Badge variant={getStockVariant() as 'default' | 'success' | 'warning' | 'danger' | 'info'}>
      {getStockLabel()}
    </Badge>
  );
}

export default function ProductDetailPage() {
  const params = useParams();
  const productId = params.id as string;

  const { data: product, isLoading, isError, refetch } = useQuery({
    queryKey: ['products', productId],
    queryFn: () => productService.getProductById(productId),
    enabled: !!productId,
  });

  if (isLoading) {
    return <ProductDetailSkeleton />;
  }

  if (isError) {
    return (
      <Section padding="lg">
        <Container>
          <EmptyState
            title="Unable to load product"
            description="Please try again later."
            actionLabel="Retry"
            onAction={() => refetch()}
          />
        </Container>
      </Section>
    );
  }

  if (!product) {
    return (
      <Section padding="lg">
        <Container>
          <EmptyState
            title="Product not found"
            description="The product you are looking for does not exist."
          />
        </Container>
      </Section>
    );
  }

  const price = typeof (product as unknown as Record<string, unknown>).price === 'number'
    ? Number((product as unknown as Record<string, unknown>).price)
    : 0;

  const images: string[] = [];
  if (product.thumbnailImage) {
    images.push(product.thumbnailImage);
  }

  return (
    <Section padding="lg">
      <Container>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
          <p className="mt-2 text-sm text-gray-500 max-w-2xl">
            {product.description ?? 'Delicious dish prepared with care.'}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <ProductGallery images={images} />

          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <Badge variant={product.isVeg ? 'success' : 'danger'} className="text-sm">
                {product.isVeg ? 'Veg' : 'Non-Veg'}
              </Badge>
              {product.isFeatured && (
                <Badge variant="warning" className="text-sm">
                  Featured
                </Badge>
              )}
            </div>

            <div className="space-y-4">
              <div className="text-sm">
                <span className="text-gray-500">Category:</span>
                <span className="ml-2 font-medium text-gray-900">{product.category.name}</span>
              </div>

              <div className="text-sm">
                <span className="text-gray-500">Availability:</span>
                <span className="ml-2">
                  <StockStatus available={product.isAvailable} stock={product.stock} />
                </span>
              </div>

              {product.isFeatured && (
                <div className="text-sm">
                  <span className="text-gray-500">Featured Status:</span>
                  <Badge variant="warning" className="ml-2 text-sm">
                    Featured Product
                  </Badge>
                </div>
              )}

              <div className="text-sm">
                <span className="text-gray-500">Type:</span>
                <Badge variant={product.isVeg ? 'success' : 'danger'} className="ml-2 text-sm">
                  {product.isVeg ? 'Veg' : 'Non-Veg'}
                </Badge>
              </div>
            </div>

            <div className="text-3xl font-bold text-gray-900">
              ${price.toFixed(2)}
            </div>

            <div className="space-y-2">
              <span className="text-sm text-gray-500">Quantity</span>
              <div>
                <QuantitySelector />
              </div>
            </div>

            <Button
              size="lg"
              className="w-full transition-all duration-150"
              aria-label={`Add ${product.name} to cart`}
              disabled={!product.isAvailable}
            >
              Add to Cart
            </Button>
          </div>
        </div>
      </Container>
    </Section>
  );
}