<template>
  <section class="mx-auto max-w-4xl px-4 py-14 sm:px-6">
    <h1 class="text-4xl font-black">Manage Speaker Photos</h1>
    <p class="mt-3 text-slate-300">Upload a JPG, PNG, or WebP profile photo (maximum 5 MB) for each speaker.</p>

    <div v-if="pending" class="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3"><div v-for="item in 6" :key="item" class="h-60 animate-pulse rounded-3xl bg-white/5" /></div>
    <div v-else class="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
      <article v-for="speaker in speakers" :key="speaker.id" class="glass-card rounded-3xl p-6">
        <img v-if="speaker.profile_photo_url" :src="mediaUrl(speaker.profile_photo_url)" :alt="speaker.full_name" class="h-20 w-20 rounded-2xl object-cover" />
        <div v-else class="flex h-20 w-20 items-center justify-center rounded-2xl bg-cyan-300/10 text-xl font-bold text-cyan-200">{{ initials(speaker.full_name) }}</div>
        <h2 class="mt-4 text-xl font-bold">{{ speaker.full_name }}</h2>
        <p class="mt-1 text-sm text-slate-400">{{ speaker.professional_title || 'Speaker' }}</p>
        <label class="mt-5 block text-sm text-slate-300">
          <span class="mb-2 block">Replace photo</span>
          <input type="file" accept="image/jpeg,image/png,image/webp" :disabled="uploadingId === speaker.id" @change="uploadPhoto(speaker.id, $event)" class="block w-full text-xs text-slate-300 file:mr-3 file:rounded-full file:border-0 file:bg-cyan-400 file:px-3 file:py-2 file:font-semibold file:text-slate-950 disabled:opacity-50" />
        </label>
      </article>
    </div>
    <p v-if="feedback" class="mt-6 rounded-2xl border border-cyan-300/30 bg-cyan-300/10 px-4 py-3 text-sm">{{ feedback }}</p>
  </section>
</template>

<script setup lang="ts">
import { useSpeaker } from '~/composables/useSpeaker';
import type { SpeakerItem } from '~/composables/useEvent';
import type { ApiResponse } from '~/composables/useApi';

definePageMeta({ middleware: 'auth' });
useSeoMeta({ title: 'Manage Speaker Photos | IWBIF 2026' });

const { getSpeakers, uploadSpeakerPhoto } = useSpeaker();
const { mediaUrl } = useMediaUrl();
const feedback = ref('');
const uploadingId = ref('');
const { data: response, pending } = await useAsyncData<ApiResponse<SpeakerItem[]>>('admin-speakers', () => getSpeakers());
const speakers = ref<SpeakerItem[]>(response.value?.data ?? []);
const initials = (name: string) => name.split(' ').map((part) => part[0]).slice(0, 2).join('').toUpperCase();

const uploadPhoto = async (speakerId: string, event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (!file) return;

  uploadingId.value = speakerId;
  feedback.value = '';
  try {
    const result = await uploadSpeakerPhoto(speakerId, file);
    const index = speakers.value.findIndex((speaker) => speaker.id === speakerId);
    if (index >= 0) speakers.value[index] = result.data;
    feedback.value = 'Speaker photo updated.';
  } catch (error) {
    feedback.value = error instanceof Error ? error.message : 'Speaker photo could not be uploaded.';
  } finally {
    uploadingId.value = '';
  }
};
</script>
