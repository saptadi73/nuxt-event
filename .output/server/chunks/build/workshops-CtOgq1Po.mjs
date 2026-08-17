globalThis.__timing__.logStart('Load chunks/build/workshops-CtOgq1Po');import { c as useSeoMeta$1, f as useAsyncData } from '../virtual/entry.mjs';
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

//#region app/pages/workshops/index.vue?vue&type=script&setup=true&lang.ts
var index_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "index",
	__ssrInlineRender: true,
	async setup(__props) {
		let __temp, __restore;
		useSeoMeta$1({ title: "Activities | IWBIF 2026" });
		const { getEvents, getEventActivities } = useEvent();
		const { data: response, pending, error } = ([__temp, __restore] = withAsyncContext(async () => useAsyncData("iwbif-activities", async () => {
			const event = (await getEvents(1, 1)).data[0];
			if (!event) throw new Error("No IWBIF event is currently published.");
			return getEventActivities(event.id);
		})), __temp = await __temp, __restore(), __temp);
		const activities = computed(() => response.value?.data.filter((item) => item.is_active !== false) ?? []);
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<section${ssrRenderAttrs(mergeProps({ class: "mx-auto max-w-7xl px-3 py-10 sm:px-6 lg:px-8" }, _attrs))}><p class="text-sm uppercase tracking-[.35em] text-amber-200">Delegate Activities</p><h1 class="mt-4 max-w-4xl text-3xl font-black sm:text-5xl">Build your IWBIF experience.</h1><p class="mt-5 max-w-3xl text-sm leading-7 text-slate-300 sm:text-lg sm:leading-8">Select from the forum, business matching, exhibition, networking, and industrial visit activities published by the organizer.</p>`);
			if (unref(pending)) {
				_push(`<div class="mt-10 grid gap-5 md:grid-cols-2"><!--[-->`);
				ssrRenderList(4, (n) => {
					_push(`<div class="h-40 animate-pulse rounded-[2rem] bg-white/5"></div>`);
				});
				_push(`<!--]--></div>`);
			} else if (unref(error)) _push(`<div class="mt-10 rounded-3xl border border-red-400/30 bg-red-950/30 p-6 text-red-100">${ssrInterpolate(unref(error).message)}</div>`);
			else if (!unref(activities).length) _push(`<div class="mt-10 rounded-3xl border border-white/10 bg-white/5 p-6 text-slate-300">Activities will be published soon.</div>`);
			else {
				_push(`<div class="mt-10 grid gap-5 md:grid-cols-2"><!--[-->`);
				ssrRenderList(unref(activities), (item) => {
					_push(`<article class="glass-card rounded-[2rem] p-5 sm:p-7"><h2 class="text-xl font-bold sm:text-2xl">${ssrInterpolate(item.name)}</h2>`);
					if (item.description) _push(`<p class="mt-3 text-sm leading-7 text-slate-300 sm:text-base">${ssrInterpolate(item.description)}</p>`);
					else _push(`<!---->`);
					_push(`</article>`);
				});
				_push(`<!--]--></div>`);
			}
			_push(`</section>`);
		};
	}
});
//#endregion
//#region app/pages/workshops/index.vue
var _sfc_setup = index_vue_vue_type_script_setup_true_lang_default.setup;
index_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/workshops/index.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var workshops_default = index_vue_vue_type_script_setup_true_lang_default;

export { workshops_default as default };;globalThis.__timing__.logEnd('Load chunks/build/workshops-CtOgq1Po');
//# sourceMappingURL=workshops-CtOgq1Po.mjs.map
