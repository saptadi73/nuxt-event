# Segmented QRIS Payment Implementation

## Repository baseline

- Baseline before this implementation: `97311e04ada058b70d663108a4f379b7e1174148`
- Baseline commit date: `2026-08-29T17:15:08+07:00`
- Baseline worktree: clean
- Baseline author/subject: `saptadi73 / Error`

This hash is the audit and comparison point. Existing work was not overwritten.

## Business rules

- Fixed organizer conversion: **USD 1 = IDR 18,000**.
- Organizer split point: **USD 500 = IDR 9,000,000**.
- Midtrans splits above IDR 9,000,000 before method selection on its hosted page.
- DOKU selects the method in the platform first. Only QRIS uses the
  IDR 9,000,000 segment limit; VA/cards collect the full remaining balance.
- Exactly IDR 9,000,000 requires one payment. The limit is an organizer setting.
- One platform `Order` owns multiple gateway `Payment` attempts.
- For new Midtrans/DOKU QRIS orders, the logical count is
  `ceil(order.total_amount / 9,000,000)`; new DOKU VA/card orders use one payment.
- After partial settlement, VA/cards use the next sequence and collect the
  entire remaining balance. Use API sequence metadata rather than recalculating it.
- Each gateway attempt has a unique provider reference. Retries retain the same
  logical sequence; only one success per sequence contributes to settlement.
- Notifications validate against `payment.gross_amount`, not the parent total.

Examples for new orders:

| Order total | Midtrans / DOKU QRIS | DOKU VA / card |
|---:|---|---|
| IDR 9,000,000 | IDR 9,000,000 | IDR 9,000,000 |
| IDR 9,900,000 | IDR 9,000,000 + IDR 900,000 | IDR 9,900,000 |
| IDR 27,000,000 | 3 payments of IDR 9,000,000 | IDR 27,000,000 |

These DOKU rules apply to the order-method endpoint. The legacy hosted
checkout still uses segmentation without platform method selection.
See [DOKU order payment](DOKU_ORDER_PILOT.md).

## Identity mapping and audit trail

The platform transaction remains one `Order` even when the gateway payment is
split or retried. Never create a second order merely because a gateway page was
closed, expired, or changed provider.

| Field | Meaning |
|---|---|
| `orders.id` | Canonical platform transaction ID; remains unchanged |
| `orders.order_number` | Participant/admin-facing platform order number |
| `payments.id` | Internal ID for one gateway attempt |
| `payments.order_id` | Foreign key back to the canonical platform order |
| `payments.payment_sequence` | Logical part being paid, for example `1` |
| `payments.payment_sequence_count` | Total logical parts, for example `2` |
| `payments.provider_order_id` | Midtrans `order_id` or DOKU invoice/reference |
| `payments.provider_transaction_id` | Gateway transaction/request ID returned later |
| `payments.provider_reference_no` | Additional settlement/reference number |

Different attempts and even different providers may pay the same platform order.
Only one successful attempt for each logical sequence contributes to settlement.

## Parent order state

- `pending`: no successful payment.
- `partially_paid`: successful aggregate is greater than zero but below total.
- `paid`: successful aggregate equals the order total.
- `expired` / `canceled`: existing terminal or operational states.

The API exposes `paid_amount`, `remaining_amount`, `is_payment_complete`,
`payment_sequence`, `payment_sequence_count`, and `payment_amount`. Frontend must
use the parent order state and must never infer full settlement from a single
successful payment.

## Eligibility

Until the parent order is `paid`:

- registration remains `payment_pending`;
- ticket issuance is rejected with `REGISTRATION_PAYMENT_REQUIRED`;
- ticket listing and QR access remain unavailable;
- paid-order gates for subsequent IWBIF processes remain closed;
- the participant receives the paid and outstanding amounts in notifications.

Ticket creation is intentionally separate from payment settlement. A caller may
request ticket issuance only after the parent order is `paid`; earlier calls are
rejected with `REGISTRATION_PAYMENT_REQUIRED`. Payment completion opens
eligibility, while a partial payment can neither create nor expose a ticket.

## Interrupted or abandoned checkout

The frontend must preserve `order_id` after package checkout. If the user closes
Midtrans/DOKU, loses connectivity, or returns without completing payment:

1. Load `GET /api/v1/orders/{order_id}/detail`.
2. For `pending` or `partially_paid`, show the saved package/items,
   `paid_amount`, `remaining_amount`, and the next payment action.
3. For Midtrans, call `POST /api/v1/orders/{order_id}/continue-payment` with
   provider `midtrans`; reuse a valid URL/token or create the next eligible attempt.
4. For DOKU, open `/dashboard/payment?order_id=...&doku=1`. The modal resumes
   `/payments/doku/orders/{order_id}/active` or selects a method and posts to
   `/payments/doku/orders/{order_id}/checkout`. Active attempts block method
   switching; expired active attempts require reconciliation first.
5. Never return the participant to package selection unless they explicitly
   cancel an order with no successful payment.

Successful earlier sequences are never charged again. A delayed success from an
older retry is deduplicated by its logical sequence.

