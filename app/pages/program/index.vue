<template>
  <section class="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
    <p class="text-sm uppercase tracking-[0.3em] text-cyan-200/70">Program</p>
    <h1 class="mt-3 text-4xl font-black text-white">Agenda program berdasarkan event</h1>

    <div v-if="eventsLoading" class="mt-8 grid gap-4 md:grid-cols-4">
      <div v-for="item in 4" :key="item" class="h-20 animate-pulse rounded-[1.5rem] bg-white/5"></div>
    </div>

    <div v-else class="mt-8 grid gap-4 md:grid-cols-3">
      <button
        v-for="event in events"
        :key="event.id"
        class="rounded-[1.5rem] border border-white/10 bg-white/5 p-4 text-left transition hover:border-cyan-300/40"
        @click="loadSessions(event.slug || '')"
      >
        <p class="text-xs uppercase tracking-[0.25em] text-slate-400">{{ event.timezone || 'Asia/Bangkok' }}</p>
        <p class="mt-2 text-xl font-semibold text-white">{{ event.name }}</p>
        <p class="mt-2 text-sm text-slate-300">{{ event.venue_name || '-' }}</p>
      </button>
    </div>

    <div class="mt-10 rounded-[2rem] border border-white/10 bg-white/5 p-6">
      <div class="flex items-center justify-between gap-3">
        <h2 class="text-2xl font-bold text-white">
          {{ selectedEventLabel }}
        </h2>
        <span
          v-if="sessionsLoading"
          class="rounded-full border border-cyan-300/40 bg-cyan-300/10 px-3 py-1 text-xs uppercase tracking-[0.25em] text-cyan-100"
        >
          Loading sessions
        </span>
      </div>

      <div v-if="selectedEventId && sessionsLoading" class="mt-6 grid gap-3">
        <div class="h-20 animate-pulse rounded-xl bg-white/10"></div>
        <div class="h-20 animate-pulse rounded-xl bg-white/10"></div>
      </div>

      <div v-else-if="selectedEventId && sessions.length" class="mt-6 grid gap-3">
        <article v-for="session in sessions" :key="session.id" class="rounded-xl border border-white/10 bg-slate-900/50 p-4">
          <p class="text-xs uppercase tracking-[0.25em] text-slate-400">Session</p>
          <h3 class="mt-1 text-lg font-semibold text-white">{{ session.title }}</h3>
          <p class="mt-2 text-sm text-slate-300">
            {{ formatDate(session.start_at) }} - {{ formatDate(session.end_at) }}
          </p>
        </article>
      </div>

      <div v-else class="mt-6 rounded-xl border border-dashed border-white/10 p-5 text-slate-300">
        {{ selectedEventId ? 'Belum ada session untuk event ini.' : 'Pilih event untuk melihat sesi.' }}
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useEvent } from '~/composables/useEvent';

interface EventItem {
  id: string;
  name: string;
  slug?: string;
  venue_name?: string;
  timezone?: string;
}

interface SessionItem {
  id: string;
  title: string;
  start_at: string;
  end_at: string;
}

const { getEvents, getEventSessions } = useEvent();

const eventData = await getEvents(1, 12);
const events = eventData.data?.items ?? [];
const eventsLoading = false;

const selectedEventId = ref('');
const selectedEventLabel = ref('Pilih event untuk menampilkan sesi');
const sessions = ref<SessionItem[]>([]);
const sessionsLoading = ref(false);

const loadSessions = async (slug: string) => {
  if (!slug) return;

  const selected = events.find((event: EventItem) => event.slug === slug);
  selectedEventLabel.value = selected ? selected.name : slug;
  selectedEventId.value = slug;
  sessionsLoading.value = true;

  const response = await getEventSessions(slug);
  sessions.value = response.data?.items ?? [];
  sessionsLoading.value = false;
};

const formatDate = (iso: string) =>
  new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(iso));
</script>
