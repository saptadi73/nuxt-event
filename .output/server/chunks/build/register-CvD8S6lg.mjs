import { _ as _plugin_vue_export_helper_default, u as useAuthStore, s as storeToRefs, a as useSeoMeta$1, N as NuxtLink } from '../virtual/entry.mjs';
import { defineComponent, mergeProps, unref, withCtx, createTextVNode, createVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent } from 'vue/server-renderer';
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

//#region app/pages/register.vue?vue&type=script&setup=true&lang.ts
var register_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "register",
	__ssrInlineRender: true,
	setup(__props) {
		const authStore = useAuthStore();
		const { isAuthenticated } = storeToRefs(authStore);
		useSeoMeta$1({
			title: "Registration | IWBIF 2026",
			description: "Create your IWBIF 2026 account and choose whether you want to register as a delegate or exhibitor."
		});
		return (_ctx, _push, _parent, _attrs) => {
			const _component_NuxtLink = NuxtLink;
			_push(`<section${ssrRenderAttrs(mergeProps({ class: "register-choice-shell mx-auto max-w-5xl px-3 py-10 sm:px-6 lg:px-8" }, _attrs))} data-v-0dba90e4><p class="text-sm uppercase tracking-[0.35em] text-amber-200" data-v-0dba90e4>Registration</p><h1 class="mt-4 text-3xl font-black sm:text-5xl" data-v-0dba90e4>Choose how you want to join IWBIF 2026</h1><p class="mt-4 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base" data-v-0dba90e4> Create your account first, then continue with the registration type that matches your participation. </p>`);
			if (!unref(isAuthenticated)) {
				_push(`<div class="mt-10 rounded-[2rem] border border-amber-200/20 bg-gradient-to-br from-amber-300/8 via-slate-950/60 to-slate-950/80 p-6 shadow-[0_18px_50px_rgba(0,0,0,0.2)] sm:p-8" data-v-0dba90e4><p class="text-base text-slate-200" data-v-0dba90e4>You need an account before starting the registration process.</p><div class="mt-6 flex flex-col gap-3 sm:flex-row" data-v-0dba90e4>`);
				_push(ssrRenderComponent(_component_NuxtLink, {
					to: "/auth/register",
					class: "inline-flex items-center justify-center rounded-full bg-amber-300 px-6 py-3 font-semibold text-slate-950 shadow-[0_18px_35px_rgba(216,172,89,0.24)] transition hover:brightness-110"
				}, {
					default: withCtx((_, _push, _parent, _scopeId) => {
						if (_push) _push(`Create account`);
						else return [createTextVNode("Create account")];
					}),
					_: 1
				}, _parent));
				_push(ssrRenderComponent(_component_NuxtLink, {
					to: "/auth/login",
					class: "inline-flex items-center justify-center rounded-full border border-white/15 bg-white/5 px-6 py-3 font-semibold text-white transition hover:border-white/25 hover:bg-white/10"
				}, {
					default: withCtx((_, _push, _parent, _scopeId) => {
						if (_push) _push(`I already have an account`);
						else return [createTextVNode("I already have an account")];
					}),
					_: 1
				}, _parent));
				_push(`</div></div>`);
			} else {
				_push(`<div class="mt-10 grid gap-5 md:grid-cols-2" data-v-0dba90e4>`);
				_push(ssrRenderComponent(_component_NuxtLink, {
					to: "/register/delegate",
					class: "choice-card delegate-card rounded-[2rem] border border-amber-200/20 bg-amber-400/5 p-6 transition duration-200 hover:-translate-y-1 hover:border-amber-300/50 hover:bg-amber-300/10"
				}, {
					default: withCtx((_, _push, _parent, _scopeId) => {
						if (_push) _push(`<p class="text-xs uppercase tracking-[0.35em] text-amber-200" data-v-0dba90e4${_scopeId}>Delegate</p><h2 class="mt-4 text-2xl font-black" data-v-0dba90e4${_scopeId}>Register as Delegate</h2><p class="mt-3 text-sm leading-7 text-slate-300" data-v-0dba90e4${_scopeId}>Join as a participant, complete your profile, choose a package, and access business matching features.</p><span class="mt-6 inline-flex rounded-full bg-amber-300 px-5 py-2.5 font-semibold text-slate-950 shadow-[0_12px_25px_rgba(216,172,89,0.20)]" data-v-0dba90e4${_scopeId}>Continue</span>`);
						else return [
							createVNode("p", { class: "text-xs uppercase tracking-[0.35em] text-amber-200" }, "Delegate"),
							createVNode("h2", { class: "mt-4 text-2xl font-black" }, "Register as Delegate"),
							createVNode("p", { class: "mt-3 text-sm leading-7 text-slate-300" }, "Join as a participant, complete your profile, choose a package, and access business matching features."),
							createVNode("span", { class: "mt-6 inline-flex rounded-full bg-amber-300 px-5 py-2.5 font-semibold text-slate-950 shadow-[0_12px_25px_rgba(216,172,89,0.20)]" }, "Continue")
						];
					}),
					_: 1
				}, _parent));
				_push(ssrRenderComponent(_component_NuxtLink, {
					to: "/register/exhibitor",
					class: "choice-card exhibitor-card rounded-[2rem] border border-cyan-200/20 bg-cyan-400/5 p-6 transition duration-200 hover:-translate-y-1 hover:border-cyan-300/50 hover:bg-cyan-300/10"
				}, {
					default: withCtx((_, _push, _parent, _scopeId) => {
						if (_push) _push(`<p class="text-xs uppercase tracking-[0.35em] text-cyan-200" data-v-0dba90e4${_scopeId}>Exhibitor</p><h2 class="mt-4 text-2xl font-black" data-v-0dba90e4${_scopeId}>Register as Exhibitor</h2><p class="mt-3 text-sm leading-7 text-slate-300" data-v-0dba90e4${_scopeId}>Submit your company profile, booth interest, and exhibition requirements for event participation.</p><span class="mt-6 inline-flex rounded-full bg-cyan-300 px-5 py-2.5 font-semibold text-slate-950 shadow-[0_12px_25px_rgba(34,211,238,0.20)]" data-v-0dba90e4${_scopeId}>Continue</span>`);
						else return [
							createVNode("p", { class: "text-xs uppercase tracking-[0.35em] text-cyan-200" }, "Exhibitor"),
							createVNode("h2", { class: "mt-4 text-2xl font-black" }, "Register as Exhibitor"),
							createVNode("p", { class: "mt-3 text-sm leading-7 text-slate-300" }, "Submit your company profile, booth interest, and exhibition requirements for event participation."),
							createVNode("span", { class: "mt-6 inline-flex rounded-full bg-cyan-300 px-5 py-2.5 font-semibold text-slate-950 shadow-[0_12px_25px_rgba(34,211,238,0.20)]" }, "Continue")
						];
					}),
					_: 1
				}, _parent));
				_push(`</div>`);
			}
			_push(`</section>`);
		};
	}
});
//#endregion
//#region app/pages/register.vue
var _sfc_setup = register_vue_vue_type_script_setup_true_lang_default.setup;
register_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/register.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var register_default = /*#__PURE__*/ _plugin_vue_export_helper_default(register_vue_vue_type_script_setup_true_lang_default, [["__scopeId", "data-v-0dba90e4"]]);

export { register_default as default };
//# sourceMappingURL=register-CvD8S6lg.mjs.map
