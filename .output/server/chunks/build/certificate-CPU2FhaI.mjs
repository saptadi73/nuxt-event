import { u as useSeoMeta$1 } from './head-D-xrF-Fu.mjs';
import { a as useAsyncData } from '../virtual/entry.mjs';
import { u as useEventUpdates } from './useEventUpdates-MW0eSvke.mjs';
import { defineComponent, ref, withAsyncContext, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderAttr } from 'vue/server-renderer';
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

//#region app/pages/dashboard/certificate.vue?vue&type=script&setup=true&lang.ts
var certificate_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "certificate",
	__ssrInlineRender: true,
	async setup(__props) {
		let __temp, __restore;
		useSeoMeta$1({ title: "Certificate | IWBIF 2026" });
		const { getMyCertificates } = useEventUpdates();
		const errorMessage = ref("");
		const { data: certificate, pending } = ([__temp, __restore] = withAsyncContext(async () => useAsyncData("my-certificate", async () => {
			try {
				const result = (await getMyCertificates()).data;
				return Array.isArray(result) ? result[0] || null : result;
			} catch (error) {
				errorMessage.value = error.data?.message || (error instanceof Error ? error.message : "Certificate could not be loaded.");
				return null;
			}
		}, { default: () => null })), __temp = await __temp, __restore(), __temp);
		const formatDate = (value) => new Intl.DateTimeFormat("en-GB", {
			dateStyle: "long",
			timeZone: "Asia/Jakarta"
		}).format(new Date(value));
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<section${ssrRenderAttrs(mergeProps({ class: "mx-auto max-w-4xl px-3 py-10 sm:px-6" }, _attrs))}><p class="text-sm uppercase tracking-[.35em] text-cyan-200">Digital Certificate</p><h1 class="mt-3 text-3xl font-black sm:text-4xl">Recognition for your participation</h1>`);
			if (unref(errorMessage)) _push(`<p class="mt-6 rounded-2xl border border-red-300/30 bg-red-950/30 p-4 text-red-100">${ssrInterpolate(unref(errorMessage))}</p>`);
			else _push(`<!---->`);
			_push(`<div class="mt-8 overflow-hidden rounded-[2rem] border border-orange-200/20 bg-gradient-to-br from-orange-200/10 via-white/5 to-cyan-300/10 p-6 text-center sm:p-12"><p class="text-xs uppercase tracking-[.35em] text-orange-200">IWBIF 2026</p>`);
			if (unref(pending)) _push(`<h2 class="mt-8 text-3xl font-black sm:text-4xl">Checking certificate...</h2>`);
			else if (unref(certificate)) {
				_push(`<!--[--><h2 class="mt-8 text-3xl font-black sm:text-4xl">${ssrInterpolate(unref(certificate).title)}</h2><p class="mt-5 text-sm text-slate-300">Certificate number: <strong class="text-white">${ssrInterpolate(unref(certificate).certificate_number)}</strong></p>`);
				if (unref(certificate).issued_at) _push(`<p class="mt-2 text-sm text-slate-400">Issued ${ssrInterpolate(formatDate(unref(certificate).issued_at))}</p>`);
				else _push(`<!---->`);
				if (unref(certificate).download_url) _push(`<a${ssrRenderAttr("href", unref(certificate).download_url)} target="_blank" rel="noopener noreferrer" class="mt-8 inline-flex w-full justify-center rounded-full bg-orange-200 px-6 py-3 font-bold text-slate-950 sm:w-auto">Download certificate</a>`);
				else _push(`<p class="mt-8 text-sm text-slate-400">The certificate has been issued, but its download file is not available yet.</p>`);
				_push(`<!--]-->`);
			} else _push(`<!--[--><h2 class="mt-8 text-3xl font-black sm:text-4xl">Certificate of Participation</h2><p class="mx-auto mt-5 max-w-xl text-sm leading-7 text-slate-300 sm:text-base">Certificates are available after attendance verification and required profile completion.</p><button disabled class="mt-8 w-full cursor-not-allowed rounded-full border border-white/15 px-6 py-3 font-semibold text-slate-500 sm:w-auto">Certificate not yet available</button><!--]-->`);
			_push(`<div class="mx-auto mt-8 max-w-lg border-t border-white/15 pt-5 text-sm text-slate-400">14–17 October 2026 · Hotel Kempinski Indonesia, Jakarta</div></div></section>`);
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

export { certificate_default as default };
//# sourceMappingURL=certificate-CPU2FhaI.mjs.map
