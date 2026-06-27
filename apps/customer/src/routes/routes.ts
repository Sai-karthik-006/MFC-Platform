export const ROUTES = {
  HOME: '/',
  PRODUCTS: '/products',
  CATEGORIES: '/categories',
  CART: '/cart',
  CHECKOUT: '/checkout',
  ORDERS: '/orders',
  PROFILE: '/profile',
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    FORGOT_PASSWORD: '/auth/forgot-password',
  },
  ADMIN: {
    ROOT: '/admin',
    DASHBOARD: '/admin/dashboard',
    PRODUCTS: '/admin/products',
    ORDERS: '/admin/orders',
    USERS: '/admin/users',
  },
  DELIVERY: {
    ROOT: '/delivery',
    ORDERS: '/delivery/orders',
    TRACKING: '/delivery/tracking',
  },
} as const;

export type Route = typeof ROUTES[keyof typeof ROUTES];
export type AuthRoute = typeof ROUTES.AUTH[keyof typeof ROUTES.AUTH];
export type AdminRoute = typeof ROUTES.ADMIN[keyof typeof ROUTES.ADMIN];
export type DeliveryRoute = typeof ROUTES.DELIVERY[keyof typeof ROUTES.DELIVERY];
export type ProtectedRoute =
  | AuthRoute
  | AdminRoute
  | DeliveryRoute
  | typeof ROUTES.CHECKOUT
  | typeof ROUTES.ORDERS
  | typeof ROUTES.PROFILE;
