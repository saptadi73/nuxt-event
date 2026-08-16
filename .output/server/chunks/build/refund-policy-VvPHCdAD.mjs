globalThis.__timing__.logStart('Load chunks/build/refund-policy-VvPHCdAD');import { a as useSeoMeta$1 } from '../virtual/entry.mjs';
import { defineComponent, mergeProps, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrRenderAttrs, ssrInterpolate, ssrRenderList } from 'vue/server-renderer';
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

//#region app/components/LegalPage.vue?vue&type=script&setup=true&lang.ts
var LegalPage_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "LegalPage",
	__ssrInlineRender: true,
	props: {
		title: {},
		intro: {},
		sections: {}
	},
	setup(__props) {
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<section${ssrRenderAttrs(mergeProps({ class: "mx-auto max-w-4xl px-4 py-14 sm:px-6" }, _attrs))}><p class="text-sm uppercase tracking-[0.35em] text-cyan-200">Legal Information</p><h1 class="mt-4 text-5xl font-black">${ssrInterpolate(__props.title)}</h1><p class="mt-5 text-lg leading-8 text-slate-300">${ssrInterpolate(__props.intro)}</p><div class="mt-10 space-y-5"><!--[-->`);
			ssrRenderList(__props.sections, (section) => {
				_push(`<article class="glass-card rounded-2xl p-6"><h2 class="text-xl font-bold">${ssrInterpolate(section.title)}</h2><p class="mt-3 leading-7 text-slate-300">${ssrInterpolate(section.text)}</p></article>`);
			});
			_push(`<!--]--></div><p class="mt-8 text-sm text-slate-500">Last updated: August 1, 2026. Contact the organizer for the policy version that applies to your event.</p></section>`);
		};
	}
});
//#endregion
//#region app/components/LegalPage.vue
var _sfc_setup$1 = LegalPage_vue_vue_type_script_setup_true_lang_default.setup;
LegalPage_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/LegalPage.vue");
	return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
var LegalPage_default = Object.assign(LegalPage_vue_vue_type_script_setup_true_lang_default, { __name: "LegalPage" });
//#endregion
//#region app/pages/refund-policy.vue?vue&type=script&setup=true&lang.ts
var refund_policy_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "refund-policy",
	__ssrInlineRender: true,
	setup(__props) {
		useSeoMeta$1({ title: "Refund Policy | IWBIF 2026" });
		const sections = [
			{
				title: "Refund requests",
				text: "Refund eligibility follows the deadline and conditions communicated with the selected ticket. Administrative and payment processing fees may not be refundable."
			},
			{
				title: "Ticket transfers",
				text: "Tickets cannot be transferred without organizer approval and all approved changes must be completed before the announced transfer deadline."
			},
			{
				title: "Program changes",
				text: "Speaker, schedule, room, and track adjustments do not automatically qualify for a refund when the core forum continues as planned."
			},
			{
				title: "Event cancellation",
				text: "If the organizer cancels the event, participants receive official instructions through the registered email about available remedies."
			}
		];
		return (_ctx, _push, _parent, _attrs) => {
			_push(ssrRenderComponent(LegalPage_default, mergeProps({
				title: "Cancellation and Refund Policy",
				intro: "Ticket changes and refunds are handled fairly while protecting event commitments and payment costs.",
				sections
			}, _attrs), null, _parent));
		};
	}
});
//#endregion
//#region app/pages/refund-policy.vue
var _sfc_setup = refund_policy_vue_vue_type_script_setup_true_lang_default.setup;
refund_policy_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/refund-policy.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var refund_policy_default = refund_policy_vue_vue_type_script_setup_true_lang_default;

export { refund_policy_default as default };;globalThis.__timing__.logEnd('Load chunks/build/refund-policy-VvPHCdAD');
//# sourceMappingURL=refund-policy-VvPHCdAD.mjs.map
