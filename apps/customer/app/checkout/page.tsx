'use client';

import { useState } from 'react';
import { useCart } from '../../src/hooks/use-cart';
import { orderService } from '../../src/services/order.service';
import type { CreateOrderPayload } from '../../src/services/order.service';
import { Card, CardHeader, CardContent, CardFooter } from '../../src/components/ui/card';
import { Button } from '../../src/components/ui/button';
import { Input } from '../../src/components/ui/input';
import { Textarea } from '../../src/components/ui/textarea';
import { PageWrapper } from '../../src/components/layout/page-wrapper';
import { ProtectedRoute } from '../../src/components/ProtectedRoute';

type DeliveryOption = 'home' | 'work' | 'other';
type PaymentMethod = 'upi' | 'card' | 'cod';

function validateEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validatePhone(phone: string) {
  return /^\d{10}$/.test(phone);
}

function validatePincode(pincode: string) {
  return /^\d{6}$/.test(pincode);
}

const paymentMethods: { value: PaymentMethod; title: string; description: string }[] = [
  { value: 'upi', title: 'UPI', description: 'Pay instantly via UPI apps' },
  { value: 'card', title: 'Credit / Debit Card', description: 'Visa, Mastercard, RuPay' },
  { value: 'cod', title: 'Cash on Delivery', description: 'Pay when you receive' },
];

