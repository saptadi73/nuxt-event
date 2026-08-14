globalThis.__timing__.logStart('Load chunks/build/privacy-DPSHYtmH');import { a as useSeoMeta$1 } from '../virtual/entry.mjs';
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

//#region app/pages/privacy.vue?vue&type=script&setup=true&lang.ts
var privacy_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "privacy",
	__ssrInlineRender: true,
	setup(__props) {
		useSeoMeta$1({ title: "Privacy Policy | ASEAN AI for Education" });
		const sections = [
			{
				title: "Data we collect",
				text: "We process account data, professional profiles, event selections, transactions, tickets, and check-in activity required to operate the event."
			},
			{
				title: "How data is used",
				text: "Data is used for registration, event communication, payments, ticket issuance, security, participant support, aggregated analytics, and consent-based networking."
			},
			{
				title: "Sharing and security",
				text: "Data is not sold. Access is limited to organizers and required service providers. Private contact information is never displayed without permission."
			},
			{
				title: "Participant rights",
				text: "Participants can update profile and privacy settings through the dashboard and contact the organizer for data-related requests."
			}
		];
		return (_ctx, _push, _parent, _attrs) => {
			_push(ssrRenderComponent(LegalPage_default, mergeProps({
				title: "Privacy Policy",
				intro: "We protect participant data using principles of transparency, purpose limitation, and security.",
				sections
			}, _attrs), null, _parent));
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

export { privacy_default as default };;globalThis.__timing__.logEnd('Load chunks/build/privacy-DPSHYtmH');
//# sourceMappingURL=privacy-DPSHYtmH.mjs.map
