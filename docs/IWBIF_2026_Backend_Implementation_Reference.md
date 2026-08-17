# IWBIF 2026 — Backend Implementation Reference

> Source: IWBIF 2026 Final Google Forms Master Template  
> Target: Event Portal Backend (FastAPI + PostgreSQL)

## 1. Scope

Dokumen sumber mendefinisikan tiga form:

1. International Delegate Registration
2. Business Matching Profile — Confirmed Delegates Only
3. Exhibitor / SME Showcase Registration

Backend disarankan memisahkan domain registration, company, package, accommodation, business matching, documents, payment, dan exhibitor.

## 2. Recommended FastAPI Structure

```text
app/modules/
├── events/
├── participants/
├── companies/
├── registrations/
├── delegate_packages/
├── accommodation/
├── business_matching/
├── event_activities/
├── documents/
├── payments/
└── exhibitors/
```

Struktur internal tiap module:

```text
module/
├── models.py
├── schemas.py
├── routes.py
├── service.py
├── repository.py
└── enums.py
```

## 3. Common Fields

| Field | Type | Description |
|---|---|---|
| id | UUID | Primary key |
| event_id | UUID | Event reference |
| created_at | timestamptz | Audit |
| updated_at | timestamptz | Audit |
| created_by | UUID/null | Optional audit |
| updated_by | UUID/null | Optional audit |

Recommended registration lifecycle:

`DRAFT -> SUBMITTED -> UNDER_VERIFICATION -> VERIFIED -> PAYMENT_PENDING -> PAID -> CONFIRMED`

Alternative terminal states: `REJECTED`, `CANCELLED`.

Catatan: source hanya menyatakan confirmation dan payment instructions dikirim setelah verification. Detail status di atas adalah rekomendasi implementasi.

# 4. Form 1 — International Delegate Registration

## 4.1 Personal Information

| API Field | Type | Required | Values/Notes |
|---|---|---:|---|
| full_name | string | Yes | |
| job_title | string | Yes | |
| company_organization | string | Yes | |
| nationality | string | Yes | |
| title | enum/string | Yes | Mrs, Ms, Dr, Prof, Mr, Others |
| business_sector | enum/master | Yes | see below |
| country | enum/master | Yes | see below |

Business sectors:

- Agriculture
- Food & Beverage
- Fashion & Textile
- Beauty
- Healthcare
- Tourism
- Education
- Technology
- Manufacturing
- Creative Industry
- Trading
- Finance
- Professional Services
- Others

Countries in source:

- Malaysia
- China
- Indonesia
- Singapore
- Thailand
- Cambodia
- Vietnam
- Philippines
- Brunei
- Laos
- Myanmar
- Other

## 4.2 Contact

| API Field | Type | Required |
|---|---|---:|
| email | email/string | Yes |
| mobile_whatsapp | string | Yes |
| office_phone | string/null | No |
| company_website | URL/string/null | No |
| linkedin | URL/string/null | No |
| company_address | text | Yes |

## 4.3 Participation

`participation_categories` is required and multi-select:

- Delegate
- Speaker
- Buyer
- Investor
- Government
- Association
- Media
- Exhibitor
- Sponsor
- Other

Conditional source fields:

| Field | Source Required | Usage |
|---|---:|---|
| presentation_topic | No | If Speaker |
| products_interested | No | If Buyer |
| investment_interest | No | If Investor |

Jangan menjadikan ketiga field tersebut mandatory secara global karena source menandainya optional.

## 4.4 Delegate Package

Required single choice:

- Package A - USD500
- Package B - USD700
- Package C - USD370

Recommended master:

```text
delegate_packages
- id UUID
- event_id UUID
- code
- name
- currency
- amount
- is_active
```

Registration menyimpan `delegate_package_id`, sehingga harga tidak perlu di-hard-code di source code API.

## 4.5 Accommodation & Travel

| API Field | Type | Required |
|---|---|---:|
| room_preference | enum | Yes |
| preferred_roommate | string/null | No |
| arrival_date | date | Yes |
| departure_date | date | Yes |
| flight_number | string/null | No |
| airport | enum/string | Yes |
| need_airport_pickup | boolean | Yes |

