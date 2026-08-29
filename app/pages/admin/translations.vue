<template>
  <section class="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
    <header class="flex flex-wrap items-end justify-between gap-4">
      <div>
        <p class="text-xs font-bold uppercase tracking-[.24em] text-cyan-200">Content operations</p>
        <h1 class="mt-3 text-3xl font-black text-white sm:text-4xl">Chinese translations</h1>
        <p class="mt-3 max-w-2xl text-sm leading-7 text-slate-400">Create the Simplified Chinese content returned by public API requests with <code>locale=zh-CN</code>.</p>
      </div>
      <span class="rounded-full border border-cyan-300/25 bg-cyan-300/10 px-4 py-2 text-xs font-bold text-cyan-100">Target locale: zh-CN</span>
    </header>

    <p v-if="feedback" class="mt-6 rounded-xl border p-4 text-sm" :class="feedbackTone === 'error' ? 'border-red-300/30 bg-red-950/30 text-red-100' : 'border-emerald-300/30 bg-emerald-950/30 text-emerald-100'">{{ feedback }}</p>

    <form class="mt-8 grid gap-5 rounded-2xl border border-white/10 bg-white/[.04] p-5 sm:grid-cols-[1fr_1.5fr_auto]" @submit.prevent="loadTranslation">
      <label class="field"><span>Entity type</span><select v-model="entityType"><option v-for="definition in definitions" :key="definition.entity_type" :value="definition.entity_type">{{ definition.entity_type }}</option></select></label>
      <label class="field"><span>Resource ID</span><input v-model.trim="entityId" required placeholder="UUID from the relevant admin record" /></label>
      <button class="action-secondary self-end" :disabled="loading" type="submit">{{ loading ? 'Loading...' : 'Load translation' }}</button>
    </form>

    <section v-if="entityId" class="mt-6 rounded-2xl border border-white/10 bg-slate-950/45 p-5 sm:p-7">
      <div class="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-5">
        <div><p class="text-xs uppercase tracking-[.18em] text-slate-400">{{ entityType }}</p><h2 class="mt-1 break-all text-lg font-bold text-white">{{ entityId }}</h2></div>
        <span class="rounded-full px-3 py-1 text-xs font-bold" :class="translationExists ? 'bg-emerald-300/15 text-emerald-200' : 'bg-amber-300/15 text-amber-200'">{{ translationExists ? 'Translation exists' : 'Translation missing' }}</span>
      </div>

      <p v-if="loading" class="py-8 text-sm text-slate-400">Loading translation...</p>
      <form v-else class="mt-6 space-y-5" @submit.prevent="saveTranslation">
        <label v-for="field in fields" :key="field" class="field">
          <span>{{ fieldLabel(field) }}</span>
          <textarea v-if="isLongText(field)" v-model.trim="form[field]" rows="5" :placeholder="fieldPlaceholder(field)" />
          <input v-else v-model.trim="form[field]" :placeholder="fieldPlaceholder(field)" />
        </label>
        <p v-if="!fields.length" class="rounded-xl border border-amber-300/25 bg-amber-300/10 p-4 text-sm text-amber-100">This entity has no editable translation fields configured by the backend.</p>
        <div class="flex flex-wrap justify-between gap-3 border-t border-white/10 pt-5">
          <button v-if="translationExists" class="action-danger" :disabled="saving" type="button" @click="removeTranslation">Delete translation</button><span v-else />
          <button class="action-primary" :disabled="saving || !fields.length">{{ saving ? 'Saving...' : 'Save Chinese translation' }}</button>
        </div>
      </form>
    </section>
  </section>
</template>

<script setup lang="ts">
import { useAdminContent, type TranslatableEntityDefinition, type TranslatableEntityType } from '~/composables/useAdminContent';

definePageMeta({ middleware: ['auth', 'admin'] });
useSeoMeta({ title: 'Chinese Content Translations | IWBIF 2026' });

const fallbackDefinitions: TranslatableEntityDefinition[] = [
  { entity_type: 'event', fields: ['name', 'description', 'venue_name'] },
  { entity_type: 'product', fields: ['name', 'description'] },
  { entity_type: 'announcement', fields: ['title', 'body'] },
  { entity_type: 'certificate', fields: ['title'] },
  { entity_type: 'event_activity', fields: ['name', 'description'] },
  { entity_type: 'business_matching_slot', fields: ['title', 'description'] },
  { entity_type: 'matching_session', fields: ['title', 'description'] },
  { entity_type: 'meeting_venue', fields: ['name', 'description'] },
  { entity_type: 'meeting_resource', fields: ['name', 'description'] }
];

