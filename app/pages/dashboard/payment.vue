<template>
  <section class="mx-auto max-w-6xl px-3 py-10 sm:px-6">
    <div class="glass-card rounded-[2rem] p-4 sm:p-7">
      <p class="text-sm uppercase tracking-[.3em] text-amber-200">{{ copy.eyebrow }}</p><h1 class="mt-3 text-3xl font-black sm:text-4xl">{{ copy.title }}</h1><p class="mt-3 max-w-3xl text-sm leading-7 text-slate-300">{{ copy.description.replace('{provider}', paymentProviderLabel) }}</p>
      <p v-if="loading" class="mt-8 text-slate-300">{{ copy.loading }}</p>
      <div v-else-if="!orderId" class="notice"><p>{{ copy.noOrder }}</p><NuxtLink to="/dashboard/cart" class="mt-5 inline-flex rounded-full bg-amber-300 px-5 py-3 font-semibold text-slate-950">{{ copy.openCart }}</NuxtLink></div>
      <template v-else>
        <div class="mt-8 rounded-2xl border border-white/10 bg-white/5 p-5"><div class="flex flex-wrap items-start justify-between gap-4"><div class="min-w-0"><p class="text-xs uppercase tracking-[.2em] text-slate-400">{{ copy.order }}</p><p class="mt-2 break-words text-xl font-bold">{{ order?.order_number || orderId }}</p></div><span class="shrink-0 rounded-full border border-amber-300/20 bg-amber-300/10 px-3 py-1 text-xs uppercase tracking-[.18em] text-amber-100">{{ statusLabel(order?.status || 'pending') }}</span></div><div v-if="order" class="mt-5 flex flex-wrap items-end justify-between gap-2 border-t border-white/10 pt-5"><span class="text-slate-400">{{ copy.total }}</span><strong class="break-words text-2xl text-amber-200">{{ money(order.total_amount,order.currency) }}</strong></div></div>
        <div v-if="order" class="mt-5 grid gap-3 rounded-2xl border border-white/10 bg-white/5 p-5 sm:grid-cols-3"><div><span class="text-xs text-slate-400">{{ copy.total }}</span><strong class="block text-xl text-white">{{ money(order.total_amount,order.currency) }}</strong></div><div><span class="text-xs text-slate-400">Paid</span><strong class="block text-xl text-emerald-300">{{ money(order.paid_amount || 0,order.currency) }}</strong></div><div><span class="text-xs text-slate-400">Remaining</span><strong class="block text-xl text-amber-200">{{ money(order.remaining_amount ?? order.total_amount,order.currency) }}</strong></div></div>
        <aside v-if="showSplitNotice" class="split-notice" role="note" aria-live="polite">
          <div class="split-notice__icon" aria-hidden="true"><span>!</span></div>
          <div class="min-w-0">
            <div class="flex flex-wrap items-center gap-2"><p class="split-notice__eyebrow">{{ copy.paymentNotice }}</p><span class="split-notice__badge">2 × {{ copy.secureTransaction }}</span></div>
            <p class="mt-3 text-base font-bold leading-7 text-white">{{ copy.splitLead }}</p>
            <ol class="mt-4 grid gap-3 sm:grid-cols-2">
              <li><span>01</span><p>{{ copy.splitStepOne }}</p></li>
              <li><span>02</span><p>{{ copy.splitStepTwo }}</p></li>
            </ol>
            <p class="mt-4 text-sm leading-6 text-amber-50/80">{{ copy.splitThanks }}</p>
          </div>
        </aside>
        <div v-if="isPartial" class="mt-5 rounded-2xl border border-amber-300/25 bg-amber-300/5 p-4 text-sm leading-6 text-amber-100">A payment part was received. Continue payment for the remaining {{ money(order?.remaining_amount || 0, order?.currency || 'IDR') }}. Tickets are not available yet.</div>
        <p v-if="unsupportedOrderCurrency" class="mt-5 rounded-2xl border border-red-400/30 bg-red-950/30 p-4 text-sm text-red-100">{{ copy.currencyError }}</p>
        <NuxtLink v-if="isPaid" :to="paidDestination" class="mt-6 inline-flex w-full justify-center rounded-full bg-emerald-300 px-6 py-3 text-center font-bold text-slate-950 sm:w-auto">{{ paidActionLabel }}</NuxtLink>
        <div v-else class="mt-6 grid gap-4 md:grid-cols-3">
          <NuxtLink :to="`/dashboard/payment-manual?order_id=${encodeURIComponent(orderId)}`" class="payment-choice payment-choice-bank" :class="{ 'payment-choice--disabled': paymentDisabled }" :aria-disabled="paymentDisabled" @click="preventDisabledNavigation">
            <span class="payment-choice__tag">{{ copy.bankTag }}</span><strong>{{ copy.bankTitle }}</strong><p>{{ copy.bankDescription }}</p><span class="payment-choice__action">{{ copy.bankAction }} <span aria-hidden="true">→</span></span>
          </NuxtLink>
          <NuxtLink :to="`/register/delegate?payment=offline&order_id=${encodeURIComponent(orderId)}`" class="payment-choice payment-choice-offline">
            <span class="payment-choice__tag">Organizer assisted</span><strong>Offline Payment</strong><p>Complete your registration first, then pay outside the platform. An administrator or organizer will create the verified payment from your registration.</p><span class="payment-choice__action">Complete registration <span aria-hidden="true">→</span></span>
          </NuxtLink>
          <article class="payment-choice payment-choice-doku" :class="{'payment-choice--split':showSplitNotice}">
            <span class="payment-choice__tag">{{ copy.gatewayTag }}</span><strong>{{ copy.onlineTitle }}</strong><p>{{ onlineDescription }}</p><button class="payment-choice__action disabled:cursor-not-allowed disabled:opacity-60" :disabled="submitting || paymentDisabled" @click="requestPayment">{{ onlineAction }} <span aria-hidden="true">→</span></button>
          </article>
        </div>
        <NuxtLink v-if="hasPendingPayment" :to="paymentStatusTo" class="mt-4 inline-flex w-full justify-center rounded-full border border-amber-300/30 bg-amber-300/10 px-5 py-3 font-semibold text-amber-100 sm:w-auto">{{ copy.checkStatus }}</NuxtLink>
        <NuxtLink to="/dashboard/cart" class="mt-6 inline-flex w-full justify-center rounded-full border border-white/20 px-6 py-3 text-center sm:w-auto">{{ copy.backCart }}</NuxtLink>
      </template>
      <div v-if="errorMessage" class="mt-5 rounded-2xl border border-red-400/30 bg-red-950/30 p-4 text-sm text-red-100"><p>{{ errorMessage }}</p><p v-if="requestId" class="mt-2 text-xs opacity-70">{{ copy.reference }}: {{ requestId }}</p></div>
    </div>
    <Teleport to="body">
      <div v-if="splitModalOpen" class="split-modal" role="dialog" aria-modal="true" aria-labelledby="split-payment-title" @click.self="splitModalOpen=false">
        <div class="split-modal__panel">
          <button type="button" class="split-modal__close" :aria-label="copy.close" @click="splitModalOpen=false">×</button>
          <div class="split-modal__mark" aria-hidden="true">!</div>
          <p class="split-notice__eyebrow">{{ copy.beforeMidtrans }}</p>
          <h2 id="split-payment-title">{{ copy.paymentNotice }}</h2>
          <p class="mt-4 leading-7 text-slate-300">{{ copy.splitLead }}</p>
          <div class="split-modal__flow"><span>1</span><i /><span>2</span></div>
          <p class="text-sm leading-6 text-amber-100">{{ copy.splitStepTwo }}</p>
          <div class="mt-7 grid gap-3 sm:grid-cols-2">
            <button type="button" class="rounded-full border border-white/20 px-5 py-3 font-bold text-white" @click="splitModalOpen=false">{{ copy.reviewPayment }}</button>
            <button type="button" class="rounded-full bg-amber-300 px-5 py-3 font-black text-slate-950" @click="confirmSplitPayment">{{ copy.understandContinue }}</button>
          </div>
        </div>
      </div>
    </Teleport>
  </section>
