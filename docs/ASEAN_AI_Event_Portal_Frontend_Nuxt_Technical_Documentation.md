# Technical Documentation — Frontend Nuxt 4
## ASEAN AI for Education Event Portal

**Version:** 1.0  
**Audience:** Frontend Engineering Team  
**Primary Stack:** Nuxt 4, Vue 3, TypeScript, Tailwind CSS, Pinia  
**Rendering:** Hybrid Rendering  
**Backend:** FastAPI REST API

---

# 1. Purpose

This document defines the frontend architecture and implementation standard for the ASEAN AI for Education Event Portal.

The frontend consists of three major areas:

1. Public event website
2. Participant portal
3. Administration portal

The frontend must provide:

- SEO-friendly public pages
- Mobile-responsive design
- Participant registration
- Midtrans payment user interface
- Participant profile management
- Digital QR ticket display
- Participant networking directory
- Event schedule
- Administrative management interface
- Secure communication with FastAPI

---

# 2. High-Level Architecture

```text
Browser
   |
   v
Nuxt 4 Application
   |
   | HTTPS / JSON REST API
   v
FastAPI Backend
   |
   v
PostgreSQL 18
```

Nuxt must not connect directly to PostgreSQL.

Recommended domains:

```text
https://event.example.com
https://api.event.example.com
```

---

# 3. Technology Stack

## Core

- Nuxt 4
- Vue 3
- TypeScript
- Vite
- Vue Router through Nuxt file routing
- Pinia
- Tailwind CSS

## Recommended Libraries

- Nuxt UI or Headless UI
- Zod
- VueUse
- dayjs
- qrcode.vue
- ApexCharts or Chart.js
- vue-i18n optional
- vee-validate optional
- vue-sonner or equivalent toast library

## Testing

- Vitest
- Vue Test Utils
- Playwright
- ESLint
- Prettier

---

# 4. Rendering Strategy

Use hybrid rendering.

## Public Pages

Recommended:

```text
prerender or SSR
```

Pages:

- Home
- About
- Speakers
- Program
- Workshops
- Tickets
- Partners
- FAQ
- Privacy Policy
- Terms and Conditions

## Participant Portal

Recommended:

```text
client-side rendering
```

Pages:

- Dashboard
- Profile
- Ticket
- QR code
- Participant directory
- Connections
- Payment
- Invoice
- Certificate

## Admin Portal

Recommended:

```text
client-side rendering
```

Pages:

- Admin dashboard
- Registrations
- Payments
- Check-in
- Speakers
- Sessions
- Reports
- Content management

Example:

```ts
export default defineNuxtConfig({
  routeRules: {
    '/': { prerender: true },
    '/about': { prerender: true },
    '/speakers/**': { swr: 3600 },
    '/program': { swr: 600 },
    '/dashboard/**': { ssr: false },
    '/admin/**': { ssr: false }
  }
})
```

---

# 5. Recommended Project Structure

```text
event-portal-frontend/
├── app/
│   ├── app.vue
│   ├── assets/
│   │   ├── css/
│   │   ├── images/
│   │   └── icons/
│   │
│   ├── components/
│   │   ├── common/
│   │   ├── layout/
│   │   ├── event/
│   │   ├── speakers/
│   │   ├── program/
│   │   ├── tickets/
│   │   ├── registration/
│   │   ├── payment/
│   │   ├── participant/
│   │   ├── networking/
│   │   ├── check-in/
│   │   └── admin/
│   │
│   ├── composables/
│   │   ├── useApi.ts
│   │   ├── useAuth.ts
│   │   ├── useEvent.ts
│   │   ├── useRegistration.ts
│   │   ├── usePayment.ts
│   │   ├── useParticipant.ts
│   │   ├── useTicket.ts
│   │   └── usePagination.ts
│   │
│   ├── layouts/
│   │   ├── default.vue
│   │   ├── auth.vue
│   │   ├── participant.vue
│   │   ├── admin.vue
│   │   └── check-in.vue
│   │
│   ├── middleware/
│   │   ├── auth.ts
│   │   ├── guest.ts
│   │   ├── participant.ts
│   │   ├── admin.ts
│   │   ├── role.ts
│   │   └── profile-complete.ts
│   │
│   ├── pages/
│   │   ├── index.vue
│   │   ├── about.vue
│   │   ├── program.vue
│   │   ├── speakers/
│   │   ├── workshops/
│   │   ├── tickets.vue
│   │   ├── partners.vue
│   │   ├── faq.vue
│   │   ├── auth/
│   │   ├── register/
│   │   ├── payment/
│   │   ├── dashboard/
│   │   ├── check-in/
│   │   └── admin/
│   │
│   ├── plugins/
│   │   ├── api.ts
│   │   ├── pinia.client.ts
│   │   └── midtrans.client.ts
│   │
│   ├── stores/
│   │   ├── auth.ts
│   │   ├── event.ts
│   │   ├── registration.ts
│   │   ├── payment.ts
│   │   ├── participant.ts
│   │   └── admin.ts
│   │
│   ├── types/
│   │   ├── api.ts
│   │   ├── auth.ts
│   │   ├── event.ts
│   │   ├── registration.ts
│   │   ├── payment.ts
│   │   └── participant.ts
│   │
│   └── utils/
│       ├── currency.ts
│       ├── date.ts
│       ├── validation.ts
│       └── permissions.ts
│
├── public/
├── tests/
├── nuxt.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── package.json
└── .env.example
```

