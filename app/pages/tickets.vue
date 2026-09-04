<template>
  <section class="mx-auto max-w-7xl px-3 py-10 sm:px-6 lg:px-8">
    <header class="rounded-[2rem] border border-amber-200/20 bg-gradient-to-br from-amber-300/10 via-slate-950/80 to-slate-950/90 p-6 sm:p-8">
      <p class="text-sm uppercase tracking-[.35em] text-amber-200">{{ selectedType === 'delegate' ? copy.delegatePackages : copy.exhibitorPackages }}</p>
      <h1 class="mt-4 text-3xl font-black sm:text-5xl">{{ copy.title }}</h1>
      <p class="mt-4 max-w-3xl text-slate-300">{{ copy.intro }}</p>
    </header>
    <nav class="mt-6 grid gap-3 rounded-2xl border border-white/10 bg-white/5 p-2 sm:grid-cols-2" :aria-label="copy.participationType">
      <NuxtLink to="/tickets?type=delegate" class="rounded-xl px-5 py-3 text-center text-sm font-bold transition" :class="selectedType === 'delegate' ? 'bg-amber-300 text-slate-950' : 'text-slate-300 hover:bg-white/5'">{{ copy.joinDelegate }}</NuxtLink>
      <NuxtLink to="/tickets?type=exhibitor" class="rounded-xl px-5 py-3 text-center text-sm font-bold transition" :class="selectedType === 'exhibitor' ? 'bg-cyan-300 text-slate-950' : 'text-slate-300 hover:bg-white/5'">{{ copy.joinExhibitor }}</NuxtLink>
    </nav>
    <div v-if="notice" class="mt-5 rounded-2xl border p-4 text-sm" :class="noticeTone === 'error' ? 'border-rose-400/30 bg-rose-500/10 text-rose-100' : 'border-emerald-400/30 bg-emerald-500/10 text-emerald-100'">{{ notice }}</div>
    <div v-if="pending" class="mt-8 grid gap-5 md:grid-cols-2"><div v-for="n in 2" :key="n" class="h-80 animate-pulse rounded-3xl bg-white/5" /></div>
    <div v-else-if="error" class="mt-8 rounded-3xl border border-rose-400/30 bg-rose-500/10 p-6 text-rose-100">{{ error.message }}</div>
    <template v-else-if="selectedType === 'delegate'">
      <section v-if="!postRegistrationAdditional" class="mt-9">
        <div class="flex flex-wrap items-end justify-between gap-3"><div><p class="text-xs uppercase tracking-[.28em] text-amber-200">{{ copy.required }}</p><h2 class="mt-2 text-2xl font-black">{{ copy.selectMain }}</h2></div><span v-if="!selection.mainProductId" class="text-xs font-semibold text-rose-200">{{ copy.selectionRequired }}</span></div>
        <div class="mt-5 grid gap-5 lg:grid-cols-2">
          <article v-for="pkg in catalog.main_packages" :key="pkg.id" class="rounded-3xl border p-5 transition sm:p-7" :class="selection.mainPackageId === pkg.id ? 'border-amber-300 bg-amber-300/10' : 'border-white/10 bg-white/5'">
            <label class="flex cursor-pointer items-start gap-3"><input type="radio" name="main-package" :checked="selection.mainPackageId === pkg.id" class="mt-1 h-5 w-5 shrink-0 accent-amber-300" @change="selectMainPackage(pkg)"><span class="min-w-0"><span class="text-xs font-bold uppercase tracking-[.25em] text-amber-200">{{ copy.package }} {{ pkg.code }}</span><span class="mt-1 block break-words text-2xl font-bold">{{ pkg.name }} <small v-if="isChineseFallback(pkg)" class="fallback-badge">EN fallback</small></span><span v-if="pkg.description" class="mt-2 block break-words text-sm text-slate-400">{{ pkg.description }}</span></span></label>
            <button type="button" class="mt-4 inline-flex items-center gap-2 rounded-full border border-amber-300/35 bg-amber-300/10 px-4 py-2 text-xs font-bold text-amber-100 transition hover:bg-amber-300/20" @click="openSchedule('main')">{{ copy.jakartaItinerary }} <span aria-hidden="true">→</span></button>
            <div class="mt-5 grid gap-3 sm:grid-cols-2">
              <label v-for="rate in activeRates(pkg)" :key="rate.id" class="cursor-pointer rounded-2xl border p-4" :class="isRatePreviewSelected(pkg, rate) ? 'border-amber-300/70 bg-slate-950/70' : 'border-white/10 bg-slate-950/35'">
                <input type="radio" :name="`rate-${pkg.id}`" :disabled="selection.mainPackageId !== pkg.id || mutating" :checked="isRatePreviewSelected(pkg, rate)" class="accent-amber-300" @change="selectMainRate(pkg, rate)"><span class="ml-2 font-semibold">{{ occupancyLabel(rate.occupancy_type) }}</span><small v-if="isChineseFallback(rate)" class="fallback-badge ml-2">EN fallback</small><strong class="mt-2 block text-2xl">{{ usd(rate.amount) }}</strong>
              </label>
            </div>
            <ul class="mt-5 grid gap-2 text-sm text-slate-300 sm:grid-cols-2"><li v-for="facility in activeFacilities(pkg)" :key="facility.id" class="flex gap-2"><span class="text-amber-300">✓</span><span>{{ facility.name }}</span></li></ul>
          </article>
        </div>
      </section>
      <section v-if="catalog.additional_packages.length" class="mt-9">
        <div><p class="text-xs uppercase tracking-[.28em] text-cyan-200">{{ copy.optional }}</p><h2 class="mt-2 text-2xl font-black">{{ copy.additionalTrip }}</h2></div>
        <article v-for="pkg in catalog.additional_packages" :key="pkg.id" class="mt-5 rounded-3xl border p-5 sm:p-7" :class="selection.bandungSelected ? 'border-cyan-300/60 bg-cyan-300/10' : 'border-white/10 bg-white/5'">
          <label class="flex items-start gap-3" :class="canBuyAdditional(pkg) ? 'cursor-pointer' : 'cursor-not-allowed opacity-75'"><input type="checkbox" :checked="selection.bandungSelected" :disabled="mutating || !canBuyAdditional(pkg)" class="mt-1 h-5 w-5 shrink-0 accent-cyan-300" @change="toggleAdditional(pkg, ($event.target as HTMLInputElement).checked)"><span class="min-w-0"><span class="break-words text-xl font-bold">{{ pkg.name }} <small v-if="isChineseFallback(pkg)" class="fallback-badge">EN fallback</small></span><span class="mt-1 block break-words text-sm text-slate-400">{{ copy.addTrip }}</span></span></label>
          <div v-if="postRegistrationAdditional && additionalState(pkg)" class="mt-4 rounded-2xl border border-white/10 bg-slate-950/50 p-4 text-sm"><strong class="uppercase tracking-wider text-cyan-200">{{ additionalState(pkg)?.purchase_status?.replace('_', ' ') }}</strong><p v-if="additionalState(pkg)?.reason" class="mt-2 text-slate-400">{{ additionalState(pkg)?.reason }}</p><button v-if="['pending','partially_paid'].includes(additionalState(pkg)?.purchase_status || '')" type="button" class="mt-3 rounded-full bg-cyan-300 px-5 py-2 font-bold text-slate-950 disabled:opacity-50" :disabled="Boolean(resumingOrderId)" @click="continueAdditionalPayment(pkg)">{{ resumingOrderId === additionalState(pkg)?.existing_order_id ? copy.updating : 'Continue Payment' }}</button><span v-else-if="additionalState(pkg)?.purchase_status === 'owned'" class="mt-3 block font-semibold text-emerald-300">Already purchased</span></div>
          <button type="button" class="mt-4 inline-flex items-center gap-2 rounded-full border border-cyan-300/35 bg-cyan-300/10 px-4 py-2 text-xs font-bold text-cyan-100 transition hover:bg-cyan-300/20" @click="openSchedule('additional')">{{ copy.bandungItinerary }} <span aria-hidden="true">→</span></button>
          <div v-if="selection.bandungSelected" class="mt-5 grid gap-3 sm:grid-cols-2"><label v-for="rate in activeRates(pkg)" :key="rate.id" class="rounded-2xl border p-4" :class="[selection.bandungRateId === rate.id ? 'border-cyan-300/70 bg-slate-950/70' : 'border-white/10', canBuyAdditionalRate(rate) ? 'cursor-pointer' : 'cursor-not-allowed opacity-50']"><input type="radio" name="bandung-rate" :checked="selection.bandungRateId === rate.id" :disabled="mutating || !canBuyAdditionalRate(rate)" class="accent-cyan-300" @change="selectAdditionalRate(rate)"><span class="ml-2 font-semibold">{{ occupancyLabel(rate.occupancy_type) }}</span><strong class="mt-2 block text-2xl">{{ usd(rate.amount) }}</strong></label></div>
          <ul v-if="selection.bandungSelected" class="mt-5 grid gap-2 text-sm text-slate-300 sm:grid-cols-2"><li v-for="facility in activeFacilities(pkg)" :key="facility.id" class="flex gap-2"><span class="text-cyan-300">✓</span><span>{{ facility.name }}</span></li></ul>
        </article>
      </section>
      <section v-if="!postRegistrationAdditional && catalog.exhibitor_packages.length" class="mt-9">
        <div><p class="text-xs uppercase tracking-[.28em] text-cyan-200">{{ copy.optional }}</p><h2 class="mt-2 text-2xl font-black">{{ copy.addExhibitor }}</h2><p class="mt-2 max-w-2xl text-sm text-slate-400">{{ copy.exhibitorAlongside }}</p></div>
        <article v-for="pkg in catalog.exhibitor_packages" :key="pkg.id" class="mt-5 rounded-3xl border p-5 sm:p-7" :class="selection.exhibitorSelected ? 'border-cyan-300/60 bg-cyan-300/10' : 'border-white/10 bg-white/5'">
          <label class="flex cursor-pointer items-start gap-3"><input type="checkbox" :checked="selection.exhibitorSelected" :disabled="mutating" class="mt-1 h-5 w-5 shrink-0 accent-cyan-300" @change="toggleExhibitor(pkg, ($event.target as HTMLInputElement).checked)"><span><span class="text-xl font-bold">{{ pkg.name }} <small v-if="isChineseFallback(pkg)" class="fallback-badge">EN fallback</small></span><span v-if="pkg.description" class="mt-2 block text-sm text-slate-400">{{ pkg.description }}</span><strong class="mt-3 block text-2xl text-cyan-100">{{ defaultRate(pkg) ? usd(defaultRate(pkg)!.amount) : '' }}</strong></span></label>
        </article>
      </section>
      <div class="sticky bottom-4 mt-8 flex flex-col gap-3 rounded-2xl border border-white/10 bg-slate-950/90 p-4 shadow-2xl backdrop-blur sm:flex-row sm:items-center sm:justify-between"><p class="text-sm" :class="paymentConfigurationReady ? 'text-slate-300' : 'text-rose-200'">{{ selectionMessage }}</p><NuxtLink to="/dashboard/cart" class="rounded-full bg-amber-300 px-6 py-3 text-center font-bold text-slate-950" :class="!canReviewCart ? 'pointer-events-none opacity-50' : ''">{{ mutating ? copy.updating : copy.review }}</NuxtLink></div>
    </template>
    <template v-else>
      <section class="mt-9">
        <div><p class="text-xs uppercase tracking-[.28em] text-cyan-200">{{ copy.standalone }}</p><h2 class="mt-2 text-2xl font-black">{{ copy.selectExhibitor }}</h2><p class="mt-2 max-w-2xl text-sm text-slate-400">{{ copy.exhibitorIndependent }}</p></div>
        <div v-if="!catalog.exhibitor_packages.length" class="mt-5 rounded-3xl border border-white/10 bg-white/5 p-6 text-slate-300">{{ copy.exhibitorUnavailable }}</div>
        <article v-for="pkg in catalog.exhibitor_packages" :key="pkg.id" class="mt-5 rounded-3xl border p-5 sm:p-7" :class="selection.exhibitorSelected ? 'border-cyan-300 bg-cyan-300/10' : 'border-white/10 bg-white/5'">
          <label class="flex cursor-pointer items-start gap-3"><input type="radio" name="exhibitor-package" :checked="selection.exhibitorPackageId === pkg.id" :disabled="mutating" class="mt-1 h-5 w-5 shrink-0 accent-cyan-300" @change="selectExhibitorPackage(pkg)"><span class="min-w-0"><span class="text-xs font-bold uppercase tracking-[.25em] text-cyan-200">{{ copy.exhibitorPackage }}</span><span class="mt-1 block text-2xl font-bold">{{ pkg.name }} <small v-if="isChineseFallback(pkg)" class="fallback-badge">EN fallback</small></span><span v-if="pkg.description" class="mt-2 block text-sm text-slate-400">{{ pkg.description }}</span><strong class="mt-4 block text-3xl text-cyan-100">{{ defaultRate(pkg) ? usd(defaultRate(pkg)!.amount) : '' }}</strong></span></label>
          <ul class="mt-5 grid gap-2 text-sm text-slate-300 sm:grid-cols-2"><li v-for="facility in activeFacilities(pkg)" :key="facility.id" class="flex gap-2"><span class="text-cyan-300">✓</span><span>{{ facility.name }}</span></li></ul>
        </article>
      </section>
      <div class="sticky bottom-4 mt-8 flex flex-col gap-3 rounded-2xl border border-white/10 bg-slate-950/90 p-4 shadow-2xl backdrop-blur sm:flex-row sm:items-center sm:justify-between"><p class="text-sm" :class="paymentConfigurationReady ? 'text-slate-300' : 'text-rose-200'">{{ selectionMessage }}</p><NuxtLink to="/dashboard/cart" class="rounded-full bg-cyan-300 px-6 py-3 text-center font-bold text-slate-950" :class="!canReviewCart ? 'pointer-events-none opacity-50' : ''">{{ mutating ? copy.updating : copy.review }}</NuxtLink></div>
    </template>

    <Teleport to="body">
      <div v-if="activeSchedule" class="fixed inset-0 z-[100] flex items-end justify-center bg-slate-950/85 p-0 backdrop-blur-sm sm:items-center sm:p-5" role="dialog" aria-modal="true" :aria-labelledby="`schedule-title-${activeSchedule.key}`" @click.self="closeSchedule">
        <article class="schedule-modal max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-t-[2rem] border border-white/10 bg-slate-950 shadow-2xl sm:rounded-[2rem]">
          <header class="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-white/10 bg-slate-950/95 p-5 backdrop-blur sm:p-7">
            <div><p class="text-xs font-bold uppercase tracking-[.28em]" :class="activeSchedule.key === 'main' ? 'text-amber-200' : 'text-cyan-200'">{{ activeSchedule.eyebrow }}</p><h2 :id="`schedule-title-${activeSchedule.key}`" class="mt-2 text-2xl font-black text-white sm:text-3xl">{{ activeSchedule.title }}</h2><p class="mt-2 text-sm text-slate-400">{{ activeSchedule.subtitle }}</p></div>
            <button type="button" class="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-white/15 text-xl text-slate-300 hover:bg-white/10 hover:text-white" :aria-label="copy.closeItinerary" @click="closeSchedule">×</button>
          </header>
          <div class="p-5 sm:p-7">
            <div class="relative space-y-5 before:absolute before:bottom-4 before:left-[.7rem] before:top-4 before:w-px before:bg-white/10">
              <section v-for="day in activeSchedule.days" :key="day.date" class="relative pl-9"><span class="absolute left-0 top-1 h-6 w-6 rounded-full border-4 border-slate-950" :class="activeSchedule.key === 'main' ? 'bg-amber-300' : 'bg-cyan-300'"/><div class="rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-5"><p class="text-xs font-bold uppercase tracking-[.2em]" :class="activeSchedule.key === 'main' ? 'text-amber-200' : 'text-cyan-200'">{{ day.date }}</p><h3 class="mt-1 text-lg font-bold text-white">{{ day.location }}</h3><ul class="mt-3 space-y-2 text-sm leading-6 text-slate-300"><li v-for="activity in day.activities" :key="activity" class="flex gap-2"><span class="text-slate-500">•</span><span>{{ activity }}</span></li></ul></div></section>
            </div>
            <div v-if="activeSchedule.highlights?.length" class="mt-7 rounded-2xl border border-amber-300/20 bg-amber-300/10 p-5"><h3 class="font-bold text-amber-100">{{ copy.highlights }}</h3><div class="mt-3 flex flex-wrap gap-2"><span v-for="highlight in activeSchedule.highlights" :key="highlight" class="rounded-full border border-amber-200/20 bg-slate-950/40 px-3 py-1.5 text-xs text-amber-50">{{ highlight }}</span></div></div>
            <div v-if="activeSchedule.notes?.length" class="mt-5 rounded-2xl border border-white/10 p-5"><h3 class="font-bold text-white">{{ copy.notes }}</h3><ul class="mt-3 space-y-2 text-sm text-slate-400"><li v-for="note in activeSchedule.notes" :key="note">• {{ note }}</li></ul></div>
          </div>
        </article>
      </div>
    </Teleport>
  </section>
