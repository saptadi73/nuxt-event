<template>
  <section class="mx-auto max-w-7xl px-3 py-10 sm:px-6 lg:px-8">
    <div class="flex flex-wrap items-end justify-between gap-5">
      <div>
        <p class="text-sm uppercase tracking-[.3em] text-amber-200">Organizer catalog</p>
        <h1 class="mt-3 text-3xl font-black sm:text-4xl">Manage Delegate Packages</h1>
        <p class="mt-3 max-w-3xl text-sm leading-7 text-slate-300">Manage Main and Additional packages. Prices are configured per Sharing/Single rate; facilities are informational breakdowns.</p>
      </div>
      <NuxtLink to="/dashboard" class="rounded-full border border-white/20 px-5 py-3 text-sm font-semibold">Back to dashboard</NuxtLink>
    </div>

    <div class="mt-8 flex max-w-2xl flex-col gap-3 sm:flex-row sm:items-end"><label class="block flex-1 text-sm text-slate-300"><span class="mb-2 block">Event</span><select v-model="selectedEventId" class="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-amber-300/50"><option v-for="event in events" :key="event.id" :value="event.id">{{ event.name }}</option></select></label><label class="flex items-center gap-2 rounded-full border border-white/10 px-4 py-3 text-sm text-slate-300"><input v-model="showInactive" type="checkbox" class="accent-amber-300"> Show inactive packages</label></div>
    <div v-if="feedback" class="mt-5 rounded-2xl border p-4 text-sm" :class="feedbackTone === 'error' ? 'border-red-400/30 bg-red-950/30 text-red-100' : 'border-emerald-300/30 bg-emerald-950/30 text-emerald-100'">{{ feedback }}</div>

    <div class="mt-8 grid gap-6 lg:grid-cols-[1fr_24rem]">
      <div>
        <p v-if="loading" class="glass-card rounded-3xl p-6 text-slate-300">Loading Delegate packages...</p>
        <div v-else-if="!visiblePackages.length" class="glass-card rounded-3xl p-6 text-slate-300">{{ packages.length ? 'No active Delegate packages. Enable “Show inactive packages” to review deactivated records.' : 'No Delegate package has been created for this event.' }}</div>
        <div v-else class="grid gap-4 md:grid-cols-2">
          <article v-for="item in visiblePackages" :key="item.id" class="glass-card rounded-3xl p-5" :class="item.is_active ? '' : 'opacity-65'">
            <div class="flex items-center justify-between gap-3"><span class="text-xs font-bold uppercase tracking-[.2em] text-amber-200">{{ item.code }}</span><span class="flex gap-2"><span class="translation-badge" :class="translationStatusClass(translationStatuses[`delegate_package:${item.id}`])">ZH {{ translationStatusLabel(translationStatuses[`delegate_package:${item.id}`]) }}</span><span class="rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[.16em]" :class="item.is_active ? 'bg-emerald-300/10 text-emerald-200' : 'bg-white/10 text-slate-400'">{{ item.is_active ? 'Active' : 'Inactive' }}</span></span></div>
            <h2 class="mt-4 text-xl font-bold">{{ item.name }}</h2>
            <p class="mt-2 text-xs uppercase tracking-wider text-slate-400">{{ item.package_type }} · {{ item.selection_mode }}</p>
            <div class="mt-4 grid gap-2"><div v-for="rate in item.rates" :key="rate.id" class="rounded-xl border border-white/10 bg-slate-950/40 p-3"><div class="flex justify-between gap-2"><b class="min-w-0 break-words capitalize">{{ rate.occupancy_type }} <span v-if="rate.is_default" class="text-xs text-amber-200">(default)</span> <span class="translation-badge" :class="translationStatusClass(translationStatuses[`delegate_package_rate:${rate.id}`])">ZH {{ translationStatusLabel(translationStatuses[`delegate_package_rate:${rate.id}`]) }}</span></b><span class="shrink-0">{{ money(rate.amount, rate.currency) }}</span></div><p class="mt-1 text-xs text-slate-400">{{ rate.payment_amount_idr ? `Payment ${money(rate.payment_amount_idr, 'IDR')}` : 'IDR payment not configured' }}</p><div class="mt-3 flex flex-wrap gap-2"><button class="rounded-full border border-amber-300/30 px-3 py-2 text-xs font-semibold text-amber-200" @click="editRate(item.id, rate)">Edit</button><button class="rounded-full border border-cyan-300/30 px-3 py-2 text-xs font-semibold text-cyan-200" @click="openTranslation('delegate_package_rate', rate.id, rate.name || rate.occupancy_type)">简体中文</button><button class="rounded-full border border-rose-300/30 px-3 py-2 text-xs font-semibold text-rose-200" @click="removeRate(rate)">Deactivate</button></div></div></div>
            <ul class="mt-4 space-y-2 text-xs text-slate-400"><li v-for="facility in item.facilities" :key="facility.id" class="flex items-start justify-between gap-2"><span class="min-w-0 flex-1 break-words">• {{ facility.name }} <span class="translation-badge" :class="translationStatusClass(translationStatuses[`delegate_package_facility:${facility.id}`])">ZH {{ translationStatusLabel(translationStatuses[`delegate_package_facility:${facility.id}`]) }}</span></span><span class="flex shrink-0 flex-wrap justify-end gap-2"><button class="rounded-full border border-amber-300/30 px-3 py-1.5 text-xs text-amber-200" @click="editFacility(item.id, facility)">Edit</button><button class="rounded-full border border-cyan-300/30 px-3 py-1.5 text-xs text-cyan-200" @click="openTranslation('delegate_package_facility', facility.id, facility.name)">简体中文</button><button class="rounded-full border border-rose-300/30 px-3 py-1.5 text-xs text-rose-200" @click="removeFacility(facility)">Deactivate</button></span></li></ul>
            <div class="mt-5 flex flex-wrap gap-3"><button class="w-full rounded-full bg-amber-300 px-5 py-2 text-sm font-semibold text-slate-950 sm:w-auto" @click="selectedPackageId = item.id">Rates & facilities</button><button class="w-full rounded-full border border-amber-300/40 px-5 py-2 text-sm font-semibold text-amber-100 sm:w-auto" @click="editPackage(item)">{{ item.is_active ? 'Edit' : 'Review / reactivate' }}</button><button class="w-full rounded-full border border-cyan-300/40 px-5 py-2 text-sm font-semibold text-cyan-100 sm:w-auto" @click="openTranslation('delegate_package', item.id, item.name)">简体中文</button><button v-if="item.is_active" class="w-full rounded-full border border-red-300/30 px-5 py-2 text-sm font-semibold text-red-200 disabled:opacity-50 sm:w-auto" :disabled="deletingId === item.id" @click="removePackage(item)">{{ deletingId === item.id ? 'Removing...' : 'Remove' }}</button></div>
          </article>
        </div>
      </div>

      <form class="glass-card h-fit rounded-[2rem] p-5 sm:p-6" @submit.prevent="savePackage">
        <div class="flex items-center justify-between gap-3"><h2 class="text-xl font-bold">{{ editingId ? 'Update package' : 'New package' }}</h2><button v-if="editingId" type="button" class="text-sm text-slate-400" @click="resetForm">Cancel</button></div>
        <div class="mt-5 space-y-4">
          <label class="field"><span>Package name</span><input v-model.trim="form.name" required placeholder="Package A - USD500" /></label>
          <label class="field"><span>Code</span><input v-model.trim="form.code" required maxlength="30" placeholder="A" /></label>
          <div class="grid grid-cols-1 gap-3 sm:grid-cols-2"><label class="field"><span>Package type</span><select v-model="form.package_type"><option value="main">Main</option><option value="additional">Additional</option></select></label><label class="field"><span>Selection</span><select v-model="form.selection_mode"><option value="required_one">Required one</option><option value="optional">Optional</option></select></label></div>
          <label class="field"><span>Description</span><input v-model.trim="form.description" placeholder="Package description" /></label>
          <div class="grid grid-cols-1 gap-3 sm:grid-cols-2"><label class="field"><span>Price</span><input v-model.number="form.amount" type="number" min="0.01" step="0.01" required /></label><label class="field"><span>Currency</span><input v-model.trim="form.currency" maxlength="3" required /></label></div>
          <label class="field"><span>Payment amount (IDR)</span><input v-model.number="form.payment_amount_idr" type="number" min="1" step="1" placeholder="8000000" /></label>
          <label class="flex items-center gap-3 text-sm text-slate-300"><input v-model="form.is_active" type="checkbox" class="h-4 w-4 accent-amber-300" />Available for purchase</label>
          <button class="w-full rounded-full bg-amber-300 px-5 py-3 font-bold text-slate-950 disabled:opacity-50" :disabled="saving || !selectedEventId">{{ saving ? 'Saving...' : editingId ? 'Update package' : 'Create package' }}</button>
        </div>
      </form>
    </div>

    <section v-if="selectedPackage" class="mt-8 grid gap-6 lg:grid-cols-2">
      <article class="glass-card rounded-3xl p-5"><div class="flex flex-wrap items-start justify-between gap-3"><h2 class="min-w-0 text-xl font-bold">{{ editingRateId ? 'Edit rate' : 'Add rate' }} · {{ selectedPackage.name }}</h2><button v-if="editingRateId" class="text-sm text-slate-400" @click="resetRateForm">Cancel</button></div><p class="mt-2 text-xs text-slate-400">Sharing and Single are final package tariffs. Only one rate may be the default.</p><form class="mt-5 space-y-3" @submit.prevent="saveRate"><div class="grid grid-cols-1 gap-3 sm:grid-cols-2"><label class="field"><span>Occupancy</span><select v-model="rateForm.occupancy_type"><option value="sharing">Sharing</option><option value="single">Single</option></select></label><label class="field"><span>Rate name</span><input v-model="rateForm.name" required></label></div><div class="grid grid-cols-1 gap-3 sm:grid-cols-2"><label class="field"><span>Display USD</span><input v-model.number="rateForm.amount" type="number" min="0" required></label><label class="field"><span>Payment IDR</span><input v-model.number="rateForm.payment_amount_idr" type="number" min="1"></label></div><div class="flex flex-col gap-2 text-sm sm:flex-row sm:gap-5"><label><input v-model="rateForm.is_default" type="checkbox" class="accent-amber-300"> Default</label><label><input v-model="rateForm.is_active" type="checkbox" class="accent-amber-300"> Active</label></div><button class="w-full rounded-full bg-amber-300 px-5 py-3 font-bold text-slate-950" :disabled="saving">{{ editingRateId ? 'Update rate' : 'Add rate' }}</button></form></article>
      <article class="glass-card rounded-3xl p-5"><h2 class="text-xl font-bold">Add facility</h2><p class="mt-2 text-xs text-slate-400">Facility prices are breakdown information and are not added to checkout totals.</p><form class="mt-5 space-y-3" @submit.prevent="saveFacility"><label class="field"><span>Facility name</span><input v-model="facilityForm.name" required></label><label class="field"><span>Description</span><textarea v-model="facilityForm.description" rows="3" placeholder="Facility description" /></label><div class="grid grid-cols-1 gap-3 sm:grid-cols-2"><label class="field"><span>Quantity</span><input v-model.number="facilityForm.quantity" type="number" min="0"></label><label class="field"><span>Unit</span><input v-model="facilityForm.unit" placeholder="night"></label></div><label class="field"><span>Pricing</span><select v-model="facilityForm.pricing_mode"><option value="included">Included</option><option value="separately_priced">Separately priced</option></select></label><div v-if="facilityForm.pricing_mode === 'separately_priced'" class="grid grid-cols-1 gap-3 sm:grid-cols-2"><label class="field"><span>Sharing USD</span><input v-model.number="facilityForm.sharing_amount" type="number" min="0"></label><label class="field"><span>Single USD</span><input v-model.number="facilityForm.single_amount" type="number" min="0"></label></div><button class="w-full rounded-full bg-cyan-300 px-5 py-3 font-bold text-slate-950" :disabled="saving">Add facility</button></form></article>
    </section>

    <Teleport to="body">
      <div v-if="editingFacilityId" class="fixed inset-0 z-[100] flex items-end justify-center bg-slate-950/85 p-0 backdrop-blur-sm sm:items-center sm:p-5" role="dialog" aria-modal="true" aria-labelledby="facility-modal-title" @click.self="resetFacilityForm">
        <article class="max-h-[92vh] w-full max-w-xl overflow-y-auto rounded-t-[2rem] border border-white/10 bg-slate-950 p-5 shadow-2xl sm:rounded-[2rem] sm:p-7">
          <div class="flex items-start justify-between gap-4"><div><p class="text-xs font-bold uppercase tracking-[.25em] text-cyan-200">Facility editor</p><h2 id="facility-modal-title" class="mt-2 text-2xl font-black">Edit facility text</h2></div><button type="button" class="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-white/15 text-xl text-slate-300" aria-label="Close facility editor" @click="resetFacilityForm">×</button></div>
          <form class="mt-6 space-y-4" @submit.prevent="saveFacility">
            <label class="field"><span>Facility name</span><textarea v-model.trim="facilityForm.name" rows="3" required autofocus placeholder="Facility text" /></label>
            <label class="field"><span>Description</span><textarea v-model.trim="facilityForm.description" rows="4" placeholder="Optional facility description" /></label>
            <div class="grid grid-cols-1 gap-3 sm:grid-cols-2"><label class="field"><span>Quantity</span><input v-model.number="facilityForm.quantity" type="number" min="0"></label><label class="field"><span>Unit</span><input v-model.trim="facilityForm.unit" placeholder="night"></label></div>
            <label class="field"><span>Pricing</span><select v-model="facilityForm.pricing_mode"><option value="included">Included</option><option value="separately_priced">Separately priced</option></select></label>
            <div v-if="facilityForm.pricing_mode === 'separately_priced'" class="grid grid-cols-1 gap-3 sm:grid-cols-2"><label class="field"><span>Sharing USD</span><input v-model.number="facilityForm.sharing_amount" type="number" min="0"></label><label class="field"><span>Single USD</span><input v-model.number="facilityForm.single_amount" type="number" min="0"></label></div>
            <div class="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end"><button type="button" class="rounded-full border border-white/20 px-5 py-3 font-semibold" :disabled="saving" @click="resetFacilityForm">Cancel</button><button class="rounded-full bg-cyan-300 px-6 py-3 font-bold text-slate-950 disabled:opacity-50" :disabled="saving">{{ saving ? 'Saving...' : 'Save facility' }}</button></div>
          </form>
        </article>
      </div>
    </Teleport>
    <Teleport to="body"><div v-if="translationModalOpen" class="fixed inset-0 z-[110] flex items-end justify-center bg-slate-950/85 p-0 backdrop-blur-sm sm:items-center sm:p-5" @click.self="closeTranslation"><form class="max-h-[92vh] w-full max-w-xl overflow-y-auto rounded-t-[2rem] border border-white/10 bg-slate-950 p-5 shadow-2xl sm:rounded-[2rem] sm:p-7" @submit.prevent="saveTranslation"><div class="flex items-start justify-between gap-4"><div><p class="text-xs font-bold uppercase tracking-[.25em] text-cyan-200">Simplified Chinese content</p><h2 class="mt-2 text-2xl font-black">{{ translationSourceLabel }}</h2><p class="mt-2 text-xs text-slate-400">{{ translationEntityLabel }} · ID {{ translationEntityId }}</p></div><button type="button" class="grid h-10 w-10 place-items-center rounded-full border border-white/15 text-xl" @click="closeTranslation">×</button></div><p v-if="translationLoading" class="mt-6 text-sm text-slate-400">Loading translation...</p><div v-else class="mt-6 space-y-4"><p class="text-xs text-slate-400">All displayed translation fields are required.</p><label class="field"><span>Name (简体中文)</span><input v-model.trim="translationForm.name" required :placeholder="translationSourceLabel" /></label><label v-if="translationEntityType !== 'delegate_package_rate'" class="field"><span>Description (简体中文)</span><textarea v-model.trim="translationForm.description" rows="4" required /></label><label v-if="translationEntityType === 'delegate_package_facility'" class="field"><span>Unit (简体中文)</span><input v-model.trim="translationForm.unit" required placeholder="例如：每位代表" /></label><div class="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-between"><button v-if="translationExists" type="button" class="rounded-full border border-red-300/25 px-5 py-3 font-semibold text-red-200" :disabled="savingTranslation" @click="deleteTranslation">Delete translation</button><span v-else /><div class="flex gap-3"><button type="button" class="rounded-full border border-white/20 px-5 py-3 font-semibold" @click="closeTranslation">Cancel</button><button class="rounded-full bg-cyan-300 px-6 py-3 font-bold text-slate-950 disabled:opacity-50" :disabled="savingTranslation">{{ savingTranslation?'Saving...':'Save Chinese' }}</button></div></div></div></form></div></Teleport>
  </section>
