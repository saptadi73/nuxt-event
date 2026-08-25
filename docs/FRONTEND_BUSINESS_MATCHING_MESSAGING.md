# Frontend Business Matching Web Messaging

## REST flow

Semua endpoint membutuhkan `Authorization: Bearer <access-token>`.

## Organizer-assisted matching

Pisahkan UI menjadi dua pengalaman:

- participant: halaman **Usulan Organizer** berisi alasan, topik, batas respons,
  identitas counterpart, serta tombol `Tertarik` dan `Tidak tertarik`;
- organizer: **Matching Operations Center** berisi KPI, work queue, recommendation
  composer, jadwal/resource, settings, dan audit-aware action dialog.

### Flow participant

```text
GET /api/v1/events/{event_id}/business-matching/organizer-recommendations
POST /api/v1/business-matching/organizer-recommendations/{id}/respond
```

Payload respons:

```json
{"response":"interested"}
```

Nilai lain yang valid adalah `not_interested`. Setelah submit, disable tombol
hingga response selesai. Jika response mengandung `meeting_id`, arahkan user ke
detail meeting/penjadwalan. Tampilkan countdown dari `expires_at`; respons dengan
HTTP `409` berarti recommendation sudah ditutup atau kedaluwarsa.

### Flow organizer

```text
GET  /api/v1/admin/events/{event_id}/business-matching/report?page=1&size=20
POST /api/v1/admin/events/{event_id}/business-matching/recommendations
GET  /api/v1/admin/events/{event_id}/business-matching/recommendations
POST /api/v1/admin/meetings/{meeting_id}/action
GET  /api/v1/admin/events/{event_id}/business-matching/settings
PUT  /api/v1/admin/events/{event_id}/business-matching/settings
```

Query report mendukung `status`, `source`, `search`, `page`, dan `size`. Gunakan
`summary.needs_attention` sebagai badge work queue. `source` bernilai
`participant_request` atau `organizer_recommendation`.

Contoh recommendation composer:

```json
{
  "participant_a_id":"uuid-a",
  "participant_b_id":"uuid-b",
  "reason":"Buyer membutuhkan produk yang ditawarkan supplier",
  "topic":"ASEAN distribution partnership",
  "purpose":"Explore commercial partnership",
  "proposed_slot_ids":["uuid-slot"],
  "expires_at":null
}
```

Jika `expires_at=null`, backend memakai tenggat dari settings event. Jangan
menampilkan isi private conversation di dashboard organizer.

### Action dialog organizer

Semua action wajib meminta alasan. Untuk `confirm`, wajib pilih slot dan resource:

```json
{
  "action":"confirm",
  "slot_id":"uuid-slot",
  "resource_id":"uuid-table",
  "reason":"Both participants approved this schedule"
}
```

Action lain adalah `cancel`, `complete`, dan `no_show`; kirim `slot_id` serta
`resource_id` sebagai `null`. Pada HTTP `409`, refresh availability dan detail
meeting karena status atau resource mungkin sudah berubah.

### Komponen dashboard yang disarankan

- KPI: total, requested, scheduling, confirmed, completed, declined, cancelled,
  no-show, dan needs-attention;
- work queue diurutkan berdasarkan usia request dan recommendation mendekati
  expiry;
- filter chips untuk status dan source, plus search participant/perusahaan/topik;
- split-panel detail agar operator tidak kehilangan posisi tabel;
- status timeline dari audit metadata;
- action confirmation modal yang selalu menampilkan kedua pihak, jadwal, meja,
  dan alasan perubahan.

Polling report setiap 30–60 detik cukup untuk dashboard. Setelah mutation,
invalidate cache report, recommendation list, availability, notifications, dan
detail meeting.

- `POST /api/v1/events/{event_id}/conversations` membuka atau menggunakan kembali conversation dengan participant tujuan.
- `GET /api/v1/events/{event_id}/conversations` mengembalikan counterpart, last message, dan unread count.
- `GET /api/v1/conversations/{id}/messages?limit=50&before=<ISO-8601>` mengambil histori secara cursor pagination.
- `POST /api/v1/conversations/{id}/messages` mengirim text/reply.
- `PATCH /api/v1/conversations/{id}/messages/{message_id}` mengedit pesan sendiri.
- `DELETE /api/v1/conversations/{id}/messages/{message_id}` melakukan soft-delete pesan sendiri.
- `POST /api/v1/conversations/{conversation_id}/read` mengirim read receipt.
- `POST /api/v1/conversations/{id}/archive` dan `/unarchive` mengatur inbox user.
- `GET /api/v1/messages/unread-count` menghasilkan badge unread global.
- `GET /api/v1/inbox/unread-count` menghasilkan badge gabungan (message + notifications) untuk ikon inbox.

