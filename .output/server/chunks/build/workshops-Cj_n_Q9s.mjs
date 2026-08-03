globalThis.__timing__.logStart('Load chunks/build/workshops-Cj_n_Q9s');import { a as useSeoMeta$1, b as useAsyncData } from '../virtual/entry.mjs';
import { u as useEvent } from './useEvent-Cd-tMHNN.mjs';
import { defineComponent, withAsyncContext, computed, mergeProps, unref, useSSRContext } from 'vue';
import { p as publicAssetsURL } from '../routes/renderer.mjs';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderList, ssrRenderAttr } from 'vue/server-renderer';
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
import '@vue/shared';
import 'unhead/plugins';
import 'unhead/utils';
import 'unhead/server';
import 'unhead/legacy';
import 'vue-bundle-renderer/runtime';
import 'devalue';

//#region \0virtual:public?%2Ffoto%2Fai_VR.png
var _virtual_public__2Ffoto_2Fai_VR_default = publicAssetsURL("/foto/ai_VR.png");
//#endregion
//#region app/pages/workshops/index.vue?vue&type=script&setup=true&lang.ts
var index_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "index",
	__ssrInlineRender: true,
	async setup(__props) {
		let __temp, __restore;
		useSeoMeta$1({
			title: "Workshop Tracks | ASEAN AI for Education",
			description: "Five hands-on AI workshop tracks for ASEAN education."
		});
		const { getEvents, getEventWorkshopTracks } = useEvent();
		const { data: response, pending, error } = ([__temp, __restore] = withAsyncContext(async () => useAsyncData("public-workshop-tracks", async () => {
			const event = (await getEvents(1, 1)).data[0];
			if (!event?.slug) throw new Error("Event not found");
			return getEventWorkshopTracks(event.slug);
		})), __temp = await __temp, __restore(), __temp);
		const tracks = computed(() => response.value?.data ?? []);
		const requestId = computed(() => response.value?.request_id);
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<section${ssrRenderAttrs(mergeProps({ class: "mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8" }, _attrs))}><p class="text-sm uppercase tracking-[0.35em] text-cyan-200">${ssrInterpolate(unref(tracks).length)} Workshop Tracks</p><h1 class="mt-4 max-w-4xl text-5xl font-black">Build a working prototype for a real educational challenge.</h1><p class="mt-5 max-w-3xl text-lg leading-8 text-slate-300">Choose a multidisciplinary track, work with technical mentors, and present a responsible AI solution designed for ASEAN learners and institutions.</p>`);
			if (unref(pending)) {
				_push(`<div class="mt-10 grid gap-5 md:grid-cols-2"><!--[-->`);
				ssrRenderList(4, (n) => {
					_push(`<div class="h-52 animate-pulse rounded-[2rem] bg-white/5"></div>`);
				});
				_push(`<!--]--></div>`);
			} else if (unref(error)) _push(`<div class="mt-10 rounded-3xl border border-red-400/30 bg-red-950/30 p-6 text-red-100">Workshop tracks could not be loaded. Reference: ${ssrInterpolate(unref(requestId) || "unavailable")}</div>`);
			else {
				_push(`<div class="mt-10 grid gap-5 md:grid-cols-2"><!--[-->`);
				ssrRenderList(unref(tracks), (track) => {
					_push(`<article class="glass-card rounded-[2rem] p-7"><span class="text-xs uppercase tracking-[0.25em] text-orange-200">Track ${ssrInterpolate(track.order_index)} · Capacity ${ssrInterpolate(track.capacity)}</span><h2 class="mt-3 text-2xl font-bold">${ssrInterpolate(track.name)}</h2><p class="mt-3 leading-7 text-slate-300">${ssrInterpolate(track.description)}</p></article>`);
				});
				_push(`<!--]--></div>`);
			}
			_push(`<img${ssrRenderAttr("src", _virtual_public__2Ffoto_2Fai_VR_default)} alt="Hands-on AI technology workshop" class="mt-8 h-80 w-full rounded-[2rem] object-cover"></section>`);
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

export { workshops_default as default };;globalThis.__timing__.logEnd('Load chunks/build/workshops-Cj_n_Q9s');
//# sourceMappingURL=workshops-Cj_n_Q9s.mjs.map
