export interface OrderItemResponse {
  id: string;
  productName: string;
  variantName: string;
  unitPrice: number;
  quantity: number;
  total: number;
}

export interface OrderResponse {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string | null;
  customerAddress: string;
  landmark: string | null;
  notes: string | null;
  subtotal: number;
  deliveryCharge: number;
  discount: number;
  totalAmount: number;
  orderStatus: string;
  paymentMethod: string;
  createdAt: Date;
  updatedAt: Date;
  items: OrderItemResponse[];
}
