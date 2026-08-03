<template>
  <section class="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
    <p class="text-sm uppercase tracking-[0.35em] text-cyan-200">About the Summit</p>
    <h1 class="mt-4 max-w-4xl text-5xl font-black leading-tight">A Regional Movement for AI-Powered Education</h1>
    <div class="mt-10 grid gap-6 lg:grid-cols-2">
      <img src="/foto/ai_summit2.png" alt="ASEAN AI Summit participants in discussion" class="h-full min-h-80 rounded-[2rem] object-cover" />
      <div class="glass-card rounded-[2rem] p-7 text-slate-300">
        <p class="text-lg leading-8">Artificial intelligence is transforming how people learn, teach, collaborate, and access information. Its benefits must be developed responsibly and made accessible across Southeast Asia.</p>
        <p class="mt-5 leading-7">Over two intensive days, participants explore new technologies, identify educational challenges, build working prototypes, exchange knowledge, and establish long-term cross-border partnerships.</p>
        <div class="mt-8 grid gap-4 sm:grid-cols-3">
          <div><strong class="block text-3xl text-white">10</strong><span class="text-sm">ASEAN Countries</span></div>
          <div><strong class="block text-3xl text-white">20+</strong><span class="text-sm">Speakers</span></div>
          <div><strong class="block text-3xl text-white">300+</strong><span class="text-sm">Participants</span></div>
        </div>
      </div>
    </div>
    <div class="mt-8 grid gap-4 md:grid-cols-3">
      <article v-for="item in values" :key="item.title" class="glass-card rounded-3xl p-6"><p class="text-xs uppercase tracking-[0.25em] text-orange-200">{{ item.label }}</p><h2 class="mt-3 text-2xl font-bold">{{ item.title }}</h2><p class="mt-3 leading-7 text-slate-300">{{ item.text }}</p></article>
    </div>
  </section>
</template>

<script setup lang="ts">
useSeoMeta({ title: 'About | ASEAN AI for Education Summit', description: 'Mission, impact, and community of the ASEAN AI for Education Summit.' });
const values = [
  { label: 'Vision', title: 'Sustainable Community', text: 'An ASEAN-wide community improving the quality, accessibility, inclusiveness, and effectiveness of education.' },
  { label: 'Mission', title: 'Practical Prototypes', text: 'Multidisciplinary teams turn real educational challenges into solutions that can be tested and improved.' },
  { label: 'Impact', title: 'Responsible AI', text: 'Privacy, transparency, safety, fairness, and student protection remain central to every innovation.' }
];
</script>
