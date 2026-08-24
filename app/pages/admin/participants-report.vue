<template>
  <section class="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
    <div class="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p class="text-xs uppercase tracking-[0.28em] text-amber-200">Organizer Panel</p>
        <h1 class="mt-3 text-3xl font-black sm:text-4xl">Participants report</h1>
        <p class="mt-2 text-xs text-slate-400">Last updated: {{ lastUpdatedLabel }}</p>
      </div>
      <div class="rounded-full border border-amber-300/30 bg-amber-300/10 px-4 py-2 text-sm font-medium text-amber-100">
        Role: {{ authStore.userRole || 'unknown' }}
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
        <span class="text-xs uppercase tracking-[0.2em] text-slate-400">Package</span>
        <select v-model="packageIdFilter" class="rounded-full border border-white/15 bg-slate-900 px-4 py-3 text-sm text-white outline-none" :disabled="!eventFilter || packageLoading">
          <option value="" :disabled="packageLoading">{{ packageLoading ? 'Memuat package...' : 'Semua package' }}</option>
          <option v-for="option in packageOptions" :key="option.id" :value="option.id">
            {{ option.name }}
          </option>
        </select>
      </label>
      <label class="grid gap-2 text-sm">
        <span class="text-xs uppercase tracking-[0.2em] text-slate-400">Status pembayaran</span>
        <select v-model="paymentStatusFilter" class="rounded-full border border-white/15 bg-slate-900 px-4 py-3 text-sm text-white outline-none">
          <option value="">Semua status</option>
          <option value="created">created</option>
          <option value="pending">pending</option>
          <option value="success">success</option>
          <option value="failed">failed</option>
          <option value="expired">expired</option>
          <option value="refunded">refunded</option>
        </select>
      </label>
      <div class="flex items-end gap-2">
        <button :disabled="loading || !hasActiveFilters" class="rounded-full border border-white/20 px-4 py-3 text-sm font-bold text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50" @click="resetFilters">
          Reset
        </button>
      </div>

      <label class="grid gap-2 text-sm">
        <span class="text-xs uppercase tracking-[0.2em] text-slate-400">Tanggal bayar mulai</span>
        <input v-model="dateFrom" type="date" class="rounded-full border border-white/15 bg-slate-900 px-4 py-3 text-sm text-white outline-none" />
      </label>
      <label class="grid gap-2 text-sm">
        <span class="text-xs uppercase tracking-[0.2em] text-slate-400">Tanggal bayar selesai</span>
        <input v-model="dateTo" type="date" class="rounded-full border border-white/15 bg-slate-900 px-4 py-3 text-sm text-white outline-none" />
      </label>
      <label class="grid gap-2 text-sm sm:col-span-2">
        <span class="text-xs uppercase tracking-[0.2em] text-slate-400">Cari participant</span>
        <input v-model="searchTerm" type="text" placeholder="Cari nama, email, atau organisasi" class="rounded-full border border-white/15 bg-slate-900 px-4 py-3 text-sm text-white outline-none" />
      </label>

      <p class="text-xs text-slate-400 sm:col-span-6">
        Filter event, package, status pembayaran, dan pencarian diterapkan ke server (delay 350ms). Periode tanggal
        memfilter package berdasarkan tanggal <code>paid_at</code> pada halaman yang sedang ditampilkan.
      </p>
      <p v-if="hasDateRangeInvalid" class="text-xs text-rose-300 sm:col-span-6">
        Tanggal mulai tidak boleh lebih besar dari tanggal selesai.
      </p>
    </div>

    <div v-if="pending" class="grid gap-4">
      <div v-for="n in 4" :key="n" class="h-24 animate-pulse rounded-3xl bg-white/5" />
    </div>

    <div v-else-if="errorMessage" class="rounded-3xl border border-rose-400/40 bg-rose-500/10 p-5 text-sm text-rose-100">
      {{ errorMessage }}
    </div>

    <div v-else class="space-y-6">
      <article class="glass-card rounded-3xl p-5">
        <div class="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 class="text-lg font-bold">Participants</h2>
          <a :href="csvUrl" :download="csvFileName" class="rounded-full border border-cyan-300/30 bg-cyan-300/10 px-3 py-2 text-xs font-bold uppercase tracking-[0.18em] text-cyan-100">Download CSV</a>
        </div>

        <div class="flex items-center justify-between text-sm text-slate-400 mb-3">
          <span>{{ filteredParticipants.length }} dari {{ totalParticipants }} participant (halaman {{ currentPage }})</span>
          <label class="flex items-center gap-2">
            <span class="text-xs uppercase tracking-[0.16em] text-slate-500">Per halaman</span>
            <select v-model.number="pageSize" class="rounded-full border border-white/15 bg-slate-900 px-3 py-2 text-sm text-white outline-none">
              <option :value="10">10</option>
              <option :value="20">20</option>
              <option :value="50">50</option>
              <option :value="100">100</option>
            </select>
          </label>
        </div>

        <div class="report-table-shell overflow-x-auto">
          <table class="min-w-full text-left text-sm text-slate-300">
            <thead>
              <tr class="border-b border-white/10 text-xs uppercase tracking-[0.18em] text-slate-400">
                <th class="py-3 pr-4">Participant</th>
                <th class="py-3 pr-4">Organisasi</th>
                <th class="py-3 pr-4">Registrasi</th>
                <th class="py-3 pr-4">Packages</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in filteredParticipants" :key="item.participant_id" class="border-b border-white/5 last:border-0">
                <td class="py-3 pr-4" data-label="Participant">
                  <p class="font-semibold text-white">{{ item.full_name || 'N/A' }}</p>
                  <p class="text-xs text-slate-400">{{ item.email || 'N/A' }}</p>
                  <p class="text-xs text-slate-500">{{ item.phone || '' }}</p>
                </td>
                <td class="py-3 pr-4" data-label="Organisasi">{{ item.organization_name || 'N/A' }}</td>
                <td class="py-3 pr-4" data-label="Registrasi">
                  <span class="inline-flex rounded-full border border-white/15 px-2 py-1 text-xs">{{ item.registration_status || 'N/A' }}</span>
                </td>
                <td class="py-3 pr-4" data-label="Packages">
                  <div v-if="visiblePackages(item).length" class="grid gap-2">
                    <div v-for="pkg in visiblePackages(item)" :key="`${item.participant_id}-${pkg.package_id}-${pkg.order_id}`" class="rounded-2xl border border-white/10 bg-slate-950/50 p-2 text-xs">
                      <div class="flex items-center justify-between gap-2">
                        <span class="font-semibold text-white">{{ pkg.package_name || pkg.package_code || 'Package' }}</span>
                        <span :class="paymentStatusClass(pkg.payment_status)" class="inline-flex rounded-full px-2 py-0.5 font-bold">
                          {{ pkg.payment_status || 'N/A' }}
                        </span>
                      </div>
                      <p class="mt-1 text-slate-400">{{ pkg.order_number || pkg.order_id || 'N/A' }} &middot; {{ formatCurrency(pkg.line_total || 0) }}</p>
                      <p class="mt-0.5 text-slate-500">Dibayar: {{ pkg.paid_at ? formatDateTime(pkg.paid_at) : 'Belum dibayar' }}</p>
                    </div>
                  </div>
                  <span v-else class="text-slate-500">Belum mengambil package</span>
                </td>
              </tr>
              <tr v-if="!filteredParticipants.length">
                <td colspan="4" class="py-6 text-center text-slate-500" data-label="">Tidak ada data untuk filter saat ini.</td>
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
import { useAdminReport, type ParticipantReportItem, type ParticipantReportPackage } from '~/composables/useAdminReport';
import { useEvent, type DelegatePackageItem, type EventItem } from '~/composables/useEvent';

