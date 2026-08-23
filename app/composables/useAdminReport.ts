import { useApi, type ApiResponse } from '~/composables/useApi';
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
  id: string;
  payment_id?: string;
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
  currency?: string;
  paid_at?: string | null;
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

  const confirmManualPayment = (orderId: string, payload: ManualPaymentConfirmPayload) =>
    api<ApiResponse<Record<string, unknown>>>(`/admin/orders/${encodeURIComponent(orderId)}/confirm-manual-payment`, {
      method: 'POST',
      body: payload
    });

  return { getReport, confirmManualPayment, isMidtransReport: paymentProvider.isMidtrans };
}
