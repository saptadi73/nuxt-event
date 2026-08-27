<template>
  <section class="mx-auto max-w-5xl px-3 py-10 sm:px-6 lg:px-8">
    <div class="flex flex-wrap items-end justify-between gap-5">
      <div>
        <p class="text-sm uppercase tracking-[.3em] text-amber-200">Organizer payment desk</p>
        <h1 class="mt-3 text-3xl font-black sm:text-4xl">Confirm Manual Payment</h1>
        <p class="mt-3 max-w-3xl text-sm leading-7 text-slate-300">Confirm a manual bank transfer only after matching the amount and transaction reference. The backend will create the manual payment record and mark the order as paid.</p>
      </div>
      <NuxtLink to="/admin/reports" class="rounded-full border border-white/20 px-5 py-3 text-sm font-semibold">Open sales report</NuxtLink>
    </div>

    <div class="mt-8 grid gap-6 lg:grid-cols-[1fr_22rem]">
      <form class="glass-card rounded-[2rem] p-5 sm:p-7" @submit.prevent="submitConfirmation">
        <div class="rounded-2xl border border-amber-300/20 bg-amber-300/5 p-4 text-sm leading-6 text-amber-100"><strong>Verification required.</strong> This action changes the backend order to paid. Confirm the bank mutation before submitting.</div>
        <div class="mt-6 space-y-5">
          <label class="field"><span>Payment method</span><select v-model="form.payment_method"><option value="manual_transfer">Manual Bank Transfer</option><option value="manual_qr_code">QR Code Direct</option></select></label>
          <label class="field"><span>Order ID</span><input v-model.trim="form.orderId" required placeholder="Order UUID" autocomplete="off"></label>
          <label class="field"><span>Transfer reference</span><input v-model.trim="form.transfer_reference" required minlength="3" maxlength="128" placeholder="BCA-20260819-001" autocomplete="off"></label>
          <label class="field"><span>Paid at <small>(optional)</small></span><input v-model="form.paid_at" type="datetime-local"></label>
          <label class="field"><span>Verification notes <small>(optional)</small></span><textarea v-model.trim="form.notes" rows="4" maxlength="1000" placeholder="Bank statement checked by organizer" /></label>
          <label class="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm leading-6 text-slate-300"><input v-model="confirmed" type="checkbox" class="mt-1 h-4 w-4 accent-amber-300"><span>I have verified the recipient, amount, order, and transaction reference.</span></label>
          <button class="w-full rounded-full bg-amber-300 px-6 py-3 font-bold text-slate-950 disabled:cursor-not-allowed disabled:opacity-50" :disabled="submitting || !confirmed">{{ submitting ? 'Confirming payment...' : 'Confirm manual payment' }}</button>
        </div>
      </form>

      <aside class="glass-card h-fit rounded-[2rem] p-6">
        <p class="text-xs font-bold uppercase tracking-[.22em] text-slate-400">What happens next</p>
        <ol class="mt-5 space-y-4 text-sm leading-6 text-slate-300"><li>1. A <strong>{{ form.payment_method }}</strong> payment record is created.</li><li>2. The order status changes to paid.</li><li>3. A linked registration is updated when applicable.</li><li>4. Repeating the same valid confirmation is handled idempotently.</li></ol>
      </aside>
    </div>

    <div v-if="feedback" class="mt-6 rounded-2xl border p-5 text-sm" :class="feedbackTone === 'error' ? 'border-red-400/30 bg-red-950/30 text-red-100' : 'border-emerald-300/30 bg-emerald-950/30 text-emerald-100'">
      <p class="font-bold">{{ feedbackTone === 'error' ? 'Confirmation failed' : 'Payment confirmed' }}</p>
      <p class="mt-2">{{ feedback }}</p>
      <p v-if="requestId" class="mt-2 text-xs opacity-70">Reference: {{ requestId }}</p>
    </div>

    <section class="glass-card mt-8 rounded-[2rem] p-5 sm:p-7">
      <div class="flex flex-wrap items-center justify-between gap-3"><div><p class="text-xs font-bold uppercase tracking-[.22em] text-slate-400">Manual payment report</p><h2 class="mt-2 text-xl font-bold">Uploaded payment proofs</h2></div><button class="rounded-full border border-white/20 px-4 py-2 text-sm font-semibold" :disabled="reportLoading" @click="loadManualReport">{{ reportLoading ? 'Loading...' : 'Refresh' }}</button></div>
      <p v-if="reportError" class="mt-4 text-sm text-red-200">{{ reportError }}</p>
      <div v-else-if="manualTransactions.length" class="mt-5 space-y-3"><article v-for="transaction in manualTransactions" :key="transaction.payment_id || transaction.id" class="rounded-2xl border border-white/10 bg-white/5 p-4"><div class="flex flex-wrap justify-between gap-3"><div><p class="font-bold text-white">{{ transaction.order_number || transaction.id }}</p><p class="mt-1 text-xs text-slate-400">{{ transaction.participant_name || transaction.customer_email || 'Participant' }} · {{ transaction.provider || transaction.channel_code || 'manual' }}</p></div><span class="text-sm text-amber-200">{{ transaction.payment_proof_count || transaction.payment_proofs?.length || 0 }} proof(s)</span></div><div v-if="transaction.payment_proofs?.length" class="mt-3 flex flex-wrap gap-2"><button v-for="proof in transaction.payment_proofs" :key="proof.id" type="button" class="rounded-full border border-cyan-300/30 bg-cyan-300/10 px-3 py-2 text-xs font-bold text-cyan-100" @click="openProof(proof.id, proof.original_filename || proof.file_name)">View {{ proof.original_filename || proof.file_name || 'proof' }}</button></div></article></div>
      <p v-else-if="!reportLoading" class="mt-5 text-sm text-slate-400">No manual payment proofs found.</p>
    </section>
  </section>
