<template>
  <section class="tickets-shell mx-auto max-w-7xl px-3 py-10 sm:px-6 lg:px-8">
    <div class="tickets-hero rounded-[2rem] border border-amber-200/20 bg-gradient-to-br from-amber-300/8 via-slate-950/80 to-slate-950/90 p-5 sm:p-8">
      <p class="text-sm uppercase tracking-[.35em] text-amber-200">{{ selectedType === 'exhibitor' ? 'Exhibitor Packages' : 'Delegate Packages' }}</p>
      <h1 class="mt-4 max-w-4xl text-3xl font-black sm:text-5xl">Choose your IWBIF {{ selectedType }} experience.</h1>
      <p class="mt-4 max-w-4xl text-sm leading-7 text-slate-300 sm:text-base">Select the {{ selectedType }} package that matches your objectives. Your profile details can be completed after payment.</p>
    </div>

    <aside v-if="debugEnabled" class="mt-5 rounded-2xl border border-cyan-300/30 bg-slate-950/90 p-4 font-mono text-xs text-cyan-100">
      <div class="flex flex-wrap items-center justify-between gap-3">
        <strong>Delegate package diagnostics</strong>
        <button type="button" class="rounded-full border border-cyan-300/30 px-3 py-1" @click="copyDebugLog">Copy log</button>
      </div>
      <p class="mt-2">auth={{ isAuthenticated }} · eventId={{ currentEventId || 'MISSING' }} · packages={{ packages.length }} · adding={{ addingId || '-' }}</p>
      <ol class="mt-3 max-h-48 space-y-1 overflow-auto text-[11px] leading-5">
        <li v-for="entry in debugEntries" :key="entry.id">{{ entry.time }} — {{ entry.message }}</li>
      </ol>
    </aside>

    <div v-if="isAuthenticated" class="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
      <p class="text-sm text-slate-300">Choose one or more packages, then review everything in your cart.</p>
      <NuxtLink to="/dashboard/cart" class="rounded-full border border-amber-300/40 px-5 py-2.5 text-sm font-semibold text-amber-100">View cart</NuxtLink>
    </div>
    <div v-if="notice" class="mt-5 rounded-2xl border p-4 text-sm" :class="noticeTone === 'error' ? 'border-red-400/30 bg-red-950/30 text-red-100' : 'border-emerald-300/30 bg-emerald-950/30 text-emerald-100'">{{ notice }}</div>
    <div v-if="pending" class="mt-10 grid gap-5 md:grid-cols-2">
      <div v-for="n in 2" :key="n" class="h-80 animate-pulse rounded-[2rem] bg-white/5" />
    </div>
    <div v-else-if="error" class="mt-10 rounded-3xl border border-red-400/30 bg-red-950/30 p-6 text-red-100">{{ error.message }}</div>
    <div v-else-if="!packages.length" class="mt-10 rounded-3xl border border-white/10 bg-white/5 p-6 text-slate-300">Delegate packages will be published soon.</div>
    <div v-else class="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
      <article v-for="item in packages" :key="item.id" class="ticket-card glass-card flex flex-col rounded-[2rem] p-5 sm:p-7">
        <div class="flex items-center justify-between gap-3">
          <span class="rounded-full border border-amber-200/20 bg-amber-300/10 px-2.5 py-1 text-[10px] uppercase tracking-[.2em] text-amber-100">{{ item.product_type }}</span>
        </div>
        <h2 class="mt-4 text-2xl font-bold text-white">{{ item.name }}</h2>
        <p class="mt-4 text-3xl font-black text-white sm:text-4xl">{{ money(item.amount ?? item.price ?? 0,item.currency) }}</p>
        <ul class="mt-5 space-y-3 text-sm leading-6 text-slate-300">
          <li class="flex items-center gap-2"><span class="h-1.5 w-1.5 rounded-full bg-amber-300" />Full event access</li>
          <li class="flex items-center gap-2"><span class="h-1.5 w-1.5 rounded-full bg-amber-300" />Business matching eligibility</li>
          <li class="flex items-center gap-2"><span class="h-1.5 w-1.5 rounded-full bg-amber-300" />Networking and session entry</li>
        </ul>
        <button type="button" class="mt-7 rounded-full bg-amber-300 px-5 py-3 text-center font-semibold text-slate-950 shadow-[0_18px_35px_rgba(216,172,89,0.2)] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60" :disabled="addingId === item.id" @pointerdown="debugLog(`pointerdown: ${item.id}`)" @click="addToCart(item.id)">{{ addingId === item.id ? 'Adding...' : isAuthenticated ? 'Add to cart' : 'Register to purchase' }}</button>
      </article>
    </div>
  </section>
</template>

