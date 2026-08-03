export default defineNuxtConfig({
  modules: ['@pinia/nuxt', '@nuxtjs/tailwindcss'],
  nitro: {
    prerender: {
      concurrency: 1
    }
  },
  app: {
    head: {
      title: 'ASEAN AI Event Portal',
      link: [
        { rel: 'icon', type: 'image/png', href: '/favicon.png' },
        { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' }
      ],
      meta: [
        {
          name: 'description',
          content: 'Portal pendaftaran acara ASEAN AI for Education.'
        }
      ]
    }
  },
  css: ['~/assets/css/main.css'],
  runtimeConfig: {
    public: {
      apiBaseUrl: 'https://api-event.gagakrimang.web.id/api/v1',
      siteUrl: 'https://event.gagakrimang.web.id',
      appName: 'ASEAN AI for Education Summit',
      midtransClientKey: '',
      midtransSnapUrl: 'https://app.sandbox.midtrans.com/snap/snap.js'
    }
  },
  routeRules: {
    '/': { prerender: true },
    '/about': { prerender: true },
    '/workshops': { prerender: true },
    '/tickets': { prerender: true },
    '/partners': { prerender: true },
    '/faq': { prerender: true },
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
