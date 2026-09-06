<template>
  <section class="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
    <p class="text-sm uppercase tracking-[0.3em] text-cyan-200/70">{{ copy.ticket }}</p>
    <h1 class="mt-3 text-4xl font-black text-white">{{ copy.title }}</h1>
    <p class="mt-3 text-slate-300">{{ copy.description }}</p>

    <div v-if="loading" class="mt-8 grid gap-4 md:grid-cols-2">
      <div v-for="item in 4" :key="item" class="h-40 animate-pulse rounded-[1.75rem] bg-white/5"></div>
    </div>

    <div v-else-if="paymentRequired || (!error && !tickets.length)" class="mt-8 rounded-3xl border border-amber-300/30 bg-amber-300/5 p-6" role="status">
      <h2 class="text-xl font-bold text-white">{{ emptyCopy.title }}</h2>
      <p class="mt-3 max-w-2xl text-sm leading-7 text-slate-300">{{ emptyDescription }}</p>
      <NuxtLink :to="emptyActionTo" class="mt-5 inline-flex rounded-full bg-amber-300 px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-amber-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-300">
        {{ emptyActionLabel }}
      </NuxtLink>
    </div>

    <div v-else-if="error" class="mt-8 rounded-3xl border border-red-400/40 bg-red-950/40 p-5 text-red-100" role="alert">
      {{ copy.loadError }}: {{ error.message }}
    </div>

    <div v-else class="mt-8 grid gap-4 md:grid-cols-2">
      <article
        v-for="ticket in tickets"
        :key="ticket.id"
        class="rounded-[1.75rem] border border-white/10 bg-white/5 p-5"
      >
        <div class="flex items-start justify-between gap-3">
          <div>
            <p class="text-xs uppercase tracking-[0.25em] text-slate-400">{{ copy.ticket }}</p>
            <h2 class="mt-2 text-xl font-semibold text-white">{{ ticket.ticket_number }}</h2>
            <p class="mt-1 text-sm text-slate-300">{{ statusLabel(ticket.status) }}</p>
          </div>
          <button
            class="rounded-full border border-white/15 px-4 py-2 text-xs text-white"
            @click="loadQr(ticket.id)"
          >
            {{ copy.showQr }}
          </button>
        </div>

        <p class="mt-3 text-sm text-slate-300">{{ copy.registrationId }}: {{ ticket.registration_id }}</p>

        <div class="mt-4 space-y-3">
          <button
            class="rounded-full bg-cyan-400 px-4 py-2 text-sm font-semibold text-slate-950"
            @click="reissue(ticket.id)"
            :disabled="reissuing === ticket.id"
          >
            {{ reissuing === ticket.id ? copy.processing : copy.reissue }}
          </button>
        </div>
      </article>
    </div>

    <p v-if="qr.imageError && !qr.imageUrl && !paymentRequired" class="mt-6 rounded-2xl border border-red-400/40 bg-red-950/40 p-5 text-red-100" role="alert">{{ qr.imageError }}</p>

    <div
      v-if="qr.ticket_id && qr.imageUrl && !paymentRequired"
      ref="ticketCardRef"
      class="print-ticket relative mt-10 overflow-hidden rounded-[2rem] border border-cyan-300/30 bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.18),_transparent_30%),linear-gradient(135deg,rgba(8,47,73,0.96),rgba(15,23,42,0.98))] p-5 shadow-[0_24px_80px_rgba(6,182,212,0.18)] sm:p-6"
    >
      <div class="absolute -left-4 top-1/2 h-8 w-8 -translate-y-1/2 rounded-full bg-slate-950 sm:-left-5 sm:h-10 sm:w-10"></div>
      <div class="absolute -right-4 top-1/2 h-8 w-8 -translate-y-1/2 rounded-full bg-slate-950 sm:-right-5 sm:h-10 sm:w-10"></div>
      <div class="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,transparent,rgba(255,255,255,0.06),transparent)] opacity-70"></div>
      <div class="pointer-events-none absolute inset-y-6 right-[18rem] hidden border-r border-dashed border-white/15 lg:block"></div>
      <div class="pointer-events-none absolute right-4 top-4 rounded-full border border-amber-300/20 bg-amber-300/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.35em] text-amber-100 sm:right-6 sm:top-6">
        {{ copy.vipAccess }}
      </div>
      <div class="relative grid gap-8 lg:grid-cols-[1.35fr_280px] lg:items-center">
        <div>
          <div class="flex flex-wrap items-center gap-3 pr-20">
            <p class="text-xs uppercase tracking-[0.45em] text-cyan-100/80 sm:text-sm">{{ copy.officialPass }}</p>
            <span class="rounded-full border border-emerald-300/25 bg-emerald-300/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.28em] text-emerald-100">
              {{ copy.confirmed }}
            </span>
          </div>
          <div class="mt-4 flex items-center gap-4">
            <div class="flex h-16 w-16 items-center justify-center overflow-hidden rounded-3xl border border-cyan-200/25 bg-white/10 p-2 shadow-lg shadow-cyan-950/30 sm:h-20 sm:w-20">
              <img
                src="/branding/ai-asean.png"
                alt="IWBIF 2026 event mark"
                class="h-full w-full rounded-xl object-contain"
              />
            </div>
            <div>
              <p class="text-sm font-semibold uppercase tracking-[0.28em] text-white sm:text-base sm:tracking-[0.32em]">International Women Business</p>
              <p class="text-sm uppercase tracking-[0.24em] text-cyan-100/70 sm:text-base sm:tracking-[0.28em]">&amp; Investment Forum 2026</p>
            </div>
          </div>
          <h2 class="mt-3 max-w-2xl text-3xl font-black leading-tight text-white sm:text-4xl">
            {{ copy.registered }}
          </h2>
          <p class="mt-4 max-w-2xl text-sm leading-7 text-slate-200 sm:text-base">
            {{ copy.instructions }}
          </p>

          <div class="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <div class="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-sm">
              <p class="text-[11px] uppercase tracking-[0.3em] text-cyan-100/70">{{ copy.participant }}</p>
              <p class="mt-2 text-sm font-semibold leading-7 text-white sm:text-base sm:leading-8">{{ participantName }}</p>
            </div>
            <div class="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-sm">
              <p class="text-[11px] uppercase tracking-[0.3em] text-cyan-100/70">{{ copy.event }}</p>
              <p class="mt-2 text-sm font-semibold leading-7 text-white sm:text-base sm:leading-8">IWBIF 2026</p>
            </div>
            <div class="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-sm">
              <p class="text-[11px] uppercase tracking-[0.3em] text-cyan-100/70">{{ copy.ticketNumber }}</p>
              <p class="mt-2 break-words text-sm font-semibold leading-7 text-white sm:text-[15px] sm:leading-8">{{ qr.ticket_number }}</p>
            </div>
            <div class="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-sm">
              <p class="text-[11px] uppercase tracking-[0.3em] text-cyan-100/70">{{ copy.dateVenue }}</p>
              <p class="mt-2 text-sm font-semibold leading-7 text-white sm:text-[15px]">{{ copy.eventDate }}</p>
              <p class="mt-1 text-xs leading-5 text-slate-300 sm:leading-6">{{ copy.venue }}</p>
            </div>
          </div>

          <div class="ticket-actions mt-6 flex flex-wrap gap-3">
            <button
              v-if="qr.imageUrl"
              type="button"
              :disabled="downloading"
              class="rounded-full bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 transition duration-200 hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-50"
              @click="downloadTicket"
            >
              {{ downloading ? copy.downloading : copy.download }}
            </button>
          </div>
        </div>

        <div class="relative">
          <div class="mx-auto max-w-[220px] rounded-[1.75rem] border border-white/15 bg-white p-3 shadow-2xl sm:max-w-[250px] sm:p-4">
            <img
              v-if="qr.imageUrl"
              :src="qr.imageUrl"
              alt="QR ticket"
              class="w-full rounded-2xl"
              @error="qr.imageError = copy.qrRenderError"
            />
          </div>
          <p class="mt-4 text-center text-xs uppercase tracking-[0.35em] text-cyan-100/70">
            {{ copy.scan }}
          </p>
        </div>
      </div>

      <p v-if="qr.imageError" class="relative mt-4 text-sm text-red-100">{{ qr.imageError }}</p>
    </div>
  </section>
