<template>
  <main class="login-shell">
    <section class="mx-auto max-w-5xl px-3 py-10 sm:px-6 lg:px-8">
      <div class="login-card mx-auto max-w-md rounded-[2rem] border border-white/10 bg-gradient-to-br from-slate-950/80 via-slate-950/70 to-slate-900/70 p-5 shadow-[0_28px_60px_rgba(0,0,0,0.35)] sm:p-8">
        <div class="mb-4 inline-flex rounded-full border border-amber-200/20 bg-amber-300/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[.28em] text-amber-200">Member access</div>
        <h1 class="mt-3 text-3xl font-black text-white sm:text-4xl">Login to IWBIF</h1>
        <p class="mt-3 text-sm leading-7 text-slate-300">Access your dashboard, tickets, payment status, and event updates.</p>

        <form @submit.prevent="onSubmit" class="mt-6 space-y-4">
          <label class="block">
            <span class="mb-2 block text-sm text-slate-300">Email</span>
            <input v-model="form.email" class="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white placeholder:text-slate-500 transition focus:border-amber-300/60 focus:outline-none focus:ring-2 focus:ring-amber-300/20" placeholder="you@example.com" required />
          </label>

          <label class="block">
            <span class="mb-2 block text-sm text-slate-300">Password</span>
            <input v-model="form.password" type="password" class="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white placeholder:text-slate-500 transition focus:border-amber-300/60 focus:outline-none focus:ring-2 focus:ring-amber-300/20" placeholder="Enter your password" required />
          </label>

          <button type="submit" class="w-full rounded-full bg-gradient-to-r from-amber-300 to-amber-400 px-4 py-3 text-sm font-bold uppercase tracking-[.18em] text-slate-950 shadow-[0_18px_35px_rgba(216,172,89,0.22)] transition duration-200 hover:brightness-110 active:scale-[0.99]">Log In</button>
        </form>

        <div v-if="message" class="mt-4 rounded-2xl border p-3 text-sm" :class="messageTone === 'success' ? 'border-emerald-300/30 bg-emerald-950/30 text-emerald-100' : messageTone === 'error' ? 'border-red-300/30 bg-red-950/30 text-red-100' : 'border-white/10 bg-slate-950/60 text-slate-200'">{{ message }}</div>

        <p class="mt-5 text-center text-sm text-slate-300">
          Need an account?
          <NuxtLink to="/auth/register" class="font-semibold text-amber-200 underline-offset-4 hover:underline">Create one</NuxtLink>
        </p>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
const form = reactive({ email: '', password: '' });
const { login } = useAuth();
const message = ref('');
const messageTone = ref<'neutral' | 'success' | 'error'>('neutral');

const onSubmit = async () => {
  message.value = 'Submitting login...';
  messageTone.value = 'neutral';
  const flow = useRegistrationFlow();

  try {
    const result = await login(form);
    if (result.success) {
      await flow.loadFlow(true);
      message.value = `Login successful. ${flow.ctaLabel.value}`;
      messageTone.value = 'success';
      await navigateTo(flow.ctaTo.value);
      return;
    }

    message.value = `Failed: ${result.message}`;
    messageTone.value = 'error';
  } catch (error) {
    message.value = `Failed: ${error instanceof Error ? error.message : 'Login could not be processed.'}`;
    messageTone.value = 'error';
  }
};
</script>

<style scoped>
.login-shell {
  min-height: calc(100vh - 140px);
  background: radial-gradient(circle at top, rgba(216, 172, 89, 0.12), transparent 24rem), linear-gradient(180deg, #031127 0%, #061a35 48%, #020e21 100%);
}
.login-card {
  backdrop-filter: blur(18px);
  box-shadow: 0 28px 60px rgba(0, 0, 0, 0.35), inset 0 1px rgba(255, 255, 255, 0.04);
}

@media (max-width: 767px) {
  .login-shell {
    padding-inline: 0.75rem;
  }

  .login-card {
    border-radius: 1.5rem;
  }
}
</style>
