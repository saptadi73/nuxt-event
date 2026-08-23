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

## Konfigurasi Midtrans

Atur Payment Notification URL di dashboard Midtrans ke:

`https://<backend-public-host>/api/v1/webhooks/midtrans`

Gunakan sandbox lebih dahulu dengan `MIDTRANS_IS_PRODUCTION=false`. Setelah uji
berhasil, pasang production Server/Client Key dan ubah flag menjadi `true`.

Laporan admin sengaja dipisahkan:

- DOKU: `/api/v1/admin/reports/payments` dan `.csv`
- Midtrans: `/api/v1/admin/reports/payments/midtrans` dan `.csv`
