# Frontend Payment Provider Configuration

This frontend is designed so the active payment gateway is selected in one configuration file or environment variable, without asking the user to choose provider manually in the browser.

## Provider switch

Set the provider globally in environment variables before build or generate:

```env
NUXT_PUBLIC_PAYMENT_PROVIDER=doku
# or
NUXT_PUBLIC_PAYMENT_PROVIDER=midtrans
```

Supported values:

- `doku`
- `midtrans`

The setting is read from:

- [nuxt.config.ts](../nuxt.config.ts)
- [.env.example](../.env.example)
- [app/config/payment.ts](../app/config/payment.ts)

## How the frontend behaves

The provider is resolved centrally in [app/config/payment.ts](../app/config/payment.ts):

- `doku` => open `DokuPaymentModal`, then call `POST /api/v1/payments/doku/orders/{order_id}/checkout` with `method` and, for VA, `bank_code`
- `midtrans` => call backend `POST /api/v1/payments/midtrans/checkout`

The payment composable retains `createCheckout(orderId)` for hosted checkout compatibility. The current DOKU UI uses `createDokuOrderPayment` after method selection instead. Midtrans splits above IDR 9,000,000 before hosted method selection; DOKU splits only QRIS and charges the full remaining balance for VA/cards. The small DOKU pilot button remains available independently of the configured default. See [DOKU order payment](DOKU_ORDER_PILOT.md).

## Build / generate flow

### Local development

```bash
cp .env.example .env
npm install
npm run dev
```

### Production build

```bash
NUXT_PUBLIC_PAYMENT_PROVIDER=doku npm run build
# or
NUXT_PUBLIC_PAYMENT_PROVIDER=midtrans npm run build
```

### Static generate

```bash
NUXT_PUBLIC_PAYMENT_PROVIDER=doku npm run generate
# or
NUXT_PUBLIC_PAYMENT_PROVIDER=midtrans npm run generate
```

The resulting frontend will compile with the selected provider and all payment actions will route to the correct backend endpoint.

## Checklist before deployment

- [ ] Set `NUXT_PUBLIC_PAYMENT_PROVIDER` in deployment environment
- [ ] Set `NUXT_PUBLIC_API_BASE_URL` to the correct backend API URL
- [ ] Set `NUXT_PUBLIC_SITE_URL` to the production frontend domain
- [ ] Confirm backend has the same provider enabled and configured
- [ ] Confirm `MIDTRANS_SERVER_KEY` is only in backend secret storage
- [ ] Confirm `MIDTRANS_CALLBACK_URL` points to the real frontend return URL if using Midtrans
- [ ] Build or generate after changing the provider
- [ ] Validate final payment flow with sandbox credentials

## Flow overview

1. Frontend loads configuration from env runtime.
2. Payment page resolves provider via `getPaymentProviderConfig()`.
3. For DOKU, open the method modal and resume an active attempt or select a method.
4. For Midtrans, call `createCheckout(orderId)` or `continueOrderPayment(orderId)`.
5. Render DOKU VA/QRIS details or redirect to the returned hosted card/Midtrans URL.
6. Frontend polls `GET /api/v1/payments/{payment_id}` until backend confirms final status.
7. Final status is authoritative; browser flow is not sole proof of payment.

## Important notes

- The user should never be asked to select a payment gateway at runtime.
- Server keys remain in backend only.
- Provider changes are controlled by deployment configuration, not browser state.
- Build/generate triggers should be rerun after changing the provider value.
