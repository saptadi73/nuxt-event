globalThis.__timing__.logStart('Load chunks/build/about-BrjDz6OT');import { a as useSeoMeta$1 } from '../virtual/entry.mjs';
import { defineComponent, mergeProps, useSSRContext } from 'vue';
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

//#region app/pages/about.vue?vue&type=script&setup=true&lang.ts
var about_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "about",
	__ssrInlineRender: true,
	setup(__props) {
		useSeoMeta$1({
			title: "About | IWBIF 2026",
			description: "Vision, mission, and purpose of the International Women Business & Investment Forum 2026."
		});
		const mission = [
			{
				title: "Connect",
				text: "Connect entrepreneurs, buyers, investors, and ecosystem leaders across regions."
			},
			{
				title: "Collaborate",
				text: "Develop solutions for market entry, access to capital, and procurement opportunities."
			},
			{
				title: "Create",
				text: "Deliver tangible business deals, qualified leads, and partnership commitments."
			}
		];
		const why = [
			{
				title: "A market of significant scale",
				text: "A domestic market of more than 283 million people with strong regional relevance."
			},
			{
				title: "Gateway for collaboration",
				text: "A strategic location connecting ASEAN and broader Asian markets."
			},
			{
				title: "Global convening power",
				text: "A G20 economy suited to public-private dialogue and practical deal-making."
			},
			{
				title: "Business and diplomacy",
				text: "Corporations, investors, embassies, and decision-makers meet in one city."
			}
		];
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<section${ssrRenderAttrs(mergeProps({ class: "mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8" }, _attrs))}><p class="text-sm uppercase tracking-[.35em] text-amber-200">About IWBIF 2026</p><h1 class="mt-4 max-w-5xl text-5xl font-black leading-tight">A trusted platform for women-led cross-border growth</h1><div class="mt-10 grid gap-6 lg:grid-cols-2"><div class="glass-card rounded-[2rem] p-7 text-slate-300"><p class="text-lg leading-8">The International Women Business &amp; Investment Forum 2026 brings women entrepreneurs from diverse countries into a curated collaboration ecosystem, supported by engagement with the Government of Indonesia, embassies, and international partners.</p><p class="mt-5 leading-7">High-level forums, business and investment matching, international exhibitions, and a Youth Womenpreneur track help MSMEs explore transparent, inclusive, and sustainable trade and investment opportunities.</p></div><div class="glass-card rounded-[2rem] p-7"><p class="text-xs uppercase tracking-[.25em] text-amber-200">Our vision</p><p class="mt-4 text-2xl font-bold">Position Indonesia—through IWAPI—as a regional hub where women-led businesses build bridges, unlock investments, and accelerate cross-border partnerships.</p></div></div><div class="mt-8 grid gap-4 md:grid-cols-3"><!--[-->`);
			ssrRenderList(mission, (item) => {
				_push(`<article class="glass-card rounded-3xl p-6"><h2 class="text-2xl font-bold text-amber-100">${ssrInterpolate(item.title)}</h2><p class="mt-3 leading-7 text-slate-300">${ssrInterpolate(item.text)}</p></article>`);
			});
			_push(`<!--]--></div><h2 class="mt-14 text-3xl font-black">Why Indonesia?</h2><div class="mt-6 grid gap-4 md:grid-cols-2"><!--[-->`);
			ssrRenderList(why, (item) => {
				_push(`<article class="glass-card rounded-3xl p-6"><h3 class="text-xl font-bold">${ssrInterpolate(item.title)}</h3><p class="mt-3 leading-7 text-slate-300">${ssrInterpolate(item.text)}</p></article>`);
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

export { about_default as default };;globalThis.__timing__.logEnd('Load chunks/build/about-BrjDz6OT');
//# sourceMappingURL=about-BrjDz6OT.mjs.map
