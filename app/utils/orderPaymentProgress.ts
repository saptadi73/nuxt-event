import type { OrderItem, PaymentItem, PendingOrderRecord } from '../composables/usePayment';

type PaymentOrder = Partial<Pick<OrderItem, 'status' | 'total_amount' | 'currency' | 'paid_amount' | 'remaining_amount' | 'is_payment_complete' | 'payment_sequence_count'>>;

export function isOrderFullyPaid(order?: PaymentOrder | null): boolean {
  if (!order || order.is_payment_complete === false || Number(order.remaining_amount) > 0) return false;
  return order.status?.toLowerCase() === 'paid' || order.is_payment_complete === true;
}

// Order detail returns progress beside `order`, not inside it.
export function normalizeOrderDetail(detail: PendingOrderRecord): PendingOrderRecord {
  return { ...detail, order: {
    ...detail.order,
    ...(detail.paid_amount != null ? { paid_amount: detail.paid_amount } : {}),
    ...(detail.remaining_amount != null ? { remaining_amount: detail.remaining_amount } : {}),
    ...(detail.is_payment_complete != null ? { is_payment_complete: detail.is_payment_complete } : {})
  } };
}

export function orderPaymentProgress(order: PaymentOrder, attempts: PaymentItem[] = []) {
  const total = Math.max(0, Number(order.total_amount) || 0);
  const successful = new Map<number | string, PaymentItem>();
  for (const payment of attempts) {
    if (payment.transaction_status === 'success') successful.set(payment.payment_sequence ?? payment.id, payment);
  }
  const settled = [...successful.values()].reduce((sum, payment) => sum + Number(payment.gross_amount), 0);
  const complete = isOrderFullyPaid(order);
  const paid = Math.min(total, Math.max(0, Number(order.paid_amount ?? (complete ? total : settled)) || 0));
  const remaining = Math.max(0, Number(order.remaining_amount ?? total - paid) || 0);
  // The organizer's current split rule is IDR 9 million per logical part.
  const count = Math.max(1, order.payment_sequence_count || 0, ...attempts.map(p => p.payment_sequence_count || 0), order.currency === 'IDR' ? Math.ceil(total / 9_000_000) : 1);
  const parts = Array.from({ length: count }, (_, index) => {
    const sequence = index + 1;
    const amount = count === 1 ? total : Math.max(0, Math.min(9_000_000, total - index * 9_000_000));
    const payments = attempts.filter(p => p.payment_sequence === sequence || (count === 1 && p.payment_sequence == null));
    const success = payments.find(p => p.transaction_status === 'success');
    const latest = payments[0];
    const status = complete || success ? 'paid' : latest?.transaction_status || 'not_started';
    return { sequence, amount, status };
  });
  return { total, paid, remaining, complete, count, parts, completedParts: parts.filter(part => part.status === 'paid').length };
}
