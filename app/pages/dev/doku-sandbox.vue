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
      <div class="mt-5 grid gap-3 sm:grid-cols-3"><button v-for="method in methods" :key="method" class="rounded-2xl border p-4 font-semibold" :class="paymentMethod === method ? 'border-cyan-300 bg-cyan-300/10 text-cyan-100' : 'border-white/10'" @click="selectPaymentMethod(method)">{{ method }}</button></div>

      <section v-if="paymentMethod === 'Virtual Account'" class="mt-7 border-t border-white/10 pt-7">
        <p class="text-xs font-bold uppercase tracking-[.25em] text-cyan-200">Virtual Account</p>
        <h3 class="mt-2 text-xl font-black">Pilih bank</h3>
        <p class="mt-2 text-sm text-slate-400">Pilih bank untuk membuat nomor Virtual Account dummy.</p>
        <div class="mt-5 grid gap-3 sm:grid-cols-3">
          <button v-for="bank in banks" :key="bank.id" type="button" class="flex min-h-24 items-center justify-center rounded-2xl border bg-white p-4 transition" :class="selectedBankId === bank.id ? 'border-cyan-300 ring-2 ring-cyan-300/50' : 'border-white/10 hover:border-cyan-300/60'" @click="selectBank(bank.id)">
            <span class="sr-only">Pilih {{ bank.name }}</span>
            <span v-if="bank.id === 'bca'" class="text-2xl font-black italic tracking-tight text-[#0066ae]">BCA</span>
            <span v-else-if="bank.id === 'mandiri'" class="text-2xl font-black lowercase italic tracking-tight text-[#163c78]">mandiri<span class="text-[#fdb913]">▰</span></span>
            <span v-else class="text-2xl font-black italic tracking-tight text-[#00529c]">BANK <span class="text-[#ed1c24]">BRI</span></span>
          </button>
        </div>

        <div v-if="selectedBank" class="mt-6 rounded-3xl border border-cyan-300/30 bg-slate-950/70 p-5 sm:p-6">
          <div class="flex flex-wrap items-start justify-between gap-4">
            <div><p class="text-xs uppercase tracking-[.2em] text-slate-400">{{ selectedBank.name }} Virtual Account</p><p class="mt-2 font-mono text-2xl font-black tracking-wider text-cyan-100 sm:text-3xl">{{ selectedBank.vaNumber }}</p></div>
            <button type="button" class="rounded-full border border-cyan-200/30 px-4 py-2 text-sm font-bold text-cyan-100" @click="copyVaNumber">{{ copied ? 'Tersalin ✓' : 'Salin nomor' }}</button>
          </div>
          <div class="mt-5 grid gap-3 border-t border-white/10 pt-5 text-sm sm:grid-cols-2"><p class="text-slate-400">Total pembayaran<br><strong class="text-lg text-white">{{ idr(totalIdr) }}</strong></p><p class="text-slate-400">Status<br><strong class="text-amber-200">Menunggu pembayaran</strong></p></div>
          <p class="mt-4 text-xs text-amber-200">Nomor ini hanya untuk simulasi dan tidak dapat menerima pembayaran nyata.</p>
        </div>
      </section>

      <section v-else-if="paymentMethod === 'QRIS'" class="mt-7 border-t border-white/10 pt-7">
        <div class="mx-auto max-w-md rounded-3xl border border-cyan-300/30 bg-white p-6 text-center text-slate-900 shadow-2xl shadow-cyan-950/30">
          <p class="text-xs font-bold uppercase tracking-[.25em] text-sky-700">Pembayaran QRIS</p>
          <h3 class="mt-2 text-xl font-black">Pindai kode QR</h3>
          <p class="mt-2 text-sm text-slate-500">Gunakan aplikasi bank atau dompet digital yang mendukung QRIS.</p>
          <div class="mx-auto mt-5 grid aspect-square w-full max-w-64 place-items-center overflow-hidden rounded-2xl border border-slate-200 bg-white p-3">
            <img v-if="dummyQrisUrl" :src="dummyQrisUrl" alt="Kode QR dummy untuk simulasi pembayaran" class="h-auto w-full object-contain">
            <span v-else class="text-sm text-slate-400">Membuat QR…</span>
          </div>
          <p class="mt-5 text-sm text-slate-500">Total pembayaran</p>
          <p class="mt-1 text-2xl font-black text-slate-950">{{ idr(totalIdr) }}</p>
          <p class="mt-2 font-mono text-xs text-slate-500">{{ orderNumber }}</p>
          <p class="mt-4 rounded-xl bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-800">QR ini hanya untuk simulasi dan tidak menerima pembayaran nyata.</p>
        </div>
      </section>

      <div class="mt-7 flex flex-wrap gap-3"><button class="rounded-full border border-white/20 px-5 py-3" @click="step = 1">← Kembali</button><button class="rounded-full bg-cyan-300 px-6 py-3 font-bold text-slate-950 disabled:opacity-50" :disabled="!canSimulatePayment || processing" @click="simulatePayment">{{ paymentButtonLabel }}</button></div>
    </section>

    <section v-else class="mt-7 rounded-3xl border border-emerald-300/30 bg-emerald-300/10 p-7 text-center">
      <div class="mx-auto grid h-16 w-16 place-items-center rounded-full bg-emerald-300 text-3xl font-black text-slate-950">✓</div><p class="mt-5 text-xs font-bold uppercase tracking-[.25em] text-emerald-200">Payment successful</p><h2 class="mt-2 text-3xl font-black">Pembayaran berhasil</h2><p class="mt-3 text-slate-300">{{ orderNumber }} · {{ selectedBank ? `${selectedBank.name} Virtual Account` : paymentMethod }} · {{ idr(totalIdr) }}</p><button class="mt-7 rounded-full border border-emerald-200/30 px-6 py-3 font-bold" @click="reset">Buat pembayaran baru</button>
    </section>
  </section>
