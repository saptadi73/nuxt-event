globalThis.__timing__.logStart('Load chunks/build/exhibition-ZWCm7GLj');import { a as useSeoMeta$1, N as NuxtLink } from '../virtual/entry.mjs';
import { _ as _plugin_vue_export_helper_default } from './_plugin-vue_export-helper-BOaGB7Aw.mjs';
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

//#region \0virtual:public?%2Fimages%2Fiwbif-exhibition.png
var _virtual_public__2Fimages_2Fiwbif_exhibition_default = publicAssetsURL("/images/iwbif-exhibition.png");
//#endregion
//#region app/pages/exhibition.vue?vue&type=script&setup=true&lang.ts
var exhibition_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "exhibition",
	__ssrInlineRender: true,
	setup(__props) {
		useSeoMeta$1({
			title: "Exhibition | IWBIF 2026",
			description: "Showcase women-led products, services, innovation, and investment opportunities."
		});
		const categories = [
			"Products",
			"Services",
			"MSMEs",
			"Innovation",
			"Digital Businesses",
			"Investment Opportunities"
		];
		return (_ctx, _push, _parent, _attrs) => {
			const _component_NuxtLink = NuxtLink;
			_push(`<main${ssrRenderAttrs(mergeProps({ class: "exhibition-page" }, _attrs))} data-v-0ec8f45b><section class="mx-auto max-w-7xl px-4 pb-14 pt-8 sm:px-6 sm:pt-12 lg:px-8" data-v-0ec8f45b><div class="exhibition-hero" data-v-0ec8f45b><img${ssrRenderAttr("src", _virtual_public__2Fimages_2Fiwbif_exhibition_default)} alt="IWBIF exhibition showcasing women-led businesses and Indonesian products" class="exhibition-hero__image" data-v-0ec8f45b><div class="exhibition-hero__overlay" aria-hidden="true" data-v-0ec8f45b></div><div class="exhibition-hero__content" data-v-0ec8f45b><p class="text-xs font-semibold uppercase tracking-[.35em] text-[#f1d58f] sm:text-sm" data-v-0ec8f45b>IWBIF Exhibition</p><h1 class="mt-4 max-w-4xl text-4xl font-black leading-[1.03] text-white sm:text-5xl lg:text-7xl" data-v-0ec8f45b>Where women-led brands meet the world.</h1><p class="mt-5 max-w-2xl text-sm leading-7 text-white/80 sm:text-base lg:text-lg" data-v-0ec8f45b>Showcase products, services, MSMEs, innovation, digital businesses, and investment opportunities to an international business audience.</p>`);
			_push(ssrRenderComponent(_component_NuxtLink, {
				to: "/register",
				class: "hero-action"
			}, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`Become an Exhibitor <span aria-hidden="true" data-v-0ec8f45b${_scopeId}>→</span>`);
					else return [createTextVNode("Become an Exhibitor "), createVNode("span", { "aria-hidden": "true" }, "→")];
				}),
				_: 1
			}, _parent));
			_push(`</div><div class="hero-note" data-v-0ec8f45b><span data-v-0ec8f45b>Showcase</span><i data-v-0ec8f45b></i><span data-v-0ec8f45b>Connect</span><i data-v-0ec8f45b></i><span data-v-0ec8f45b>Grow</span></div></div><div class="mt-16 grid items-end gap-6 md:grid-cols-[1fr_auto]" data-v-0ec8f45b><div data-v-0ec8f45b><p class="text-xs font-semibold uppercase tracking-[.32em] text-[#d8ac59]" data-v-0ec8f45b>Exhibition categories</p><h2 class="mt-4 max-w-3xl text-3xl font-black text-white sm:text-4xl" data-v-0ec8f45b>A curated showcase of enterprise and innovation.</h2></div><p class="max-w-md text-sm leading-7 text-slate-400" data-v-0ec8f45b>Discover businesses ready to build visibility, partnerships, market access, and meaningful investment relationships.</p></div><div class="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-3" data-v-0ec8f45b><!--[-->`);
			ssrRenderList(categories, (item, index) => {
				_push(`<article class="category-card" data-v-0ec8f45b><span class="category-card__number" data-v-0ec8f45b>0${ssrInterpolate(index + 1)}</span><h3 class="mt-8 text-xl font-bold text-white" data-v-0ec8f45b>${ssrInterpolate(item)}</h3><div class="category-card__line" data-v-0ec8f45b></div></article>`);
			});
			_push(`<!--]--></div><section class="exhibitor-callout" data-v-0ec8f45b><div data-v-0ec8f45b><p class="text-xs font-semibold uppercase tracking-[.3em] text-[#d8ac59]" data-v-0ec8f45b>Present your business</p><h2 class="mt-3 text-3xl font-black text-white sm:text-4xl" data-v-0ec8f45b>Become an exhibitor</h2><p class="mt-4 max-w-3xl leading-7 text-slate-300" data-v-0ec8f45b>Create a complete exhibitor profile with your company, industry, products, booth information, website, and product media.</p></div>`);
			_push(ssrRenderComponent(_component_NuxtLink, {
				to: "/register",
				class: "callout-action"
			}, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`Register Your Interest`);
					else return [createTextVNode("Register Your Interest")];
				}),
				_: 1
			}, _parent));
			_push(`</section></section></main>`);
		};
	}
});
//#endregion
//#region app/pages/exhibition.vue
var _sfc_setup = exhibition_vue_vue_type_script_setup_true_lang_default.setup;
exhibition_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/exhibition.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var exhibition_default = /*#__PURE__*/ _plugin_vue_export_helper_default(exhibition_vue_vue_type_script_setup_true_lang_default, [["__scopeId", "data-v-0ec8f45b"]]);

export { exhibition_default as default };;globalThis.__timing__.logEnd('Load chunks/build/exhibition-ZWCm7GLj');
//# sourceMappingURL=exhibition-ZWCm7GLj.mjs.map
