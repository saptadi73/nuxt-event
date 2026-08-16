<template>
  <main class="about-page overflow-hidden">
    <section class="relative mx-auto max-w-7xl px-4 pb-16 pt-14 sm:px-6 sm:pt-20 lg:px-8 lg:pb-24">
      <div class="about-glow" aria-hidden="true" />
      <div class="relative grid items-center gap-12 lg:grid-cols-[0.82fr_1.18fr] lg:gap-16">
        <div class="relative z-10">
          <p class="eyebrow">About IWBIF 2026</p>
          <h1 class="mt-5 max-w-2xl text-4xl font-black leading-[1.08] text-[#f8f6f1] sm:text-5xl lg:text-6xl">
            Where women-led businesses build <span class="gold-text">global momentum.</span>
          </h1>
          <p class="mt-6 max-w-xl text-base leading-8 text-[#cbd2dc] sm:text-lg">
            The International Women Business &amp; Investment Forum is a curated ecosystem where women entrepreneurs,
            investors, buyers, governments, and international partners turn meaningful connections into measurable growth.
          </p>
          <div class="mt-8 flex flex-wrap gap-3" aria-label="IWBIF focus areas">
            <span v-for="focus in focusAreas" :key="focus" class="focus-pill">{{ focus }}</span>
          </div>
        </div>

        <figure class="image-stage">
          <div class="image-frame">
            <img src="/images/about-iwbif.png" alt="Women business leaders building international partnerships across Indonesia and Asia" class="h-full w-full object-cover" width="1536" height="1024" fetchpriority="high">
            <div class="image-overlay" aria-hidden="true" />
          </div>
          <figcaption class="image-caption">
            <span class="caption-mark" aria-hidden="true">01</span>
            <span><strong>Indonesia to the world</strong><small>Trade · Investment · Partnership</small></span>
          </figcaption>
        </figure>
      </div>
    </section>

    <section class="vision-section border-y border-white/10">
      <div class="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-24">
        <div class="mb-9 max-w-3xl">
          <p class="eyebrow">Our vision</p>
          <h2 class="mt-4 text-3xl font-black leading-tight text-[#f8f6f1] sm:text-4xl lg:text-5xl">More than a forum. <span class="text-[#d8ac59]">A pathway to opportunity.</span></h2>
        </div>

        <div class="vision-composition">
          <figure class="vision-image-frame">
            <img src="/images/our-vision.png" alt="Women leaders representing Indonesia and Asia driving global business, technology, manufacturing, and sustainable growth" width="1672" height="941" loading="lazy">
            <div class="vision-image-shade" aria-hidden="true" />
            <figcaption><span>One shared vision</span><strong>Women-led growth without borders</strong></figcaption>
          </figure>

          <div class="vision-panel">
            <span class="vision-quote" aria-hidden="true">“</span>
            <p class="relative text-xl font-semibold leading-9 text-[#f8f6f1] sm:text-2xl">Position Indonesia as a regional hub where women-led businesses build bridges, unlock investments, and accelerate sustainable cross-border partnerships.</p>
            <div class="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
              <div v-for="outcome in outcomes" :key="outcome" class="outcome-item"><span class="outcome-dot" aria-hidden="true" /><span>{{ outcome }}</span></div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <div class="max-w-2xl">
        <p class="eyebrow">How we create impact</p>
        <h2 class="mt-4 text-3xl font-black text-[#f8f6f1] sm:text-4xl">Connection with a clear business purpose.</h2>
      </div>
      <div class="mt-10 grid gap-5 md:grid-cols-3">
        <article v-for="(item, index) in mission" :key="item.title" class="mission-card">
          <div class="mission-card-top">
            <span class="mission-number">0{{ index + 1 }}</span>
            <div class="mission-icon" aria-hidden="true">
              <svg v-if="index === 0" viewBox="0 0 64 64" fill="none">
                <circle cx="32" cy="16" r="8" />
                <circle cx="14" cy="43" r="7" />
                <circle cx="50" cy="43" r="7" />
                <path d="M27 23 18 36M37 23l9 13M21 43h22" />
              </svg>
              <svg v-else-if="index === 1" viewBox="0 0 64 64" fill="none">
                <path d="m7 25 10-9 13 6-8 8 5 5 9-8 11 2 10 10-15 15a8 8 0 0 1-11 0L7 31v-6Z" />
                <path d="m17 16 8-5 13 7M42 54l-7-7M49 47l-8-8M56 40l-8-8" />
              </svg>
              <svg v-else viewBox="0 0 64 64" fill="none">
                <path d="M10 52h44M15 47V35h9v12M28 47V25h9v22M41 47V15h9v32" />
                <path d="m13 28 13-10 10 3L51 8M43 8h8v8" />
              </svg>
            </div>
          </div>
          <h3 class="mt-8 text-2xl font-bold text-[#e6c477]">{{ item.title }}</h3>
          <p class="mt-4 leading-7 text-[#cbd2dc]">{{ item.text }}</p>
        </article>
      </div>

      <div class="mt-20">
        <div class="max-w-3xl">
          <p class="eyebrow">Why Indonesia?</p>
          <h2 class="mt-4 text-3xl font-black text-[#f8f6f1] sm:text-4xl lg:text-5xl">A strategic home for regional growth.</h2>
          <p class="mt-5 max-w-2xl leading-7 text-[#cbd2dc]">Scale, connectivity, and convening power make Indonesia a natural meeting point for ambitious businesses.</p>
        </div>

        <figure class="about-why-visual">
          <div class="about-why-frame">
            <img src="/images/why-indonesia.png" alt="Indonesia's infrastructure, manufacturing, cultural heritage, tourism, renewable energy, and international trade" width="1672" height="941" loading="lazy">
            <div class="about-why-overlay" aria-hidden="true" />
            <figcaption class="about-why-caption">
              <span>Indonesia</span>
              <strong>Gateway to ASEAN &amp; Asia</strong>
            </figcaption>
            <div class="about-why-grid">
              <article v-for="(item, index) in why" :key="item.title" class="why-card">
                <span class="why-index">{{ String(index + 1).padStart(2, '0') }}</span>
                <h3>{{ item.title }}</h3>
                <p>{{ item.text }}</p>
              </article>
            </div>
          </div>
        </figure>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
