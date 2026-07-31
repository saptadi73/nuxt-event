<template>
  <div class="site-shell min-h-screen text-white">
    <div class="ambient ambient-one"></div>
    <div class="ambient ambient-two"></div>

    <header class="sticky top-0 z-50 border-b border-white/10 bg-slate-950/75 backdrop-blur-xl">
      <div class="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <NuxtLink to="/" class="flex items-center gap-3">
          <span class="flex h-11 w-11 items-center justify-center rounded-2xl border border-cyan-400/30 bg-cyan-400/10 text-sm font-bold text-cyan-200">
            AI
          </span>
          <span>
            <span class="block text-xs uppercase tracking-[0.35em] text-cyan-200/70">ASEAN Event Portal</span>
            <span class="block text-lg font-semibold text-white">{{ config.public.appName }}</span>
          </span>
        </NuxtLink>

        <nav class="hidden items-center gap-6 text-sm text-slate-200 md:flex">
          <NuxtLink to="/">Beranda</NuxtLink>
          <NuxtLink to="/about">Tentang</NuxtLink>
          <NuxtLink to="/speakers">Pembicara</NuxtLink>
          <NuxtLink to="/program">Program</NuxtLink>
          <NuxtLink to="/register">Registrasi</NuxtLink>
          <NuxtLink to="/dashboard">Dashboard</NuxtLink>
        </nav>

        <div class="flex items-center gap-3">
          <a href="#agenda" class="hidden rounded-full border border-white/15 px-4 py-2 text-sm text-slate-100 sm:inline-flex">
            Lihat Agenda
          </a>
          <NuxtLink to="/auth/login" class="rounded-full bg-cyan-400 px-4 py-2 text-sm font-semibold text-slate-950">
            Masuk
          </NuxtLink>
        </div>
      </div>
    </header>

    <main>
      <NuxtPage />
    </main>
  </div>
</template>

<script setup lang="ts">
const config = useRuntimeConfig();
</script>
