# Integrasi Frontend Midtrans Snap

Backend menjadi pemilik Server Key, nominal, pembuatan transaksi, dan verifikasi
notification. Frontend tidak boleh menyimpan atau mengirim Server Key.

## Pembayaran tersegmentasi QRIS

Backend memakai kurs tetap **USD 1 = IDR 18.000** dan membagi tagihan di atas
USD 500 menjadi bagian maksimal IDR 9.000.000. Satu order platform dapat memiliki
beberapa payment Midtrans dengan `order_id` provider yang berbeda.

Response checkout/detail menyediakan `payment_sequence`,
`payment_sequence_count`, `payment_amount`, `paid_amount`, dan
`remaining_amount`. Setelah Snap mengembalikan sukses, frontend wajib mengambil
ulang detail order. Jangan menerbitkan ticket atau menampilkan status lunas hanya
berdasarkan callback JavaScript satu payment.

Jika `order.status === "partially_paid"`, tampilkan sisa tagihan dan tombol
`continue-payment`. Eligibility hanya aktif jika `order.status === "paid"` atau
`is_payment_complete === true`.

Tampilkan penjelasan bahwa pembagian diberlakukan karena batas QRIS Bank
Indonesia Rp10.000.000 per transaksi, dengan batas operasional platform
Rp9.000.000 berdasarkan USD 500 pada kurs tetap penyelenggara.

### Resume dan source of truth

Simpan `order_id` platform segera setelah checkout paket. Jika browser ditutup,
koneksi putus, atau pengguna kembali tanpa hasil yang jelas:

1. Ambil `GET /api/v1/orders/{order_id}/detail`.
2. Jangan kembali ke pemilihan paket.
3. Untuk `pending`/`partially_paid`, panggil
   `POST /api/v1/orders/{order_id}/continue-payment` dengan
   `{"provider":"midtrans"}`.
4. Backend akan memakai token aktif atau membuat attempt baru untuk sequence yang
   belum lunas. Sequence sukses tidak ditagih ulang.

Callback JavaScript dan browser return bukan bukti pembayaran. Refresh/poll
detail order sampai webhook mengubah parent order. UI hanya boleh membuka ticket
dan tahap selanjutnya untuk parent `paid`.

### Rekonsiliasi organizer

Jika dashboard Midtrans sukses tetapi webhook tidak diterima, organizer harus
mencocokkan `payment_id`, Midtrans `order_id`, `transaction_id`, dan nominal.
Konfirmasi bagian tersebut melalui
`PATCH /api/v1/admin/transactions/{payment_id}/status` dengan `status: success`,
`paid_at`, dan catatan verifikasi. Jangan gunakan endpoint konfirmasi transfer
manual karena endpoint tersebut menyatakan pembayaran manual penuh.

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

Untuk flow store-first, `success` belum selalu berarti invoice registration
tersedia. Jika `purchase_tracking` masih `paid_profile_incomplete`, arahkan user
ke form Delegate/Exhibitor. Tampilkan invoice hanya setelah backend membuat atau
menautkan registration ke order paid.

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
- `GET /api/v1/admin/transactions` untuk menemukan transaksi lintas provider.
- `PATCH /api/v1/admin/transactions/{payment_id}/status` dengan status
  `paid`, `success`, atau `canceled` setelah hasil pada dashboard Midtrans
  diverifikasi. Jangan gunakan endpoint manual-order untuk transaksi Midtrans.
- `DELETE /api/v1/admin/transactions/{payment_id}` hanya bila organizer memang
  perlu menghapus catatan transaksi; backend akan menyelaraskan status order.
- Gunakan `allowed_actions` pada setiap transaksi untuk menentukan tombol yang
  tersedia; jangan menduplikasi matriks status di frontend.

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

Laporan admin dipisahkan berdasarkan provider:

- DOKU: `/api/v1/admin/reports/payments` dan `.csv`
- Midtrans: `/api/v1/admin/reports/payments/midtrans` dan `.csv`

Untuk layar operasional gabungan semua provider gunakan
`GET /api/v1/admin/transactions`; endpoint laporan provider di atas tetap
dipakai untuk laporan dan ekspor khusus gateway.

Frontend harus memberi label referensi sesuai provider. Jangan menampilkan
`provider_order_id`/`provider_transaction_id` DOKU di kolom berjudul “Midtrans
references”. Channel Midtrans memakai rail pembayaran; transaksi QRIS selalu
ditampilkan sebagai `QRIS`, walaupun issuer atau acquirer payload adalah bank.
