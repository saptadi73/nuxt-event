<template>
  <section class="mx-auto max-w-7xl px-3 py-10 sm:px-6 lg:px-8">
    <div class="flex flex-wrap items-end justify-between gap-5">
      <div>
        <p class="text-sm uppercase tracking-[.3em] text-amber-200">Organizer catalog</p>
        <h1 class="mt-3 text-3xl font-black sm:text-4xl">Manage Delegate Packages</h1>
        <p class="mt-3 max-w-3xl text-sm leading-7 text-slate-300">Create, update, activate, or remove Delegate packages. Set the USD price and the corresponding DOKU payment amount in IDR.</p>
      </div>
      <NuxtLink to="/dashboard" class="rounded-full border border-white/20 px-5 py-3 text-sm font-semibold">Back to dashboard</NuxtLink>
    </div>

    <label class="mt-8 block max-w-md text-sm text-slate-300"><span class="mb-2 block">Event</span><select v-model="selectedEventId" class="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-amber-300/50"><option v-for="event in events" :key="event.id" :value="event.id">{{ event.name }}</option></select></label>
    <div v-if="feedback" class="mt-5 rounded-2xl border p-4 text-sm" :class="feedbackTone === 'error' ? 'border-red-400/30 bg-red-950/30 text-red-100' : 'border-emerald-300/30 bg-emerald-950/30 text-emerald-100'">{{ feedback }}</div>

    <div class="mt-8 grid gap-6 lg:grid-cols-[1fr_24rem]">
      <div>
        <p v-if="loading" class="glass-card rounded-3xl p-6 text-slate-300">Loading Delegate packages...</p>
        <div v-else-if="!packages.length" class="glass-card rounded-3xl p-6 text-slate-300">No Delegate package has been created for this event.</div>
        <div v-else class="grid gap-4 md:grid-cols-2">
          <article v-for="item in packages" :key="item.id" class="glass-card rounded-3xl p-5">
            <div class="flex items-center justify-between gap-3"><span class="text-xs font-bold uppercase tracking-[.2em] text-amber-200">{{ item.code }}</span><span class="rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[.16em]" :class="item.is_active ? 'bg-emerald-300/10 text-emerald-200' : 'bg-white/10 text-slate-400'">{{ item.is_active ? 'Active' : 'Inactive' }}</span></div>
            <h2 class="mt-4 text-xl font-bold">{{ item.name }}</h2>
            <div class="mt-4 flex flex-wrap items-end justify-between gap-3"><p class="text-2xl font-black text-amber-100">{{ money(item.amount, item.currency) }}</p><p v-if="item.payment_amount_idr" class="text-sm text-slate-400">Payment: {{ money(item.payment_amount_idr, 'IDR') }}</p></div>
            <div class="mt-5 flex flex-wrap gap-3"><button class="rounded-full border border-amber-300/40 px-5 py-2 text-sm font-semibold text-amber-100" @click="editPackage(item)">Edit</button><button class="rounded-full border border-red-300/30 px-5 py-2 text-sm font-semibold text-red-200 disabled:opacity-50" :disabled="deletingId === item.id" @click="removePackage(item)">{{ deletingId === item.id ? 'Removing...' : 'Remove' }}</button></div>
          </article>
        </div>
      </div>

      <form class="glass-card h-fit rounded-[2rem] p-5 sm:p-6" @submit.prevent="savePackage">
        <div class="flex items-center justify-between gap-3"><h2 class="text-xl font-bold">{{ editingId ? 'Update package' : 'New package' }}</h2><button v-if="editingId" type="button" class="text-sm text-slate-400" @click="resetForm">Cancel</button></div>
        <div class="mt-5 space-y-4">
          <label class="field"><span>Package name</span><input v-model.trim="form.name" required placeholder="Package A - USD500" /></label>
          <label class="field"><span>Code</span><input v-model.trim="form.code" required maxlength="30" placeholder="A" /></label>
          <div class="grid grid-cols-2 gap-3"><label class="field"><span>Price</span><input v-model.number="form.amount" type="number" min="0.01" step="0.01" required /></label><label class="field"><span>Currency</span><input v-model.trim="form.currency" maxlength="3" required /></label></div>
          <label class="field"><span>Payment amount (IDR)</span><input v-model.number="form.payment_amount_idr" type="number" min="1" step="1" placeholder="8000000" /></label>
          <label class="flex items-center gap-3 text-sm text-slate-300"><input v-model="form.is_active" type="checkbox" class="h-4 w-4 accent-amber-300" />Available for purchase</label>
          <button class="w-full rounded-full bg-amber-300 px-5 py-3 font-bold text-slate-950 disabled:opacity-50" :disabled="saving || !selectedEventId">{{ saving ? 'Saving...' : editingId ? 'Update package' : 'Create package' }}</button>
        </div>
      </form>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useAdminContent, type DelegatePackageMutationPayload } from '~/composables/useAdminContent';
