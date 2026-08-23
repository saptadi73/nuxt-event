# Frontend Product Purchase Flow

Kontrak frontend untuk pembelian package dan additional product dengan pola
e-commerce. Semua endpoint menggunakan prefix `/api/v1`.

## Prinsip

- Kirim `Authorization: Bearer <access-token>` untuk cart, checkout, order, dan payment.
- Jangan mengirim harga, subtotal, total, currency, atau discount dari frontend.
- Backend adalah sumber harga dan menghitung ulang total saat checkout.
- Jangan menganggap redirect browser sebagai bukti pembayaran.
- Jangan memanggil webhook DOKU dari frontend.
- Simpan `order_id`, `order_number`, dan `payment_id` pada state halaman pembayaran.
- Cegah double-click dengan satu request checkout/payment aktif pada satu waktu.

Untuk bootstrap dashboard setelah login, ambil detail progres user:

```http
GET /api/v1/auth/users/{user_id}
```

Gunakan `registration_status`, `selected_types`, `registrations`, dan `orders`
untuk menentukan langkah UI berikutnya. User hanya boleh meminta `user_id`
miliknya sendiri; admin/organizer memiliki akses operasional.

Gunakan `purchase_tracking.delegate` dan `purchase_tracking.exhibitor` untuk
redirect setelah pemilihan atau pembayaran. Status `paid_profile_incomplete`
berarti user wajib diarahkan ke profile tipe tersebut sebelum fitur berikutnya
dibuka.

## State pembelian

```text
catalog -> cart -> order(pending) -> payment(created/pending) -> order(paid)
                                           |                 -> payment(failed/expired)
                                           -> order(canceled)
```

`order.status` adalah status bisnis order. `payment.transaction_status` adalah
status transaksi gateway. Status final berasal dari notification DOKU yang
diverifikasi backend.

## 1. Ambil katalog

```http
GET /api/v1/store/events/{event_id}/products
```

Product memiliki `product_type` `delegate`, `exhibitor`, atau `additional`.
Jangan hard-code UUID, harga, currency, atau batas quantity.

Untuk IWBIF Delegate, katalog menyediakan `DELEGATE_A`, `DELEGATE_B`, dan
`DELEGATE_C`. Harga `price` dan `currency` adalah nominal yang ditagihkan
(saat ini IDR). Tampilkan harga sumber dari `metadata_json.display_amount` dan
`metadata_json.display_currency` bila UI perlu menampilkan harga package USD.
`metadata_json.delegate_package_id` adalah ID package yang harus dipakai saat
user mengisi form registrasi setelah pembelian. Jangan mengubah atau menebak
nilai metadata tersebut.

## 2. Kelola cart

```http
GET  /api/v1/store/events/{event_id}/cart
POST /api/v1/store/events/{event_id}/cart/items
```

Payload tambah item:

```json
{
  "product_id": "product-uuid",
  "quantity": 1
}
```

Hapus item:

```http
DELETE /api/v1/store/events/{event_id}/cart/items/{product_id}
```

Product yang sama menambah quantity, bukan membuat baris duplikat. Backend
menolak product tidak aktif, event berbeda, quantity melebihi batas, dan
campuran currency dalam satu order.

## 3. Checkout cart menjadi order

```http
POST /api/v1/store/events/{event_id}/checkout
```

Checkout tidak memerlukan registration. Backend mengikat order ke `user_id` dan
baru menautkan `registration_id` ketika user menyelesaikan form Delegate dengan
package yang dibeli. Simpan `order_id` dan `order_number` dari response.
Checkout menghapus item dari cart dan membuat snapshot di `order_items`,
sehingga histori tidak berubah jika admin mengubah harga katalog.

Frontend harus menonaktifkan tombol selama request berlangsung. Jika request
gagal, ambil ulang cart dan jangan mengasumsikan order telah dibuat.

## 4. Buat pembayaran DOKU

```http
POST /api/v1/payments/doku/checkout
Content-Type: application/json

{
  "order_id": "order-uuid"
}
```

