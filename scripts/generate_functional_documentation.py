from datetime import date
from pathlib import Path
from xml.etree import ElementTree as ET
from zipfile import ZIP_DEFLATED, ZipFile

OUT = Path('docs/Panduan_Fungsional_Aplikasi_IWBIF_2026.docx')
W = 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'
R = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships'
ET.register_namespace('w', W)
ET.register_namespace('r', R)

def q(tag): return f'{{{W}}}{tag}'
def node(parent, tag, **attrs): return ET.SubElement(parent, q(tag), {q(k): str(v) for k, v in attrs.items()})

doc = ET.Element(q('document'))
body = node(doc, 'body')

def text(parent, value, bold=False, size=None, color=None):
    run = node(parent, 'r')
    props = node(run, 'rPr')
    if bold: node(props, 'b')
    if size: node(props, 'sz', val=size)
    if color: node(props, 'color', val=color)
    value_node = node(run, 't')
    if value.startswith(' ') or value.endswith(' '): value_node.set('{http://www.w3.org/XML/1998/namespace}space', 'preserve')
    value_node.text = value

def paragraph(value='', style=None, bold=False, size=None, color=None, bullet=False):
    p = node(body, 'p')
    ppr = node(p, 'pPr')
    if style: node(ppr, 'pStyle', val=style)
    if bullet:
        num = node(ppr, 'numPr'); node(num, 'ilvl', val='0'); node(num, 'numId', val='1')
    if value: text(p, value, bold=bold, size=size, color=color)
    return p

def heading(value, level=1): paragraph(value, f'Heading{level}')
def bullet(value): paragraph(value, bullet=True)
def page_break():
    p = node(body, 'p'); run = node(p, 'r'); node(run, 'br', type='page')

