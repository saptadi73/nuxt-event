# Frontend Committee Integration

Halaman publik dan editor admin menggunakan sumber data Committee dari backend.
Semua endpoint memiliki prefix `/api/v1`.

## Halaman publik

Ambil event aktif terlebih dahulu, lalu request daftar committee:

```http
GET /api/v1/events/{event_id}/committee?locale=en
GET /api/v1/events/{event_id}/committee?locale=zh-CN
```

Endpoint hanya mengirim member berstatus `published` dan sudah diurutkan menurut
`display_order`. Frontend tidak perlu mengurutkan ulang. Gunakan
`content_locale` dan `translation_fallback` untuk mengetahui apakah konten
Mandarin tersedia atau sedang memakai fallback English.

## Editor admin

```http
GET /api/v1/admin/committee?event_id={event_id}&locale=en
POST /api/v1/admin/committee
PUT /api/v1/admin/committee/{member_id}
DELETE /api/v1/admin/committee/{member_id}
```

Contoh create:

```json
{
  "event_id": "event-uuid",
  "full_name": "Committee Member",
  "role_title": "Committee Chair",
  "committee_group": "Organizing Committee",
  "organization_name": "IWAPI",
  "biography": "Committee member biography.",
  "display_order": 1,
  "is_featured": true,
  "status": "published"
}
```

Gunakan tab English dan Simplified Chinese seperti editor Speakers. English
adalah source canonical. Simpan terjemahan Mandarin secara terpisah:

```http
PUT /api/v1/admin/content-translations/committee_member/{member_id}/zh-CN
Content-Type: application/json

{
  "fields": {
    "role_title": "委员会主席",
    "committee_group": "组委会",
    "organization_name": "印度尼西亚女企业家协会",
    "biography": "委员会成员简介。"
  }
}
```

`full_name`, foto, urutan, featured state, dan publication status tidak
diterjemahkan. Translation dapat diperiksa dan dihapus melalui:

```http
GET    /api/v1/admin/content-translations/committee_member/{member_id}
DELETE /api/v1/admin/content-translations/committee_member/{member_id}/zh-CN
```

## Upload foto

Member harus dibuat lebih dahulu agar frontend memperoleh `member_id`. Setelah
itu kirim `FormData`:

```ts
const body = new FormData()
body.append('file', selectedFile)

await api(`/admin/committee/${memberId}/photo`, {
  method: 'POST',
  body
})
```

File yang didukung adalah JPG, PNG, dan WebP dengan ukuran maksimum 5 MB.
Validasi tipe dan ukuran di browser untuk feedback cepat, tetapi backend tetap
menjadi validasi final. Gunakan `profile_photo_url` dari response sebagai foto
baru dan gabungkan dengan API origin apabila nilainya berupa path relatif.

Urutan save yang disarankan:

1. Create atau update source English.
2. Upload foto jika user memilih file.
3. Simpan translation `zh-CN` jika form Mandarin berisi data.
4. Muat ulang daftar dan status translation.

Jika tahap kedua atau ketiga gagal, jangan membuat member baru lagi. Pertahankan
`member_id`, tampilkan kegagalan parsial, lalu izinkan admin mengulang hanya
tahap yang gagal.
