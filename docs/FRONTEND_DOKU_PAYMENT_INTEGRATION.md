# Frontend Integration — DOKU Checkout

> Alur store-first menggunakan **DOKU Checkout** dengan `order_id`. DOKU Direct
> API SNAP Virtual Account digunakan oleh alur registration-first yang sudah
> memiliki `registration_id`.

## Direct VA flow

`GET /api/v1/payments/doku/direct/methods` mengembalikan bank yang tersedia.

```http
POST /api/v1/payments/doku/direct/va
Authorization: Bearer <access-token>
Content-Type: application/json

{"registration_id":"<uuid>","bank_code":"BCA"}
```

Respons menyediakan `payment_id`, `order_id`, `order_number`, `status`,
`bank_code`, `virtual_account_no`, `amount`, `currency`, `expires_at`, dan
`instructions_url`. Frontend menampilkan nomor VA dan melakukan polling ke
`GET /api/v1/payments/{payment_id}` hingga `transaction_status` menjadi
`success`. Frontend tidak boleh mengirim nominal atau memanggil webhook.

## Direct Debit SNAP

Gunakan `channel_code` `CIMB`, `BRI`, `MANDIRI`, atau `ALLO`; credential dan
token rekening selalu disimpan backend.

1. `POST /api/v1/payments/doku/snap/direct-debit/bindings` dengan
   `registration_id`, `channel_code`, `phone_no`, dan `device_id` opsional.
2. Redirect browser ke `data.redirect_url` jika ada untuk otorisasi bank.
3. `POST /api/v1/payments/doku/snap/direct-debit/payment` dengan
   `registration_id` dan `binding_id`.
4. Jika diminta kanal, kirim OTP ke
   `POST /api/v1/payments/doku/snap/direct-debit/payment/{payment_id}/otp`
   menggunakan `{ "binding_id": "uuid", "otp": "123456" }`.
5. Poll `GET /api/v1/payments/{payment_id}` hingga `transaction_status` adalah
   `success`; callback DOKU adalah sumber status final.

Dashboard DOKU untuk semua kanal Direct Debit:

```text
Binding URL: https://api-event.gagakrimang.web.id/api/v1/payments/doku/snap/direct-debit/binding/return
Payment Notification URL: https://api-event.gagakrimang.web.id/api/v1/webhooks/doku/snap/direct-debit/payment
```

## QRIS melalui DOKU Checkout

Jika `GET /api/v1/payments/doku/direct/methods` mengembalikan `"qris": true`,
frontend dapat membuat QR dinamis melalui:

```http
POST /api/v1/payments/doku/direct/qris
Authorization: Bearer <access-token>
Content-Type: application/json

{"registration_id":"uuid"}
```

Render `data.qr_content` sebagai QR image dan poll
`GET /api/v1/payments/{data.payment_id}`. Jangan kirim nominal dari frontend.

Di dashboard DOKU **QR Payment**, atur Notify URL:

```text
https://api-event.gagakrimang.web.id/api/v1/webhooks/doku
```

Notifikasi ini menentukan status akhir dan laporan. Redirect browser tidak boleh
menandai transaksi sukses.

## DOKU Checkout untuk pembelian cart

Untuk pembelian product baru berbasis cart, gunakan alur lengkap pada
`FRONTEND_STORE_PURCHASE_FLOW.md` dan kirim `order_id`, bukan `registration_id`.
Endpoint berbasis registration tetap tersedia untuk kompatibilitas alur lama.

Dokumen ini adalah kontrak integrasi frontend untuk pembayaran IWBIF 2026.
OpenAPI backend tersedia di `/openapi.json`, sedangkan seluruh endpoint aplikasi
menggunakan prefix `/api/v1`.

## Konfirmasi transfer manual oleh admin

Untuk transfer bank manual, frontend peserta hanya menampilkan status order
`pending`. Setelah bukti transfer diverifikasi, frontend admin/organizer dapat
memanggil endpoint berikut dengan token role admin atau organizer:

```http
POST /api/v1/admin/orders/{order_id}/confirm-manual-payment
Authorization: Bearer <admin_access_token>
Content-Type: application/json

{"payment_method":"manual_transfer","transfer_reference":"BCA-20260819-001","notes":"Mutasi bank terverifikasi"}
```

Backend mengambil nominal dari order, membuat catatan payment
`manual_transfer`, dan mengubah order menjadi `paid`. Untuk QR code direct
yang tidak melalui DOKU, gunakan payload berikut setelah admin memverifikasi
transaksi QR:

