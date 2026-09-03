<template>
  <main class="auth-shell">
    <section class="mx-auto max-w-5xl px-3 py-10 sm:px-6 lg:px-8">
      <div class="auth-card mx-auto max-w-md rounded-[2rem] border border-white/10 bg-gradient-to-br from-slate-950/80 via-slate-950/70 to-slate-900/70 p-5 shadow-[0_28px_60px_rgba(0,0,0,0.35)] sm:p-8">
        <div class="mb-4 inline-flex rounded-full border border-amber-200/20 bg-amber-300/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[.28em] text-amber-200">{{ copy.eyebrow }}</div>
        <h1 class="mt-3 text-3xl font-black text-white sm:text-4xl">{{ copy.title }}</h1>
        <p class="mt-3 text-sm leading-7 text-slate-300">{{ copy.intro }}</p>

        <form class="mt-6 space-y-4" novalidate @submit.prevent="onSubmit">
          <label class="block">
            <span class="mb-2 block text-sm text-slate-300">{{ copy.email }}</span>
            <input v-model.trim="email" type="email" autocomplete="email" class="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white placeholder:text-slate-500 transition focus:border-amber-300/60 focus:outline-none focus:ring-2 focus:ring-amber-300/20" placeholder="you@example.com" required>
          </label>
          <button type="submit" class="w-full rounded-full bg-gradient-to-r from-amber-300 to-amber-400 px-4 py-3 text-sm font-bold uppercase tracking-[.18em] text-slate-950 transition hover:brightness-110 disabled:cursor-wait disabled:opacity-70" :disabled="submitting">
            {{ submitting ? copy.sending : copy.submit }}
          </button>
        </form>

        <div v-if="message" class="mt-4 rounded-2xl border p-3 text-sm" :class="messageTone === 'success' ? 'border-emerald-300/30 bg-emerald-950/30 text-emerald-100' : 'border-red-300/30 bg-red-950/30 text-red-100'" role="status" aria-live="polite">{{ message }}</div>
        <p class="mt-5 text-center text-sm text-slate-300">
          <NuxtLink to="/auth/login" class="font-semibold text-amber-200 underline-offset-4 hover:underline">{{ copy.back }}</NuxtLink>
        </p>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
const { locale } = useI18n();
const messages = {
  en: { eyebrow: 'Password recovery', title: 'Forgot your password?', intro: 'Enter your account email. If it is registered, we will send instructions to reset your password.', email: 'Email', submit: 'Send reset instructions', sending: 'Sending…', invalidEmail: 'Enter a valid email address.', neutral: 'If this email is registered, password reset instructions will be sent shortly.', back: 'Back to login' },
  'zh-CN': { eyebrow: '密码找回', title: '忘记密码？', intro: '请输入您的账户邮箱。如果该邮箱已注册，我们将发送密码重置说明。', email: '电子邮箱', submit: '发送重置说明', sending: '正在发送…', invalidEmail: '请输入有效的电子邮箱地址。', neutral: '如果该邮箱已注册，密码重置说明将很快发送。', back: '返回登录' }
} as const;
const copy = computed(() => messages[locale.value === 'zh-CN' ? 'zh-CN' : 'en']);
useSeoMeta({ title: () => `${copy.value.title} | IWBIF 2026`, description: () => copy.value.intro });

const email = ref('');
const submitting = ref(false);
const message = ref('');
const messageTone = ref<'success' | 'error'>('success');
const { forgotPassword } = useAuth();
const isValidEmail = (value: string) => {
  const parts = value.split('@');
  return parts.length === 2 && Boolean(parts[0]) && Boolean(parts[1]?.includes('.')) && !value.includes(' ');
};

const onSubmit = async () => {
  if (!isValidEmail(email.value)) {
    message.value = copy.value.invalidEmail;
    messageTone.value = 'error';
    return;
  }

  submitting.value = true;
  message.value = '';
  try {
    await forgotPassword(email.value);
  } catch {
    // Keep the same neutral result so this screen never reveals account existence.
  } finally {
    submitting.value = false;
    message.value = copy.value.neutral;
    messageTone.value = 'success';
  }
};
</script>

<style scoped>
.auth-shell { min-height: calc(100vh - 140px); background: radial-gradient(circle at top, rgba(216, 172, 89, 0.12), transparent 24rem), linear-gradient(180deg, #031127 0%, #061a35 48%, #020e21 100%); }
.auth-card { backdrop-filter: blur(18px); }
</style>
