# Frontend Product Purchase Flow

Kontrak frontend untuk pembelian package dan additional product dengan pola
e-commerce. Semua endpoint menggunakan prefix `/api/v1`.

## Prinsip

- Kirim `Authorization: Bearer <access-token>` untuk cart, checkout, order, dan payment.
- Jangan mengirim harga, subtotal, total, currency, atau discount dari frontend.
- Backend adalah sumber harga dan menghitung ulang total saat checkout.
- Jangan menganggap redirect browser sebagai bukti pembayaran.
- Jangan memanggil webhook DOKU dari frontend.
- Simpan `order_id`, `order_number`, dan `payment_id` pada state halaman pembayaran.
- Cegah double-click dengan satu request checkout/payment aktif pada satu waktu.

Untuk bootstrap dashboard setelah login, ambil detail progres user:

```http
GET /api/v1/auth/users/{user_id}
```

Gunakan `registration_status`, `selected_types`, `registrations`, dan `orders`
untuk menentukan langkah UI berikutnya. User hanya boleh meminta `user_id`
miliknya sendiri; admin/organizer memiliki akses operasional.

Gunakan `purchase_tracking.delegate` dan `purchase_tracking.exhibitor` untuk
redirect setelah pemilihan atau pembayaran. Status `paid_profile_incomplete`
berarti user wajib diarahkan ke profile tipe tersebut sebelum fitur berikutnya
dibuka.

## State pembelian

```text
catalog -> cart -> order(pending) -> payment(created/pending) -> order(paid)
                                           |                 -> payment(failed/expired)
                                           -> order(canceled)
```

`order.status` adalah status bisnis order. `payment.transaction_status` adalah
status transaksi gateway. Status final berasal dari notification DOKU yang
diverifikasi backend.

## 1. Ambil katalog

```http
GET /api/v1/store/events/{event_id}/products
```

Product memiliki `product_type` `delegate`, `exhibitor`, atau `additional`.
Jangan hard-code UUID, harga, currency, atau batas quantity.

Untuk membeli additional setelah registrasi/main package selesai, gunakan:

```http
GET /api/v1/store/events/{event_id}/additional-products/me
```

Tampilkan Beli hanya untuk `purchase_status=available`. Untuk `pending` atau
`partially_paid`, gunakan `existing_order_id` dan tampilkan Lanjutkan Pembayaran.
Untuk `owned`, nonaktifkan pembelian. Backend memeriksa ulang saat add-to-cart
dan checkout sehingga frontend tidak dapat melewati validasi.

Untuk IWBIF Delegate, katalog menyediakan `DELEGATE_A`, `DELEGATE_B`, dan
`DELEGATE_C`. Harga `price` dan `currency` adalah nominal yang ditagihkan
(saat ini IDR). Tampilkan harga sumber dari `metadata_json.display_amount` dan
`metadata_json.display_currency` bila UI perlu menampilkan harga package USD.
`metadata_json.delegate_package_id` adalah ID package yang harus dipakai saat
user mengisi form registrasi setelah pembelian. Jangan mengubah atau menebak
nilai metadata tersebut.

### Periksa pembelian exhibitor

Untuk user yang login, gunakan:

```http
GET /api/v1/store/events/{event_id}/exhibitor-availability/me
```

Response `data` memuat `is_purchasable`, `existing_order_id`, `order_status`,
dan `exhibitor_id`. Hanya tampilkan pilihan pembelian jika `is_purchasable=true`.
Registrasi exhibitor yang sudah ada atau order exhibitor `draft`, `pending`,
`partially_paid`, atau `paid` memblokir pembelian ulang untuk user/event yang sama.
Ini berlaku juga untuk order gabungan Delegate + Exhibitor.

Jika tidak bisa membeli, tampilkan **Complete exhibitor profile** menuju
`/register/exhibitor`. Jika ada order aktif yang belum lunas, tampilkan
**Continue payment** menuju `/dashboard/payment?order_id=<existing_order_id>`;
untuk order lunas atau tanpa order aktif, tampilkan tautan dashboard.
Lanjutkan pembayaran menggunakan order tersebut tanpa checkout cart baru.

