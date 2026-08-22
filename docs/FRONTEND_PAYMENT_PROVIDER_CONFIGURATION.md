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

- `doku` => call backend `POST /api/v1/payments/doku/checkout`
- `midtrans` => call backend `POST /api/v1/payments/midtrans/checkout`

The payment composable in [app/composables/usePayment.ts](../app/composables/usePayment.ts) exposes a single `createCheckout(orderId)` helper that follows the configured provider automatically. The UI does not require user selection.

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
3. Payment page calls `createCheckout(orderId)`.
4. The helper routes to either DOKU or MIDTRANS checkout endpoint on backend.
5. Browser redirects to the returned `payment_url` or continues with Snap flow.
6. Frontend polls `GET /api/v1/payments/{payment_id}` until backend confirms final status.
7. Final status is authoritative; browser flow is not sole proof of payment.

## Important notes

- The user should never be asked to select a payment gateway at runtime.
- Server keys remain in backend only.
- Provider changes are controlled by deployment configuration, not browser state.
- Build/generate triggers should be rerun after changing the provider value.
