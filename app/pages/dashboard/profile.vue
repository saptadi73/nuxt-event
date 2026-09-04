<template>
  <section class="mx-auto max-w-3xl px-3 py-10 sm:px-6 lg:px-8">
    <p class="text-sm uppercase tracking-[.35em] text-cyan-200">{{ copy.eyebrow }}</p>
    <h1 class="mt-3 text-3xl font-black text-white sm:text-4xl">{{ copy.title }}</h1>
    <p class="mt-3 text-sm text-slate-300 sm:text-base">{{ copy.description }}</p>

    <div class="mt-8 grid gap-4 rounded-[2rem] border border-white/10 bg-white/5 p-4 sm:p-6">
      <div class="flex flex-col gap-4 sm:flex-row sm:items-center">
        <img v-if="profilePhotoUrl" :src="mediaUrl(profilePhotoUrl)" :alt="copy.photoAlt" class="h-20 w-20 rounded-2xl object-cover" />
        <div v-else class="flex h-20 w-20 items-center justify-center rounded-2xl bg-cyan-300/10 text-2xl font-bold text-cyan-200">{{ initials }}</div>
        <label class="grid gap-2 text-sm text-slate-300">
          <span>{{ copy.photo }}</span>
          <input type="file" accept="image/jpeg,image/png,image/webp" @change="uploadPhoto" class="block text-sm text-slate-300 file:mr-3 file:rounded-full file:border-0 file:bg-cyan-400 file:px-4 file:py-2 file:font-semibold file:text-slate-950" />
          <span class="text-xs text-slate-400">{{ copy.photoRequirements }}</span>
          <span v-if="photoValidationError" role="alert" class="rounded-xl border border-red-300/30 bg-red-950/30 px-3 py-2 text-sm font-semibold text-red-100">{{ photoValidationError }}</span>
        </label>
      </div>
      <label class="grid gap-2">
        <span class="text-sm text-slate-300">{{ copy.fullName }}</span>
        <input v-model="form.full_name" class="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-white outline-none focus:border-cyan-300/60" />
      </label>

      <label class="grid gap-2">
        <span class="text-sm text-slate-300">{{ copy.organization }}</span>
        <input v-model="form.organization_name" class="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-white outline-none focus:border-cyan-300/60" />
      </label>

      <label class="grid gap-2">
        <span class="text-sm text-slate-300">{{ copy.biography }}</span>
        <textarea v-model="form.biography" rows="5" class="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-white outline-none focus:border-cyan-300/60"></textarea>
      </label>

      <div class="flex flex-col gap-3 sm:flex-row">
        <button
          @click="save('put')"
          class="rounded-full bg-cyan-400 px-6 py-3 text-sm font-semibold text-slate-950"
        >
          {{ copy.saveAll }}
        </button>
        <button
          @click="save('patch')"
          class="rounded-full border border-white/15 px-6 py-3 text-sm font-semibold text-white"
        >
          {{ copy.savePartial }}
        </button>
      </div>
    </div>

    <div v-if="feedback" class="mt-4 rounded-2xl border border-cyan-300/30 bg-cyan-300/10 px-4 py-3 text-sm text-white">
      {{ feedback }}
    </div>
  </section>
</template>

<script setup lang="ts">
import { useParticipant } from '~/composables/useParticipant';

definePageMeta({ middleware: 'auth' });

const { locale } = useI18n();
const messages = {
  en: { eyebrow: 'My Profile', title: 'Update your participant profile', description: 'Keep your business identity, biography, and profile photo easy to discover by relevant partners and delegates.', photoAlt: 'Your profile photo', photo: 'Profile photo', photoRequirements: 'JPG, PNG, or WebP; maximum 5 MB.', photoTooLarge: 'Photo size {size} MB exceeds the 5 MB limit.', photoEmpty: 'The selected photo is empty.', photoType: 'Unsupported format. Use JPG, PNG, or WebP.', fullName: 'Full Name', organization: 'Organization', biography: 'Biography', saveAll: 'Save All', savePartial: 'Save Partial', you: 'You', photoUpdated: 'Profile photo updated.', photoError: 'Profile photo could not be uploaded.', saved: 'Profile saved. ID={id}', saveError: 'Profile could not be saved.', seo: 'My Profile' },
  zh: { eyebrow: '我的个人资料', title: '更新参与者资料', description: '完善您的商务身份、个人简介和头像，方便相关合作伙伴与代表找到您。', photoAlt: '您的个人头像', photo: '个人头像', photoRequirements: '支持 JPG、PNG 或 WebP，文件最大为 5 MB。', photoTooLarge: '照片大小为 {size} MB，超过 5 MB 上限。', photoEmpty: '所选照片为空文件。', photoType: '不支持此格式。请使用 JPG、PNG 或 WebP。', fullName: '姓名', organization: '公司／机构', biography: '个人简介', saveAll: '保存全部', savePartial: '保存部分内容', you: '您', photoUpdated: '个人头像已更新。', photoError: '无法上传个人头像。', saved: '个人资料已保存。ID={id}', saveError: '无法保存个人资料。', seo: '我的个人资料' }
} as const;
const copy = computed(() => locale.value === 'zh-CN' ? messages.zh : messages.en);
useSeoMeta({ title: () => `${copy.value.seo} | IWBIF 2026` });

const { getMyProfile, upsertMyProfile, patchMyProfile, uploadMyPhoto } = useParticipant();
const { mediaUrl } = useMediaUrl();

const form = reactive({
  full_name: '',
  organization_name: '',
  biography: ''
});
const feedback = ref('');
const photoValidationError = ref('');
const profilePhotoUrl = ref('');
const initials = computed(() => (form.full_name || copy.value.you).split(' ').map((part) => part[0]).slice(0, 2).join('').toUpperCase());

const me = await getMyProfile();
if (me?.data) {
  form.full_name = me.data.full_name || '';
  form.organization_name = me.data.organization_name || '';
  form.biography = me.data.biography || '';
  profilePhotoUrl.value = me.data.profile_photo_url || '';
}

const uploadPhoto = async (event: Event) => {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  if (!file) return;

  feedback.value = '';
  photoValidationError.value = '';
  if (file.size > 5 * 1024 * 1024) {
    photoValidationError.value = copy.value.photoTooLarge.replace('{size}', (Math.ceil(file.size / 1024 / 1024 * 10) / 10).toString());
    input.value = '';
    return;
  }
  if (file.size === 0) {
    photoValidationError.value = copy.value.photoEmpty;
    input.value = '';
    return;
  }
  if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
    photoValidationError.value = copy.value.photoType;
    input.value = '';
    return;
  }
  try {
    const result = await uploadMyPhoto(file);
    profilePhotoUrl.value = result.data.profile_photo_url || profilePhotoUrl.value;
    feedback.value = copy.value.photoUpdated;
  } catch (error) {
    feedback.value = error instanceof Error ? error.message : copy.value.photoError;
  }
};

const save = async (mode: 'put' | 'patch') => {
  feedback.value = '';

  try {
    if (mode === 'put') {
      const result = await upsertMyProfile({
        full_name: form.full_name,
        organization_name: form.organization_name || undefined,
        biography: form.biography || undefined
      });
      feedback.value = copy.value.saved.replace('{id}', result.data.id);
    } else {
      const result = await patchMyProfile({
        organization_name: form.organization_name || undefined,
        biography: form.biography || undefined
      });
      feedback.value = copy.value.saved.replace('{id}', result.data.id);
    }
  } catch (error) {
    feedback.value = error instanceof Error ? error.message : copy.value.saveError;
  }
};
</script>
