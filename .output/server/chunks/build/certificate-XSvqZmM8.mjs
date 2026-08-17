globalThis.__timing__.logStart('Load chunks/build/certificate-XSvqZmM8');import { c as useSeoMeta$1 } from '../virtual/entry.mjs';
import { defineComponent, mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs } from 'vue/server-renderer';
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

//#region app/pages/dashboard/certificate.vue?vue&type=script&setup=true&lang.ts
var certificate_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "certificate",
	__ssrInlineRender: true,
	setup(__props) {
		useSeoMeta$1({ title: "Certificate | IWBIF 2026" });
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<section${ssrRenderAttrs(mergeProps({ class: "mx-auto max-w-4xl px-3 py-10 sm:px-6" }, _attrs))}><p class="text-sm uppercase tracking-[.35em] text-cyan-200">Digital Certificate</p><h1 class="mt-3 text-3xl font-black sm:text-4xl">Recognition for your participation</h1><div class="mt-8 overflow-hidden rounded-[2rem] border border-orange-200/20 bg-gradient-to-br from-orange-200/10 via-white/5 to-cyan-300/10 p-6 text-center sm:p-12"><p class="text-xs uppercase tracking-[.35em] text-orange-200">IWBIF 2026</p><h2 class="mt-8 text-3xl font-black sm:text-4xl">Certificate of Participation</h2><p class="mx-auto mt-5 max-w-xl text-sm leading-7 text-slate-300 sm:text-base">Certificates are available after attendance verification and required profile completion.</p><div class="mx-auto mt-8 max-w-lg border-t border-white/15 pt-5 text-sm text-slate-400">14-17 October 2026 · Hotel Kempinski Indonesia, Jakarta</div><button disabled class="mt-8 w-full cursor-not-allowed rounded-full border border-white/15 px-6 py-3 font-semibold text-slate-500 sm:w-auto">Certificate not yet available</button></div></section>`);
		};
	}
});
//#endregion
//#region app/pages/dashboard/certificate.vue
var _sfc_setup = certificate_vue_vue_type_script_setup_true_lang_default.setup;
certificate_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/dashboard/certificate.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var certificate_default = certificate_vue_vue_type_script_setup_true_lang_default;

export { certificate_default as default };;globalThis.__timing__.logEnd('Load chunks/build/certificate-XSvqZmM8');
//# sourceMappingURL=certificate-XSvqZmM8.mjs.map
