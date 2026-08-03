<template>
  <section class="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
    <p class="text-sm uppercase tracking-[0.3em] text-cyan-200/70">Speakers</p>
    <div class="mt-3 flex items-end justify-between gap-4">
      <h1 class="text-4xl font-black text-white">Featured speakers at the event</h1>
      <span class="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.25em] text-slate-200">
        {{ loading ? 'Loading...' : `${displayItems.length} speakers` }}
      </span>
    </div>

    <div v-if="loading" class="mt-8 grid gap-4 md:grid-cols-3">
      <div v-for="item in 6" :key="item" class="h-48 animate-pulse rounded-[1.75rem] bg-white/5"></div>
    </div>

    <div v-else class="mt-8 grid gap-4 md:grid-cols-3">
      <article
        v-for="speaker in displayItems"
        :key="speaker.id"
        class="rounded-[1.75rem] border border-white/10 bg-white/5 p-5"
      >
        <img v-if="speaker.profile_photo_url && !unavailablePhotos.has(speaker.id)" :src="mediaUrl(speaker.profile_photo_url)" :alt="speaker.full_name" class="mb-5 h-20 w-20 rounded-2xl object-cover" @error="markPhotoUnavailable(speaker.id)" />
        <div v-else class="mb-5 flex h-20 w-20 items-center justify-center rounded-2xl bg-cyan-300/10 text-xl font-bold text-cyan-200">{{ initials(speaker.full_name) }}</div>
        <p class="text-xs uppercase tracking-[0.25em] text-slate-400">{{ speaker.country_code || 'UNSPEC' }}</p>
        <h2 class="mt-3 text-xl font-semibold text-white">{{ speaker.full_name }}</h2>
        <p class="mt-1 text-sm text-cyan-200/90">{{ speaker.professional_title || 'Speaker' }}</p>
        <p class="mt-4 text-sm text-slate-300">{{ speaker.organization_name || '-' }}</p>
        <p class="mt-3 text-sm leading-7 text-slate-300">{{ speaker.biography }}</p>
        <div v-if="speaker.expertise_tags?.length" class="mt-4 flex flex-wrap gap-2"><span v-for="tag in speaker.expertise_tags" :key="tag" class="rounded-full bg-white/5 px-3 py-1 text-xs text-slate-300">{{ tag }}</span></div>
        <p v-if="speaker.session_title" class="mt-4 border-t border-white/10 pt-4 text-sm text-orange-100"><strong>Session:</strong> {{ speaker.session_title }}</p>
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
  session_title?: string;
  profile_photo_url?: string;
  expertise_tags?: string[];
}

const api = useNuxtApp().$api as ReturnType<typeof useApi>;
const { mediaUrl } = useMediaUrl();
const unavailablePhotos = ref(new Set<string>());
const initials = (name: string) => name.split(' ').map((part) => part[0]).slice(0, 2).join('').toUpperCase();
const markPhotoUnavailable = (speakerId: string) => {
  unavailablePhotos.value = new Set([...unavailablePhotos.value, speakerId]);
};
const page = ref(1);
const size = ref(12);

const { data: response, pending: loading } = await useAsyncData<ApiResponse<SpeakerItem[]>>(
  `speakers-${page.value}-${size.value}`,
  () => api(`/speakers?page=${page.value}&size=${size.value}`)
);

const items = computed(() => response.value?.data ?? []);
const examples: SpeakerItem[] = [
  { id:'maya-santoso', full_name:'Dr. Maya Santoso', professional_title:'AI Education Researcher', organization_name:'Indonesia', country_code:'IDN', biography:'Education technology researcher specializing in artificial intelligence, personalized learning, and responsible use of student data.', session_title:'Building Inclusive AI Learning Systems for Southeast Asia' },
  { id:'nguyen-minh-quang', full_name:'Nguyen Minh Quang', professional_title:'Principal Machine Learning Engineer', organization_name:'Vietnam', country_code:'VNM', biography:'Machine learning engineer experienced in large language models, retrieval systems, natural language processing, and scalable AI infrastructure.', session_title:'Scaling Generative AI Platforms for Education' },
  { id:'sarah-lim', full_name:'Sarah Lim', professional_title:'Founder and CEO', organization_name:'LearnAI Labs · Singapore', country_code:'SGP', biography:'Education technology entrepreneur focused on transforming AI prototypes into sustainable and scalable learning platforms.', session_title:'From AI Prototype to Sustainable Education Startup' },
  { id:'arun-prasert', full_name:'Arun Prasert', professional_title:'Open-Source AI Advocate', organization_name:'Thailand', country_code:'THA', biography:'Open-source contributor supporting affordable technology solutions for education and regional developer communities.', session_title:'Building Open and Multilingual AI for ASEAN Learners' },
  { id:'maria-santos', full_name:'Maria Gabriela Santos', professional_title:'Education Technology Specialist', organization_name:'Philippines', country_code:'PHL', biography:'Works with teachers, schools, and education organizations to design technology supporting classroom learning and teacher productivity.', session_title:'Human-Centered AI for Teachers and Students' }
];
const displayItems = computed(() => items.value.length ? items.value : examples);
</script>
