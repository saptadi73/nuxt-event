<template>
  <section class="mx-auto max-w-2xl px-3 py-10 sm:px-6 lg:px-8">
    <p class="text-sm uppercase tracking-[.35em] text-cyan-200">Account security</p>
    <h1 class="mt-3 text-3xl font-black sm:text-4xl">Change password</h1>
    <p class="mt-3 text-sm leading-7 text-slate-300">Enter your current password, then choose a new password of at least eight characters.</p>

    <form class="glass-card mt-8 space-y-4 rounded-[2rem] p-5 sm:p-7" @submit.prevent="submit">
      <label class="field"><span>Current password</span><input v-model="form.current_password" type="password" autocomplete="current-password" minlength="8" maxlength="128" required /></label>
      <label class="field"><span>New password</span><input v-model="form.new_password" type="password" autocomplete="new-password" minlength="8" maxlength="128" required /></label>
      <label class="field"><span>Confirm new password</span><input v-model="form.confirm_password" type="password" autocomplete="new-password" minlength="8" maxlength="128" required /></label>
      <button class="w-full rounded-full bg-cyan-300 px-5 py-3 font-bold text-slate-950 disabled:opacity-50" :disabled="saving">{{ saving ? 'Updating...' : 'Update password' }}</button>
    </form>

    <p v-if="feedback" class="mt-5 rounded-2xl border p-4 text-sm" :class="success ? 'border-emerald-300/30 bg-emerald-950/30 text-emerald-100' : 'border-red-300/30 bg-red-950/30 text-red-100'">{{ feedback }}</p>
  </section>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'auth' });
useSeoMeta({ title: 'Change Password | IWBIF 2026' });

const { changePassword } = useAuth();
const form = reactive({ current_password: '', new_password: '', confirm_password: '' });
const saving = ref(false);
const success = ref(false);
const feedback = ref('');

const apiError = (error: unknown) => {
  const value = error as { data?: { message?: string; errors?: Array<{ message: string }> } };
  return value.data?.errors?.[0]?.message || value.data?.message || (error instanceof Error ? error.message : 'Password could not be updated.');
};

const submit = async () => {
  feedback.value = '';
  success.value = false;
  if (form.new_password !== form.confirm_password) {
    feedback.value = 'New password and confirmation do not match.';
    return;
  }
  if (form.new_password === form.current_password) {
    feedback.value = 'The new password must be different from the current password.';
    return;
  }
  saving.value = true;
  try {
    await changePassword(form);
    success.value = true;
    feedback.value = 'Password updated successfully.';
    Object.assign(form, { current_password: '', new_password: '', confirm_password: '' });
  } catch (error) {
    feedback.value = apiError(error);
  } finally {
    saving.value = false;
  }
};
</script>

<style scoped>
.field { display: block; font-size: .875rem; color: #cbd5e1; }
.field span { display: block; margin-bottom: .5rem; }
.field input { width: 100%; border: 1px solid rgba(255,255,255,.1); border-radius: 1rem; background: rgba(2,6,23,.78); padding: .75rem 1rem; color: white; outline: none; }
.field input:focus { border-color: rgba(103,232,249,.5); }
</style>
