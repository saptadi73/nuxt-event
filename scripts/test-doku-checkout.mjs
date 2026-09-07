import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import { ref, computed } from 'vue';
import ts from 'typescript';
import { validateDokuCheckoutUrl } from '../app/utils/dokuCheckout.ts';

test('accepts production and sandbox DOKU HTTPS checkout links', () => {
  for (const url of ['https://checkout.doku.com/payment/token', 'https://sandbox.doku.com/checkout/token']) {
    assert.equal(validateDokuCheckoutUrl(url), url);
  }
});

// Execute the payment page's real setup with browser and API boundaries stubbed.
const source = readFileSync(new URL('../app/pages/dashboard/payment.vue', import.meta.url), 'utf8')
  .split('<script setup lang="ts">')[1].split('</script>')[0].replace(/^import .*;\r?\n/gm, '');
function paymentPage(total, { partial = false, pending = null, locale = 'en' } = {}) {
  const calls = [], redirects = [];
  const checkout = { data: { payment_id: 'part-1', order_status: 'pending', payment_url: 'https://checkout.doku.com/payment/part-1' } };
  const api = {
    isDokuProvider: true, paymentProviderLabel: 'DOKU',
    async createCheckout(id) { calls.push(['create', id]); return checkout; },
    async continueOrderPayment(id) { calls.push(['continue', id]); return checkout; },
  };
  const page = runInNewContext(ts.transpileModule(source + '\n;({order,orderId,activePayment,requestPayment,startPayment,confirmSplitPayment,splitModalOpen,paymentPartCount,copy});', {
    compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.None },
  }).outputText, {
    ref, computed, definePageMeta() {}, useI18n: () => ({ locale: ref(locale) }),
    useSeoMeta() {}, useRoute: () => ({ query: {} }), usePayment: () => api,
    useEvent: () => ({}), useRegistrationFlow: () => ({ profilePendingType: ref(null) }),
    onMounted() {}, sessionStorage: { setItem() {} },
    window: { location: { assign(url) { redirects.push(url); } } },
    navigateTo() {}, validateDokuCheckoutUrl,
  });
  page.orderId.value = 'order-1';
  page.order.value = { id: 'order-1', currency: 'IDR', total_amount: total, status: partial ? 'partially_paid' : 'pending' };
  page.activePayment.value = pending;
  return { page, calls, redirects };
}

test('exactly IDR 9m starts hosted DOKU checkout without splitting', async () => {
  const { page, calls, redirects } = paymentPage(9_000_000);
  page.requestPayment();
  await new Promise(setImmediate);
  assert.equal(page.splitModalOpen.value, false);
  assert.deepEqual(calls, [['create', 'order-1']]);
  assert.equal(redirects.length, 1);
});

test('above IDR 9m shows the correct split count before hosted checkout', async () => {
  for (const [total, count] of [[9_000_001, 2], [18_000_000, 2], [20_000_000, 3]]) {
    const { page, calls } = paymentPage(total);
    page.requestPayment();
    assert.equal(page.paymentPartCount.value, count);
    assert.equal(page.splitModalOpen.value, true);
    assert.equal(calls.length, 0);
    page.confirmSplitPayment();
    await new Promise(setImmediate);
    assert.deepEqual(calls, [['create', 'order-1']]);
  }
});

test('partial settlement continues the same order', async () => {
  const { page, calls } = paymentPage(20_000_000, { partial: true });
  await page.startPayment();
  assert.deepEqual(calls, [['continue', 'order-1']]);
});

test('pending direct payment blocks a new hosted payment', async () => {
  const { page, calls, redirects } = paymentPage(20_000_000, { pending: { provider: 'doku', transaction_status: 'pending', payment_type: 'doku_snap_va' } });
  page.requestPayment();
  await page.startPayment();
  assert.equal(calls.length, 0);
  assert.equal(redirects.length, 0);
});

test('pending hosted payment reopens its URL without a new attempt', () => {
  const { page, calls, redirects } = paymentPage(20_000_000, { pending: {
    provider: 'doku', transaction_status: 'pending', checkout_url: 'https://checkout.doku.com/existing',
    expired_at: new Date(Date.now() + 60_000).toISOString(),
  } });
  page.requestPayment();
  assert.equal(calls.length, 0);
  assert.deepEqual(redirects, ['https://checkout.doku.com/existing']);
});

test('Chinese split notice interpolates the current provider', () => {
  const { page } = paymentPage(20_000_000, { locale: 'zh-CN' });
  assert.match(page.copy.value.beforeGateway.replace('{provider}', 'DOKU'), /DOKU/);
  assert.match(page.copy.value.splitLead, /9,000,000/);
});

test('rejects unsafe, misleading, or malformed checkout links', () => {
  for (const url of [
    'http://checkout.doku.com/payment', 'javascript:alert(1)',
    'https://doku.com.evil.example/payment', 'https://evildoku.com/payment',
    'https://doku.com@evil.example/payment', 'https://user:password@checkout.doku.com/payment',
    '/checkout/payment', '',
  ]) {
    assert.throws(() => validateDokuCheckoutUrl(url), undefined, url);
  }
});
