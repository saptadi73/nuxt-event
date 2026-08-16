<template><section class="mx-auto max-w-4xl px-4 py-14 sm:px-6"><p class="text-sm uppercase tracking-[.35em] text-cyan-200">Terms and Conditions</p><h1 class="mt-3 text-4xl font-black">Clear rules for a smooth registration and event journey.</h1><div class="mt-8 space-y-5"><article v-for="item in sections" :key="item.title" class="glass-card rounded-3xl p-6"><p class="text-xs uppercase tracking-[.25em] text-orange-200">{{ item.title }}</p><p class="mt-3 leading-7 text-slate-300">{{ item.text }}</p></article></div></section></template>
<script setup lang="ts">
useSeoMeta({title:'Terms and Conditions | IWBIF 2026'});
const sections=[
  {title:'Registration and tickets',text:'Participants must provide accurate information. Tickets are personal and not transferable without approval.'},
  {title:'Payments',text:'Payment status follows confirmation from the configured payment provider and the organizer team process.'},
  {title:'Participant conduct',text:'Participants must respect others and maintain a harassment-free professional environment at all times.'},
  {title:'Program changes',text:'Organizer may adjust sessions, tracks, or venues as operationally needed and will communicate updates through official channels.'}
];
</script>
