# DOKU Checkout

New online payments use `POST /payments/doku/checkout` with `{ "order_id": "..." }`.
The participant chooses the method on DOKU's hosted page. The frontend does not
send a method, bank, amount, or card details. Partial payments continue through
`POST /orders/{order_id}/continue-payment` with `{ "provider": "doku" }`.

The backend `PaymentService.create_doku_checkout` uses
`_next_doku_checkout_segment` before requesting `/checkout/v1/payment` from DOKU,
without restricting `payment_method_types`. Set `QRIS_SEGMENT_LIMIT_IDR=9000000`
in the backend; despite its historical name, this setting caps every hosted
checkout payment, including VA and cards. The backend enforces an upper bound
of Rp9,000,000 even if that setting is higher, and calculates each new part from
the verified remaining balance.

| Order total | Payments |
|---:|---|
| Rp9,000,000 | Rp9,000,000 |
| Rp9,000,001 | Rp9,000,000 + Rp1 |
| Rp18,000,000 | 2 × Rp9,000,000 |
| Rp20,000,000 | Rp9,000,000 + Rp9,000,000 + Rp2,000,000 |

The cap is an organizer policy, not a guarantee that every method accepts every
amount. Available methods and their minimum amounts remain controlled by DOKU.

One order owns all payment parts. Only backend-verified settlement can complete
the order and unlock registration/tickets. After a partial settlement, the
participant continues the remaining payment from the status page. A pending
payment with an unexpired DOKU checkout URL can be reopened without creating a
new attempt. Pending legacy direct payments remain on their existing status
flow until reconciled; do not create a hosted payment alongside them.

The frontend shows the split count from order metadata and the IDR total,
and accepts only HTTPS DOKU URLs for redirects. Old direct-method endpoints and
`DokuPaymentModal.vue` remain available as legacy code, but the payment page
does not invoke them for new payments.

Deployment validation: verify the backend cap, checkout credentials, enabled
merchant methods, and callback/notification URLs. Exercise a split order in
sandbox through all payment parts and verify no ticket is issued after only
the first successful part. The backend adds order locking, a durable
invoice/request reservation before external I/O, and protection against late
webhook/checkout responses. Deploy the updated backend with this frontend;
no schema migration is required. Deployment and backend configuration changes
are not performed by this implementation.

A timed-out or otherwise uncertain provider request remains reserved until
reconciled, including after its local URL expires. Retry must not create another
invoice while its provider outcome is unknown. See the backend repository's
`docs/DOKU_CHECKOUT_HARDENING.md` for recovery and rollout details.

## Local validation

- `node --test scripts/test-doku-checkout.mjs` (Node 24): hosted routing,
  Rp9m boundary, multiple parts, partial-payment continuation, pending-payment
  handling, Chinese copy, and redirect URL validation.
- Existing backend suites: `test_segmented_payments`, `test_resumable_orders`,
  and `test_payment_notifications`.
- Frontend production build and ESLint on changed code.

Live DOKU sandbox payment and webhook delivery must be validated separately.

Official integration reference:
[DOKU backend integration](https://developers.doku.com/accept-payments/doku-checkout/integration-guide/backend-integration).
