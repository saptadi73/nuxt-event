<template>
  <section class="mx-auto max-w-4xl px-3 py-10 sm:px-6">
    <p class="text-sm uppercase tracking-[.35em] text-cyan-200">{{ copy.eyebrow }}</p>
    <h1 class="mt-3 text-3xl font-black sm:text-4xl">{{ copy.title }}</h1>
    <p v-if="errorMessage" class="mt-6 rounded-2xl border border-red-300/30 bg-red-950/30 p-4 text-red-100">{{ errorMessage }}</p>
    <div class="mt-8 overflow-hidden rounded-[2rem] border border-orange-200/20 bg-gradient-to-br from-orange-200/10 via-white/5 to-cyan-300/10 p-6 text-center sm:p-12">
      <p class="text-xs uppercase tracking-[.35em] text-orange-200">IWBIF 2026</p>
      <template v-if="pending"><h2 class="mt-8 text-3xl font-black sm:text-4xl">{{ copy.checking }}</h2></template>
      <template v-else-if="certificate">
        <h2 class="mt-8 text-3xl font-black sm:text-4xl">{{ certificate.title }}</h2>
        <p class="mt-5 text-sm text-slate-300">{{ copy.number }}: <strong class="text-white">{{ certificate.certificate_number }}</strong></p>
        <p v-if="certificate.issued_at" class="mt-2 text-sm text-slate-400">{{ copy.issued }} {{ formatDate(certificate.issued_at) }}</p>
        <a v-if="certificate.download_url" :href="certificate.download_url" target="_blank" rel="noopener noreferrer" class="mt-8 inline-flex w-full justify-center rounded-full bg-orange-200 px-6 py-3 font-bold text-slate-950 sm:w-auto">{{ copy.download }}</a>
        <p v-else class="mt-8 text-sm text-slate-400">{{ copy.fileUnavailable }}</p>
      </template>
      <template v-else>
        <h2 class="mt-8 text-3xl font-black sm:text-4xl">{{ copy.participation }}</h2>
        <p class="mx-auto mt-5 max-w-xl text-sm leading-7 text-slate-300 sm:text-base">{{ copy.requirements }}</p>
        <button disabled class="mt-8 w-full cursor-not-allowed rounded-full border border-white/15 px-6 py-3 font-semibold text-slate-500 sm:w-auto">{{ copy.notAvailable }}</button>
      </template>
      <div class="mx-auto mt-8 max-w-lg border-t border-white/15 pt-5 text-sm text-slate-400">{{ copy.eventDetails }}</div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useEventUpdates, type CertificateItem } from '~/composables/useEventUpdates';

definePageMeta({ middleware: 'auth' });
const { locale } = useI18n();
const messages = { en: { eyebrow: 'Digital Certificate', title: 'Recognition for your participation', checking: 'Checking certificate…', number: 'Certificate number', issued: 'Issued', download: 'Download certificate', fileUnavailable: 'The certificate has been issued, but its download file is not available yet.', participation: 'Certificate of Participation', requirements: 'Certificates are available after attendance verification and required profile completion.', notAvailable: 'Certificate not yet available', eventDetails: '14–17 October 2026 · Hotel Kempinski Indonesia, Jakarta', error: 'Certificate could not be loaded.', seo: 'Certificate' }, zh: { eyebrow: '电子证书', title: '参与荣誉认证', checking: '正在检查证书…', number: '证书编号', issued: '签发日期', download: '下载证书', fileUnavailable: '证书已签发，但下载文件目前尚不可用。', participation: '参与证书', requirements: '完成出席验证和必填个人资料后即可获取证书。', notAvailable: '证书尚不可用', eventDetails: '2026年10月14日至17日 · 印度尼西亚雅加达凯宾斯基酒店', error: '无法加载证书。', seo: '证书' } } as const;
const copy = computed(() => locale.value === 'zh-CN' ? messages.zh : messages.en);
useSeoMeta({ title: () => `${copy.value.seo} | IWBIF 2026` });
const { getMyCertificates } = useEventUpdates();
const errorMessage = ref('');
const { data: certificate, pending } = await useAsyncData<CertificateItem | null>('my-certificate', async () => {
  try {
    const result = (await getMyCertificates()).data;
    return Array.isArray(result) ? result[0] || null : result;
  } catch (error) {
    const value = error as { data?: { message?: string } };
    errorMessage.value = value.data?.message || (error instanceof Error ? error.message : copy.value.error);
    return null;
  }
}, { default: () => null, watch: [locale] });
const formatDate = (value: string) => new Intl.DateTimeFormat(locale.value === 'zh-CN' ? 'zh-CN' : 'en-GB', { dateStyle: 'long', timeZone: 'Asia/Jakarta' }).format(new Date(value));
</script>
