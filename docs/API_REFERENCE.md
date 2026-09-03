# IWBIF 2026 Backend API Reference

Kontrak kerja frontend untuk backend IWBIF 2026. Referensi mesin tersedia di
`GET /openapi.json` dan Swagger UI di `GET /docs`; dokumen ini menjelaskan
payload, respons, workflow, dan mekanisme integrasi.

Status kelengkapan implementasi bilingual dan acceptance checklist tersedia di
`docs/BILINGUAL_BACKEND_TODO.md`.
Panduan implementasi editor frontend untuk speaker dan agenda tersedia di
`docs/FRONTEND_BILINGUAL_CONTENT_INTEGRATION.md`.

## 1. Konvensi umum

```text
Development : http://127.0.0.1:8000
API prefix  : /api/v1
WebSocket   : ws:// atau wss:// mengikuti protokol backend
```

- Semua ID resource adalah UUID string.
- Timestamp memakai ISO-8601 dengan timezone; tanggal `YYYY-MM-DD`.
- Gunakan JSON kecuali upload `multipart/form-data`.
- Nominal dan status backend adalah sumber kebenaran.

### 1.1 Localization (`en` dan `zh-CN`)

- Locale yang didukung adalah `en` dan `zh-CN` (Simplified Chinese).
- Database menolak locale selain `en` dan `zh-CN` pada user, template/log email,
  dan content translation.
- Urutan pemilihan per request: query `?locale=zh-CN`, header
  `Accept-Language`, lalu fallback `en`.
- `POST /auth/register` menerima `preferred_locale`; default `en`.
- `PUT /auth/me` dapat memperbarui `preferred_locale`.
- Response user menyertakan `preferred_locale`.
- Pesan presentasi yang dikenal dapat dilokalkan. Status, provider, trigger,
  `error.code`, dan `allowed_actions` tetap canonical dan tidak diterjemahkan.
- Error domain utama menggunakan `error.code` sebagai translation key. Frontend
  harus mengambil keputusan berdasarkan code, bukan teks pesan.
- Error code tanpa copy khusus tetap menerima pesan Mandarin generik tanpa
  mengubah code. Pesan sukses tanpa copy khusus menggunakan `操作成功` pada
  locale `zh-CN`.
- Endpoint template email admin menerima query `locale` pada list, update,
  preview, test-send, preferences, dan log.
- Email otomatis mengikuti `user.preferred_locale`; locale yang tidak didukung
  menggunakan `en`.
- Response HTTP mengirim `Content-Language` dan `Vary: Accept-Language`.
- OpenAPI menampilkan parameter global `locale`. Untuk language switch frontend,
  gunakan query; `Accept-Language` tetap menjadi fallback.
- Konten dinamis menggunakan fallback `locale diminta -> en -> field sumber`.
  Resource yang dilokalkan menyertakan `content_locale` dan
  `translation_fallback`.
- Status data per 2026-08-29: tabel `content_translations` belum berisi data
  `zh-CN` untuk event live manapun. Mekanisme fallback sudah aktif, tetapi
  konten publik masih akan tampil dalam bahasa sumber sampai admin mengisi
  translation lewat `PUT /api/v1/admin/content-translations/...`. Lihat
  `docs/BILINGUAL_BACKEND_TODO.md` bagian 3.1 untuk daftar entity yang perlu
  diisi.

Contoh payload akun:

```json
{
  "email": "delegate@example.cn",
  "password": "strong-password",
  "phone": "+8613800000000",
  "country": "China",
  "preferred_locale": "zh-CN"
}
```

Success envelope:

```json
{
  "success": true,
  "message": "Operasi berhasil",
  "data": {},
  "meta": null,
  "request_id": "request-id",
  "timestamp": "2026-08-15T12:00:00Z"
}
```

### 1.2 Admin content translation

Daftar entity dan field yang boleh diterjemahkan:

```http
GET /api/v1/admin/content-translations/entities
```

Membuat atau mengganti translation:

```http
PUT /api/v1/admin/content-translations/event/{event_id}/zh-CN
Authorization: Bearer <admin-or-organizer-token>
Content-Type: application/json

{
  "fields": {
    "name": "IWBIF 商务与投资论坛",
    "description": "国际商务与投资论坛",
    "venue_name": "雅加达会议中心"
  }
}
```

Endpoint lain:

```text
GET    /api/v1/admin/content-translations/{entity_type}/{entity_id}
DELETE /api/v1/admin/content-translations/{entity_type}/{entity_id}/{locale}
```

Entity yang didukung: `event`, `product`, `delegate_package`,
`delegate_package_rate`, `delegate_package_facility`, `event_activity`,
`business_matching_slot`, `session`, `speaker`, `announcement`, dan
`certificate`, ditambah `matching_session`, `meeting_venue`, dan
`meeting_resource`. Field di luar whitelist ditolak dengan
`INVALID_TRANSLATION_FIELD`.

Contoh data localized:

```json
{
  "id": "resource-uuid",
  "name": "IWBIF 商务与投资论坛",
  "status": "published",
  "content_locale": "zh-CN",
  "translation_fallback": false
}
```

Status tetap canonical. Jika Mandarin belum tersedia, backend menggunakan
translation English atau field sumber dan mengirim `translation_fallback: true`.

