<template>
  <section class="mx-auto max-w-5xl px-3 py-10 sm:px-6 lg:px-8">
    <p class="text-sm uppercase tracking-[.35em] text-amber-200">{{ copy.eyebrow }}</p>
    <h1 class="mt-4 text-3xl font-black sm:text-5xl">{{ copy.title }}</h1>
    <p class="mt-5 max-w-3xl text-sm leading-7 text-slate-300 sm:text-lg sm:leading-8">{{ copy.intro }}</p>

    <div class="mt-10 rounded-[2rem] border border-white/10 bg-white/5 p-4 sm:p-8">
      <h2 class="text-xl font-bold sm:text-2xl">{{ copy.directory }}</h2>
      <p class="mt-3 text-sm leading-7 text-slate-300 sm:text-base">{{ copy.privacy }}</p>
      <NuxtLink to="/dashboard/directory" class="mt-6 inline-flex w-full items-center justify-center rounded-full bg-amber-300 px-6 py-3 font-semibold text-slate-950 sm:w-auto">{{ copy.open }}</NuxtLink>
    </div>
  </section>
</template>
<script setup lang="ts">
const { locale } = useI18n();
const messages={en:{eyebrow:'Participants',title:'Trusted international delegate network for business matching.',intro:'Connect with women entrepreneurs, investors, strategic partners, and ecosystem leaders ready for qualified cross-border opportunities.',directory:'Privacy-led directory',privacy:'Profile visibility is governed by registration status and explicit participant consent for a safe and credible B2B environment.',open:'Open Delegate Directory'},'zh-CN':{eyebrow:'参会者',title:'值得信赖的国际代表商务配对网络。',intro:'与女性企业家、投资者、战略合作伙伴及生态系统领袖建立联系，共同把握优质跨境机遇。',directory:'隐私优先的代表名录',privacy:'资料可见性取决于注册状态和参会者的明确同意，以确保安全可信的 B2B 环境。',open:'打开代表名录'}} as const;
const copy=computed(()=>messages[locale.value==='zh-CN'?'zh-CN':'en']);
useSeoMeta({title:()=>`${copy.value.eyebrow} | IWBIF 2026`,description:()=>copy.value.intro});
</script>
