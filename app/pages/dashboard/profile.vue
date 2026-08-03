<template>
  <section class="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
    <h1 class="text-4xl font-black text-white">My Profile</h1>
    <p class="mt-3 text-slate-300">Update the data used by the `PUT /participants/me` and `PATCH /participants/me` endpoints.</p>

    <div class="mt-8 grid gap-4 rounded-[2rem] border border-white/10 bg-white/5 p-6">
      <div class="flex flex-wrap items-center gap-4">
        <img v-if="profilePhotoUrl" :src="mediaUrl(profilePhotoUrl)" alt="Your profile photo" class="h-20 w-20 rounded-2xl object-cover" />
        <div v-else class="flex h-20 w-20 items-center justify-center rounded-2xl bg-cyan-300/10 text-2xl font-bold text-cyan-200">{{ initials }}</div>
        <label class="grid gap-2 text-sm text-slate-300">
          <span>Profile photo</span>
          <input type="file" accept="image/jpeg,image/png,image/webp" @change="uploadPhoto" class="block text-sm text-slate-300 file:mr-3 file:rounded-full file:border-0 file:bg-cyan-400 file:px-4 file:py-2 file:font-semibold file:text-slate-950" />
        </label>
      </div>
      <label class="grid gap-2">
        <span class="text-sm text-slate-300">Full Name</span>
        <input v-model="form.full_name" class="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-white outline-none" />
      </label>

      <label class="grid gap-2">
        <span class="text-sm text-slate-300">Organization</span>
        <input v-model="form.organization_name" class="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-white outline-none" />
      </label>

      <label class="grid gap-2">
        <span class="text-sm text-slate-300">Biography</span>
        <textarea v-model="form.biography" rows="5" class="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-white outline-none"></textarea>
      </label>

      <div class="flex flex-wrap gap-3">
        <button
          @click="save('put')"
          class="rounded-full bg-cyan-400 px-6 py-3 text-sm font-semibold text-slate-950"
        >
          Save All
        </button>
        <button
          @click="save('patch')"
          class="rounded-full border border-white/15 px-6 py-3 text-sm font-semibold text-white"
        >
          Save Partial
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

const { getMyProfile, upsertMyProfile, patchMyProfile, uploadMyPhoto } = useParticipant();
const { mediaUrl } = useMediaUrl();

const form = reactive({
  full_name: '',
  organization_name: '',
  biography: ''
});
const feedback = ref('');
const profilePhotoUrl = ref('');
const initials = computed(() => (form.full_name || 'You').split(' ').map((part) => part[0]).slice(0, 2).join('').toUpperCase());

const me = await getMyProfile();
if (me?.data) {
  form.full_name = me.data.full_name || '';
  form.organization_name = me.data.organization_name || '';
  form.biography = me.data.biography || '';
  profilePhotoUrl.value = me.data.profile_photo_url || '';
}

const uploadPhoto = async (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (!file) return;

  feedback.value = '';
  try {
    const result = await uploadMyPhoto(file);
    profilePhotoUrl.value = result.data.profile_photo_url || profilePhotoUrl.value;
    feedback.value = 'Profile photo updated.';
  } catch (error) {
    feedback.value = error instanceof Error ? error.message : 'Profile photo could not be uploaded.';
  }
};

const save = async (mode: 'put' | 'patch') => {
  feedback.value = '';

  if (mode === 'put') {
    const result = await upsertMyProfile({
      full_name: form.full_name,
      organization_name: form.organization_name || undefined,
      biography: form.biography || undefined
    });
    feedback.value = `Profile saved. ID=${result.data.id}`;
  } else {
    const result = await patchMyProfile({
      organization_name: form.organization_name || undefined,
      biography: form.biography || undefined
    });
    feedback.value = `Profile saved. ID=${result.data.id}`;
  }
};
</script>
