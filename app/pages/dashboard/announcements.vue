<template>
  <section class="mx-auto max-w-4xl px-3 py-10 sm:px-6">
    <p class="text-sm uppercase tracking-[.35em] text-cyan-200">Event Announcements</p>
    <h1 class="mt-3 text-3xl font-black sm:text-4xl">Important participant updates</h1>
    <div class="mt-8 space-y-5">
      <article v-for="item in items" :key="item.title" class="glass-card rounded-3xl p-4 sm:p-6">
        <div class="flex flex-wrap justify-between gap-3">
          <span class="text-xs uppercase tracking-[.25em] text-orange-200">{{ item.type }}</span>
          <time class="text-xs text-slate-500">{{ item.date }}</time>
        </div>
        <h2 class="mt-3 text-lg font-bold sm:text-xl">{{ item.title }}</h2>
        <p class="mt-3 text-sm leading-7 text-slate-300 sm:text-base">{{ item.text }}</p>
      </article>
    </div>
  </section>
</template>
<script setup lang="ts">
definePageMeta({middleware:'auth'});
useSeoMeta({title:'Announcements | IWBIF 2026'});
const items=[
  {type:'Preparation',date:'1 August 2026',title:'Complete registration details',text:'Submit full business profile details and ensure your directory preferences are updated before pre-matching opens.'},
  {type:'Schedule',date:'1 August 2026',title:'Review business matching windows',text:'Opening and confirmation windows are announced in your participant inbox and dashboard timeline.'},
  {type:'Security',date:'1 August 2026',title:'Protect your QR code',text:'Your QR code is private. Keep it off public channels and only share it for official check-in.'}
];
</script>
