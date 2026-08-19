import { useApi, type ApiResponse } from '~/composables/useApi';

export interface StoreProduct {
  id: string;
  event_id: string;
  code?: string;
  name: string;
  description?: string | null;
  product_type: 'delegate' | 'exhibitor' | 'additional' | string;
  amount?: number;
  price?: number;
  currency: string;
  is_active: boolean;
  max_quantity?: number | null;
  inclusions?: string[];
}

export interface StoreCartItem {
  id?: string;
  product_id: string;
  quantity: number;
  unit_price?: number;
  subtotal?: number;
  currency?: string;
  product?: StoreProduct;
  product_name?: string;
  name?: string;
}

export interface StoreCart {
  id?: string;
  event_id?: string;
  items: StoreCartItem[];
  subtotal?: number;
  total_amount?: number;
  currency?: string;
}

export interface StoreOrder {
  id?: string;
  order_id?: string;
  order_number: string;
  total_amount: number;
  currency: string;
  status: string;
  registration_id?: string;
}

export function useStore() {
  const api = useNuxtApp().$api as ReturnType<typeof useApi>;
  const getProducts = (eventId: string) => api<ApiResponse<StoreProduct[]>>(`/store/events/${eventId}/products`);
  const getCart = (eventId: string) => api<ApiResponse<StoreCart>>(`/store/events/${eventId}/cart`);
  const addCartItem = (eventId: string, productId: string, quantity = 1) => api<ApiResponse<StoreCart>>(`/store/events/${eventId}/cart/items`, { method: 'POST', body: { product_id: productId, quantity } });
  const removeCartItem = (eventId: string, productId: string) => api<ApiResponse<StoreCart>>(`/store/events/${eventId}/cart/items/${encodeURIComponent(productId)}`, { method: 'DELETE' });
  const checkout = (eventId: string) => api<ApiResponse<StoreOrder>>(`/store/events/${eventId}/checkout`, { method: 'POST' });
  return { getProducts, getCart, addCartItem, removeCartItem, checkout };
}