Room preference: `Twin Sharing`, `Single Room (+Supplement)`.

Airport: `CGK`, `HLP`, `Other`.

Recommended validation: `departure_date >= arrival_date`.

## 4.6 Initial Business Matching Data

| API Field | Type | Required |
|---|---|---:|
| products_services | text | Yes |
| looking_for | array | Yes |
| preferred_countries | array | Yes |
| business_objectives | text | Yes |

Looking for:

- Buyer
- Distributor
- Importer
- Retailer
- Investor
- Technology Partner
- Joint Venture
- Government
- Others

Preferred countries:

- Indonesia
- Malaysia
- China
- Singapore
- Thailand
- Vietnam
- Cambodia
- Philippines
- Others

Data ini dapat menjadi initial profile untuk Business Matching Profile setelah delegate dikonfirmasi.

## 4.7 Event Activities

Required multi-select:

- Business Forum
- Business Matching
- Conference
- Exhibition
- Networking Dinner
- Governor Dinner
- Trade Expo Indonesia
- Bandung Tour

Recommended tables:

```text
event_activities
registration_activities
```

## 4.8 Special Requirements

| API Field | Type | Required |
|---|---|---:|
| dietary_restrictions | text/null | No |
| medical_condition | text/null | No |
| special_assistance | text/null | No |

Field ini dapat mengandung informasi pribadi sensitif sehingga akses backend perlu dibatasi berdasarkan role.

## 4.9 Documents

| Type | Required |
|---|---:|
| Passport Copy | Yes |
| Company Profile | No |
| Business Card | No |
| Company Logo | No |

Recommended generic document table:

```text
registration_documents
- id UUID
- registration_id UUID
- document_type
- original_filename
- storage_key
- mime_type
- file_size
- uploaded_at
```

Recommended document types:

`PASSPORT_COPY`, `COMPANY_PROFILE`, `BUSINESS_CARD`, `COMPANY_LOGO`, `PRODUCT_CATALOGUE`.

Binary file sebaiknya disimpan di controlled file/object storage, sedangkan PostgreSQL menyimpan metadata dan storage key/path.

## 4.10 Payment

| API Field | Type | Required |
|---|---|---:|
| preferred_payment_method | enum | Yes |
| need_official_invoice | boolean | Yes |
| tax_id | string/null | No |

Payment methods:

- Bank Transfer
- Credit Card
- Invoice
- Pay Later

Source menandai Tax ID optional meskipun keterangannya “if invoice required”. Jika backend hendak mewajibkannya saat invoice dipilih, rule tersebut perlu dikonfirmasi sebagai business rule.

Recommended transaction table:

```text
payments
- id UUID
- registration_id UUID
- package_id UUID
- amount
- currency
- payment_method
- payment_status
- gateway_reference
- paid_at
```

## 4.11 Declaration

Required declarations:

- I certify all information is accurate.
- I agree to Terms & Conditions.
- I agree my data may be used for event administration & business matching.

Recommended fields:

```text
information_accuracy_confirmed
terms_accepted
business_matching_data_consent
terms_version
terms_accepted_at
consent_version
consent_accepted_at
```

# 5. Form 2 — Business Matching Profile

## 5.1 Access Rule

Source explicitly says: **Confirmed Delegates Only**.

Recommended backend authorization:

```text
registration.status == CONFIRMED
```

## 5.2 Company Information

| API Field | Type | Required |
|---|---|---:|
| company_name | string | Yes |
| country | string | Yes |
| representative | string | Yes |
| email | email/string | Yes |
| phone | string | Yes |

Jika tersedia, prefill dari registration/company master agar data perusahaan tidak diduplikasi.

## 5.3 Business Profile

| API Field | Type | Required |
|---|---|---:|
| products | text | Yes |
| services | text | Yes |
| hs_code | string | Yes |
| production_capacity | text | Yes |
| certificates | text | Yes |
| markets_served | text | Yes |

## 5.4 Business Interest

Looking For:

- Buyer
- Distributor
- Retailer
- Investor
- OEM
- Joint Venture
- Technology Partner
- Government

Preferred Countries:

