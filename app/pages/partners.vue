<template>
  <section class="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
    <p class="text-sm uppercase tracking-[0.35em] text-cyan-200">Partners and Sponsors</p>
    <h1 class="mt-4 max-w-4xl text-5xl font-black">Connect global partners with women-led business opportunities</h1>
    <p class="mt-5 max-w-3xl text-lg leading-8 text-slate-300">Build trust-based visibility with ecosystem brands, financial institutions, chambers, and international collaborators.</p>

    <div class="mt-10 grid gap-5 md:grid-cols-2">
      <article v-for="item in items" :key="item.title" class="glass-card rounded-[2rem] p-7">
        <p class="text-xs uppercase tracking-[.25em] text-orange-200">{{ item.label }}</p>
        <h2 class="mt-4 text-2xl font-bold">{{ item.title }}</h2>
        <p class="mt-3 leading-7 text-slate-300">{{ item.text }}</p>
        <p class="mt-5 text-sm text-cyan-200">{{ item.benefits }}</p>
      </article>
    </div>

    <div class="mt-8 grid gap-6 overflow-hidden rounded-[2rem] bg-white/5 p-7 md:grid-cols-2">
      <img src="/foto/pameran.png" alt="Partner exhibition at IWBIF" class="h-64 w-full rounded-3xl object-cover"/>
      <div class="self-center">
        <h2 class="text-3xl font-bold">Support the Future of International Women Entrepreneurship</h2>
        <p class="mt-3 leading-7 text-slate-300">Help businesses build sustainable cross-border relationships through sponsorship, strategic sessions, and program co-creation.</p>
        <a href="mailto:partners@iwbif-event.example" class="mt-6 inline-flex rounded-full bg-cyan-400 px-6 py-3 font-semibold text-slate-950">Contact Partnership Team</a>
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
