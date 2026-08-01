globalThis.__timing__.logStart('Load chunks/build/faq-B7Vp3vT1');import { a as useSeoMeta$1 } from '../virtual/entry.mjs';
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
			title: "FAQ | ASEAN AI for Education",
			description: "Participant information for the ASEAN AI for Education Summit 2026."
		});
		const faqs = [
			{
				q: "What is the ASEAN AI for Education Summit?",
				a: "A two-day international conference and hands-on workshop focused on building AI solutions for education in Southeast Asia."
			},
			{
				q: "Who can attend?",
				a: "Software developers, AI engineers, educators, students, researchers, founders, companies, governments, and education institutions."
			},
			{
				q: "Do I need advanced AI experience?",
				a: "No. Beginner, intermediate, and advanced participants are welcome, although basic programming knowledge is recommended for technical workshops."
			},
			{
				q: "What language will be used?",
				a: "The primary event language is English."
			},
			{
				q: "What should I bring?",
				a: "Bring a laptop, charger, valid identity document, QR ticket, development tools, and a GitHub account."
			},
			{
				q: "Can I change my workshop track?",
				a: "Track changes may be allowed while capacity remains available."
			},
			{
				q: "How will I receive my QR code?",
				a: "It is generated after successful payment and becomes available in your participant dashboard."
			},
			{
				q: "Will participants receive certificates?",
				a: "Eligible participants receive a digital certificate after completing attendance requirements."
			},
			{
				q: "Can international participants attend?",
				a: "Yes. Participants from all ASEAN countries and other international locations are welcome."
			},
			{
				q: "Is my contact information visible?",
				a: "Private email, phone, passwords, payment details, and sensitive information are never displayed in the participant directory."
			}
		];
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<section${ssrRenderAttrs(mergeProps({ class: "mx-auto max-w-4xl px-4 py-14 sm:px-6" }, _attrs))}><p class="text-sm uppercase tracking-[0.35em] text-cyan-200">Frequently Asked Questions</p><h1 class="mt-4 text-5xl font-black">Everything you need before joining.</h1><div class="mt-10 space-y-4"><!--[-->`);
			ssrRenderList(faqs, (item) => {
				_push(`<details class="glass-card rounded-2xl p-5"><summary class="cursor-pointer text-lg font-semibold">${ssrInterpolate(item.q)}</summary><p class="mt-4 leading-7 text-slate-300">${ssrInterpolate(item.a)}</p></details>`);
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

export { faq_default as default };;globalThis.__timing__.logEnd('Load chunks/build/faq-B7Vp3vT1');
//# sourceMappingURL=faq-B7Vp3vT1.mjs.map
