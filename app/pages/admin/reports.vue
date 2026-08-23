<template>
  <section class="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
    <div
      v-if="manualReviewToast"
      class="manual-review-toast fixed right-4 top-4 z-50 max-w-[20rem] rounded-2xl border p-3 text-sm shadow-lg"
      :class="manualReviewToastClass"
      role="status"
      aria-live="polite"
      @click="closeManualReviewToast"
    >
      <div class="flex items-start justify-between gap-3">
        <p>{{ manualReviewToast }}</p>
        <button class="font-bold" type="button">x</button>
      </div>
    </div>

    <div class="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p class="text-xs uppercase tracking-[0.28em] text-amber-200">Organizer Panel</p>
        <h1 class="mt-3 text-3xl font-black sm:text-4xl">Ticket sales & revenue report</h1>
        <p class="mt-2 text-xs text-slate-400">Last updated: {{ lastUpdatedLabel }}</p>
      </div>
      <div class="rounded-full border border-amber-300/30 bg-amber-300/10 px-4 py-2 text-sm font-medium text-amber-100">
        <div class="inline-flex items-center">
          <span>Role: {{ authStore.userRole || 'unknown' }}</span>
          <button
            type="button"
            class="user-login-badge ml-3 inline-flex h-7 w-7 items-center justify-center rounded-full border border-amber-100/40 relative"
            :title="loggedInUserInfo"
            @click="showLoggedInUserInfo = !showLoggedInUserInfo"
          >
            <span v-if="authStore.isAuthenticated" class="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-emerald-400 ring-2 ring-slate-900" title="Session active"></span>
            <span class="inline-flex h-5 w-5 items-center justify-center rounded-full bg-amber-300/20 text-xs text-amber-100 font-bold">
              {{ loggedInUserInitial }}
            </span>
          </button>
        </div>
        <div
          ref="loggedInUserPopoverRef"
          v-if="showLoggedInUserInfo"
          class="mt-2 rounded-lg border border-amber-200/40 bg-slate-900/90 px-3 py-2 text-xs text-amber-100"
        >
          <p class="font-semibold text-amber-50">Sesi login</p>
          <p class="mt-1">{{ loggedInUserName }}</p>
          <p class="text-amber-200/90">{{ loggedInUserEmail }}</p>
          <button
            type="button"
            class="mt-2 rounded-full border border-amber-200/40 px-2 py-1 text-[11px] font-bold"
            @click.stop="copyLoggedInUserInfo"
          >
            Salin nama & email
          </button>
        </div>
      </div>
    </div>

      <div class="report-filters mb-6 grid gap-3 rounded-3xl border border-amber-300/20 bg-white/5 p-4 sm:grid-cols-[1fr_1fr_1fr_auto]">
        <label class="grid gap-2 text-sm">
          <span class="text-xs uppercase tracking-[0.2em] text-slate-400">Event</span>
          <select v-model="eventFilter" class="rounded-full border border-white/15 bg-slate-900 px-4 py-3 text-sm text-white outline-none" :disabled="eventsLoading">
            <option value="">Semua event</option>
            <option v-for="event in events" :key="event.id" :value="event.id">
              {{ event.name }}
            </option>
          </select>
        </label>
        <label class="grid gap-2 text-sm">
          <span class="text-xs uppercase tracking-[0.2em] text-slate-400">Tanggal mulai</span>
          <input v-model="dateFrom" type="date" class="rounded-full border border-white/15 bg-slate-900 px-4 py-3 text-sm text-white outline-none" />
        </label>
      <label class="grid gap-2 text-sm">
        <span class="text-xs uppercase tracking-[0.2em] text-slate-400">Tanggal selesai</span>
        <input v-model="dateTo" type="date" class="rounded-full border border-white/15 bg-slate-900 px-4 py-3 text-sm text-white outline-none" />
      </label>
      <label class="grid gap-2 text-sm">
        <span class="text-xs uppercase tracking-[0.2em] text-slate-400">Status</span>
        <select v-model="statusFilter" class="rounded-full border border-white/15 bg-slate-900 px-4 py-3 text-sm text-white outline-none">
          <option value="">Semua status</option>
          <option value="created">created</option>
          <option value="pending">pending</option>
          <option value="success">success</option>
          <option value="failed">failed</option>
          <option value="expired">expired</option>
        </select>
      </label>
      <label class="grid gap-2 text-sm">
        <span class="text-xs uppercase tracking-[0.2em] text-slate-400">Channel</span>
        <select v-model="channelFilter" class="rounded-full border border-white/15 bg-slate-900 px-4 py-3 text-sm text-white outline-none">
          <option value="">Semua channel</option>
          <option v-for="option in channelOptions" :key="option" :value="option">
            {{ option }}
          </option>
        </select>
      </label>
      <label class="grid gap-2 text-sm">
        <span class="text-xs uppercase tracking-[0.2em] text-slate-400">Package ID</span>
        <select v-model="packageIdFilter" class="rounded-full border border-white/15 bg-slate-900 px-4 py-3 text-sm text-white outline-none" :disabled="!eventFilter || packageLoading">
          <option value="" :disabled="packageLoading">{{ packageLoading ? 'Memuat package...' : 'Semua package' }}</option>
          <option v-for="option in packageOptions" :key="option.id" :value="option.id">
            {{ option.name }}
          </option>
        </select>
      </label>
      <div class="flex items-end gap-2">
        <button :disabled="loading || !hasActiveFilters" class="rounded-full border border-white/20 px-4 py-3 text-sm font-bold text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50" @click="resetFilters">
          Reset
        </button>
      </div>
      <div class="sm:col-span-6 flex flex-wrap gap-2">
        <button class="rounded-full border border-white/20 px-3 py-2 text-xs font-bold text-white transition hover:bg-white/10" @click="setDatePreset('today')">
          Hari ini
        </button>
        <button class="rounded-full border border-white/20 px-3 py-2 text-xs font-bold text-white transition hover:bg-white/10" @click="setDatePreset('last7')">
          7 hari
        </button>
        <button class="rounded-full border border-white/20 px-3 py-2 text-xs font-bold text-white transition hover:bg-white/10" @click="setDatePreset('last30')">
          30 hari
        </button>
        <button class="rounded-full border border-white/20 px-3 py-2 text-xs font-bold text-white transition hover:bg-white/10" @click="setDatePreset('month')">
          Bulan ini
        </button>
      </div>
      <p class="text-xs text-slate-400 sm:col-span-6">Filter diterapkan otomatis setelah kamu selesai mengubah pilihan (dengan delay 350ms).</p>
    </div>

    <div v-if="pending" class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <div v-for="n in 4" :key="n" class="h-32 animate-pulse rounded-3xl bg-white/5" />
    </div>

    <div v-else-if="errorMessage" class="rounded-3xl border border-rose-400/40 bg-rose-500/10 p-5 text-sm text-rose-100">
      {{ errorMessage }}
    </div>

    <div v-else class="space-y-6">
      <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <article v-for="metric in summaryCards" :key="metric.label" class="glass-card rounded-3xl p-5">
          <p class="text-[10px] uppercase tracking-[0.25em] text-slate-400">{{ metric.label }}</p>
          <p class="mt-3 text-2xl font-black text-white">{{ metric.value }}</p>
          <p class="mt-2 text-sm text-slate-400">{{ metric.note }}</p>
        </article>
      </div>

      <div class="grid gap-6 xl:grid-cols-2">
        <article class="glass-card rounded-3xl p-5">
          <h2 class="text-lg font-bold">Revenue by status</h2>
          <ul class="mt-4 space-y-3 text-sm text-slate-300">
            <li v-for="item in byStatus" :key="item.label" class="flex items-center justify-between gap-3 border-b border-white/5 pb-2 last:border-0 last:pb-0">
              <span>{{ item.label }}</span>
              <strong class="text-white">{{ formatCurrency(item.amount) }}</strong>
            </li>
          </ul>
        </article>

        <article class="glass-card rounded-3xl p-5">
          <h2 class="text-lg font-bold">Daily revenue</h2>
          <div class="mt-4 flex min-h-[14rem] items-end gap-2 overflow-x-auto">
            <div v-for="item in dailyRevenue" :key="item.date" class="daily-chart-column">
              <div
                class="daily-chart-bar"
                :style="{ height: `${Math.max(6, (item.amount / dailyRevenueMax) * 100)}%` }"
                :title="`${item.date}: ${formatCurrency(item.amount)}`"
              />
              <span class="daily-chart-label">{{ formatDateShort(item.date) }}</span>
              <span class="mt-1 text-[10px] leading-tight text-slate-400">{{ formatCurrency(item.amount) }}</span>
            </div>
          </div>
        </article>
      </div>

      <article class="glass-card rounded-3xl p-5">
        <div v-if="manualReviewNotifications.length" class="mb-4 rounded-2xl border border-amber-300/35 bg-amber-300/10 p-3 text-sm text-amber-100">
          <p class="font-bold">Perlu verifikasi manual: {{ manualReviewNotifications.length }} transaksi</p>
          <p class="mt-1 text-xs text-amber-200">
            Deteksi kemungkinan sukses di gateway tapi status backend belum sinkron.
          </p>
          <ul class="mt-2 space-y-1 text-xs">
            <li v-for="item in manualReviewNotifications" :key="`${item.payment_id || item.id}-alert`" class="truncate">
              {{ item.order_number || item.id }} ({{ item.provider_order_id || 'no reference' }}) — backend: {{ item.transaction_status || item.status || 'N/A' }}, gateway: {{ item.order_status || 'unknown' }}
            </li>
          </ul>
          <button class="mt-3 rounded-full border border-rose-300/35 px-3 py-2 text-xs font-bold text-rose-100" :disabled="!manualReviewTransactions.length" @click="copyManualReviewReferences">
            Salin daftar referensi ({{ manualReviewTransactions.length }})
          </button>
        </div>
        <div class="mb-4 flex items-center justify-between gap-3">
          <h2 class="text-lg font-bold">Latest transactions</h2>
          <a :href="csvUrl" :download="csvFileName" class="rounded-full border border-cyan-300/30 bg-cyan-300/10 px-3 py-2 text-xs font-bold uppercase tracking-[0.18em] text-cyan-100">Download CSV</a>
        </div>
        <div class="mb-4">
          <label class="grid gap-2 text-sm">
            <span class="text-xs uppercase tracking-[0.2em] text-slate-400">Cari transaksi</span>
            <input v-model="searchTerm" type="text" placeholder="Cari order, referensi gateway, participant, package, channel, status" class="rounded-full border border-white/15 bg-slate-900 px-4 py-2 text-sm text-white outline-none" />
          </label>
        </div>
        <div v-if="isMidtransReport" class="mb-3">
          <button type="button" class="rounded-full border border-rose-300/35 bg-rose-300/10 px-3 py-2 text-xs font-bold text-rose-100" @click="showManualReviewOnly = !showManualReviewOnly">
            {{ showManualReviewOnly ? 'Tampilkan semua transaksi' : 'Tampilkan hanya perlu verifikasi' }}
          </button>
        </div>
        <div class="mb-2 flex flex-wrap gap-2 text-xs">
          <span class="inline-flex rounded-full border border-emerald-300/30 px-2 py-1 text-emerald-200">Success: Lunas</span>
          <span class="inline-flex rounded-full border border-amber-300/30 px-2 py-1 text-amber-200">Pending/Created</span>
          <span class="inline-flex rounded-full border border-rose-300/30 px-2 py-1 text-rose-200">Failed/Expired</span>
        </div>
        <div class="flex items-center justify-between text-sm text-slate-400 mb-3">
          <span>{{ paginatedTransactions.length }} dari {{ filteredTransactions.length }} transaksi</span>
          <label class="flex items-center gap-2">
            <span class="text-xs uppercase tracking-[0.16em] text-slate-500">Per halaman</span>
            <select v-model.number="itemsPerPage" class="rounded-full border border-white/15 bg-slate-900 px-3 py-2 text-sm text-white outline-none">
              <option :value="10">10</option>
              <option :value="20">20</option>
              <option :value="50">50</option>
            </select>
          </label>
        </div>
        <div class="report-table-shell overflow-x-auto">
          <table class="min-w-full text-left text-sm text-slate-300">
            <thead>
              <tr class="border-b border-white/10 text-xs uppercase tracking-[0.18em] text-slate-400">
                <th class="py-3 pr-4">Order</th>
                <th v-if="isMidtransReport" class="py-3 pr-4">Midtrans references</th>
                <th class="py-3 pr-4">Participant</th>
                <th class="py-3 pr-4">Package</th>
                <th class="py-3 pr-4">Channel</th>
                <th class="py-3 pr-4">Status</th>
                <th class="py-3 pr-4 text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
            <tr v-for="item in paginatedTransactions" :key="item.payment_id || item.id" class="border-b border-white/5 last:border-0">
                <td class="py-3 pr-4 text-white" data-label="Order">{{ item.order_number || item.id }}</td>
                <td v-if="isMidtransReport" class="py-3 pr-4" data-label="Midtrans references">
                  <div class="grid min-w-56 gap-2 text-xs">
                    <button v-if="item.provider_order_id" type="button" class="reference-button" title="Salin Midtrans order ID" @click="copyReference(item.provider_order_id)">
                      <span>Order ID</span><code>{{ item.provider_order_id }}</code>
                    </button>
                    <button v-if="item.provider_transaction_id" type="button" class="reference-button" title="Salin Midtrans transaction ID" @click="copyReference(item.provider_transaction_id)">
                      <span>Transaction ID</span><code>{{ item.provider_transaction_id }}</code>
                    </button>
                    <span v-if="!item.provider_order_id && !item.provider_transaction_id" class="text-slate-500">N/A</span>
                  </div>
                </td>
                <td class="py-3 pr-4" data-label="Participant">{{ item.participant_name || 'N/A' }}</td>
                <td class="py-3 pr-4" data-label="Package">{{ item.package_name || 'N/A' }}</td>
                <td class="py-3 pr-4" data-label="Channel">{{ item.channel_code || item.provider || 'N/A' }}</td>
                <td class="py-3 pr-4" data-label="Status">
                  <span :class="transactionStatusClass(item)" class="inline-flex rounded-full px-2 py-1 text-xs font-bold">
                    {{ transactionStatusLabel(item) }}
                  </span>
                  <span v-if="requiresManualReview(item)" class="ml-2 inline-flex rounded-full bg-rose-400/25 px-2 py-1 text-[10px] font-bold text-rose-100">
                    Perlu cek
                  </span>
                </td>
                <td class="py-3 pr-4 text-right text-white" data-label="Amount">{{ formatCurrency(item.gross_amount || 0) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div v-if="totalPages > 1" class="mt-4 flex items-center justify-between">
          <button :disabled="currentPage <= 1" class="rounded-full border border-white/20 px-3 py-2 text-xs font-bold text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50" @click="currentPage = 1">
            Awal
          </button>
          <div class="flex items-center gap-2">
            <button :disabled="currentPage <= 1" class="rounded-full border border-white/20 px-3 py-2 text-xs font-bold text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50" @click="currentPage--">
              Prev
            </button>
            <span class="text-xs text-slate-300">Page {{ currentPage }} / {{ totalPages }}</span>
            <button :disabled="currentPage >= totalPages" class="rounded-full border border-white/20 px-3 py-2 text-xs font-bold text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50" @click="currentPage++">
              Next
            </button>
          </div>
          <button :disabled="currentPage >= totalPages" class="rounded-full border border-white/20 px-3 py-2 text-xs font-bold text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50" @click="currentPage = totalPages">
            Akhir
          </button>
        </div>
      </article>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useAdminReport, type PaymentReportResponse } from '~/composables/useAdminReport';
import { useEvent, type DelegatePackageItem, type EventItem } from '~/composables/useEvent';
const route = useRoute();
const router = useRouter();

definePageMeta({ middleware: ['auth', 'admin'] });
useSeoMeta({ title: 'Sales Report | IWBIF 2026' });

const authStore = useAuthStore();
const { getReport, isMidtransReport } = useAdminReport();
const { getEvents, getEventDelegatePackages } = useEvent();
const dateFrom = ref('');
const dateTo = ref('');
const statusFilter = ref('');
const channelFilter = ref('');
const packageIdFilter = ref('');
const eventFilter = ref('');
const loading = ref(false);
const searchTerm = ref('');
const itemsPerPage = ref(20);
const currentPage = ref(1);
const eventsLoading = ref(false);
const packageLoading = ref(false);
const autoReloadTimer = ref<ReturnType<typeof setTimeout> | null>(null);
const events = ref<Array<EventItem>>([]);
const packageOptions = ref<Array<{ id: string; name: string }>>([]);
const routeReady = ref(false);
const showManualReviewOnly = ref(false);
const manualReviewToast = ref('');
const manualReviewToastClass = ref('border-emerald-300/35 bg-emerald-300/10 text-emerald-100');
let manualReviewToastTimer: ReturnType<typeof setTimeout> | null = null;
const showLoggedInUserInfo = ref(false);
const loggedInUserName = computed(() => authStore.user?.full_name || 'User');
const loggedInUserEmail = computed(() => authStore.user?.email || 'Tidak ada email');
const loggedInUserPopoverRef = ref<HTMLElement | null>(null);
const loggedInUserInitial = computed(() => {
  const source = authStore.user?.full_name || authStore.user?.email || 'U';
  return source.trim().charAt(0).toUpperCase() || 'U';
});
const loggedInUserInfo = computed(() => `${loggedInUserName.value} (${loggedInUserEmail.value})`);
const copyLoggedInUserInfo = async () => {
  if (!import.meta.client) return;
  const payload = `Name: ${loggedInUserName.value}\nEmail: ${loggedInUserEmail.value}`;
  await navigator.clipboard.writeText(payload);
};
const closeLoggedInUserPopover = (event: MouseEvent) => {
  if (!showLoggedInUserInfo.value) return;
  const target = event.target as Element | null;
  if (!target) return;
  const popover = loggedInUserPopoverRef.value;
  if (popover && (target === popover || popover.contains(target))) return;
  if (target.closest('.user-login-badge')) return;
  showLoggedInUserInfo.value = false;
};
const manualReviewScope = computed(() => {
  const userKey = authStore.user?.id || authStore.user?.email || 'unknown';
  return `user:${userKey}`;
});
const manualReviewStateKey = computed(() => {
  if (!import.meta.client) return 'admin-reports-manual-review';
  const params = buildReportParams();
  return JSON.stringify({
    scope: manualReviewScope.value,
    event_id: params.event_id || '',
    date_from: params.date_from || '',
    date_to: params.date_to || '',
    status: params.status || '',
    channel_code: params.channel_code || '',
    package_id: params.package_id || ''
  });
});

const getStoredManualReviewCount = (key: string) => {
  if (!import.meta.client) return -1;
  return Number(localStorage.getItem(key) || '-1');
};

const setStoredManualReviewCount = (key: string, value: number) => {
  if (!import.meta.client) return;
  localStorage.setItem(key, String(value));
};
const closeManualReviewToast = () => {
  manualReviewToast.value = '';
  if (manualReviewToastTimer) {
    clearTimeout(manualReviewToastTimer);
    manualReviewToastTimer = null;
  }
};

const errorMessage = ref('');
const defaultReport: PaymentReportResponse = {
  summary: {
    total_transactions: 0,
    successful_transactions: 0,
    pending_transactions: 0,
    failed_transactions: 0,
    expired_transactions: 0,
    gross_revenue: 0,
    pending_amount: 0,
    currency: 'IDR'
  },
  by_status: [],
  by_channel: [],
  by_package: [],
  daily_revenue: [],
  transactions: []
};

const report = ref<PaymentReportResponse>(defaultReport);
const pending = computed(() => loading.value);
const lastUpdated = ref<Date | null>(null);

const formatDateShort = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(date);
};

