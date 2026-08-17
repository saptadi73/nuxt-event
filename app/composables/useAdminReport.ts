import { useApi, type ApiResponse } from '~/composables/useApi';

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
  order_number?: string;
  participant_name?: string;
  package_name?: string;
  channel_code?: string;
  provider?: string;
  transaction_status?: string;
  status?: string;
  gross_amount?: number;
}

export interface PaymentReportResponse {
  summary: PaymentReportSummary;
  by_status: PaymentReportMetric[];
  by_channel: PaymentReportMetric[];
  by_package: PaymentReportMetric[];
  daily_revenue: Array<{ date: string; amount: number }>;
  transactions: PaymentReportTransaction[];
}

export function useAdminReport() {
  const api = useNuxtApp().$api as ReturnType<typeof useApi>;

  const getReport = (params: Record<string, string | number | undefined> = {}) => {
    const query = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value === undefined || value === null || value === '') return;
      query.append(key, String(value));
    });

    const suffix = query.toString() ? `?${query.toString()}` : '';
    return api<ApiResponse<PaymentReportResponse>>(`/admin/reports/payments${suffix}`);
  };

  return { getReport };
}
