<template>
  <section class="mx-auto max-w-3xl px-3 py-10 sm:px-6">
    <div class="glass-card rounded-[2rem] p-4 sm:p-7">
      <p class="text-sm uppercase tracking-[.3em] text-amber-200">{{ paymentProviderLabel }} Payment Status</p>
      <h1 class="mt-3 text-3xl font-black sm:text-4xl">{{ heading }}</h1>
      <p class="mt-3 text-sm text-slate-300 sm:text-base">{{ description }}</p>
      <div class="mt-7 rounded-2xl border border-white/10 bg-white/5 p-5">
        <p class="text-xs uppercase tracking-widest text-slate-400">Payment status</p>
        <p class="mt-2 text-2xl font-bold" :class="statusClass">{{ statusLabel }}</p>
        <p v-if="payment" class="mt-2 text-sm text-slate-400">
          Provider: {{ payment.provider }} · Amount: {{ currency(payment.gross_amount, payment.currency) }}
        </p>
        <p v-if="polling" class="mt-3 text-sm text-amber-200">Checking for {{ paymentProviderLabel }} confirmation…</p>
      </div>
      <div class="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <NuxtLink v-if="status === 'success'" :to="invoiceTo" class="rounded-full bg-amber-300 px-5 py-3 font-semibold text-slate-950">View invoice</NuxtLink>
        <NuxtLink v-else-if="terminal" to="/dashboard/payment" class="rounded-full bg-amber-300 px-5 py-3 font-semibold text-slate-950">Try payment again</NuxtLink>
        <button v-else class="rounded-full border border-white/20 px-5 py-3" :disabled="checking" @click="checkStatus">Check again</button>
        <NuxtLink to="/dashboard" class="rounded-full border border-white/20 px-5 py-3">Dashboard</NuxtLink>
      </div>
      <div v-if="errorMessage" class="mt-5 rounded-2xl border border-red-400/30 bg-red-950/30 p-4 text-red-100">
        <p>{{ errorMessage }}</p>
        <p v-if="requestId" class="mt-2 text-xs">Reference: {{ requestId }}</p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { usePayment, type PaymentItem } from '~/composables/usePayment';

definePageMeta({ middleware: 'auth' });
useSeoMeta({ title: 'Payment Status | IWBIF 2026' });

const route = useRoute();
const paymentApi = usePayment();
const registrationFlow = useRegistrationFlow();
const STORAGE_REGISTRATION = 'iwbif-doku-registration-id';
const STORAGE_PAYMENT = 'iwbif-payment-id';
const LEGACY_STORAGE_PAYMENT = 'iwbif-doku-payment-id';
const STORAGE_ORDER = 'iwbif-store-order-id';
const paymentId = ref('');
const registrationId = ref('');
const orderId = ref('');
const payment = ref<PaymentItem | null>(null);
const status = ref('pending');
const polling = ref(false);
const checking = ref(false);
const errorMessage = ref('');
const requestId = ref('');
const successHandled = ref(false);
let timer: ReturnType<typeof setInterval> | null = null;
let attempts = 0;
const maxAttempts = 30;
const terminalStatuses = ['success', 'failed', 'expired', 'canceled'];
const terminal = computed(() => terminalStatuses.includes(status.value));
const paymentProviderLabel = computed(() => payment.value?.provider?.toUpperCase() || paymentApi.paymentProviderLabel || 'Payment');
const statusLabel = computed(() => ({
  created: 'Created',
  pending: 'Awaiting verification',
  success: 'Payment successful',
  failed: 'Payment failed',
  expired: 'Checkout expired',
  canceled: 'Payment canceled'
}[status.value] || status.value));
const heading = computed(() => status.value === 'success' ? 'Payment received' : terminal.value ? 'Payment not completed' : 'Payment processing');
const description = computed(() => status.value === 'success'
  ? `${paymentProviderLabel.value} notification has been verified by the backend.`
  : terminal.value
    ? `You may safely create a new ${paymentProviderLabel.value} checkout.`
    : 'Do not create another checkout while backend verification is in progress.');