def table(headers, rows):
    tbl = node(body, 'tbl')
    props = node(tbl, 'tblPr'); node(props, 'tblW', w='0', type='auto'); borders = node(props, 'tblBorders')
    for edge in ('top', 'left', 'bottom', 'right', 'insideH', 'insideV'):
        node(borders, edge, val='single', sz='4', color='B7C9D6')
    grid = node(tbl, 'tblGrid')
    for _ in headers: node(grid, 'gridCol', w=str(9000 // len(headers)))
    for row_index, row in enumerate([headers, *rows]):
        tr = node(tbl, 'tr')
        for value in row:
            tc = node(tr, 'tc'); tcpr = node(tc, 'tcPr'); node(tcpr, 'tcW', w=str(9000 // len(headers)), type='dxa')
            p = node(tc, 'p'); text(p, str(value), bold=(row_index == 0))

def section(title, intro, features):
    heading(title, 2); paragraph(intro)
    for item in features: bullet(item)

paragraph('DOKUMENTASI FUNGSIONAL', bold=True, size=30, color='0B3A5B')
paragraph('Aplikasi IWBIF 2026', bold=True, size=42, color='112B46')
paragraph('International Women Business & Investment Forum 2026', size=22, color='4A6572')
paragraph(f'Versi dokumen: {date.today().strftime("%d %B %Y")}', size=18)
paragraph('Dokumen ini menjelaskan kemampuan fungsional aplikasi dari sudut pandang pengguna, organizer, dan administrator. Kontrak teknis rinci tetap mengacu pada API_REFERENCE.md dan dokumen integrasi payment.', size=18)
page_break()

heading('Daftar Isi', 1)
for item in [
    '1. Tujuan dan peran pengguna', '2. Fitur publik', '3. Akun dan autentikasi',
    '4. Pembelian, registrasi, dan pembayaran', '5. Dashboard peserta',
    '6. Networking dan business matching', '7. Panel organizer dan admin',
    '8. Absensi QR dan manual check-in', '9. Laporan pembayaran',
    '10. Notifikasi, keamanan, dan dokumen legal', '11. Ringkasan alur operasional'
]: paragraph(item)

heading('1. Tujuan dan Peran Pengguna', 1)
paragraph('Aplikasi IWBIF 2026 mendukung perjalanan peserta dari pencarian informasi acara, pembelian package, pembayaran, pengisian profil, registrasi, tiket QR, networking, hingga check-in kehadiran. Organizer dan admin memperoleh alat untuk mengelola konten, transaksi, peserta, dan operasional hari-H.')
table(['Peran', 'Akses utama'], [
    ['Pengunjung', 'Melihat informasi acara, agenda, speaker, ticket/package, partner, FAQ, dan kebijakan.'],
    ['Peserta', 'Belanja package, membayar, melengkapi profil/registrasi, mengakses tiket, invoice, agenda, direktori, dan notifikasi.'],
    ['Organizer', 'Mengelola event, konten, peserta, attendance, pembayaran, notifikasi, sertifikat, dan laporan sesuai hak akses event.'],
    ['Admin', 'Memiliki seluruh kemampuan organizer serta administrasi pengguna dan pengaturan lintas event.'],
])

heading('2. Fitur Publik', 1)
section('Informasi acara', 'Pengunjung dapat mengenal acara sebelum membuat akun.', [
    'Beranda menampilkan ringkasan IWBIF, ajakan pendaftaran, dan akses cepat ke fitur penting.',
    'Halaman About, Contact, FAQ, Terms, Privacy, Code of Conduct, Refund Policy, dan Directory Consent menyediakan informasi serta kebijakan resmi.',
    'Halaman Tickets dan Packages menampilkan paket yang tersedia, nominal, manfaat, dan ketersediaan.',
    'Program & Agenda menampilkan jadwal sesi, workshop, ruang, dan waktu acara.',
    'Halaman Speakers, Partners, Exhibition, dan Participants memperlihatkan ekosistem acara yang telah dipublikasikan.',
])

heading('3. Akun dan Autentikasi', 1)
section('Pendaftaran dan akses akun', 'Akses personal dimulai dari proses register dan login.', [
    'Pengguna dapat membuat akun, login, logout, meminta reset password, dan mengatur password baru.',
    'Email verifikasi dan notifikasi registrasi dapat dikirim melalui konfigurasi email organizer.',
    'Sesi menggunakan access token dan refresh token; aplikasi memperbarui token ketika diperlukan.',
    'Hak akses dashboard dan panel operasional disesuaikan dengan role participant, organizer, atau admin.',
    'Halaman Security memungkinkan pengguna mengganti password secara mandiri.',
])

heading('4. Pembelian, Registrasi, dan Pembayaran', 1)
section('Store dan cart', 'Pembelian package menggunakan alur store-first agar harga dan package selalu dihitung backend.', [
    'Peserta memilih produk Delegate, Exhibitor, atau additional product dari katalog event.',
    'Shopping Cart menampilkan item, kuantitas, total, dan tindakan menghapus item sebelum checkout.',
    'Checkout membuat order backend; frontend tidak menentukan harga akhir atau nominal pembayaran.',
    'Package delegate dipilih pada store. Form registrasi tidak lagi meminta pengguna memilih delegate package kedua kali.',
])
section('Pembayaran', 'Aplikasi mendukung jalur bank transfer manual dan online gateway sesuai konfigurasi deployment.', [
    'Halaman Payment memilih metode pembayaran dan menonaktifkan pembuatan pembayaran baru selama masih ada payment pending.',
    'Online payment dapat menggunakan DOKU atau Midtrans berdasarkan NUXT_PUBLIC_PAYMENT_PROVIDER.',
    'Halaman Payment Status melakukan pengecekan status backend; redirect gateway bukan bukti pembayaran final.',
    'Pembayaran dianggap final hanya jika backend menyatakan success setelah verifikasi notification gateway.',
    'Pembayaran manual dapat mengikuti instruksi transfer dan menunggu konfirmasi organizer.',
])
section('Registrasi dan invoice', 'Setelah order paid, peserta melengkapi data sesuai tipe pembeliannya.', [
    'Form Delegate mengumpulkan identitas, perusahaan, perjalanan, consent, dan dokumen yang dibutuhkan.',
    'Form Exhibitor mengumpulkan profil perusahaan dan data pameran.',
    'Backend menautkan order paid ke registration saat profil berhasil dibuat; frontend hanya mengirim data profil.',
    'Invoice tersedia setelah registration terhubung dengan order paid. Invoice menampilkan nomor order, peserta, package, status paid, dan total.',
    'Peserta dapat mengunduh invoice sebagai PDF dari halaman Invoice.',
])

heading('5. Dashboard Peserta', 1)
section('Akses mandiri peserta', 'Dashboard menyediakan titik masuk untuk seluruh aktivitas peserta.', [
    'My Ticket & QR Code: melihat event pass dan QR ticket untuk check-in.',
    'My Profile: memperbarui data profesional, expertise, minat, dan profil peserta.',
    'My Schedule: melihat agenda dan sesi yang relevan.',
    'Payment dan Invoice: melanjutkan transaksi serta melihat bukti pembayaran.',
    'Announcements dan Inbox: menerima informasi acara serta pembaruan status.',
    'Certificate: mengakses sertifikat jika sudah diterbitkan dan memenuhi aturan kehadiran.',
    'Directory Consent: mengatur persetujuan tampil di direktori peserta.',
])

heading('6. Networking dan Business Matching', 1)
section('Direktori dan komunikasi', 'Fitur networking membantu peserta menemukan calon mitra.', [
    'Participant Directory menyediakan daftar peserta yang menyetujui tampil di direktori.',
    'Filter dan pencarian membantu menemukan peserta berdasarkan profil bisnis dan minat.',
    'Business Matching mendukung discovery, permintaan meeting, accept/reject, jadwal, dan status meeting.',
    'Deal Room mendukung ruang tindak lanjut untuk peluang kerja sama.',
    'Inbox menggabungkan pesan dan notifikasi operasional termasuk pembaruan pembayaran yang relevan.',
])

heading('7. Panel Organizer dan Admin', 1)
section('Manajemen event dan konten', 'Organizer/admin mengelola data yang tampil di aplikasi.', [
    'Manage Packages: membuat, memperbarui, mengaktifkan, atau menonaktifkan delegate package.',
    'Manage Speakers: mengelola speaker, foto, informasi profesional, dan hubungan speaker dengan event.',
    'Program & Agenda: mengelola session, workshop track, ruangan, waktu, kapasitas, serta status publikasi.',
    'Announcements: membuat, mengubah, menerbitkan, atau mengarsipkan pengumuman.',
    'Certificates: menerbitkan dan mengelola sertifikat per peserta dan event.',
    'Email Notifications: mengatur template, preview, test-send, dan riwayat notifikasi event.',
    'Manage Users: admin/organizer mengelola akun participant dan organizer sesuai aturan role.',
])
section('Operasi pembayaran', 'Panel operasional menyediakan pemantauan dan tindak lanjut transaksi.', [
    'Payment Report menyajikan total transaksi, successful, revenue, pending amount, status, channel, package, daily revenue, serta transaksi terbaru.',
    'Filter laporan tersedia untuk event, periode, status, channel, dan package; hasil dapat diunduh sebagai CSV.',
    'Laporan DOKU dan Midtrans dipisahkan menurut provider agar referensi, channel, nominal, dan CSV tidak bercampur.',
    'Dalam mode Midtrans, organizer dapat melihat provider order ID dan provider transaction ID, serta menandai mismatch gateway/backend untuk ditinjau.',
    'Manual Payments memungkinkan organizer mengonfirmasi transfer manual dengan referensi transfer dan catatan.',
])

heading('8. Absensi QR dan Manual Check-in', 1)
paragraph('Halaman Attendance Scanner & Report tersedia untuk organizer/admin melalui menu Attendance scanner atau rute /admin/attendance.')
table(['Kemampuan', 'Perilaku fungsional'], [
    ['QR ticket scan', 'Membuka kamera perangkat, membaca QR tiket, mengirim token QR ke backend, dan menampilkan hasil check-in terakhir.'],
    ['Manual check-in', 'Organizer memasukkan nomor tiket TICKET-... lalu mengirim check-in dengan event, gate name, dan device identifier.'],
    ['Hasil terbaru', 'Menampilkan identitas registrant, nomor tiket, nomor registrasi, gate, waktu check-in, dan status.'],
    ['Attendance report', 'Memuat total peserta, checked in, pending, attendance rate, serta daftar registrant per event.'],
    ['Detail registrant', 'Membuka data roster satu registrant untuk pemeriksaan cepat.'],
    ['Export CSV', 'Mengunduh daftar attendance yang sedang ditampilkan untuk kebutuhan tim lapangan.'],
])
paragraph('Catatan operasional: nomor yang dimasukkan pada manual check-in harus nomor tiket, bukan nomor order. Tiket yang sudah check-in atau tidak valid akan ditolak backend dan ditampilkan sebagai pesan kesalahan.')

heading('9. Laporan Pembayaran', 1)
paragraph('Laporan pembayaran memisahkan provider untuk menjaga ketepatan data.')
table(['Provider', 'Endpoint laporan', 'Ketentuan tampilan'], [
    ['DOKU', '/admin/reports/payments', 'Menampilkan transaksi DOKU termasuk doku_snap_*. CSV memakai endpoint DOKU.'],
    ['Midtrans', '/admin/reports/payments/midtrans', 'Menampilkan referensi Midtrans. Channel memakai payment rail seperti QRIS, GOPAY, SHOPEEPAY, CREDIT_CARD, atau bank VA.'],
])
bullet('Nominal gross_amount Midtrans adalah nominal tagihan gateway yang sudah dicocokkan backend dengan order, bukan nilai settlement net setelah biaya provider.')
bullet('Keberhasilan final membutuhkan transaction_status=success dan order_status=paid; keberadaan redirect atau ID gateway saja tidak cukup.')

heading('10. Notifikasi, Keamanan, dan Legal', 1)
section('Notifikasi dan audit', 'Aplikasi menjaga pengguna tetap mendapat informasi status penting.', [
    'Inbox menampilkan pesan dan notifikasi, termasuk pemberitahuan payment status update untuk organizer.',
    'Organizer dapat menandai notifikasi sebagai sudah dibaca dan melakukan tindak lanjut manual bila dibutuhkan.',
    'Email notification dapat diatur per event, dengan preview, pengujian pengiriman, dan log riwayat.',
])
section('Privasi dan pengamanan', 'Fitur dibangun dengan pembatasan akses berbasis kepemilikan dan role.', [
    'Endpoint peserta memeriksa ownership; endpoint operasional membutuhkan role organizer/admin.',
    'QR check-in dan payment confirmation tidak mengandalkan status lokal browser sebagai sumber kebenaran.',
    'Directory Consent memastikan peserta dapat memilih apakah profilnya muncul pada direktori.',
    'Dokumen Privacy, Terms, Code of Conduct, dan Refund Policy tersedia sebagai rujukan pengguna.',
])

heading('11. Ringkasan Alur Operasional', 1)
table(['Tahap', 'Peserta', 'Organizer/Admin'], [
    ['Sebelum acara', 'Melihat informasi, membuat akun, membeli package, membayar, dan melengkapi profil.', 'Menyiapkan package, agenda, speaker, konten, email notification, serta memantau payment report.'],
    ['Setelah pembayaran', 'Mengecek status backend, menyelesaikan registration, melihat invoice dan QR ticket.', 'Memverifikasi kebutuhan manual, mengelola peserta dan komunikasi.'],
    ['Hari-H', 'Menunjukkan QR ticket atau menyebutkan nomor tiket.', 'Memindai QR atau melakukan manual check-in; memantau report attendance dan export CSV.'],
    ['Setelah acara', 'Mengakses sertifikat bila eligible dan melanjutkan networking.', 'Menerbitkan sertifikat, meninjau revenue/attendance, dan menindaklanjuti networking.'],
])

heading('Referensi Dokumen', 1)
for item in [
    'docs/API_REFERENCE.md',
    'docs/FRONTEND_IWBIF_REGISTRATION_FLOW.md',
    'docs/FRONTEND_STORE_PURCHASE_FLOW.md',
    'docs/FRONTEND_DOKU_PAYMENT_INTEGRATION.md',
    'docs/FRONTEND_MIDTRANS_PAYMENT_INTEGRATION.md',
    'docs/EMAIL_REGISTRATION_NOTIFICATIONS.md',
]: bullet(item)

sect = node(body, 'sectPr'); node(sect, 'pgSz', w='11906', h='16838'); node(sect, 'pgMar', top='1134', right='1134', bottom='1134', left='1134', header='708', footer='708', gutter='0')

styles = ET.Element(q('styles'))
normal = node(styles, 'style', type='paragraph', default='1', styleId='Normal'); node(normal, 'name', val='Normal'); rp = node(normal, 'rPr'); node(rp, 'rFonts', ascii='Aptos', hAnsi='Aptos'); node(rp, 'sz', val='22')
for level, size, color in [(1, '32', '0B3A5B'), (2, '27', '164E63')]:
    st = node(styles, 'style', type='paragraph', styleId=f'Heading{level}'); node(st, 'name', val=f'heading {level}'); node(st, 'basedOn', val='Normal'); pp = node(st, 'pPr'); node(pp, 'keepNext'); rr = node(st, 'rPr'); node(rr, 'b'); node(rr, 'sz', val=size); node(rr, 'color', val=color)
numbering = ET.Element(q('numbering'))
abstract = node(numbering, 'abstractNum', abstractNumId='0'); lvl = node(abstract, 'lvl', ilvl='0'); node(lvl, 'start', val='1'); node(lvl, 'numFmt', val='bullet'); node(lvl, 'lvlText', val='•'); node(lvl, 'lvlJc', val='left'); ppr = node(lvl, 'pPr'); node(ppr, 'tabs'); node(ppr, 'ind', left='720', hanging='360')
num = node(numbering, 'num', numId='1'); node(num, 'abstractNumId', val='0')

content_types = '''<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/><Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/><Override PartName="/word/numbering.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.numbering+xml"/></Types>'''
rels = '''<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>'''
doc_rels = '''<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/numbering" Target="numbering.xml"/></Relationships>'''
with ZipFile(OUT, 'w', ZIP_DEFLATED) as archive:
    archive.writestr('[Content_Types].xml', content_types)
    archive.writestr('_rels/.rels', rels)
    archive.writestr('word/document.xml', ET.tostring(doc, encoding='utf-8', xml_declaration=True))
    archive.writestr('word/styles.xml', ET.tostring(styles, encoding='utf-8', xml_declaration=True))
    archive.writestr('word/numbering.xml', ET.tostring(numbering, encoding='utf-8', xml_declaration=True))
    archive.writestr('word/_rels/document.xml.rels', doc_rels)
print(OUT.resolve())
