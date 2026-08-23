# IWBIF 2026 Backend API Reference

Kontrak kerja frontend untuk backend IWBIF 2026. Referensi mesin tersedia di
`GET /openapi.json` dan Swagger UI di `GET /docs`; dokumen ini menjelaskan
payload, respons, workflow, dan mekanisme integrasi.

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

Development masih mengembalikan reset token di respons forgot-password. Jangan
bergantung pada ini di production; production harus mengirim token lewat email.

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
GET /api/v1/events/{event_id}/activities
GET /api/v1/events/{event_id}/business-matching-slots
```

Jangan hard-code pilihan. `iwbif-options` memuat participation categories,
looking-for, preferred countries, room preferences, airports, dan booth sizes.

Package response:

```json
{"id":"uuid","event_id":"uuid","code":"A","name":"Package A - USD500","currency":"USD","amount":500,"payment_amount_idr":8000000,"is_active":true}
```

`amount/currency` untuk display; `payment_amount_idr` untuk charge DOKU.

Untuk pembelian awal Delegate, gunakan katalog store pada bagian 6. Endpoint
`delegate-packages` adalah master form registration dan bukan endpoint cart.

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
sebelum membuat draft registration. Setelah payment, frontend mengirim form
Delegate lengkap dengan `delegate_package_id` dari metadata product yang dibeli.
Backend otomatis menautkan order Delegate cocok milik user ke registration.
Frontend tidak mengirim `order_id` pada payload registration.

Create/update — **Auth**:

```http
POST  /api/v1/events/{event_id}/registrations
PATCH /api/v1/events/{event_id}/registrations/{registration_id}
```

```json
{
  "delegate_package_id":"uuid","full_name":"Delegate Name",
  "job_title":"Director","company_organization":"Example Company",
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
GET /api/v1/store/events/{event_id}/cart
POST /api/v1/store/events/{event_id}/cart/items
DELETE /api/v1/store/events/{event_id}/cart/items/{product_id}
POST /api/v1/store/events/{event_id}/checkout
```

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

Checkout cart tidak memerlukan registration. Order baru selalu menyimpan
`user_id`; `registration_id` dapat kosong sampai form Delegate selesai dibuat.
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
Setelah payment, gunakan `delegate_package_id` metadata saat membuat registration
Delegate; backend akan menautkan order pending atau paid yang cocok. Disable
tombol selama request, simpan ID response, dan jangan membuat order baru saat
halaman hasil di-refresh. Detail ada di
`docs/FRONTEND_STORE_PURCHASE_FLOW.md`.

Admin mengelola product:

```http
POST /api/v1/store/admin/events/{event_id}/products
PUT /api/v1/store/admin/products/{product_id}
```

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
GET /api/v1/payments/registrations/{registration_ref}/invoice
GET /api/v1/payments/me/invoices?event_id={optional_uuid}
```

Payment fields: IDs/provider references, `payment_type`, `gross_amount`,
`currency`, `transaction_status`, `paid_at`, `channel_code`,
`virtual_account_no`, `payment_instructions_url`. Order status: `draft`,
`pending`, `paid`, `expired`, `canceled`. Payment status: `created`, `pending`,
`success`, `failed`, `expired`, `refunded`.

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

Konfigurasi backend melalui environment/secret manager:

```env
MIDTRANS_SERVER_KEY=
MIDTRANS_CLIENT_KEY=
MIDTRANS_IS_PRODUCTION=false
MIDTRANS_PAYMENT_DUE_MINUTES=60
MIDTRANS_CALLBACK_URL=https://frontend.example/payment/result
```

Gunakan sandbox dengan `MIDTRANS_IS_PRODUCTION=false`. Pada dashboard Midtrans,
atur **Payment Notification URL** ke URL publik backend:

```text
https://<backend-host>/api/v1/webhooks/midtrans
```

Untuk production, gunakan production Server/Client Key dan ubah
`MIDTRANS_IS_PRODUCTION=true`. Jangan commit key asli ke repository.

### Laporan pembayaran dan pendapatan organizer

Laporan DOKU dan Midtrans dipisahkan berdasarkan field `provider`. Semua endpoint
berikut memerlukan Bearer token dengan role `admin` atau `organizer`:

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
- `status`: `created`, `pending`, `success`, `failed`, `expired`, atau `refunded`.
- `channel_code`: contoh `BCA`, `BNI`, `BRI`, atau `MANDIRI`.
- `package_id`: UUID delegate package/tiket.
- Khusus JSON: `limit` 1–500 dan `offset` untuk daftar transaksi.

Response JSON memberikan `summary`, agregasi `by_status`, `by_channel`,
`by_package`, `daily_revenue`, dan daftar `transactions`. Contoh summary:

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

Role admin/organizer:

```http
POST|GET|PUT|DELETE /api/v1/admin/events/{event_id}/delegate-packages[/{item_id}]
POST|GET|PUT|DELETE /api/v1/admin/events/{event_id}/activities[/{item_id}]
POST|GET|PUT|DELETE /api/v1/admin/events/{event_id}/business-matching-slots[/{item_id}]
GET  /api/v1/admin/events/{event_id}/registrations
POST /api/v1/admin/registrations/{registration_id}/verify
POST /api/v1/admin/registrations/{registration_id}/confirm
POST /api/v1/admin/registrations/{registration_id}/reject
POST /api/v1/admin/orders/{order_id}/confirm-manual-payment
```

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
`manual_transfer` atau `manual_qr_code`, dan mengubah status order menjadi
`paid`. Jika order sudah terhubung ke registration, status registration juga
menjadi `paid`. Endpoint ini idempoten untuk konfirmasi manual yang sama dan
menolak order canceled/expired atau order yang sudah dibayar melalui gateway
lain. Untuk QR direct yang tidak melalui DOKU, kirim
`"payment_method":"manual_qr_code"` dan isi `transfer_reference` dengan
referensi transaksi QR.

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
field `file`. Hubungkan speaker ke event dengan payload
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
