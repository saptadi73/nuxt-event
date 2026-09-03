# Frontend Password Reset Flow

Semua endpoint menggunakan prefix `/api/v1`.

## Request reset

```http
POST /api/v1/auth/forgot-password
Content-Type: application/json

{"email":"person@example.com"}
```

Selalu tampilkan pesan netral: jika email terdaftar, instruksi akan dikirim.
Jangan menyimpulkan keberadaan akun dari response.

## Halaman reset

Link email membuka `FRONTEND_RESET_PASSWORD_URL` dengan query parameter
`token`. Halaman frontend membaca token tersebut dan mengirim:

```http
POST /api/v1/auth/reset-password
Content-Type: application/json

{
  "token":"token-from-query-string",
  "password":"new-password",
  "confirm_password":"new-password"
}
```

Jika berhasil, hapus token dari state/browser history dan arahkan ke halaman
login. Token yang sudah dipakai, tidak dikenal, atau kedaluwarsa harus meminta
link baru melalui halaman forgot password.
