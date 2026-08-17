<template>
  <section class="partners-shell mx-auto max-w-7xl px-3 py-10 sm:px-6 lg:px-8">
    <div class="partner-hero rounded-[2rem] border border-cyan-200/20 bg-gradient-to-br from-cyan-400/8 via-slate-950/80 to-slate-950/90 p-5 sm:p-8">
      <p class="text-sm uppercase tracking-[0.35em] text-cyan-200">Partners and Sponsors</p>
      <h1 class="mt-4 max-w-4xl text-3xl font-black sm:text-5xl">Connect global partners with women-led business opportunities</h1>
      <p class="mt-5 max-w-3xl text-sm leading-7 text-slate-300 sm:text-lg sm:leading-8">Build trust-based visibility with ecosystem brands, financial institutions, chambers, and international collaborators.</p>
    </div>

    <div class="partner-cta mt-8 rounded-[2rem] border border-cyan-200/20 bg-cyan-400/5 p-5 sm:p-6">
      <div>
        <p class="text-xs uppercase tracking-[.3em] text-cyan-200">Partnership opportunity</p>
        <p class="mt-3 text-lg font-semibold text-white sm:text-xl">Shape a stronger future for women entrepreneurship and cross-border growth.</p>
      </div>
      <a href="mailto:partners@iwbif-event.example" class="mt-5 inline-flex rounded-full bg-cyan-300 px-5 py-3 font-semibold text-slate-950 shadow-[0_18px_35px_rgba(34,211,238,0.18)] sm:mt-0">Talk to the team</a>
    </div>

    <div class="mt-10 grid gap-5 md:grid-cols-2">
      <article v-for="item in items" :key="item.title" class="partner-card rounded-[2rem] p-5 sm:p-7">
        <p class="text-xs uppercase tracking-[.25em] text-orange-200">{{ item.label }}</p>
        <h2 class="mt-4 text-xl font-bold sm:text-2xl">{{ item.title }}</h2>
        <p class="mt-3 text-sm leading-7 text-slate-300 sm:text-base">{{ item.text }}</p>
        <p class="mt-5 text-sm text-cyan-200">{{ item.benefits }}</p>
      </article>
    </div>

    <div class="mt-8 grid gap-6 overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 p-4 sm:p-7 md:grid-cols-2">
      <img src="/foto/pameran.png" alt="Partner exhibition at IWBIF" class="h-64 w-full rounded-3xl object-cover"/>
      <div class="self-center">
        <h2 class="text-2xl font-bold sm:text-3xl">Support the Future of International Women Entrepreneurship</h2>
        <p class="mt-3 text-sm leading-7 text-slate-300 sm:text-base">Help businesses build sustainable cross-border relationships through sponsorship, strategic sessions, and program co-creation.</p>
        <a href="mailto:partners@iwbif-event.example" class="mt-6 inline-flex w-full items-center justify-center rounded-full bg-cyan-400 px-6 py-3 font-semibold text-slate-950 shadow-[0_18px_35px_rgba(34,211,238,0.18)] sm:w-auto">Contact Partnership Team</a>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
useSeoMeta({
  title:'Partners | IWBIF 2026',
  description:'Partnership opportunities for IWBIF 2026 international business leaders.'
});

const items=[
  {label:'Institutional',title:'Strategic Partner',text:'For institutions seeking visible leadership in women-led business ecosystems.',benefits:'Executive visibility · keynote access · networking forum · premium booth options'},
  {label:'Infrastructure',title:'Business Services Partner',text:'For financial, legal, logistics, technology, and business ecosystem firms.',benefits:'Program visibility · curated networking · branded roundtables · thought leadership access'},
  {label:'Academic',title:'Knowledge Partner',text:'For universities, training organizations, and research institutions.',benefits:'Business delegations · executive briefings · market insight sessions'},
  {label:'Ecosystem',title:'Community Partner',text:'For associations, women entrepreneur communities, and growth ecosystems.',benefits:'Community recognition · member visibility · media collaboration · cross-border promotion'}
];
</script>

<style scoped>
.partners-shell { position: relative; }
.partner-hero {
  box-shadow: 0 24px 60px rgba(0,0,0,0.18);
}
.partner-cta {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 1rem;
  border: 1px solid rgba(103, 232, 249, 0.22);
  background: linear-gradient(135deg, rgba(34, 211, 238, 0.08), rgba(255, 255, 255, 0.02));
}
.partner-card {
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: linear-gradient(180deg, rgba(11, 36, 71, 0.74), rgba(11, 36, 71, 0.42));
  transition: transform 0.2s ease, border-color 0.2s ease;
}
.partner-card:hover {
  transform: translateY(-4px);
  border-color: rgba(103, 232, 249, 0.35);
}
@media (min-width: 640px) {
  .partner-cta { flex-direction: row; align-items: center; }
}
</style>
