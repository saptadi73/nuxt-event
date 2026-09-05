import type { useApi, ApiResponse } from '~/composables/useApi';

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
  metadata_json?: Record<string, unknown> | null;
}

export type AdditionalPurchaseStatus = 'available' | 'pending' | 'partially_paid' | 'owned' | 'registration_required' | 'main_payment_required' | 'unavailable';
export const ADDITIONAL_PURCHASE_MODE_STATUSES: readonly AdditionalPurchaseStatus[] = ['available', 'pending', 'partially_paid', 'owned'];

export const hasMainPackageEntitlement = (products: PersonalizedAdditionalProduct[]) =>
  products.some(product => ADDITIONAL_PURCHASE_MODE_STATUSES.includes(product.purchase_status));

export interface PersonalizedAdditionalProduct extends StoreProduct {
  purchase_status: AdditionalPurchaseStatus;
  is_purchasable: boolean;
  existing_order_id?: string | null;
  registration_id?: string | null;
  reason?: string | null;
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
  order_kind?: 'main_registration' | 'additional' | string;
  paid_amount?: number;
  remaining_amount?: number;
  is_payment_complete?: boolean;
  payment_sequence_count?: number;
}

export interface ExhibitorAvailability {
  is_purchasable: boolean;
  existing_order_id: string | null;
  order_status: string | null;
  exhibitor_id: string | null;
}

export function useStore() {
  const api = useNuxtApp().$api as ReturnType<typeof useApi>;
  const getProducts = (eventId: string) => api<ApiResponse<StoreProduct[]>>(`/store/events/${eventId}/products`);
  const getMyAdditionalProducts = (eventId: string) => api<ApiResponse<PersonalizedAdditionalProduct[]>>(`/store/events/${eventId}/additional-products/me`);
  const getExhibitorAvailability = (eventId: string) => api<ApiResponse<ExhibitorAvailability>>(`/store/events/${eventId}/exhibitor-availability/me`);
  const getCart = (eventId: string) => api<ApiResponse<StoreCart>>(`/store/events/${eventId}/cart`);
  const addCartItem = (eventId: string, productId: string, quantity = 1) => api<ApiResponse<StoreCart>>(`/store/events/${eventId}/cart/items`, { method: 'POST', body: { product_id: productId, quantity } });
  const removeCartItem = (eventId: string, productId: string) => api<ApiResponse<StoreCart>>(`/store/events/${eventId}/cart/items/${encodeURIComponent(productId)}`, { method: 'DELETE' });
  const checkout = (eventId: string) => api<ApiResponse<StoreOrder>>(`/store/events/${eventId}/checkout`, { method: 'POST' });
  return { getExhibitorAvailability, getProducts, getMyAdditionalProducts, getCart, addCartItem, removeCartItem, checkout };
}
