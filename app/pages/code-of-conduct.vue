<template><section class="mx-auto max-w-4xl px-4 py-14 sm:px-6"><p class="text-sm uppercase tracking-[.35em] text-cyan-200">Code of Conduct</p><h1 class="mt-3 text-4xl font-black">Create a respectful, safe, and professional business ecosystem.</h1><div class="mt-8 space-y-5"><article v-for="item in sections" :key="item.title" class="glass-card rounded-3xl p-6"><p class="text-xs uppercase tracking-[.25em] text-orange-200">{{ item.title }}</p><p class="mt-3 leading-7 text-slate-300">{{ item.text }}</p></article></div></section></template>
<script setup lang="ts">
useSeoMeta({title:'Code of Conduct | IWBIF 2026'});
const sections=[
  {title:'Our commitment',text:'Every participant, speaker, partner, volunteer, and staff member deserves an inclusive and respectful forum experience.'},
  {title:'Expected behavior',text:'Communicate with professionalism, protect participant data, ask permission before recording, and follow all staff guidance and venue rules.'},
  {title:'Unacceptable behavior',text:'Harassment, intimidation, fraud, misuse of participant information, identity theft, and non-consensual sharing of codes or credentials are prohibited.'},
  {title:'Enforcement',text:'Violations may lead to warning, removal from event activities, account suspension, registration cancellation, or referral to authorities.'}
];
</script>