</template>

<script setup lang="ts">
import { useAdminContent, type DelegatePackageFacilityPayload, type DelegatePackageMutationPayload, type DelegatePackageRatePayload, type TranslatableEntityType } from '~/composables/useAdminContent';
import { useEvent, type DelegatePackageCatalogItem, type DelegatePackageFacility, type DelegatePackageRate, type EventItem } from '~/composables/useEvent';

definePageMeta({ middleware: ['auth', 'admin'] });
useSeoMeta({ title: 'Manage Delegate Packages | IWBIF 2026' });

const { getEvents } = useEvent();
const adminApi = useAdminContent();
const { data: eventResponse } = await useAsyncData('admin-package-events', () => getEvents(1, 100));
const events = computed<EventItem[]>(() => eventResponse.value?.data || []);
const selectedEventId = ref(events.value[0]?.id || '');
const packages = ref<DelegatePackageCatalogItem[]>([]);
const showInactive = ref(false);
const visiblePackages = computed(() => showInactive.value ? packages.value : packages.value.filter(item => item.is_active !== false));
const loading = ref(false);
const saving = ref(false);
const deletingId = ref('');
const editingId = ref('');
const feedback = ref('');
const feedbackTone = ref<'success' | 'error'>('success');
const selectedPackageId = ref('');
const editingRateId = ref('');
const editingFacilityId = ref('');
type PackageTranslationEntity = Extract<TranslatableEntityType, 'delegate_package' | 'delegate_package_rate' | 'delegate_package_facility'>;
type PackageTranslationFields = Record<string, unknown> & { name?: string; description?: string; unit?: string };
const translationModalOpen = ref(false);
const translationLoading = ref(false);
const savingTranslation = ref(false);
const translationExists = ref(false);
const translationEntityType = ref<PackageTranslationEntity>('delegate_package');
const translationEntityId = ref('');
const translationSourceLabel = ref('');
const translationForm = reactive({ name: '', description: '', unit: '' });
const translationEntityLabel = computed(() => ({ delegate_package: 'Delegate package', delegate_package_rate: 'Package rate', delegate_package_facility: 'Package facility' })[translationEntityType.value]);
type TranslationStatus = 'loading' | 'complete' | 'missing' | 'error';
const translationStatuses = ref<Record<string, TranslationStatus>>({});
const translationStatusLabel = (status?: TranslationStatus) => status === 'complete' ? 'Complete' : status === 'error' ? 'Unknown' : status === 'loading' ? 'Checking' : 'Missing';
const translationStatusClass = (status?: TranslationStatus) => status === 'complete' ? 'translation-complete' : status === 'error' ? 'translation-error' : status === 'loading' ? 'translation-loading' : 'translation-missing';
const selectedPackage = computed(() => packages.value.find(item => item.id === selectedPackageId.value));
const rateForm = reactive<DelegatePackageRatePayload>({ occupancy_type: 'sharing', name: 'Twin Sharing Basis', amount: 0, currency: 'USD', payment_amount_idr: null, is_default: true, is_active: true, valid_from: null, valid_until: null });
const facilityForm = reactive<DelegatePackageFacilityPayload>({ name: '', description: null, quantity: null, unit: null, pricing_mode: 'included', sharing_amount: null, single_amount: null, currency: 'USD', display_order: 1, is_active: true });
const emptyForm = (): DelegatePackageMutationPayload => ({ code: '', name: '', package_type: 'main', selection_mode: 'required_one', description: '', display_order: 1, currency: 'USD', amount: 0, payment_amount_idr: null, is_active: true });
const form = reactive<DelegatePackageMutationPayload>(emptyForm());

