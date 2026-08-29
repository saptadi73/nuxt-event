<template>
  <section class="mx-auto max-w-7xl px-3 py-10 sm:px-6 lg:px-8">
    <p class="text-sm uppercase tracking-[.35em] text-amber-200">{{ copy.eyebrow }}</p>
    <h1 class="mt-4 max-w-4xl text-3xl font-black sm:text-5xl">{{ copy.title }}</h1>
    <p class="mt-5 max-w-3xl text-sm leading-7 text-slate-300 sm:text-lg sm:leading-8">{{ copy.intro }}</p>

    <div v-if="pending" class="mt-10 grid gap-5 md:grid-cols-2">
      <div v-for="n in 4" :key="n" class="h-40 animate-pulse rounded-[2rem] bg-white/5" />
    </div>
    <div v-else-if="error" class="mt-10 rounded-3xl border border-red-400/30 bg-red-950/30 p-6 text-red-100">{{ error.message }}</div>
    <div v-else-if="!activities.length" class="mt-10 rounded-3xl border border-white/10 bg-white/5 p-6 text-slate-300">{{ copy.empty }}</div>
    <div v-else class="mt-10 grid gap-5 md:grid-cols-2">
      <article v-for="item in activities" :key="item.id" class="glass-card rounded-[2rem] p-5 sm:p-7">
        <h2 class="text-xl font-bold sm:text-2xl">{{ item.name }}</h2>
        <p v-if="item.description" class="mt-3 text-sm leading-7 text-slate-300 sm:text-base">{{ item.description }}</p>
      </article>
    </div>
  </section>
</template>
<script setup lang="ts">
import {useEvent} from '~/composables/useEvent';
const {locale}=useI18n();
const messages={en:{eyebrow:'Delegate Activities',title:'Build your IWBIF experience.',intro:'Select from the forum, business matching, exhibition, networking, and industrial visit activities published by the organizer.',empty:'Activities will be published soon.',noEvent:'No IWBIF event is currently published.'},'zh-CN':{eyebrow:'代表活动',title:'打造您的 IWBIF 体验。',intro:'从主办方发布的论坛、商务配对、展览、人脉交流及产业参访活动中进行选择。',empty:'活动将于近期发布。',noEvent:'当前尚未发布 IWBIF 活动。'}} as const;
const copy=computed(()=>messages[locale.value==='zh-CN'?'zh-CN':'en']);
useSeoMeta({title:()=>`${copy.value.eyebrow} | IWBIF 2026`});
const {getEvents,getEventActivities}=useEvent();
const {data:response,pending,error}=await useAsyncData('iwbif-activities',async()=>{
  const events=await getEvents(1,1);
  const event=events.data[0];
  if(!event) throw new Error(copy.value.noEvent);
  return getEventActivities(event.id);
},{watch:[locale]});
const activities=computed(()=>response.value?.data.filter(item=>item.is_active!==false)??[]);
</script>
