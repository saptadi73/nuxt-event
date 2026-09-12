import type { useApi, ApiResponse } from '~/composables/useApi';

export interface ParticipantProfile {
  id: string;
  user_id: string;
  full_name: string;
  organization_name?: string;
  biography?: string;
  profile_photo_url?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ParticipantPayload {
  full_name: string;
  organization_name?: string;
  biography?: string;
}

export interface CompleteParticipantProfile {
  participant_id: string;
  account: Record<string, unknown>;
  profile: ParticipantProfile;
  companies: Record<string, unknown>[];
  registrations: Record<string, unknown>[];
  exhibitors: Record<string, unknown>[];
  business_matching: Record<string, unknown>[];
}

export function useParticipant() {
  const api = useNuxtApp().$api as ReturnType<typeof useApi>;

  const getMyProfile = () => api<ApiResponse<ParticipantProfile>>('/participants/me');

  const getParticipant = (id: string) =>
    api<ApiResponse<ParticipantProfile>>(`/participants/${encodeURIComponent(id)}`);

  const getCompleteParticipantProfile = (id: string) =>
    api<ApiResponse<CompleteParticipantProfile>>(`/admin/reports/participants/${encodeURIComponent(id)}/profile`);

  const getParticipants = (page = 1, size = 20) =>
    api<ApiResponse<ParticipantProfile[] | { items: ParticipantProfile[] }>>(`/participants?page=${page}&size=${size}`);

  const upsertMyProfile = (payload: ParticipantPayload) =>
    api<ApiResponse<ParticipantProfile>>('/participants/me', {
      method: 'PUT',
      body: payload
    });

  const patchMyProfile = (payload: Partial<ParticipantPayload>) =>
    api<ApiResponse<ParticipantProfile>>('/participants/me', {
      method: 'PATCH',
      body: payload
    });

  const uploadMyPhoto = (file: File) => {
    const body = new FormData();
    body.append('file', file);

    return api<ApiResponse<ParticipantProfile>>('/participants/me/photo', {
      method: 'POST',
      body
    });
  };

  return {
    getMyProfile,
    getParticipant,
    getCompleteParticipantProfile,
    getParticipants,
    upsertMyProfile,
    patchMyProfile,
    uploadMyPhoto
  };
}
