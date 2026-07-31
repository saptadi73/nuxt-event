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
}

export interface SessionItem {
  id: string;
  event_id: string;
  title: string;
  slug?: string;
  start_at: string;
  end_at: string;
  capacity?: number;
}

export function useEvent() {
  const api = useNuxtApp().$api as ReturnType<typeof useApi>;

  const getEvents = (page = 1, size = 20) =>
    api<ApiResponse<{ items: EventItem[]; meta?: { page: number; size: number; total: number; pages: number } }>>(
      `/events?page=${page}&size=${size}`
    );

  const getEvent = (eventId: string) => api<ApiResponse<EventItem>>(`/events/${eventId}`);

  const getEventSessions = (slug: string) =>
    api<ApiResponse<{ items: SessionItem[] }>>(`/events/${slug}/sessions`);

  const getEventSpeakers = (slug: string) =>
    api<ApiResponse<{ items: SpeakerItem[] }>>(`/events/${slug}/speakers`);

  return {
    getEvents,
    getEvent,
    getEventSessions,
    getEventSpeakers
  };
}
