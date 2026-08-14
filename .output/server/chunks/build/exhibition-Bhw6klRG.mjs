globalThis.__timing__.logStart('Load chunks/build/exhibition-Bhw6klRG');import { a as useSeoMeta$1, N as NuxtLink } from '../virtual/entry.mjs';
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
			_push(`<section${ssrRenderAttrs(mergeProps({ class: "mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8" }, _attrs))}><p class="text-sm uppercase tracking-[.35em] text-amber-200">IWBIF Exhibition</p><h1 class="mt-4 max-w-4xl text-5xl font-black">Showcase Indonesian and global women-led businesses.</h1><p class="mt-5 max-w-3xl text-lg leading-8 text-slate-300">Present products, services, MSMEs, innovation, digital businesses, and investment opportunities to an international business audience.</p><div class="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"><!--[-->`);
			ssrRenderList(categories, (item) => {
				_push(`<article class="glass-card rounded-3xl p-6 text-xl font-bold">${ssrInterpolate(item)}</article>`);
			});
			_push(`<!--]--></div><div class="mt-10 glass-card rounded-[2rem] p-8"><h2 class="text-3xl font-black">Become an exhibitor</h2><p class="mt-3 max-w-3xl leading-7 text-slate-300">Create a complete exhibitor profile with your company, industry, products, booth information, website, and product media.</p>`);
			_push(ssrRenderComponent(_component_NuxtLink, {
				to: "/register",
				class: "mt-6 inline-flex rounded-full bg-amber-300 px-6 py-3 font-semibold text-slate-950"
			}, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`Register Your Interest`);
					else return [createTextVNode("Register Your Interest")];
				}),
				_: 1
			}, _parent));
			_push(`</div></section>`);
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
var exhibition_default = exhibition_vue_vue_type_script_setup_true_lang_default;

export { exhibition_default as default };;globalThis.__timing__.logEnd('Load chunks/build/exhibition-Bhw6klRG');
//# sourceMappingURL=exhibition-Bhw6klRG.mjs.map
