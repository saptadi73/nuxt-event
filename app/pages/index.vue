<template>
  <div class="pb-16">
    <section class="mx-auto grid max-w-7xl gap-8 px-4 pb-8 pt-10 sm:px-6 lg:grid-cols-[1.15fr_0.85fr] lg:px-8 lg:pb-14 lg:pt-16">
      <div class="space-y-8">
        <div class="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-xs uppercase tracking-[0.3em] text-cyan-100">
          ASEAN AI for Education 2026
        </div>

        <div class="space-y-5">
          <p class="text-sm uppercase tracking-[0.35em] text-orange-200/80">Build AI. Connect Innovators. Move Education Forward.</p>
          <h1 class="max-w-4xl text-5xl font-black uppercase leading-[0.95] text-white sm:text-6xl lg:text-7xl">
            Portal event untuk summit, workshop, networking, dan pengalaman peserta.
          </h1>
          <p class="max-w-2xl text-lg leading-8 text-slate-300">
            Frontend Nuxt ini menghubungkan peserta, penyelenggara, dan agenda event ke backend FastAPI
            yang sama, dari registrasi sampai tiket digital dan dashboard admin.
          </p>
        </div>

        <div class="flex flex-col gap-4 sm:flex-row">
          <a href="#agenda" class="rounded-full bg-cyan-400 px-6 py-3 text-center text-sm font-semibold text-slate-950">
            Eksplor Program
          </a>
          <a href="#galeri" class="rounded-full border border-white/15 px-6 py-3 text-center text-sm font-semibold text-white">
            Lihat Foto Event
          </a>
        </div>

        <dl class="grid gap-4 sm:grid-cols-3">
          <div class="glass-card rounded-3xl p-5">
            <dt class="text-xs uppercase tracking-[0.25em] text-slate-400">Experience</dt>
            <dd class="mt-2 text-3xl font-bold text-white">Hybrid</dd>
          </div>
          <div class="glass-card rounded-3xl p-5">
            <dt class="text-xs uppercase tracking-[0.25em] text-slate-400">Track</dt>
            <dd class="mt-2 text-3xl font-bold text-white">AI + Edu</dd>
          </div>
          <div class="glass-card rounded-3xl p-5">
            <dt class="text-xs uppercase tracking-[0.25em] text-slate-400">Backend</dt>
            <dd class="mt-2 text-3xl font-bold text-white">FastAPI</dd>
          </div>
        </dl>
      </div>

      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
        <article class="glass-card overflow-hidden rounded-[2rem]">
          <img src="/foto/masa_depan.png" alt="Visual masa depan AI" class="h-72 w-full object-cover" />
          <div class="space-y-3 p-6">
            <p class="text-xs uppercase tracking-[0.3em] text-cyan-200/80">Future Theme</p>
            <h2 class="text-2xl font-bold text-white">The Bright Future of AI</h2>
            <p class="text-sm leading-7 text-slate-300">
              Visual keynote untuk membuka narasi besar: masa depan pendidikan, industri, dan komunitas inovator ASEAN.
            </p>
          </div>
        </article>

        <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-2">
          <article class="glass-card overflow-hidden rounded-[1.75rem]">
            <img src="/foto/resgistrasi.png" alt="Area registrasi peserta" class="h-48 w-full object-cover" />
            <div class="p-4">
              <p class="text-xs uppercase tracking-[0.25em] text-slate-400">Registrasi</p>
              <p class="mt-2 text-lg font-semibold">Check-in cepat dan ramah peserta</p>
            </div>
          </article>
          <article class="glass-card overflow-hidden rounded-[1.75rem]">
            <img src="/foto/pameran.png" alt="Pameran dan expo AI" class="h-48 w-full object-cover" />
            <div class="p-4">
              <p class="text-xs uppercase tracking-[0.25em] text-slate-400">Expo</p>
              <p class="mt-2 text-lg font-semibold">Panggung sponsor dan area showcase</p>
            </div>
          </article>
        </div>
      </div>
    </section>

    <section id="galeri" class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div class="mb-6 flex items-end justify-between gap-4">
        <div>
          <p class="text-sm uppercase tracking-[0.35em] text-cyan-200/75">Galeri Pilihan</p>
          <h2 class="mt-2 text-3xl font-bold text-white">Foto-foto yang sudah siap dipakai di website</h2>
        </div>
      </div>

      <div class="grid auto-rows-[220px] gap-4 md:grid-cols-4">
        <article class="glass-card md:col-span-2 md:row-span-2 overflow-hidden rounded-[2rem]">
          <img src="/foto/seminar.png" alt="Sesi seminar" class="h-full w-full object-cover" />
        </article>
        <article class="glass-card overflow-hidden rounded-[2rem]">
          <img src="/foto/ai_summit.png" alt="Diskusi AI Summit" class="h-full w-full object-cover" />
        </article>
        <article class="glass-card overflow-hidden rounded-[2rem]">
          <img src="/foto/ai_summit2.png" alt="Kolaborasi peserta AI Summit" class="h-full w-full object-cover" />
        </article>
        <article class="glass-card md:col-span-2 overflow-hidden rounded-[2rem]">
          <img src="/foto/ai_VR.png" alt="Eksperimen teknologi AI dan VR" class="h-full w-full object-cover" />
        </article>
        <article class="glass-card md:col-span-2 overflow-hidden rounded-[2rem]">
          <img src="/foto/pameran.png" alt="Area pameran AI" class="h-full w-full object-cover" />
        </article>
      </div>
    </section>

    <section id="agenda" class="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
      <div class="glass-card rounded-[2rem] p-6">
        <p class="text-sm uppercase tracking-[0.35em] text-orange-200/80">Program Focus</p>
        <h2 class="mt-3 text-3xl font-bold text-white">Rangkaian pengalaman yang tidak berhenti di panggung utama</h2>
        <div class="mt-6 space-y-4 text-slate-300">
          <div class="rounded-2xl border border-white/10 bg-white/5 p-4">
            <h3 class="font-semibold text-white">Public Website</h3>
            <p class="mt-2 text-sm leading-7">Landing page, speaker, jadwal, tiket, dan SEO pages untuk menjaring peserta baru.</p>
          </div>
          <div class="rounded-2xl border border-white/10 bg-white/5 p-4">
            <h3 class="font-semibold text-white">Participant Portal</h3>
            <p class="mt-2 text-sm leading-7">Registrasi, profile, payment, QR ticket, networking directory, dan certificate.</p>
          </div>
          <div class="rounded-2xl border border-white/10 bg-white/5 p-4">
            <h3 class="font-semibold text-white">Admin Portal</h3>
            <p class="mt-2 text-sm leading-7">Pantau registrasi, pembayaran, check-in, dan konten event dari satu dashboard.</p>
          </div>
        </div>
      </div>

      <div class="glass-card rounded-[2rem] p-6">
        <div class="flex items-center justify-between gap-4">
          <div>
            <p class="text-sm uppercase tracking-[0.35em] text-cyan-200/75">Live Data</p>
            <h2 class="mt-2 text-3xl font-bold text-white">Event yang dimuat dari backend</h2>
          </div>
          <span class="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 text-xs uppercase tracking-[0.25em] text-cyan-100">
            {{ pending ? 'Loading' : 'API Ready' }}
          </span>
        </div>

        <div v-if="pending" class="mt-6 grid gap-4 md:grid-cols-2">
          <div v-for="item in 4" :key="item" class="h-40 animate-pulse rounded-3xl bg-white/5"></div>
        </div>

        <div v-else-if="error" class="mt-6 rounded-3xl border border-red-400/40 bg-red-950/40 p-5 text-red-100">
          <p class="font-semibold">Gagal memuat event dari backend.</p>
          <p class="mt-2 text-sm opacity-90">{{ error.message }}</p>
          <p class="mt-3 text-xs uppercase tracking-[0.25em] text-red-200/80">
            Pastikan `NUXT_PUBLIC_API_BASE_URL` mengarah ke `http://localhost:8000/api/v1`.
          </p>
        </div>

        <div v-else-if="events?.items?.length" class="mt-6 grid gap-4 md:grid-cols-2">
          <article
            v-for="item in events.items"
            :key="item.id"
            class="rounded-[1.75rem] border border-white/10 bg-white/5 p-5 transition duration-300 hover:-translate-y-1 hover:border-cyan-300/30"
          >
            <p class="text-xs uppercase tracking-[0.25em] text-cyan-200/70">{{ item.timezone || 'Asia/Bangkok' }}</p>
            <h3 class="mt-3 text-xl font-semibold text-white">{{ item.name }}</h3>
            <p class="mt-3 line-clamp-3 text-sm leading-7 text-slate-300">{{ item.description || 'Deskripsi event akan muncul dari backend.' }}</p>
            <div class="mt-4 space-y-2 text-sm text-slate-400">
              <p>{{ formatDate(item.start_at) }} - {{ formatDate(item.end_at) }}</p>
              <p>{{ item.venue_name || 'Venue belum tersedia' }}</p>
            </div>
          </article>
        </div>

        <div v-else class="mt-6 rounded-[1.75rem] border border-dashed border-white/15 bg-white/5 p-6 text-slate-300">
          Belum ada data event dari backend. Struktur frontend sudah siap; tinggal isi endpoint `/events`.
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { useApi, type ApiResponse } from '~/composables/useApi';

interface EventItem {
  id: string;
  name: string;
  description?: string;
  venue_name?: string;
  timezone?: string;
  start_at: string;
  end_at: string;
}

useSeoMeta({
  title: 'ASEAN AI Event Portal',
  description: 'Portal Nuxt untuk registrasi, agenda, participant dashboard, dan AI event experience.',
  ogTitle: 'ASEAN AI Event Portal',
  ogDescription: 'Portal event untuk summit, workshop, networking, dan participant journey berbasis Nuxt + FastAPI.',
  ogImage: '/foto/masa_depan.png'
});

const api = useNuxtApp().$api as ReturnType<typeof useApi>;
const { data: response, pending, error } = await useAsyncData<ApiResponse<{ items: EventItem[] }>>(
  'events',
  () => api('/events?page=1&size=6')
);

const events = computed(() => response.value?.data ?? null);

const formatDate = (iso: string) =>
  new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(iso));
</script>
