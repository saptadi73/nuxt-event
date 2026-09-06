<template>
  <dialog ref="dialog" class="doku-dialog" aria-labelledby="doku-title" @cancel.prevent="close" @click="onBackdrop">
    <div class="p-5 sm:p-7">
      <div class="flex items-center justify-between gap-4">
        <h2 id="doku-title" class="text-2xl font-bold">{{ text.title }}</h2>
        <button type="button" class="rounded-full border border-white/20 px-3 py-2" :disabled="busy" :aria-label="text.close" @click="close">×</button>
      </div>
      <p class="mt-2 text-sm text-slate-400">{{ text.subtitle }}</p>
      <p v-if="loading" class="mt-6" role="status">{{ text.loading }}</p>
      <template v-else-if="payment">
        <div class="mt-6 rounded-2xl border border-white/15 bg-white/5 p-5">
          <p class="font-bold">{{ payment.method === 'virtual_account' ? `Virtual Account ${payment.bank_code}` : payment.method === 'qris' ? 'QRIS' : text.card }}</p>
          <p class="mt-2 text-2xl font-bold text-amber-200">{{ money(payment.amount, payment.currency) }}</p>
          <p v-if="payment.payment_sequence_count > 1" class="mt-2 text-sm text-slate-300">{{ text.part }} {{ payment.payment_sequence }} / {{ payment.payment_sequence_count }}</p>
          <template v-if="payment.virtual_account_no">
            <p class="mt-5 text-sm text-slate-300">{{ text.vaNumber }}</p>
            <p class="mt-2 break-all font-mono text-xl font-bold">{{ payment.virtual_account_no }}</p>
            <button type="button" class="mt-3 text-sm text-cyan-200 underline" @click="copyVa">{{ copied ? text.copied : text.copy }}</button>
          </template>
          <img v-if="qrImage && !expired" :src="qrImage" alt="DOKU QRIS" width="320" height="320" class="mx-auto mt-5 h-auto w-full max-w-80 rounded-xl bg-white p-2">
          <p v-if="payment.expires_at" class="mt-4 text-sm text-slate-300">{{ text.expires }} {{ new Date(payment.expires_at).toLocaleString() }}</p>
          <p class="mt-4 text-sm" role="status">{{ expired ? text.expired : text.awaiting }}</p>
          <button v-if="payment.payment_url && !expired" type="button" class="primary mt-5" @click="openCard">{{ text.cardContinue }}</button>
        </div>
        <button type="button" class="primary mt-5" :disabled="checking" @click="checkStatus">{{ checking ? text.checking : text.check }}</button>
        <NuxtLink :to="statusTo" class="mt-4 block text-center text-sm text-cyan-200 underline">{{ text.statusPage }}</NuxtLink>
      </template>
      <template v-else-if="methods">
        <template v-if="step === 'methods'">
          <div class="mt-6 grid gap-3">
            <button type="button" class="method" :disabled="busy || !methods.qris" @click="create('qris')"><img :src="qrisLogo" alt="QRIS"><span>QRIS<small v-if="!methods.qris">{{ text.unavailable }}</small></span></button>
            <button type="button" class="method" :disabled="busy || !methods.virtual_accounts.length" @click="step = 'banks'"><img :src="vaLogo" alt="Virtual Account"><span>Virtual Account<small>{{ text.selectBank }}</small></span></button>
            <button type="button" class="method" :disabled="busy || !methods.credit_card" @click="create('credit_card')"><img :src="cardLogo" :alt="text.card"><span>{{ text.card }}<small>{{ methods.credit_card ? text.cardDetails : text.unavailable }}</small></span></button>
          </div>
        </template>
        <template v-else>
          <button type="button" class="mt-5 text-sm text-cyan-200" :disabled="busy" @click="step = 'methods'">← {{ text.back }}</button>
          <h3 class="mt-4 font-bold">{{ text.selectBank }}</h3>
          <div class="mt-4 grid gap-3 sm:grid-cols-2">
            <button v-for="bank in banks" :key="bank.code" type="button" class="method" :disabled="busy || !methods.virtual_accounts.includes(bank.code)" @click="create('virtual_account', bank.code)"><img :src="bank.logo" :alt="bank.code"><span>{{ bank.code }}<small v-if="!methods.virtual_accounts.includes(bank.code)">{{ text.unavailable }}</small></span></button>
          </div>
        </template>
        <p v-if="busy" class="mt-4 text-sm text-amber-200" role="status">{{ text.preparing }}</p>
      </template>
      <div v-if="error" role="alert" class="mt-5 rounded-xl border border-red-300/30 bg-red-950/40 p-4 text-sm text-red-100">
        <p>{{ error }}</p>
        <button v-if="!payment" type="button" class="mt-3 underline" :disabled="busy || loading" @click="load">{{ text.reload }}</button>
      </div>
    </div>
  </dialog>
