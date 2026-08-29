# Frontend Bilingual Content Integration (`en` / `zh-CN`)

Dokumen ini menjadi kontrak implementasi frontend untuk konten bilingual.
Locale yang didukung backend adalah:

- `en` — English, canonical source dan fallback utama.
- `zh-CN` — Simplified Chinese.

Jangan menerjemahkan nilai mesin seperti status, provider, trigger,
`error.code`, ID, slug, dan `allowed_actions`.

### Kebijakan admin

Antarmuka administrasi menggunakan English-only. Request dari route `/admin`
selalu mengirim `locale=en` dan `Accept-Language: en`; admin tetap dapat
menyimpan translation Mandarin melalui endpoint content translation dengan
path `/zh-CN`. Source English pada editor harus diminta eksplisit dengan
`?locale=en`.

Untuk entity tanpa editor bilingual khusus, gunakan `/admin/translations`.
Halaman ini memuat entity dan whitelist field dari
`GET /admin/content-translations/entities`. Announcements dan Certificates
memiliki aksi `Chinese translation` yang mengisi entity dan resource ID secara
otomatis.
> **Status data per 2026-08-29:** mekanisme translation sudah aktif, tetapi
> tabel `content_translations` di database saat ini masih kosong untuk seluruh
> event live. Selama admin belum mengisi translation lewat endpoint di bagian
> 2-4, request publik dengan `?locale=zh-CN` akan konsisten mengirim
`content_locale: "source"` dan `translation_fallback: true`. Ini
> bukan bug backend; frontend perlu menampilkan badge fallback sesuai
> rekomendasi di bagian 6 sampai konten Mandarin benar-benar diinput.

## 1. Pemilihan bahasa pada request publik

Frontend dapat menggunakan query parameter:

```http
GET /api/v1/sessions/{session_id}?locale=zh-CN
GET /api/v1/speakers/{speaker_id}?locale=zh-CN
```

atau header:

```http
Accept-Language: zh-CN,zh;q=0.9,en;q=0.8
```

Urutan pemilihan backend:

1. Query `locale`.
2. Header `Accept-Language`.
3. Fallback `en`.

Response HTTP mengirim `Content-Language`. Konten yang mendukung translation
juga mengirim:

```json
{
  "content_locale": "zh-CN",
  "translation_fallback": false
}
```

Jika Mandarin belum tersedia:

```json
{
  "content_locale": "source",
  "translation_fallback": true
}
```

Frontend boleh menampilkan konten fallback, tetapi pada dashboard editor harus
menampilkan peringatan bahwa translation belum lengkap.

## 2. Editor speaker

Field speaker canonical diperbarui melalui endpoint speaker yang sudah ada:

```http
PUT /api/v1/speakers/{speaker_id}
Authorization: Bearer <admin-or-organizer-token>
Content-Type: application/json
```

Contoh English source:

```json
{
  "full_name": "Jane Smith",
  "professional_title": "Chief Executive Officer",
  "organization_name": "Global Investment Group",
  "biography": "She has extensive experience in international investment.",
  "expertise_tags": ["Investment", "International Trade"],
  "session_title": "Women in Global Investment",
  "status": "published",
  "is_featured": true
}
```

`full_name`, URL, country code, status, dan ID tidak diterjemahkan. Field speaker
yang dapat disimpan sebagai translation:

- `professional_title`
- `organization_name`
- `biography`
- `expertise_tags`
- `session_title`

Simpan versi Mandarin melalui:

```http
PUT /api/v1/admin/content-translations/speaker/{speaker_id}/zh-CN
Authorization: Bearer <admin-token>
Content-Type: application/json
```

```json
{
  "fields": {
    "professional_title": "首席执行官",
    "organization_name": "全球投资集团",
    "biography": "她在国际投资领域拥有丰富经验。",
    "expertise_tags": ["投资", "国际贸易"],
    "session_title": "女性参与全球投资"
  }
}
```

Foto tetap menggunakan endpoint:

