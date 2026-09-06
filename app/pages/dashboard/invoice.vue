<template>
  <section class="mx-auto max-w-4xl px-3 py-10 sm:px-6">
    <p class="text-sm uppercase tracking-[.35em] text-cyan-200">{{ copy.eyebrow }}</p>
    <h1 class="mt-3 text-3xl font-black sm:text-4xl">{{ copy.title }}</h1>

    <div v-if="pending" class="glass-card mt-8 rounded-[2rem] p-7 text-slate-300">{{ copy.loading }}</div>
    <div v-else-if="errorMessage" class="mt-8 rounded-3xl border border-red-400/30 bg-red-950/30 p-6 text-red-100">{{ errorMessage }}</div>
    <div v-else-if="!invoice" class="glass-card mt-8 rounded-[2rem] p-7">
      <p class="text-lg font-semibold">{{ copy.noInvoice }}</p>
      <p class="mt-2 text-slate-400">{{ emptyInvoiceMessage }}</p>
      <p v-if="contextMismatchMessage" class="mt-2 text-amber-200/80">{{ contextMismatchMessage }}</p>
      <NuxtLink :to="emptyInvoiceTo" class="mt-6 inline-flex rounded-full bg-cyan-400 px-5 py-3 font-semibold text-slate-950">{{ emptyInvoiceAction }}</NuxtLink>
    </div>
    <article v-else id="invoice" ref="invoiceElement" class="glass-card mt-8 rounded-[2rem] p-5 sm:p-7">
      <div class="flex flex-wrap justify-between gap-5 border-b border-white/10 pb-6">
        <div class="min-w-0"><p class="break-words text-sm text-slate-400">{{ invoice.registration.event_name }}</p><p class="mt-1 break-words font-semibold">{{ copy.invoice }} {{ invoice.order.order_number }}</p></div>
        <span class="h-fit rounded-full bg-emerald-300/10 px-4 py-2 text-xs font-semibold uppercase tracking-[.2em] text-emerald-200">{{ copy.paid }}</span>
      </div>
      <dl class="mt-6 grid gap-5 sm:grid-cols-2">
        <div><dt class="text-xs uppercase tracking-[.2em] text-slate-500">{{ copy.registrationNumber }}</dt><dd class="mt-2 break-words text-lg font-semibold">{{ invoice.registration.registration_number }}</dd></div>
        <div><dt class="text-xs uppercase tracking-[.2em] text-slate-500">{{ copy.participant }}</dt><dd class="mt-2 break-words text-lg font-semibold">{{ invoice.participant.full_name }}</dd><p class="break-words text-sm text-slate-400">{{ invoice.participant.email }}</p></div>
        <div><dt class="text-xs uppercase tracking-[.2em] text-slate-500">{{ copy.delegatePackage }}</dt><dd class="mt-2 text-lg font-semibold">{{ invoice.registration.delegate_package_name || invoice.registration.ticket_type_name || '-' }}</dd></div>
        <div><dt class="text-xs uppercase tracking-[.2em] text-slate-500">{{ copy.paymentStatus }}</dt><dd class="mt-2 text-lg font-semibold text-emerald-300">{{ copy.paid }}</dd><p class="text-sm text-slate-400">{{ formatDate(invoice.payment.paid_at) }}</p></div>
      </dl>
      <ul v-if="orderItems.length" class="mt-7 space-y-2 border-t border-white/10 pt-6"><li v-for="item in orderItems" :key="item.id" class="flex justify-between gap-3 text-sm"><span class="min-w-0 break-words text-slate-300">{{ item.product_name }} × {{ item.quantity }}</span><strong class="shrink-0 text-white">{{ money(item.line_total, item.currency) }}</strong></li></ul>
      <div class="mt-7 space-y-4 border-t border-white/10 pt-6">
        <div class="flex flex-wrap items-center justify-between gap-2"><span class="text-slate-400">{{ amountCopy.orderTotal }}</span><strong class="text-white">{{ money(invoiceOrder?.total_amount, invoiceOrder?.currency) }}</strong></div>
        <div class="flex flex-wrap items-center justify-between gap-2"><span class="text-slate-300">{{ amountCopy.totalPaid }}</span><strong class="break-words text-2xl text-cyan-200">{{ money(totalPaid, invoiceOrder?.currency) }}</strong></div>
        <div v-if="Number(invoiceOrder?.remaining_amount) > 0" class="flex flex-wrap items-center justify-between gap-2"><span class="text-slate-400">{{ amountCopy.remaining }}</span><strong class="text-white">{{ money(invoiceOrder?.remaining_amount, invoiceOrder?.currency) }}</strong></div>
      </div>
      <button class="mt-7 w-full rounded-full bg-cyan-400 px-5 py-3 font-semibold text-slate-950 disabled:cursor-not-allowed disabled:opacity-60 print:hidden sm:w-auto" :disabled="downloading" @click="downloadInvoice">{{ downloading ? copy.preparingPdf : copy.downloadPdf }}</button>
    </article>
  </section>
