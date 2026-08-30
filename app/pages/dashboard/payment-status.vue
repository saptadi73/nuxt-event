<template>
  <section class="mx-auto max-w-3xl px-3 py-10 sm:px-6">
    <div class="glass-card rounded-[2rem] p-4 sm:p-7">
      <p class="text-sm uppercase tracking-[.3em] text-amber-200">{{ copy.eyebrow.replace('{provider}', paymentProviderLabel) }}</p>
      <h1 class="mt-3 text-3xl font-black sm:text-4xl">{{ heading }}</h1>
      <p class="mt-3 text-sm text-slate-300 sm:text-base">{{ description }}</p>
      <div class="mt-7 rounded-2xl border border-white/10 bg-white/5 p-5">
        <p class="text-xs uppercase tracking-widest text-slate-400">{{ copy.paymentStatus }}</p>
        <p class="mt-2 text-2xl font-bold" :class="statusClass">{{ statusLabel }}</p>
        <p v-if="payment" class="mt-2 text-sm text-slate-400">
          {{ copy.provider }}: {{ payment.provider }} · {{ copy.amount }}: {{ currency(payment.gross_amount, payment.currency) }}
        </p>
        <p v-if="payment?.payment_sequence && payment?.payment_sequence_count" class="mt-2 text-sm text-slate-300">Payment part {{ payment.payment_sequence }} of {{ payment.payment_sequence_count }}</p>
        <div v-if="order" class="mt-4 grid grid-cols-2 gap-3 border-t border-white/10 pt-4 text-sm"><div><span class="text-slate-400">Paid</span><strong class="block text-emerald-300">{{ currency(order.paid_amount || 0, order.currency) }}</strong></div><div><span class="text-slate-400">Remaining</span><strong class="block text-amber-200">{{ currency(order.remaining_amount ?? order.total_amount, order.currency) }}</strong></div></div>
        <p v-if="polling" class="mt-3 text-sm text-amber-200">{{ copy.checkingConfirmation.replace('{provider}', paymentProviderLabel) }}</p>
      </div>
      <div class="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <NuxtLink v-if="status === 'success'" :to="invoiceTo" class="rounded-full bg-amber-300 px-5 py-3 font-semibold text-slate-950">{{ copy.viewInvoice }}</NuxtLink>
        <button v-else-if="status === 'partially_paid'" class="rounded-full bg-cyan-300 px-5 py-3 font-semibold text-slate-950 disabled:opacity-50" :disabled="checking" @click="continuePayment">Continue remaining payment</button>
        <NuxtLink v-else-if="terminal" :to="`/dashboard/payment?order_id=${encodeURIComponent(orderId)}`" class="rounded-full bg-amber-300 px-5 py-3 font-semibold text-slate-950">{{ copy.tryAgain }}</NuxtLink>
        <button v-else class="rounded-full border border-white/20 px-5 py-3" :disabled="checking" @click="checkStatus">{{ checking ? copy.checking : copy.checkAgain }}</button>
        <NuxtLink to="/dashboard" class="rounded-full border border-white/20 px-5 py-3">{{ copy.dashboard }}</NuxtLink>
      </div>
      <div v-if="errorMessage" class="mt-5 rounded-2xl border border-red-400/30 bg-red-950/30 p-4 text-red-100">
        <p>{{ errorMessage }}</p>
        <p v-if="requestId" class="mt-2 text-xs">{{ copy.reference }}: {{ requestId }}</p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { usePayment, type OrderItem, type PaymentItem } from '~/composables/usePayment';

