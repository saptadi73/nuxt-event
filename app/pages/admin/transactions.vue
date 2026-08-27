<template>
  <section class="mx-auto max-w-7xl px-3 py-10 sm:px-6 lg:px-8">
    <header class="flex flex-wrap items-end justify-between gap-4">
      <div>
        <p class="text-xs font-bold uppercase tracking-[.28em] text-amber-200">Organizer payment desk</p>
        <h1 class="mt-3 text-3xl font-black sm:text-4xl">Transaction Management</h1>
        <p class="mt-3 max-w-3xl text-sm leading-6 text-slate-300">Review and reconcile manual payments and payment-gateway transactions from one page.</p>
      </div>
      <button class="action-secondary" :disabled="loading" @click="loadTransactions">{{ loading ? 'Loading...' : 'Refresh' }}</button>
    </header>

    <form class="glass-card mt-7 grid gap-4 rounded-3xl p-5 sm:grid-cols-2 lg:grid-cols-4" @submit.prevent="applyFilters">
      <label class="field"><span>Status</span><select v-model="filters.status"><option value="">All statuses</option><option v-for="status in statuses" :key="status" :value="status">{{ status }}</option></select></label>
      <label class="field"><span>Provider</span><input v-model.trim="filters.provider" placeholder="midtrans, doku, manual_transfer"></label>
      <label class="field"><span>Channel</span><input v-model.trim="filters.channel_code" placeholder="QRIS, BCA, BNI"></label>
      <label class="field"><span>Event ID</span><input v-model.trim="filters.event_id" placeholder="Optional UUID"></label>
      <label class="field"><span>From</span><input v-model="filters.date_from" type="date"></label>
      <label class="field"><span>To</span><input v-model="filters.date_to" type="date"></label>
      <label class="flex items-center gap-3 self-end rounded-2xl border border-white/10 px-4 py-3 text-sm text-slate-300"><input v-model="filters.include_deleted" type="checkbox" class="accent-amber-300"> Include deleted</label>
      <div class="flex items-end gap-2"><button class="action-primary flex-1">Apply filters</button><button type="button" class="action-secondary" @click="resetFilters">Reset</button></div>
    </form>

    <div v-if="feedback" class="mt-5 rounded-2xl border p-4 text-sm" :class="feedbackTone === 'error' ? 'border-red-300/30 bg-red-950/30 text-red-100' : 'border-emerald-300/30 bg-emerald-950/30 text-emerald-100'">{{ feedback }}</div>

    <div class="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
      <article v-for="card in summaryCards" :key="card.label" class="glass-card rounded-3xl p-5"><p class="text-[10px] uppercase tracking-[.2em] text-slate-400">{{ card.label }}</p><p class="mt-3 text-2xl font-black">{{ card.value }}</p></article>
    </div>

    <section class="glass-card mt-6 rounded-3xl p-4 sm:p-6">
      <div class="flex flex-wrap items-center justify-between gap-3">
        <div><h2 class="text-xl font-bold">Transactions</h2><p class="mt-1 text-xs text-slate-400">{{ meta.total }} result(s) · {{ selectedIds.length }} selected</p></div>
        <div class="flex flex-wrap gap-2">
          <button class="table-button text-emerald-200" :disabled="!canBulk('success')" @click="openBulk('success')">Confirm selected</button>
          <button class="table-button text-amber-200" :disabled="!canBulk('canceled')" @click="openBulk('canceled')">Cancel selected</button>
          <button class="table-button text-red-200" :disabled="!canBulk('delete')" @click="openBulk('delete')">Delete selected</button>
        </div>
      </div>

      <div v-if="loading" class="py-16 text-center text-slate-400">Loading transactions...</div>
      <div v-else-if="!transactions.length" class="py-16 text-center text-slate-400">No transactions match these filters.</div>
      <div v-else class="mt-5 overflow-x-auto data-table-shell">
        <table class="w-full min-w-[1100px] text-left text-sm">
          <thead><tr><th class="w-10"><input :checked="allVisibleSelected" type="checkbox" class="accent-amber-300" aria-label="Select all visible transactions" @change="toggleAll"></th><th>Order</th><th>Provider / reference</th><th>Status</th><th>Amount</th><th>Paid / expiry</th><th class="text-right">Actions</th></tr></thead>
          <tbody>
            <tr v-for="item in transactions" :key="paymentId(item)" :class="item.deleted_at ? 'opacity-55' : ''">
              <td><input :checked="selectedIds.includes(paymentId(item))" :disabled="!item.allowed_actions?.length" type="checkbox" class="accent-amber-300" :aria-label="`Select ${item.order_number || paymentId(item)}`" @change="toggleOne(paymentId(item))"></td>
              <td data-label="Order"><strong class="block text-white">{{ item.order_number || item.order_id || '—' }}</strong><small class="mt-1 block text-slate-500">{{ paymentId(item) }}</small></td>
              <td data-label="Provider"><strong>{{ item.provider || item.channel_code || '—' }}</strong><small class="mt-1 block max-w-72 break-all text-slate-500">{{ item.provider_transaction_id || item.provider_order_id || 'No provider reference' }}</small></td>
              <td data-label="Status"><span class="status-pill" :class="statusClass(item.transaction_status || item.status)">{{ item.transaction_status || item.status || 'unknown' }}</span><small v-if="item.deleted_at" class="mt-2 block text-red-200">Deleted</small></td>
              <td data-label="Amount" class="font-semibold text-white">{{ money(item.gross_amount, item.currency) }}</td>
              <td data-label="Time"><span>{{ formatDate(item.paid_at) }}</span><small v-if="item.expires_at" class="mt-1 block text-slate-500">Expires: {{ formatDate(item.expires_at) }}</small></td>
              <td data-label="Actions" class="cell-actions"><div class="flex flex-wrap justify-end gap-2"><button v-if="allows(item, 'success')" class="table-button text-emerald-200" @click="openSingle(item, 'success')">Confirm</button><button v-if="allows(item, 'canceled')" class="table-button text-amber-200" @click="openSingle(item, 'canceled')">Cancel</button><button v-if="allows(item, 'delete')" class="table-button text-red-200" @click="openSingle(item, 'delete')">Delete</button><span v-if="!item.allowed_actions?.length" class="text-xs text-slate-500">No actions</span></div></td>
            </tr>
          </tbody>
        </table>
      </div>

      <footer class="mt-5 flex flex-wrap items-center justify-between gap-3 text-sm text-slate-400">
        <label class="flex items-center gap-2">Rows <select v-model.number="limit" class="rounded-full border border-white/15 bg-slate-900 px-3 py-2 text-white" @change="changeLimit"><option :value="20">20</option><option :value="50">50</option><option :value="100">100</option></select></label>
        <div class="flex items-center gap-3"><button class="table-button" :disabled="offset === 0 || loading" @click="previousPage">Previous</button><span>{{ pageStart }}–{{ pageEnd }} of {{ meta.total }}</span><button class="table-button" :disabled="offset + limit >= meta.total || loading" @click="nextPage">Next</button></div>
      </footer>
    </section>

    <Teleport to="body"><div v-if="dialog.open" class="backdrop" @click.self="closeDialog"><form class="modal max-w-xl" @submit.prevent="submitAction"><header><div><p class="text-xs uppercase tracking-[.24em] text-amber-200">Transaction action</p><h2>{{ dialog.action === 'delete' && dialog.step === 2 ? 'Final delete confirmation' : actionTitle }}</h2></div><button type="button" @click="closeDialog">×</button></header><main><template v-if="dialog.action !== 'delete' || dialog.step === 1"><p class="rounded-2xl border border-amber-300/20 bg-amber-300/5 p-4 text-sm text-amber-100">This will {{ dialog.action }} {{ dialog.ids.length }} transaction(s). The backend will validate the action atomically.</p><label class="field mt-5"><span>Verification notes</span><textarea v-model.trim="dialog.notes" rows="4" maxlength="1000" required placeholder="Explain the verification or reason for this action" /></label><label v-if="dialog.action === 'success'" class="field mt-4"><span>Paid at <small>(optional)</small></span><input v-model="dialog.paid_at" type="datetime-local"></label></template><template v-else><div class="rounded-2xl border border-red-300/35 bg-red-950/40 p-5 text-sm leading-6 text-red-100"><strong class="block text-base">Confirm deletion again</strong><p class="mt-2">You are about to soft-delete {{ dialog.ids.length }} transaction(s). They will disappear from the default transaction list.</p><p class="mt-2 text-red-200">Reason: {{ dialog.notes }}</p></div><label class="mt-5 flex items-start gap-3 rounded-2xl border border-white/10 p-4 text-sm text-slate-300"><input v-model="dialog.finalAcknowledged" type="checkbox" class="mt-1 accent-red-300"><span>I understand and confirm this deletion.</span></label></template></main><footer><button type="button" class="action-secondary" :disabled="saving" @click="dialog.action === 'delete' && dialog.step === 2 ? returnToFirstConfirmation() : closeDialog()">Back</button><button class="action-primary" :disabled="saving || !dialog.notes || (dialog.action === 'delete' && dialog.step === 2 && !dialog.finalAcknowledged)">{{ saving ? 'Processing...' : dialog.action === 'delete' && dialog.step === 1 ? 'Continue to final confirmation' : dialog.action === 'delete' ? 'Yes, delete transaction' : actionTitle }}</button></footer></form></div></Teleport>
  </section>
