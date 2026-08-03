<template>
  <section class="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
    <p class="text-sm uppercase tracking-[0.3em] text-cyan-200/70">Ticket</p>
    <h1 class="mt-3 text-4xl font-black text-white">Tiket Saya</h1>
    <p class="mt-3 text-slate-300">Ambil daftar tiket, render QR, dan reissue bila diperlukan.</p>

    <div v-if="loading" class="mt-8 grid gap-4 md:grid-cols-2">
      <div v-for="item in 4" :key="item" class="h-40 animate-pulse rounded-[1.75rem] bg-white/5"></div>
    </div>

    <div v-else-if="error" class="mt-8 rounded-3xl border border-red-400/40 bg-red-950/40 p-5 text-red-100">
      Gagal memuat tiket: {{ error.message }}
    </div>

    <div v-else class="mt-8 grid gap-4 md:grid-cols-2">
      <article
        v-for="ticket in tickets"
        :key="ticket.id"
        class="rounded-[1.75rem] border border-white/10 bg-white/5 p-5"
      >
        <div class="flex items-start justify-between gap-3">
          <div>
            <p class="text-xs uppercase tracking-[0.25em] text-slate-400">Ticket</p>
            <h2 class="mt-2 text-xl font-semibold text-white">{{ ticket.ticket_number }}</h2>
            <p class="mt-1 text-sm text-slate-300">{{ ticket.status }}</p>
          </div>
          <button
            class="rounded-full border border-white/15 px-4 py-2 text-xs text-white"
            @click="loadQr(ticket.id)"
          >
            Tampilkan QR
          </button>
        </div>

        <p class="mt-3 text-sm text-slate-300">Reg ID: {{ ticket.registration_id }}</p>

        <div class="mt-4 space-y-3">
          <button
            class="rounded-full bg-cyan-400 px-4 py-2 text-sm font-semibold text-slate-950"
            @click="reissue(ticket.id)"
            :disabled="reissuing === ticket.id"
          >
            {{ reissuing === ticket.id ? 'Memproses...' : 'Reissue' }}
          </button>
        </div>
      </article>
    </div>

    <div
      v-if="qr.ticket_id"
      class="relative mt-10 overflow-hidden rounded-[2rem] border border-cyan-300/30 bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.18),_transparent_30%),linear-gradient(135deg,rgba(8,47,73,0.96),rgba(15,23,42,0.98))] p-6 shadow-[0_24px_80px_rgba(6,182,212,0.18)]"
    >
      <div class="absolute -left-5 top-1/2 h-10 w-10 -translate-y-1/2 rounded-full bg-slate-950"></div>
      <div class="absolute -right-5 top-1/2 h-10 w-10 -translate-y-1/2 rounded-full bg-slate-950"></div>
      <div class="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,transparent,rgba(255,255,255,0.06),transparent)] opacity-70"></div>
      <div class="pointer-events-none absolute inset-y-6 right-[21rem] hidden border-r border-dashed border-white/15 lg:block"></div>
      <div class="relative grid gap-8 lg:grid-cols-[1.2fr_340px] lg:items-center">
        <div>
          <div class="flex flex-wrap items-center gap-3">
            <p class="text-sm uppercase tracking-[0.45em] text-cyan-100/80">Official Event Pass</p>
            <span class="rounded-full border border-emerald-300/25 bg-emerald-300/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.28em] text-emerald-100">
              Confirmed
            </span>
          </div>
          <h2 class="mt-3 max-w-2xl text-3xl font-black leading-tight text-white sm:text-4xl">
            You are officially registered for the ASEAN AI Developer Workshop event.
          </h2>
          <p class="mt-4 max-w-2xl text-base leading-7 text-slate-200">
            Please present this QR code during re-registration and check-in at the venue.
          </p>

          <div class="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <div class="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
              <p class="text-[11px] uppercase tracking-[0.3em] text-cyan-100/70">Participant</p>
              <p class="mt-2 text-lg font-semibold text-white">{{ participantName }}</p>
            </div>
            <div class="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
              <p class="text-[11px] uppercase tracking-[0.3em] text-cyan-100/70">Event</p>
              <p class="mt-2 text-lg font-semibold text-white">ASEAN AI Developer Workshop</p>
            </div>
            <div class="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
              <p class="text-[11px] uppercase tracking-[0.3em] text-cyan-100/70">Ticket Number</p>
              <p class="mt-2 text-lg font-semibold text-white">{{ qr.ticket_number }}</p>
            </div>
            <div class="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
              <p class="text-[11px] uppercase tracking-[0.3em] text-cyan-100/70">Date & Venue</p>
              <p class="mt-2 text-lg font-semibold text-white">18-19 November 2026</p>
              <p class="mt-1 text-sm text-slate-300">Jakarta, Indonesia</p>
            </div>
          </div>

          <div class="mt-6 flex flex-wrap gap-3">
            <a
              v-if="qr.imageUrl"
              :href="qr.imageUrl"
              :download="`${qr.ticket_number || 'event-ticket'}-qr.png`"
              class="rounded-full bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
            >
              Download QR
            </a>
            <button
              type="button"
              class="rounded-full border border-white/15 px-5 py-3 text-sm font-semibold text-white transition hover:border-cyan-200/40 hover:bg-white/5"
              @click="window.print()"
            >
              Print Ticket
            </button>
          </div>
        </div>

        <div class="relative">
          <div class="rounded-[1.75rem] border border-white/15 bg-white p-4 shadow-2xl">
            <img
              v-if="qr.imageUrl"
              :src="qr.imageUrl"
              alt="QR ticket"
              class="w-full rounded-2xl"
              @error="qr.imageError = 'QR could not be rendered. Please try reissuing the ticket.'"
            />
          </div>
          <p class="mt-4 text-center text-xs uppercase tracking-[0.35em] text-cyan-100/70">
            Scan for verification
          </p>
        </div>
      </div>

      <p v-if="qr.imageError" class="relative mt-4 text-sm text-red-100">{{ qr.imageError }}</p>
    </div>
  </section>
