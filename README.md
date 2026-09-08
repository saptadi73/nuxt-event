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

`doku` calls `POST /payments/doku/checkout` and redirects to DOKU Checkout, where the participant chooses the payment method. DOKU and Midtrans orders above IDR 9,000,000 are split by the backend into payments of at most IDR 9,000,000, for every method. See [DOKU Checkout](docs/DOKU_CHECKOUT.md).

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

### Payment redirection URLs

After deploying the frontend, configure the payment gateway dashboard with:

| Setting | Production URL |
| --- | --- |
| Successful payment | `https://iwbif.id/payment/success` |
| Failed payment | `https://iwbif.id/payment/failed` |

Both routes display the existing payment status page and verify the actual status
with the backend. The URL itself never marks an order as paid or failed. These
pages require a signed-in participant, just like `/dashboard/payment-status`.
For local development, use the same paths on your frontend development origin.

When generating redirect URLs per transaction, the backend can append
`payment_id`, `order_id` (the internal order UUID), or `registration_id` as query
parameters. Without these parameters, the page uses the payment reference saved
in the same browser tab during checkout. A missing reference is shown as an
error; it is never treated as successful payment. These are browser return URLs,
not backend webhook URLs.

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
