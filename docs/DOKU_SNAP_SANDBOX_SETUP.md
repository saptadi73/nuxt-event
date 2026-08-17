# DOKU Sandbox Setup — IWBIF 2026

## URL publik yang didaftarkan

- Base URL backend: `https://api-event.gagakrimang.web.id`
- SNAP Token URL pada **Integration → API Keys**:
  `https://api-event.gagakrimang.web.id/api/v1/doku/snap/authorization/v1/access-token/b2b`
- SNAP Payment Notification URL pada setiap **Virtual Account SNAP → Configure**:
  `https://api-event.gagakrimang.web.id/api/v1/webhooks/doku/snap/va/payment`
- Checkout/Non-SNAP Notification URL:
  `https://api-event.gagakrimang.web.id/api/v1/webhooks/doku`
- QRIS/QR Payment Notification URL (DOKU Checkout/Non-SNAP):
  `https://api-event.gagakrimang.web.id/api/v1/webhooks/doku`
- Checkout browser return URL:
  `https://api-event.gagakrimang.web.id/api/v1/payments/doku/return`

Jangan memakai URL notification Non-SNAP sebagai Additional Notification URL
untuk produk SNAP. SNAP dan Non-SNAP mempunyai format header, signature, dan ACK
berbeda. Semua layanan Virtual Account SNAP create-VA/MGPC dapat memakai SNAP
Payment Notification URL yang sama.

Inquiry URL hanya diperlukan untuk produk DIPC, ketika DOKU harus menanyakan
tagihan ke merchant saat nasabah mulai membayar. Backend ini saat ini memakai
create-VA/MGPC dan belum menyediakan inquiry DIPC.

Endpoint DOKU tidak memakai JWT user. Keamanannya menggunakan RSA untuk token,
Bearer token merchant, HMAC-SHA512, validasi timestamp dan nominal, serta
idempotensi `X-EXTERNAL-ID`.

## API key dan RSA

Jalankan sekali bila belum mempunyai pasangan key:

```powershell
.\.venv\Scripts\python.exe scripts\generate_doku_snap_keys.py
```

Unggah public key pasangan tersebut sebagai **Merchant Public Key** di DOKU.
Jangan pernah mengunggah atau membagikan private key.

`DOKU_SNAP_PRIVATE_KEY_PATH` wajib menunjuk private key yang cocok dengan
Merchant Public Key. `DOKU_SNAP_DOKU_PUBLIC_KEY_PATH` berbeda: file itu harus
berisi public key milik DOKU untuk memverifikasi token request dari DOKU.

## Environment backend

```env
PUBLIC_BASE_URL=https://api-event.gagakrimang.web.id
DOKU_BASE_URL=https://api-sandbox.doku.com
DOKU_CLIENT_ID=<Client ID merchant>
DOKU_SECRET_KEY=<Secret Key merchant>
DOKU_NOTIFICATION_BASE_URL=https://api-event.gagakrimang.web.id
DOKU_NOTIFICATION_PATH=/api/v1/webhooks/doku
DOKU_CALLBACK_URL=https://api-event.gagakrimang.web.id/api/v1/payments/doku/return

DOKU_SNAP_PARTNER_ID=<Client ID merchant>
DOKU_SNAP_CLIENT_SECRET=<Secret Key merchant>
DOKU_SNAP_PRIVATE_KEY_PATH=.secrets/doku-snap-private.pem
DOKU_SNAP_DOKU_PUBLIC_KEY_PATH=.secrets/doku-snap-doku-public.pem
DOKU_SNAP_DOKU_CLIENT_ID=<X-CLIENT-KEY/X-PARTNER-ID milik DOKU untuk callback>
DOKU_SNAP_VA_CHANNELS_JSON={"MANDIRI":{"partner_service_id":"   86188","customer_no":"0"},"BCA":{"partner_service_id":"   19008","customer_no":"9"},"BNI":{"partner_service_id":"    8492","customer_no":"3"},"BRI":{"partner_service_id":"   13925","customer_no":"6"}}
DOKU_SNAP_DIRECT_DEBIT_BINDING_RETURN_PATH=/api/v1/payments/doku/snap/direct-debit/binding/return
DOKU_SNAP_DIRECT_DEBIT_NOTIFICATION_PATH=/api/v1/webhooks/doku/snap/direct-debit/payment
DOKU_SNAP_DIRECT_DEBIT_CHANNELS_JSON={"CIMB":{"channel":"DIRECT_DEBIT_CIMB_SNAP","consumer_key":"<CIMB Consumer Key>","consumer_secret":"<CIMB Consumer Secret>","merchant_id":"<CIMB Merchant ID>"},"BRI":{"channel":"DIRECT_DEBIT_BRI_SNAP","consumer_key":"<BRI Consumer Key>","consumer_secret":"<BRI Consumer Secret>"},"MANDIRI":{"channel":"DIRECT_DEBIT_MANDIRI_SNAP","consumer_key":"<Mandiri Consumer Key>","consumer_secret":"<Mandiri Consumer Secret>","merchant_id":"<Mandiri Merchant ID>","terminal_id":"<Mandiri Terminal ID>"},"ALLO":{"channel":"DIRECT_DEBIT_ALLO_SNAP","consumer_key":"<Allo Consumer Key>","consumer_secret":"<Allo Consumer Secret>","merchant_id":"<Allo Merchant ID>"}}
```