</template>

<script setup lang="ts">
import QRCode from 'qrcode';

definePageMeta({
  middleware: () => {
    if (!import.meta.dev) return abortNavigation({ statusCode: 404, statusMessage: 'Page not found' });
  }
});

interface PaymentPackage { id: string; code?: string; name: string; usd: number; idr: number }
interface VirtualAccountBank { id: string; name: string; vaNumber: string }
const steps = ['Packages', 'Review', 'DOKU', 'Paid'];
const mainPackages: PaymentPackage[] = [
  { id: 'main-a', code: 'Package A', name: 'Jakarta Delegate · Sharing', usd: 500, idr: 8_000_000 },
  { id: 'main-b', code: 'Package B', name: 'Jakarta Delegate · Single', usd: 700, idr: 11_200_000 }
];
const additional: PaymentPackage = { id: 'additional-bandung', name: 'Bandung Business Trip', usd: 200, idr: 3_200_000 };
const methods = ['Virtual Account', 'QRIS', 'E-Wallet'];
const banks: VirtualAccountBank[] = [
  { id: 'bca', name: 'BCA', vaNumber: '88008 1234 5678 901' },
  { id: 'mandiri', name: 'Mandiri', vaNumber: '89000 1234 5678 901' },
  { id: 'bri', name: 'BRI', vaNumber: '88810 1234 5678 901' }
];
const step = ref(0), mainId = ref(''), additionalSelected = ref(false), paymentMethod = ref(''), selectedBankId = ref(''), processing = ref(false), copied = ref(false), orderNumber = ref(''), dummyQrisUrl = ref('');
const selectedItems = computed(() => [...mainPackages.filter(item => item.id === mainId.value), ...(additionalSelected.value ? [additional] : [])]);
const selectedBank = computed(() => banks.find(bank => bank.id === selectedBankId.value));
const canSimulatePayment = computed(() => Boolean(paymentMethod.value) && (paymentMethod.value !== 'Virtual Account' || Boolean(selectedBank.value)));
const paymentButtonLabel = computed(() => {
  if (processing.value) return 'Memproses pembayaran…';
  if (paymentMethod.value === 'Virtual Account') return 'Simulasikan pembayaran VA →';
  if (paymentMethod.value === 'QRIS') return 'Saya sudah scan dan bayar →';
  return 'Bayar sekarang →';
});
const totalUsd = computed(() => selectedItems.value.reduce((sum, item) => sum + item.usd, 0));
const totalIdr = computed(() => selectedItems.value.reduce((sum, item) => sum + item.idr, 0));
const usd = (value: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);
const idr = (value: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(value);
const createOrder = () => { orderNumber.value = `DOKU-${Date.now().toString().slice(-8)}`; step.value = 2; };
const selectPaymentMethod = (method: string) => { paymentMethod.value = method; selectedBankId.value = ''; copied.value = false; };
const selectBank = (bankId: string) => { selectedBankId.value = bankId; copied.value = false; };
const copyVaNumber = async () => {
  if (!selectedBank.value) return;
  await navigator.clipboard.writeText(selectedBank.value.vaNumber.replace(/\s/g, ''));
  copied.value = true;
};
const simulatePayment = async () => { processing.value = true; await new Promise(resolve => setTimeout(resolve, 800)); processing.value = false; step.value = 3; };
const reset = () => { step.value = 0; mainId.value = ''; additionalSelected.value = false; paymentMethod.value = ''; selectedBankId.value = ''; copied.value = false; orderNumber.value = ''; };
watch([paymentMethod, orderNumber], async ([method, order]) => {
  if (method !== 'QRIS' || !order) { dummyQrisUrl.value = ''; return; }
  dummyQrisUrl.value = await QRCode.toDataURL(`DOKU-SANDBOX|${order}|IDR${totalIdr.value}|NOT-A-REAL-PAYMENT`, { width: 512, margin: 2 });
});
useSeoMeta({ title: 'DOKU Payment | IWBIF 2026', robots: 'noindex, nofollow' });
</script>
