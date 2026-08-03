<template>
  <section class="mx-auto max-w-4xl px-4 py-12 sm:px-6">
    <p class="text-sm uppercase tracking-[.35em] text-cyan-200">Payment and Invoice</p>
    <h1 class="mt-3 text-4xl font-black">Registration invoice</h1>

    <div v-if="pending" class="glass-card mt-8 rounded-[2rem] p-7 text-slate-300">Loading invoice...</div>
    <div v-else-if="errorMessage" class="mt-8 rounded-3xl border border-red-400/30 bg-red-950/30 p-6 text-red-100">{{ errorMessage }}</div>
    <div v-else-if="!invoice" class="glass-card mt-8 rounded-[2rem] p-7">
      <p class="text-lg font-semibold">Belum ada invoice yang tersedia.</p>
      <p class="mt-2 text-slate-400">Invoice akan tersedia setelah pembayaran berhasil dikonfirmasi.</p>
      <NuxtLink to="/dashboard/payment" class="mt-6 inline-flex rounded-full bg-cyan-400 px-5 py-3 font-semibold text-slate-950">Ke pembayaran</NuxtLink>
    </div>
    <article v-else id="invoice" class="glass-card mt-8 rounded-[2rem] p-7">
      <div class="flex flex-wrap justify-between gap-5 border-b border-white/10 pb-6">
        <div><p class="text-sm text-slate-400">{{ invoice.registration.event_name }}</p><p class="mt-1 font-semibold">Invoice {{ invoice.order.order_number }}</p></div>
        <span class="h-fit rounded-full bg-emerald-300/10 px-4 py-2 text-xs font-semibold uppercase tracking-[.2em] text-emerald-200">Paid</span>
      </div>
      <dl class="mt-6 grid gap-5 sm:grid-cols-2">
        <div><dt class="text-xs uppercase tracking-[.2em] text-slate-500">Registration number</dt><dd class="mt-2 text-lg font-semibold">{{ invoice.registration.registration_number }}</dd></div>
        <div><dt class="text-xs uppercase tracking-[.2em] text-slate-500">Participant</dt><dd class="mt-2 text-lg font-semibold">{{ invoice.participant.full_name }}</dd><p class="text-sm text-slate-400">{{ invoice.participant.email }}</p></div>
        <div><dt class="text-xs uppercase tracking-[.2em] text-slate-500">Ticket category</dt><dd class="mt-2 text-lg font-semibold">{{ invoice.registration.ticket_type_name || '-' }}</dd></div>
        <div><dt class="text-xs uppercase tracking-[.2em] text-slate-500">Payment status</dt><dd class="mt-2 text-lg font-semibold text-emerald-300">Lunas</dd><p class="text-sm text-slate-400">{{ formatDate(invoice.payment.paid_at) }}</p></div>
      </dl>
      <div class="mt-7 flex items-center justify-between border-t border-white/10 pt-6"><span class="text-slate-400">Total paid</span><strong class="text-2xl text-cyan-200">{{ formatCurrency(invoice.order.total_amount, invoice.order.currency) }}</strong></div>
      <button class="mt-7 rounded-full bg-cyan-400 px-5 py-3 font-semibold text-slate-950 print:hidden" @click="downloadInvoice">Download invoice</button>
    </article>
  </section>
</template>

<script setup lang="ts">
import { usePayment, type Invoice } from '~/composables/usePayment';
import { useTicket } from '~/composables/useTicket';

definePageMeta({ middleware: 'auth' });
useSeoMeta({ title: 'Invoice | ASEAN AI for Education' });

const { getMyInvoices, getInvoiceByRegistration } = usePayment();
const { getMyTickets } = useTicket();
const invoice = ref<Invoice | null>(null);
const pending = ref(true);
const errorMessage = ref('');

onMounted(async () => {
  try {
    try {
      const response = await getMyInvoices();
      invoice.value = response.data[0] || null;
    } catch (error: any) {
      if (error?.response?.status !== 404 && !String(error?.message || '').includes('404')) throw error;
      const tickets = await getMyTickets();
      const ticket = tickets.data[0];
      if (ticket) {
        const response = await getInvoiceByRegistration(ticket.registration_id);
        invoice.value = response.data;
      }
    }
  } catch (error) {
    errorMessage.value = 'Your invoice is not available yet. Please contact the event organizer if your payment has already been confirmed.';
  } finally {
    pending.value = false;
  }
});

const formatCurrency = (amount: number, currency: string) => new Intl.NumberFormat('id-ID', { style: 'currency', currency }).format(amount);
const formatDate = (value?: string | null) => value ? new Intl.DateTimeFormat('id-ID', { dateStyle: 'long', timeStyle: 'short' }).format(new Date(value)) : '-';
const downloadInvoice = () => window.print();
</script>
