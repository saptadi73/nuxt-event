import { useApi, type ApiResponse } from '~/composables/useApi';

export interface BusinessMatchingProfile {
  id?: string;
  company_name: string;
  country: string;
  representative: string;
  email: string;
  phone: string;
  products: string;
  services: string;
  hs_code: string;
  production_capacity: string;
  certificates: string;
  markets_served: string;
  looking_for: string[];
  preferred_countries: string[];
  preferred_slot_ids: string[];
  estimated_deal_investment_value: string;
  additional_notes: string;
  profile_sharing_consent: boolean;
}

export interface MeetingItem {
  id: string;
  status: string;
  scheduled_at?: string;
  participant_name?: string;
  company_name?: string;
}

export interface MeetingCreatePayload {
  recipient_participant_id: string;
  conversation_id?: string | null;
  purpose: string;
  topic: string;
  description?: string | null;
  proposed_slot_ids?: string[];
}

export function useBusinessMatching() {
  const api = useNuxtApp().$api as ReturnType<typeof useApi>;
  const getProfile = (registrationId: string) => api<ApiResponse<BusinessMatchingProfile>>(`/registrations/${registrationId}/business-matching-profile`);
  const createProfile = (registrationId: string, body: BusinessMatchingProfile) => api<ApiResponse<BusinessMatchingProfile>>(`/registrations/${registrationId}/business-matching-profile`, { method: 'POST', body });
  const updateProfile = (registrationId: string, body: Partial<BusinessMatchingProfile>) => api<ApiResponse<BusinessMatchingProfile>>(`/registrations/${registrationId}/business-matching-profile`, { method: 'PATCH', body });
  const deleteProfile = (registrationId: string) => api<ApiResponse<null>>(`/registrations/${registrationId}/business-matching-profile`, { method: 'DELETE' });
  const discover = (eventId: string, query?: Record<string, string>) => api<ApiResponse<BusinessMatchingProfile[]>>(`/events/${eventId}/business-matching/participants`, { query });
  const recommendations = (eventId: string) => api<ApiResponse<BusinessMatchingProfile[]>>(`/events/${eventId}/business-matching/recommendations`);
  const getMeetings = (eventId: string) => api<ApiResponse<MeetingItem[]>>(`/events/${eventId}/meetings`);
  const requestMeeting = (eventId: string, body: MeetingCreatePayload) => api<ApiResponse<MeetingItem>>(`/events/${eventId}/meetings`, { method: 'POST', body });
  return { getProfile, createProfile, updateProfile, deleteProfile, discover, recommendations, getMeetings, requestMeeting };
}
