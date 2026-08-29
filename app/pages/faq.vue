<template>
  <section class="mx-auto max-w-4xl px-3 py-10 sm:px-6">
    <p class="text-sm uppercase tracking-[0.35em] text-cyan-200">{{ copy.eyebrow }}</p>
    <h1 class="mt-4 text-3xl font-black sm:text-5xl">{{ copy.title }}</h1>
    <div class="mt-10 space-y-4">
      <details v-for="item in faqs" :key="item.q" class="glass-card rounded-[1.5rem] p-4 sm:p-5">
        <summary class="cursor-pointer list-none text-base font-semibold text-white sm:text-lg">{{ item.q }}</summary>
        <p class="mt-4 text-sm leading-7 text-slate-300 sm:text-base">{{ item.a }}</p>
      </details>
    </div>
  </section>
</template>
<script setup lang="ts">
const { locale } = useI18n();
const messages = {
  en: { eyebrow:'Frequently Asked Questions', title:'Everything you need before joining.', faqs:[{q:'What is IWBIF 2026?',a:'The International Women Business & Investment Forum is a women-led ecosystem conference in Jakarta focused on finance, global collaboration, and digital transformation.'},{q:'Who can attend?',a:'Women entrepreneurs, investors, business leaders, government representatives, buyers, suppliers, distributors, and strategic partners from Indonesia and international communities.'},{q:'Do I need any pre-event qualification?',a:'All participants should have basic business profile readiness, and registration can be completed with standard business details.'},{q:'What language will be used?',a:'The primary event language is English, with interpretation support as needed for selected sessions.'},{q:'What should I bring?',a:'Bring identification, business cards or company details, your QR code, and any company profile materials you plan to share.'},{q:'Can I update matching preferences?',a:'Yes. You can update your matching interests and availability inside your participant dashboard before business matching opens.'},{q:'How will I receive my QR code?',a:'It is generated after successful registration and payment, then appears in your participant dashboard and check-in materials.'},{q:'Will participants receive certificates?',a:'Qualified participants receive digital attendance documentation after verification.'},{q:'Can international participants attend?',a:'Yes. Participants from global markets are welcome, subject to registration completion and verification.'},{q:'Is my contact information visible?',a:'Private data is protected. Only approved directory fields are shown based on consent and your profile visibility preferences.'}] },
  'zh-CN': { eyebrow:'常见问题', title:'参会前需要了解的一切。', faqs:[{q:'IWBIF 2026 是什么？',a:'国际女性商业与投资论坛是在雅加达举办的女性主导生态系统会议，聚焦金融、全球合作与数字化转型。'},{q:'谁可以参加？',a:'欢迎来自印度尼西亚和国际社群的女性企业家、投资者、商业领袖、政府代表、采购商、供应商、分销商及战略合作伙伴参加。'},{q:'参会前需要资格审核吗？',a:'所有参会者应准备基本的商业资料，并可使用标准企业信息完成注册。'},{q:'活动将使用什么语言？',a:'活动主要使用英语，部分专场将根据需要提供口译支持。'},{q:'我应该携带什么？',a:'请携带身份证件、名片或企业资料、您的二维码，以及计划分享的企业介绍材料。'},{q:'可以更新配对偏好吗？',a:'可以。在商务配对开放前，您可在参会者中心更新配对兴趣和可用时间。'},{q:'如何获取二维码？',a:'注册和付款成功后系统会生成二维码，并在参会者中心和签到材料中显示。'},{q:'参会者会获得证书吗？',a:'符合条件的参会者在审核通过后将获得电子参会证明。'},{q:'国际参会者可以参加吗？',a:'可以。欢迎全球市场的参会者，但需完成注册和审核。'},{q:'我的联系信息会被公开吗？',a:'私人数据受到保护。只有经授权的名录字段才会根据您的同意和资料可见性设置显示。'}] }
} as const;
const copy = computed(() => messages[locale.value === 'zh-CN' ? 'zh-CN' : 'en']);
const faqs = computed(() => copy.value.faqs);
useSeoMeta({title:()=>`${copy.value.eyebrow} | IWBIF 2026`,description:()=>copy.value.title});
</script>
