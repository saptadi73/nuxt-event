# DOKU order payment pilot

The payment page has a small `doku` text button below the existing choices.
It opens a native modal with QRIS, Virtual Account, and credit card choices.
Virtual Account opens a second bank selection step (BCA, BNI, MANDIRI, BSI,
BRI). All logos come from `app/assets/images/payment`.

The global payment provider setting and the normal checkout endpoint are
unchanged. The small button is discoverable by any signed-in customer; it is
an understated entry point, not an access restriction.

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

VA collects the remaining order balance. QRIS/cards use existing backend
segmentation. A VA webhook validates against its payment's gross amount,
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
