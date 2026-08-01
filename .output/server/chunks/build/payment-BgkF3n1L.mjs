globalThis.__timing__.logStart('Load chunks/build/payment-BgkF3n1L');import { u as usePayment } from './usePayment-B2J8chqq.mjs';
import { defineComponent, ref, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderAttr, ssrIncludeBooleanAttr, ssrInterpolate } from 'vue/server-renderer';
import '../virtual/entry.mjs';
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

//#region app/pages/dashboard/payment.vue?vue&type=script&setup=true&lang.ts
var payment_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "payment",
	__ssrInlineRender: true,
	setup(__props) {
		usePayment();
		const registrationId = ref("");
		const submitting = ref(false);
		const result = ref(null);
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<section${ssrRenderAttrs(mergeProps({ class: "mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8" }, _attrs))}><div class="glass-card rounded-[2rem] p-6"><p class="text-sm uppercase tracking-[0.3em] text-cyan-200/70">Midtrans</p><h1 class="mt-3 text-4xl font-bold text-white">Buat transaksi pembayaran</h1><p class="mt-3 text-slate-300"> Gunakan halaman ini untuk membuat transaksi via \`POST /payments/midtrans/create\` dan mendapatkan snap token. </p><form class="mt-8 grid gap-5 md:grid-cols-[1fr_auto] md:items-end"><label class="grid gap-2"><span class="text-sm text-slate-300">Registration ID</span><input${ssrRenderAttr("value", unref(registrationId))} required class="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none" placeholder="uuid registrasi"></label><button class="rounded-full bg-cyan-400 px-6 py-3 text-sm font-semibold text-slate-950 disabled:cursor-not-allowed disabled:opacity-60"${ssrIncludeBooleanAttr(unref(submitting)) ? " disabled" : ""}>${ssrInterpolate(unref(submitting) ? "Membuat transaksi..." : "Buat Transaksi")}</button></form>`);
			if (unref(result)) _push(`<div class="mt-8 space-y-3 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-200"><p class="text-white font-semibold">Snap Token: ${ssrInterpolate(unref(result).snap_token)}</p><p>Redirect URL: ${ssrInterpolate(unref(result).redirect_url)}</p></div>`);
			else _push(`<!---->`);
			_push(`</div></section>`);
		};
	}
});
//#endregion
//#region app/pages/dashboard/payment.vue
var _sfc_setup = payment_vue_vue_type_script_setup_true_lang_default.setup;
payment_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/dashboard/payment.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var payment_default = payment_vue_vue_type_script_setup_true_lang_default;

export { payment_default as default };;globalThis.__timing__.logEnd('Load chunks/build/payment-BgkF3n1L');
//# sourceMappingURL=payment-BgkF3n1L.mjs.map
