import { a as useSeoMeta$1, N as NuxtLink } from '../virtual/entry.mjs';
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
		useSeoMeta$1({ title: "Directory Consent | IWBIF 2026" });
		const sections = [
			{
				title: "Information that may be shared",
				text: "Business name, country, expertise, business interests, and selected collaboration goals may be visible with participant consent."
			},
			{
				title: "Information kept private",
				text: "Personal contact details, payment information, passwords, documents, and sensitive identifiers are never shown in the public directory."
			},
			{
				title: "Your choices",
				text: "Directory participation is optional. You can adjust visibility settings or hide your profile through privacy controls."
			},
			{
				title: "Professional use",
				text: "Directory data may only be used for respectful business networking and verified event collaboration activities."
			}
		];
		return (_ctx, _push, _parent, _attrs) => {
			const _component_NuxtLink = NuxtLink;
			_push(`<section${ssrRenderAttrs(mergeProps({ class: "mx-auto max-w-4xl px-4 py-14 sm:px-6" }, _attrs))}><p class="text-sm uppercase tracking-[.35em] text-cyan-200">Directory Visibility</p><h1 class="mt-3 text-5xl font-black">You control how other participants discover you.</h1><p class="mt-5 text-lg leading-8 text-slate-300">The directory supports cross-border networking while keeping your preferences and security as priority.</p><div class="mt-10 grid gap-5"><!--[-->`);
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

export { directory_consent_default as default };
//# sourceMappingURL=directory-consent-Cp0TgUs0.mjs.map
