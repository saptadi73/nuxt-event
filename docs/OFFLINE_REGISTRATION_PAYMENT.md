# Offline Registration Payment and Ticket Issuance

## Purpose

An already registered participant may pay outside the platform by cash, bank
transfer, static QR, EDC, or another approved offline channel. Only an
admin/organizer records this payment. The payment is attached to the participant's
main registration order and a ticket is issued after full reconciliation.

## Endpoint

```http
POST /api/v1/admin/registrations/{registration_id}/offline-payments
Authorization: Bearer <admin-or-organizer-token>
Content-Type: application/json
```

```json
{
  "payment_method": "cash",
  "amount": 7500000,
  "currency": "IDR",
  "receipt_number": "CASH-IWBIF-2026-00125",
  "paid_at": "2026-08-30T15:30:00+07:00",
  "notes": "Cash received at the event secretariat"
}
```

Supported methods are `cash`, `manual_transfer`, `manual_qr_code`, `edc`, and
`other_offline`. `amount` may be omitted; the backend then uses the exact
outstanding balance. If supplied, it must equal `remaining_amount`. This endpoint
is deliberately a full-settlement operation so that its successful response can
safely include a ticket.

## Reconciliation and coexistence with gateway payments

The backend locks the registration, resolves its main order, and creates that
order from the registered main-package snapshot only if a legacy registration
has no order. It then calculates:

```text
remaining_amount = main_order.total_amount - successful_payment_aggregate
```

Previously successful Midtrans/DOKU parts remain credited. The offline payment
covers only the remainder. Overpayment and underpayment are rejected. Additional
package orders are never selected as the main order and cannot make the core
registration eligible.

## Idempotency and audit

- `receipt_number` is globally unique and normalized to uppercase.
- Retrying the same receipt for the same registration returns the existing
  payment/ticket and does not create a second financial record.
- Reusing the receipt for another registration returns
  `OFFLINE_RECEIPT_ALREADY_USED`.
- The payment stores `confirmed_by`, `offline_receipt_number`, `paid_at`, method,
  amount, notes, and a `PaymentWebhookEvent` audit record.
- A successful payment is not hard-deleted; correction must use the established
  financial cancellation/refund process.

## Ticket behavior

After reconciliation confirms the main order is `paid`, the backend returns the
existing ticket or issues one. Ticket issuance is idempotent because a
registration can have only one active ticket record. A payment failure never
renders a ticket.

## Response

The response contains the canonical platform `order`, the offline `payment`, and
the `ticket`. Frontend/admin UI should render the ticket only from this successful
response or a subsequent ticket query.

## Legacy endpoint distinction

`POST /api/v1/admin/orders/{order_id}/confirm-manual-payment` remains available
for compatibility. The new registration endpoint is preferred for walk-in cash
and assisted payment because it resolves the main order, calculates gateway
credits, enforces a unique receipt, and returns the ticket.

## Production

Apply Alembic revision `202608300040`. Verify the receipt unique constraint and
`confirmed_by` foreign key, then smoke-test cash with no prior payment, cash after
a partial gateway payment, duplicate receipt retry, receipt reuse rejection, and
automatic ticket return.