<script setup lang="ts">
import {useEvent} from '~/composables/useEvent';
import {useStore} from '~/composables/useStore';
useSeoMeta({title:'Delegate Packages | IWBIF 2026'});
const {getEvents}=useEvent();
const {getProducts,addCartItem}=useStore();
const authStore=useAuthStore();
const isAuthenticated=computed(()=>authStore.isAuthenticated);
const route=useRoute();
const selectedType=computed<'delegate'|'exhibitor'>(()=>route.query.type==='exhibitor'?'exhibitor':'delegate');
const eventId=ref('');
const addingId=ref('');
const notice=ref('');
const noticeTone=ref<'success'|'error'>('success');
const debugEnabled=ref(false);
const debugEntries=ref<Array<{id:number;time:string;message:string}>>([]);
let debugSequence=0;
const debugLog=(message:string,data?:unknown)=>{
  if(!debugEnabled.value)return;
  const suffix=data===undefined?'':` ${JSON.stringify(data)}`;
  const entry={id:++debugSequence,time:new Date().toISOString().slice(11,23),message:`${message}${suffix}`};
  debugEntries.value.push(entry);
  if(debugEntries.value.length>80)debugEntries.value.shift();
  console.info('[tickets-debug]',message,data??'');
};
const {data:response,pending,error}=await useAsyncData('iwbif-packages',async()=>{
  const events=await getEvents(1,1);
  const event=events.data[0];
  if(!event) throw new Error('No IWBIF event is currently published.');
  eventId.value=event.id;
  return getProducts(event.id);
});
const packages=computed(()=>response.value?.data.filter(item=>item.is_active&&item.product_type===selectedType.value)??[]);
// eventId is assigned during SSR/prerender, but a standalone ref is not restored
// from the async-data payload on browser hydration. Products carry the same ID,
// so use them as the client-safe source of truth.
const currentEventId=computed(()=>eventId.value||response.value?.data[0]?.event_id||'');
const apiError=(error:unknown)=>{
  const value=error as {data?:{message?:string;errors?:Array<{message?:string}>}};
  return value.data?.errors?.[0]?.message||value.data?.message||(error instanceof Error?error.message:'Package could not be added.');
};
const rememberDelegatePackage=(productId:string)=>{
  const selectedProduct=response.value?.data.find(item=>item.id===productId);
  const delegatePackageId=typeof selectedProduct?.metadata_json?.delegate_package_id==='string'?selectedProduct.metadata_json.delegate_package_id:'';
  if(delegatePackageId){
    try{sessionStorage.setItem('iwbif-last-delegate-package-id',delegatePackageId);}catch{/* Storage is optional; adding to the server cart must still work. */}
  }
};
const addToCart=async(productId:string)=>{
  debugLog('Vue click handler entered',{productId,authenticated:isAuthenticated.value,eventId:currentEventId.value});
  if(!isAuthenticated.value){debugLog('redirecting: unauthenticated');await navigateTo('/auth/register');return;}
  if(!currentEventId.value){
    noticeTone.value='error';notice.value='Event ID is missing. Open this page with ?debug=1 and send the diagnostic log.';
    debugLog('blocked: event ID missing');return;
  }
  if(addingId.value){debugLog('blocked: another add operation is active',{addingId:addingId.value});return;}
  addingId.value=productId;notice.value='';
  try{
    debugLog('sending add-cart request',{eventId:currentEventId.value,productId});
    const updatedCart=await addCartItem(currentEventId.value,productId,1);
    debugLog('add-cart request succeeded',{items:updatedCart.data.items?.length??0});
    // A successful add starts a new checkout context. Remove only stale browser-side
    // order/payment references; the server cart remains the source of truth.
    sessionStorage.removeItem('iwbif-store-order-id');
    sessionStorage.removeItem('iwbif-store-order');
    sessionStorage.removeItem('iwbif-payment-id');
    sessionStorage.removeItem('iwbif-doku-payment-id');
    rememberDelegatePackage(productId);
    noticeTone.value='success';notice.value='Package added to your cart.';
    debugLog('navigating to cart');
    await navigateTo('/dashboard/cart');
  }
  catch(error){noticeTone.value='error';notice.value=apiError(error);debugLog('add-cart request failed',notice.value);}
  finally{addingId.value='';debugLog('add operation finished');}
};
const copyDebugLog=async()=>{
  const summary=[`url=${location.href}`,`auth=${isAuthenticated.value}`,`eventId=${currentEventId.value||'MISSING'}`,`packages=${packages.value.length}`,...debugEntries.value.map(entry=>`${entry.time} ${entry.message}`)].join('\n');
  try{await navigator.clipboard.writeText(summary);debugLog('diagnostic log copied');}
  catch(error){debugLog('copy failed',apiError(error));}
};
onMounted(()=>{
  debugEnabled.value=new URLSearchParams(location.search).get('debug')==='1';
  debugLog('component mounted',{authenticated:isAuthenticated.value,eventId:currentEventId.value,packages:packages.value.length});
});
const money=(amount:number,currency:string)=>new Intl.NumberFormat('en-US',{style:'currency',currency}).format(amount);
</script>

<style scoped>
.tickets-shell {
  padding-inline: 0.75rem;
}
.tickets-hero {
  box-shadow: 0 24px 60px rgba(0,0,0,0.18);
}
.ticket-card {
  transition: transform 0.2s ease, border-color 0.2s ease;
}
.ticket-card:hover {
  transform: translateY(-4px);
  border-color: rgba(216, 172, 89, 0.4);
}
</style>