</template>

<script setup lang="ts">
import { normalizeInvoices, usePayment, type Invoice, type PendingOrderProductItem, type OrderItem } from '~/composables/usePayment';
import { useRegistration } from '~/composables/useRegistration';
import { useTicket } from '~/composables/useTicket';

definePageMeta({ middleware: 'auth' });
const { locale } = useI18n();
const messages = {
  en: { eyebrow: 'Payment and Invoice', title: 'Registration invoice', loading: 'Loading invoice…', noInvoice: 'No invoice is available yet.', invoice: 'Invoice', paid: 'Paid', registrationNumber: 'Registration number', participant: 'Participant', delegatePackage: 'Delegate package', paymentStatus: 'Payment status', packageTotal: 'Package total', paymentAmountGateway: 'Shown by payment gateway', preparingPdf: 'Preparing PDF…', downloadPdf: 'Download invoice PDF', finishProfile: 'Your payment is complete. Finish your profile so the backend can link this order to your registration and generate the invoice.', awaitingInvoice: 'Your invoice will appear after your payment and registration have been confirmed.', mismatchProfile: 'No invoice was found for this payment context yet. Please complete your profile if it is still pending.', mismatch: 'No invoice was found for this specific payment context yet.', completeExhibitor: 'Complete Exhibitor Profile', completeDelegate: 'Complete Delegate Profile', checkStatus: 'Check payment status', goPayment: 'Go to payment', unavailable: 'Your invoice is not available yet. Please contact the event organizer if your payment has already been confirmed.', printError: 'Unable to open print window.', exportError: 'The PDF export could not be prepared. Please try again.', invoiceSuffix: 'Invoice', seo: 'Invoice' },
  zh: { eyebrow: '付款与发票', title: '注册发票', loading: '正在加载发票…', noInvoice: '目前尚无可用发票。', invoice: '发票', paid: '已付款', registrationNumber: '注册编号', participant: '参与者', delegatePackage: '代表套餐', paymentStatus: '付款状态', packageTotal: '套餐总额', paymentAmountGateway: '由支付网关显示', preparingPdf: '正在准备 PDF…', downloadPdf: '下载发票 PDF', finishProfile: '您的付款已完成。请完善个人资料，以便后端将此订单关联到您的注册并生成发票。', awaitingInvoice: '付款和注册确认后，您的发票将显示在此处。', mismatchProfile: '尚未找到与此次付款对应的发票。如果资料仍未完成，请先完善资料。', mismatch: '尚未找到与此次付款信息对应的发票。', completeExhibitor: '完善参展商资料', completeDelegate: '完善代表资料', checkStatus: '查看付款状态', goPayment: '前往付款', unavailable: '您的发票目前尚不可用。如果付款已确认，请联系活动主办方。', printError: '无法打开打印窗口。', exportError: '无法准备 PDF 导出，请重试。', invoiceSuffix: '发票', seo: '发票' }
} as const;
const copy = computed(() => locale.value === 'zh-CN' ? messages.zh : messages.en);
useSeoMeta({ title: () => `${copy.value.seo} | IWBIF 2026` });

