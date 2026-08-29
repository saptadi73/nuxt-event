<template>
  <section v-if="!canAccessMatching" class="mx-auto max-w-5xl px-3 py-16 sm:px-6 lg:px-8">
    <div class="glass-card rounded-3xl border border-amber-300/25 bg-amber-300/10 p-6 sm:p-8">
      <p class="text-xs uppercase tracking-[.35em] text-amber-200">{{ copy.access }}</p>
      <h1 class="mt-3 text-3xl font-black">{{ copy.unavailable }}</h1>
      <p class="mt-4 max-w-3xl text-sm leading-7 text-slate-200 sm:text-base">{{ accessMessage }}</p>
      <div class="mt-6 flex flex-wrap gap-3">
        <NuxtLink to="/dashboard/payment" class="inline-flex rounded-full bg-amber-300 px-5 py-3 text-sm font-bold text-slate-950">{{ copy.payment }}</NuxtLink>
        <NuxtLink to="/register/delegate" v-if="missingProfileType === 'delegate'" class="inline-flex rounded-full border border-white/20 px-5 py-3 text-sm">{{ copy.completeDelegate }}</NuxtLink>
        <NuxtLink to="/register/exhibitor" v-if="missingProfileType === 'exhibitor'" class="inline-flex rounded-full border border-white/20 px-5 py-3 text-sm">{{ copy.completeExhibitor }}</NuxtLink>
      </div>
    </div>
  </section>
  <main v-else class="business-page">
    <section class="mx-auto max-w-7xl px-3 pb-14 pt-6 sm:px-6 sm:pt-12 lg:px-8">
      <section v-if="organizerRecommendations.length || recommendationsLoading" class="mb-8 rounded-3xl border border-amber-300/25 bg-amber-300/10 p-5 sm:p-7">
        <div class="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div><p class="text-xs font-semibold uppercase tracking-[.3em] text-amber-200">{{ copy.organizerSuggestions }}</p><h2 class="mt-2 text-2xl font-black">{{ copy.potentialPartners }}</h2></div>
          <span class="text-xs text-slate-300">{{ copy.privateResponse }}</span>
        </div>
        <div v-if="recommendationsLoading" class="mt-5 h-36 animate-pulse rounded-2xl bg-white/5" />
        <div v-else class="mt-5 grid gap-4 lg:grid-cols-2">
          <article v-for="item in organizerRecommendations" :key="item.id" class="rounded-2xl border border-white/10 bg-slate-950/55 p-5">
            <div class="flex items-start justify-between gap-3"><div><h3 class="font-bold text-white">{{ partyName(item) }}</h3><p class="text-sm text-slate-400">{{ partyCompany(item) }}</p></div><span class="rounded-full border border-white/10 px-2 py-1 text-[10px] uppercase tracking-wider text-slate-300">{{ item.status.replaceAll('_', ' ') }}</span></div>
            <dl class="mt-4 space-y-3 text-sm"><div><dt class="text-xs uppercase tracking-wider text-slate-500">{{ copy.whyMatch }}</dt><dd class="mt-1 text-slate-200">{{ item.reason }}</dd></div><div><dt class="text-xs uppercase tracking-wider text-slate-500">{{ copy.topic }}</dt><dd class="mt-1 text-slate-200">{{ item.topic }}</dd></div></dl>
            <p v-if="item.expires_at" class="mt-4 text-xs text-amber-200">{{ copy.respondBy }} {{ formatDate(item.expires_at) }} · {{ countdown(item.expires_at) }}</p>
            <div v-if="item.status === 'awaiting_responses'" class="mt-5 flex flex-wrap gap-2">
              <button :disabled="respondingId === item.id" class="rounded-full bg-amber-300 px-4 py-2 text-xs font-bold text-slate-950 disabled:opacity-50" @click="respond(item.id, 'interested')">{{ copy.interested }}</button>
              <button :disabled="respondingId === item.id" class="rounded-full border border-white/20 px-4 py-2 text-xs font-bold disabled:opacity-50" @click="respond(item.id, 'not_interested')">{{ copy.notInterested }}</button>
            </div>
          </article>
        </div>
        <p v-if="recommendationsError" class="mt-4 text-sm text-rose-200">{{ recommendationsError }}</p>
      </section>
      <div class="business-hero">
        <img src="/images/business-matching.png" :alt="copy.alt" class="business-hero__image">
        <div class="business-hero__shade" aria-hidden="true" />
        <div class="business-hero__content">
          <p class="text-xs font-semibold uppercase tracking-[.35em] text-[#f1d58f] sm:text-sm">{{ copy.eyebrow }}</p>
          <h1 class="mt-4 max-w-3xl text-4xl font-black leading-[1.02] text-white sm:text-5xl lg:text-7xl">{{ copy.heroLine1 }}<br>{{ copy.heroLine2 }}</h1>
          <p class="mt-5 max-w-xl text-sm leading-7 text-white/80 sm:text-base lg:text-lg">{{ copy.intro }}</p>
          <NuxtLink to="/register/delegate" class="business-hero__action">{{ copy.join }} <span aria-hidden="true">→</span></NuxtLink>
        </div>
        <div class="business-hero__label"><span>{{ copy.jakarta }}</span><span class="h-1 w-1 rounded-full bg-[#d8ac59]" /><span>{{ copy.date }}</span></div>
      </div>

      <div class="mt-16 text-center">
        <p class="text-xs font-semibold uppercase tracking-[.32em] text-[#d8ac59]">{{ copy.sectorsLabel }}</p>
        <h2 class="mx-auto mt-4 max-w-3xl text-3xl font-black text-white sm:text-4xl">{{ copy.sectorsTitle }}</h2>
      </div>
      <div class="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <article v-for="(sector, index) in sectors" :key="sector" class="sector-card">
          <span class="sector-card__number">0{{ index + 1 }}</span>
          <h3 class="mt-8 text-xl font-bold text-white">{{ sector }}</h3>
          <p class="mt-3 text-sm leading-7 text-slate-400">{{ copy.sectorText }}</p>
        </article>
      </div>

      <section class="profile-callout">
        <div>
          <p class="text-xs font-semibold uppercase tracking-[.3em] text-[#d8ac59]">{{ copy.ready }}</p>
          <h2 class="mt-3 text-3xl font-black text-white sm:text-4xl">{{ copy.prepare }}</h2>
          <p class="mt-4 max-w-3xl leading-7 text-slate-300">{{ copy.profileText }}</p>
        </div>
        <NuxtLink to="/register/delegate" class="profile-callout__action">{{ copy.register }}</NuxtLink>
      </section>
    </section>
  </main>
