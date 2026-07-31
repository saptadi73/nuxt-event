<template>
  <section class="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
    <div class="glass-card rounded-[2rem] p-6">
      <p class="text-sm uppercase tracking-[0.3em] text-cyan-200/70">Midtrans</p>
      <h1 class="mt-3 text-4xl font-bold text-white">Buat transaksi pembayaran</h1>
      <p class="mt-3 text-slate-300">
        Gunakan halaman ini untuk membuat transaksi via `POST /payments/midtrans/create` dan mendapatkan snap token.
      </p>

      <form class="mt-8 grid gap-5 md:grid-cols-[1fr_auto] md:items-end" @submit.prevent="create">
        <label class="grid gap-2">
          <span class="text-sm text-slate-300">Registration ID</span>
          <input
            v-model="registrationId"
            required
            class="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none"
            placeholder="uuid registrasi"
          />
        </label>
        <button
          class="rounded-full bg-cyan-400 px-6 py-3 text-sm font-semibold text-slate-950 disabled:cursor-not-allowed disabled:opacity-60"
          :disabled="submitting"
        >
          {{ submitting ? 'Membuat transaksi...' : 'Buat Transaksi' }}
        </button>
      </form>

      <div v-if="result" class="mt-8 space-y-3 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-200">
        <p class="text-white font-semibold">Snap Token: {{ result.snap_token }}</p>
        <p>Redirect URL: {{ result.redirect_url }}</p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { usePayment } from '~/composables/usePayment';

definePageMeta({ middleware: 'auth' });

const { createMidtransTransaction } = usePayment();

const registrationId = ref('');
const submitting = ref(false);
const result = ref<{ snap_token: string; redirect_url: string } | null>(null);

const create = async () => {
  submitting.value = true;
  result.value = null;

  try {
    const response = await createMidtransTransaction(registrationId.value);
    result.value = response.data;
  } catch (error) {
    if (error instanceof Error) {
      result.value = { snap_token: '-', redirect_url: error.message };
    } else {
      result.value = { snap_token: '-', redirect_url: 'Unknown error' };
    }
  } finally {
    submitting.value = false;
  }
};
</script>
