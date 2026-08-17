globalThis.__timing__.logStart('Load chunks/build/code-of-conduct-DQ_FJul0');import { c as useSeoMeta$1 } from '../virtual/entry.mjs';
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

//#region app/pages/code-of-conduct.vue?vue&type=script&setup=true&lang.ts
var code_of_conduct_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "code-of-conduct",
	__ssrInlineRender: true,
	setup(__props) {
		useSeoMeta$1({ title: "Code of Conduct | IWBIF 2026" });
		const sections = [
			{
				title: "Our commitment",
				text: "Every participant, speaker, partner, volunteer, and staff member deserves an inclusive and respectful forum experience."
			},
			{
				title: "Expected behavior",
				text: "Communicate with professionalism, protect participant data, ask permission before recording, and follow all staff guidance and venue rules."
			},
			{
				title: "Unacceptable behavior",
				text: "Harassment, intimidation, fraud, misuse of participant information, identity theft, and non-consensual sharing of codes or credentials are prohibited."
			},
			{
				title: "Enforcement",
				text: "Violations may lead to warning, removal from event activities, account suspension, registration cancellation, or referral to authorities."
			}
		];
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<section${ssrRenderAttrs(mergeProps({ class: "mx-auto max-w-4xl px-4 py-14 sm:px-6" }, _attrs))}><p class="text-sm uppercase tracking-[.35em] text-cyan-200">Code of Conduct</p><h1 class="mt-3 text-4xl font-black">Create a respectful, safe, and professional business ecosystem.</h1><div class="mt-8 space-y-5"><!--[-->`);
			ssrRenderList(sections, (item) => {
				_push(`<article class="glass-card rounded-3xl p-6"><p class="text-xs uppercase tracking-[.25em] text-orange-200">${ssrInterpolate(item.title)}</p><p class="mt-3 leading-7 text-slate-300">${ssrInterpolate(item.text)}</p></article>`);
			});
			_push(`<!--]--></div></section>`);
		};
	}
});
//#endregion
//#region app/pages/code-of-conduct.vue
var _sfc_setup = code_of_conduct_vue_vue_type_script_setup_true_lang_default.setup;
code_of_conduct_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/code-of-conduct.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var code_of_conduct_default = code_of_conduct_vue_vue_type_script_setup_true_lang_default;

export { code_of_conduct_default as default };;globalThis.__timing__.logEnd('Load chunks/build/code-of-conduct-DQ_FJul0');
//# sourceMappingURL=code-of-conduct-DQ_FJul0.mjs.map
