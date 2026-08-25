# Frontend IWBIF Registration Flow

Panduan ini adalah kontrak alur frontend untuk registrasi delegasi, Business
Matching Profile, dan exhibitor. Detail field dan response tetap mengacu ke
`API_REFERENCE.md`.

## 1. Prinsip ownership

```text
access token -> user -> participant -> company -> registration/exhibitor
```

- Kirim access token melalui `Authorization: Bearer <token>`.
- Jangan menyimpan atau mengirim `participant_id` untuk menentukan pemilik
  registrasi delegasi atau exhibitor.
- Backend membuat participant profile otomatis dari akun login dan data form
  ketika belum tersedia.
- `participant_id` hanya digunakan sebagai ID target pada discovery, message,
  dan meeting.
- Respons HTTP 403 berarti resource bukan milik akun aktif; frontend tidak boleh
  mencoba mengganti ID untuk melewati ownership.

## 2. Bootstrap halaman registrasi

Respons login sudah memuat `user.role`, `registration_status`,
`delegate_status`, `exhibitor_status`, `purchase_tracking`, `selected_types`,
`profile`, `registrations`, dan `orders`. Gunakan snapshot ini untuk render
dashboard pertama. Setelah itu ambil data master berikut secara paralel:

```http
GET /api/v1/auth/me
GET /api/v1/participants/me
GET /api/v1/events/{event_id}/delegate-packages
GET /api/v1/events/{event_id}/delegate-package-catalog
GET /api/v1/events/{event_id}/activities
GET /api/v1/events/{event_id}/business-matching-slots
GET /api/v1/master/iwbif-options
```

Panggil kembali `GET /api/v1/auth/users/{user_id}` setelah checkout, callback
pembayaran, submit form, atau perubahan organizer untuk menyegarkan tracking.
Nilai status
profile yang mungkin adalah `belum_terdaftar`, `belum_lengkap`, dan `lengkap`.
Gunakan `purchase_tracking.delegate.status=paid_profile_incomplete` untuk
mengarahkan user yang sudah membayar ke form Delegate.

Jangan menampilkan CTA **View invoice** pada tahap ini. Walaupun order sudah
`paid`, invoice registration belum tersedia sampai form Delegate dibuat dan
backend menautkan order tersebut ke registration. Setelah create registration
berhasil, muat ulang `GET /api/v1/payments/me/invoices` atau endpoint invoice
berdasarkan registration.

Gunakan master API sebagai sumber dropdown dan checkbox. Jangan hard-code UUID,
harga paket, aktivitas, atau slot. Participant profile boleh `null`; kondisi ini
tidak menghalangi pembuatan draft registrasi.

## 3. Registrasi delegasi setelah pembelian package

Alur pembelian Delegate dimulai dari katalog store, bukan dari form registrasi:

```text
GET products -> add cart item -> checkout -> DOKU payment -> Delegate form
```

Render pilihan dari `GET /events/{event_id}/delegate-package-catalog`. Main A/B berupa
radio group wajib. Setiap package mempunyai radio occupancy sharing/single;
pilih rate `is_default=true` saat pertama kali package dipilih. Bandung berupa
checkbox; ketika aktif gunakan sharing default dan tampilkan pilihan single.

Tambahkan `rate.product_id` ke cart. Backend otomatis mengganti Main lama ketika
user memilih A/B atau occupancy lain, dan mengganti rate Bandung ketika occupancy
diubah. Checkout ditolak jika tidak ada tepat satu Main. Frontend tidak mengirim
harga, `delegate_package_id`, atau `rate_id` secara terpisah.

Backend mengambil package/rate dari product pada order milik user, menautkan
order ke registration, dan membuat snapshot `package_selections`. Harga checkout
selalu ditentukan server-side.

### 3.1 Kontrak state package selector

State minimum frontend:

```ts
type Occupancy = "sharing" | "single";

type DelegatePackageSelection = {
  mainPackageId: string | null;
  mainRateId: string | null;
  mainProductId: string | null;
  bandungSelected: boolean;
  bandungRateId: string | null;
  bandungProductId: string | null;
};
```