</template>

<script setup lang="ts">
import { toPng } from 'html-to-image';
import QRCode from 'qrcode';
import { useTicket } from '~/composables/useTicket';

definePageMeta({ middleware: 'auth' });

const { locale } = useI18n();
const messages = {
  en: { ticket: 'Ticket', title: 'My Ticket', description: 'View your ticket list, render the QR code, and reissue it when needed.', loadError: 'Failed to load tickets', showQr: 'Show QR', registrationId: 'Registration ID', processing: 'Processing…', reissue: 'Reissue', vipAccess: 'VIP Access', officialPass: 'Official Event Pass', confirmed: 'Confirmed', registered: 'You are officially registered for IWBIF 2026.', instructions: 'Please present this QR code during re-registration and check-in at the venue.', participant: 'Participant', event: 'Event', ticketNumber: 'Ticket Number', dateVenue: 'Date & Venue', eventDate: '14–17 October 2026', venue: 'Jakarta, Indonesia', downloading: 'Downloading…', download: 'Download Ticket', qrRenderError: 'QR could not be rendered. Please try reissuing the ticket.', scan: 'Scan for verification', registeredParticipant: 'Registered Participant', tokenUnavailable: 'QR token is not available.', failedQr: 'Failed to load QR', error: 'Error', qrCreateError: 'QR could not be created.', imageError: 'Unable to create ticket image.', downloadError: 'Ticket could not be downloaded. Please try again.', statuses: { active: 'Active', issued: 'Issued', used: 'Used', revoked: 'Revoked' }, seo: 'My Ticket' },
  zh: { ticket: '门票', title: '我的门票', description: '查看门票列表、显示二维码，并在需要时重新签发。', loadError: '无法加载门票', showQr: '显示二维码', registrationId: '注册 ID', processing: '处理中…', reissue: '重新签发', vipAccess: '贵宾通行', officialPass: '官方活动通行证', confirmed: '已确认', registered: '您已正式注册参加 IWBIF 2026。', instructions: '请在现场重新登记和签到时出示此二维码。', participant: '参与者', event: '活动', ticketNumber: '门票编号', dateVenue: '日期与地点', eventDate: '2026年10月14日至17日', venue: '印度尼西亚雅加达', downloading: '正在下载…', download: '下载门票', qrRenderError: '无法显示二维码，请尝试重新签发门票。', scan: '扫码验证', registeredParticipant: '已注册参与者', tokenUnavailable: '二维码令牌不可用。', failedQr: '无法加载二维码', error: '错误', qrCreateError: '无法创建二维码。', imageError: '无法生成门票图片。', downloadError: '无法下载门票，请重试。', statuses: { active: '有效', issued: '已签发', used: '已使用', revoked: '已撤销' }, seo: '我的门票' }
} as const;
const copy = computed(() => locale.value === 'zh-CN' ? messages.zh : messages.en);
const statusLabel = (status: string) => (copy.value.statuses as Record<string, string>)[status.toLowerCase()] || status;
useSeoMeta({ title: () => `${copy.value.seo} | IWBIF 2026` });

