<template>
  <section class="register-choice-shell mx-auto max-w-5xl px-3 py-10 sm:px-6 lg:px-8">
    <p class="text-sm uppercase tracking-[0.35em] text-amber-200">Registration</p>
    <h1 class="mt-4 text-3xl font-black sm:text-5xl">Choose how you want to join IWBIF 2026</h1>
    <p class="mt-4 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
      Create your account first, then continue with the registration type that matches your participation.
    </p>

    <div v-if="!isAuthenticated" class="mt-10 rounded-[2rem] border border-amber-200/20 bg-gradient-to-br from-amber-300/8 via-slate-950/60 to-slate-950/80 p-6 shadow-[0_18px_50px_rgba(0,0,0,0.2)] sm:p-8">
      <p class="text-base text-slate-200">You need an account before starting the registration process.</p>
      <div class="mt-6 flex flex-col gap-3 sm:flex-row">
        <NuxtLink to="/auth/register" class="inline-flex items-center justify-center rounded-full bg-amber-300 px-6 py-3 font-semibold text-slate-950 shadow-[0_18px_35px_rgba(216,172,89,0.24)] transition hover:brightness-110">Create account</NuxtLink>
        <NuxtLink to="/auth/login" class="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/5 px-6 py-3 font-semibold text-white transition hover:border-white/25 hover:bg-white/10">I already have an account</NuxtLink>
      </div>
    </div>

    <div v-else class="mt-10 grid gap-5 md:grid-cols-2">
      <NuxtLink to="/register/delegate" class="choice-card delegate-card rounded-[2rem] border border-amber-200/20 bg-amber-400/5 p-6 transition duration-200 hover:-translate-y-1 hover:border-amber-300/50 hover:bg-amber-300/10">
        <p class="text-xs uppercase tracking-[0.35em] text-amber-200">Delegate</p>
        <h2 class="mt-4 text-2xl font-black">Register as Delegate</h2>
        <p class="mt-3 text-sm leading-7 text-slate-300">Join as a participant, complete your profile, choose a package, and access business matching features.</p>
        <span class="mt-6 inline-flex rounded-full bg-amber-300 px-5 py-2.5 font-semibold text-slate-950 shadow-[0_12px_25px_rgba(216,172,89,0.20)]">Continue</span>
      </NuxtLink>

      <NuxtLink to="/register/exhibitor" class="choice-card exhibitor-card rounded-[2rem] border border-cyan-200/20 bg-cyan-400/5 p-6 transition duration-200 hover:-translate-y-1 hover:border-cyan-300/50 hover:bg-cyan-300/10">
        <p class="text-xs uppercase tracking-[0.35em] text-cyan-200">Exhibitor</p>
        <h2 class="mt-4 text-2xl font-black">Register as Exhibitor</h2>
        <p class="mt-3 text-sm leading-7 text-slate-300">Submit your company profile, booth interest, and exhibition requirements for event participation.</p>
        <span class="mt-6 inline-flex rounded-full bg-cyan-300 px-5 py-2.5 font-semibold text-slate-950 shadow-[0_12px_25px_rgba(34,211,238,0.20)]">Continue</span>
      </NuxtLink>
    </div>
  </section>
</template>

<script setup lang="ts">
const authStore = useAuthStore();
const { isAuthenticated } = storeToRefs(authStore);
useSeoMeta({
  title: 'Registration | IWBIF 2026',
  description: 'Create your IWBIF 2026 account and choose whether you want to register as a delegate or exhibitor.'
});
</script>

<style scoped>
.register-choice-shell {
  position: relative;
}
.choice-card {
  box-shadow: inset 0 1px rgba(255, 255, 255, 0.04), 0 20px 45px rgba(0, 0, 0, 0.18);
}
.delegate-card {
  background: linear-gradient(145deg, rgba(216, 172, 89, 0.08), rgba(255, 255, 255, 0.02));
}
.exhibitor-card {
  background: linear-gradient(145deg, rgba(34, 211, 238, 0.08), rgba(255, 255, 255, 0.02));
}
@media (max-width: 639px) {
  .choice-card {
    border-radius: 1.5rem;
    padding: 1.25rem;
  }
}
</style>
