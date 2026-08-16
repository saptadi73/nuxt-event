<template><section class="mx-auto max-w-4xl px-4 py-14 sm:px-6"><p class="text-sm uppercase tracking-[.35em] text-cyan-200">Privacy Policy</p><h1 class="mt-3 text-4xl font-black">How we protect participant data at IWBIF.</h1><div class="mt-8 space-y-5"><article v-for="item in sections" :key="item.title" class="glass-card rounded-3xl p-6"><p class="text-xs uppercase tracking-[.25em] text-orange-200">{{ item.title }}</p><p class="mt-3 leading-7 text-slate-300">{{ item.text }}</p></article></div></section></template>
<script setup lang="ts">
useSeoMeta({title:'Privacy Policy | IWBIF 2026'});
const sections=[
  {title:'Data we collect',text:'Account details, professional profile data, event selections, tickets, payment records, and check-in activity needed to run IWBIF operations.'},
  {title:'How data is used',text:'Data supports registration, communication, ticket delivery, matching recommendations, networking, participant support, and event operations.'},
  {title:'Sharing and security',text:'Data is not sold. Access is limited to organizers and approved service providers; private contact data is never exposed without permission.'},
  {title:'Participant rights',text:'Participants can update profile details and privacy settings in dashboard, including directory visibility.'}
];
</script>