const apiError = (error: unknown) => {
  const value = error as { status?: number; statusCode?: number; data?: { detail?: string | Array<{ msg?: string }>; message?: string; request_id?: string; errors?: Array<{ code?: string; message: string }> } };
  const detail = Array.isArray(value.data?.detail) ? value.data.detail[0]?.msg : value.data?.detail;
  const message = value.data?.errors?.[0]?.message || value.data?.message || detail || (error instanceof Error ? error.message : 'The package operation could not be completed.');
  const requestId = value.data?.request_id ? ` Request ID: ${value.data.request_id}.` : '';
  const status = value.statusCode || value.status;
  return `${status ? `HTTP ${status}: ` : ''}${message}${requestId}`;
};
const closeTranslation = (event?: Event) => {
  // Backdrop clicks must not discard translation text that has not been saved.
  if (event?.currentTarget instanceof HTMLElement && event.currentTarget.classList.contains('fixed')) return;
  if (savingTranslation.value) return;
  translationModalOpen.value = false;
  translationEntityId.value = '';
  translationExists.value = false;
  Object.assign(translationForm, { name: '', description: '', unit: '' });
};
const openTranslation = async (entityType: PackageTranslationEntity, entityId: string, sourceLabel: string) => {
  translationEntityType.value = entityType; translationEntityId.value = entityId; translationSourceLabel.value = sourceLabel; translationExists.value = false; Object.assign(translationForm, { name: '', description: '', unit: '' }); translationModalOpen.value = true; translationLoading.value = true;
  try { const rows = (await adminApi.getContentTranslations<PackageTranslationFields>(entityType, entityId)).data || []; const row = rows.find(item => item.locale === 'zh-CN'); translationExists.value = Boolean(row); Object.assign(translationForm, { name: String(row?.fields.name || ''), description: String(row?.fields.description || ''), unit: String(row?.fields.unit || '') }); }
  catch (error) { feedbackTone.value = 'error'; feedback.value = `Chinese translation could not be loaded. ${apiError(error)}`; }
  finally { translationLoading.value = false; }
};
const saveTranslation = async () => {
  if (!translationEntityId.value || savingTranslation.value) return;
  const requiredFields = translationEntityType.value === 'delegate_package_rate'
    ? [['name', translationForm.name]]
    : translationEntityType.value === 'delegate_package_facility'
      ? [['name', translationForm.name], ['description', translationForm.description], ['unit', translationForm.unit]]
      : [['name', translationForm.name], ['description', translationForm.description]];
  const blankFields = requiredFields.filter(([, value]) => !value.trim()).map(([field]) => field);
  if (blankFields.length) {
    feedbackTone.value = 'error';
    feedback.value = `Complete the Chinese ${blankFields.join(', ')} field${blankFields.length > 1 ? 's' : ''} before saving.`;
    return;
  }
  savingTranslation.value = true;
  const fields: PackageTranslationFields = { name: translationForm.name.trim() };
  if (translationEntityType.value !== 'delegate_package_rate') fields.description = translationForm.description.trim();
  if (translationEntityType.value === 'delegate_package_facility') fields.unit = translationForm.unit.trim();
  try { await adminApi.saveContentTranslation(translationEntityType.value, translationEntityId.value, fields); translationExists.value = true; translationStatuses.value[`${translationEntityType.value}:${translationEntityId.value}`] = 'complete'; feedbackTone.value = 'success'; feedback.value = `${translationEntityLabel.value} Chinese translation saved.`; savingTranslation.value = false; closeTranslation(); }
  catch (error) { feedbackTone.value = 'error'; feedback.value = `${translationEntityLabel.value} Chinese translation failed. ${apiError(error)}`; }
  finally { savingTranslation.value = false; }
};
const deleteTranslation = async () => {
  if (!translationEntityId.value || savingTranslation.value) return;
  if (!confirm('Delete this Simplified Chinese translation? The English source will remain unchanged.')) return;
  if (!confirm('Confirm again: the public Chinese page will fall back to English for this item.')) return;
  savingTranslation.value = true;
  try { await adminApi.deleteContentTranslation(translationEntityType.value, translationEntityId.value); translationExists.value = false; translationStatuses.value[`${translationEntityType.value}:${translationEntityId.value}`] = 'missing'; feedbackTone.value = 'success'; feedback.value = `${translationEntityLabel.value} Chinese translation deleted.`; savingTranslation.value = false; closeTranslation(); }
  catch (error) { feedbackTone.value = 'error'; feedback.value = apiError(error); }
  finally { savingTranslation.value = false; }
};
const loadPackages = async () => {
  if (!selectedEventId.value) { packages.value = []; return; }
  loading.value = true; feedback.value = '';
  try { const catalog = (await adminApi.getDelegatePackageCatalog(selectedEventId.value, 'en')).data; packages.value = [...(catalog.main_packages || []), ...(catalog.additional_packages || [])]; await loadTranslationStatuses(); }
  catch (error) { feedbackTone.value = 'error'; feedback.value = apiError(error); }
  finally { loading.value = false; }
};
const loadTranslationStatuses = async () => {
  const entities: Array<{ type: PackageTranslationEntity; id: string }> = [];
  for (const item of packages.value) { entities.push({ type: 'delegate_package', id: item.id }); for (const rate of item.rates) entities.push({ type: 'delegate_package_rate', id: rate.id }); for (const facility of item.facilities) entities.push({ type: 'delegate_package_facility', id: facility.id }); }
  translationStatuses.value = Object.fromEntries(entities.map(item => [`${item.type}:${item.id}`, 'loading' as TranslationStatus]));
  await Promise.all(entities.map(async item => { const key = `${item.type}:${item.id}`; try { const rows = (await adminApi.getContentTranslations(item.type, item.id)).data || []; translationStatuses.value[key] = rows.some(row => row.locale === 'zh-CN') ? 'complete' : 'missing'; } catch { translationStatuses.value[key] = 'error'; } }));
};
const resetForm = () => { editingId.value = ''; Object.assign(form, emptyForm()); };
const editPackage = (item: DelegatePackageCatalogItem) => {
  editingId.value = item.id;
  const rate = item.rates.find(value => value.is_default) || item.rates[0];
  Object.assign(form, { code: item.code, name: item.name, package_type: item.package_type, selection_mode: item.selection_mode, description: item.description || '', display_order: item.display_order || 1, currency: rate?.currency || 'USD', amount: rate?.amount || 0, payment_amount_idr: rate?.payment_amount_idr ?? null, is_active: item.is_active !== false });
};
const savePackage = async () => {
  if (!selectedEventId.value || saving.value) return;
  saving.value = true; feedback.value = '';
  const payload = { ...form, currency: form.currency.toUpperCase(), payment_amount_idr: form.payment_amount_idr || null };
  try {
    const packageId = editingId.value;
    if (packageId) {
      await adminApi.updateDelegatePackage(selectedEventId.value, packageId, payload);
      const currentPackage = packages.value.find(item => item.id === packageId);
      const defaultRate = currentPackage?.rates.find(rate => rate.is_default) || currentPackage?.rates[0];
      const ratePayload: DelegatePackageRatePayload = {
        occupancy_type: defaultRate?.occupancy_type || 'sharing',
        name: defaultRate?.name || 'Twin Sharing Basis',
        amount: payload.amount,
        currency: payload.currency,
        payment_amount_idr: payload.payment_amount_idr,
        is_default: true,
        is_active: payload.is_active,
        valid_from: defaultRate?.valid_from || null,
        valid_until: defaultRate?.valid_until || null
      };
      if (defaultRate) await adminApi.updateDelegatePackageRate(defaultRate.id, ratePayload);
      else await adminApi.createDelegatePackageRate(selectedEventId.value, packageId, ratePayload);
    } else {
      const created = await adminApi.createDelegatePackage(selectedEventId.value, payload);
      let createdPackageId: string | undefined = created.data?.id;
      if (!createdPackageId) {
        const catalog = (await adminApi.getDelegatePackageCatalog(selectedEventId.value)).data;
        const createdPackage = [...(catalog.main_packages || []), ...(catalog.additional_packages || [])]
          .find(item => item.code.toLowerCase() === payload.code.toLowerCase());
        createdPackageId = createdPackage?.id;
      }
      if (!createdPackageId) throw new Error('Package was created, but its ID was not returned so the tariff could not be saved. Reload the page and add the rate manually.');
      await adminApi.createDelegatePackageRate(selectedEventId.value, createdPackageId, {
        occupancy_type: 'sharing',
        name: 'Twin Sharing Basis',
        amount: payload.amount,
        currency: payload.currency,
        payment_amount_idr: payload.payment_amount_idr,
        is_default: true,
        is_active: payload.is_active,
        valid_from: null,
        valid_until: null
      });
    }
    feedbackTone.value = 'success'; feedback.value = editingId.value ? 'Delegate package updated.' : 'Delegate package created.';
    resetForm(); await loadPackages();
  } catch (error) { feedbackTone.value = 'error'; feedback.value = apiError(error); }
  finally { saving.value = false; }
};
const removePackage = async (item: DelegatePackageCatalogItem) => {
  if (!selectedEventId.value || deletingId.value || !confirm(`Remove ${item.name}?`)) return;
  deletingId.value = item.id; feedback.value = '';
  try { await adminApi.deleteDelegatePackage(selectedEventId.value, item.id); feedbackTone.value = 'success'; feedback.value = 'Delegate package deactivated successfully. It is retained for audit purposes and hidden from the active list.'; if (selectedPackageId.value === item.id) selectedPackageId.value = ''; await loadPackages(); }
  catch (error) { feedbackTone.value = 'error'; feedback.value = apiError(error); }
  finally { deletingId.value = ''; }
};
const resetRateForm = () => { editingRateId.value = ''; Object.assign(rateForm, { occupancy_type: 'sharing', name: 'Twin Sharing Basis', amount: 0, currency: 'USD', payment_amount_idr: null, is_default: false, is_active: true, valid_from: null, valid_until: null }); };
const resetFacilityForm = () => { editingFacilityId.value = ''; Object.assign(facilityForm, { name: '', description: null, quantity: null, unit: null, pricing_mode: 'included', sharing_amount: null, single_amount: null, currency: 'USD', display_order: 1, is_active: true }); };
const editRate = (packageId: string, rate: DelegatePackageRate) => { selectedPackageId.value = packageId; editingRateId.value = rate.id; Object.assign(rateForm, { occupancy_type: rate.occupancy_type, name: rate.name || (rate.occupancy_type === 'sharing' ? 'Twin Sharing Basis' : 'Single Room'), amount: rate.amount, currency: rate.currency, payment_amount_idr: rate.payment_amount_idr ?? null, is_default: rate.is_default, is_active: rate.is_active, valid_from: rate.valid_from || null, valid_until: rate.valid_until || null }); };
const editFacility = (packageId: string, facility: DelegatePackageFacility) => { selectedPackageId.value = packageId; editingFacilityId.value = facility.id; Object.assign(facilityForm, { name: facility.name, description: facility.description || null, quantity: facility.quantity ?? null, unit: facility.unit || null, pricing_mode: facility.pricing_mode === 'separately_priced' ? 'separately_priced' : 'included', sharing_amount: facility.sharing_amount ?? null, single_amount: facility.single_amount ?? null, currency: facility.currency || 'USD', display_order: facility.display_order || 1, is_active: facility.is_active }); };
const saveRate = async () => { if (!selectedPackage.value || saving.value) return; saving.value = true; feedback.value = ''; try { const payload = { ...rateForm, payment_amount_idr: rateForm.payment_amount_idr || null }; if (editingRateId.value) await adminApi.updateDelegatePackageRate(editingRateId.value, payload); else await adminApi.createDelegatePackageRate(selectedEventId.value, selectedPackage.value.id, payload); feedbackTone.value = 'success'; feedback.value = editingRateId.value ? 'Package rate updated.' : 'Package rate added and checkout product synchronized.'; resetRateForm(); await loadPackages(); } catch (error) { feedbackTone.value = 'error'; feedback.value = apiError(error); } finally { saving.value = false; } };
const saveFacility = async () => { if (!selectedPackage.value || saving.value) return; saving.value = true; feedback.value = ''; try { const payload = { ...facilityForm, sharing_amount: facilityForm.sharing_amount || null, single_amount: facilityForm.single_amount || null }; if (editingFacilityId.value) await adminApi.updateDelegatePackageFacility(editingFacilityId.value, payload); else await adminApi.createDelegatePackageFacility(selectedEventId.value, selectedPackage.value.id, payload); feedbackTone.value = 'success'; feedback.value = editingFacilityId.value ? 'Facility updated.' : 'Facility added.'; resetFacilityForm(); await loadPackages(); } catch (error) { feedbackTone.value = 'error'; feedback.value = apiError(error); } finally { saving.value = false; } };
const removeRate = async (rate: DelegatePackageRate) => { if (!confirm(`Deactivate ${rate.name || rate.occupancy_type} rate?`)) return; try { await adminApi.deleteDelegatePackageRate(rate.id); feedbackTone.value = 'success'; feedback.value = 'Rate deactivated.'; await loadPackages(); } catch (error) { feedbackTone.value = 'error'; feedback.value = apiError(error); } };
const removeFacility = async (facility: DelegatePackageFacility) => { if (!confirm(`Deactivate ${facility.name}?`)) return; try { await adminApi.deleteDelegatePackageFacility(facility.id); feedbackTone.value = 'success'; feedback.value = 'Facility deactivated.'; await loadPackages(); } catch (error) { feedbackTone.value = 'error'; feedback.value = apiError(error); } };

