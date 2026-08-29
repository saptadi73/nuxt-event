<template>
  <main class="auth-shell">
    <section class="mx-auto max-w-5xl px-3 py-10 sm:px-6 lg:px-8">
      <div class="auth-card mx-auto max-w-md rounded-[2rem] border border-white/10 bg-gradient-to-br from-slate-950/80 via-slate-950/70 to-slate-900/70 p-5 shadow-[0_28px_60px_rgba(0,0,0,0.35)] sm:p-8">
        <div class="mb-4 inline-flex rounded-full border border-amber-200/20 bg-amber-300/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[.28em] text-amber-200">{{ copy.create }}</div>
        <h1 class="mt-3 text-3xl font-black text-white sm:text-4xl">{{ copy.title }}</h1>
        <p class="mt-3 text-sm leading-7 text-slate-300">{{ copy.intro }}</p>

        <form class="mt-6 space-y-4" novalidate @submit.prevent="onSubmit">
          <label class="block">
            <span class="mb-2 block text-sm text-slate-300">{{ copy.fullName }}</span>
            <input v-model="form.full_name" class="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white placeholder:text-slate-500 transition focus:border-amber-300/60 focus:outline-none focus:ring-2 focus:ring-amber-300/20" :placeholder="copy.fullNamePlaceholder" required />
          </label>

          <label class="block">
            <span class="mb-2 block text-sm text-slate-300">{{ copy.email }}</span>
            <input v-model.trim="form.email" type="email" autocomplete="email" class="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white placeholder:text-slate-500 transition focus:border-amber-300/60 focus:outline-none focus:ring-2 focus:ring-amber-300/20" placeholder="you@example.com" required />
          </label>

          <div class="space-y-4">
            <label class="block">
              <span class="mb-2 block text-sm text-slate-300">{{ copy.country }}</span>
              <select v-model="form.country" autocomplete="country-name" class="registration-field w-full" required>
                <optgroup :label="copy.mostSelected">
                  <option v-for="country in priorityCountries" :key="country.iso" :value="country.name">{{ country.name }}</option>
                </optgroup>
                <optgroup label="──────────">
                  <option v-for="country in otherCountries" :key="country.iso" :value="country.name">{{ country.name }}</option>
                </optgroup>
              </select>
            </label>

            <label class="block">
              <span class="mb-2 block text-sm text-slate-300">{{ copy.phone }}</span>
              <div class="phone-field flex overflow-hidden rounded-2xl border border-white/10 bg-slate-950/80 transition focus-within:border-amber-300/60 focus-within:ring-2 focus-within:ring-amber-300/20">
                <select v-model="form.phoneCountryIso" :aria-label="copy.phoneCode" class="phone-country min-w-32 border-r border-white/10 bg-slate-950 px-3 py-3 text-white focus:outline-none">
                  <optgroup :label="copy.mostSelected">
                    <option v-for="country in priorityCountries" :key="country.iso" :value="country.iso">{{ countryFlag(country.iso) }} {{ country.iso }} {{ country.dialCode }}</option>
                  </optgroup>
                  <optgroup label="──────────">
                    <option v-for="country in otherCountries" :key="country.iso" :value="country.iso">{{ countryFlag(country.iso) }} {{ country.iso }} {{ country.dialCode }}</option>
                  </optgroup>
                </select>
                <span class="flex items-center pl-3 text-sm font-semibold text-slate-300">{{ selectedPhoneCountry.dialCode }}</span>
                <input v-model.trim="form.phoneLocal" type="tel" inputmode="numeric" autocomplete="tel-national" minlength="5" class="min-w-0 flex-1 bg-transparent px-3 py-3 text-white placeholder:text-slate-500 focus:outline-none" placeholder="812 3456 7890" required />
              </div>
              <span class="mt-1.5 block text-xs text-slate-500">{{ copy.phoneHelp }}</span>
            </label>
          </div>

          <label class="block">
            <span class="mb-2 block text-sm text-slate-300">{{ copy.password }}</span>
            <input v-model="form.password" type="password" autocomplete="new-password" minlength="8" maxlength="128" class="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white placeholder:text-slate-500 transition focus:border-amber-300/60 focus:outline-none focus:ring-2 focus:ring-amber-300/20" :placeholder="copy.passwordPlaceholder" required />
          </label>

          <label class="block">
            <span class="mb-2 block text-sm text-slate-300">{{ copy.confirmPassword }}</span>
            <input v-model="form.confirmPassword" type="password" autocomplete="new-password" minlength="8" maxlength="128" class="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white placeholder:text-slate-500 transition focus:border-amber-300/60 focus:outline-none focus:ring-2 focus:ring-amber-300/20" :placeholder="copy.confirmPlaceholder" required />
          </label>

          <button type="submit" class="w-full rounded-full bg-gradient-to-r from-amber-300 to-amber-400 px-4 py-3 text-sm font-bold uppercase tracking-[.18em] text-slate-950 shadow-[0_18px_35px_rgba(216,172,89,0.22)] transition duration-200 hover:brightness-110 active:scale-[0.99]" :disabled="submitting">
            {{ submitting ? copy.creating : copy.create }}
          </button>
        </form>

        <div v-if="message" class="mt-4 rounded-2xl border p-3 text-sm" :class="messageTone === 'success' ? 'border-emerald-300/30 bg-emerald-950/30 text-emerald-100' : messageTone === 'error' ? 'border-red-300/30 bg-red-950/30 text-red-100' : 'border-white/10 bg-slate-950/60 text-slate-200'">{{ message }}</div>

        <p class="mt-5 text-center text-sm text-slate-300">
          {{ copy.haveAccount }}
          <NuxtLink to="/auth/login" class="font-semibold text-amber-200 underline-offset-4 hover:underline">{{ copy.login }}</NuxtLink>
        </p>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { countryFlag, countryOptions, otherCountries, priorityCountries } from '~/config/countries';