const route = useRoute();
const router = useRouter();

definePageMeta({ middleware: ['auth', 'admin'] });
useSeoMeta({ title: 'Participants Report | IWBIF 2026' });

const authStore = useAuthStore();
const { getParticipantReport } = useAdminReport();
const { getEvents, getEventDelegatePackages } = useEvent();

const eventFilter = ref('');
const packageIdFilter = ref('');
const paymentStatusFilter = ref('');
const searchTerm = ref('');
const dateFrom = ref('');
const dateTo = ref('');
const currentPage = ref(1);
const pageSize = ref(20);
const totalParticipants = ref(0);
const totalPages = ref(1);

const loading = ref(false);
const pending = computed(() => loading.value);
const errorMessage = ref('');
const lastUpdated = ref<Date | null>(null);
const eventsLoading = ref(false);
const packageLoading = ref(false);
const events = ref<Array<EventItem>>([]);
const packageOptions = ref<Array<{ id: string; name: string }>>([]);
const participants = ref<ParticipantReportItem[]>([]);
const routeReady = ref(false);
const autoReloadTimer = ref<ReturnType<typeof setTimeout> | null>(null);

const lastUpdatedLabel = computed(() => {
  if (!lastUpdated.value) return 'belum dimuat';
  return new Intl.DateTimeFormat('en-GB', { dateStyle: 'medium', timeStyle: 'short' }).format(lastUpdated.value);
});

const hasDateRangeInvalid = computed(() => Boolean(dateFrom.value && dateTo.value && dateFrom.value > dateTo.value));
const hasActiveFilters = computed(() => {
  return (
    !!eventFilter.value ||
    !!packageIdFilter.value ||
    !!paymentStatusFilter.value ||
    !!searchTerm.value ||
    !!dateFrom.value ||
    !!dateTo.value
  );
});

