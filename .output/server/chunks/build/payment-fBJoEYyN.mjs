globalThis.__timing__.logStart('Load chunks/build/payment-fBJoEYyN');import { N as NuxtLink } from '../virtual/entry.mjs';
import { u as usePayment } from './usePayment-s4-2mR-w.mjs';
import { defineComponent, ref, mergeProps, unref, withCtx, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrIncludeBooleanAttr, ssrInterpolate, ssrRenderAttr } from 'vue/server-renderer';
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
		const submitting = ref(false);
		const checking = ref(true);
		const hasPaidInvoice = ref(false);
		const result = ref(null);
		const errorMessage = ref("");
		return (_ctx, _push, _parent, _attrs) => {
			const _component_NuxtLink = NuxtLink;
			_push(`<section${ssrRenderAttrs(mergeProps({ class: "mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8" }, _attrs))}><div class="glass-card rounded-[2rem] p-6"><p class="text-sm uppercase tracking-[0.3em] text-cyan-200/70">Midtrans</p><h1 class="mt-3 text-4xl font-bold text-white">Payment</h1><p class="mt-3 text-slate-300"> Create or continue your payment securely. Your registration is identified automatically from your account. </p>`);
			if (unref(checking)) _push(`<div class="mt-8 text-slate-300">Checking your payment status...</div>`);
			else if (unref(hasPaidInvoice)) {
				_push(`<div class="mt-8 space-y-3 rounded-2xl border border-emerald-300/20 bg-emerald-300/5 p-5 text-slate-200"><p class="text-lg font-semibold text-emerald-300">Thank you, your payment has been received.</p><p>Your registration is confirmed. You can download your invoice from the Invoice dashboard.</p>`);
				_push(ssrRenderComponent(_component_NuxtLink, {
					to: "/dashboard/invoice",
					class: "inline-flex rounded-full bg-cyan-400 px-5 py-3 font-semibold text-slate-950"
				}, {
					default: withCtx((_, _push, _parent, _scopeId) => {
						if (_push) _push(`Go to invoice dashboard`);
						else return [createTextVNode("Go to invoice dashboard")];
					}),
					_: 1
				}, _parent));
				_push(`</div>`);
			} else _push(`<form class="mt-8"><button class="rounded-full bg-cyan-400 px-6 py-3 text-sm font-semibold text-slate-950 disabled:cursor-not-allowed disabled:opacity-60"${ssrIncludeBooleanAttr(unref(submitting)) ? " disabled" : ""}>${ssrInterpolate(unref(submitting) ? "Preparing payment..." : "Proceed to payment")}</button></form>`);
			if (unref(result) && !unref(result).already_paid) {
				_push(`<div class="mt-8 space-y-3 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-200"><p class="text-white font-semibold">Your payment is ready to continue.</p>`);
				if (unref(result).redirect_url) _push(`<a${ssrRenderAttr("href", unref(result).redirect_url)} class="inline-flex rounded-full bg-cyan-400 px-5 py-3 font-semibold text-slate-950">Continue to payment</a>`);
				else _push(`<!---->`);
				_push(`</div>`);
			} else _push(`<!---->`);
			if (unref(errorMessage)) _push(`<p class="mt-5 rounded-2xl border border-red-400/30 bg-red-950/30 p-4 text-sm text-red-100">${ssrInterpolate(unref(errorMessage))}</p>`);
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

export { payment_default as default };;globalThis.__timing__.logEnd('Load chunks/build/payment-fBJoEYyN');
//# sourceMappingURL=payment-fBJoEYyN.mjs.map
