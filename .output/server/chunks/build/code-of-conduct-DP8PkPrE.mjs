globalThis.__timing__.logStart('Load chunks/build/code-of-conduct-DP8PkPrE');import { a as useSeoMeta$1 } from '../virtual/entry.mjs';
import { L as LegalPage_default } from './LegalPage-qu_C2PuV.mjs';
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

//#region app/pages/code-of-conduct.vue?vue&type=script&setup=true&lang.ts
var code_of_conduct_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "code-of-conduct",
	__ssrInlineRender: true,
	setup(__props) {
		useSeoMeta$1({ title: "Code of Conduct | ASEAN AI for Education" });
		const sections = [
			{
				title: "Our commitment",
				text: "Every participant, speaker, partner, volunteer, and staff member deserves to take part without harassment, discrimination, intimidation, or abusive communication."
			},
			{
				title: "Expected behavior",
				text: "Communicate respectfully, protect participant information, ask permission before recording, follow staff instructions, and use event technology and data responsibly."
			},
			{
				title: "Unacceptable behavior",
				text: "Harassment, unwanted contact, disruption, fraudulent registration, misuse of participant information, sharing another participant’s QR code, and unethical use of AI or event data are prohibited."
			},
			{
				title: "Enforcement",
				text: "Violations may result in a warning, removal from the event, account suspension, cancellation of participation, or referral to relevant authorities."
			}
		];
		return (_ctx, _push, _parent, _attrs) => {
			_push(ssrRenderComponent(LegalPage_default, mergeProps({
				title: "Code of Conduct",
				intro: "We are committed to a safe, inclusive, respectful, and professional environment for every participant.",
				sections
			}, _attrs), null, _parent));
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

export { code_of_conduct_default as default };;globalThis.__timing__.logEnd('Load chunks/build/code-of-conduct-DP8PkPrE');
//# sourceMappingURL=code-of-conduct-DP8PkPrE.mjs.map
