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

    <div v-if="qr.ticket_id" class="mt-10 rounded-[1.75rem] border border-cyan-300/30 bg-cyan-300/10 p-6">
      <p class="text-sm uppercase tracking-[0.25em] text-cyan-100">QR Ticket</p>
      <p class="mt-1 text-white">{{ qr.ticket_number }}</p>
      <p class="mt-3 break-words text-sm text-slate-100">Token: {{ qr.token }}</p>
      <img v-if="qr.imageUrl" :src="qr.imageUrl" alt="QR ticket" class="mt-4 max-w-xs rounded-xl bg-white p-2" />
    </div>
  </section>
</template>

<script setup lang="ts">
import { useTicket } from '~/composables/useTicket';

definePageMeta({ middleware: 'auth' });

const { getMyTickets, getQrByTicket, reissueTicket } = useTicket();

const loading = ref(true);
const reissuing = ref('');
const tickets = ref<Array<{ id: string; registration_id: string; ticket_number: string; status: string }>>([]);
const error = ref<Error | null>(null);
const qr = ref({ ticket_id: '', ticket_number: '', token: '', imageUrl: '' });

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
    qr.value = {
      ticket_id: ticketId,
      ticket_number: ticket?.ticket_number || '',
      token: result.data.qr_token,
      imageUrl: result.data.qr_image_url
    };
  } catch {
    qr.value = {
      ticket_id: ticketId,
      ticket_number: 'Gagal mengambil QR',
      token: 'Error',
      imageUrl: ''
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
