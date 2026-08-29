<template>
  <section class="mt-7 rounded-2xl border border-white/10 bg-white/5 p-5">
    <h2 class="text-lg font-bold text-white">{{ copy.title }}</h2>
    <p class="mt-2 text-sm leading-6 text-slate-300">{{ copy.descriptionBefore }} <strong class="text-amber-200">{{ copy.pending }}</strong> {{ copy.descriptionAfter }}</p>

    <form class="mt-5 space-y-4" novalidate @submit.prevent="submitProof">
      <label class="field"><span>{{ copy.reference }} <small>{{ copy.optional }}</small></span><input v-model.trim="transferReference" maxlength="128" :placeholder="copy.referencePlaceholder"></label>
      <label class="field"><span>{{ copy.notes }} <small>{{ copy.optional }}</small></span><textarea v-model.trim="notes" rows="3" maxlength="1000" :placeholder="copy.notesPlaceholder" /></label>
      <label class="field"><span>{{ copy.proof }} *</span><input ref="fileInput" type="file" required accept="image/jpeg,image/png,application/pdf" @change="selectFile"></label>
      <p class="text-xs text-slate-400">{{ copy.formats }}</p>
      <button class="w-full rounded-full bg-amber-300 px-5 py-3 font-bold text-slate-950 disabled:cursor-not-allowed disabled:opacity-50" :disabled="submitting || !selectedFile">{{ submitting ? copy.uploading : copy.upload }}</button>
    </form>

    <div v-if="feedback" class="mt-4 rounded-xl border p-3 text-sm" :class="feedbackTone === 'success' ? 'border-emerald-300/30 bg-emerald-950/30 text-emerald-100' : 'border-red-400/30 bg-red-950/30 text-red-100'">{{ feedback }}</div>
    <div v-if="proofs.length" class="mt-5 border-t border-white/10 pt-5"><p class="text-xs font-bold uppercase tracking-[.18em] text-slate-400">{{ copy.uploaded }} ({{ proofs.length }})</p><ul class="mt-3 space-y-2"><li v-for="proof in proofs" :key="proof.id" class="rounded-xl bg-slate-950/50 p-3 text-sm text-slate-300"><span class="break-all">{{ proof.original_filename || proof.file_name || copy.proof }}</span><span v-if="proof.created_at" class="mt-1 block text-xs text-slate-500">{{ formatDate(proof.created_at) }}</span></li></ul></div>
  </section>
</template>

<script setup lang="ts">
import { usePayment, type ManualPaymentMethod, type ManualPaymentProof } from '~/composables/usePayment';

const props = defineProps<{ orderId: string; paymentMethod: ManualPaymentMethod }>();
const { locale } = useI18n();
const messages = {
  en: { title: 'Upload Proof of Payment', descriptionBefore: 'Upload your proof of payment for organizer verification. The payment will remain', pending: 'pending', descriptionAfter: 'until it has been confirmed by an organizer or administrator.', reference: 'Transaction Reference', optional: '(optional)', referencePlaceholder: 'Enter the transaction reference number', notes: 'Notes', notesPlaceholder: 'Add any relevant payment details', proof: 'Proof of Payment', formats: 'Accepted formats: JPG, PNG, or PDF. Maximum file size: 10 MB.', uploading: 'Uploading proof…', upload: 'Upload Proof of Payment', uploaded: 'Uploaded Proofs', storageError: 'The file could not be stored. Please contact the event administrator and provide the request ID below.', uploadError: 'The proof of payment could not be uploaded.', sizeError: 'The maximum file size is 10 MB.', success: 'Your proof of payment has been uploaded successfully and is awaiting organizer verification.', requestId: 'Request ID' },
  zh: { title: '上传付款凭证', descriptionBefore: '请上传付款凭证以供主办方审核。在主办方或管理员确认之前，付款状态将保持为', pending: '待处理', descriptionAfter: '。', reference: '交易参考号', optional: '（选填）', referencePlaceholder: '请输入交易参考号', notes: '备注', notesPlaceholder: '请填写相关付款说明', proof: '付款凭证', formats: '支持 JPG、PNG 或 PDF 格式，文件大小上限为 10 MB。', uploading: '正在上传凭证…', upload: '上传付款凭证', uploaded: '已上传的凭证', storageError: '文件无法保存。请联系活动管理员，并提供下方的请求 ID。', uploadError: '无法上传付款凭证。', sizeError: '文件大小不得超过 10 MB。', success: '付款凭证已成功上传，正在等待主办方审核。', requestId: '请求 ID' }
} as const;
const copy = computed(() => locale.value === 'zh-CN' ? messages.zh : messages.en);
const paymentApi = usePayment();
const transferReference = ref('');
const notes = ref('');
const selectedFile = ref<File | null>(null);
const fileInput = ref<HTMLInputElement | null>(null);
const submitting = ref(false);
const feedback = ref('');
const feedbackTone = ref<'success' | 'error'>('success');
const proofs = ref<ManualPaymentProof[]>([]);
const fileTypeError = computed(() => locale.value === 'zh-CN'
  ? '请选择 JPG、PNG 或 PDF 文件。'
  : 'Select a JPG, PNG, or PDF file.');
