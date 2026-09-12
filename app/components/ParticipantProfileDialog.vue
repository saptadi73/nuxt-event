<template>
  <dialog ref="dialog" aria-labelledby="participant-profile-title" class="w-[calc(100%-2rem)] max-w-2xl rounded-3xl border border-white/20 bg-slate-900 p-0 text-white backdrop:bg-black/70" @close="emit('close')" @cancel.prevent="close">
    <div class="flex items-center justify-between gap-4 border-b border-white/10 p-5">
      <h2 id="participant-profile-title" class="text-lg font-bold">{{ t('adminParticipants.profileDetails') }}</h2>
      <button autofocus class="rounded-full border border-white/20 px-4 py-2 text-sm" @click="close">{{ t('adminParticipants.closeProfile') }}</button>
    </div>
    <div class="p-5">
      <p v-if="loading" role="status">{{ t('adminParticipants.loadingProfile') }}</p>
      <div v-else-if="loadError" role="alert" class="text-rose-200">
        <p>{{ loadError }}</p>
        <button class="mt-3 rounded-full border border-white/20 px-4 py-2" @click="loadProfile">{{ t('adminParticipants.retryProfile') }}</button>
      </div>
      <template v-else-if="profile">
        <article ref="documentElement" data-full-profile class="rounded-2xl bg-white p-6 text-slate-900">
          <div class="mb-6 flex flex-wrap items-center gap-4">
            <img v-if="photoUrl && !photoFailed" :src="photoUrl" :alt="profile.full_name" class="h-24 w-24 rounded-xl object-cover" @error="photoFailed = true">
            <div>
              <p class="text-xs uppercase tracking-widest text-slate-500">IWBIF 2026 · {{ t('adminParticipants.profileDetails') }}</p>
              <h3 class="mt-2 break-words text-2xl font-bold">{{ profile.full_name }}</h3>
            </div>
          </div>
          <section v-for="section in sections" :key="section.key" class="mt-6 border-t border-slate-200 pt-4">
            <h4 class="mb-4 text-lg font-bold">{{ section.title }}</h4>
            <dl v-if="section.fields.length" class="grid gap-4">
              <div v-for="field in section.fields" :key="field.key" class="min-w-0">
                <dt class="text-xs font-semibold text-slate-500">{{ field.label }}</dt>
                <dd class="mt-1 whitespace-pre-wrap break-words">{{ field.value || t('adminParticipants.notAvailable') }}</dd>
              </div>
            </dl>
            <p v-else class="text-sm text-slate-500">{{ t('adminParticipants.noProfileSection') }}</p>
          </section>
        </article>
        <p v-if="photoFailed" role="status" class="mt-3 text-sm text-amber-200">{{ t('adminParticipants.profilePhotoError') }}</p>
        <p v-if="downloadError" role="alert" class="mt-3 text-sm text-rose-200">{{ downloadError }}</p>
        <div class="mt-5 flex flex-wrap gap-3">
          <button :disabled="exporting" class="rounded-full bg-cyan-300 px-5 py-3 text-sm font-bold text-slate-950 disabled:opacity-50" @click="downloadPdf">{{ t(exporting ? 'adminParticipants.preparingProfilePdf' : 'adminParticipants.downloadProfilePdf') }}</button>
          <button class="rounded-full border border-cyan-300/40 px-5 py-3 text-sm font-bold text-cyan-100" @click="downloadCsv">{{ t('adminParticipants.downloadProfileCsv') }}</button>
        </div>
      </template>
    </div>
  </dialog>
</template>

<script setup lang="ts">
import type { ParticipantReportItem } from '~/composables/useAdminReport';
import { useParticipant, type CompleteParticipantProfile } from '~/composables/useParticipant';

import { flattenProfileFields, profileCsv } from '~/utils/participantProfile';

const props = defineProps<{ participant: ParticipantReportItem }>();
const emit = defineEmits<{ close: [] }>();
const { t } = useI18n();
const { getCompleteParticipantProfile } = useParticipant();
const { mediaUrl } = useMediaUrl();
const dialog = ref<HTMLDialogElement | null>(null);
const documentElement = ref<HTMLElement | null>(null);
const completeProfile = ref<CompleteParticipantProfile | null>(null);
const profile = computed(() => completeProfile.value?.profile);
const loading = ref(true);
const exporting = ref(false);
const loadError = ref('');
const downloadError = ref('');
const photoFailed = ref(false);
const photoUrl = computed(() => mediaUrl(profile.value?.profile_photo_url));
const filename = computed(() => `participant-profile-${(profile.value?.full_name || props.participant.participant_id || 'participant').replace(/[<>:"/\\|?*]/g, '-').trim()}`);
const sections = computed(() => {
  const data = completeProfile.value;
  if (!data) return [];
  const result = [
    { key: 'account', title: t('adminParticipants.accountSection'), fields: flattenProfileFields(data.account, 'account') },
    { key: 'profile', title: t('adminParticipants.profileDetails'), fields: flattenProfileFields(data.profile, 'profile') }
  ];
  for (const [key, title, records] of [
    ['companies', t('adminParticipants.companySection'), data.companies],
    ['registrations', t('adminParticipants.delegateSection'), data.registrations],
    ['exhibitors', t('adminParticipants.exhibitorSection'), data.exhibitors],
    ['business_matching', t('adminParticipants.businessSection'), data.business_matching]
  ] as const) {
    if (!records.length) result.push({ key, title, fields: [] });
    records.forEach((record, index) => result.push({
      key: `${key}.${index + 1}`,
      title: `${title} ${index + 1}`,
      fields: flattenProfileFields(record, `${key}.${index + 1}`)
    }));
  }
  return result;
});
const fields = computed(() => sections.value.flatMap(section => section.fields));

const close = () => dialog.value?.close();
const loadProfile = async () => {
  loading.value = true;
  loadError.value = '';
  completeProfile.value = null;
  try {
    if (!props.participant.participant_id || props.participant.profile_status !== 'complete') throw new Error('Profile unavailable');
    const response = await getCompleteParticipantProfile(props.participant.participant_id);
    if (!response.data || response.data.participant_id !== props.participant.participant_id || !response.data.profile) throw new Error('Profile unavailable');
    completeProfile.value = response.data;
  } catch {
    loadError.value = t('adminParticipants.profileLoadError');
  } finally {
    loading.value = false;
  }
};

const downloadPdf = async () => {
  if (!documentElement.value || exporting.value) return;
  exporting.value = true;
  downloadError.value = '';
  try {
    const { downloadDocumentPdf } = await import('~/utils/invoicePdf');
    await downloadDocumentPdf(documentElement.value, filename.value);
  } catch {
    downloadError.value = t('adminParticipants.profileDownloadError');
  } finally {
    exporting.value = false;
  }
};

const downloadCsv = () => {
  if (!profile.value) return;
  downloadError.value = '';
  try {
    const csv = profileCsv(fields.value);
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename.value}.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  } catch {
    downloadError.value = t('adminParticipants.profileDownloadError');
  }
};

onMounted(() => {
  dialog.value?.showModal();
  loadProfile();
});
</script>