const adminContent = useAdminContent();
const route = useRoute();
const definitions = ref<TranslatableEntityDefinition[]>(fallbackDefinitions);
const entityType = ref<TranslatableEntityType>('event');
const requestedEntityType = typeof route.query.entity_type === 'string' ? route.query.entity_type : '';
const entityId = ref(typeof route.query.entity_id === 'string' ? route.query.entity_id.trim() : '');
const form = reactive<Record<string, string>>({});
const loading = ref(false);
const saving = ref(false);
const translationExists = ref(false);
const feedback = ref('');
const feedbackTone = ref<'success' | 'error'>('success');
const selectedDefinition = computed(() => definitions.value.find((definition) => definition.entity_type === entityType.value));
const fields = computed(() => selectedDefinition.value?.fields ?? []);

const resetForm = () => {
  for (const key of Object.keys(form)) Reflect.deleteProperty(form, key);
  for (const field of fields.value) form[field] = '';
};
const apiError = (error: unknown) => {
  const value = error as { data?: { message?: string; request_id?: string; errors?: Array<{ message?: string }> } };
  const message = value.data?.errors?.[0]?.message || value.data?.message || (error instanceof Error ? error.message : 'The translation could not be processed.');
  return value.data?.request_id ? `${message} (Request ID: ${value.data.request_id})` : message;
};
const fieldLabel = (field: string) => field.replaceAll('_', ' ');
const fieldPlaceholder = (field: string) => field === 'expertise_tags' ? 'Separate values with commas' : `Chinese ${fieldLabel(field)}`;
const isLongText = (field: string) => ['description', 'body', 'biography'].includes(field);
const loadTranslation = async () => {
  if (!entityId.value) return;
  loading.value = true;
  feedback.value = '';
  resetForm();
  translationExists.value = false;
  try {
    const translations = (await adminContent.getContentTranslations(entityType.value, entityId.value)).data || [];
    const translation = translations.find((item) => item.locale === 'zh-CN');
    translationExists.value = Boolean(translation);
    for (const field of fields.value) {
      const value = translation?.fields[field];
      form[field] = Array.isArray(value) ? value.map(String).join(', ') : value == null ? '' : String(value);
    }
  } catch (error) { feedbackTone.value = 'error'; feedback.value = apiError(error); }
  finally { loading.value = false; }
};
const saveTranslation = async () => {
  if (!entityId.value || saving.value) return;
  saving.value = true;
  try {
    const payload = Object.fromEntries(fields.value.map((field) => [field, field === 'expertise_tags' ? form[field].split(',').map((item) => item.trim()).filter(Boolean) : form[field].trim()]));
    await adminContent.saveContentTranslation(entityType.value, entityId.value, payload);
    translationExists.value = true;
    feedbackTone.value = 'success';
    feedback.value = 'Chinese translation saved.';
  } catch (error) { feedbackTone.value = 'error'; feedback.value = apiError(error); }
  finally { saving.value = false; }
};
const removeTranslation = async () => {
  if (!entityId.value || saving.value || !confirm('Delete this Chinese translation? Public pages will use the English fallback.')) return;
  saving.value = true;
  try {
    await adminContent.deleteContentTranslation(entityType.value, entityId.value);
    resetForm();
    translationExists.value = false;
    feedbackTone.value = 'success';
    feedback.value = 'Chinese translation deleted.';
  } catch (error) { feedbackTone.value = 'error'; feedback.value = apiError(error); }
  finally { saving.value = false; }
};

watch(entityType, () => { resetForm(); translationExists.value = false; });
try {
  const response = await adminContent.getTranslatableEntities();
  if (response.data?.length) {
    definitions.value = response.data;
    entityType.value = response.data.some((definition) => definition.entity_type === requestedEntityType)
      ? requestedEntityType as TranslatableEntityType
      : response.data[0]?.entity_type || 'event';
  }
} catch {
  feedbackTone.value = 'error';
  feedback.value = 'Could not load the backend translation schema. Using the built-in entity list.';
}
if (!definitions.value.some((definition) => definition.entity_type === entityType.value) && fallbackDefinitions.some((definition) => definition.entity_type === requestedEntityType)) {
  entityType.value = requestedEntityType as TranslatableEntityType;
}
if (entityId.value) await loadTranslation();
</script>

<style scoped>
.field { display:block; font-size:.875rem; color:#cbd5e1; }.field span { display:block; margin-bottom:.5rem; font-weight:700; text-transform:capitalize; }.field input,.field select,.field textarea { width:100%; border:1px solid rgb(255 255 255 / 12%); border-radius:.75rem; background:rgb(2 6 23 / 82%); padding:.75rem 1rem; color:white; outline:none; }.field input:focus,.field select:focus,.field textarea:focus { border-color:rgb(103 232 249 / 55%); box-shadow:0 0 0 3px rgb(103 232 249 / 8%); }.action-primary,.action-secondary,.action-danger { border-radius:.75rem; padding:.75rem 1rem; font-size:.875rem; font-weight:700; }.action-primary { background:#67e8f9; color:#083344; }.action-secondary { border:1px solid rgb(255 255 255 / 18%); color:#e2e8f0; }.action-danger { border:1px solid rgb(252 165 165 / 30%); color:#fecaca; }.action-primary:disabled,.action-secondary:disabled,.action-danger:disabled { cursor:not-allowed; opacity:.5; }
</style>