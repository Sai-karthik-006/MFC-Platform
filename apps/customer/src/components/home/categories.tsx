import { useQuery } from '@tanstack/react-query';
import { Section } from '../layout/section';
import { Container } from '../layout/container';
import { Card, CardContent } from '../ui/card';
import { categoryService } from '../../services/category.service';

export function Categories() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoryService.getCategories(),
  });

  if (isLoading) {
    return (
      <Section padding="lg">
        <Container>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Browse Categories</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 animate-pulse rounded-lg" />
            ))}
          </div>
        </Container>
      </Section>
    );
  }

  if (isError) {
    return null;
  }

  const categories = data?.data ?? [];

  return (
    <Section padding="lg">
      <Container>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Browse Categories</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {categories.map((category) => (
            <Card
              key={category.id}
              className="transition-all duration-200 hover:-translate-y-1 hover:border-blue-300"
            >
              <CardContent className="flex items-center justify-center py-6">
                <span className="text-center font-medium text-gray-900">{category.name}</span>
              </CardContent>
            </Card>
          ))}
        </div>
      </Container>
    </Section>
  );
}