import { useQuery } from '@tanstack/react-query';
import { Section } from '../layout/section';
import { Container } from '../layout/container';
import { ProductCard } from '../product/product-card';
import { Button } from '../ui/button';
import { EmptyState } from '../ui/empty-state';
import { productService } from '../../services/product.service';

function ProductCardSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white">
      <div className="aspect-[4/3] w-full animate-shimmer bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200" />
      <div className="flex-1 p-4">
        <div className="mb-3 flex items-start justify-between">
          <div className="h-5 w-12 animate-shimmer rounded-full bg-gray-200" />
          <div className="h-5 w-16 animate-shimmer rounded-full bg-gray-200" />
        </div>
        <div className="h-5 w-3/4 animate-shimmer rounded bg-gray-200" />
        <div className="mt-2 h-4 w-full animate-shimmer rounded bg-gray-200" />
        <div className="mt-1 h-4 w-5/6 animate-shimmer rounded bg-gray-200" />
      </div>
      <div className="flex flex-col gap-3 p-4 pt-0">
        <div className="h-6 w-16 animate-shimmer rounded bg-gray-200" />
        <div className="h-9 w-full animate-shimmer rounded bg-gray-200" />
      </div>
    </div>
  );
}

export function BestSellers() {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['products', 'bestSellers'],
    queryFn: () => productService.getBestSellers(),
  });

  if (isLoading) {
    return (
      <Section padding="lg">
        <Container>
          <div className="mb-8 flex flex-col sm:flex-row sm:items-start sm:justify-between">
            <div className="text-center sm:text-left">
              <h2 className="text-2xl font-bold text-gray-900">Best Sellers</h2>
              <p className="mt-2 text-sm text-gray-500">Customer favourites this week</p>
            </div>
            <Button variant="ghost" size="sm" className="mt-4 sm:mt-0" disabled>
              View All
            </Button>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        </Container>
      </Section>
    );
  }

  if (isError) {
    return (
      <Section padding="lg">
        <Container>
          <div className="mb-8 flex flex-col sm:flex-row sm:items-start sm:justify-between">
            <div className="text-center sm:text-left">
              <h2 className="text-2xl font-bold text-gray-900">Best Sellers</h2>
              <p className="mt-2 text-sm text-gray-500">Customer favourites this week</p>
            </div>
            <Button variant="ghost" size="sm" className="mt-4 sm:mt-0" disabled>
              View All
            </Button>
          </div>
          <EmptyState
            title="Unable to load best sellers"
            description="Please try again later."
            actionLabel="Retry"
            onAction={() => refetch()}
          />
        </Container>
      </Section>
    );
  }

  const products = data ?? [];

  if (products.length === 0) {
    return (
      <Section padding="lg">
        <Container>
          <div className="mb-8 flex flex-col sm:flex-row sm:items-start sm:justify-between">
            <div className="text-center sm:text-left">
              <h2 className="text-2xl font-bold text-gray-900">Best Sellers</h2>
              <p className="mt-2 text-sm text-gray-500">Customer favourites this week</p>
            </div>
            <Button variant="ghost" size="sm" className="mt-4 sm:mt-0" disabled>
              View All
            </Button>
          </div>
          <EmptyState
            title="No best sellers available"
            description="Check back soon for our most loved dishes."
          />
        </Container>
      </Section>
    );
  }

  return (
    <Section padding="lg">
      <Container>
        <div className="mb-8 flex flex-col sm:flex-row sm:items-start sm:justify-between">
          <div className="text-center sm:text-left">
            <h2 className="text-2xl font-bold text-gray-900">Best Sellers</h2>
            <p className="mt-2 text-sm text-gray-500">Customer favourites this week</p>
          </div>
          <Button variant="ghost" size="sm" className="mt-4 sm:mt-0" disabled>
            View All
          </Button>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              description={product.description ?? 'Delicious dish prepared with care.'}
              price={typeof (product as unknown as Record<string, unknown>).price === 'number' ? Number((product as unknown as Record<string, unknown>).price) : 0}
              isVeg={(product as unknown as Record<string, unknown>).isVeg as boolean}
              isAvailable={(product as unknown as Record<string, unknown>).isAvailable as boolean}
              isFeatured={(product as unknown as Record<string, unknown>).isFeatured as boolean}
            />
          ))}
        </div>
      </Container>
    </Section>
  );
}
