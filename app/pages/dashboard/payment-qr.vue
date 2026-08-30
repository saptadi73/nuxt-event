<template>
  <section class="mx-auto max-w-5xl px-3 py-10 sm:px-6">
    <div class="glass-card grid overflow-hidden rounded-[2rem] border border-cyan-300/20 lg:grid-cols-[1fr_1.05fr]">
      <div class="flex items-start justify-center bg-gradient-to-br from-cyan-300/10 to-slate-950/70 p-5 sm:p-8">
        <div class="w-full max-w-md overflow-hidden rounded-[2rem] bg-white p-3 shadow-2xl shadow-cyan-950/30">
          <img src="/images/static-qris.jpeg" alt="QRIS Ikatan Wanita Pengusaha Indonesia" class="h-auto w-full rounded-2xl object-contain">
        </div>
      </div>
      <div class="p-5 sm:p-8 lg:p-10">
        <p class="text-xs font-bold uppercase tracking-[.3em] text-cyan-200">QR Code Direct</p>
        <h1 class="mt-4 text-3xl font-black">{{ copy.title }}</h1>
        <p class="mt-4 text-base leading-8 text-slate-300">{{ copy.description }}</p>
        <p v-if="loading" class="mt-6 text-slate-300">{{ copy.loading }}</p>
        <div v-else-if="errorMessage" class="mt-6 rounded-2xl border border-red-400/30 bg-red-950/30 p-4 text-red-100">{{ errorMessage }}</div>
        <template v-else>
          <div class="mt-6 rounded-2xl border border-cyan-300/25 bg-cyan-300/5 p-5"><p class="text-sm text-slate-400">{{ copy.exactAmount }}</p><p class="mt-2 text-3xl font-black text-cyan-200">{{ money(order?.total_amount || 0, order?.currency || 'IDR') }}</p><p class="mt-2 text-xs text-slate-400">{{ copy.order }}: {{ order?.order_number || orderId }}</p></div>
          <ol class="mt-6 space-y-3 text-sm leading-7 text-slate-300"><li v-for="step in copy.steps" :key="step">{{ step }}</li></ol>
          <div class="mt-6 rounded-2xl border border-cyan-300/20 bg-cyan-300/5 p-4 text-sm leading-6 text-cyan-100">{{ copy.paymentStatus }}: <strong>{{ copy.pending }}</strong>. {{ copy.verification }}</div>
          <ManualPaymentProofUpload :order-id="orderId" payment-method="manual_qr_code" />
        </template>
        <div class="mt-8 flex flex-col gap-3 sm:flex-row"><NuxtLink :to="`/dashboard/payment?order_id=${encodeURIComponent(orderId)}`" class="rounded-full border border-white/20 px-6 py-3 text-center font-semibold">{{ copy.anotherMethod }}</NuxtLink><NuxtLink to="/dashboard" class="rounded-full bg-cyan-300 px-6 py-3 text-center font-bold text-slate-950">{{ copy.dashboard }}</NuxtLink></div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { OrderItem } from '~/composables/usePayment';
definePageMeta({ middleware: 'auth' });
const { locale } = useI18n();
const messages = {
  en: { title: 'Scan the QRIS Code to Complete Your Payment', description: 'Open a QRIS-compatible payment application, scan the code, and enter the exact amount shown for your order.', loading: 'Loading order amount…', exactAmount: 'Exact amount to enter', order: 'Order', paymentStatus: 'Payment status', pending: 'Pending verification', verification: 'Uploading proof does not automatically mark the order as paid; an organizer or administrator must verify and confirm the payment.', anotherMethod: 'Choose another method', dashboard: 'Return to dashboard', steps: ['1. Open a mobile banking or payment application that supports QRIS.', '2. Scan the QRIS code displayed above.', '3. Enter the exact order amount shown above.', '4. Complete the payment and retain the transaction receipt.', '5. Upload your proof of payment using the form below.'], missing: 'Order reference was not found. Please return to your cart.', loadError: 'Order could not be loaded.' },
  zh: { title: '扫描 QRIS 二维码以完成付款', description: '打开支持 QRIS 的付款应用程序，扫描二维码，然后输入订单所显示的准确金额。', loading: '正在加载订单金额…', exactAmount: '应输入的准确金额', order: '订单', paymentStatus: '付款状态', pending: '等待审核', verification: '上传凭证不会自动将订单标记为已付款；主办方或管理员必须核实并确认付款。', anotherMethod: '选择其他付款方式', dashboard: '返回控制面板', steps: ['1. 打开支持 QRIS 的手机银行或付款应用程序。', '2. 扫描上方显示的 QRIS 二维码。', '3. 输入上方所示的准确订单金额。', '4. 完成付款并保留交易回执。', '5. 使用下方表单上传付款凭证。'], missing: '未找到订单参考信息，请返回购物车。', loadError: '无法加载订单。' }
} as const;
const copy = computed(() => locale.value === 'zh-CN' ? messages.zh : messages.en);
useSeoMeta({ title: () => `QR Code Direct | IWBIF 2026` });
const route = useRoute();
const orderId = ref('');
const order = ref<OrderItem | null>(null);
const loading = ref(true);
const errorMessage = ref('');
const queryValue = (value: unknown) => Array.isArray(value) ? String(value[0] || '') : typeof value === 'string' ? value : '';
onMounted(async () => { orderId.value = queryValue(route.query.order_id) || sessionStorage.getItem('iwbif-store-order-id') || ''; await navigateTo(orderId.value ? `/dashboard/payment?order_id=${encodeURIComponent(orderId.value)}` : '/dashboard/payment', { replace: true }); });
const money = (amount: number, currency: string) => new Intl.NumberFormat('id-ID', { style: 'currency', currency, maximumFractionDigits: 0 }).format(amount);
</script>
