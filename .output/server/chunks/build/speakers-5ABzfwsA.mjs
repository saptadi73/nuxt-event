globalThis.__timing__.logStart('Load chunks/build/speakers-5ABzfwsA');import { c as useNuxtApp, b as useAsyncData } from '../virtual/entry.mjs';
import { u as useMediaUrl } from './useMediaUrl-CtPklTwb.mjs';
import { defineComponent, ref, withAsyncContext, computed, mergeProps, unref, useSSRContext } from 'vue';
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
import '../routes/renderer.mjs';
import 'unhead/server';
import 'unhead/legacy';
import 'unhead/plugins';
import 'vue-bundle-renderer/runtime';
import 'devalue';
import '@vue/shared';
import 'unhead/utils';

//#region app/pages/speakers/index.vue?vue&type=script&setup=true&lang.ts
var index_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "index",
	__ssrInlineRender: true,
	async setup(__props) {
		let __temp, __restore;
		const api = useNuxtApp().$api;
		const { mediaUrl } = useMediaUrl();
		const unavailablePhotos = ref(/* @__PURE__ */ new Set());
		const initials = (name) => name.split(" ").map((part) => part[0]).slice(0, 2).join("").toUpperCase();
		const page = ref(1);
		const size = ref(12);
		const { data: response, pending: loading } = ([__temp, __restore] = withAsyncContext(() => useAsyncData(`speakers-${page.value}-${size.value}`, () => api(`/speakers?page=${page.value}&size=${size.value}`))), __temp = await __temp, __restore(), __temp);
		const items = computed(() => response.value?.data ?? []);
		const examples = [
			{
				id: "maya-santoso",
				full_name: "Dr. Maya Santoso",
				professional_title: "AI Education Researcher",
				organization_name: "Indonesia",
				country_code: "IDN",
				biography: "Education technology researcher specializing in artificial intelligence, personalized learning, and responsible use of student data.",
				session_title: "Building Inclusive AI Learning Systems for Southeast Asia"
			},
			{
				id: "nguyen-minh-quang",
				full_name: "Nguyen Minh Quang",
				professional_title: "Principal Machine Learning Engineer",
				organization_name: "Vietnam",
				country_code: "VNM",
				biography: "Machine learning engineer experienced in large language models, retrieval systems, natural language processing, and scalable AI infrastructure.",
				session_title: "Scaling Generative AI Platforms for Education"
			},
			{
				id: "sarah-lim",
				full_name: "Sarah Lim",
				professional_title: "Founder and CEO",
				organization_name: "LearnAI Labs · Singapore",
				country_code: "SGP",
				biography: "Education technology entrepreneur focused on transforming AI prototypes into sustainable and scalable learning platforms.",
				session_title: "From AI Prototype to Sustainable Education Startup"
			},
			{
				id: "arun-prasert",
				full_name: "Arun Prasert",
				professional_title: "Open-Source AI Advocate",
				organization_name: "Thailand",
				country_code: "THA",
				biography: "Open-source contributor supporting affordable technology solutions for education and regional developer communities.",
				session_title: "Building Open and Multilingual AI for ASEAN Learners"
			},
			{
				id: "maria-santos",
				full_name: "Maria Gabriela Santos",
				professional_title: "Education Technology Specialist",
				organization_name: "Philippines",
				country_code: "PHL",
				biography: "Works with teachers, schools, and education organizations to design technology supporting classroom learning and teacher productivity.",
				session_title: "Human-Centered AI for Teachers and Students"
			}
		];
		const displayItems = computed(() => items.value.length ? items.value : examples);
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<section${ssrRenderAttrs(mergeProps({ class: "mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8" }, _attrs))}><p class="text-sm uppercase tracking-[0.3em] text-cyan-200/70">Speakers</p><div class="mt-3 flex items-end justify-between gap-4"><h1 class="text-4xl font-black text-white">Featured speakers at the event</h1><span class="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.25em] text-slate-200">${ssrInterpolate(unref(loading) ? "Loading..." : `${unref(displayItems).length} speakers`)}</span></div>`);
			if (unref(loading)) {
				_push(`<div class="mt-8 grid gap-4 md:grid-cols-3"><!--[-->`);
				ssrRenderList(6, (item) => {
					_push(`<div class="h-48 animate-pulse rounded-[1.75rem] bg-white/5"></div>`);
				});
				_push(`<!--]--></div>`);
			} else {
				_push(`<div class="mt-8 grid gap-4 md:grid-cols-3"><!--[-->`);
				ssrRenderList(unref(displayItems), (speaker) => {
					_push(`<article class="rounded-[1.75rem] border border-white/10 bg-white/5 p-5">`);
					if (speaker.profile_photo_url && !unref(unavailablePhotos).has(speaker.id)) _push(`<img${ssrRenderAttr("src", unref(mediaUrl)(speaker.profile_photo_url))}${ssrRenderAttr("alt", speaker.full_name)} class="mb-5 h-20 w-20 rounded-2xl object-cover">`);
					else _push(`<div class="mb-5 flex h-20 w-20 items-center justify-center rounded-2xl bg-cyan-300/10 text-xl font-bold text-cyan-200">${ssrInterpolate(initials(speaker.full_name))}</div>`);
					_push(`<p class="text-xs uppercase tracking-[0.25em] text-slate-400">${ssrInterpolate(speaker.country_code || "UNSPEC")}</p><h2 class="mt-3 text-xl font-semibold text-white">${ssrInterpolate(speaker.full_name)}</h2><p class="mt-1 text-sm text-cyan-200/90">${ssrInterpolate(speaker.professional_title || "Speaker")}</p><p class="mt-4 text-sm text-slate-300">${ssrInterpolate(speaker.organization_name || "-")}</p><p class="mt-3 text-sm leading-7 text-slate-300">${ssrInterpolate(speaker.biography)}</p>`);
					if (speaker.expertise_tags?.length) {
						_push(`<div class="mt-4 flex flex-wrap gap-2"><!--[-->`);
						ssrRenderList(speaker.expertise_tags, (tag) => {
							_push(`<span class="rounded-full bg-white/5 px-3 py-1 text-xs text-slate-300">${ssrInterpolate(tag)}</span>`);
						});
						_push(`<!--]--></div>`);
					} else _push(`<!---->`);
					if (speaker.session_title) _push(`<p class="mt-4 border-t border-white/10 pt-4 text-sm text-orange-100"><strong>Session:</strong> ${ssrInterpolate(speaker.session_title)}</p>`);
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
//#region app/pages/speakers/index.vue
var _sfc_setup = index_vue_vue_type_script_setup_true_lang_default.setup;
index_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/speakers/index.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var speakers_default = index_vue_vue_type_script_setup_true_lang_default;

export { speakers_default as default };;globalThis.__timing__.logEnd('Load chunks/build/speakers-5ABzfwsA');
//# sourceMappingURL=speakers-5ABzfwsA.mjs.map
