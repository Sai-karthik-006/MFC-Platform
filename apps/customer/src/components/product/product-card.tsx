import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Card, CardContent, CardFooter } from '../ui/card';

interface ProductCardProps {
  id?: string;
  name: string;
  description?: string;
  price: number;
  isVeg?: boolean;
  isAvailable?: boolean;
  isFeatured?: boolean;
}

export function ProductCard({
  id,
  name,
  description,
  price,
  isVeg = true,
  isAvailable = true,
  isFeatured = false,
}: ProductCardProps) {
  return (
    <Card className="flex flex-col transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-blue-300" data-product-id={id}>
      <CardContent className="flex-1">
        <div className="flex justify-between items-start mb-2">
          <Badge variant={isVeg ? 'success' : 'danger'}>
            {isVeg ? 'Veg' : 'Non-Veg'}
          </Badge>
          {isFeatured && (
            <Badge variant="warning" className="ml-auto">
              Featured
            </Badge>
          )}
        </div>
        <h3 className="text-base font-semibold text-gray-900 leading-tight line-clamp-2">
          {name}
        </h3>
        <p className="mt-2 text-sm text-gray-500 line-clamp-2">
          {description ?? 'Delicious dish prepared with care.'}
        </p>
      </CardContent>
      <CardFooter className="flex items-center justify-between">
        <span className="text-lg font-bold text-gray-900">
          ${price.toFixed(2)}
        </span>
        {isAvailable ? (
          <Button size="sm" aria-label={`Add ${name} to cart`}>
            Add to Cart
          </Button>
        ) : (
          <Button size="sm" disabled aria-label={`Out of Stock: ${name}`}>
            Out of Stock
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
