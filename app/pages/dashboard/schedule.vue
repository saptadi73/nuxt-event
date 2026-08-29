<template>
  <section class="mx-auto max-w-5xl px-3 py-10 sm:px-6">
    <p class="text-sm uppercase tracking-[.35em] text-cyan-200">{{ copy.eyebrow }}</p>
    <h1 class="mt-3 text-3xl font-black sm:text-4xl">{{ copy.title }}</h1>
    <div class="mt-8 grid gap-6 md:grid-cols-2">
      <article v-for="day in days" :key="day.date" class="glass-card rounded-[2rem] p-4 sm:p-6">
        <p class="text-xs uppercase tracking-[.25em] text-orange-200">{{ day.date }}</p>
        <h2 class="mt-3 text-xl font-bold sm:text-2xl">{{ day.title }}</h2>
        <div class="mt-5 space-y-4">
          <div v-for="item in day.items" :key="item.time" class="border-l-2 border-cyan-300/30 pl-4">
            <p class="font-mono text-xs text-cyan-200">{{ item.time }}</p>
            <p class="mt-1 text-sm font-semibold sm:text-base">{{ item.title }}</p>
          </div>
        </div>
      </article>
    </div>
    <NuxtLink to="/program" class="mt-7 inline-flex w-full justify-center rounded-full border border-white/15 px-5 py-3 font-semibold sm:w-auto">{{ copy.viewProgram }}</NuxtLink>
  </section>
</template>
<script setup lang="ts">
definePageMeta({middleware:'auth'});
const {locale}=useI18n();
const messages={
  en:{eyebrow:'My Schedule',title:'Your IWBIF agenda',viewProgram:'View complete program',days:[['14 October 2026','Day 1: Arrival and Welcome',[['09:00','Arrival & registration'],['10:00','Welcome forum and opening remarks']]],['15 October 2026','Day 2: Forum and Matching',[['09:00','Opening Session'],['10:30','Panel Sessions'],['14:00','Business Matching Clinics']]],['16 October 2026','Day 3: Deal Creation',[['09:00','Advanced Match Sessions'],['11:00','Investor Roundtables'],['15:00','One-on-one closings']]],['17 October 2026','Day 4: Industrial Exposure',[['08:30','Jababeka industrial visit'],['12:00','Final matchmaking summary']]]]},
  zh:{eyebrow:'我的日程',title:'您的 IWBIF 议程',viewProgram:'查看完整议程',days:[['2026年10月14日','第 1 天：抵达与欢迎',[['09:00','抵达与注册'],['10:00','欢迎论坛及开幕致辞']]],['2026年10月15日','第 2 天：论坛与商务配对',[['09:00','开幕会议'],['10:30','专题讨论'],['14:00','商务配对咨询']]],['2026年10月16日','第 3 天：促成交易',[['09:00','深度配对会议'],['11:00','投资者圆桌会议'],['15:00','一对一洽谈收官']]],['2026年10月17日','第 4 天：产业考察',[['08:30','Jababeka 工业园参访'],['12:00','商务配对总结']]]]}
} as const;
const copy=computed(()=>locale.value==='zh-CN'?messages.zh:messages.en);
useSeoMeta({title:()=>`${copy.value.eyebrow} | IWBIF 2026`});
const days=computed(()=>copy.value.days.map(([date,title,items])=>({date,title,items:items.map(([time,itemTitle])=>({time,title:itemTitle}))})));
</script>