const paymentApi = usePayment();
const { getMyInvoices, getInvoiceByRegistration } = paymentApi;
const registrationFlow = useRegistrationFlow();
const { getRegistration } = useRegistration();
const { getMyTickets } = useTicket();
const route = useRoute();
const invoice = ref<Invoice | null>(null);
const orderItems = ref<PendingOrderProductItem[]>([]);
const orderDetail = ref<OrderItem | null>(null);
const invoiceElement = ref<HTMLElement | null>(null);
const currentInvoice = useState<Invoice | null>('current-invoice', () => null);
const pending = ref(true);
const downloading = ref(false);
const errorMessage = ref('');
const pendingProfileType = computed(() => registrationFlow.profilePendingType.value);
const emptyInvoiceMessage = computed(() => pendingProfileType.value
  ? copy.value.finishProfile
  : copy.value.awaitingInvoice);
const hasInvoiceContext = computed(() => Boolean(
  getOrderIdFromQuery().trim() ||
  getRegistrationIdFromQuery().trim() ||
  (typeof window !== 'undefined' ? sessionStorage.getItem('iwbif-store-order-id') : '')
));
const contextMismatchMessage = computed(() => {
  if (!hasInvoiceContext.value) return '';
  return pendingProfileType.value
    ? copy.value.mismatchProfile
    : copy.value.mismatch;
});
const emptyInvoiceAction = computed(() => {
  if (pendingProfileType.value) return pendingProfileType.value === 'exhibitor' ? copy.value.completeExhibitor : copy.value.completeDelegate;
  if (hasInvoiceContext.value) return copy.value.checkStatus;
  return copy.value.goPayment;
});
const emptyInvoiceTo = computed(() => {
  if (pendingProfileType.value) return `/register/${pendingProfileType.value}`;
  if (hasInvoiceContext.value) return '/dashboard/payment-status';
  return '/dashboard/payment';
});
const LAST_REGISTRATION_KEY = 'last-paid-registration-id';
const CURRENT_INVOICE_KEY = 'current-invoice';
const getOrderIdFromQuery = () => {
  const queryValue = route.query.order_id ?? route.query.orderId ?? '';
  if (Array.isArray(queryValue)) return queryValue[0] || '';
  return typeof queryValue === 'string' ? queryValue : '';
};

const getRegistrationIdFromQuery = () => {
  const queryValue = route.query.registration_id ?? route.query.registrationId ?? '';
  if (Array.isArray(queryValue)) return queryValue[0] || '';
  return typeof queryValue === 'string' ? queryValue : '';
};

const rememberRegistration = (id: string) => {
  const trimmed = id.trim();
  if (!trimmed) return;
  sessionStorage.setItem(LAST_REGISTRATION_KEY, trimmed);
};

const matchesContext = (candidate: Invoice, orderId: string, registrationId: string) => {
  const normalizedOrderId = orderId.trim();
  const normalizedRegistrationId = registrationId.trim();
  if (!normalizedOrderId && !normalizedRegistrationId) return true;
  if (normalizedOrderId && candidate.order?.id === normalizedOrderId) return true;
  if (normalizedRegistrationId) {
    return candidate.registration?.id === normalizedRegistrationId
      || candidate.registration?.registration_number === normalizedRegistrationId;
  }
  return false;
};

const persistCurrentInvoice = (value: Invoice | null) => {
  if (!value) {
    currentInvoice.value = null;
    sessionStorage.removeItem(CURRENT_INVOICE_KEY);
    return;
  }
  currentInvoice.value = value;
  sessionStorage.setItem(CURRENT_INVOICE_KEY, JSON.stringify(value));
};