</template>

<script setup lang="ts">
import type { DokuOrderMethod, DokuOrderMethods, DokuOrderPayment } from '~/composables/usePayment';
import qrisLogo from '~/assets/images/payment/qris_doku.png';
import vaLogo from '~/assets/images/payment/multipleBanks_va.png';
import cardLogo from '~/assets/images/payment/credir_card_doku.png';
import bca from '~/assets/images/payment/bca.png';
import bni from '~/assets/images/payment/bni.png';
import mandiri from '~/assets/images/payment/mandiri.png';
import bsi from '~/assets/images/payment/bsi.png';
import bri from '~/assets/images/payment/bri-va.png';

const props = defineProps<{ orderId: string }>();
const emit = defineEmits<{ close: []; created: [payment: DokuOrderPayment]; busy: [value: boolean] }>();
const api = usePayment();
const { locale } = useI18n();
const text = computed(() => locale.value === 'zh-CN' ? {
  title: 'DOKU 付款', subtitle: '请选择付款方式。', close: '关闭', loading: '正在加载…', card: '信用卡',
  unavailable: '暂未开通', selectBank: '选择银行', cardDetails: '在 DOKU 安全页面填写卡片信息', back: '返回付款方式',
  preparing: '正在向 DOKU 请求付款…', vaNumber: '虚拟账户号码', copy: '复制号码', copied: '已复制', expires: '有效期至',
  awaiting: '等待付款及确认。', expired: '付款已过期，请查看最新状态。', check: '检查付款状态', checking: '正在检查…',
  statusPage: '打开付款状态页面', cardContinue: '前往 DOKU 填写卡片信息', reload: '重新加载', part: '付款',
  failure: '无法加载 DOKU 付款，请稍后重试。', mismatch: '付款与当前订单不匹配。', invalidUrl: '付款链接无效。'
} : {
  title: 'DOKU payment', subtitle: 'Choose your payment method.', close: 'Close', loading: 'Loading…', card: 'Credit card',
  unavailable: 'Not yet available', selectBank: 'Choose a bank', cardDetails: 'Enter card details securely on DOKU', back: 'Payment methods',
  preparing: 'Requesting payment from DOKU…', vaNumber: 'Virtual Account number', copy: 'Copy number', copied: 'Copied', expires: 'Expires',
  awaiting: 'Awaiting payment and confirmation.', expired: 'This payment has expired. Check its latest status.', check: 'Check payment status', checking: 'Checking…',
  statusPage: 'Open payment status', cardContinue: 'Continue to DOKU card form', reload: 'Reload payment', part: 'Payment part',
  failure: 'DOKU payment could not be loaded. Please try again.', mismatch: 'Payment does not match this order.', invalidUrl: 'Invalid payment URL.'
});
const banks = [{ code: 'BCA', logo: bca }, { code: 'BNI', logo: bni }, { code: 'MANDIRI', logo: mandiri }, { code: 'BSI', logo: bsi }, { code: 'BRI', logo: bri }];
const dialog = ref<HTMLDialogElement>();
const methods = ref<DokuOrderMethods | null>(null);
const payment = ref<DokuOrderPayment | null>(null);
const step = ref('methods');
const loading = ref(true), busy = ref(false), checking = ref(false), copied = ref(false);
const error = ref(''), qrImage = ref('');
const now = ref(Date.now());
const expired = computed(() => !!payment.value?.expires_at && new Date(payment.value.expires_at).getTime() <= now.value);
const statusTo = computed(() => `/dashboard/payment-status?order_id=${encodeURIComponent(props.orderId)}&payment_id=${encodeURIComponent(payment.value?.payment_id || '')}`);
let timer: ReturnType<typeof setInterval> | undefined;
let checks = 0;
let disposed = false;
const money = (amount: number, currency: string) => new Intl.NumberFormat(locale.value === 'zh-CN' ? 'zh-CN' : 'en-US', { style: 'currency', currency }).format(amount);
const message = (value: unknown) => {
  const err = value as { data?: { message?: string; request_id?: string } };
  return (err.data?.message || text.value.failure) + (err.data?.request_id ? ` (${err.data.request_id})` : '');
};
const close = () => { if (!busy.value) { dialog.value?.close(); emit('close'); } };
const onBackdrop = (event: MouseEvent) => { if (event.target !== dialog.value) return; const rect = dialog.value.getBoundingClientRect(); if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) close(); };
const remember = async (data: DokuOrderPayment) => {
  if (data.order_id !== props.orderId) throw new Error(text.value.mismatch);
  payment.value = data;
  sessionStorage.setItem('iwbif-store-order-id', props.orderId);
  sessionStorage.setItem('iwbif-payment-id', data.payment_id);
  emit('created', data);
  if (data.qr_content) {
    const QRCode = await import('qrcode');
    qrImage.value = await QRCode.toDataURL(data.qr_content, { width: 320, margin: 2 });
  }
};
const load = async () => {
  loading.value = true; error.value = '';
  try {
    const active = (await api.getActiveDokuOrderPayment(props.orderId)).data;
    if (disposed) return;
    if (active) await remember(active);
    else methods.value = (await api.getDokuOrderMethods()).data;
  } catch (err) { error.value = message(err); }
  finally { loading.value = false; }
};
const openCard = () => {
  try {
    const url = new URL(payment.value?.payment_url || '');
    if (url.protocol !== 'https:' || !(url.hostname === 'doku.com' || url.hostname.endsWith('.doku.com'))) throw new Error(text.value.invalidUrl);
    window.location.assign(url.href);
  } catch { error.value = text.value.invalidUrl; }
};
const create = async (method: DokuOrderMethod, bank?: string) => {
  if (busy.value || payment.value) return;
  busy.value = true; emit('busy', true); error.value = '';
  try {
    await remember((await api.createDokuOrderPayment(props.orderId, method, bank)).data);
    if (method === 'credit_card') openCard();
  } catch (err) { error.value = message(err); }
  finally { busy.value = false; emit('busy', false); }
};
const checkStatus = async () => {
  if (checking.value || !payment.value || disposed) return;
  checking.value = true;
  try {
    const order = (await api.getOrder(props.orderId)).data;
    if (disposed) return;
    if (order.status === 'paid' || order.is_payment_complete) { await navigateTo(statusTo.value); return; }
    const current = (await api.getPayment(payment.value.payment_id)).data;
    if (disposed) return;
    if (['success', 'failed', 'expired', 'canceled'].includes(current.transaction_status)) await navigateTo(statusTo.value);
  } catch (err) { error.value = message(err); }
  finally { checking.value = false; }
};
const copyVa = async () => { try { await navigator.clipboard.writeText(payment.value?.virtual_account_no || ''); copied.value = true; } catch { copied.value = false; } };
onMounted(() => {
  dialog.value?.showModal();
  void load();
  timer = setInterval(() => { now.value = Date.now(); if (payment.value && checks < 30) { checks++; void checkStatus(); } }, 5000);
});
onBeforeUnmount(() => { disposed = true; clearInterval(timer); dialog.value?.close(); });
</script>

<style scoped>
.doku-dialog { width:min(36rem,calc(100% - 2rem)); max-height:calc(100dvh - 2rem); overflow:auto; border:1px solid rgb(255 255 255 / .2); border-radius:1.5rem; background:#071d3a; color:white; margin:auto; }
.doku-dialog::backdrop { background:rgb(1 8 20 / .82); backdrop-filter:blur(6px); }
.method { display:flex; align-items:center; gap:1rem; width:100%; padding:1rem; border:1px solid rgb(255 255 255 / .15); border-radius:1rem; text-align:left; }
.method:hover:enabled { border-color:#e6c477; background:rgb(255 255 255 / .05); }
.method img { width:5.5rem; height:3rem; object-fit:contain; background:white; border-radius:.5rem; padding:.3rem; }
.method span { font-weight:700; }
.method small { display:block; margin-top:.25rem; font-size:.75rem; font-weight:400; color:#cbd5e1; }
button:disabled { opacity:.5; cursor:not-allowed; }
.primary { width:100%; border-radius:999px; padding:.8rem 1rem; background:#e6c477; color:#04152d; font-weight:700; }
</style>
