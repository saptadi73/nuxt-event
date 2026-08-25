import type { useApi, ApiResponse } from '~/composables/useApi';

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

export type OrganizerRecommendationStatus = 'awaiting_responses' | 'mutually_interested' | 'declined' | 'expired' | 'converted_to_meeting' | 'cancelled';

export interface MatchingParty {
  id: string;
  name?: string;
  full_name?: string;
  organization?: string;
  company_name?: string;
  country?: string;
}

export interface OrganizerRecommendation {
  id: string;
  status: OrganizerRecommendationStatus;
  reason: string;
  topic: string;
  purpose?: string;
  expires_at?: string | null;
  participant_a?: MatchingParty;
  participant_b?: MatchingParty;
  counterpart?: MatchingParty;
  meeting_id?: string | null;
  created_at?: string;
}

export interface MatchingReportItem {
  meeting: MeetingItem & { source?: string; topic?: string; purpose?: string; slot_id?: string | null; resource_id?: string | null; created_at?: string };
  requester: MatchingParty;
  recipient: MatchingParty;
}

export interface MatchingReport {
  summary: Record<string, number>;
  items: MatchingReportItem[];
  pagination: { page: number; size: number; total: number; pages: number };
}

export interface MatchingSettings {
  assisted_matching_enabled: boolean;
  require_mutual_consent: boolean;
  auto_create_meeting: boolean;
  organizer_override_enabled: boolean;
  recommendation_expiry_hours: number;
  reminder_hours_before_expiry: number;
  meeting_reminder_hours: number[];
}

export interface MatchingSlot { id: string; label?: string; slot_date?: string; start_time?: string; end_time?: string; is_active?: boolean }
export interface MeetingResource { id: string; name?: string; label?: string; code?: string; is_active?: boolean }

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
  const getOrganizerRecommendations = (eventId: string) => api<ApiResponse<OrganizerRecommendation[]>>(`/events/${eventId}/business-matching/organizer-recommendations`);
  const respondToOrganizerRecommendation = (id: string, response: 'interested' | 'not_interested') => api<ApiResponse<OrganizerRecommendation>>(`/business-matching/organizer-recommendations/${id}/respond`, { method: 'POST', body: { response } });
  const getAdminReport = (eventId: string, query: Record<string, string | number | undefined>) => api<ApiResponse<MatchingReport>>(`/admin/events/${eventId}/business-matching/report`, { query });
  const getAdminRecommendations = (eventId: string, status?: string) => api<ApiResponse<OrganizerRecommendation[]>>(`/admin/events/${eventId}/business-matching/recommendations`, { query: status ? { status } : undefined });
  const createAdminRecommendation = (eventId: string, body: Record<string, unknown>) => api<ApiResponse<OrganizerRecommendation>>(`/admin/events/${eventId}/business-matching/recommendations`, { method: 'POST', body });
  const meetingAction = (meetingId: string, body: { action: 'confirm' | 'cancel' | 'complete' | 'no_show'; slot_id: string | null; resource_id: string | null; reason: string }) => api<ApiResponse<MeetingItem>>(`/admin/meetings/${meetingId}/action`, { method: 'POST', body });
  const getMatchingSettings = (eventId: string) => api<ApiResponse<MatchingSettings>>(`/admin/events/${eventId}/business-matching/settings`);
  const updateMatchingSettings = (eventId: string, body: MatchingSettings) => api<ApiResponse<MatchingSettings>>(`/admin/events/${eventId}/business-matching/settings`, { method: 'PUT', body });
  const getMatchingSlots = (eventId: string) => api<ApiResponse<MatchingSlot[]>>(`/events/${eventId}/business-matching-slots`);
  const getMeetingResources = (eventId: string) => api<ApiResponse<MeetingResource[]>>(`/events/${eventId}/meeting-resources`);
  return { getProfile, createProfile, updateProfile, deleteProfile, discover, recommendations, getMeetings, requestMeeting, getOrganizerRecommendations, respondToOrganizerRecommendation, getAdminReport, getAdminRecommendations, createAdminRecommendation, meetingAction, getMatchingSettings, updateMatchingSettings, getMatchingSlots, getMeetingResources };
}