const buildReportParams = () => {
  const params: Record<string, string | number | undefined> = {
    page: currentPage.value,
    size: pageSize.value
  };

  if (eventFilter.value) params.event_id = eventFilter.value;
  if (packageIdFilter.value) params.package_id = packageIdFilter.value;
  if (paymentStatusFilter.value) params.payment_status = paymentStatusFilter.value;
  if (searchTerm.value.trim()) params.search = searchTerm.value.trim();

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

  eventFilter.value = getQueryString(q.event_id);
  packageIdFilter.value = getQueryString(q.package_id);
  paymentStatusFilter.value = getQueryString(q.payment_status);
  searchTerm.value = getQueryString(q.search);
  dateFrom.value = getQueryString(q.date_from);
  dateTo.value = getQueryString(q.date_to);

  const pageValue = Number(getQueryString(q.page));
  if (pageValue > 0) currentPage.value = pageValue;

  const sizeValue = Number(getQueryString(q.size));
  if (sizeValue > 0) pageSize.value = sizeValue;
};

const buildQueryState = () => ({
  event_id: eventFilter.value || undefined,
  package_id: packageIdFilter.value || undefined,
  payment_status: paymentStatusFilter.value || undefined,
  search: searchTerm.value || undefined,
  date_from: dateFrom.value || undefined,
  date_to: dateTo.value || undefined,
  page: String(currentPage.value),
  size: String(pageSize.value)
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
    if (key === 'page' || key === 'size') return;
    if (value !== undefined && value !== '') query.append(key, String(value));
  });
  const path = '/admin/reports/participants.csv';
  return query.toString() ? `${path}?${query.toString()}` : path;
});

const csvFileName = computed(() => {
  const selectedEvent = events.value.find((item) => item.id === eventFilter.value);
  const eventName = (selectedEvent?.name || 'all-events').toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const fallbackDate = formatDateOnly(new Date());
  return `participants-report-${eventName}-${fallbackDate}.csv`;
});

const formatDateOnly = (value: Date) => {
  const year = value.getFullYear();
  const month = `${value.getMonth() + 1}`.padStart(2, '0');
  const day = `${value.getDate()}`.padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const loadReport = async () => {
  if (loading.value) return;
  if (hasDateRangeInvalid.value) {
    errorMessage.value = 'Tanggal mulai tidak boleh lebih besar dari tanggal selesai.';
    return;
  }

  loading.value = true;
  errorMessage.value = '';
  try {
    const response = await getParticipantReport(buildReportParams());
    participants.value = response.data || [];
    totalParticipants.value = response.meta?.total ?? participants.value.length;
    totalPages.value = response.meta?.pages ?? 1;
    lastUpdated.value = new Date();
  } catch (error) {
    errorMessage.value = 'Unable to load participants report. Please check your admin access token or backend availability.';
    console.error(error);
  } finally {
    loading.value = false;
  }
};

const resetFilters = () => {
  eventFilter.value = '';
  packageIdFilter.value = '';
  paymentStatusFilter.value = '';
  searchTerm.value = '';
  dateFrom.value = '';
  dateTo.value = '';
  packageOptions.value = [];
  currentPage.value = 1;
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

// The endpoint does not accept a date range, so the period input filters the
// packages already returned for the current page by their paid_at value.
const isPackageInDateRange = (pkg: ParticipantReportPackage) => {
  if (!dateFrom.value && !dateTo.value) return true;
  if (!pkg.paid_at) return false;
  const paidDate = formatDateOnly(new Date(pkg.paid_at));
  if (dateFrom.value && paidDate < dateFrom.value) return false;
  if (dateTo.value && paidDate > dateTo.value) return false;
  return true;
};

const visiblePackages = (item: ParticipantReportItem) => {
  if (!dateFrom.value && !dateTo.value) return item.packages;
  return item.packages.filter(isPackageInDateRange);
};

const filteredParticipants = computed(() => {
  if (!dateFrom.value && !dateTo.value) return participants.value;
  return participants.value.filter((item) => item.packages.length === 0 || visiblePackages(item).length > 0);
});

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(Number(value || 0));
};

const formatDateTime = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat('en-GB', { dateStyle: 'medium', timeStyle: 'short' }).format(date);
};

const paymentStatusClass = (status?: string | null) => {
  const value = (status || '').toLowerCase();
  if (value === 'success') return 'status-success';
  if (value === 'pending' || value === 'created') return 'status-pending';
  if (value === 'failed' || value === 'expired' || value === 'refunded') return 'status-danger';
  return 'status-pending';
};

readFiltersFromQuery();
await loadEvents();
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

watch([packageIdFilter, paymentStatusFilter, searchTerm], () => {
  currentPage.value = 1;
  syncFiltersToUrl();
  scheduleAutoReload();
});

watch([dateFrom, dateTo], () => {
  syncFiltersToUrl();
});

watch(pageSize, () => {
  currentPage.value = 1;
  syncFiltersToUrl();
  loadReport();
});

watch(currentPage, () => {
  syncFiltersToUrl();
  loadReport();
});
</script>

<style scoped>
:global(html) {
  font-family: 'Plus Jakarta Sans', 'Segoe UI', sans-serif;
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

  .report-table-shell td > * {
    flex: 1;
    min-width: 0;
  }
}
</style>
