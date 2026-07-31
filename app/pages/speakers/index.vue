<template>
  <section class="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
    <p class="text-sm uppercase tracking-[0.3em] text-cyan-200/70">Speakers</p>
    <div class="mt-3 flex items-end justify-between gap-4">
      <h1 class="text-4xl font-black text-white">Pembicara yang tampil di event</h1>
      <span class="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.25em] text-slate-200">
        {{ loading ? 'Loading...' : `${items?.length || 0} orang` }}
      </span>
    </div>

    <div v-if="loading" class="mt-8 grid gap-4 md:grid-cols-3">
      <div v-for="item in 6" :key="item" class="h-48 animate-pulse rounded-[1.75rem] bg-white/5"></div>
    </div>

    <div v-else-if="error" class="mt-8 rounded-3xl border border-red-400/40 bg-red-950/40 p-5 text-red-100">
      Tidak bisa mengambil data pembicara: {{ error.message }}
    </div>

    <div v-else class="mt-8 grid gap-4 md:grid-cols-3">
      <article
        v-for="speaker in items"
        :key="speaker.id"
        class="rounded-[1.75rem] border border-white/10 bg-white/5 p-5"
      >
        <p class="text-xs uppercase tracking-[0.25em] text-slate-400">{{ speaker.country_code || 'UNSPEC' }}</p>
        <h2 class="mt-3 text-xl font-semibold text-white">{{ speaker.full_name }}</h2>
        <p class="mt-1 text-sm text-cyan-200/90">{{ speaker.professional_title || 'Speaker' }}</p>
        <p class="mt-4 text-sm text-slate-300">{{ speaker.organization_name || '-' }}</p>
        <p class="mt-3 text-sm leading-7 text-slate-300">{{ speaker.biography || 'Biography akan muncul dari backend.' }}</p>
      </article>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useApi, type ApiResponse } from '~/composables/useApi';

interface SpeakerItem {
  id: string;
  full_name: string;
  professional_title?: string;
  organization_name?: string;
  country_code?: string;
  biography?: string;
}

const api = useNuxtApp().$api as ReturnType<typeof useApi>;
const page = ref(1);
const size = ref(12);

const { data: response, pending: loading, error } = await useAsyncData<ApiResponse<{ items: SpeakerItem[] }>>(
  `speakers-${page.value}-${size.value}`,
  () => api(`/speakers?page=${page.value}&size=${size.value}`)
);

const items = computed(() => response.value?.data?.items ?? []);
</script>