---

# 6. Page Architecture

## 6.1 Public Pages

```text
/
├── about
├── program
├── speakers
├── speakers/[slug]
├── workshops
├── workshops/[slug]
├── tickets
├── partners
├── faq
├── privacy
├── terms
└── register
```

## 6.2 Authentication Pages

```text
/auth/login
/auth/register
/auth/verify-email
/auth/forgot-password
/auth/reset-password
```

## 6.3 Participant Pages

```text
/dashboard
/dashboard/profile
/dashboard/ticket
/dashboard/qr-code
/dashboard/directory
/dashboard/connections
/dashboard/schedule
/dashboard/payment
/dashboard/invoice
/dashboard/certificate
/dashboard/privacy
/dashboard/settings
```

## 6.4 Admin Pages

```text
/admin
/admin/registrations
/admin/participants
/admin/tickets
/admin/payments
/admin/check-ins
/admin/speakers
/admin/sessions
/admin/workshops
/admin/partners
/admin/reports
/admin/content
/admin/settings
```

---

# 7. Layouts

## default.vue

Used for public pages.

Contains:

- Header
- Main navigation
- Footer
- Registration CTA
- SEO metadata
- Cookie notice

## auth.vue

Used for login and account registration.

Contains:

- Minimal navigation
- Authentication card
- Event branding
- Security notice

## participant.vue

Used for participant dashboard.

Contains:

- Dashboard sidebar
- Mobile navigation
- User profile menu
- Event status
- Notification center

## admin.vue

Used for administration.

Contains:

- Admin sidebar
- Role-based menu
- Search
- Notification center
- Breadcrumbs
- User menu

## check-in.vue

Used for event staff scanning.

Contains:

- Camera scanner
- Manual search
- Result panel
- Recent check-ins
- Offline or network warning

---

# 8. Component Standards

Components must be grouped by business function.

Example:

```text
components/registration/
├── RegistrationStepper.vue
├── AccountStep.vue
├── ProfileStep.vue
├── ConsentStep.vue
├── TicketStep.vue
├── ReviewStep.vue
└── RegistrationSummary.vue
```

General rules:

- Components must be small and focused
- Pages coordinate data and components
- Reusable API logic belongs in composables
- Shared state belongs in Pinia stores
- Validation logic belongs in schemas or utilities
- Avoid calling backend APIs directly inside deeply nested presentation components

---

# 9. State Management

Use Pinia for shared client state.

Recommended stores:

## auth store

```text
current user
access token
roles
permissions
authentication state
```

## registration store

```text
registration draft
selected ticket
selected workshop track
profile form
consent state
registration status
```

## payment store

```text
order
payment status
snap token
payment polling state
```

## participant store

```text
participant profile
directory filters
connections
privacy settings
```

Do not persist refresh tokens in Pinia or localStorage.

---

# 10. API Client Standard

Create one centralized API client.

```ts
export function useApi() {
  const config = useRuntimeConfig()
  const authStore = useAuthStore()

  return $fetch.create({
    baseURL: config.public.apiBaseUrl,

    onRequest({ options }) {
      if (authStore.accessToken) {
        options.headers = {
          ...options.headers,
          Authorization: `Bearer ${authStore.accessToken}`
        }
      }
    },

    async onResponseError({ response }) {
      if (response.status === 401) {
        // refresh token flow
      }
    }
  })
}
```

Rules:

- API base URL comes from runtime config
- Access token is attached centrally
- 401 handling is centralized
- Error response is normalized
- Request ID from backend is preserved
- UI components must not duplicate HTTP handling logic

---

# 11. TypeScript API Types

Example response:

```ts
export interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
  meta?: ApiMeta | null
  request_id: string
}

export interface ApiError {
  field?: string
  code: string
  message: string
}
```

Registration:

```ts
export interface Registration {
  id: string
  registration_number: string
  status:
    | 'draft'
    | 'awaiting_payment'
    | 'payment_pending'
    | 'confirmed'
    | 'canceled'
    | 'expired'
    | 'refunded'
  ticket_type_id: string
  workshop_track_id?: string
}
```

---

# 12. Authentication Flow

Recommended:

```text
Login
-> FastAPI returns access token
-> FastAPI sets refresh token in HttpOnly cookie
-> Nuxt stores access token in memory
-> API client attaches bearer token
-> On 401, frontend calls refresh endpoint
-> Backend rotates refresh token
-> Frontend retries original request
```

Route middleware example:

```ts
export default defineNuxtRouteMiddleware(() => {
  const auth = useAuthStore()

  if (!auth.isAuthenticated) {
    return navigateTo('/auth/login')
  }
})
```

Admin middleware must also verify role or permission.

---

# 13. Registration Wizard

Recommended steps:

```text
1. Account
2. Participant Profile
3. Participant Directory Consent
4. Ticket Selection
5. Workshop Selection
6. Additional Information
7. Review
8. Payment
9. Confirmation
```

Implementation rules:

- Save progress locally only for non-sensitive fields
- Save registration draft to backend after account creation
- Validate each step before proceeding
- Backend remains source of truth
- Ticket price must always come from backend
- Show clear status for incomplete registration

Suggested URL structure:

```text
/register/account
/register/profile
/register/consent
/register/ticket
/register/workshop
/register/review
/register/payment
/register/success
```

---

# 14. Midtrans Frontend Integration

Use Midtrans Snap only on the client.

Plugin:

```ts
export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()

  useHead({
    script: [
      {
        src: config.public.midtransSnapUrl,
        'data-client-key': config.public.midtransClientKey
      }
    ]
  })
})
```

Payment flow:

```text
1. Frontend requests transaction from FastAPI
2. FastAPI returns Snap token
3. Frontend opens Snap
4. User completes payment
5. Frontend shows processing state
6. Frontend fetches payment status from FastAPI
7. FastAPI confirms status only after webhook validation
8. Frontend redirects to success page after confirmed status
```

Callbacks:

```ts
window.snap.pay(token, {
  onSuccess() {
    // Do not mark payment as paid locally
    refreshPaymentStatus()
  },
  onPending() {
    refreshPaymentStatus()
  },
  onError() {
    showPaymentError()
  },
  onClose() {
    showPaymentPendingNotice()
  }
})
```

---

# 15. QR Code Display

The backend returns a secure token or QR image endpoint.

Recommended frontend behavior:

- Display participant name
- Display registration number
- Display ticket type
- Display QR code
- Display check-in status
- Allow download as image
- Warn participant not to share QR code

Do not generate a QR code from a predictable registration ID.

---

# 16. Participant Directory

Features:

- Search
- Country filter
- Organization filter
- Skill filter
- AI interest filter
- Workshop track filter
- Collaboration interest filter
- Pagination
- Connection request
- Profile visibility enforcement

Card content:

```text
Profile photo
Full name
Country
Job title
Organization
Expertise tags
AI interest tags
Connection button
View profile button
```

Private contact information must never be displayed unless explicitly permitted by backend rules.

---

# 17. Admin Portal

## Dashboard

Widgets:

- Total registrations
- Confirmed registrations
- Pending payments
- Revenue
- Check-in count
- Registration conversion
- Participants by country
- Ticket distribution
- Workshop popularity

## Data Tables

All admin tables should support:

- Search
- Filters
- Sorting
- Pagination
- Column visibility
- CSV export
- Bulk actions where permitted
- Loading state
- Empty state
- Error state

## Permission Handling

Frontend may hide menu items based on permissions, but backend remains responsible for authorization.

---

# 18. SEO Standard

Public pages must define:

- Page title
- Description
- Canonical URL
- Open Graph title
- Open Graph description
- Open Graph image
- Twitter card metadata
- Structured data where useful

Example:

```ts
useSeoMeta({
  title: 'ASEAN AI for Education Summit 2026',
  description: 'A two-day international AI developer summit and workshop.',
  ogTitle: 'Build AI. Transform Education. Connect ASEAN.',
  ogDescription: 'Join AI developers and educators from across ASEAN.',
  ogImage: '/images/og-event.jpg'
})
```

---

# 19. Design System

Recommended visual direction:

```text
Primary:
Deep navy

Accent:
Electric blue
Violet
Cyan

Highlight:
Warm orange

Typography:
Space Grotesk or Sora for headings
Inter for body
JetBrains Mono for technical labels
```

UI principles:

