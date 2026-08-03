<template>
  <section class="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
    <p class="text-sm uppercase tracking-[0.3em] text-cyan-200/70">Ticket</p>
    <h1 class="mt-3 text-4xl font-black text-white">My Ticket</h1>
    <p class="mt-3 text-slate-300">View your ticket list, render the QR code, and reissue it when needed.</p>

    <div v-if="loading" class="mt-8 grid gap-4 md:grid-cols-2">
      <div v-for="item in 4" :key="item" class="h-40 animate-pulse rounded-[1.75rem] bg-white/5"></div>
    </div>

    <div v-else-if="error" class="mt-8 rounded-3xl border border-red-400/40 bg-red-950/40 p-5 text-red-100">
      Failed to load tickets: {{ error.message }}
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
            Show QR
          </button>
        </div>

        <p class="mt-3 text-sm text-slate-300">Reg ID: {{ ticket.registration_id }}</p>

        <div class="mt-4 space-y-3">
          <button
            class="rounded-full bg-cyan-400 px-4 py-2 text-sm font-semibold text-slate-950"
            @click="reissue(ticket.id)"
            :disabled="reissuing === ticket.id"
          >
            {{ reissuing === ticket.id ? 'Processing...' : 'Reissue' }}
          </button>
        </div>
      </article>
    </div>

    <div
      v-if="qr.ticket_id"
      ref="ticketCardRef"
      class="print-ticket relative mt-10 overflow-hidden rounded-[2rem] border border-cyan-300/30 bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.18),_transparent_30%),linear-gradient(135deg,rgba(8,47,73,0.96),rgba(15,23,42,0.98))] p-5 shadow-[0_24px_80px_rgba(6,182,212,0.18)] sm:p-6"
    >
      <div class="absolute -left-4 top-1/2 h-8 w-8 -translate-y-1/2 rounded-full bg-slate-950 sm:-left-5 sm:h-10 sm:w-10"></div>
      <div class="absolute -right-4 top-1/2 h-8 w-8 -translate-y-1/2 rounded-full bg-slate-950 sm:-right-5 sm:h-10 sm:w-10"></div>
      <div class="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,transparent,rgba(255,255,255,0.06),transparent)] opacity-70"></div>
      <div class="pointer-events-none absolute inset-y-6 right-[18rem] hidden border-r border-dashed border-white/15 lg:block"></div>
      <div class="pointer-events-none absolute right-4 top-4 rounded-full border border-amber-300/20 bg-amber-300/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.35em] text-amber-100 sm:right-6 sm:top-6">
        VIP Access
      </div>
      <div class="relative grid gap-8 lg:grid-cols-[1.35fr_280px] lg:items-center">
        <div>
          <div class="flex flex-wrap items-center gap-3 pr-20">
            <p class="text-xs uppercase tracking-[0.45em] text-cyan-100/80 sm:text-sm">Official Event Pass</p>
            <span class="rounded-full border border-emerald-300/25 bg-emerald-300/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.28em] text-emerald-100">
              Confirmed
            </span>
          </div>
          <div class="mt-4 flex items-center gap-4">
            <div class="flex h-16 w-16 items-center justify-center overflow-hidden rounded-3xl border border-cyan-200/25 bg-white/10 p-2 shadow-lg shadow-cyan-950/30 sm:h-20 sm:w-20">
              <img
                src="/branding/ai-asean.png"
                alt="ASEAN AI for Education logo"
                class="h-full w-full rounded-xl object-contain"
              />
            </div>
            <div>
              <p class="text-sm font-semibold uppercase tracking-[0.28em] text-white sm:text-base sm:tracking-[0.32em]">ASEAN AI Developer</p>
              <p class="text-sm uppercase tracking-[0.24em] text-cyan-100/70 sm:text-base sm:tracking-[0.28em]">Workshop 2026</p>
            </div>
          </div>
          <h2 class="mt-3 max-w-2xl text-3xl font-black leading-tight text-white sm:text-4xl">
            You are officially registered for the ASEAN AI Developer Workshop event.
          </h2>
          <p class="mt-4 max-w-2xl text-sm leading-7 text-slate-200 sm:text-base">
            Please present this QR code during re-registration and check-in at the venue.
          </p>

          <div class="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <div class="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-sm">
              <p class="text-[11px] uppercase tracking-[0.3em] text-cyan-100/70">Participant</p>
              <p class="mt-2 text-sm font-semibold leading-7 text-white sm:text-base sm:leading-8">{{ participantName }}</p>
            </div>
            <div class="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-sm">
              <p class="text-[11px] uppercase tracking-[0.3em] text-cyan-100/70">Event</p>
              <p class="mt-2 text-sm font-semibold leading-7 text-white sm:text-base sm:leading-8">ASEAN AI Developer Workshop</p>
            </div>
            <div class="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-sm">
              <p class="text-[11px] uppercase tracking-[0.3em] text-cyan-100/70">Ticket Number</p>
              <p class="mt-2 break-words text-sm font-semibold leading-7 text-white sm:text-[15px] sm:leading-8">{{ qr.ticket_number }}</p>
            </div>
            <div class="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-sm">
              <p class="text-[11px] uppercase tracking-[0.3em] text-cyan-100/70">Date & Venue</p>
              <p class="mt-2 text-sm font-semibold leading-7 text-white sm:text-[15px]">18-19 November 2026</p>
              <p class="mt-1 text-xs leading-5 text-slate-300 sm:leading-6">Jakarta, Indonesia</p>
            </div>
          </div>

          <div class="ticket-actions mt-6 flex flex-wrap gap-3">
            <button
              v-if="qr.imageUrl"
              type="button"
              :disabled="downloading"
              class="rounded-full bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 transition duration-200 hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-50"
              @click="downloadTicket"
            >
              {{ downloading ? 'Downloading...' : 'Download Ticket' }}
            </button>
          </div>
        </div>

        <div class="relative">
          <div class="mx-auto max-w-[220px] rounded-[1.75rem] border border-white/15 bg-white p-3 shadow-2xl sm:max-w-[250px] sm:p-4">
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
import { toPng } from 'html-to-image';
import QRCode from 'qrcode';
import { useTicket } from '~/composables/useTicket';

