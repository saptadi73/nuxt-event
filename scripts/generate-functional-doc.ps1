$ErrorActionPreference = 'Stop'
$workspace = Split-Path -Parent $PSScriptRoot
$buildDir = Join-Path $workspace 'docs\.docx-build'
$output = Join-Path $workspace 'docs\Panduan_Fungsional_Frontend_IWBIF_2026.docx'
if (Test-Path -LiteralPath $buildDir) { Remove-Item -LiteralPath $buildDir -Recurse -Force }
New-Item -ItemType Directory -Path (Join-Path $buildDir '_rels'), (Join-Path $buildDir 'docProps'), (Join-Path $buildDir 'word'), (Join-Path $buildDir 'word\_rels') | Out-Null

function Escape([string]$text) { [System.Security.SecurityElement]::Escape($text) }
function Para([string]$text, [string]$style = '', [bool]$breakBefore = $false) {
  $pPr = if ($style -or $breakBefore) { '<w:pPr>' + $(if ($style) { '<w:pStyle w:val="' + $style + '"/>' }) + $(if ($breakBefore) { '<w:pageBreakBefore/>' }) + '</w:pPr>' } else { '' }
  '<w:p>' + $pPr + '<w:r><w:t xml:space="preserve">' + (Escape $text) + '</w:t></w:r></w:p>'
}
function Code([string]$text) { '<w:p><w:pPr><w:pStyle w:val="Code"/></w:pPr><w:r><w:t xml:space="preserve">' + (Escape $text) + '</w:t></w:r></w:p>' }
function Bullet([string]$text) { '<w:p><w:pPr><w:pStyle w:val="ListBullet"/></w:pPr><w:r><w:t xml:space="preserve">' + (Escape $text) + '</w:t></w:r></w:p>' }
function Table([array]$rows, [array]$widths) {
  $grid = ($widths | ForEach-Object { '<w:gridCol w:w="' + $_ + '"/>' }) -join ''
  $body = foreach ($rowIndex in 0..($rows.Count - 1)) {
    $cells = for ($i = 0; $i -lt $rows[$rowIndex].Count; $i++) {
      $shade = if ($rowIndex -eq 0) { '<w:shd w:fill="17365D"/>' } else { '' }
      $color = if ($rowIndex -eq 0) { '<w:color w:val="FFFFFF"/><w:b/>' } else { '' }
      '<w:tc><w:tcPr><w:tcW w:w="' + $widths[$i] + '" w:type="dxa"/>' + $shade + '</w:tcPr><w:p><w:r><w:rPr>' + $color + '</w:rPr><w:t xml:space="preserve">' + (Escape ([string]$rows[$rowIndex][$i])) + '</w:t></w:r></w:p></w:tc>'
    }
    '<w:tr>' + ($cells -join '') + '</w:tr>'
  }
  '<w:tbl><w:tblPr><w:tblW w:w="0" w:type="auto"/><w:tblBorders><w:top w:val="single" w:sz="4" w:color="B8C4CE"/><w:left w:val="single" w:sz="4" w:color="B8C4CE"/><w:bottom w:val="single" w:sz="4" w:color="B8C4CE"/><w:right w:val="single" w:sz="4" w:color="B8C4CE"/><w:insideH w:val="single" w:sz="4" w:color="D9E2F3"/><w:insideV w:val="single" w:sz="4" w:color="D9E2F3"/></w:tblBorders></w:tblPr><w:tblGrid>' + $grid + '</w:tblGrid>' + ($body -join '') + '</w:tbl>'
}

