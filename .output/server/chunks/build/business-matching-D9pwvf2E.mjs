globalThis.__timing__.logStart('Load chunks/build/business-matching-D9pwvf2E');import { a as useSeoMeta$1, N as NuxtLink } from '../virtual/entry.mjs';
import { defineComponent, mergeProps, withCtx, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderList, ssrInterpolate, ssrRenderComponent } from 'vue/server-renderer';
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

//#region app/pages/business-matching.vue?vue&type=script&setup=true&lang.ts
var business_matching_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "business-matching",
	__ssrInlineRender: true,
	setup(__props) {
		useSeoMeta$1({
			title: "Business Matching | IWBIF 2026",
			description: "Curated cross-border business matching for IWBIF 2026 delegates."
		});
		const sectors = [
			"Creative Economy",
			"Healthcare & Wellness",
			"Food & Beverage",
			"Fashion & Style",
			"Industrial Estate",
			"Cross-sector Opportunities"
		];
		return (_ctx, _push, _parent, _attrs) => {
			const _component_NuxtLink = NuxtLink;
			_push(`<section${ssrRenderAttrs(mergeProps({ class: "mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8" }, _attrs))}><p class="text-sm uppercase tracking-[.35em] text-amber-200">Business Matching</p><h1 class="mt-4 text-5xl font-black">Connect. Match. Make Deals.</h1><p class="mt-5 max-w-3xl text-lg leading-8 text-slate-300">A curated process connecting buyers, sellers, investors, distributors, suppliers, and strategic partners with relevant international opportunities.</p><div class="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3"><!--[-->`);
			ssrRenderList(sectors, (sector) => {
				_push(`<article class="glass-card rounded-3xl p-6"><h2 class="text-xl font-bold">${ssrInterpolate(sector)}</h2><p class="mt-3 text-sm leading-7 text-slate-400">Targeted discovery and meeting opportunities for delegates in this sector.</p></article>`);
			});
			_push(`<!--]--></div><div class="mt-10 glass-card rounded-[2rem] p-8"><h2 class="text-3xl font-black">Prepare your business profile</h2><p class="mt-4 max-w-3xl leading-7 text-slate-300">Confirmed delegates can add company information, products or services, business objectives, target markets, and preferred meeting categories from their dashboard.</p>`);
			_push(ssrRenderComponent(_component_NuxtLink, {
				to: "/register",
				class: "mt-6 inline-flex rounded-full bg-amber-300 px-6 py-3 font-semibold text-slate-950"
			}, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`Register as a Delegate`);
					else return [createTextVNode("Register as a Delegate")];
				}),
				_: 1
			}, _parent));
			_push(`</div></section>`);
		};
	}
});
//#endregion
//#region app/pages/business-matching.vue
var _sfc_setup = business_matching_vue_vue_type_script_setup_true_lang_default.setup;
business_matching_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/business-matching.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var business_matching_default = business_matching_vue_vue_type_script_setup_true_lang_default;

export { business_matching_default as default };;globalThis.__timing__.logEnd('Load chunks/build/business-matching-D9pwvf2E');
//# sourceMappingURL=business-matching-D9pwvf2E.mjs.map
