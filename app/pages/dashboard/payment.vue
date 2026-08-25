<template>
  <section class="mx-auto max-w-6xl px-3 py-10 sm:px-6">
    <div class="glass-card rounded-[2rem] p-4 sm:p-7">
      <p class="text-sm uppercase tracking-[.3em] text-amber-200">Payment method</p><h1 class="mt-3 text-3xl font-black sm:text-4xl">Choose how you would like to pay</h1><p class="mt-3 max-w-3xl text-sm leading-7 text-slate-300">Choose manual bank transfer or continue to {{ paymentProviderLabel }} for online payment. The final amount comes directly from your backend order.</p>
      <p v-if="loading" class="mt-8 text-slate-300">Loading your order...</p>
      <div v-else-if="!orderId" class="notice"><p>No active order was found. Review your cart and create an order first.</p><NuxtLink to="/dashboard/cart" class="mt-5 inline-flex rounded-full bg-amber-300 px-5 py-3 font-semibold text-slate-950">Open cart</NuxtLink></div>
      <template v-else>
        <div class="mt-8 rounded-2xl border border-white/10 bg-white/5 p-5"><div class="flex flex-wrap items-start justify-between gap-4"><div class="min-w-0"><p class="text-xs uppercase tracking-[.2em] text-slate-400">Order</p><p class="mt-2 break-words text-xl font-bold">{{ order?.order_number || orderId }}</p></div><span class="shrink-0 rounded-full border border-amber-300/20 bg-amber-300/10 px-3 py-1 text-xs uppercase tracking-[.18em] text-amber-100">{{ order?.status || 'pending' }}</span></div><div v-if="order" class="mt-5 flex flex-wrap items-end justify-between gap-2 border-t border-white/10 pt-5"><span class="text-slate-400">Total</span><strong class="break-words text-2xl text-amber-200">{{ money(order.total_amount,order.currency) }}</strong></div></div>
        <p v-if="unsupportedOrderCurrency" class="mt-5 rounded-2xl border border-red-400/30 bg-red-950/30 p-4 text-sm text-red-100">Online and manual payment are only available for IDR orders. Please return to your cart or contact the organizer.</p>
        <NuxtLink v-if="isPaid" :to="paidDestination" class="mt-6 inline-flex w-full justify-center rounded-full bg-emerald-300 px-6 py-3 text-center font-bold text-slate-950 sm:w-auto">{{ paidActionLabel }}</NuxtLink>
        <div v-else class="mt-6 grid gap-4 md:grid-cols-2">
          <NuxtLink :to="`/dashboard/payment-manual?order_id=${encodeURIComponent(orderId)}`" class="payment-choice payment-choice-bank" :class="{ 'payment-choice--disabled': paymentDisabled }" :aria-disabled="paymentDisabled" @click="preventDisabledNavigation">
            <span class="payment-choice__tag">Bank account</span><strong>Manual Bank Transfer</strong><p>View the temporary account number and transfer instructions.</p><span class="payment-choice__action">View bank details <span aria-hidden="true">→</span></span>
          </NuxtLink>
          <article class="payment-choice payment-choice-doku">
            <span class="payment-choice__tag">Online gateway</span><strong>Online Payment</strong><p>{{ unsupportedOrderCurrency ? 'This order cannot be sent to the payment gateway because its currency is not IDR.' : hasPendingPayment ? 'A payment is awaiting backend confirmation. You cannot create another payment yet.' : `Continue securely to the hosted ${paymentProviderLabel} payment page.` }}</p><button class="payment-choice__action disabled:cursor-not-allowed disabled:opacity-60" :disabled="submitting || paymentDisabled" @click="startPayment">{{ hasPendingPayment ? 'Payment pending' : submitting ? `Preparing ${paymentProviderLabel}...` : `Continue to ${paymentProviderLabel}` }} <span aria-hidden="true">→</span></button>
          </article>
        </div>
        <NuxtLink v-if="hasPendingPayment" :to="paymentStatusTo" class="mt-4 inline-flex w-full justify-center rounded-full border border-amber-300/30 bg-amber-300/10 px-5 py-3 font-semibold text-amber-100 sm:w-auto">Check payment status</NuxtLink>
        <NuxtLink to="/dashboard/cart" class="mt-6 inline-flex w-full justify-center rounded-full border border-white/20 px-6 py-3 text-center sm:w-auto">Back to cart</NuxtLink>
      </template>
      <div v-if="errorMessage" class="mt-5 rounded-2xl border border-red-400/30 bg-red-950/30 p-4 text-sm text-red-100"><p>{{ errorMessage }}</p><p v-if="requestId" class="mt-2 text-xs opacity-70">Reference: {{ requestId }}</p></div>
    </div>
  </section>
