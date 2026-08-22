import { _ as _plugin_vue_export_helper_default, a as useAsyncData, i as useRuntimeConfig } from '../virtual/entry.mjs';
import { u as useSeoMeta$1 } from './head-D-xrF-Fu.mjs';
import { u as useEvent } from './useEvent-B_Up9ELJ.mjs';
import { defineComponent, withAsyncContext, computed, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderList, ssrInterpolate } from 'vue/server-renderer';
import 'nostics';
import 'nostics/formatters/ansi';
import '../_/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import '../routes/renderer.mjs';
import 'unhead/server';
import 'unhead/legacy';
import 'unhead/plugins';
import 'vue-bundle-renderer/runtime';
import 'devalue';
import 'vue-router';
import '@vue/shared';
import 'unhead/utils';

//#region app/pages/program/index.vue?vue&type=script&setup=true&lang.ts
var index_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "index",
	__ssrInlineRender: true,
	async setup(__props) {
		let __temp, __restore;
		useSeoMeta$1({
			title: "Program | IWBIF 2026",
			description: "Live event schedule loaded from the IWBIF 2026 session source."
		});
		const config = useRuntimeConfig();
		const { getEventSessions, getSessionsByEventId, getEvents } = useEvent();
		const eventSlug = config.public.eventSlug || "iwbif-2026";
		const resolveEventSessions = async () => {
			try {
				return (await getEventSessions(eventSlug))?.data ?? [];
			} catch {
				const eventResponse = await getEvents(1, 50);
				const eventList = Array.isArray(eventResponse?.data) ? eventResponse.data : [];
				const matchedEvent = eventList.find((event) => event.slug === eventSlug || event.id === eventSlug) ?? eventList[0];
				if (!matchedEvent?.id) return [];
				return (await getSessionsByEventId(matchedEvent.id))?.data ?? [];
			}
		};
		const { data: response, pending, error, refresh } = ([__temp, __restore] = withAsyncContext(() => useAsyncData(`public-event-sessions-${eventSlug}`, resolveEventSessions)), __temp = await __temp, __restore(), __temp);
		const sessions = computed(() => response.value ?? []);
		const groupedSessions = computed(() => {
			const groups = /* @__PURE__ */ new Map();
			for (const item of sessions.value) {
				if (!item?.start_at) continue;
				const parsedDate = new Date(item.start_at);
				if (Number.isNaN(parsedDate.getTime())) continue;
				const date = new Intl.DateTimeFormat("en-GB", {
					weekday: "long",
					day: "numeric",
					month: "long",
					year: "numeric",
					timeZone: "Asia/Jakarta"
				}).format(parsedDate);
				groups.set(date, [...groups.get(date) ?? [], item]);
			}
			return [...groups].map(([date, items]) => ({
				date,
				items
			}));
		});
		const formatTime = (iso) => {
			const parsed = new Date(iso);
			if (Number.isNaN(parsed.getTime())) return "—";
			return new Intl.DateTimeFormat("en-GB", {
				hour: "2-digit",
				minute: "2-digit",
				hour12: false,
				timeZone: "Asia/Jakarta"
			}).format(parsed);
		};
		const label = (value) => (value ?? "session").replaceAll("_", " ");
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<main${ssrRenderAttrs(mergeProps({ class: "program-page overflow-hidden" }, _attrs))} data-v-2b3fda79><section class="relative mx-auto max-w-7xl px-3 pb-16 pt-10 sm:px-6 sm:pt-20 lg:px-8" data-v-2b3fda79><div class="program-glow" aria-hidden="true" data-v-2b3fda79></div><div class="relative max-w-5xl" data-v-2b3fda79><p class="program-eyebrow" data-v-2b3fda79>Live Event Program</p><h1 class="mt-5 text-3xl font-black leading-[1.08] text-[#f8f6f1] sm:text-5xl lg:text-6xl" data-v-2b3fda79>Four days from meaningful insight to <span class="text-[#e6c477]" data-v-2b3fda79>deal execution.</span></h1><div class="mt-8 flex flex-wrap gap-3" data-v-2b3fda79><span class="program-meta" data-v-2b3fda79>14–17 October 2026</span><span class="program-meta" data-v-2b3fda79>Hotel Kempinski Indonesia</span><span class="program-meta" data-v-2b3fda79>Jakarta, Indonesia</span></div><p class="mt-6 max-w-3xl text-sm leading-7 text-[#aeb9c8] sm:text-base" data-v-2b3fda79>Sessions are delivered by forum leaders and updated from the official event operations source. Prepare your business materials early for every matching window.</p></div>`);
			if (unref(pending)) {
				_push(`<div class="mt-10 space-y-8" role="status" aria-live="polite" aria-label="Loading event program" data-v-2b3fda79><!--[-->`);
				ssrRenderList(2, (day) => {
					_push(`<section class="day-block" aria-hidden="true" data-v-2b3fda79><div class="flex items-center gap-4" data-v-2b3fda79><div class="skeleton h-3 w-16 rounded-full" data-v-2b3fda79></div><div class="skeleton h-3 w-44 rounded-full" data-v-2b3fda79></div></div><div class="mt-5 space-y-4" data-v-2b3fda79><!--[-->`);
					ssrRenderList(3, (session) => {
						_push(`<article class="session-card grid gap-5 rounded-3xl p-4 sm:grid-cols-[170px_1fr] sm:p-7" data-v-2b3fda79><div class="space-y-3 border-b border-white/10 pb-4 sm:border-b-0 sm:border-r sm:pb-0 sm:pr-6" data-v-2b3fda79><div class="skeleton h-3 w-28 rounded-full" data-v-2b3fda79></div><div class="skeleton h-2.5 w-20 rounded-full" data-v-2b3fda79></div></div><div class="space-y-3" data-v-2b3fda79><div class="skeleton h-2.5 w-24 rounded-full" data-v-2b3fda79></div><div class="skeleton h-5 w-3/4 rounded-full" data-v-2b3fda79></div><div class="skeleton h-3 w-full rounded-full" data-v-2b3fda79></div><div class="skeleton h-3 w-2/3 rounded-full" data-v-2b3fda79></div></div></article>`);
					});
					_push(`<!--]--></div></section>`);
				});
				_push(`<!--]--><span class="sr-only" data-v-2b3fda79>Loading event program...</span></div>`);
			} else if (unref(error)) _push(`<div class="mt-10 rounded-3xl border border-red-400/30 bg-red-950/30 p-6 text-red-100" data-v-2b3fda79>The event schedule could not be loaded.</div>`);
			else if (!unref(groupedSessions).length) _push(`<div class="mt-10 rounded-3xl border border-white/10 bg-white/5 p-6 text-slate-200" data-v-2b3fda79>No program sessions have been published yet.</div>`);
			else {
				_push(`<div class="mt-10 space-y-10" data-v-2b3fda79><!--[-->`);
				ssrRenderList(unref(groupedSessions), (day, dayIndex) => {
					_push(`<section class="day-block" data-v-2b3fda79><div class="day-heading" data-v-2b3fda79><span class="day-number" data-v-2b3fda79>Day ${ssrInterpolate(String(dayIndex + 1).padStart(2, "0"))}</span><p data-v-2b3fda79>${ssrInterpolate(day.date)}</p></div><div class="mt-5 space-y-4" data-v-2b3fda79><!--[-->`);
					ssrRenderList(day.items, (session) => {
						_push(`<article class="session-card grid gap-5 rounded-3xl p-4 sm:grid-cols-[170px_1fr] sm:p-7" data-v-2b3fda79><div class="session-time" data-v-2b3fda79><p class="font-mono text-sm font-semibold text-[#e6c477]" data-v-2b3fda79>${ssrInterpolate(formatTime(session.start_at))} – ${ssrInterpolate(formatTime(session.end_at))}</p><p class="mt-2 text-xs uppercase tracking-[.18em] text-[#8f9eb1]" data-v-2b3fda79>${ssrInterpolate(session.room_name)}</p></div><div data-v-2b3fda79><p class="text-xs font-bold uppercase tracking-[.2em] text-[#d8ac59]" data-v-2b3fda79>${ssrInterpolate(label(session.session_type))}</p><h2 class="mt-2 text-xl font-bold text-[#f8f6f1]" data-v-2b3fda79>${ssrInterpolate(session.title)}</h2><p class="mt-2 text-sm leading-7 text-[#cbd2dc]" data-v-2b3fda79>${ssrInterpolate(session.description)}</p></div></article>`);
					});
					_push(`<!--]--></div></section>`);
				});
				_push(`<!--]--></div>`);
			}
			_push(`</section></main>`);
		};
	}
});
//#endregion
//#region app/pages/program/index.vue
var _sfc_setup = index_vue_vue_type_script_setup_true_lang_default.setup;
index_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/program/index.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var program_default = /*#__PURE__*/ _plugin_vue_export_helper_default(index_vue_vue_type_script_setup_true_lang_default, [["__scopeId", "data-v-2b3fda79"]]);

export { program_default as default };
//# sourceMappingURL=program-DvU5gB2f.mjs.map
