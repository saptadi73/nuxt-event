import { a as useSeoMeta$1, N as NuxtLink } from '../virtual/entry.mjs';
import { u as usePayment } from './usePayment-CjKDGwPj.mjs';
import { u as useRegistration } from './useRegistration-CYl8EOu6.mjs';
import { defineComponent, ref, mergeProps, unref, withCtx, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrIncludeBooleanAttr, ssrInterpolate } from 'vue/server-renderer';
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
		useSeoMeta$1({ title: "DOKU Payment | IWBIF 2026" });
		usePayment();
		useRegistration();
		const checking = ref(true);
		const submitting = ref(false);
		const paid = ref(false);
		const registrationId = ref("");
		const checkout = ref(null);
		const errorMessage = ref("");
		const requestId = ref("");
		const formatDate = (value) => new Intl.DateTimeFormat("en-GB", {
			dateStyle: "medium",
			timeStyle: "short"
		}).format(new Date(value));
		return (_ctx, _push, _parent, _attrs) => {
			const _component_NuxtLink = NuxtLink;
			_push(`<section${ssrRenderAttrs(mergeProps({ class: "mx-auto max-w-3xl px-3 py-10 sm:px-6 lg:px-8" }, _attrs))}><div class="glass-card rounded-[2rem] p-4 sm:p-6"><p class="text-sm uppercase tracking-[.3em] text-amber-200">DOKU Checkout</p><h1 class="mt-3 text-3xl font-black sm:text-4xl">Secure payment</h1><p class="mt-3 text-sm text-slate-300 sm:text-base">Continue to DOKU&#39;s secure checkout. The final amount is determined by the backend from your delegate package.</p>`);
			if (unref(checking)) _push(`<div class="mt-8 text-sm text-slate-300 sm:text-base">Checking your registration and payment status…</div>`);
			else if (unref(paid)) {
				_push(`<div class="mt-8 rounded-2xl border border-emerald-300/20 bg-emerald-300/5 p-5"><p class="text-lg font-semibold text-emerald-300">Payment received</p><p class="mt-2 text-sm text-slate-300 sm:text-base">Payment is complete. Organizer confirmation of your registration is handled separately.</p>`);
				_push(ssrRenderComponent(_component_NuxtLink, {
					to: `/dashboard/invoice?registration_id=${unref(registrationId)}`,
					class: "mt-5 inline-flex rounded-full bg-amber-300 px-5 py-3 font-semibold text-slate-950"
				}, {
					default: withCtx((_, _push, _parent, _scopeId) => {
						if (_push) _push(`View invoice`);
						else return [createTextVNode("View invoice")];
					}),
					_: 1
				}, _parent));
				_push(`</div>`);
			} else if (!unref(registrationId)) _push(`<div class="mt-8 rounded-2xl border border-amber-300/20 bg-amber-300/5 p-5 text-amber-100">No registration eligible for payment was found.</div>`);
			else _push(`<div class="mt-8"><button class="w-full rounded-full bg-amber-300 px-6 py-3 font-semibold text-slate-950 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"${ssrIncludeBooleanAttr(unref(submitting)) ? " disabled" : ""}>${ssrInterpolate(unref(submitting) ? "Preparing DOKU Checkout…" : "Proceed to DOKU Checkout")}</button><p class="mt-3 text-xs text-slate-500">Click once and wait for the secure redirect.</p></div>`);
			if (unref(checkout) && unref(checkout).requires_payment) {
				_push(`<div class="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4"><p>Checkout is ready.</p><button class="mt-4 w-full rounded-full border border-white/20 px-5 py-3 font-semibold sm:w-auto">Continue to DOKU</button>`);
				if (unref(checkout).expires_at) _push(`<p class="mt-3 text-xs text-slate-400">Expires ${ssrInterpolate(formatDate(unref(checkout).expires_at))}</p>`);
				else _push(`<!---->`);
				_push(`</div>`);
			} else _push(`<!---->`);
			if (unref(errorMessage)) {
				_push(`<div class="mt-5 rounded-2xl border border-red-400/30 bg-red-950/30 p-4 text-sm text-red-100"><p>${ssrInterpolate(unref(errorMessage))}</p>`);
				if (unref(requestId)) _push(`<p class="mt-2 text-xs text-red-200/70">Reference: ${ssrInterpolate(unref(requestId))}</p>`);
				else _push(`<!---->`);
				_push(`</div>`);
			} else _push(`<!---->`);
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

export { payment_default as default };
//# sourceMappingURL=payment-Dj5J8pb-.mjs.map
