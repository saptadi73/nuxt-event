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

Gunakan master API sebagai sumber dropdown dan checkbox. Jangan hard-code UUID,
harga paket, aktivitas, atau slot. Participant profile boleh `null`; kondisi ini
tidak menghalangi pembuatan draft registrasi.

## 3. Registrasi delegasi setelah pembelian package

Alur pembelian Delegate dimulai dari katalog store, bukan dari form registrasi:

```text
GET products -> add cart item -> checkout -> DOKU payment -> Delegate form
```

Backend mengambil `delegate_package_id` dari `metadata_json` product Delegate
pada order milik user dan menautkan order tersebut ke registration. Frontend
tidak perlu menyimpan atau mengirim `delegate_package_id`, data package, harga,
atau `order_id` dari form registrasi. Harga checkout tetap ditentukan product
store.

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
