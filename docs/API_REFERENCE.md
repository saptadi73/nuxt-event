# API Reference (FastAPI Event Portal)

Base URL: `/api/v1`

Semua response mengikuti format:

```json
{
  "success": true,
  "message": "string",
  "data": {},
  "meta": null,
  "request_id": "uuid",
  "timestamp": "2026-08-01T12:00:00Z"
}
```

Error:

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "code": "INVALID_EMAIL",
      "message": "Email tidak valid"
    }
  ],
  "request_id": "uuid",
  "timestamp": "2026-08-01T12:00:00Z"
}
```

## Auth (`/auth`)

Semua endpoint ini tidak memerlukan token.

### 1) Register
- `POST /auth/register`
- Request Body

```json
{
  "email": "user@email.com",
  "full_name": "Ayu Data",
  "password": "Str0ngPass!"
}
```

- Success Response (`201`)

```json
{
  "success": true,
  "message": "Registrasi akun berhasil",
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@email.com",
      "full_name": "Ayu Data",
      "status": "active",
      "is_email_verified": false,
      "created_at": "2026-08-01T07:00:00Z"
    },
    "access_token": "jwt_access",
    "refresh_token": "jwt_refresh",
    "token_type": "bearer"
  },
  "meta": null,
  "request_id": "uuid"
}
```

### 2) Login
- `POST /auth/login`
- Request Body

```json
{
  "email": "user@email.com",
  "password": "Str0ngPass!"
}
```

- Success response sama format-nya dengan `register` (status 200).

### 3) Refresh
- `POST /auth/refresh`
- Request Body

```json
{
  "refresh_token": "jwt_refresh"
}
```

### 4) Logout
- `POST /auth/logout`
- Success Response

```json
{
  "success": true,
  "message": "Logout berhasil",
  "data": { "revoked": true },
  ...
}
```

### 5) Forgot Password
- `POST /auth/forgot-password`
- Request Body

```json
{ "email": "user@email.com" }
```

### 6) Reset Password
- `POST /auth/reset-password`
- Request Body

```json
{
  "token": "reset_token",
  "password": "NewStr0ngPass!"
}
```

### 7) Verify Email
- `POST /auth/verify-email`
- Request Body

```json
{ "token": "email_verify_token" }
```

## Health (`/health`)

### `GET /health`
Response:

```json
{ "success": true, "message": "OK", "data": { "status": "alive" }, ... }
```

### `GET /health/database`
- Response sukses:

```json
{ "success": true, "message": "Database connection healthy", "data": { "status": "connected" }, ... }
```

- Jika gagal: `data.status` akan berisi `disconnected` dan `error`.

### `GET /health/readiness`
- Response sukses: `ready: true`
- Response belum siap: `ready: false`

## Events (`/events`)

Semua response tetap format baku.

### `GET /events?page=1&size=20`
- Query:
  - `page`: int (>=1)
  - `size`: int (1-100)
- Success Response Data:

```json
{
  "items": [
    {
      "id": "uuid",
      "name": "ASEAN AI Summit",
      "slug": "asean-ai-summit",
      "description": "Event desc",
      "venue_name": "Jakarta Convention Center",
      "venue_address": "Jakarta",
      "timezone": "Asia/Bangkok",
      "start_at": "2026-09-01T08:00:00Z",
      "end_at": "2026-09-03T17:00:00Z",
      "capacity": 500,
      "status": "published"
    }
  ],
  "meta": { "page": 1, "size": 20, "total": 10, "pages": 1 }
}
```

### `GET /events/{event_id}`
- Success response Data: object Event.

### `GET /events/{slug}/sessions`
- Public endpoint untuk data jadwal event berdasarkan slug.

### `GET /events/{slug}/speakers`
- Public endpoint untuk daftar speaker (featured) event.

### `GET /events/{slug}/ticket-types`
- Public endpoint: daftar jenis tiket per event.

### `GET /events/{slug}/workshop-tracks`
- Public endpoint: daftar jalur workshop per event.

### `POST /events`
- Auth: optional saat ini (implementasi sekarang belum menerapkan role check).
- Request Body

```json
{
  "name": "Tech Forum",
  "slug": "tech-forum-2026",
  "description": "desc",
  "venue_name": "Hall A",
  "venue_address": "Jakarta",
  "timezone": "Asia/Bangkok",
  "start_at": "2026-10-01T08:00:00Z",
  "end_at": "2026-10-01T17:00:00Z",
  "capacity": 300
}
```

### `PUT /events/{event_id}`
- Request Body

```json
{
  "name": "Tech Forum Revisi",
  "status": "published",
  "capacity": 350
}
```

## Participants (`/participants`)

Semua endpoint `participants` saat ini butuh header:

`Authorization: Bearer <access_token>`

### `GET /participants`

- Direktori profil peserta untuk peserta yang sudah login.
- Menampilkan data profil publik: nama, organisasi, bio, dan foto profil. Data registrasi pribadi (misalnya kontak darurat atau preferensi makan) tidak ditampilkan.
- Query: `page` (default `1`) dan `size` (default `20`, maksimum `100`).

### `GET /participants/{participant_id}`

- Detail profil publik seorang peserta; hanya peserta yang sudah login yang dapat melihatnya.

### `GET /participants/me`
- Success Response Data:

```json
{
  "id": "uuid",
  "user_id": "uuid",
  "full_name": "Ayu Data",
  "organization_name": "Open University",
  "biography": "Bio singkat",
  "profile_photo_url": "/uploads/participants/uuid.jpg",
  "created_at": "2026-08-01T07:00:00Z",
  "updated_at": "2026-08-01T07:00:00Z"
}
```

### `PUT /participants/me`
- Jika belum ada akan membuat baru.
- Request Body

```json
{
  "full_name": "Ayu Data",
  "organization_name": "Open University",
  "biography": "Bio singkat"
}
```

### `PATCH /participants/me`
- Request Body (partial update):

```json
{ "organization_name": "University X" }
```

### `POST /participants/me/photo`

- Upload foto profil peserta. Gunakan `multipart/form-data` dengan field file bernama `file`.
- Format: JPG, PNG, atau WebP. Maksimum 5 MB.
- Profil peserta harus dibuat terlebih dahulu melalui `PUT /participants/me`.

## Registrations (`/registrations`)

### `POST /registrations`
- Request Body

```json
{
  "event_id": "uuid",
  "participant_id": "uuid",
  "ticket_type_id": null,
  "dietary_preference": "Vegetarian",
  "accessibility_requirements": "Wheelchair access",
  "emergency_contact_name": "Budi",
  "emergency_contact_phone": "+628123",
  "consent_snapshot": "{\"privacy\": true}"
}
```

- Response:

```json
{
  "success": true,
  "message": "Registrasi berhasil dibuat",
  "data": {
    "id": "uuid",
    "event_id": "uuid",
    "participant_id": "uuid",
    "registration_number": "REG-ABC123DEF456",
    "status": "draft",
    "dietary_preference": "Vegetarian",
    "accessibility_requirements": "Wheelchair access",
    "emergency_contact_name": "Budi",
    "emergency_contact_phone": "+628123",
    "confirmed_at": null
  },
  ...
}
```

### `GET /registrations/{registration_id}`
- Response Data: object RegistrationRead.

## Notes untuk Frontend

- Gunakan `Authorization: Bearer <access_token>` untuk endpoint yang membutuhkan auth.
- Untuk membuat registrasi, pakai ID yang didapat dari profile dan event.
- Semua error validasi akan tetap mengikuti schema error baku.

## Payments (`/payments`, `/orders`, `/webhooks`)

### `POST /payments/midtrans/create`
- Request Body

```json
{
  "registration_id": "uuid"
}
```

- Response:

```json
{
  "success": true,
  "message": "Midtrans transaksi berhasil dibuat",
  "data": {
    "snap_token": "snap-ORD-...",
    "redirect_url": "https://app.midtrans.com/snap/..."
  },
  "meta": {
    "order_id": "uuid",
    "order_number": "ORD-..."
  },
  "request_id": "uuid"
}
```

### `GET /orders/{order_id}`

```json
{
  "id": "uuid",
  "registration_id": "uuid",
  "order_number": "ORD-...",
  "subtotal": 100000,
  "discount_amount": 0,
  "tax_amount": 0,
  "service_fee": 0,
  "total_amount": 100000,
  "currency": "IDR",
  "status": "pending",
  "expires_at": "2026-08-01T10:00:00Z"
}
```

### `GET /payments/{payment_id}`

```json
{
  "id": "uuid",
  "order_id": "uuid",
  "provider": "midtrans",
  "provider_transaction_id": null,
  "provider_order_id": null,
  "payment_type": null,
  "gross_amount": 100000,
  "currency": "IDR",
  "transaction_status": "created",
  "fraud_status": null,
  "paid_at": null
}
```

### `POST /webhooks/midtrans`

Webhook ini menerima body apapun dari provider:

```json
{
  "order_id": "ORD-...",
  "transaction_status": "settlement",
  "transaction_id": "tx-..."
}
```

Response:

```json
{
  "success": true,
  "message": "Webhook diproses",
  "data": { "result": "webhook_received" },
  "request_id": "uuid"
}
```

## Tickets (`/tickets`)

### `POST /tickets`

Request:

```json
{ "registration_id": "uuid" }
```

Response:

```json
{
  "id": "uuid",
  "registration_id": "uuid",
  "ticket_number": "TIX-...",
  "status": "issued"
}
```

### `GET /tickets/me`

- Gunakan token user login.
- Response adalah list ticket milik user yang sedang login.

### `GET /tickets/{ticket_id}/qr`

- Gunakan token user login. QR hanya dapat diakses oleh pemilik ticket.

```json
{
  "success": true,
  "message": "QR ticket tersedia",
  "data": {
    "qr_token": "qr-...",
    "qr_image_url": "data:image/svg+xml;utf8,<svg>...</svg>"
  }
}
```

### `POST /tickets/{ticket_id}/reissue`

Response:

```json
{
  "success": true,
  "message": "Ticket direissue",
  "data": {
    "id": "uuid",
    "registration_id": "uuid",
    "ticket_number": "TIX-...",
    "status": "issued"
  }
}
```

## Check-ins (`/check-ins`)

- `POST /check-ins/scan`

Request:

```json
{
  "qr_token": "qr-...",
  "event_id": "uuid",
  "gate_name": "main-gate",
  "device_id": "scanner-01"
}
```

Response:

```json
{
  "success": true,
  "message": "Check-in berhasil",
  "data": {
    "id": "uuid",
    "ticket_id": "uuid",
    "event_id": "uuid",
    "session_id": null,
    "check_in_type": "qr",
    "check_in_at": "2026-08-01T09:00:00Z",
    "check_in_by": "uuid",
    "gate_name": "main-gate",
    "device_id": "scanner-01",
    "status": "success",
    "notes": null
  },
  "request_id": "uuid"
}
```

- `POST /check-ins/manual`

Request:

```json
{
  "ticket_number": "TIX-...",
  "event_id": "uuid",
  "gate_name": "vip-gate",
  "device_id": "admin-device"
}
```

Response sukses:

```json
{ "success": true, "message": "Manual check-in berhasil", "data": { ... }, "request_id": "uuid" }
```

- `GET /check-ins?event_id=<uuid>`

Response data list check-ins untuk event tersebut.

## Error umum

## Ticket Types (`/ticket-types`)

- `GET /ticket-types/events/{event_id}`
- `POST /ticket-types`
- `PUT /ticket-types/{ticket_type_id}`

## Workshop Tracks (`/workshop-tracks`)

- `GET /workshop-tracks/events/{event_id}`
- `POST /workshop-tracks`
- `PUT /workshop-tracks/{track_id}`

## Speakers (`/speakers`)

### `POST /speakers/{speaker_id}/photo`

- Upload foto speaker dengan `multipart/form-data`, field file bernama `file`.
- Format: JPG, PNG, atau WebP. Maksimum 5 MB. URL foto akan tersimpan pada `profile_photo_url` dan tersedia secara publik di `/uploads/speakers/...`.

### `GET /speakers`

Request query:

- `page` (int, default 1)
- `size` (int, default 20)

### `GET /speakers/{speaker_id}`

Response: object speaker.

### `POST /speakers`

```json
{
  "full_name": "Budi Santoso",
  "professional_title": "Chief AI Officer",
  "organization_name": "Tech University",
  "country_code": "ID",
  "biography": "Speaker profile ...",
  "linkedin_url": "https://linkedin.com/in/..",
  "expertise_tags": ["AI", "EdTech"]
}
```

### `PUT /speakers/{speaker_id}`

Request partial update:

```json
{ "status": "published", "is_featured": true }
```

## Sessions (`/sessions`)

### `GET /sessions/events/{event_id}`

Response list session:

```json
{
  "items": [
    {
      "id": "uuid",
      "event_id": "uuid",
      "title": "Opening Keynote",
      "slug": "opening-keynote",
      "start_at": "2026-08-01T08:00:00Z",
      "end_at": "2026-08-01T09:00:00Z"
    }
  ]
}
```

### `GET /sessions/{session_id}`

### `POST /sessions`

```json
{
  "event_id": "uuid",
  "title": "Workshop AI",
  "slug": "workshop-ai",
  "start_at": "2026-08-01T10:00:00Z",
  "end_at": "2026-08-01T12:00:00Z",
  "capacity": 100
}
```

### `PUT /sessions/{session_id}`

Body partial update sesuai schema.

## Error umum

- `400` Validasi gagal
- `401` Token tidak valid / tidak ada
- `404` Resource tidak ditemukan
- `409` Konflik data (mis. email/registrasi duplikat)