## SNAP Direct Debit

Konfigurasikan URL yang sama pada setiap kanal Direct Debit yang aktif:

- Binding URL: `https://api-event.gagakrimang.web.id/api/v1/payments/doku/snap/direct-debit/binding/return`
- Payment Notification URL: `https://api-event.gagakrimang.web.id/api/v1/webhooks/doku/snap/direct-debit/payment`

Alur frontend menggunakan endpoint backend berikut (JWT pengguna diperlukan):

1. `POST /api/v1/payments/doku/snap/direct-debit/bindings` dengan `registration_id`, `channel_code`, dan `phone_no`; arahkan browser ke `redirect_url` yang diberikan DOKU.
2. `POST /api/v1/payments/doku/snap/direct-debit/payment` dengan `registration_id` dan `binding_id`; arahkan browser ke `redirect_url` bila tersedia.
3. Jika kanal meminta OTP, panggil `POST /api/v1/payments/doku/snap/direct-debit/payment/{payment_id}/otp` dengan `binding_id` dan OTP enam digit.

Status akhir hanya ditetapkan dari callback Direct Debit yang signature SNAP-nya valid. Callback tersebut memperbarui order, registration, dan laporan pendapatan berdasarkan `channel_code`.

## SNAP e-Wallet

Gunakan URL terpisah dari Direct Debit untuk kanal e-Wallet (DANA, ShopeePay,
atau OVO):

- Authorization Return URL: `https://api-event.gagakrimang.web.id/api/v1/payments/doku/snap/e-wallet/authorization/return`
- Payment Notification URL: `https://api-event.gagakrimang.web.id/api/v1/webhooks/doku/snap/e-wallet/payment`

Set credential per kanal hanya melalui `DOKU_SNAP_EWALLET_CHANNELS_JSON`.
Simpan Consumer Secret di secret manager deployment, bukan source control.

Nilai `partner_service_id` berasal dari kolom Partner Service ID dan dipenuhi
spasi di kiri hingga delapan karakter sesuai SNAP. `customer_no` berasal dari
kolom Prefix Customer. Merchant BIN adalah informasi gabungan dan tidak dipakai
sebagai pengganti Partner Service ID.
API key lain yang tidak disebut oleh spesifikasi Checkout/SNAP tidak dikirim
sebagai header pembayaran sampai fungsi dan nama header-nya dikonfirmasi DOKU.

## Urutan smoke test sandbox

1. Pastikan migrasi database berada pada head.
2. Deploy backend dan pastikan OpenAPI memuat keempat endpoint publik di atas.
3. Unggah Merchant Public Key yang cocok dengan private key deployment.
4. Isi DOKU public key, DOKU callback Client ID, dan BIN tiap bank.
5. Daftarkan Token URL dan Notification URL pada dashboard DOKU.
6. Login peserta dan panggil `POST /api/v1/payments/doku/direct/va`.
7. Simulasikan pembayaran melalui DOKU sandbox.
8. Pastikan payment, order, dan registration berubah menjadi `success`/`paid`.

Browser return bukan bukti pembayaran. Frontend harus membaca status backend;
status `paid` hanya berasal dari notification DOKU yang lolos verifikasi.