</template>

<script setup lang="ts">
import QRCode from 'qrcode';
import { useTicket } from '~/composables/useTicket';

definePageMeta({ middleware: 'auth' });

const authStore = useAuthStore();
const { getMyTickets, getQrByTicket, reissueTicket } = useTicket();

const loading = ref(true);
const reissuing = ref('');
const tickets = ref<Array<{ id: string; registration_id: string; ticket_number: string; status: string }>>([]);
const error = ref<Error | null>(null);
const qr = ref({ ticket_id: '', ticket_number: '', token: '', imageUrl: '', imageError: '' });
const participantName = computed(() => authStore.user?.full_name || authStore.user?.email || 'Registered Participant');

try {
  const response = await getMyTickets();
  tickets.value = response.data ?? [];
} catch (e) {
  error.value = e as Error;
} finally {
  loading.value = false;
}

const loadQr = async (ticketId: string) => {
  try {
    const result = await getQrByTicket(ticketId);
    const ticket = tickets.value.find((item) => item.id === ticketId);
    const token = result.data.qr_token;

    if (!token) throw new Error('Token QR tidak tersedia.');

    qr.value = {
      ticket_id: ticketId,
      ticket_number: ticket?.ticket_number || '',
      token,
      imageUrl: await QRCode.toDataURL(token, {
        width: 320,
        margin: 2,
        color: { dark: '#020617', light: '#ffffff' }
      }),
      imageError: ''
    };
  } catch (error) {
    qr.value = {
      ticket_id: ticketId,
      ticket_number: 'Gagal mengambil QR',
      token: 'Error',
      imageUrl: '',
      imageError: error instanceof Error ? error.message : 'QR tidak dapat dibuat.'
    };
  }
};

const reissue = async (ticketId: string) => {
  reissuing.value = ticketId;
  try {
    await reissueTicket(ticketId);
    const response = await getMyTickets();
    tickets.value = response.data ?? [];
  } finally {
    reissuing.value = '';
  }
};
</script>