Backend memeriksa ulang saat tambah cart maupun checkout dan mengembalikan HTTP
409 `EXHIBITOR_PACKAGE_ALREADY_SELECTED` jika sudah memiliki order/registrasi.
Jika menerima konflik ini, muat ulang availability. Payment attempt gagal atau
kedaluwarsa tidak mengizinkan pembelian ulang selama order masih aktif.
Order batal hanya mengizinkan pembelian lagi jika tidak ada registrasi atau
order aktif lain. Lihat [kontrak lengkap](API_REFERENCE.md#8-exhibitor).

## 2. Kelola cart

```http
GET  /api/v1/store/events/{event_id}/cart
POST /api/v1/store/events/{event_id}/cart/items
```

Payload tambah item:

```json
{
  "product_id": "product-uuid",
  "quantity": 1
}
```

Hapus item:

```http
DELETE /api/v1/store/events/{event_id}/cart/items/{product_id}
```

Untuk product biasa, product yang sama menambah quantity, bukan membuat baris
duplikat. Package exhibitor hanya boleh memiliki quantity `1`; memilih ulang
atau mengganti exhibitor sebelum checkout menggantikan item exhibitor di cart.
Checkout juga menolak lebih dari satu item exhibitor atau quantity selain `1`
dengan `PACKAGE_QUANTITY_INVALID`. Backend
menolak product tidak aktif, event berbeda, quantity melebihi batas, dan
campuran currency dalam satu order.

## 3. Checkout cart menjadi order

```http
POST /api/v1/store/events/{event_id}/checkout
```

Checkout tidak memerlukan registration. Backend mengikat order ke `user_id` dan
baru menautkan `registration_id` ketika user menyelesaikan form Delegate dengan
package yang dibeli. Simpan `order_id` dan `order_number` dari response.
Checkout menghapus item dari cart dan membuat snapshot di `order_items`,
sehingga histori tidak berubah jika admin mengubah harga katalog.

Untuk checkout additional-only setelah registrasi, backend mencari registrasi
aktif milik user, memastikan main order sudah `paid`, membuat order baru dengan
`order_kind=additional`, dan menautkannya ke registrasi lama. Main order yang
sudah dibayar tidak pernah diedit.

Cart yang kosong setelah checkout tidak berarti pilihan package hilang. Package
sudah berpindah menjadi pending order. Setelah login/refresh, selalu pulihkan
pending checkout dari backend:

```http
GET /api/v1/orders?status=pending&page=1&size=20
GET /api/v1/orders/{order_id}/detail
```

Setiap item memuat snapshot package dalam `items`, `latest_payment`, seluruh
`payment_attempts`, dan `order.allowed_actions`. Render tombol hanya dari
`allowed_actions`:

- `continue_payment`: lanjutkan order lama sesuai provider yang dikonfigurasi;
- `cancel`: tampilkan aksi hapus/batalkan pending order;
- array kosong: tidak ada aksi yang boleh dilakukan.

Untuk Midtrans, lanjutkan pembayaran tanpa memilih package ulang. Endpoint
berikut juga mendukung hosted DOKU lama; UI DOKU saat ini membuka modal
`/dashboard/payment?order_id=...&doku=1`, lalu memakai endpoint order-method.
Lihat [DOKU order payment](DOKU_ORDER_PILOT.md).

```http
POST /api/v1/orders/{order_id}/continue-payment
Content-Type: application/json

{"provider":"midtrans"}
```

Provider yang didukung adalah `doku` dan `midtrans`. Payment attempt
`failed`/`expired` tetap menjadi histori dan backend membuat attempt baru untuk
order yang sama. URL/token gateway hanya digunakan ulang selama masih berlaku.

Batalkan pending order melalui soft-cancel:

```http
DELETE /api/v1/orders/{order_id}
Content-Type: application/json

{"reason":"Tidak jadi melanjutkan pembelian"}
```

Order dan payment attempts tidak dihapus dari database. Order `paid` tidak dapat
dibatalkan. Item order juga tidak diedit satu per satu setelah payment attempt
dibuat karena nominal gateway sudah terikat pada total order; batalkan order
lama lalu buat cart baru jika susunan package perlu diubah.

Frontend harus menonaktifkan tombol selama request berlangsung. Jika request
gagal, ambil ulang cart dan jangan mengasumsikan order telah dibuat.

## 4. Buat pembayaran DOKU

### Pilihan metode pembayaran di frontend

Halaman pembayaran menawarkan Manual Bank Transfer, Offline Payment, dan
Online Payment. Tombol kecil DOKU juga membuka modal metode secara langsung.

- **Midtrans**: Online Payment membuat hosted checkout; nominal di atas
  Rp9.000.000 di-split sebelum metode dipilih di Midtrans.
- **DOKU**: Online Payment membuka modal QRIS, VA (pilih bank), atau kartu kredit.
  Hanya QRIS memakai split maksimal Rp9.000.000. VA/kartu kredit menagih seluruh
  sisa tagihan. Tepat Rp9.000.000 tetap satu pembayaran.

Modal memuat `GET /payments/doku/orders/{order_id}/active` untuk resume, atau
`GET /payments/doku/order-methods` jika tidak ada attempt aktif. Setelah memilih:

```http
POST /api/v1/payments/doku/orders/{order_id}/checkout
Content-Type: application/json

{"method":"qris"}
```

Untuk VA gunakan `{"method":"virtual_account","bank_code":"BCA"}`; untuk kartu
kredit gunakan `{"method":"credit_card"}`. Jangan kirim nominal atau data kartu.
Backend menentukan amount dan sequence. Frontend menampilkan VA/QRIS yang
dikembalikan backend atau membuka URL kartu DOKU. Detail kontrak dan batasan resume ada di
[DOKU order payment](DOKU_ORDER_PILOT.md).

Endpoint `/payments/doku/checkout` masih tersedia untuk hosted checkout lama,
tetapi bukan jalur Online Payment DOKU saat ini. Halaman `/dashboard/payment-qr`
lama berbeda dari QRIS di modal DOKU. Hanya parent order `paid` atau
`is_payment_complete` yang menyatakan lunas.

## 4a. Lanjutkan profil Delegate setelah pembayaran

Setelah status payment `success`, arahkan user ke form Delegate. Isi
data profil Delegate saja, lalu kirim form ke:

```http
POST /api/v1/events/{event_id}/registrations
```

Backend mengambil `delegate_package_id` dari metadata product pada order milik
user, lalu menautkan order pending atau paid tersebut ke registration baru.
Frontend tidak boleh mengirim `delegate_package_id`, data package, `order_id`,
atau nominal pada payload registration.

## 5. Halaman hasil dan polling

Redirect kembali dari DOKU bukan bukti pembayaran. Setelah halaman hasil dibuka:

```http
GET /api/v1/payments/{payment_id}
GET /api/v1/orders/{order_id}
```

Polling setiap 3-5 detik, maksimal sekitar 2 menit, lalu hentikan saat status
terminal atau komponen dilepas.

| Payment status | UI | Aksi |
|---|---|---|
| `created`, `pending` | Menunggu pembayaran | Lanjutkan polling |
| `success` | Pembayaran berhasil | Tampilkan invoice dan langkah berikutnya |
| `failed` | Payment attempt gagal | `continue_payment` pada order yang sama |
| `expired` | Payment attempt kedaluwarsa | `continue_payment` membuat attempt baru |
| `canceled` | Payment attempt dibatalkan | Ikuti `order.allowed_actions` |

Jika status terlihat `pending` sementara gateway mengirim success tapi backend belum
menandai `success`, jangan ubah UI ke sukses sampai /payments/{payment_id} sudah
`transaction_status=success` dan `order_status=paid`. Sambil menunggu:

- Tampilkan pesan “Verifikasi admin/pembayaran sedang diproses”.
- Sisakan tombol “Periksa lagi” untuk memicu ulang polling.
- Jika user mengkonfirmasi ada mismatch yang berkepanjangan, sarankan admin
  verifikasi manual lewat workflow admin.

## 5a. Notifikasi admin jika status di payment gateway sudah sukses tapi backend belum sinkron

Skenario ini tetap muncul karena sistem frontend menggunakan status final dari
backend (`/payments/{payment_id}` / `/orders/{order_id}`). Jika `payment.transaction_status`
tetap `pending` atau `created` terlalu lama, tampilkan CTA:

- "Verifikasi manual payment"
- Link ke helpdesk/admin contact
- Tombol "Periksa lagi" untuk refresh manual

Selain itu, admin/organizer harus memantau dan menangani mismatch melalui panel
inbox notifikasi:

- Notifikasi tipe: `payment_status_update`
- Endpoint daftar notifikasi admin:
  - `GET /api/v1/admin/notifications?event_id=<uuid>`
- Mark read:
  - `POST /api/v1/admin/notifications/{id}/read`
- Aksi rekonsiliasi seluruh provider:
  - `GET /api/v1/admin/transactions`
  - `PATCH /api/v1/admin/transactions/{payment_id}/status`
  - Payload: `{"status":"paid|success|canceled","notes":"hasil verifikasi"}`
- Untuk banyak transaksi gunakan `POST /api/v1/admin/transactions/bulk-actions`.
- Delete bersifat soft-delete dan ditolak untuk transaksi `success`/`refunded`.
- Render tombol rekonsiliasi dari `transaction.allowed_actions`; jangan
  menghitung ulang matriks transisi di frontend.
- Endpoint lama `POST /api/v1/admin/orders/{order_id}/confirm-manual-payment`
  tetap tersedia khusus transfer/QR manual berbasis order.

Backend akan membuat notifikasi/riwayat yang terkait agar user juga mendapatkan
catatan status terbaru setelah admin/organizer melakukan rekonsiliasi.

Khusus Midtrans, keberadaan `provider_order_id` atau
`provider_transaction_id` tidak mengubah aturan UI di atas. Frontend tetap
menentukan hasil dari `transaction_status`; ID gateway hanya ditampilkan sebagai
referensi invoice, report admin, atau troubleshooting.

## Pembayaran cash/offline assisted oleh organizer

Untuk peserta yang sudah terdaftar tetapi membayar di luar platform, admin UI
memilih registrasi lalu memanggil:

```http
POST /api/v1/admin/registrations/{registration_id}/offline-payments
```

Gunakan metode `cash`, `manual_transfer`, `manual_qr_code`, `edc`, atau
`other_offline`, serta nomor kuitansi unik. `amount` boleh dikosongkan agar
backend menggunakan seluruh sisa tagihan. Jika peserta sebelumnya sudah sukses
membayar sebagian di gateway, jangan kirim total awal; tampilkan sisa dari detail
order atau biarkan backend mengisinya.

Response sukses berisi `order`, `payment`, dan `ticket`, sehingga admin dapat
langsung merender atau mencetak ticket. Endpoint ini berbeda dari rekonsiliasi
webhook hilang: transaksi gateway yang sebenarnya sukses tetap dikonfirmasi lewat
`PATCH /api/v1/admin/transactions/{payment_id}/status`, bukan dibuat sebagai cash.

## 5b. Laporan participant untuk admin/organizer

Panel admin dapat mengambil laporan participant lengkap dengan semua package dan
status pembayaran melalui:

```http
GET /api/v1/admin/reports/participants
GET /api/v1/admin/reports/participants.csv
Authorization: Bearer <admin_or_organizer_access_token>
```

Filter opsional yang didukung adalah `event_id`, `package_id`,
`payment_status`, dan `search`. Endpoint JSON juga menerima `page` dan `size`.

Response JSON menggunakan satu item per participant. Jangan mengasumsikan field
`packages` hanya berisi satu item: participant dapat membeli beberapa package
dalam satu order atau order yang berbeda. Render status pembayaran pada setiap
package berdasarkan `payment_status`, karena sebagian package dapat sudah
`success` sementara package lain masih `pending`.

CSV menggunakan satu baris per package dan mengulang identitas participant pada
setiap baris. Format ini sengaja berbeda dari pengelompokan JSON agar mudah
difilter dan dipivot di spreadsheet.

## 6. Error handling

- `401`: token invalid/expired, arahkan login atau refresh token.
- `403`: resource bukan milik user aktif.
- `404 PRODUCT_NOT_FOUND`: product tidak tersedia atau nonaktif.
- `409`: konflik product/order/payment aktif; ambil ulang state backend.
- `422 EMPTY_CART`: pilih minimal satu product.
- `422 MIXED_CURRENCY`: pisahkan pembelian berdasarkan currency.
- `422 PRODUCT_QUANTITY_LIMIT`: sesuaikan quantity dengan katalog.

Gunakan `message` untuk teks dan `code` untuk perilaku UI. Catat `request_id`
untuk troubleshooting. Jangan menampilkan raw response atau secret DOKU.

## 7. Acceptance checklist

1. Refresh katalog tidak menghapus cart.
2. Double-click add item tidak membuat duplicate row.
3. Double-click checkout tidak membuat dua order aktif.
4. Frontend tidak mengirim nominal ke checkout/payment.
5. Perubahan harga admin tidak mengubah order yang sudah dibuat.
6. Cancel/back dari DOKU tidak ditampilkan sebagai paid.
7. Refresh halaman hasil tidak membuat order/payment baru.
8. Payment cart dapat diambil melalui endpoint milik user tersebut.
9. Webhook tidak pernah dipanggil dari browser.
10. Secret DOKU tidak masuk bundle frontend.
11. Delegate yang sudah paid diarahkan ke form profil dengan
    `delegate_package_id` dari metadata product yang dibeli.
