import { useApi, type ApiResponse } from '~/composables/useApi';

export interface MidtransTransaction {
  snap_token: string;
  redirect_url: string;
}

export interface OrderItem {
  id: string;
  registration_id: string;
  order_number: string;
  subtotal: number;
  discount_amount: number;
  tax_amount: number;
  service_fee: number;
  total_amount: number;
  currency: string;
  status: string;
  expires_at?: string;
}

export interface PaymentItem {
  id: string;
  order_id: string;
  provider: string;
  provider_transaction_id?: string | null;
  provider_order_id?: string | null;
  payment_type?: string | null;
  gross_amount: number;
  currency: string;
  transaction_status: string;
  fraud_status?: string | null;
  paid_at?: string | null;
}

export function usePayment() {
  const api = useNuxtApp().$api as ReturnType<typeof useApi>;

  const createMidtransTransaction = (registrationId: string) =>
    api<ApiResponse<MidtransTransaction>>('/payments/midtrans/create', {
      method: 'POST',
      body: { registration_id: registrationId }
    });

  const getOrder = (orderId: string) => api<ApiResponse<OrderItem>>(`/orders/${orderId}`);

  const getPayment = (paymentId: string) => api<ApiResponse<PaymentItem>>(`/payments/${paymentId}`);

  return {
    createMidtransTransaction,
    getOrder,
    getPayment
  };
}