```http
POST /api/v1/speakers/{speaker_id}/photo
Content-Type: multipart/form-data
```

Upload foto tidak perlu dilakukan ulang untuk setiap locale.

## 3. Editor Delegate Packages

Untuk UI baru, ambil katalog package berdasarkan locale:

```http
GET /api/v1/events/{event_id}/delegate-package-catalog?locale=zh-CN
```

Endpoint lama berikut tetap tersedia untuk kompatibilitas dan mengembalikan daftar
package secara flat:

```http
GET /api/v1/events/{event_id}/delegate-packages?locale=zh-CN
```

Satu katalog memiliki tiga entity translation yang berbeda. Frontend tidak boleh
menyimpan seluruh terjemahan katalog hanya sebagai `delegate_package`:

| Data katalog | `entity_type` | Field yang dapat diterjemahkan |
|---|---|---|
| Package | `delegate_package` | `name`, `description` |
| Rate | `delegate_package_rate` | `name` |
| Facility | `delegate_package_facility` | `name`, `description`, `unit` |

Nilai seperti `id`, `code`, `package_type`, `selection_mode`, `occupancy_type`,
`pricing_mode`, nominal, currency, urutan, dan status aktif tetap canonical dan
tidak diterjemahkan.

### 3.1 Menyimpan Mandarin package

Source English tetap dibuat atau diperbarui melalui endpoint admin package yang
sudah ada. Versi Mandarin disimpan melalui:

```http
PUT /api/v1/admin/content-translations/delegate_package/{package_id}/zh-CN
Authorization: Bearer <admin-token>
Content-Type: application/json
```

```json
{
  "fields": {
    "name": "国际代表套餐",
    "description": "适用于参加国际论坛的代表。"
  }
}
```

Setiap rate dan facility harus disimpan menggunakan ID masing-masing:

```http
PUT /api/v1/admin/content-translations/delegate_package_rate/{rate_id}/zh-CN
PUT /api/v1/admin/content-translations/delegate_package_facility/{facility_id}/zh-CN
Authorization: Bearer <admin-token>
Content-Type: application/json
```

Contoh rate:

```json
{
  "fields": {
    "name": "双人共享"
  }
}
```

Contoh facility:

```json
{
  "fields": {
    "name": "机场接送",
    "description": "往返机场接送服务。",
    "unit": "每位代表"
  }
}
```

### 3.2 Memuat editor package

Ketika membuka editor, frontend mengambil source package/rate/facility dan daftar
translation masing-masing:

```http
GET /api/v1/admin/content-translations/delegate_package/{package_id}
GET /api/v1/admin/content-translations/delegate_package_rate/{rate_id}
GET /api/v1/admin/content-translations/delegate_package_facility/{facility_id}
Authorization: Bearer <admin-token>
```

Jika response `data` tidak memiliki item dengan `locale: "zh-CN"`, tampilkan
status `Missing`. Jangan mengisi form Mandarin secara permanen dengan source
English; source boleh ditampilkan sebagai referensi atau placeholder saja.

Saat menyimpan satu katalog, perlakukan setiap request package, rate, dan facility
secara independen. Tampilkan ID item dan `request_id` untuk item yang gagal agar
admin dapat melakukan retry tanpa mengulang item yang sudah berhasil.

### 3.3 Membaca hasil pada halaman publik

Backend menambahkan metadata locale pada setiap resource yang dilokalkan. Kondisi
berikut berarti terjemahan Mandarin tersedia:

```json
{
  "content_locale": "zh-CN",
  "translation_fallback": false
}
```

Kondisi berikut bukan error pemilih bahasa. Ini berarti request `zh-CN` sudah
diterima tetapi translation entity tersebut belum tersedia di database:

```json
{
  "content_locale": "source",
  "translation_fallback": true
}
```

Badge fallback harus diperiksa pada package dan juga pada setiap rate/facility.
Satu package dapat sudah berbahasa Mandarin sementara salah satu facility masih
menggunakan source English.

