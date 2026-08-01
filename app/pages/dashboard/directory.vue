<template>
  <section class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
    <p class="text-sm uppercase tracking-[.35em] text-cyan-200">Participant Directory</p>
    <h1 class="mt-3 text-4xl font-black">Connect With ASEAN AI Professionals</h1>
    <p class="mt-3 max-w-3xl leading-7 text-slate-300">Find collaborators, mentors, technical experts, and members of your workshop community. Private contact information is never displayed.</p>

    <div class="mt-8">
      <label><span class="sr-only">Search participants</span><input v-model="query" type="search" placeholder="Search name, organization, or biography" class="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-4 outline-none focus:border-cyan-300" /></label>
    </div>

    <div v-if="pending" class="mt-7 grid gap-5 md:grid-cols-2 lg:grid-cols-3"><div v-for="item in 6" :key="item" class="h-64 animate-pulse rounded-3xl bg-white/5" /></div>
    <div v-else class="mt-7 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
      <article v-for="person in filtered" :key="person.id" class="glass-card rounded-3xl p-6">
        <img v-if="person.profile_photo_url" :src="mediaUrl(person.profile_photo_url)" :alt="person.full_name" class="h-14 w-14 rounded-2xl object-cover" />
        <div v-else class="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-300/10 text-lg font-bold text-cyan-200">{{ initials(person.full_name) }}</div>
        <h2 class="mt-4 text-xl font-bold">{{ person.full_name }}</h2>
        <p class="mt-2 text-sm text-slate-400">{{ person.organization_name || 'Independent participant' }}</p>
        <p v-if="person.biography" class="mt-4 text-sm leading-6 text-slate-300">{{ person.biography }}</p>
      </article>
    </div>
    <div v-if="!pending && !filtered.length" class="mt-7 rounded-3xl border border-dashed border-white/15 p-7 text-center text-slate-400">No participants match these filters.</div>
  </section>
</template>

<script setup lang="ts">
import { useParticipant, type ParticipantProfile } from '~/composables/useParticipant';
import type { ApiResponse } from '~/composables/useApi';

definePageMeta({ middleware: 'auth' });
useSeoMeta({ title: 'Participant Directory | ASEAN AI for Education' });

const { getParticipants } = useParticipant();
const { mediaUrl } = useMediaUrl();
const query = ref('');
type ParticipantList = ParticipantProfile[] | { items: ParticipantProfile[] };
const { data: response, pending } = await useAsyncData<ApiResponse<ParticipantList>>('participants-directory', () => getParticipants(1, 100));
const people = computed(() => Array.isArray(response.value?.data) ? response.value.data : response.value?.data?.items ?? []);
const filtered = computed(() => {
  const search = query.value.trim().toLowerCase();
  if (!search) return people.value;
  return people.value.filter((person) => `${person.full_name} ${person.organization_name || ''} ${person.biography || ''}`.toLowerCase().includes(search));
});
const initials = (name: string) => name.split(' ').map((part) => part[0]).slice(0, 2).join('').toUpperCase();
</script>
