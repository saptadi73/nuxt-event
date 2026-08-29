<template>
  <main class="program-page overflow-hidden">
    <section class="relative mx-auto max-w-7xl px-3 pb-16 pt-10 sm:px-6 sm:pt-20 lg:px-8">
      <div class="program-glow" aria-hidden="true" />
      <div class="relative max-w-5xl">
        <p class="program-eyebrow">{{ copy.eyebrow }}</p>
        <h1 class="mt-5 text-3xl font-black leading-[1.08] text-[#f8f6f1] sm:text-5xl lg:text-6xl">{{ copy.titleLead }} <span class="text-[#e6c477]">{{ copy.titleHighlight }}</span></h1>
        <div class="mt-8 flex flex-wrap gap-3">
          <span class="program-meta">{{ copy.date }}</span>
          <span class="program-meta">Hotel Kempinski Indonesia</span>
          <span class="program-meta">{{ copy.place }}</span>
        </div>
        <p class="mt-6 max-w-3xl text-sm leading-7 text-[#aeb9c8] sm:text-base">{{ copy.intro }}</p>
      </div>

      <div v-if="pending" class="mt-10 space-y-8" role="status" aria-live="polite" :aria-label="copy.loading">
        <section v-for="day in 2" :key="day" class="day-block" aria-hidden="true">
          <div class="flex items-center gap-4">
            <div class="skeleton h-3 w-16 rounded-full" />
            <div class="skeleton h-3 w-44 rounded-full" />
          </div>
          <div class="mt-5 space-y-4">
            <article v-for="session in 3" :key="session" class="session-card grid gap-5 rounded-3xl p-4 sm:grid-cols-[170px_1fr] sm:p-7">
              <div class="space-y-3 border-b border-white/10 pb-4 sm:border-b-0 sm:border-r sm:pb-0 sm:pr-6">
                <div class="skeleton h-3 w-28 rounded-full" />
                <div class="skeleton h-2.5 w-20 rounded-full" />
              </div>
              <div class="space-y-3">
                <div class="skeleton h-2.5 w-24 rounded-full" />
                <div class="skeleton h-5 w-3/4 rounded-full" />
                <div class="skeleton h-3 w-full rounded-full" />
                <div class="skeleton h-3 w-2/3 rounded-full" />
              </div>
            </article>
          </div>
        </section>
        <span class="sr-only">{{ copy.loading }}</span>
      </div>
      <div v-else-if="error" class="mt-10 rounded-3xl border border-red-400/30 bg-red-950/30 p-6 text-red-100">{{ copy.error }}</div>
      <div v-else-if="!groupedSessions.length" class="mt-10 rounded-3xl border border-white/10 bg-white/5 p-6 text-slate-200">{{ copy.empty }}</div>
      <div v-else class="mt-10 space-y-10">
        <section v-for="(day, dayIndex) in groupedSessions" :key="day.date" class="day-block">
          <div class="day-heading">
            <span class="day-number">{{ copy.day }} {{ String(dayIndex + 1).padStart(2, '0') }}{{ copy.daySuffix }}</span>
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
import { useEvent, type SessionItem } from '~/composables/useEvent';

const {locale}=useI18n();
const messages={en:{eyebrow:'Live Event Program',titleLead:'Four days from meaningful insight to',titleHighlight:'deal execution.',date:'14–17 October 2026',place:'Jakarta, Indonesia',intro:'Sessions are delivered by forum leaders and updated from the official event operations source. Prepare your business materials early for every matching window.',loading:'Loading event program...',error:'The event schedule could not be loaded.',empty:'No program sessions have been published yet.',day:'Day',daySuffix:'',session:'session'},'zh-CN':{eyebrow:'实时活动议程',titleLead:'四天议程，从深度洞察走向',titleHighlight:'交易落地。',date:'2026年10月14日至17日',place:'印度尼西亚·雅加达',intro:'各专场由论坛领袖主导，并从官方活动运营数据源实时更新。请提前为每个配对时段准备商业资料。',loading:'正在加载活动议程…',error:'无法加载活动日程。',empty:'尚未发布议程专场。',day:'第',daySuffix:' 天',session:'专场'}} as const;
const copy=computed(()=>messages[locale.value==='zh-CN'?'zh-CN':'en']);
useSeoMeta({title:()=>`${copy.value.eyebrow} | IWBIF 2026`,description:()=>copy.value.intro});

const config = useRuntimeConfig();
const { getEventSessions, getSessionsByEventId, getEvents } = useEvent();
const eventSlug = config.public.eventSlug || 'iwbif-2026';

const resolveEventSessions = async () => {
  try {
    const fallback = await getEventSessions(eventSlug);
    return fallback?.data ?? [];
  } catch {
    const eventResponse = await getEvents(1, 50);
    const eventList = Array.isArray(eventResponse?.data) ? eventResponse.data : [];
    const matchedEvent = eventList.find((event) => event.slug === eventSlug || event.id === eventSlug) ?? eventList[0];

    if (!matchedEvent?.id) {
      return [];
    }

    const byEventId = await getSessionsByEventId(matchedEvent.id);
    return byEventId?.data ?? [];
  }
};

const { data: response, pending, error } = await useAsyncData(
  `public-event-sessions-${eventSlug}`,
  resolveEventSessions,
  { watch: [locale] }
);

const sessions = computed(() => response.value ?? []);
const groupedSessions = computed(() => {
  const groups = new Map<string, SessionItem[]>();

  for (const item of sessions.value) {
    if (!item?.start_at) continue;

    const parsedDate = new Date(item.start_at);
    if (Number.isNaN(parsedDate.getTime())) continue;

    const date = new Intl.DateTimeFormat(locale.value === 'zh-CN' ? 'zh-CN' : 'en-GB', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      timeZone: 'Asia/Jakarta'
    }).format(parsedDate);

    groups.set(date, [...(groups.get(date) ?? []), item]);
  }

  return [...groups].map(([date, items]) => ({ date, items }));
});

const formatTime = (iso: string) => {
  const parsed = new Date(iso);
  if (Number.isNaN(parsed.getTime())) return '—';

  return new Intl.DateTimeFormat(locale.value === 'zh-CN' ? 'zh-CN' : 'en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'Asia/Jakarta'
  }).format(parsed);
};

const label = (value?: string) => (value ?? copy.value.session).replaceAll('_', ' ');
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
.skeleton { position:relative; overflow:hidden; background:rgba(255,255,255,.075); }
.skeleton::after { content:''; position:absolute; inset:0; transform:translateX(-100%); background:linear-gradient(90deg,transparent,rgba(255,255,255,.1),transparent); animation:skeleton-shimmer 1.5s infinite; }
@keyframes skeleton-shimmer { to { transform:translateX(100%); } }
@media (min-width:640px) { .day-block { padding-left:2rem; } .session-time { border-right:1px solid rgba(255,255,255,.09); border-bottom:0; padding-right:1.5rem; padding-bottom:0; } }
@media (max-width:639px) {
  .day-block { padding-left: 0; }
  .day-block::before { display: none; }
  .day-heading { flex-direction: column; align-items: flex-start; gap: .35rem; letter-spacing: .12em; }
  .session-card { border-radius: 1.25rem; }
  .session-time { border-bottom: 1px solid rgba(255,255,255,.09); padding-bottom: .9rem; }
}
@media (prefers-reduced-motion:reduce) { .session-card { transition:none; } .skeleton::after { animation:none; } }
</style>
