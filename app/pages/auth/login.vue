<template>
  <main class="login-shell">
    <div v-if="message && messageTone === 'error'" class="login-toast" role="alert" aria-live="assertive">
      <p class="font-semibold">{{ copy.failed }}</p>
      <p class="mt-1 text-sm leading-5">{{ message }}</p>
    </div>
    <section class="mx-auto max-w-5xl px-3 py-10 sm:px-6 lg:px-8">
      <div class="login-card mx-auto max-w-md rounded-[2rem] border border-white/10 bg-gradient-to-br from-slate-950/80 via-slate-950/70 to-slate-900/70 p-5 shadow-[0_28px_60px_rgba(0,0,0,0.35)] sm:p-8">
        <div class="mb-4 inline-flex rounded-full border border-amber-200/20 bg-amber-300/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[.28em] text-amber-200">{{ copy.member }}</div>
        <h1 class="mt-3 text-3xl font-black text-white sm:text-4xl">{{ copy.title }}</h1>
        <p class="mt-3 text-sm leading-7 text-slate-300">{{ copy.intro }}</p>

        <form class="mt-6 space-y-4" novalidate @submit.prevent="onSubmit">
          <label class="block">
            <span class="mb-2 block text-sm text-slate-300">{{ copy.email }}</span>
            <input v-model.trim="form.email" type="email" autocomplete="email" class="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white placeholder:text-slate-500 transition focus:border-amber-300/60 focus:outline-none focus:ring-2 focus:ring-amber-300/20" placeholder="you@example.com" minlength="6" required />
          </label>

          <label class="block">
            <span class="mb-2 block text-sm text-slate-300">{{ copy.password }}</span>
            <input v-model="form.password" type="password" autocomplete="current-password" class="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white placeholder:text-slate-500 transition focus:border-amber-300/60 focus:outline-none focus:ring-2 focus:ring-amber-300/20" :placeholder="copy.passwordPlaceholder" minlength="8" maxlength="128" required />
          </label>

          <div class="text-right">
            <NuxtLink to="/auth/forgot-password" class="text-sm font-semibold text-amber-200 underline-offset-4 hover:underline">{{ copy.forgotPassword }}</NuxtLink>
          </div>

          <button type="submit" class="w-full rounded-full bg-gradient-to-r from-amber-300 to-amber-400 px-4 py-3 text-sm font-bold uppercase tracking-[.18em] text-slate-950 shadow-[0_18px_35px_rgba(216,172,89,0.22)] transition duration-200 hover:brightness-110 active:scale-[0.99]">{{ copy.login }}</button>
        </form>

        <div v-if="message" class="mt-4 rounded-2xl border p-3 text-sm" :class="messageTone === 'success' ? 'border-emerald-300/30 bg-emerald-950/30 text-emerald-100' : messageTone === 'error' ? 'border-red-300/30 bg-red-950/30 text-red-100' : 'border-white/10 bg-slate-950/60 text-slate-200'">{{ message }}</div>

        <p class="mt-5 text-center text-sm text-slate-300">
          {{ copy.needAccount }}
          <NuxtLink to="/auth/register" class="font-semibold text-amber-200 underline-offset-4 hover:underline">{{ copy.create }}</NuxtLink>
        </p>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