const buildReportParams = () => {
  const params: Record<string, string | undefined> = {};

  if (dateFrom.value) {
    params.date_from = `${dateFrom.value}T00:00:00`;
  }

  if (dateTo.value) {
    params.date_to = `${dateTo.value}T23:59:59`;
  }

  if (statusFilter.value) {
    params.status = statusFilter.value;
  }

  if (channelFilter.value) {
    params.channel_code = channelFilter.value;
  }

  if (eventFilter.value) {
    params.event_id = eventFilter.value;
  }

  if (packageIdFilter.value.trim()) {
    params.package_id = packageIdFilter.value.trim();
  }

  return params;
};

const readFiltersFromQuery = () => {
  const q = route.query;
  const getQueryString = (value: unknown): string => {
    if (Array.isArray(value)) return typeof value[0] === 'string' ? value[0] : '';
    if (typeof value === 'string') return value;
    if (typeof value === 'number' || typeof value === 'boolean') return String(value);
    return '';
  };
  const nextDateFrom = getQueryString(q.date_from).split('T')[0] || '';
  const nextDateTo = getQueryString(q.date_to).split('T')[0] || '';

  eventFilter.value = getQueryString(q.event_id);
  dateFrom.value = nextDateFrom;
  dateTo.value = nextDateTo;
  statusFilter.value = getQueryString(q.status);
  channelFilter.value = getQueryString(q.channel_code);
  packageIdFilter.value = getQueryString(q.package_id);
  searchTerm.value = getQueryString(q.q);

  const perPageValue = getQueryString(q.per_page);
  if (perPageValue && !Number.isNaN(Number(perPageValue))) {
    const nextPerPage = Number(perPageValue);
    if (nextPerPage > 0) itemsPerPage.value = nextPerPage;
  }
};