$content = @()
$content += Para 'PANDUAN FUNGSIONAL FRONTEND' 'Title'
$content += Para 'International Women Business & Investment Forum (IWBIF) 2026' 'Subtitle'
$content += Para 'Panduan instalasi, konfigurasi, pengoperasian, dan pengujian aplikasi frontend' 'Subtitle'
$content += Para 'Versi dokumen: 1.0 | 17 Agustus 2026' 'Caption'
$content += Para 'Dokumen internal/demo. Kredensial di dalam dokumen ini tidak boleh digunakan pada lingkungan produksi.' 'Warning'
$content += Para '1. Tujuan dan ruang lingkup' 'Heading1' $true
$content += Para 'Dokumen ini menjelaskan cara menyiapkan dan menjalankan frontend IWBIF 2026, fungsi yang tersedia bagi pengunjung, delegate, exhibitor, dan organizer, serta prosedur pengujian alur registrasi dan pembayaran.'
$content += Para 'Frontend dibangun dengan Nuxt 4, Vue 3, Pinia, dan Tailwind CSS. Semua data operasional—akun, event, registrasi, metode pembayaran, status transaksi, invoice, dan tiket—bersumber dari backend melalui API /api/v1.'
$content += Para '2. Prasyarat sistem' 'Heading1'
$content += Bullet 'Node.js versi 20 LTS atau versi kompatibel dengan Nuxt 4.'
$content += Bullet 'npm tersedia melalui instalasi Node.js.'
$content += Bullet 'Backend IWBIF aktif dan dapat diakses oleh browser.'
$content += Bullet 'Microsoft Edge, Google Chrome, Firefox, atau Safari versi terbaru.'
$content += Bullet 'Koneksi ke DOKU sandbox diperlukan untuk menguji pembayaran.'
$content += Para '3. Struktur aplikasi' 'Heading1'
$content += Table @(
  @('Lokasi', 'Fungsi'),
  @('app/pages', 'Halaman publik, autentikasi, registrasi, dashboard, dan panel organizer.'),
  @('app/composables', 'Kontrak dan fungsi akses API seperti autentikasi, registrasi, pembayaran, tiket, dan laporan.'),
  @('app/stores', 'State global Pinia, termasuk token dan identitas pengguna.'),
  @('app/plugins/api.ts', 'API client terpusat dan integrasi autentikasi.'),
  @('app/assets/css/main.css', 'Style global aplikasi.'),
  @('public', 'Aset statis seperti favicon dan gambar publik.'),
  @('docs', 'Dokumentasi API dan integrasi pembayaran.')
) @(2600, 6500)
$content += Para '4. Instalasi dan konfigurasi' 'Heading1' $true
$content += Para '4.1 Instalasi dependensi' 'Heading2'
$content += Code 'npm install'
$content += Para 'Pada Windows PowerShell dengan execution policy yang membatasi npm.ps1, gunakan npm.cmd:'
$content += Code 'npm.cmd install'
$content += Para '4.2 Membuat environment lokal' 'Heading2'
$content += Code 'Copy-Item .env.example .env'
$content += Para 'Isi variabel berikut sesuai alamat backend dan frontend:'
$content += Code "NUXT_PUBLIC_API_BASE_URL=http://127.0.0.1:8000/api/v1`nNUXT_PUBLIC_SITE_URL=http://localhost:3000`nNUXT_PUBLIC_APP_NAME=IWBIF 2026"
$content += Para 'Untuk production, contoh konfigurasi yang digunakan adalah:'
$content += Code "NUXT_PUBLIC_API_BASE_URL=https://api.iwbif.id/api/v1`nNUXT_PUBLIC_SITE_URL=https://iwbif.id"
$content += Para 'Jangan pernah menyimpan Consumer Secret, DOKU key, merchant private key, password database, atau credential backend di variabel NUXT_PUBLIC karena nilainya akan masuk ke bundle browser.' 'Warning'
$content += Para '5. Menjalankan aplikasi' 'Heading1'
$content += Para '5.1 Development' 'Heading2'
$content += Code 'npm run dev'
$content += Para 'Buka http://localhost:3000. Nuxt akan melakukan hot reload ketika source code berubah.'
$content += Para '5.2 Build production' 'Heading2'
$content += Code "npm run build`nnode .output/server/index.mjs"
$content += Para 'Secara default server hasil build berjalan pada port 3000. Gunakan NITRO_PORT dan NITRO_HOST sesuai kebutuhan deployment.'
$content += Para '5.3 Preview atau static generation' 'Heading2'
$content += Code "npm run preview`nnpm run generate"
$content += Para 'Dashboard dan halaman admin dikonfigurasi client-side (SSR nonaktif). Pastikan web server memiliki fallback routing yang benar bila hasil statis digunakan.'
$content += Para '6. Akun demo' 'Heading1' $true
$content += Para 'Gunakan akun berikut hanya untuk demonstrasi dan pengujian pada environment yang telah disiapkan.'
$content += Table @(
  @('Peran', 'Email', 'Password', 'Akses utama'),
  @('Organizer', 'organizer@iwbif2026.org', 'IwbifDemo2026!', 'Dashboard organizer dan laporan penjualan/pendapatan.'),
  @('Delegate', 'sari@nusantarafoods.id', 'IwbifDemo2026!', 'Dashboard peserta, profil, pembayaran, invoice, tiket, dan jadwal.')
) @(1800, 2800, 2200, 2800)
$content += Para 'Keamanan: jangan menyalin akun demo ke production. Ubah password apabila dokumen dibagikan di luar tim pengujian.' 'Warning'
$content += Para '7. Cara login' 'Heading1'
$content += Bullet 'Buka /auth/login.'
$content += Bullet 'Masukkan email dan password akun demo.'
$content += Bullet 'Klik Login. Setelah berhasil, pengguna diarahkan ke dashboard.'
$content += Bullet 'Jika sesi berakhir, frontend mencoba refresh token satu kali. Jika gagal, pengguna dikeluarkan dan perlu login kembali.'
$content += Para '8. Fungsi publik' 'Heading1'
$content += Table @(
  @('Menu/halaman', 'Fungsi'),
  @('Home', 'Ringkasan event dan ajakan registrasi.'),
  @('About, Program, Workshops', 'Informasi event, agenda, dan aktivitas delegate.'),
  @('Speakers', 'Daftar pembicara dan pemimpin ekosistem.'),
  @('Tickets', 'Paket delegate yang diambil dari backend.'),
  @('Business Matching dan Deal Room', 'Informasi networking dan peluang pertemuan bisnis.'),
  @('Exhibition dan Partners', 'Informasi exhibitor dan kolaborasi mitra.'),
  @('FAQ, Contact, Legal', 'Bantuan, kontak, privacy, terms, code of conduct, refund, dan consent.')
) @(2700, 6400)
$content += Para '9. Registrasi pengguna dan peserta' 'Heading1' $true
$content += Para '9.1 Membuat akun baru' 'Heading2'
$content += Bullet 'Buka /auth/register, isi nama, email, password, dan konfirmasi password.'
$content += Bullet 'Setelah akun dibuat, pilih jenis registrasi Delegate atau Exhibitor.'
$content += Para '9.2 Registrasi Delegate' 'Heading2'
$content += Bullet 'Login, lalu buka /register/delegate.'
$content += Bullet 'Pilih paket dan aktivitas yang disediakan backend.'
$content += Bullet 'Lengkapi identitas, organisasi, perjalanan, kebutuhan khusus, preferensi business matching, invoice, dan consent.'
$content += Bullet 'Registrasi disimpan sebagai draft sebelum proses submit dan pembayaran.'
$content += Bullet 'Dokumen PASSPORT_COPY wajib tersedia sebelum registrasi dapat disubmit sesuai kontrak backend.'
$content += Para '9.3 Registrasi Exhibitor' 'Heading2'
$content += Bullet 'Buka /register/exhibitor setelah login.'
$content += Bullet 'Lengkapi data perusahaan, kontak, produk, booth, listrik, kebutuhan khusus, dan persetujuan.'
$content += Bullet 'Unggah product catalogue sesuai ketentuan backend untuk menyelesaikan submission.'
$content += Para '10. Dashboard Delegate' 'Heading1'
$content += Table @(
  @('Fungsi', 'Penggunaan'),
  @('Profile', 'Melihat dan memperbarui profil participant.'),
  @('Payment', 'Memilih channel aktif dan membuat transaksi.'),
  @('Payment Status', 'Memantau status created/pending sampai success, failed, atau expired.'),
  @('Invoice', 'Melihat invoice setelah pembayaran tersedia/terkonfirmasi.'),
  @('My Ticket', 'Melihat tiket dan QR check-in setelah syarat backend terpenuhi.'),
  @('Schedule', 'Melihat agenda kegiatan.'),
  @('Directory', 'Menemukan participant lain berdasarkan status dan consent.'),
  @('Announcements dan Certificate', 'Informasi operasional dan dokumen partisipasi.')
) @(2800, 6300)
$content += Para '11. Prosedur pembayaran' 'Heading1' $true
$content += Para 'Halaman /dashboard/payment selalu mengambil katalog channel aktif dari GET /payments/methods. Frontend tidak menghitung kurs atau nominal; nilai charge berasal dari backend.'
$content += Para '11.1 Virtual Account' 'Heading2'
$content += Bullet 'Frontend memeriksa bank yang siap melalui /payments/doku/direct/methods.'
$content += Bullet 'Pilih bank aktif, lalu klik Continue.'
$content += Bullet 'Frontend membuat VA dan menampilkan nomor, nominal IDR, expiry, tombol salin, dan petunjuk pembayaran.'
$content += Bullet 'Buka Check payment status untuk memantau notification DOKU yang telah diverifikasi backend.'
$content += Para '11.2 QRIS' 'Heading2'
$content += Bullet 'QRIS hanya muncul jika capability backend qris bernilai true.'
$content += Bullet 'Klik Continue untuk menghasilkan QR dinamis, lalu pindai menggunakan aplikasi pembayaran yang mendukung QRIS.'
$content += Bullet 'Status sukses hanya ditampilkan setelah backend menerima dan memverifikasi notification DOKU.'
$content += Para '11.3 Direct Debit' 'Heading2'
$content += Bullet 'Masukkan nomor telepon yang terdaftar pada bank; Device ID bersifat opsional.'
$content += Bullet 'Frontend membuat account binding. Selesaikan redirect/OTP/PIN pada halaman bank apabila diminta.'
$content += Bullet 'Setelah binding, frontend membuat pembayaran menggunakan binding_id.'
$content += Bullet 'Jika diminta, masukkan OTP bank dan kirim dari halaman pembayaran.'
$content += Bullet 'Pantau status transaksi sampai terminal melalui halaman Payment Status.'
$content += Para '11.4 e-Wallet' 'Heading2'
$content += Para 'DANA, OVO, dan channel e-Wallet lain sengaja tidak ditampilkan. Backend saat ini baru mempunyai authorization return dan notification webhook, tetapi belum mempunyai endpoint create payment. Seluruh channel hasil seed harus tetap is_enabled=false sampai endpoint create transaksi selesai dibuat dan diuji.' 'Warning'
$content += Para '11.5 Arti status' 'Heading2'
$content += Table @(
  @('Status', 'Arti dan tindakan'),
  @('created / pending', 'Transaksi sedang menunggu pembayaran atau verifikasi. Jangan membuat transaksi paralel.'),
  @('success', 'Notification provider telah diverifikasi backend; invoice dapat dibuka.'),
  @('failed', 'Transaksi gagal; pengguna dapat mencoba kembali.'),
  @('expired', 'Waktu pembayaran habis; pengguna dapat membuat transaksi baru.')
) @(2300, 6800)
$content += Para 'Browser redirect bukan bukti pembayaran. Webhook/notification DOKU yang diverifikasi backend adalah sumber kebenaran.' 'Warning'
$content += Para '12. Fungsi Organizer' 'Heading1' $true
$content += Bullet 'Login menggunakan akun Organizer.'
$content += Bullet 'Dashboard menampilkan akses Organizer View bagi role admin/organizer.'
$content += Bullet 'Buka /admin/reports untuk laporan ticket sales dan revenue.'
$content += Bullet 'Gunakan filter event, package, status, channel, dan tanggal yang tersedia pada halaman laporan.'
$content += Bullet 'Unduh CSV melalui fungsi export laporan ketika diperlukan.'
$content += Bullet 'Halaman admin dilindungi middleware autentikasi dan pemeriksaan role.'
$content += Para '13. Skenario smoke test' 'Heading1'
$content += Table @(
  @('No.', 'Skenario', 'Hasil yang diharapkan'),
  @('1', 'Login Delegate', 'Dashboard participant tampil tanpa error 401.'),
  @('2', 'Buka Payment', 'Hanya VA, QRIS, atau Direct Debit yang benar-benar aktif yang tampil; e-Wallet tidak tampil.'),
  @('3', 'Buat transaksi VA', 'Nomor VA, nominal, dan expiry berasal dari backend.'),
  @('4', 'Buat QRIS', 'QR dapat dipindai dan payment_id tersimpan.'),
  @('5', 'Direct Debit', 'Binding, redirect/OTP, create payment, dan polling berjalan sesuai response bank.'),
  @('6', 'Selesaikan pembayaran sandbox', 'Payment berubah success dan registration menjadi paid setelah webhook.'),
  @('7', 'Refresh status', 'Refresh tidak membuat order baru.'),
  @('8', 'Buka Invoice/Ticket', 'Dokumen muncul sesuai status registrasi dari backend.'),
  @('9', 'Login Organizer', 'Organizer dapat membuka laporan penjualan.'),
  @('10', 'Logout/token kedaluwarsa', 'Token dibersihkan dan pengguna kembali ke login bila refresh gagal.')
) @(700, 3100, 5200)
$content += Para '14. Troubleshooting' 'Heading1' $true
$content += Table @(
  @('Masalah', 'Pemeriksaan dan solusi'),
  @('Frontend tidak dapat mengambil data', 'Periksa NUXT_PUBLIC_API_BASE_URL, backend, CORS, HTTPS mixed-content, dan tab Network browser.'),
  @('401 Unauthorized', 'Login ulang; periksa access/refresh token dan waktu server.'),
  @('Metode pembayaran kosong', 'Pastikan channel sudah dikonfigurasi dan is_enabled=true hanya untuk endpoint yang siap.'),
  @('DANA/OVO tidak tampil', 'Ini perilaku yang benar sampai backend mempunyai endpoint create e-Wallet.'),
  @('Status tetap pending', 'Periksa DOKU notification URL, signature verification, log backend, dan request_id.'),
  @('npm.ps1 diblokir', 'Gunakan npm.cmd run dev atau npm.cmd run build pada Windows.'),
  @('Port 3000 digunakan', 'Tentukan port lain melalui konfigurasi Nuxt/Nitro atau hentikan proses yang memakai port tersebut.'),
  @('Build gagal', 'Hapus hanya cache build yang aman bila diperlukan, instal ulang dependensi, lalu baca error pertama pada output build.')
) @(2800, 6300)
$content += Para '15. Checklist deployment production' 'Heading1'
$content += Bullet 'Set API base URL dan site URL production.'
$content += Bullet 'Pastikan HTTPS, CORS, callback, dan notification URL sesuai domain production.'
$content += Bullet 'Jangan masukkan credential DOKU/backend ke bundle frontend.'
$content += Bullet 'Jalankan npm run build dan pastikan selesai tanpa error.'
$content += Bullet 'Uji login, registrasi, pembayaran, polling, invoice, tiket, dan laporan organizer.'
$content += Bullet 'Pastikan e-Wallet tetap nonaktif sampai endpoint create payment tersedia dan lulus pengujian.'
$content += Bullet 'Ganti/nonaktifkan kredensial demo sebelum go-live.'
$content += Para '— Akhir dokumen —' 'Caption'

