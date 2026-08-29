<template>
  <section class="mx-auto max-w-4xl px-4 py-14 sm:px-6">
    <p class="text-sm uppercase tracking-[.35em] text-cyan-200">{{ copy.label }}</p>
    <h1 class="mt-3 text-5xl font-black">{{ copy.title }}</h1>
    <p class="mt-5 text-lg leading-8 text-slate-300">{{ copy.intro }}</p>

    <div class="mt-10 grid gap-5">
      <article v-for="item in sections" :key="item.title" class="glass-card rounded-3xl p-6">
        <h2 class="text-xl font-bold">{{ item.title }}</h2>
        <p class="mt-3 leading-7 text-slate-300">{{ item.text }}</p>
      </article>
    </div>

    <NuxtLink to="/dashboard/profile" class="mt-8 inline-flex rounded-full bg-cyan-400 px-6 py-3 font-semibold text-slate-950">{{ copy.manage }}</NuxtLink>
  </section>
</template>

<script setup lang="ts">
const {locale}=useI18n();
const messages={en:{label:'Directory Visibility',title:'You control how other participants discover you.',intro:'The directory supports cross-border networking while keeping your preferences and security as priority.',manage:'Manage My Profile',sections:[{title:'Information that may be shared',text:'Business name, country, expertise, business interests, and selected collaboration goals may be visible with participant consent.'},{title:'Information kept private',text:'Personal contact details, payment information, passwords, documents, and sensitive identifiers are never shown in the public directory.'},{title:'Your choices',text:'Directory participation is optional. You can adjust visibility settings or hide your profile through privacy controls.'},{title:'Professional use',text:'Directory data may only be used for respectful business networking and verified event collaboration activities.'}]},'zh-CN':{label:'名录可见性',title:'您可控制其他参会者如何发现您。',intro:'该名录支持跨境人脉交流，并始终优先保障您的偏好与安全。',manage:'管理我的资料',sections:[{title:'可能共享的信息',text:'在参会者同意的情况下，企业名称、国家、专业领域、商业兴趣及所选合作目标可能会显示。'},{title:'保持私密的信息',text:'个人联系方式、付款信息、密码、文件及敏感身份标识绝不会在公开名录中显示。'},{title:'您的选择',text:'参与名录是自愿的。您可通过隐私控制调整可见性或隐藏资料。'},{title:'专业用途',text:'名录数据仅可用于尊重他人的商务交流及经验证的活动合作。'}]}} as const;
const copy=computed(()=>messages[locale.value==='zh-CN'?'zh-CN':'en']); const sections=computed(()=>copy.value.sections);
useSeoMeta({title:()=>`${copy.value.label} | IWBIF 2026`,description:()=>copy.value.intro});
</script>