const buildQueryState = () => ({
  event_id: eventFilter.value || undefined,
  date_from: dateFrom.value || undefined,
  date_to: dateTo.value || undefined,
  status: statusFilter.value || undefined,
  channel_code: channelFilter.value || undefined,
  package_id: packageIdFilter.value || undefined,
  q: searchTerm.value || undefined,
  per_page: String(itemsPerPage.value) || undefined
});

const syncFiltersToUrl = () => {
  if (!routeReady.value) return;
  const nextQuery = Object.fromEntries(
    Object.entries(buildQueryState())
      .filter(([, value]) => Boolean(value))
      .map(([key, value]) => [key, String(value)])
  );
  router.replace({ query: nextQuery });
};

const csvUrl = computed(() => {
  const query = new URLSearchParams();
  const params = buildReportParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value) query.append(key, value);
  });
  const path = isMidtransReport ? '/admin/reports/payments/midtrans.csv' : '/admin/reports/payments.csv';
  return query.toString() ? `${path}?${query.toString()}` : path;
});

const csvFileName = computed(() => {
  const fallbackDate = formatDateOnly(new Date().toISOString());
  const selectedEvent = events.value.find((item) => item.id === eventFilter.value);
  const eventName = (selectedEvent?.name || 'all-events').toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const period = dateFrom.value && dateTo.value ? `-${dateFrom.value}-to-${dateTo.value}` : '';
  return `sales-report-${eventName}${period || `-${fallbackDate}`}.csv`;
});

