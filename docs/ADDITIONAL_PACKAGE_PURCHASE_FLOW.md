# Post-Registration Additional Package Purchase

## Purpose

A participant may initially buy only one main package and later buy one or more
additional packages without changing the paid main order or creating another
registration.

## Data ownership

```text
Registration REG-001
|- Order ORD-MAIN-001 (main_registration, paid)
|  `- Main Package A
`- Order ORD-ADD-001 (additional, pending/partially_paid/paid)
   `- Additional Trip
```

The registration remains one. A later add-on creates a new `Order` with
`order_kind=additional` and the existing `registration_id`. It uses the same
Midtrans/DOKU split-payment and resume flow as any other order.

## Eligibility and duplicate detection

```http
GET /api/v1/store/events/{event_id}/additional-products/me
```

Each item includes `purchase_status`, `is_purchasable`, `existing_order_id`,
`registration_id`, and `reason`.

- `available`: may be added and checked out;
- `pending` / `partially_paid`: resume `existing_order_id`;
- `owned`: already paid/attached; do not offer purchase;
- `registration_required`: initial registration/main selection does not exist;
- `main_payment_required`: main order is not fully paid;
- `unavailable`: catalogue/rate relationship cannot be used.

Backend checks duplication when adding to cart and again during checkout while
locking the active registration. It checks the registration entitlement and
orders in `draft`, `pending`, `partially_paid`, or `paid`. The database also
enforces one selection per `(registration_id, delegate_package_id)`.

## Frontend flow

1. Open the personalized additional endpoint, not the generic catalogue.
2. Render Buy only for `available`.
3. For `pending`/`partially_paid`, render Continue Payment using
   `existing_order_id`; do not create a duplicate order.
4. For `owned`, render Already Purchased and disable selection.
5. Add available products through the existing cart endpoint.
6. Checkout through `POST /api/v1/store/events/{event_id}/checkout`.
7. Persist the add-on `order_id`, then use normal Midtrans/DOKU checkout and
   `continue-payment` APIs.
8. Refresh personalized availability after full payment.

Initial purchase remains compatible: before a registration exists, a cart may
contain exactly one main package plus optional additional packages. An
additional-only initial checkout is rejected.

## Settlement behavior

- Partial add-on payment changes only its order to `partially_paid`.
- It does not downgrade the main registration from `paid` or `confirmed`.
- Complete settlement idempotently inserts a package selection with
  `source_order_id`.
- Duplicate/retried webhooks cannot create the entitlement twice.
- Add-on payment never substitutes for main payment. Ticket and core registration
  gates require a paid order item of type `delegate`.

## Production migration

Apply Alembic revision `202608300039` after `202608300038`. Deploy backend before
exposing this UI. Smoke-test available, duplicate pending, duplicate owned,
partial payment, final activation, and ticket access.
