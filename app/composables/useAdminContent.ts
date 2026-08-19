import { useApi, type ApiResponse } from '~/composables/useApi';
import type { SessionItem } from '~/composables/useEvent';
import type { StoreProduct } from '~/composables/useStore';

export interface ProductMutationPayload {
  code?: string;
  name: string;
  description?: string | null;
  product_type: 'delegate' | 'exhibitor' | 'additional';
  price: number;
  currency: string;
  max_quantity?: number | null;
  is_active: boolean;
}

export interface SessionMutationPayload {
  event_id?: string;
  title: string;
  slug?: string | null;
  description?: string | null;
  session_type?: string | null;
  room_name?: string | null;
  start_at: string;
  end_at: string;
  capacity?: number | null;
  status?: string;
}

export function useAdminContent() {
  const api = useNuxtApp().$api as ReturnType<typeof useApi>;

  const getProducts = (eventId: string) => api<ApiResponse<StoreProduct[]>>(`/store/events/${eventId}/products`);
  const createProduct = (eventId: string, payload: ProductMutationPayload) => api<ApiResponse<StoreProduct>>(`/store/admin/events/${eventId}/products`, { method: 'POST', body: payload });
  const updateProduct = (productId: string, payload: ProductMutationPayload) => api<ApiResponse<StoreProduct>>(`/store/admin/products/${productId}`, { method: 'PUT', body: payload });
  const getSessions = (eventSlug: string) => api<ApiResponse<SessionItem[]>>(`/events/${eventSlug}/sessions`);
  const createSession = (payload: SessionMutationPayload & { event_id: string }) => api<ApiResponse<SessionItem>>('/sessions', { method: 'POST', body: payload });
  const updateSession = (sessionId: string, payload: SessionMutationPayload) => api<ApiResponse<SessionItem>>(`/sessions/${sessionId}`, { method: 'PUT', body: payload });

  return { getProducts, createProduct, updateProduct, getSessions, createSession, updateSession };
}
