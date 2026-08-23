# Registration Email Notifications

Backend mengirim email konfirmasi setelah `POST /api/v1/auth/register` berhasil.
Email dikirim sebagai background task sehingga respons registrasi tidak tertahan
oleh koneksi SMTP.

Isi email:

- Konfirmasi akun berhasil terdaftar pada event IWBIF 2026.
- Link `FRONTEND_LOGIN_URL` untuk login dan melanjutkan pendaftaran.
- Sender mengikuti `EMAIL_FROM_ADDRESS` dan harus sama dengan mailbox Titan yang
  dipakai pada `EMAIL_SMTP_USERNAME`.

## Titan Email SMTP

Konfigurasi berada di `.env` dan jangan dikirim ke frontend:

```env
EMAIL_ENABLED=true
EMAIL_SMTP_HOST=smtp.titan.email
EMAIL_SMTP_PORT=465
EMAIL_SMTP_USE_SSL=true
EMAIL_SMTP_USE_TLS=false
EMAIL_SMTP_USERNAME=event@iwbif.id
EMAIL_SMTP_PASSWORD=<Titan-Mailbox-or-App-Password>
EMAIL_FROM_ADDRESS=event@iwbif.id
EMAIL_FROM_NAME=IWBIF 2026
FRONTEND_LOGIN_URL=https://frontend.example.com/login
```

`EMAIL_SMTP_PASSWORD` harus diisi dengan password mailbox Titan. Jika 2FA aktif,
gunakan application password Titan. Akses aplikasi pihak ketiga juga harus aktif
pada akun Titan. Jangan menyimpan password di source control.

Konfigurasi utama Titan menggunakan SSL/TLS langsung pada port 465. Alternatif
STARTTLS port 587 dapat digunakan dengan `EMAIL_SMTP_USE_SSL=false` dan
`EMAIL_SMTP_USE_TLS=true` jika port 465 diblokir oleh jaringan server.

Untuk development, gunakan `EMAIL_ENABLED=false`. Untuk production, isi secret
password melalui secret manager atau environment deployment lalu restart backend.

Jika SMTP gagal, akun tetap tersimpan dan backend mencatat error tanpa
mengembalikan password atau credential ke response API.

## Template notifikasi yang dikelola admin

Setiap event memiliki template yang dapat diaktifkan/dinonaktifkan serta diubah
subjek dan isinya oleh admin. Template menggunakan variabel dengan format
`{{ variable_name }}`. Daftar variabel yang diizinkan dikembalikan pada field
`available_variables` agar frontend admin dapat menampilkannya.

Endpoint admin:

- `GET /api/v1/admin/events/{event_id}/email-notifications`
- `PUT /api/v1/admin/events/{event_id}/email-notifications/{trigger}`
- `POST /api/v1/admin/events/{event_id}/email-notifications/{trigger}/preview`
- `POST /api/v1/admin/events/{event_id}/email-notifications/{trigger}/test-send`
- `GET /api/v1/admin/events/{event_id}/email-notifications/logs/history`

Endpoint organizer untuk override per akun:

- `GET /api/v1/admin/events/{event_id}/email-notifications/accounts/{user_id}/preferences`
- `PUT /api/v1/admin/events/{event_id}/email-notifications/accounts/{user_id}/preferences/{trigger}`

Body `PUT` menggunakan `{ "is_enabled": false }` untuk menonaktifkan trigger
khusus akun tersebut, `{ "is_enabled": true }` untuk mengaktifkan override, dan
`{ "is_enabled": null }` untuk menghapus override serta kembali mengikuti
default event. Field respons `global_enabled`, `override_enabled`, dan
`effective_enabled` membedakan ketiga status tersebut. Template event adalah
master switch: override akun tidak dapat mengaktifkan pengiriman jika template
global sedang dinonaktifkan. Setiap perubahan override mencatat organizer pada
`updated_by`.

Trigger yang tersedia meliputi registrasi dikirim, pemilihan paket delegate dan
exhibitor, konfirmasi pembayaran, penyimpanan profil business matching, serta
perubahan meeting (requested, accepted, confirmed, declined, cancelled, dan
reschedule requested). Pengiriman dilakukan setelah transaksi utama berhasil;
kegagalan email dicatat di `email_notification_logs` dan tidak membatalkan
registrasi atau pembayaran.