## 4. Editor agenda/program

Model agenda/program menggunakan resource `session`. Source English dibuat atau
diperbarui melalui:

```http
POST /api/v1/sessions
PUT  /api/v1/sessions/{session_id}
```

Contoh English source:

```json
{
  "event_id": "event-uuid",
  "title": "Women in Global Investment",
  "slug": "women-in-global-investment",
  "description": "Discussion about international investment opportunities.",
  "session_type": "Panel Discussion",
  "room_name": "Grand Ballroom",
  "start_at": "2026-10-15T09:00:00+07:00",
  "end_at": "2026-10-15T10:30:00+07:00",
  "capacity": 300,
  "status": "scheduled"
}
```

Field yang dapat diterjemahkan:

- `title`
- `description`
- `session_type`
- `room_name`

Slug, waktu, capacity, event ID, dan status tetap canonical. Simpan Mandarin:

```http
PUT /api/v1/admin/content-translations/session/{session_id}/zh-CN
```

```json
{
  "fields": {
    "title": "女性参与全球投资",
    "description": "探讨国际投资机会。",
    "session_type": "专题讨论",
    "room_name": "大宴会厅"
  }
}
```

## 5. Membaca kedua versi pada dashboard editor

Contoh response publik English:

```json
{
  "success": true,
  "message": "Speaker ditemukan",
  "data": {
    "id": "speaker-uuid",
    "full_name": "Jane Smith",
    "professional_title": "Chief Executive Officer",
    "organization_name": "Global Investment Group",
    "biography": "She has extensive experience in international investment.",
    "status": "published",
    "content_locale": "source",
    "translation_fallback": false
  },
  "meta": null,
  "request_id": "request-uuid",
  "timestamp": "2026-08-29T10:00:00Z"
}
```

Contoh response resource yang sama dengan `locale=zh-CN`:

```json
{
  "success": true,
  "message": "操作成功",
  "data": {
    "id": "speaker-uuid",
    "full_name": "Jane Smith",
    "professional_title": "首席执行官",
    "organization_name": "全球投资集团",
    "biography": "她在国际投资领域拥有丰富经验。",
    "status": "published",
    "content_locale": "zh-CN",
    "translation_fallback": false
  },
  "meta": null,
  "request_id": "request-uuid",
  "timestamp": "2026-08-29T10:00:00Z"
}
```

Perhatikan bahwa `id`, `full_name`, dan `status` tetap sama.

Endpoint publik mengirim satu versi sesuai locale. Dashboard editor mengambil:

1. Source English dari endpoint speaker/session dengan `?locale=en`.
2. Semua translation dari endpoint berikut:

```http
GET /api/v1/speakers/{speaker_id}?locale=en
GET /api/v1/sessions/{session_id}?locale=en
GET /api/v1/admin/content-translations/speaker/{speaker_id}
GET /api/v1/admin/content-translations/session/{session_id}
```

Contoh response translation:

```json
{
  "success": true,
  "data": [
    {
      "id": "translation-uuid",
      "entity_type": "session",
      "entity_id": "session-uuid",
      "locale": "zh-CN",
      "fields": {
        "title": "女性参与全球投资",
        "description": "探讨国际投资机会。"
      },
      "created_by": "admin-uuid",
      "updated_by": "admin-uuid",
      "created_at": "2026-08-29T10:00:00Z",
      "updated_at": "2026-08-29T10:00:00Z"
    }
  ]
}
```

Jika array tidak memiliki `locale: "zh-CN"`, translation Mandarin belum dibuat.

## 6. Rekomendasi UI editor

Gunakan dua tab:

```text
[ English — Source ] [ 简体中文 ]
```

Perilaku yang direkomendasikan:

- English wajib diisi sebelum resource dipublikasikan.
- Tab Mandarin menampilkan badge `Missing`, `Complete`, atau `Fallback`.
- Simpan English terlebih dahulu untuk memperoleh resource ID.
- Setelah English berhasil, simpan translation Mandarin.
- Jika penyimpanan Mandarin gagal, jangan membatalkan perubahan English; tampilkan
  error dan sediakan tombol retry.