Ketika user memilih Main A/B:

1. cari rate aktif dengan `is_default=true`;
2. set package, rate, dan `product_id` tersebut;
3. kirim `POST /api/v1/store/events/{event_id}/cart/items` dengan quantity 1;
4. gunakan response cart sebagai sumber subtotal resmi.

```json
{"product_id":"product-main-a-sharing","quantity":1}
```

Ketika occupancy diubah, kirim product rate baru. Backend menghapus rate Main
lama secara atomik. Jangan memanggil DELETE untuk pilihan lama terlebih dahulu;
hal tersebut dapat membuat cart sementara tidak mempunyai Main.

Ketika checkbox Bandung diaktifkan, pilih sharing default dan tambahkan product.
Ketika checkbox dimatikan, panggil:

```http
DELETE /api/v1/store/events/{event_id}/cart/items/{bandung_product_id}
```

Jika rate berubah saat Bandung aktif, cukup POST product baru; backend mengganti
occupancy Bandung lama. Tombol checkout harus disabled bila `mainProductId=null`,
mutation cart sedang berjalan, atau currency item cart berbeda.

### 3.2 Menampilkan USD dan IDR

Setiap rate mempunyai dua konteks harga:

```ts
type PackageRate = {
  amount: number;                 // harga display
  currency: "USD";
  payment_amount_idr: number | null; // nominal payment gateway
  product_id: string;
};
```

Tampilkan `USD {amount}` sebagai harga utama. Jika `payment_amount_idr` tersedia,
tampilkan teks sekunder seperti `Dibayar Rp12.600.000`. Jangan menghitung IDR
dari kurs di browser dan jangan mengirim nominal ke checkout.

Jika `payment_amount_idr=null`, UI boleh menampilkan `Nominal IDR belum tersedia`
dan menonaktifkan kanal DOKU/Midtrans. Sumber total pembayaran resmi tetap
response cart/order, bukan penjumlahan lokal.

Canonical seed memakai kurs tetap 1 USD = IDR 18.000 dan mengisi seluruh rate:
A sharing/single Rp9.000.000/Rp12.600.000; B Rp7.200.000/Rp9.900.000; Bandung
Rp3.600.000/Rp5.400.000. Karena admin dapat mengubahnya, frontend tetap harus
membaca `payment_amount_idr` dari API dan tidak hard-code nilai tersebut.

Contoh formatter:

```ts
const usd = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });
const idr = new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 });

function ratePrice(rate: PackageRate) {
  return {
    display: usd.format(rate.amount),
    payment: rate.payment_amount_idr == null ? null : idr.format(rate.payment_amount_idr),
  };
}
```

### 3.3 Admin package editor

Admin menggunakan satu halaman dengan tiga panel: package, rates, dan facilities.
Muat seluruh data, termasuk yang nonaktif, melalui:

```http
GET /api/v1/admin/events/{event_id}/delegate-package-catalog
```

Form package:

```json
{
  "code":"A",
  "name":"Main Package A",
  "package_type":"main",
  "selection_mode":"required_one",
  "description":"Jakarta delegate package",
  "display_order":1,
  "currency":"USD",
  "amount":500,
  "payment_amount_idr":8000000,
  "is_active":true
}
```

`amount` dan `payment_amount_idr` pada package dipertahankan untuk kompatibilitas.
Untuk UI baru, edit harga melalui rate. Ketika default rate diperbarui, backend
menyinkronkan kedua field legacy tersebut.

Form rate:

```json
{
  "occupancy_type":"single",
  "name":"Single Room",
  "amount":700,
  "currency":"USD",
  "payment_amount_idr":11200000,
  "is_default":false,
  "is_active":true,
  "valid_from":null,
  "valid_until":null
}
```

Gunakan input terpisah:

- Display Price USD → `amount`;
- Payment Price IDR → `payment_amount_idr`;
- Default occupancy → `is_default`;
- Availability → `is_active`;
- optional schedule → `valid_from`/`valid_until` ISO-8601.

Jangan menampilkan `payment_amount_idr` sebagai hasil kurs otomatis. Organizer
bertanggung jawab memasukkan nominal pembayaran final. Setelah create/update
rate berhasil, reload admin catalog karena product checkout ikut disinkronkan.

Form facility:

```json
{
  "name":"3 Nights Hotel Jakarta",
  "description":"Five-star accommodation",
  "quantity":3,
  "unit":"night",
  "pricing_mode":"included",
  "sharing_amount":300,
  "single_amount":500,
  "currency":"USD",
  "display_order":1,
  "is_active":true
}
```

Harga facility adalah breakdown informasi dan tidak dijumlahkan ke checkout.
Total resmi selalu rate package. Untuk `separately_priced`, minimal salah satu
`sharing_amount` atau `single_amount` wajib diisi; fitur ini menandai facility
berharga terpisah tetapi belum menjadikannya cart item mandiri.

### 3.4 Endpoint mutation admin

```http
POST   /api/v1/admin/events/{event_id}/delegate-packages
PUT    /api/v1/admin/events/{event_id}/delegate-packages/{package_id}
DELETE /api/v1/admin/events/{event_id}/delegate-packages/{package_id}

POST   /api/v1/admin/events/{event_id}/delegate-packages/{package_id}/rates
PUT    /api/v1/admin/delegate-package-rates/{rate_id}
DELETE /api/v1/admin/delegate-package-rates/{rate_id}

POST   /api/v1/admin/events/{event_id}/delegate-packages/{package_id}/facilities
PUT    /api/v1/admin/delegate-package-facilities/{facility_id}
DELETE /api/v1/admin/delegate-package-facilities/{facility_id}
```

DELETE adalah nonaktif, bukan penghapusan transaksi historis. Setelah mutation,
invalidate admin catalog, public catalog, store products, dan cart aktif.

### 3.5 Validasi dan error frontend

| HTTP/code | Perilaku UI |
|---|---|
| `MAIN_PACKAGE_REQUIRED` | Fokuskan radio Main dan tampilkan bahwa A/B wajib dipilih |
| `PACKAGE_RATE_INACTIVE` | Reload catalog lalu minta user memilih rate aktif |
| `PACKAGE_RATE_EXISTS` | Tandai occupancy sharing/single sudah tersedia |
| `DEFAULT_RATE_REQUIRED` | Minta admin memilih default pengganti terlebih dahulu |
| `DUPLICATE_PACKAGE_SELECTION` | Reload cart; jangan mencoba memperbaiki total secara lokal |
| `MIXED_CURRENCY` | Tampilkan konfigurasi IDR belum lengkap dan blok checkout |
| `PRODUCT_NOT_FOUND` | Reload catalog karena product/rate mungkin dinonaktifkan admin |

Gunakan optimistic UI hanya untuk radio/checkbox visual. Subtotal, product aktif,
dan kelayakan checkout harus selalu mengikuti response backend.

1. Buat draft dengan `POST /api/v1/events/{event_id}/registrations`.
2. Simpan `registration.id` dari response sebagai ID proses, bukan sebagai
   identitas user.
3. Edit draft dengan `PATCH /api/v1/events/{event_id}/registrations/{id}`.
4. Upload passport menggunakan multipart ke
   `POST /api/v1/registrations/{id}/documents` dengan
   `document_type=PASSPORT_COPY`.
5. Submit melalui
   `POST /api/v1/events/{event_id}/registrations/{id}/submit`.
6. Setelah submit, jadikan form read-only dan tampilkan status dari response/API.

Saat create registration, backend otomatis menautkan order Delegate pending atau
paid yang cocok untuk user, event, dan package. Frontend tidak mengirim
`order_id` dalam payload registration.

Jangan sertakan `participant_id` dalam payload create/update. Semua declarations
harus `true`, activity IDs harus berasal dari event, dan tanggal departure tidak
boleh sebelum arrival.