useSeoMeta({
  title: 'About | IWBIF 2026',
  description: 'Discover the vision, purpose, and global business ecosystem behind the International Women Business & Investment Forum 2026.',
  ogImage: '/images/about-iwbif.png',
});

const focusAreas = ['Women-led growth', 'Cross-border trade', 'Strategic investment'];
const outcomes = ['Qualified business leads', 'Buyer and seller connections', 'Investment discussions', 'Strategic partnerships and MoUs'];
const mission = [
  { title: 'Connect', text: 'Bring entrepreneurs, buyers, investors, and ecosystem leaders together across borders.' },
  { title: 'Collaborate', text: 'Shape practical solutions for market entry, access to capital, and procurement opportunities.' },
  { title: 'Create', text: 'Turn conversations into qualified leads, tangible business deals, and lasting partnerships.' },
];
const why = [
  { title: 'A market of significant scale', text: 'A domestic market of more than 283 million people with strong regional relevance.' },
  { title: 'Gateway to ASEAN & Asia', text: 'A strategic location connecting dynamic markets and cross-border opportunity.' },
  { title: 'Global convening power', text: 'A G20 economy suited to public-private dialogue and practical deal-making.' },
  { title: 'Business meets diplomacy', text: 'Corporations, investors, embassies, and decision-makers meet in one city.' },
];
</script>