Backend memverifikasi ownership, status order, total database, dan membuat
`line_items` DOKU dari `order_items`.

```ts
window.location.assign(data.payment_url);
```

Jika `requires_payment` bernilai `false`, order sudah dibayar dan frontend tidak
boleh membuat checkout kedua.

## 4a. Lanjutkan profil Delegate setelah pembayaran

Setelah status payment `success`, arahkan user ke form Delegate. Isi
`delegate_package_id` dari `metadata_json.delegate_package_id` product yang
dibeli, lalu kirim seluruh form ke:

```http
POST /api/v1/events/{event_id}/registrations
```

Backend mencocokkan user, event, dan produk `DELEGATE_{code}`, lalu menautkan
order pending atau paid yang sesuai ke registration baru. Frontend tidak boleh
mengirim `order_id` atau nominal pada payload registration.

## 5. Halaman hasil dan polling

Redirect kembali dari DOKU bukan bukti pembayaran. Setelah halaman hasil dibuka:

```http
GET /api/v1/payments/{payment_id}
GET /api/v1/orders/{order_id}
```

Polling setiap 3-5 detik, maksimal sekitar 2 menit, lalu hentikan saat status
terminal atau komponen dilepas.

| Payment status | UI | Aksi |
|---|---|---|
| `created`, `pending` | Menunggu pembayaran | Lanjutkan polling |
| `success` | Pembayaran berhasil | Tampilkan invoice dan langkah berikutnya |
| `failed` | Pembayaran gagal | Izinkan payment ulang setelah order baru/valid |
| `expired` | Pembayaran kedaluwarsa | Izinkan checkout ulang |

Jika status terlihat `pending` sementara gateway mengirim success tapi backend belum
menandai `success`, jangan ubah UI ke sukses sampai /payments/{payment_id} sudah
`transaction_status=success` dan `order_status=paid`. Sambil menunggu:

- Tampilkan pesan “Verifikasi admin/pembayaran sedang diproses”.
- Sisakan tombol “Periksa lagi” untuk memicu ulang polling.
- Jika user mengkonfirmasi ada mismatch yang berkepanjangan, sarankan admin
  verifikasi manual lewat workflow admin.

Khusus Midtrans, keberadaan `provider_order_id` atau
`provider_transaction_id` tidak mengubah aturan UI di atas. Frontend tetap
menentukan hasil dari `transaction_status`; ID gateway hanya ditampilkan sebagai
referensi invoice, report admin, atau troubleshooting.

## 6. Error handling

- `401`: token invalid/expired, arahkan login atau refresh token.
- `403`: resource bukan milik user aktif.
- `404 PRODUCT_NOT_FOUND`: product tidak tersedia atau nonaktif.
- `409`: konflik product/order/payment aktif; ambil ulang state backend.
- `422 EMPTY_CART`: pilih minimal satu product.
- `422 MIXED_CURRENCY`: pisahkan pembelian berdasarkan currency.
- `422 PRODUCT_QUANTITY_LIMIT`: sesuaikan quantity dengan katalog.

Gunakan `message` untuk teks dan `code` untuk perilaku UI. Catat `request_id`
untuk troubleshooting. Jangan menampilkan raw response atau secret DOKU.

## 7. Acceptance checklist

1. Refresh katalog tidak menghapus cart.
2. Double-click add item tidak membuat duplicate row.
3. Double-click checkout tidak membuat dua order aktif.
4. Frontend tidak mengirim nominal ke checkout/payment.
5. Perubahan harga admin tidak mengubah order yang sudah dibuat.
6. Cancel/back dari DOKU tidak ditampilkan sebagai paid.
7. Refresh halaman hasil tidak membuat order/payment baru.
8. Payment cart dapat diambil melalui endpoint milik user tersebut.
9. Webhook tidak pernah dipanggil dari browser.
10. Secret DOKU tidak masuk bundle frontend.
11. Delegate yang sudah paid diarahkan ke form profil dengan
    `delegate_package_id` dari metadata product yang dibeli.
