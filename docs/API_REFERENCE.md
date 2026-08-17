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
{"email":"delegate@example.com","full_name":"Delegate Name","password":"minimum-8-character"}
```

```http
POST /api/v1/auth/login
```

```json
{"email":"delegate@example.com","password":"minimum-8-character"}
```

Keduanya mengembalikan:

```json
{
  "user": {"id":"uuid","email":"delegate@example.com","full_name":"Delegate Name","status":"active","is_email_verified":false,"created_at":"2026-08-15T12:00:00Z"},
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
| `GET /api/v1/auth/me` | Ya | `data.user` user aktif |
| `PUT /api/v1/auth/me` | Ya | `{ "full_name"?: string, "phone"?: string }` |
| `PUT /api/v1/auth/password` | Ya | `{ "current_password", "new_password", "confirm_password" }` |
| `POST /api/v1/auth/logout` | Tidak | `{ "revoked": true }`; hapus token frontend |
| `POST /api/v1/auth/forgot-password` | Tidak | `{ "email": string }` |
| `POST /api/v1/auth/reset-password` | Tidak | `{ "token", "password", "confirm_password" }` |
| `POST /api/v1/auth/verify-email` | Tidak | `{ "token": string }` |

Development masih mengembalikan reset token di respons forgot-password. Jangan
bergantung pada ini di production; production harus mengirim token lewat email.

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
looking-for, preferred countries, room preferences, airports, payment methods,
dan booth sizes.

Package response:

```json
{"id":"uuid","event_id":"uuid","code":"A","name":"Package A - USD500","currency":"USD","amount":500,"payment_amount_idr":8000000,"is_active":true}
```

`amount/currency` untuk display; `payment_amount_idr` untuk charge DOKU.

## 4. Participant profile

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
  "country":"Indonesia","email":"delegate@example.com","mobile_whatsapp":"+628123456789",
  "office_phone":null,"company_website":"https://example.com","linkedin":null,
  "company_address":"Jakarta","participation_categories":["Delegate","Buyer"],
  "presentation_topic":null,"products_interested":"Digital commerce",
  "investment_interest":"Regional expansion","room_preference":"Twin Sharing",
  "preferred_roommate":null,"arrival_date":"2026-10-14","departure_date":"2026-10-17",
  "flight_number":"GA-100","airport":"CGK","need_airport_pickup":true,
  "products_services":"Commerce platform","looking_for":["Buyer","Investor"],
  "preferred_countries":["Indonesia","Malaysia"],"business_objectives":"Find partners",
  "activity_ids":["uuid"],"dietary_restrictions":null,"medical_condition":null,
  "special_assistance":null,"preferred_payment_method":"Bank Transfer",
  "need_official_invoice":true,"tax_id":"NPWP-or-tax-id",
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

## 6. Documents

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

## 7. Exhibitor

Payload create/update — **Auth**:

```json
{
  "company_name":"Example SME","country":"Indonesia",
  "brand":"Example Brand","contact_person":"Contact Name","email":"contact@example.com",
  "phone":"+628123456789","products_to_display":"Food products",
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

## 8. Business Matching profile dan discovery

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

## 9. Web messaging

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

## 10. Meetings dan moderation

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

## 11. Notification center

```http
GET  /api/v1/notifications
GET  /api/v1/notifications/unread-count
POST /api/v1/notifications/{notification_id}/read
POST /api/v1/notifications/read-all
```

Fields: `id`, `user_id`, `event_id`, `type`, `title`, `body`, `entity_type`,
`entity_id`, `is_read`, `created_at`, `read_at`. Badge chat memakai
`/messages/unread-count`; badge notification memakai `/notifications/unread-count`.

## 12. DOKU Direct API SNAP

### Katalog payment method untuk frontend

```http
GET /api/v1/payments/methods
```

Endpoint ini membaca channel aktif dari database, bukan memanggil DOKU pada
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
{"provider":"doku","code":"DANA","category":"e_wallet","display_name":"DANA","logo_url":"https://...","config_key":"DOKU_EWALLET_DANA","sub_merchant_id":"...","is_enabled":true,"sort_order":20}
```

Katalog di-seed oleh `python scripts/seed_payment_channels.py`; seluruh item
awal nonaktif. Aktifkan melalui admin hanya setelah channel aktif di DOKU dan
secret backend lengkap. `logo_url` adalah URL aset yang dikelola operator;
backend tidak mengunduh logo dari DOKU saat request frontend.

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
`success`, `failed`, `expired`.

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
`POST /api/v1/payments/doku/checkout` adalah fallback lama; flow utama Direct VA.
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

### Laporan pembayaran dan pendapatan organizer

Kedua endpoint berikut memerlukan Bearer token dengan role `admin` atau
`organizer`:

```http
GET /api/v1/admin/reports/payments
GET /api/v1/admin/reports/payments.csv
Authorization: Bearer <admin_access_token>
```

Query parameter opsional untuk kedua endpoint:

- `event_id`: UUID event.
- `date_from`, `date_to`: datetime ISO 8601. Filter memakai `paid_at`, atau
  `created_at` ketika transaksi belum dibayar.
- `status`: `created`, `pending`, `success`, `failed`, atau `expired`.
- `channel_code`: contoh `BCA`, `BNI`, `BRI`, atau `MANDIRI`.
- `package_id`: UUID delegate package/tiket.
- Khusus JSON: `limit` 1–500 dan `offset` untuk daftar transaksi.

Response JSON memberikan `summary`, agregasi `by_status`, `by_channel`,
`by_package`, `daily_revenue`, dan daftar `transactions`. Contoh summary:

```json
{"total_transactions":12,"successful_transactions":8,"pending_transactions":2,"failed_transactions":1,"expired_transactions":1,"gross_revenue":64000000,"pending_amount":16000000,"currency":"IDR"}
```

`gross_revenue`, `tickets_sold`, dan `daily_revenue` hanya menghitung payment
berstatus `success`. Browser return tidak pernah dihitung sebagai keberhasilan;
sumber final tetap notification DOKU yang telah diverifikasi. CSV berisi detail
payment, order, registrasi, event, peserta, paket, channel, reference DOKU,
nominal, dan waktu pembayaran sesuai filter yang sama.

## 13. Tickets dan check-in

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

## 14. Organizer/admin

Role admin/organizer:

```http
POST|GET|PUT|DELETE /api/v1/admin/events/{event_id}/delegate-packages[/{item_id}]
POST|GET|PUT|DELETE /api/v1/admin/events/{event_id}/activities[/{item_id}]
POST|GET|PUT|DELETE /api/v1/admin/events/{event_id}/business-matching-slots[/{item_id}]
GET  /api/v1/admin/events/{event_id}/registrations
POST /api/v1/admin/registrations/{registration_id}/verify
POST /api/v1/admin/registrations/{registration_id}/confirm
POST /api/v1/admin/registrations/{registration_id}/reject
```

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

Speaker/session mutations membutuhkan Auth. Implementasi route saat ini belum
memberi role dependency pada operasi berikut; frontend publik tidak boleh
mengeksposnya sampai backend diperketat:

```text
POST /events, PUT /events/{id}, POST /tickets, POST /tickets/{id}/reissue
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
field `file`.

## 15. Health dan alur frontend

```http
GET /api/v1/health
GET /api/v1/health/database
GET /api/v1/health/readiness
```

Alur utama:

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
- Jangan panggil webhook/token callback DOKU dari browser.
- Jangan hard-code master, harga charge, bank VA, atau slot.
- Upload/download memakai multipart/blob.
- WebSocket tidak menggantikan REST; sync history setelah reconnect.

Dokumen tambahan:

- `docs/FRONTEND_BUSINESS_MATCHING_MESSAGING.md`
- `docs/FRONTEND_DOKU_PAYMENT_INTEGRATION.md`
- `docs/DOKU_SNAP_SANDBOX_SETUP.md`