function OrderSummary({
  subtotal,
  totalItems,
  paymentMethod,
}: {
  subtotal: number;
  totalItems: number;
  paymentMethod: PaymentMethod;
}) {
  const deliveryFee = subtotal >= 499 ? 0 : 49;
  const discount = 0;
  const tax = Math.round(subtotal * 0.05);
  const grandTotal = subtotal + deliveryFee + tax - discount;
  const amountForFreeDelivery = subtotal < 499 ? 499 - subtotal : 0;
  const selectedPayment = paymentMethods.find((m) => m.value === paymentMethod);

  return (
    <Card>
      <CardHeader>
        <h2 className="text-lg font-semibold text-gray-900">Order Summary</h2>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Total Items</span>
          <span className="font-medium text-gray-900">{totalItems}</span>
        </div>
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
        {selectedPayment && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Payment Method</span>
            <span className="font-medium text-gray-900">{selectedPayment.title}</span>
          </div>
        )}
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

export default function CheckoutPage() {
  return (
    <ProtectedRoute>
      <CheckoutForm />
    </ProtectedRoute>
  );
}

function CheckoutForm() {
  const { items, subtotal, totalItems, clearCart } = useCart();

  const [form, setForm] = useState({
    fullName: '',
    phoneNumber: '',
    email: '',
    houseFlatNo: '',
    street: '',
    landmark: '',
    city: '',
    state: '',
    pincode: '',
  });

  const [deliveryOption, setDeliveryOption] = useState<DeliveryOption>('home');
  const [deliveryInstructions, setDeliveryInstructions] = useState('');
  const [saveAddress, setSaveAddress] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('upi');
  const [touched, setTouched] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [orderSuccess, setOrderSuccess] = useState(false);

  const errors: Record<string, string> = {};

  if (!form.fullName.trim()) errors.fullName = 'Full Name is required';
  if (!validatePhone(form.phoneNumber)) errors.phoneNumber = 'Enter a valid 10-digit phone number';
  if (!form.email.trim()) errors.email = 'Email is required';
  else if (!validateEmail(form.email)) errors.email = 'Enter a valid email address';
  if (!form.houseFlatNo.trim()) errors.houseFlatNo = 'House / Flat No. is required';
  if (!form.street.trim()) errors.street = 'Street is required';
  if (!form.city.trim()) errors.city = 'City is required';
  if (!form.state.trim()) errors.state = 'State is required';
  if (!validatePincode(form.pincode)) errors.pincode = 'Enter a valid 6-digit pincode';

  const isFormInvalid = Object.keys(errors).length > 0;

  const handlePlaceOrder = async () => {
    if (isFormInvalid) return;

    setTouched(true);
    setIsLoading(true);
    setError(null);

    try {
      const deliveryFee = subtotal >= 499 ? 0 : 49;
      const tax = Math.round(subtotal * 0.05);
      const grandTotal = subtotal + deliveryFee + tax - 0;

      const payload: CreateOrderPayload = {
        customer: {
          fullName: form.fullName,
          phoneNumber: form.phoneNumber,
          email: form.email,
        },
        address: {
          houseFlatNo: form.houseFlatNo,
          street: form.street,
          landmark: form.landmark,
          city: form.city,
          state: form.state,
          pincode: form.pincode,
        },
        deliveryOption,
        deliveryInstructions: deliveryInstructions || undefined,
        items: items.map((item) => ({
          productId: item.productId,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
          isVeg: item.isVeg,
        })),
        paymentMethod,
        subtotal,
        deliveryFee,
        tax,
        discount: 0,
        grandTotal,
      };

      await orderService.create(payload);
      setOrderSuccess(true);
      clearCart();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to place order');
    } finally {
      setIsLoading(false);
    }
  };

  if (orderSuccess) {
    return (
      <PageWrapper title="Checkout" description="Complete your order details">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <Card>
            <CardContent className="py-12 text-center">
              <h2 className="text-2xl font-bold text-gray-900">Order Placed Successfully!</h2>
              <p className="mt-2 text-gray-600">Thank you for your order. We will notify you once it is confirmed.</p>
            </CardContent>
          </Card>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper title="Checkout" description="Complete your order details">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <h2 className="text-lg font-semibold text-gray-900">Customer Information</h2>
              </CardHeader>
              <CardContent className="grid gap-4 sm:grid-cols-2">
                <Input
                  label="Full Name"
                  placeholder="Enter your full name"
                  value={form.fullName}
                  onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                  onBlur={() => setTouched(true)}
                  error={touched ? errors.fullName : undefined}
                />
                <Input
                  label="Phone Number"
                  placeholder="Enter phone number"
                  value={form.phoneNumber}
                  onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })}
                  onBlur={() => setTouched(true)}
                  error={touched ? errors.phoneNumber : undefined}
                />
                <Input
                  label="Email Address"
                  placeholder="Enter email address"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  onBlur={() => setTouched(true)}
                  error={touched ? errors.email : undefined}
                  className="sm:col-span-2"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <h2 className="text-lg font-semibold text-gray-900">Delivery Address</h2>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <Input
                    label="House / Flat No."
                    placeholder="e.g. 12B, Flat 3"
                    value={form.houseFlatNo}
                    onChange={(e) => setForm({ ...form, houseFlatNo: e.target.value })}
                    onBlur={() => setTouched(true)}
                    error={touched ? errors.houseFlatNo : undefined}
                    className="sm:col-span-2"
                  />
                  <Input
                    label="Street"
                    placeholder="Street address"
                    value={form.street}
                    onChange={(e) => setForm({ ...form, street: e.target.value })}
                    onBlur={() => setTouched(true)}
                    error={touched ? errors.street : undefined}
                    className="sm:col-span-2"
                  />
                  <Input
                    label="Landmark"
                    placeholder="Nearby landmark"
                    value={form.landmark}
                    onChange={(e) => setForm({ ...form, landmark: e.target.value })}
                    className="sm:col-span-2"
                  />
                  <Input
                    label="City"
                    placeholder="City"
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                    onBlur={() => setTouched(true)}
                    error={touched ? errors.city : undefined}
                  />
                  <Input
                    label="State"
                    placeholder="State"
                    value={form.state}
                    onChange={(e) => setForm({ ...form, state: e.target.value })}
                    onBlur={() => setTouched(true)}
                    error={touched ? errors.state : undefined}
                  />
                  <Input
                    label="Pincode"
                    placeholder="Pincode"
                    value={form.pincode}
                    onChange={(e) => setForm({ ...form, pincode: e.target.value })}
                    onBlur={() => setTouched(true)}
                    error={touched ? errors.pincode : undefined}
                    className="sm:col-span-2"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">Delivery Options</label>
                  <div className="flex flex-wrap gap-4">
                    {(['home', 'work', 'other'] as DeliveryOption[]).map((option) => (
                      <label key={option} className="flex items-center gap-2 text-sm text-gray-700">
                        <input
                          type="radio"
                          name="deliveryOption"
                          value={option}
                          checked={deliveryOption === option}
                          onChange={(e) => setDeliveryOption(e.target.value as DeliveryOption)}
                          className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        {option === 'home' ? 'Home' : option === 'work' ? 'Work' : 'Other'}
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">Delivery Instructions</label>
                  <Textarea
                    placeholder="Add delivery instructions for the delivery partner"
                    value={deliveryInstructions}
                    onChange={(e) => setDeliveryInstructions(e.target.value)}
                    className="min-h-[80px]"
                  />
                </div>

                <label className="flex items-center gap-2 text-sm text-gray-700">
                  <input
                    type="checkbox"
                    checked={saveAddress}
                    onChange={(e) => setSaveAddress(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  Save this address for future orders
                </label>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <h2 className="text-lg font-semibold text-gray-900">Payment Method</h2>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-3">
                  {paymentMethods.map((method) => (
                    <button
                      key={method.value}
                      type="button"
                      onClick={() => setPaymentMethod(method.value)}
                      className={`rounded-lg border p-4 text-left transition-colors ${
                        paymentMethod === method.value
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 bg-white hover:border-gray-300'
                      }`}
                    >
                      <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-md bg-gray-100 text-gray-500">
                        <svg
                          className="h-5 w-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                      <h3 className="text-sm font-medium text-gray-900">{method.title}</h3>
                      <p className="mt-1 text-xs text-gray-500">{method.description}</p>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <OrderSummary subtotal={subtotal} totalItems={totalItems} paymentMethod={paymentMethod} />
            {error && <p className="text-sm text-red-600">{error}</p>}
            <Button
              className="w-full"
              size="lg"
              disabled={isFormInvalid || isLoading}
              onClick={handlePlaceOrder}
            >
              {isLoading ? 'Placing Order...' : 'Place Order'}
            </Button>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
