<template>
  <section class="mx-auto max-w-4xl px-3 py-10 sm:px-6">
    <p class="text-sm uppercase tracking-[.35em] text-cyan-200">Event Announcements</p>
    <h1 class="mt-3 text-3xl font-black sm:text-4xl">Important participant updates</h1>
    <p v-if="pending" class="glass-card mt-8 rounded-3xl p-6 text-slate-300">Loading announcements...</p>
    <p v-else-if="errorMessage" class="mt-8 rounded-2xl border border-red-300/30 bg-red-950/30 p-4 text-red-100">{{ errorMessage }}</p>
    <p v-else-if="!items.length" class="glass-card mt-8 rounded-3xl p-6 text-slate-300">No announcements have been published yet.</p>
    <div v-else class="mt-8 space-y-5">
      <article v-for="item in items" :key="item.id" class="glass-card rounded-3xl p-4 sm:p-6">
        <div class="flex flex-wrap justify-between gap-3"><span class="text-xs uppercase tracking-[.25em] text-orange-200">Announcement</span><time class="text-xs text-slate-500">{{ formatDate(item.published_at || item.created_at) }}</time></div>
        <h2 class="mt-3 text-lg font-bold sm:text-xl">{{ item.title }}</h2>
        <p class="mt-3 whitespace-pre-line text-sm leading-7 text-slate-300 sm:text-base">{{ item.body }}</p>
      </article>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useEvent, type EventItem } from '~/composables/useEvent';
import { useEventUpdates, type AnnouncementItem } from '~/composables/useEventUpdates';

definePageMeta({ middleware: 'auth' });
useSeoMeta({ title: 'Announcements | IWBIF 2026' });
const config = useRuntimeConfig();
const { getEvents } = useEvent();
const { getAnnouncements } = useEventUpdates();
const errorMessage = ref('');
const { data: items, pending } = await useAsyncData<AnnouncementItem[]>('dashboard-announcements', async () => {
  try {
    const events = (await getEvents(1, 100)).data as EventItem[];
    const event = events.find(item => item.slug === config.public.eventSlug) || events[0];
    if (!event) return [];
    return (await getAnnouncements(event.id)).data || [];
  } catch (error) {
    const value = error as { data?: { message?: string } };
    errorMessage.value = value.data?.message || (error instanceof Error ? error.message : 'Announcements could not be loaded.');
    return [];
  }
}, { default: () => [] });
const formatDate = (value?: string | null) => value ? new Intl.DateTimeFormat('en-GB', { dateStyle: 'long', timeZone: 'Asia/Jakarta' }).format(new Date(value)) : '';
</script>
