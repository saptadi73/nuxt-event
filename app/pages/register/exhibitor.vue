<template>
  <section class="mx-auto max-w-5xl px-3 py-10 sm:px-6 lg:px-8">
    <p class="text-sm uppercase tracking-[.35em] text-cyan-200">Exhibitor Registration</p>
    <h1 class="mt-4 text-3xl font-black sm:text-5xl">Register as an exhibitor</h1>
    <p class="mt-4 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">Submit your company profile and exhibition interest. Your account must already be created before starting.</p>

    <div v-if="pending" class="mt-8 h-60 animate-pulse rounded-[2rem] bg-white/5" />
    <div v-else-if="fetchError" class="mt-8 rounded-3xl border border-red-400/30 bg-red-950/30 p-6 text-red-100">{{ fetchError.message }}</div>

    <form v-else class="mt-8 space-y-7" @submit.prevent="submit">
      <fieldset class="card">
        <legend>Company profile</legend>
        <div class="grid gap-4 md:grid-cols-2">
          <label class="label"><span>Company name *</span><input v-model.trim="form.company_name" required class="field" /></label>
          <label class="label"><span>Brand</span><input v-model.trim="form.brand" class="field" /></label>
          <label class="label"><span>Contact person *</span><input v-model.trim="form.contact_person" required class="field" /></label>
          <label class="label"><span>Email *</span><input v-model.trim="form.email" type="email" required class="field" /></label>
          <label class="label md:col-span-2"><span>Products to display *</span><textarea v-model.trim="form.products_to_display" required class="field" rows="3" /></label>
          <label class="label"><span>Booth size requested *</span><input v-model.trim="form.booth_size_requested" required class="field" /></label>
          <label class="label"><span>Electricity requirement</span><input v-model.trim="form.electricity_requirement" class="field" /></label>
          <label class="label md:col-span-2"><span>Special requirement</span><textarea v-model.trim="form.special_requirement" class="field" rows="3" /></label>
        </div>
      </fieldset>

      <fieldset class="card">
        <legend>Agreement</legend>
        <label class="check mt-2">
          <input v-model="form.exhibition_terms_accepted" type="checkbox" required />
          <span>I accept the exhibitor terms and conditions.</span>
        </label>
      </fieldset>

      <div v-if="feedback" class="rounded-2xl border p-5" :class="success ? 'border-emerald-300/30 bg-emerald-950/30' : 'border-red-300/30 bg-red-950/30'">{{ feedback }}</div>

      <div class="submit-row">
        <button type="submit" class="rounded-full bg-cyan-300 px-7 py-3 font-semibold text-slate-950 disabled:opacity-50" :disabled="submitting">
          {{ submitting ? 'Saving...' : editingExhibitorId ? 'Update exhibitor registration' : 'Create exhibitor registration' }}
        </button>
      </div>
    </form>
  </section>
</template>

<script setup lang="ts">
import { useEvent } from '~/composables/useEvent';
import { useExhibitor } from '~/composables/useExhibitor';

definePageMeta({ middleware: 'auth' });
useSeoMeta({
  title: 'Exhibitor Registration | IWBIF 2026',
  description: 'Register as an exhibitor for IWBIF 2026.'
});

const { getEvents } = useEvent();
const { createExhibitor, getExhibitor, updateExhibitor } = useExhibitor();
const registrationFlow = useRegistrationFlow();

const form = reactive({
  company_name: '',
  brand: '',
  contact_person: '',
  email: '',
  products_to_display: '',
  booth_size_requested: '',
  electricity_requirement: '',
  special_requirement: '',
  exhibition_terms_accepted: false
});

const submitting = ref(false);
const feedback = ref('');
const success = ref(false);
const editingExhibitorId = ref('');

const { data: eventData, pending, error: fetchError } = await useAsyncData('iwbif-exhibitor-event', async () => {
  const response = await getEvents(1, 1);
  const event = response.data[0];
  if (!event) throw new Error('No IWBIF event is currently published.');
  return event;
});

