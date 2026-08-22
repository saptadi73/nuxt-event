import { u as useSeoMeta$1 } from './head-D-xrF-Fu.mjs';
import { _ as _plugin_vue_export_helper_default, g as useAuth } from '../virtual/entry.mjs';
import { defineComponent, reactive, ref, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderAttr, ssrIncludeBooleanAttr, ssrInterpolate, ssrRenderClass } from 'vue/server-renderer';
import 'nostics';
import 'unhead/plugins';
import 'unhead/utils';
import '../routes/renderer.mjs';
import '../_/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import 'unhead/server';
import 'unhead/legacy';
import 'vue-bundle-renderer/runtime';
import 'devalue';
import 'nostics/formatters/ansi';
import 'vue-router';
import '@vue/shared';

//#region app/pages/dashboard/security.vue?vue&type=script&setup=true&lang.ts
var security_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "security",
	__ssrInlineRender: true,
	setup(__props) {
		useSeoMeta$1({ title: "Change Password | IWBIF 2026" });
		useAuth();
		const form = reactive({
			current_password: "",
			new_password: "",
			confirm_password: ""
		});
		const saving = ref(false);
		const success = ref(false);
		const feedback = ref("");
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<section${ssrRenderAttrs(mergeProps({ class: "mx-auto max-w-2xl px-3 py-10 sm:px-6 lg:px-8" }, _attrs))} data-v-5fc30245><p class="text-sm uppercase tracking-[.35em] text-cyan-200" data-v-5fc30245>Account security</p><h1 class="mt-3 text-3xl font-black sm:text-4xl" data-v-5fc30245>Change password</h1><p class="mt-3 text-sm leading-7 text-slate-300" data-v-5fc30245>Enter your current password, then choose a new password of at least eight characters.</p><form class="glass-card mt-8 space-y-4 rounded-[2rem] p-5 sm:p-7" data-v-5fc30245><label class="field" data-v-5fc30245><span data-v-5fc30245>Current password</span><input${ssrRenderAttr("value", unref(form).current_password)} type="password" autocomplete="current-password" minlength="8" maxlength="128" required data-v-5fc30245></label><label class="field" data-v-5fc30245><span data-v-5fc30245>New password</span><input${ssrRenderAttr("value", unref(form).new_password)} type="password" autocomplete="new-password" minlength="8" maxlength="128" required data-v-5fc30245></label><label class="field" data-v-5fc30245><span data-v-5fc30245>Confirm new password</span><input${ssrRenderAttr("value", unref(form).confirm_password)} type="password" autocomplete="new-password" minlength="8" maxlength="128" required data-v-5fc30245></label><button class="w-full rounded-full bg-cyan-300 px-5 py-3 font-bold text-slate-950 disabled:opacity-50"${ssrIncludeBooleanAttr(unref(saving)) ? " disabled" : ""} data-v-5fc30245>${ssrInterpolate(unref(saving) ? "Updating..." : "Update password")}</button></form>`);
			if (unref(feedback)) _push(`<p class="${ssrRenderClass([unref(success) ? "border-emerald-300/30 bg-emerald-950/30 text-emerald-100" : "border-red-300/30 bg-red-950/30 text-red-100", "mt-5 rounded-2xl border p-4 text-sm"])}" data-v-5fc30245>${ssrInterpolate(unref(feedback))}</p>`);
			else _push(`<!---->`);
			_push(`</section>`);
		};
	}
});
//#endregion
//#region app/pages/dashboard/security.vue
var _sfc_setup = security_vue_vue_type_script_setup_true_lang_default.setup;
security_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/dashboard/security.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var security_default = /*#__PURE__*/ _plugin_vue_export_helper_default(security_vue_vue_type_script_setup_true_lang_default, [["__scopeId", "data-v-5fc30245"]]);

export { security_default as default };
//# sourceMappingURL=security-B80hXke0.mjs.map
