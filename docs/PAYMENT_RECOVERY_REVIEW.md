# Registration and payment recovery review — 7 September 2026

## Production finding

Read-only API review of the corrected account `info@rimang.id` found one order,
`ORD-2D7B3023433947A4` (`97b7c112-22d8-47a6-a8fd-4b44ca771267`):

- Delegate A, twin sharing: IDR 9,000,000.
- Additional Bandung trip, twin sharing: IDR 3,600,000.
- Total: IDR 12,600,000; received: IDR 0; remaining: IDR 12,600,000.
- Parent order: `pending`, with `continue_payment` available.
- One Midtrans attempt: sequence 1 of 2, IDR 9,000,000, `expired`.
- Sequence 2, IDR 3,600,000, has not been started.
- No delegate or exhibitor registration form has been submitted.

These findings describe the API state at review time. No checkout, cancellation,
settlement change, or production database write was performed by this review.
The originally named account had a different, old settled order and was not the
affected account.

## Findings and changes

1. Dashboard cards were static. The dashboard now loads registration progress and
   outstanding orders, with the same payment breakdown available in cart,
   registration status, payment, and payment status.
2. Cart recovery depended on successful event/cart/catalog loading, filtered by
   the first published event, and omitted resumable expired orders. Recovery now
   loads independently, across the account, follows pagination and the API's
   allowed actions, and reports loading errors separately from empty results.
3. The payment page disabled continuation of pending Midtrans attempts. It now
   uses the existing order's continuation endpoint and preserves the attempt's
   provider, including when the site default differs. No replacement order is
   created. The backend decides whether to reuse or renew a gateway attempt.
4. API order details expose `paid_amount`, `remaining_amount`, and
   `is_payment_complete` alongside `order`. The frontend now normalizes that
   response and displays each logical part, including parts not yet started.
5. Auth snapshots use `items[].type`; frontend matching only recognized
   `product_type`. Both response shapes now resolve to the correct order.
6. Backend login/detail tracking treated an individual successful payment or a
   completed form as registration completion. It now requires full parent order
   settlement and prioritizes outstanding payments. Profile completeness remains
   a separate status. Deleted attempts are excluded from the latest payment.
7. Normal online registration routes now return unpaid users to payment. Explicit
   organizer-assisted offline registration remains available as its separate
   existing flow; it is not promoted from an order with gateway attempts.
8. Backend `PaymentRead` omitted `expired_at`, preventing reliable checkout expiry
   display/resumption. The field is now exposed. Payment status also respects an
   explicitly selected order instead of an unrelated stored order/payment.
9. Concurrent registration refreshes now await the same request. A successful
   payment attempt cannot trigger a success redirect when parent retrieval fails.

## User recovery

Open the existing order's payment page, continue Midtrans, and complete sequence
1. After confirmation, return to the same order and continue sequence 2. The
registration/profile action becomes available after full settlement. Retrying
sequence 1 is another gateway attempt, not a third logical payment or a new order.

## Follow-up: outdated pending-order package names

The production catalog returns `Package A  (5-star Hotel)`, while the affected
order-detail endpoint still returns `Package A - USD500 - Twin Sharing Basis`.
The backend resolver preferred `Product.name` over the current package/rate name.
It now resolves the current package/rate first, also using the product-to-rate
link when order metadata is missing. Resumable expired orders use this resolution
too. Prices and persisted order snapshots remain unchanged. Thirteen targeted
backend tests passed, including five new name-resolution tests. This follow-up
requires deployment of the backend changes in `app/modules/payments/service.py`.

## Validation and rollout

- Production build succeeded. Eighteen frontend regression tests and twenty-six
  backend tests passed across the targeted suites (including two added snapshot
  and payment-schema checks).
- Frontend regression coverage: expired checkout recovery, remaining balance,
  duplicate sequence settlement, full settlement, login routing, response shape,
  concurrent refreshes, Midtrans provider preservation, and parent-fetch failure.
- Existing DOKU checkout regression coverage is retained.
- Backend coverage includes purchase tracking, segmented payments, resumable
  orders, and offline registration/payment behavior.
- TypeScript checking still reports existing errors in the homepage and admin
  translations page, outside this change.
- Backend changes are in the sibling `C:/projek/fastapi-event` checkout:
  `app/modules/users/service.py`, `app/modules/users/purchase_progress.py`,
  `app/modules/payments/schemas.py`, and `tests/test_purchase_progress.py`.
- Existing unrelated backend payment-service and DOKU changes were preserved.
- Deploy the backend and frontend changes to make this behavior available on
  `iwbif.id`. This review does not deploy either application or charge any payment.
