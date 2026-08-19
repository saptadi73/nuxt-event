<template>
  <section class="tickets-shell mx-auto max-w-7xl px-3 py-10 sm:px-6 lg:px-8">
    <div class="tickets-hero rounded-[2rem] border border-amber-200/20 bg-gradient-to-br from-amber-300/8 via-slate-950/80 to-slate-950/90 p-5 sm:p-8">
      <p class="text-sm uppercase tracking-[.35em] text-amber-200">Delegate Packages</p>
      <h1 class="mt-4 max-w-4xl text-3xl font-black sm:text-5xl">Choose your IWBIF delegate experience.</h1>
      <p class="mt-4 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">Select the participation tier that matches your objectives, from curated access to premium business matching and high-value networking.</p>
    </div>

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
          <p class="text-sm font-semibold text-amber-200">{{ item.code || 'IWBIF' }}</p>
          <span class="rounded-full border border-amber-200/20 bg-amber-300/10 px-2.5 py-1 text-[10px] uppercase tracking-[.2em] text-amber-100">{{ item.product_type }}</span>
        </div>
        <h2 class="mt-4 text-2xl font-bold text-white">{{ item.name }}</h2>
        <p class="mt-4 text-3xl font-black text-white sm:text-4xl">{{ money(item.amount ?? item.price ?? 0,item.currency) }}</p>
        <ul class="mt-5 space-y-3 text-sm leading-6 text-slate-300">
          <li class="flex items-center gap-2"><span class="h-1.5 w-1.5 rounded-full bg-amber-300" />Full event access</li>
          <li class="flex items-center gap-2"><span class="h-1.5 w-1.5 rounded-full bg-amber-300" />Business matching eligibility</li>
          <li class="flex items-center gap-2"><span class="h-1.5 w-1.5 rounded-full bg-amber-300" />Networking and session entry</li>
        </ul>
        <button type="button" class="mt-7 rounded-full bg-amber-300 px-5 py-3 text-center font-semibold text-slate-950 shadow-[0_18px_35px_rgba(216,172,89,0.2)] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60" :disabled="addingId === item.id" @click="addToCart(item.id)">{{ addingId === item.id ? 'Adding...' : isAuthenticated ? 'Add to cart' : 'Register to purchase' }}</button>
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
const registrationFlow=useRegistrationFlow();
const eventId=ref('');
const addingId=ref('');
const notice=ref('');
const noticeTone=ref<'success'|'error'>('success');
const {data:response,pending,error}=await useAsyncData('iwbif-packages',async()=>{
  const events=await getEvents(1,1);
  const event=events.data[0];
  if(!event) throw new Error('No IWBIF event is currently published.');
  eventId.value=event.id;
  return getProducts(event.id);
});
const packages=computed(()=>response.value?.data.filter(item=>item.is_active&&item.product_type!=='additional')??[]);
const addToCart=async(productId:string)=>{
  if(!isAuthenticated.value){await navigateTo('/auth/register');return;}
  await registrationFlow.loadFlow(true);
  if(registrationFlow.primaryStatus.value!=='not_selected'){
    noticeTone.value='success';
    notice.value=`You already have a ${registrationFlow.primaryType.value || 'package'} purchase in progress. Redirecting...`;
    await navigateTo(registrationFlow.ctaTo.value);
    return;
  }
  if(!eventId.value||addingId.value)return;
  addingId.value=productId;notice.value='';
  try{await addCartItem(eventId.value,productId,1);noticeTone.value='success';notice.value='Package added to your cart.';}
  catch(error){const value=error as {data?:{message?:string}};noticeTone.value='error';notice.value=value.data?.message||(error instanceof Error?error.message:'Package could not be added.');}
  finally{addingId.value='';}
};
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