const {locale}=useI18n();
const messages={en:{create:'Create account',title:'Register your IWBIF account',intro:'Create your user account first, then choose your package and continue securely to checkout.',fullName:'Full name',fullNamePlaceholder:'Your full name',email:'Email',country:'Country',mostSelected:'Most selected',phone:'Mobile phone',phoneCode:'Phone country code',phoneHelp:'Enter the number without the country code.',password:'Password',passwordPlaceholder:'Minimum 8 characters',confirmPassword:'Confirm password',confirmPlaceholder:'Re-enter your password',creating:'Creating account...',haveAccount:'Already have an account?',login:'Log in',required:'Complete all required fields.',invalidEmail:'Enter a valid email address.',phoneLength:'Enter a valid mobile phone number.',passwordLength:'Password must be at least 8 characters long.',passwordMismatch:'Passwords do not match.',success:'Account created successfully. Redirecting to package selection...',failed:'Account creation failed.'},'zh-CN':{create:'创建账户',title:'注册您的 IWBIF 账户',intro:'请先创建用户账户，然后选择套餐并安全进入结账流程。',fullName:'姓名',fullNamePlaceholder:'请输入您的姓名',email:'电子邮箱',country:'国家或地区',mostSelected:'常用选项',phone:'手机号码',phoneCode:'电话国家或地区代码',phoneHelp:'请输入不含国家或地区代码的号码。',password:'密码',passwordPlaceholder:'至少 8 个字符',confirmPassword:'确认密码',confirmPlaceholder:'请再次输入密码',creating:'正在创建账户…',haveAccount:'已有账户？',login:'登录',required:'请填写所有必填字段。',invalidEmail:'请输入有效的电子邮箱地址。',phoneLength:'请输入有效的手机号码。',passwordLength:'密码长度必须至少为 8 个字符。',passwordMismatch:'两次输入的密码不一致。',success:'账户创建成功。正在跳转至套餐选择…',failed:'账户创建失败。'}} as const;
const copy=computed(()=>messages[locale.value==='zh-CN'?'zh-CN':'en']);
useSeoMeta({title:()=>`${copy.value.create} | IWBIF 2026`,description:()=>copy.value.intro});