</template>

<script setup lang="ts">
import { useRegistrationFlow } from '~/composables/useRegistrationFlow';
import { useBusinessMatching, type OrganizerRecommendation } from '~/composables/useBusinessMatching';
import { useEvent } from '~/composables/useEvent';

definePageMeta({ middleware: 'auth' });
const {locale}=useI18n();
const messages={en:{access:'Access control',unavailable:'Business Matching is currently unavailable',payment:'Go to payment',completeDelegate:'Complete delegate profile',completeExhibitor:'Complete exhibitor profile',organizerSuggestions:'Organizer Suggestions',potentialPartners:'Potential business partners selected for you',privateResponse:'Your response remains private until both parties respond.',whyMatch:'Why this match',topic:'Topic',interested:'Interested',notInterested:'Not interested',alt:'Women business leaders meeting and building international partnerships',eyebrow:'Business Matching',heroLine1:'Connect. Match.',heroLine2:'Make Deals.',intro:'A curated process connecting buyers, sellers, investors, distributors, suppliers, and strategic partners with relevant international opportunities.',sectorsLabel:'Six opportunity sectors',sectorsTitle:'Meet the right partners for your next move.',sectorText:'Targeted discovery and meeting opportunities for delegates in this sector.',ready:'Get match-ready',prepare:'Prepare your business profile',profileText:'Confirmed delegates can add company information, products or services, business objectives, target markets, and preferred meeting categories from their dashboard.',register:'Register as a Delegate',checking:'Checking your registration progress...',validateError:'Unable to validate your registration status right now. Please try again from the dashboard.',delegateRequired:'Complete your delegate profile first. Business matching is unlocked after the delegate profile is complete.',exhibitorRequired:'Complete your exhibitor profile first. Business matching is unlocked after the exhibitor profile is complete.',paymentRequired:'You need to complete payment before Business Matching is available.',registrationRequired:'Please complete your registration and payment before accessing business matching.',expired:'Expired',hours:(hours:number)=>`${hours} hours remaining`,participant:'Business participant',organization:'Organization not listed',loadError:'Organizer suggestions could not be loaded.',closed:'This suggestion has already closed or expired.',responseError:'The response could not be sent.',sectors:['Creative Economy','Healthcare & Wellness','Food & Beverage','Fashion & Style','Industrial Estate','Cross-sector Opportunities']},'zh-CN':{access:'访问控制',unavailable:'商务配对当前不可用',payment:'前往付款',completeDelegate:'完善代表资料',completeExhibitor:'完善参展商资料',organizerSuggestions:'主办方建议',potentialPartners:'为您精选的潜在商业合作伙伴',privateResponse:'在双方均回复之前，您的回复将保持私密。',whyMatch:'匹配理由',topic:'主题',interested:'感兴趣',notInterested:'不感兴趣',alt:'女性商业领袖会面并建立国际合作',eyebrow:'商务配对',heroLine1:'连接。配对。',heroLine2:'促成交易。',intro:'通过精心策划的流程，将买家、卖家、投资者、分销商、供应商和战略合作伙伴与相关国际机遇相连。',sectorsLabel:'六大机遇领域',sectorsTitle:'为下一步发展找到合适的合作伙伴。',sectorText:'为该领域代表提供精准发现与会面机会。',ready:'做好配对准备',prepare:'完善您的商业资料',profileText:'已确认代表可在用户中心添加企业信息、产品或服务、商业目标、目标市场及首选会议类别。',register:'注册成为代表',checking:'正在检查您的注册进度…',validateError:'当前无法验证您的注册状态。请从用户中心重试。',delegateRequired:'请先完善代表资料。代表资料完成后即可解锁商务配对。',exhibitorRequired:'请先完善参展商资料。参展商资料完成后即可解锁商务配对。',paymentRequired:'您需完成付款后才能使用商务配对。',registrationRequired:'请完成注册和付款后再访问商务配对。',expired:'已过期',hours:(hours:number)=>`剩余 ${hours} 小时`,participant:'商务参与者',organization:'未列出所属机构',loadError:'无法加载主办方建议。',closed:'此建议已关闭或过期。',responseError:'无法发送回复。',sectors:['创意经济','医疗与健康','食品与饮料','时尚与风格','工业园区','跨领域机遇']}};
const baseCopy=computed(()=>messages[locale.value==='zh-CN'?'zh-CN':'en']);
const copy=computed(()=>({
  ...baseCopy.value,
  ...(locale.value==='zh-CN'
    ? {respondBy:'请于此日期前回复：',join:'参加商务配对',jakarta:'雅加达',date:'2026年10月15日至16日'}
    : {respondBy:'Respond by',join:'Join Business Matching',jakarta:'Jakarta',date:'15–16 October 2026'})
}));
useSeoMeta({title:()=>`${copy.value.eyebrow} | IWBIF 2026`,description:()=>copy.value.intro});

