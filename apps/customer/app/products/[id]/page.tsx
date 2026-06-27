"use client";

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Section } from '../../../src/components/layout/section';
import { Container } from '../../../src/components/layout/container';
import { Badge } from '../../../src/components/ui/badge';
import { Button } from '../../../src/components/ui/button';
import { EmptyState } from '../../../src/components/ui/empty-state';
import { Skeleton } from '../../../src/components/ui/skeleton';
import { ProductCard } from '../../../src/components/product/product-card';
import { productService } from '../../../src/services/product.service';
import { useParams } from 'next/navigation';

function ProductDetailSkeleton() {
  return (
    <Section padding="lg">
      <Container>
        <div className="mb-10">
          <Skeleton variant="rectangular" className="h-9 w-3/4 mb-4" />
          <Skeleton variant="text" lines={2} className="max-w-2xl mb-6" />
        </div>
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
          <Skeleton variant="rectangular" className="aspect-[4/3] w-full rounded-lg" />
          <div className="space-y-5">
            <Skeleton variant="rectangular" className="h-7 w-20" />
            <Skeleton variant="rectangular" className="h-7 w-24" />
            <Skeleton variant="text" lines={4} />
            <Skeleton variant="rectangular" className="h-12 w-32" />
            <Skeleton variant="rectangular" className="h-12 w-full" />
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
        className="flex h-9 w-9 items-center justify-center rounded-md border border-gray-300 text-gray-600 hover:bg-gray-50"
        aria-label="Decrease quantity"
      >
        -
      </button>
      <span className="text-sm font-semibold w-8 text-center">{quantity}</span>
      <button
        onClick={increment}
        className="flex h-9 w-9 items-center justify-center rounded-md border border-gray-300 text-gray-600 hover:bg-gray-50"
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

function RelatedProductsSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="space-y-3">
          <Skeleton variant="rectangular" className="aspect-[4/3] w-full rounded-lg" />
          <Skeleton variant="text" lines={2} />
          <Skeleton variant="rectangular" className="h-6 w-20" />
        </div>
      ))}
    </div>
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

  const { data: relatedProducts, isLoading: relatedLoading } = useQuery({
    queryKey: ['products', 'related', product?.category.id, productId],
    queryFn: () => productService.getProductsByCategory(product!.category.id, productId),
    enabled: !!product?.category.id && !!productId,
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
    <>
      <Section padding="lg" className="pb-0 lg:pb-0">
        <Container>
          <div className="mb-10">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">{product.name}</h1>
            <p className="mt-3 text-base text-gray-500 max-w-2xl leading-relaxed">
              {product.description ?? 'Delicious dish prepared with care.'}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
            <ProductGallery images={images} />

            <div className="space-y-6">
              <div className="flex flex-wrap items-center gap-3">
                <Badge variant={product.isVeg ? 'success' : 'danger'} className="text-sm font-medium">
                  {product.isVeg ? 'Veg' : 'Non-Veg'}
                </Badge>
                {product.isFeatured && (
                  <Badge variant="warning" className="text-sm font-medium">
                    Featured
                  </Badge>
                )}
                <StockStatus available={product.isAvailable} stock={product.stock} />
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="rounded-lg border border-gray-100 bg-gray-50/50 px-4 py-3">
                  <span className="text-xs font-medium uppercase tracking-wider text-gray-500">Category</span>
                  <p className="mt-1 text-sm font-semibold text-gray-900">{product.category.name}</p>
                </div>
                <div className="rounded-lg border border-gray-100 bg-gray-50/50 px-4 py-3">
                  <span className="text-xs font-medium uppercase tracking-wider text-gray-500">Type</span>
                  <p className="mt-1 text-sm font-semibold text-gray-900">{product.isVeg ? 'Vegetarian' : 'Non-Vegetarian'}</p>
                </div>
              </div>

              <div className="text-4xl font-bold text-gray-900 tracking-tight">
                ${price.toFixed(2)}
              </div>

              <div className="space-y-2">
                <span className="text-sm font-medium text-gray-500">Quantity</span>
                <div>
                  <QuantitySelector />
                </div>
              </div>

              <Button
                size="lg"
                className="w-full transition-all duration-150 h-12 text-base font-semibold"
                aria-label={`Add ${product.name} to cart`}
                disabled={!product.isAvailable}
              >
                Add to Cart
              </Button>
            </div>
          </div>
        </Container>
      </Section>

      {relatedProducts && relatedProducts.length > 0 && (
        <Section padding="lg">
          <Container>
            <h2 className="text-2xl font-bold text-gray-900 mb-8 tracking-tight">You May Also Like</h2>
            {relatedLoading ? (
              <RelatedProductsSkeleton />
            ) : (
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                {relatedProducts.map((relatedProduct) => (
                  <ProductCard
                    key={relatedProduct.id}
                    id={relatedProduct.id ?? undefined}
                    name={relatedProduct.name}
                    description={relatedProduct.description ?? undefined}
                    price={relatedProduct.price ?? 0}
                    isVeg={relatedProduct.isVeg}
                    isAvailable={relatedProduct.isAvailable}
                    isFeatured={relatedProduct.isFeatured}
                    href={`/products/${relatedProduct.id!}`}
                  />
                ))}
              </div>
            )}
          </Container>
        </Section>
      )}

      <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-200 bg-white/95 backdrop-blur-sm lg:hidden">
        <div className="flex items-center gap-3 px-4 py-3">
          <div className="flex-1">
            <span className="text-xs text-gray-500">Price</span>
            <p className="text-lg font-bold text-gray-900">${price.toFixed(2)}</p>
          </div>
          <div className="hidden sm:block">
            <span className="text-xs text-gray-500 block mb-1">Quantity</span>
            <QuantitySelector />
          </div>
          <Button
            size="lg"
            className="h-11 flex-1 sm:flex-none sm:w-40 text-sm font-semibold"
            disabled={!product.isAvailable}
            aria-label={`Add ${product.name} to cart`}
          >
            Add to Cart
          </Button>
        </div>
      </div>

      <div className="h-20 lg:hidden" />
    </>
  );
}
