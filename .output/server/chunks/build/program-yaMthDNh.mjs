globalThis.__timing__.logStart('Load chunks/build/program-yaMthDNh');import { a as useSeoMeta$1, b as useAsyncData } from '../virtual/entry.mjs';
import { _ as _plugin_vue_export_helper_default } from './_plugin-vue_export-helper-BOaGB7Aw.mjs';
import { u as useEvent } from './useEvent-D4WcF23a.mjs';
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
import 'vue-router';
import '../routes/renderer.mjs';
import 'unhead/server';
import 'unhead/legacy';
import 'unhead/plugins';
import 'vue-bundle-renderer/runtime';
import 'devalue';
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
		const { getEvents, getEventSessions } = useEvent();
		const { data: response, pending, error } = ([__temp, __restore] = withAsyncContext(async () => useAsyncData("public-event-sessions", async () => {
			const event = (await getEvents(1, 1)).data[0];
			if (!event?.slug) throw new Error("Event not found");
			return getEventSessions(event.slug);
		})), __temp = await __temp, __restore(), __temp);
		const sessions = computed(() => response.value?.data ?? []);
		const groupedSessions = computed(() => {
			const groups = /* @__PURE__ */ new Map();
			for (const item of sessions.value) {
				const date = new Intl.DateTimeFormat("en-GB", {
					weekday: "long",
					day: "numeric",
					month: "long",
					year: "numeric",
					timeZone: "Asia/Jakarta"
				}).format(new Date(item.start_at));
				groups.set(date, [...groups.get(date) ?? [], item]);
			}
			return [...groups].map(([date, items]) => ({
				date,
				items
			}));
		});
		const formatTime = (iso) => new Intl.DateTimeFormat("en-GB", {
			hour: "2-digit",
			minute: "2-digit",
			hour12: false,
			timeZone: "Asia/Jakarta"
		}).format(new Date(iso));
		const label = (value) => (value ?? "session").replaceAll("_", " ");
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<main${ssrRenderAttrs(mergeProps({ class: "program-page overflow-hidden" }, _attrs))} data-v-e890d940><section class="relative mx-auto max-w-7xl px-4 pb-20 pt-14 sm:px-6 sm:pt-20 lg:px-8" data-v-e890d940><div class="program-glow" aria-hidden="true" data-v-e890d940></div><div class="relative max-w-5xl" data-v-e890d940><p class="program-eyebrow" data-v-e890d940>Live Event Program</p><h1 class="mt-5 text-4xl font-black leading-[1.08] text-[#f8f6f1] sm:text-5xl lg:text-6xl" data-v-e890d940>Four days from meaningful insight to <span class="text-[#e6c477]" data-v-e890d940>deal execution.</span></h1><div class="mt-8 flex flex-wrap gap-3" data-v-e890d940><span class="program-meta" data-v-e890d940>14–17 October 2026</span><span class="program-meta" data-v-e890d940>Hotel Kempinski Indonesia</span><span class="program-meta" data-v-e890d940>Jakarta, Indonesia</span></div><p class="mt-6 max-w-3xl text-sm leading-7 text-[#aeb9c8]" data-v-e890d940>Sessions are delivered by forum leaders and updated from the official event operations source. Prepare your business materials early for every matching window.</p></div>`);
			if (unref(pending)) {
				_push(`<div class="mt-10 space-y-4" data-v-e890d940><!--[-->`);
				ssrRenderList(6, (n) => {
					_push(`<div class="h-28 animate-pulse rounded-3xl border border-white/10 bg-white/5" data-v-e890d940></div>`);
				});
				_push(`<!--]--></div>`);
			} else if (unref(error)) _push(`<div class="mt-10 rounded-3xl border border-red-400/30 bg-red-950/30 p-6 text-red-100" data-v-e890d940>The event schedule could not be loaded.</div>`);
			else {
				_push(`<div class="mt-10 space-y-10" data-v-e890d940><!--[-->`);
				ssrRenderList(unref(groupedSessions), (day, dayIndex) => {
					_push(`<section class="day-block" data-v-e890d940><div class="day-heading" data-v-e890d940><span class="day-number" data-v-e890d940>Day ${ssrInterpolate(String(dayIndex + 1).padStart(2, "0"))}</span><p data-v-e890d940>${ssrInterpolate(day.date)}</p></div><div class="mt-5 space-y-4" data-v-e890d940><!--[-->`);
					ssrRenderList(day.items, (session) => {
						_push(`<article class="session-card grid gap-5 rounded-3xl p-6 sm:grid-cols-[170px_1fr] sm:p-7" data-v-e890d940><div class="session-time" data-v-e890d940><p class="font-mono text-sm font-semibold text-[#e6c477]" data-v-e890d940>${ssrInterpolate(formatTime(session.start_at))} – ${ssrInterpolate(formatTime(session.end_at))}</p><p class="mt-2 text-xs uppercase tracking-[.18em] text-[#8f9eb1]" data-v-e890d940>${ssrInterpolate(session.room_name)}</p></div><div data-v-e890d940><p class="text-xs font-bold uppercase tracking-[.2em] text-[#d8ac59]" data-v-e890d940>${ssrInterpolate(label(session.session_type))}</p><h2 class="mt-2 text-xl font-bold text-[#f8f6f1]" data-v-e890d940>${ssrInterpolate(session.title)}</h2><p class="mt-2 text-sm leading-7 text-[#cbd2dc]" data-v-e890d940>${ssrInterpolate(session.description)}</p></div></article>`);
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
var program_default = /*#__PURE__*/ _plugin_vue_export_helper_default(index_vue_vue_type_script_setup_true_lang_default, [["__scopeId", "data-v-e890d940"]]);

export { program_default as default };;globalThis.__timing__.logEnd('Load chunks/build/program-yaMthDNh');
//# sourceMappingURL=program-yaMthDNh.mjs.map
