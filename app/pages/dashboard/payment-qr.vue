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
        <h1 class="mt-4 text-3xl font-black">Scan the QRIS Code to Complete Your Payment</h1>
        <p class="mt-4 text-base leading-8 text-slate-300">Open a QRIS-compatible payment application, scan the code below, and enter the exact amount shown for your order.</p>
        <p v-if="loading" class="mt-6 text-slate-300">Loading order amount...</p>
        <div v-else-if="errorMessage" class="mt-6 rounded-2xl border border-red-400/30 bg-red-950/30 p-4 text-red-100">{{ errorMessage }}</div>
        <template v-else>
          <div class="mt-6 rounded-2xl border border-cyan-300/25 bg-cyan-300/5 p-5"><p class="text-sm text-slate-400">Exact amount to enter</p><p class="mt-2 text-3xl font-black text-cyan-200">{{ money(order?.total_amount || 0, order?.currency || 'IDR') }}</p><p class="mt-2 text-xs text-slate-400">Order: {{ order?.order_number || orderId }}</p></div>
          <ol class="mt-6 space-y-3 text-sm leading-7 text-slate-300"><li>1. Open a mobile banking or payment application that supports QRIS.</li><li>2. Scan the QRIS code displayed above.</li><li>3. Enter the exact order amount shown above.</li><li>4. Complete the payment and retain the transaction receipt.</li><li>5. Upload your proof of payment using the form below.</li></ol>
          <div class="mt-6 rounded-2xl border border-cyan-300/20 bg-cyan-300/5 p-4 text-sm leading-6 text-cyan-100">Payment status: <strong>Pending verification</strong>. Uploading proof does not automatically mark the order as paid; an organizer or administrator must verify and confirm the payment.</div>
          <ManualPaymentProofUpload :order-id="orderId" payment-method="manual_qr_code" />
        </template>
        <div class="mt-8 flex flex-col gap-3 sm:flex-row"><NuxtLink :to="`/dashboard/payment?order_id=${encodeURIComponent(orderId)}`" class="rounded-full border border-white/20 px-6 py-3 text-center font-semibold">Choose another method</NuxtLink><NuxtLink to="/dashboard" class="rounded-full bg-cyan-300 px-6 py-3 text-center font-bold text-slate-950">Return to dashboard</NuxtLink></div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { usePayment, type OrderItem } from '~/composables/usePayment';
definePageMeta({ middleware: 'auth' });
useSeoMeta({ title: 'QR Code Direct | IWBIF 2026' });
const route = useRoute();
const { getOrder } = usePayment();
const orderId = ref('');
const order = ref<OrderItem | null>(null);
const loading = ref(true);
const errorMessage = ref('');
const queryValue = (value: unknown) => Array.isArray(value) ? String(value[0] || '') : typeof value === 'string' ? value : '';
onMounted(async () => { orderId.value = queryValue(route.query.order_id) || sessionStorage.getItem('iwbif-store-order-id') || ''; if (!orderId.value) { errorMessage.value = 'Order reference was not found. Please return to your cart.'; loading.value = false; return; } try { order.value = (await getOrder(orderId.value)).data; } catch (error) { const value = error as { data?: { message?: string } }; errorMessage.value = value.data?.message || (error instanceof Error ? error.message : 'Order could not be loaded.'); } finally { loading.value = false; } });
const money = (amount: number, currency: string) => new Intl.NumberFormat('id-ID', { style: 'currency', currency, maximumFractionDigits: 0 }).format(amount);
</script>
