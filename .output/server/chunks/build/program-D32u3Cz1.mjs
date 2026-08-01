globalThis.__timing__.logStart('Load chunks/build/program-D32u3Cz1');import { a as useSeoMeta$1, b as useAsyncData } from '../virtual/entry.mjs';
import { u as useEvent } from './useEvent-Cd-tMHNN.mjs';
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
			title: "Program | ASEAN AI for Education Summit 2026",
			description: "Live two-day event schedule loaded from the ASEAN AI Event Portal API."
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
			_push(`<section${ssrRenderAttrs(mergeProps({ class: "mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8" }, _attrs))}><p class="text-sm uppercase tracking-[.35em] text-cyan-200">Live Event Program</p><h1 class="mt-4 max-w-4xl text-5xl font-black">Two days from inspiration to working prototypes.</h1><p class="mt-5 text-lg text-slate-300">18–19 November 2026 · Jakarta Convention Center</p>`);
			if (unref(pending)) {
				_push(`<div class="mt-10 space-y-4"><!--[-->`);
				ssrRenderList(6, (n) => {
					_push(`<div class="h-28 animate-pulse rounded-3xl bg-white/5"></div>`);
				});
				_push(`<!--]--></div>`);
			} else if (unref(error)) _push(`<div class="mt-10 rounded-3xl border border-red-400/30 bg-red-950/30 p-6 text-red-100">The event schedule could not be loaded.</div>`);
			else {
				_push(`<div class="mt-10 space-y-10"><!--[-->`);
				ssrRenderList(unref(groupedSessions), (day) => {
					_push(`<section><p class="text-xs uppercase tracking-[.3em] text-orange-200">${ssrInterpolate(day.date)}</p><div class="mt-5 space-y-4"><!--[-->`);
					ssrRenderList(day.items, (session) => {
						_push(`<article class="glass-card grid gap-4 rounded-3xl p-6 sm:grid-cols-[160px_1fr]"><div><p class="font-mono text-sm text-cyan-200">${ssrInterpolate(formatTime(session.start_at))}–${ssrInterpolate(formatTime(session.end_at))}</p><p class="mt-2 text-xs uppercase tracking-[.2em] text-slate-500">${ssrInterpolate(session.room_name)}</p></div><div><p class="text-xs uppercase tracking-[.2em] text-orange-100">${ssrInterpolate(label(session.session_type))}</p><h2 class="mt-2 text-xl font-bold">${ssrInterpolate(session.title)}</h2><p class="mt-2 text-sm leading-7 text-slate-300">${ssrInterpolate(session.description)}</p></div></article>`);
					});
					_push(`<!--]--></div></section>`);
				});
				_push(`<!--]--></div>`);
			}
			_push(`</section>`);
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
var program_default = index_vue_vue_type_script_setup_true_lang_default;

export { program_default as default };;globalThis.__timing__.logEnd('Load chunks/build/program-D32u3Cz1');
//# sourceMappingURL=program-D32u3Cz1.mjs.map
