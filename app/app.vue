<template>
  <div class="site-shell min-h-screen text-white">
    <div class="ambient ambient-one"></div>
    <div class="ambient ambient-two"></div>

    <header class="sticky top-0 z-50 border-b border-white/10 bg-slate-950/75 backdrop-blur-xl">
      <div class="mx-auto flex w-full max-w-[1440px] flex-wrap items-center gap-3 px-3 py-3 sm:gap-4 sm:px-6 lg:px-8">
        <NuxtLink to="/" class="brand-block flex min-w-0 shrink-0 items-center gap-3">
          <span class="brand-mark flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-amber-300/40 bg-white/10 p-1 shadow-lg shadow-cyan-950/20 sm:h-11 sm:w-11">
            <span class="text-sm font-black text-amber-200">IW</span>
          </span>
          <span class="hidden sm:block">
            <span class="brand-kicker block whitespace-nowrap text-[10px] uppercase tracking-[0.35em] text-amber-200/75">IWAPI presents</span>
            <span class="brand-name block whitespace-nowrap text-base font-semibold tracking-[0.08em] text-white">IWBIF 2026</span>
          </span>
        </NuxtLink>

        <nav class="hidden items-center gap-1 text-sm text-slate-300 xl:ml-auto xl:flex">
          <NuxtLink v-for="item in primaryNav" :key="item.to" :to="item.to" class="nav-link whitespace-nowrap rounded-full px-3 py-2 uppercase tracking-[0.12em] text-[11px] hover:bg-white/5 hover:text-white">
            {{ item.label }}
          </NuxtLink>
          <details class="group relative">
            <summary class="nav-link cursor-pointer list-none whitespace-nowrap rounded-full px-3 py-2 uppercase tracking-[0.12em] text-[11px] text-slate-200 transition hover:bg-white/5 hover:text-white">More <span class="ml-1 text-[10px] text-amber-200/80">v</span></summary>
            <div class="nav-menu-panel absolute right-0 top-12 grid w-48 gap-1 rounded-2xl border border-white/10 bg-slate-950/95 p-2 shadow-2xl shadow-slate-950/60 backdrop-blur-xl">
              <NuxtLink v-for="item in secondaryNav" :key="item.to" :to="item.to" class="rounded-xl px-4 py-3 text-sm text-slate-200 transition hover:bg-white/5 hover:text-white">{{ item.label }}</NuxtLink>
            </div>
          </details>
        </nav>

        <div class="ml-auto flex shrink-0 items-center gap-2 xl:ml-2">
          <NuxtLink v-if="!isAuthenticated" to="/auth/register" class="header-cta hidden whitespace-nowrap rounded-full border border-amber-300/35 bg-gradient-to-r from-amber-300/15 via-amber-200/8 to-cyan-400/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-amber-100 shadow-[0_16px_40px_rgba(216,172,89,0.16)] transition hover:border-amber-200/70 hover:brightness-110 sm:inline-flex">
            Register Now
          </NuxtLink>
          <NuxtLink v-if="!isAuthenticated" to="/auth/register" class="header-cta inline-flex whitespace-nowrap rounded-full bg-gradient-to-r from-amber-300 to-amber-200 px-3 py-2 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-950 shadow-lg shadow-amber-500/20 transition hover:brightness-110 sm:hidden">
            Register
          </NuxtLink>
          <button v-if="isAuthenticated" type="button" class="header-cta whitespace-nowrap rounded-full bg-gradient-to-r from-amber-300 to-amber-200 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-950 shadow-lg shadow-amber-500/20 transition hover:brightness-110 sm:px-5" @click="handleLogout">
            Log Out
          </button>
          <NuxtLink v-else to="/auth/login" class="header-signin whitespace-nowrap rounded-full border border-cyan-300/30 bg-cyan-400/5 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-cyan-100 shadow-[0_12px_30px_rgba(34,211,238,0.12)] transition hover:border-cyan-200/60 hover:bg-cyan-300/10 sm:px-5">
            Sign In
          </NuxtLink>
          <details class="relative xl:hidden">
            <summary aria-label="Open navigation menu" class="menu-button flex h-10 w-10 cursor-pointer list-none items-center justify-center rounded-full border border-white/15 bg-white/5 text-xs font-bold uppercase tracking-[0.12em] text-slate-100 shadow-lg shadow-slate-950/50 transition hover:border-cyan-300/40 hover:bg-white/10">Menu</summary>
            <nav class="nav-menu-panel absolute right-0 top-12 grid w-[min(80vw,18rem)] gap-1 rounded-2xl border border-white/10 bg-slate-950/95 p-3 shadow-2xl shadow-slate-950/60 backdrop-blur-xl">
              <NuxtLink v-for="item in allNav" :key="item.to" :to="item.to" class="rounded-xl px-4 py-3 text-sm text-slate-200 transition hover:bg-white/5 hover:text-white">{{ item.label }}</NuxtLink>
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
          <p class="text-xs uppercase tracking-[0.3em] text-amber-200">IWBIF 2026</p>
          <p class="mt-3 max-w-sm text-sm leading-7 text-slate-400">Connecting women-led businesses with global markets, finance, and trusted partnerships.</p>
        </div>
        <div class="grid grid-cols-2 gap-3 text-sm text-slate-300">
          <NuxtLink to="/about">About</NuxtLink><NuxtLink to="/program">Program</NuxtLink>
          <NuxtLink to="/speakers">Speakers</NuxtLink><NuxtLink to="/business-matching">Business Matching</NuxtLink>
          <NuxtLink to="/partners">Partners</NuxtLink><NuxtLink to="/faq">FAQ</NuxtLink>
        </div>
        <div class="text-sm text-slate-400 md:text-right">
          <p>International Women Business &amp; Investment Forum</p>
          <p class="mt-1">14–17 October 2026 · Jakarta</p>
          <div class="mt-3 flex flex-wrap gap-4 md:justify-end"><NuxtLink to="/privacy">Privacy</NuxtLink><NuxtLink to="/terms">Terms</NuxtLink><NuxtLink to="/code-of-conduct">Code of Conduct</NuxtLink><NuxtLink to="/refund-policy">Refunds</NuxtLink></div>
        </div>
      </div>
      <p class="border-t border-white/10 px-4 py-5 text-center text-xs text-slate-500">© 2026 International Women Business &amp; Investment Forum. All rights reserved.</p>
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
  { to: '/business-matching', label: 'Business Matching' }
];
const secondaryNav = computed(() => {
  const items = [
    { to: '/exhibition', label: 'Exhibition' },
    { to: '/deal-room', label: 'Deal Room' },
    { to: '/participants', label: 'Participants' },
    { to: '/tickets', label: 'Delegate Packages' },
    { to: '/contact', label: 'Contact' },
    { to: '/partners', label: 'Partners' },
    { to: '/faq', label: 'FAQ' },
    { to: '/dashboard', label: 'Dashboard' }
  ];

  if (authStore.isAdminOrOrganizer) {
    items.push({ to: '/admin/reports', label: 'Sales Report' });
    items.push({ to: '/admin/speakers', label: 'Admin' });
  }

  return items;
});
const allNav = computed(() => [...primaryNav, ...secondaryNav.value]);
</script>