## Missing webhook and organizer reconciliation

Gateway redirects and frontend callbacks are not proof of settlement. When the
gateway dashboard shows success but no webhook arrived, an admin/organizer must
match the platform payment with its provider IDs and amount, then use:

```http
PATCH /api/v1/admin/transactions/{payment_id}/status
Content-Type: application/json

{
  "status": "success",
  "paid_at": "2026-08-30T14:30:00+07:00",
  "notes": "Verified in Midtrans/DOKU dashboard; webhook not received"
}
```

This confirms only that payment part. The parent remains `partially_paid` until
the aggregate reaches the order total. The update creates an auditable
`PaymentWebhookEvent` with actor, time, status, and notes.

Do not use `POST /api/v1/admin/orders/{order_id}/confirm-manual-payment` for a
missing gateway webhook. That endpoint represents a separate full manual bank
transfer/static-QR payment. Individual confirmation by `payment_id` is preferred
over bulk confirmation for financial reconciliation.

## Frontend state contract

- Treat only parent `order.status === "paid"` or
  `is_payment_complete === true` as complete.
- A successful child payment does not mean the order is complete.
- On `partially_paid`, show the outstanding amount and the provider-specific resume action; hide
  ticket and subsequent registration actions.
- Refresh order detail after returning from a gateway and poll briefly while the
  webhook is pending. Never call webhook endpoints from the browser.
- Persist `order_id`, not a gateway token, as the durable resume key.
- The Midtrans UI shows a split notice before checkout. DOKU displays the
  returned amount and sequence; a QRIS notice before creation is not implemented.

## Participant disclosure

Suggested disclosure for Midtrans split checkout or DOKU QRIS only:

> Untuk alur pembayaran ini, penyelenggara membagi tagihan di atas
> Rp9.000.000 menjadi beberapa pembayaran dengan nilai maksimal Rp9.000.000
> per pembayaran. Pesanan tetap satu; ticket tersedia setelah seluruh tagihan lunas.

Do not apply this disclosure to DOKU VA/cards.

For a partial settlement:

> Pembayaran bagian {{payment_sequence}} dari {{payment_sequence_count}} berhasil.
> Total diterima {{paid_amount}} dan sisa tagihan {{remaining_amount}}. Ticket dan
> proses berikutnya belum tersedia sampai seluruh pembayaran lunas.

## Deployment checklist

- [x] Record repository baseline.
- [x] Add `partially_paid` and segment metadata.
- [x] Add deterministic IDR 9,000,000 split planning.
- [x] Use unique provider references per attempt.
- [x] Reconcile Midtrans and DOKU Checkout callbacks against segment amounts.
- [x] Prevent ticket issuance before aggregate settlement.
- [x] Add participant partial-payment notification text.
- [x] Add API progress fields and frontend guidance.
- [x] Add unit/regression tests.
- [ ] Apply Alembic revision `202608300038` in staging.
- [ ] Run real Midtrans and DOKU sandbox payments for every segment.
- [ ] Obtain provider/account-manager confirmation for the production merchant.
- [ ] Deploy backend before frontend begins consuming the new fields.
- [ ] Monitor duplicate, delayed, expired, and out-of-order webhooks in staging.

## Production deployment order

Use a maintenance window because the old application treats one successful
payment as full settlement and must not process newly segmented data.

1. Freeze new checkouts; allow started payments to settle and record every
   remaining `pending` gateway transaction.
2. Back up PostgreSQL and verify that the backup is restorable.
3. Record the current application revision, Alembic revision, environment, and
   Midtrans/DOKU webhook settings.
4. Deploy the new backend artifact while public checkout remains disabled.
5. Run the guarded production migration:

   ```powershell
   .\.venv\Scripts\python.exe scripts\migrate_production.py --confirm-production
   ```

6. Verify Alembic head `202608300038`, the new columns, constraints, and index.
7. Verify `PAYMENT_USD_TO_IDR_RATE=18000` and
   `QRIS_SEGMENT_LIMIT_IDR=9000000`, provider keys, callback/notification URLs,
   and public HTTPS reachability.
8. Start one backend instance and smoke-test authentication, order detail,
   checkout below/above IDR 9,000,000, and signed webhook handling.
9. Run a controlled multi-part payment: the first success must yield
   `partially_paid`; the final success must yield `paid`.
10. Verify ticket rejection before completion and eligibility afterward, plus
    every subsequent registration gate.
11. Deploy the frontend that understands `partially_paid` and progress fields.
12. Re-enable checkout gradually, then scale backend instances.
13. Monitor webhook captures/events, provider dashboards, partial orders,
    duplicates, notification delivery, and reconciliation reports.
14. Reconcile the pending transactions recorded in step 1; use the per-payment
    admin endpoint only after confirming a missing webhook in the provider portal.

## Rollback note

Do not downgrade after accepting a segmented payment without first reconciling
all partially paid orders. The earlier application interprets any success as a
fully paid order and is therefore unsafe for segmented production data.
Once segmented payments have been accepted, do not start the baseline application
until every `partially_paid` order has been safely reconciled or migrated.