- Tampilkan `request_id` ketika terjadi error server.
- Gunakan `error.code`, bukan teks pesan, untuk menentukan perilaku UI.

Contoh urutan create:

```text
POST source English
    -> memperoleh entity_id
PUT translation zh-CN
    -> editor selesai
```

Contoh urutan update:

```text
PUT source English
PUT translation zh-CN
GET source + GET translations untuk verifikasi
```

Karena dua penyimpanan bukan satu transaksi HTTP, frontend harus menyimpan status
masing-masing request dan tidak menampilkan pesan “semua berhasil” sebelum keduanya
berhasil.

## 7. Menghapus translation

Menghapus Mandarin tidak menghapus source English:

```http
DELETE /api/v1/admin/content-translations/session/{session_id}/zh-CN
DELETE /api/v1/admin/content-translations/speaker/{speaker_id}/zh-CN
```

Setelah dihapus, request publik `locale=zh-CN` kembali memakai fallback.

## 8. Error yang perlu ditangani frontend

| HTTP | `error.code` | Tindakan frontend |
|---|---|---|
| `401` | `UNAUTHORIZED` | Refresh token atau arahkan ke login |
| `403` | `FORBIDDEN` | Sembunyikan editor atau tampilkan akses ditolak |
| `404` | `TRANSLATION_ENTITY_NOT_FOUND` | Source resource sudah tidak tersedia; refresh daftar |
| `404` | `CONTENT_TRANSLATION_NOT_FOUND` | Translation belum ada atau sudah dihapus |
| `400` | `UNSUPPORTED_LOCALE` | Gunakan hanya `en` atau `zh-CN` |
| `400` | `INVALID_TRANSLATION_ENTITY` | Periksa entity type frontend |
| `400` | `INVALID_TRANSLATION_FIELD` | Jangan mengirim field di luar whitelist |
| `400` | `INVALID_TRANSLATION_VALUE` | Tampilkan validasi pada field translation |
| `409` | `CONFLICT` | Refresh data sebelum mencoba kembali |

## 9. Auto-translation

Backend saat ini **tidak menghasilkan Mandarin secara otomatis**. Backend hanya:

- Menyimpan source dan translation secara terpisah.
- Memilih translation berdasarkan locale.
- Memberikan fallback yang konsisten.
- Menyimpan actor dan timestamp perubahan.

Jika auto-translation ditambahkan kemudian, hasilnya harus dianggap draft dan
direview user sebelum publish. Status yang direkomendasikan:

```text
missing -> machine_draft -> reviewed -> published
```

Frontend tidak boleh mengasumsikan endpoint auto-translation sudah tersedia.

## 10. Acceptance checklist frontend

- [ ] Language switch mengirim locale yang benar.
- [ ] English dan Mandarin dapat diedit pada dashboard.
- [ ] `full_name`, slug, status, ID, waktu, dan code tidak diterjemahkan.
- [ ] Translation Mandarin disimpan melalui endpoint content translation.
- [ ] Dashboard dapat membaca source dan seluruh translation.
- [ ] Badge fallback menggunakan `translation_fallback`.
- [ ] Upload foto speaker hanya dilakukan satu kali.
- [ ] Katalog package meminta `locale` pada endpoint publik.
- [ ] Package, rate, dan facility Mandarin disimpan sebagai entity terpisah.
- [ ] Badge fallback diperiksa pada package, rate, dan facility.
- [ ] `content_locale: "source"` dan `translation_fallback: true` ditampilkan sebagai translation `Missing/Fallback`, bukan error language selector.
- [ ] Error handling menggunakan HTTP status dan `error.code`.
- [ ] UI menangani kegagalan salah satu dari dua request penyimpanan.
- [ ] Tampilan publik diuji dengan `en`, `zh-CN`, dan translation yang belum ada.
