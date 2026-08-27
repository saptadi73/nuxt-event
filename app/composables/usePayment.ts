import type { useApi, ApiResponse } from '~/composables/useApi';
import { getPaymentProviderConfig, normalizePaymentProvider } from '../config/payment';

export interface DokuCheckoutData {
  payment_url: string;
  token: string | null;
  expires_at: string | null;
  already_paid: boolean;
  payment_id: string | null;
  order_status: 'draft' | 'pending' | 'paid' | 'expired' | 'canceled';
  requires_payment: boolean;
}

export type PaymentCategory = 'virtual_account' | 'qris' | 'e_wallet' | 'direct_debit' | string;
export interface PaymentMethod { id: string; provider: string; code: string; category: PaymentCategory; display_name: string; logo_url: string | null; sort_order: number; }
export interface DirectPaymentMethods { virtual_accounts: string[]; qris: boolean; }
export interface DirectVaData { payment_id: string; order_id: string; order_number: string; status: string; bank_code: string; virtual_account_no: string; amount: number; currency: string; expires_at: string | null; instructions_url: string | null; }
export interface DirectQrisData { payment_id: string; order_id: string; order_number: string; status: string; qr_content: string; amount: number; currency: string; expires_at: string | null; }
export interface DirectDebitBindingData { binding_id: string; channel_code: string; status: string; redirect_url: string | null; }
export interface DirectDebitPaymentData { payment_id: string; order_id: string; partner_reference_no: string; status: string; redirect_url: string | null; requires_otp?: boolean; }

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

export type ManualPaymentMethod = 'manual_transfer' | 'manual_qr_code';
export interface ManualPaymentProof {
  id: string; payment_id?: string; file_name?: string; original_filename?: string;
  content_type?: string; file_size?: number; transfer_reference?: string | null;
  notes?: string | null; created_at?: string; download_url?: string;
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
  const runtimeProvider = getPaymentProviderConfig();
  const getPaymentMethods = () => api<ApiResponse<PaymentMethod[]>>('/payments/methods');
  const getDirectPaymentMethods = () => api<ApiResponse<DirectPaymentMethods>>('/payments/doku/direct/methods');
  const createDirectVa = (registrationId: string, bankCode: string) => api<ApiResponse<DirectVaData>>('/payments/doku/direct/va', { method: 'POST', body: { registration_id: registrationId, bank_code: bankCode } });
  const createDirectQris = (registrationId: string) => api<ApiResponse<DirectQrisData>>('/payments/doku/direct/qris', { method: 'POST', body: { registration_id: registrationId } });
  const createDirectDebitBinding = (registrationId: string, channelCode: string, phoneNo: string, deviceId?: string) => api<ApiResponse<DirectDebitBindingData>>('/payments/doku/snap/direct-debit/bindings', { method: 'POST', body: { registration_id: registrationId, channel_code: channelCode, phone_no: phoneNo, ...(deviceId ? { device_id: deviceId } : {}) } });
  const createDirectDebitPayment = (registrationId: string, bindingId: string) => api<ApiResponse<DirectDebitPaymentData>>('/payments/doku/snap/direct-debit/payment', { method: 'POST', body: { registration_id: registrationId, binding_id: bindingId } });
  const submitDirectDebitOtp = (paymentId: string, bindingId: string, otp: string) => api<ApiResponse<DirectDebitPaymentData>>(`/payments/doku/snap/direct-debit/payment/${encodeURIComponent(paymentId)}/otp`, { method: 'POST', body: { binding_id: bindingId, otp } });
  const createDokuCheckout = (orderId: string) => api<ApiResponse<DokuCheckoutData>>('/payments/doku/checkout', { method: 'POST', body: { order_id: orderId } });
  const createMidtransCheckout = (orderId: string) => api<ApiResponse<DokuCheckoutData>>('/payments/midtrans/checkout', { method: 'POST', body: { order_id: orderId } });
  const createCheckout = (orderId: string) => {
    if (runtimeProvider.isMidtrans) return createMidtransCheckout(orderId);
    return createDokuCheckout(orderId);
  };
  const getOrder = (orderId: string) => api<ApiResponse<OrderItem>>(`/orders/${orderId}`);
  const getPayment = (paymentId: string) => api<ApiResponse<PaymentItem>>(`/payments/${paymentId}`);
  const uploadManualProof = (orderId: string, paymentMethod: ManualPaymentMethod, file: File, transferReference?: string, notes?: string) => {
    const body = new FormData();
    body.append('payment_method', paymentMethod);
    if (transferReference) body.append('transfer_reference', transferReference);
    if (notes) body.append('notes', notes);
    body.append('file', file);
    return api<ApiResponse<ManualPaymentProof>>(`/payments/orders/${encodeURIComponent(orderId)}/manual-proof`, { method: 'POST', body });
  };
  const getManualProofs = (orderId: string) => api<ApiResponse<ManualPaymentProof[]>>(`/payments/orders/${encodeURIComponent(orderId)}/manual-proofs`);
  const getMyInvoices = () => api<ApiResponse<InvoiceResponseData>>('/payments/me/invoices');
  const getInvoiceByRegistration = (registrationId: string) => api<ApiResponse<Invoice>>(`/payments/registrations/${encodeURIComponent(registrationId)}/invoice`);
  return {
    paymentProvider: runtimeProvider.provider,
    paymentProviderLabel: runtimeProvider.label,
    isMidtransProvider: runtimeProvider.isMidtrans,
    isDokuProvider: runtimeProvider.isDoku,
    getPaymentMethods,
    getDirectPaymentMethods,
    createDirectVa,
    createDirectQris,
    createDirectDebitBinding,
    createDirectDebitPayment,
    submitDirectDebitOtp,
    createDokuCheckout,
    createMidtransCheckout,
    createCheckout,
    getOrder,
    getPayment,
    uploadManualProof,
    getManualProofs,
    getMyInvoices,
    getInvoiceByRegistration,
    normalizePaymentProvider
  };
}
