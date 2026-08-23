<template>
  <section v-if="false" class="mx-auto max-w-4xl px-3 py-10 sm:px-6">
    <div class="glass-card grid overflow-hidden rounded-[2rem] border border-cyan-300/20 lg:grid-cols-[1fr_1.05fr]">
      <div class="flex items-center justify-center bg-gradient-to-br from-cyan-300/10 to-slate-950/70 p-6 sm:p-10">
        <div class="w-full max-w-sm rounded-[2rem] bg-[#fffaf0] p-5 text-center text-slate-950 shadow-2xl shadow-cyan-950/30">
          <p class="text-xs font-black uppercase tracking-[.25em] text-slate-500">Deprecated payment method</p>
          <div class="mx-auto mt-5 aspect-square overflow-hidden rounded-2xl border border-slate-200 bg-white p-3"><img v-if="qrImage" :src="qrImage" alt="Temporary demo QR payment code" class="h-full w-full object-contain"><div v-else class="flex h-full items-center justify-center text-sm text-slate-500">Generating QR code...</div></div>
          <p class="mt-5 text-2xl font-black">{{ money(order?.total_amount || 0, order?.currency || 'IDR') }}</p>
          <p class="mt-1 text-xs text-slate-500">{{ order?.order_number || orderId }}</p>
        </div>
      </div>
      <div class="p-5 sm:p-8 lg:p-10">
        <p class="text-xs font-bold uppercase tracking-[.3em] text-cyan-200">Scan to pay</p>
        <h1 class="mt-4 text-3xl font-black">Pay with your banking app</h1>
        <p class="mt-4 text-base leading-8 text-slate-300">Scan this QR code using the QR payment channel in your mobile banking or supported bank payment application.</p>
        <div class="mt-6 rounded-2xl border border-red-300/25 bg-red-950/25 p-4 text-sm leading-6 text-red-100"><strong>Demo QR only.</strong> This temporary code is for interface preview and cannot process a real payment.</div>
        <ol class="mt-6 space-y-3 text-sm leading-7 text-slate-300"><li>1. Open your bank or payment application.</li><li>2. Select its QR payment or scan feature.</li><li>3. Scan the code and verify the order amount.</li><li>4. Keep the QR transaction reference for organizer verification.</li></ol>
        <div class="mt-6 rounded-2xl border border-cyan-300/20 bg-cyan-300/5 p-4 text-sm leading-6 text-cyan-100">Payment status: <strong>Pending verification</strong>. A direct QR payment is considered paid only after an authorized admin confirms its transaction reference.</div>
        <div v-if="errorMessage" class="mt-5 rounded-2xl border border-red-400/30 bg-red-950/30 p-4 text-sm text-red-100">{{ errorMessage }}</div>
        <div class="mt-8 flex flex-col gap-3"><NuxtLink :to="`/dashboard/payment?order_id=${encodeURIComponent(orderId)}`" class="rounded-full border border-white/20 px-6 py-3 text-center font-semibold">Choose another method</NuxtLink><NuxtLink to="/dashboard" class="rounded-full bg-cyan-300 px-6 py-3 text-center font-bold text-slate-950">Return to dashboard</NuxtLink></div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import QRCode from 'qrcode';
import { usePayment, type OrderItem } from '~/composables/usePayment';
definePageMeta({ middleware: 'auth' });
useSeoMeta({ title: 'Payment Options | IWBIF 2026' });
const route = useRoute();
const { getOrder } = usePayment();
const orderId = ref('');
const order = ref<OrderItem | null>(null);
const qrImage = ref('');
const errorMessage = ref('');
const queryValue = (value: unknown) => Array.isArray(value) ? String(value[0] || '') : typeof value === 'string' ? value : '';
onMounted(async () => {
  orderId.value = queryValue(route.query.order_id) || sessionStorage.getItem('iwbif-store-order-id') || '';
  await navigateTo(orderId.value ? `/dashboard/payment?order_id=${encodeURIComponent(orderId.value)}` : '/dashboard/payment', { replace: true });
  return;
  if (!orderId.value) { errorMessage.value = 'Order reference was not found. Please return to your cart.'; return; }
  try {
    order.value = (await getOrder(orderId.value)).data;
    const payload = `IWBIF-DEMO|${orderId.value}|${order.value.order_number}|${order.value.total_amount}|${order.value.currency}`;
    qrImage.value = await QRCode.toDataURL(payload, { width: 512, margin: 2, color: { dark: '#04152d', light: '#fffaf0' } });
  } catch (error) { const value = error as { data?: { message?: string } }; errorMessage.value = value.data?.message || (error instanceof Error ? error.message : 'QR code could not be prepared.'); }
});
const money = (amount: number, currency: string) => new Intl.NumberFormat('id-ID', { style: 'currency', currency, maximumFractionDigits: 0 }).format(amount);
</script>
