<template>
  <section class="mx-auto max-w-3xl px-3 py-10 sm:px-6 lg:px-8">
    <div class="glass-card rounded-[2rem] p-4 sm:p-6">
      <p class="text-sm uppercase tracking-[.3em] text-amber-200">DOKU Checkout</p>
      <h1 class="mt-3 text-3xl font-black sm:text-4xl">Secure payment</h1>
      <p class="mt-3 text-sm text-slate-300 sm:text-base">Continue to DOKU's secure checkout. The final amount is determined by the backend from your delegate package.</p>

      <div v-if="checking" class="mt-8 text-sm text-slate-300 sm:text-base">Checking your registration and payment status…</div>
      <div v-else-if="paid" class="mt-8 rounded-2xl border border-emerald-300/20 bg-emerald-300/5 p-5">
        <p class="text-lg font-semibold text-emerald-300">Payment received</p>
        <p class="mt-2 text-sm text-slate-300 sm:text-base">Payment is complete. Organizer confirmation of your registration is handled separately.</p>
        <NuxtLink :to="`/dashboard/invoice?registration_id=${registrationId}`" class="mt-5 inline-flex rounded-full bg-amber-300 px-5 py-3 font-semibold text-slate-950">View invoice</NuxtLink>
      </div>
      <div v-else-if="!registrationId" class="mt-8 rounded-2xl border border-amber-300/20 bg-amber-300/5 p-5 text-amber-100">No registration eligible for payment was found.</div>
      <div v-else class="mt-8">
        <button class="w-full rounded-full bg-amber-300 px-6 py-3 font-semibold text-slate-950 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto" :disabled="submitting" @click="createCheckout">{{ submitting ? 'Preparing DOKU Checkout…' : 'Proceed to DOKU Checkout' }}</button>
        <p class="mt-3 text-xs text-slate-500">Click once and wait for the secure redirect.</p>
      </div>
      <div v-if="checkout && checkout.requires_payment" class="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4">
        <p>Checkout is ready.</p>
        <button class="mt-4 w-full rounded-full border border-white/20 px-5 py-3 font-semibold sm:w-auto" @click="redirectToDoku">Continue to DOKU</button>
        <p v-if="checkout.expires_at" class="mt-3 text-xs text-slate-400">Expires {{ formatDate(checkout.expires_at) }}</p>
      </div>
      <div v-if="errorMessage" class="mt-5 rounded-2xl border border-red-400/30 bg-red-950/30 p-4 text-sm text-red-100">
        <p>{{ errorMessage }}</p>
        <p v-if="requestId" class="mt-2 text-xs text-red-200/70">Reference: {{ requestId }}</p>
      </div>
    </div>
  </section>
</template>
<script setup lang="ts">
import {normalizeInvoices,usePayment,type DokuCheckoutData} from '~/composables/usePayment'; import {useRegistration} from '~/composables/useRegistration';
definePageMeta({middleware:'auth'}); useSeoMeta({title:'DOKU Payment | IWBIF 2026'});
const {createDokuCheckout,getMyInvoices}=usePayment(); const {getMyRegistrations}=useRegistration(); const checking=ref(true);const submitting=ref(false);const paid=ref(false);const registrationId=ref('');const checkout=ref<DokuCheckoutData|null>(null);const errorMessage=ref('');const requestId=ref('');const STORAGE_REGISTRATION='iwbif-doku-registration-id';const STORAGE_PAYMENT='iwbif-doku-payment-id';
const apiError=(error:unknown)=>{const value=error as {data?:{message?:string;request_id?:string;errors?:Array<{message:string}>}};requestId.value=value.data?.request_id||'';return value.data?.errors?.[0]?.message||value.data?.message||(error instanceof Error?error.message:'DOKU Checkout could not be created.')};
const redirectToDoku=()=>{if(!checkout.value?.payment_url)return;sessionStorage.setItem(STORAGE_REGISTRATION,registrationId.value);if(checkout.value.payment_id)sessionStorage.setItem(STORAGE_PAYMENT,checkout.value.payment_id);window.location.assign(checkout.value.payment_url)};
const createCheckout=async()=>{if(submitting.value||!registrationId.value)return;submitting.value=true;errorMessage.value='';requestId.value='';try{const response=await createDokuCheckout(registrationId.value);checkout.value=response.data;paid.value=response.data.already_paid||!response.data.requires_payment||response.data.order_status==='paid';if(!paid.value){if(!response.data.payment_url)throw new Error('DOKU Checkout URL is unavailable.');redirectToDoku()}}catch(error){errorMessage.value=apiError(error)}finally{submitting.value=false}};
onMounted(async()=>{try{const registrations=await getMyRegistrations();const items=Array.isArray(registrations.data)?registrations.data:[];const selected=items.find(item=>['draft','awaiting_payment','payment_pending','paid'].includes(item.status))||items[0];if(selected)registrationId.value=selected.id;try{const invoices=normalizeInvoices((await getMyInvoices()).data);const invoice=invoices.find(item=>item.registration.id===registrationId.value)||invoices[0];paid.value=invoice?.order.status?.toLowerCase()==='paid'||invoice?.payment.transaction_status?.toLowerCase()==='success'}catch{}}catch(error){errorMessage.value=apiError(error)}finally{checking.value=false}});const formatDate=(value:string)=>new Intl.DateTimeFormat('en-GB',{dateStyle:'medium',timeStyle:'short'}).format(new Date(value));
</script>
