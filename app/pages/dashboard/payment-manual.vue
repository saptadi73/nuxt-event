<template>
  <section class="mx-auto max-w-4xl px-3 py-10 sm:px-6">
    <div class="glass-card overflow-hidden rounded-[2rem] border border-amber-300/20">
      <div class="bg-gradient-to-r from-amber-300/15 via-transparent to-cyan-300/10 p-5 sm:p-8">
        <p class="text-xs font-bold uppercase tracking-[.3em] text-amber-200">Manual Bank Transfer</p>
        <h1 class="mt-4 text-3xl font-black sm:text-4xl">Transfer instructions</h1>
        <p class="mt-3 max-w-2xl text-sm leading-7 text-slate-300">Transfer the exact order amount and include your order number as the payment reference. Your order remains pending until the organizer verifies the bank transaction.</p>
      </div>
      <div class="p-5 sm:p-8">
        <div class="rounded-2xl border border-amber-300/25 bg-amber-300/5 p-4 text-sm leading-6 text-amber-100"><strong>Important.</strong> Verify the beneficiary name and transfer the exact order amount. Keep the receipt for organizer verification.</div>
        <p v-if="loading" class="mt-6 text-slate-300">Loading order...</p>
        <div v-else-if="errorMessage" class="mt-6 rounded-2xl border border-red-400/30 bg-red-950/30 p-4 text-red-100">{{ errorMessage }}</div>
        <template v-else>
          <dl class="mt-6 grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 sm:grid-cols-2">
            <div v-for="detail in bankDetails" :key="detail.label" class="bg-slate-950/75 p-5"><dt class="text-xs uppercase tracking-[.18em] text-slate-500">{{ detail.label }}</dt><dd class="mt-2 break-words text-lg font-bold text-white">{{ detail.value }}</dd></div>
          </dl>
          <div class="mt-6 rounded-2xl border border-amber-300/20 bg-amber-300/5 p-5"><p class="text-sm text-slate-400">Exact transfer amount</p><p class="mt-2 text-3xl font-black text-amber-200">{{ money(order?.total_amount || 0, order?.currency || 'IDR') }}</p></div>
          <ol class="mt-7 space-y-3 text-sm leading-7 text-slate-300"><li>1. Open your bank's mobile banking or internet banking service.</li><li>2. Transfer the exact amount to the account shown above.</li><li>3. Enter the order number in the payment reference or transfer notes.</li><li>4. Keep your transfer receipt for organizer verification.</li></ol>
          <div class="mt-6 rounded-2xl border border-amber-300/20 bg-amber-300/5 p-4 text-sm leading-6 text-amber-100">Payment status: <strong>Pending verification</strong>. Only an authorized admin or organizer can confirm a manual transfer.</div>
        </template>
        <div class="mt-8 flex flex-col gap-3 sm:flex-row"><NuxtLink :to="`/dashboard/payment?order_id=${encodeURIComponent(orderId)}`" class="rounded-full border border-white/20 px-6 py-3 text-center font-semibold">Choose another method</NuxtLink><NuxtLink to="/dashboard" class="rounded-full bg-amber-300 px-6 py-3 text-center font-bold text-slate-950">Return to dashboard</NuxtLink></div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { usePayment, type OrderItem } from '~/composables/usePayment';
definePageMeta({ middleware: 'auth' });
useSeoMeta({ title: 'Manual Bank Transfer | IWBIF 2026' });
const route = useRoute();
const { getOrder } = usePayment();
const orderId = ref('');
const order = ref<OrderItem | null>(null);
const loading = ref(true);
const errorMessage = ref('');
const queryValue = (value: unknown) => Array.isArray(value) ? String(value[0] || '') : typeof value === 'string' ? value : '';
const bankDetails = computed(() => [
  { label: 'Account Name', value: 'Pers. Ikatan Wanita Pengusaha Indonesia' },
  { label: 'Account Number', value: '1260010014735' },
  { label: 'Bank Name', value: 'PT Bank Mandiri (Persero) Tbk.' },
  { label: 'SWIFT Code / BIC', value: 'BMRIIDJA' },
  { label: 'Bank Address', value: 'Jl. Jend. Gatot Subroto 36-38, Jakarta 12190, Indonesia' },
  { label: 'Beneficiary Address', value: 'Jl Kali Pasir No. 38 RT 9, RW 1, Cikini, Menteng, Jakarta Pusat, DKI Jakarta' },
  { label: 'Payment reference', value: order.value?.order_number || orderId.value || '-' }
]);
onMounted(async () => {
  orderId.value = queryValue(route.query.order_id) || sessionStorage.getItem('iwbif-store-order-id') || '';
  if (!orderId.value) { errorMessage.value = 'Order reference was not found. Please return to your cart.'; loading.value = false; return; }
  try { order.value = (await getOrder(orderId.value)).data; }
  catch (error) { const value = error as { data?: { message?: string } }; errorMessage.value = value.data?.message || (error instanceof Error ? error.message : 'Order could not be loaded.'); }
  finally { loading.value = false; }
});
const money = (amount: number, currency: string) => new Intl.NumberFormat('id-ID', { style: 'currency', currency, maximumFractionDigits: 0 }).format(amount);
</script>
