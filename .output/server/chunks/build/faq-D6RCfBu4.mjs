import { a as useSeoMeta$1 } from '../virtual/entry.mjs';
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

//#region app/pages/faq.vue?vue&type=script&setup=true&lang.ts
var faq_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "faq",
	__ssrInlineRender: true,
	setup(__props) {
		useSeoMeta$1({
			title: "FAQ | IWBIF 2026",
			description: "Common questions about registration, matching, and participation in IWBIF 2026."
		});
		const faqs = [
			{
				q: "What is IWBIF 2026?",
				a: "The International Women Business & Investment Forum is a women-led ecosystem conference in Jakarta focused on finance, global collaboration, and digital transformation."
			},
			{
				q: "Who can attend?",
				a: "Women entrepreneurs, investors, business leaders, government representatives, buyers, suppliers, distributors, and strategic partners from Indonesia and international communities."
			},
			{
				q: "Do I need any pre-event qualification?",
				a: "All participants should have basic business profile readiness, and registration can be completed with standard business details."
			},
			{
				q: "What language will be used?",
				a: "The primary event language is English, with interpretation support as needed for selected sessions."
			},
			{
				q: "What should I bring?",
				a: "Bring identification, business cards or company details, your QR code, and any company profile materials you plan to share."
			},
			{
				q: "Can I update matching preferences?",
				a: "Yes. You can update your matching interests and availability inside your participant dashboard before business matching opens."
			},
			{
				q: "How will I receive my QR code?",
				a: "It is generated after successful registration and payment, then appears in your participant dashboard and check-in materials."
			},
			{
				q: "Will participants receive certificates?",
				a: "Qualified participants receive digital attendance documentation after verification."
			},
			{
				q: "Can international participants attend?",
				a: "Yes. Participants from global markets are welcome, subject to registration completion and verification."
			},
			{
				q: "Is my contact information visible?",
				a: "Private data is protected. Only approved directory fields are shown based on consent and your profile visibility preferences."
			}
		];
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<section${ssrRenderAttrs(mergeProps({ class: "mx-auto max-w-4xl px-3 py-10 sm:px-6" }, _attrs))}><p class="text-sm uppercase tracking-[0.35em] text-cyan-200">Frequently Asked Questions</p><h1 class="mt-4 text-3xl font-black sm:text-5xl">Everything you need before joining.</h1><div class="mt-10 space-y-4"><!--[-->`);
			ssrRenderList(faqs, (item) => {
				_push(`<details class="glass-card rounded-[1.5rem] p-4 sm:p-5"><summary class="cursor-pointer list-none text-base font-semibold text-white sm:text-lg">${ssrInterpolate(item.q)}</summary><p class="mt-4 text-sm leading-7 text-slate-300 sm:text-base">${ssrInterpolate(item.a)}</p></details>`);
			});
			_push(`<!--]--></div></section>`);
		};
	}
});
//#endregion
//#region app/pages/faq.vue
var _sfc_setup = faq_vue_vue_type_script_setup_true_lang_default.setup;
faq_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/faq.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var faq_default = faq_vue_vue_type_script_setup_true_lang_default;

export { faq_default as default };
//# sourceMappingURL=faq-D6RCfBu4.mjs.map
