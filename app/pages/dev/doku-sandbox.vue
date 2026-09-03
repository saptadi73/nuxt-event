<template>
  <section class="mx-auto max-w-5xl px-3 py-10 sm:px-6">
    <header class="rounded-[2rem] border border-cyan-300/20 bg-gradient-to-br from-cyan-300/10 via-slate-950 to-slate-950 p-6 sm:p-8">
      <div>
        <p class="text-xs font-bold uppercase tracking-[.3em] text-cyan-200">Secure checkout</p>
        <h1 class="mt-3 text-3xl font-black sm:text-5xl">DOKU Payment</h1>
      </div>
      <p class="mt-4 max-w-3xl text-sm leading-7 text-slate-300">Pilih package, periksa detail pesanan, lalu selesaikan pembayaran melalui metode pembayaran yang tersedia.</p>
    </header>

    <ol class="mt-6 grid gap-3 sm:grid-cols-4">
      <li v-for="(label, index) in steps" :key="label" class="rounded-2xl border px-4 py-3 text-sm" :class="index <= step ? 'border-cyan-300/40 bg-cyan-300/10 text-cyan-100' : 'border-white/10 text-slate-500'"><b class="mr-2">{{ index + 1 }}</b>{{ label }}</li>
    </ol>

    <div v-if="step === 0" class="mt-7 space-y-6">
      <section>
        <p class="text-xs font-bold uppercase tracking-[.25em] text-amber-200">Main package · wajib satu</p>
        <div class="mt-4 grid gap-4 sm:grid-cols-2">
          <button v-for="item in mainPackages" :key="item.id" type="button" class="rounded-3xl border p-5 text-left transition" :class="mainId === item.id ? 'border-amber-300 bg-amber-300/10' : 'border-white/10 bg-white/5 hover:border-white/25'" @click="mainId = item.id">
            <span class="text-xs font-bold uppercase text-amber-200">{{ item.code }}</span><strong class="mt-2 block text-xl">{{ item.name }}</strong><span class="mt-3 block text-2xl font-black">{{ usd(item.usd) }}</span><span class="mt-1 block text-sm text-slate-400">Payment {{ idr(item.idr) }}</span>
          </button>
        </div>
      </section>
      <section>
        <p class="text-xs font-bold uppercase tracking-[.25em] text-cyan-200">Additional package · opsional</p>
        <label class="mt-4 flex cursor-pointer items-start gap-3 rounded-3xl border p-5 transition" :class="additionalSelected ? 'border-cyan-300 bg-cyan-300/10' : 'border-white/10 bg-white/5'"><input v-model="additionalSelected" type="checkbox" class="mt-1 h-5 w-5 accent-cyan-300"><span><strong class="block text-xl">Bandung Business Trip</strong><span class="mt-2 block text-2xl font-black">{{ usd(additional.usd) }}</span><span class="mt-1 block text-sm text-slate-400">Payment {{ idr(additional.idr) }}</span></span></label>
      </section>
      <button class="w-full rounded-full bg-amber-300 px-6 py-3 font-bold text-slate-950 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto" :disabled="!mainId" @click="step = 1">Review order →</button>
    </div>

    <section v-else-if="step === 1" class="mt-7 rounded-3xl border border-white/10 bg-white/5 p-6">
      <p class="text-xs font-bold uppercase tracking-[.25em] text-amber-200">Order summary</p><h2 class="mt-2 text-2xl font-black">Review package</h2>
      <ul class="mt-5 space-y-3"><li v-for="item in selectedItems" :key="item.id" class="flex justify-between gap-4 border-b border-white/10 pb-3"><span>{{ item.name }}</span><strong>{{ usd(item.usd) }}</strong></li></ul>
      <div class="mt-5 flex justify-between text-xl"><span>Total display</span><strong class="text-amber-200">{{ usd(totalUsd) }}</strong></div>
      <div class="mt-2 flex justify-between text-sm text-slate-400"><span>Nominal payment DOKU</span><strong>{{ idr(totalIdr) }}</strong></div>
      <div class="mt-7 flex flex-wrap gap-3"><button class="rounded-full border border-white/20 px-5 py-3" @click="step = 0">← Ubah package</button><button class="rounded-full bg-amber-300 px-6 py-3 font-bold text-slate-950" @click="createOrder">Lanjutkan pembayaran →</button></div>
    </section>

    <section v-else-if="step === 2" class="mt-7 rounded-3xl border border-white/10 bg-white/5 p-6">
      <p class="text-xs font-bold uppercase tracking-[.25em] text-cyan-200">DOKU checkout</p><h2 class="mt-2 text-2xl font-black">Pilih metode pembayaran</h2><p class="mt-2 text-sm text-slate-400">Order {{ orderNumber }} · {{ idr(totalIdr) }}</p>
      <div class="mt-5 grid gap-3 sm:grid-cols-3"><button v-for="method in methods" :key="method" class="rounded-2xl border p-4 font-semibold" :class="paymentMethod === method ? 'border-cyan-300 bg-cyan-300/10 text-cyan-100' : 'border-white/10'" @click="paymentMethod = method">{{ method }}</button></div>
      <div class="mt-7 flex flex-wrap gap-3"><button class="rounded-full border border-white/20 px-5 py-3" @click="step = 1">← Kembali</button><button class="rounded-full bg-cyan-300 px-6 py-3 font-bold text-slate-950 disabled:opacity-50" :disabled="!paymentMethod || processing" @click="simulatePayment">{{ processing ? 'Memproses pembayaran…' : 'Bayar sekarang →' }}</button></div>
    </section>

    <section v-else class="mt-7 rounded-3xl border border-emerald-300/30 bg-emerald-300/10 p-7 text-center">
      <div class="mx-auto grid h-16 w-16 place-items-center rounded-full bg-emerald-300 text-3xl font-black text-slate-950">✓</div><p class="mt-5 text-xs font-bold uppercase tracking-[.25em] text-emerald-200">Payment successful</p><h2 class="mt-2 text-3xl font-black">Pembayaran berhasil</h2><p class="mt-3 text-slate-300">{{ orderNumber }} · {{ paymentMethod }} · {{ idr(totalIdr) }}</p><button class="mt-7 rounded-full border border-emerald-200/30 px-6 py-3 font-bold" @click="reset">Buat pembayaran baru</button>
    </section>
  </section>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: () => {
    if (!import.meta.dev) return abortNavigation({ statusCode: 404, statusMessage: 'Page not found' });
  }
});