const authStore = useAuthStore();
const { getMyTickets, getQrByTicket, reissueTicket } = useTicket();
const registrationFlow = useRegistrationFlow();
const paymentRequired = ref(false);
const isPaymentRequired = (cause: unknown) => {
  const data = (cause as { data?: { errors?: Array<{ code?: string }> } })?.data;
  return data?.errors?.some(item => item.code === 'REGISTRATION_PAYMENT_REQUIRED') === true;
};
const emptyCopy = computed(() => locale.value === 'zh-CN' ? {
  title: '门票二维码暂不可用',
  unpaid: '付款尚未完成。请先付清订单，包括所有分笔付款。付款确认并完成注册后，您才能获取门票二维码。',
  pending: '门票尚未签发。门票需要在付款全额确认并完成注册后才能获取。如果您已付款，请查看付款状态。',
  profile: '付款已收到。请完成注册资料，以便获取门票。',
  paid: '注册已完成，但门票尚未显示。请查看付款确认状态，如需帮助请联系主办方。',
  pay: '前往付款', review: '查看付款状态', complete: '完善注册资料'
} : {
  title: 'Your ticket QR code is not available yet',
  unpaid: 'Your payment is not complete. Please pay the full order balance, including all payment parts. Your ticket QR code requires confirmed payment and completed registration.',
  pending: 'No ticket has been issued yet. Your ticket requires full payment confirmation and completed registration. If you have already paid, review your payment status.',
  profile: 'Your payment has been received. Complete your registration details to proceed with your ticket.',
  paid: 'Your registration is complete, but your ticket is not showing yet. Review your payment confirmation or contact the organizer for help.',
  pay: 'Go to payment', review: 'Review payment status', complete: 'Complete registration'
});
const unpaid = computed(() => paymentRequired.value || ['selected', 'payment_pending'].includes(registrationFlow.primaryStatus.value));
const emptyDescription = computed(() => unpaid.value ? emptyCopy.value.unpaid : registrationFlow.profilePendingType.value ? emptyCopy.value.profile : registrationFlow.primaryStatus.value === 'completed' ? emptyCopy.value.paid : emptyCopy.value.pending);
const emptyActionLabel = computed(() => !unpaid.value && registrationFlow.profilePendingType.value ? emptyCopy.value.complete : registrationFlow.isPaid.value && !unpaid.value ? emptyCopy.value.review : emptyCopy.value.pay);
const emptyActionTo = computed(() => {
  if (!unpaid.value && registrationFlow.profilePendingType.value) return `/register/${registrationFlow.profilePendingType.value}`;
  const orderId = registrationFlow.activeOrderId.value;
  if (!orderId) return registrationFlow.isPaid.value && !unpaid.value ? '/dashboard/invoice' : '/dashboard/cart';
  return `/dashboard/${registrationFlow.isPaid.value && !unpaid.value ? 'payment-status' : 'payment'}?order_id=${encodeURIComponent(orderId)}`;
});

