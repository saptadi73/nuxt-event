<template>
  <main class="auth-shell">
    <section class="mx-auto max-w-5xl px-3 py-10 sm:px-6 lg:px-8">
      <div class="auth-card mx-auto max-w-md rounded-[2rem] border border-white/10 bg-gradient-to-br from-slate-950/80 via-slate-950/70 to-slate-900/70 p-5 shadow-[0_28px_60px_rgba(0,0,0,0.35)] sm:p-8">
        <div class="mb-4 inline-flex rounded-full border border-amber-200/20 bg-amber-300/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[.28em] text-amber-200">Create account</div>
        <h1 class="mt-3 text-3xl font-black text-white sm:text-4xl">Register your IWBIF account</h1>
        <p class="mt-3 text-sm leading-7 text-slate-300">Create your user account first, then choose your package and continue securely to checkout.</p>

        <form @submit.prevent="onSubmit" class="mt-6 space-y-4">
          <label class="block">
            <span class="mb-2 block text-sm text-slate-300">Full name</span>
            <input v-model="form.full_name" class="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white placeholder:text-slate-500 transition focus:border-amber-300/60 focus:outline-none focus:ring-2 focus:ring-amber-300/20" placeholder="Your full name" required />
          </label>

          <label class="block">
            <span class="mb-2 block text-sm text-slate-300">Email</span>
            <input v-model="form.email" type="email" class="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white placeholder:text-slate-500 transition focus:border-amber-300/60 focus:outline-none focus:ring-2 focus:ring-amber-300/20" placeholder="you@example.com" required />
          </label>

          <label class="block">
            <span class="mb-2 block text-sm text-slate-300">Password</span>
            <input v-model="form.password" type="password" class="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white placeholder:text-slate-500 transition focus:border-amber-300/60 focus:outline-none focus:ring-2 focus:ring-amber-300/20" placeholder="Minimum 8 characters" required />
          </label>

          <label class="block">
            <span class="mb-2 block text-sm text-slate-300">Confirm password</span>
            <input v-model="form.confirmPassword" type="password" class="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white placeholder:text-slate-500 transition focus:border-amber-300/60 focus:outline-none focus:ring-2 focus:ring-amber-300/20" placeholder="Re-enter your password" required />
          </label>

          <button type="submit" class="w-full rounded-full bg-gradient-to-r from-amber-300 to-amber-400 px-4 py-3 text-sm font-bold uppercase tracking-[.18em] text-slate-950 shadow-[0_18px_35px_rgba(216,172,89,0.22)] transition duration-200 hover:brightness-110 active:scale-[0.99]" :disabled="submitting">
            {{ submitting ? 'Creating account...' : 'Create account' }}
          </button>
        </form>

        <div v-if="message" class="mt-4 rounded-2xl border p-3 text-sm" :class="messageTone === 'success' ? 'border-emerald-300/30 bg-emerald-950/30 text-emerald-100' : messageTone === 'error' ? 'border-red-300/30 bg-red-950/30 text-red-100' : 'border-white/10 bg-slate-950/60 text-slate-200'">{{ message }}</div>

        <p class="mt-5 text-center text-sm text-slate-300">
          Already have an account?
          <NuxtLink to="/auth/login" class="font-semibold text-amber-200 underline-offset-4 hover:underline">Log in</NuxtLink>
        </p>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
const form = reactive({
  full_name: '',
  email: '',
  password: '',
  confirmPassword: ''
});
const { register } = useAuth();
const flow = useRegistrationFlow();
const submitting = ref(false);
const message = ref('');
const messageTone = ref<'neutral' | 'success' | 'error'>('neutral');

const onSubmit = async () => {
  if (form.password.length < 8) {
    message.value = 'Password must be at least 8 characters long.';
    messageTone.value = 'error';
    return;
  }

  if (form.password !== form.confirmPassword) {
    message.value = 'Passwords do not match.';
    messageTone.value = 'error';
    return;
  }

  submitting.value = true;
  message.value = 'Creating account...';
  messageTone.value = 'neutral';

  try {
    const result = await register({
      email: form.email,
      full_name: form.full_name,
      password: form.password
    });

    if (result.success) {
      await flow.loadFlow(true);
      message.value = 'Account created successfully. Redirecting to package selection...';
      messageTone.value = 'success';
      await navigateTo(flow.ctaTo.value);
      return;
    }

    message.value = result.message || 'Account creation failed.';
    messageTone.value = 'error';
  } catch (error) {
    message.value = error instanceof Error ? error.message : 'Account creation failed.';
    messageTone.value = 'error';
  } finally {
    submitting.value = false;
  }
};
</script>

<style scoped>
.auth-shell {
  min-height: calc(100vh - 140px);
  background: radial-gradient(circle at top, rgba(216, 172, 89, 0.12), transparent 24rem), linear-gradient(180deg, #031127 0%, #061a35 48%, #020e21 100%);
}
.auth-card {
  backdrop-filter: blur(18px);
  box-shadow: 0 28px 60px rgba(0, 0, 0, 0.35), inset 0 1px rgba(255, 255, 255, 0.04);
}

@media (max-width: 767px) {
  .auth-shell {
    padding-inline: 0.75rem;
  }

  .auth-card {
    border-radius: 1.5rem;
  }
}
</style>
