globalThis.__timing__.logStart('Load chunks/build/login-C5Jz2hv_');import { e as useAuth } from '../virtual/entry.mjs';
import { defineComponent, reactive, ref, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderAttr, ssrInterpolate } from 'vue/server-renderer';
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
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<div${ssrRenderAttrs(mergeProps({ class: "mx-auto max-w-md" }, _attrs))}><h1 class="text-3xl font-bold">Login</h1><form class="mt-4 space-y-3"><label class="block"><span class="mb-1 block text-sm text-slate-300">Email</span><input${ssrRenderAttr("value", unref(form).email)} class="w-full rounded border border-white/10 bg-slate-900 px-3 py-2" placeholder="email" required></label><label class="block"><span class="mb-1 block text-sm text-slate-300">Password</span><input${ssrRenderAttr("value", unref(form).password)} type="password" class="w-full rounded border border-white/10 bg-slate-900 px-3 py-2" placeholder="password" required></label><button type="submit" class="rounded bg-blue-500 px-4 py-2">Log In</button></form>`);
			if (unref(message)) _push(`<div class="mt-3 text-sm">${ssrInterpolate(unref(message))}</div>`);
			else _push(`<!---->`);
			_push(`</div>`);
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
var login_default = login_vue_vue_type_script_setup_true_lang_default;

export { login_default as default };;globalThis.__timing__.logEnd('Load chunks/build/login-C5Jz2hv_');
//# sourceMappingURL=login-C5Jz2hv_.mjs.map