if (eventData.value) {
  try {
    const state = await registrationFlow.loadFlow(true);
    const registrations = Array.isArray(state?.registrations) ? state.registrations as Array<Record<string, unknown>> : [];
    const exhibitors = Array.isArray(state?.exhibitors) ? state.exhibitors as Array<Record<string, unknown>> : [];
    const directExhibitor = state?.exhibitor && typeof state.exhibitor === 'object' ? [state.exhibitor as Record<string, unknown>] : [];
    const draft = [...exhibitors, ...directExhibitor, ...registrations].find((item) => {
      const kind = String(item.registration_type || item.type || item.product_type || '').toLowerCase();
      const detail = item.detail as Record<string, unknown> | undefined;
      return kind === 'exhibitor' || typeof item.company_name === 'string' || typeof detail?.company_name === 'string';
    });
    const draftId = typeof draft?.id === 'string' ? draft.id : typeof draft?.exhibitor_id === 'string' ? draft.exhibitor_id : '';
    if (draftId && String(draft?.status || 'draft').toLowerCase() === 'draft') {
      const existing = (await getExhibitor(eventData.value.id, draftId)).data;
      for (const key of Object.keys(form) as Array<keyof typeof form>) {
        if (existing[key] !== undefined && existing[key] !== null) (form[key] as unknown) = existing[key];
      }
      editingExhibitorId.value = draftId;
    }
  } catch (error) {
    const value = error as { data?: { message?: string } };
    feedback.value = value.data?.message || (error instanceof Error ? error.message : 'Existing Exhibitor profile could not be loaded.');
  }
}

const submit = async () => {
  if (!eventData.value) {
    feedback.value = 'IWBIF event is not available right now.';
    success.value = false;
    return;
  }

  submitting.value = true;
  feedback.value = '';
  success.value = false;

  try {
    const payload = {
      company_name: form.company_name,
      brand: form.brand || undefined,
      contact_person: form.contact_person,
      email: form.email,
      products_to_display: form.products_to_display,
      booth_size_requested: form.booth_size_requested,
      electricity_requirement: form.electricity_requirement || undefined,
      special_requirement: form.special_requirement || undefined,
      exhibition_terms_accepted: form.exhibition_terms_accepted,
      exhibition_terms_version: '2026-01'
    };
    const result = editingExhibitorId.value
      ? await updateExhibitor(eventData.value.id, editingExhibitorId.value, payload)
      : await createExhibitor(eventData.value.id, payload);

    success.value = true;
    feedback.value = result.message || 'Exhibitor registration created successfully.';
    await navigateTo('/dashboard');
  } catch (error) {
    success.value = false;
    const value = error as { data?: { message?: string; errors?: Array<{ message: string }> } };
    feedback.value = value.data?.errors?.[0]?.message || value.data?.message || (error instanceof Error ? error.message : 'Exhibitor registration could not be saved.');
  } finally {
    submitting.value = false;
  }
};
</script>

<style scoped>
.card {
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: linear-gradient(180deg, rgba(11, 36, 71, 0.8), rgba(11, 36, 71, 0.52));
  box-shadow:
    0 30px 80px rgba(2, 10, 24, 0.45),
    inset 0 1px rgba(255, 255, 255, 0.04),
    0 0 0 1px rgba(216, 172, 89, 0.04);
  backdrop-filter: blur(16px);
  border-radius: 1.5rem;
  padding: 1.25rem;
}
.card legend { @apply px-2 text-lg font-bold sm:text-xl; }
.label { @apply grid gap-2 text-sm text-slate-300; }
.field { @apply rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-cyan-300; }
.check { @apply flex items-center gap-3 text-sm text-slate-300; }
.check input { @apply accent-cyan-300; }
.submit-row { display: flex; justify-content: flex-end; }
.submit-row button { width: 100%; }

@media (min-width: 640px) {
  .submit-row button { width: auto; }
}
</style>
