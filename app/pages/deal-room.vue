<template>
  <section class="deal-shell mx-auto max-w-5xl px-3 py-10 sm:px-6 lg:px-8">
    <div class="deal-hero rounded-[2rem] border border-amber-200/20 bg-gradient-to-br from-amber-300/8 via-slate-950/80 to-slate-950/90 p-5 sm:p-8">
      <p class="text-sm uppercase tracking-[.35em] text-amber-200">{{ copy.eyebrow }}</p>
      <h1 class="mt-4 text-3xl font-black sm:text-5xl">{{ copy.title }}</h1>
      <p class="mt-5 max-w-3xl text-sm leading-7 text-slate-300 sm:text-lg sm:leading-8">{{ copy.intro }}</p>
    </div>

    <div class="mt-10 grid gap-5 md:grid-cols-3">
      <article v-for="item in steps" :key="item.title" class="deal-card rounded-[2rem] p-5 sm:p-6">
        <p class="text-xs uppercase tracking-[.25em] text-amber-200">{{ item.step }}</p>
        <h2 class="mt-3 text-xl font-bold sm:text-2xl">{{ item.title }}</h2>
        <p class="mt-3 text-sm leading-7 text-slate-300 sm:text-base">{{ item.text }}</p>
      </article>
    </div>

    <div class="mt-8 rounded-[2rem] border border-amber-200/20 bg-amber-200/5 p-5 sm:p-7">
      <p class="text-xs uppercase tracking-[.35em] text-amber-200">{{ copy.outcomes }}</p>
      <p class="mt-3 text-lg leading-8 text-slate-200 sm:text-xl">{{ copy.outcomesText }}</p>
      <div class="mt-6 grid gap-3 sm:grid-cols-3">
        <div v-for="metric in metrics" :key="metric.label" class="metric-box">
          <span class="metric-value">{{ metric.value }}</span>
          <span class="metric-label">{{ metric.label }}</span>
        </div>
      </div>
      <NuxtLink to="/dashboard" class="mt-6 inline-flex rounded-full bg-amber-300 px-6 py-3 font-semibold text-slate-950 shadow-[0_18px_35px_rgba(216,172,89,0.2)]">{{ copy.open }}</NuxtLink>
    </div>
  </section>
</template>
<script setup lang="ts">
const {locale}=useI18n();
const messages={en:{eyebrow:'Deal Room',title:'Move from introductions to outcomes.',intro:'The IWBIF Deal Room supports focused conversations, meeting requests, and follow-up actions between confirmed delegates.',outcomes:'Business outcomes',outcomesText:'A curated environment for partnership conversations, commercial follow-up, and measurable deal momentum.',open:'Open Participant Dashboard',steps:[{step:'01',title:'Discover',text:'Find aligned companies, buyers, investors, and partners.'},{step:'02',title:'Meet',text:'Request and manage curated business meetings.'},{step:'03',title:'Follow up',text:'Track commitments and 30/60/90-day next actions.'}],metrics:[{value:'1:1',label:'Curated meetings'},{value:'30/60',label:'Follow-up actions'},{value:'ROI',label:'Commercial momentum'}]},'zh-CN':{eyebrow:'洽谈室',title:'从初步介绍走向实质成果。',intro:'IWBIF 洽谈室为已确认代表提供专注洽谈、会议申请及后续行动支持。',outcomes:'商业成果',outcomesText:'精心打造的合作洽谈、商务跟进与可量化交易推进环境。',open:'打开参会者中心',steps:[{step:'01',title:'发现',text:'寻找目标匹配的企业、买家、投资者和合作伙伴。'},{step:'02',title:'会面',text:'申请并管理精准匹配的商务会议。'},{step:'03',title:'后续跟进',text:'跟踪合作承诺以及 30/60/90 天后续行动。'}],metrics:[{value:'1:1',label:'精准配对会议'},{value:'30/60',label:'后续行动'},{value:'ROI',label:'商业动能'}]}} as const;
const copy=computed(()=>messages[locale.value==='zh-CN'?'zh-CN':'en']);
const steps=computed(()=>copy.value.steps); const metrics=computed(()=>copy.value.metrics);
useSeoMeta({title:()=>`${copy.value.eyebrow} | IWBIF 2026`,description:()=>copy.value.intro});
</script>

<style scoped>
.deal-shell { position: relative; }
.deal-hero {
  box-shadow: 0 24px 60px rgba(0,0,0,0.18);
}
.deal-card {
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: linear-gradient(180deg, rgba(11, 36, 71, 0.74), rgba(11, 36, 71, 0.42));
  box-shadow: inset 0 1px rgba(255, 255, 255, 0.04);
  transition: transform 0.2s ease, border-color 0.2s ease;
}
.deal-card:hover {
  transform: translateY(-4px);
  border-color: rgba(216, 172, 89, 0.38);
}
.metric-box {
  border: 1px solid rgba(216, 172, 89, 0.2);
  border-radius: 1rem;
  background: rgba(216, 172, 89, 0.04);
  padding: 1rem;
  text-align: center;
}
.metric-value {
  display: block;
  color: #e6c477;
  font-size: 1.25rem;
  font-weight: 800;
}
.metric-label {
  display: block;
  margin-top: 0.3rem;
  color: #cbd2dc;
  font-size: 0.72rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}
</style>
