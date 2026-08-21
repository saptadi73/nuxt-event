<template>
  <section class="mx-auto max-w-4xl px-3 py-10 sm:px-6">
    <p class="text-sm uppercase tracking-[.35em] text-cyan-200">Digital Certificate</p>
    <h1 class="mt-3 text-3xl font-black sm:text-4xl">Recognition for your participation</h1>
    <p v-if="errorMessage" class="mt-6 rounded-2xl border border-red-300/30 bg-red-950/30 p-4 text-red-100">{{ errorMessage }}</p>
    <div class="mt-8 overflow-hidden rounded-[2rem] border border-orange-200/20 bg-gradient-to-br from-orange-200/10 via-white/5 to-cyan-300/10 p-6 text-center sm:p-12">
      <p class="text-xs uppercase tracking-[.35em] text-orange-200">IWBIF 2026</p>
      <template v-if="pending"><h2 class="mt-8 text-3xl font-black sm:text-4xl">Checking certificate...</h2></template>
      <template v-else-if="certificate">
        <h2 class="mt-8 text-3xl font-black sm:text-4xl">{{ certificate.title }}</h2>
        <p class="mt-5 text-sm text-slate-300">Certificate number: <strong class="text-white">{{ certificate.certificate_number }}</strong></p>
        <p v-if="certificate.issued_at" class="mt-2 text-sm text-slate-400">Issued {{ formatDate(certificate.issued_at) }}</p>
        <a v-if="certificate.download_url" :href="certificate.download_url" target="_blank" rel="noopener noreferrer" class="mt-8 inline-flex w-full justify-center rounded-full bg-orange-200 px-6 py-3 font-bold text-slate-950 sm:w-auto">Download certificate</a>
        <p v-else class="mt-8 text-sm text-slate-400">The certificate has been issued, but its download file is not available yet.</p>
      </template>
      <template v-else>
        <h2 class="mt-8 text-3xl font-black sm:text-4xl">Certificate of Participation</h2>
        <p class="mx-auto mt-5 max-w-xl text-sm leading-7 text-slate-300 sm:text-base">Certificates are available after attendance verification and required profile completion.</p>
        <button disabled class="mt-8 w-full cursor-not-allowed rounded-full border border-white/15 px-6 py-3 font-semibold text-slate-500 sm:w-auto">Certificate not yet available</button>
      </template>
      <div class="mx-auto mt-8 max-w-lg border-t border-white/15 pt-5 text-sm text-slate-400">14–17 October 2026 · Hotel Kempinski Indonesia, Jakarta</div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useEventUpdates, type CertificateItem } from '~/composables/useEventUpdates';

definePageMeta({ middleware: 'auth' });
useSeoMeta({ title: 'Certificate | IWBIF 2026' });
const { getMyCertificates } = useEventUpdates();
const errorMessage = ref('');
const { data: certificate, pending } = await useAsyncData<CertificateItem | null>('my-certificate', async () => {
  try {
    const result = (await getMyCertificates()).data;
    return Array.isArray(result) ? result[0] || null : result;
  } catch (error) {
    const value = error as { data?: { message?: string } };
    errorMessage.value = value.data?.message || (error instanceof Error ? error.message : 'Certificate could not be loaded.');
    return null;
  }
}, { default: () => null });
const formatDate = (value: string) => new Intl.DateTimeFormat('en-GB', { dateStyle: 'long', timeZone: 'Asia/Jakarta' }).format(new Date(value));
</script>
