import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import { ref, computed } from 'vue';
import ts from 'typescript';
import { isOrderFullyPaid, normalizeOrderDetail, orderPaymentProgress } from '../app/utils/orderPaymentProgress.ts';

const order = { id: 'order-1', total_amount: 12_600_000, currency: 'IDR', status: 'pending' };
const first = { id: 'attempt-1', order_id: 'order-1', payment_sequence: 1, payment_sequence_count: 2, provider: 'midtrans', gross_amount: 9_000_000, transaction_status: 'expired' };

test('abandoned 12.6m order shows the expired first part and the unstarted second part', () => {
  const detail = normalizeOrderDetail({ order, paid_amount: 0, remaining_amount: 12_600_000, is_payment_complete: false });
  const progress = orderPaymentProgress(detail.order, [first]);
  assert.deepEqual(progress.parts.map(part => [part.amount, part.status]), [[9_000_000, 'expired'], [3_600_000, 'not_started']]);
  assert.equal(progress.paid, 0);
  assert.equal(progress.remaining, 12_600_000);
  assert.equal(progress.complete, false);
});

test('first part settlement leaves 3.6m outstanding and cannot unlock registration', () => {
  const partial = normalizeOrderDetail({ order: { ...order, status: 'partially_paid' }, paid_amount: 9_000_000, remaining_amount: 3_600_000, is_payment_complete: false });
  const progress = orderPaymentProgress(partial.order, [{ ...first, transaction_status: 'success' }]);
  assert.equal(progress.completedParts, 1);
  assert.equal(progress.remaining, 3_600_000);
  assert.equal(isOrderFullyPaid(partial.order), false);
  assert.equal(isOrderFullyPaid({ status: 'paid', remaining_amount: 3_600_000 }), false);
});

test('successful retries of the same sequence count only once', () => {
  const success = { ...first, transaction_status: 'success' };
  const progress = orderPaymentProgress({ ...order, status: 'partially_paid' }, [success, { ...success, id: 'retry' }]);
  assert.equal(progress.paid, 9_000_000);
  assert.equal(progress.completedParts, 1);
});

test('full parent settlement completes both parts', () => {
  const progress = orderPaymentProgress({ ...order, status: 'paid', paid_amount: 12_600_000, remaining_amount: 0, is_payment_complete: true });
  assert.equal(progress.complete, true);
  assert.equal(progress.completedParts, 2);
  assert.equal(progress.remaining, 0);
});

function script(path) {
  const source = readFileSync(new URL(path, import.meta.url), 'utf8');
  return (path.endsWith('.vue') ? source.split('<script setup lang="ts">')[1].split('</script>')[0] : source).replace(/^import .*;\r?\n/gm, '');
}
function evaluate(source, context) {
  return runInNewContext(ts.transpileModule(source, { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.None } }).outputText, { ref, computed, isOrderFullyPaid, ...context });
}
function registrationFlow(snapshot, api = async () => { throw new Error('Unexpected request'); }) {
  const states = new Map();
  const nuxtApp = { $api: api };
  const flow = evaluate(script('../app/composables/useRegistrationFlow.ts').replace(/export /g, '') + '\nuseRegistrationFlow();', {
    useNuxtApp: () => nuxtApp,
    useState: (key, initial) => { if (!states.has(key)) states.set(key, ref(initial())); return states.get(key); },
    useI18n: () => ({ locale: ref('en') }),
    useAuthStore: () => ({ isAuthenticated: true, isAdminOrOrganizer: false, setUser() {}, hydrateUserFromToken() {} })
  });
  flow.primeFlow(snapshot);
  return flow;
}

test('login routes an expired attempt to its existing payment order using the API item.type field', () => {
  const flow = registrationFlow({ selected_types: ['delegate'], purchase_tracking: { delegate: { status: 'payment_pending' } }, orders: [{ ...order, items: [{ type: 'delegate' }], payment: { id: first.id, status: 'expired' } }] });
  assert.equal(flow.ctaTo.value, '/dashboard/payment?order_id=order-1');
});

