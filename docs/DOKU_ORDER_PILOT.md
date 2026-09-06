# DOKU order payment pilot

The payment page has a small `doku` text button below the existing choices.
It opens a native modal with QRIS, Virtual Account, and credit card choices.
Virtual Account opens a second bank selection step (BCA, BNI, MANDIRI, BSI,
BRI). All logos come from `app/assets/images/payment`.

The global payment provider setting and the normal checkout endpoint are
unchanged. With DOKU configured, Online Payment and resume actions open the
method modal instead of the legacy hosted checkout. The small button remains
available to signed-in customers independently of the default provider.

## Backend contract

Deploy the matching `fastapi-event` changes before deploying this frontend:

- `GET /api/v1/payments/doku/order-methods`: authenticated capabilities,
  `{virtual_accounts: string[], qris: boolean, credit_card: boolean}`.
- `GET /api/v1/payments/doku/orders/{order_id}/active`: resume an active
  DOKU pilot attempt; returns `null` when no active attempt exists.
- `POST /api/v1/payments/doku/orders/{order_id}/checkout`: body
  `{method: "virtual_account", bank_code: "BCA"}`, `{method: "qris"}`, or
  `{method: "credit_card"}`. Amounts and card data are rejected as inputs.

Responses contain the original platform order ID, payment ID, method,
server amount/currency, expiry, sequence and sequence count, and the
provider-issued VA number, QR content, or hosted card URL. QR rendering uses
the exact returned content. No fake checkout or simulated settlement is used.

VA and credit cards collect the remaining order balance. Only QRIS uses
backend segmentation, capped at IDR 9,000,000 per payment. Exactly
IDR 9,000,000 requires one payment. This applies to the order-method endpoint;
the legacy hosted checkout still uses segmentation without platform method
selection. A VA webhook validates against its payment's gross amount,
which also supports a remaining-balance VA after a partially paid order.
Existing backend settlement reconciliation remains authoritative.

An order lock and persisted payment intent prevent duplicate pilot invoices
on concurrent requests/retries. An ambiguous provider failure leaves a
`created` attempt for organizer reconciliation; retries cannot issue another
invoice. Active attempts cannot switch banks or providers. An expired attempt
must be reconciled before a new attempt can be created.

The browser stores only order/payment references. Reopening the modal fetches
the original VA/QR from the backend. Status checks use the existing order and
payment endpoints, with at most 30 automatic checks per modal opening and a
manual check option. Paid orders use the existing registration/invoice flow.
Partially paid DOKU orders return to the method modal for the next payment.

## Channel activation and card form

- Bank availability comes from configured SNAP VA channels with a
  `partner_service_id`.
- QRIS is offered only when both QRIS merchant and terminal identifiers exist.
- Cards are offered only when an enabled `PaymentChannel` has provider `doku`
  and code `CREDIT_CARD`. The DOKU merchant account must also support cards.
- Name, card number, expiry, CVV, and 3DS are handled by DOKU's hosted page.
  The checkout request restricts `payment_method_types` to `CREDIT_CARD`.
- Unavailable channels remain visible with a disabled state. Configuration
  presence cannot prove that DOKU has activated the merchant's channel.

No credentials, environment files, payment provider defaults, or webhook URLs
are changed. The existing DOKU server configuration determines sandbox versus
production. Real settlement and merchant activation require verification in
the deployed environment; local tests mock gateway responses.

