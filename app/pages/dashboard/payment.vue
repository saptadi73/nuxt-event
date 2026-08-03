<template>
  <section class="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
    <div class="glass-card rounded-[2rem] p-6">
      <p class="text-sm uppercase tracking-[0.3em] text-cyan-200/70">Midtrans</p>
      <h1 class="mt-3 text-4xl font-bold text-white">Payment</h1>
      <p class="mt-3 text-slate-300">
        Create or continue your payment securely. Your registration is identified automatically from your account.
      </p>

      <div v-if="checking" class="mt-8 text-slate-300">Checking your payment status...</div>
      <div v-else-if="hasPaidInvoice" class="mt-8 space-y-3 rounded-2xl border border-emerald-300/20 bg-emerald-300/5 p-5 text-slate-200">
        <p class="text-lg font-semibold text-emerald-300">Thank you, your payment has been received.</p>
        <p>Your registration is confirmed. You can download your invoice from the Invoice dashboard.</p>
        <NuxtLink to="/dashboard/invoice" class="inline-flex rounded-full bg-cyan-400 px-5 py-3 font-semibold text-slate-950">Go to invoice dashboard</NuxtLink>
      </div>
      <form v-else class="mt-8" @submit.prevent="create">
        <button
          class="rounded-full bg-cyan-400 px-6 py-3 text-sm font-semibold text-slate-950 disabled:cursor-not-allowed disabled:opacity-60"
          :disabled="submitting"
        >
          {{ submitting ? 'Preparing payment...' : 'Proceed to payment' }}
        </button>
      </form>

      <div v-if="result && !result.already_paid" class="mt-8 space-y-3 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-200">
        <p class="text-white font-semibold">Your payment is ready to continue.</p>
        <a v-if="result.redirect_url" :href="result.redirect_url" class="inline-flex rounded-full bg-cyan-400 px-5 py-3 font-semibold text-slate-950">Continue to payment</a>
      </div>
      <p v-if="errorMessage" class="mt-5 rounded-2xl border border-red-400/30 bg-red-950/30 p-4 text-sm text-red-100">
        {{ errorMessage }}
      </p>
    </div>
  </section>
</template>

<script setup lang="ts">
import { usePayment } from '~/composables/usePayment';

definePageMeta({ middleware: 'auth' });

const { createMidtransTransaction, getMyInvoices } = usePayment();

const submitting = ref(false);
const checking = ref(true);
const hasPaidInvoice = ref(false);
const result = ref<Awaited<ReturnType<typeof createMidtransTransaction>>['data'] | null>(null);
const errorMessage = ref('');

const create = async () => {
  submitting.value = true;
  result.value = null;
  errorMessage.value = '';

  try {
    const response = await createMidtransTransaction();
    result.value = response.data;
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'Payment could not be created.';
  } finally {
    submitting.value = false;
  }
};

onMounted(async () => {
  try {
    const response = await getMyInvoices();
    hasPaidInvoice.value = response.data.some((item) => item.order.status === 'paid');
  } catch (error) {
    // The payment form remains available when there is no invoice yet.
  } finally {
    checking.value = false;
  }
});
</script>