interface PaymentPackage { id: string; code?: string; name: string; usd: number; idr: number }
const steps = ['Packages', 'Review', 'DOKU', 'Paid'];
const mainPackages: PaymentPackage[] = [
  { id: 'main-a', code: 'Package A', name: 'Jakarta Delegate · Sharing', usd: 500, idr: 8_000_000 },
  { id: 'main-b', code: 'Package B', name: 'Jakarta Delegate · Single', usd: 700, idr: 11_200_000 }
];
const additional: PaymentPackage = { id: 'additional-bandung', name: 'Bandung Business Trip', usd: 200, idr: 3_200_000 };
const methods = ['Virtual Account', 'QRIS', 'E-Wallet'];
const step = ref(0), mainId = ref(''), additionalSelected = ref(false), paymentMethod = ref(''), processing = ref(false), orderNumber = ref('');
const selectedItems = computed(() => [...mainPackages.filter(item => item.id === mainId.value), ...(additionalSelected.value ? [additional] : [])]);
const totalUsd = computed(() => selectedItems.value.reduce((sum, item) => sum + item.usd, 0));
const totalIdr = computed(() => selectedItems.value.reduce((sum, item) => sum + item.idr, 0));
const usd = (value: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);
const idr = (value: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(value);
const createOrder = () => { orderNumber.value = `DOKU-${Date.now().toString().slice(-8)}`; step.value = 2; };
const simulatePayment = async () => { processing.value = true; await new Promise(resolve => setTimeout(resolve, 800)); processing.value = false; step.value = 3; };
const reset = () => { step.value = 0; mainId.value = ''; additionalSelected.value = false; paymentMethod.value = ''; orderNumber.value = ''; };
useSeoMeta({ title: 'DOKU Payment | IWBIF 2026', robots: 'noindex, nofollow' });
</script>
