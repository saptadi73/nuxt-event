<template>
  <section class="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
    <div class="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      <div>
        <p class="text-xs uppercase tracking-[0.32em] text-cyan-200">Organizer Panel</p>
        <h1 class="mt-3 text-3xl font-black sm:text-4xl">Attendance scanner & report</h1>
        <p class="mt-2 max-w-2xl text-sm leading-7 text-slate-300">
          Scan participant QR tickets, check-in manually, and export attendance report as CSV for the event team.
        </p>
      </div>
      <div class="flex flex-wrap gap-3">
        <button class="rounded-full border border-white/20 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-white/10" @click="refreshReport">
          Refresh report
        </button>
        <button class="rounded-full bg-cyan-300 px-5 py-2.5 text-sm font-black text-slate-950 transition hover:brightness-110" @click="exportCsv">
          Export CSV
        </button>
      </div>
    </div>

    <div class="mb-6 grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
      <article class="glass-card rounded-3xl p-5 sm:p-6">
        <div class="flex items-center justify-between gap-3">
          <div>
            <p class="text-[10px] uppercase tracking-[0.28em] text-slate-400">Live scanner</p>
            <h2 class="mt-2 text-xl font-bold">QR ticket check-in</h2>
          </div>
          <span class="rounded-full border border-emerald-300/30 bg-emerald-400/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-200">
            {{ scannerRunning ? 'Scanning' : 'Idle' }}
          </span>
        </div>

        <div v-if="scannerError" class="mt-4 rounded-2xl border border-rose-400/40 bg-rose-500/10 p-3 text-sm text-rose-100">
          {{ scannerError }}
        </div>

        <div class="mt-5 overflow-hidden rounded-3xl border border-white/10 bg-slate-950/60">
          <video ref="videoRef" class="aspect-video w-full bg-black object-cover" muted playsinline autoplay></video>
        </div>

        <div class="mt-5 flex flex-wrap gap-3">
          <button
            class="rounded-full bg-amber-300 px-5 py-3 text-sm font-bold text-slate-950 transition hover:brightness-110"
            :disabled="scannerBusy || !selectedEventId"
            @click="startScanner"
          >
            {{ scannerBusy ? 'Starting...' : scannerRunning ? 'Restart scanner' : 'Start camera' }}
          </button>
          <button
            class="rounded-full border border-white/20 px-5 py-3 text-sm font-bold text-white transition hover:bg-white/10"
            :disabled="scannerBusy || !selectedEventId"
            @click="stopScanner"
          >
            Stop
          </button>
          <button
            class="rounded-full border border-cyan-300/30 bg-cyan-300/10 px-5 py-3 text-sm font-bold text-cyan-100 transition hover:bg-cyan-300/20"
            :disabled="manualBusy || !selectedEventId || !manualTicketNumber"
            @click="submitManualCheckIn"
          >
            {{ manualBusy ? 'Checking in...' : 'Manual check-in' }}
          </button>
        </div>

        <div class="mt-5 grid gap-4 sm:grid-cols-2">
          <label class="grid gap-2 text-sm">
            <span class="text-[10px] uppercase tracking-[0.24em] text-slate-400">Event</span>
            <select v-model="selectedEventId" class="rounded-full border border-white/15 bg-slate-900 px-4 py-3 text-sm text-white outline-none" :disabled="eventsLoading">
              <option value="">Select event</option>
              <option v-for="event in events" :key="event.id" :value="event.id">{{ event.name }}</option>
            </select>
          </label>

          <label class="grid gap-2 text-sm">
            <span class="text-[10px] uppercase tracking-[0.24em] text-slate-400">Gate name</span>
            <input v-model="gateName" type="text" placeholder="Main Gate" class="rounded-full border border-white/15 bg-slate-900 px-4 py-3 text-sm text-white outline-none" />
          </label>

          <label class="grid gap-2 text-sm sm:col-span-2">
            <span class="text-[10px] uppercase tracking-[0.24em] text-slate-400">Manual ticket number</span>
            <input v-model.trim="manualTicketNumber" type="text" placeholder="TICKET-..." class="rounded-full border border-white/15 bg-slate-900 px-4 py-3 text-sm text-white outline-none" />
          </label>
        </div>
      </article>

      <article class="glass-card rounded-3xl p-5 sm:p-6">
        <p class="text-[10px] uppercase tracking-[0.28em] text-slate-400">Latest result</p>
        <h2 class="mt-2 text-xl font-bold">Check-in status</h2>

        <div v-if="lastResult" class="mt-5 space-y-4">
          <div class="rounded-2xl border border-emerald-300/20 bg-emerald-400/10 p-4">
            <div class="flex items-center justify-between gap-3">
              <span class="text-[10px] uppercase tracking-[0.22em] text-emerald-200">Status</span>
              <span class="rounded-full border border-emerald-300/30 bg-emerald-500/20 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-100">
                {{ lastResult.check_in?.status || 'success' }}
              </span>
            </div>
            <p class="mt-3 text-2xl font-black text-white">
              {{ lastResult.registrant?.participant_name || lastResult.registrant?.ticket_number || 'Participant' }}
            </p>
            <p class="mt-1 text-sm text-slate-300">
              {{ lastResult.registrant?.ticket_number || 'Ticket not available' }}
            </p>
          </div>

          <dl class="grid gap-3 text-sm text-slate-300">
            <div class="flex items-center justify-between gap-3 border-b border-white/10 pb-2">
              <dt>Registration</dt>
              <dd class="font-semibold text-white">{{ lastResult.registrant?.registration_number || 'N/A' }}</dd>
            </div>
            <div class="flex items-center justify-between gap-3 border-b border-white/10 pb-2">
              <dt>Gate</dt>
              <dd class="font-semibold text-white">{{ lastResult.check_in?.gate_name || gateName || 'N/A' }}</dd>
            </div>
            <div class="flex items-center justify-between gap-3 border-b border-white/10 pb-2">
              <dt>Checked-in</dt>
              <dd class="font-semibold text-white">{{ formatDateTime(lastResult.check_in?.check_in_at) }}</dd>
            </div>
            <div class="flex items-center justify-between gap-3">
              <dt>Ticket status</dt>
              <dd class="font-semibold text-white">{{ lastResult.registrant?.is_checked_in ? 'Checked in' : 'Waiting' }}</dd>
            </div>
          </dl>
        </div>

        <div v-else class="mt-5 rounded-2xl border border-dashed border-white/15 bg-slate-900/40 p-5 text-sm text-slate-300">
          Scan a QR ticket or use manual check-in to see the latest attendance result here.
        </div>
      </article>
    </div>

    <article class="glass-card rounded-3xl p-5 sm:p-6">
      <div class="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p class="text-[10px] uppercase tracking-[0.28em] text-slate-400">Attendance overview</p>
          <h2 class="mt-2 text-xl font-bold">Event attendance report</h2>
        </div>
        <label class="flex items-center gap-2 rounded-full border border-white/15 bg-slate-900 px-3 py-2 text-sm text-slate-300">
          <input v-model="includeWithoutTicket" type="checkbox" class="h-4 w-4 accent-cyan-300" />
          Include guests without ticket
        </label>
      </div>

      <div v-if="reportLoading" class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div v-for="n in 4" :key="n" class="h-28 animate-pulse rounded-2xl bg-white/5" />
      </div>

      <div v-else-if="reportError" class="rounded-2xl border border-rose-400/30 bg-rose-500/10 p-4 text-sm text-rose-100">
        {{ reportError }}
      </div>

      <div v-else class="space-y-5">
        <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <article v-for="card in summaryCards" :key="card.label" class="rounded-2xl border border-white/10 bg-slate-900/40 p-4">
            <p class="text-[10px] uppercase tracking-[0.24em] text-slate-400">{{ card.label }}</p>
            <p class="mt-3 text-2xl font-black text-white">{{ card.value }}</p>
            <p class="mt-1 text-xs text-slate-400">{{ card.note }}</p>
          </article>
        </div>

        <div class="data-table-shell overflow-x-auto">
          <table class="min-w-full text-left text-sm text-slate-300">
            <thead>
              <tr class="border-b border-white/10 text-[10px] uppercase tracking-[0.22em] text-slate-400">
                <th class="py-3 pr-4">Registrant</th>
                <th class="py-3 pr-4">Ticket</th>
                <th class="py-3 pr-4">Status</th>
                <th class="py-3 pr-4">Check-in</th>
                <th class="py-3 pr-4">Gate</th>
                <th class="py-3 pr-4">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="row in attendanceRows" :key="row.registration_id || row.ticket_id || row.participant_name || row.ticket_number || Math.random()" class="border-b border-white/5 last:border-0">
                <td class="py-3 pr-4" data-label="Registrant">
                  <div class="font-semibold text-white">{{ row.participant_name || 'Unknown participant' }}</div>
                  <div class="text-xs text-slate-400">{{ row.registration_number || row.registration_id || 'N/A' }}</div>
                </td>
                <td class="py-3 pr-4" data-label="Ticket">
                  <div class="font-medium text-white">{{ row.ticket_number || 'No ticket' }}</div>
                  <div class="text-xs text-slate-400">{{ row.organization_name || 'No organization' }}</div>
                </td>
                <td class="py-3 pr-4" data-label="Status">
                  <span :class="attendanceStatusClass(row)" class="inline-flex rounded-full px-2 py-1 text-[10px] font-bold uppercase tracking-[0.18em]">
                    {{ attendanceStatusLabel(row) }}
                  </span>
                </td>
                <td class="py-3 pr-4" data-label="Check-in">{{ formatDateTime(row.check_in_at) }}</td>
                <td class="py-3 pr-4" data-label="Gate">{{ row.gate_name || '—' }}</td>
                <td class="py-3 pr-4" data-label="Action">
                  <button class="rounded-full border border-cyan-300/30 bg-cyan-300/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-100" @click="lookupRow(row)">
                    Detail
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </article>
  </section>
