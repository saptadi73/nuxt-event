<template>
  <section class="mx-auto max-w-5xl px-3 py-10 sm:px-6">
    <div class="flex flex-wrap items-end justify-between gap-4">
      <div><p class="text-sm uppercase tracking-[.3em] text-amber-200">Shopping cart</p><h1 class="mt-3 text-3xl font-black sm:text-4xl">Review your packages</h1><p class="mt-3 text-sm text-slate-300">Prices and totals are calculated by the backend at checkout.</p></div>
      <NuxtLink to="/tickets" class="rounded-full border border-white/20 px-5 py-3 text-sm font-semibold">Add another package</NuxtLink>
    </div>
    <div v-if="loading" class="glass-card mt-8 rounded-[2rem] p-7 text-slate-300">Loading your cart...</div>
    <div v-else-if="errorMessage" class="mt-8 rounded-3xl border border-red-400/30 bg-red-950/30 p-6 text-red-100">{{ errorMessage }}</div>
    <div v-else-if="!items.length" class="glass-card mt-8 rounded-[2rem] p-7"><h2 class="text-xl font-bold">Your cart is empty</h2><p class="mt-2 text-slate-400">Choose a delegate or exhibitor package to continue.</p><NuxtLink to="/tickets" class="mt-6 inline-flex rounded-full bg-amber-300 px-5 py-3 font-semibold text-slate-950">Browse packages</NuxtLink></div>
    <div v-else class="mt-8 grid gap-6 lg:grid-cols-[1fr_22rem]">
      <div class="space-y-4">
        <article v-for="item in items" :key="item.product_id" class="glass-card flex flex-col gap-4 rounded-3xl p-5 sm:flex-row sm:items-center sm:justify-between">
          <div class="min-w-0"><p class="text-xs uppercase tracking-[.2em] text-amber-200">{{ item.product?.product_type || 'Package' }}</p><h2 class="mt-2 break-words text-xl font-bold">{{ item.product?.name || item.product_name || item.name || 'IWBIF Package' }}</h2><p class="mt-2 text-sm text-slate-400">Quantity: {{ item.quantity }}</p></div>
          <div class="sm:text-right"><p class="break-words text-lg font-bold">{{ money(item.subtotal ?? ((item.unit_price || 0) * item.quantity), item.currency || item.product?.currency || cart?.currency || 'IDR') }}</p><button class="mt-3 text-sm font-semibold text-red-300 disabled:opacity-50" :disabled="removingId === item.product_id" @click="remove(item.product_id)">{{ removingId === item.product_id ? 'Removing...' : 'Remove' }}</button></div>
        </article>
      </div>
      <aside class="glass-card h-fit rounded-[2rem] p-6"><p class="text-xs uppercase tracking-[.25em] text-slate-400">Order summary</p><div class="mt-5 flex justify-between text-sm text-slate-300"><span>Items</span><span>{{ itemCount }}</span></div><div class="mt-5 flex items-end justify-between border-t border-white/10 pt-5"><span class="text-slate-400">Total</span><strong class="text-2xl text-amber-200">{{ money(total, cart?.currency || items[0]?.currency || items[0]?.product?.currency || 'IDR') }}</strong></div><p v-if="mainPackageRequired" class="mt-4 rounded-xl border border-rose-400/30 bg-rose-500/10 p-3 text-xs text-rose-100">Select one Main Delegate Package (A or B) before checkout.</p><button class="mt-6 w-full rounded-full bg-amber-300 px-5 py-3 font-bold text-slate-950 disabled:cursor-not-allowed disabled:opacity-60" :disabled="checkingOut || mainPackageRequired" @click="createOrder">{{ checkingOut ? 'Creating order...' : 'Proceed to checkout' }}</button><p class="mt-3 text-xs leading-5 text-slate-500">The backend validates the required Main package, active rates, currency, and final price.</p></aside>
    </div>
  </section>
</template>
<script setup lang="ts">
import {useEvent} from '~/composables/useEvent';
import {useStore,type StoreCart} from '~/composables/useStore';
definePageMeta({middleware:'auth'});useSeoMeta({title:'Shopping Cart | IWBIF 2026'});
const {getEvents}=useEvent();const storeApi=useStore();const eventId=ref('');const cart=ref<StoreCart|null>(null);const loading=ref(true),checkingOut=ref(false),removingId=ref(''),errorMessage=ref('');
const items=computed(()=>cart.value?.items||[]);const itemCount=computed(()=>items.value.reduce((total,item)=>total+item.quantity,0));const total=computed(()=>cart.value?.total_amount??cart.value?.subtotal??items.value.reduce((sum,item)=>sum+(item.subtotal??((item.unit_price||0)*item.quantity)),0));
const mainPackageRequired=computed(()=>items.value.some(item=>item.product?.product_type==='additional')&&!items.value.some(item=>item.product?.product_type==='delegate'));
const apiError=(error:unknown)=>{const value=error as {data?:{message?:string;errors?:Array<{message:string}>}};return value.data?.errors?.[0]?.message||value.data?.message||(error instanceof Error?error.message:'Your cart could not be loaded.');};
const loadCart=async()=>{const events=await getEvents(1,1);const event=events.data[0];if(!event)throw new Error('No IWBIF event is currently published.');eventId.value=event.id;cart.value=(await storeApi.getCart(event.id)).data;};
const remove=async(productId:string)=>{if(!eventId.value||removingId.value)return;removingId.value=productId;errorMessage.value='';try{cart.value=(await storeApi.removeCartItem(eventId.value,productId)).data;}catch(error){errorMessage.value=apiError(error);}finally{removingId.value='';}};
const createOrder=async()=>{if(!eventId.value||checkingOut.value)return;checkingOut.value=true;errorMessage.value='';try{const order=(await storeApi.checkout(eventId.value)).data;const orderId=order.order_id||order.id;if(!orderId)throw new Error('The backend did not return an order ID.');sessionStorage.setItem('iwbif-store-order-id',orderId);sessionStorage.setItem('iwbif-store-order',JSON.stringify(order));await navigateTo(`/dashboard/payment?order_id=${encodeURIComponent(orderId)}`);}catch(error){errorMessage.value=apiError(error);}finally{checkingOut.value=false;}};
onMounted(async()=>{try{await loadCart();}catch(error){errorMessage.value=apiError(error);}finally{loading.value=false;}});const money=(amount:number,currency:string)=>new Intl.NumberFormat('id-ID',{style:'currency',currency:currency||'IDR',maximumFractionDigits:0}).format(amount||0);
</script>
