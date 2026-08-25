<template>
  <section class="mx-auto max-w-7xl px-3 py-10 sm:px-6 lg:px-8">
    <header class="rounded-[2rem] border border-amber-200/20 bg-gradient-to-br from-amber-300/10 via-slate-950/80 to-slate-950/90 p-6 sm:p-8">
      <p class="text-sm uppercase tracking-[.35em] text-amber-200">{{ selectedType === 'delegate' ? 'Delegate Packages' : 'Exhibitor Packages' }}</p>
      <h1 class="mt-4 text-3xl font-black sm:text-5xl">Choose your IWBIF experience.</h1>
      <p class="mt-4 max-w-3xl text-slate-300">Choose exactly one Main package. Sharing is selected by default; Single uses its own final tariff. The Bandung trip is optional.</p>
    </header>
    <div v-if="notice" class="mt-5 rounded-2xl border p-4 text-sm" :class="noticeTone === 'error' ? 'border-rose-400/30 bg-rose-500/10 text-rose-100' : 'border-emerald-400/30 bg-emerald-500/10 text-emerald-100'">{{ notice }}</div>
    <div v-if="pending" class="mt-8 grid gap-5 md:grid-cols-2"><div v-for="n in 2" :key="n" class="h-80 animate-pulse rounded-3xl bg-white/5" /></div>
    <div v-else-if="error" class="mt-8 rounded-3xl border border-rose-400/30 bg-rose-500/10 p-6 text-rose-100">{{ error.message }}</div>
    <template v-else-if="selectedType === 'delegate'">
      <section class="mt-9">
        <div class="flex flex-wrap items-end justify-between gap-3"><div><p class="text-xs uppercase tracking-[.28em] text-amber-200">Required</p><h2 class="mt-2 text-2xl font-black">1. Select Main Package</h2></div><span v-if="!selection.mainProductId" class="text-xs font-semibold text-rose-200">Selection required</span></div>
        <div class="mt-5 grid gap-5 lg:grid-cols-2">
          <article v-for="pkg in catalog.main_packages" :key="pkg.id" class="rounded-3xl border p-5 transition sm:p-7" :class="selection.mainPackageId === pkg.id ? 'border-amber-300 bg-amber-300/10' : 'border-white/10 bg-white/5'">
            <label class="flex cursor-pointer items-start gap-3"><input type="radio" name="main-package" :checked="selection.mainPackageId === pkg.id" class="mt-1 h-5 w-5 shrink-0 accent-amber-300" @change="selectMainPackage(pkg)"><span class="min-w-0"><span class="text-xs font-bold uppercase tracking-[.25em] text-amber-200">Package {{ pkg.code }}</span><span class="mt-1 block break-words text-2xl font-bold">{{ pkg.name }}</span><span v-if="pkg.description" class="mt-2 block break-words text-sm text-slate-400">{{ pkg.description }}</span></span></label>
            <button type="button" class="mt-4 inline-flex items-center gap-2 rounded-full border border-amber-300/35 bg-amber-300/10 px-4 py-2 text-xs font-bold text-amber-100 transition hover:bg-amber-300/20" @click="openSchedule('main')">View Jakarta itinerary <span aria-hidden="true">→</span></button>
            <div class="mt-5 grid gap-3 sm:grid-cols-2">
              <label v-for="rate in activeRates(pkg)" :key="rate.id" class="cursor-pointer rounded-2xl border p-4" :class="selection.mainRateId === rate.id ? 'border-amber-300/70 bg-slate-950/70' : 'border-white/10 bg-slate-950/35'">
                <input type="radio" :name="`rate-${pkg.id}`" :disabled="selection.mainPackageId !== pkg.id || mutating" :checked="selection.mainRateId === rate.id" class="accent-amber-300" @change="selectMainRate(pkg, rate)"><span class="ml-2 font-semibold capitalize">{{ rate.occupancy_type }}</span><strong class="mt-2 block text-2xl">{{ usd(rate.amount) }}</strong><span class="mt-1 block text-xs text-slate-400">{{ rate.payment_amount_idr == null ? 'IDR payment unavailable' : `Paid as ${idr(rate.payment_amount_idr)}` }}</span>
              </label>
            </div>
            <ul class="mt-5 grid gap-2 text-sm text-slate-300 sm:grid-cols-2"><li v-for="facility in activeFacilities(pkg)" :key="facility.id" class="flex gap-2"><span class="text-amber-300">✓</span><span>{{ facility.name }}</span></li></ul>
          </article>
        </div>
      </section>
      <section v-if="catalog.additional_packages.length" class="mt-9">
        <div><p class="text-xs uppercase tracking-[.28em] text-cyan-200">Optional add-on</p><h2 class="mt-2 text-2xl font-black">2. Additional Trip</h2></div>
        <article v-for="pkg in catalog.additional_packages" :key="pkg.id" class="mt-5 rounded-3xl border p-5 sm:p-7" :class="selection.bandungSelected ? 'border-cyan-300/60 bg-cyan-300/10' : 'border-white/10 bg-white/5'">
          <label class="flex cursor-pointer items-start gap-3"><input type="checkbox" :checked="selection.bandungSelected" :disabled="mutating" class="mt-1 h-5 w-5 shrink-0 accent-cyan-300" @change="toggleAdditional(pkg, ($event.target as HTMLInputElement).checked)"><span class="min-w-0"><span class="break-words text-xl font-bold">{{ pkg.name }}</span><span class="mt-1 block break-words text-sm text-slate-400">Add this trip to your Main package.</span></span></label>
          <button type="button" class="mt-4 inline-flex items-center gap-2 rounded-full border border-cyan-300/35 bg-cyan-300/10 px-4 py-2 text-xs font-bold text-cyan-100 transition hover:bg-cyan-300/20" @click="openSchedule('additional')">View Bandung itinerary <span aria-hidden="true">→</span></button>
          <div v-if="selection.bandungSelected" class="mt-5 grid gap-3 sm:grid-cols-2"><label v-for="rate in activeRates(pkg)" :key="rate.id" class="cursor-pointer rounded-2xl border p-4" :class="selection.bandungRateId === rate.id ? 'border-cyan-300/70 bg-slate-950/70' : 'border-white/10'"><input type="radio" name="bandung-rate" :checked="selection.bandungRateId === rate.id" :disabled="mutating" class="accent-cyan-300" @change="selectAdditionalRate(rate)"><span class="ml-2 font-semibold capitalize">{{ rate.occupancy_type }}</span><strong class="mt-2 block text-2xl">{{ usd(rate.amount) }}</strong><span class="text-xs text-slate-400">{{ rate.payment_amount_idr == null ? 'IDR payment unavailable' : `Paid as ${idr(rate.payment_amount_idr)}` }}</span></label></div>
          <ul v-if="selection.bandungSelected" class="mt-5 grid gap-2 text-sm text-slate-300 sm:grid-cols-2"><li v-for="facility in activeFacilities(pkg)" :key="facility.id" class="flex gap-2"><span class="text-cyan-300">✓</span><span>{{ facility.name }}</span></li></ul>
        </article>
      </section>
      <div class="sticky bottom-4 mt-8 flex flex-col gap-3 rounded-2xl border border-white/10 bg-slate-950/90 p-4 shadow-2xl backdrop-blur sm:flex-row sm:items-center sm:justify-between"><p class="text-sm text-slate-300">{{ selection.mainProductId ? 'Main package selected. Review the official total in your cart.' : 'Select Package A or B to continue.' }}</p><NuxtLink to="/dashboard/cart" class="rounded-full bg-amber-300 px-6 py-3 text-center font-bold text-slate-950" :class="!selection.mainProductId || mutating ? 'pointer-events-none opacity-50' : ''">{{ mutating ? 'Updating cart...' : 'Review cart' }}</NuxtLink></div>
    </template>
    <div v-else class="mt-9 rounded-3xl border border-white/10 bg-white/5 p-6 text-slate-300">Exhibitor package purchasing is not available yet.</div>

    <Teleport to="body">
      <div v-if="activeSchedule" class="fixed inset-0 z-[100] flex items-end justify-center bg-slate-950/85 p-0 backdrop-blur-sm sm:items-center sm:p-5" role="dialog" aria-modal="true" :aria-labelledby="`schedule-title-${activeSchedule.key}`" @click.self="closeSchedule">
        <article class="schedule-modal max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-t-[2rem] border border-white/10 bg-slate-950 shadow-2xl sm:rounded-[2rem]">
          <header class="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-white/10 bg-slate-950/95 p-5 backdrop-blur sm:p-7">
            <div><p class="text-xs font-bold uppercase tracking-[.28em]" :class="activeSchedule.key === 'main' ? 'text-amber-200' : 'text-cyan-200'">{{ activeSchedule.eyebrow }}</p><h2 :id="`schedule-title-${activeSchedule.key}`" class="mt-2 text-2xl font-black text-white sm:text-3xl">{{ activeSchedule.title }}</h2><p class="mt-2 text-sm text-slate-400">{{ activeSchedule.subtitle }}</p></div>
            <button type="button" class="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-white/15 text-xl text-slate-300 hover:bg-white/10 hover:text-white" aria-label="Close itinerary" @click="closeSchedule">×</button>
          </header>
          <div class="p-5 sm:p-7">
            <div class="relative space-y-5 before:absolute before:bottom-4 before:left-[.7rem] before:top-4 before:w-px before:bg-white/10">
              <section v-for="day in activeSchedule.days" :key="day.date" class="relative pl-9"><span class="absolute left-0 top-1 h-6 w-6 rounded-full border-4 border-slate-950" :class="activeSchedule.key === 'main' ? 'bg-amber-300' : 'bg-cyan-300'"/><div class="rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-5"><p class="text-xs font-bold uppercase tracking-[.2em]" :class="activeSchedule.key === 'main' ? 'text-amber-200' : 'text-cyan-200'">{{ day.date }}</p><h3 class="mt-1 text-lg font-bold text-white">{{ day.location }}</h3><ul class="mt-3 space-y-2 text-sm leading-6 text-slate-300"><li v-for="activity in day.activities" :key="activity" class="flex gap-2"><span class="text-slate-500">•</span><span>{{ activity }}</span></li></ul></div></section>
            </div>
            <div v-if="activeSchedule.highlights?.length" class="mt-7 rounded-2xl border border-amber-300/20 bg-amber-300/10 p-5"><h3 class="font-bold text-amber-100">Event highlights</h3><div class="mt-3 flex flex-wrap gap-2"><span v-for="highlight in activeSchedule.highlights" :key="highlight" class="rounded-full border border-amber-200/20 bg-slate-950/40 px-3 py-1.5 text-xs text-amber-50">{{ highlight }}</span></div></div>
            <div v-if="activeSchedule.notes?.length" class="mt-5 rounded-2xl border border-white/10 p-5"><h3 class="font-bold text-white">Important notes</h3><ul class="mt-3 space-y-2 text-sm text-slate-400"><li v-for="note in activeSchedule.notes" :key="note">• {{ note }}</li></ul></div>
          </div>
        </article>
      </div>
    </Teleport>
  </section>
