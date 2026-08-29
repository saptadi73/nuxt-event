import type { useApi, ApiResponse } from '~/composables/useApi';
import type { DelegatePackageCatalog, DelegatePackageCatalogItem, DelegatePackageFacility, DelegatePackageRate, SessionItem, SpeakerItem } from '~/composables/useEvent';
import type { StoreProduct } from '~/composables/useStore';

export interface DelegatePackageMutationPayload {
  code: string;
  name: string;
  currency: string;
  amount: number;
  payment_amount_idr?: number | null;
  is_active: boolean;
  package_type?: 'main' | 'additional';
  selection_mode?: 'required_one' | 'optional';
  description?: string | null;
  display_order?: number;
}

export interface DelegatePackageRatePayload {
  occupancy_type: 'sharing' | 'single'; name: string; amount: number; currency: string;
  payment_amount_idr: number | null; is_default: boolean; is_active: boolean;
  valid_from?: string | null; valid_until?: string | null;
}
export interface DelegatePackageFacilityPayload {
  name: string; description?: string | null; quantity?: number | null; unit?: string | null;
  pricing_mode: 'included' | 'separately_priced'; sharing_amount?: number | null;
  single_amount?: number | null; currency: string; display_order: number; is_active: boolean;
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

export type TranslatableEntityType =
  | 'event'
  | 'product'
  | 'speaker'
  | 'session'
  | 'delegate_package'
  | 'delegate_package_rate'
  | 'delegate_package_facility'
  | 'event_activity'
  | 'business_matching_slot'
  | 'announcement'
  | 'certificate'
  | 'matching_session'
  | 'meeting_venue'
  | 'meeting_resource';

export interface TranslatableEntityDefinition {
  entity_type: TranslatableEntityType;
  fields: string[];
}

export interface ContentTranslation<TFields extends Record<string, unknown> = Record<string, unknown>> {
  id: string;
  entity_type: TranslatableEntityType;
  entity_id: string;
  locale: 'zh-CN';
  fields: TFields;
  created_at?: string;
  updated_at?: string;
}

export function useAdminContent() {
  const api = useNuxtApp().$api as ReturnType<typeof useApi>;

  const getProducts = (eventId: string) => api<ApiResponse<StoreProduct[]>>(`/store/events/${eventId}/products`);
  const createProduct = (eventId: string, payload: ProductMutationPayload) => api<ApiResponse<StoreProduct>>(`/store/admin/events/${eventId}/products`, { method: 'POST', body: payload });
  const updateProduct = (productId: string, payload: ProductMutationPayload) => api<ApiResponse<StoreProduct>>(`/store/admin/products/${productId}`, { method: 'PUT', body: payload });
  const createDelegatePackage = (eventId: string, payload: DelegatePackageMutationPayload) => api<ApiResponse<DelegatePackageCatalogItem>>(`/admin/events/${eventId}/delegate-packages`, { method: 'POST', body: payload });
  const updateDelegatePackage = (eventId: string, packageId: string, payload: DelegatePackageMutationPayload) => api<ApiResponse<DelegatePackageCatalogItem>>(`/admin/events/${eventId}/delegate-packages/${packageId}`, { method: 'PUT', body: payload });
  const deleteDelegatePackage = (eventId: string, packageId: string) => api<ApiResponse<Record<string, unknown>>>(`/admin/events/${encodeURIComponent(eventId)}/delegate-packages/${encodeURIComponent(packageId)}`, { method: 'DELETE' });
  const getDelegatePackageCatalog = (eventId: string, locale?: 'en' | 'zh-CN') => api<ApiResponse<DelegatePackageCatalog>>(`/admin/events/${eventId}/delegate-package-catalog`, { query: locale ? { locale } : undefined });
  const createDelegatePackageRate = (eventId: string, packageId: string, payload: DelegatePackageRatePayload) => api<ApiResponse<DelegatePackageRate>>(`/admin/events/${eventId}/delegate-packages/${packageId}/rates`, { method: 'POST', body: payload });
  const updateDelegatePackageRate = (rateId: string, payload: DelegatePackageRatePayload) => api<ApiResponse<DelegatePackageRate>>(`/admin/delegate-package-rates/${rateId}`, { method: 'PUT', body: payload });
  const deleteDelegatePackageRate = (rateId: string) => api(`/admin/delegate-package-rates/${rateId}`, { method: 'DELETE' });
  const createDelegatePackageFacility = (eventId: string, packageId: string, payload: DelegatePackageFacilityPayload) => api<ApiResponse<DelegatePackageFacility>>(`/admin/events/${eventId}/delegate-packages/${packageId}/facilities`, { method: 'POST', body: payload });
  const updateDelegatePackageFacility = (facilityId: string, payload: DelegatePackageFacilityPayload) => api<ApiResponse<DelegatePackageFacility>>(`/admin/delegate-package-facilities/${facilityId}`, { method: 'PUT', body: payload });
  const deleteDelegatePackageFacility = (facilityId: string) => api(`/admin/delegate-package-facilities/${facilityId}`, { method: 'DELETE' });
  const getSessions = (eventSlug: string, locale?: 'en' | 'zh-CN') => api<ApiResponse<SessionItem[]>>(`/events/${eventSlug}/sessions`, { query: locale ? { locale } : undefined });
  const createSession = (payload: SessionMutationPayload & { event_id: string }) => api<ApiResponse<SessionItem>>('/sessions', { method: 'POST', body: payload });
  const updateSession = (sessionId: string, payload: SessionMutationPayload) => api<ApiResponse<SessionItem>>(`/sessions/${sessionId}`, { method: 'PUT', body: payload });
  const deleteSession = (sessionId: string) => api(`/sessions/${sessionId}`, { method: 'DELETE' });
  const createSpeaker = (payload: SpeakerMutationPayload) => api<ApiResponse<SpeakerItem>>('/speakers', { method: 'POST', body: payload });
  const updateSpeaker = (speakerId: string, payload: SpeakerMutationPayload) => api<ApiResponse<SpeakerItem>>(`/speakers/${speakerId}`, { method: 'PUT', body: payload });
  const deleteSpeaker = (speakerId: string) => api(`/speakers/${speakerId}`, { method: 'DELETE' });
  const attachSpeakerToEvent = (speakerId: string, eventId: string) => api(`/speakers/${speakerId}/events`, { method: 'POST', body: { event_id: eventId } });

  const getTranslatableEntities = () => api<ApiResponse<TranslatableEntityDefinition[]>>('/admin/content-translations/entities');
  const getContentTranslations = <TFields extends Record<string, unknown> = Record<string, unknown>>(entityType: TranslatableEntityType, entityId: string) =>
    api<ApiResponse<ContentTranslation<TFields>[]>>(`/admin/content-translations/${encodeURIComponent(entityType)}/${encodeURIComponent(entityId)}`);
  const saveContentTranslation = <TFields extends Record<string, unknown>>(entityType: TranslatableEntityType, entityId: string, fields: TFields) =>
    api<ApiResponse<ContentTranslation<TFields>>>(`/admin/content-translations/${encodeURIComponent(entityType)}/${encodeURIComponent(entityId)}/zh-CN`, { method: 'PUT', body: { fields } });
  const deleteContentTranslation = (entityType: TranslatableEntityType, entityId: string) =>
    api<ApiResponse<Record<string, unknown>>>(`/admin/content-translations/${encodeURIComponent(entityType)}/${encodeURIComponent(entityId)}/zh-CN`, { method: 'DELETE' });

  return { getProducts, createProduct, updateProduct, createDelegatePackage, updateDelegatePackage, deleteDelegatePackage, getDelegatePackageCatalog, createDelegatePackageRate, updateDelegatePackageRate, deleteDelegatePackageRate, createDelegatePackageFacility, updateDelegatePackageFacility, deleteDelegatePackageFacility, getSessions, createSession, updateSession, deleteSession, createSpeaker, updateSpeaker, deleteSpeaker, attachSpeakerToEvent, getTranslatableEntities, getContentTranslations, saveContentTranslation, deleteContentTranslation };
}