Error envelope:

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [{"field":"body.email","code":"value_error","message":"Email tidak valid"}],
  "request_id": "request-id",
  "timestamp": "2026-08-15T12:00:00Z"
}
```

| HTTP | Tindakan frontend |
|---|---|
| `400/422` | Tampilkan validasi field/request |
| `401` | Refresh sekali, retry request, lalu logout bila tetap gagal |
| `403` | Sembunyikan/disable fitur yang tidak diizinkan |
| `404` | Resource tidak ada atau bukan milik user |
| `409` | Refresh resource karena state/duplikasi berubah |
| `500` | Tampilkan error umum dan simpan `request_id` |

## 2. Authentication

Endpoint bertanda **Auth** membutuhkan:

```http
Authorization: Bearer <access_token>
```

### Register/login

```http
POST /api/v1/auth/register
```

```json
{"email":"delegate@example.com","password":"minimum-8-character","country":"Indonesia","phone":"+628123456789"}
```

Registrasi awal hanya membuat akun. `full_name` dan profile participant/delegate
belum wajib pada tahap ini.

Email akun bersifat unik dan dibandingkan dalam bentuk lowercase. Jika email
sudah digunakan, endpoint mengembalikan HTTP `409 Conflict` dengan kode
`USER_EXISTS` dan menunjuk field `email`:

```json
{
  "success": false,
  "message": "Email sudah terdaftar",
  "errors": [
    {
      "field": "email",
      "code": "USER_EXISTS",
      "message": "Email sudah terdaftar"
    }
  ],
  "request_id": "request-uuid",
  "timestamp": "2026-09-02T12:00:00Z"
}
```

Frontend harus membaca pesan dari body respons, bukan hanya status text atau
URL request. Contoh dengan Axios:

```javascript
const message = error.response?.data?.message ?? "Registrasi gagal";
```

Untuk menandai input yang bermasalah, frontend dapat menggunakan
`errors[0].field === "email"`. Pengguna dengan kode `USER_EXISTS` sebaiknya
diarahkan untuk login atau menggunakan alur lupa password.

Jika `EMAIL_ENABLED=true`, backend mengirim email konfirmasi registrasi dari
alamat pada `EMAIL_FROM_ADDRESS` melalui Titan Email SMTP. Nilai tersebut harus
sama dengan mailbox pada `EMAIL_SMTP_USERNAME`. Email berisi konfirmasi
registrasi IWBIF 2026 dan `FRONTEND_LOGIN_URL` untuk melanjutkan login. Pengiriman
dilakukan sebagai background task; kegagalan SMTP dicatat di log dan tidak
membatalkan akun yang sudah berhasil dibuat.

Admin/organizer dapat mengelola template notifikasi per event melalui
`/api/v1/admin/events/{event_id}/email-notifications`. Template mencakup
registrasi, paket delegate/exhibitor, pembayaran, profil business matching, dan
status meeting. Endpoint admin menyediakan preview, test-send, serta riwayat
pengiriman; lihat `docs/EMAIL_REGISTRATION_NOTIFICATIONS.md`.

Template default dan seed IWBIF menggunakan bahasa Inggris. Menjalankan ulang
`scripts/seed_iwbif_2026.py` memperbarui subject/body template event seed ke copy
bahasa Inggris yang canonical. Setelah seed, organizer tetap dapat mengubahnya
melalui endpoint admin. Placeholder `{{ variable_name }}` tidak diterjemahkan.

### Pengaturan email notification oleh organizer

Seluruh endpoint berikut membutuhkan role `admin` atau `organizer`:

```http
GET  /api/v1/admin/events/{event_id}/email-notifications
PUT  /api/v1/admin/events/{event_id}/email-notifications/{trigger}
POST /api/v1/admin/events/{event_id}/email-notifications/{trigger}/preview
POST /api/v1/admin/events/{event_id}/email-notifications/{trigger}/test-send
GET  /api/v1/admin/events/{event_id}/email-notifications/logs/history
```

Organizer juga dapat mengatur override notifikasi untuk satu akun:

```http
GET /api/v1/admin/events/{event_id}/email-notifications/accounts/{user_id}/preferences
PUT /api/v1/admin/events/{event_id}/email-notifications/accounts/{user_id}/preferences/{trigger}
```

Respons `GET` memuat satu baris untuk setiap trigger:

```json
[
  {
    "event_id": "uuid",
    "user_id": "uuid",
    "trigger": "payment_confirmed",
    "global_enabled": true,
    "override_enabled": false,
    "effective_enabled": false,
    "updated_by": "organizer-user-uuid",
    "updated_at": "2026-08-23T12:00:00Z"
  }
]
```

Body `PUT`:

```json
{"is_enabled":false}
```

- `false`: matikan trigger khusus akun tersebut.
- `true`: aktifkan override akun selama template global aktif.
- `null`: hapus override dan kembali mengikuti default event.

Template event adalah master switch. Jika `global_enabled=false`, override akun
tidak dapat memaksa pengiriman. Jika template global aktif, notifikasi dikirim
ketika override bernilai `true` atau `null`. Pengaturan per akun tersedia setelah
database mencapai Alembic revision `202608230028`.

```http
POST /api/v1/auth/login
```

```json
{"email":"delegate@example.com","password":"minimum-8-character"}
```

Register mengembalikan user dan token. Login mengembalikan user, token, role,
serta snapshot progres lengkap agar frontend dapat langsung menentukan dashboard
dan langkah berikutnya tanpa request detail tambahan:

```json
{
  "user": {"id":"uuid","email":"delegate@example.com","full_name":null,"phone":"+628123456789","country":"Indonesia","status":"active","registration_status":"account_created","role":"participant","is_email_verified":false,"created_at":"2026-08-15T12:00:00Z"},
  "registration_status": "package_selected",
  "delegate_status": "belum_lengkap",
  "exhibitor_status": "belum_terdaftar",
  "purchase_tracking": {
    "delegate": {"status":"selected","products":[],"profile_required":false},
    "exhibitor": {"status":"not_selected","products":[],"profile_required":false}
  },
  "selected_types": ["delegate"],
  "profile": null,
  "registrations": [],
  "orders": [],
  "access_token": "jwt",
  "refresh_token": "jwt",
  "token_type": "bearer"
}
```

Refresh:

```http
POST /api/v1/auth/refresh
```

```json
{"refresh_token":"jwt"}
```

Respons berisi access dan refresh token baru.

| Endpoint | Auth | Payload/hasil |
|---|---:|---|
| `GET /api/v1/auth/me` | Ya | `data.user` user aktif dan `registration_status` |
| `GET /api/v1/auth/users/{user_id}` | Ya | Detail lengkap user, status registrasi, tipe, package, profile, order, dan payment |
| `PUT /api/v1/auth/me` | Ya | `{ "full_name"?: string, "phone"?: string }` |
| `PUT /api/v1/auth/password` | Ya | `{ "current_password", "new_password", "confirm_password" }` |
| `POST /api/v1/auth/logout` | Tidak | `{ "revoked": true }`; hapus token frontend |
| `POST /api/v1/auth/forgot-password` | Tidak | `{ "email": string }` |
| `POST /api/v1/auth/reset-password` | Tidak | `{ "token", "password", "confirm_password" }` |
| `POST /api/v1/auth/verify-email` | Tidak | `{ "token": string }` |

`forgot-password` selalu mengembalikan respons sukses yang sama, baik email
terdaftar maupun tidak, untuk mencegah enumerasi akun. Jika akun ditemukan,
backend mengirim link `${FRONTEND_RESET_PASSWORD_URL}?token=...` melalui email.
Token hanya dapat digunakan sekali, disimpan sebagai hash, dan kedaluwarsa
sesuai `PASSWORD_RESET_EXPIRE_MINUTES` (default 30 menit). Request baru
membatalkan seluruh token reset lama yang belum digunakan.

### Detail user dan progres registrasi

```http
GET /api/v1/auth/users/{user_id}
Authorization: Bearer <access_token>
```

User hanya dapat membaca detail dirinya sendiri. Role `admin` dan `organizer`
dapat membaca detail user lain. Response menggabungkan data akun, participant
profile, registration delegate/exhibitor, package, order, item order, dan
payment terbaru.

Objek tracking yang sama juga dikembalikan langsung oleh login. Endpoint detail
tetap disediakan untuk refresh progres setelah checkout, webhook pembayaran,
submit registrasi, atau tindakan organizer. Field `user.role` selalu tersedia
dan bernilai `participant`, `organizer`, atau `admin`.

```json
{
  "user": {
    "id": "uuid",
    "email": "delegate@example.com",
    "country": "Indonesia",
    "phone": "+628123456789",
    "registration_status": "payment_pending"
  },
  "registration_status": "payment_pending",
  "delegate_status": "lengkap",
  "exhibitor_status": "belum_lengkap",
  "purchase_tracking": {
    "delegate": {"status":"paid_profile_incomplete","products":[],"profile_required":true},
    "exhibitor": {"status":"not_selected","products":[],"profile_required":false}
  },
  "selected_types": ["delegate", "exhibitor"],
  "profile": {},
  "registrations": [],
  "orders": []
}
```

Status progres yang digunakan frontend:

```text
account_created -> package_selected -> payment_pending -> paid
```

Status pengisian profile/registration per tipe:

| Status | Arti |
|---|---|
| `belum_terdaftar` | User belum membuat registration tipe tersebut |
| `belum_lengkap` | Draft sudah dibuat tetapi pengisian belum selesai |
| `lengkap` | Registration sudah dikirim atau telah melewati tahap submit |

Field yang tersedia pada `GET /api/v1/auth/users/{user_id}` adalah
`delegate_status` dan `exhibitor_status`. Frontend menggunakan field ini untuk
mengarahkan user ke form yang masih belum lengkap. `purchase_tracking` melacak
product yang berada di cart atau order, termasuk status pembayaran dan kebutuhan
profile.

Status `purchase_tracking`:

```text
not_selected -> selected -> payment_pending -> paid_profile_incomplete -> completed
```

`selected_types` dapat berisi `delegate`, `exhibitor`, atau keduanya. Jangan
menentukan status dari redirect browser; gunakan response endpoint ini setelah
payment notification diproses backend.

Status `paid_profile_incomplete` berarti pembayaran order sudah berhasil tetapi
registration untuk tipe tersebut belum dibuat atau belum ditautkan. Frontend
harus menampilkan CTA **Complete Delegate/Exhibitor Profile**, bukan **View
invoice**. Invoice registration baru tersedia setelah form profil dibuat dan
backend menautkan order paid ke registration.

## 3. Event, agenda, speaker, dan master

Public reads:

```http
GET /api/v1/events?page=1&size=20
GET /api/v1/events/{event_id}
GET /api/v1/events/{slug}/sessions
GET /api/v1/events/{slug}/speakers
GET /api/v1/sessions/events/{event_id}
GET /api/v1/sessions/{session_id}
GET /api/v1/speakers?page=1&size=20
GET /api/v1/speakers/{speaker_id}
```

Event shape:

```json
{
  "id":"uuid","name":"International Women Business & Investment Forum 2026",
  "slug":"iwbif-2026","description":"...","venue_name":"...",
  "venue_address":"...","timezone":"Asia/Jakarta",
  "start_at":"2026-10-14T08:00:00+07:00","end_at":"2026-10-17T23:59:00+07:00",
  "capacity":500,"status":"published"
}
```

Session fields: `id`, `event_id`, `title`, `slug`, `description`, `session_type`,
`room_name`, `start_at`, `end_at`, `capacity`, `status`. Speaker fields: `id`,
`user_id`, `full_name`, professional/organization data, country, biography,
photo/link, expertise, `is_featured`, `status`, `created_at`.

Master form endpoints (Public):

```http
GET /api/v1/master/business-sectors
GET /api/v1/master/countries
GET /api/v1/master/iwbif-options
GET /api/v1/events/{event_id}/delegate-packages
GET /api/v1/events/{event_id}/delegate-package-catalog
GET /api/v1/events/{event_id}/activities
GET /api/v1/events/{event_id}/business-matching-slots
```

Jangan hard-code pilihan. `iwbif-options` memuat participation categories,
looking-for, preferred countries, room preferences, airports, dan booth sizes.

Endpoint `delegate-packages` mempertahankan response flat untuk kompatibilitas.
Gunakan `delegate-package-catalog` untuk UI baru; response dikelompokkan menjadi
Main wajib dan Additional opsional:

```json
{
  "main_packages": [{
    "id":"uuid-a","code":"A","name":"Main Package A","package_type":"main",
    "selection_mode":"required_one","rates":[
      {"id":"rate-sharing","product_id":"product-sharing","occupancy_type":"sharing","name":"Twin Sharing Basis","amount":500,"currency":"USD","is_default":true,"is_active":true},
      {"id":"rate-single","product_id":"product-single","occupancy_type":"single","name":"Single Room","amount":700,"currency":"USD","is_default":false,"is_active":true}
    ],
    "facilities":[{"id":"uuid","name":"Airport Transfers","pricing_mode":"included","display_order":2,"is_active":true}]
  }],
  "additional_packages": [{
    "id":"uuid-bandung","code":"TRIP_BANDUNG","name":"Additional Trip to Bandung","package_type":"additional",
    "selection_mode":"optional","rates":[
      {"product_id":"product-bandung-sharing","occupancy_type":"sharing","amount":200,"currency":"USD","is_default":true},
      {"product_id":"product-bandung-single","occupancy_type":"single","amount":300,"currency":"USD","is_default":false}
    ],
    "facilities":[]
  }]
}
```

Tarif Excel: A sharing/single USD 500/700, B USD 400/550, dan Bandung
USD 200/300. Single diperlakukan sebagai tarif final berbeda, bukan penjumlahan
sharing + supplement. `amount/currency` untuk display; `payment_amount_idr`
untuk charge payment rail Indonesia. Frontend menambahkan `product_id` milik
rate terpilih ke cart dan tidak pernah mengirim nominal.

Seed memakai kurs tetap yang disetujui organizer: **1 USD = IDR 18.000**.

| Package | Occupancy | Display USD | Payment IDR |
|---|---|---:|---:|
| A | Sharing | 500 | 9.000.000 |
| A | Single | 700 | 12.600.000 |
| B | Sharing | 400 | 7.200.000 |
| B | Single | 550 | 9.900.000 |
| Bandung | Sharing | 200 | 3.600.000 |
| Bandung | Single | 300 | 5.400.000 |

Nilai IDR tetap dapat diubah organizer melalui rate editor dan tidak dihitung
ulang otomatis mengikuti kurs.

Contoh rate lengkap untuk integrasi frontend/admin:

```json
{
  "id":"rate-single-uuid",
  "delegate_package_id":"package-a-uuid",
  "product_id":"product-a-single-uuid",
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

`payment_amount_idr` adalah input manual organizer dan nominal final untuk payment
gateway, bukan hasil kurs otomatis backend. Saat field tersedia, product terkait
memakai harga IDR. Jika null, product memakai `amount/currency` display; frontend
harus menghindari checkout payment rail IDR sampai seluruh rate terpilih memiliki
nilai IDR. Backend tetap menolak cart mixed-currency.

Main wajib tepat satu dan default occupancy adalah rate `is_default=true`
(`sharing`). Bandung berupa checkbox; ketika dicentang default-nya sharing dan
participant boleh mengganti ke single. Menambahkan rate lain pada group yang
sama otomatis mengganti item cart sebelumnya.

## 4. Participant profile

Participant profile bukan bagian dari registrasi akun awal. Resource ini dipakai
setelah user memilih tipe dan product/package; response boleh `null` sebelumnya.

Semua **Auth**:

```http
GET   /api/v1/participants/me
PUT   /api/v1/participants/me
PATCH /api/v1/participants/me
POST  /api/v1/participants/me/photo
GET   /api/v1/participants/{participant_id}
GET   /api/v1/participants?page=1&size=20
```

PUT payload:

```json
{"full_name":"Delegate Name","organization_name":"Company","biography":"Short profile","profile_photo_url":null}
```

PATCH memakai subset field yang sama. Upload foto memakai multipart field `file`.
Response menambah `id`, `user_id`, `created_at`, `updated_at`. Frontend tidak
perlu mengirim `participant.id` untuk registrasi atau exhibitor karena ownership
diambil dari access token. ID participant tetap digunakan ketika memilih target
discovery, percakapan, dan meeting.

## 5. Delegate registration

`participant_id` pada payload bersifat opsional untuk kompatibilitas. Backend
selalu mengambil participant dari access token. Jika user belum mempunyai
participant profile, profil dibuat otomatis dari akun login dan data registrasi.
Nilai `participant_id` yang tidak dimiliki user akan ditolak dengan HTTP 403.

Identitas organisasi disimpan sekali di `companies` dan digunakan bersama oleh
registrasi delegasi, Business Matching Profile, dan exhibitor. Pilihan aktivitas,
kategori partisipasi, jadwal matching, serta perjalanan juga disimpan pada tabel
relasional, bukan hanya sebagai data payload.

Workflow:

```text
draft → submitted → under_verification → verified/payment_pending
      → paid → confirmed
      ↘ rejected / canceled / expired
```

- Hanya `draft` yang dapat diedit atau disubmit.
- `PASSPORT_COPY` wajib sebelum submit.
- Satu participant hanya boleh punya satu registrasi aktif per event.
- Business Matching IWBIF baru tersedia setelah `confirmed`.

Untuk alur beli package lebih dulu, lakukan cart, checkout, dan pembayaran
sebelum membuat draft registration. Setelah payment, frontend hanya mengirim
data profil Delegate. Backend mengambil `delegate_package_id` dari metadata
product pada order milik user dan otomatis menautkan order tersebut ke
registration. Frontend tidak mengirim `delegate_package_id`, data package,
`order_id`, atau nominal pada payload registration.

Create/update — **Auth**:

```http
POST  /api/v1/events/{event_id}/registrations
PATCH /api/v1/events/{event_id}/registrations/{registration_id}
```

```json
{
  "full_name":"Delegate Name","job_title":"Director",
  "company_organization":"Example Company",
  "nationality":"Indonesian","title":"Ms.","business_sector":"Technology",
  "email":"delegate@example.com","office_phone":null,
  "company_website":"https://example.com","linkedin":null,
  "company_address":"Jakarta","participation_categories":["Delegate","Buyer"],
  "presentation_topic":null,"products_interested":"Digital commerce",
  "investment_interest":"Regional expansion","room_preference":"Twin Sharing",
  "preferred_roommate":null,"arrival_date":"2026-10-14","departure_date":"2026-10-17",
  "flight_number":"GA-100","airport":"CGK","need_airport_pickup":true,
  "products_services":"Commerce platform","looking_for":["Buyer","Investor"],
  "preferred_countries":["Indonesia","Malaysia"],"business_objectives":"Find partners",
  "activity_ids":["uuid"],"dietary_restrictions":null,"medical_condition":null,
  "special_assistance":null,"need_official_invoice":true,"tax_id":"NPWP-or-tax-id",
  "information_accuracy_confirmed":true,"terms_accepted":true,
  "business_matching_data_consent":true,"terms_version":"2026-01","consent_version":"2026-01"
}
```

Pilihan harus berasal dari master. Departure tidak boleh sebelum arrival dan
seluruh consent wajib `true`. Jangan mengambil atau menyisipkan `participant_id`
dari local storage ke payload ini.

Response:

```json
{"id":"uuid","event_id":"uuid","participant_id":"uuid","registration_number":"IWBIF-XXXXXXXXXX","status":"draft","detail":{"delegate_package_id":"uuid","full_name":"Delegate Name"}}
```

Lifecycle:

```http
GET    /api/v1/events/{event_id}/registrations/{registration_id}
POST   /api/v1/events/{event_id}/registrations/{registration_id}/submit
DELETE /api/v1/events/{event_id}/registrations/{registration_id}
GET    /api/v1/registrations/me?event_id={optional_uuid}
GET    /api/v1/registrations/{registration_id}
```

## 6. Product catalog, cart, dan checkout

Product adalah katalog pembelian package utama dan additional. Jenis product:
`delegate`, `exhibitor`, atau `additional`. Frontend tidak mengirim harga atau
total.

```http
GET /api/v1/store/events/{event_id}/products
GET /api/v1/store/events/{event_id}/additional-products/me
GET /api/v1/store/events/{event_id}/cart
POST /api/v1/store/events/{event_id}/cart/items
DELETE /api/v1/store/events/{event_id}/cart/items/{product_id}
POST /api/v1/store/events/{event_id}/checkout
```

Endpoint `additional-products/me` adalah katalog personalized untuk pembelian
add-on setelah registrasi. Response menambahkan `purchase_status`,
`is_purchasable`, `existing_order_id`, `registration_id`, dan `reason`.
`available` dapat dibeli; `pending`/`partially_paid` harus dilanjutkan dari order
yang ada; `owned` tidak boleh dibeli ulang; `registration_required` atau
`main_payment_required` berarti prasyarat belum terpenuhi.

Payload add item:

```json
{"product_id":"uuid","quantity":1}
```

Checkout memberi `order_id`, `order_number`, `total_amount`, `currency`, dan
status order. Backend menyimpan snapshot product pada `order_items`. Gunakan
order tersebut untuk payment. Frontend dapat memilih gateway tanpa membuat
ulang order:

```http
POST /api/v1/payments/doku/checkout
POST /api/v1/payments/midtrans/checkout
```

```json
{"order_id":"order-uuid"}
```

Checkout cart awal tidak memerlukan registration. Order baru selalu menyimpan
`user_id`; `registration_id` dapat kosong sampai form Delegate selesai dibuat.
Checkout additional-only setelah main lunas membuat order terpisah dengan
`order_kind=additional` dan langsung memakai `registration_id` lama. Backend
memeriksa selection dan order aktif agar additional yang sama tidak dibeli ulang.
Untuk product `delegate`, metadata berisi:

```json
{
  "delegate_package_id":"package-uuid",
  "display_amount":"500",
  "display_currency":"USD"
}
```

`price/currency` product adalah nominal pembayaran yang dipakai checkout (saat
ini IDR). `display_amount/display_currency` hanya untuk tampilan harga sumber.
Setelah payment, backend menggunakan `delegate_package_id` metadata untuk
membuat relasi registration secara otomatis. Frontend tidak meneruskan field
tersebut ke form registration. Disable tombol selama request, simpan ID
response, dan jangan membuat order baru saat halaman hasil di-refresh. Detail ada di
`docs/FRONTEND_STORE_PURCHASE_FLOW.md`.

Admin mengelola product:

```http
POST /api/v1/store/admin/events/{event_id}/products
PUT /api/v1/store/admin/products/{product_id}
```

### Offline/cash payment oleh organizer

Peserta wajib sudah mempunyai registrasi. Admin/organizer dapat melunasi main
order dan langsung memperoleh ticket melalui:

```http
POST /api/v1/admin/registrations/{registration_id}/offline-payments
```

```json
{
  "payment_method":"cash",
  "amount":7500000,
  "currency":"IDR",
  "receipt_number":"CASH-IWBIF-2026-00125",
  "paid_at":"2026-08-30T15:30:00+07:00",
  "notes":"Cash received by organizer"
}
```

`amount` opsional dan jika dikirim wajib sama dengan sisa tagihan setelah seluruh
payment gateway sukses diperhitungkan. Response berisi `order`, `payment`, dan
`ticket`. Nomor kuitansi unik menjadi idempotency key. Detail operasional ada di
`docs/OFFLINE_REGISTRATION_PAYMENT.md`.

## 7. Documents

Upload — **Auth**:

```http
POST /api/v1/registrations/{registration_id}/documents
Content-Type: multipart/form-data

document_type=PASSPORT_COPY
file=<PDF/JPG/PNG>
```

Jenis: `PASSPORT_COPY`, `COMPANY_PROFILE`, `BUSINESS_CARD`, `COMPANY_LOGO`,
`PRODUCT_CATALOGUE`. Maksimum 10 MB; MIME PDF/JPEG/PNG.

```http
GET    /api/v1/registrations/{registration_id}/documents
GET    /api/v1/registrations/{registration_id}/documents/{document_id}/download
DELETE /api/v1/registrations/{registration_id}/documents/{document_id}
```

List item: `id`, `document_type`, `filename`, `mime_type`, `file_size`,
`uploaded_at`. Download adalah binary, bukan JSON envelope. Delete hanya draft.

## 8. Exhibitor

Payload create/update — **Auth**:

```json
{
  "company_name":"Example SME",
  "brand":"Example Brand","contact_person":"Contact Name","email":"contact@example.com",
  "products_to_display":"Food products",
  "booth_size_requested":"Standard Booth 3x3","electricity_requirement":"220V, 500W",
  "special_requirement":"None","exhibition_terms_accepted":true,
  "exhibition_terms_version":"2026-01"
}
```

```http
POST   /api/v1/events/{event_id}/exhibitors
GET    /api/v1/events/{event_id}/exhibitors
GET    /api/v1/events/{event_id}/exhibitors/{exhibitor_id}
PUT    /api/v1/events/{event_id}/exhibitors/{exhibitor_id}
DELETE /api/v1/events/{event_id}/exhibitors/{exhibitor_id}
POST   /api/v1/exhibitors/{exhibitor_id}/product-catalogue
```

Create menghasilkan draft. Upload catalogue (`file`, max 10 MB) mengubah status
menjadi submitted. List event hanya menampilkan submitted. Update/delete hanya
draft milik user. Satu akun hanya dapat membuat satu exhibitor per event;
ownership selalu berasal dari access token.

Country dan nomor telepon tidak dikirim pada payload Delegate maupun Exhibitor.
Country company diambil dari `users.country`; nomor telepon tetap menjadi data
akun `users.phone` dan tidak diduplikasi pada tabel registrasi.
Metode pembayaran juga tidak diisi pada form Delegate/Exhibitor; pemilihan kanal
dilakukan pada tahap checkout atau payment DOKU.

Endpoint `GET /api/v1/events/{event_id}/exhibitors` adalah daftar exhibitor yang
sudah submitted, bukan katalog paket Exhibitor. Backend belum menyediakan master
package/harga atau checkout Exhibitor; jangan tampilkan endpoint ini sebagai
pilihan pembelian sampai organizer mendefinisikan package tersebut.

## 9. Business Matching profile dan discovery

### Profile detail IWBIF

Registrasi wajib confirmed. Endpoint **Auth**:

```http
POST|PATCH /api/v1/registrations/{registration_id}/business-matching-profile
GET        /api/v1/registrations/{registration_id}/business-matching-profile
DELETE     /api/v1/registrations/{registration_id}/business-matching-profile
```

```json
{
  "company_name":"Example Company","country":"Indonesia","representative":"Delegate Name",
  "email":"delegate@example.com","phone":"+628123456789","products":"Products",
  "services":"Services","hs_code":"1234.56","production_capacity":"1000/month",
  "certificates":"ISO 9001","markets_served":"ASEAN","looking_for":["Buyer"],
  "preferred_countries":["Malaysia"],"preferred_slot_ids":["uuid"],
  "estimated_deal_investment_value":"USD 100,000","additional_notes":"Notes",
  "profile_sharing_consent":true
}
```

### Discovery profile

```http
GET /api/v1/events/{event_id}/business-matching/profile
PUT /api/v1/events/{event_id}/business-matching/profile
```

```json
{
  "organization_name":"Example Company","country_code":"ID","organization_type":"Private Company",
  "position_title":"Director","short_description":"Company summary","target_market":["ASEAN"],
  "preferred_regions":["MY","SG"],"business_interests":["Trade"],
  "business_sectors":["Technology"],"technology_interests":["AI"],
  "partnership_types":["Distribution"],"business_offerings":["Commerce Platform"],
  "business_needs":["Distributor"],"available_for_matching":true,"visibility":"all",
  "allow_messages":true,"allow_meeting_requests":true
}
```

Visibility: `all`, `recommended`, `hidden`.

```http
GET /api/v1/events/{event_id}/business-matching/participants
GET /api/v1/events/{event_id}/business-matching/recommendations
```

Filter: `country`, `organization_type`, `sector`, `business_interest`,
`technology_interest`, `offering`, `looking_for`, `partnership_type`.
Recommendation menambah `match_score` dan `match_reasons`. Hanya confirmed,
available, visible, dan tidak saling block yang ditampilkan.

## 10. Web messaging

REST adalah jalur write/source of truth; WebSocket untuk delivery realtime.

Create/reuse conversation — **Auth**:

```http
POST /api/v1/events/{event_id}/conversations
```

```json
{"participant_id":"target-participant-uuid","initial_message":"Hello"}
```

Jika conversation langsung sudah ada, backend menggunakannya kembali dan
unarchive membership current user.

```http
GET /api/v1/events/{event_id}/conversations
```

Item response:

```json
{
  "id":"uuid","event_id":"uuid","status":"active","last_message_at":"2026-08-15T12:00:00Z",
  "unread_count":2,"other_participant_id":"uuid","other_participant_name":"Partner",
  "other_participant_photo_url":"/uploads/...",
  "last_message":{"id":"uuid","conversation_id":"uuid","sender_participant_id":"uuid","message_type":"text","body":"Hello","meeting_id":null,"reply_to_message_id":null,"created_at":"2026-08-15T12:00:00Z","edited_at":null,"deleted_at":null}
}
```

History:

```http
GET /api/v1/conversations/{conversation_id}/messages?limit=50&before=2026-08-15T12:00:00Z
```

`limit` 1–100, hasil lama → baru. Bila `meta.has_more`, lanjutkan memakai
`meta.next_before`.

```http
POST /api/v1/conversations/{conversation_id}/messages
```

```json
{"body":"Message text","reply_to_message_id":null}
```

Reply harus berasal dari conversation sama. Edit/delete hanya pesan text milik
pengirim; system/meeting message immutable.

```http
PATCH  /api/v1/conversations/{conversation_id}/messages/{message_id}  body: {"body":"Updated"}
DELETE /api/v1/conversations/{conversation_id}/messages/{message_id}
POST   /api/v1/conversations/{conversation_id}/read
POST   /api/v1/conversations/{conversation_id}/archive
POST   /api/v1/conversations/{conversation_id}/unarchive
GET    /api/v1/messages/unread-count
```

WebSocket:

```text
wss://<backend>/api/v1/ws/conversations/{conversation_id}?token=<access_token>
```

Event: `connected`, `new_message`, `message_updated`, `message_deleted`,
`read_update`, `meeting_status_update`. Client boleh mengirim `{"type":"ping"}`.
Saat reconnect, refresh REST history agar event yang terlewat masuk. Hub saat ini
process-local; multi-worker memerlukan Redis pub/sub.

## 11. Meetings dan moderation

```http
POST /api/v1/events/{event_id}/meetings
```

```json
{"recipient_participant_id":"uuid","conversation_id":"uuid-or-null","purpose":"Business discussion","topic":"Regional distribution","description":"Agenda","proposed_slot_ids":["uuid"]}
```

Conversation harus memuat requester dan recipient pada event sama.

```http
GET  /api/v1/events/{event_id}/meetings
GET  /api/v1/meetings/{meeting_id}
POST /api/v1/meetings/{meeting_id}/accept
POST /api/v1/meetings/{meeting_id}/decline
POST /api/v1/meetings/{meeting_id}/request-reschedule
POST /api/v1/meetings/{meeting_id}/cancel
POST /api/v1/meetings/{meeting_id}/complete
POST /api/v1/meetings/{meeting_id}/confirm  body: {"slot_id":"uuid","resource_id":"uuid"}
```

Backend memvalidasi transisi dan benturan participant/slot/resource. Status:
`requested`, `accepted`, `scheduling`, `confirmed`, `completed`, `declined`,
`cancelled`, `reschedule_requested`, `no_show`.

```http
GET /api/v1/events/{event_id}/matching-sessions
GET /api/v1/events/{event_id}/meeting-slots
GET /api/v1/events/{event_id}/meeting-resources
GET /api/v1/events/{event_id}/availability
```

Moderation payload `{ "participant_id":"uuid", "reason":"Spam", "details":"..." }`:

```http
POST   /api/v1/events/{event_id}/business-matching/block
DELETE /api/v1/events/{event_id}/business-matching/block/{participant_id}
POST   /api/v1/events/{event_id}/business-matching/report
```

Block menghilangkan discovery dan menonaktifkan message/meeting dua arah.

## 12. Notification center

```http
GET  /api/v1/notifications
GET  /api/v1/notifications/unread-count
POST /api/v1/notifications/{notification_id}/read
POST /api/v1/notifications/read-all
GET  /api/v1/inbox/unread-count?event_id=<uuid>
GET  /api/v1/admin/notifications?event_id=<uuid>&request_limit=<100>
GET  /api/v1/admin/notifications/unread-count?event_id=<uuid>
POST /api/v1/admin/notifications/{notification_id}/read
POST /api/v1/admin/notifications/read-all?event_id=<uuid>
```

Endpoint gabungan `/inbox/unread-count` tersedia untuk semua akun yang telah
login, termasuk admin/organizer tanpa participant profile. Untuk akun tersebut,
`messages` bernilai `0`, sedangkan `notifications` tetap menghitung notifikasi
admin dan `unread_count` tetap dapat digunakan sebagai badge ikon inbox.

Contoh response `/api/v1/inbox/unread-count`:

```json
{
  "messages": 2,
  "notifications": 7,
  "unread_count": 9
}
```

Fields: `id`, `user_id`, `event_id`, `type`, `title`, `body`, `entity_type`,
`entity_id`, `is_read`, `created_at`, `read_at`.

`notification.type` untuk Business Matching: `new_message`, `meeting_request`, `meeting_accepted`, `meeting_declined`,
`meeting_confirmed`, `meeting_reschedule`, `meeting_cancelled`, `meeting_reschedule_requested`,
`meeting_requested`, dan untuk pembayaran `payment_status_update`.

Contoh response item notifikasi:

```json
{
  "id": "uuid-notif",
  "user_id": "uuid-user",
  "event_id": "uuid-event",
  "type": "payment_status_update",
  "title": "Status pembayaran berubah",
  "body": "Pembayaran midtrans untuk order IWBIF-2026-001 menjadi success. Ref: TXN-...",
  "entity_type": "order",
  "entity_id": "uuid-order",
  "is_read": false,
  "created_at": "2026-08-23T10:00:00Z",
  "read_at": null
}
```

Badge chat memakai `/messages/unread-count`; badge notification memakai
`/notifications/unread-count` untuk user biasa dan `/admin/notifications/unread-count`
untuk admin/organizer. Untuk ikon inbox keseluruhan, pakai
`/inbox/unread-count` yang mengembalikan jumlah pesan + notifikasi dalam satu
response.

### Alur mismatch payment gateway vs backend report

Frontend tidak boleh mengambil status sukses dari:

- redirect halaman gateway,
- `provider_order_id`,
- `provider_transaction_id`,
- token atau status lokal Snap/SDK.

Sumber kebenaran tetap endpoint `GET /api/v1/payments/{payment_id}`.

- Untuk user: jika pending bertahan setelah gateway mengirim success, tampilkan
  status "Menunggu verifikasi admin/payment gateway".
- Untuk admin/organizer: notifikasi tipe `payment_status_update` dikirim ke inbox
  dan dapat digunakan untuk menindaklanjuti verifikasi manual:
  - `GET /api/v1/admin/notifications?event_id=<uuid>`
  - `POST /api/v1/admin/notifications/{notification_id}/read`
  - `GET /api/v1/admin/transactions`
  - `PATCH /api/v1/admin/transactions/{payment_id}/status` untuk manual maupun
    payment gateway;
  - `POST /api/v1/admin/orders/{order_id}/confirm-manual-payment` khusus alur
    manual lama berbasis order.

`entity_type` yang umum dipakai pada kasus ini: `order`, `payment`,
`manual_payment`, `manual_payment_confirmation`, `admin_order`.

## 13. Payment gateway: DOKU dan Midtrans

### Katalog payment method untuk frontend

```http
GET /api/v1/payments/methods
```

Endpoint ini membaca channel/provider aktif dari database, bukan memanggil gateway pada
setiap halaman. Respons publik memuat `id`, `provider`, `code`, `category`,
`display_name`, `logo_url`, dan `sort_order`; metadata merchant serta credential
rahasia tidak pernah dikembalikan.

Admin mengelola katalog melalui:

```http
GET|POST /api/v1/admin/payment-channels
PUT|DELETE /api/v1/admin/payment-channels/{channel_id}
```

Contoh payload create/update:

```json
{"provider":"midtrans","code":"SNAP","category":"gateway","display_name":"Midtrans","logo_url":"https://...","config_key":"MIDTRANS_SNAP","is_enabled":true,"sort_order":200}
```

Katalog di-seed oleh `python scripts/seed_payment_channels.py`; seluruh item
awal nonaktif. Aktifkan melalui admin hanya setelah channel/provider aktif di
dashboard gateway dan secret backend lengkap. `logo_url` adalah URL aset yang dikelola operator;
backend tidak mengunduh logo dari DOKU saat request frontend.

### DOKU Direct API SNAP

Flow frontend: ambil bank → pilih bank → buat VA → tampilkan VA/expiry/instruksi
→ poll status. Notification DOKU adalah penentu status final.

```http
GET /api/v1/payments/doku/direct/methods
```

```json
{"success":true,"data":{"virtual_accounts":["BCA","BNI"],"qris":false}}
```

```http
POST /api/v1/payments/doku/direct/va
Authorization: Bearer <access_token>
```

```json
{"registration_id":"uuid","bank_code":"BCA"}
```

Response data:

```json
{"payment_id":"uuid","order_id":"uuid","order_number":"ORD-...","status":"pending","bank_code":"BCA","virtual_account_no":"1234567890","amount":8000000,"currency":"IDR","expires_at":"2026-08-15T13:00:00Z","instructions_url":"https://app.doku.com/how-to-pay/..."}
```

Polling/detail — **Auth** dan ownership checked:

```http
GET /api/v1/payments/{payment_id}
GET /api/v1/orders/{order_id}
GET /api/v1/orders
GET /api/v1/orders/{order_id}/detail
POST /api/v1/orders/{order_id}/continue-payment
DELETE /api/v1/orders/{order_id}
GET /api/v1/payments/registrations/{registration_ref}/invoice
GET /api/v1/payments/me/invoices?event_id={optional_uuid}
```

Kedua endpoint invoice mengembalikan invoice registration. Order berstatus
`paid` yang belum mempunyai `registration_id` belum dapat menghasilkan invoice
registration. Dalam kondisi `purchase_tracking.status=paid_profile_incomplete`,
frontend mengarahkan user ke form profil terlebih dahulu. Setelah create
registration berhasil dan backend menautkan order, frontend dapat memuat ulang
endpoint invoice.

### Pending order dan continue payment

Checkout memindahkan item cart menjadi snapshot `order_items`. User tidak perlu
memilih package ulang ketika payment gagal, kedaluwarsa, browser ditutup, atau
session frontend hilang. Gunakan:

```http
GET /api/v1/orders?status=pending&event_id=<optional_uuid>&page=1&size=20
```

Response memiliki pagination `page`, `size`, `total`, `pages`. Setiap item:

```json
{
  "order": {
    "id": "order-uuid",
    "event_id": "event-uuid",
    "order_number": "ORD-...",
    "status": "pending",
    "total_amount": 8000000,
    "currency": "IDR",
    "allowed_actions": ["continue_payment", "cancel"]
  },
  "items": [{
    "id": "order-item-uuid",
    "product_id": "product-uuid",
    "product_code": "DELEGATE_FULL",
    "product_name": "Full Package",
    "product_type": "delegate",
    "quantity": 1,
    "unit_price": 8000000,
    "currency": "IDR",
    "line_total": 8000000,
    "metadata": {}
  }],
  "latest_payment": {
    "id": "payment-uuid",
    "provider": "midtrans",
    "payment_sequence": 1,
    "payment_sequence_count": 2,
    "gross_amount": 9000000,
    "transaction_status": "expired"
  },
  "payment_attempts": [],
  "paid_amount": 9000000,
  "remaining_amount": 7500000,
  "is_payment_complete": false
}
```

`GET /api/v1/orders/{order_id}/detail` mengembalikan struktur item yang sama.
Untuk melanjutkan:

```json
POST /api/v1/orders/{order_id}/continue-payment
{"provider":"doku"}
```

Nilai provider adalah `doku` atau `midtrans`. Attempt aktif yang belum expired
dapat menggunakan URL/token lama; attempt gagal/expired tetap tersimpan dan
attempt baru dibuat pada order yang sama dan sequence sukses tidak diulang.
Webhook gagal/expired tidak lagi membatalkan order, sehingga order tetap
`pending` atau `partially_paid` dan payable. Simpan `order_id` sebagai resume key;
jangan menyimpan gateway token sebagai identitas transaksi utama.

`DELETE /api/v1/orders/{order_id}` melakukan soft-cancel terhadap order belum
lunas serta attempt `created/pending`. Payload body opsional:
`{"reason":"..."}`. Order `paid` atau yang mempunyai attempt `success` ditolak
dengan `409 PAID_ORDER_CANCEL_FORBIDDEN`. Soft-canceled order memiliki
`allowed_actions=[]`; legacy order yang dahulu dibatalkan gateway tanpa
`canceled_by` tetap dapat dipulihkan melalui continue payment.

Payment fields: IDs/provider references, `payment_type`, `gross_amount`,
`currency`, `transaction_status`, `paid_at`, `channel_code`,
`virtual_account_no`, `payment_instructions_url`, `payment_sequence`, dan
`payment_sequence_count`. Order detail juga menyediakan `paid_amount`,
`remaining_amount`, dan `is_payment_complete`. Order status: `draft`,
`pending`, `partially_paid`, `paid`, `expired`, `canceled`. Payment status: `created`, `pending`,
`success`, `failed`, `expired`, `refunded`, `canceled`.

Frontend hanya menganggap pembayaran selesai jika parent order `paid` atau
`is_payment_complete=true`. Child payment `success` dapat berarti baru satu
bagian. Selama `partially_paid`, ticket dan proses registrasi lanjutan harus
disembunyikan dan pengguna diarahkan ke `continue-payment`.

Jika provider sudah sukses tetapi webhook hilang, organizer memverifikasi ID dan
nominal di portal provider lalu memakai:

```http
PATCH /api/v1/admin/transactions/{payment_id}/status
```

```json
{"status":"success","paid_at":"2026-08-30T14:30:00+07:00","notes":"Verified in provider portal; webhook missing"}
```

Endpoint tersebut hanya mengonfirmasi payment part terkait dan menyimpan audit
event. Jangan memakai `confirm-manual-payment` untuk rekonsiliasi Midtrans/DOKU;
endpoint itu khusus pembayaran manual penuh.

Server-to-server; **jangan dipanggil frontend**:

```http
POST /api/v1/doku/snap/authorization/v1/access-token/b2b
POST /api/v1/webhooks/doku/snap/va/payment
POST /api/v1/webhooks/doku
```

### SNAP Direct Debit (CIMB, BRI, Mandiri, Allo)

Direct Debit memakai endpoint generik; `channel_code` memilih kanal bank yang
credential-nya tersimpan di server. Frontend tidak pernah menerima Consumer
Secret, Merchant ID, Terminal ID, atau token rekening.

```http
POST /api/v1/payments/doku/snap/direct-debit/bindings
Authorization: Bearer <access-token>
Content-Type: application/json

{"registration_id":"uuid","channel_code":"CIMB","phone_no":"628123456789","device_id":"optional-device-id"}
```

Respons: `binding_id`, `channel_code`, `status`, dan `redirect_url`. Arahkan
browser ke `redirect_url` apabila disediakan DOKU untuk otorisasi bank/OTP/PIN.

```http
POST /api/v1/payments/doku/snap/direct-debit/payment
Authorization: Bearer <access-token>
Content-Type: application/json

{"registration_id":"uuid","binding_id":"uuid"}
```

Respons berisi `payment_id`, `order_id`, `partner_reference_no`, `status`, dan
`redirect_url`. Kanal yang meminta OTP menggunakan:

```http
POST /api/v1/payments/doku/snap/direct-debit/payment/{payment_id}/otp
Authorization: Bearer <access-token>
Content-Type: application/json

{"binding_id":"uuid","otp":"123456"}
```

Server-to-server, **jangan dipanggil frontend**:

```http
POST /api/v1/webhooks/doku/snap/direct-debit/payment
```

`GET /api/v1/payments/doku/snap/direct-debit/binding/return` adalah browser
landing URL setelah proses binding; endpoint ini tidak menetapkan status paid.

Konfigurasi dashboard DOKU untuk seluruh kanal Direct Debit:

```text
Binding URL: https://api-event.gagakrimang.web.id/api/v1/payments/doku/snap/direct-debit/binding/return
Payment Notification URL: https://api-event.gagakrimang.web.id/api/v1/webhooks/doku/snap/direct-debit/payment
```

Callback memvalidasi signature SNAP, nominal, dan idempotensi `X-EXTERNAL-ID`.
Pembayaran sukses mengubah payment/order/registrasi menjadi paid dan muncul pada
laporan pendapatan berdasarkan `channel_code`.

### SNAP e-Wallet callback

e-Wallet memakai URL sendiri dan tidak boleh dikirim ke webhook Direct Debit:

```text
Authorization Return URL: https://api-event.gagakrimang.web.id/api/v1/payments/doku/snap/e-wallet/authorization/return
Payment Notification URL: https://api-event.gagakrimang.web.id/api/v1/webhooks/doku/snap/e-wallet/payment
```

Authorization return adalah browser landing. `POST /api/v1/webhooks/doku/snap/e-wallet/payment`
khusus dipanggil DOKU, memverifikasi signature SNAP dengan credential kanal, dan
memproses callback secara idempoten.

Endpoint itu memakai acknowledgment/signature DOKU, bukan envelope biasa.
`POST /api/v1/payments/doku/checkout` digunakan untuk flow store-first dengan
`order_id`. Direct VA adalah flow utama untuk registration-first yang sudah
memiliki `registration_id`.
Setelah Checkout, DOKU dapat mengarahkan browser ke
`GET /api/v1/payments/doku/return`. Endpoint ini hanya landing page dan tidak
pernah mengubah status pembayaran; frontend tetap membaca order/invoice setelah
notification terverifikasi oleh backend.

### QRIS melalui DOKU Checkout

QRIS Direct diaktifkan bila `DOKU_QRIS_MERCHANT_ID` dan
`DOKU_QRIS_TERMINAL_ID` telah diisi pada secret manager. Frontend membuat QR
dinamis lewat endpoint berikut dan menampilkan `qr_content` sebagai QR image:

```http
POST /api/v1/payments/doku/direct/qris
Authorization: Bearer <access-token>
Content-Type: application/json

{"registration_id":"uuid"}
```

Respons berisi `payment_id`, `order_id`, `order_number`, `status`, `qr_content`,
`amount`, `currency`, dan `expires_at`. Bila konfigurasi lengkap, endpoint
`GET /api/v1/payments/doku/direct/methods` mengembalikan `qris: true`.

Konfigurasi **QR Payment → Notify URL** di dashboard DOKU:

```text
https://api-event.gagakrimang.web.id/api/v1/webhooks/doku
```

Endpoint tersebut memverifikasi signature Checkout/Non-SNAP dan memperbarui
payment, order, registrasi, serta laporan pendapatan saat notifikasi sukses.
Browser callback/redirect bukan bukti pembayaran. Frontend mem-poll
`GET /api/v1/payments/{payment_id}` dan hanya menampilkan sukses setelah
notifikasi DOKU tervalidasi backend.

### Midtrans Snap

Endpoint checkout Midtrans menerima kontrak yang sama dengan DOKU Checkout.
Request harus memuat tepat satu dari `order_id` atau `registration_id` dan
membutuhkan Bearer token milik user:

```http
POST /api/v1/payments/midtrans/checkout
Authorization: Bearer <access_token>
Content-Type: application/json

{"order_id":"order-uuid"}
```

Alternatif registration-first:

```json
{"registration_id":"registration-uuid"}
```

Nominal tidak diterima dari frontend. Backend mengambil nominal IDR bulat dari
order, membuat Midtrans Snap transaction, dan mengembalikan data berikut:

```json
{
  "success": true,
  "data": {
    "payment_url": "https://app.sandbox.midtrans.com/snap/v4/redirection/...",
    "token": "midtrans-snap-token",
    "expires_at": "2026-08-22T15:00:00Z",
    "already_paid": false,
    "payment_id": "payment-uuid",
    "order_status": "pending",
    "requires_payment": true
  },
  "meta": {"order_id":"order-uuid","order_number":"ORD-..."}
}
```

Frontend dapat redirect ke `payment_url`, atau memberikan `token` kepada
Snap.js. `MIDTRANS_CLIENT_KEY` adalah public credential untuk Snap.js;
`MIDTRANS_SERVER_KEY` tidak boleh dikirim ke browser.

Jika order sudah dibayar, response memiliki `already_paid: true`,
`requires_payment: false`, dan URL/token kosong. Untuk polling gunakan endpoint
detail payment/order yang sama dengan DOKU. Browser return tersedia di:

```http
GET /api/v1/payments/midtrans/return
```

Endpoint return hanya landing dan tidak mengubah status. Notification berikut
khusus server-to-server dan **jangan dipanggil frontend**:

```http
POST /api/v1/webhooks/midtrans
```

Backend memverifikasi SHA-512 `signature_key`, mengambil ulang transaction
status melalui Midtrans Status API, mencocokkan `order_id`, status dan nominal,
lalu memproses event secara idempoten. Mapping status utamanya:

Contoh inbound transaction notification (field metode pembayaran bersifat
kondisional):

```json
{
  "transaction_time": "2026-08-24 10:15:00",
  "transaction_status": "settlement",
  "transaction_id": "midtrans-transaction-uuid",
  "status_message": "midtrans payment notification",
  "status_code": "200",
  "signature_key": "sha512-signature",
  "settlement_time": "2026-08-24 10:16:00",
  "payment_type": "bank_transfer",
  "order_id": "ORD-...-MT-ABC12345",
  "merchant_id": "merchant-id",
  "gross_amount": "10000.00",
  "fraud_status": "accept",
  "currency": "IDR",
  "va_numbers": [{"bank": "bca", "va_number": "1234567890"}]
}
```

| Midtrans | Status payment backend |
|---|---|
| `settlement` | `success` |
| `capture` + fraud `accept` | `success` |
| `pending` atau capture `challenge` | `pending` |
| `deny`, `cancel`, `failure` | `failed` |
| `expire` | `expired` |
| `refund`, `partial_refund` | `refunded` |

Setiap attempt memakai Midtrans order ID tersendiri, sementara `order_number`
bisnis tetap sama. Karena itu user dapat memilih DOKU atau Midtrans untuk order
yang sama tanpa membuat webhook salah memperbarui transaksi provider lain.

Payload mentah, header transport terpilih, hasil parsing, dan error pemrosesan
setiap notification disimpan lebih dahulu di `payment_webhook_captures`.
Capture tetap tersimpan ketika JSON invalid, signature gagal, payment tidak
ditemukan, atau verifikasi Status API gagal. Nilai `provider` untuk endpoint
transaksi biasa adalah `midtrans`.

#### Midtrans recurring/subscription notification

```http
POST /api/v1/webhooks/midtrans/recurring
Content-Type: application/json
```

Endpoint ini menerima dua bentuk notification Subscription API: objek
subscription langsung (`id`, `status`, dan atribut subscription lain), atau
event charge yang memiliki objek `subscription`, `transaction`, dan
`event_name`. Minimal harus tersedia `subscription.id` dan
`subscription.status`.

Contoh inbound saat subscription dibuat:

```json
{
  "id": "subscription-uuid",
  "status": "active",
  "name": "IWBIF-SUBSCRIPTION-001",
  "amount": "10000",
  "currency": "IDR",
  "payment_type": "gopay",
  "merchant_id": "merchant-id",
  "token": "subscription-payment-token",
  "schedule": {
    "start_time": "2026-09-01T00:00:00Z",
    "next_execution_at": "2026-09-01T00:00:00Z",
    "interval_unit": "month",
    "interval": 1,
    "current_interval": 0
  },
  "gopay": {"account_id": "gopay-account-uuid"}
}
```

Contoh inbound hasil recurring charge; untuk kegagalan, `status_code` dan
`status_message` berubah, `transaction_id` dapat tidak tersedia, dan status
subscription dapat menjadi `inactive`:

```json
{
  "event_name": "subscription.charge",
  "transaction": {
    "transaction_status": "settlement",
    "transaction_id": "midtrans-transaction-uuid",
    "status_code": "200"
  },
  "subscription": {
    "id": "subscription-uuid",
    "status": "active",
    "name": "IWBIF-SUBSCRIPTION-001",
    "amount": "10000",
    "currency": "IDR",
    "payment_type": "gopay",
    "merchant_id": "merchant-id",
    "schedule": {
      "start_time": "2026-09-01T00:00:00Z",
      "next_execution_at": "2026-10-01T00:00:00Z",
      "interval_unit": "month",
      "interval": 1,
      "current_interval": 1
    }
  }
}
```

Notification disimpan dengan provider `midtrans_recurring`. Karena contoh
notification Subscription API resmi tidak menyertakan `signature_key` dan
aplikasi belum memiliki model subscription, endpoint hanya menyimpan dan
mengakui event untuk audit; endpoint ini tidak mengubah order atau payment.

Contoh acknowledgment:

```json
{
  "success": true,
  "message": "Notifikasi recurring Midtrans diterima",
  "data": {"result": "captured:subscription-id:active"}
}
```

#### Midtrans GoPay account linking notification

```http
POST /api/v1/webhooks/midtrans/account-linking
Content-Type: application/json
```

Field wajib untuk verifikasi adalah `account_id`, `account_status`,
`status_code`, dan `signature_key`. Signature diverifikasi dengan formula:

```text
SHA512(account_id + account_status + status_code + MIDTRANS_SERVER_KEY)
```

Contoh inbound account linking/unlinking:

```json
{
  "account_id": "gopay-account-uuid",
  "merchant_id": "merchant-id",
  "payment_type": "gopay",
  "signature_key": "sha512-signature",
  "status_code": "200",
  "account_status": "ENABLED",
  "status_message": "Midtrans account linked notification"
}
```

Nilai `account_status` yang perlu ditangani meliputi `PENDING`, `EXPIRED`,
`ENABLED`, dan `DISABLED`.

Notification disimpan dengan provider `midtrans_account`. Endpoint ini
memverifikasi dan mengaudit status linking/unlinking, tetapi belum memetakan
akun GoPay ke user aplikasi.

Contoh acknowledgment:

```json
{
  "success": true,
  "message": "Notifikasi account linking Midtrans diterima",
  "data": {"result": "verified:account-id:enabled"}
}
```

Konfigurasi backend melalui environment/secret manager:

```env
MIDTRANS_SERVER_KEY=
MIDTRANS_CLIENT_KEY=
MIDTRANS_IS_PRODUCTION=false
MIDTRANS_PAYMENT_DUE_MINUTES=60
MIDTRANS_CALLBACK_URL=https://frontend.example/payment/result
```

Gunakan sandbox dengan `MIDTRANS_IS_PRODUCTION=false`. Pada dashboard Midtrans,
atur URL berikut sesuai fitur yang digunakan:

```text
Finish Redirect URL:
https://<frontend-host>/dashboard/payment-status

Payment Notification URL:
https://<backend-host>/api/v1/webhooks/midtrans

Recurring Payment Notification URL:
https://<backend-host>/api/v1/webhooks/midtrans/recurring

Account Linking Notification URL:
https://<backend-host>/api/v1/webhooks/midtrans/account-linking
```

Recurring dan account linking hanya perlu diisi ketika Subscription API atau
GoPay Tokenization digunakan. Seluruh notification harus dikirim langsung oleh
Midtrans ke URL HTTPS publik dan tidak boleh dipanggil frontend.

Untuk production, gunakan production Server/Client Key dan ubah
`MIDTRANS_IS_PRODUCTION=true`. Jangan commit key asli ke repository.

### Laporan pembayaran dan pendapatan organizer

### Pengelolaan seluruh transaksi oleh organizer

Endpoint berikut mencakup pembayaran manual, DOKU, Midtrans, dan provider lain.
Seluruhnya memerlukan role `admin` atau `organizer`:

```text
GET    /api/v1/admin/transactions
PATCH  /api/v1/admin/transactions/{payment_id}/status
DELETE /api/v1/admin/transactions/{payment_id}
POST   /api/v1/admin/transactions/bulk-actions
```

Endpoint daftar menerima filter `event_id`, `date_from`, `date_to`, `status`,
`provider`, `channel_code`, `package_id`, `limit`, `offset`, dan
`include_deleted`. Tanpa `provider`, semua provider dikembalikan. Soft-deleted
transaction tidak ditampilkan kecuali `include_deleted=true`. Pagination berada
pada `meta`; `data.transactions` hanya berisi slice sesuai `limit` dan `offset`,
sedangkan agregasi pada `data.summary` dihitung dari seluruh hasil filter.

Contoh response `GET /api/v1/admin/transactions?limit=20&offset=0`:

```json
{
  "success": true,
  "message": "Semua transaksi pembayaran berhasil diambil",
  "data": {
    "summary": {
      "total_transactions": 1,
      "successful_transactions": 1,
      "pending_transactions": 0,
      "failed_transactions": 0,
      "expired_transactions": 0,
      "gross_revenue": 8000000,
      "pending_amount": 0,
      "currency": "IDR"
    },
    "by_status": [{"status":"success","transactions":1,"amount":8000000}],
    "by_channel": [],
    "by_package": [],
    "daily_revenue": [],
    "transactions": [{
      "payment_id": "75c9e112-2974-49e2-bd6c-65c23e343d28",
      "order_id": "ad3df206-c6cc-4053-b80a-edb59b9f4647",
      "order_number": "ORD-2026-0001",
      "provider": "midtrans",
      "transaction_status": "success",
      "order_status": "paid",
      "gross_amount": 8000000,
      "currency": "IDR",
      "provider_transaction_id": "midtrans-transaction-id",
      "provider_order_id": "ORD-2026-0001-MT-A1B2C3D4",
      "paid_at": "2026-08-27T08:00:00Z",
      "deleted_at": null,
      "deleted_by": null,
      "deletion_reason": null,
      "allowed_actions": ["paid", "success"]
    }]
  },
  "meta": {"total":1,"limit":20,"offset":0},
  "request_id": "request-uuid",
  "timestamp": "2026-08-27T08:01:00Z"
}
```

Payload perubahan status:

```json
{"status":"paid","notes":"Sudah diverifikasi pada rekening/gateway"}
```

Nilai canonical pembatalan payment adalah **`canceled`** (satu huruf `l`).
`cancelled` tidak diterima untuk API payment. Istilah `cancelled` yang masih ada
pada domain meeting/business matching tidak termasuk kontrak payment.

`paid` adalah alias command untuk `success`: keduanya menyimpan
`payment.transaction_status=success` dan `order.status=paid`. Contoh response
berhasil `PATCH`:

```json
{
  "success": true,
  "message": "Status transaksi pembayaran berhasil diperbarui",
  "data": {
    "order": {
      "id":"ad3df206-c6cc-4053-b80a-edb59b9f4647",
      "registration_id":"e54bbb58-f309-471e-ac02-14dc7ec9b11f",
      "order_number":"ORD-2026-0001",
      "subtotal":8000000,
      "discount_amount":0,
      "tax_amount":0,
      "service_fee":0,
      "total_amount":8000000,
      "currency":"IDR",
      "status":"paid",
      "expires_at":"2026-08-27T09:00:00Z"
    },
    "payment": {
      "id":"75c9e112-2974-49e2-bd6c-65c23e343d28",
      "order_id":"ad3df206-c6cc-4053-b80a-edb59b9f4647",
      "provider":"midtrans",
      "provider_transaction_id":"midtrans-transaction-id",
      "provider_order_id":"ORD-2026-0001-MT-A1B2C3D4",
      "payment_type":"bank_transfer",
      "gross_amount":8000000,
      "currency":"IDR",
      "transaction_status":"success",
      "fraud_status":null,
      "paid_at":"2026-08-27T08:00:00Z",
      "checkout_url":null,
      "channel_code":"BCA",
      "virtual_account_no":null,
      "provider_reference_no":null,
      "payment_instructions_url":null,
      "deleted_at":null,
      "deleted_by":null,
      "deletion_reason":null,
      "allowed_actions":["paid","success"]
    }
  },
  "meta": null,
  "request_id": "request-uuid",
  "timestamp": "2026-08-27T08:01:00Z"
}
```

Matriks transisi organizer:

| Status awal payment | `paid`/`success` | `canceled` | soft-delete |
|---|---|---|---|
| `created` | Diizinkan | Diizinkan | Diizinkan |
| `pending` | Diizinkan | Diizinkan | Diizinkan |
| `failed` | Diizinkan setelah verifikasi | Diizinkan | Diizinkan |
| `expired` | Diizinkan setelah verifikasi gateway/rekening | Diizinkan | Diizinkan |
| `canceled` | Diizinkan setelah verifikasi | Idempotent | Diizinkan |
| `success` | Idempotent | **Ditolak 409** | **Ditolak 409** |
| `refunded` | **Ditolak 409** | **Ditolak 409** | **Ditolak 409** |

Frontend tidak perlu menghitung matriks tersebut. Setiap transaksi memiliki
`allowed_actions`, dan tombol aksi harus dibentuk dari field ini:

- `created`, `pending`, `failed`, `expired`, `canceled`:
  `["paid","success","canceled","delete"]`;
- `success`: `["paid","success"]` untuk retry idempotent, tanpa cancel/delete;
- `refunded` atau soft-deleted: `[]`.

`allowed_actions` dikembalikan oleh GET transaction list, objek payment pada
response PATCH, response DELETE, dan setiap item response bulk. Backend tetap
melakukan validasi ulang; field ini adalah kapabilitas UI, bukan pengganti
otorisasi atau validasi server.

Transaksi `success` tidak boleh dibatalkan atau dihapus karena merupakan catatan
keuangan final. Gunakan proses refund tersendiri ketika dana benar-benar
dikembalikan. `DELETE` adalah soft-delete dan hanya berlaku pada transaksi
non-final: row payment, bukti pembayaran, dan seluruh audit event tetap
dipertahankan. Contoh response:

```json
{
  "success": true,
  "message": "Transaksi pembayaran berhasil dihapus secara soft-delete",
  "data": {
    "payment_id": "75c9e112-2974-49e2-bd6c-65c23e343d28",
    "order_id": "ad3df206-c6cc-4053-b80a-edb59b9f4647",
    "deleted_at": "2026-08-27T08:05:00Z",
    "deleted_by": "organizer-user-uuid",
    "allowed_actions": []
  },
  "meta": null,
  "request_id": "request-uuid",
  "timestamp": "2026-08-27T08:05:00Z"
}
```

Bulk action menerima maksimal 500 ID unik dan bersifat atomik:

```json
{
  "payment_ids": ["payment-uuid-1", "payment-uuid-2"],
  "action": "success",
  "notes": "Cocok dengan settlement gateway",
  "paid_at": "2026-08-27T08:00:00Z"
}
```

`action` adalah `paid`, `success`, `canceled`, atau `delete`. Jika satu item
tidak ditemukan atau melanggar matriks transisi, seluruh batch di-rollback.
Response sukses memuat `action`, `processed`, dan array `transactions` berisi
`payment_id`, `order_id`, `transaction_status`, `order_status`, serta
`deleted_at`, dan `allowed_actions`.

Contoh response bulk:

```json
{
  "success": true,
  "message": "Bulk action transaksi pembayaran berhasil",
  "data": {
    "action": "canceled",
    "processed": 2,
    "transactions": [
      {
        "payment_id": "payment-uuid-1",
        "order_id": "order-uuid-1",
        "transaction_status": "canceled",
        "order_status": "canceled",
        "deleted_at": null,
        "allowed_actions": ["paid", "success", "canceled", "delete"]
      },
      {
        "payment_id": "payment-uuid-2",
        "order_id": "order-uuid-2",
        "transaction_status": "canceled",
        "order_status": "canceled",
        "deleted_at": null,
        "allowed_actions": ["paid", "success", "canceled", "delete"]
      }
    ]
  },
  "meta": null,
  "request_id": "request-uuid",
  "timestamp": "2026-08-27T08:15:00Z"
}
```

Error contract:

| HTTP | Kondisi | Contoh code |
|---|---|---|
| `400` | Filter/periode/status tidak valid | `INVALID_PAYMENT_STATUS`, `INVALID_REPORT_PERIOD` |
| `404` | Payment atau order tidak ditemukan | `PAYMENT_NOT_FOUND`, `ORDER_NOT_FOUND` |
| `409` | Transisi dilarang, sudah soft-delete, atau mencoba delete transaksi final | `INVALID_PAYMENT_STATUS_TRANSITION`, `PAYMENT_DELETED`, `PAYMENT_ALREADY_DELETED`, `PAYMENT_DELETE_FORBIDDEN` |
| `422` | UUID, tipe field, literal action/status, atau batas 1–500 ID tidak valid | validasi request FastAPI/Pydantic |

Error aplikasi `400/404/409` memakai envelope berikut:

```json
{"success":false,"message":"Transaksi success atau refunded tidak boleh dihapus; pertahankan sebagai catatan keuangan","errors":[{"field":"","code":"PAYMENT_DELETE_FORBIDDEN","message":"Transaksi success atau refunded tidak boleh dihapus; pertahankan sebagai catatan keuangan"}],"request_id":"request-uuid","timestamp":"2026-08-27T08:10:00Z"}
```

Laporan DOKU dan Midtrans dipisahkan agar referensi transaksi, channel, dan CSV
tidak tercampur. Semua endpoint berikut memerlukan Bearer token dengan role
`admin` atau `organizer`:

```http
# DOKU (termasuk provider `doku_snap_*`)
GET /api/v1/admin/reports/payments
GET /api/v1/admin/reports/payments.csv

# Midtrans
GET /api/v1/admin/reports/payments/midtrans
GET /api/v1/admin/reports/payments/midtrans.csv
Authorization: Bearer <admin_access_token>
```

Query parameter opsional untuk seluruh endpoint laporan:

- `event_id`: UUID event.
- `date_from`, `date_to`: datetime ISO 8601. Filter memakai `paid_at`, atau
  `created_at` ketika transaksi belum dibayar.
- `status`: `created`, `pending`, `success`, `failed`, `expired`, `refunded`,
  atau `canceled`.
- `channel_code`: contoh `BCA`, `BNI`, `BRI`, atau `MANDIRI`.
- `package_id`: UUID delegate package/tiket.
- Khusus JSON: `limit` 1–500 dan `offset` untuk daftar transaksi.

Response JSON memberikan `summary`, agregasi `by_status`, `by_channel`,
`by_package`, `daily_revenue`, dan daftar `transactions`. Contoh summary:

Pembayaran store-first tetap dihitung ketika form Delegate belum dibuat dan
`order.registration_id` masih `null`. Pada tahap tersebut field registration,
event, customer, serta package dapat bernilai `null` dan akan terisi setelah
order ditautkan saat registration dibuat.

Untuk Midtrans, `channel_code` menunjukkan payment rail (`QRIS`, `GOPAY`,
`SHOPEEPAY`, `CREDIT_CARD`, atau bank VA), bukan issuer/acquirer QRIS. Nilai
`gross_amount` berasal dari Status API Midtrans setelah nominal tersebut cocok
dengan total order; ini adalah nominal tagihan gateway, bukan settlement net
setelah biaya layanan provider.

```json
{"total_transactions":12,"successful_transactions":8,"pending_transactions":2,"failed_transactions":1,"expired_transactions":1,"gross_revenue":64000000,"pending_amount":16000000,"currency":"IDR"}
```

Setiap item `transactions` pada laporan Midtrans memuat dua referensi gateway:

- `provider_order_id`: Midtrans order ID unik yang dibuat saat checkout, contoh
  `ORD-...-MT-ABC12345`. Field ini tersedia sebelum pembayaran selesai dan dapat
  dipakai untuk mencari transaksi atau memanggil Status API Midtrans.
- `provider_transaction_id`: `transaction_id` resmi dari Midtrans. Field ini
  diisi setelah notification diterima dan hasilnya diverifikasi ulang ke
  Midtrans; pada transaksi baru/pending field ini dapat bernilai `null`.

Contoh transaksi Midtrans:

```json
{
  "payment_id": "payment-uuid",
  "transaction_status": "success",
  "provider_order_id": "ORD-2026-MT-ABC12345",
  "provider_transaction_id": "midtrans-transaction-uuid",
  "gross_amount": 8000000,
  "currency": "IDR",
  "order_status": "paid",
  "paid_at": "2026-08-23T10:15:00Z",
  "customer_email": "participant@example.com"
}
```

Untuk rekonsiliasi, anggap pembayaran final hanya jika
`transaction_status=success` dan `order_status=paid`. Keberadaan salah satu ID
gateway saja bukan bukti pembayaran. Gunakan `provider_order_id` untuk menelusuri
transaksi pending/not payment, dan `provider_transaction_id` sebagai referensi
transaksi yang telah dilaporkan Midtrans.

`gross_revenue`, `tickets_sold`, dan `daily_revenue` hanya menghitung payment
berstatus `success`. Browser return tidak pernah dihitung sebagai keberhasilan;
sumber final tetap notification gateway yang telah diverifikasi. CSV berisi detail
payment, order, registrasi, event, peserta, paket, channel,
`provider_order_id`, `provider_transaction_id`, reference gateway,
nominal, dan waktu pembayaran sesuai filter yang sama.

### Laporan participant, package, dan status pembayaran

Laporan ini mengelompokkan pembelian berdasarkan participant. Satu participant
tetap menjadi satu item pada response JSON dan seluruh package yang pernah
diambil tersedia di dalam array `packages`. Dengan demikian, participant yang
mengambil beberapa package dalam satu order maupun beberapa order berbeda tidak
terpotong menjadi satu package saja.

Semua endpoint memerlukan Bearer token dengan role `admin` atau `organizer`:

```http
GET /api/v1/admin/reports/participants
GET /api/v1/admin/reports/participants.csv
Authorization: Bearer <admin_access_token>
```

Query parameter opsional:

- `event_id`: UUID event yang package-nya ingin ditampilkan.
- `package_id`: UUID delegate package.
- `payment_status`: `created`, `pending`, `success`, `failed`, `expired`,
  `refunded`, atau `canceled`.
- `search`: pencarian case-insensitive pada nama participant, email, atau nama
  organisasi.
- Khusus JSON: `page` mulai dari 1 dan `size` 1–200. Pagination dilakukan per
  participant, bukan per package.

Contoh request:

```http
GET /api/v1/admin/reports/participants?event_id=<event_uuid>&payment_status=success&page=1&size=20
```

Contoh response participant dengan lebih dari satu package:

```json
{
  "participant_id": "participant-uuid",
  "user_id": "user-uuid",
  "full_name": "Participant Example",
  "email": "participant@example.com",
  "phone": "+628123456789",
  "country": "Indonesia",
  "organization_name": "Example Organization",
  "registration_status": "paid",
  "packages": [
    {
      "event_id": "event-uuid",
      "package_id": "package-a-uuid",
      "package_code": "A",
      "package_name": "Package A",
      "package_type": "delegate",
      "quantity": 1,
      "unit_price": 8000000,
      "line_total": 8000000,
      "currency": "IDR",
      "order_id": "order-1-uuid",
      "order_number": "ORD-001",
      "order_status": "paid",
      "payment_id": "payment-1-uuid",
      "payment_status": "success",
      "payment_provider": "midtrans",
      "paid_at": "2026-08-24T10:00:00+00:00"
    },
    {
      "event_id": "event-uuid",
      "package_id": "package-c-uuid",
      "package_code": "C",
      "package_name": "Package C",
      "package_type": "delegate",
      "quantity": 1,
      "unit_price": 5920000,
      "line_total": 5920000,
      "currency": "IDR",
      "order_id": "order-2-uuid",
      "order_number": "ORD-002",
      "order_status": "pending",
      "payment_id": "payment-2-uuid",
      "payment_status": "pending",
      "payment_provider": "midtrans",
      "paid_at": null
    }
  ]
}
```

`payment_status` melekat pada payment terakhir dari order package tersebut,
bukan status global participant. Karena itu satu participant dapat mempunyai
Package A berstatus `success` dan Package C berstatus `pending`. Jika order belum
memiliki payment, field payment bernilai `null`.

Tanpa filter event/package/payment, participant yang belum mengambil package
tetap dikembalikan dengan `packages: []`. Jika salah satu filter tersebut
digunakan, hanya participant yang memiliki package sesuai filter yang
dikembalikan. Laporan mendukung pembelian store melalui `OrderItem` dan order
registrasi langsung yang package-nya berasal dari detail registrasi.

Export CSV memakai filter yang sama tetapi menghasilkan satu baris per package.
Identitas participant diulang pada setiap baris agar pembelian multi-package
dapat diproses di spreadsheet tanpa kehilangan relasi. Participant tanpa package
tetap mendapat satu baris ketika laporan diekspor tanpa filter package/event/payment.

## 14. Tickets dan check-in

```http
GET /api/v1/tickets/me
GET /api/v1/tickets/{ticket_id}/qr
POST /api/v1/tickets/{ticket_id}/reissue
```

Ticket: `id`, `registration_id`, `ticket_number`, `status`. Check-in staff:

Ticket issue menggunakan `POST /api/v1/tickets` dengan payload
`{"registration_id":"uuid"}`. Issue/reissue adalah operasi internal organizer,
bukan tombol peserta.

```http
POST /api/v1/check-ins/scan
```

```json
{"qr_token":"token-from-ticket","event_id":"uuid","gate_name":"Main Gate","device_id":"tablet-01"}
```

```http
POST /api/v1/check-ins/manual
```

```json
{"ticket_number":"TICKET-...","event_id":"uuid","gate_name":"Main Gate","device_id":"tablet-01"}
```

`GET /api/v1/check-ins?event_id={optional_uuid}` mengembalikan check-in. Kontrol
ini tidak boleh tampil di UI peserta.

### Absensi Hari-H (rekomendasi untuk scanner)

Frontend scanning dapat dipisah ke modul attendance untuk report yang lebih jelas:

```http
POST /api/v1/attendance/scan
GET  /api/v1/attendance/events/{event_id}/report?include_without_ticket=true
GET  /api/v1/attendance/events/{event_id}/roster/{registration_id}
```

Payload scan:

```json
{"qr_token":"token-from-ticket","event_id":"uuid","gate_name":"Main Gate","device_id":"tablet-01"}
```

Response:

```json
{
  "check_in": {
    "id":"uuid",
    "ticket_id":"uuid",
    "event_id":"uuid",
    "check_in_type":"qr",
    "check_in_at":"2026-08-22T10:00:00Z",
    "check_in_by":"uuid",
    "gate_name":"Main Gate",
    "device_id":"tablet-01",
    "status":"success",
    "notes":null
  },
  "registrant": {
    "registration_id":"uuid",
    "event_id":"uuid",
    "registration_number":"REG-....",
    "registration_status":"confirmed",
    "participant_id":"uuid",
    "participant_name":"Nama Peserta",
    "organization_name":"Nama organisasi",
    "ticket_id":"uuid",
    "ticket_number":"TIX-....",
    "is_checked_in":true
  }
}
```

`GET /api/v1/attendance/events/{event_id}/report` mengembalikan daftar registrasi
yang sudah terdaftar (kecuali status canceled) + status hadir, lengkap dengan
`summary` dan `attendance_rate`. Ini cocok untuk dashboard panitia agar langsung
mengetahui siapa yang sudah hadir, sudah terdaftar tapi belum scan, dan siapa yang
belum punya tiket (ketika `include_without_ticket=true`).  
Export CSV disarankan dilakukan dari sisi frontend agar bisa mengikuti format tampilan
yang dipilih panitia.

`GET /api/v1/attendance/events/{event_id}/roster/{registration_id}` digunakan untuk
detail satu registran, misalnya untuk pengecekan cepat saat scanner menemukan konflik
atau data belum sinkron.

## 15. Organizer/admin

### Organizer Business Matching Operations

Organizer memiliki workflow assisted matching terpisah dari chat privat peserta.
Usulan baru meminta respons kedua peserta; ketika keduanya memilih `interested`,
backend otomatis membuat meeting dengan `source=organizer_recommendation` dan
status `scheduling`.

```text
POST /api/v1/admin/events/{event_id}/business-matching/recommendations
GET  /api/v1/admin/events/{event_id}/business-matching/recommendations?status=awaiting_responses
GET  /api/v1/events/{event_id}/business-matching/organizer-recommendations
POST /api/v1/business-matching/organizer-recommendations/{recommendation_id}/respond
GET  /api/v1/admin/events/{event_id}/business-matching/report?status=requested&source=participant_request&search=company&page=1&size=20
POST /api/v1/admin/meetings/{meeting_id}/action
GET  /api/v1/admin/events/{event_id}/business-matching/settings
PUT  /api/v1/admin/events/{event_id}/business-matching/settings
```

Payload usulan organizer:

```json
{
  "participant_a_id": "uuid",
  "participant_b_id": "uuid",
  "reason": "Kebutuhan distributor sesuai dengan penawaran produsen",
  "topic": "Regional distribution partnership",
  "purpose": "Explore partnership",
  "proposed_slot_ids": ["uuid"],
  "expires_at": "2026-08-30T12:00:00Z"
}
```

Respons peserta adalah `{ "response": "interested" }` atau
`{ "response": "not_interested" }`. Status usulan: `awaiting_responses`,
`mutually_interested`, `declined`, `expired`, `converted_to_meeting`, dan
`cancelled`.

Tindakan operasional organizer menggunakan payload berikut. `slot_id` dan
`resource_id` wajib untuk action `confirm`; alasan selalu wajib agar setiap
override dapat diaudit.

```json
{
  "action": "confirm",
  "slot_id": "uuid",
  "resource_id": "uuid",
  "reason": "Confirmed by matching desk after both parties agreed"
}
```

Action yang tersedia: `confirm`, `cancel`, `complete`, dan `no_show`. Laporan
menyediakan summary seluruh status, `needs_attention`, detail kedua pihak,
sumber meeting, dan pagination. Organizer hanya menerima metadata operasional;
endpoint ini tidak membuka isi conversation privat.

Pengaturan per event mencakup aktivasi assisted matching, mutual consent,
auto-create meeting, organizer override, masa berlaku usulan, reminder sebelum
usulan kedaluwarsa, dan jadwal reminder meeting.

Contoh PUT settings:

```json
{
  "assisted_matching_enabled": true,
  "require_mutual_consent": true,
  "auto_create_meeting": true,
  "organizer_override_enabled": true,
  "recommendation_expiry_hours": 72,
  "reminder_hours_before_expiry": 24,
  "meeting_reminder_hours": [24, 1]
}
```

`require_mutual_consent` wajib `true`. Rentang expiry adalah 1–720 jam,
reminder recommendation 1–168 jam, dan maksimal lima meeting reminder. GET
settings membuat default aman jika event belum mempunyai pengaturan.

Struktur utama response report:

```json
{
  "summary": {
    "total": 24,
    "requested": 3,
    "accepted": 2,
    "scheduling": 4,
    "confirmed": 8,
    "completed": 5,
    "declined": 1,
    "cancelled": 1,
    "reschedule_requested": 0,
    "no_show": 0,
    "needs_attention": 9
  },
  "items": [
    {
      "meeting": {"id":"uuid","status":"scheduling","source":"organizer_recommendation"},
      "requester": {"id":"uuid","name":"Buyer A","organization":"Company A"},
      "recipient": {"id":"uuid","name":"Supplier B","organization":"Company B"}
    }
  ],
  "pagination": {"page":1,"size":20,"total":24,"pages":2}
}
```

`needs_attention` menjumlahkan meeting `requested`, `accepted`, `scheduling`,
dan `reschedule_requested`. Gunakan nilai ini untuk work-queue badge organizer.

Role admin/organizer:

```http
POST|GET|PUT|DELETE /api/v1/admin/events/{event_id}/delegate-packages[/{item_id}]
GET  /api/v1/admin/events/{event_id}/delegate-package-catalog
POST /api/v1/admin/events/{event_id}/delegate-packages/{package_id}/rates
PUT  /api/v1/admin/delegate-package-rates/{rate_id}
DELETE /api/v1/admin/delegate-package-rates/{rate_id}
POST /api/v1/admin/events/{event_id}/delegate-packages/{package_id}/facilities
PUT  /api/v1/admin/delegate-package-facilities/{facility_id}
DELETE /api/v1/admin/delegate-package-facilities/{facility_id}
POST|GET|PUT|DELETE /api/v1/admin/events/{event_id}/activities[/{item_id}]
POST|GET|PUT|DELETE /api/v1/admin/events/{event_id}/business-matching-slots[/{item_id}]
GET  /api/v1/admin/events/{event_id}/registrations
GET  /api/v1/admin/reports/participants
GET  /api/v1/admin/reports/participants.csv
POST /api/v1/admin/registrations/{registration_id}/verify
POST /api/v1/admin/registrations/{registration_id}/confirm
POST /api/v1/admin/registrations/{registration_id}/reject
POST /api/v1/admin/orders/{order_id}/confirm-manual-payment
```

Delete package, rate, dan facility bersifat nonaktif/soft-delete agar order lama
tetap dapat diaudit. Satu package hanya boleh mempunyai satu rate per occupancy
dan satu default aktif. Perubahan rate otomatis disinkronkan ke product checkout;
order dan registration menyimpan snapshot nama, occupancy, serta harga.

Facility mendukung `pricing_mode=included|separately_priced`, breakdown
`sharing_amount`/`single_amount`, currency, quantity/unit, urutan, dan status.
Pada implementasi saat ini total package tetap berasal dari rate package;
breakdown facility tidak dijumlahkan ulang ke checkout. Ini mencegah perubahan
rincian facility mengubah invoice tanpa perubahan tarif package yang eksplisit.

Participant dapat mengunggah bukti transfer manual atau QRIS statis sebagai
`multipart/form-data`. File disimpan privat; format yang diterima JPG, PNG, atau
PDF dengan ukuran maksimal 10 MB.

File disimpan di `.private_uploads/payment-proofs/{order_id}` dan tidak dipasang
sebagai static/public directory. User proses aplikasi harus memiliki akses
read/write, sedangkan Nginx tidak memerlukan akses langsung. Kegagalan izin
filesystem dikembalikan sebagai `500 UPLOAD_STORAGE_ERROR` dan dicatat bersama
`order_id` serta storage root pada log aplikasi. Untuk deployment Linux,
gunakan permission privat (`700` untuk direktori dan `600` untuk file) dengan
owner user Gunicorn.

```http
POST /api/v1/payments/orders/{order_id}/manual-proof
Authorization: Bearer <participant_access_token>
Content-Type: multipart/form-data

payment_method=manual_transfer|manual_qr_code
transfer_reference=<opsional, maksimal 128 karakter>
notes=<opsional, maksimal 1000 karakter>
file=<binary>
```

Upload membuat atau memperbarui payment manual menjadi `pending`; upload tidak
pernah menandai order sebagai lunas. Participant dapat melihat daftar bukti via
`GET /api/v1/payments/orders/{order_id}/manual-proofs`. Admin/organizer melihat
bukti via `GET /api/v1/admin/orders/{order_id}/manual-proofs`. File diunduh oleh
pemilik order atau admin/organizer melalui
`GET /api/v1/payments/manual-proofs/{proof_id}/download`.

Report khusus pembayaran manual tersedia untuk role admin dan organizer:

```http
GET /api/v1/admin/reports/payments/manual
GET /api/v1/admin/reports/payments/manual.csv
```

Setiap item `transactions` pada report JSON memiliki `payment_proof_count` dan
array `payment_proofs`. Setiap bukti memuat metadata file dan `download_url`
privat yang dapat dibuka admin/organizer. Export CSV memuat
`payment_proof_count` dan `payment_proof_download_urls`. Report mencakup payment
provider `manual_transfer` dan `manual_qr_code`, baik yang masih `pending` maupun
yang sudah dikonfirmasi `success`.

Konfirmasi transfer manual memerlukan role `admin` atau `organizer`:

```http
POST /api/v1/admin/orders/{order_id}/confirm-manual-payment
Authorization: Bearer <admin_access_token>
Content-Type: application/json
```

```json
{"payment_method":"manual_transfer","transfer_reference":"BCA-20260819-001","notes":"Mutasi bank telah diverifikasi"}
```

Backend memakai nominal yang tersimpan pada order, membuat payment
`manual_transfer`, dan mengubah status order menjadi `paid`. Jika order sudah
terhubung ke registration, status registration juga menjadi `paid`. Endpoint
ini idempoten untuk konfirmasi manual yang sama dan menolak order
canceled/expired atau order yang sudah dibayar melalui gateway lain.

Frontend saat ini hanya menawarkan **Manual Bank Transfer** dan **Online
Payment**. `manual_qr_code` tidak dikirim maupun ditampilkan sebagai pilihan UI.

Path item literal untuk GET/PUT/DELETE:

```text
/api/v1/admin/events/{event_id}/delegate-packages/{item_id}
/api/v1/admin/events/{event_id}/activities/{item_id}
/api/v1/admin/events/{event_id}/business-matching-slots/{item_id}
```

Master payload:

```json
{"code":"A","name":"Package A","currency":"USD","amount":500,"payment_amount_idr":8000000,"is_active":true}
```

```json
{"name":"Business Forum","is_active":true}
```

```json
{"slot_date":"2026-10-16","start_time":"09:00:00","end_time":"09:30:00","label":"Morning 1","capacity":20,"is_active":true}
```

Mutasi event, session, dan speaker membutuhkan Bearer token dengan role `admin`
atau `organizer`. Endpoint GET tetap dapat digunakan frontend publik:

```text
POST /events, PUT /events/{id}, DELETE /events/{id},
POST /sessions, PUT /sessions/{id}, DELETE /sessions/{id},
POST /speakers, PUT /speakers/{id}, DELETE /speakers/{id},
POST /speakers/{id}/photo,
POST /speakers/{id}/events, DELETE /speakers/{id}/events/{event_id},
POST /store/admin/events/{event_id}/products,
PUT /store/admin/products/{id}, DELETE /store/admin/products/{id}
```

Payload event create:

```json
{"name":"IWBIF 2026","slug":"iwbif-2026","description":"...","venue_name":"...","venue_address":"...","timezone":"Asia/Jakarta","start_at":"2026-10-14T08:00:00+07:00","end_at":"2026-10-17T23:59:00+07:00","capacity":500}
```

Event update menerima subset `name`, `description`, venue, `capacity`, `status`.
Session create menerima `event_id`, `title`, `slug`, `description`,
`session_type`, `room_name`, `start_at`, `end_at`, `capacity`, `status`; update
menerima subsetnya. Speaker create menerima identity/professional fields,
biography, links, expertise, featured/status; update menerima subsetnya. Foto
speaker diunggah lewat `POST /api/v1/speakers/{speaker_id}/photo` multipart
field `file`. `speaker_id` wajib UUID valid. Format yang diterima adalah JPG,
PNG, atau WebP dengan batas ukuran sesuai `PROFILE_PHOTO_MAX_SIZE_BYTES`
(default 5 MB). Speaker divalidasi sebelum file disimpan; jika update database
gagal file baru dibersihkan, dan setelah update berhasil foto lokal lama
dibersihkan.

Contoh request dan response:

```http
POST /api/v1/speakers/f2e392dd-0a63-425e-a7e3-dc7800f21b1b/photo
Authorization: Bearer <admin_or_organizer_token>
Content-Type: multipart/form-data

file=<speaker.webp>
```

```json
{
  "success": true,
  "message": "Foto speaker berhasil diunggah",
  "data": {
    "id": "f2e392dd-0a63-425e-a7e3-dc7800f21b1b",
    "full_name": "Speaker Name",
    "profile_photo_url": "/uploads/speakers/generated-file.webp"
  },
  "meta": null,
  "request_id": "request-uuid",
  "timestamp": "2026-08-28T08:00:00Z"
}
```

Error yang mungkin dikembalikan: `400 INVALID_IMAGE_TYPE`, `400 EMPTY_IMAGE`,
`400 IMAGE_TOO_LARGE`, `404 SPEAKER_NOT_FOUND`, `403` untuk role yang tidak
diizinkan, `422` untuk UUID atau multipart field yang tidak valid, serta
`500 UPLOAD_STORAGE_ERROR` ketika proses aplikasi tidak memiliki izin tulis ke
`UPLOAD_DIR`. Pada deployment Linux, direktori tersebut harus dimiliki atau
dapat ditulis oleh user service dan dipasang sebagai persistent volume bila
aplikasi berjalan dalam container.

Hubungkan speaker ke event dengan payload
`{"event_id":"uuid"}` pada `POST /api/v1/speakers/{speaker_id}/events`.
Operasi delete dapat menghasilkan `409` jika resource masih direferensikan data
lain yang tidak menggunakan cascade; frontend harus meminta admin melepas
dependensi terlebih dahulu.

Announcements dan certificates:

```text
GET    /api/v1/events/{event_id}/announcements
GET    /api/v1/admin/events/{event_id}/announcements
POST   /api/v1/admin/events/{event_id}/announcements
PUT    /api/v1/admin/announcements/{id}
DELETE /api/v1/admin/announcements/{id}

GET    /api/v1/certificates/me
GET    /api/v1/admin/events/{event_id}/certificates
POST   /api/v1/admin/certificates
PUT    /api/v1/admin/certificates/{id}
DELETE /api/v1/admin/certificates/{id}
```

Announcement admin memakai payload
`{"title":"...","body":"...","status":"draft|published|archived","published_at":null}`.
Certificate diterbitkan untuk satu user per event dengan payload
`{"event_id":"uuid","user_id":"uuid","certificate_number":"IWBIF-2026-0001","title":"Certificate of Attendance","download_url":"https://...","issued_at":null}`.
Semua endpoint `/admin/...` memerlukan role `admin` atau `organizer`.

Manajemen user dan role:

```text
GET  /api/v1/admin/users?page=1&size=20&role=participant&status=active
POST /api/v1/admin/users
PUT  /api/v1/admin/users/{user_id}
```

Create user menerima `email`, `password`, `full_name`, `phone`, `country`,
`role`, `status`, dan `is_email_verified`. Update menerima subset selain email
dan password. Nilai role adalah `participant`, `organizer`, atau `admin`; status
adalah `active`, `inactive`, atau `suspended`. Organizer dapat membuat dan
mengelola participant/organizer, tetapi hanya role `admin` yang dapat membuat
atau mengubah akun admin. Backend juga mencegah admin/organizer menonaktifkan
atau mengganti role akun sendiri untuk menghindari self-lockout.

## 16. Health dan alur frontend

```http
GET /api/v1/health
GET /api/v1/health/database
GET /api/v1/health/readiness
```

Alur store-first utama:

```text
register/login → auth/me → event/store → cart → checkout → pilih DOKU/Midtrans
→ payment success → registration draft → upload passport → submit
→ organizer verification/confirmation → ticket → matching profile
```

Alur registration-first kompatibilitas:

```text
register/login → auth/me → participants/me → event/master → registration draft
→ upload passport → submit → organizer verification → DOKU VA + polling
→ confirmed/ticket → matching profile → discovery → messaging → meeting
```

Checklist:

- Gunakan UUID dari respons, bukan ID buatan frontend.
- Baca HTTP status, `success`, `errors`, dan `request_id`.
- Disable mutation berdasarkan workflow, tetapi tetap tangani `409`.
- Jangan menandai payment paid dari redirect; tunggu backend.
- Jangan panggil webhook/token callback DOKU atau Midtrans dari browser.
- Jangan hard-code master, harga charge, bank VA, atau slot.
- Upload/download memakai multipart/blob.
- WebSocket tidak menggantikan REST; sync history setelah reconnect.

Dokumen tambahan:

- `docs/FRONTEND_BUSINESS_MATCHING_MESSAGING.md`
- `docs/FRONTEND_DOKU_PAYMENT_INTEGRATION.md`
- `docs/FRONTEND_MIDTRANS_PAYMENT_INTEGRATION.md`
- `docs/FRONTEND_STORE_PURCHASE_FLOW.md`
- `docs/DOKU_SNAP_SANDBOX_SETUP.md`