Pada flow store-first, status order/payment diselesaikan sebelum registration
dibuat. Registration tidak harus melewati status `paid`; saat organizer
melakukan confirmation, backend memverifikasi bahwa order tertaut sudah `paid`.

```text
order(pending) -> payment(created/pending) -> order(paid)
                      -> Delegate form
                      -> order linked to registration -> invoice available

registration(draft) -> submitted -> under_verification -> verified -> confirmed
```

Flow registration-first tetap didukung untuk kompatibilitas:

```text
draft -> submitted -> under_verification -> verified
   -> payment_pending -> paid -> confirmed
```

Business Matching Profile hanya dibuka saat status `confirmed`.

## 4. Pembayaran

Frontend tidak mengirim nominal hasil konversi. Harga pembayaran IDR ditentukan
oleh product store di backend. Implementasi cart checkout dan polling status
mengikuti `FRONTEND_STORE_PURCHASE_FLOW.md`; callback browser bukan bukti
pembayaran. Endpoint registration tetap membutuhkan seluruh profil karena form
dikirim setelah package dipilih/dibayar.

Untuk store-first, buat pembayaran menggunakan order hasil checkout:

```http
POST /api/v1/payments/doku/checkout
Content-Type: application/json

{"order_id":"order-uuid"}
```

Direct VA, QRIS, dan Direct Debit yang menerima `registration_id` digunakan
oleh flow registration-first.

## 5. Business Matching Profile

Setelah registrasi `confirmed`:

```http
POST  /api/v1/registrations/{registration_id}/business-matching-profile
PATCH /api/v1/registrations/{registration_id}/business-matching-profile
GET   /api/v1/registrations/{registration_id}/business-matching-profile
```

Ambil `preferred_slot_ids` dari master slot event. Backend menyimpan relasinya di
`business_matching_profile_slots` dan menolak slot event lain/nonaktif. Company
yang sama dengan registrasi akan diperbarui dan digunakan kembali.

Perlakukan HTTP 403 sebagai “registration belum confirmed” atau ownership tidak
valid; jangan menampilkan form matching sebelum syarat tersebut terpenuhi.

## 6. Exhibitor

Belum ada katalog atau checkout package Exhibitor. `GET
/events/{event_id}/exhibitors` hanya menampilkan exhibitor yang sudah submitted,
bukan pilihan package untuk dibeli. Gunakan alur pendaftaran exhibitor di bawah
sampai organizer menyediakan master package dan harga Exhibitor.

1. Buat draft melalui `POST /api/v1/events/{event_id}/exhibitors` tanpa
   `participant_id`.
2. Edit dengan `PUT /api/v1/events/{event_id}/exhibitors/{id}` selama masih
   `draft`.
3. Upload katalog melalui
   `POST /api/v1/exhibitors/{id}/product-catalogue` menggunakan field multipart
   `file`.
4. Upload sukses mengubah status menjadi `submitted`; form kemudian read-only.

Satu user hanya dapat memiliki satu exhibitor untuk event yang sama. HTTP 409
`EXHIBITOR_EXISTS` harus diarahkan ke draft/detail yang sudah ada, bukan membuat
ulang.

## 7. Penanganan error

- `401`: token tidak ada/kedaluwarsa; coba refresh token satu kali, lalu arahkan
   ke login jika refresh gagal.
- `403`: ownership atau eligibility gagal.
- `409`: konflik lifecycle/duplikasi; pertahankan input dan tampilkan pesan API.
- `422`: field/option tidak valid; petakan detail validasi ke input terkait.
- Upload menerima PDF/JPEG/PNG maksimum 10 MB.

Frontend harus memakai `code` dan `message` dari error envelope backend serta
tidak menyimpulkan status bisnis hanya dari keberhasilan navigasi browser.
Untuk dashboard organizer, `409 REGISTRATION_PAYMENT_REQUIRED` berarti
registration belum boleh dikonfirmasi karena order tertaut belum paid.