- Mobile-first
- High contrast
- Accessible forms
- Clear CTA hierarchy
- Large touch targets
- Consistent spacing
- Clear loading states
- No hidden critical actions

---

# 20. Form Validation

Use shared schemas with Zod.

Example:

```ts
const profileSchema = z.object({
  full_name: z.string().min(2),
  country_code: z.string().length(3),
  job_title: z.string().min(2),
  biography: z.string().min(50).max(1000),
  linkedin_url: z.string().url().optional().or(z.literal(''))
})
```

Validation rules must match backend requirements.

Frontend validation improves UX but never replaces backend validation.

---

# 21. Error Handling

Normalize API errors.

UI must support:

- Inline field errors
- Page-level errors
- Toast notifications
- Retry button
- Network error message
- Session expired flow
- Payment pending notice
- Payment failed notice
- Unauthorized page
- Not found page

Display backend `request_id` in support-friendly error messages.

Example:

```text
Something went wrong.
Reference ID: 8a7c...
```

---

# 22. Accessibility

Minimum requirements:

- Semantic HTML
- Keyboard navigation
- Visible focus state
- Color contrast compliance
- ARIA labels where needed
- Accessible form labels
- Screen-reader-friendly error messages
- Alternative text for images
- Reduced motion support

Target:

```text
WCAG 2.1 AA
```

---

# 23. Performance

Recommended:

- Lazy-load non-critical components
- Optimize images
- Use Nuxt Image
- Minimize client bundle
- Avoid large global libraries
- Cache public API content
- Use pagination
- Use skeleton loading
- Preload critical fonts carefully
- Avoid unnecessary watchers

Public homepage should prioritize:

- Fast Largest Contentful Paint
- Stable layout
- Responsive images
- Minimal blocking JavaScript

---

# 24. Environment Configuration

Example `.env.example`:

```env
NUXT_PUBLIC_API_BASE_URL=http://localhost:8007/api/v1
NUXT_PUBLIC_SITE_URL=http://localhost:3000

NUXT_PUBLIC_MIDTRANS_CLIENT_KEY=
NUXT_PUBLIC_MIDTRANS_SNAP_URL=https://app.sandbox.midtrans.com/snap/snap.js

NUXT_PUBLIC_APP_NAME=ASEAN AI for Education Summit
```

Never expose:

```text
Midtrans server key
Database credentials
JWT secret
SMTP password
Storage secret key
```

Only public-safe values may use the `NUXT_PUBLIC_` prefix.

---

# 25. Testing Strategy

## Unit Tests

- Components
- Composables
- Pinia stores
- Validation utilities
- Currency and date formatting
- Permission helpers

## Integration Tests

- Registration wizard
- Login and refresh
- Profile editing
- Ticket display
- Directory filters
- Admin table filters

## End-to-End Tests

Use Playwright.

Critical flows:

```text
Register
-> Complete profile
-> Accept consent
-> Select ticket
-> Open Midtrans sandbox
-> Confirm payment result
-> View ticket
-> View QR code
```

Admin flow:

```text
Admin login
-> View registration
-> View payment
-> Scan QR
-> Verify check-in result
```

---

# 26. Code Quality Standards

Mandatory:

- TypeScript strict mode
- ESLint
- Prettier
- No `any` unless justified
- Reusable composables
- Typed API responses
- No hardcoded API URLs
- No secrets in repository
- Consistent naming
- Components under reasonable size
- Business state in stores or composables

Naming:

```text
Components: PascalCase
Composables: useSomething
Stores: useSomethingStore
Pages: lowercase file routing
Types: PascalCase
Constants: UPPER_SNAKE_CASE
```

---

# 27. Deployment

Nuxt SSR runs as Node.js service.

Example:

```bash
npm run build
node .output/server/index.mjs
```

Recommended:

```text
Nginx
  -> Nuxt Node service on 127.0.0.1:3000
```

Nginx example:

```nginx
server {
    server_name event.example.com;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;

        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Deployment checklist:

- Install dependencies
- Run lint
- Run tests
- Build application
- Restart Nuxt service
- Verify public pages
- Verify API connectivity
- Verify login
- Verify Midtrans Snap
- Verify dashboard
- Verify mobile layout
- Verify SEO metadata

---

# 28. Frontend Definition of Done

A frontend feature is complete when:

- UI follows design system
- Mobile and desktop layouts work
- Loading state exists
- Empty state exists
- Error state exists
- API types are defined
- Validation is implemented
- Accessibility is reviewed
- Permission behavior is reviewed
- Unit or integration tests exist
- No hardcoded secrets exist
- API errors are normalized
- Route protection is implemented where required
- Feature has been tested against staging backend
