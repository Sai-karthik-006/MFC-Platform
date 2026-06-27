import { useQuery } from '@tanstack/react-query';
import { Section } from '../layout/section';
import { Container } from '../layout/container';
import { Card, CardContent } from '../ui/card';
import { Skeleton } from '../ui/skeleton';
import { EmptyState } from '../ui/empty-state';
import { categoryService } from '../../services/category.service';

export function Categories() {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoryService.getCategories(),
  });

  if (isLoading) {
    return (
      <Section padding="lg">
        <Container>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Browse Categories</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-24 rounded-lg">
                <Skeleton variant="rectangular" className="h-full w-full" />
              </div>
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
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Browse Categories</h2>
          <EmptyState
            title="Unable to load categories"
            description="Please try again later."
            actionLabel="Retry"
            onAction={() => refetch()}
          />
        </Container>
      </Section>
    );
  }

  const categories = data?.data ?? [];

  if (categories.length === 0) {
    return (
      <Section padding="lg">
        <Container>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Browse Categories</h2>
          <EmptyState title="No Categories Available" description="Categories will appear here soon." />
        </Container>
      </Section>
    );
  }

  return (
    <Section padding="lg">
      <Container>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Browse Categories</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {categories.map((category) => (
            <Card
              key={category.id}
              className="cursor-pointer transition-all duration-200 ease-in-out hover:scale-105 hover:border-blue-300 hover:shadow-md"
            >
              <CardContent className="flex items-center justify-center p-4">
                <span className="text-center text-base font-semibold text-gray-900 leading-tight">{category.name}</span>
              </CardContent>
            </Card>
          ))}
        </div>
      </Container>
    </Section>
  );
}