</template>

<script setup lang="ts">
import { BrowserMultiFormatReader, type IScannerControls } from '@zxing/browser';
import { useAttendance, type AttendanceRegistrant, type AttendanceScanResponse } from '~/composables/useAttendance';
import { useEvent, type EventItem } from '~/composables/useEvent';

const authStore = useAuthStore();

const { getEvents } = useEvent();
const { scanAttendance, manualCheckIn, getEventAttendanceReport } = useAttendance();

const selectedEventId = ref('');
const gateName = ref('Main Gate');
const manualTicketNumber = ref('');
const scannerRunning = ref(false);
const scannerBusy = ref(false);
const manualBusy = ref(false);
const scannerError = ref('');
const lastResult = ref<AttendanceScanResponse | null>(null);
const events = ref<EventItem[]>([]);
const eventsLoading = ref(false);
const reportLoading = ref(false);
const reportError = ref('');
const includeWithoutTicket = ref(true);
const attendanceRows = ref<AttendanceRegistrant[]>([]);
const summaryCards = ref<Array<{ label: string; value: string; note: string }>>([]);
const videoRef = ref<HTMLVideoElement | null>(null);
let scannerControls: IScannerControls | null = null;
let scannerReader: BrowserMultiFormatReader | null = null;

const formatDateTime = (value?: string | null) => {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

const attendanceStatusClass = (row: AttendanceRegistrant) => {
  if (row.is_checked_in || row.status === 'checked_in') return 'bg-emerald-500/15 text-emerald-200 border border-emerald-300/30';
  if (row.has_ticket === false || row.attendance_status === 'no_ticket') return 'bg-amber-500/15 text-amber-200 border border-amber-300/30';
  return 'bg-slate-700/60 text-slate-200 border border-white/10';
};

const attendanceStatusLabel = (row: AttendanceRegistrant) => {
  if (row.is_checked_in || row.status === 'checked_in') return 'Checked in';
  if (row.has_ticket === false || row.attendance_status === 'no_ticket') return 'No ticket';
  return 'Pending';
};

const normalizeAttendanceRows = (payload: unknown): AttendanceRegistrant[] => {
  if (!payload || typeof payload !== 'object') return [];
  const source = payload as Record<string, unknown>;
  const list = Array.isArray(source.registrants)
    ? source.registrants
    : Array.isArray(source.rows)
      ? source.rows
      : Array.isArray(source.items)
        ? source.items
        : [];

  return list as AttendanceRegistrant[];
};

const refreshReport = async () => {
  if (!selectedEventId.value) return;
  reportLoading.value = true;
  reportError.value = '';

  try {
    const response = await getEventAttendanceReport(selectedEventId.value, includeWithoutTicket.value);
    const payload = response?.data ?? {};
    const rows = normalizeAttendanceRows(payload);
    attendanceRows.value = rows;

    const summary = payload.summary as Record<string, unknown> | undefined;
    const attendanceRate = Number(summary?.attendance_rate ?? summary?.total_checked_in ?? 0);

    summaryCards.value = [
      { label: 'Total', value: String(summary?.total_registrations ?? rows.length ?? 0), note: 'Registered guests' },
      { label: 'Checked in', value: String(summary?.checked_in ?? summary?.total_checked_in ?? rows.filter((item) => item.is_checked_in || item.status === 'checked_in').length), note: 'Present today' },
      { label: 'Pending', value: String(summary?.pending ?? rows.filter((item) => !(item.is_checked_in || item.status === 'checked_in')).length), note: 'Waiting to scan' },
      { label: 'Attendance rate', value: `${Number.isFinite(attendanceRate) ? attendanceRate : 0}%`, note: 'Overall attendance' }
    ];
  } catch (error) {
    const value = error as { data?: { message?: string } };
    reportError.value = value.data?.message || 'Unable to load attendance report.';
  } finally {
    reportLoading.value = false;
  }
};

const exportCsv = () => {
  if (!attendanceRows.value.length) {
    return;
  }

  const headers = ['registration_number', 'participant_name', 'organization_name', 'ticket_number', 'status', 'checked_in_at', 'gate_name'];
  const rows = attendanceRows.value.map((row) => [
    row.registration_number || '',
    row.participant_name || '',
    row.organization_name || '',
    row.ticket_number || '',
    attendanceStatusLabel(row),
    row.check_in_at || '',
    row.gate_name || ''
  ]);

  const csv = [headers, ...rows].map((values) => values.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `attendance-report-${selectedEventId.value || 'event'}.csv`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
};

const fetchEvents = async () => {
  eventsLoading.value = true;
  try {
    const response = await getEvents(1, 100);
    events.value = Array.isArray(response?.data) ? response.data : [];
    if (!selectedEventId.value && events.value[0]) {
      selectedEventId.value = events.value[0].id;
    }
  } catch {
    events.value = [];
  } finally {
    eventsLoading.value = false;
  }
};

watch(selectedEventId, () => {
  if (selectedEventId.value) {
    refreshReport();
  }
});

watch(includeWithoutTicket, () => {
  if (selectedEventId.value) {
    refreshReport();
  }
});

const submitManualCheckIn = async () => {
  if (!selectedEventId.value || !manualTicketNumber.value.trim()) return;
  manualBusy.value = true;
  scannerError.value = '';

  try {
    const response = await manualCheckIn({
      ticket_number: manualTicketNumber.value.trim(),
      event_id: selectedEventId.value,
      gate_name: gateName.value || 'Main Gate',
      device_id: 'organizer-dashboard'
    });

    lastResult.value = response.data as AttendanceScanResponse;
    manualTicketNumber.value = '';
    await refreshReport();
  } catch (error) {
    const value = error as { data?: { message?: string } };
    scannerError.value = value.data?.message || 'Manual check-in failed.';
  } finally {
    manualBusy.value = false;
  }
};

const lookupRow = async (row: AttendanceRegistrant) => {
  if (!selectedEventId.value || !row.registration_id) return;
  try {
    const response = await getRegistrationRoster(selectedEventId.value, row.registration_id);
    const data = response?.data as Record<string, unknown> | undefined;
    if (data && typeof data === 'object') {
      lastResult.value = { registrant: row, check_in: (data.check_in as AttendanceScanResponse['check_in']) ?? undefined };
    }
  } catch {
    lastResult.value = { registrant: row, check_in: { gate_name: row.gate_name || gateName.value, status: row.is_checked_in ? 'success' : 'pending' } };
  }
};

const startScanner = async () => {
  if (!selectedEventId.value || !videoRef.value) return;
  scannerBusy.value = true;
  scannerError.value = '';

  try {
    if (!scannerReader) {
      scannerReader = new BrowserMultiFormatReader();
    }

    if (scannerControls) {
      scannerControls.stop();
    }

    scannerControls = await scannerReader.decodeFromVideoDevice(undefined, videoRef.value, async (result, error, controls) => {
      if (result) {
        const qrValue = result.getText();
        if (!qrValue) return;
        scannerRunning.value = true;
        scannerBusy.value = true;
        try {
          const response = await scanAttendance({
            qr_token: qrValue,
            event_id: selectedEventId.value,
            gate_name: gateName.value || 'Main Gate',
            device_id: 'organizer-dashboard'
          });

          lastResult.value = response.data as AttendanceScanResponse;
          await refreshReport();
        } catch (error) {
          const value = error as { data?: { message?: string } };
          scannerError.value = value.data?.message || 'QR scan failed.';
        } finally {
          scannerBusy.value = false;
        }
      }

      if (error && !/No MultiFormat Readers|NotFoundException/.test(String(error))) {
        scannerError.value = 'Scanner encountered a problem while reading the QR code.';
      }
      if (controls) {
        scannerControls = controls;
      }
    });

    scannerRunning.value = true;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to access the camera.';
    scannerError.value = message;
  } finally {
    scannerBusy.value = false;
  }
};

const stopScanner = () => {
  if (scannerControls) {
    scannerControls.stop();
    scannerControls = null;
  }
  scannerRunning.value = false;
};

onBeforeUnmount(() => {
  stopScanner();
});

onMounted(async () => {
  await fetchEvents();
  if (selectedEventId.value) {
    await refreshReport();
  }
});

definePageMeta({ middleware: ['auth', 'admin'] });
useSeoMeta({ title: 'Attendance Scanner | IWBIF 2026' });

const isOrganizer = computed(() => authStore.isAdminOrOrganizer || authStore.userRole === 'organizer');
if (!isOrganizer.value) {
  navigateTo('/dashboard');
}
</script>

<style scoped>
  .data-table-shell { overflow-x: auto; }
  @media (max-width: 767px) {
    .mx-auto.max-w-7xl {
      padding-inline: 0.75rem;
    }

    .mb-8.flex.flex-col.gap-4.lg\:flex-row {
      gap: 1rem;
    }

    .mb-8.flex.flex-col.gap-4.lg\:flex-row > div:last-child {
      width: 100%;
    }

    .mb-8.flex.flex-col.gap-4.lg\:flex-row button {
      flex: 1 1 100%;
      justify-content: center;
    }

    .mb-6.grid.gap-4.xl\:grid-cols-\[1\.15fr_0\.85fr\] {
      grid-template-columns: 1fr;
    }

    .mt-5.flex.flex-wrap.gap-3 {
      display: grid;
      grid-template-columns: 1fr;
    }

    .mt-5.flex.flex-wrap.gap-3 button {
      width: 100%;
    }

    .data-table-shell {
      overflow: visible;
    }

    .data-table-shell table,
    .data-table-shell thead,
    .data-table-shell tbody,
    .data-table-shell tr,
    .data-table-shell th,
    .data-table-shell td {
      display: block;
      width: 100%;
      box-sizing: border-box;
    }

    .data-table-shell thead {
      display: none;
    }

    .data-table-shell tbody {
      display: grid;
      gap: 0.75rem;
      padding: 0.75rem;
    }

    .data-table-shell tr {
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 1.15rem;
      background: rgba(15, 23, 42, 0.72);
      padding: 0.8rem;
    }

    .data-table-shell td {
      border: 0;
      padding: 0.35rem 0;
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 0.75rem;
      font-size: 0.8rem;
    }

    .data-table-shell td::before {
      content: attr(data-label);
      color: rgb(148 163 184);
      font-size: 0.64rem;
      letter-spacing: 0.14em;
      text-transform: uppercase;
      width: 36%;
      flex-shrink: 0;
    }

    .data-table-shell td > * {
      flex: 1;
      min-width: 0;
    }

    .data-table-shell td:last-child {
      justify-content: space-between;
      text-align: left;
    }
  }
</style>
