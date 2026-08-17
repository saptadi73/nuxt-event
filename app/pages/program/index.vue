<template>
  <main class="program-page overflow-hidden">
    <section class="relative mx-auto max-w-7xl px-3 pb-16 pt-10 sm:px-6 sm:pt-20 lg:px-8">
      <div class="program-glow" aria-hidden="true" />
      <div class="relative max-w-5xl">
        <p class="program-eyebrow">Live Event Program</p>
        <h1 class="mt-5 text-3xl font-black leading-[1.08] text-[#f8f6f1] sm:text-5xl lg:text-6xl">Four days from meaningful insight to <span class="text-[#e6c477]">deal execution.</span></h1>
        <div class="mt-8 flex flex-wrap gap-3">
          <span class="program-meta">14–17 October 2026</span>
          <span class="program-meta">Hotel Kempinski Indonesia</span>
          <span class="program-meta">Jakarta, Indonesia</span>
        </div>
        <p class="mt-6 max-w-3xl text-sm leading-7 text-[#aeb9c8] sm:text-base">Sessions are delivered by forum leaders and updated from the official event operations source. Prepare your business materials early for every matching window.</p>
      </div>

      <div v-if="pending" class="mt-10 space-y-4">
        <div v-for="n in 6" :key="n" class="h-28 animate-pulse rounded-3xl border border-white/10 bg-white/5" />
      </div>
      <div v-else-if="error" class="mt-10 rounded-3xl border border-red-400/30 bg-red-950/30 p-6 text-red-100">The event schedule could not be loaded.</div>
      <div v-else class="mt-10 space-y-10">
        <section v-for="(day, dayIndex) in groupedSessions" :key="day.date" class="day-block">
          <div class="day-heading">
            <span class="day-number">Day {{ String(dayIndex + 1).padStart(2, '0') }}</span>
            <p>{{ day.date }}</p>
          </div>
          <div class="mt-5 space-y-4">
            <article v-for="session in day.items" :key="session.id" class="session-card grid gap-5 rounded-3xl p-4 sm:grid-cols-[170px_1fr] sm:p-7">
              <div class="session-time">
                <p class="font-mono text-sm font-semibold text-[#e6c477]">{{ formatTime(session.start_at) }} – {{ formatTime(session.end_at) }}</p>
                <p class="mt-2 text-xs uppercase tracking-[.18em] text-[#8f9eb1]">{{ session.room_name }}</p>
              </div>
              <div>
                <p class="text-xs font-bold uppercase tracking-[.2em] text-[#d8ac59]">{{ label(session.session_type) }}</p>
                <h2 class="mt-2 text-xl font-bold text-[#f8f6f1]">{{ session.title }}</h2>
                <p class="mt-2 text-sm leading-7 text-[#cbd2dc]">{{ session.description }}</p>
              </div>
            </article>
          </div>
        </section>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import {useEvent,type SessionItem} from '~/composables/useEvent';

useSeoMeta({
  title: 'Program | IWBIF 2026',
  description: 'Live event schedule loaded from the IWBIF 2026 session source.'
});

const {getEvents,getEventSessions}=useEvent();
const {data:response,pending,error}=await useAsyncData('public-event-sessions',async()=>{
  const events=await getEvents(1,1);
  const event=events.data[0];
  if(!event?.slug) throw new Error('Event not found');
  return getEventSessions(event.slug)
});

const sessions=computed(()=>response.value?.data??[]);
const groupedSessions=computed(()=>{
  const groups=new Map<string,SessionItem[]>();
  for(const item of sessions.value){
    const date=new Intl.DateTimeFormat('en-GB',{weekday:'long',day:'numeric',month:'long',year:'numeric',timeZone:'Asia/Jakarta'}).format(new Date(item.start_at));
    groups.set(date,[...(groups.get(date)??[]),item]);
  }
  return [...groups].map(([date,items])=>({date,items}));
});

const formatTime=(iso:string)=>new Intl.DateTimeFormat('en-GB',{hour:'2-digit',minute:'2-digit',hour12:false,timeZone:'Asia/Jakarta'}).format(new Date(iso));
const label=(value?:string)=>(value??'session').replaceAll('_',' ');
</script>

<style scoped>
.program-page { min-height:100vh; background:radial-gradient(circle at 84% 5%,rgba(230,196,119,.11),transparent 26rem),radial-gradient(circle at 4% 46%,rgba(11,36,71,.72),transparent 36rem),linear-gradient(180deg,#031127 0%,#061a35 55%,#020e21 100%); }
.program-glow { position:absolute; right:-10rem; top:-12rem; width:38rem; height:38rem; border-radius:999px; background:rgba(216,172,89,.09); filter:blur(90px); }
.program-eyebrow { color:#e6c477; font-size:.75rem; font-weight:700; letter-spacing:.3em; text-transform:uppercase; }
.program-meta { border:1px solid rgba(216,172,89,.28); border-radius:999px; background:rgba(216,172,89,.065); padding:.7rem 1rem; color:#f8f6f1; font-size:.78rem; font-weight:600; }
.day-block { position:relative; padding-left:1.25rem; }
.day-block::before { content:''; position:absolute; left:0; top:.25rem; bottom:-2.5rem; width:1px; background:linear-gradient(180deg,rgba(216,172,89,.6),rgba(216,172,89,.04)); }
.day-block:last-child::before { bottom:0; }
.day-heading { display:flex; align-items:center; gap:1rem; color:#f8f6f1; font-size:.78rem; font-weight:700; letter-spacing:.18em; text-transform:uppercase; }
.day-number { color:#d8ac59; }
.session-card { border:1px solid rgba(255,255,255,.1); background:linear-gradient(135deg,rgba(11,36,71,.78),rgba(4,21,45,.7)); box-shadow:0 22px 55px rgba(0,0,0,.25),inset 0 1px rgba(255,255,255,.035); transition:transform 250ms ease,border-color 250ms ease,box-shadow 250ms ease; backdrop-filter:blur(14px); }
.session-card:hover { transform:translateY(-3px); border-color:rgba(216,172,89,.34); box-shadow:0 28px 68px rgba(0,0,0,.34),0 0 32px rgba(216,172,89,.055); }
.session-time { border-bottom:1px solid rgba(255,255,255,.09); padding-bottom:1rem; }
@media (min-width:640px) { .day-block { padding-left:2rem; } .session-time { border-right:1px solid rgba(255,255,255,.09); border-bottom:0; padding-right:1.5rem; padding-bottom:0; } }
@media (max-width:639px) {
  .day-block { padding-left: 0; }
  .day-block::before { display: none; }
  .day-heading { flex-direction: column; align-items: flex-start; gap: .35rem; letter-spacing: .12em; }
  .session-card { border-radius: 1.25rem; }
  .session-time { border-bottom: 1px solid rgba(255,255,255,.09); padding-bottom: .9rem; }
}
@media (prefers-reduced-motion:reduce) { .session-card { transition:none; } }
</style>
