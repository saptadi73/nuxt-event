globalThis.__timing__.logStart('Load chunks/build/partners-ryY_NLra');import { a as useSeoMeta$1 } from '../virtual/entry.mjs';
import { defineComponent, mergeProps, useSSRContext } from 'vue';
import { p as publicAssetsURL } from '../routes/renderer.mjs';
import { ssrRenderAttrs, ssrRenderList, ssrInterpolate, ssrRenderAttr } from 'vue/server-renderer';
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

//#region \0virtual:public?%2Ffoto%2Fpameran.png
var _virtual_public__2Ffoto_2Fpameran_default = publicAssetsURL("/foto/pameran.png");
//#endregion
//#region app/pages/partners.vue?vue&type=script&setup=true&lang.ts
var partners_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "partners",
	__ssrInlineRender: true,
	setup(__props) {
		useSeoMeta$1({
			title: "Partners | ASEAN AI for Education",
			description: "Partnership opportunities for the ASEAN AI for Education Summit 2026."
		});
		const items = [
			{
				label: "Institutional",
				title: "Strategic Partner",
				text: "For institutions seeking significant event involvement and long-term ASEAN collaboration.",
				benefits: "Premium visibility · keynote opportunity · executive roundtable · exhibition space"
			},
			{
				label: "Infrastructure",
				title: "Technology Partner",
				text: "For cloud, AI platform, software, developer tool, and infrastructure companies.",
				benefits: "Product demonstration · technical workshop · developer challenge · booth"
			},
			{
				label: "Academic",
				title: "Education Partner",
				text: "For universities, schools, training institutions, education networks, and researchers.",
				benefits: "Participant delegation · challenge submission · research presentation"
			},
			{
				label: "Ecosystem",
				title: "Community Partner",
				text: "For developer communities, startup networks, associations, and nonprofit organizations.",
				benefits: "Community recognition · member registration · networking · media collaboration"
			}
		];
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<section${ssrRenderAttrs(mergeProps({ class: "mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8" }, _attrs))}><p class="text-sm uppercase tracking-[0.35em] text-cyan-200">Partners and Sponsors</p><h1 class="mt-4 max-w-4xl text-5xl font-black">Become Part of ASEAN&#39;s AI Education Movement</h1><p class="mt-5 max-w-3xl text-lg leading-8 text-slate-300">Support regional education innovation and connect with a focused audience of developers, engineers, educators, researchers, founders, and institutional leaders.</p><div class="mt-10 grid gap-5 md:grid-cols-2"><!--[-->`);
			ssrRenderList(items, (item) => {
				_push(`<article class="glass-card rounded-[2rem] p-7"><p class="text-xs uppercase tracking-[.25em] text-orange-200">${ssrInterpolate(item.label)}</p><h2 class="mt-4 text-2xl font-bold">${ssrInterpolate(item.title)}</h2><p class="mt-3 leading-7 text-slate-300">${ssrInterpolate(item.text)}</p><p class="mt-5 text-sm text-cyan-200">${ssrInterpolate(item.benefits)}</p></article>`);
			});
			_push(`<!--]--></div><div class="mt-8 grid gap-6 overflow-hidden rounded-[2rem] bg-white/5 p-7 md:grid-cols-2"><img${ssrRenderAttr("src", _virtual_public__2Ffoto_2Fpameran_default)} alt="Partner exhibition at the AI summit" class="h-64 w-full rounded-3xl object-cover"><div class="self-center"><h2 class="text-3xl font-bold">Support the Future of ASEAN Education</h2><p class="mt-3 leading-7 text-slate-300">Help developers, educators, and institutions build responsible AI solutions for millions of learners.</p><a href="mailto:partners@aseanaiedu.com" class="mt-6 inline-flex rounded-full bg-cyan-400 px-6 py-3 font-semibold text-slate-950">Contact Partnership Team</a></div></div></section>`);
		};
	}
});
//#endregion
//#region app/pages/partners.vue
var _sfc_setup = partners_vue_vue_type_script_setup_true_lang_default.setup;
partners_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/partners.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var partners_default = partners_vue_vue_type_script_setup_true_lang_default;

export { partners_default as default };;globalThis.__timing__.logEnd('Load chunks/build/partners-ryY_NLra');
//# sourceMappingURL=partners-ryY_NLra.mjs.map
