<template>
  <main class="auth-shell">
    <section class="mx-auto max-w-5xl px-3 py-10 sm:px-6 lg:px-8">
      <div class="auth-card mx-auto max-w-md rounded-[2rem] border border-white/10 bg-gradient-to-br from-slate-950/80 via-slate-950/70 to-slate-900/70 p-5 shadow-[0_28px_60px_rgba(0,0,0,0.35)] sm:p-8">
        <div class="mb-4 inline-flex rounded-full border border-amber-200/20 bg-amber-300/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[.28em] text-amber-200">{{ copy.eyebrow }}</div>
        <h1 class="mt-3 text-3xl font-black text-white sm:text-4xl">{{ copy.title }}</h1>
        <p class="mt-3 text-sm leading-7 text-slate-300">{{ copy.intro }}</p>

        <div v-if="!token" class="mt-6 rounded-2xl border border-red-300/30 bg-red-950/30 p-4 text-sm text-red-100" role="alert">
          <p>{{ copy.missingToken }}</p>
          <NuxtLink to="/auth/forgot-password" class="mt-3 inline-flex font-semibold text-amber-200 underline-offset-4 hover:underline">{{ copy.requestNew }}</NuxtLink>
        </div>

        <form v-else class="mt-6 space-y-4" novalidate @submit.prevent="onSubmit">
          <label class="block">
            <span class="mb-2 block text-sm text-slate-300">{{ copy.password }}</span>
            <input v-model="form.password" type="password" autocomplete="new-password" minlength="8" maxlength="128" class="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white placeholder:text-slate-500 transition focus:border-amber-300/60 focus:outline-none focus:ring-2 focus:ring-amber-300/20" :placeholder="copy.passwordPlaceholder" required>
          </label>
          <label class="block">
            <span class="mb-2 block text-sm text-slate-300">{{ copy.confirmPassword }}</span>
            <input v-model="form.confirmPassword" type="password" autocomplete="new-password" minlength="8" maxlength="128" class="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white placeholder:text-slate-500 transition focus:border-amber-300/60 focus:outline-none focus:ring-2 focus:ring-amber-300/20" :placeholder="copy.confirmPlaceholder" required>
          </label>
          <button type="submit" class="w-full rounded-full bg-gradient-to-r from-amber-300 to-amber-400 px-4 py-3 text-sm font-bold uppercase tracking-[.18em] text-slate-950 transition hover:brightness-110 disabled:cursor-wait disabled:opacity-70" :disabled="submitting">
            {{ submitting ? copy.resetting : copy.submit }}
          </button>
        </form>

        <div v-if="message" class="mt-4 rounded-2xl border border-red-300/30 bg-red-950/30 p-3 text-sm text-red-100" role="alert" aria-live="assertive">
          <p>{{ message }}</p>
          <NuxtLink v-if="tokenRejected" to="/auth/forgot-password" class="mt-2 inline-flex font-semibold text-amber-200 underline-offset-4 hover:underline">{{ copy.requestNew }}</NuxtLink>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
const { locale } = useI18n();
const messages = {
  en: { eyebrow: 'Password reset', title: 'Create a new password', intro: 'Choose a strong new password for your IWBIF account.', password: 'New password', passwordPlaceholder: 'Minimum 8 characters', confirmPassword: 'Confirm new password', confirmPlaceholder: 'Re-enter your new password', submit: 'Reset password', resetting: 'Resetting…', required: 'Enter and confirm your new password.', passwordLength: 'Password must be at least 8 characters long.', mismatch: 'Passwords do not match.', missingToken: 'This password reset link is incomplete or invalid.', rejected: 'This reset link is invalid, expired, or has already been used.', failed: 'The password could not be reset. Please try again.', requestNew: 'Request a new reset link' },
  'zh-CN': { eyebrow: '重置密码', title: '创建新密码', intro: '为您的 IWBIF 账户设置一个安全的新密码。', password: '新密码', passwordPlaceholder: '至少 8 个字符', confirmPassword: '确认新密码', confirmPlaceholder: '再次输入新密码', submit: '重置密码', resetting: '正在重置…', required: '请输入并确认您的新密码。', passwordLength: '密码长度必须至少为 8 个字符。', mismatch: '两次输入的密码不一致。', missingToken: '此密码重置链接不完整或无效。', rejected: '此重置链接无效、已过期或已被使用。', failed: '无法重置密码，请重试。', requestNew: '申请新的重置链接' }
} as const;
const copy = computed(() => messages[locale.value === 'zh-CN' ? 'zh-CN' : 'en']);
useSeoMeta({ title: () => `${copy.value.title} | IWBIF 2026`, description: () => copy.value.intro });

const route = useRoute();
const queryToken = route.query.token;
const token = ref(typeof queryToken === 'string' ? queryToken.trim() : Array.isArray(queryToken) ? String(queryToken[0] || '').trim() : '');
const form = reactive({ password: '', confirmPassword: '' });
const submitting = ref(false);
const message = ref('');
const tokenRejected = ref(false);
const { resetPassword } = useAuth();

const onSubmit = async () => {
  tokenRejected.value = false;
  if (!form.password || !form.confirmPassword) {
    message.value = copy.value.required;
    return;
  }
  if (form.password.length < 8) {
    message.value = copy.value.passwordLength;
    return;
  }
  if (form.password !== form.confirmPassword) {
    message.value = copy.value.mismatch;
    return;
  }

  submitting.value = true;
  message.value = '';
  try {
    const result = await resetPassword({ token: token.value, password: form.password, confirm_password: form.confirmPassword });
    if (!result.success) throw new Error(result.message || copy.value.failed);
    token.value = '';
    if (import.meta.client) window.history.replaceState(window.history.state, '', route.path);
    await navigateTo({ path: '/auth/login', query: { reset: 'success' } }, { replace: true });
  } catch {
    tokenRejected.value = true;
    message.value = copy.value.rejected;
  } finally {
    submitting.value = false;
  }
};
</script>

<style scoped>
.auth-shell { min-height: calc(100vh - 140px); background: radial-gradient(circle at top, rgba(216, 172, 89, 0.12), transparent 24rem), linear-gradient(180deg, #031127 0%, #061a35 48%, #020e21 100%); }
.auth-card { backdrop-filter: blur(18px); }
</style>
