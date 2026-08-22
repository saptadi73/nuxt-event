import { _ as _plugin_vue_export_helper_default, c as useRoute, N as NuxtLink } from '../virtual/entry.mjs';
import { u as useSeoMeta$1 } from './head-D-xrF-Fu.mjs';
import { u as usePayment } from './usePayment-C_Rsx3yc.mjs';
import { defineComponent, ref, computed, mergeProps, unref, withCtx, createTextVNode, createVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderComponent, ssrIncludeBooleanAttr } from 'vue/server-renderer';
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
import '../routes/renderer.mjs';
import 'unhead/server';
import 'unhead/legacy';
import 'unhead/plugins';
import 'vue-bundle-renderer/runtime';
import 'devalue';
import 'vue-router';
import '@vue/shared';
import 'unhead/utils';

//#region app/pages/dashboard/payment.vue?vue&type=script&setup=true&lang.ts
var payment_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "payment",
	__ssrInlineRender: true,
	setup(__props) {
		useSeoMeta$1({ title: "Payment | IWBIF 2026" });
		useRoute();
		const paymentApi = usePayment(), orderId = ref("");
		ref("");
		const errorMessage = ref(""), requestId = ref("");
		const order = ref(null);
		const loading = ref(true), submitting = ref(false);
		const paymentProviderLabel = computed(() => paymentApi.paymentProviderLabel || "DOKU");
		const isPaid = computed(() => order.value?.status?.toLowerCase() === "paid");
		const money = (amount, currency) => new Intl.NumberFormat("id-ID", {
			style: "currency",
			currency: currency || "IDR",
			maximumFractionDigits: 0
		}).format(amount || 0);
		return (_ctx, _push, _parent, _attrs) => {
			const _component_NuxtLink = NuxtLink;
			_push(`<section${ssrRenderAttrs(mergeProps({ class: "mx-auto max-w-6xl px-3 py-10 sm:px-6" }, _attrs))} data-v-4894b942><div class="glass-card rounded-[2rem] p-4 sm:p-7" data-v-4894b942><p class="text-sm uppercase tracking-[.3em] text-amber-200" data-v-4894b942>Payment method</p><h1 class="mt-3 text-3xl font-black sm:text-4xl" data-v-4894b942>Choose how you would like to pay</h1><p class="mt-3 max-w-3xl text-sm leading-7 text-slate-300" data-v-4894b942>Select manual bank transfer, direct QR Code Pay, or continue to ${ssrInterpolate(unref(paymentProviderLabel))} for online payment. The final amount comes directly from your backend order.</p>`);
			if (unref(loading)) _push(`<p class="mt-8 text-slate-300" data-v-4894b942>Loading your order...</p>`);
			else if (!unref(orderId)) {
				_push(`<div class="notice" data-v-4894b942><p data-v-4894b942>No active order was found. Review your cart and create an order first.</p>`);
				_push(ssrRenderComponent(_component_NuxtLink, {
					to: "/dashboard/cart",
					class: "mt-5 inline-flex rounded-full bg-amber-300 px-5 py-3 font-semibold text-slate-950"
				}, {
					default: withCtx((_, _push, _parent, _scopeId) => {
						if (_push) _push(`Open cart`);
						else return [createTextVNode("Open cart")];
					}),
					_: 1
				}, _parent));
				_push(`</div>`);
			} else {
				_push(`<!--[--><div class="mt-8 rounded-2xl border border-white/10 bg-white/5 p-5" data-v-4894b942><div class="flex flex-wrap items-start justify-between gap-4" data-v-4894b942><div data-v-4894b942><p class="text-xs uppercase tracking-[.2em] text-slate-400" data-v-4894b942>Order</p><p class="mt-2 text-xl font-bold" data-v-4894b942>${ssrInterpolate(unref(order)?.order_number || unref(orderId))}</p></div><span class="rounded-full border border-amber-300/20 bg-amber-300/10 px-3 py-1 text-xs uppercase tracking-[.18em] text-amber-100" data-v-4894b942>${ssrInterpolate(unref(order)?.status || "pending")}</span></div>`);
				if (unref(order)) _push(`<div class="mt-5 flex items-end justify-between border-t border-white/10 pt-5" data-v-4894b942><span class="text-slate-400" data-v-4894b942>Total</span><strong class="text-2xl text-amber-200" data-v-4894b942>${ssrInterpolate(money(unref(order).total_amount, unref(order).currency))}</strong></div>`);
				else _push(`<!---->`);
				_push(`</div>`);
				if (unref(isPaid)) _push(ssrRenderComponent(_component_NuxtLink, {
					to: `/dashboard/invoice?order_id=${unref(orderId)}`,
					class: "mt-6 inline-flex rounded-full bg-emerald-300 px-6 py-3 text-center font-bold text-slate-950"
				}, {
					default: withCtx((_, _push, _parent, _scopeId) => {
						if (_push) _push(`View invoice`);
						else return [createTextVNode("View invoice")];
					}),
					_: 1
				}, _parent));
				else {
					_push(`<div class="mt-6 grid gap-4 md:grid-cols-3" data-v-4894b942>`);
					_push(ssrRenderComponent(_component_NuxtLink, {
						to: `/dashboard/payment-manual?order_id=${encodeURIComponent(unref(orderId))}`,
						class: "payment-choice payment-choice-bank"
					}, {
						default: withCtx((_, _push, _parent, _scopeId) => {
							if (_push) _push(`<span class="payment-choice__tag" data-v-4894b942${_scopeId}>Bank account</span><strong data-v-4894b942${_scopeId}>Manual Bank Transfer</strong><p data-v-4894b942${_scopeId}>View the temporary account number and transfer instructions.</p><span class="payment-choice__action" data-v-4894b942${_scopeId}>View bank details <span aria-hidden="true" data-v-4894b942${_scopeId}>→</span></span>`);
							else return [
								createVNode("span", { class: "payment-choice__tag" }, "Bank account"),
								createVNode("strong", null, "Manual Bank Transfer"),
								createVNode("p", null, "View the temporary account number and transfer instructions."),
								createVNode("span", { class: "payment-choice__action" }, [createTextVNode("View bank details "), createVNode("span", { "aria-hidden": "true" }, "→")])
							];
						}),
						_: 1
					}, _parent));
					_push(ssrRenderComponent(_component_NuxtLink, {
						to: `/dashboard/payment-qr?order_id=${encodeURIComponent(unref(orderId))}`,
						class: "payment-choice payment-choice-qr"
					}, {
						default: withCtx((_, _push, _parent, _scopeId) => {
							if (_push) _push(`<span class="payment-choice__tag" data-v-4894b942${_scopeId}>Scan to pay</span><strong data-v-4894b942${_scopeId}>Direct QR Code Pay</strong><p data-v-4894b942${_scopeId}>Open a dedicated QR page and scan it with your banking app.</p><span class="payment-choice__action" data-v-4894b942${_scopeId}>Show QR code <span aria-hidden="true" data-v-4894b942${_scopeId}>→</span></span>`);
							else return [
								createVNode("span", { class: "payment-choice__tag" }, "Scan to pay"),
								createVNode("strong", null, "Direct QR Code Pay"),
								createVNode("p", null, "Open a dedicated QR page and scan it with your banking app."),
								createVNode("span", { class: "payment-choice__action" }, [createTextVNode("Show QR code "), createVNode("span", { "aria-hidden": "true" }, "→")])
							];
						}),
						_: 1
					}, _parent));
					_push(`<article class="payment-choice payment-choice-doku" data-v-4894b942><span class="payment-choice__tag" data-v-4894b942>Online gateway</span><strong data-v-4894b942>Online Payment</strong><p data-v-4894b942>Continue securely to the hosted ${ssrInterpolate(unref(paymentProviderLabel))} payment page.</p><button class="payment-choice__action disabled:cursor-not-allowed disabled:opacity-60"${ssrIncludeBooleanAttr(unref(submitting)) ? " disabled" : ""} data-v-4894b942>${ssrInterpolate(unref(submitting) ? `Preparing ${unref(paymentProviderLabel)}...` : `Continue to ${unref(paymentProviderLabel)}`)} <span aria-hidden="true" data-v-4894b942>→</span></button></article></div>`);
				}
				_push(ssrRenderComponent(_component_NuxtLink, {
					to: "/dashboard/cart",
					class: "mt-6 inline-flex rounded-full border border-white/20 px-6 py-3 text-center"
				}, {
					default: withCtx((_, _push, _parent, _scopeId) => {
						if (_push) _push(`Back to cart`);
						else return [createTextVNode("Back to cart")];
					}),
					_: 1
				}, _parent));
				_push(`<!--]-->`);
			}
			if (unref(errorMessage)) {
				_push(`<div class="mt-5 rounded-2xl border border-red-400/30 bg-red-950/30 p-4 text-sm text-red-100" data-v-4894b942><p data-v-4894b942>${ssrInterpolate(unref(errorMessage))}</p>`);
				if (unref(requestId)) _push(`<p class="mt-2 text-xs opacity-70" data-v-4894b942>Reference: ${ssrInterpolate(unref(requestId))}</p>`);
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
var payment_default = /*#__PURE__*/ _plugin_vue_export_helper_default(payment_vue_vue_type_script_setup_true_lang_default, [["__scopeId", "data-v-4894b942"]]);

export { payment_default as default };
//# sourceMappingURL=payment-_06GCMof.mjs.map
