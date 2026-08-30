import type { useApi, ApiResponse } from '~/composables/useApi';
import { getPaymentProviderConfig } from '~/config/payment';

export interface PaymentReportSummary {
  total_transactions: number;
  successful_transactions: number;
  pending_transactions: number;
  failed_transactions: number;
  expired_transactions: number;
  gross_revenue: number;
  pending_amount: number;
  currency: string;
}

export interface PaymentReportMetric {
  label: string;
  amount: number;
}

export interface PaymentReportTransaction {
  id?: string;
  payment_id?: string;
  order_id?: string;
  order_number?: string;
  order_status?: string;
  participant_name?: string;
  customer_email?: string;
  package_name?: string;
  channel_code?: string;
  provider?: string;
  provider_order_id?: string | null;
  provider_transaction_id?: string | null;
  transaction_status?: string;
  status?: string;
  gross_amount?: number;
  payment_sequence?: number | null;
  payment_sequence_count?: number | null;
  payment_amount?: number | null;
  paid_amount?: number;
  remaining_amount?: number;
  is_payment_complete?: boolean;
  provider_reference_no?: string | null;
  currency?: string;
  paid_at?: string | null;
  created_at?: string | null;
  expires_at?: string | null;
  deleted_at?: string | null;
  deleted_by?: string | null;
  deletion_reason?: string | null;
  allowed_actions?: Array<'paid' | 'success' | 'canceled' | 'delete'>;
  payment_proof_count?: number;
  payment_proofs?: Array<{ id: string; file_name?: string; original_filename?: string; download_url: string; created_at?: string }>;
}

export type AdminTransactionResponse = PaymentReportResponse;

export interface TransactionMutationResult {
  order?: Record<string, unknown>;
  payment?: PaymentReportTransaction;
  payment_id?: string;
  order_id?: string;
  deleted_at?: string | null;
  allowed_actions?: PaymentReportTransaction['allowed_actions'];
}

export interface BulkTransactionResult {
  action: 'paid' | 'success' | 'canceled' | 'delete';
  processed: number;
  transactions: PaymentReportTransaction[];
}

export interface PaymentReportResponse {
  summary: PaymentReportSummary;
  by_status: PaymentReportMetric[];
  by_channel: PaymentReportMetric[];
  by_package: PaymentReportMetric[];
  daily_revenue: Array<{ date: string; amount: number }>;
  transactions: PaymentReportTransaction[];
}

export interface ManualPaymentConfirmPayload {
  payment_method: 'manual_transfer' | 'manual_qr_code';
  transfer_reference: string;
  notes?: string | null;
  paid_at?: string | null;
}

export interface ParticipantReportPackage {
  event_id: string;
  package_id: string;
  package_code?: string;
  package_name?: string;
  package_type?: string;
  quantity?: number;
  unit_price?: number;
  line_total?: number;
  currency?: string;
  order_id?: string;
  order_number?: string;
  order_status?: string;
  payment_id?: string | null;
  payment_status?: string | null;
  payment_provider?: string | null;
  paid_at?: string | null;
}

export interface ParticipantReportItem {
  participant_id: string;
  user_id?: string;
  full_name?: string;
  email?: string;
  phone?: string;
  country?: string;
  organization_name?: string;
  registration_status?: string;
  packages: ParticipantReportPackage[];
}

export function useAdminReport() {
  const api = useNuxtApp().$api as ReturnType<typeof useApi>;
  const paymentProvider = getPaymentProviderConfig();

  const getReport = (params: Record<string, string | number | undefined> = {}) => {
    const query = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value === undefined || value === null || value === '') return;
      query.append(key, String(value));
    });

    const suffix = query.toString() ? `?${query.toString()}` : '';
    const reportPath = paymentProvider.isMidtrans
      ? '/admin/reports/payments/midtrans'
      : '/admin/reports/payments';
    return api<ApiResponse<PaymentReportResponse>>(`${reportPath}${suffix}`);
  };

  const buildQuery = (params: Record<string, string | number | boolean | undefined>) => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value === undefined || value === '') return;
      query.append(key, String(value));
    });
    return query.toString() ? `?${query.toString()}` : '';
  };

  const getAdminTransactions = (params: Record<string, string | number | boolean | undefined> = {}) =>
    api<ApiResponse<AdminTransactionResponse>>(`/admin/transactions${buildQuery(params)}`);

  const updateTransactionStatus = (paymentId: string, payload: { status: 'paid' | 'success' | 'canceled'; notes: string; paid_at?: string | null }) =>
    api<ApiResponse<TransactionMutationResult>>(`/admin/transactions/${encodeURIComponent(paymentId)}/status`, {
      method: 'PATCH',
      body: payload
    });

  const deleteTransaction = (paymentId: string) =>
    api<ApiResponse<TransactionMutationResult>>(`/admin/transactions/${encodeURIComponent(paymentId)}`, { method: 'DELETE' });

  const bulkTransactionAction = (payload: { payment_ids: string[]; action: 'paid' | 'success' | 'canceled' | 'delete'; notes: string; paid_at?: string | null }) =>
    api<ApiResponse<BulkTransactionResult>>('/admin/transactions/bulk-actions', { method: 'POST', body: payload });

  const confirmManualPayment = (orderId: string, payload: ManualPaymentConfirmPayload) =>
    api<ApiResponse<Record<string, unknown>>>(`/admin/orders/${encodeURIComponent(orderId)}/confirm-manual-payment`, {
      method: 'POST',
      body: payload
    });

  const getManualPaymentReport = (params: Record<string, string | number | undefined> = {}) => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => { if (value !== undefined && value !== '') query.append(key, String(value)); });
    const suffix = query.toString() ? `?${query.toString()}` : '';
    return api<ApiResponse<PaymentReportResponse>>(`/admin/reports/payments/manual${suffix}`);
  };
  const downloadManualProof = (proofId: string) => api<Blob>(`/payments/manual-proofs/${encodeURIComponent(proofId)}/download`, { responseType: 'blob' });

  const getParticipantReport = (params: Record<string, string | number | undefined> = {}) => {
    const query = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value === undefined || value === null || value === '') return;
      query.append(key, String(value));
    });

    const suffix = query.toString() ? `?${query.toString()}` : '';
    return api<ApiResponse<ParticipantReportItem[]>>(`/admin/reports/participants${suffix}`);
  };

  return {
    getReport,
    getAdminTransactions,
    updateTransactionStatus,
    deleteTransaction,
    bulkTransactionAction,
    confirmManualPayment,
    getManualPaymentReport,
    downloadManualProof,
    getParticipantReport,
    isMidtransReport: paymentProvider.isMidtrans
  };
}