### Notifikasi / Inbox

Untuk user biasa:

- `GET /api/v1/notifications` untuk daftar notifikasi.
- `GET /api/v1/notifications/unread-count` untuk badge jumlah unread.
- `POST /api/v1/notifications/{id}/read` menandai satu notifikasi dibaca.
- `POST /api/v1/notifications/read-all` menandai semua notifikasi user dibaca.

Untuk admin/organizer (semua akun role `admin|organizer`):

- `GET /api/v1/admin/notifications?event_id=<uuid>&request_limit=100`
- `GET /api/v1/admin/notifications/unread-count?event_id=<uuid>`
- `POST /api/v1/admin/notifications/{id}/read`
- `POST /api/v1/admin/notifications/read-all?event_id=<uuid>`

### Global inbox icon di header

Semua akun yang sudah login wajib menampilkan ikon inbox + badge unread pada header.

Backend menyediakan jumlah unread:

- **Semua akun:** `GET /api/v1/inbox/unread-count`
- **Berdasarkan role:** UI boleh tetap memakai endpoint user/admin saat menampilkan panel
  agar navigasi “action item” lebih relevan.

Payload ringkas yang dipakai untuk ikon badge:

```json
{
  "messages": 2,
  "notifications": 7,
  "unread_count": 9
}
```

Untuk panel yang dibuka:

- role user: gunakan `GET /api/v1/notifications`
- role admin/organizer: gunakan `GET /api/v1/admin/notifications?event_id=<uuid>`

Dan unread per role:

- role user: `GET /api/v1/notifications/unread-count`
- role admin/organizer: `GET /api/v1/admin/notifications/unread-count?event_id=<uuid>`

Jika role user dan admin sama-sama bisa buka panel, sediakan fallback badge dari
`/api/v1/inbox/unread-count` agar angka tetap konsisten meski jenis data yang
berbeda.

Polling ringkas untuk badge inbox yang ringan:

1. `GET /api/v1/inbox/unread-count` untuk badge (setiap 30–60 detik).
2. Hanya saat panel dibuka, ambil full list notifikasi endpoint sesuai role.
3. Setelah mark/read, refresh `/api/v1/notifications/...` atau `/api/v1/admin/notifications...`.

Rekomendasi konten panel:

- Header akun aktif (`users.full_name` + `users.email`) untuk identitas sesi.
- Daftar `title/body/entity_type/entity_id` + `created_at`.
- Chip “Unread” untuk status `is_read=false`.
- Tombol “Refresh” dan “Tandai semua dibaca”.

## Notifikasi status pembayaran dan tindakan manual

Untuk kasus mismatch (status gateway sukses tetapi report backend belum sinkron),
frontend perlu tetap menampilkan `pending` sampai backend menegaskan `success` pada
endpoint payment/order. Aksi manual ada pada admin:

- Admin/organizer tetap membaca notifikasi `payment_status_update` di inboxnya.
- Gunakan `POST /api/v1/admin/orders/{order_id}/confirm-manual-payment` saat
  verifikasi manual diperlukan (dengan `payment_method` sesuai kanal dan
  referensi transaksi yang sah).
- Lanjutkan menampilkan status “Menunggu validasi admin” pada akun user sampai
  backend membentuk status `success` final.

Frontend pattern yang umum:

1. Poll notifikasi secara berkala (mis. setiap 30 detik) dan tampilkan di panel kiri/inbox.
2. Beda endpoint dipakai untuk user vs admin:
   - jika role admin/organizer, pakai `/admin/notifications...`
   - selain itu, pakai `/notifications...`
3. Setiap klik item notifikasi, panggil endpoint `.../read` agar badge berkurang.
4. Untuk badge global ikon inbox, pakai endpoint baru:
   - `GET /api/v1/inbox/unread-count`
   - Response: `{ "messages": 3, "notifications": 5, "unread_count": 8 }`
   - Untuk admin/organizer, endpoint ini otomatis menghitung berdasarkan akun admin yang sedang login.

Contoh response `inbox/unread-count`:

```json
{
  "messages": 2,
  "notifications": 7,
  "unread_count": 9
}
```

Contoh implementasi client (JavaScript) untuk sinkron ke panel inbox:

```js
const role = currentUser.role; // organizer | admin | participant
const headers = { Authorization: `Bearer ${token}` };

function notificationsBase() {
  return role === "admin" || role === "organizer"
    ? "/api/v1/admin/notifications"
    : "/api/v1/notifications";
}

async function fetchNotifications({ eventId } = {}) {
  const url = new URL(notificationsBase(), window.location.origin);
  if (eventId) url.searchParams.set("event_id", eventId);
  url.searchParams.set("request_limit", "50");
  const res = await fetch(url, { headers });
  const json = await res.json();
  const list = Array.isArray(json.data) ? json.data : [];
  return list;
}

async function fetchInboxUnreadCount(eventId = "") {
  const url = new URL("/api/v1/inbox/unread-count", window.location.origin);
  if (eventId) url.searchParams.set("event_id", eventId);
  const res = await fetch(url, { headers });
  const json = await res.json();
  return Number(json.data?.unread_count || 0);
}

async function fetchUnreadCount() {
  const base = role === "admin" || role === "organizer"
    ? "/api/v1/admin/notifications/unread-count"
    : "/api/v1/notifications/unread-count";
  const res = await fetch(base, { headers });
  const json = await res.json();
  return Number(json.data?.count || 0);
}

async function syncInboxBadge(eventId = "") {
  const summary = await fetchInboxUnreadCount(eventId);
  return {
    total: Number(summary?.unread_count || 0),
    messages: Number(summary?.messages || 0),
    notifications: Number(summary?.notifications || 0),
  };
}

function routeActionFromNotification(item) {
  if (item.entity_type === "order") {
    return `/dashboard/payment?order_id=${item.entity_id}`;
  }
  if (item.entity_type === "payment") {
    return `/dashboard/payment-status?payment_id=${item.entity_id}`;
  }
  if (item.entity_type === "invoice") {
    return `/dashboard/invoice?order_id=${item.entity_id}`;
  }
  if (item.entity_type === "conversation") {
    return `/business-matching`;
  }
  if (item.entity_type === "manual_payment" || item.entity_type === "manual_payment_confirmation" || item.entity_type === "admin_order") {
    return `/admin/manual-payments?order_id=${item.entity_id}`;
  }
  if (["new_message","meeting_request","meeting_requested","meeting_accepted","meeting_declined","meeting_confirmed","meeting_reschedule","meeting_cancelled","meeting_reschedule_requested"].includes(item.entity_type)) {
    return `/business-matching`;
  }
  if (item.entity_type === "payment_status_update") {
    return "/admin/reports";
  }
  return null;
}

function notificationBadgeFromItem(item) {
  if (item.type === "payment_status_update") return "Payment";
  if ([
    "meeting_request","meeting_requested","meeting_accepted","meeting_declined",
    "meeting_confirmed","meeting_reschedule","meeting_cancelled","meeting_reschedule_requested","new_message"
  ].includes(item.entity_type)) return "Meeting";
  if (["manual_payment","manual_payment_confirmation","admin_order"].includes(item.entity_type)) return "Manual Payment";
  return null;
}

async function markNotificationRead(id) {
  const base = role === "admin" || role === "organizer"
    ? `/api/v1/admin/notifications/${id}/read`
    : `/api/v1/notifications/${id}/read`;
  await fetch(base, { method: "POST", headers });
}
```

Contoh rendering card:

```js
function renderNotification(item) {
  const isPaid = item.type === "payment_status_update";
  const title = isPaid ? "Update Pembayaran" : item.title;
  const badge = notificationBadgeFromItem(item);
  const subtitle = item.created_at;
  const target = routeActionFromNotification(item);
  return { title, badge, subtitle, body: item.body, unread: !item.is_read, href: target };
}
``` 

Contoh respons item notifikasi:

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

Contoh kirim pesan:

```json
{"body":"Saya tertarik mendiskusikan distribusi produk Anda.","reply_to_message_id":null}
```

## WebSocket

Hubungkan setelah conversation diperoleh:

```text
wss://<backend-domain>/api/v1/ws/conversations/<conversation_id>?token=<access-token>
```

Event server:

- `connected`
- `new_message`
- `message_updated`
- `message_deleted`
- `read_update`
- `meeting_status_update`

Client dapat mengirim `{"type":"ping"}` dan menerima `{"type":"pong"}`.
Pembuatan/edit/hapus pesan tetap dilakukan lewat REST agar validasi, transaksi,
notification, dan audit konsisten; WebSocket hanya untuk delivery realtime.

Hub saat ini process-local. Deployment satu worker dapat langsung digunakan.
Untuk beberapa worker/instance, tambahkan Redis pub/sub sebagai backplane tanpa
mengubah kontrak frontend.
