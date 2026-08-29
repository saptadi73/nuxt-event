<template>
  <section class="mx-auto max-w-4xl px-3 py-10 sm:px-6">
    <div class="glass-card overflow-hidden rounded-[2rem] border border-amber-300/20">
      <div class="bg-gradient-to-r from-amber-300/15 via-transparent to-cyan-300/10 p-5 sm:p-8">
        <p class="text-xs font-bold uppercase tracking-[.3em] text-amber-200">{{ copy.eyebrow }}</p>
        <h1 class="mt-4 text-3xl font-black sm:text-4xl">{{ copy.title }}</h1>
        <p class="mt-3 max-w-2xl text-sm leading-7 text-slate-300">{{ copy.description }}</p>
      </div>
      <div class="p-5 sm:p-8">
        <div class="rounded-2xl border border-amber-300/25 bg-amber-300/5 p-4 text-sm leading-6 text-amber-100"><strong>{{ copy.important }}</strong> {{ copy.notice }}</div>
        <p v-if="loading" class="mt-6 text-slate-300">{{ copy.loading }}</p>
        <div v-else-if="errorMessage" class="mt-6 rounded-2xl border border-red-400/30 bg-red-950/30 p-4 text-red-100">{{ errorMessage }}</div>
        <template v-else>
          <dl class="mt-6 grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 sm:grid-cols-2">
            <div v-for="detail in bankDetails" :key="detail.label" class="bg-slate-950/75 p-5"><dt class="text-xs uppercase tracking-[.18em] text-slate-500">{{ detail.label }}</dt><dd class="mt-2 break-words text-lg font-bold text-white">{{ detail.value }}</dd></div>
          </dl>
          <div class="mt-6 rounded-2xl border border-amber-300/20 bg-amber-300/5 p-5"><p class="text-sm text-slate-400">{{ copy.exactAmount }}</p><p class="mt-2 text-3xl font-black text-amber-200">{{ money(order?.total_amount || 0, order?.currency || 'IDR') }}</p></div>
          <ol class="mt-7 space-y-3 text-sm leading-7 text-slate-300"><li v-for="step in copy.steps" :key="step">{{ step }}</li></ol>
          <div class="mt-6 rounded-2xl border border-amber-300/20 bg-amber-300/5 p-4 text-sm leading-6 text-amber-100">{{ copy.paymentStatus }}: <strong>{{ copy.pending }}</strong>. {{ copy.verification }}</div>
          <ManualPaymentProofUpload :order-id="orderId" payment-method="manual_transfer" />
        </template>
        <div class="mt-8 flex flex-col gap-3 sm:flex-row"><NuxtLink :to="`/dashboard/payment?order_id=${encodeURIComponent(orderId)}`" class="rounded-full border border-white/20 px-6 py-3 text-center font-semibold">{{ copy.anotherMethod }}</NuxtLink><NuxtLink to="/dashboard" class="rounded-full bg-amber-300 px-6 py-3 text-center font-bold text-slate-950">{{ copy.dashboard }}</NuxtLink></div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { usePayment, type OrderItem } from '~/composables/usePayment';
definePageMeta({ middleware: 'auth' });
const { locale } = useI18n();
const messages = {
  en: { eyebrow: 'Manual Bank Transfer', title: 'Transfer instructions', description: 'Transfer the exact order amount, include your order number as the payment reference, then upload your payment proof below. Your order remains pending until the organizer verifies the transaction.', important: 'Important.', notice: 'Verify the beneficiary name and transfer the exact order amount. Keep the receipt for organizer verification.', loading: 'Loading order…', exactAmount: 'Exact transfer amount', paymentStatus: 'Payment status', pending: 'Pending verification', verification: 'Only an authorized administrator or organizer can confirm a manual transfer.', anotherMethod: 'Choose another method', dashboard: 'Return to dashboard', labels: ['Account Name', 'Account Number', 'Bank Name', 'SWIFT Code / BIC', 'Bank Address', 'Beneficiary Address', 'Payment reference'], steps: ["1. Open your bank's mobile banking or internet banking service.", '2. Transfer the exact amount to the account shown above.', '3. Enter the order number in the payment reference or transfer notes.', '4. Upload your transfer receipt using the form below.'], missing: 'Order reference was not found. Please return to your cart.', loadError: 'Order could not be loaded.' },
  zh: { eyebrow: '银行手动转账', title: '转账说明', description: '请转账订单的准确金额，将订单编号填写为付款参考号，然后在下方上传付款凭证。在主办方核实交易之前，订单将保持待处理状态。', important: '重要提示。', notice: '请核对收款人名称并转账准确的订单金额。请保留回执以供主办方核实。', loading: '正在加载订单…', exactAmount: '准确转账金额', paymentStatus: '付款状态', pending: '等待审核', verification: '只有授权管理员或主办方才能确认手动转账。', anotherMethod: '选择其他付款方式', dashboard: '返回控制面板', labels: ['账户名称', '账号', '银行名称', 'SWIFT 代码／BIC', '银行地址', '收款人地址', '付款参考号'], steps: ['1. 打开银行的手机银行或网上银行服务。', '2. 将准确金额转入上方所示账户。', '3. 在付款参考或转账备注中填写订单编号。', '4. 使用下方表单上传转账回执。'], missing: '未找到订单参考信息，请返回购物车。', loadError: '无法加载订单。' }
} as const;
const copy = computed(() => locale.value === 'zh-CN' ? messages.zh : messages.en);
useSeoMeta({ title: () => `${copy.value.eyebrow} | IWBIF 2026` });
const route = useRoute();
const { getOrder } = usePayment();
const orderId = ref('');
const order = ref<OrderItem | null>(null);
const loading = ref(true);
const errorMessage = ref('');
const queryValue = (value: unknown) => Array.isArray(value) ? String(value[0] || '') : typeof value === 'string' ? value : '';
const bankDetails = computed(() => [
  { label: copy.value.labels[0], value: 'Pers. Ikatan Wanita Pengusaha Indonesia' },
  { label: copy.value.labels[1], value: '1260010014735' },
  { label: copy.value.labels[2], value: 'PT Bank Mandiri (Persero) Tbk.' },
  { label: copy.value.labels[3], value: 'BMRIIDJA' },
  { label: copy.value.labels[4], value: 'Jl. Jend. Gatot Subroto 36-38, Jakarta 12190, Indonesia' },
  { label: copy.value.labels[5], value: 'Jl Kali Pasir No. 38 RT 9, RW 1, Cikini, Menteng, Jakarta Pusat, DKI Jakarta' },
  { label: copy.value.labels[6], value: order.value?.order_number || orderId.value || '-' }
]);
onMounted(async () => {
  orderId.value = queryValue(route.query.order_id) || sessionStorage.getItem('iwbif-store-order-id') || '';
  if (!orderId.value) { errorMessage.value = copy.value.missing; loading.value = false; return; }
  try { order.value = (await getOrder(orderId.value)).data; }
  catch (error) { const value = error as { data?: { message?: string } }; errorMessage.value = value.data?.message || (error instanceof Error ? error.message : copy.value.loadError); }
  finally { loading.value = false; }
});
const money = (amount: number, currency: string) => new Intl.NumberFormat('id-ID', { style: 'currency', currency, maximumFractionDigits: 0 }).format(amount);
</script>
