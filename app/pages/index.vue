<template>
  <div>
    <section class="hero-stage" aria-labelledby="hero-title">
      <h1 id="hero-title" class="sr-only">International Women Business and Investment Forum 2026 Jakarta</h1>
      <div class="hero-halo hero-halo-left" />
      <div class="hero-halo hero-halo-right" />

      <div class="hero-frame">
        <img
          src="/images/iwbif-2026-hero-01.png"
          alt="IWBIF 2026 Jakarta featuring women business leaders, international collaboration, business matching, and investment opportunities"
          class="hero-image"
          width="1829"
          height="860"
          loading="eager"
          fetchpriority="high"
        />
        <div class="hero-vignette" />
      </div>

      <nav class="hero-action-dock" aria-label="Main event action">
        <div class="hero-action-status"><span class="hero-live-dot" aria-hidden="true" />Registration is now open</div>
        <div class="hero-action-links">
          <NuxtLink :to="homeCtaTo" class="hero-button hero-button-primary hero-button-primary-large">{{ homeCtaLabel }} <span aria-hidden="true">→</span></NuxtLink>
        </div>
      </nav>
    </section>

    <section class="home-section mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      <div class="grid gap-px overflow-hidden rounded-[2rem] border border-white/10 bg-white/10 sm:grid-cols-3">
        <article v-for="(stat, index) in featuredStats" :key="stat.label" class="featured-stat-card p-6 sm:p-7">
          <strong class="text-3xl text-[#d8ac59] sm:text-4xl">{{ displayedStats[index] }}{{ stat.suffix }}</strong>
          <p class="mt-2 text-sm leading-6 text-slate-300">{{ stat.label }}</p>
        </article>
      </div>
    </section>

    <section class="home-section mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-16">
      <div class="glass-card rounded-[2rem] border border-white/10 bg-slate-950/35 p-8">
        <p class="text-xs uppercase tracking-[.35em] text-[#d8ac59]">International Presence</p>
        <h2 class="premium-title mt-3">Trusted global ecosystem of <span class="title-highlight">women-led business.</span></h2>
        <p class="mt-4 max-w-3xl text-lg leading-8 text-slate-300">IWBIF is positioned as a meeting ground for women entrepreneurs, investors, chambers, and ecosystem leaders to build credible, investable international partnerships.</p>
        <div class="mt-6 grid gap-3 sm:grid-cols-3">
          <p v-for="network in globalNetworks" :key="network" class="rounded-full border border-white/15 px-4 py-2 text-sm">{{ network }}</p>
        </div>
      </div>
    </section>

    <section class="home-section why-indonesia-section mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-20">
      <div class="why-heading">
        <div>
          <p class="text-xs font-bold uppercase tracking-[.35em] text-[#d8ac59]">Why Indonesia</p>
          <h2 class="premium-title mt-4 max-w-3xl leading-tight text-[#f8f6f1]">Where opportunity, connectivity, and <span class="title-highlight">culture converge.</span></h2>
        </div>
        <span class="why-coordinate" aria-hidden="true">06°12′S · 106°49′E</span>
      </div>

      <figure class="why-visual">
        <div class="why-image-wrap">
          <img src="/images/why-indonesia.png" alt="Indonesia's modern infrastructure, manufacturing, cultural heritage, natural destinations, and global trade connections" class="why-image" width="1672" height="941" loading="lazy">
          <div class="why-image-overlay" aria-hidden="true" />
          <span class="why-visual-label">Indonesia · Gateway to ASEAN &amp; Asia</span>
        </div>

        <figcaption class="why-content-card">
          <p class="why-card-kicker">A strategic home for growth</p>
          <h3 class="mt-3 text-2xl font-black text-[#f8f6f1] sm:text-3xl">Scale meets global possibility.</h3>
          <p class="mt-4 leading-7 text-[#cbd2dc]">A G20 economy with more than 283 million people, Indonesia connects ambitious businesses to ASEAN, Asia, trusted partners, and new investment pathways.</p>
          <div class="why-proof-grid">
            <span><strong>283M+</strong> Domestic market</span>
            <span><strong>G20</strong> Global convening power</span>
            <span><strong>ASEAN</strong> Regional gateway</span>
          </div>
          <NuxtLink to="/about" class="why-link">Discover why Indonesia <span aria-hidden="true">→</span></NuxtLink>
        </figcaption>
      </figure>
    </section>

    <section class="home-section mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div class="grid gap-6 lg:grid-cols-2">
        <article class="glass-card rounded-[2rem] p-8">
          <p class="text-xs uppercase tracking-[.35em] text-[#d8ac59]">Event Experience</p>
          <h3 class="mt-3 text-3xl font-black">Deal-Ready Agenda Structure</h3>
          <div class="mt-6 grid gap-3 sm:grid-cols-2">
            <p v-for="item in experiences" :key="item" class="rounded-2xl border border-white/10 px-4 py-3 text-sm">{{ item }}</p>
          </div>
        </article>

        <article class="glass-card rounded-[2rem] p-8">
          <p class="text-xs uppercase tracking-[.35em] text-[#d8ac59]">Program Snapshot</p>
          <h3 class="mt-3 text-3xl font-black">Four days, business outcomes first</h3>
          <div class="mt-6 space-y-4">
            <NuxtLink to="/program" class="block rounded-xl border border-white/15 px-4 py-3 transition hover:border-[#d8ac59]/60 hover:text-[#e6c477]">Explore full 4-day program</NuxtLink>
            <NuxtLink to="/business-matching" class="block rounded-xl border border-white/15 px-4 py-3 transition hover:border-[#d8ac59]/60 hover:text-[#e6c477]">Review matching windows and industries</NuxtLink>
            <NuxtLink to="/deal-room" class="block rounded-xl border border-white/15 px-4 py-3 transition hover:border-[#d8ac59]/60 hover:text-[#e6c477]">See Deal Room flow</NuxtLink>
          </div>
        </article>
      </div>
    </section>

    <section class="home-section mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <div class="rounded-[2.5rem] border border-[#d8ac59]/20 bg-[#d8ac59]/10 p-8 text-center sm:p-12">
        <p class="text-sm uppercase tracking-[.35em] text-[#f8f6f1]">IWBIF 2026</p>
        <h2 class="mt-4 text-4xl font-black">Connect. Match. Make Deals.</h2>
        <p class="mx-auto mt-4 max-w-2xl text-slate-300">Explore new markets, investment opportunities, partnerships, and cross-border collaboration from one place.</p>
        <div class="mt-7 flex flex-wrap justify-center gap-3">
          <NuxtLink :to="homeCtaTo" class="rounded-full bg-[#e6c477] px-6 py-3 text-lg font-semibold text-[#04152d] sm:text-xl">{{ homeCtaLabel }}</NuxtLink>
          <NuxtLink to="/participants" class="rounded-full border border-white/20 px-6 py-3 font-semibold">Explore Participants</NuxtLink>
          <NuxtLink to="/deal-room" class="rounded-full border border-white/20 px-6 py-3 font-semibold">Open Deal Room</NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
const authStore = useAuthStore();
const { isAuthenticated } = storeToRefs(authStore);
const registrationFlow = useRegistrationFlow();
const homeCtaTo = computed(() => (isAuthenticated.value ? registrationFlow.ctaTo.value : '/auth/register'));
const homeCtaLabel = computed(() => {
  if (!isAuthenticated.value) return 'Register Now!';
  if (registrationFlow.primaryStatus.value === 'not_selected') return 'Secure Your Seats';

  if (['selected', 'payment_pending'].includes(registrationFlow.primaryStatus.value)) {
    return `Continue as ${registrationFlow.primaryType.value === 'exhibitor' ? 'Exhibitor' : 'Delegate'}`;
  }

  return registrationFlow.ctaLabel.value;
});

onMounted(() => {
  if (isAuthenticated.value) {
    registrationFlow.loadFlow();
  }
});

useSeoMeta({
  title: 'IWBIF 2026 | International Women Business & Investment Forum',
  description: 'Join IWBIF 2026 in Jakarta for global collaboration, women-led investment and market access, and curated business matching.',
  ogTitle: 'International Women Business & Investment Forum 2026',
  ogDescription: 'Empowering Women Entrepreneurs Through Finance, Global Collaboration, and Digital Transformation.',
  ogImage: '/images/iwbif-2026-hero-01.png'
})

const featuredStats = [
  { label: 'Delegates, buyers, investors, and ecosystem leaders', value: 500, suffix: '+' },
  { label: 'Global speakers and strategic sessions', value: 9, suffix: '+' },
  { label: 'Business Matching sectors and channels', value: 6, suffix: '' },
  { label: 'International business network groups', value: 3, suffix: '' },
  { label: 'Industrial visit for investment immersion', value: 1, suffix: '' },
  { label: 'Event days on business outcomes', value: 4, suffix: '' }
]

const displayedStats = ref(featuredStats.map(() => 0));
const hasAnimatedStats = ref(false);
const durationMs = 1200;

const globalNetworks = [
  'AWEN',
  'BRICS WBA',
  'APEC BEST',
  'International Chambers of Commerce',
  'Global Business Organizations'
]

const experiences = [
  'Keynote Sessions',
  'Expert Panel Discussions',
  'Business Matching',
  'Partner Exhibition'
]

const animateStat = (index: number, to: number) => {
  const start = performance.now();
  const from = 0;

  const step = (time: number) => {
    const elapsed = time - start;
    const progress = Math.min(elapsed / durationMs, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.round(from + (to - from) * eased);
    displayedStats.value[index] = current;

    if (progress < 1) {
      requestAnimationFrame(step);
    }
  };

  requestAnimationFrame(step);
}

const handleStatsSection = (entries: IntersectionObserverEntry[]) => {
  if (!hasAnimatedStats.value && entries[0]?.isIntersecting) {
    hasAnimatedStats.value = true;
    featuredStats.forEach((stat, index) => animateStat(index, stat.value));
  }
}

const observeStats = () => {
  const sections = document.querySelectorAll('.home-section');
  const statsSection = sections[1];
  if (!statsSection || hasAnimatedStats.value) return;

  const observer = new IntersectionObserver(handleStatsSection, {
    root: null,
    threshold: 0.35,
  });
  observer.observe(statsSection);
}

onMounted(() => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    displayedStats.value = featuredStats.map((stat) => stat.value);
    return;
  }

  observeStats();
})
</script>