</template>

<script setup lang="ts">
import { useAdminReport, type PaymentReportResponse, type PaymentReportTransaction } from '~/composables/useAdminReport';

definePageMeta({ middleware: ['auth', 'admin'] });
useSeoMeta({ title: 'Transaction Management | IWBIF 2026' });

type TransactionAction = 'success' | 'canceled' | 'delete';
const { getAdminTransactions, updateTransactionStatus, deleteTransaction, bulkTransactionAction } = useAdminReport();
const statuses = ['created', 'pending', 'success', 'failed', 'expired', 'refunded', 'canceled'];
const emptySummary = (): PaymentReportResponse => ({ summary: { total_transactions: 0, successful_transactions: 0, pending_transactions: 0, failed_transactions: 0, expired_transactions: 0, gross_revenue: 0, pending_amount: 0, currency: 'IDR' }, by_status: [], by_channel: [], by_package: [], daily_revenue: [], transactions: [] });
const report = ref<PaymentReportResponse>(emptySummary());
const meta = reactive({ total: 0, limit: 20, offset: 0 });
const filters = reactive({ status: '', provider: '', channel_code: '', event_id: '', date_from: '', date_to: '', include_deleted: false });
const limit = ref(20);
const offset = ref(0);
const loading = ref(false);
const saving = ref(false);
const feedback = ref('');
const feedbackTone = ref<'success' | 'error'>('success');
const selectedIds = ref<string[]>([]);
const dialog = reactive<{ open: boolean; action: TransactionAction; ids: string[]; notes: string; paid_at: string; step: 1 | 2; finalAcknowledged: boolean }>({ open: false, action: 'success', ids: [], notes: '', paid_at: '', step: 1, finalAcknowledged: false });
const transactions = computed(() => report.value.transactions || []);
const paymentId = (item: PaymentReportTransaction): string => item.payment_id || item.id || '';
const allVisibleSelectableIds = computed(() => transactions.value.filter(item => item.allowed_actions?.length).map(paymentId));
const allVisibleSelected = computed(() => allVisibleSelectableIds.value.length > 0 && allVisibleSelectableIds.value.every(id => selectedIds.value.includes(id)));
const pageStart = computed(() => meta.total ? offset.value + 1 : 0);
const pageEnd = computed(() => Math.min(offset.value + transactions.value.length, meta.total));
const summaryCards = computed(() => [{ label: 'Total', value: report.value.summary.total_transactions }, { label: 'Successful', value: report.value.summary.successful_transactions }, { label: 'Pending', value: report.value.summary.pending_transactions }, { label: 'Expired', value: report.value.summary.expired_transactions }, { label: 'Pending amount', value: money(report.value.summary.pending_amount, report.value.summary.currency) }]);
const actionTitle = computed(() => dialog.action === 'success' ? 'Confirm payment' : dialog.action === 'canceled' ? 'Cancel transaction' : 'Delete transaction');