const statusClass = computed(() => status.value === 'success' ? 'text-emerald-300' : terminal.value ? 'text-red-300' : 'text-amber-200');
const invoiceTo = computed(() => registrationId.value
  ? `/dashboard/invoice?registration_id=${encodeURIComponent(registrationId.value)}`
  : orderId.value
    ? `/dashboard/invoice?order_id=${encodeURIComponent(orderId.value)}`
    : '/dashboard/invoice');

const queryValue = (value: unknown) => Array.isArray(value) ? String(value[0] || '') : typeof value === 'string' ? value : '';
const stop = () => {
  if (timer) clearInterval(timer);
  timer = null;
  polling.value = false;
};
const apiError = (error: unknown) => {
  const value = error as { data?: { message?: string; request_id?: string } };
  requestId.value = value.data?.request_id || '';
  return value.data?.message || (error instanceof Error ? error.message : 'Payment status could not be retrieved.');
};
const handleSuccess = async () => {
  if (successHandled.value) return;
  successHandled.value = true;
  stop();
  try {
    await registrationFlow.loadFlow(true);
  } catch {
    // Payment is already backend-confirmed; progress can refresh again on focus.
  }
  sessionStorage.removeItem(STORAGE_PAYMENT);
  sessionStorage.removeItem(LEGACY_STORAGE_PAYMENT);
  const packageId = sessionStorage.getItem('iwbif-last-delegate-package-id');
  if (packageId) await navigateTo(`/register/delegate?package=${encodeURIComponent(packageId)}`);
};
const checkStatus = async () => {
  if (checking.value) return;
  checking.value = true;
  errorMessage.value = '';
  try {
    if (paymentId.value) {
      const response = await paymentApi.getPayment(paymentId.value);
      payment.value = response.data;
      orderId.value = response.data.order_id;
      sessionStorage.setItem(STORAGE_ORDER, response.data.order_id);
      status.value = response.data.transaction_status.toLowerCase();
    } else if (registrationId.value) {
      const response = await paymentApi.getInvoiceByRegistration(registrationId.value);
      payment.value = response.data.payment;
      orderId.value ||= response.data.order.id;
      status.value = response.data.payment.transaction_status.toLowerCase();
    } else if (orderId.value) {
      const response = await paymentApi.getOrder(orderId.value);
      status.value = response.data.status.toLowerCase() === 'paid' ? 'success' : response.data.status.toLowerCase();
    } else {
      throw new Error('Payment reference was not found in this browser.');
    }
    if (status.value === 'success') await handleSuccess();
    else if (terminal.value) stop();
  } catch (error) {
    errorMessage.value = apiError(error);
  } finally {
    checking.value = false;
  }
};

onMounted(async () => {
  paymentId.value = queryValue(route.query.payment_id)
    || sessionStorage.getItem(STORAGE_PAYMENT)
    || sessionStorage.getItem(LEGACY_STORAGE_PAYMENT)
    || '';
  registrationId.value = queryValue(route.query.registration_id) || sessionStorage.getItem(STORAGE_REGISTRATION) || '';
  // Midtrans appends its provider order_id to the finish URL. Prefer the
  // application's internal order UUID saved before redirecting to Midtrans.
  orderId.value = sessionStorage.getItem(STORAGE_ORDER) || queryValue(route.query.order_id) || '';
  await checkStatus();
  if (status.value === 'created' || status.value === 'pending') {
    polling.value = true;
    timer = setInterval(async () => {
      attempts++;
      await checkStatus();
      if (attempts >= maxAttempts) stop();
    }, 4000);
  }
});
onBeforeUnmount(stop);
const currency = (amount: number, code: string) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: code || 'IDR', maximumFractionDigits: 0 }).format(amount);
</script>
