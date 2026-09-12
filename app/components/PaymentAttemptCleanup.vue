<template>
  <section v-if="eligible.length" class="mt-5 border-t border-white/10 pt-4">
    <h3 class="font-semibold">{{ copy.title }}</h3>
    <p class="mt-1 text-xs text-slate-300">{{ copy.help }}</p>
    <ul class="mt-3 space-y-2">
      <li v-for="attempt in eligible" :key="attempt.id">
        <label class="flex items-center gap-3 rounded-xl bg-slate-950/40 p-3 text-sm">
          <input v-model="selected" type="checkbox" :value="attempt.id" :disabled="busy || (selected.length >= 100 && !selected.includes(attempt.id))" :aria-label="`${copy.select} ${attempt.provider_order_id || attempt.id}`">
          <span class="min-w-0 break-all">{{ attempt.provider.toUpperCase() }} / {{ attempt.provider_order_id || attempt.id }}
            <span class="block text-xs text-slate-400">{{ copy.statuses[attempt.transaction_status] || attempt.transaction_status }} / {{ money(attempt) }}</span>
          </span>
        </label>
      </li>
    </ul>
    <button type="button" class="mt-3 rounded-full border border-red-300/40 px-4 py-2 text-sm text-red-100 disabled:opacity-50" :disabled="busy || !selected.length" @click="removeSelected">
      {{ busy ? copy.deleting : copy.remove }} ({{ selected.length }})
    </button>
    <p v-if="error" role="alert" class="mt-2 text-sm text-red-200">{{ error }}</p>
    <p v-if="done" role="status" class="mt-2 text-sm text-emerald-200">{{ copy.done }}</p>
  </section>
</template>

<script setup lang="ts">
import type { OrderItem, PaymentItem } from '~/composables/usePayment';
import { isOrderFullyPaid } from '~/utils/orderPaymentProgress';
const props = defineProps<{ order: OrderItem; attempts: PaymentItem[] }>();
const emit = defineEmits<{ removed: [ids: string[]] }>();
const { locale } = useI18n();
const { deletePaymentAttempts } = usePayment();
const selected = ref<string[]>([]);
const busy = ref(false);
const error = ref('');
const done = ref(false);
const eligible = computed(() => isOrderFullyPaid(props.order)
  ? props.attempts.filter(attempt => ['created', 'pending', 'failed', 'expired', 'canceled'].includes(attempt.transaction_status)) : []);
watch(eligible, attempts => { selected.value = selected.value.filter(id => attempts.some(attempt => attempt.id === id)); });
const copy = computed(() => locale.value === 'zh-CN' ? {
  title: '清理付款记录', help: '订单已付清。可删除不再需要的付款尝试；成功付款和退款记录将保留。',
  select: '选择付款尝试', remove: '删除所选记录', deleting: '正在删除',
  confirm: '从记录中删除所选的付款尝试？', failed: '无法删除，请刷新后重试。', done: '所选记录已删除。',
  statuses: { created: '已创建', pending: '待确认', failed: '失败', expired: '已过期', canceled: '已取消' } as Record<string, string>
} : {
  title: 'Clean up payment history', help: 'This order is fully paid. Delete attempts you no longer need. Successful payments and refunds remain in your history.',
  select: 'Select payment attempt', remove: 'Delete selected', deleting: 'Deleting',
  confirm: 'Delete the selected payment attempts from your history?', failed: 'Unable to delete. Refresh and try again.', done: 'Selected attempts deleted.',
  statuses: { created: 'Created', pending: 'Awaiting confirmation', failed: 'Failed', expired: 'Expired', canceled: 'Canceled' } as Record<string, string>
});
const money = (attempt: PaymentItem) => new Intl.NumberFormat(locale.value === 'zh-CN' ? 'zh-CN' : 'en-US', { style: 'currency', currency: attempt.currency || 'IDR' }).format(Number(attempt.gross_amount));
const removeSelected = async () => {
  if (busy.value || !selected.value.length || !window.confirm(copy.value.confirm)) return;
  busy.value = true;
  error.value = '';
  done.value = false;
  try {
    const response = await deletePaymentAttempts(props.order.id, selected.value);
    emit('removed', response.data.payment_ids);
    selected.value = selected.value.filter(id => !response.data.payment_ids.includes(id));
    done.value = true;
  } catch {
    error.value = copy.value.failed;
  } finally {
    busy.value = false;
  }
};
</script>
