<template>
  <div class="site-shell min-h-screen text-white">
    <div class="ambient ambient-one"></div>
    <div class="ambient ambient-two"></div>

    <header class="sticky top-0 z-50 border-b border-white/10 bg-slate-950/75 backdrop-blur-xl">
      <div class="mx-auto flex w-full max-w-[1440px] items-center gap-5 px-4 py-3 sm:px-6 lg:px-8">
        <NuxtLink to="/" class="flex min-w-0 shrink-0 items-center gap-3">
          <span class="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-cyan-400/30 bg-white/10 p-1 shadow-lg shadow-cyan-950/20">
            <img src="/branding/ai-asean.png" alt="ASEAN AI for Education logo" class="h-full w-full object-contain" />
          </span>
          <span class="hidden sm:block">
            <span class="block whitespace-nowrap text-[10px] uppercase tracking-[0.35em] text-cyan-200/70">ASEAN Event Portal</span>
            <span class="block whitespace-nowrap text-base font-semibold text-white">ASEAN AI for Education</span>
          </span>
        </NuxtLink>

        <nav class="ml-auto hidden items-center gap-1 text-sm text-slate-300 xl:flex">
          <NuxtLink v-for="item in primaryNav" :key="item.to" :to="item.to" class="whitespace-nowrap rounded-full px-3 py-2 hover:bg-white/5 hover:text-white">
            {{ item.label }}
          </NuxtLink>
          <details class="group relative">
            <summary class="cursor-pointer list-none whitespace-nowrap rounded-full px-3 py-2 hover:bg-white/5 hover:text-white">More <span class="ml-1 text-[10px]">v</span></summary>
            <div class="absolute right-0 top-12 grid w-48 gap-1 rounded-2xl border border-white/10 bg-slate-950 p-2 shadow-2xl">
              <NuxtLink v-for="item in secondaryNav" :key="item.to" :to="item.to" class="rounded-xl px-4 py-3 hover:bg-white/5 hover:text-white">{{ item.label }}</NuxtLink>
            </div>
          </details>
        </nav>

        <div class="ml-auto flex shrink-0 items-center gap-2 xl:ml-2">
          <NuxtLink v-if="!isAuthenticated" to="/register" class="hidden whitespace-nowrap rounded-full border border-cyan-300/30 px-4 py-2 text-sm font-semibold text-cyan-100 sm:inline-flex">
            Sign Up
          </NuxtLink>
          <button v-if="isAuthenticated" type="button" class="whitespace-nowrap rounded-full bg-cyan-400 px-5 py-2 text-sm font-semibold text-slate-950" @click="handleLogout">
            Log Out
          </button>
          <NuxtLink v-else to="/auth/login" class="whitespace-nowrap rounded-full bg-cyan-400 px-5 py-2 text-sm font-semibold text-slate-950">
            Log In
          </NuxtLink>
          <details class="relative xl:hidden">
            <summary aria-label="Open navigation menu" class="flex h-10 w-10 cursor-pointer list-none items-center justify-center rounded-full border border-white/15 text-sm font-semibold">Menu</summary>
            <nav class="absolute right-0 top-12 grid w-64 gap-1 rounded-2xl border border-white/10 bg-slate-950 p-3 shadow-2xl">
              <NuxtLink v-for="item in allNav" :key="item.to" :to="item.to" class="rounded-xl px-4 py-3 text-sm text-slate-200 hover:bg-white/5 hover:text-white">{{ item.label }}</NuxtLink>
            </nav>
          </details>
        </div>
      </div>
    </header>

    <main>
      <NuxtPage />
    </main>

    <footer class="relative z-10 border-t border-white/10 bg-slate-950/60">
      <div class="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-3 lg:px-8">
        <div>
          <p class="text-xs uppercase tracking-[0.3em] text-cyan-200">ASEAN AI for Education</p>
          <p class="mt-3 max-w-sm text-sm leading-7 text-slate-400">Building intelligent solutions for the future of education across Southeast Asia.</p>
        </div>
        <div class="grid grid-cols-2 gap-3 text-sm text-slate-300">
          <NuxtLink to="/about">About</NuxtLink><NuxtLink to="/program">Program</NuxtLink>
          <NuxtLink to="/speakers">Speakers</NuxtLink><NuxtLink to="/workshops">Workshops</NuxtLink>
          <NuxtLink to="/partners">Partners</NuxtLink><NuxtLink to="/faq">FAQ</NuxtLink>
        </div>
        <div class="text-sm text-slate-400 md:text-right">
          <p>Information: info@aseanaiedu.com</p>
          <p class="mt-1">Registration: registration@aseanaiedu.com</p>
          <div class="mt-3 flex flex-wrap gap-4 md:justify-end"><NuxtLink to="/privacy">Privacy</NuxtLink><NuxtLink to="/terms">Terms</NuxtLink><NuxtLink to="/code-of-conduct">Code of Conduct</NuxtLink><NuxtLink to="/refund-policy">Refunds</NuxtLink></div>
        </div>
      </div>
      <p class="border-t border-white/10 px-4 py-5 text-center text-xs text-slate-500">(c) 2026 ASEAN AI for Education Summit. All rights reserved.</p>
    </footer>
  </div>
</template>

<script setup lang="ts">
const authStore = useAuthStore();
const { isAuthenticated } = storeToRefs(authStore);
const { logout } = useAuth();

const handleLogout = async () => {
  await logout();
  await navigateTo('/');
};

const primaryNav = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/program', label: 'Program' },
  { to: '/speakers', label: 'Speakers' },
  { to: '/workshops', label: 'Workshops' },
  { to: '/tickets', label: 'Tickets' }
];
const secondaryNav = [
  { to: '/partners', label: 'Partners' },
  { to: '/faq', label: 'FAQ' },
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/admin/speakers', label: 'Admin' }
];
const allNav = [...primaryNav, ...secondaryNav];
</script>