test('legacy profile-complete tracking cannot override an unpaid parent order', () => {
  const flow = registrationFlow({ selected_types: ['delegate'], purchase_tracking: { delegate: { status: 'completed' } }, orders: [{ ...order, status: 'partially_paid', items: [{ type: 'delegate' }], payment: { status: 'success' } }] });
  assert.equal(flow.primaryStatus.value, 'payment_pending');
  assert.equal(flow.profilePendingType.value, null);
  assert.equal(flow.canEnterBusinessMatching.value, false);
});

test('pending exhibitor payment takes priority over a paid delegate needing a profile', () => {
  const flow = registrationFlow({ selected_types: ['delegate', 'exhibitor'], purchase_tracking: { delegate: { status: 'paid_profile_incomplete' }, exhibitor: { status: 'payment_pending' } }, orders: [{ ...order, id: 'delegate', status: 'paid', items: [{ type: 'delegate' }] }, { ...order, id: 'exhibitor', items: [{ type: 'exhibitor' }] }] });
  assert.equal(flow.primaryType.value, 'exhibitor');
  assert.equal(flow.ctaTo.value, '/dashboard/payment?order_id=exhibitor');
});

test('concurrent flow refreshes await the same fresh snapshot', async () => {
  let release;
  const delay = new Promise(resolve => { release = resolve; });
  let requests = 0;
  const flow = registrationFlow({}, async path => {
    requests++;
    if (path === '/auth/me') { await delay; return { data: { id: 'user-1' } }; }
    return { data: { selected_types: ['delegate'], purchase_tracking: { delegate: { status: 'payment_pending' } } } };
  });
  const a = flow.loadFlow(true);
  const b = flow.loadFlow(true);
  release();
  await Promise.all([a, b]);
  assert.equal(requests, 2);
  assert.equal(flow.primaryStatus.value, 'payment_pending');
});

test('pending Midtrans attempt resumes with Midtrans even when the default provider is DOKU', async () => {
  const calls = [], redirects = [];
  const page = evaluate(script('../app/pages/dashboard/payment.vue') + '\n;({order,orderId,activePayment,onlinePaymentDisabled,startPayment});', {
    definePageMeta() {}, useSeoMeta() {}, useI18n: () => ({ locale: ref('en') }), useRoute: () => ({ query: {} }),
    usePayment: () => ({ paymentProvider: 'doku', async continueOrderPayment(id, provider) { calls.push([id, provider]); return { data: { order_status: 'pending', payment_url: 'https://app.midtrans.com/snap/existing', payment_id: 'part-1' } }; } }),
    useEvent: () => ({}), useRegistrationFlow: () => ({ profilePendingType: ref(null) }),
    onMounted() {}, sessionStorage: { setItem() {} }, navigateTo() {},
    window: { location: { assign(url) { redirects.push(url); } } }
  });
  page.order.value = { ...order, allowed_actions: ['continue_payment'] };
  page.orderId.value = order.id;
  page.activePayment.value = { ...first, transaction_status: 'pending' };
  assert.equal(page.onlinePaymentDisabled.value, false);
  await page.startPayment();
  assert.deepEqual(calls, [['order-1', 'midtrans']]);
  assert.equal(redirects.length, 1);
});

test('payment success cannot redirect to profile when parent status fails to load', async () => {
  const redirects = [];
  const page = evaluate(script('../app/pages/dashboard/payment-status.vue') + '\n;({paymentId,status,checkStatus});', {
    definePageMeta() {}, useSeoMeta() {}, useI18n: () => ({ locale: ref('en') }), useRoute: () => ({ query: {} }),
    usePayment: () => ({ async getPayment() { return { data: { ...first, transaction_status: 'success' } }; }, async getOrderDetail() { throw new Error('Unavailable'); } }),
    useEvent: () => ({}), useRegistrationFlow: () => ({ profilePendingType: ref('delegate') }),
    onMounted() {}, onBeforeUnmount() {}, sessionStorage: { setItem() {} }, navigateTo(to) { redirects.push(to); },
  });
  page.paymentId.value = first.id;
  await page.checkStatus();
  assert.notEqual(page.status.value, 'success');
  assert.deepEqual(redirects, []);
});
