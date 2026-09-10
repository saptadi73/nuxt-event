# Global search dan pagination untuk frontend

Semua URL berikut menggunakan prefix `/api/v1`. Kirim `search`, `page`, dan
`size` sebagai query parameter. `page` dimulai dari 1. Search mencocokkan
substring tanpa membedakan huruf besar/kecil, mengabaikan spasi di awal/akhir,
dan memperlakukan `%` serta `_` sebagai teks biasa. Search kosong tidak memfilter.
Pencarian speakers, committee, sessions, announcements, dan certificate title
mencakup kolom sumber serta field terjemahan yang sesuai di `content_translations`
untuk seluruh locale yang didukung (en dan zh-CN). Hasil tetap satu baris per
entitas walaupun beberapa terjemahan cocok; filter event dan pagination tetap berlaku.
Locale respons tidak membatasi locale pencarian.

| Endpoint GET | Kolom pencarian | Lokasi daftar |
| --- | --- | --- |
| `/admin/transactions` | Order number/ID, customer, email, registration number, provider, channel/payment type, gateway reference, package, status | `data.transactions` |
| `/admin/users` | Nama, email, telepon, negara | `data` |
| `/admin/reports/payments` | Order, gateway reference, participant/customer, email, registration, package, channel, provider, status | `data.transactions` |
| `/admin/reports/payments/midtrans` | Sama dengan laporan pembayaran | `data.transactions` |
| `/speakers` | Nama, organisasi | `data` |
| `/admin/events/{event_id}/announcements` | Title, body, status | `data` |
| `/admin/events/{event_id}/certificates` | Nomor sertifikat, title, nama dan email user penerima | `data` |
| `/admin/committee?event_id=...` | Nama, role, group, organisasi | `data` |
| `/events/{slug}/sessions` | Title, session type, room, status | `data` |
| `/attendance/events/{event_id}/report` | Participant, registration number, ticket number, organisasi, gate, status registration/ticket/check-in, `checked_in`/`not_checked_in` | `data.registrants` (alias kompatibel: `data.attendees`) |
| `/admin/events/{event_id}/email-notifications/logs/history` | Recipient, subject, trigger, status, entity type/ID, error message | `data` |

Gateway reference mencakup `provider_transaction_id`, `provider_order_id`, dan
`provider_reference_no`. Semua filter yang sudah ada tetap berlaku dan digabung
dengan search menggunakan AND. Logs juga menerima filter status persis melalui
`status`, misalnya `status=failed`, serta filter `locale` yang sudah ada.

Respons tetap memakai envelope standar (`success`, `message`, `data`, `meta`,
`request_id`, `timestamp`). Contoh berikut hanya menampilkan `data` dan `meta`;
field envelope lainnya tetap dikirim.

Daftar biasa (users, speakers, announcements, certificates, committee, sessions, logs):

```json
{
  "data": [],
  "meta": { "page": 1, "size": 20, "total": 0, "pages": 0 }
}
```

Transactions dan laporan pembayaran:

```json
{
  "data": {
    "summary": { "total_transactions": 0, "gross_revenue": 0 },
    "transactions": [],
    "by_status": [],
    "by_channel": [],
    "by_package": [],
    "daily_revenue": []
  },
  "meta": { "page": 1, "size": 20, "total": 0, "pages": 0, "limit": 20, "offset": 0 }
}
```

Attendance:

```json
{
  "data": {
    "event_id": "851b8005-6aa5-4468-8525-4e7e56329195",
    "summary": { "total_registered": 0, "total_checked_in": 0, "total_not_checked_in": 0, "attendance_rate": 0 },
    "registrants": [],
    "attendees": []
  },
  "meta": { "page": 1, "size": 20, "total": 0, "pages": 0 }
}
```

Field summary di contoh disingkat. `registrants` dan `attendees` berisi baris
halaman yang sama, bukan dua daftar untuk digabungkan. Frontend dapat membaca
`data.registrants`; `data.attendees` tetap tersedia untuk konsumen lama.

`total` adalah jumlah seluruh hasil setelah search dan filter, sebelum pagination.
Tidak ada hasil menghasilkan `total: 0`, `pages: 0`. Halaman melewati hasil
mengembalikan daftar kosong dengan total yang tetap benar. Ringkasan pembayaran
dan attendance tetap berada di `data.summary` dan menghitung seluruh hasil yang
cocok, bukan hanya satu halaman. Struktur agregat laporan pembayaran tetap tersedia.

## Default dan kompatibilitas

- Users, speakers, announcements, certificates, sessions, attendance: default
  `page=1`, `size=20`, maksimum size 100.
- Committee: default size 100, maksimum 200, mengikuti kontrak sebelumnya.
- Transactions dan dua laporan pembayaran: `page`/`size` mengambil prioritas atas
  `limit`/`offset`. Jika salah satunya dikirim, default pasangannya adalah page 1
  atau size 20; maksimum size 500. Tanpa keduanya, tetap memakai `limit=50`,
  `offset=0`. Metadata juga mempertahankan `limit` dan `offset`. Untuk offset
  lama yang tidak kelipatan limit, page adalah `floor(offset / limit) + 1`;
  frontend baru harus memakai page/size agar posisi halaman tidak ambigu.
- Email logs: default page 1; size mengambil nilai `limit` jika tidak dikirim
  (default limit 100, maksimum 500). `size` eksplisit mengambil prioritas.
- Nilai page/size di luar batas menghasilkan HTTP 422.
- Endpoint ekspor CSV dan laporan manual tidak berubah dalam perubahan ini.

## Integrasi frontend

```js
const params = new URLSearchParams({ search: keyword.trim(), page: String(page), size: "20" });
const response = await fetch(`/api/v1/admin/transactions?${params}`, {
  headers: { Authorization: `Bearer ${token}` },
});
if (!response.ok) throw new Error("Gagal memuat transaksi");
const result = await response.json();
const rows = result.data.transactions; // users dan daftar biasa: result.data
const { total, pages } = result.meta;
```

Saat keyword atau filter berubah, reset page ke 1. Gunakan debounce dan batalkan
request sebelumnya agar hasil lama tidak menimpa hasil terbaru. Tabel menampilkan
baris dari API langsung; jumlah halaman menggunakan `meta.pages` dan jumlah hasil
menggunakan `meta.total`. Dokumen ini menjelaskan kontrak API; lokasi dokumen
tidak menentukan status implementasi composable atau tabel frontend.
