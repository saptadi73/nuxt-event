const productionApiBaseUrl = 'https://api.iwbif.id';
const productionSiteUrl = 'https://iwbif.id';
const isDevelopmentRuntime = process.env.npm_lifecycle_event === 'dev';
// Production values are the unconditional fallback. Local development must opt
// in through .env while running the explicit `npm run dev` script.
const apiBaseUrl = isDevelopmentRuntime
  ? process.env.NUXT_PUBLIC_API_BASE_URL || productionApiBaseUrl
  : productionApiBaseUrl;
const siteUrl = isDevelopmentRuntime
  ? process.env.NUXT_PUBLIC_SITE_URL || productionSiteUrl
  : productionSiteUrl;
const apiBasePath = process.env.NUXT_PUBLIC_API_BASE_PATH || '/api/v1';

export default defineNuxtConfig({
  experimental: {
    appManifest: isDevelopmentRuntime
  },
  modules: ['@pinia/nuxt', '@nuxtjs/tailwindcss'],
  nitro: {
    prerender: {
      concurrency: 1
    }
  },
  app: {
    head: {
      title: 'IWBIF 2026',
      link: [
        { rel: 'icon', type: 'image/png', href: '/logo_iwbif2.png' },
        { rel: 'apple-touch-icon', href: '/logo_iwbif2.png' }
      ],
      meta: [
        {
          name: 'description',
          content: 'International Women Business & Investment Forum 2026.'
        }
      ]
    }
  },
  css: ['~/assets/css/main.css'],
  runtimeConfig: {
    public: {
      backendOrigin: apiBaseUrl,
      apiBasePath,
      eventSlug: process.env.NUXT_PUBLIC_EVENT_SLUG || 'iwbif-2026',
      canonicalSiteUrl: siteUrl,
      appName: process.env.NUXT_PUBLIC_APP_NAME || 'IWBIF 2026',
      paymentProvider: (process.env.NUXT_PUBLIC_PAYMENT_PROVIDER || 'doku').toLowerCase()
    }
  },
  routeRules: {
    '/': { prerender: true },
    '/about': { prerender: true },
    '/workshops': { prerender: true },
    '/tickets': { prerender: true },
    '/partners': { prerender: true },
    '/business-matching': { ssr: false },
    '/deal-room': { prerender: true },
    '/participants': { prerender: true },
    '/exhibition': { prerender: true },
    '/faq': { prerender: true },
    '/contact': { prerender: true },
    '/privacy': { prerender: true },
    '/terms': { prerender: true },
    '/code-of-conduct': { prerender: true },
    '/refund-policy': { prerender: true },
    '/directory-consent': { prerender: true },
    '/speakers/**': { ssr: false },
    '/program': { ssr: false },
    '/dashboard/**': { ssr: false },
    '/admin/**': { ssr: false }
  },
  compatibilityDate: '2026-08-01'
});
