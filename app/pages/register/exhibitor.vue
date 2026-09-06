<template>
  <section class="mx-auto max-w-5xl px-3 py-10 sm:px-6 lg:px-8">
    <p class="text-sm uppercase tracking-[.35em] text-cyan-200">{{ copy.eyebrow }}</p>
    <h1 class="mt-4 text-3xl font-black sm:text-5xl">{{ copy.title }}</h1>
    <p class="mt-4 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">{{ copy.description }}</p>

    <div class="mt-8 grid gap-5 md:grid-cols-2">
      <figure v-for="reference in exhibitionReferences" :key="reference.src" class="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
        <figcaption class="px-4 py-3 text-base font-semibold text-white">{{ reference.title }}</figcaption>
        <a :href="reference.src" target="_blank" rel="noopener noreferrer" class="block focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-300" :aria-label="`${reference.title} — ${exhibitionImageCopy.open}`">
          <img :src="reference.src" :alt="reference.alt" :width="reference.width" :height="reference.height" class="aspect-[4/3] w-full bg-white object-contain" decoding="async" />
          <span class="block px-4 py-3 text-sm text-cyan-200">{{ exhibitionImageCopy.open }}</span>
        </a>
      </figure>
    </div>

    <div v-if="pending" class="mt-8 h-60 animate-pulse rounded-[2rem] bg-white/5" />
    <div v-else-if="fetchError" class="mt-8 rounded-3xl border border-red-400/30 bg-red-950/30 p-6 text-red-100">{{ fetchError.message }}</div>

    <div v-else-if="alreadyRegistered" class="mt-8 rounded-3xl border border-emerald-300/30 bg-emerald-950/30 p-6 text-emerald-100">
      <p class="text-base font-semibold">{{ copy.alreadyRegistered }}</p>
      <NuxtLink to="/dashboard" class="mt-5 inline-flex rounded-full bg-cyan-300 px-6 py-3 text-sm font-semibold text-slate-950">{{ copy.goToDashboard }}</NuxtLink>
    </div>

    <form v-else class="mt-8 space-y-7" novalidate @submit.prevent="submit">
      <fieldset class="card">
        <legend>{{ copy.companyProfile }}</legend>
        <div class="grid gap-4 md:grid-cols-2">
          <label class="label"><span>{{ copy.companyName }} *</span><input v-model.trim="form.company_name" required class="field" /></label>
          <label class="label"><span>{{ copy.brand }} *</span><input v-model.trim="form.brand" required class="field" /></label>
          <label class="label"><span>{{ copy.contactPerson }} *</span><input v-model.trim="form.contact_person" required class="field" /></label>
          <label class="label md:col-span-2"><span>{{ copy.products }} *</span><textarea v-model.trim="form.products_to_display" required class="field" rows="3" /></label>
          <label class="label">
            <span>{{ copy.boothNumber }} *</span>
            <select v-model="form.booth_size_requested" required class="field">
              <option disabled value="">{{ boothNumberCopy.placeholder }}</option>
              <option v-for="number in boothNumbers" :key="number" :value="number">{{ number }}</option>
            </select>
          </label>
          <label class="label"><span>{{ copy.electricity }} *</span><input v-model.trim="form.electricity_requirement" required class="field" /></label>
          <label class="label md:col-span-2"><span>{{ copy.special }} *</span><textarea v-model.trim="form.special_requirement" required class="field" rows="3" /></label>
        </div>
      </fieldset>

      <fieldset class="card">
        <legend>{{ copy.agreement }}</legend>
        <label class="check mt-2">
          <input v-model="form.exhibition_terms_accepted" type="checkbox" required />
          <span>{{ copy.acceptTerms }}</span>
        </label>
      </fieldset>

      <div v-if="feedback" class="rounded-2xl border p-5" :class="success ? 'border-emerald-300/30 bg-emerald-950/30' : 'border-red-300/30 bg-red-950/30'">{{ feedback }}</div>

      <div class="submit-row">
        <button type="submit" class="rounded-full bg-cyan-300 px-7 py-3 font-semibold text-slate-950 disabled:opacity-50" :disabled="submitting">
          {{ submitting ? copy.saving : editingExhibitorId ? copy.update : copy.create }}
        </button>
      </div>
    </form>
  </section>
</template>