const {locale}=useI18n();
const messages={en:{member:'Member access',title:'Login to IWBIF',intro:'Access your dashboard, tickets, payment status, and event updates.',email:'Email',password:'Password',passwordPlaceholder:'Enter your password',forgotPassword:'Forgot password?',resetSuccess:'Your password has been reset. You can now log in with your new password.',login:'Log In',needAccount:'Need an account?',create:'Create one',input:'Input',invalid:'Invalid value',processError:'Login could not be processed.',required:'Enter your email address and password.',invalidEmail:'Enter a valid email address.',passwordLength:'Password must be at least 8 characters long.',submitting:'Submitting login...',success:'Login successful.',failed:'Failed'},'zh-CN':{member:'会员入口',title:'登录 IWBIF',intro:'访问您的用户中心、门票、付款状态和活动更新。',email:'电子邮箱',password:'密码',passwordPlaceholder:'请输入密码',forgotPassword:'忘记密码？',resetSuccess:'密码已重置。您现在可以使用新密码登录。',login:'登录',needAccount:'还没有账户？',create:'创建账户',input:'输入',invalid:'无效值',processError:'无法处理登录请求。',required:'请输入电子邮箱和密码。',invalidEmail:'请输入有效的电子邮箱地址。',passwordLength:'密码长度必须至少为 8 个字符。',submitting:'正在登录…',success:'登录成功。',failed:'失败'}} as const;
const copy=computed(()=>messages[locale.value==='zh-CN'?'zh-CN':'en']);
useSeoMeta({title:()=>`${copy.value.login} | IWBIF 2026`,description:()=>copy.value.intro});
const form = reactive({ email: '', password: '' });
const { login } = useAuth();
const flow = useRegistrationFlow();
const message = ref('');
const messageTone = ref<'neutral' | 'success' | 'error'>('neutral');
const route = useRoute();

if (route.query.reset === 'success') {
  message.value = copy.value.resetSuccess;
  messageTone.value = 'success';
}
const isValidEmail = (value: string) => {
  const parts = value.split('@');
  return parts.length === 2 && Boolean(parts[0]) && Boolean(parts[1]?.includes('.')) && !value.includes(' ');
};

type ValidationError = { loc?: Array<string | number>; msg?: string };
type ApiErrorPayload = {
  detail?: ValidationError[];
  errors?: Array<{ message?: string }>;
  message?: string;
};
type ApiError = { data?: ApiErrorPayload; response?: { _data?: ApiErrorPayload } };

const getLoginErrorMessage = (error: unknown) => {
  const apiError = error as ApiError;
  const payload = apiError.data ?? apiError.response?._data;
  const details = payload?.detail;

  if (Array.isArray(details) && details.length) {
    return details
      .map((detail) => `${detail.loc?.at(-1) ?? copy.value.input}: ${detail.msg ?? copy.value.invalid}`)
      .join('. ');
  }

  return payload?.errors?.find((item) => item.message)?.message
    || payload?.message
    || (error instanceof Error ? error.message : copy.value.processError);
};

const onSubmit = async () => {
  if (!form.email || !form.password) {
    message.value = copy.value.required;
    messageTone.value = 'error';
    return;
  }

  if (!isValidEmail(form.email)) {
    message.value = copy.value.invalidEmail;
    messageTone.value = 'error';
    return;
  }

  if (form.password.length < 8) {
    message.value = copy.value.passwordLength;
    messageTone.value = 'error';
    return;
  }

  message.value = copy.value.submitting;
  messageTone.value = 'neutral';

  try {
    const result = await login(form);
    if (result.success) {
      message.value = copy.value.success;
      messageTone.value = 'success';
      await navigateTo(flow.ctaTo.value);
      return;
    }

    message.value = `${copy.value.failed}: ${result.message}`;
    messageTone.value = 'error';
  } catch (error) {
    message.value = `${copy.value.failed}: ${getLoginErrorMessage(error)}`;
    messageTone.value = 'error';
  }
};
</script>

<style scoped>
.login-shell {
  min-height: calc(100vh - 140px);
  background: radial-gradient(circle at top, rgba(216, 172, 89, 0.12), transparent 24rem), linear-gradient(180deg, #031127 0%, #061a35 48%, #020e21 100%);
}
.login-toast {
  position: fixed;
  top: 5.5rem;
  right: 1rem;
  z-index: 60;
  width: min(24rem, calc(100vw - 2rem));
  border: 1px solid rgba(252, 165, 165, 0.5);
  border-radius: 0.75rem;
  background: rgba(69, 10, 10, 0.96);
  padding: 0.875rem 1rem;
  color: #fee2e2;
  box-shadow: 0 18px 38px rgba(0, 0, 0, 0.35);
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
    padding: 1.1rem 1rem;
  }

  .login-card h1 {
    font-size: clamp(2rem, 9vw, 2.9rem);
    line-height: 1.08;
  }

  .login-card input,
  .login-card button {
    font-size: 1rem;
  }
}
</style>
