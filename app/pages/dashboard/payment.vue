<template>
  <section class="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
    <div class="glass-card rounded-[2rem] p-6">
      <p class="text-sm uppercase tracking-[0.3em] text-cyan-200/70">Midtrans</p>
      <h1 class="mt-3 text-4xl font-bold text-white">Payment</h1>
      <p class="mt-3 text-slate-300">
        Create or continue your payment securely. Your registration is identified automatically from your account.
      </p>

      <div v-if="checking" class="mt-8 text-slate-300">Checking your payment status...</div>
      <div v-else-if="hasPaidInvoice" class="mt-8 space-y-3 rounded-2xl border border-emerald-300/20 bg-emerald-300/5 p-5 text-slate-200">
        <p class="text-lg font-semibold text-emerald-300">Thank you, your payment has been received.</p>
        <p>Your registration is confirmed. You can download your invoice from the Invoice dashboard.</p>
        <NuxtLink :to="`/dashboard/invoice?registration_id=${registrationId}`" class="inline-flex rounded-full bg-cyan-400 px-5 py-3 font-semibold text-slate-950">Go to invoice dashboard</NuxtLink>
      </div>
      <form v-else class="mt-8" @submit.prevent="create">
        <button
          class="rounded-full bg-cyan-400 px-6 py-3 text-sm font-semibold text-slate-950 disabled:cursor-not-allowed disabled:opacity-60"
          :disabled="submitting"
        >
          {{ submitting ? 'Preparing payment...' : 'Proceed to payment' }}
        </button>
      </form>

      <div v-if="result && !result.already_paid" class="mt-8 space-y-3 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-200">
        <p class="text-white font-semibold">Your payment is ready to continue.</p>
        <a v-if="result.redirect_url" :href="result.redirect_url" class="inline-flex rounded-full bg-cyan-400 px-5 py-3 font-semibold text-slate-950">Continue to payment</a>
      </div>
      <p v-if="errorMessage" class="mt-5 rounded-2xl border border-red-400/30 bg-red-950/30 p-4 text-sm text-red-100">
        {{ errorMessage }}
      </p>
    </div>
  </section>
</template>

<script setup lang="ts">
import { normalizeInvoices, usePayment, type Invoice } from '~/composables/usePayment';
import { useRegistration } from '~/composables/useRegistration';

definePageMeta({ middleware: 'auth' });

const { createMidtransTransaction, getMyInvoices, getInvoiceByRegistration } = usePayment();
const { getRegistration, getMyRegistrations } = useRegistration();
const { getMyTickets } = useTicket();

const submitting = ref(false);
const checking = ref(true);
const hasPaidInvoice = ref(false);
const result = ref<Awaited<ReturnType<typeof createMidtransTransaction>>['data'] | null>(null);
const errorMessage = ref('');
const registrationId = ref('');
const currentInvoice = useState<Invoice | null>('current-invoice', () => null);
const LAST_REGISTRATION_KEY = 'last-paid-registration-id';

const rememberInvoice = (invoice: Invoice) => {
  currentInvoice.value = invoice;
  sessionStorage.setItem('current-invoice', JSON.stringify(invoice));
  if (invoice.registration?.id) {
    sessionStorage.setItem(LAST_REGISTRATION_KEY, invoice.registration.id);
  }
};

const rememberRegistration = (id: string) => {
  const trimmed = id.trim();
  if (!trimmed) return;
  sessionStorage.setItem(LAST_REGISTRATION_KEY, trimmed);
};

const loadInvoiceFromIdentifier = async (identifier: string) => {
  const trimmed = identifier.trim();
  if (!trimmed) return null;

  try {
    const response = await getInvoiceByRegistration(trimmed);
    return response.data;
  } catch {
    try {
      const registrationResponse = await getRegistration(trimmed);
      const registrationNumber = registrationResponse.data.registration_number?.trim();
      if (!registrationNumber) return null;
      const response = await getInvoiceByRegistration(registrationNumber);
      return response.data;
    } catch {
      return null;
    }
  }
};

const create = async () => {
  submitting.value = true;
  result.value = null;
  errorMessage.value = '';

  try {
    const response = await createMidtransTransaction(registrationId.value || undefined);
    result.value = response.data;
    hasPaidInvoice.value = response.data.already_paid || response.data.order_status === 'paid';
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'Payment could not be created.';
  } finally {
    submitting.value = false;
  }
};

onMounted(async () => {
  try {
    try {
      const registrationResponse = await getMyRegistrations();
      const registrations = Array.isArray(registrationResponse.data) ? registrationResponse.data : [];
      const activeRegistration = registrations.find((item) => ['awaiting_payment', 'draft', 'payment_pending'].includes(item.status))
        || registrations[0];

      if (activeRegistration) {
        registrationId.value = activeRegistration.id;
        rememberRegistration(activeRegistration.id);
      }
    } catch {
      // Continue with invoice and ticket fallbacks below.
    }

    try {
      const response = await getMyInvoices();
      const invoices = normalizeInvoices(response.data);
      const paidInvoice = invoices.find((item) => item.order.status?.toLowerCase() === 'paid');
      if (paidInvoice) {
        registrationId.value = paidInvoice.registration.id;
        hasPaidInvoice.value = true;
        rememberInvoice(paidInvoice);
      }
    } catch {
      // Continue with the ticket-based lookup below.
    }

    if (!hasPaidInvoice.value) {
      try {
        const response = await getMyTickets();
        const tickets = Array.isArray(response.data) ? response.data : [];
        const ticket = tickets[0];
        if (!ticket) return;

        if (!registrationId.value) {
          registrationId.value = ticket.registration_id;
          rememberRegistration(ticket.registration_id);
        }

        const invoiceData = await loadInvoiceFromIdentifier(ticket.registration_id);
        if (invoiceData) {
          hasPaidInvoice.value = invoiceData.order.status?.toLowerCase() === 'paid';
          if (hasPaidInvoice.value) rememberInvoice(invoiceData);
        } else {
          // Tickets are issued only after successful payment.
          hasPaidInvoice.value = ticket.status === 'issued' || ticket.status === 'used';
        }
      } catch {
        // No paid registration was found; keep the payment action available.
      }
    }
    if (registrationId.value) rememberRegistration(registrationId.value);
  } finally {
    checking.value = false;
  }
});
</script>
