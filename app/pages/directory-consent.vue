<template>
  <section class="mx-auto max-w-4xl px-4 py-14 sm:px-6">
    <p class="text-sm uppercase tracking-[.35em] text-cyan-200">Directory Visibility</p>
    <h1 class="mt-3 text-5xl font-black">You control how other participants discover you.</h1>
    <p class="mt-5 text-lg leading-8 text-slate-300">The directory supports cross-border networking while keeping your preferences and security as priority.</p>

    <div class="mt-10 grid gap-5">
      <article v-for="item in sections" :key="item.title" class="glass-card rounded-3xl p-6">
        <h2 class="text-xl font-bold">{{ item.title }}</h2>
        <p class="mt-3 leading-7 text-slate-300">{{ item.text }}</p>
      </article>
    </div>

    <NuxtLink to="/dashboard/profile" class="mt-8 inline-flex rounded-full bg-cyan-400 px-6 py-3 font-semibold text-slate-950">Manage My Profile</NuxtLink>
  </section>
</template>

<script setup lang="ts">
useSeoMeta({title:'Directory Consent | IWBIF 2026'});
const sections=[
  {title:'Information that may be shared',text:'Business name, country, expertise, business interests, and selected collaboration goals may be visible with participant consent.'},
  {title:'Information kept private',text:'Personal contact details, payment information, passwords, documents, and sensitive identifiers are never shown in the public directory.'},
  {title:'Your choices',text:'Directory participation is optional. You can adjust visibility settings or hide your profile through privacy controls.'},
  {title:'Professional use',text:'Directory data may only be used for respectful business networking and verified event collaboration activities.'}
];
</script>
