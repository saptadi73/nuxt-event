import type { useApi, ApiResponse, LocalizedContentMeta } from '~/composables/useApi';

export interface AnnouncementItem extends LocalizedContentMeta {
  id: string;
  title: string;
  body: string;
  status?: string;
  published_at?: string | null;
  created_at?: string;
}

export interface CertificateItem extends LocalizedContentMeta {
  id: string;
  event_id?: string;
  user_id?: string;
  certificate_number: string;
  title: string;
  download_url?: string | null;
  issued_at?: string | null;
  created_at?: string;
}

export function useEventUpdates() {
  const api = useNuxtApp().$api as ReturnType<typeof useApi>;
  const getAnnouncements = (eventId: string) => api<ApiResponse<AnnouncementItem[]>>(`/events/${eventId}/announcements`);
  const getMyCertificates = () => api<ApiResponse<CertificateItem[] | CertificateItem | null>>('/certificates/me');
  return { getAnnouncements, getMyCertificates };
}