const errorText = (error: unknown) => { const value = error as { data?: { message?: string; errors?: Array<{ message: string }> }; message?: string }; return value.data?.errors?.[0]?.message || value.data?.message || value.message || 'The request could not be completed.'; };
const loadTransactions = async () => { loading.value = true; feedback.value = ''; try { const response = await getAdminTransactions({ ...filters, limit: limit.value, offset: offset.value }); report.value = response.data || emptySummary(); meta.total = response.meta?.total ?? report.value.transactions.length; meta.limit = response.meta?.limit ?? limit.value; meta.offset = response.meta?.offset ?? offset.value; selectedIds.value = []; } catch (error) { feedbackTone.value = 'error'; feedback.value = errorText(error); } finally { loading.value = false; } };
const applyFilters = () => { offset.value = 0; loadTransactions(); };
const resetFilters = () => { Object.assign(filters, { status: '', provider: '', channel_code: '', event_id: '', date_from: '', date_to: '', include_deleted: false }); applyFilters(); };
const changeLimit = () => { offset.value = 0; loadTransactions(); };
const previousPage = () => { offset.value = Math.max(0, offset.value - limit.value); loadTransactions(); };
const nextPage = () => { offset.value += limit.value; loadTransactions(); };
const toggleOne = (id: string) => { selectedIds.value = selectedIds.value.includes(id) ? selectedIds.value.filter(value => value !== id) : [...selectedIds.value, id]; };
const toggleAll = () => { selectedIds.value = allVisibleSelected.value ? [] : [...allVisibleSelectableIds.value]; };
const allows = (item: PaymentReportTransaction, action: TransactionAction) => item.allowed_actions?.includes(action) ?? false;
const canBulk = (action: TransactionAction) => selectedIds.value.length > 0 && selectedIds.value.every(id => { const item = transactions.value.find(row => paymentId(row) === id); return Boolean(item && allows(item, action)); });
const openSingle = (item: PaymentReportTransaction, action: TransactionAction) => openDialog([paymentId(item)], action);
const openBulk = (action: TransactionAction) => { if (canBulk(action)) openDialog([...selectedIds.value], action); };
const openDialog = (ids: string[], action: TransactionAction) => Object.assign(dialog, { open: true, ids, action, notes: '', paid_at: '', step: 1, finalAcknowledged: false });
const closeDialog = () => { if (!saving.value) dialog.open = false; };
const returnToFirstConfirmation = () => { dialog.step = 1; dialog.finalAcknowledged = false; };
const submitAction = async () => { if (saving.value || !dialog.notes) return; if (dialog.action === 'delete' && dialog.step === 1) { dialog.step = 2; return; } if (dialog.action === 'delete' && !dialog.finalAcknowledged) return; saving.value = true; feedback.value = ''; try { const paidAt = dialog.paid_at ? new Date(dialog.paid_at).toISOString() : null; if (dialog.ids.length > 1) await bulkTransactionAction({ payment_ids: dialog.ids, action: dialog.action, notes: dialog.notes, ...(dialog.action === 'success' ? { paid_at: paidAt } : {}) }); else if (dialog.action === 'delete') await deleteTransaction(dialog.ids[0]!); else await updateTransactionStatus(dialog.ids[0]!, { status: dialog.action, notes: dialog.notes, ...(dialog.action === 'success' ? { paid_at: paidAt } : {}) }); feedbackTone.value = 'success'; feedback.value = `${dialog.ids.length} transaction(s) processed successfully.`; dialog.open = false; await loadTransactions(); } catch (error) { feedbackTone.value = 'error'; feedback.value = errorText(error); } finally { saving.value = false; } };
const money = (amount = 0, currency = 'IDR') => new Intl.NumberFormat('id-ID', { style: 'currency', currency: currency || 'IDR', maximumFractionDigits: 0 }).format(amount || 0);
const formatDate = (value?: string | null) => value ? new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value)) : '—';
const statusClass = (value?: string) => value === 'success' ? 'status-live' : ['failed', 'expired', 'refunded', 'canceled'].includes(value || '') ? 'status-off' : 'status-draft';

await loadTransactions();
</script>

<style scoped>
.field { display: block; font-size: .875rem; color: #cbd5e1; }
.field span { display: block; margin-bottom: .5rem; }
.field small { color: #64748b; }
.field input,.field select,.field textarea { width: 100%; border: 1px solid rgba(255,255,255,.12); border-radius: 1rem; background: rgba(2,6,23,.82); padding: .75rem 1rem; color: white; outline: none; }
.field input:focus,.field select:focus,.field textarea:focus { border-color: rgba(252,211,77,.55); }
button:disabled { cursor: not-allowed; opacity: .4; }
</style>
