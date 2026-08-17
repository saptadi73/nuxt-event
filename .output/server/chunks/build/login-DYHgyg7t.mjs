globalThis.__timing__.logStart('Load chunks/build/login-DYHgyg7t');import { _ as _plugin_vue_export_helper_default, g as useAuth, N as NuxtLink } from '../virtual/entry.mjs';
import { defineComponent, reactive, ref, mergeProps, unref, withCtx, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderAttr, ssrRenderClass, ssrInterpolate, ssrRenderComponent } from 'vue/server-renderer';
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

//#region app/pages/auth/login.vue?vue&type=script&setup=true&lang.ts
var login_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "login",
	__ssrInlineRender: true,
	setup(__props) {
		const form = reactive({
			email: "",
			password: ""
		});
		useAuth();
		const message = ref("");
		const messageTone = ref("neutral");
		return (_ctx, _push, _parent, _attrs) => {
			const _component_NuxtLink = NuxtLink;
			_push(`<main${ssrRenderAttrs(mergeProps({ class: "login-shell" }, _attrs))} data-v-2dede658><section class="mx-auto max-w-5xl px-3 py-10 sm:px-6 lg:px-8" data-v-2dede658><div class="login-card mx-auto max-w-md rounded-[2rem] border border-white/10 bg-gradient-to-br from-slate-950/80 via-slate-950/70 to-slate-900/70 p-5 shadow-[0_28px_60px_rgba(0,0,0,0.35)] sm:p-8" data-v-2dede658><div class="mb-4 inline-flex rounded-full border border-amber-200/20 bg-amber-300/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[.28em] text-amber-200" data-v-2dede658>Member access</div><h1 class="mt-3 text-3xl font-black text-white sm:text-4xl" data-v-2dede658>Login to IWBIF</h1><p class="mt-3 text-sm leading-7 text-slate-300" data-v-2dede658>Access your dashboard, tickets, payment status, and event updates.</p><form class="mt-6 space-y-4" data-v-2dede658><label class="block" data-v-2dede658><span class="mb-2 block text-sm text-slate-300" data-v-2dede658>Email</span><input${ssrRenderAttr("value", unref(form).email)} class="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white placeholder:text-slate-500 transition focus:border-amber-300/60 focus:outline-none focus:ring-2 focus:ring-amber-300/20" placeholder="you@example.com" required data-v-2dede658></label><label class="block" data-v-2dede658><span class="mb-2 block text-sm text-slate-300" data-v-2dede658>Password</span><input${ssrRenderAttr("value", unref(form).password)} type="password" class="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white placeholder:text-slate-500 transition focus:border-amber-300/60 focus:outline-none focus:ring-2 focus:ring-amber-300/20" placeholder="Enter your password" required data-v-2dede658></label><button type="submit" class="w-full rounded-full bg-gradient-to-r from-amber-300 to-amber-400 px-4 py-3 text-sm font-bold uppercase tracking-[.18em] text-slate-950 shadow-[0_18px_35px_rgba(216,172,89,0.22)] transition duration-200 hover:brightness-110 active:scale-[0.99]" data-v-2dede658>Log In</button></form>`);
			if (unref(message)) _push(`<div class="${ssrRenderClass([unref(messageTone) === "success" ? "border-emerald-300/30 bg-emerald-950/30 text-emerald-100" : unref(messageTone) === "error" ? "border-red-300/30 bg-red-950/30 text-red-100" : "border-white/10 bg-slate-950/60 text-slate-200", "mt-4 rounded-2xl border p-3 text-sm"])}" data-v-2dede658>${ssrInterpolate(unref(message))}</div>`);
			else _push(`<!---->`);
			_push(`<p class="mt-5 text-center text-sm text-slate-300" data-v-2dede658> Need an account? `);
			_push(ssrRenderComponent(_component_NuxtLink, {
				to: "/auth/register",
				class: "font-semibold text-amber-200 underline-offset-4 hover:underline"
			}, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`Create one`);
					else return [createTextVNode("Create one")];
				}),
				_: 1
			}, _parent));
			_push(`</p></div></section></main>`);
		};
	}
});
//#endregion
//#region app/pages/auth/login.vue
var _sfc_setup = login_vue_vue_type_script_setup_true_lang_default.setup;
login_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/auth/login.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var login_default = /*#__PURE__*/ _plugin_vue_export_helper_default(login_vue_vue_type_script_setup_true_lang_default, [["__scopeId", "data-v-2dede658"]]);

export { login_default as default };;globalThis.__timing__.logEnd('Load chunks/build/login-DYHgyg7t');
//# sourceMappingURL=login-DYHgyg7t.mjs.map
