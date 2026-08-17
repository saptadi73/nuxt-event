import { _ as _plugin_vue_export_helper_default, a as useSeoMeta$1, N as NuxtLink } from '../virtual/entry.mjs';
import { defineComponent, mergeProps, withCtx, createTextVNode, createVNode, useSSRContext } from 'vue';
import { p as publicAssetsURL } from '../routes/renderer.mjs';
import { ssrRenderAttrs, ssrRenderAttr, ssrRenderComponent, ssrRenderList, ssrInterpolate } from 'vue/server-renderer';
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

//#region \0virtual:public?%2Fimages%2Fbusiness-matching.png
var _virtual_public__2Fimages_2Fbusiness_matching_default = publicAssetsURL("/images/business-matching.png");
//#endregion
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
			_push(`<main${ssrRenderAttrs(mergeProps({ class: "business-page" }, _attrs))} data-v-e13253eb><section class="mx-auto max-w-7xl px-3 pb-14 pt-6 sm:px-6 sm:pt-12 lg:px-8" data-v-e13253eb><div class="business-hero" data-v-e13253eb><img${ssrRenderAttr("src", _virtual_public__2Fimages_2Fbusiness_matching_default)} alt="Women business leaders meeting and building international partnerships" class="business-hero__image" data-v-e13253eb><div class="business-hero__shade" aria-hidden="true" data-v-e13253eb></div><div class="business-hero__content" data-v-e13253eb><p class="text-xs font-semibold uppercase tracking-[.35em] text-[#f1d58f] sm:text-sm" data-v-e13253eb>Business Matching</p><h1 class="mt-4 max-w-3xl text-4xl font-black leading-[1.02] text-white sm:text-5xl lg:text-7xl" data-v-e13253eb>Connect. Match.<br data-v-e13253eb>Make Deals.</h1><p class="mt-5 max-w-xl text-sm leading-7 text-white/80 sm:text-base lg:text-lg" data-v-e13253eb>A curated process connecting buyers, sellers, investors, distributors, suppliers, and strategic partners with relevant international opportunities.</p>`);
			_push(ssrRenderComponent(_component_NuxtLink, {
				to: "/register/delegate",
				class: "business-hero__action"
			}, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`Join Business Matching <span aria-hidden="true" data-v-e13253eb${_scopeId}>→</span>`);
					else return [createTextVNode("Join Business Matching "), createVNode("span", { "aria-hidden": "true" }, "→")];
				}),
				_: 1
			}, _parent));
			_push(`</div><div class="business-hero__label" data-v-e13253eb><span data-v-e13253eb>Jakarta</span><span class="h-1 w-1 rounded-full bg-[#d8ac59]" data-v-e13253eb></span><span data-v-e13253eb>15–16 October 2026</span></div></div><div class="mt-16 text-center" data-v-e13253eb><p class="text-xs font-semibold uppercase tracking-[.32em] text-[#d8ac59]" data-v-e13253eb>Six opportunity sectors</p><h2 class="mx-auto mt-4 max-w-3xl text-3xl font-black text-white sm:text-4xl" data-v-e13253eb>Meet the right partners for your next move.</h2></div><div class="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-3" data-v-e13253eb><!--[-->`);
			ssrRenderList(sectors, (sector, index) => {
				_push(`<article class="sector-card" data-v-e13253eb><span class="sector-card__number" data-v-e13253eb>0${ssrInterpolate(index + 1)}</span><h3 class="mt-8 text-xl font-bold text-white" data-v-e13253eb>${ssrInterpolate(sector)}</h3><p class="mt-3 text-sm leading-7 text-slate-400" data-v-e13253eb>Targeted discovery and meeting opportunities for delegates in this sector.</p></article>`);
			});
			_push(`<!--]--></div><section class="profile-callout" data-v-e13253eb><div data-v-e13253eb><p class="text-xs font-semibold uppercase tracking-[.3em] text-[#d8ac59]" data-v-e13253eb>Get match-ready</p><h2 class="mt-3 text-3xl font-black text-white sm:text-4xl" data-v-e13253eb>Prepare your business profile</h2><p class="mt-4 max-w-3xl leading-7 text-slate-300" data-v-e13253eb>Confirmed delegates can add company information, products or services, business objectives, target markets, and preferred meeting categories from their dashboard.</p></div>`);
			_push(ssrRenderComponent(_component_NuxtLink, {
				to: "/register/delegate",
				class: "profile-callout__action"
			}, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`Register as a Delegate`);
					else return [createTextVNode("Register as a Delegate")];
				}),
				_: 1
			}, _parent));
			_push(`</section></section></main>`);
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
var business_matching_default = /*#__PURE__*/ _plugin_vue_export_helper_default(business_matching_vue_vue_type_script_setup_true_lang_default, [["__scopeId", "data-v-e13253eb"]]);

export { business_matching_default as default };
//# sourceMappingURL=business-matching-Ght-N6hz.mjs.map