- Indonesia
- Malaysia
- China
- Singapore
- Thailand
- Vietnam
- Cambodia
- Philippines
- Others

## 5.5 Preferred Meeting Schedule

Source values:

- 15 Oct Morning
- 15 Oct Afternoon
- 16 Oct Morning
- 16 Oct Afternoon
- No Preference

Untuk portal reusable, jangan hard-code slot tersebut pada profile. Gunakan master:

```text
business_matching_slots
- id UUID
- event_id UUID
- slot_date
- start_time
- end_time
- label
- capacity
- is_active
```

Selection table:

```text
business_matching_profile_slots
- profile_id UUID
- slot_id UUID
```

## 5.6 Deal / Investment

| API Field | Type | Required |
|---|---|---:|
| estimated_deal_investment_value | string | Yes |
| additional_notes | text | Yes |

Source mendefinisikan estimated value sebagai Short Answer dan tidak menentukan currency/numeric format. Jangan mengubahnya menjadi monetary numeric field tanpa business rule tambahan.

## 5.7 Consent

Required:

`I agree my profile may be shared with selected business matching participants.`

Recommended:

```text
profile_sharing_consent
profile_sharing_consent_at
```

# 6. Form 3 — Exhibitor / SME Showcase Registration

## 6.1 Company

| API Field | Type | Required |
|---|---|---:|
| company_name | string | Yes |
| country | string | Yes |
| brand | string | Yes |
| contact_person | string | Yes |
| email | email/string | Yes |
| phone | string | Yes |

## 6.2 Exhibition

| API Field | Type | Required |
|---|---|---:|
| products_to_display | text | Yes |
| booth_size_requested | enum | Yes |
| electricity_requirement | text | Yes |
| special_requirement | text | Yes |
| product_catalogue | file | Yes |

Booth options:

- Standard Booth 3x3
- Premium Booth
- Custom Booth

## 6.3 Consent

Required:

`I agree to the exhibition terms and conditions.`

Recommended audit fields:

```text
exhibition_terms_accepted
exhibition_terms_version
exhibition_terms_accepted_at
```

# 7. Recommended Relational Model

> Implementation status (16 August 2026): model inti di bawah telah
> diimplementasikan. `companies`, `registration_participation_categories`,
> `registration_activities`, `accommodation_travel`, dan
> `business_matching_profile_slots` sudah berupa tabel relasional. Field JSON
> lama tetap dipertahankan sementara untuk kompatibilitas API dan data lama.

```text
events
├── delegate_packages
├── event_activities
├── business_matching_slots
├── registrations
│   ├── registration_participation_categories
│   ├── registration_activities
│   ├── registration_documents
│   ├── accommodation_travel
│   ├── payments
│   └── business_matching_profiles
│       ├── business_matching_profile_interests
│       ├── business_matching_profile_countries
│       └── business_matching_profile_slots
└── exhibitor_registrations
    └── registration_documents
```

Recommended additional master: `companies`, sehingga delegate, business matching profile, dan exhibitor dapat mengacu ke organisasi yang sama.

Implementasi menggunakan satu company canonical per participant. Alur ownership:

```text
authenticated user -> participant -> company
                              |-> registration -> delegate detail
                              |                -> accommodation/travel
                              |                -> activities/categories/documents
                              |                -> business matching profile/slots
                              |-> exhibitor registration -> product catalogue
```

Frontend tidak menentukan ownership. `participant_id` pada payload registrasi
dan exhibitor bersifat opsional hanya untuk backward compatibility. Backend
selalu menyelesaikan participant dari access token, membuat participant profile
otomatis jika belum ada, dan menolak ID milik user lain.

# 8. Recommended API Endpoints

## Delegate

```http
POST  /api/v1/events/{event_id}/registrations
GET   /api/v1/events/{event_id}/registrations/{registration_id}
PATCH /api/v1/events/{event_id}/registrations/{registration_id}
POST  /api/v1/events/{event_id}/registrations/{registration_id}/submit
```

## Documents

```http
POST   /api/v1/registrations/{registration_id}/documents
GET    /api/v1/registrations/{registration_id}/documents
DELETE /api/v1/registrations/{registration_id}/documents/{document_id}
```

