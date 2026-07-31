<template>
  <section>
    <h1 class="text-3xl font-bold text-white">Dashboard Peserta</h1>
    <p class="mt-2 text-slate-300">Ini area private untuk peserta setelah login.</p>

    <div class="mt-6 grid gap-4 md:grid-cols-2">
      <NuxtLink to="/dashboard/payment" class="rounded-2xl border border-white/10 bg-white/5 p-4">
        <p class="text-sm uppercase tracking-[0.25em] text-slate-400">Payment</p>
        <p class="mt-2 text-lg font-semibold text-white">Buat transaksi Midtrans</p>
      </NuxtLink>
      <NuxtLink to="/register" class="rounded-2xl border border-white/10 bg-white/5 p-4">
        <p class="text-sm uppercase tracking-[0.25em] text-slate-400">Registration</p>
        <p class="mt-2 text-lg font-semibold text-white">Isi profil dan registrasi</p>
      </NuxtLink>
    </div>
  </section>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'auth' });
</script>
