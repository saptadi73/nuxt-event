const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = process.env.FRONTEND_ROOT || path.resolve(__dirname, '..');
const ts = require(require.resolve('typescript', { paths: [root] }));
const vue = require(require.resolve('vue', { paths: [root] }));
let calls = [];
const api = (url, options = {}) => { calls.push({ url, options }); return Promise.resolve({ data: [], meta: { total: 0, pages: 0 } }); };
function load(name, extras = {}) {
  const source = fs.readFileSync(path.join(root, 'app/composables', name + '.ts'), 'utf8');
  const { outputText } = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } });
  const exports = {};
  vm.runInNewContext(outputText, {
    exports, URLSearchParams, useNuxtApp: () => ({ $api: api }), useApi: () => api,
    require: (id) => id === 'vue' ? vue : id.includes('/config/payment') ? { getPaymentProviderConfig: () => ({ isMidtrans: true }) } : { useApi: () => api },
    ...extras,
  });
  return exports;
}
const search = '中文 %_&';
const params = { search, page: 2, size: 10 };
const operations = load('useAdminOperations').useAdminOperations();
const content = load('useAdminContent').useAdminContent();
const report = load('useAdminReport').useAdminReport();
const tests = [
  () => operations.getUsers(2, 10, 'participant', 'active', search),
  () => operations.getAdminAnnouncements('event', params),
  () => operations.getAdminCertificates('event', params),
  () => content.getSessions('main', 'zh-CN', params),
  () => content.getCommittee('event', 'zh-CN', params),
  () => load('useSpeaker').useSpeaker().getSpeakers(2, 10, 'zh-CN', search),
  () => load('useAttendance').useAttendance().getEventAttendanceReport('event', true, params),
  () => load('useEmailNotifications').useEmailNotifications().getDeliveryHistory('event', 100, { ...params, status: 'failed' }),
  () => load('useEvent').useEvent().getEventSessions('main', params),
  () => report.getAdminTransactions(params),
  () => report.getReport(params),
];
async function main() {
  for (const run of tests) {
    calls = [];
    await run();
    assert.equal(calls.length, 1);
    const { url, options } = calls[0];
    const query = Object.fromEntries(new URL(url, 'https://test.invalid').searchParams);
    Object.assign(query, options.query || {});
    assert.equal(query.search, search, url);
    assert.equal(Number(query.page), 2, url);
    assert.equal(Number(query.size), 10, url);
  }
  const timers = new Map();
  let nextTimer = 0;
  const { useTableReload } = load('useTableReload', {
    require: () => ({ ...vue, onBeforeUnmount: () => {} }),
    setTimeout: (fn) => { timers.set(++nextTimer, fn); return nextTimer; },
    clearTimeout: (id) => timers.delete(id),
  });
  const keyword = vue.ref(''), page = vue.ref(3), size = vue.ref(20);
  let loads = 0;
  useTableReload(keyword, page, size, async () => { loads++; });
  keyword.value = 'first';
  assert.equal(page.value, 1);
  await vue.nextTick();
  keyword.value = 'second';
  await vue.nextTick();
  assert.equal(timers.size, 1, 'debounce cancels the previous request');
  for (const callback of timers.values()) callback();
  timers.clear();
  assert.equal(loads, 1);
  page.value = 2;
  await vue.nextTick();
  for (const callback of timers.values()) callback();
  timers.clear();
  assert.equal(loads, 2, 'changing page fetches data');
  size.value = 50;
  assert.equal(page.value, 1, 'changing size resets page');
  console.log(`${tests.length} API query contracts and table reload behavior passed.`);
}
main().catch((error) => { console.error(error); process.exitCode = 1; });
