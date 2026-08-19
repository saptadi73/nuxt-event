<template>
  <section class="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
    <div class="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p class="text-xs uppercase tracking-[0.28em] text-amber-200">Organizer Panel</p>
        <h1 class="mt-3 text-3xl font-black sm:text-4xl">Ticket sales & revenue report</h1>
        <p class="mt-2 text-xs text-slate-400">Last updated: {{ lastUpdatedLabel }}</p>
      </div>
      <div class="rounded-full border border-amber-300/30 bg-amber-300/10 px-4 py-2 text-sm font-medium text-amber-100">
        Role: {{ authStore.userRole || 'unknown' }}
      </div>
    </div>

      <div class="mb-6 grid gap-3 rounded-3xl border border-amber-300/20 bg-white/5 p-4 sm:grid-cols-[1fr_1fr_1fr_auto]">
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
        <div class="mb-4 flex items-center justify-between gap-3">
          <h2 class="text-lg font-bold">Latest transactions</h2>
          <a :href="csvUrl" :download="csvFileName" class="rounded-full border border-cyan-300/30 bg-cyan-300/10 px-3 py-2 text-xs font-bold uppercase tracking-[0.18em] text-cyan-100">Download CSV</a>
        </div>
        <div class="mb-4">
          <label class="grid gap-2 text-sm">
            <span class="text-xs uppercase tracking-[0.2em] text-slate-400">Cari transaksi</span>
            <input v-model="searchTerm" type="text" placeholder="Cari order, participant, package, channel, status" class="rounded-full border border-white/15 bg-slate-900 px-4 py-2 text-sm text-white outline-none" />
          </label>
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
        <div class="overflow-x-auto">
          <table class="min-w-full text-left text-sm text-slate-300">
            <thead>
              <tr class="border-b border-white/10 text-xs uppercase tracking-[0.18em] text-slate-400">
                <th class="py-3 pr-4">Order</th>
                <th class="py-3 pr-4">Participant</th>
                <th class="py-3 pr-4">Package</th>
                <th class="py-3 pr-4">Channel</th>
                <th class="py-3 pr-4">Status</th>
                <th class="py-3 pr-4 text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
            <tr v-for="item in paginatedTransactions" :key="item.id" class="border-b border-white/5 last:border-0">
                <td class="py-3 pr-4 text-white">{{ item.order_number || item.id }}</td>
                <td class="py-3 pr-4">{{ item.participant_name || 'N/A' }}</td>
                <td class="py-3 pr-4">{{ item.package_name || 'N/A' }}</td>
                <td class="py-3 pr-4">{{ item.channel_code || item.provider || 'N/A' }}</td>
                <td class="py-3 pr-4">
                  <span :class="transactionStatusClass(item.transaction_status || item.status || '')" class="inline-flex rounded-full px-2 py-1 text-xs font-bold">
                    {{ item.transaction_status || item.status || 'N/A' }}
                  </span>
                </td>
                <td class="py-3 pr-4 text-right text-white">{{ formatCurrency(item.gross_amount || 0) }}</td>
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
const { getReport } = useAdminReport();
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
  return query.toString() ? `/admin/reports/payments.csv?${query.toString()}` : '/admin/reports/payments.csv';
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
  if (hasDateRangeInvalid.value) {
    errorMessage.value = 'Tanggal mulai tidak boleh lebih besar dari tanggal selesai.';
    loading.value = false;
    return;
  }

  try {
    const response = await getReport(buildReportParams());
    report.value = response.data || defaultReport;
    lastUpdated.value = new Date();
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

const summaryCards = computed(() => [
  { label: 'Total transactions', value: formatNumber(report.value.summary.total_transactions), note: 'All recorded orders' },
  { label: 'Successful', value: formatNumber(report.value.summary.successful_transactions), note: 'Paid & validated' },
  { label: 'Revenue', value: formatCurrency(report.value.summary.gross_revenue), note: report.value.summary.currency },
  { label: 'Pending amount', value: formatCurrency(report.value.summary.pending_amount), note: 'Awaiting verification' }
]);

const byStatus = computed(() => report.value.by_status ?? []);
const byChannel = computed(() => report.value.by_channel ?? []);
const channelOptions = computed(() => [...new Set(byChannel.value.map((item) => item.label).filter(Boolean))]);
const dailyRevenue = computed(() => report.value.daily_revenue ?? []);
const dailyRevenueMax = computed(() => Math.max(...dailyRevenue.value.map((item) => item.amount), 1));
const transactions = computed(() => report.value.transactions ?? []);
const filteredTransactions = computed(() => {
  const q = searchTerm.value.trim().toLowerCase();
  if (!q) return transactions.value;

  return transactions.value.filter((item) => {
    const haystack = [
      item.order_number,
      item.id,
      item.participant_name,
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
  currentPage.value = page;
  const start = (page - 1) * itemsPerPage.value;
  return filteredTransactions.value.slice(start, start + itemsPerPage.value);
});

await loadEvents();
readFiltersFromQuery();
if (eventFilter.value) {
  await loadPackagesByEvent(false);
}
await loadReport();
routeReady.value = true;
syncFiltersToUrl();

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

const transactionStatusClass = (status: string) => {
  const value = (status || '').toLowerCase();
  if (value === 'success') {
    return 'status-success';
  }
  if (value === 'pending' || value === 'created') {
    return 'status-pending';
  }
  return 'status-danger';
};

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
</script>

<style scoped>
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
</style>
