<template>
  <section class="mx-auto max-w-5xl px-3 py-10 sm:px-6 lg:px-8">
    <NuxtLink to="/dashboard" class="text-sm text-cyan-200 hover:underline">{{ copy.dashboard }}</NuxtLink>
    <div class="mt-5 flex flex-wrap items-center justify-between gap-4">
      <div>
        <h1 class="text-3xl font-black sm:text-4xl">{{ copy.title }}</h1>
        <p class="mt-3 max-w-2xl text-sm leading-7 text-slate-300">{{ copy.intro }}</p>
      </div>
      <button type="button" :disabled="busy" class="rounded-full border border-white/20 px-5 py-3 text-sm font-bold disabled:opacity-50" @click="refresh">{{ busy ? copy.loading : copy.refresh }}</button>
    </div>

    <p v-if="flow.error.value" role="alert" class="mt-6 rounded-2xl border border-red-300/30 bg-red-400/10 p-4 text-red-200">{{ copy.error }}</p>
    <p v-else-if="busy" role="status" class="mt-8 text-slate-300">{{ copy.loading }}</p>
    <template v-else-if="flow.loaded.value && flow.state.value">
      <div class="mt-8 grid gap-5 md:grid-cols-2">
        <article v-for="item in participation" :key="item.type" class="glass-card rounded-3xl p-5 sm:p-6">
          <h2 class="text-2xl font-bold text-cyan-200">{{ item.title }}</h2>
          <dl class="mt-6 space-y-5">
            <div v-for="row in item.rows" :key="row.label" class="flex flex-wrap items-baseline justify-between gap-2 border-b border-white/10 pb-4">
              <dt class="text-sm text-slate-400">{{ row.label }}</dt>
              <dd class="text-sm font-semibold" :class="row.complete ? 'text-emerald-200' : 'text-slate-200'">{{ row.value }}</dd>
            </div>
          </dl>
          <p v-if="item.profilePending" class="mt-4 text-sm leading-6 text-amber-200">{{ copy.profileNote }}</p>
          <NuxtLink v-if="item.action" :to="item.action.to" class="mt-6 inline-flex rounded-full bg-cyan-300 px-5 py-3 text-sm font-bold text-slate-950">{{ item.action.label }}</NuxtLink>
        </article>
      </div>

      <OutstandingPayments />
      <div v-if="orders.length" id="payment-orders" class="mt-8 glass-card rounded-3xl p-5 sm:p-6">
        <h2 class="text-xl font-bold">{{ copy.orders }}</h2>
        <ul class="mt-4 divide-y divide-white/10">
          <li v-for="order in orders" :key="order.id" class="flex flex-wrap items-center justify-between gap-3 py-4">
            <div class="min-w-0">
              <p class="break-all text-sm text-slate-300">{{ copy.order }} {{ order.id }}</p>
              <p class="mt-1 font-semibold">{{ order.status }}</p>
            </div>
            <NuxtLink :to="order.to" class="text-sm font-bold text-cyan-200 hover:underline">{{ copy.paymentDetails }}</NuxtLink>
          </li>
        </ul>
      </div>
    </template>
  </section>
</template>

<script setup lang="ts">
import type { PurchaseType } from '~/composables/useRegistrationFlow';

