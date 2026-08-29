<template>
  <section class="partners-shell mx-auto max-w-7xl px-3 py-10 sm:px-6 lg:px-8">
    <div class="partner-hero rounded-[2rem] border border-cyan-200/20 bg-gradient-to-br from-cyan-400/8 via-slate-950/80 to-slate-950/90 p-5 sm:p-8">
      <p class="text-sm uppercase tracking-[0.35em] text-cyan-200">{{ copy.eyebrow }}</p>
      <h1 class="mt-4 max-w-4xl text-3xl font-black sm:text-5xl">{{ copy.title }}</h1>
      <p class="mt-5 max-w-3xl text-sm leading-7 text-slate-300 sm:text-lg sm:leading-8">{{ copy.intro }}</p>
    </div>

    <div class="partner-cta mt-8 rounded-[2rem] border border-cyan-200/20 bg-cyan-400/5 p-5 sm:p-6">
      <div>
        <p class="text-xs uppercase tracking-[.3em] text-cyan-200">{{ copy.opportunity }}</p>
        <p class="mt-3 text-lg font-semibold text-white sm:text-xl">{{ copy.opportunityText }}</p>
      </div>
      <a href="mailto:partners@iwbif-event.example" class="mt-5 inline-flex rounded-full bg-cyan-300 px-5 py-3 font-semibold text-slate-950 shadow-[0_18px_35px_rgba(34,211,238,0.18)] sm:mt-0">{{ copy.talk }}</a>
    </div>

    <div class="mt-10 grid gap-5 md:grid-cols-2">
      <article v-for="item in items" :key="item.title" class="partner-card rounded-[2rem] p-5 sm:p-7">
        <p class="text-xs uppercase tracking-[.25em] text-orange-200">{{ item.label }}</p>
        <h2 class="mt-4 text-xl font-bold sm:text-2xl">{{ item.title }}</h2>
        <p class="mt-3 text-sm leading-7 text-slate-300 sm:text-base">{{ item.text }}</p>
        <p class="mt-5 text-sm text-cyan-200">{{ item.benefits }}</p>
      </article>
    </div>

    <div class="mt-8 grid gap-6 overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 p-4 sm:p-7 md:grid-cols-2">
      <img src="/foto/pameran.png" :alt="copy.alt" class="h-64 w-full rounded-3xl object-cover"/>
      <div class="self-center">
        <h2 class="text-2xl font-bold sm:text-3xl">{{ copy.supportTitle }}</h2>
        <p class="mt-3 text-sm leading-7 text-slate-300 sm:text-base">{{ copy.supportText }}</p>
        <a href="mailto:partners@iwbif-event.example" class="mt-6 inline-flex w-full items-center justify-center rounded-full bg-cyan-400 px-6 py-3 font-semibold text-slate-950 shadow-[0_18px_35px_rgba(34,211,238,0.18)] sm:w-auto">{{ copy.contact }}</a>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const {locale}=useI18n();
const messages={en:{eyebrow:'Partners and Sponsors',title:'Connect global partners with women-led business opportunities',intro:'Build trust-based visibility with ecosystem brands, financial institutions, chambers, and international collaborators.',opportunity:'Partnership opportunity',opportunityText:'Shape a stronger future for women entrepreneurship and cross-border growth.',talk:'Talk to the team',alt:'Partner exhibition at IWBIF',supportTitle:'Support the Future of International Women Entrepreneurship',supportText:'Help businesses build sustainable cross-border relationships through sponsorship, strategic sessions, and program co-creation.',contact:'Contact Partnership Team',items:[{label:'Institutional',title:'Strategic Partner',text:'For institutions seeking visible leadership in women-led business ecosystems.',benefits:'Executive visibility · keynote access · networking forum · premium booth options'},{label:'Infrastructure',title:'Business Services Partner',text:'For financial, legal, logistics, technology, and business ecosystem firms.',benefits:'Program visibility · curated networking · branded roundtables · thought leadership access'},{label:'Academic',title:'Knowledge Partner',text:'For universities, training organizations, and research institutions.',benefits:'Business delegations · executive briefings · market insight sessions'},{label:'Ecosystem',title:'Community Partner',text:'For associations, women entrepreneur communities, and growth ecosystems.',benefits:'Community recognition · member visibility · media collaboration · cross-border promotion'}]},'zh-CN':{eyebrow:'合作伙伴与赞助商',title:'连接全球合作伙伴与女性主导的商业机遇',intro:'与生态系统品牌、金融机构、商会和国际合作方建立以信任为基础的品牌影响力。',opportunity:'合作机遇',opportunityText:'共同塑造女性创业与跨境增长的更强未来。',talk:'联系团队',alt:'IWBIF 合作伙伴展览',supportTitle:'支持国际女性创业的未来',supportText:'通过赞助、战略专场与共创议程，帮助企业建立可持续的跨境合作关系。',contact:'联系合作团队',items:[{label:'机构合作',title:'战略合作伙伴',text:'面向希望在女性主导商业生态中展现领导力的机构。',benefits:'高管曝光 · 主旨演讲参与 · 人脉论坛 · 高端展位选项'},{label:'基础服务',title:'商业服务合作伙伴',text:'面向金融、法律、物流、科技及商业生态服务企业。',benefits:'议程曝光 · 精准人脉交流 · 品牌圆桌 · 思想领导力'},{label:'学术合作',title:'知识合作伙伴',text:'面向高校、培训组织和研究机构。',benefits:'商务代表团 · 高管简报 · 市场洞察专场'},{label:'生态合作',title:'社群合作伙伴',text:'面向行业协会、女性企业家社群和增长生态组织。',benefits:'社群认可 · 成员曝光 · 媒体合作 · 跨境推广'}]}} as const;
const copy=computed(()=>messages[locale.value==='zh-CN'?'zh-CN':'en']); const items=computed(()=>copy.value.items);
useSeoMeta({title:()=>`${copy.value.eyebrow} | IWBIF 2026`,description:()=>copy.value.intro});
</script>

<style scoped>
.partners-shell { position: relative; }
.partner-hero {
  box-shadow: 0 24px 60px rgba(0,0,0,0.18);
}
.partner-cta {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 1rem;
  border: 1px solid rgba(103, 232, 249, 0.22);
  background: linear-gradient(135deg, rgba(34, 211, 238, 0.08), rgba(255, 255, 255, 0.02));
}
.partner-card {
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: linear-gradient(180deg, rgba(11, 36, 71, 0.74), rgba(11, 36, 71, 0.42));
  transition: transform 0.2s ease, border-color 0.2s ease;
}
.partner-card:hover {
  transform: translateY(-4px);
  border-color: rgba(103, 232, 249, 0.35);
}
@media (min-width: 640px) {
  .partner-cta { flex-direction: row; align-items: center; }
}
</style>
