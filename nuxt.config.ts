const localApiBaseUrl = 'http://127.0.0.1:8000/api/v1';
const productionApiBaseUrl = 'https://api-event.gagakrimang.web.id/api/v1';
const productionSiteUrl = 'https://event.gagakrimang.web.id';
const isGenerate = process.env.npm_lifecycle_event === 'generate' || process.argv.some((argument) => argument === 'generate');
const configuredApiBaseUrl = process.env.NUXT_PUBLIC_API_BASE_URL || localApiBaseUrl;
const apiBaseUrl = isGenerate && /^http:\/\/(?:127\.0\.0\.1|localhost)(?::\d+)?(?:\/|$)/i.test(configuredApiBaseUrl)
  ? productionApiBaseUrl
  : configuredApiBaseUrl;

export default defineNuxtConfig({
  experimental: {
    appManifest: !isGenerate
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
        { rel: 'icon', type: 'image/png', href: '/favicon.png' },
        { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' }
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
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || (isGenerate ? productionSiteUrl : 'http://localhost:3000'),
      appName: process.env.NUXT_PUBLIC_APP_NAME || 'IWBIF 2026'
    }
  },
  routeRules: {
    '/': { prerender: true },
    '/about': { prerender: true },
    '/workshops': { prerender: true },
    '/tickets': { prerender: true },
    '/partners': { prerender: true },
    '/business-matching': { prerender: true },
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
    '/speakers/**': isGenerate ? { prerender: true } : { swr: 3600 },
    '/program': isGenerate ? { prerender: true } : { swr: 600 },
    '/dashboard/**': { ssr: false },
    '/admin/**': { ssr: false }
  },
  compatibilityDate: '2026-08-01'
});
