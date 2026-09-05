<template>
  <section class="register-choice-shell mx-auto max-w-5xl px-3 py-10 sm:px-6 lg:px-8">
    <p class="text-sm uppercase tracking-[0.35em] text-amber-200">{{ copy.eyebrow }}</p>
    <h1 class="mt-4 text-3xl font-black sm:text-5xl">{{ copy.title }}</h1>
    <p class="mt-4 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
      {{ copy.intro }}
    </p>
    <p class="mt-3 max-w-2xl text-sm leading-7 text-cyan-200">{{ copy.dualParticipation }}</p>

    <div v-if="!isAuthenticated" class="mt-10 rounded-[2rem] border border-amber-200/20 bg-gradient-to-br from-amber-300/8 via-slate-950/60 to-slate-950/80 p-6 shadow-[0_18px_50px_rgba(0,0,0,0.2)] sm:p-8">
      <p class="text-base text-slate-200">{{ copy.accountRequired }}</p>
      <div class="mt-6 flex flex-col gap-3 sm:flex-row">
        <NuxtLink to="/auth/register" class="inline-flex items-center justify-center rounded-full bg-amber-300 px-6 py-3 font-semibold text-slate-950 shadow-[0_18px_35px_rgba(216,172,89,0.24)] transition hover:brightness-110">{{ copy.create }}</NuxtLink>
        <NuxtLink to="/auth/login" class="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/5 px-6 py-3 font-semibold text-white transition hover:border-white/25 hover:bg-white/10">{{ copy.haveAccount }}</NuxtLink>
      </div>
    </div>

    <div v-else class="mt-10 grid gap-5 md:grid-cols-2">
      <NuxtLink to="/tickets?type=delegate" class="choice-card delegate-card rounded-[2rem] border border-amber-200/20 bg-amber-400/5 p-6 transition duration-200 hover:-translate-y-1 hover:border-amber-300/50 hover:bg-amber-300/10">
        <p class="text-xs uppercase tracking-[0.35em] text-amber-200">{{ copy.delegate }}</p>
        <h2 class="mt-4 text-2xl font-black">{{ copy.registerDelegate }}</h2>
        <p class="mt-3 text-sm leading-7 text-slate-300">{{ copy.delegateText }}</p>
        <span class="mt-6 inline-flex rounded-full bg-amber-300 px-5 py-2.5 font-semibold text-slate-950 shadow-[0_12px_25px_rgba(216,172,89,0.20)]">{{ copy.choose }}</span>
      </NuxtLink>

      <NuxtLink to="/tickets?type=exhibitor" class="choice-card exhibitor-card rounded-[2rem] border border-cyan-200/20 bg-cyan-400/5 p-6 transition duration-200 hover:-translate-y-1 hover:border-cyan-300/50 hover:bg-cyan-300/10">
        <p class="text-xs uppercase tracking-[0.35em] text-cyan-200">{{ copy.exhibitor }}</p>
        <h2 class="mt-4 text-2xl font-black">{{ copy.registerExhibitor }}</h2>
        <p class="mt-3 text-sm leading-7 text-slate-300">{{ copy.exhibitorText }}</p>
        <span class="mt-6 inline-flex rounded-full bg-cyan-300 px-5 py-2.5 font-semibold text-slate-950 shadow-[0_12px_25px_rgba(34,211,238,0.20)]">{{ copy.choose }}</span>
      </NuxtLink>
    </div>
  </section>
</template>

<script setup lang="ts">
const authStore = useAuthStore();
const { isAuthenticated } = storeToRefs(authStore);
const {locale}=useI18n();
const messages={en:{eyebrow:'Registration',title:'Choose how you want to join IWBIF 2026',intro:'Select the participation pathway that best reflects your role at IWBIF 2026: join as a Delegate to engage in curated business opportunities, or as an Exhibitor to showcase your organisation and offerings.',dualParticipation:'A Delegate can also become an Exhibitor. Select "Register as Exhibitor" to choose an Exhibitor Package separately from your Delegate Package.',accountRequired:'You need an account before starting the registration process.',create:'Create account',haveAccount:'I already have an account',delegate:'Delegate',registerDelegate:'Register as Delegate',delegateText:'Choose your delegate package first. You will complete your profile after payment.',exhibitor:'Exhibitor',registerExhibitor:'Register as Exhibitor',exhibitorText:'Choose your exhibitor package first. You will complete your company profile after payment.',choose:'Choose package'},'zh-CN':{eyebrow:'注册',title:'选择您参加 IWBIF 2026 的方式',intro:'请选择最符合您角色的参与方式：以代表身份参与精选商业机遇，或以参展商身份展示您的机构与产品服务。',dualParticipation:'代表也可以同时成为参展商。如需选择参展商套餐，请返回参与方式菜单并选择“注册为参展商”。',accountRequired:'开始注册流程前，您需要先创建账户。',create:'创建账户',haveAccount:'我已有账户',delegate:'代表',registerDelegate:'注册为代表',delegateText:'请先选择代表套餐。付款后您将完善个人资料。',exhibitor:'参展商',registerExhibitor:'注册为参展商',exhibitorText:'请先选择参展商套餐。付款后您将完善企业资料。',choose:'选择套餐'}} as const;
const copy=computed(()=>messages[locale.value==='zh-CN'?'zh-CN':'en']);
useSeoMeta({title:()=>`${copy.value.eyebrow} | IWBIF 2026`,description:()=>copy.value.intro});
</script>

<style scoped>
.register-choice-shell {
  position: relative;
}
.choice-card {
  box-shadow: inset 0 1px rgba(255, 255, 255, 0.04), 0 20px 45px rgba(0, 0, 0, 0.18);
}
.delegate-card {
  background: linear-gradient(145deg, rgba(216, 172, 89, 0.08), rgba(255, 255, 255, 0.02));
}
.exhibitor-card {
  background: linear-gradient(145deg, rgba(34, 211, 238, 0.08), rgba(255, 255, 255, 0.02));
}
@media (max-width: 639px) {
  .choice-card {
    border-radius: 1.5rem;
    padding: 1.25rem;
  }
}
</style>
