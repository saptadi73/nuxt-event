import { useApi, type ApiResponse } from '~/composables/useApi';
import type { SessionItem, SpeakerItem } from '~/composables/useEvent';
import type { StoreProduct } from '~/composables/useStore';

export interface DelegatePackageMutationPayload {
  code: string;
  name: string;
  currency: string;
  amount: number;
  payment_amount_idr?: number | null;
  is_active: boolean;
}

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

export interface SpeakerMutationPayload {
  full_name: string;
  professional_title?: string | null;
  organization_name?: string | null;
  country_code?: string | null;
  biography?: string | null;
  linkedin_url?: string | null;
  website_url?: string | null;
  expertise_tags?: string[];
  session_title?: string | null;
  is_featured?: boolean;
  status?: string;
}

export function useAdminContent() {
  const api = useNuxtApp().$api as ReturnType<typeof useApi>;

  const getProducts = (eventId: string) => api<ApiResponse<StoreProduct[]>>(`/store/events/${eventId}/products`);
  const createProduct = (eventId: string, payload: ProductMutationPayload) => api<ApiResponse<StoreProduct>>(`/store/admin/events/${eventId}/products`, { method: 'POST', body: payload });
  const updateProduct = (productId: string, payload: ProductMutationPayload) => api<ApiResponse<StoreProduct>>(`/store/admin/products/${productId}`, { method: 'PUT', body: payload });
  const createDelegatePackage = (eventId: string, payload: DelegatePackageMutationPayload) => api(`/admin/events/${eventId}/delegate-packages`, { method: 'POST', body: payload });
  const updateDelegatePackage = (eventId: string, packageId: string, payload: DelegatePackageMutationPayload) => api(`/admin/events/${eventId}/delegate-packages/${packageId}`, { method: 'PUT', body: payload });
  const deleteDelegatePackage = (eventId: string, packageId: string) => api(`/admin/events/${eventId}/delegate-packages/${packageId}`, { method: 'DELETE' });
  const getSessions = (eventSlug: string) => api<ApiResponse<SessionItem[]>>(`/events/${eventSlug}/sessions`);
  const createSession = (payload: SessionMutationPayload & { event_id: string }) => api<ApiResponse<SessionItem>>('/sessions', { method: 'POST', body: payload });
  const updateSession = (sessionId: string, payload: SessionMutationPayload) => api<ApiResponse<SessionItem>>(`/sessions/${sessionId}`, { method: 'PUT', body: payload });
  const deleteSession = (sessionId: string) => api(`/sessions/${sessionId}`, { method: 'DELETE' });
  const createSpeaker = (payload: SpeakerMutationPayload) => api<ApiResponse<SpeakerItem>>('/speakers', { method: 'POST', body: payload });
  const updateSpeaker = (speakerId: string, payload: SpeakerMutationPayload) => api<ApiResponse<SpeakerItem>>(`/speakers/${speakerId}`, { method: 'PUT', body: payload });
  const deleteSpeaker = (speakerId: string) => api(`/speakers/${speakerId}`, { method: 'DELETE' });
  const attachSpeakerToEvent = (speakerId: string, eventId: string) => api(`/speakers/${speakerId}/events`, { method: 'POST', body: { event_id: eventId } });

  return { getProducts, createProduct, updateProduct, createDelegatePackage, updateDelegatePackage, deleteDelegatePackage, getSessions, createSession, updateSession, deleteSession, createSpeaker, updateSpeaker, deleteSpeaker, attachSpeakerToEvent };
}