const loadReport = async () => {
  if (loading.value) return;
  loading.value = true;
  errorMessage.value = '';
  const storagePrefix = 'admin:manual-review-count:';
  const storageKey = `${storagePrefix}${manualReviewStateKey.value}`;
  const previousStoredManualReviewCount = getStoredManualReviewCount(storageKey);
  if (hasDateRangeInvalid.value) {
    errorMessage.value = 'Tanggal mulai tidak boleh lebih besar dari tanggal selesai.';
    loading.value = false;
    return;
  }

  try {
    const response = await getReport(buildReportParams());
    report.value = response.data || defaultReport;
    lastUpdated.value = new Date();
    if (isMidtransReport) {
      const nextManualReviewCount = response.data?.transactions
        ? response.data.transactions.filter(requiresManualReview).length
        : 0;

      if (nextManualReviewCount !== previousStoredManualReviewCount) {
        setStoredManualReviewCount(storageKey, nextManualReviewCount);
      }

      if (nextManualReviewCount > previousStoredManualReviewCount) {
        showManualReviewAlert('Baru ada transaksi yang perlu verifikasi manual (ditandai Perlu cek).');
      } else if (nextManualReviewCount < previousStoredManualReviewCount) {
        showManualReviewAlert('Jumlah transaksi perlu verifikasi manual berkurang setelah sinkronisasi.');
      } else if (nextManualReviewCount > 0) {
        showManualReviewAlert('Masih ada transaksi yang perlu verifikasi manual. Silakan cek indikator Perlu cek.');
      }
    }
    if (currentPage.value !== 1) {
      currentPage.value = 1;
    }
  } catch (error) {
    errorMessage.value = 'Unable to load payment report. Please check your admin access token or backend availability.';
    console.error(error);
  } finally {
    loading.value = false;
  }
};

