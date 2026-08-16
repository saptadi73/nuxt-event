<template>
  <main class="exhibition-page">
    <section class="mx-auto max-w-7xl px-4 pb-14 pt-8 sm:px-6 sm:pt-12 lg:px-8">
      <div class="exhibition-hero">
        <img src="/images/iwbif-exhibition.png" alt="IWBIF exhibition showcasing women-led businesses and Indonesian products" class="exhibition-hero__image">
        <div class="exhibition-hero__overlay" aria-hidden="true" />
        <div class="exhibition-hero__content">
          <p class="text-xs font-semibold uppercase tracking-[.35em] text-[#f1d58f] sm:text-sm">IWBIF Exhibition</p>
          <h1 class="mt-4 max-w-4xl text-4xl font-black leading-[1.03] text-white sm:text-5xl lg:text-7xl">Where women-led brands meet the world.</h1>
          <p class="mt-5 max-w-2xl text-sm leading-7 text-white/80 sm:text-base lg:text-lg">Showcase products, services, MSMEs, innovation, digital businesses, and investment opportunities to an international business audience.</p>
          <NuxtLink to="/register" class="hero-action">Become an Exhibitor <span aria-hidden="true">→</span></NuxtLink>
        </div>
        <div class="hero-note"><span>Showcase</span><i /><span>Connect</span><i /><span>Grow</span></div>
      </div>

      <div class="mt-16 grid items-end gap-6 md:grid-cols-[1fr_auto]">
        <div>
          <p class="text-xs font-semibold uppercase tracking-[.32em] text-[#d8ac59]">Exhibition categories</p>
          <h2 class="mt-4 max-w-3xl text-3xl font-black text-white sm:text-4xl">A curated showcase of enterprise and innovation.</h2>
        </div>
        <p class="max-w-md text-sm leading-7 text-slate-400">Discover businesses ready to build visibility, partnerships, market access, and meaningful investment relationships.</p>
      </div>

      <div class="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <article v-for="(item, index) in categories" :key="item" class="category-card">
          <span class="category-card__number">0{{ index + 1 }}</span>
          <h3 class="mt-8 text-xl font-bold text-white">{{ item }}</h3>
          <div class="category-card__line" />
        </article>
      </div>

      <section class="exhibitor-callout">
        <div>
          <p class="text-xs font-semibold uppercase tracking-[.3em] text-[#d8ac59]">Present your business</p>
          <h2 class="mt-3 text-3xl font-black text-white sm:text-4xl">Become an exhibitor</h2>
          <p class="mt-4 max-w-3xl leading-7 text-slate-300">Create a complete exhibitor profile with your company, industry, products, booth information, website, and product media.</p>
        </div>
        <NuxtLink to="/register" class="callout-action">Register Your Interest</NuxtLink>
      </section>
    </section>
  </main>
</template>

<script setup lang="ts">
useSeoMeta({ title: 'Exhibition | IWBIF 2026', description: 'Showcase women-led products, services, innovation, and investment opportunities.' })
const categories = ['Products', 'Services', 'MSMEs', 'Innovation', 'Digital Businesses', 'Investment Opportunities']
</script>

<style scoped>
.exhibition-page { background: radial-gradient(circle at 12% 16%, rgb(216 172 89 / 10%), transparent 28rem); }
.exhibition-hero { position: relative; min-height: clamp(38rem, 72vw, 48rem); overflow: hidden; border: 1px solid rgb(255 255 255 / 12%); border-radius: clamp(1.5rem, 4vw, 3rem); box-shadow: 0 30px 80px rgb(0 0 0 / 40%); }
.exhibition-hero__image { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: center; }
.exhibition-hero__overlay { position: absolute; inset: 0; background: linear-gradient(90deg, rgb(3 10 25 / 92%) 0%, rgb(3 10 25 / 66%) 38%, transparent 72%), linear-gradient(0deg, rgb(3 10 25 / 82%), transparent 48%); }
.exhibition-hero__content { position: relative; z-index: 1; display: flex; min-height: inherit; max-width: 55rem; flex-direction: column; justify-content: center; padding: clamp(2rem, 7vw, 6rem); }
.hero-action, .callout-action { display: inline-flex; align-items: center; justify-content: center; gap: .75rem; width: fit-content; border-radius: 999px; background: linear-gradient(135deg, #f0d493, #c7953e); padding: .9rem 1.4rem; color: #071225; font-weight: 800; transition: transform .2s ease, box-shadow .2s ease; }
.hero-action { margin-top: 2rem; }
.hero-action:hover, .callout-action:hover { transform: translateY(-2px); box-shadow: 0 12px 30px rgb(216 172 89 / 28%); }
.hero-note { position: absolute; z-index: 1; right: clamp(1.5rem, 4vw, 3rem); bottom: clamp(1.5rem, 4vw, 3rem); display: flex; align-items: center; gap: .65rem; color: rgb(255 255 255 / 72%); font-size: .7rem; font-weight: 700; letter-spacing: .15em; text-transform: uppercase; }
.hero-note i { width: .25rem; height: .25rem; border-radius: 999px; background: #d8ac59; }
.category-card { min-height: 11rem; overflow: hidden; border: 1px solid rgb(255 255 255 / 10%); border-radius: 1.5rem; background: linear-gradient(145deg, rgb(255 255 255 / 7%), rgb(255 255 255 / 2%)); padding: 1.5rem; transition: transform .25s ease, border-color .25s ease, background .25s ease; }
.category-card:hover { transform: translateY(-4px); border-color: rgb(216 172 89 / 45%); background: linear-gradient(145deg, rgb(216 172 89 / 12%), rgb(255 255 255 / 2%)); }
.category-card__number { color: #d8ac59; font-size: .72rem; font-weight: 800; letter-spacing: .2em; }
.category-card__line { width: 2rem; height: 1px; margin-top: 1.5rem; background: linear-gradient(90deg, #d8ac59, transparent); transition: width .25s ease; }
.category-card:hover .category-card__line { width: 5rem; }
.exhibitor-callout { display: flex; margin-top: 4rem; align-items: center; justify-content: space-between; gap: 2rem; border: 1px solid rgb(216 172 89 / 22%); border-radius: 2rem; background: linear-gradient(120deg, rgb(216 172 89 / 10%), rgb(255 255 255 / 4%)); padding: clamp(1.75rem, 5vw, 3.5rem); }
@media (max-width: 767px) {
  .exhibition-hero__image { object-position: 57% center; }
  .exhibition-hero__overlay { background: linear-gradient(0deg, rgb(3 10 25 / 96%) 0%, rgb(3 10 25 / 66%) 64%, rgb(3 10 25 / 12%) 100%); }
  .exhibition-hero__content { justify-content: flex-end; padding-bottom: 6.5rem; }
  .hero-note { left: 2rem; right: auto; }
  .exhibitor-callout { align-items: flex-start; flex-direction: column; }
}
</style>