<style scoped>
.hero-stage { position: relative; margin-inline: auto; max-width: 1600px; padding: clamp(1rem, 2.5vw, 2.5rem); }
  .hero-frame { position: relative; isolation: isolate; overflow: hidden; aspect-ratio: 1829 / 860; border: 1px solid rgba(216, 172, 89, .22); border-radius: clamp(1.25rem, 3vw, 3rem); background: #04152d; box-shadow: 0 45px 120px rgba(2, 10, 24, .68), 0 0 80px rgba(224, 177, 98, .08); }
.hero-image { width: 100%; height: 100%; object-fit: cover; transition: transform 1.2s cubic-bezier(.2, .7, .2, 1); }
.hero-frame:hover .hero-image { transform: scale(1.012); }
.hero-vignette { position: absolute; inset: 0; z-index: 1; background: linear-gradient(90deg, rgba(2, 10, 24, .08), transparent 22%, transparent 78%, rgba(2, 10, 24, .08)); box-shadow: inset 0 0 55px rgba(1, 8, 20, .18); pointer-events: none; }
  .hero-live-dot { width: .5rem; height: .5rem; border-radius: 50%; background: var(--premium-gold); box-shadow: 0 0 0 4px rgba(232, 198, 125, .14), 0 0 18px var(--premium-gold); }
.hero-action-dock { position: relative; z-index: 3; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: .8rem; margin: clamp(.85rem, 1.5vw, 1.25rem) clamp(.5rem, 2.5vw, 2.5rem) 0; border: 1px solid rgba(216, 172, 89, .24); border-radius: 1.35rem; background: linear-gradient(135deg, rgba(7, 29, 58, .96), rgba(4, 21, 45, .98)); padding: 1rem; box-shadow: 0 22px 55px rgba(2, 10, 24, .42), inset 0 1px rgba(255, 255, 255, .04); }
.hero-action-status { position:absolute; left:1.25rem; top:50%; display:flex; align-items:center; gap:.7rem; transform:translateY(-50%); color:#cbd2dc; font-size:.68rem; font-weight:700; letter-spacing:.13em; text-transform:uppercase; white-space:nowrap; }
  .hero-action-links { display:flex; justify-content:center; }
.hero-button { display: inline-flex; align-items: center; justify-content: center; gap: .7rem; border-radius: 999px; padding: .85rem 1.25rem; font-size: .82rem; font-weight: 700; white-space: nowrap; }
.hero-button:hover { transform: translateY(-2px); }
  .hero-button-primary { background: linear-gradient(135deg, #e6c477, #d8ac59); color: #04152d; box-shadow: 0 12px 35px rgba(216, 172, 89, .3); }
  .hero-button-primary-large { font-size: 1.12rem; min-height: 3.6rem; min-width: 18rem; }
  .hero-button-secondary { border: 1px solid rgba(255, 255, 255, .25); background: rgba(11, 36, 71, .6); color: #f8f6f1; backdrop-filter: blur(12px); }
  .hero-button-ghost { border: 1px solid rgba(232, 198, 125, .45); background: rgba(4, 21, 45, .45); color: #d8ac59; }

.premium-title {
  font-family: 'Playfair Display', 'Times New Roman', serif;
  font-size: clamp(2.3rem, 4vw, 4rem);
  line-height: 0.96;
  letter-spacing: -0.05em;
  font-weight: 700;
  text-wrap: balance;
  text-shadow: 0 10px 28px rgba(0, 0, 0, 0.22);
}

.title-highlight {
  position: relative;
  display: inline-block;
  color: #e6c477;
  text-shadow: 0 0 24px rgba(230, 196, 119, 0.18);
}

.title-highlight::after {
  content: "";
  position: absolute;
  left: 0.05em;
  right: 0.1em;
  bottom: -0.08em;
  height: 0.12em;
  border-radius: 999px;
  background: linear-gradient(90deg, rgba(230, 196, 119, 0.18), rgba(230, 196, 119, 0.54), rgba(230, 196, 119, 0.18));
  filter: blur(0.08em);
  opacity: 0.85;
}

.featured-stat-card {
  position: relative;
  overflow: hidden;
  background: linear-gradient(180deg, rgba(4, 21, 45, 0.9), rgba(5, 18, 36, 0.96));
  border: 1px solid rgba(216, 172, 89, 0.12);
  transition: transform 220ms ease, border-color 220ms ease, box-shadow 220ms ease;
}

.featured-stat-card::before {
  content: "";
  position: absolute;
  inset: 0 auto auto 0;
  width: 100%;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(230, 196, 119, 0.7), transparent);
  opacity: 0.8;
}

.featured-stat-card:hover {
  transform: translateY(-3px);
  border-color: rgba(230, 196, 119, 0.28);
  box-shadow: inset 0 1px rgba(255, 255, 255, 0.04), 0 18px 40px rgba(2, 10, 24, 0.34);
}

.featured-stat-card strong {
  display: block;
  font-family: 'Playfair Display', 'Times New Roman', serif;
  letter-spacing: -0.05em;
}

.featured-stat-card p {
  color: rgba(203, 210, 220, 0.95);
}

@media (max-width: 767px) {
  .hero-stage {
    padding-inline: 0.75rem;
  }

  .hero-action-dock {
    flex-direction: column;
    align-items: stretch;
    gap: 0.85rem;
    padding: 1rem;
    margin-inline: 0;
  }

  .hero-action-status {
    position: static;
    transform: none;
    justify-content: center;
    white-space: normal;
    letter-spacing: 0.09em;
    text-align: center;
  }

  .hero-action-links {
    display: grid;
    grid-template-columns: 1fr;
    justify-content: stretch;
  }

  .hero-button {
    width: 100%;
    padding-block: 0.95rem;
  }

  .why-heading {
    flex-direction: column;
    align-items: flex-start;
  }

  .why-coordinate {
    white-space: normal;
    letter-spacing: 0.08em;
  }

  .why-content-card {
    position: relative;
    width: 100%;
    right: auto;
    bottom: auto;
    margin-top: 1rem;
  }

  .why-proof-grid {
    grid-template-columns: 1fr;
  }
}
.hero-halo { position: absolute; width: 22rem; height: 22rem; border-radius: 50%; filter: blur(90px); pointer-events: none; }
  .hero-halo-left { left: -10rem; top: 15%; background: rgba(7, 29, 58, .26); }
  .hero-halo-right { right: -10rem; bottom: 0; background: rgba(216, 172, 89, .20); }

.why-indonesia-section { position:relative; }
.why-indonesia-section::before { content:''; position:absolute; right:4%; top:5rem; width:20rem; height:20rem; border-radius:999px; background:rgba(216,172,89,.09); filter:blur(85px); pointer-events:none; }
.why-heading { position:relative; display:flex; align-items:end; justify-content:space-between; gap:2rem; margin-bottom:2rem; }
.why-coordinate { color:#8290a3; font-family:monospace; font-size:.72rem; letter-spacing:.16em; white-space:nowrap; }
.why-visual { position:relative; padding:0 0 clamp(0rem,5vw,4.5rem); }
.why-visual::before { content:''; position:absolute; inset:-.65rem 2.5rem 3.75rem -.65rem; border:1px solid rgba(216,172,89,.26); border-radius:2.25rem; pointer-events:none; }
.why-image-wrap { position:relative; overflow:hidden; aspect-ratio:1672/941; border:1px solid rgba(230,196,119,.2); border-radius:2rem; background:#04152d; box-shadow:0 35px 95px rgba(0,0,0,.48),0 0 55px rgba(216,172,89,.07); }
.why-image { width:100%; height:100%; object-fit:cover; transition:transform 900ms cubic-bezier(.2,.7,.2,1); }
.why-visual:hover .why-image { transform:scale(1.018); }
.why-image-overlay { position:absolute; inset:0; background:linear-gradient(180deg,rgba(4,21,45,.02) 52%,rgba(2,14,33,.7) 100%),linear-gradient(90deg,rgba(4,21,45,.12),transparent 28%); box-shadow:inset 0 0 65px rgba(2,10,24,.18); pointer-events:none; }
.why-visual-label { position:absolute; left:1.5rem; top:1.5rem; border:1px solid rgba(230,196,119,.28); border-radius:999px; background:rgba(4,21,45,.82); padding:.65rem .9rem; color:#e6c477; font-size:.65rem; font-weight:700; letter-spacing:.16em; text-transform:uppercase; backdrop-filter:blur(12px); }
.why-content-card { position:absolute; right:clamp(1rem,3vw,3rem); bottom:0; width:min(42rem,58%); border:1px solid rgba(216,172,89,.3); border-radius:1.75rem; background:linear-gradient(135deg,rgba(7,29,58,.97),rgba(3,17,39,.98)); padding:clamp(1.5rem,3vw,2.5rem); box-shadow:0 28px 70px rgba(0,0,0,.48),inset 0 1px rgba(255,255,255,.05); backdrop-filter:blur(18px); }
.why-card-kicker { color:#d8ac59; font-size:.7rem; font-weight:800; letter-spacing:.24em; text-transform:uppercase; }
.why-proof-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:.75rem; margin-top:1.5rem; padding-top:1.25rem; border-top:1px solid rgba(255,255,255,.1); }
.why-proof-grid span { color:#9eacbd; font-size:.65rem; line-height:1.5; }
.why-proof-grid strong { display:block; color:#e6c477; font-family:'Playfair Display',serif; font-size:1.25rem; }
.why-link { display:inline-flex; align-items:center; gap:.6rem; margin-top:1.5rem; color:#e6c477; font-size:.82rem; font-weight:700; }
.why-link:hover { gap:.85rem; color:#f8f6f1; }

.home-section {
  opacity: 0;
  transform: translateY(14px);
  animation: section-reveal 560ms ease both;
  animation-timeline: scroll();
  animation-range: entry 20% cover 35%;
}

@keyframes section-reveal {
  from {
    opacity: 0;
    transform: translateY(14px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 767px) {
  .hero-stage { padding: 1rem; }
  .hero-frame { border-radius: 1.25rem; }
  .hero-action-dock { align-items:stretch; flex-direction:column; margin:.75rem 0 0; padding:1rem; }
  .hero-action-status { justify-content:center; }
  .hero-action-links { display:grid; grid-template-columns:1fr; }
  .hero-button { width:100%; }
  .why-heading { align-items:start; flex-direction:column; gap:1rem; }
  .why-coordinate { display:none; }
  .why-visual { padding-bottom:0; }
  .why-visual::before { inset:-.4rem 1rem auto -.4rem; height:55vw; border-radius:1.4rem; }
  .why-image-wrap { border-radius:1.25rem; }
  .why-visual-label { left:.75rem; top:.75rem; padding:.48rem .65rem; font-size:.5rem; }
  .why-content-card { position:relative; right:auto; bottom:auto; width:calc(100% - 1rem); margin:-1rem auto 0; border-radius:1.35rem; padding:1.35rem; }
  .why-proof-grid { grid-template-columns:1fr; }
  .why-proof-grid span { display:grid; grid-template-columns:4.25rem 1fr; align-items:center; }
}

@media (min-width: 768px) and (max-width: 1050px) { .hero-action-dock { align-items:flex-start; flex-direction:column; } .hero-action-links { justify-content:center; } }

@media (prefers-reduced-motion: reduce) {
  .hero-image, .why-image, .home-section { transition: none; animation: none; transform: none; opacity: 1; }
}
</style>
