import { useApi, type ApiResponse } from '~/composables/useApi';

export interface EventItem {
  id: string;
  name: string;
  slug?: string;
  description?: string;
  venue_name?: string;
  venue_address?: string;
  timezone?: string;
  start_at: string;
  end_at: string;
  capacity?: number;
  status?: string;
}

export interface SpeakerItem {
  id: string;
  full_name: string;
  professional_title?: string;
  organization_name?: string;
  biography?: string;
  country_code?: string;
  profile_photo_url?: string;
  expertise_tags?: string[];
  session_title?: string;
}

export interface SessionItem {
  id: string;
  event_id: string;
  title: string;
  slug?: string;
  start_at: string;
  end_at: string;
  capacity?: number;
  description?: string;
  session_type?: string;
  room_name?: string;
  status?: string;
}

export interface WorkshopTrackItem {
  id: string;
  event_id: string;
  name: string;
  description?: string;
  capacity?: number;
  order_index?: number;
}

export interface TicketTypeItem {
  id: string;
  event_id: string;
  code: string;
  name: string;
  description?: string;
  price: number;
  currency: string;
  capacity?: number;
  sales_start_at?: string;
  sales_end_at?: string;
  is_active: boolean;
}

export interface DelegatePackageItem extends TicketTypeItem {
  amount: number;
  payment_amount_idr?: number | null;
  inclusions?: string[];
  accommodation_nights?: number;
}

export interface ActivityItem extends WorkshopTrackItem {
  is_active?: boolean;
  activity_type?: string;
  start_at?: string;
  end_at?: string;
}

export interface ExhibitorItem {
  id: string;
  company_name: string;
  country?: string;
  industry?: string;
  product?: string;
  description?: string;
  website?: string;
  booth_number?: string;
  logo_url?: string;
}

export function useEvent() {
  const api = useNuxtApp().$api as ReturnType<typeof useApi>;

  const getEvents = (page = 1, size = 20) =>
    api<ApiResponse<EventItem[]>>(
      `/events?page=${page}&size=${size}`
    );

  const getEvent = (eventId: string) => api<ApiResponse<EventItem>>(`/events/${eventId}`);

  const getEventSessions = (slug: string) =>
    api<ApiResponse<SessionItem[]>>(`/events/${slug}/sessions`);

  const getEventSpeakers = (slug: string) =>
    api<ApiResponse<SpeakerItem[]>>(`/events/${slug}/speakers`);

  const getEventWorkshopTracks = (slug: string) =>
    api<ApiResponse<WorkshopTrackItem[]>>(`/events/${slug}/workshop-tracks`);

  const getEventTicketTypes = (slug: string) =>
    api<ApiResponse<TicketTypeItem[]>>(`/events/${slug}/ticket-types`);

  const getEventDelegatePackages = (eventId: string) =>
    api<ApiResponse<DelegatePackageItem[]>>(`/events/${eventId}/delegate-packages`);

  const getEventActivities = (eventId: string) =>
    api<ApiResponse<ActivityItem[]>>(`/events/${eventId}/activities`);

  const getEventExhibitors = (eventId: string) =>
    api<ApiResponse<ExhibitorItem[]>>(`/events/${eventId}/exhibitors`);

  return {
    getEvents,
    getEvent,
    getEventSessions,
    getEventSpeakers,
    getEventWorkshopTracks,
    getEventTicketTypes,
    getEventDelegatePackages,
    getEventActivities,
    getEventExhibitors
  };
}
