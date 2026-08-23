# Integrasi Frontend Midtrans Snap

Backend menjadi pemilik Server Key, nominal, pembuatan transaksi, dan verifikasi
notification. Frontend tidak boleh menyimpan atau mengirim Server Key.

## Memilih gateway

Frontend dapat menampilkan metode aktif dari `GET /api/v1/payments/methods` lalu
memanggil salah satu endpoint berikut dengan access token pengguna:

- DOKU: `POST /api/v1/payments/doku/checkout`
- Midtrans: `POST /api/v1/payments/midtrans/checkout`

Body keduanya sama dan harus memuat tepat satu sumber pembayaran:

```json
{"order_id":"<uuid>"}
```

atau:

```json
{"registration_id":"<uuid>"}
```

Response Midtrans berisi `payment_url`, `token`, `payment_id`, dan
`requires_payment`. Implementasi paling sederhana adalah redirect browser ke
`payment_url`. Bila memakai Snap.js, `token` boleh diberikan ke `snap.pay()`;
Client Key Midtrans adalah public credential, tetapi Server Key tetap hanya di
backend.

Redirect browser bukan bukti pembayaran. Setelah pengguna kembali, frontend
harus membaca `GET /api/v1/payments/{payment_id}` sampai status final. Backend
hanya mengubah pembayaran menjadi sukses setelah signature notification valid
dan status tersebut dikonfirmasi lagi melalui API Midtrans.

## Status dan referensi transaksi

Halaman pembayaran pelanggan tidak memerlukan perubahan kontrak. Tetap gunakan
`transaction_status` dari endpoint detail payment sebagai sumber status UI:

- `created` atau `pending`: menunggu pembayaran; jangan tampilkan sukses.
- `success`: pembayaran berhasil dan pengguna dapat melanjutkan.
- `failed` atau `expired`: tampilkan aksi pembayaran ulang bila backend telah
  mengizinkannya.
- `refunded`: pembayaran telah dikembalikan.

Jangan memakai redirect, token Snap, atau keberadaan ID transaksi sebagai bukti
pembayaran. Hanya status `success` hasil verifikasi backend yang final.

Untuk halaman report admin/organizer, tampilkan kedua field berikut sebagai
kolom yang dapat disalin:

- `provider_order_id`: referensi checkout/order Midtrans. Selalu menjadi
  referensi utama untuk transaksi pending atau "not payment".
- `provider_transaction_id`: `transaction_id` dari Midtrans setelah notification
  diterima; dapat `null` sebelum Midtrans mengirim status transaksi.

Report tersedia melalui:

```http
GET /api/v1/admin/reports/payments/midtrans
GET /api/v1/admin/reports/payments/midtrans.csv
```

UI report sebaiknya menandai pembayaran sah hanya ketika
`transaction_status === "success"` dan `order_status === "paid"`. Untuk
rekonsiliasi manual tampilkan juga `gross_amount`, `currency`, `paid_at`,
`customer_email`, dan kedua referensi Midtrans tersebut. Frontend tidak perlu dan
tidak boleh memanggil Midtrans Status API secara langsung karena Server Key tetap
dimiliki backend.

## Mismatch gateway vs backend report

Jika pengguna melihat status gateway sudah sukses tapi backend belum memuat
`transaction_status=success`, frontend wajib tetap mematuhi status backend.

- Tampilkan pesan "Menunggu verifikasi backend/payment gateway".
- Lakukan polling ulang `/api/v1/payments/{payment_id}`.
- Jangan menandai UI sebagai berhasil hanya berdasarkan token/redirect/ID gateway.

Untuk admin/organizer, kasus mismatch dipush ke inbox notifikasi:

- `GET /api/v1/admin/notifications?event_id=<uuid>`
- `POST /api/v1/admin/notifications/{id}/read`
- `POST /api/v1/admin/orders/{order_id}/confirm-manual-payment`

Notifikasi yang umum dipakai untuk jalur ini:

- `type`: `payment_status_update`
- `entity_type`: `payment`, `manual_payment`, `manual_payment_confirmation`, `order`

Setelah admin konfirmasi manual/payment sync sukses, status final tetap diambil dari
`/api/v1/payments/{payment_id}` agar frontend dan notifikasi konsisten.

## Konfigurasi Midtrans

Atur Payment Notification URL di dashboard Midtrans ke:

`https://<backend-public-host>/api/v1/webhooks/midtrans`

Jika fitur Subscription API dan GoPay Tokenization diaktifkan, gunakan endpoint
terpisah berikut agar format notification tidak tercampur:

- Recurring Payment Notification URL:
  `https://<backend-public-host>/api/v1/webhooks/midtrans/recurring`
- Account Linking Notification URL:
  `https://<backend-public-host>/api/v1/webhooks/midtrans/account-linking`

Endpoint recurring saat ini menyimpan dan mengakui event untuk audit tanpa
mengubah order. Endpoint account linking memverifikasi signature resmi Midtrans
sebelum menandai capture berhasil. Keduanya tersimpan di
`payment_webhook_captures`.

Gunakan sandbox lebih dahulu dengan `MIDTRANS_IS_PRODUCTION=false`. Setelah uji
berhasil, pasang production Server/Client Key dan ubah flag menjadi `true`.

Laporan admin sengaja dipisahkan:

- DOKU: `/api/v1/admin/reports/payments` dan `.csv`
- Midtrans: `/api/v1/admin/reports/payments/midtrans` dan `.csv`
