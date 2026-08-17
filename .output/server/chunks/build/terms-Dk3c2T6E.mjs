globalThis.__timing__.logStart('Load chunks/build/terms-Dk3c2T6E');import { c as useSeoMeta$1 } from '../virtual/entry.mjs';
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

//#region app/pages/terms.vue?vue&type=script&setup=true&lang.ts
var terms_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "terms",
	__ssrInlineRender: true,
	setup(__props) {
		useSeoMeta$1({ title: "Terms and Conditions | IWBIF 2026" });
		const sections = [
			{
				title: "Registration and tickets",
				text: "Participants must provide accurate information. Tickets are personal and not transferable without approval."
			},
			{
				title: "Payments",
				text: "Payment status follows confirmation from the configured payment provider and the organizer team process."
			},
			{
				title: "Participant conduct",
				text: "Participants must respect others and maintain a harassment-free professional environment at all times."
			},
			{
				title: "Program changes",
				text: "Organizer may adjust sessions, tracks, or venues as operationally needed and will communicate updates through official channels."
			}
		];
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<section${ssrRenderAttrs(mergeProps({ class: "mx-auto max-w-4xl px-4 py-14 sm:px-6" }, _attrs))}><p class="text-sm uppercase tracking-[.35em] text-cyan-200">Terms and Conditions</p><h1 class="mt-3 text-4xl font-black">Clear rules for a smooth registration and event journey.</h1><div class="mt-8 space-y-5"><!--[-->`);
			ssrRenderList(sections, (item) => {
				_push(`<article class="glass-card rounded-3xl p-6"><p class="text-xs uppercase tracking-[.25em] text-orange-200">${ssrInterpolate(item.title)}</p><p class="mt-3 leading-7 text-slate-300">${ssrInterpolate(item.text)}</p></article>`);
			});
			_push(`<!--]--></div></section>`);
		};
	}
});
//#endregion
//#region app/pages/terms.vue
var _sfc_setup = terms_vue_vue_type_script_setup_true_lang_default.setup;
terms_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/terms.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var terms_default = terms_vue_vue_type_script_setup_true_lang_default;

export { terms_default as default };;globalThis.__timing__.logEnd('Load chunks/build/terms-Dk3c2T6E');
//# sourceMappingURL=terms-Dk3c2T6E.mjs.map
