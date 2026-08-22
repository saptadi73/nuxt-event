const localApiBaseUrl = 'http://127.0.0.1:8000/api/v1';
const productionApiBaseUrl = 'https://api.iwbif.id/api/v1';
const productionSiteUrl = 'https://iwbif.id';
const productionCommands = new Set(['build', 'generate']);
const isProductionBuild = productionCommands.has(process.env.npm_lifecycle_event || '')
  || process.argv.some((argument) => productionCommands.has(argument));
const configuredApiBaseUrl = process.env.NUXT_PUBLIC_API_BASE_URL || localApiBaseUrl;
const configuredSiteUrl = process.env.NUXT_PUBLIC_SITE_URL || 'http://localhost:3000';
const apiBaseUrl = isProductionBuild ? productionApiBaseUrl : configuredApiBaseUrl;
const siteUrl = isProductionBuild ? productionSiteUrl : configuredSiteUrl;

export default defineNuxtConfig({
  experimental: {
    appManifest: !isProductionBuild
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
      apiBaseUrl,
      eventSlug: process.env.NUXT_PUBLIC_EVENT_SLUG || 'iwbif-2026',
      siteUrl,
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
