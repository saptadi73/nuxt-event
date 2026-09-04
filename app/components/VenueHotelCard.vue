<template>
  <article class="overflow-hidden rounded-[2rem] border border-white/10 bg-[#071a34] shadow-2xl shadow-black/20">
    <div class="grid grid-cols-1 gap-px bg-white/10 sm:grid-cols-2">
      <figure v-for="image in images" :key="image.label" class="relative bg-[#071a34]">
        <img :src="image.src" :alt="image.label" loading="lazy" class="aspect-[4/3] h-full w-full object-cover">
        <figcaption class="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#031127] via-[#031127]/80 to-transparent px-4 pb-3 pt-10 text-xs font-bold text-white">{{ image.label }}</figcaption>
      </figure>
    </div>
    <div class="p-6 sm:p-7">
      <p class="text-xs font-bold uppercase tracking-[.2em] text-[#e6c477]">{{ rating }}</p>
      <h3 class="mt-3 text-2xl font-bold text-white">{{ name }}</h3>
      <p class="mt-4 text-sm leading-7 text-slate-300">{{ address }}</p>
      <a class="mt-5 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[.15em] text-sky-200 hover:text-[#e6c477]" :href="mapUrl" target="_blank" rel="noopener noreferrer">{{ mapLabel }} <span aria-hidden="true">↗</span></a>
    </div>
  </article>
</template>

<script setup lang="ts">
defineProps<{ name: string; rating: string; address: string; mapUrl: string; mapLabel: string; images: Array<{ src: string; label: string }> }>();
</script>