</template>
<script setup lang="ts">
import {usePayment,type OrderItem,type PaymentItem} from '~/composables/usePayment';
definePageMeta({middleware:'auth'});
const {locale}=useI18n();
const messages={
  en:{eyebrow:'Payment method',title:'Choose how you would like to pay',description:'Choose manual bank transfer or continue to {provider} for online payment. The final amount comes directly from your backend order.',loading:'Loading your order…',noOrder:'No active order was found. Review your cart and create an order first.',openCart:'Open cart',order:'Order',total:'Total',currencyError:'Online and manual payment are only available for IDR orders. Please return to your cart or contact the organizer.',bankTag:'Bank account',bankTitle:'Manual Bank Transfer',bankDescription:'View bank details, transfer the exact amount, then upload your payment proof.',bankAction:'View bank details',gatewayTag:'Online gateway',onlineTitle:'Online Payment',gatewayCurrency:'This order cannot be sent to the payment gateway because its currency is not IDR.',gatewayPending:'A payment is awaiting backend confirmation. You cannot create another payment yet.',gatewayContinue:'Continue securely to the hosted {provider} payment page.',paymentPending:'Payment pending',preparing:'Preparing {provider}…',continueTo:'Continue to {provider}',checkStatus:'Check payment status',backCart:'Back to cart',reference:'Reference',payment:'Payment',completeExhibitor:'Complete Exhibitor Profile',completeDelegate:'Complete Delegate Profile',viewInvoice:'View invoice',prepareError:'Payment could not be prepared.',seo:'Payment'},
  zh:{eyebrow:'付款方式',title:'请选择付款方式',description:'请选择银行手动转账，或通过 {provider} 进行在线付款。最终金额直接取自后端订单。',loading:'正在加载订单…',noOrder:'未找到有效订单。请先检查购物车并创建订单。',openCart:'打开购物车',order:'订单',total:'总计',currencyError:'在线付款和手动付款仅适用于印尼盾（IDR）订单。请返回购物车或联系主办方。',bankTag:'银行账户',bankTitle:'银行手动转账',bankDescription:'查看银行账户信息，转账准确金额，然后上传付款凭证。',bankAction:'查看银行信息',gatewayTag:'在线支付网关',onlineTitle:'在线付款',gatewayCurrency:'由于该订单的币种不是印尼盾（IDR），无法发送至支付网关。',gatewayPending:'一笔付款正在等待后端确认，目前无法创建新的付款。',gatewayContinue:'安全前往 {provider} 托管付款页面。',paymentPending:'付款待处理',preparing:'正在准备 {provider}…',continueTo:'前往 {provider}',checkStatus:'查看付款状态',backCart:'返回购物车',reference:'参考编号',payment:'付款',completeExhibitor:'完善参展商资料',completeDelegate:'完善代表资料',viewInvoice:'查看发票',prepareError:'无法准备付款。',seo:'付款'}
} as const;
const paymentNoticeMessages={
  en:{paymentNotice:'Payment Notice',secureTransaction:'Secure Transactions',splitLead:'Bank Indonesia limits QRIS payments to IDR 10,000,000 per transaction. To ensure compatibility with international payment methods such as Alipay via QRIS and to remain safely within this limit, payments exceeding IDR 9,000,000 will be processed in two secure transactions.',splitStepOne:'The system will automatically guide you through both payment steps.',splitStepTwo:'Your registration will be confirmed once both transactions have been successfully completed.',splitThanks:'Thank you for your understanding.',beforeMidtrans:'Before you continue to Midtrans',reviewPayment:'Review payment',understandContinue:'I Understand, Continue',close:'Close'},
  zh:{paymentNotice:'付款须知',secureTransaction:'笔安全交易',splitLead:'根据印度尼西亚银行的规定，QRIS 单笔付款上限为10,000,000印尼盾。为确保兼容支付宝等通过 QRIS 使用的国际支付方式，并确保交易金额安全地保持在该限额以内，超过9,000,000印尼盾的付款将分为两笔安全交易处理。',splitStepOne:'系统将自动引导您完成两个付款步骤。',splitStepTwo:'两笔交易均成功完成后，您的注册才会获得确认。',splitThanks:'感谢您的理解与配合。',beforeMidtrans:'前往 Midtrans 之前请注意',reviewPayment:'返回核对付款',understandContinue:'我已了解，继续付款',close:'关闭'}
} as const;
const copy=computed(()=>locale.value==='zh-CN'?{...messages.zh,...paymentNoticeMessages.zh}:{...messages.en,...paymentNoticeMessages.en});
useSeoMeta({title:()=>`${copy.value.seo} | IWBIF 2026`});
const route=useRoute();const paymentApi=usePayment();const registrationFlow=useRegistrationFlow();const orderId=ref(''),paymentId=ref(''),errorMessage=ref(''),requestId=ref('');const order=ref<OrderItem|null>(null);const loading=ref(true),submitting=ref(false),splitModalOpen=ref(false);const paymentProviderLabel=computed(() => paymentApi.paymentProviderLabel || copy.value.payment);const isPaid=computed(()=>order.value?.status?.toLowerCase()==='paid'||order.value?.is_payment_complete===true);const isPartial=computed(()=>order.value?.status?.toLowerCase()==='partially_paid');const isSegmented=computed(()=>Boolean((order.value?.payment_sequence_count||0)>1||(order.value?.total_amount||0)>9000000));const showSplitNotice=computed(()=>paymentApi.isMidtransProvider&&isSegmented.value&&!isPaid.value);const queryValue=(value:unknown)=>Array.isArray(value)?String(value[0]||''):typeof value==='string'?value:'';
const activePayment=ref<PaymentItem|null>(null);const hasPendingPayment=computed(()=>['created','pending'].includes(activePayment.value?.transaction_status?.toLowerCase()||''));const unsupportedOrderCurrency=computed(()=>Boolean(order.value&&(order.value.currency||'').toUpperCase()!=='IDR'));const paymentDisabled=computed(()=>hasPendingPayment.value||unsupportedOrderCurrency.value);const paymentStatusTo=computed(()=>`/dashboard/payment-status?order_id=${encodeURIComponent(orderId.value)}&payment_id=${encodeURIComponent(paymentId.value)}`);const preventDisabledNavigation=(event:MouseEvent)=>{if(paymentDisabled.value)event.preventDefault();};
const pendingProfileType=computed(()=>registrationFlow.profilePendingType.value);const paidDestination=computed(()=>pendingProfileType.value?`/register/${pendingProfileType.value}`:`/dashboard/invoice?order_id=${encodeURIComponent(orderId.value)}`);const paidActionLabel=computed(()=>pendingProfileType.value?(pendingProfileType.value==='exhibitor'?copy.value.completeExhibitor:copy.value.completeDelegate):copy.value.viewInvoice);
const statusLabel=(status:string)=>locale.value==='zh-CN'?({paid:'已付款',partially_paid:'部分付款',pending:'待处理',created:'已创建',failed:'失败',expired:'已过期',canceled:'已取消'}[status.toLowerCase()]||status):(status.toLowerCase()==='partially_paid'?'Partially paid':status);
const onlineDescription=computed(()=>unsupportedOrderCurrency.value?copy.value.gatewayCurrency:hasPendingPayment.value?copy.value.gatewayPending:copy.value.gatewayContinue.replace('{provider}',paymentProviderLabel.value));
const onlineAction=computed(()=>hasPendingPayment.value?copy.value.paymentPending:submitting.value?copy.value.preparing.replace('{provider}',paymentProviderLabel.value):copy.value.continueTo.replace('{provider}',paymentProviderLabel.value));
const apiError=(error:unknown)=>{const value=error as {data?:{message?:string;request_id?:string;errors?:Array<{message:string}>}};requestId.value=value.data?.request_id||'';return value.data?.errors?.[0]?.message||value.data?.message||(error instanceof Error?error.message:copy.value.prepareError);};
const refreshPaidFlow=async()=>{try{await registrationFlow.loadFlow(true);}catch{/* The paid order remains authoritative; app focus will retry the progress refresh. */}};
const startPayment=async()=>{if(!orderId.value||submitting.value||paymentDisabled.value)return;submitting.value=true;errorMessage.value='';try{const checkout=(await (isPartial.value?paymentApi.continueOrderPayment(orderId.value):paymentApi.createCheckout(orderId.value))).data;paymentId.value=checkout.payment_id||'';sessionStorage.setItem('iwbif-store-order-id',orderId.value);if(paymentId.value)sessionStorage.setItem('iwbif-payment-id',paymentId.value);const complete=checkout.order_status==='paid'||checkout.is_payment_complete===true;if(complete){await refreshPaidFlow();await navigateTo(paidDestination.value);return;}if(checkout.payment_url){window.location.assign(checkout.payment_url);return;}await navigateTo(`/dashboard/payment-status?order_id=${encodeURIComponent(orderId.value)}&payment_id=${encodeURIComponent(paymentId.value)}`);}catch(error){errorMessage.value=apiError(error);}finally{submitting.value=false;}};
const requestPayment=()=>{if(showSplitNotice.value){splitModalOpen.value=true;return;}void startPayment();};
const confirmSplitPayment=()=>{splitModalOpen.value=false;void startPayment();};
onMounted(async()=>{orderId.value=queryValue(route.query.order_id)||sessionStorage.getItem('iwbif-store-order-id')||'';paymentId.value=queryValue(route.query.payment_id)||sessionStorage.getItem('iwbif-payment-id')||sessionStorage.getItem('iwbif-doku-payment-id')||'';if(orderId.value){try{order.value=(await paymentApi.getOrder(orderId.value)).data;if(isPaid.value)await refreshPaidFlow();else if(paymentId.value){const candidate=(await paymentApi.getPayment(paymentId.value)).data;if(candidate.order_id===orderId.value)activePayment.value=candidate;}}catch(error){errorMessage.value=apiError(error);}}loading.value=false;});const money=(amount:number,currency:string)=>new Intl.NumberFormat(locale.value==='zh-CN'?'zh-CN':'id-ID',{style:'currency',currency:currency||'IDR',maximumFractionDigits:0}).format(amount||0);
</script>
<style scoped>
.notice { @apply mt-8 rounded-2xl border border-amber-300/20 bg-amber-300/5 p-5 text-amber-100; }
.payment-choice { display:flex; min-height:17rem; flex-direction:column; border:1px solid rgba(255,255,255,.12); border-radius:1.5rem; padding:1.4rem; transition:transform .2s ease,border-color .2s ease,box-shadow .2s ease; }
.payment-choice:hover { transform:translateY(-4px); border-color:rgba(230,196,119,.5); box-shadow:0 20px 45px rgba(2,10,24,.35); }
.payment-choice--disabled { cursor:not-allowed; opacity:.55; }
.payment-choice--disabled:hover { transform:none; border-color:rgba(255,255,255,.12); box-shadow:none; }
.payment-choice-bank { background:linear-gradient(145deg,rgba(230,196,119,.12),rgba(4,21,45,.72)); }
.payment-choice-qr { background:linear-gradient(145deg,rgba(34,211,238,.12),rgba(4,21,45,.72)); }
.payment-choice-offline { background:linear-gradient(145deg,rgba(52,211,153,.12),rgba(4,21,45,.72)); }
.payment-choice-doku { background:linear-gradient(145deg,rgba(255,255,255,.08),rgba(4,21,45,.78)); }
.payment-choice__tag { color:#d8ac59; font-size:.65rem; font-weight:800; letter-spacing:.2em; text-transform:uppercase; }
.payment-choice strong { margin-top:1rem; color:#fff; font-size:1.3rem; }
.payment-choice p { margin-top:.75rem; color:#aeb9c8; font-size:.875rem; line-height:1.65; }
.payment-choice__action { display:inline-flex; margin-top:auto; align-items:center; justify-content:space-between; gap:.75rem; border-radius:999px; background:#e6c477; padding:.8rem 1rem; color:#04152d; font-size:.875rem; font-weight:800; }
.payment-choice--split { border-color:rgba(230,196,119,.45); box-shadow:0 0 0 1px rgba(230,196,119,.08),0 22px 55px rgba(216,172,89,.1); }
.split-notice { position:relative; display:grid; grid-template-columns:auto minmax(0,1fr); gap:1rem; overflow:hidden; margin-top:1.25rem; border:1px solid rgba(251,191,36,.48); border-radius:1.5rem; background:radial-gradient(circle at 0 0,rgba(251,191,36,.18),transparent 18rem),linear-gradient(135deg,rgba(69,37,8,.88),rgba(4,21,45,.96)); padding:1.25rem; box-shadow:0 18px 50px rgba(0,0,0,.3),inset 0 1px rgba(255,255,255,.08); }
.split-notice::after { content:''; position:absolute; right:-3rem; top:-3rem; width:8rem; height:8rem; border:1px solid rgba(251,191,36,.16); border-radius:999px; }
.split-notice__icon,.split-modal__mark { display:grid; width:2.8rem; height:2.8rem; flex:0 0 auto; place-items:center; border:1px solid rgba(251,191,36,.58); border-radius:999px; background:rgba(251,191,36,.16); color:#fde68a; font-size:1.2rem; font-weight:900; box-shadow:0 0 0 6px rgba(251,191,36,.06); }
.split-notice__eyebrow { color:#fcd34d; font-size:.7rem; font-weight:900; letter-spacing:.2em; text-transform:uppercase; }
.split-notice__badge { border:1px solid rgba(251,191,36,.3); border-radius:999px; background:rgba(251,191,36,.1); padding:.3rem .55rem; color:#fef3c7; font-size:.62rem; font-weight:800; letter-spacing:.1em; text-transform:uppercase; }
.split-notice ol li { display:flex; gap:.7rem; border:1px solid rgba(255,255,255,.09); border-radius:1rem; background:rgba(255,255,255,.045); padding:.85rem; color:#dbe4ef; font-size:.78rem; line-height:1.55; }
.split-notice ol li > span { color:#fcd34d; font-size:.65rem; font-weight:900; letter-spacing:.12em; }
.split-modal { position:fixed; z-index:100; inset:0; display:grid; place-items:center; overflow-y:auto; background:rgba(1,8,20,.86); padding:1rem; backdrop-filter:blur(12px); }
.split-modal__panel { position:relative; width:min(100%,35rem); overflow:hidden; border:1px solid rgba(251,191,36,.48); border-radius:2rem; background:radial-gradient(circle at 12% 0,rgba(251,191,36,.16),transparent 18rem),#06172f; padding:2rem; box-shadow:0 35px 100px rgba(0,0,0,.65),0 0 70px rgba(216,172,89,.11); }
.split-modal__panel h2 { margin-top:1rem; color:#fff; font-family:'Playfair Display','Times New Roman',serif; font-size:clamp(2rem,6vw,3.1rem); font-weight:700; line-height:1; }
.split-modal__close { position:absolute; right:1rem; top:1rem; display:grid; width:2.2rem; height:2.2rem; place-items:center; border:1px solid rgba(255,255,255,.15); border-radius:999px; color:#cbd5e1; font-size:1.3rem; }
.split-modal__flow { display:flex; align-items:center; gap:.7rem; margin:1.5rem 0 1rem; }
.split-modal__flow span { display:grid; width:2.25rem; height:2.25rem; place-items:center; border:1px solid rgba(251,191,36,.5); border-radius:999px; background:rgba(251,191,36,.12); color:#fde68a; font-weight:900; }
.split-modal__flow i { height:1px; flex:1; background:linear-gradient(90deg,#d8ac59,rgba(216,172,89,.2)); }
@media (max-width:639px) { .split-notice { grid-template-columns:1fr; } .split-modal__panel { border-radius:1.5rem; padding:1.5rem; } }
</style>
