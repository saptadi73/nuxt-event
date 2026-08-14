<template>
  <section class="mx-auto max-w-4xl px-4 py-12 sm:px-6">
    <p class="text-sm uppercase tracking-[.35em] text-cyan-200">Payment and Invoice</p>
    <h1 class="mt-3 text-4xl font-black">Registration invoice</h1>

    <div v-if="pending" class="glass-card mt-8 rounded-[2rem] p-7 text-slate-300">Loading invoice...</div>
    <div v-else-if="errorMessage" class="mt-8 rounded-3xl border border-red-400/30 bg-red-950/30 p-6 text-red-100">{{ errorMessage }}</div>
    <div v-else-if="!invoice" class="glass-card mt-8 rounded-[2rem] p-7">
      <p class="text-lg font-semibold">No invoice is available yet.</p>
      <p class="mt-2 text-slate-400">Your invoice will appear after your payment has been confirmed.</p>
      <NuxtLink to="/dashboard/payment" class="mt-6 inline-flex rounded-full bg-cyan-400 px-5 py-3 font-semibold text-slate-950">Go to payment</NuxtLink>
    </div>
    <article v-else id="invoice" ref="invoiceElement" class="glass-card mt-8 rounded-[2rem] p-7">
      <div class="flex flex-wrap justify-between gap-5 border-b border-white/10 pb-6">
        <div><p class="text-sm text-slate-400">{{ invoice.registration.event_name }}</p><p class="mt-1 font-semibold">Invoice {{ invoice.order.order_number }}</p></div>
        <span class="h-fit rounded-full bg-emerald-300/10 px-4 py-2 text-xs font-semibold uppercase tracking-[.2em] text-emerald-200">Paid</span>
      </div>
      <dl class="mt-6 grid gap-5 sm:grid-cols-2">
        <div><dt class="text-xs uppercase tracking-[.2em] text-slate-500">Registration number</dt><dd class="mt-2 text-lg font-semibold">{{ invoice.registration.registration_number }}</dd></div>
        <div><dt class="text-xs uppercase tracking-[.2em] text-slate-500">Participant</dt><dd class="mt-2 text-lg font-semibold">{{ invoice.participant.full_name }}</dd><p class="text-sm text-slate-400">{{ invoice.participant.email }}</p></div>
        <div><dt class="text-xs uppercase tracking-[.2em] text-slate-500">Delegate package</dt><dd class="mt-2 text-lg font-semibold">{{ invoice.registration.delegate_package_name || invoice.registration.ticket_type_name || '-' }}</dd></div>
        <div><dt class="text-xs uppercase tracking-[.2em] text-slate-500">Payment status</dt><dd class="mt-2 text-lg font-semibold text-emerald-300">Paid</dd><p class="text-sm text-slate-400">{{ formatDate(invoice.payment.paid_at) }}</p></div>
      </dl>
      <div class="mt-7 flex items-center justify-between border-t border-white/10 pt-6"><span class="text-slate-400">Total paid</span><strong class="text-2xl text-cyan-200">{{ formatCurrency(invoice.order.total_amount, invoice.order.currency) }}</strong></div>
      <button class="mt-7 rounded-full bg-cyan-400 px-5 py-3 font-semibold text-slate-950 disabled:cursor-not-allowed disabled:opacity-60 print:hidden" :disabled="downloading" @click="downloadInvoice">{{ downloading ? 'Preparing PDF...' : 'Download invoice PDF' }}</button>
    </article>
  </section>
</template>

<script setup lang="ts">
import { normalizeInvoices, usePayment, type Invoice } from '~/composables/usePayment';
import { useRegistration } from '~/composables/useRegistration';
import { useTicket } from '~/composables/useTicket';

definePageMeta({ middleware: 'auth' });
useSeoMeta({ title: 'Invoice | IWBIF 2026' });

const { getMyInvoices, getInvoiceByRegistration } = usePayment();
const { getRegistration } = useRegistration();
const { getMyTickets } = useTicket();
const route = useRoute();
const invoice = ref<Invoice | null>(null);
const invoiceElement = ref<HTMLElement | null>(null);
const currentInvoice = useState<Invoice | null>('current-invoice', () => null);
const pending = ref(true);
const downloading = ref(false);
const errorMessage = ref('');
const LAST_REGISTRATION_KEY = 'last-paid-registration-id';

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
  const queryRegistrationId = getRegistrationIdFromQuery();
  invoice.value = currentInvoice.value;
  if (!invoice.value) {
    try {
      const storedInvoice = sessionStorage.getItem('current-invoice');
      if (storedInvoice) invoice.value = JSON.parse(storedInvoice) as Invoice;
    } catch {
      sessionStorage.removeItem('current-invoice');
    }
  }

  try {
    try {
      const response = await getMyInvoices();
      const invoices = normalizeInvoices(response.data);
      const fetchedInvoice = invoices.find((item) => item.order.status?.toLowerCase() === 'paid') || invoices[0] || null;
      if (fetchedInvoice) invoice.value = fetchedInvoice;
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
      currentInvoice.value = invoice.value;
      sessionStorage.setItem('current-invoice', JSON.stringify(invoice.value));
      if (invoice.value.registration?.id) rememberRegistration(invoice.value.registration.id);
    }
  } catch (error) {
    if (!invoice.value) {
      errorMessage.value = 'Your invoice is not available yet. Please contact the event organizer if your payment has already been confirmed.';
    }
  } finally {
    pending.value = false;
  }
});

const formatCurrency = (amount: number, currency: string) => new Intl.NumberFormat('id-ID', { style: 'currency', currency }).format(amount);
const formatDate = (value?: string | null) => value ? new Intl.DateTimeFormat('id-ID', { dateStyle: 'long', timeStyle: 'short' }).format(new Date(value)) : '-';

const downloadInvoice = async () => {
  if (!invoiceElement.value || !invoice.value) return;

  downloading.value = true;

  try {
    const printWindow = window.open('', '_blank', 'width=960,height=1200');
    if (!printWindow) throw new Error('Unable to open print window.');

    const invoiceMarkup = invoiceElement.value.outerHTML;
    const invoiceTitle = `${invoice.value.registration.registration_number || invoice.value.order.order_number} Invoice`;

    printWindow.document.write(`
      <!doctype html>
      <html lang="en">
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
          <\/script>
        </body>
      </html>
    `);
    printWindow.document.close();
  } catch {
    errorMessage.value = 'The PDF export could not be prepared. Please try again.';
  } finally {
    downloading.value = false;
  }
};
</script>
