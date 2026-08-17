globalThis.__timing__.logStart('Load chunks/build/privacy-CoQ7C27w');import { c as useSeoMeta$1 } from '../virtual/entry.mjs';
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

//#region app/pages/privacy.vue?vue&type=script&setup=true&lang.ts
var privacy_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "privacy",
	__ssrInlineRender: true,
	setup(__props) {
		useSeoMeta$1({ title: "Privacy Policy | IWBIF 2026" });
		const sections = [
			{
				title: "Data we collect",
				text: "Account details, professional profile data, event selections, tickets, payment records, and check-in activity needed to run IWBIF operations."
			},
			{
				title: "How data is used",
				text: "Data supports registration, communication, ticket delivery, matching recommendations, networking, participant support, and event operations."
			},
			{
				title: "Sharing and security",
				text: "Data is not sold. Access is limited to organizers and approved service providers; private contact data is never exposed without permission."
			},
			{
				title: "Participant rights",
				text: "Participants can update profile details and privacy settings in dashboard, including directory visibility."
			}
		];
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<section${ssrRenderAttrs(mergeProps({ class: "mx-auto max-w-4xl px-4 py-14 sm:px-6" }, _attrs))}><p class="text-sm uppercase tracking-[.35em] text-cyan-200">Privacy Policy</p><h1 class="mt-3 text-4xl font-black">How we protect participant data at IWBIF.</h1><div class="mt-8 space-y-5"><!--[-->`);
			ssrRenderList(sections, (item) => {
				_push(`<article class="glass-card rounded-3xl p-6"><p class="text-xs uppercase tracking-[.25em] text-orange-200">${ssrInterpolate(item.title)}</p><p class="mt-3 leading-7 text-slate-300">${ssrInterpolate(item.text)}</p></article>`);
			});
			_push(`<!--]--></div></section>`);
		};
	}
});
//#endregion
//#region app/pages/privacy.vue
var _sfc_setup = privacy_vue_vue_type_script_setup_true_lang_default.setup;
privacy_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/privacy.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var privacy_default = privacy_vue_vue_type_script_setup_true_lang_default;

export { privacy_default as default };;globalThis.__timing__.logEnd('Load chunks/build/privacy-CoQ7C27w');
//# sourceMappingURL=privacy-CoQ7C27w.mjs.map