definePageMeta({ middleware: 'auth' });
const { locale } = useI18n();
const messages = {
  en: { eyebrow: '{provider} Payment Status', paymentStatus: 'Payment status', provider: 'Provider', amount: 'Amount', checkingConfirmation: 'Checking for {provider} confirmation…', viewInvoice: 'View invoice', tryAgain: 'Try payment again', checkAgain: 'Check again', checking: 'Checking…', dashboard: 'Dashboard', reference: 'Reference', payment: 'Payment', statuses: { created: 'Created', pending: 'Awaiting verification', success: 'Payment successful', failed: 'Payment failed', expired: 'Checkout expired', canceled: 'Payment canceled' }, received: 'Payment received', notCompleted: 'Payment not completed', processing: 'Payment processing', verified: '{provider} notification has been verified by the backend.', retry: 'You may safely create a new {provider} checkout.', wait: 'Do not create another checkout while backend verification is in progress.', retrievalError: 'Payment status could not be retrieved.', missingReference: 'Payment reference was not found in this browser.', seo: 'Payment Status' },
  zh: { eyebrow: '{provider} 付款状态', paymentStatus: '付款状态', provider: '支付服务商', amount: '金额', checkingConfirmation: '正在检查 {provider} 的确认结果…', viewInvoice: '查看发票', tryAgain: '重新付款', checkAgain: '再次检查', checking: '正在检查…', dashboard: '控制面板', reference: '参考编号', payment: '付款', statuses: { created: '已创建', pending: '等待审核', success: '付款成功', failed: '付款失败', expired: '结账已过期', canceled: '付款已取消' }, received: '已收到付款', notCompleted: '付款未完成', processing: '付款处理中', verified: '后端已验证 {provider} 的付款通知。', retry: '您现在可以安全地创建新的 {provider} 付款。', wait: '后端验证期间请勿创建另一个付款。', retrievalError: '无法获取付款状态。', missingReference: '此浏览器中未找到付款参考信息。', seo: '付款状态' }
} as const;
const copy = computed(() => locale.value === 'zh-CN' ? messages.zh : messages.en);
useSeoMeta({ title: () => `${copy.value.seo} | IWBIF 2026` });

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
const order = ref<OrderItem | null>(null);
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
const paymentProviderLabel = computed(() => payment.value?.provider?.toUpperCase() || paymentApi.paymentProviderLabel || copy.value.payment);
const statusLabel = computed(() => (copy.value.statuses as Record<string, string>)[status.value] || status.value);
const heading = computed(() => status.value === 'success' ? copy.value.received : status.value === 'partially_paid' ? 'Payment partially received' : terminal.value ? copy.value.notCompleted : copy.value.processing);
const description = computed(() => status.value === 'success'
  ? copy.value.verified.replace('{provider}', paymentProviderLabel.value)
  : status.value === 'partially_paid'
    ? 'The order is not fully paid. Tickets and subsequent registration stay locked until the remaining payment is completed.'
  : terminal.value
    ? copy.value.retry.replace('{provider}', paymentProviderLabel.value)
    : copy.value.wait);
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
  return value.data?.message || (error instanceof Error ? error.message : copy.value.retrievalError);
};
const continuePayment = async () => {
  if (!orderId.value || checking.value) return;
  checking.value = true;
  errorMessage.value = '';
  try {
    const checkout = (await paymentApi.continueOrderPayment(orderId.value)).data;
    paymentId.value = checkout.payment_id || '';
    if (paymentId.value) sessionStorage.setItem(STORAGE_PAYMENT, paymentId.value);
    if (checkout.payment_url) window.location.assign(checkout.payment_url);
    else await checkStatus();
  } catch (error) {
    errorMessage.value = apiError(error);
  } finally {
    checking.value = false;
  }
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
  if (registrationFlow.profilePendingType.value) {
    await navigateTo(`/register/${registrationFlow.profilePendingType.value}`);
  }
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
      throw new Error(copy.value.missingReference);
    }
    if (orderId.value) {
      const orderResponse = await paymentApi.getOrder(orderId.value);
      order.value = orderResponse.data;
      const orderStatus = orderResponse.data.status.toLowerCase();
      status.value = orderResponse.data.is_payment_complete === true || orderStatus === 'paid' ? 'success' : orderStatus;
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
const currency = (amount: number, code: string) => new Intl.NumberFormat(locale.value === 'zh-CN' ? 'zh-CN' : 'id-ID', { style: 'currency', currency: code || 'IDR', maximumFractionDigits: 0 }).format(amount);
</script>