<style scoped>
.brand-block {
  transition: transform 180ms ease;
}

.brand-block:hover {
  transform: translateY(-1px);
}

.brand-kicker,
.brand-name,
.nav-link,
.header-cta,
.header-signin,
.menu-button {
  font-family: 'Plus Jakarta Sans', sans-serif;
}

.brand-kicker {
  text-shadow: 0 0 18px rgba(216, 172, 89, 0.18);
}

.brand-name {
  letter-spacing: 0.08em;
}

.nav-link {
  letter-spacing: 0.12em;
  font-size: 11px;
  transition: background 180ms ease, color 180ms ease, transform 180ms ease;
}

.nav-link:hover,
.header-cta:hover,
.header-signin:hover,
.menu-button:hover {
  transform: translateY(-1px);
}

.header-cta,
.header-signin,
.menu-button {
  transition: transform 180ms ease, box-shadow 180ms ease, border-color 180ms ease, filter 180ms ease;
}

.nav-menu-panel {
  border: 1px solid rgba(255, 255, 255, 0.09);
  box-shadow: 0 24px 70px rgba(2, 10, 24, 0.55);
}

summary::-webkit-details-marker {
  display: none;
}

@media (max-width: 639px) {
  .header-cta,
  .header-signin {
    padding-inline: 0.85rem;
    letter-spacing: 0.12em;
  }
}
</style>
