"use client";

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
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg bg-gradient-to-br from-gray-100 to-gray-200">
            <div className="flex h-full w-full items-center justify-center text-sm text-gray-500">
              Food Image
            </div>
          </div>

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

            <div>
              <span className="text-3xl font-bold text-gray-900">
                ${price.toFixed(2)}
              </span>
            </div>

            <div>
              <span className={`text-sm font-medium ${product.isAvailable ? 'text-green-600' : 'text-red-600'}`}>
                {product.isAvailable ? 'Available' : 'Out of Stock'}
              </span>
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