</template>

<script setup lang="ts">
import { useEvent, type DelegatePackageCatalog, type DelegatePackageCatalogItem, type DelegatePackageRate } from '~/composables/useEvent';
import { useStore, type StoreCart } from '~/composables/useStore';
import { delegatePackageSchedules, type PackageScheduleDetail } from '~/config/delegatePackageSchedules';

useSeoMeta({ title: 'Delegate Packages | IWBIF 2026' });
const route = useRoute();
const selectedType = computed(() => route.query.type === 'exhibitor' ? 'exhibitor' : 'delegate');
const auth = useAuthStore();
const { getEvents, getDelegatePackageCatalog } = useEvent();
const store = useStore();
const eventId = ref(''), cart = ref<StoreCart | null>(null), mutating = ref(false), notice = ref(''), noticeTone = ref<'success' | 'error'>('success');
const activeSchedule = ref<PackageScheduleDetail | null>(null);
const emptyCatalog: DelegatePackageCatalog = { main_packages: [], additional_packages: [] };
const selection = reactive({ mainPackageId: null as string | null, mainRateId: null as string | null, mainProductId: null as string | null, bandungSelected: false, bandungRateId: null as string | null, bandungProductId: null as string | null });
const { data, pending, error } = await useAsyncData('delegate-package-selector', async () => { const event = (await getEvents(1, 1)).data[0]; if (!event) throw new Error('No event is currently published.'); eventId.value = event.id; return getDelegatePackageCatalog(event.id); });
const catalog = computed(() => data.value?.data || emptyCatalog);
const activeRates = (pkg: DelegatePackageCatalogItem) => pkg.rates.filter(rate => rate.is_active);
const activeFacilities = (pkg: DelegatePackageCatalogItem) => pkg.facilities.filter(item => item.is_active).sort((a, b) => (a.display_order || 0) - (b.display_order || 0));
const defaultRate = (pkg: DelegatePackageCatalogItem) => activeRates(pkg).find(rate => rate.is_default) || activeRates(pkg)[0];
const findRateByProduct = (productId: string) => [...catalog.value.main_packages, ...catalog.value.additional_packages].flatMap(pkg => pkg.rates.map(rate => ({ pkg, rate }))).find(item => item.rate.product_id === productId);
const syncFromCart = (value: StoreCart) => { Object.assign(selection, { mainPackageId: null, mainRateId: null, mainProductId: null, bandungSelected: false, bandungRateId: null, bandungProductId: null }); for (const item of value.items || []) { const found = findRateByProduct(item.product_id); if (!found) continue; if (found.pkg.package_type === 'main') Object.assign(selection, { mainPackageId: found.pkg.id, mainRateId: found.rate.id, mainProductId: found.rate.product_id }); else Object.assign(selection, { bandungSelected: true, bandungRateId: found.rate.id, bandungProductId: found.rate.product_id }); } };
const apiError = (error: unknown) => { const value = error as { data?: { message?: string; errors?: Array<{ message?: string }> } }; return value.data?.errors?.[0]?.message || value.data?.message || 'Package selection could not be updated.'; };
const addRate = async (rate: DelegatePackageRate) => { if (!auth.isAuthenticated) { await navigateTo('/auth/register'); return false; } if (!eventId.value || mutating.value) return false; mutating.value = true; notice.value = ''; try { cart.value = (await store.addCartItem(eventId.value, rate.product_id, 1)).data; syncFromCart(cart.value); noticeTone.value = 'success'; notice.value = 'Your package selection has been saved.'; return true; } catch (error) { noticeTone.value = 'error'; notice.value = apiError(error); return false; } finally { mutating.value = false; } };
const selectMainPackage = async (pkg: DelegatePackageCatalogItem) => { const rate = defaultRate(pkg); if (rate) await addRate(rate); };
const selectMainRate = async (pkg: DelegatePackageCatalogItem, rate: DelegatePackageRate) => { if (selection.mainPackageId === pkg.id) await addRate(rate); };
const toggleAdditional = async (pkg: DelegatePackageCatalogItem, checked: boolean) => { if (checked) { const rate = defaultRate(pkg); if (rate) await addRate(rate); return; } if (!selection.bandungProductId || !eventId.value) return; mutating.value = true; try { cart.value = (await store.removeCartItem(eventId.value, selection.bandungProductId)).data; syncFromCart(cart.value); notice.value = 'Additional trip removed.'; } catch (error) { noticeTone.value = 'error'; notice.value = apiError(error); } finally { mutating.value = false; } };
const selectAdditionalRate = (rate: DelegatePackageRate) => addRate(rate);
const usd = (amount: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount);
const idr = (amount: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(amount);
const openSchedule = (key: 'main' | 'additional') => { activeSchedule.value = delegatePackageSchedules[key]; if (import.meta.client) document.body.style.overflow = 'hidden'; };
const closeSchedule = () => { activeSchedule.value = null; if (import.meta.client) document.body.style.overflow = ''; };
const handleEscape = (event: KeyboardEvent) => { if (event.key === 'Escape') closeSchedule(); };
onMounted(async () => { if (!eventId.value) eventId.value = (await getEvents(1, 1)).data[0]?.id || ''; if (auth.isAuthenticated && eventId.value) { try { cart.value = (await store.getCart(eventId.value)).data; syncFromCart(cart.value); } catch { /* a new account may not have a cart yet */ } } });
onMounted(() => window.addEventListener('keydown', handleEscape));
onBeforeUnmount(() => { window.removeEventListener('keydown', handleEscape); document.body.style.overflow = ''; });
</script>