</template>
<script setup lang="ts">
import {usePayment,type OrderItem,type PaymentItem} from '~/composables/usePayment';
definePageMeta({middleware:'auth'});useSeoMeta({title:'Payment | IWBIF 2026'});const route=useRoute();const paymentApi=usePayment();const registrationFlow=useRegistrationFlow();const orderId=ref(''),paymentId=ref(''),errorMessage=ref(''),requestId=ref('');const order=ref<OrderItem|null>(null);const loading=ref(true),submitting=ref(false);const paymentProviderLabel=computed(() => paymentApi.paymentProviderLabel || 'Payment');const isPaid=computed(()=>order.value?.status?.toLowerCase()==='paid');const queryValue=(value:unknown)=>Array.isArray(value)?String(value[0]||''):typeof value==='string'?value:'';
const activePayment=ref<PaymentItem|null>(null);const hasPendingPayment=computed(()=>['created','pending'].includes(activePayment.value?.transaction_status?.toLowerCase()||''));const unsupportedOrderCurrency=computed(()=>Boolean(order.value&&(order.value.currency||'').toUpperCase()!=='IDR'));const paymentDisabled=computed(()=>hasPendingPayment.value||unsupportedOrderCurrency.value);const paymentStatusTo=computed(()=>`/dashboard/payment-status?order_id=${encodeURIComponent(orderId.value)}&payment_id=${encodeURIComponent(paymentId.value)}`);const preventDisabledNavigation=(event:MouseEvent)=>{if(paymentDisabled.value)event.preventDefault();};
const pendingProfileType=computed(()=>registrationFlow.profilePendingType.value);const paidDestination=computed(()=>pendingProfileType.value?`/register/${pendingProfileType.value}`:`/dashboard/invoice?order_id=${encodeURIComponent(orderId.value)}`);const paidActionLabel=computed(()=>pendingProfileType.value?`Complete ${pendingProfileType.value==='exhibitor'?'Exhibitor':'Delegate'} Profile`:'View invoice');
const apiError=(error:unknown)=>{const value=error as {data?:{message?:string;request_id?:string;errors?:Array<{message:string}>}};requestId.value=value.data?.request_id||'';return value.data?.errors?.[0]?.message||value.data?.message||(error instanceof Error?error.message:'Payment could not be prepared.');};
const refreshPaidFlow=async()=>{try{await registrationFlow.loadFlow(true);}catch{/* The paid order remains authoritative; app focus will retry the progress refresh. */}};
const startPayment=async()=>{if(!orderId.value||submitting.value||paymentDisabled.value)return;submitting.value=true;errorMessage.value='';try{const checkout=(await paymentApi.createCheckout(orderId.value)).data;paymentId.value=checkout.payment_id||'';sessionStorage.setItem('iwbif-store-order-id',orderId.value);if(paymentId.value)sessionStorage.setItem('iwbif-payment-id',paymentId.value);if(!checkout.requires_payment||checkout.already_paid){await refreshPaidFlow();await navigateTo(paidDestination.value);return;}if(checkout.payment_url){window.location.assign(checkout.payment_url);return;}await navigateTo(`/dashboard/payment-status?order_id=${encodeURIComponent(orderId.value)}&payment_id=${encodeURIComponent(paymentId.value)}`);}catch(error){errorMessage.value=apiError(error);}finally{submitting.value=false;}};
onMounted(async()=>{orderId.value=queryValue(route.query.order_id)||sessionStorage.getItem('iwbif-store-order-id')||'';paymentId.value=queryValue(route.query.payment_id)||sessionStorage.getItem('iwbif-payment-id')||sessionStorage.getItem('iwbif-doku-payment-id')||'';if(orderId.value){try{order.value=(await paymentApi.getOrder(orderId.value)).data;if(isPaid.value)await refreshPaidFlow();else if(paymentId.value){const candidate=(await paymentApi.getPayment(paymentId.value)).data;if(candidate.order_id===orderId.value)activePayment.value=candidate;}}catch(error){errorMessage.value=apiError(error);}}loading.value=false;});const money=(amount:number,currency:string)=>new Intl.NumberFormat('id-ID',{style:'currency',currency:currency||'IDR',maximumFractionDigits:0}).format(amount||0);
</script>
<style scoped>
.notice { @apply mt-8 rounded-2xl border border-amber-300/20 bg-amber-300/5 p-5 text-amber-100; }
.payment-choice { display:flex; min-height:17rem; flex-direction:column; border:1px solid rgba(255,255,255,.12); border-radius:1.5rem; padding:1.4rem; transition:transform .2s ease,border-color .2s ease,box-shadow .2s ease; }
.payment-choice:hover { transform:translateY(-4px); border-color:rgba(230,196,119,.5); box-shadow:0 20px 45px rgba(2,10,24,.35); }
.payment-choice--disabled { cursor:not-allowed; opacity:.55; }
.payment-choice--disabled:hover { transform:none; border-color:rgba(255,255,255,.12); box-shadow:none; }
.payment-choice-bank { background:linear-gradient(145deg,rgba(230,196,119,.12),rgba(4,21,45,.72)); }
.payment-choice-qr { background:linear-gradient(145deg,rgba(34,211,238,.12),rgba(4,21,45,.72)); }
.payment-choice-doku { background:linear-gradient(145deg,rgba(255,255,255,.08),rgba(4,21,45,.78)); }
.payment-choice__tag { color:#d8ac59; font-size:.65rem; font-weight:800; letter-spacing:.2em; text-transform:uppercase; }
.payment-choice strong { margin-top:1rem; color:#fff; font-size:1.3rem; }
.payment-choice p { margin-top:.75rem; color:#aeb9c8; font-size:.875rem; line-height:1.65; }
.payment-choice__action { display:inline-flex; margin-top:auto; align-items:center; justify-content:space-between; gap:.75rem; border-radius:999px; background:#e6c477; padding:.8rem 1rem; color:#04152d; font-size:.875rem; font-weight:800; }
</style>