const amountCopy = computed(() => locale.value === 'zh-CN' ? {
  orderTotal: '订单总额', totalPaid: '已付总额', remaining: '剩余应付金额', unavailable: '金额暂不可用'
} : {
  orderTotal: 'Order total', totalPaid: 'Total paid', remaining: 'Remaining balance', unavailable: 'Amount unavailable'
});
const invoiceOrder = computed(() => orderDetail.value || invoice.value?.order);
const totalPaid = computed(() => {
  const order = invoiceOrder.value;
  if (!order) return null;
  // Use the backend aggregate, not the latest child payment of a split order.
  if (order.paid_amount != null) return order.paid_amount;
  if (order.status?.toLowerCase() === 'paid' || order.is_payment_complete === true) return order.total_amount;
  return null;
});
const money = (amount: number | null | undefined, currency?: string) => {
  if (amount == null || !Number.isFinite(Number(amount)) || !currency) return amountCopy.value.unavailable;
  return new Intl.NumberFormat(locale.value === 'zh-CN' ? 'zh-CN' : 'id-ID', { style: 'currency', currency }).format(Number(amount));
};
const loadInvoiceContext = async () => {
  if (!invoice.value?.order?.id) return;
  try {
    const detail = (await paymentApi.getOrderDetail(invoice.value.order.id)).data;
    if (detail.order.id !== invoice.value.order.id) return;
    orderItems.value = detail.items || [];
    orderDetail.value = { ...invoice.value.order, ...detail.order };
  } catch {
    // The invoice's saved order totals remain available if item lookup fails.
  }
};

const tryInvoiceByIdentifier = async (identifier: string) => {
  const trimmed = identifier.trim();
  if (!trimmed) return null;

  try {
    const response = await getInvoiceByRegistration(trimmed);
    rememberRegistration(trimmed);
    return response.data;
  } catch {
    try {
      const registrationResponse = await getRegistration(trimmed);
      const registrationNumber = registrationResponse.data.registration_number?.trim();
      if (!registrationNumber) return null;

      const response = await getInvoiceByRegistration(registrationNumber);
      rememberRegistration(registrationNumber);
      return response.data;
    } catch {
      return null;
    }
  }
};

onMounted(async () => {
  const queryOrderId = getOrderIdFromQuery() || sessionStorage.getItem('iwbif-store-order-id') || '';
  const queryRegistrationId = getRegistrationIdFromQuery();

  try {
    await registrationFlow.loadFlow(true);
  } catch {
    // Invoice lookup can still continue when progress bootstrap is unavailable.
  }
  invoice.value = currentInvoice.value;
  if (invoice.value && !matchesContext(invoice.value, queryOrderId, queryRegistrationId)) {
    invoice.value = null;
    persistCurrentInvoice(null);
  } else {
    try {
      const storedInvoice = sessionStorage.getItem(CURRENT_INVOICE_KEY);
      if (storedInvoice) invoice.value = JSON.parse(storedInvoice) as Invoice;
    } catch {
      sessionStorage.removeItem(CURRENT_INVOICE_KEY);
    }
  }
  if (invoice.value && !matchesContext(invoice.value, queryOrderId, queryRegistrationId)) {
    invoice.value = null;
    persistCurrentInvoice(null);
  }

  try {
    try {
      const response = await getMyInvoices();
      const invoices = normalizeInvoices(response.data);
      const matchedInvoice = queryOrderId
        ? invoices.find((item) => item.order.id === queryOrderId) || null
        : queryRegistrationId
          ? (invoices.find((item) => item.registration?.id === queryRegistrationId || item.registration?.registration_number === queryRegistrationId) || null)
          : null;
      if (matchedInvoice) {
        invoice.value = matchedInvoice;
      } else if (!queryOrderId && !queryRegistrationId) {
        const paidInvoice = invoices.find((item) => item.order.status?.toLowerCase() === 'paid') || null;
        invoice.value = paidInvoice || invoices[0] || null;
      } else {
        const fallbackInvoice = invoices.find((item) => matchesContext(item, queryOrderId, queryRegistrationId)) || null;
        if (fallbackInvoice) invoice.value = fallbackInvoice;
      }
    } catch {
      // Try the registration invoice endpoint using the user's ticket below.
    }

    if (!invoice.value) {
      if (queryRegistrationId) {
        invoice.value = await tryInvoiceByIdentifier(queryRegistrationId);
      }
    }

    if (!invoice.value) {
      const storedRegistrationId = sessionStorage.getItem(LAST_REGISTRATION_KEY);
      if (storedRegistrationId) {
        invoice.value = await tryInvoiceByIdentifier(storedRegistrationId);
      }
    }

    if (!invoice.value) {
      try {
        const tickets = await getMyTickets();
        const ticketItems = Array.isArray(tickets.data) ? tickets.data : [];
        const ticket = ticketItems[0];
        if (ticket) {
          invoice.value = await tryInvoiceByIdentifier(ticket.registration_id);
        }
      } catch {
        // Ticket-based fallback failed.
      }
    }

    if (invoice.value) {
      persistCurrentInvoice(invoice.value);
      if (invoice.value.registration?.id) rememberRegistration(invoice.value.registration.id);
      await loadInvoiceContext();
    }
  } catch {
    if (!invoice.value) {
      errorMessage.value = copy.value.unavailable;
    }
  } finally {
    pending.value = false;
  }
  if (!invoice.value) {
    persistCurrentInvoice(null);
  }
});

