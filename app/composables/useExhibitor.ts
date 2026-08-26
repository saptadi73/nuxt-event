import type { useApi, ApiResponse } from '~/composables/useApi';

export interface ExhibitorCreatePayload {
  company_name: string;
  brand?: string;
  contact_person: string;
  email: string;
  products_to_display: string;
  booth_size_requested: string;
  electricity_requirement?: string;
  special_requirement?: string;
  exhibition_terms_accepted: boolean;
  exhibition_terms_version: string;
}

export interface ExhibitorRecord {
  id: string;
  event_id: string;
  company_name: string;
  country?: string;
  brand?: string;
  contact_person?: string;
  email?: string;
  phone?: string;
  status?: string;
  created_at?: string;
  updated_at?: string;
}

export function useExhibitor() {
  const api = useNuxtApp().$api as ReturnType<typeof useApi>;

  const createExhibitor = (eventId: string, payload: ExhibitorCreatePayload) =>
    api<ApiResponse<ExhibitorRecord>>(`/events/${eventId}/exhibitors`, {
      method: 'POST',
      body: payload
    });

  const getMyExhibitors = (eventId: string) =>
    api<ApiResponse<ExhibitorRecord[]>>(`/events/${eventId}/exhibitors`);

  const getExhibitor = (eventId: string, exhibitorId: string) =>
    api<ApiResponse<ExhibitorRecord & Partial<ExhibitorCreatePayload>>>(`/events/${eventId}/exhibitors/${exhibitorId}`);

  const updateExhibitor = (eventId: string, exhibitorId: string, payload: Partial<ExhibitorCreatePayload>) =>
    api<ApiResponse<ExhibitorRecord>>(`/events/${eventId}/exhibitors/${exhibitorId}`, {
      method: 'PUT',
      body: payload
    });

  return {
    createExhibitor,
    getMyExhibitors,
    getExhibitor,
    updateExhibitor
  };
}