<script setup lang="ts">
import boothSpaceImage from '~/assets/images/exhibition/booth space.jpeg';
import tableExhibitionImage from '~/assets/images/exhibition/table exibition.jpeg';
import { useEvent } from '~/composables/useEvent';
import { useExhibitor } from '~/composables/useExhibitor';
import { useStore } from '~/composables/useStore';

definePageMeta({ middleware: 'auth' });
const { locale } = useI18n();
const exhibitionImageCopy = computed(() => locale.value === 'zh-CN'
  ? { booth: '展位布局', table: '展览桌', boothAlt: '展厅布局及展位编号', tableAlt: '展览桌正面、侧面及透视图，尺寸为 180 × 45 × 75 厘米', open: '查看完整图片（在新标签页中打开）' }
  : { booth: 'Booth space layout', table: 'Table exhibition', boothAlt: 'Exhibition floor plan with numbered booth spaces', tableAlt: 'Exhibition table front, side and perspective views with dimensions of 180 × 45 × 75 cm', open: 'View full image (opens in a new tab)' });
const exhibitionReferences = computed(() => [
  { src: boothSpaceImage, title: exhibitionImageCopy.value.booth, alt: exhibitionImageCopy.value.boothAlt, width: 11703, height: 8347 },
  { src: tableExhibitionImage, title: exhibitionImageCopy.value.table, alt: exhibitionImageCopy.value.tableAlt, width: 1536, height: 1024 }
]);
const messages = {
  en: { eyebrow: 'Exhibitor Registration', title: 'Register as an exhibitor', description: 'Submit your company profile and exhibition interest. Your account must already be created before starting.', companyProfile: 'Company profile', companyName: 'Company name', brand: 'Brand', contactPerson: 'Contact person', products: 'Products to display', boothNumber: 'Booth number requested', electricity: 'Electricity requirement', special: 'Special requirement', agreement: 'Agreement', acceptTerms: 'I accept the exhibitor terms and conditions.', saving: 'Saving…', update: 'Update exhibitor registration', create: 'Create exhibitor registration', noEvent: 'No IWBIF event is currently published.', unavailable: 'IWBIF event is not available right now.', loadError: 'Existing exhibitor profile could not be loaded.', success: 'Exhibitor registration created successfully.', saveError: 'Exhibitor registration could not be saved.', alreadyRegistered: 'This account is already registered as an exhibitor for this event. Only one exhibitor registration is allowed per account.', goToDashboard: 'Go to dashboard' },
  zh: { eyebrow: '参展商注册', title: '注册成为参展商', description: '请提交您的公司资料和参展意向。开始之前，您必须先创建账户。', companyProfile: '公司资料', companyName: '公司名称', brand: '品牌', contactPerson: '联系人', products: '展示产品', boothNumber: '申请展位编号', electricity: '用电需求', special: '特殊需求', agreement: '协议', acceptTerms: '我接受参展商条款与条件。', saving: '正在保存…', update: '更新参展商注册', create: '提交参展商注册', noEvent: '目前没有已发布的 IWBIF 活动。', unavailable: 'IWBIF 活动目前不可用。', loadError: '无法加载现有参展商资料。', success: '参展商注册已成功提交。', saveError: '无法保存参展商注册。', alreadyRegistered: '该账户已完成本次活动的参展商注册，每个账户仅可注册一次。', goToDashboard: '前往仪表板' }
} as const;
const copy = computed(() => locale.value === 'zh-CN' ? messages.zh : messages.en);
const boothNumbers = Array.from({ length: 40 }, (_, index) => String(index + 1));
const boothNumberCopy = computed(() => locale.value === 'zh-CN'
  ? { placeholder: '请选择展位编号（1-40）', invalid: '请选择 1-40 之间的有效展位编号。' }
  : { placeholder: 'Select booth number (1-40)', invalid: 'Select a valid booth number between 1 and 40.' });
const validationCopy = computed(() => locale.value === 'zh-CN'
  ? { required: '请填写所有必填字段。', terms: '您必须接受参展商条款与条件。' }
  : { required: 'Complete all required fields.', terms: 'You must accept the exhibitor terms and conditions.' });
useSeoMeta({
  title: () => `${copy.value.eyebrow} | IWBIF 2026`,
  description: () => copy.value.description
});

const { getEvents } = useEvent();
const { createExhibitor, getExhibitor, updateExhibitor } = useExhibitor();
const store = useStore();
const registrationFlow = useRegistrationFlow();