const acceptedFileTypes = new Set(['image/jpeg', 'image/png', 'application/pdf']);

const apiError = (error: unknown) => { const value = error as { data?: { message?: string; request_id?: string; errors?: Array<{ code?: string; message?: string }> } }; const detail = value.data?.errors?.[0]; const localizedErrors: Record<string, string> = { UPLOAD_STORAGE_ERROR: copy.value.storageError }; const message = (detail?.code && localizedErrors[detail.code]) || detail?.message || value.data?.message || (error instanceof Error ? error.message : copy.value.uploadError); return value.data?.request_id ? `${message} ${copy.value.requestId}: ${value.data.request_id}` : message; };
const selectFile = (event: Event) => { feedback.value = ''; const file = (event.target as HTMLInputElement).files?.[0] || null; if (file && !acceptedFileTypes.has(file.type)) { selectedFile.value = null; feedbackTone.value = 'error'; feedback.value = fileTypeError.value; if (fileInput.value) fileInput.value.value = ''; return; } if (file && file.size > 10 * 1024 * 1024) { selectedFile.value = null; feedbackTone.value = 'error'; feedback.value = copy.value.sizeError; if (fileInput.value) fileInput.value.value = ''; return; } selectedFile.value = file; };
const loadProofs = async () => { if (!props.orderId) return; try { proofs.value = (await paymentApi.getManualProofs(props.orderId)).data || []; } catch { proofs.value = []; } };
const submitProof = async () => { if (!selectedFile.value || submitting.value) return; submitting.value = true; feedback.value = ''; try { await paymentApi.uploadManualProof(props.orderId, props.paymentMethod, selectedFile.value, transferReference.value, notes.value); feedbackTone.value = 'success'; feedback.value = copy.value.success; selectedFile.value = null; transferReference.value = ''; notes.value = ''; if (fileInput.value) fileInput.value.value = ''; await loadProofs(); } catch (error) { feedbackTone.value = 'error'; feedback.value = apiError(error); } finally { submitting.value = false; } };
const formatDate = (value: string) => new Intl.DateTimeFormat(locale.value === 'zh-CN' ? 'zh-CN' : 'en-GB', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value));
onMounted(loadProofs);
</script>

<style scoped>
.field { display:block; font-size:.875rem; color:#cbd5e1; }
.field span { display:block; margin-bottom:.5rem; }
.field small { color:#64748b; }
.field input,.field textarea { width:100%; border:1px solid rgba(255,255,255,.1); border-radius:1rem; background:rgba(2,6,23,.78); padding:.8rem 1rem; color:white; outline:none; }
.field input:focus,.field textarea:focus { border-color:rgba(252,211,77,.55); }
</style>
