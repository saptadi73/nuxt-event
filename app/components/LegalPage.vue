<template>
  <section class="legal-shell mx-auto max-w-4xl px-3 py-10 sm:px-6 sm:py-14">
    <p class="text-sm uppercase tracking-[0.35em] text-cyan-200">Legal Information</p>
    <h1 class="mt-4 text-3xl font-black sm:text-5xl">{{ title }}</h1>
    <p class="mt-5 text-base leading-8 text-slate-300 sm:text-lg">{{ intro }}</p>
    <div class="mt-10 space-y-5">
      <article v-for="section in sections" :key="section.title" class="glass-card rounded-2xl p-5 sm:p-6">
        <h2 class="text-lg font-bold sm:text-xl">{{ section.title }}</h2>
        <p class="mt-3 leading-7 text-slate-300">{{ section.text }}</p>
      </article>
    </div>
    <p class="mt-8 text-sm text-slate-500">Last updated: August 1, 2026. Contact the organizer for the policy version that applies to your event.</p>
  </section>
</template>

<script setup lang="ts">
defineProps<{title:string;intro:string;sections:Array<{title:string;text:string}>}>();
</script>

<style scoped>
.legal-shell {
  padding-inline: 0.75rem;
}
</style>
