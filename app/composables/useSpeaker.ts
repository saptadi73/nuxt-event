import type { useApi, ApiResponse } from '~/composables/useApi';
import type { SpeakerItem } from '~/composables/useEvent';

export function useSpeaker() {
  const api = useNuxtApp().$api as ReturnType<typeof useApi>;

  const getSpeakers = (page = 1, size = 100) =>
    api<ApiResponse<SpeakerItem[]>>(`/speakers?page=${page}&size=${size}`);

  const uploadSpeakerPhoto = (speakerId: string, file: File) => {
    const body = new FormData();
    body.append('file', file);

    return api<ApiResponse<SpeakerItem>>(`/speakers/${speakerId}/photo`, {
      method: 'POST',
      body
    });
  };

  return { getSpeakers, uploadSpeakerPhoto };
}
