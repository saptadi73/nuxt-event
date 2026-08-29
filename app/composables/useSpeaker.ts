import type { useApi, ApiResponse } from '~/composables/useApi';
import type { SpeakerItem } from '~/composables/useEvent';

export function useSpeaker() {
  const api = useNuxtApp().$api as ReturnType<typeof useApi>;

  const getSpeakers = (page = 1, size = 100, locale?: 'en' | 'zh-CN') =>
    api<ApiResponse<SpeakerItem[]>>(`/speakers?page=${page}&size=${size}`, { query: locale ? { locale } : undefined });

  const uploadSpeakerPhoto = (speakerId: string, file: File) => {
    const normalizedSpeakerId = speakerId.trim();
    const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidPattern.test(normalizedSpeakerId)) {
      throw new Error(`Invalid speaker ID: ${normalizedSpeakerId || '(empty)'}. Reload the speaker list and try again.`);
    }

    const body = new FormData();
    body.append('file', file);

    return api<ApiResponse<SpeakerItem>>(`/speakers/${encodeURIComponent(normalizedSpeakerId)}/photo`, {
      method: 'POST',
      body
    });
  };

  return { getSpeakers, uploadSpeakerPhoto };
}
