<template>
  <section class="mx-auto max-w-2xl px-3 py-10 sm:px-6 lg:px-8">
    <p class="text-sm uppercase tracking-[.35em] text-cyan-200">{{ copy.eyebrow }}</p>
    <h1 class="mt-3 text-3xl font-black sm:text-4xl">{{ copy.title }}</h1>
    <p class="mt-3 text-sm leading-7 text-slate-300">{{ copy.description }}</p>

    <form class="glass-card mt-8 space-y-4 rounded-[2rem] p-5 sm:p-7" novalidate @submit.prevent="submit">
      <label class="field"><span>{{ copy.current }}</span><input v-model="form.current_password" type="password" autocomplete="current-password" minlength="8" maxlength="128" required /></label>
      <label class="field"><span>{{ copy.newPassword }}</span><input v-model="form.new_password" type="password" autocomplete="new-password" minlength="8" maxlength="128" required /></label>
      <label class="field"><span>{{ copy.confirm }}</span><input v-model="form.confirm_password" type="password" autocomplete="new-password" minlength="8" maxlength="128" required /></label>
      <button class="w-full rounded-full bg-cyan-300 px-5 py-3 font-bold text-slate-950 disabled:opacity-50" :disabled="saving">{{ saving ? copy.updating : copy.update }}</button>
    </form>

    <p v-if="feedback" class="mt-5 rounded-2xl border p-4 text-sm" :class="success ? 'border-emerald-300/30 bg-emerald-950/30 text-emerald-100' : 'border-red-300/30 bg-red-950/30 text-red-100'">{{ feedback }}</p>
  </section>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'auth' });
const { locale } = useI18n();
const messages = { en: { eyebrow: 'Account security', title: 'Change password', description: 'Enter your current password, then choose a new password of at least eight characters.', current: 'Current password', newPassword: 'New password', confirm: 'Confirm new password', updating: 'Updating…', update: 'Update password', error: 'Password could not be updated.', mismatch: 'New password and confirmation do not match.', same: 'The new password must be different from the current password.', success: 'Password updated successfully.', seo: 'Change Password' }, zh: { eyebrow: '账户安全', title: '修改密码', description: '请输入当前密码，然后设置一个至少八个字符的新密码。', current: '当前密码', newPassword: '新密码', confirm: '确认新密码', updating: '正在更新…', update: '更新密码', error: '无法更新密码。', mismatch: '新密码与确认密码不一致。', same: '新密码必须与当前密码不同。', success: '密码已成功更新。', seo: '修改密码' } } as const;
const copy = computed(() => locale.value === 'zh-CN' ? messages.zh : messages.en);
const validationCopy = computed(() => locale.value === 'zh-CN'
  ? { required: '请填写所有密码字段。', length: '每个密码必须至少包含 8 个字符。' }
  : { required: 'Complete all password fields.', length: 'Each password must contain at least 8 characters.' });
useSeoMeta({ title: () => `${copy.value.seo} | IWBIF 2026` });

const { changePassword } = useAuth();
const form = reactive({ current_password: '', new_password: '', confirm_password: '' });
const saving = ref(false);
const success = ref(false);
const feedback = ref('');

const apiError = (error: unknown) => {
  const value = error as { data?: { message?: string; errors?: Array<{ message: string }> } };
  return value.data?.errors?.[0]?.message || value.data?.message || (error instanceof Error ? error.message : copy.value.error);
};

const submit = async () => {
  feedback.value = '';
  success.value = false;
  if (!form.current_password || !form.new_password || !form.confirm_password) {
    feedback.value = validationCopy.value.required;
    return;
  }
  if ([form.current_password, form.new_password, form.confirm_password].some(value => value.length < 8)) {
    feedback.value = validationCopy.value.length;
    return;
  }
  if (form.new_password !== form.confirm_password) {
    feedback.value = copy.value.mismatch;
    return;
  }
  if (form.new_password === form.current_password) {
    feedback.value = copy.value.same;
    return;
  }
  saving.value = true;
  try {
    await changePassword(form);
    success.value = true;
    feedback.value = copy.value.success;
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
