import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Card, CardContent, CardFooter } from '../ui/card';
import Link from 'next/link';

interface ProductCardProps {
  id?: string;
  name: string;
  description?: string;
  price: number;
  isVeg?: boolean;
  isAvailable?: boolean;
  isFeatured?: boolean;
  href?: string;
}

export function ProductCard({
  id,
  name,
  description,
  price,
  isVeg = true,
  isAvailable = true,
  isFeatured = false,
  href,
}: ProductCardProps) {
  const cardContent = (
    <Card
      className="flex flex-col border-2 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-blue-300 hover:bg-gray-50/50"
      data-product-id={id}
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-t-lg bg-gradient-to-br from-gray-100 to-gray-200">
        <div className="flex h-full w-full items-center justify-center text-sm text-gray-500">
          Food Image
        </div>
      </div>
      <CardContent className="flex-1 p-4">
        <div className="mb-3 flex items-start justify-between">
          <Badge variant={isVeg ? 'success' : 'danger'} className="text-xs">
            {isVeg ? 'Veg' : 'Non-Veg'}
          </Badge>
          {isFeatured && <Badge variant="warning" className="text-xs">Featured</Badge>}
        </div>
        <h3 className="text-base font-semibold text-gray-900 leading-tight line-clamp-2">
          {name}
        </h3>
        <p className="mt-2 text-sm text-gray-600 line-clamp-2">
          {description ?? 'Delicious dish prepared with care.'}
        </p>
      </CardContent>
      <CardFooter className="flex flex-col gap-3 p-4 pt-0">
        <span className="self-start text-xl font-bold text-gray-900">
          ${price.toFixed(2)}
        </span>
        {isAvailable ? (
          <Button
            size="sm"
            className="w-full transition-all duration-150"
            aria-label={`Add ${name} to cart`}
            onClick={href ? (e) => { e.preventDefault(); e.stopPropagation(); } : undefined}
          >
            Add to Cart
          </Button>
        ) : (
          <Button size="sm" disabled className="w-full">
            Out of Stock
          </Button>
        )}
      </CardFooter>
    </Card>
  );

  if (href) {
    return (
      <Link href={href} className="block">
        {cardContent}
      </Link>
    );
  }

  return cardContent;
}