import { useEvent, type DelegatePackageItem, type EventItem } from '~/composables/useEvent';

definePageMeta({ middleware: ['auth', 'admin'] });
useSeoMeta({ title: 'Manage Delegate Packages | IWBIF 2026' });

const { getEvents, getEventDelegatePackages } = useEvent();
const adminApi = useAdminContent();
const { data: eventResponse } = await useAsyncData('admin-package-events', () => getEvents(1, 100));
const events = computed<EventItem[]>(() => eventResponse.value?.data || []);
const selectedEventId = ref(events.value[0]?.id || '');
const packages = ref<DelegatePackageItem[]>([]);
const loading = ref(false);
const saving = ref(false);
const deletingId = ref('');
const editingId = ref('');
const feedback = ref('');
const feedbackTone = ref<'success' | 'error'>('success');
const emptyForm = (): DelegatePackageMutationPayload => ({ code: '', name: '', currency: 'USD', amount: 0, payment_amount_idr: null, is_active: true });
const form = reactive<DelegatePackageMutationPayload>(emptyForm());

const apiError = (error: unknown) => {
  const value = error as { data?: { message?: string; errors?: Array<{ message: string }> } };
  return value.data?.errors?.[0]?.message || value.data?.message || (error instanceof Error ? error.message : 'The package could not be saved.');
};
const loadPackages = async () => {
  if (!selectedEventId.value) { packages.value = []; return; }
  loading.value = true; feedback.value = '';
  try { packages.value = (await getEventDelegatePackages(selectedEventId.value)).data || []; }
  catch (error) { feedbackTone.value = 'error'; feedback.value = apiError(error); }
  finally { loading.value = false; }
};
const resetForm = () => { editingId.value = ''; Object.assign(form, emptyForm()); };
const editPackage = (item: DelegatePackageItem) => {
  editingId.value = item.id;
  Object.assign(form, { code: item.code, name: item.name, currency: item.currency, amount: item.amount, payment_amount_idr: item.payment_amount_idr ?? null, is_active: item.is_active });
};
const savePackage = async () => {
  if (!selectedEventId.value || saving.value) return;
  saving.value = true; feedback.value = '';
  const payload = { ...form, currency: form.currency.toUpperCase(), payment_amount_idr: form.payment_amount_idr || null };
  try {
    if (editingId.value) await adminApi.updateDelegatePackage(selectedEventId.value, editingId.value, payload);
    else await adminApi.createDelegatePackage(selectedEventId.value, payload);
    feedbackTone.value = 'success'; feedback.value = editingId.value ? 'Delegate package updated.' : 'Delegate package created.';
    resetForm(); await loadPackages();
  } catch (error) { feedbackTone.value = 'error'; feedback.value = apiError(error); }
  finally { saving.value = false; }
};
const removePackage = async (item: DelegatePackageItem) => {
  if (!selectedEventId.value || deletingId.value || !confirm(`Remove ${item.name}?`)) return;
  deletingId.value = item.id; feedback.value = '';
  try { await adminApi.deleteDelegatePackage(selectedEventId.value, item.id); feedbackTone.value = 'success'; feedback.value = 'Delegate package removed.'; await loadPackages(); }
  catch (error) { feedbackTone.value = 'error'; feedback.value = apiError(error); }
  finally { deletingId.value = ''; }
};

watch(selectedEventId, async () => { resetForm(); await loadPackages(); });
if (selectedEventId.value) await loadPackages();
const money = (amount: number, currency: string) => new Intl.NumberFormat('en-US', { style: 'currency', currency: currency || 'USD' }).format(amount || 0);
</script>

<style scoped>
.field { display:block; font-size:.875rem; color:#cbd5e1; }
.field span { display:block; margin-bottom:.5rem; }
.field input { width:100%; border:1px solid rgba(255,255,255,.1); border-radius:1rem; background:rgba(2,6,23,.78); padding:.75rem 1rem; color:white; outline:none; }
.field input:focus { border-color:rgba(252,211,77,.55); }
</style>