```json
{"payment_method":"manual_qr_code","transfer_reference":"QR-TRANSACTION-REFERENCE"}
```

Peserta tidak boleh memanggil endpoint ini atau mengubah status pembayaran dari
browser. QR direct hanya dianggap paid setelah konfirmasi admin berhasil.

## 1. Prasyarat

Frontend hanya menyimpan base URL backend. `DOKU_CLIENT_ID` dan
`DOKU_SECRET_KEY` adalah rahasia backend dan tidak boleh berada di source,
bundle, environment, local storage, atau request frontend.

```env
VITE_API_BASE_URL=http://127.0.0.1:8000/api/v1
```

## Katalog metode pembayaran

Jangan hard-code daftar bank, e-Wallet, QRIS, atau Direct Debit di frontend.
Saat halaman pembayaran dibuka, panggil:

```http
GET /api/v1/payments/methods
```

Endpoint ini publik dan hanya mengembalikan channel yang diaktifkan operator.
Tidak ada Consumer Secret, API key, private key, atau token bank pada respons.

```json
{
  "success": true,
  "message": "Metode pembayaran aktif",
  "data": [
    {
      "id": "payment-channel-uuid",
      "provider": "doku",
      "code": "DANA",
      "category": "e_wallet",
      "display_name": "DANA",
      "logo_url": "https://cdn.example.com/payment-logos/dana.svg",
      "sort_order": 20
    }
  ]
}
```

Urutkan berdasarkan `sort_order`, kemudian kelompokkan memakai `category`:

| `category` | Tampilan dan langkah berikutnya |
|---|---|
| `virtual_account` | Tampilkan bank; buat VA dengan endpoint Direct VA. |
| `qris` | Buat QR dinamis melalui `POST /payments/doku/direct/qris`; render `qr_content`. |
| `e_wallet` | Tampilkan logo dan lanjutkan flow e-Wallet/redirect ketika kanal telah tersedia. |
| `direct_debit` | Mulai binding, kemudian buat pembayaran Direct Debit. |

Gunakan `logo_url` dengan fallback avatar/teks `display_name` apabila nilainya
`null` atau gambar gagal dimuat. Metadata merchant dan konfigurasi kanal hanya
tersedia bagi admin, bukan respons katalog publik.

Jika respons `data` kosong, tampilkan pesan bahwa metode pembayaran belum
tersedia dan jangan menawarkan channel fallback yang tidak dikembalikan backend.

Backend saat ini menggunakan DOKU Checkout Non-SNAP sandbox. DOKU mensyaratkan
`order.amount` dalam IDR tanpa desimal. Paket IWBIF masih memiliki harga sumber
USD, sehingga nominal charge IDR tetap untuk Package A/B/C harus disepakati dan
disimpan oleh backend sebelum pengujian sandbox. Frontend tidak boleh menghitung
kurs atau mengirim nominal pembayaran.

## 2. Membuat Checkout dari order cart

```http
POST /api/v1/payments/doku/checkout
Authorization: Bearer <access-token>
Content-Type: application/json

{
  "order_id": "<order-uuid>"
}
```

Gunakan `order_id` dari `POST /store/events/{event_id}/checkout`. Order cart
Delegate dapat dibuat sebelum registration/profile ada. Backend memverifikasi
ownership order dan memakai snapshot `order_items` sebagai line item DOKU.
Jangan kirim `registration_id` untuk alur cart.

Response berhasil:

```json
{
  "success": true,
  "message": "DOKU Checkout berhasil dibuat",
  "data": {
    "payment_url": "https://sandbox.doku.com/checkout-link-v2/...",
    "token": "...",
    "expires_at": "2026-08-14T18:30:00Z",
    "already_paid": false,
    "payment_id": "<payment-uuid>",
    "order_status": "pending",
    "requires_payment": true
  },
  "meta": {
    "order_id": "<order-uuid>",
    "order_number": "ORD-..."
  },
  "request_id": "...",
  "timestamp": "..."
}
```

Jika order telah dibayar:

```json
{
  "data": {
    "payment_url": "",
    "already_paid": true,
    "requires_payment": false,
    "order_status": "paid"
  }
}
```

Frontend tidak boleh membuat Checkout kedua ketika `requires_payment=false`.

## 3. Membuka DOKU Checkout

Redirect sederhana direkomendasikan:

