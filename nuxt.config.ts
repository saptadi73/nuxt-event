export default defineNuxtConfig({
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
      apiBaseUrl: 'http://127.0.0.1:8000/api/v1',
      siteUrl: 'https://event.gagakrimang.web.id',
      appName: 'IWBIF 2026'
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
    '/speakers/**': { swr: 3600 },
    '/program': { swr: 600 },
    '/dashboard/**': { ssr: false },
    '/admin/**': { ssr: false }
  },
  compatibilityDate: '2026-08-01'
});
