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
            <input v-model.trim="form.email" type="email" autocomplete="email" class="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white placeholder:text-slate-500 transition focus:border-amber-300/60 focus:outline-none focus:ring-2 focus:ring-amber-300/20" placeholder="you@example.com" required />
          </label>

          <div class="space-y-4">
            <label class="block">
              <span class="mb-2 block text-sm text-slate-300">Country</span>
              <select v-model="form.country" autocomplete="country-name" class="registration-field w-full" required>
                <optgroup label="Most selected">
                  <option v-for="country in priorityCountries" :key="country.iso" :value="country.name">{{ country.name }}</option>
                </optgroup>
                <optgroup label="──────────">
                  <option v-for="country in otherCountries" :key="country.iso" :value="country.name">{{ country.name }}</option>
                </optgroup>
              </select>
            </label>

            <label class="block">
              <span class="mb-2 block text-sm text-slate-300">Mobile phone</span>
              <div class="phone-field flex overflow-hidden rounded-2xl border border-white/10 bg-slate-950/80 transition focus-within:border-amber-300/60 focus-within:ring-2 focus-within:ring-amber-300/20">
                <select v-model="form.phoneCountryIso" aria-label="Phone country code" class="phone-country min-w-32 border-r border-white/10 bg-slate-950 px-3 py-3 text-white focus:outline-none">
                  <optgroup label="Most selected">
                    <option v-for="country in priorityCountries" :key="country.iso" :value="country.iso">{{ countryFlag(country.iso) }} {{ country.iso }} {{ country.dialCode }}</option>
                  </optgroup>
                  <optgroup label="──────────">
                    <option v-for="country in otherCountries" :key="country.iso" :value="country.iso">{{ countryFlag(country.iso) }} {{ country.iso }} {{ country.dialCode }}</option>
                  </optgroup>
                </select>
                <span class="flex items-center pl-3 text-sm font-semibold text-slate-300">{{ selectedPhoneCountry.dialCode }}</span>
                <input v-model.trim="form.phoneLocal" type="tel" inputmode="numeric" autocomplete="tel-national" minlength="5" class="min-w-0 flex-1 bg-transparent px-3 py-3 text-white placeholder:text-slate-500 focus:outline-none" placeholder="812 3456 7890" required />
              </div>
              <span class="mt-1.5 block text-xs text-slate-500">Enter the number without the country code.</span>
            </label>
          </div>

          <label class="block">
            <span class="mb-2 block text-sm text-slate-300">Password</span>
            <input v-model="form.password" type="password" autocomplete="new-password" minlength="8" maxlength="128" class="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white placeholder:text-slate-500 transition focus:border-amber-300/60 focus:outline-none focus:ring-2 focus:ring-amber-300/20" placeholder="Minimum 8 characters" required />
          </label>

          <label class="block">
            <span class="mb-2 block text-sm text-slate-300">Confirm password</span>
            <input v-model="form.confirmPassword" type="password" autocomplete="new-password" minlength="8" maxlength="128" class="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white placeholder:text-slate-500 transition focus:border-amber-300/60 focus:outline-none focus:ring-2 focus:ring-amber-300/20" placeholder="Re-enter your password" required />
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
import { countryFlag, countryOptions, otherCountries, priorityCountries } from '~/config/countries';

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
      country: form.country,
      phone: internationalPhone.value,
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