```ts
window.location.assign(response.data.payment_url);
```

Untuk modal DOKU sandbox, frontend dapat memuat:

```html
<script src="https://sandbox.doku.com/jokul-checkout-js/v1/jokul-checkout-1.0.0.js"></script>
```

Kemudian panggil `loadJokulCheckout(paymentUrl)`. Jangan membentuk URL Checkout
sendiri; selalu gunakan `payment_url` dari backend.

## 4. Callback dan Status

`DOKU_CALLBACK_URL` mengarahkan user kembali ke halaman hasil frontend. Callback
browser bukan bukti pembayaran. Source of truth tetap HTTP Notification DOKU
yang diverifikasi backend pada:

```http
POST /api/v1/webhooks/doku
```

Frontend tidak boleh memanggil endpoint webhook tersebut.

Pada halaman callback store-first, frontend membaca `payment_id` dan `order_id`
yang disimpan sebelum redirect, lalu mengambil status:

```http
GET /api/v1/payments/{payment_id}
GET /api/v1/orders/{order_id}
```

Invoice berbasis registration baru tersedia setelah form Delegate dibuat dan
order ditautkan:

```http
GET /api/v1/payments/registrations/{registration_id}/invoice
```

Status payment yang perlu ditampilkan:

| Status | Tampilan frontend | Aksi |
|---|---|---|
| `created`, `pending` | Menunggu pembayaran/verifikasi | Poll dengan interval wajar |
| `success` | Pembayaran berhasil | Tampilkan invoice/next steps |
| `failed` | Pembayaran gagal | Izinkan membuat checkout baru |
| `expired` | Checkout kedaluwarsa | Izinkan membuat checkout baru |

Gunakan polling 3–5 detik selama maksimal 1–2 menit setelah callback. Hentikan
polling saat status terminal atau komponen di-unmount.

Payment `success` mengubah order menjadi `paid`. Jika registration sudah
tertaut, status registration juga menjadi `paid`. Pada store-first, registration
dibuat setelah pembayaran dan backend memverifikasi order paid sebelum organizer
dapat mengubah registration menjadi `confirmed`.

## 5. Error Handling

Backend menggunakan error envelope:

```json
{
  "success": false,
  "message": "...",
  "errors": [{"field": "", "code": "DOKU_NOT_CONFIGURED", "message": "..."}],
  "request_id": "...",
  "timestamp": "..."
}
```

Error code penting:

- `DOKU_NOT_CONFIGURED`: credential sandbox belum tersedia di backend.
- `DOKU_UNAVAILABLE`: DOKU tidak dapat dihubungi.
- `DOKU_PAYMENT_REJECTED`: request ditolak DOKU.
- `DOKU_INVALID_RESPONSE`: response gateway tidak valid.
- `DOKU_PAYMENT_URL_MISSING`: gateway tidak memberikan Checkout URL.
- `REGISTRATION_NOT_OWNED`: registrasi bukan milik user login.
- `DELEGATE_PACKAGE_NOT_FOUND`: package registrasi tidak valid.
- `LEGACY_PAYMENT_PENDING`: masih ada transaksi provider lama yang aktif.

Frontend harus menampilkan pesan aman dari backend dan mencatat `request_id`
untuk troubleshooting. Jangan menampilkan signature, secret, atau raw gateway
response.

## 6. TypeScript Contract

```ts
export type CreateDokuCheckoutRequest =
  | { order_id: string; registration_id?: never }
  | { registration_id: string; order_id?: never };

export interface DokuCheckoutData {
  payment_url: string;
  token: string | null;
  expires_at: string | null;
  already_paid: boolean;
  payment_id: string | null;
  order_status: "draft" | "pending" | "paid" | "expired" | "canceled";
  requires_payment: boolean;
}
```

## 7. Acceptance Test Frontend

1. User login dan memilih registrasi unpaid.
2. Frontend membuat DOKU Checkout satu kali.
3. `payment_url` dapat dibuka pada sandbox.
4. Cancel/back tidak dianggap sukses.
5. Simulator DOKU menyelesaikan pembayaran.
6. Callback page menampilkan status processing sementara.
7. Setelah notification diterima, payment menjadi `success` dan registration
   menjadi `paid`.
8. Refresh callback page tidak membuat order baru.
9. Double-click tombol bayar tidak menghasilkan request paralel.
10. Secret DOKU tidak ditemukan dalam bundle atau network request frontend.
