import { useQuery } from '@tanstack/react-query';
import { Section } from '../layout/section';
import { Container } from '../layout/container';
import { ProductCard } from '../product/product-card';
import { Button } from '../ui/button';
import { productService } from '../../services/product.service';

export function FeaturedProducts() {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['products', 'featured'],
    queryFn: () => productService.getFeaturedProducts(),
  });

  if (isLoading) {
    return (
      <Section padding="lg">
        <Container>
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Featured Products</h2>
            <p className="mt-2 text-sm text-gray-500">Our most loved dishes</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-64 bg-gray-200 animate-pulse rounded-lg" />
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
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Featured Products</h2>
            <p className="mt-2 text-sm text-gray-500">Our most loved dishes</p>
          </div>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <h3 className="text-lg font-semibold text-gray-900">Unable to load products</h3>
            <p className="mt-2 max-w-md text-sm text-gray-500">Please try again later.</p>
            <div className="mt-6">
              <Button onClick={() => refetch()}>Retry</Button>
            </div>
          </div>
        </Container>
      </Section>
    );
  }

  const products = data ?? [];

  if (products.length === 0) {
    return (
      <Section padding="lg">
        <Container>
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Featured Products</h2>
            <p className="mt-2 text-sm text-gray-500">Our most loved dishes</p>
          </div>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <h3 className="text-lg font-semibold text-gray-900">No Products Available</h3>
            <p className="mt-2 max-w-md text-sm text-gray-500">Check back soon for our featured dishes.</p>
          </div>
        </Container>
      </Section>
    );
  }

  return (
    <Section padding="lg">
      <Container>
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Featured Products</h2>
          <p className="mt-2 text-sm text-gray-500">Our most loved dishes</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
