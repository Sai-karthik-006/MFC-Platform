'use client';

import { useCart } from '../../src/hooks/use-cart';
import { Card, CardContent, CardHeader, CardFooter } from '../../src/components/ui/card';
import { Button } from '../../src/components/ui/button';
import { EmptyState } from '../../src/components/ui/empty-state';
import { PageWrapper } from '../../src/components/layout/page-wrapper';

function CartItem({ item, onUpdateQuantity, onRemove }: {
  item: { productId: string; name: string; price: number; quantity: number; image?: string };
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemove: (productId: string) => void;
}) {
  return (
    <div className="flex items-center gap-4 py-4">
      <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md bg-gray-100">
        {item.image ? (
          <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-xs text-gray-500">
            Image
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-medium text-gray-900">{item.name}</h3>
        <p className="text-sm text-gray-500">₹{item.price}</p>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onUpdateQuantity(item.productId, Math.max(1, item.quantity - 1))}
          className="flex h-8 w-8 items-center justify-center rounded-md border border-gray-300 bg-white text-gray-600 hover:bg-gray-50"
        >
          -
        </button>
        <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
        <button
          onClick={() => onUpdateQuantity(item.productId, item.quantity + 1)}
          className="flex h-8 w-8 items-center justify-center rounded-md border border-gray-300 bg-white text-gray-600 hover:bg-gray-50"
        >
          +
        </button>
      </div>
      <button
        onClick={() => onRemove(item.productId)}
        className="text-sm text-red-600 hover:text-red-700"
      >
        Remove
      </button>
    </div>
  );
}

function OrderSummary({ subtotal }: { subtotal: number }) {
  const deliveryFee = subtotal >= 499 ? 0 : 49;
  const discount = 0;
  const tax = Math.round(subtotal * 0.05);
  const grandTotal = subtotal + deliveryFee + tax - discount;
  const amountForFreeDelivery = subtotal < 499 ? 499 - subtotal : 0;

  return (
    <Card>
      <CardHeader>
        <h2 className="text-lg font-semibold text-gray-900">Order Summary</h2>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Subtotal</span>
          <span className="font-medium text-gray-900">₹{subtotal}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Delivery Fee</span>
          <span className="font-medium text-gray-900">₹{deliveryFee}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Discount</span>
          <span className="font-medium text-gray-900">-₹{discount}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Estimated Tax</span>
          <span className="font-medium text-gray-900">₹{tax}</span>
        </div>
        <div className="border-t border-gray-200 pt-3">
          <div className="flex justify-between">
            <span className="text-base font-semibold text-gray-900">Grand Total</span>
            <span className="text-base font-semibold text-gray-900">₹{grandTotal}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        {subtotal < 499 ? (
          <p className="text-sm text-orange-600">
            Add ₹{amountForFreeDelivery} more to unlock FREE delivery.
          </p>
        ) : (
          <p className="text-sm text-green-600">
            Congratulations! FREE delivery unlocked.
          </p>
        )}
      </CardFooter>
    </Card>
  );
}

export default function CartPage() {
  const { items, subtotal, updateQuantity, removeItem, totalItems } = useCart();

  if (items.length === 0) {
    return (
      <PageWrapper title="Your Cart" description="Review your items before checkout">
        <div className="flex min-h-[60vh] items-center justify-center px-4">
          <EmptyState
            title="Your cart is empty"
            description="Add items to your cart to see them here."
            actionLabel="Shop Now"
          />
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper title="Your Cart" description={`${totalItems} items in your cart`}>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="divide-y divide-gray-200">
                {items.map((item) => (
                  <CartItem
                    key={item.productId}
                    item={item}
                    onUpdateQuantity={updateQuantity}
                    onRemove={removeItem}
                  />
                ))}
              </CardContent>
            </Card>
          </div>
          <div>
            <OrderSummary subtotal={subtotal} />
            <Button className="mt-6 w-full" size="lg">
              Proceed to Checkout
            </Button>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}