const closeFacilityOnEscape = (event: KeyboardEvent) => { if (event.key === 'Escape' && editingFacilityId.value && !saving.value) resetFacilityForm(); };
watch(editingFacilityId, (value) => { if (import.meta.client) document.body.style.overflow = value ? 'hidden' : ''; });
onMounted(() => window.addEventListener('keydown', closeFacilityOnEscape));
onBeforeUnmount(() => { window.removeEventListener('keydown', closeFacilityOnEscape); document.body.style.overflow = ''; });

watch(selectedEventId, async () => { resetForm(); await loadPackages(); });
if (selectedEventId.value) await loadPackages();
const money = (amount: number, currency: string) => new Intl.NumberFormat('en-US', { style: 'currency', currency: currency || 'USD' }).format(amount || 0);
</script>

<style scoped>
.field { display:block; font-size:.875rem; color:#cbd5e1; }
.field span { display:block; margin-bottom:.5rem; }
.field input,.field select,.field textarea { width:100%; border:1px solid rgba(255,255,255,.1); border-radius:1rem; background:rgba(2,6,23,.78); padding:.75rem 1rem; color:white; outline:none; }
.field input:focus,.field select:focus,.field textarea:focus { border-color:rgba(252,211,77,.55); }
.translation-badge{display:inline-flex;border-radius:999px;padding:.2rem .45rem;font-size:.55rem;font-weight:800;line-height:1;text-transform:uppercase;letter-spacing:.08em;vertical-align:middle}.translation-complete{background:rgba(52,211,153,.12);color:#a7f3d0}.translation-missing{background:rgba(251,191,36,.12);color:#fde68a}.translation-loading{background:rgba(103,232,249,.1);color:#a5f3fc}.translation-error{background:rgba(248,113,113,.12);color:#fecaca}
</style>
