<template>
  <section class="mt-7 rounded-2xl border border-white/10 bg-white/5 p-5">
    <h2 class="text-lg font-bold text-white">Upload bukti pembayaran</h2>
    <p class="mt-2 text-sm leading-6 text-slate-300">Upload bukti pembayaran agar organizer dapat memverifikasinya. Pembayaran tetap berstatus <strong class="text-amber-200">pending</strong> sampai dikonfirmasi oleh organizer atau admin.</p>

    <form class="mt-5 space-y-4" @submit.prevent="submitProof">
      <label class="field"><span>Referensi transaksi <small>(opsional)</small></span><input v-model.trim="transferReference" maxlength="128" placeholder="Nomor referensi transaksi"></label>
      <label class="field"><span>Catatan <small>(opsional)</small></span><textarea v-model.trim="notes" rows="3" maxlength="1000" placeholder="Tambahkan keterangan pembayaran" /></label>
      <label class="field"><span>Bukti pembayaran *</span><input ref="fileInput" type="file" required accept="image/jpeg,image/png,application/pdf" @change="selectFile"></label>
      <p class="text-xs text-slate-400">Format JPG, PNG, atau PDF. Ukuran maksimum 10 MB.</p>
      <button class="w-full rounded-full bg-amber-300 px-5 py-3 font-bold text-slate-950 disabled:cursor-not-allowed disabled:opacity-50" :disabled="submitting || !selectedFile">{{ submitting ? 'Mengupload bukti...' : 'Upload bukti pembayaran' }}</button>
    </form>

    <div v-if="feedback" class="mt-4 rounded-xl border p-3 text-sm" :class="feedbackTone === 'success' ? 'border-emerald-300/30 bg-emerald-950/30 text-emerald-100' : 'border-red-400/30 bg-red-950/30 text-red-100'">{{ feedback }}</div>
    <div v-if="proofs.length" class="mt-5 border-t border-white/10 pt-5"><p class="text-xs font-bold uppercase tracking-[.18em] text-slate-400">Bukti yang sudah diupload ({{ proofs.length }})</p><ul class="mt-3 space-y-2"><li v-for="proof in proofs" :key="proof.id" class="rounded-xl bg-slate-950/50 p-3 text-sm text-slate-300"><span class="break-all">{{ proof.original_filename || proof.file_name || 'Bukti pembayaran' }}</span><span v-if="proof.created_at" class="mt-1 block text-xs text-slate-500">{{ formatDate(proof.created_at) }}</span></li></ul></div>
  </section>
</template>

<script setup lang="ts">
import { usePayment, type ManualPaymentMethod, type ManualPaymentProof } from '~/composables/usePayment';

const props = defineProps<{ orderId: string; paymentMethod: ManualPaymentMethod }>();
const paymentApi = usePayment();
const transferReference = ref('');
const notes = ref('');
const selectedFile = ref<File | null>(null);
const fileInput = ref<HTMLInputElement | null>(null);
const submitting = ref(false);
const feedback = ref('');
const feedbackTone = ref<'success' | 'error'>('success');
const proofs = ref<ManualPaymentProof[]>([]);

const apiError = (error: unknown) => { const value = error as { data?: { message?: string; errors?: Array<{ message?: string }> } }; return value.data?.errors?.[0]?.message || value.data?.message || (error instanceof Error ? error.message : 'Bukti pembayaran gagal diupload.'); };
const selectFile = (event: Event) => { feedback.value = ''; const file = (event.target as HTMLInputElement).files?.[0] || null; if (file && file.size > 10 * 1024 * 1024) { selectedFile.value = null; feedbackTone.value = 'error'; feedback.value = 'Ukuran file maksimum 10 MB.'; if (fileInput.value) fileInput.value.value = ''; return; } selectedFile.value = file; };
const loadProofs = async () => { if (!props.orderId) return; try { proofs.value = (await paymentApi.getManualProofs(props.orderId)).data || []; } catch { proofs.value = []; } };
const submitProof = async () => { if (!selectedFile.value || submitting.value) return; submitting.value = true; feedback.value = ''; try { await paymentApi.uploadManualProof(props.orderId, props.paymentMethod, selectedFile.value, transferReference.value, notes.value); feedbackTone.value = 'success'; feedback.value = 'Bukti pembayaran berhasil diupload dan sedang menunggu verifikasi organizer.'; selectedFile.value = null; transferReference.value = ''; notes.value = ''; if (fileInput.value) fileInput.value.value = ''; await loadProofs(); } catch (error) { feedbackTone.value = 'error'; feedback.value = apiError(error); } finally { submitting.value = false; } };
const formatDate = (value: string) => new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value));
onMounted(loadProofs);
</script>

<style scoped>
.field { display:block; font-size:.875rem; color:#cbd5e1; }
.field span { display:block; margin-bottom:.5rem; }
.field small { color:#64748b; }
.field input,.field textarea { width:100%; border:1px solid rgba(255,255,255,.1); border-radius:1rem; background:rgba(2,6,23,.78); padding:.8rem 1rem; color:white; outline:none; }
.field input:focus,.field textarea:focus { border-color:rgba(252,211,77,.55); }
</style>