<style scoped>
.about-page { background: radial-gradient(circle at 82% 7%, rgba(230,196,119,.12), transparent 25rem), radial-gradient(circle at 8% 42%, rgba(11,36,71,.74), transparent 34rem), linear-gradient(180deg,#031127 0%,#061a35 52%,#020e21 100%); }
.about-glow { position:absolute; right:-8rem; top:-10rem; width:34rem; height:34rem; border-radius:999px; background:rgba(216,172,89,.1); filter:blur(86px); }
.eyebrow { color:#e6c477; font-size:.75rem; font-weight:700; letter-spacing:.3em; text-transform:uppercase; }
.gold-text { color:#e6c477; }
.focus-pill { border:1px solid rgba(216,172,89,.32); border-radius:999px; background:rgba(216,172,89,.07); padding:.65rem .9rem; color:#f8f6f1; font-size:.78rem; font-weight:600; }
.image-stage { position:relative; min-width:0; padding:.75rem .75rem 2.5rem; }
.image-stage::before { content:''; position:absolute; inset:0 3rem 1rem 0; border:1px solid rgba(230,196,119,.35); border-radius:2rem; }
.image-frame { position:relative; aspect-ratio:3/2; overflow:hidden; border:1px solid rgba(230,196,119,.2); border-radius:1.6rem; box-shadow:0 32px 90px rgba(0,0,0,.56),0 0 52px rgba(216,172,89,.1); }
.image-frame img { transition:transform 700ms ease; }
.image-stage:hover .image-frame img { transform:scale(1.025); }
.image-overlay { position:absolute; inset:0; background:linear-gradient(90deg,rgba(3,17,39,.18),transparent 30%,rgba(230,196,119,.04)),linear-gradient(180deg,transparent 48%,rgba(2,14,33,.76) 100%); box-shadow:inset 0 0 55px rgba(1,8,20,.22); pointer-events:none; }
.image-caption { position:absolute; right:0; bottom:0; display:flex; align-items:center; gap:.9rem; min-width:17rem; border:1px solid rgba(216,172,89,.28); border-radius:1rem; background:rgba(4,21,45,.94); padding:.9rem 1rem; box-shadow:0 16px 40px rgba(0,0,0,.3); backdrop-filter:blur(16px); }
.caption-mark,.why-index,.mission-number { color:#d8ac59; font-size:.72rem; font-weight:800; letter-spacing:.18em; }
.image-caption strong,.image-caption small { display:block; }
.image-caption strong { color:#f8f6f1; font-size:.83rem; }
.image-caption small { margin-top:.2rem; color:#aeb9c8; font-size:.65rem; letter-spacing:.08em; text-transform:uppercase; }
.vision-panel,.mission-card,.why-card { border:1px solid rgba(255,255,255,.1); background:rgba(255,255,255,.035); box-shadow:inset 0 1px rgba(255,255,255,.04); }
.vision-section { position:relative; background:radial-gradient(circle at 12% 40%,rgba(216,172,89,.08),transparent 27rem),rgba(7,29,58,.75); }
.vision-composition { display:grid; gap:1rem; }
.vision-image-frame { position:relative; min-height:0; overflow:hidden; aspect-ratio:1672/941; border:1px solid rgba(230,196,119,.22); border-radius:1.75rem; box-shadow:0 32px 85px rgba(0,0,0,.46),0 0 48px rgba(216,172,89,.07); }
.vision-image-frame img { width:100%; height:100%; object-fit:cover; transition:transform 900ms cubic-bezier(.2,.7,.2,1); }
.vision-image-frame:hover img { transform:scale(1.018); }
.vision-image-shade { position:absolute; inset:0; background:linear-gradient(180deg,transparent 48%,rgba(2,12,29,.78) 100%); box-shadow:inset 0 0 55px rgba(2,10,24,.14); pointer-events:none; }
.vision-image-frame figcaption { position:absolute; left:1.5rem; bottom:1.4rem; display:flex; flex-direction:column; gap:.3rem; border-left:2px solid #d8ac59; padding-left:1rem; text-shadow:0 3px 18px rgba(0,0,0,.8); }
.vision-image-frame figcaption span { color:#e6c477; font-size:.65rem; font-weight:800; letter-spacing:.24em; text-transform:uppercase; }
.vision-image-frame figcaption strong { color:#f8f6f1; font-family:'Playfair Display',serif; font-size:clamp(1.15rem,2vw,1.75rem); }
.vision-panel { position:relative; overflow:hidden; border-color:rgba(216,172,89,.22); border-radius:1.75rem; background:linear-gradient(145deg,rgba(5,24,51,.97),rgba(2,14,33,.98)); padding:1.75rem; box-shadow:0 28px 70px rgba(0,0,0,.36),inset 0 1px rgba(255,255,255,.05); }
.vision-quote { position:absolute; right:1rem; top:-1.5rem; color:rgba(216,172,89,.09); font-family:'Playfair Display',serif; font-size:10rem; line-height:1; }
.outcome-item { display:flex; align-items:center; gap:.75rem; color:#cbd2dc; font-size:.9rem; }
.outcome-dot { width:.42rem; height:.42rem; flex:0 0 auto; border-radius:999px; background:#d8ac59; box-shadow:0 0 0 5px rgba(216,172,89,.1); }
.mission-card { position:relative; min-height:20rem; overflow:hidden; border-radius:1.6rem; padding:1.75rem; transition:transform 250ms ease,border-color 250ms ease,background 250ms ease; }
.mission-card-top { display:flex; align-items:flex-start; justify-content:space-between; gap:1rem; }
.mission-icon { display:grid; width:6.5rem; height:6.5rem; place-items:center; border:1px solid rgba(216,172,89,.2); border-radius:1.5rem; background:linear-gradient(145deg,rgba(216,172,89,.1),rgba(216,172,89,.025)); color:#e6c477; box-shadow:inset 0 1px rgba(255,255,255,.04),0 14px 35px rgba(0,0,0,.2); transform:rotate(2deg); transition:transform 300ms ease,border-color 300ms ease,background 300ms ease; }
.mission-icon svg { width:4.2rem; height:4.2rem; stroke:currentColor; stroke-width:1.6; stroke-linecap:round; stroke-linejoin:round; filter:drop-shadow(0 0 12px rgba(216,172,89,.22)); }
.mission-card:nth-child(2) .mission-icon { transform:rotate(-2deg); }
.mission-card:hover .mission-icon { transform:rotate(0) scale(1.05); border-color:rgba(230,196,119,.45); background:rgba(216,172,89,.12); }
.mission-card::after { content:''; position:absolute; right:-4rem; bottom:-4rem; width:9rem; height:9rem; border:1px solid rgba(216,172,89,.18); border-radius:999px; }
.mission-card:hover { transform:translateY(-5px); border-color:rgba(216,172,89,.35); background:rgba(216,172,89,.055); }
.why-card { min-width:0; border-color:rgba(255,255,255,.13); border-radius:1rem; background:rgba(3,15,34,.78); padding:1.15rem; backdrop-filter:blur(14px); }
.why-card h3 { margin-top:.7rem; color:#f8f6f1; font-size:1rem; font-weight:700; line-height:1.35; }
.why-card p { margin-top:.55rem; color:#cbd2dc; font-size:.76rem; line-height:1.65; }
.about-why-visual { position:relative; margin-top:2.25rem; }
.about-why-visual::before { content:''; position:absolute; inset:-.65rem 2.5rem .65rem -.65rem; border:1px solid rgba(216,172,89,.28); border-radius:2rem; }
.about-why-frame { position:relative; overflow:hidden; aspect-ratio:1672/941; border:1px solid rgba(230,196,119,.2); border-radius:1.75rem; box-shadow:0 35px 90px rgba(0,0,0,.5),0 0 50px rgba(216,172,89,.08); }
.about-why-frame img { width:100%; height:100%; object-fit:cover; transition:transform 900ms cubic-bezier(.2,.7,.2,1); }
.about-why-visual:hover img { transform:scale(1.018); }
.about-why-overlay { position:absolute; inset:0; background:linear-gradient(180deg,rgba(2,14,33,.06) 25%,rgba(2,14,33,.24) 52%,rgba(2,10,24,.92) 100%); box-shadow:inset 0 0 55px rgba(2,10,24,.16); pointer-events:none; }
.about-why-caption { position:absolute; left:1.5rem; top:1.5rem; display:flex; flex-direction:column; gap:.25rem; border-left:2px solid #d8ac59; padding-left:1rem; text-shadow:0 3px 18px rgba(0,0,0,.75); }
.about-why-caption span { color:#e6c477; font-size:.65rem; font-weight:800; letter-spacing:.28em; text-transform:uppercase; }
.about-why-caption strong { color:#f8f6f1; font-family:'Playfair Display',serif; font-size:clamp(1.2rem,2.5vw,2rem); }
.about-why-grid { position:absolute; z-index:2; right:1rem; bottom:1rem; left:1rem; display:grid; grid-template-columns:repeat(4,minmax(0,1fr)); gap:.7rem; }
@media (min-width:640px) { .vision-panel { padding:2.25rem; } }
@media (min-width:1024px) { .vision-composition { grid-template-columns:minmax(0,1.55fr) minmax(20rem,.65fr); align-items:stretch; } .vision-image-frame { aspect-ratio:auto; min-height:36rem; } .vision-panel { display:flex; flex-direction:column; justify-content:center; } }
@media (max-width:1023px) { .about-why-frame { aspect-ratio:auto; overflow:visible; background:#04152d; } .about-why-frame img { display:block; aspect-ratio:1672/941; border-radius:1.7rem 1.7rem 0 0; } .about-why-overlay { bottom:auto; height:min(56vw,32rem); border-radius:1.7rem 1.7rem 0 0; background:linear-gradient(180deg,rgba(2,14,33,.05),rgba(2,14,33,.48)); } .about-why-grid { position:relative; right:auto; bottom:auto; left:auto; grid-template-columns:repeat(2,minmax(0,1fr)); padding:1rem; background:linear-gradient(180deg,rgba(3,17,39,.98),#031127); } }
@media (max-width:639px) { .image-stage { padding:.4rem .4rem 2rem; } .image-stage::before { inset:0 1.5rem .75rem 0; border-radius:1.5rem; } .image-frame { border-radius:1.25rem; } .image-caption { min-width:auto; max-width:calc(100% - 1.25rem); } .about-why-visual::before { inset:-.4rem 1.25rem .5rem -.4rem; border-radius:1.4rem; } .about-why-frame,.about-why-frame img { border-radius:1.2rem 1.2rem 0 0; } .about-why-caption { left:1rem; top:1rem; } .about-why-grid { grid-template-columns:1fr; border-radius:0 0 1.2rem 1.2rem; } }
@media (prefers-reduced-motion:reduce) { .image-frame img,.vision-image-frame img,.about-why-frame img,.mission-card { transition:none; } }
</style>