definePageMeta({ middleware: 'auth' });
const { locale } = useI18n();
const flow = useRegistrationFlow();
const refreshing = ref(true);
const busy = computed(() => refreshing.value || flow.loading.value);
const messages = {
  en: {
    dashboard: 'Back to dashboard', title: 'Your registration status',
    intro: 'Check your Delegate and Exhibitor registration, form completion, and payment progress.',
    loading: 'Checking your status…', refresh: 'Refresh status', error: 'Your latest status could not be loaded. Please refresh to try again.',
    delegate: 'Delegate', exhibitor: 'Exhibitor', registration: 'Registration', profile: 'Required details', payment: 'Payment',
    registered: 'Registered', draft: 'Draft started', notRegistered: 'Not registered', complete: 'Complete', incomplete: 'Incomplete', notStarted: 'Not started', unknown: 'Status unavailable',
    paid: 'Completed', unpaid: 'Not paid', pending: 'Awaiting payment / confirmation', noPackage: 'No package selected',
    choose: 'Choose package', checkout: 'Continue checkout', paymentDetails: 'View payment details', finish: 'Complete registration details', ticket: 'View ticket',
    profileNote: 'Payment is complete. Finish your registration details so your paid order can be linked to your registration.',
    orders: 'Order and payment progress', order: 'Order',
    orderStatuses: { paid: 'Paid', partially_paid: 'Partially paid', pending: 'Awaiting payment', payment_pending: 'Awaiting payment / confirmation', draft: 'Draft', created: 'Created', failed: 'Failed', expired: 'Expired', canceled: 'Canceled', cancelled: 'Canceled', refunded: 'Refunded' }
  },
  zh: {
    dashboard: '返回控制面板', title: '您的注册状态', intro: '查看代表和参展商的注册、资料完整性及付款进度。',
    loading: '正在查询状态…', refresh: '刷新状态', error: '无法加载最新状态，请刷新重试。',
    delegate: '代表', exhibitor: '参展商', registration: '注册', profile: '必填资料', payment: '付款',
    registered: '已注册', draft: '已创建草稿', notRegistered: '尚未注册', complete: '完整', incomplete: '未完成', notStarted: '尚未开始', unknown: '状态暂不可用',
    paid: '已完成', unpaid: '未付款', pending: '等待付款或确认', noPackage: '尚未选择套餐',
    choose: '选择套餐', checkout: '继续结账', paymentDetails: '查看付款详情', finish: '完善注册资料', ticket: '查看门票',
    profileNote: '付款已完成，请完善注册资料，以便关联已付款订单。', orders: '订单与付款进度', order: '订单',
    orderStatuses: { paid: '已付款', partially_paid: '部分付款', pending: '等待付款', payment_pending: '等待付款或确认', draft: '草稿', created: '已创建', failed: '失败', expired: '已过期', canceled: '已取消', cancelled: '已取消', refunded: '已退款' }
  }
};
const copy = computed(() => locale.value === 'zh-CN' ? messages.zh : messages.en);
useSeoMeta({ title: () => `${copy.value.title} | IWBIF 2026` });

const participation = computed(() => (['delegate', 'exhibitor'] as PurchaseType[]).map(type => {
  const c = copy.value;
  const profile = flow.state.value?.[`${type}_status`];
  const tracking = flow.state.value?.purchase_tracking?.[type];
  const status = flow.statusFor(type);
  const paid = ['paid', 'paid_profile_incomplete', 'completed'].includes(status || '');
  const profilePending = status === 'paid_profile_incomplete' || (paid && tracking?.profile_required === true);
  const complete = profile === 'lengkap';
  const matchingOrders = (flow.state.value?.orders || []).filter(order => order.product_type === type || order.items?.some(item =>
    item.type === type || item.product_type === type || (item.product as Record<string, unknown> | undefined)?.product_type === type
  ));
  const pendingOrder = matchingOrders.find(order => ['pending', 'partially_paid', 'payment_pending', 'draft'].includes(order.status?.toLowerCase() || ''));
  const orderId = pendingOrder?.order_id || pendingOrder?.id;
  const paymentTo = orderId ? `/dashboard/payment?order_id=${encodeURIComponent(orderId)}` : orders.value.length ? '#payment-orders' : '/dashboard/payment';
  let action: { to: string; label: string } | null = null;
  if (profilePending || (paid && profile === 'belum_lengkap')) action = { to: `/register/${type}`, label: c.finish };
  else if (status === 'completed' || (paid && complete)) action = { to: '/dashboard/ticket', label: c.ticket };
  else if (status === 'payment_pending') action = { to: paymentTo, label: c.paymentDetails };
  else if (status === 'selected') action = { to: '/dashboard/cart', label: c.checkout };
  else if (status === 'not_selected' && profile === 'belum_terdaftar') action = { to: `/tickets?type=${type}`, label: c.choose };
  return {
    type, title: c[type], profilePending, action,
    rows: [
      { label: c.registration, value: complete ? c.registered : profile === 'belum_lengkap' ? c.draft : profile === 'belum_terdaftar' ? c.notRegistered : c.unknown, complete },
      { label: c.profile, value: complete ? c.complete : profile === 'belum_lengkap' ? c.incomplete : profile === 'belum_terdaftar' ? c.notStarted : c.unknown, complete },
      { label: c.payment, value: paid ? c.paid : status === 'payment_pending' ? c.pending : status === 'selected' ? c.unpaid : status === 'not_selected' ? c.noPackage : c.unknown, complete: paid }
    ]
  };
}));

const orders = computed(() => (flow.state.value?.orders || []).flatMap(order => {
  const id = order.order_id || order.id;
  if (!id) return [];
  const status = order.status?.toLowerCase() || '';
  const labels: Record<string, string> = copy.value.orderStatuses;
  return [{ id, status: labels[status] || copy.value.unknown, to: `/dashboard/payment?order_id=${encodeURIComponent(id)}` }];
}));

const refresh = async () => {
  refreshing.value = true;
  try {
    await flow.loadFlow(true);
  } catch {
    // The shared flow exposes the error; keep the retry action available.
  } finally {
    refreshing.value = false;
  }
};
onMounted(refresh);
</script>
