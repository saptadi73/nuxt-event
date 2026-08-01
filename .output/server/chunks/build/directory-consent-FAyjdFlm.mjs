globalThis.__timing__.logStart('Load chunks/build/directory-consent-FAyjdFlm');import { a as useSeoMeta$1, N as NuxtLink } from '../virtual/entry.mjs';
import { defineComponent, mergeProps, withCtx, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderList, ssrInterpolate, ssrRenderComponent } from 'vue/server-renderer';
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

//#region app/pages/directory-consent.vue?vue&type=script&setup=true&lang.ts
var directory_consent_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "directory-consent",
	__ssrInlineRender: true,
	setup(__props) {
		useSeoMeta$1({ title: "Directory Consent | ASEAN AI for Education" });
		const sections = [
			{
				title: "Information that may be shared",
				text: "Your name, photo, country, role, organization, professional biography, expertise, AI interests, workshop track, and collaboration interests may be visible when you provide consent."
			},
			{
				title: "Information kept private",
				text: "Email addresses, phone numbers, passwords, payment details, identity documents, and other sensitive information are never shown in the participant directory."
			},
			{
				title: "Your choices",
				text: "Participation in the directory is optional. You may change selected visibility settings or hide your profile through privacy settings."
			},
			{
				title: "Professional use",
				text: "Directory information may only be used for respectful professional networking related to the summit community. Unsolicited commercial messages and misuse are prohibited."
			}
		];
		return (_ctx, _push, _parent, _attrs) => {
			const _component_NuxtLink = NuxtLink;
			_push(`<section${ssrRenderAttrs(mergeProps({ class: "mx-auto max-w-4xl px-4 py-14 sm:px-6" }, _attrs))}><p class="text-sm uppercase tracking-[.35em] text-cyan-200">Participant Directory Consent</p><h1 class="mt-4 text-5xl font-black">You control how other participants discover you.</h1><p class="mt-5 text-lg leading-8 text-slate-300">The directory helps registered participants find collaborators, mentors, project partners, and members of their workshop community.</p><div class="mt-10 grid gap-5"><!--[-->`);
			ssrRenderList(sections, (item) => {
				_push(`<article class="glass-card rounded-3xl p-6"><h2 class="text-xl font-bold">${ssrInterpolate(item.title)}</h2><p class="mt-3 leading-7 text-slate-300">${ssrInterpolate(item.text)}</p></article>`);
			});
			_push(`<!--]--></div>`);
			_push(ssrRenderComponent(_component_NuxtLink, {
				to: "/dashboard/profile",
				class: "mt-8 inline-flex rounded-full bg-cyan-400 px-6 py-3 font-semibold text-slate-950"
			}, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`Manage My Profile`);
					else return [createTextVNode("Manage My Profile")];
				}),
				_: 1
			}, _parent));
			_push(`</section>`);
		};
	}
});
//#endregion
//#region app/pages/directory-consent.vue
var _sfc_setup = directory_consent_vue_vue_type_script_setup_true_lang_default.setup;
directory_consent_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/directory-consent.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var directory_consent_default = directory_consent_vue_vue_type_script_setup_true_lang_default;

export { directory_consent_default as default };;globalThis.__timing__.logEnd('Load chunks/build/directory-consent-FAyjdFlm');
//# sourceMappingURL=directory-consent-FAyjdFlm.mjs.map
