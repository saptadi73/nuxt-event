<template>
  <main class="host-page overflow-hidden">
    <section class="host-hero relative border-b border-white/10">
      <div class="host-orb host-orb-one" aria-hidden="true" />
      <div class="host-orb host-orb-two" aria-hidden="true" />
      <div class="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8 lg:py-28">
        <p class="text-xs font-bold uppercase tracking-[.34em] text-[#e6c477]">{{ copy.eyebrow }}</p>
        <div class="mt-5 grid gap-8 lg:grid-cols-[1.15fr_.85fr] lg:items-end">
          <h1 class="max-w-4xl font-serif text-4xl font-black leading-[1.08] text-white sm:text-6xl lg:text-7xl">{{ copy.title }}</h1>
          <p class="max-w-xl text-base leading-8 text-slate-300 sm:text-lg">{{ copy.intro }}</p>
        </div>
        <div class="mt-10 flex flex-wrap items-center gap-3 text-xs font-bold uppercase tracking-[.2em] text-sky-100">
          <span class="rounded-full border border-[#e6c477]/30 bg-[#e6c477]/10 px-4 py-2">IWBIF 2026</span>
          <span>{{ copy.eventLine }}</span>
        </div>
      </div>
    </section>

    <section class="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
      <div class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p class="text-xs font-bold uppercase tracking-[.3em] text-[#e6c477]">{{ copy.teamLabel }}</p>
          <h2 class="mt-3 text-3xl font-bold text-white sm:text-4xl">{{ copy.teamTitle }}</h2>
        </div>
        <span v-if="!pending && members.length" class="w-fit rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-[.2em] text-slate-300">{{ copy.count(members.length) }}</span>
      </div>

      <div v-if="pending" class="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3" role="status" :aria-label="copy.loading">
        <article v-for="index in 6" :key="index" class="overflow-hidden rounded-[2rem] border border-white/10 bg-white/5">
          <div class="host-skeleton aspect-[4/4.4]" />
          <div class="space-y-3 p-6"><div class="host-skeleton h-3 w-1/3 rounded-full" /><div class="host-skeleton h-6 w-3/4 rounded-full" /><div class="host-skeleton h-3 w-1/2 rounded-full" /></div>
        </article>
      </div>

      <div v-else-if="error" class="mt-10 rounded-[2rem] border border-rose-300/20 bg-rose-300/10 p-6 text-rose-100">
        <p class="font-semibold">{{ copy.error }}</p><p class="mt-2 text-sm text-rose-100/75">{{ copy.errorHelp }}</p>
        <button type="button" class="mt-5 rounded-full border border-rose-200/30 px-5 py-2.5 text-xs font-bold uppercase tracking-[.2em] transition hover:bg-white/10" @click="() => refresh()">{{ copy.retry }}</button>
      </div>

      <div v-else-if="!members.length" class="mt-10 rounded-[2rem] border border-white/10 bg-white/5 px-6 py-12 text-center text-slate-300">{{ copy.empty }}</div>

      <div v-else class="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <article v-for="member in members" :key="member.id" class="host-card group overflow-hidden rounded-[2rem] border bg-[#071a34]" :class="member.is_featured ? 'border-[#e6c477]/45' : 'border-white/10'">
          <div class="relative aspect-[4/4.4] overflow-hidden bg-[#0a2344]">
            <img v-if="member.profile_photo_url && !brokenPhotos.has(member.id)" :src="mediaUrl(member.profile_photo_url)" :alt="member.full_name" class="h-full w-full object-cover object-top transition duration-700 group-hover:scale-[1.025]" loading="lazy" @error="markPhotoBroken(member.id)">
            <div v-else class="flex h-full items-center justify-center bg-[radial-gradient(circle_at_50%_25%,rgba(50,132,190,.3),transparent_55%)] text-5xl font-black text-sky-100/80">{{ initials(member.full_name) }}</div>
            <div class="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#071a34] to-transparent" aria-hidden="true" />
            <span v-if="member.is_featured" class="absolute left-5 top-5 rounded-full bg-[#e6c477] px-3 py-1.5 text-[10px] font-black uppercase tracking-[.18em] text-[#06162d]">{{ copy.featured }}</span>
          </div>
          <div class="relative -mt-12 p-6 pt-0">
            <p v-if="member.committee_group" class="text-[10px] font-bold uppercase tracking-[.26em] text-[#e6c477]">{{ member.committee_group }}</p>
            <h3 class="mt-3 text-2xl font-bold text-white">{{ member.full_name }}</h3>
            <p class="mt-2 text-sm font-semibold text-sky-200">{{ member.role_title || copy.host }}</p>
            <p v-if="member.organization_name" class="mt-1 text-sm text-slate-400">{{ member.organization_name }}</p>
            <p v-if="member.biography" class="mt-5 border-t border-white/10 pt-5 text-sm leading-7 text-slate-300">{{ member.biography }}</p>
          </div>
        </article>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import type { CommitteeMemberItem } from '~/composables/useEvent';
import { useEvent } from '~/composables/useEvent';

const { locale } = useI18n();
const config = useRuntimeConfig();
const { getEvents, getEventCommittee } = useEvent();
const { mediaUrl } = useMediaUrl();
const messages = {
  en: { eyebrow: 'The people behind the forum', title: 'Meet the Host & Organizing Committee', intro: 'Meet the leaders bringing IWBIF 2026 to life—uniting experience, purpose, and international networks to create meaningful business outcomes.', eventLine: '14–17 October · Jakarta, Indonesia', teamLabel: 'Leadership & stewardship', teamTitle: 'The team shaping IWBIF 2026', loading: 'Loading the host committee…', error: 'The host committee could not be loaded.', errorHelp: 'Please check the API connection or try again.', retry: 'Try again', empty: 'Host and committee profiles will be published here soon.', featured: 'Featured', host: 'Host Committee', count: (value: number) => `${value} committee members` },
  'zh-CN': { eyebrow: '论坛背后的团队', title: '认识主办方与组委会', intro: '认识推动 IWBIF 2026 落地的领袖团队。他们汇聚经验、使命与国际网络，共同促成富有意义的商业成果。', eventLine: '10月14日至17日 · 印度尼西亚雅加达', teamLabel: '领导与协作', teamTitle: '共同塑造 IWBIF 2026 的团队', loading: '正在加载主办团队…', error: '无法加载主办团队。', errorHelp: '请检查 API 连接或稍后重试。', retry: '重试', empty: '主办方与组委会成员资料即将在此发布。', featured: '核心成员', host: '组委会', count: (value: number) => `${value} 位组委会成员` }
} as const;
const copy = computed(() => messages[locale.value === 'zh-CN' ? 'zh-CN' : 'en']);
const brokenPhotos = ref(new Set<string>());
const initials = (name: string) => name.trim().split(/\s+/).map(part => part[0]).slice(0, 2).join('').toUpperCase();
const markPhotoBroken = (id: string) => { brokenPhotos.value = new Set([...brokenPhotos.value, id]); };

const { data, pending, error, refresh } = await useAsyncData(
  `host-committee-${config.public.eventSlug}`,
  async () => {
    const events = await getEvents(1, 100);
    const event = events.data.find(item => item.slug === config.public.eventSlug) ?? events.data.find(item => item.status === 'published') ?? events.data[0];
    if (!event) return [] as CommitteeMemberItem[];
    return (await getEventCommittee(event.id)).data;
  },
  { watch: [locale] }
);
const members = computed(() => data.value ?? []);

useSeoMeta({ title: () => `${copy.value.eyebrow} | IWBIF 2026`, description: () => copy.value.intro });
</script>

<style scoped>
.host-page { background:linear-gradient(180deg,#031127 0%,#061a35 54%,#020e21 100%); min-height:70vh; }
.host-hero { background:radial-gradient(circle at 80% 20%,rgba(216,172,89,.13),transparent 30rem),linear-gradient(135deg,rgba(6,45,82,.65),transparent 58%); }
.host-orb { position:absolute; border-radius:999px; filter:blur(80px); pointer-events:none; }
.host-orb-one { right:8%; top:-8rem; width:24rem; height:24rem; background:rgba(216,172,89,.1); }
.host-orb-two { left:-8rem; bottom:-12rem; width:28rem; height:28rem; background:rgba(14,116,144,.16); }
.host-card { box-shadow:0 24px 70px rgba(0,0,0,.2); transition:transform .35s ease,border-color .35s ease,box-shadow .35s ease; }
.host-card:hover { transform:translateY(-5px); border-color:rgba(230,196,119,.38); box-shadow:0 30px 80px rgba(0,0,0,.34); }
.host-skeleton { position:relative; overflow:hidden; background:rgba(255,255,255,.07); }
.host-skeleton::after { content:''; position:absolute; inset:0; transform:translateX(-100%); background:linear-gradient(90deg,transparent,rgba(255,255,255,.1),transparent); animation:host-shimmer 1.5s infinite; }
@keyframes host-shimmer { to { transform:translateX(100%); } }
@media (prefers-reduced-motion:reduce) { .host-card,.host-card img,.host-skeleton::after { transition:none; animation:none; } }
</style>