const resetFilters = () => {
  eventFilter.value = '';
  dateFrom.value = '';
  dateTo.value = '';
  statusFilter.value = '';
  channelFilter.value = '';
  packageIdFilter.value = '';
  searchTerm.value = '';
  packageOptions.value = [];
  if (autoReloadTimer.value) {
    clearTimeout(autoReloadTimer.value);
    autoReloadTimer.value = null;
  }
  scheduleAutoReload();
};

const loadEvents = async () => {
  if (eventsLoading.value) return;
  eventsLoading.value = true;
  try {
    const response = await getEvents(1, 100);
    events.value = response.data || [];
  } finally {
    eventsLoading.value = false;
  }
};

const loadPackagesByEvent = async (clearSelected = true) => {
  packageOptions.value = [];
  if (clearSelected) {
    packageIdFilter.value = '';
  }
  if (!eventFilter.value) return;

  packageLoading.value = true;
  try {
    const response = await getEventDelegatePackages(eventFilter.value);
    const packages = response.data || [];
    packageOptions.value = packages.map((item: DelegatePackageItem) => ({
      id: item.id,
      name: item.name || item.code
    }));
    if (packageIdFilter.value && !packageOptions.value.find((item) => item.id === packageIdFilter.value)) {
      packageIdFilter.value = '';
    }
  } catch {
    packageOptions.value = [];
    packageIdFilter.value = '';
  } finally {
    packageLoading.value = false;
  }
};

