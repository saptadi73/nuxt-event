<template>
  <div class="mx-auto max-w-md">
    <h1 class="text-3xl font-bold">Login</h1>

    <form @submit.prevent="onSubmit" class="mt-4 space-y-3">
      <label class="block">
        <span class="mb-1 block text-sm text-slate-300">Email</span>
        <input v-model="form.email" class="w-full rounded border border-white/10 bg-slate-900 px-3 py-2" placeholder="email" required />
      </label>

      <label class="block">
        <span class="mb-1 block text-sm text-slate-300">Password</span>
        <input v-model="form.password" type="password" class="w-full rounded border border-white/10 bg-slate-900 px-3 py-2" placeholder="password" required />
      </label>

      <button type="submit" class="rounded bg-blue-500 px-4 py-2">Masuk</button>
    </form>

    <div v-if="message" class="mt-3 text-sm">{{ message }}</div>
  </div>
</template>

<script setup lang="ts">
const form = reactive({ email: '', password: '' });
const { login } = useAuth();
const message = ref('');

const onSubmit = async () => {
  message.value = 'Mengirim login...';
  try {
    const result = await login(form);
    if (result.success) {
      message.value = 'Login sukses, token tersimpan. Mengarahkan ke dashboard...';
      await navigateTo('/dashboard');
      return;
    }

    message.value = `Gagal: ${result.message}`;
  } catch (error) {
    message.value = `Gagal: ${error instanceof Error ? error.message : 'Login tidak dapat diproses.'}`;
  }
};
</script>
