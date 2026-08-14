globalThis.__timing__.logStart('Load chunks/build/terms-3e3dpkwL');import { a as useSeoMeta$1 } from '../virtual/entry.mjs';
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

//#region app/pages/terms.vue?vue&type=script&setup=true&lang.ts
var terms_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "terms",
	__ssrInlineRender: true,
	setup(__props) {
		useSeoMeta$1({ title: "Terms and Conditions | ASEAN AI for Education" });
		const sections = [
			{
				title: "Registration and tickets",
				text: "Participants must provide accurate information. Tickets are personal and QR codes must not be shared with anyone else."
			},
			{
				title: "Payments",
				text: "Payment status follows official backend confirmation after validation by the payment provider. Refund eligibility may differ by event or ticket type."
			},
			{
				title: "Participant conduct",
				text: "Participants must respect others, maintain a harassment-free environment, and follow safety instructions and venue rules."
			},
			{
				title: "Program changes",
				text: "The organizer may adjust speakers, schedules, format, or venue when needed and will communicate important updates through official channels."
			}
		];
		return (_ctx, _push, _parent, _attrs) => {
			_push(ssrRenderComponent(LegalPage_default, mergeProps({
				title: "Terms and Conditions",
				intro: "These terms help keep the summit safe, fair, and professional for every participant.",
				sections
			}, _attrs), null, _parent));
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

export { terms_default as default };;globalThis.__timing__.logEnd('Load chunks/build/terms-3e3dpkwL');
//# sourceMappingURL=terms-3e3dpkwL.mjs.map
