"use client";

import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Section } from '../../src/components/layout/section';
import { Container } from '../../src/components/layout/container';
import { ProductCard } from '../../src/components/product/product-card';
import { Input } from '../../src/components/ui/input';
import { Button } from '../../src/components/ui/button';
import { EmptyState } from '../../src/components/ui/empty-state';
import { productService } from '../../src/services/product.service';
import { categoryService } from '../../src/services/category.service';
import type { Category } from '@mfc-platform/types';

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

export default function ProductsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('featured');

  const { data: productsData, isLoading: productsLoading, isError: productsError, refetch: refetchProducts } = useQuery({
    queryKey: ['products', 'all'],
    queryFn: () => productService.getProducts(),
  });

  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await categoryService.getCategories();
      return response.data;
    },
  });

  const products = productsData ?? [];
  const categories: Category[] = categoriesData ?? [];

  const filteredProducts = useMemo(() => {
    let result = products.filter((product) => {
      const matchesSearch =
        searchQuery.trim() === '' ||
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (product.description ?? '').toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === 'all' || product.categoryId === selectedCategory;

      return matchesSearch && matchesCategory;
    });

    switch (sortBy) {
      case 'price-asc':
        result = [...result].sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
        break;
      case 'price-desc':
        result = [...result].sort((a, b) => (b.price ?? 0) - (a.price ?? 0));
        break;
      case 'name-asc':
        result = [...result].sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'featured':
      default:
        result = [...result].sort((a, b) => (a.isFeatured === b.isFeatured ? 0 : a.isFeatured ? -1 : 1));
        break;
    }

    return result;
  }, [products, searchQuery, selectedCategory, sortBy]);

  const isLoading = productsLoading;
  const isError = productsError;

  if (isLoading) {
    return (
      <Section padding="lg">
        <Container>
          <div className="mb-8 text-center sm:text-left">
            <h1 className="text-3xl font-bold text-gray-900">Our Menu</h1>
            <p className="mt-2 text-sm text-gray-500">Explore all available dishes</p>
          </div>
          <div className="mb-6">
            <div className="h-10 w-full animate-shimmer rounded-md bg-gray-200 sm:max-w-md" />
          </div>
          <div className="mb-4 flex gap-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-8 w-20 animate-shimmer rounded-full bg-gray-200" />
            ))}
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
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
          <div className="mb-8 text-center sm:text-left">
            <h1 className="text-3xl font-bold text-gray-900">Our Menu</h1>
            <p className="mt-2 text-sm text-gray-500">Explore all available dishes</p>
          </div>
          <EmptyState
            title="Unable to load products"
            description="Please try again later."
            actionLabel="Retry"
            onAction={() => refetchProducts()}
          />
        </Container>
      </Section>
    );
  }

  if (products.length === 0 && !isLoading) {
    return (
      <Section padding="lg">
        <Container>
          <div className="mb-8 text-center sm:text-left">
            <h1 className="text-3xl font-bold text-gray-900">Our Menu</h1>
            <p className="mt-2 text-sm text-gray-500">Explore all available dishes</p>
          </div>
          <EmptyState
            title="No products available"
            description="Check back soon for our delicious dishes."
          />
        </Container>
      </Section>
    );
  }

  return (
    <Section padding="lg">
      <Container>
        <div className="mb-8 text-center sm:text-left">
          <h1 className="text-3xl font-bold text-gray-900">Our Menu</h1>
          <p className="mt-2 text-sm text-gray-500">Explore all available dishes</p>
        </div>

        <div className="mb-6 flex flex-col gap-4">
          <Input
            type="search"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="sm:max-w-md"
          />

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedCategory === 'all' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory('all')}
              >
                All
              </Button>
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(category.id)}
                >
                  {category.name}
                </Button>
              ))}
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="featured">Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name-asc">Name: A–Z</option>
            </select>
          </div>
        </div>

        {filteredProducts.length === 0 ? (
          <EmptyState
            title="No products found"
            description="Try adjusting your search or filter to find what you are looking for."
          />
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                href={`/products/${product.id}`}
                name={product.name}
                description={product.description ?? 'Delicious dish prepared with care.'}
                price={product.price}
                isVeg={product.isVeg}
                isAvailable={product.isAvailable}
                isFeatured={product.isFeatured}
              />
            ))}
          </div>
        )}
      </Container>
    </Section>
  );
}