const form = reactive({
  company_name: '',
  brand: '',
  contact_person: '',
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
const alreadyRegistered = ref(false);

const { data: eventData, pending, error: fetchError } = await useAsyncData('iwbif-exhibitor-event', async () => {
  const response = await getEvents(1, 1);
  const event = response.data[0];
  if (!event) throw new Error(copy.value.noEvent);
  return event;
}, { watch: [locale] });

if (eventData.value) {
  try {
    const availability = await store.getExhibitorAvailability(eventData.value.id).then(response => response.data).catch(() => null);
    let existingId = availability?.exhibitor_id || '';
    let existingStatus = '';

    if (!existingId) {
      const state = await registrationFlow.loadFlow(true);
      const registrations = Array.isArray(state?.registrations) ? state.registrations as Array<Record<string, unknown>> : [];
      const exhibitors = Array.isArray(state?.exhibitors) ? state.exhibitors as Array<Record<string, unknown>> : [];
      const directExhibitor = state?.exhibitor && typeof state.exhibitor === 'object' ? [state.exhibitor as Record<string, unknown>] : [];
      const draft = [...exhibitors, ...directExhibitor, ...registrations].find((item) => {
        const kind = String(item.registration_type || item.type || item.product_type || '').toLowerCase();
        const detail = item.detail as Record<string, unknown> | undefined;
        return kind === 'exhibitor' || typeof item.company_name === 'string' || typeof detail?.company_name === 'string';
      });
      existingId = typeof draft?.id === 'string' ? draft.id : typeof draft?.exhibitor_id === 'string' ? draft.exhibitor_id : '';
      existingStatus = String(draft?.status || 'draft').toLowerCase();
    }

    if (existingId) {
      const existing = (await getExhibitor(eventData.value.id, existingId)).data;
      const status = String(existing.status || existingStatus || 'draft').toLowerCase();
      if (status === 'draft') {
        for (const key of Object.keys(form) as Array<keyof typeof form>) {
          if (existing[key] !== undefined && existing[key] !== null) (form[key] as unknown) = existing[key];
        }
        if (!boothNumbers.includes(form.booth_size_requested)) form.booth_size_requested = '';
        editingExhibitorId.value = existingId;
      } else {
        alreadyRegistered.value = true;
      }
    }
  } catch (error) {
    const value = error as { data?: { message?: string } };
    feedback.value = value.data?.message || (error instanceof Error ? error.message : copy.value.loadError);
  }
}

const submit = async () => {
  if (!eventData.value) {
    feedback.value = copy.value.unavailable;
    success.value = false;
    return;
  }

  if ([form.company_name, form.brand, form.contact_person, form.products_to_display, form.booth_size_requested, form.electricity_requirement, form.special_requirement].some(value => !value.trim())) {
    feedback.value = validationCopy.value.required;
    success.value = false;
    return;
  }
  if (!boothNumbers.includes(form.booth_size_requested)) {
    feedback.value = boothNumberCopy.value.invalid;
    success.value = false;
    return;
  }
  if (!form.exhibition_terms_accepted) {
    feedback.value = validationCopy.value.terms;
    success.value = false;
    return;
  }

  submitting.value = true;
  feedback.value = '';
  success.value = false;

  try {
    const payload = {
      company_name: form.company_name,
      brand: form.brand,
      contact_person: form.contact_person,
      products_to_display: form.products_to_display,
      booth_size_requested: form.booth_size_requested,
      electricity_requirement: form.electricity_requirement,
      special_requirement: form.special_requirement,
      exhibition_terms_accepted: form.exhibition_terms_accepted,
      exhibition_terms_version: '2026-01'
    };
    const result = editingExhibitorId.value
      ? await updateExhibitor(eventData.value.id, editingExhibitorId.value, payload)
      : await createExhibitor(eventData.value.id, payload);

    success.value = true;
    feedback.value = result.message || copy.value.success;
    await navigateTo('/dashboard');
  } catch (error) {
    success.value = false;
    const value = error as { data?: { message?: string; errors?: Array<{ message: string }> } };
    feedback.value = value.data?.errors?.[0]?.message || value.data?.message || (error instanceof Error ? error.message : copy.value.saveError);
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
.field option { @apply bg-slate-950 text-white; }
.check { @apply flex items-center gap-3 text-sm text-slate-300; }
.check input { @apply accent-cyan-300; }
.submit-row { display: flex; justify-content: flex-end; }
.submit-row button { width: 100%; }

@media (min-width: 640px) {
  .submit-row button { width: auto; }
}
</style>
