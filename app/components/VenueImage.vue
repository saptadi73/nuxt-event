<template>
  <figure class="venue-image group overflow-hidden rounded-[1.6rem] border border-white/10 bg-[#071a34]">
    <div class="aspect-[4/3] overflow-hidden bg-white/[.04] p-0" :class="contain ? 'p-4' : ''">
      <img :src="src" :alt="alt" loading="lazy" class="h-full w-full transition duration-700 group-hover:scale-[1.025]" :class="contain ? 'object-contain' : 'object-cover'">
    </div>
    <figcaption class="border-t border-white/10 px-5 py-4 text-sm font-semibold text-slate-200">{{ label }}</figcaption>
  </figure>
</template>

<script setup lang="ts">
withDefaults(defineProps<{ src: string; alt: string; label: string; contain?: boolean }>(), { contain: false });
</script>

<style scoped>
.venue-image{box-shadow:0 20px 55px rgba(0,0,0,.18);transition:transform .3s ease,border-color .3s ease}.venue-image:hover{transform:translateY(-4px);border-color:rgba(230,196,119,.35)}
@media (prefers-reduced-motion:reduce){.venue-image,.venue-image img{transition:none}}
</style>