</template>

<script setup lang="ts">
import { useEvent, type DelegatePackageCatalog, type DelegatePackageCatalogItem, type DelegatePackageRate } from '~/composables/useEvent';
import { hasMainPackageEntitlement, useStore, type PersonalizedAdditionalProduct, type StoreCart } from '~/composables/useStore';
import { usePayment } from '~/composables/usePayment';
import { delegatePackageSchedules, delegatePackageSchedulesZh, type PackageScheduleDetail } from '~/config/delegatePackageSchedules';

const {locale}=useI18n();
const messages={
  en:{delegatePackages:'Delegate Packages',exhibitorPackages:'Exhibitor Packages',title:'Choose your IWBIF experience.',intro:'Join as a Delegate, an Exhibitor, or both. Delegate participation requires one Main Package; Exhibitor participation can be purchased independently.',participationType:'Participation type',joinDelegate:'Join as Delegate',joinExhibitor:'Join as Exhibitor',required:'Required',selectMain:'1. Select Main Package',selectionRequired:'Selection required',optional:'Optional add-on',additionalTrip:'2. Additional Trip',addTrip:'Available only with a Main Delegate Package.',addExhibitor:'3. Add Exhibitor Package',exhibitorAlongside:'Delegates may also showcase their organisation by adding the Exhibitor Package.',standalone:'Independent participation',selectExhibitor:'Select Exhibitor Package',exhibitorIndependent:'No Delegate Main Package is required. You can participate only as an Exhibitor.',exhibitorPackage:'Exhibitor Package',exhibitorSelected:'Exhibitor Package selected. Review the official total in your cart.',updating:'Updating cart…',review:'Review cart',exhibitorUnavailable:'No active Exhibitor Package is available right now.',selectMessage:'Select Package A or B to continue.',paymentMissing:'Online payment is not configured for the selected rate. Please contact the organizer.',selected:'Your packages are selected. Review the official total in your cart.',single:'Single Occupancy',sharing:'Sharing Occupancy',standard:'Standard Access',updateError:'Package selection could not be updated.',saved:'Your package selection has been saved.',removed:'Package removed from your cart.',noEvent:'No event is currently published.',package:'Package',jakartaItinerary:'View Jakarta itinerary',bandungItinerary:'View Bandung itinerary',closeItinerary:'Close itinerary',highlights:'Event highlights',notes:'Important notes'},
  'zh-CN':{delegatePackages:'代表套餐',exhibitorPackages:'参展商套餐',title:'选择您的 IWBIF 体验。',intro:'您可以作为代表、参展商或同时以两种身份参加。代表必须选择一个主套餐；参展商套餐可独立购买。',participationType:'参与类型',joinDelegate:'作为代表参加',joinExhibitor:'作为参展商参加',required:'必选',selectMain:'1. 选择主套餐',selectionRequired:'必须选择',optional:'可选附加项',additionalTrip:'2. 附加行程',addTrip:'仅限已选择代表主套餐的用户。',addExhibitor:'3. 添加参展商套餐',exhibitorAlongside:'代表也可以添加参展商套餐，以展示其机构与产品。',standalone:'独立参与',selectExhibitor:'选择参展商套餐',exhibitorIndependent:'无需购买代表主套餐，您可以仅以参展商身份参加。',exhibitorPackage:'参展商套餐',exhibitorSelected:'已选择参展商套餐。请在购物车中查看官方总额。',updating:'正在更新购物车…',review:'查看购物车',exhibitorUnavailable:'目前没有可购买的参展商套餐。',selectMessage:'请选择套餐 A 或 B 以继续。',paymentMissing:'所选价格尚未配置在线付款。请联系主办方。',selected:'已选择套餐。请在购物车中查看官方总额。',single:'单人住宿',sharing:'合住',standard:'标准参展权限',updateError:'无法更新套餐选择。',saved:'您的套餐选择已保存。',removed:'套餐已从购物车移除。',noEvent:'当前尚未发布活动。',package:'套餐',jakartaItinerary:'查看雅加达行程',bandungItinerary:'查看万隆行程',closeItinerary:'关闭行程',highlights:'活动亮点',notes:'重要说明'}
} as const;
const copy=computed(()=>messages[locale.value==='zh-CN'?'zh-CN':'en']);
useSeoMeta({title:()=>`${copy.value.delegatePackages} | IWBIF 2026`,description:()=>copy.value.intro});
const route = useRoute();
const selectedType = computed(() => route.query.type === 'exhibitor' ? 'exhibitor' : 'delegate');
const auth = useAuthStore();
const { getEvents, getDelegatePackageCatalog } = useEvent();
const store = useStore();
const paymentApi = usePayment();
const eventId = ref(''), cart = ref<StoreCart | null>(null), mutating = ref(false), notice = ref(''), noticeTone = ref<'success' | 'error'>('success');
const personalizedAdditional = ref<PersonalizedAdditionalProduct[]>([]);
const resumingOrderId = ref('');
const activeSchedule = ref<PackageScheduleDetail | null>(null);
const emptyCatalog: DelegatePackageCatalog = { main_packages: [], additional_packages: [], exhibitor_packages: [] };
const selection = reactive({ mainPackageId: null as string | null, mainRateId: null as string | null, mainProductId: null as string | null, bandungSelected: false, bandungRateId: null as string | null, bandungProductId: null as string | null, exhibitorSelected: false, exhibitorPackageId: null as string | null, exhibitorRateId: null as string | null, exhibitorProductId: null as string | null });
const { data, pending, error } = await useAsyncData('delegate-package-selector', async () => {
  const event = (await getEvents(1, 1)).data[0];
  if (!event) throw new Error(copy.value.noEvent);
  eventId.value = event.id;
  const [catalogResponse, productsResponse, additionalResponse] = await Promise.all([
    getDelegatePackageCatalog(event.id),
    store.getProducts(event.id),
    auth.isAuthenticated ? store.getMyAdditionalProducts(event.id).catch(() => null) : Promise.resolve(null)
  ]);
  personalizedAdditional.value = additionalResponse?.data || [];
  const productsById = new Map(productsResponse.data.map(product => [product.id, product]));
  const packages = [...catalogResponse.data.main_packages, ...catalogResponse.data.additional_packages, ...(catalogResponse.data.exhibitor_packages || [])];
  for (const pkg of packages) {
    for (const rate of pkg.rates) {
      if (rate.payment_amount_idr != null) continue;
      const product = productsById.get(rate.product_id);
      if (product?.currency?.toUpperCase() !== 'IDR') continue;
      const paymentAmount = product.amount ?? product.price;
      if (paymentAmount != null) rate.payment_amount_idr = Number(paymentAmount);
    }
  }
  return catalogResponse;
}, { watch: [locale] });
const catalog = computed(() => data.value?.data || emptyCatalog);
const activeRates = (pkg: DelegatePackageCatalogItem) => pkg.rates.filter(rate => rate.is_active);
const activeFacilities = (pkg: DelegatePackageCatalogItem) => pkg.facilities.filter(item => item.is_active).sort((a, b) => (a.display_order || 0) - (b.display_order || 0));
const isChineseFallback = (item: { translation_fallback?: boolean }) => locale.value === 'zh-CN' && item.translation_fallback === true;
const defaultRate = (pkg: DelegatePackageCatalogItem) => activeRates(pkg).find(rate => rate.is_default) || activeRates(pkg)[0];
const isRatePreviewSelected = (pkg: DelegatePackageCatalogItem, rate: DelegatePackageRate) => {
  if (selection.mainPackageId === pkg.id) return selection.mainRateId === rate.id;
  return defaultRate(pkg)?.id === rate.id;
};
const findRateByProduct = (productId: string) => [...catalog.value.main_packages, ...catalog.value.additional_packages, ...catalog.value.exhibitor_packages].flatMap(pkg => pkg.rates.map(rate => ({ pkg, rate }))).find(item => item.rate.product_id === productId);
const selectedRates = computed(() => [selection.mainProductId, selection.bandungProductId, selection.exhibitorProductId].filter(Boolean).map(productId => findRateByProduct(productId!)?.rate).filter((rate): rate is DelegatePackageRate => Boolean(rate)));
const paymentConfigurationReady = computed(() => selectedRates.value.every(rate => rate.payment_amount_idr != null));
const postRegistrationAdditional = computed(() => hasMainPackageEntitlement(personalizedAdditional.value));
const additionalProductsFor = (pkg: DelegatePackageCatalogItem) => {
  const ids = new Set(pkg.rates.map(rate => rate.product_id));
  return personalizedAdditional.value.filter(product => ids.has(product.id));
};
const additionalState = (pkg: DelegatePackageCatalogItem) => {
  const products = additionalProductsFor(pkg);
  const priority = ['partially_paid', 'pending', 'owned', 'available', 'main_payment_required', 'registration_required', 'unavailable'];
  return products.sort((a, b) => priority.indexOf(a.purchase_status) - priority.indexOf(b.purchase_status))[0] || null;
};
const canBuyAdditional = (pkg: DelegatePackageCatalogItem) => postRegistrationAdditional.value ? additionalProductsFor(pkg).some(item => item.purchase_status === 'available' && item.is_purchasable) : Boolean(selection.mainProductId);
const canBuyAdditionalRate = (rate: DelegatePackageRate) => {
  if (!postRegistrationAdditional.value) return true;
  const product = personalizedAdditional.value.find(item => item.id === rate.product_id);
  return product?.purchase_status === 'available' && product.is_purchasable;
};
const continueAdditionalPayment = async (pkg: DelegatePackageCatalogItem) => {
  const state = additionalState(pkg);
  const orderId = state?.existing_order_id;
  if (!orderId || resumingOrderId.value) return;
  resumingOrderId.value = orderId;
  notice.value = '';
  try {
    sessionStorage.setItem('iwbif-store-order-id', orderId);
    const checkout = (await paymentApi.continueOrderPayment(orderId)).data;
    if (checkout.payment_id) sessionStorage.setItem('iwbif-payment-id', checkout.payment_id);
    if (checkout.payment_url) window.location.assign(checkout.payment_url);
    else await navigateTo(`/dashboard/payment-status?order_id=${encodeURIComponent(orderId)}&payment_id=${encodeURIComponent(checkout.payment_id || '')}`);
  } catch (error) {
    noticeTone.value = 'error';
    notice.value = apiError(error);
  } finally {
    resumingOrderId.value = '';
  }
};
const selectionMessage = computed(() => {
  if (selectedType.value === 'exhibitor') {
    if (!selection.exhibitorProductId) return copy.value.exhibitorIndependent;
    if (!paymentConfigurationReady.value) return copy.value.paymentMissing;
    return copy.value.exhibitorSelected;
  }
  if (postRegistrationAdditional.value && !selection.bandungProductId) return 'Select an available additional package to continue.';
  if (postRegistrationAdditional.value) return 'Additional package selected. Checkout creates a separate order linked to your existing registration.';
  if (!selection.mainProductId) return copy.value.selectMessage;
  if (!paymentConfigurationReady.value) return copy.value.paymentMissing;
  return copy.value.selected;
});
const canReviewCart = computed(() => !mutating.value && paymentConfigurationReady.value && (selectedType.value === 'exhibitor' ? Boolean(selection.exhibitorProductId) : postRegistrationAdditional.value ? Boolean(selection.bandungProductId) : Boolean(selection.mainProductId)));
const syncFromCart = (value: StoreCart) => { Object.assign(selection, { mainPackageId: null, mainRateId: null, mainProductId: null, bandungSelected: false, bandungRateId: null, bandungProductId: null, exhibitorSelected: false, exhibitorPackageId: null, exhibitorRateId: null, exhibitorProductId: null }); for (const item of value.items || []) { const found = findRateByProduct(item.product_id); if (!found) continue; if (found.pkg.package_type === 'main') Object.assign(selection, { mainPackageId: found.pkg.id, mainRateId: found.rate.id, mainProductId: found.rate.product_id }); else if (found.pkg.package_type === 'exhibitor') Object.assign(selection, { exhibitorSelected: true, exhibitorPackageId: found.pkg.id, exhibitorRateId: found.rate.id, exhibitorProductId: found.rate.product_id }); else Object.assign(selection, { bandungSelected: true, bandungRateId: found.rate.id, bandungProductId: found.rate.product_id }); } };
const apiError = (error: unknown) => { const value = error as { data?: { message?: string; errors?: Array<{ message?: string }> } }; return value.data?.errors?.[0]?.message || value.data?.message || copy.value.updateError; };
const addRate = async (rate: DelegatePackageRate) => { if (!auth.isAuthenticated) { await navigateTo('/auth/register'); return false; } if (!eventId.value || mutating.value) return false; mutating.value = true; notice.value = ''; try { cart.value = (await store.addCartItem(eventId.value, rate.product_id, 1)).data; syncFromCart(cart.value); noticeTone.value = 'success'; notice.value = copy.value.saved; return true; } catch (error) { noticeTone.value = 'error'; notice.value = apiError(error); return false; } finally { mutating.value = false; } };
const selectMainPackage = async (pkg: DelegatePackageCatalogItem) => { if (postRegistrationAdditional.value) return; const rate = defaultRate(pkg); if (rate) await addRate(rate); };
const selectMainRate = async (pkg: DelegatePackageCatalogItem, rate: DelegatePackageRate) => { if (!postRegistrationAdditional.value && selection.mainPackageId === pkg.id) await addRate(rate); };
const toggleAdditional = async (pkg: DelegatePackageCatalogItem, checked: boolean) => { if (checked) { const rates=activeRates(pkg);const rate=postRegistrationAdditional.value?rates.find(canBuyAdditionalRate):defaultRate(pkg); if (rate) await addRate(rate); return; } if (!selection.bandungProductId || !eventId.value) return; mutating.value = true; try { cart.value = (await store.removeCartItem(eventId.value, selection.bandungProductId)).data; syncFromCart(cart.value); notice.value = copy.value.removed; } catch (error) { noticeTone.value = 'error'; notice.value = apiError(error); } finally { mutating.value = false; } };
const selectExhibitorPackage = async (pkg: DelegatePackageCatalogItem) => { const rate = defaultRate(pkg); if (rate) await addRate(rate); };
const toggleExhibitor = async (pkg: DelegatePackageCatalogItem, checked: boolean) => { if (checked) { await selectExhibitorPackage(pkg); return; } if (!selection.exhibitorProductId || !eventId.value) return; mutating.value = true; try { cart.value = (await store.removeCartItem(eventId.value, selection.exhibitorProductId)).data; syncFromCart(cart.value); notice.value = copy.value.removed; } catch (error) { noticeTone.value = 'error'; notice.value = apiError(error); } finally { mutating.value = false; } };
const selectAdditionalRate = (rate: DelegatePackageRate) => addRate(rate);
const occupancyLabel = (occupancyType: DelegatePackageRate['occupancy_type']) => occupancyType === 'single' ? copy.value.single : occupancyType === 'standard' ? copy.value.standard : copy.value.sharing;
const usd = (amount: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount);
const openSchedule = (key: 'main' | 'additional') => { activeSchedule.value = (locale.value === 'zh-CN' ? delegatePackageSchedulesZh : delegatePackageSchedules)[key]; if (import.meta.client) document.body.style.overflow = 'hidden'; };
const closeSchedule = () => { activeSchedule.value = null; if (import.meta.client) document.body.style.overflow = ''; };
const handleEscape = (event: KeyboardEvent) => { if (event.key === 'Escape') closeSchedule(); };
onMounted(async () => { if (!eventId.value) eventId.value = (await getEvents(1, 1)).data[0]?.id || ''; if (auth.isAuthenticated && eventId.value) { try { const [cartResponse, additionalResponse] = await Promise.all([store.getCart(eventId.value), store.getMyAdditionalProducts(eventId.value)]); cart.value = cartResponse.data; personalizedAdditional.value = additionalResponse.data || []; syncFromCart(cart.value); } catch { /* a new account may not have a cart or eligible registration yet */ } } });
onMounted(() => window.addEventListener('keydown', handleEscape));
onBeforeUnmount(() => { window.removeEventListener('keydown', handleEscape); document.body.style.overflow = ''; });
</script>

<style scoped>
.fallback-badge { display:inline-flex; border:1px solid rgba(251,191,36,.28); border-radius:999px; background:rgba(251,191,36,.1); padding:.18rem .45rem; color:#fde68a; font-family:'Plus Jakarta Sans',sans-serif; font-size:.55rem; font-weight:800; line-height:1; letter-spacing:.08em; vertical-align:middle; }
</style>
