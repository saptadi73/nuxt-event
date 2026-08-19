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

Setelah login, ambil data berikut secara paralel:

```http
GET /api/v1/auth/me
GET /api/v1/participants/me
GET /api/v1/events/{event_id}/delegate-packages
GET /api/v1/events/{event_id}/activities
GET /api/v1/events/{event_id}/business-matching-slots
GET /api/v1/master/iwbif-options
```

Ambil juga `GET /api/v1/auth/users/{user_id}` untuk membaca
`delegate_status` dan `exhibitor_status`. Nilai yang mungkin:
`belum_terdaftar`, `belum_lengkap`, dan `lengkap`.

Gunakan master API sebagai sumber dropdown dan checkbox. Jangan hard-code UUID,
harga paket, aktivitas, atau slot. Participant profile boleh `null`; kondisi ini
tidak menghalangi pembuatan draft registrasi.

## 3. Registrasi delegasi setelah pembelian package

Alur pembelian Delegate dimulai dari katalog store, bukan dari form registrasi:

```text
GET products -> add cart item -> checkout -> DOKU payment -> Delegate form
```

Ambil `delegate_package_id` dari `metadata_json.delegate_package_id` pada
product Delegate yang dibeli. Harga checkout ditentukan product store; jangan
menghitung kurs atau mengirim harga dari form registrasi.

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

Status utama:

```text
draft -> submitted -> under_verification -> verified
      -> payment_pending/paid -> confirmed
```

Business Matching Profile hanya dibuka saat status `confirmed`.

## 4. Pembayaran

Frontend tidak mengirim nominal hasil konversi. Harga pembayaran IDR ditentukan
oleh product store di backend. Implementasi cart checkout dan polling status
mengikuti `FRONTEND_STORE_PURCHASE_FLOW.md`; callback browser bukan bukti
pembayaran. Endpoint registration tetap membutuhkan seluruh profil karena form
dikirim setelah package dipilih/dibayar.

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

- `401`: token tidak ada/kedaluwarsa; arahkan ke login atau refresh token.
- `403`: ownership atau eligibility gagal.
- `409`: konflik lifecycle/duplikasi; pertahankan input dan tampilkan pesan API.
- `422`: field/option tidak valid; petakan detail validasi ke input terkait.
- Upload menerima PDF/JPEG/PNG maksimum 10 MB.

Frontend harus memakai `code` dan `message` dari error envelope backend serta
tidak menyimpulkan status bisnis hanya dari keberhasilan navigasi browser.
