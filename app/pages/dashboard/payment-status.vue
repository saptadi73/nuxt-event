<template>
  <section class="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
    <div class="glass-card rounded-[2rem] p-6">
      <p class="text-sm uppercase tracking-[0.3em] text-cyan-200/70">Payment Status</p>
      <h1 class="mt-3 text-4xl font-bold text-white">Monitoring status pembayaran</h1>
      <p class="mt-3 text-slate-300">
        Cek status terbaru dari `GET /orders/{order_id}` dan `GET /payments/{payment_id}` sesuai API.
      </p>

      <div class="mt-8 grid gap-4 md:grid-cols-[1fr_1fr_auto] md:items-end">
        <label class="grid gap-2">
          <span class="text-sm text-slate-300">Order ID</span>
          <input
            v-model="orderId"
            class="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none"
            placeholder="uuid"
          />
        </label>
        <label class="grid gap-2">
          <span class="text-sm text-slate-300">Payment ID</span>
          <input
            v-model="paymentId"
            class="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none"
            placeholder="uuid"
          />
        </label>
        <button
          class="rounded-full bg-cyan-400 px-6 py-3 text-sm font-semibold text-slate-950"
          :disabled="checking"
          @click="check"
        >
          {{ checking ? 'Memuat...' : 'Cek Status' }}
        </button>
      </div>

      <div class="mt-6 grid gap-4 md:grid-cols-2">
        <article class="rounded-[1.5rem] border border-white/10 bg-white/5 p-4">
          <p class="text-xs uppercase tracking-[0.25em] text-slate-400">Order</p>
          <div v-if="order">
            <p class="mt-2 text-white font-semibold">{{ order.order_number }}</p>
            <p class="mt-2 text-sm text-slate-300">Status: {{ order.status }}</p>
            <p class="mt-1 text-sm text-slate-300">Subtotal: {{ formatCurrency(order.subtotal) }}</p>
            <p class="mt-1 text-sm text-slate-300">Total: {{ formatCurrency(order.total_amount) }}</p>
            <p class="mt-1 text-sm text-slate-300">Expires: {{ formatDate(order.expires_at) }}</p>
          </div>
          <p v-else class="mt-2 text-sm text-slate-300">Belum query order.</p>
        </article>

        <article class="rounded-[1.5rem] border border-white/10 bg-white/5 p-4">
          <p class="text-xs uppercase tracking-[0.25em] text-slate-400">Payment</p>
          <div v-if="payment">
            <p class="mt-2 text-white font-semibold">{{ payment.provider }}</p>
            <p class="mt-2 text-sm text-slate-300">Status: {{ payment.transaction_status }}</p>
            <p class="mt-1 text-sm text-slate-300">Fraud: {{ payment.fraud_status || '-' }}</p>
            <p class="mt-1 text-sm text-slate-300">Amount: {{ formatCurrency(payment.gross_amount) }}</p>
            <p class="mt-1 text-sm text-slate-300">Paid At: {{ formatDate(payment.paid_at) }}</p>
          </div>
          <p v-else class="mt-2 text-sm text-slate-300">Belum query payment.</p>
        </article>
      </div>

      <p v-if="error" class="mt-4 text-sm text-red-200">Error: {{ error }}</p>
    </div>
  </section>
</template>

<script setup lang="ts">
import { usePayment } from '~/composables/usePayment';

definePageMeta({ middleware: 'auth' });

const { getOrder, getPayment } = usePayment();

const orderId = ref('');
const paymentId = ref('');
const checking = ref(false);
const order = ref<any>(null);
const payment = ref<any>(null);
const error = ref('');

const check = async () => {
  checking.value = true;
  error.value = '';
  order.value = null;
  payment.value = null;

  try {
    if (orderId.value) {
      const orderResp = await getOrder(orderId.value);
      order.value = orderResp.data;
    }
    if (paymentId.value) {
      const paymentResp = await getPayment(paymentId.value);
      payment.value = paymentResp.data;
    }
  } catch (e: unknown) {
    error.value = e instanceof Error ? e.message : 'Terjadi error saat mengambil status pembayaran';
  } finally {
    checking.value = false;
  }
};

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(value);

const formatDate = (value?: string | null) => {
  if (!value) return '-';
  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(value));
};
</script>
