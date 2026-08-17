<template>
  <main class="business-page">
    <section class="mx-auto max-w-7xl px-3 pb-14 pt-6 sm:px-6 sm:pt-12 lg:px-8">
      <div class="business-hero">
        <img src="/images/business-matching.png" alt="Women business leaders meeting and building international partnerships" class="business-hero__image">
        <div class="business-hero__shade" aria-hidden="true" />
        <div class="business-hero__content">
          <p class="text-xs font-semibold uppercase tracking-[.35em] text-[#f1d58f] sm:text-sm">Business Matching</p>
          <h1 class="mt-4 max-w-3xl text-4xl font-black leading-[1.02] text-white sm:text-5xl lg:text-7xl">Connect. Match.<br>Make Deals.</h1>
          <p class="mt-5 max-w-xl text-sm leading-7 text-white/80 sm:text-base lg:text-lg">A curated process connecting buyers, sellers, investors, distributors, suppliers, and strategic partners with relevant international opportunities.</p>
          <NuxtLink to="/register/delegate" class="business-hero__action">Join Business Matching <span aria-hidden="true">→</span></NuxtLink>
        </div>
        <div class="business-hero__label"><span>Jakarta</span><span class="h-1 w-1 rounded-full bg-[#d8ac59]" /><span>15–16 October 2026</span></div>
      </div>

      <div class="mt-16 text-center">
        <p class="text-xs font-semibold uppercase tracking-[.32em] text-[#d8ac59]">Six opportunity sectors</p>
        <h2 class="mx-auto mt-4 max-w-3xl text-3xl font-black text-white sm:text-4xl">Meet the right partners for your next move.</h2>
      </div>
      <div class="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <article v-for="(sector, index) in sectors" :key="sector" class="sector-card">
          <span class="sector-card__number">0{{ index + 1 }}</span>
          <h3 class="mt-8 text-xl font-bold text-white">{{ sector }}</h3>
          <p class="mt-3 text-sm leading-7 text-slate-400">Targeted discovery and meeting opportunities for delegates in this sector.</p>
        </article>
      </div>

      <section class="profile-callout">
        <div>
          <p class="text-xs font-semibold uppercase tracking-[.3em] text-[#d8ac59]">Get match-ready</p>
          <h2 class="mt-3 text-3xl font-black text-white sm:text-4xl">Prepare your business profile</h2>
          <p class="mt-4 max-w-3xl leading-7 text-slate-300">Confirmed delegates can add company information, products or services, business objectives, target markets, and preferred meeting categories from their dashboard.</p>
        </div>
        <NuxtLink to="/register/delegate" class="profile-callout__action">Register as a Delegate</NuxtLink>
      </section>
    </section>
  </main>
</template>

<script setup lang="ts">
useSeoMeta({ title: 'Business Matching | IWBIF 2026', description: 'Curated cross-border business matching for IWBIF 2026 delegates.' })
const sectors = ['Creative Economy', 'Healthcare & Wellness', 'Food & Beverage', 'Fashion & Style', 'Industrial Estate', 'Cross-sector Opportunities']
</script>

<style scoped>
.business-page {
  position: relative;
  background: radial-gradient(circle at 85% 12%, rgb(216 172 89 / 12%), transparent 25rem);
}
.business-hero {
  position: relative;
  min-height: clamp(35rem, 72vw, 47rem);
  overflow: hidden;
  border: 1px solid rgb(255 255 255 / 12%);
  border-radius: clamp(1.5rem, 4vw, 3rem);
  background: linear-gradient(180deg, rgba(3, 10, 25, 0.28), rgba(3, 10, 25, 0.76));
  box-shadow: 0 30px 80px rgb(0 0 0 / 38%), inset 0 1px rgba(255, 255, 255, 0.07);
}
.business-hero__image { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: 56% center; }
.business-hero__shade { position: absolute; inset: 0; background: linear-gradient(90deg, rgb(3 10 25 / 94%) 0%, rgb(3 10 25 / 72%) 35%, rgb(3 10 25 / 8%) 72%), linear-gradient(0deg, rgb(3 10 25 / 78%) 0%, transparent 42%); }
.business-hero__content { position: relative; z-index: 1; display: flex; min-height: inherit; max-width: 48rem; flex-direction: column; justify-content: center; padding: clamp(2rem, 7vw, 6rem); }
.business-hero__content h1 {
  background: linear-gradient(135deg, #fffaf0 0%, #f0d493 38%, #f7e4b1 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}
.business-hero__action, .profile-callout__action { display: inline-flex; align-items: center; justify-content: center; gap: .75rem; width: fit-content; border-radius: 999px; background: linear-gradient(135deg, #f0d493, #c7953e); padding: .9rem 1.4rem; color: #071225; font-weight: 800; transition: transform .2s ease, box-shadow .2s ease; }
.business-hero__action { margin-top: 2rem; }
.business-hero__action:hover, .profile-callout__action:hover { transform: translateY(-2px); box-shadow: 0 12px 30px rgb(216 172 89 / 25%); }
.business-hero__label { position: absolute; z-index: 1; right: clamp(1.5rem, 4vw, 3rem); bottom: clamp(1.5rem, 4vw, 3rem); display: flex; align-items: center; gap: .7rem; border: 1px solid rgba(216, 172, 89, 0.22); border-radius: 999px; background: rgba(3, 10, 25, 0.38); padding: .7rem 1rem; color: rgb(255 255 255 / 72%); font-size: .72rem; font-weight: 600; letter-spacing: .12em; text-transform: uppercase; backdrop-filter: blur(12px); }
.sector-card { position: relative; overflow: hidden; min-height: 13rem; border: 1px solid rgb(255 255 255 / 10%); border-radius: 1.5rem; background: linear-gradient(145deg, rgb(255 255 255 / 7%), rgb(255 255 255 / 2%)); padding: 1.5rem; transition: border-color .25s ease, transform .25s ease, background .25s ease; }
.sector-card:hover { transform: translateY(-4px); border-color: rgb(216 172 89 / 45%); background: linear-gradient(145deg, rgb(216 172 89 / 12%), rgb(255 255 255 / 2%)); }
.sector-card__number { color: #d8ac59; font-size: .72rem; font-weight: 800; letter-spacing: .2em; }
.profile-callout { display: flex; margin-top: 4rem; align-items: center; justify-content: space-between; gap: 2rem; border: 1px solid rgb(216 172 89 / 22%); border-radius: 2rem; background: linear-gradient(120deg, rgb(216 172 89 / 12%), rgb(255 255 255 / 4%)); padding: clamp(1.75rem, 5vw, 3.5rem); box-shadow: inset 0 1px rgba(255,255,255,0.06); }
@media (max-width: 767px) {
  .business-hero { min-height: 32rem; }
  .business-hero__image { object-position: 62% center; }
  .business-hero__shade { background: linear-gradient(0deg, rgb(3 10 25 / 96%) 0%, rgb(3 10 25 / 65%) 62%, rgb(3 10 25 / 15%) 100%); }
  .business-hero__content { justify-content: flex-end; padding-bottom: 5.25rem; }
  .business-hero__action, .profile-callout__action { width: 100%; }
  .business-hero__label { left: 1.25rem; right: auto; bottom: 1.25rem; }
  .profile-callout { align-items: flex-start; flex-direction: column; }
  .sector-card { min-height: 11rem; }
}
</style>