$documentXml = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body>' + ($content -join "`n") + '<w:sectPr><w:pgSz w:w="11906" w:h="16838"/><w:pgMar w:top="1134" w:right="1134" w:bottom="1134" w:left="1134"/><w:pgNumType w:start="1"/></w:sectPr></w:body></w:document>'
$stylesXml = @'
<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:styles xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:docDefaults><w:rPrDefault><w:rPr><w:rFonts w:ascii="Aptos" w:hAnsi="Aptos"/><w:sz w:val="21"/><w:color w:val="243447"/></w:rPr></w:rPrDefault><w:pPrDefault><w:pPr><w:spacing w:after="140" w:line="276" w:lineRule="auto"/></w:pPr></w:pPrDefault></w:docDefaults><w:style w:type="paragraph" w:default="1" w:styleId="Normal"><w:name w:val="Normal"/></w:style><w:style w:type="paragraph" w:styleId="Title"><w:name w:val="Title"/><w:pPr><w:jc w:val="center"/><w:spacing w:before="1800" w:after="300"/></w:pPr><w:rPr><w:b/><w:color w:val="0B2748"/><w:sz w:val="44"/></w:rPr></w:style><w:style w:type="paragraph" w:styleId="Subtitle"><w:name w:val="Subtitle"/><w:pPr><w:jc w:val="center"/><w:spacing w:after="240"/></w:pPr><w:rPr><w:color w:val="49657D"/><w:sz w:val="25"/></w:rPr></w:style><w:style w:type="paragraph" w:styleId="Heading1"><w:name w:val="heading 1"/><w:pPr><w:keepNext/><w:spacing w:before="360" w:after="180"/><w:outlineLvl w:val="0"/></w:pPr><w:rPr><w:b/><w:color w:val="0B5D75"/><w:sz w:val="30"/></w:rPr></w:style><w:style w:type="paragraph" w:styleId="Heading2"><w:name w:val="heading 2"/><w:pPr><w:keepNext/><w:spacing w:before="240" w:after="120"/><w:outlineLvl w:val="1"/></w:pPr><w:rPr><w:b/><w:color w:val="17365D"/><w:sz w:val="25"/></w:rPr></w:style><w:style w:type="paragraph" w:styleId="ListBullet"><w:name w:val="List Bullet"/><w:pPr><w:ind w:left="540" w:hanging="280"/></w:pPr><w:rPr/></w:style><w:style w:type="paragraph" w:styleId="Code"><w:name w:val="Code"/><w:pPr><w:shd w:fill="EEF2F5"/><w:ind w:left="240"/><w:spacing w:before="100" w:after="140"/></w:pPr><w:rPr><w:rFonts w:ascii="Consolas" w:hAnsi="Consolas"/><w:sz w:val="19"/></w:rPr></w:style><w:style w:type="paragraph" w:styleId="Warning"><w:name w:val="Warning"/><w:pPr><w:shd w:fill="FFF2CC"/><w:ind w:left="240" w:right="240"/><w:spacing w:before="140" w:after="180"/></w:pPr><w:rPr><w:b/><w:color w:val="7F6000"/></w:rPr></w:style><w:style w:type="paragraph" w:styleId="Caption"><w:name w:val="Caption"/><w:pPr><w:jc w:val="center"/></w:pPr><w:rPr><w:i/><w:color w:val="6B7280"/><w:sz w:val="18"/></w:rPr></w:style></w:styles>
'@
$files = @{
  '[Content_Types].xml' = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/><Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/><Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/><Override PartName="/docProps/app.xml" ContentType="application/vnd.openxmlformats-officedocument.extended-properties+xml"/></Types>'
  '_rels\.rels' = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/><Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/extended-properties" Target="docProps/app.xml"/></Relationships>'
  'word\document.xml' = $documentXml
  'word\styles.xml' = $stylesXml
  'word\_rels\document.xml.rels' = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"></Relationships>'
  'docProps\core.xml' = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"><dc:title>Panduan Fungsional Frontend IWBIF 2026</dc:title><dc:subject>Instalasi dan pengoperasian frontend</dc:subject><dc:creator>IWBIF 2026</dc:creator><dcterms:created xsi:type="dcterms:W3CDTF">2026-08-17T00:00:00Z</dcterms:created></cp:coreProperties>'
  'docProps\app.xml' = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Properties xmlns="http://schemas.openxmlformats.org/officeDocument/2006/extended-properties"><Application>Microsoft Office Word</Application><AppVersion>16.0000</AppVersion></Properties>'
}
$utf8 = New-Object System.Text.UTF8Encoding($false)
foreach ($item in $files.GetEnumerator()) { [System.IO.File]::WriteAllText((Join-Path $buildDir $item.Key), [string]$item.Value, $utf8) }
if (Test-Path -LiteralPath $output) { Remove-Item -LiteralPath $output -Force }
Add-Type -AssemblyName System.IO.Compression
Add-Type -AssemblyName System.IO.Compression.FileSystem
$archive = [System.IO.Compression.ZipFile]::Open($output, [System.IO.Compression.ZipArchiveMode]::Create)
try {
  foreach ($sourceFile in Get-ChildItem -LiteralPath $buildDir -Recurse -File) {
    $entryName = $sourceFile.FullName.Substring($buildDir.Length + 1).Replace('\', '/')
    [System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile($archive, $sourceFile.FullName, $entryName, [System.IO.Compression.CompressionLevel]::Optimal) | Out-Null
  }
} finally {
  $archive.Dispose()
}
Remove-Item -LiteralPath $buildDir -Recurse -Force
Write-Output $output