Reference: [DOKU card integration](https://developers.doku.com/accept-payments/direct-api/non-snap/cards)
and [checkout method filtering](https://developers.doku.com/accept-payments/doku-checkout/supported-payment-methods).

## QRIS-only split update (2026-09-06)

- Backend `app/modules/payments/doku_order.py`: cards now use the full remaining
  amount, like VA. Only QRIS uses the segment amount. The returned sequence
  count and card line-item description reflect the final payment sequence.
- For example, a new IDR 27,000,000 order uses three QRIS payments or one
  VA/card payment. After IDR 9,000,000 is paid, VA/cards can collect the remaining
  IDR 18,000,000 in one payment when no active attempt blocks the method choice.
- Frontend payment, cart, payment-status, and additional-package resume actions
  use the method modal when DOKU is configured. Cart and payment-status also
  recognize a previous DOKU payment when routing resume.
- Existing active attempts are reused; the change does not rewrite their amounts.
- Validation: 16 backend tests passed (`tests.test_doku_order` and
  `tests.test_segmented_payments`), covering below/exactly/above IDR 9,000,000,
  large orders, and partial-balance collection. ESLint passed for the four
  changed frontend pages. Gateway responses were mocked in these tests.
- Deployment and real DOKU sandbox transaction verification remain outstanding.

## Mandiri VA channel correction (2026-09-06)

Production reported `Invalid Field Format {additionalInfo.channel}` when selecting
Mandiri, with request ID `daf640d5-873d-4335-bdda-f1fa1442cfef`.
The callers constructed `VIRTUAL_ACCOUNT_MANDIRI`; DOKU requires
`VIRTUAL_ACCOUNT_BANK_MANDIRI`.

The shared backend `DokuSnapClient.create_va` now normalizes Mandiri's channel
before generating the request signature. This covers both order-first and
registration-first VA creation. Other additionalInfo fields are preserved.
See [DOKU Mandiri SNAP reference](https://developers.doku.com/accept-payments/direct-api/snap/integration-guide/virtual-account/mandiri-virtual-account).

Validation: 21 tests passed across `tests.test_doku_va_channel`,
`tests.test_doku_order`, `tests.test_doku_snap`, and `tests.test_segmented_payments`.
New tests inspect the outgoing bank channel, preserved fields, and signature
using mocked gateway responses. This does not confirm production settlement.

Deploy the updated `fastapi-event` backend to apply this fix; a frontend rebuild
alone does not change the DOKU payload. Production deployment has not been
performed in this session. Check the failed request's persisted attempt before
retrying: the order flow commits a `created` intent before calling DOKU and leaves
it active on exceptions. Reload does not clear that lock. Reconcile the attempt
against the provider response/status before resolving it through the existing
admin flow; do not delete the payment history or mark it paid to unlock checkout.

## All visible VA channels reviewed (2026-09-06)

The order-method modal uses SNAP VA, whose identifiers must be checked against
SNAP documentation rather than the hosted Checkout payment-method list.

| Platform bank | SNAP additionalInfo.channel | Review |
|---|---|---|
| [BCA](https://developers.doku.com/accept-payments/direct-api/snap/integration-guide/virtual-account/bca-virtual-account) | `VIRTUAL_ACCOUNT_BCA` | Matches existing code |
| [BNI](https://developers.doku.com/accept-payments/direct-api/snap/integration-guide/virtual-account/bni-virtual-account) | `VIRTUAL_ACCOUNT_BNI` | Matches existing code |
| [BRI](https://developers.doku.com/accept-payments/direct-api/snap/integration-guide/virtual-account/bri-virtual-account) | `VIRTUAL_ACCOUNT_BRI` | Matches existing code |
| [BSI](https://developers.doku.com/accept-payments/direct-api/snap/integration-guide/virtual-account/bsi-virtual-account) | `VIRTUAL_ACCOUNT_BSI` | Matches existing code |
| [Mandiri](https://developers.doku.com/accept-payments/direct-api/snap/integration-guide/virtual-account/mandiri-virtual-account) | `VIRTUAL_ACCOUNT_BANK_MANDIRI` | Corrected in shared client |

BSI's hosted Checkout identifier is `VIRTUAL_ACCOUNT_BANK_SYARIAH_MANDIRI`
([Checkout reference](https://developers.doku.com/accept-payments/doku-checkout/supported-payment-methods));
do not substitute it for BSI's SNAP identifier. Its disabled state in the supplied
production screenshot is separate from channel format; the modal's available
banks come from backend capabilities and configured partner service IDs.

The payload/signature test now includes all five banks, including BSI.
This review confirms code identifiers and mocked request construction, not
production credentials, merchant activation, bank acceptance, or settlement.
