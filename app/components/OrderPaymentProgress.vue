<template>
  <div class="mt-5 rounded-2xl border border-cyan-300/20 bg-cyan-300/5 p-4">
    <dl class="grid gap-3 text-sm sm:grid-cols-3">
      <div><dt class="text-slate-400">{{ copy.total }}</dt><dd class="mt-1 font-bold">{{ money(progress.total) }}</dd></div>
      <div><dt class="text-slate-400">{{ copy.paid }}</dt><dd class="mt-1 font-bold text-emerald-200">{{ money(progress.paid) }}</dd></div>
      <div><dt class="text-slate-400">{{ copy.remaining }}</dt><dd class="mt-1 font-bold text-amber-200">{{ money(progress.remaining) }}</dd></div>
    </dl>
    <p class="mt-4 text-sm font-semibold">{{ copy.completed.replace('{paid}', String(progress.completedParts)).replace('{count}', String(progress.count)) }}</p>
    <ol class="mt-3 space-y-2">
      <li v-for="part in progress.parts" :key="part.sequence" class="flex flex-wrap justify-between gap-2 rounded-xl bg-slate-950/40 p-3 text-sm">
        <span>{{ copy.part }} {{ part.sequence }} / {{ progress.count }} · {{ money(part.amount) }}</span>
        <strong :class="part.status === 'paid' ? 'text-emerald-200' : 'text-amber-200'">{{ copy.statuses[part.status] || part.status }}</strong>
      </li>
    </ol>
    <p v-if="!progress.complete" class="mt-3 text-xs leading-6 text-slate-300">{{ copy.notice }}</p>
  </div>
</template>

<script setup lang="ts">
import type { OrderItem, PaymentItem } from '~/composables/usePayment';
import { orderPaymentProgress } from '~/utils/orderPaymentProgress';
const props = defineProps<{ order: OrderItem; attempts?: PaymentItem[] }>();
const { locale } = useI18n();
const progress = computed(() => orderPaymentProgress(props.order, props.attempts));
const copy = computed(() => locale.value === 'zh-CN' ? {
  total: '订单总额', paid: '已支付', remaining: '待支付', completed: '已完成 {paid} / {count} 笔付款', part: '付款',
  notice: '订单保持不变。请先完成当前付款，确认后再继续下一笔。全部付清后再完善注册资料。',
  statuses: { paid: '已支付', pending: '待付款或确认', created: '待付款', not_started: '尚未开始', expired: '已过期，请重试', failed: '失败，请重试', canceled: '已取消', cancelled: '已取消' } as Record<string, string>
} : {
  total: 'Order total', paid: 'Paid', remaining: 'Remaining', completed: '{paid} of {count} payments completed', part: 'Payment',
  notice: 'This remains one order. Complete the current payment, then continue the next part after confirmation. Finish all payments before completing your registration details.',
  statuses: { paid: 'Paid', pending: 'Awaiting payment / confirmation', created: 'Awaiting payment', not_started: 'Not started', expired: 'Expired — retry required', failed: 'Failed — retry required', canceled: 'Canceled', cancelled: 'Canceled' } as Record<string, string>
});
const money = (amount: number) => new Intl.NumberFormat(locale.value === 'zh-CN' ? 'zh-CN' : 'en-US', { style: 'currency', currency: props.order.currency || 'IDR', maximumFractionDigits: 0 }).format(amount);
</script>
