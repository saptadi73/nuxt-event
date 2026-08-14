# Frontend Integration — DOKU Checkout

Dokumen ini adalah kontrak integrasi frontend untuk pembayaran IWBIF 2026.
OpenAPI backend tersedia di `/openapi.json`, sedangkan seluruh endpoint aplikasi
menggunakan prefix `/api/v1`.

## 1. Prasyarat

Frontend hanya menyimpan base URL backend. `DOKU_CLIENT_ID` dan
`DOKU_SECRET_KEY` adalah rahasia backend dan tidak boleh berada di source,
bundle, environment, local storage, atau request frontend.

```env
VITE_API_BASE_URL=http://127.0.0.1:8000/api/v1
```

Backend saat ini menggunakan DOKU Checkout Non-SNAP sandbox. DOKU mensyaratkan
`order.amount` dalam IDR tanpa desimal. Paket IWBIF masih memiliki harga sumber
USD, sehingga nominal charge IDR tetap untuk Package A/B/C harus disepakati dan
disimpan oleh backend sebelum pengujian sandbox. Frontend tidak boleh menghitung
kurs atau mengirim nominal pembayaran.

## 2. Membuat Checkout

```http
POST /api/v1/payments/doku/checkout
Authorization: Bearer <access-token>
Content-Type: application/json

{
  "registration_id": "<registration-uuid>"
}
```

`registration_id` boleh `null`; penggunaan ID eksplisit direkomendasikan agar
frontend tidak memilih registrasi yang salah ketika user memiliki lebih dari
satu event.

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

Pada halaman callback, frontend membaca `payment_id` atau `registration_id` yang
disimpan sebelum redirect, lalu mengambil status:

```http
GET /api/v1/payments/{payment_id}
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

Payment `success` mengubah registration menjadi `paid`. Registration baru
menjadi `confirmed` setelah proses konfirmasi organizer; frontend tidak boleh
menyamakan dua status tersebut.

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
export interface CreateDokuCheckoutRequest {
  registration_id: string;
}

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
