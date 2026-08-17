<template>
  <section class="mx-auto max-w-5xl px-3 py-10 sm:px-6">
    <p class="text-sm uppercase tracking-[.35em] text-cyan-200">My Schedule</p>
    <h1 class="mt-3 text-3xl font-black sm:text-4xl">Your IWBIF agenda</h1>
    <div class="mt-8 grid gap-6 md:grid-cols-2">
      <article v-for="day in days" :key="day.date" class="glass-card rounded-[2rem] p-4 sm:p-6">
        <p class="text-xs uppercase tracking-[.25em] text-orange-200">{{ day.date }}</p>
        <h2 class="mt-3 text-xl font-bold sm:text-2xl">{{ day.title }}</h2>
        <div class="mt-5 space-y-4">
          <div v-for="item in day.items" :key="item.time" class="border-l-2 border-cyan-300/30 pl-4">
            <p class="font-mono text-xs text-cyan-200">{{ item.time }}</p>
            <p class="mt-1 text-sm font-semibold sm:text-base">{{ item.title }}</p>
          </div>
        </div>
      </article>
    </div>
    <NuxtLink to="/program" class="mt-7 inline-flex w-full justify-center rounded-full border border-white/15 px-5 py-3 font-semibold sm:w-auto">View complete program</NuxtLink>
  </section>
</template>
<script setup lang="ts">
definePageMeta({middleware:'auth'});
useSeoMeta({title:'My Schedule | IWBIF 2026'});
const days=[
  {date:'14 October 2026',title:'Day 1: Arrival and Welcome',items:[{time:'09:00',title:'Arrival & registration'},{time:'10:00',title:'Welcome forum and opening remarks'}]},
  {date:'15 October 2026',title:'Day 2: Forum and Matching',items:[{time:'09:00',title:'Opening Session'},{time:'10:30',title:'Panel Sessions'},{time:'14:00',title:'Business Matching Clinics'}]},
  {date:'16 October 2026',title:'Day 3: Deal Creation',items:[{time:'09:00',title:'Advanced Match Sessions'},{time:'11:00',title:'Investor Roundtables'},{time:'15:00',title:'One-on-one closings'}]},
  {date:'17 October 2026',title:'Day 4: Industrial Exposure',items:[{time:'08:30',title:'Jababeka industrial visit'},{time:'12:00',title:'Final matchmaking summary'}]}
];
</script>