const loading = ref(true);
const reissuing = ref('');
const tickets = ref<Array<{ id: string; registration_id: string; ticket_number: string; status: string }>>([]);
const error = ref<Error | null>(null);
const downloading = ref(false);
const ticketCardRef = ref<HTMLElement | null>(null);
const qr = ref({ ticket_id: '', ticket_number: '', token: '', imageUrl: '', imageError: '' });
const participantName = computed(() => authStore.user?.full_name || authStore.user?.email || copy.value.registeredParticipant);

try {
  const response = await getMyTickets();
  tickets.value = response.data ?? [];
} catch (e) {
  paymentRequired.value = isPaymentRequired(e);
  error.value = e as Error;
} finally {
  if (!tickets.value.length) {
    try { await registrationFlow.loadFlow(); } catch { /* Keep the neutral empty state when progress is unavailable. */ }
  }
  loading.value = false;
}

const loadQr = async (ticketId: string) => {
  try {
    const result = await getQrByTicket(ticketId);
    const ticket = tickets.value.find((item) => item.id === ticketId);
    const token = result.data.qr_token;

    if (!token) throw new Error(copy.value.tokenUnavailable);

    qr.value = {
      ticket_id: ticketId,
      ticket_number: ticket?.ticket_number || '',
      token,
      imageUrl: await QRCode.toDataURL(token, {
        width: 320,
        margin: 2,
        color: { dark: '#020617', light: '#ffffff' }
      }),
      imageError: ''
    };
  } catch (error) {
    paymentRequired.value = isPaymentRequired(error);
    qr.value = {
      ticket_id: ticketId,
      ticket_number: copy.value.failedQr,
      token: copy.value.error,
      imageUrl: '',
      imageError: error instanceof Error ? error.message : copy.value.qrCreateError
    };
  }
};

const downloadTicket = async () => {
  if (!ticketCardRef.value || !qr.value.ticket_number) return;

  try {
    downloading.value = true;
    qr.value.imageError = '';
    ticketCardRef.value.classList.add('ticket-exporting');
    const dataUrl = await toPng(ticketCardRef.value, {
      cacheBust: true,
      pixelRatio: 2,
      backgroundColor: '#082f49'
    });
    if (!dataUrl) {
      throw new Error(copy.value.imageError);
    }
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = `${qr.value.ticket_number}-event-pass.png`;
    link.click();
  } catch {
    qr.value.imageError = copy.value.downloadError;
  } finally {
    downloading.value = false;
    ticketCardRef.value.classList.remove('ticket-exporting');
  }
};

const reissue = async (ticketId: string) => {
  reissuing.value = ticketId;
  try {
    await reissueTicket(ticketId);
    const response = await getMyTickets();
    tickets.value = response.data ?? [];
  } finally {
    reissuing.value = '';
  }
};
</script>

<style scoped>
.ticket-exporting {
  box-shadow: none !important;
}

.ticket-exporting .ticket-actions {
  display: none !important;
}

@media print {
  section {
    max-width: none !important;
    padding: 0 !important;
  }

  article,
  button {
    display: none !important;
  }

  .print-ticket {
    margin-top: 0 !important;
    border: 1px solid #cbd5e1 !important;
    background: #ffffff !important;
    box-shadow: none !important;
    color: #0f172a !important;
    break-inside: avoid;
  }

  .print-ticket * {
    color: #0f172a !important;
  }

  .print-ticket img {
    border: 1px solid #e2e8f0;
    background: #ffffff !important;
  }

  .print-ticket a {
    display: none !important;
  }
}
</style>
