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
        <div class="mt-4 rounded-2xl border border-cyan-300/25 bg-cyan-300/5 p-4 text-sm leading-6 text-cyan-100">{{ copy.exchangeNotice }}</div>
        <p v-if="loading" class="mt-6 text-slate-300">{{ copy.loading }}</p>
        <div v-else-if="errorMessage" class="mt-6 rounded-2xl border border-red-400/30 bg-red-950/30 p-4 text-red-100">{{ errorMessage }}</div>
        <template v-else>
          <dl class="mt-6 grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 sm:grid-cols-2">
            <div v-for="detail in bankDetails" :key="detail.label" class="bg-slate-950/75 p-5"><dt class="text-xs uppercase tracking-[.18em] text-slate-500">{{ detail.label }}</dt><dd class="mt-2 break-words text-lg font-bold text-white">{{ detail.value }}</dd></div>
          </dl>
          <ul v-if="orderItems.length" class="mt-6 space-y-3 rounded-2xl border border-white/10 bg-white/5 p-5"><li v-for="item in orderItems" :key="item.id" class="grid gap-2 border-b border-white/10 pb-3 last:border-0 last:pb-0 sm:grid-cols-[1fr_auto]"><span class="min-w-0 break-words text-sm text-slate-300">{{ item.product_name }} × {{ item.quantity }}</span><div class="sm:text-right"><strong class="text-white">{{ usd(displayUnitPrice(item.product_id) * item.quantity) }}</strong><LocalCurrencyAmounts :amount="displayItemIdr(item)" compact /></div></li></ul>
          <div class="mt-6 rounded-2xl border border-amber-300/20 bg-amber-300/5 p-5"><p class="text-sm text-slate-400">{{ copy.packageTotal }}</p><p class="mt-2 text-3xl font-black text-amber-200">{{ displayOrderUsdTotal > 0 ? usd(displayOrderUsdTotal) : copy.paymentAmountGateway }}</p><LocalCurrencyAmounts v-if="order?.total_amount" :amount="order.total_amount" show-rate /></div>
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
import { useEvent } from '~/composables/useEvent';
import { usePayment, type OrderItem, type PendingOrderProductItem } from '~/composables/usePayment';
definePageMeta({ middleware: 'auth' });
const { locale } = useI18n();
const messages = {
  en: { eyebrow: 'Manual Bank Transfer', title: 'Transfer instructions', description: 'Review your USD package total and the official IDR payment base, include your order number as the payment reference, then upload your payment proof below.', important: 'Important.', notice: 'Verify the beneficiary name, order reference, and currency amount before transferring.', exchangeNotice: 'For participants from China and Malaysia, CNY and MYR equivalents are calculated from the official IDR payment base—not from the displayed USD price.', loading: 'Loading order…', packageTotal: 'Package total', paymentAmountGateway: 'Shown by payment process', paymentStatus: 'Payment status', pending: 'Pending verification', verification: 'Only an authorized administrator or organizer can confirm a manual transfer.', anotherMethod: 'Choose another method', dashboard: 'Return to dashboard', labels: ['Account Name', 'Account Number', 'Bank Name', 'SWIFT Code / BIC', 'Bank Address', 'Beneficiary Address', 'Payment reference'], steps: ["1. Open your bank's mobile banking or internet banking service.", '2. Use the account details and currency equivalent shown above.', '3. Enter the order number in the payment reference or transfer notes.', '4. Upload your transfer receipt using the form below.'], missing: 'Order reference was not found. Please return to your cart.', loadError: 'Order could not be loaded.' },
  zh: { eyebrow: '银行手动转账', title: '转账说明', description: '请核对美元套餐总额和印尼盾正式付款基准，将订单编号填写为付款参考号，然后上传付款凭证。', important: '重要提示。', notice: '转账前请核对收款人名称、订单参考号和货币金额。', exchangeNotice: '中国和马来西亚参会者的人民币及马来西亚令吉等值金额，均根据印尼盾正式付款基准计算，而非根据页面显示的美元价格计算。', loading: '正在加载订单…', packageTotal: '套餐总额', paymentAmountGateway: '由付款流程显示', paymentStatus: '付款状态', pending: '等待审核', verification: '只有授权管理员或主办方才能确认手动转账。', anotherMethod: '选择其他付款方式', dashboard: '返回控制面板', labels: ['账户名称', '账号', '银行名称', 'SWIFT 代码／BIC', '银行地址', '收款人地址', '付款参考号'], steps: ['1. 打开银行的手机银行或网上银行服务。', '2. 使用上方账户信息和显示的货币等值金额完成转账。', '3. 在付款参考或转账备注中填写订单编号。', '4. 使用下方表单上传转账回执。'], missing: '未找到订单参考信息，请返回购物车。', loadError: '无法加载订单。' }
} as const;
const copy = computed(() => locale.value === 'zh-CN' ? messages.zh : messages.en);
useSeoMeta({ title: () => `${copy.value.eyebrow} | IWBIF 2026` });
const route = useRoute();
const paymentApi = usePayment();
const { getOrder } = paymentApi;
const { getEvents, getDelegatePackageCatalog } = useEvent();
const orderId = ref('');
const order = ref<OrderItem | null>(null);
const orderItems = ref<PendingOrderProductItem[]>([]);
const usdPricesByProductId = ref(new Map<string, number>());
const idrPricesByProductId = ref(new Map<string, number>());
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
const displayUnitPrice = (productId: string) => usdPricesByProductId.value.get(productId) || 0;
const displayOrderUsdTotal = computed(() => orderItems.value.reduce((sum, item) => sum + (displayUnitPrice(item.product_id) * item.quantity), 0));
const displayItemIdr = (item: PendingOrderProductItem) => (idrPricesByProductId.value.get(item.product_id) || Number(item.unit_price) || 0) * item.quantity;
const usd = (amount: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount || 0);
const loadUsdOrderContext = async () => {
  if (!orderId.value) return;
  try {
    const detail = (await paymentApi.getOrderDetail(orderId.value)).data;
    orderItems.value = detail.items || [];
    let eventId = order.value?.event_id || detail.order.event_id || '';
    if (!eventId) eventId = (await getEvents(1, 1)).data[0]?.id || '';
    if (!eventId) return;
    const catalog = (await getDelegatePackageCatalog(eventId)).data;
    const rates = [...catalog.main_packages, ...catalog.additional_packages, ...(catalog.exhibitor_packages || [])].flatMap(pkg => pkg.rates).filter(rate => rate.is_active);
    usdPricesByProductId.value = new Map(rates.map(rate => [rate.product_id, Number(rate.amount)]));
    idrPricesByProductId.value = new Map(rates.filter(rate => rate.payment_amount_idr != null).map(rate => [rate.product_id, Number(rate.payment_amount_idr)]));
  } catch {
    // Manual proof upload can still proceed; no backend payment amount is shown.
  }
};
onMounted(async () => {
  orderId.value = queryValue(route.query.order_id) || sessionStorage.getItem('iwbif-store-order-id') || '';
  if (!orderId.value) { errorMessage.value = copy.value.missing; loading.value = false; return; }
  try { order.value = (await getOrder(orderId.value)).data; await loadUsdOrderContext(); }
  catch (error) { const value = error as { data?: { message?: string } }; errorMessage.value = value.data?.message || (error instanceof Error ? error.message : copy.value.loadError); }
  finally { loading.value = false; }
});
</script>
