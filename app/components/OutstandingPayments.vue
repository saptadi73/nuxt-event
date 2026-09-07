<template>
  <section class="mt-8" aria-live="polite">
    <div class="flex flex-wrap items-center justify-between gap-3">
      <h2 class="text-2xl font-bold">{{ copy.title }}</h2>
      <button class="rounded-full border border-white/20 px-4 py-2 text-sm disabled:opacity-50" :disabled="loading" @click="refresh">{{ copy.refresh }}</button>
    </div>
    <p v-if="loading" class="mt-4 text-slate-400">{{ copy.loading }}</p>
    <p v-else-if="error" role="alert" class="mt-4 text-red-200">{{ copy.error }}</p>
    <p v-else-if="!orders.length" class="mt-4 text-slate-400">{{ copy.empty }}</p>
    <div v-else class="mt-5 grid gap-5 lg:grid-cols-2">
      <article v-for="entry in orders" :key="entry.order.id" class="glass-card rounded-3xl p-5">
        <p class="break-all text-sm text-cyan-200">{{ entry.order.order_number }}</p>
        <p class="mt-2 font-semibold">{{ entry.items.map(item => item.product_name).join(', ') }}</p>
        <OrderPaymentProgress :order="entry.order" :attempts="entry.payment_attempts" />
        <NuxtLink :to="`/dashboard/payment?order_id=${encodeURIComponent(entry.order.id)}`" class="mt-5 inline-flex rounded-full bg-amber-300 px-5 py-3 font-bold text-slate-950">{{ copy.continue }}</NuxtLink>
      </article>
    </div>
  </section>
</template>
<script setup lang="ts">
import type { PendingOrderRecord } from '~/composables/usePayment';
const { locale } = useI18n();
const { getOutstandingOrders } = usePayment();
const orders = ref<PendingOrderRecord[]>([]);
const loading = ref(true);
const error = ref(false);
const copy = computed(() => locale.value === 'zh-CN' ? {
  title: '待完成付款', refresh: '刷新', loading: '正在加载付款进度…', error: '无法加载付款进度，请刷新重试。', empty: '没有待完成的付款。', continue: '继续付款'
} : {
  title: 'Payments to complete', refresh: 'Refresh', loading: 'Loading payment progress…', error: 'Payment progress could not be loaded. Please refresh to try again.', empty: 'No outstanding payments.', continue: 'Continue payment'
});
const refresh = async () => {
  loading.value = true;
  error.value = false;
  try { orders.value = await getOutstandingOrders(); }
  catch { error.value = true; }
  finally { loading.value = false; }
};
onMounted(refresh);
</script>
