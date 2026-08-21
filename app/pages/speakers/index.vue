<template>
  <section class="mx-auto max-w-7xl px-3 py-10 sm:px-6 lg:px-8">
    <p class="text-sm uppercase tracking-[0.3em] text-cyan-200/70">Speakers</p>
    <div class="mt-3 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <h1 class="text-3xl font-black text-white sm:text-4xl lg:text-5xl">Featured Speakers & Ecosystem Leaders</h1>
      <span class="inline-flex w-fit rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.25em] text-slate-200">
        {{ loading ? 'Loading...' : `${displayItems.length} speakers` }}
      </span>
    </div>

    <div v-if="loading" class="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3" role="status" aria-live="polite" aria-label="Loading speakers">
      <article v-for="item in 6" :key="item" class="rounded-[1.75rem] border border-white/10 bg-white/5 p-4 sm:p-5" aria-hidden="true">
        <div class="speaker-skeleton h-20 w-20 rounded-2xl" />
        <div class="speaker-skeleton mt-5 h-2.5 w-12 rounded-full" />
        <div class="speaker-skeleton mt-3 h-5 w-3/4 rounded-full" />
        <div class="speaker-skeleton mt-2 h-3 w-1/2 rounded-full" />
        <div class="speaker-skeleton mt-5 h-3 w-2/3 rounded-full" />
        <div class="mt-5 space-y-2">
          <div class="speaker-skeleton h-3 w-full rounded-full" />
          <div class="speaker-skeleton h-3 w-5/6 rounded-full" />
          <div class="speaker-skeleton h-3 w-2/3 rounded-full" />
        </div>
      </article>
      <span class="sr-only">Loading speakers...</span>
    </div>

    <div v-else-if="error" class="mt-8 rounded-[1.75rem] border border-orange-300/20 bg-orange-300/10 p-4 text-sm text-orange-100">
      <p class="font-semibold">Unable to load speakers from backend.</p>
      <p class="mt-1 text-orange-100/80">Please check the API connection or try again.</p>
      <button type="button" class="mt-3 rounded-full border border-orange-300/30 px-4 py-2 text-xs uppercase tracking-[.2em] text-orange-100" @click="() => refresh()">Retry</button>
    </div>

    <div v-else-if="!displayItems.length" class="mt-8 rounded-[1.75rem] border border-white/10 bg-white/5 p-4 text-sm text-slate-200">
      <p>No speakers found.</p>
    </div>

    <div v-else class="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      <article
        v-for="speaker in displayItems"
        :key="speaker.id"
        class="rounded-[1.75rem] border border-white/10 bg-white/5 p-4 sm:p-5"
      >
        <img v-if="speaker.profile_photo_url && !unavailablePhotos.has(speaker.id)" :src="mediaUrl(speaker.profile_photo_url)" :alt="speaker.full_name" class="mb-5 h-20 w-20 rounded-2xl object-cover" @error="markPhotoUnavailable(speaker.id)" />
        <div v-else class="mb-5 flex h-20 w-20 items-center justify-center rounded-2xl bg-cyan-300/10 text-xl font-bold text-cyan-200">{{ initials(speaker.full_name) }}</div>
        <p class="text-[10px] uppercase tracking-[.25em] text-slate-400 sm:text-xs">{{ speaker.country_code || 'UNSPEC' }}</p>
        <h2 class="mt-3 text-xl font-semibold text-white">{{ speaker.full_name }}</h2>
        <p class="mt-1 text-sm text-cyan-200/90">{{ speaker.professional_title || 'Speaker' }}</p>
        <p class="mt-4 text-sm text-slate-300">{{ speaker.organization_name || '-' }}</p>
        <p class="mt-3 text-sm leading-7 text-slate-300">{{ speaker.biography }}</p>
        <div v-if="speaker.expertise_tags?.length" class="mt-4 flex flex-wrap gap-2"><span v-for="tag in speaker.expertise_tags" :key="tag" class="rounded-full bg-white/5 px-3 py-1 text-xs text-slate-300">{{ tag }}</span></div>
        <p v-if="speaker.session_title" class="mt-4 border-t border-white/10 pt-4 text-sm text-orange-100"><strong>Forum Topic:</strong> {{ speaker.session_title }}</p>
      </article>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useEvent } from '~/composables/useEvent';

const config = useRuntimeConfig();
const { getEventSpeakers } = useEvent();
const { mediaUrl } = useMediaUrl();
const unavailablePhotos = ref(new Set<string>());
const initials = (name: string) => name.split(' ').map((part) => part[0]).slice(0, 2).join('').toUpperCase();
const markPhotoUnavailable = (speakerId: string) => {
  unavailablePhotos.value = new Set([...unavailablePhotos.value, speakerId]);
};
const eventSlug = config.public.eventSlug;
const { data: response, pending: loading, error, refresh } = await useAsyncData(
  `event-speakers-${eventSlug}`,
  () => getEventSpeakers(eventSlug)
);

const items = computed(() => response.value?.data ?? []);
const displayItems = computed(() =>
  [...items.value].sort((a, b) => {
    const nameA = (a.full_name || '').toLowerCase();
    const nameB = (b.full_name || '').toLowerCase();
    if (nameA === nameB) {
      return (a.id || '').localeCompare(b.id || '');
    }
    return nameA.localeCompare(nameB);
  })
);
</script>

<style scoped>
.speaker-skeleton { position:relative; overflow:hidden; background:rgba(255,255,255,.075); }
.speaker-skeleton::after { content:''; position:absolute; inset:0; transform:translateX(-100%); background:linear-gradient(90deg,transparent,rgba(255,255,255,.1),transparent); animation:speaker-shimmer 1.5s infinite; }
@keyframes speaker-shimmer { to { transform:translateX(100%); } }
@media (prefers-reduced-motion:reduce) { .speaker-skeleton::after { animation:none; } }
</style>
