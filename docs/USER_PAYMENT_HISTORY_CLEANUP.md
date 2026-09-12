# Hapus percobaan pembayaran setelah order lunas

Pemilik order yang telah lunas dapat memilih beberapa percobaan pembayaran
untuk dihapus dari riwayat user. Pembayaran sukses dan refund tetap terlihat.
Fitur tersedia pada halaman cart, payment, dan payment status frontend.

## Kontrak API

```http
POST /api/v1/orders/{order_id}/payment-attempts/delete
Authorization: Bearer <access_token>
Content-Type: application/json
```

```json
{
  "payment_ids": [
    "3eb77361-a806-4e56-b0c2-adfa0c6f0271",
    "c5748a39-7661-4cd7-8cd3-bb80d1dc2978"
  ]
}
```

UUID di atas hanya contoh; gunakan ID dari `payment_attempts` pada
`GET /api/v1/orders/{order_id}/detail` atau `GET /api/v1/orders`.
Request menerima 1-100 ID. ID duplikat diproses satu kali.

Ketentuan akses dan validasi:

- User login harus merupakan `orders.user_id`. Akses sebagai participant
  terkait saja tidak cukup untuk menghapus riwayat order milik akun lain.
- Order harus berstatus `paid`, jumlah pembayaran sukses lebih dari nol,
  dan saldo tersisa berdasarkan perhitungan backend harus nol.
- Seluruh ID harus berasal dari order tersebut dan belum dihapus oleh admin
  melalui mekanisme `deleted_at`.
- Semua pilihan divalidasi sebelum perubahan. Jika satu ID tidak valid,
  seluruh request ditolak tanpa perubahan parsial.

| Status percobaan | Bisa dihapus dari riwayat user |
|---|---|
| `created`, `pending` | Ya, jika order sudah lunas |
| `failed`, `expired`, `canceled` | Ya, jika order sudah lunas |
| `success`, `refunded` | Tidak |
| Status lain | Tidak |

Respons sukses memakai envelope API standar. Bagian `data`:

```json
{
  "payment_ids": [
    "3eb77361-a806-4e56-b0c2-adfa0c6f0271",
    "c5748a39-7661-4cd7-8cd3-bb80d1dc2978"
  ]
}
```

Urutan ID respons tidak harus mengikuti request. Pengiriman ulang ID yang
sudah disembunyikan tetap berhasil tanpa audit duplikat selama kepemilikan,
status order, dan status payment masih memenuhi aturan. Jika kemudian payment
menjadi sukses/refund, request ulang akan ditolak.

| HTTP | Kode/kondisi | Penanganan frontend |
|---|---|---|
| 401 | Autentikasi tidak valid | Minta user login kembali |
| 404 | `ORDER_NOT_FOUND` | Muat ulang daftar order milik user |
| 404 | `PAYMENT_NOT_FOUND` | Muat ulang percobaan pembayaran |
| 409 | `ORDER_NOT_FULLY_PAID` | Muat ulang status dan sembunyikan opsi hapus jika belum lunas |
| 409 | `PAYMENT_DELETE_FORBIDDEN` | Muat ulang status; keluarkan sukses/refund dari pilihan |
| 422 | Body kosong, UUID tidak valid, atau jumlah ID di luar batas | Perbaiki payload |

## Alur frontend

1. Ambil order beserta `payment_attempts` dan informasi pelunasan dari backend.
   Gunakan `normalizeOrderDetail` dan `isOrderFullyPaid`; jangan menyimpulkan
   lunas dari satu percobaan sukses pada order dengan pembayaran bertahap.
2. Tampilkan komponen pembersihan jika order lunas dan ada percobaan yang
   memenuhi status di tabel. Checkbox memungkinkan maksimal 100 pilihan.
3. Tombol **Delete selected** menampilkan jumlah pilihan. Tombol tidak aktif
   jika pilihan kosong atau request sedang berlangsung.
4. Setelah konfirmasi user, kirim satu request untuk ID yang dipilih.
5. Setelah sukses, keluarkan `data.payment_ids` dari daftar lokal. Jika gagal,
   pertahankan daftar dan tampilkan pesan kegagalan; user dapat refresh dan mencoba lagi.
6. Saat refresh, gunakan daftar dari backend. `latest_payment` dan
   `payment_attempts` dalam respons order tidak memuat percobaan tersembunyi,
   kecuali statusnya kemudian berubah menjadi `success` atau `refunded`.

Implementasi frontend berada di repo `nuxt-event`:

- `app/components/PaymentAttemptCleanup.vue`: pilihan, konfirmasi, request, dan feedback.
- `app/components/OrderPaymentProgress.vue`: integrasi dan event `attempts-removed`.
- `app/composables/usePayment.ts`: metode `deletePaymentAttempts`.
- `app/pages/dashboard/cart.vue`, `payment.vue`, `payment-status.vue`: pembaruan daftar lokal.

## Penyimpanan dan notifikasi pembayaran

Backend mengisi `payments.hidden_from_user_at` dan menulis audit `USER_HIDDEN`
yang memuat ID pelaku serta waktu. Fitur ini tidak mengisi `deleted_at`, tidak
mengubah status transaksi, dan tidak membatalkan checkout di penyedia pembayaran.

Catatan tetap tersedia untuk admin, perhitungan saldo, dan lookup webhook.
Penghapusan dari riwayat tidak mengubah invoice atau tiket. Endpoint detail
payment langsung juga tetap dapat membaca catatan sesuai aturan aksesnya.
Jika notifikasi terlambat mengubah percobaan tersembunyi menjadi sukses/refund,
catatan tersebut kembali terlihat pada refresh riwayat order.

## Deployment dan verifikasi

Migrasi `202609120046` bergantung pada `202609120045` dan menambahkan kolom
nullable `payments.hidden_from_user_at`. Tidak ada backfill atau penghapusan
transaksi lama. Ikuti [prosedur migrasi produksi](PRODUCTION_DATABASE_MIGRATION.md).

Urutan rilis: terapkan migrasi, aktifkan backend baru, lalu rilis frontend.
Backend baru membaca kolom tambahan sehingga tidak boleh diaktifkan sebelum
migrasi berhasil. Frontend baru memerlukan endpoint baru.

```bash
alembic upgrade head
alembic current
```

Jika perlu rollback aplikasi, kolom tambahan dapat tetap dibiarkan. Downgrade
database melewati `202609120046` menghapus penanda tersembunyi sehingga percobaan
lama akan terlihat kembali; jangan menjalankannya saat backend baru masih aktif.

Verifikasi di staging dengan order milik user sendiri:

- Hapus beberapa percobaan pada order lunas, lalu refresh dan pastikan tetap tersembunyi.
- Pastikan pembayaran sukses, saldo, invoice, dan tiket tetap tersedia.
- Pastikan order belum lunas, order akun lain, dan pilihan sukses/refund ditolak.
- Simulasikan notifikasi sukses terlambat; pastikan catatan kembali terlihat.

Tes otomatis fitur tersedia pada `tests/test_user_payment_cleanup.py`:

```bash
python -m pytest tests/test_user_payment_cleanup.py -q
```