const formatDate = (value?: string | null) => value ? new Intl.DateTimeFormat(locale.value === 'zh-CN' ? 'zh-CN' : 'id-ID', { dateStyle: 'long', timeStyle: 'short' }).format(new Date(value)) : '-';

const downloadInvoice = async () => {
  if (!invoiceElement.value || !invoice.value) return;

  downloading.value = true;

  try {
    const printWindow = window.open('', '_blank', 'width=960,height=1200');
    if (!printWindow) throw new Error(copy.value.printError);

    const invoiceMarkup = invoiceElement.value.outerHTML;
    const closingScriptTag = '</scr' + 'ipt>';
    const invoiceTitle = `${invoice.value.registration.registration_number || invoice.value.order.order_number} ${copy.value.invoiceSuffix}`;

    printWindow.document.write(`
      <!doctype html>
      <html lang="${locale.value === 'zh-CN' ? 'zh-CN' : 'en'}">
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <title>${invoiceTitle}</title>
          <style>
            :root {
              color-scheme: light;
            }
            * {
              box-sizing: border-box;
            }
            body {
              margin: 0;
              padding: 32px;
              background: #eef4fb;
              color: #08111f;
              font-family: Arial, Helvetica, sans-serif;
            }
            .glass-card {
              max-width: 840px;
              margin: 0 auto;
              border: 1px solid #d7e2f0;
              border-radius: 28px;
              padding: 32px;
              background: #ffffff;
              box-shadow: 0 18px 48px rgba(8, 17, 31, 0.08);
            }
            .text-slate-400,
            .text-slate-500 {
              color: #5b6b80 !important;
            }
            .text-cyan-200,
            .text-cyan-200\\/70,
            .text-emerald-200,
            .text-emerald-300 {
              color: #0f766e !important;
            }
            .text-2xl,
            .text-lg,
            .font-semibold,
            .font-black {
              color: #08111f;
            }
            .bg-emerald-300\\/10 {
              background: #e6fffa !important;
            }
            .border-white\\/10 {
              border-color: #d7e2f0 !important;
            }
            .print\\:hidden,
            button,
            a {
              display: none !important;
            }
            dl {
              display: grid;
              grid-template-columns: repeat(2, minmax(0, 1fr));
              gap: 20px;
            }
            dt {
              font-size: 12px;
              letter-spacing: 0.18em;
              text-transform: uppercase;
            }
            dd {
              margin: 8px 0 0;
            }
            @media print {
              body {
                padding: 0;
                background: #ffffff;
              }
              .glass-card {
                max-width: none;
                border: none;
                border-radius: 0;
                box-shadow: none;
                padding: 0;
              }
            }
          </style>
        </head>
        <body>
          ${invoiceMarkup}
          <script>
            window.onload = () => {
              window.print();
            };
          ${closingScriptTag}
        </body>
      </html>
    `);
    printWindow.document.close();
  } catch {
    errorMessage.value = copy.value.exportError;
  } finally {
    downloading.value = false;
  }
};
</script>