const registrationFlow = useRegistrationFlow();
const { getEvents } = useEvent();
const { getOrganizerRecommendations, respondToOrganizerRecommendation } = useBusinessMatching();
const accessMessage = ref(copy.value.checking);
const organizerRecommendations = ref<OrganizerRecommendation[]>([]);
const recommendationsLoading = ref(false);
const recommendationsError = ref('');
const respondingId = ref('');
const currentEventId = ref('');

const canAccessMatching = computed(() => {
  return registrationFlow.canEnterBusinessMatching.value;
});
const missingProfileType = computed(() => registrationFlow.profilePendingType.value);

try {
  if (!registrationFlow.state.value) {
    await registrationFlow.loadFlow();
  }
} catch {
  accessMessage.value = copy.value.validateError;
}
if (!canAccessMatching.value) {
  const profile = registrationFlow.profilePendingType.value;
  if (profile) {
    accessMessage.value = profile === 'delegate'
      ? copy.value.delegateRequired
      : copy.value.exhibitorRequired;
  } else if (registrationFlow.state.value?.selected_types?.length) {
    accessMessage.value = copy.value.paymentRequired;
  } else {
    accessMessage.value = copy.value.registrationRequired;
  }
}
const sectors = computed(()=>copy.value.sectors);

const formatDate = (value: string) => new Intl.DateTimeFormat(locale.value === 'zh-CN' ? 'zh-CN' : 'en-GB', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value));
const countdown = (value: string) => {
  const hours = Math.ceil((new Date(value).getTime() - Date.now()) / 3600000);
  return hours <= 0 ? copy.value.expired : copy.value.hours(hours);
};
const partyName = (item: OrganizerRecommendation) => item.counterpart?.name || item.counterpart?.full_name || item.participant_b?.name || item.participant_b?.full_name || copy.value.participant;
const partyCompany = (item: OrganizerRecommendation) => item.counterpart?.organization || item.counterpart?.company_name || item.participant_b?.organization || item.participant_b?.company_name || copy.value.organization;
const loadOrganizerRecommendations = async () => {
  if (!currentEventId.value) return;
  recommendationsLoading.value = true;
  try { organizerRecommendations.value = (await getOrganizerRecommendations(currentEventId.value)).data || []; }
  catch { recommendationsError.value = copy.value.loadError; }
  finally { recommendationsLoading.value = false; }
};
const respond = async (id: string, response: 'interested' | 'not_interested') => {
  respondingId.value = id;
  recommendationsError.value = '';
  try {
    const result = await respondToOrganizerRecommendation(id, response);
    if (result.data?.meeting_id) await navigateTo(`/dashboard/schedule?meeting_id=${encodeURIComponent(result.data.meeting_id)}`);
    else await loadOrganizerRecommendations();
  } catch (error) {
    const value = error as { status?: number; response?: { status?: number }; data?: { message?: string } };
    recommendationsError.value = (value.response?.status || value.status) === 409 ? copy.value.closed : value.data?.message || copy.value.responseError;
    await loadOrganizerRecommendations();
  } finally { respondingId.value = ''; }
};