</template>

<script setup lang="ts">
import { useAdminReport, type PaymentReportTransaction } from '~/composables/useAdminReport';

definePageMeta({ middleware: ['auth', 'admin'] });
useSeoMeta({ title: 'Confirm Manual Payment | IWBIF 2026' });

const { confirmManualPayment, getManualPaymentReport, downloadManualProof } = useAdminReport();
const form = reactive<{ payment_method: 'manual_transfer' | 'manual_qr_code'; orderId: string; transfer_reference: string; notes: string; paid_at: string }>({ payment_method: 'manual_transfer', orderId: '', transfer_reference: '', notes: '', paid_at: '' });
const confirmed = ref(false);
const submitting = ref(false);
const feedback = ref('');
const requestId = ref('');
const feedbackTone = ref<'success' | 'error'>('success');
const reportLoading = ref(false);
const reportError = ref('');
const manualTransactions = ref<PaymentReportTransaction[]>([]);
const loadManualReport = async () => { reportLoading.value = true; reportError.value = ''; try { manualTransactions.value = (await getManualPaymentReport()).data?.transactions || []; } catch (error) { const value = error as { data?: { message?: string } }; reportError.value = value.data?.message || 'Manual payment report could not be loaded.'; } finally { reportLoading.value = false; } };
const openProof = async (proofId: string, fileName?: string) => { reportError.value = ''; try { const blob = await downloadManualProof(proofId); const url = URL.createObjectURL(blob); const anchor = document.createElement('a'); anchor.href = url; anchor.target = '_blank'; anchor.rel = 'noopener'; anchor.download = fileName || 'payment-proof'; anchor.click(); window.setTimeout(() => URL.revokeObjectURL(url), 60_000); } catch (error) { const value = error as { data?: { message?: string } }; reportError.value = value.data?.message || 'Payment proof could not be opened.'; } };

const submitConfirmation = async () => {
  if (submitting.value || !confirmed.value) return;
  submitting.value = true;
  feedback.value = '';
  requestId.value = '';
  try {
    const response = await confirmManualPayment(form.orderId, {
      payment_method: form.payment_method,
      transfer_reference: form.transfer_reference,
      notes: form.notes || null,
      paid_at: form.paid_at ? new Date(form.paid_at).toISOString() : null
    });
    feedbackTone.value = 'success';
    feedback.value = response.message || 'The manual bank transfer has been confirmed.';
    form.orderId = '';
    form.transfer_reference = '';
    form.notes = '';
    form.paid_at = '';
    confirmed.value = false;
    await loadManualReport();
  } catch (error) {
    const value = error as { data?: { message?: string; request_id?: string; errors?: Array<{ message: string }> } };
    feedbackTone.value = 'error';
    feedback.value = value.data?.errors?.[0]?.message || value.data?.message || (error instanceof Error ? error.message : 'The payment could not be confirmed.');
    requestId.value = value.data?.request_id || '';
  } finally {
    submitting.value = false;
  }
};
onMounted(loadManualReport);
</script>

<style scoped>
.field { display:block; font-size:.875rem; color:#cbd5e1; }
.field span { display:block; margin-bottom:.5rem; }
.field small { color:#64748b; }
.field input,.field select,.field textarea { width:100%; border:1px solid rgba(255,255,255,.1); border-radius:1rem; background:rgba(2,6,23,.78); padding:.8rem 1rem; color:white; outline:none; }
.field input:focus,.field select:focus,.field textarea:focus { border-color:rgba(252,211,77,.55); }
</style>
