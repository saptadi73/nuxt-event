# ASEAN AI Event Portal (Nuxt)

## 1) Setup

1. Install dependencies:

```bash
npm install
```

2. Copy environment:

```bash
cp .env.example .env
```

3. Set the payment provider in one place:

```env
NUXT_PUBLIC_PAYMENT_PROVIDER=doku
# or
# NUXT_PUBLIC_PAYMENT_PROVIDER=midtrans
```

`doku` opens the platform method modal (QRIS, Virtual Account, credit card), then calls `POST /payments/doku/orders/{order_id}/checkout` with the selected method. `midtrans` calls the Midtrans checkout endpoint before method selection on Midtrans. Midtrans payments above IDR 9,000,000 are split; DOKU splits only QRIS. DOKU VA and cards charge the full remaining balance. See [DOKU order payment](docs/DOKU_ORDER_PILOT.md).

4. For local development:

- set `NUXT_PUBLIC_API_BASE_URL` to `http://127.0.0.1:8000/api/v1`
- set `NUXT_PUBLIC_SITE_URL` to `http://localhost:3000`
- the defaults are already in `.env.example`

5. Run the app:

```bash
npm run dev
```

## Payment provider switch

Build or generate with the selected provider:

```bash
NUXT_PUBLIC_PAYMENT_PROVIDER=doku npm run build
NUXT_PUBLIC_PAYMENT_PROVIDER=midtrans npm run generate
```

Alternatively, set the value in `.env` and then run `npm run build` or `npm run generate` without extra arguments. The frontend will follow the configured provider automatically.

## Deploy checklist

- [ ] Set `NUXT_PUBLIC_PAYMENT_PROVIDER` in the deployment environment
- [ ] Set `NUXT_PUBLIC_API_BASE_URL` to the correct backend API URL
- [ ] Set `NUXT_PUBLIC_SITE_URL` to the production frontend domain
- [ ] Make sure the backend has that provider enabled and configured
- [ ] Run the build or generate step after changing the provider
- [ ] Make sure the backend webhook and callback URL match the selected provider
- [ ] Do not expose the server key in the frontend

## Flow

1. Frontend reads the provider from environment/runtime config.
2. Payment page resolves the provider through `getPaymentProviderConfig()`.
3. DOKU opens method selection in the platform; Midtrans creates hosted checkout.
4. DOKU renders the returned VA/QRIS or redirects to the card URL. Midtrans redirects to its checkout URL.
5. Frontend polls `GET /api/v1/payments/{payment_id}` and waits for backend verification.
6. Final status is authoritative; browser redirect is not proof of payment.

## Delegate registration

The Delegate form saves the registration draft, optionally uploads a passport
copy, then submits the registration. Passport upload is optional for all
delegates; supported files are PDF/JPG/PNG up to 10 MB. Submission changes the
registration status to `submitted`; payment settlement and ticket issuance remain
separate steps.

Deploy the matching `fastapi-event` optional-passport change before deploying
this frontend. Existing saved drafts still need submission; this change does not
update production records automatically. See the
[registration flow](docs/FRONTEND_IWBIF_REGISTRATION_FLOW.md#optional-passport-and-registration-submission-2026-09-06)
and [document API](docs/API_REFERENCE.md#7-documents).
