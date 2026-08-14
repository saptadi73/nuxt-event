import { useApi, type ApiResponse } from '~/composables/useApi';

export interface DokuCheckoutData {
  payment_url: string;
  token: string | null;
  expires_at: string | null;
  already_paid: boolean;
  payment_id: string | null;
  order_status: 'draft' | 'pending' | 'paid' | 'expired' | 'canceled';
  requires_payment: boolean;
}

export interface OrderItem {
  id: string; registration_id: string; order_number: string; subtotal: number;
  discount_amount: number; tax_amount: number; service_fee: number;
  total_amount: number; currency: string; status: string; expires_at?: string;
}

export interface PaymentItem {
  id: string; order_id: string; provider: string;
  provider_transaction_id?: string | null; provider_order_id?: string | null;
  payment_type?: string | null; gross_amount: number; currency: string;
  transaction_status: 'created' | 'pending' | 'success' | 'failed' | 'expired' | string;
  fraud_status?: string | null; paid_at?: string | null;
}

export interface Invoice {
  registration: { id: string; registration_number: string; status: string; event_name: string; ticket_type_name: string | null; delegate_package_name?: string | null; confirmed_at?: string | null };
  participant: { full_name: string; organization_name?: string | null; email: string };
  order: OrderItem;
  payment: PaymentItem;
}

export type InvoiceResponseData = Invoice[] | Invoice | { items: Invoice[] } | { data: Invoice[] } | { data: Invoice } | { items: Invoice[]; data: Invoice[] };

export const normalizeInvoices = (data: InvoiceResponseData): Invoice[] => {
  if (!data) return [];
  const candidate = data as { data?: Invoice | Invoice[] | null; items?: Invoice[] | null; registration?: unknown; order?: unknown; payment?: unknown };
  if (Array.isArray(data)) return data;
  if (Array.isArray(candidate.items)) return candidate.items;
  if (candidate.data) {
    if (Array.isArray(candidate.data)) return candidate.data;
    if ('registration' in candidate.data && 'order' in candidate.data && 'payment' in candidate.data) return [candidate.data];
  }
  if ('registration' in candidate && 'order' in candidate && 'payment' in candidate) return [candidate as Invoice];
  return [];
};

export function usePayment() {
  const api = useNuxtApp().$api as ReturnType<typeof useApi>;
  const createDokuCheckout = (registrationId: string) => api<ApiResponse<DokuCheckoutData>>('/payments/doku/checkout', { method: 'POST', body: { registration_id: registrationId } });
  const getOrder = (orderId: string) => api<ApiResponse<OrderItem>>(`/orders/${orderId}`);
  const getPayment = (paymentId: string) => api<ApiResponse<PaymentItem>>(`/payments/${paymentId}`);
  const getMyInvoices = () => api<ApiResponse<InvoiceResponseData>>('/payments/me/invoices');
  const getInvoiceByRegistration = (registrationId: string) => api<ApiResponse<Invoice>>(`/payments/registrations/${encodeURIComponent(registrationId)}/invoice`);
  return { createDokuCheckout, getOrder, getPayment, getMyInvoices, getInvoiceByRegistration };
}
