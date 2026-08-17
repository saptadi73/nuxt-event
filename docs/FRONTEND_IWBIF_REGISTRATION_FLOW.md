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

Gunakan master API sebagai sumber dropdown dan checkbox. Jangan hard-code UUID,
harga paket, aktivitas, atau slot. Participant profile boleh `null`; kondisi ini
tidak menghalangi pembuatan draft registrasi.

## 3. Registrasi delegasi

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
oleh master package di backend. Implementasi Checkout dan polling status mengikuti
`FRONTEND_DOKU_PAYMENT_INTEGRATION.md`. Callback browser bukan bukti pembayaran.

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
