globalThis.__timing__.logStart('Load chunks/build/refund-policy-CVquo_5Q');import { a as useSeoMeta$1 } from '../virtual/entry.mjs';
import { L as LegalPage_default } from './LegalPage-D8ifYwEq.mjs';
import { defineComponent, mergeProps, useSSRContext } from 'vue';
import { ssrRenderComponent } from 'vue/server-renderer';
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

//#region app/pages/refund-policy.vue?vue&type=script&setup=true&lang.ts
var refund_policy_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "refund-policy",
	__ssrInlineRender: true,
	setup(__props) {
		useSeoMeta$1({ title: "Refund Policy | ASEAN AI for Education" });
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
				text: "Speaker, schedule, room, and workshop adjustments do not automatically qualify for a refund when the core event continues as planned."
			},
			{
				title: "Event cancellation",
				text: "If the organizer cancels the event, affected participants will receive instructions through their registered email address regarding available remedies."
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

export { refund_policy_default as default };;globalThis.__timing__.logEnd('Load chunks/build/refund-policy-CVquo_5Q');
//# sourceMappingURL=refund-policy-CVquo_5Q.mjs.map