## Administration

```http
GET  /api/v1/admin/events/{event_id}/registrations
POST /api/v1/admin/registrations/{registration_id}/verify
POST /api/v1/admin/registrations/{registration_id}/confirm
POST /api/v1/admin/registrations/{registration_id}/reject
```

## Business Matching Profile

```http
POST  /api/v1/registrations/{registration_id}/business-matching-profile
GET   /api/v1/registrations/{registration_id}/business-matching-profile
PATCH /api/v1/registrations/{registration_id}/business-matching-profile
```

## Exhibitor

```http
POST  /api/v1/events/{event_id}/exhibitors
GET   /api/v1/events/{event_id}/exhibitors/{exhibitor_id}
PUT   /api/v1/events/{event_id}/exhibitors/{exhibitor_id}
```

## Master Data

```http
GET /api/v1/events/{event_id}/delegate-packages
GET /api/v1/events/{event_id}/activities
GET /api/v1/events/{event_id}/business-matching-slots
GET /api/v1/master/business-sectors
GET /api/v1/master/countries
```

# 9. Minimum Backend Validation

1. Semua field `Required: Yes` dari source harus divalidasi.
2. Email menggunakan email validation.
3. Checkbox menerima multiple values.
4. Dropdown/multiple choice hanya menerima allowed values.
5. Passport Copy mandatory untuk international delegate.
6. Product Catalogue mandatory untuk exhibitor.
7. Business Matching Profile hanya tersedia bagi confirmed delegates.
8. Required declarations/consents harus bernilai accepted.
9. Arrival Date dan Departure Date mandatory.
10. Delegate Package mandatory.
11. Upload perlu MIME-type, extension, maximum-size, dan filename sanitization.
12. API tidak boleh mempercayai package amount dari frontend; amount diambil dari package master di backend.

# 10. Important Implementation Notes

## Source Requirement vs Backend Recommendation

Dokumen ini mempertahankan field, required status, dan option yang terdapat pada form sumber. Bagian seperti normalized relational tables, UUID, status lifecycle, dedicated upload endpoint, master package, dan dynamic meeting slots merupakan rekomendasi arsitektur backend agar portal dapat digunakan ulang dan dipelihara dengan baik.

Rekomendasi normalisasi tersebut kini aktif melalui migrasi
`202608160016`, sedangkan batas satu exhibitor per user/event aktif melalui
`202608160017`.

## Business Matching Integration

Form 1 mengumpulkan business matching secara ringkas. Form 2 mengumpulkan profile lebih detail setelah delegate confirmed. Karena itu backend sebaiknya tidak membuat dua identitas bisnis yang terpisah. Gunakan registration/company sebagai parent dan Business Matching Profile sebagai extension.

## Payment Gateway

`Preferred Payment Method` adalah pilihan peserta, sedangkan status pembayaran aktual harus berasal dari payment transaction/payment gateway. Jangan menganggap pilihan `Credit Card`, `Bank Transfer`, atau metode lain sebagai bukti bahwa pembayaran telah berhasil.

Gateway yang digunakan adalah **DOKU Checkout Non-SNAP**. Frontend hanya
meminta pembuatan Checkout kepada backend dan menerima `payment_url`; Client ID,
Secret Key, request signature, dan notification verification sepenuhnya menjadi
tanggung jawab backend. HTTP Notification DOKU adalah source of truth status
pembayaran. Callback browser hanya untuk navigasi dan tidak boleh langsung
menandai transaksi berhasil.

DOKU Checkout mensyaratkan nominal IDR tanpa desimal. Karena harga sumber paket
IWBIF masih USD, nominal charge IDR Package A/B/C harus ditetapkan sebagai data
master bisnis. Frontend dilarang melakukan konversi kurs atau mengirim nominal.

Lihat `FRONTEND_DOKU_PAYMENT_INTEGRATION.md` untuk kontrak frontend.

## Data Security

Passport dan data special requirements membutuhkan authorization ketat. File tidak sebaiknya memiliki public URL permanen. Gunakan protected download atau signed/temporary URL bila storage mendukungnya.