const form = reactive({
  full_name: '',
  email: '',
  country: 'Indonesia',
  phoneCountryIso: 'ID',
  phoneLocal: '',
  password: '',
  confirmPassword: ''
});
const { register } = useAuth();
const flow = useRegistrationFlow();
const submitting = ref(false);
const message = ref('');
const messageTone = ref<'neutral' | 'success' | 'error'>('neutral');
const isValidEmail = (value: string) => {
  const parts = value.split('@');
  return parts.length === 2 && Boolean(parts[0]) && Boolean(parts[1]?.includes('.')) && !value.includes(' ');
};
const selectedPhoneCountry = computed(() => countryOptions.find(country => country.iso === form.phoneCountryIso) || countryOptions[0]!);
const internationalPhone = computed(() => {
  const dialDigits = selectedPhoneCountry.value.dialCode.replace(/\D/g, '');
  let localNumber = form.phoneLocal.replace(/\D/g, '').replace(/^0+/, '');
  if (localNumber.startsWith(dialDigits)) localNumber = localNumber.slice(dialDigits.length);
  return `${selectedPhoneCountry.value.dialCode}${localNumber}`;
});

watch(() => form.country, (countryName) => {
  const country = countryOptions.find(option => option.name === countryName);
  if (country) form.phoneCountryIso = country.iso;
});

const onSubmit = async () => {
  if (!form.full_name.trim() || !form.email || !form.country || !form.phoneLocal || !form.password || !form.confirmPassword) {
    message.value = copy.value.required;
    messageTone.value = 'error';
    return;
  }

  if (!isValidEmail(form.email)) {
    message.value = copy.value.invalidEmail;
    messageTone.value = 'error';
    return;
  }

  if (form.phoneLocal.replace(/\D/g, '').length < 5) {
    message.value = copy.value.phoneLength;
    messageTone.value = 'error';
    return;
  }

  if (form.password.length < 8) {
    message.value = copy.value.passwordLength;
    messageTone.value = 'error';
    return;
  }

  if (form.password !== form.confirmPassword) {
    message.value = copy.value.passwordMismatch;
    messageTone.value = 'error';
    return;
  }

  submitting.value = true;
  message.value = copy.value.creating;
  messageTone.value = 'neutral';

  try {
    const result = await register({
      email: form.email,
      full_name: form.full_name,
      country: form.country,
      phone: internationalPhone.value,
      password: form.password,
      preferred_locale: locale.value === 'zh-CN' ? 'zh-CN' : 'en'
    });

    if (result.success) {
      await flow.loadFlow(true);
      message.value = copy.value.success;
      messageTone.value = 'success';
      await navigateTo(flow.ctaTo.value);
      return;
    }

    message.value = result.message || copy.value.failed;
    messageTone.value = 'error';
  } catch (error) {
    message.value = error instanceof Error ? error.message : copy.value.failed;
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
.registration-field {
  border: 1px solid rgb(255 255 255 / 10%);
  border-radius: 1rem;
  background: rgb(2 6 23 / 80%);
  padding: .75rem 1rem;
  color: white;
  transition: border-color .2s ease, box-shadow .2s ease;
}
.registration-field:focus {
  border-color: rgb(252 211 77 / 60%);
  outline: none;
  box-shadow: 0 0 0 2px rgb(252 211 77 / 20%);
}
.registration-field option,
.registration-field optgroup,
.phone-country option,
.phone-country optgroup {
  background: #020617;
  color: white;
}

@media (max-width: 767px) {
  .auth-shell {
    padding-inline: 0.75rem;
  }

  .auth-card {
    border-radius: 1.5rem;
    padding: 1.1rem 1rem;
  }

  .auth-card h1 {
    font-size: clamp(2rem, 9vw, 2.9rem);
    line-height: 1.08;
  }

  .auth-card input,
  .auth-card button {
    font-size: 1rem;
  }

  .auth-card .grid {
    grid-template-columns: 1fr;
  }
}
</style>
