import { useCart as useCartInternal } from '../context/cart-context';
export type { CartItem } from '../context/cart-context';

export const useCart = useCartInternal;