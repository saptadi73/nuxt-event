import type { useApi, ApiResponse } from '~/composables/useApi';
import type { AnnouncementItem, CertificateItem } from '~/composables/useEventUpdates';

export interface AdminUserItem {
  id: string;
  email: string;
  full_name?: string | null;
  phone?: string | null;
  country?: string | null;
  role: 'participant' | 'organizer' | 'admin';
  status: 'active' | 'inactive' | 'suspended';
  is_email_verified?: boolean;
  created_at?: string;
}

export interface AdminUserCreatePayload {
  email: string;
  password: string;
  full_name?: string | null;
  phone?: string | null;
  country?: string | null;
  role: AdminUserItem['role'];
  status: AdminUserItem['status'];
  is_email_verified: boolean;
}

export type AdminUserUpdatePayload = Partial<Omit<AdminUserCreatePayload, 'email' | 'password'>>;
export interface AnnouncementPayload { title: string; body: string; status: 'draft' | 'published' | 'archived'; published_at?: string | null }
export interface CertificatePayload { event_id: string; user_id: string; certificate_number: string; title: string; download_url?: string | null; issued_at?: string | null }

export function useAdminOperations() {
  const api = useNuxtApp().$api as ReturnType<typeof useApi>;
  const getUsers = (page = 1, size = 20, role = '', status = '', search = '') => {
    const query = new URLSearchParams({ page: String(page), size: String(size) });
    if (search.trim()) query.set('search', search.trim());
    if (role) query.set('role', role); if (status) query.set('status', status);
    return api<ApiResponse<AdminUserItem[]>>(`/admin/users?${query}`);
  };
  const createUser = (body: AdminUserCreatePayload) => api<ApiResponse<AdminUserItem>>('/admin/users', { method: 'POST', body });
  const updateUser = (id: string, body: AdminUserUpdatePayload) => api<ApiResponse<AdminUserItem>>(`/admin/users/${id}`, { method: 'PUT', body });
  const getAdminAnnouncements = (eventId: string, query: { search?: string; page?: number; size?: number } = {}) => api<ApiResponse<AnnouncementItem[]>>(`/admin/events/${eventId}/announcements`, { query });
  const createAnnouncement = (eventId: string, body: AnnouncementPayload) => api<ApiResponse<AnnouncementItem>>(`/admin/events/${eventId}/announcements`, { method: 'POST', body });
  const updateAnnouncement = (id: string, body: AnnouncementPayload) => api<ApiResponse<AnnouncementItem>>(`/admin/announcements/${id}`, { method: 'PUT', body });
  const deleteAnnouncement = (id: string) => api(`/admin/announcements/${id}`, { method: 'DELETE' });
  const getAdminCertificates = (eventId: string, query: { search?: string; page?: number; size?: number } = {}) => api<ApiResponse<CertificateItem[]>>(`/admin/events/${eventId}/certificates`, { query });
  const createCertificate = (body: CertificatePayload) => api<ApiResponse<CertificateItem>>('/admin/certificates', { method: 'POST', body });
  const updateCertificate = (id: string, body: CertificatePayload) => api<ApiResponse<CertificateItem>>(`/admin/certificates/${id}`, { method: 'PUT', body });
  const deleteCertificate = (id: string) => api(`/admin/certificates/${id}`, { method: 'DELETE' });
  return { getUsers, createUser, updateUser, getAdminAnnouncements, createAnnouncement, updateAnnouncement, deleteAnnouncement, getAdminCertificates, createCertificate, updateCertificate, deleteCertificate };
}