onMounted(async () => {
  if (!canAccessMatching.value) return;
  try { currentEventId.value = (await getEvents(1, 20)).data?.[0]?.id || ''; await loadOrganizerRecommendations(); } catch { /* marketing content remains available */ }
});
</script>

<style scoped>
.business-page {
  position: relative;
  background: radial-gradient(circle at 85% 12%, rgb(216 172 89 / 12%), transparent 25rem);
}
.business-hero {
  position: relative;
  min-height: clamp(35rem, 72vw, 47rem);
  overflow: hidden;
  border: 1px solid rgb(255 255 255 / 12%);
  border-radius: clamp(1.5rem, 4vw, 3rem);
  background: linear-gradient(180deg, rgba(3, 10, 25, 0.28), rgba(3, 10, 25, 0.76));
  box-shadow: 0 30px 80px rgb(0 0 0 / 38%), inset 0 1px rgba(255, 255, 255, 0.07);
}
.business-hero__image { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: 56% center; }
.business-hero__shade { position: absolute; inset: 0; background: linear-gradient(90deg, rgb(3 10 25 / 94%) 0%, rgb(3 10 25 / 72%) 35%, rgb(3 10 25 / 8%) 72%), linear-gradient(0deg, rgb(3 10 25 / 78%) 0%, transparent 42%); }
.business-hero__content { position: relative; z-index: 1; display: flex; min-height: inherit; max-width: 48rem; flex-direction: column; justify-content: center; padding: clamp(2rem, 7vw, 6rem); }
.business-hero__content h1 {
  background: linear-gradient(135deg, #fffaf0 0%, #f0d493 38%, #f7e4b1 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}
.business-hero__action, .profile-callout__action { display: inline-flex; align-items: center; justify-content: center; gap: .75rem; width: fit-content; border-radius: 999px; background: linear-gradient(135deg, #f0d493, #c7953e); padding: .9rem 1.4rem; color: #071225; font-weight: 800; transition: transform .2s ease, box-shadow .2s ease; }
.business-hero__action { margin-top: 2rem; }
.business-hero__action:hover, .profile-callout__action:hover { transform: translateY(-2px); box-shadow: 0 12px 30px rgb(216 172 89 / 25%); }
.business-hero__label { position: absolute; z-index: 1; right: clamp(1.5rem, 4vw, 3rem); bottom: clamp(1.5rem, 4vw, 3rem); display: flex; align-items: center; gap: .7rem; border: 1px solid rgba(216, 172, 89, 0.22); border-radius: 999px; background: rgba(3, 10, 25, 0.38); padding: .7rem 1rem; color: rgb(255 255 255 / 72%); font-size: .72rem; font-weight: 600; letter-spacing: .12em; text-transform: uppercase; backdrop-filter: blur(12px); }
.sector-card { position: relative; overflow: hidden; min-height: 13rem; border: 1px solid rgb(255 255 255 / 10%); border-radius: 1.5rem; background: linear-gradient(145deg, rgb(255 255 255 / 7%), rgb(255 255 255 / 2%)); padding: 1.5rem; transition: border-color .25s ease, transform .25s ease, background .25s ease; }
.sector-card:hover { transform: translateY(-4px); border-color: rgb(216 172 89 / 45%); background: linear-gradient(145deg, rgb(216 172 89 / 12%), rgb(255 255 255 / 2%)); }
.sector-card__number { color: #d8ac59; font-size: .72rem; font-weight: 800; letter-spacing: .2em; }
.profile-callout { display: flex; margin-top: 4rem; align-items: center; justify-content: space-between; gap: 2rem; border: 1px solid rgb(216 172 89 / 22%); border-radius: 2rem; background: linear-gradient(120deg, rgb(216 172 89 / 12%), rgb(255 255 255 / 4%)); padding: clamp(1.75rem, 5vw, 3.5rem); box-shadow: inset 0 1px rgba(255,255,255,0.06); }
@media (max-width: 767px) {
  .business-hero { min-height: 32rem; }
  .business-hero__image { object-position: 62% center; }
  .business-hero__shade { background: linear-gradient(0deg, rgb(3 10 25 / 96%) 0%, rgb(3 10 25 / 65%) 62%, rgb(3 10 25 / 15%) 100%); }
  .business-hero__content { justify-content: flex-end; padding-bottom: 5.25rem; }
  .business-hero__action, .profile-callout__action { width: 100%; }
  .business-hero__label { left: 1.25rem; right: auto; bottom: 1.25rem; }
  .profile-callout { align-items: flex-start; flex-direction: column; }
  .sector-card { min-height: 11rem; }
}
</style>