definePageMeta({ middleware: 'auth' });

const authStore = useAuthStore();
const { getMyTickets, getQrByTicket, reissueTicket } = useTicket();

const loading = ref(true);
const reissuing = ref('');
const tickets = ref<Array<{ id: string; registration_id: string; ticket_number: string; status: string }>>([]);
const error = ref<Error | null>(null);
const downloading = ref(false);
const ticketCardRef = ref<HTMLElement | null>(null);
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

    if (!token) throw new Error('QR token is not available.');

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
      ticket_number: 'Failed to load QR',
      token: 'Error',
      imageUrl: '',
      imageError: error instanceof Error ? error.message : 'QR could not be created.'
    };
  }
};

const downloadTicket = async () => {
  if (!ticketCardRef.value || !qr.value.ticket_number) return;

  try {
    downloading.value = true;
    qr.value.imageError = '';
    ticketCardRef.value.classList.add('ticket-exporting');
    const dataUrl = await toPng(ticketCardRef.value, {
      cacheBust: true,
      pixelRatio: 2,
      backgroundColor: '#082f49'
    });
    if (!dataUrl) {
      throw new Error('Unable to create ticket image.');
    }
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = `${qr.value.ticket_number}-event-pass.png`;
    link.click();
  } catch {
    qr.value.imageError = 'Ticket could not be downloaded. Please try again.';
  } finally {
    downloading.value = false;
    ticketCardRef.value.classList.remove('ticket-exporting');
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

<style scoped>
.ticket-exporting {
  box-shadow: none !important;
}

.ticket-exporting .ticket-actions {
  display: none !important;
}

@media print {
  section {
    max-width: none !important;
    padding: 0 !important;
  }

  article,
  button {
    display: none !important;
  }

  .print-ticket {
    margin-top: 0 !important;
    border: 1px solid #cbd5e1 !important;
    background: #ffffff !important;
    box-shadow: none !important;
    color: #0f172a !important;
    break-inside: avoid;
  }

  .print-ticket * {
    color: #0f172a !important;
  }

  .print-ticket img {
    border: 1px solid #e2e8f0;
    background: #ffffff !important;
  }

  .print-ticket a {
    display: none !important;
  }
}
</style>
