globalThis.__timing__.logStart('Load chunks/build/about-Dy4-ABaE');import { a as useSeoMeta$1 } from '../virtual/entry.mjs';
import { _ as _virtual_public__2Ffoto_2Fai_summit2_default } from './_virtual_public-DfQ863O4.mjs';
import { defineComponent, mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderAttr, ssrRenderList, ssrInterpolate } from 'vue/server-renderer';
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

//#region app/pages/about.vue?vue&type=script&setup=true&lang.ts
var about_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "about",
	__ssrInlineRender: true,
	setup(__props) {
		useSeoMeta$1({
			title: "Tentang | ASEAN AI for Education Summit",
			description: "Misi, dampak, dan komunitas ASEAN AI for Education Summit."
		});
		const values = [
			{
				label: "Vision",
				title: "Sustainable Community",
				text: "An ASEAN-wide community improving the quality, accessibility, inclusiveness, and effectiveness of education."
			},
			{
				label: "Mission",
				title: "Practical Prototypes",
				text: "Multidisciplinary teams turn real educational challenges into solutions that can be tested and improved."
			},
			{
				label: "Impact",
				title: "Responsible AI",
				text: "Privacy, transparency, safety, fairness, and student protection remain central to every innovation."
			}
		];
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<section${ssrRenderAttrs(mergeProps({ class: "mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8" }, _attrs))}><p class="text-sm uppercase tracking-[0.35em] text-cyan-200">Tentang Summit</p><h1 class="mt-4 max-w-4xl text-5xl font-black leading-tight">A Regional Movement for AI-Powered Education</h1><div class="mt-10 grid gap-6 lg:grid-cols-2"><img${ssrRenderAttr("src", _virtual_public__2Ffoto_2Fai_summit2_default)} alt="Peserta ASEAN AI Summit berdiskusi" class="h-full min-h-80 rounded-[2rem] object-cover"><div class="glass-card rounded-[2rem] p-7 text-slate-300"><p class="text-lg leading-8">Artificial intelligence is transforming how people learn, teach, collaborate, and access information. Its benefits must be developed responsibly and made accessible across Southeast Asia.</p><p class="mt-5 leading-7">Over two intensive days, participants explore new technologies, identify educational challenges, build working prototypes, exchange knowledge, and establish long-term cross-border partnerships.</p><div class="mt-8 grid gap-4 sm:grid-cols-3"><div><strong class="block text-3xl text-white">10</strong><span class="text-sm">ASEAN Countries</span></div><div><strong class="block text-3xl text-white">20+</strong><span class="text-sm">Speakers</span></div><div><strong class="block text-3xl text-white">300+</strong><span class="text-sm">Participants</span></div></div></div></div><div class="mt-8 grid gap-4 md:grid-cols-3"><!--[-->`);
			ssrRenderList(values, (item) => {
				_push(`<article class="glass-card rounded-3xl p-6"><p class="text-xs uppercase tracking-[0.25em] text-orange-200">${ssrInterpolate(item.label)}</p><h2 class="mt-3 text-2xl font-bold">${ssrInterpolate(item.title)}</h2><p class="mt-3 leading-7 text-slate-300">${ssrInterpolate(item.text)}</p></article>`);
			});
			_push(`<!--]--></div></section>`);
		};
	}
});
//#endregion
//#region app/pages/about.vue
var _sfc_setup = about_vue_vue_type_script_setup_true_lang_default.setup;
about_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/about.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var about_default = about_vue_vue_type_script_setup_true_lang_default;

export { about_default as default };;globalThis.__timing__.logEnd('Load chunks/build/about-Dy4-ABaE');
//# sourceMappingURL=about-Dy4-ABaE.mjs.map
