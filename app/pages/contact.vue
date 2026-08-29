<template>
  <section class="contact-shell mx-auto max-w-5xl px-3 py-10 sm:px-6 lg:px-8">
    <p class="text-sm uppercase tracking-[.35em] text-amber-200">{{ copy.eyebrow }}</p>
    <h1 class="mt-4 text-3xl font-black sm:text-5xl">{{ copy.title }}</h1>
    <p class="mt-5 max-w-3xl text-sm leading-7 text-slate-300 sm:text-lg sm:leading-8">{{ copy.intro }}</p>

    <div class="support-banner mt-8 rounded-[2rem] border border-amber-200/20 bg-amber-300/10 p-5 sm:p-6">
      <div>
        <p class="text-xs uppercase tracking-[.3em] text-amber-200">{{ copy.help }}</p>
        <p class="mt-3 text-lg font-semibold text-white sm:text-xl">{{ copy.helpText }}</p>
      </div>
      <a href="mailto:event@iwbif.id" class="mt-5 inline-flex rounded-full bg-amber-300 px-5 py-3 font-semibold text-slate-950 sm:mt-0">{{ copy.email }}</a>
    </div>

    <div class="mt-10 grid gap-5 md:grid-cols-3">
      <article class="info-card rounded-[1.75rem] p-5 sm:p-6">
        <p class="text-xs uppercase tracking-[.2em] text-cyan-200">{{ copy.general }}</p>
        <h2 class="mt-3 text-xl font-bold text-white">{{ copy.generalInquiry }}</h2>
        <a href="mailto:event@iwbif.id" class="mt-3 block break-all text-sm leading-7 text-slate-300 transition hover:text-amber-200">event@iwbif.id</a>
        <span class="mt-4 block text-xs uppercase tracking-[.2em] text-slate-400">{{ copy.support }}</span>
      </article>
      <article class="info-card rounded-[1.75rem] p-5 sm:p-6">
        <p class="text-xs uppercase tracking-[.2em] text-cyan-200">{{ copy.partnerships }}</p>
        <h2 class="mt-3 text-xl font-bold text-white">{{ copy.sponsors }}</h2>
        <a href="mailto:partner@iwbif.id" class="mt-3 block break-all text-sm leading-7 text-slate-300 transition hover:text-amber-200">partner@iwbif.id</a>
        <span class="mt-4 block text-xs uppercase tracking-[.2em] text-slate-400">{{ copy.visibility }}</span>
      </article>
      <article class="info-card rounded-[1.75rem] p-5 sm:p-6">
        <p class="text-xs uppercase tracking-[.2em] text-cyan-200">{{ copy.media }}</p>
        <h2 class="mt-3 text-xl font-bold text-white">{{ copy.press }}</h2>
        <a href="mailto:media@iwbif.id" class="mt-3 block break-all text-sm leading-7 text-slate-300 transition hover:text-amber-200">media@iwbif.id</a>
        <span class="mt-4 block text-xs uppercase tracking-[.2em] text-slate-400">{{ copy.coverage }}</span>
      </article>
    </div>
  </section>
</template>

<script setup lang="ts">
const {locale}=useI18n();
const messages={en:{eyebrow:'Contact',title:'Connect with the IWBIF team',intro:'Partnerships, media inquiries, speaking opportunities, and registration assistance for IWBIF 2026 can be directed to the event operations desk.',help:'Need assistance?',helpText:'We can help with registration, partnerships, and event logistics.',email:'Email the team',general:'General',generalInquiry:'General Inquiry',support:'Support desk',partnerships:'Partnerships',sponsors:'Partnership & Sponsors',visibility:'Visibility and collaboration',media:'Media',press:'Press & Media',coverage:'Announcements and coverage'},'zh-CN':{eyebrow:'联系我们',title:'与 IWBIF 团队取得联系',intro:'如需咨询 IWBIF 2026 合作、媒体、演讲机会或注册协助，请联系活动运营团队。',help:'需要帮助？',helpText:'我们可为您提供注册、合作及活动后勤支持。',email:'向团队发送邮件',general:'综合咨询',generalInquiry:'一般咨询',support:'支持服务台',partnerships:'合作',sponsors:'合作与赞助',visibility:'品牌曝光与合作',media:'媒体',press:'新闻与媒体',coverage:'公告与媒体报道'}} as const;
const copy=computed(()=>messages[locale.value==='zh-CN'?'zh-CN':'en']);
useSeoMeta({title:()=>`${copy.value.eyebrow} | IWBIF 2026`,description:()=>copy.value.intro});
</script>

<style scoped>
.contact-shell { position: relative; }
.support-banner {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 1rem;
  border: 1px solid rgba(216, 172, 89, 0.28);
  background: linear-gradient(135deg, rgba(216, 172, 89, 0.08), rgba(255, 255, 255, 0.02));
}
.info-card {
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: linear-gradient(180deg, rgba(11, 36, 71, 0.74), rgba(11, 36, 71, 0.42));
  box-shadow: inset 0 1px rgba(255, 255, 255, 0.04);
  transition: transform 0.2s ease, border-color 0.2s ease;
}
.info-card:hover {
  transform: translateY(-4px);
  border-color: rgba(216, 172, 89, 0.38);
}
@media (min-width: 640px) {
  .support-banner { flex-direction: row; align-items: center; }
}
</style>