const scheduleAutoReload = () => {
  if (!routeReady.value) return;
  if (autoReloadTimer.value) {
    clearTimeout(autoReloadTimer.value);
    autoReloadTimer.value = null;
  }
  autoReloadTimer.value = setTimeout(() => {
    if (!hasDateRangeInvalid.value) {
      loadReport();
    }
  }, 350);
};

const formatDateOnly = (value: string | Date) => {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const subtractDays = (base: Date, days: number) => {
  const result = new Date(base);
  result.setDate(base.getDate() - days);
  return result;
};

const setDatePreset = (type: 'today' | 'last7' | 'last30' | 'month') => {
  const today = new Date();
  const to = formatDateOnly(today);
  const fromDate = new Date(today);

  if (type === 'today') {
    dateFrom.value = to;
    dateTo.value = to;
    return;
  }

  if (type === 'last7') {
    dateFrom.value = formatDateOnly(subtractDays(fromDate, 6));
    dateTo.value = to;
    return;
  }

  if (type === 'last30') {
    dateFrom.value = formatDateOnly(subtractDays(fromDate, 29));
    dateTo.value = to;
    return;
  }

  if (type === 'month') {
    fromDate.setDate(1);
    dateFrom.value = formatDateOnly(fromDate);
    dateTo.value = to;
  }
};

const manualReviewTransactions = computed(() => {
  if (!isMidtransReport) return [];
  return report.value.transactions.filter(requiresManualReview);
});

const summaryCards = computed(() => {
  const cards = [
    { label: 'Total transactions', value: formatNumber(report.value.summary.total_transactions), note: 'All recorded orders' },
    { label: 'Successful', value: formatNumber(report.value.summary.successful_transactions), note: 'Paid & validated' },
    { label: 'Revenue', value: formatCurrency(report.value.summary.gross_revenue), note: report.value.summary.currency },
    { label: 'Pending amount', value: formatCurrency(report.value.summary.pending_amount), note: 'Awaiting verification' }
  ];

  if (isMidtransReport) {
    cards.push({
      label: 'Need manual review',
      value: formatNumber(manualReviewTransactions.value.length),
      note: 'Gateway/backend mismatch'
    });
  }

  return cards;
});

const byStatus = computed(() => report.value.by_status ?? []);
const byChannel = computed(() => report.value.by_channel ?? []);
const channelOptions = computed(() => [...new Set(byChannel.value.map((item) => item.label).filter(Boolean))]);
const dailyRevenue = computed(() => report.value.daily_revenue ?? []);
const dailyRevenueMax = computed(() => Math.max(...dailyRevenue.value.map((item) => item.amount), 1));
const transactions = computed(() => report.value.transactions ?? []);
const filteredTransactions = computed(() => {
  const q = searchTerm.value.trim().toLowerCase();
  if (!q) return transactions.value;

  const filtered = showManualReviewOnly.value ? transactions.value.filter(requiresManualReview) : transactions.value;
  return filtered.filter((item) => {
    const haystack = [
      item.order_number,
      item.id,
      item.payment_id,
      item.provider_order_id,
      item.provider_transaction_id,
      item.participant_name,
      item.customer_email,
      item.package_name,
      item.channel_code,
      item.provider,
      item.transaction_status,
      item.status
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();
    return haystack.includes(q);
  });
});

const totalPages = computed(() => Math.max(1, Math.ceil(filteredTransactions.value.length / itemsPerPage.value)));
const paginatedTransactions = computed(() => {
  const page = Math.max(1, Math.min(currentPage.value, totalPages.value));
  const start = (page - 1) * itemsPerPage.value;
  return filteredTransactions.value.slice(start, start + itemsPerPage.value);
});

watch(totalPages, () => {
  if (currentPage.value > totalPages.value) {
    currentPage.value = totalPages.value;
  }
});

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(Number(value || 0));
};

const formatNumber = (value: number) => {
  return new Intl.NumberFormat('id-ID').format(Number(value || 0));
};

const hasDateRangeInvalid = computed(() => Boolean(dateFrom.value && dateTo.value && dateFrom.value > dateTo.value));
const hasActiveFilters = computed(() => {
  return (
    !!eventFilter.value ||
    !!dateFrom.value ||
    !!dateTo.value ||
    !!statusFilter.value ||
    !!channelFilter.value ||
    !!packageIdFilter.value ||
    !!searchTerm.value
  );
});

const lastUpdatedLabel = computed(() => {
  if (!lastUpdated.value) return 'belum dimuat';
  return new Intl.DateTimeFormat('en-GB', {
    dateStyle: 'medium',
    timeStyle: 'short'
  }).format(lastUpdated.value);
});

const isSuccessfulTransaction = (item: PaymentReportResponse['transactions'][number]) => {
  const paymentStatus = (item.transaction_status || item.status || '').toLowerCase();
  if (!isMidtransReport) return paymentStatus === 'success';
  return paymentStatus === 'success' && (item.order_status || '').toLowerCase() === 'paid';
};

const requiresManualReview = (item: PaymentReportResponse['transactions'][number]) => {
  const paymentStatus = (item.transaction_status || item.status || '').toLowerCase();
  const gatewayStatus = (item.order_status || '').toLowerCase();

  if (!isMidtransReport) return false;
  return (paymentStatus === 'success' && gatewayStatus !== 'paid') || (gatewayStatus === 'paid' && paymentStatus !== 'success');
};

const transactionStatusLabel = (item: PaymentReportResponse['transactions'][number]) => {
  const status = item.transaction_status || item.status || 'N/A';
  if (isMidtransReport && status.toLowerCase() === 'success' && !isSuccessfulTransaction(item)) {
    return `${status} / order ${item.order_status || 'unknown'}`;
  }
  return status;
};

const transactionStatusClass = (item: PaymentReportResponse['transactions'][number]) => {
  const value = (item.transaction_status || item.status || '').toLowerCase();
  if (isSuccessfulTransaction(item)) {
    return 'status-success';
  }
  if (value === 'pending' || value === 'created') {
    return 'status-pending';
  }
  return 'status-danger';
};

const manualReviewNotifications = computed(() => {
  return manualReviewTransactions.value.slice(0, 5);
});

const copyManualReviewReferences = async () => {
  if (!manualReviewTransactions.value.length || !import.meta.client) return;
  const lines = manualReviewTransactions.value.map((item) => {
    const orderId = item.order_number || item.id || '';
    const providerOrderId = item.provider_order_id || '';
    const providerTxnId = item.provider_transaction_id || '';
    return `${orderId}\t${providerOrderId}\t${providerTxnId}`;
  });
  await navigator.clipboard.writeText(lines.join('\n'));
};

const copyReference = async (value: string | null | undefined) => {
  if (!value || !import.meta.client) return;
  await navigator.clipboard.writeText(value);
};

const showManualReviewAlert = (message: string) => {
  if (!import.meta.client) return;
  manualReviewToast.value = message;
  manualReviewToastClass.value = message.includes('berkurang')
    ? 'border-cyan-300/35 bg-cyan-300/10 text-cyan-100'
    : 'border-rose-300/35 bg-rose-300/10 text-rose-100';
  if (manualReviewToastTimer) {
    clearTimeout(manualReviewToastTimer);
  }
  manualReviewToastTimer = setTimeout(() => {
    manualReviewToast.value = '';
  }, 7000);
};

// Run the initial requests only after every helper used by loadReport has been
// initialized. Calling loadReport earlier triggers a temporal-dead-zone error
// in the production bundle (for example hasDateRangeInvalid/manual review).
await loadEvents();
readFiltersFromQuery();
if (eventFilter.value) {
  await loadPackagesByEvent(false);
}
await loadReport();
routeReady.value = true;
syncFiltersToUrl();

watch(eventFilter, async () => {
  currentPage.value = 1;
  await loadPackagesByEvent();
  syncFiltersToUrl();
  scheduleAutoReload();
});

watch([dateFrom, dateTo, statusFilter, channelFilter, packageIdFilter], () => {
  currentPage.value = 1;
  syncFiltersToUrl();
  scheduleAutoReload();
});

watch([searchTerm, itemsPerPage], () => {
  currentPage.value = 1;
  syncFiltersToUrl();
});

watch(currentPage, () => {
  syncFiltersToUrl();
});

onMounted(() => {
  if (import.meta.client) {
    window.addEventListener('click', closeLoggedInUserPopover);
  }
});

onBeforeUnmount(() => {
  if (import.meta.client) {
    window.removeEventListener('click', closeLoggedInUserPopover);
  }
});
</script>

<style scoped>
:global(html) {
  font-family: 'Plus Jakarta Sans', 'Segoe UI', sans-serif;
}

.daily-chart-column {
  align-items: flex-end;
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: flex-end;
  min-width: 58px;
}

.daily-chart-bar {
  background: linear-gradient(180deg, rgba(45, 212, 191, 0.95), rgba(14, 116, 144, 0.9));
  border-radius: 9999px 9999px 0 0;
  min-height: 6px;
  width: 14px;
}

.manual-review-toast {
  backdrop-filter: blur(8px);
}

.daily-chart-label {
  color: rgb(148, 163, 184);
  display: block;
  font-size: 11px;
  margin-top: 0.35rem;
  text-align: center;
}

.status-success {
  background: rgba(16, 185, 129, 0.18);
  color: rgb(134, 239, 172);
}

.status-pending {
  background: rgba(250, 204, 21, 0.2);
  color: rgb(254, 240, 138);
}

.status-danger {
  background: rgba(244, 63, 94, 0.18);
  color: rgb(254, 202, 202);
}

.reference-button {
  display: grid;
  gap: 0.15rem;
  text-align: left;
}

.reference-button span {
  color: rgb(148, 163, 184);
}

.reference-button code {
  color: rgb(207, 250, 254);
  overflow-wrap: anywhere;
}

.report-table-shell {
  border-radius: 1.5rem;
}

.report-filters {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

@media (max-width: 767px) {
  .report-filters {
    grid-template-columns: 1fr;
    padding: 0.9rem;
  }

  .report-filters button,
  .report-filters select,
  .report-filters input {
    width: 100%;
  }

  .report-filters > div:last-child,
  .report-filters > .sm\:col-span-6 {
    width: 100%;
  }

  .report-table-shell {
    overflow: visible;
  }

  .report-table-shell table,
  .report-table-shell thead,
  .report-table-shell tbody,
  .report-table-shell tr,
  .report-table-shell th,
  .report-table-shell td {
    display: block;
    width: 100%;
    box-sizing: border-box;
  }

  .report-table-shell thead {
    display: none;
  }

  .report-table-shell tbody {
    display: grid;
    gap: 0.75rem;
  }

  .report-table-shell tr {
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 1.25rem;
    background: rgba(15, 23, 42, 0.75);
    padding: 0.9rem;
  }

  .report-table-shell td {
    border: 0;
    padding: 0.3rem 0;
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 0.75rem;
    color: rgb(203 213 225);
    font-size: 0.82rem;
  }

  .report-table-shell td::before {
    content: attr(data-label);
    color: rgb(148 163 184);
    font-size: 0.68rem;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    flex-shrink: 0;
    width: 36%;
  }

  .report-table-shell td:last-child {
    text-align: left;
    justify-content: space-between;
  }

  .report-table-shell td > * {
    flex: 1;
    min-width: 0;
  }

  .daily-chart-column {
    min-width: 44px;
  }
}
</style>

