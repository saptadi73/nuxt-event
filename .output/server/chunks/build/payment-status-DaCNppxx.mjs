import { c as useRoute, N as NuxtLink } from '../virtual/entry.mjs';
import { u as useSeoMeta$1 } from './head-D-xrF-Fu.mjs';
import { u as usePayment } from './usePayment-C_Rsx3yc.mjs';
import { defineComponent, ref, computed, mergeProps, unref, withCtx, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderClass, ssrRenderComponent, ssrIncludeBooleanAttr } from 'vue/server-renderer';
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

//#region app/pages/dashboard/payment-status.vue?vue&type=script&setup=true&lang.ts
var payment_status_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "payment-status",
	__ssrInlineRender: true,
	setup(__props) {
		useSeoMeta$1({ title: "Payment Status | IWBIF 2026" });
		useRoute();
		usePayment();
		ref("");
		const registrationId = ref("");
		const payment = ref(null);
		const status = ref("pending");
		const polling = ref(false);
		const checking = ref(false);
		const errorMessage = ref("");
		const requestId = ref("");
		const terminalStatuses = [
			"success",
			"failed",
			"expired",
			"canceled"
		];
		const terminal = computed(() => terminalStatuses.includes(status.value));
		const statusLabel = computed(() => ({
			created: "Created",
			pending: "Awaiting verification",
			success: "Payment successful",
			failed: "Payment failed",
			expired: "Checkout expired",
			canceled: "Payment canceled"
		})[status.value] || status.value);
		const heading = computed(() => status.value === "success" ? "Payment received" : terminal.value ? "Payment not completed" : "Payment processing");
		const description = computed(() => status.value === "success" ? "DOKU notification has been verified by the backend. Registration confirmation remains a separate organizer step." : terminal.value ? "You may safely create a new DOKU Checkout." : "Do not create another checkout while verification is in progress.");
		const statusClass = computed(() => status.value === "success" ? "text-emerald-300" : terminal.value ? "text-red-300" : "text-amber-200");
		const currency = (amount, code) => new Intl.NumberFormat("id-ID", {
			style: "currency",
			currency: code || "IDR",
			maximumFractionDigits: 0
		}).format(amount);
		return (_ctx, _push, _parent, _attrs) => {
			const _component_NuxtLink = NuxtLink;
			_push(`<section${ssrRenderAttrs(mergeProps({ class: "mx-auto max-w-3xl px-3 py-10 sm:px-6" }, _attrs))}><div class="glass-card rounded-[2rem] p-4 sm:p-7"><p class="text-sm uppercase tracking-[.3em] text-amber-200">DOKU Payment Status</p><h1 class="mt-3 text-3xl font-black sm:text-4xl">${ssrInterpolate(unref(heading))}</h1><p class="mt-3 text-sm text-slate-300 sm:text-base">${ssrInterpolate(unref(description))}</p><div class="mt-7 rounded-2xl border border-white/10 bg-white/5 p-5"><p class="text-xs uppercase tracking-widest text-slate-400">Payment status</p><p class="${ssrRenderClass([unref(statusClass), "mt-2 text-2xl font-bold"])}">${ssrInterpolate(unref(statusLabel))}</p>`);
			if (unref(payment)) _push(`<p class="mt-2 text-sm text-slate-400">Provider: ${ssrInterpolate(unref(payment).provider)} · Amount: ${ssrInterpolate(currency(unref(payment).gross_amount, unref(payment).currency))}</p>`);
			else _push(`<!---->`);
			if (unref(polling)) _push(`<p class="mt-3 text-sm text-amber-200">Checking for DOKU confirmation…</p>`);
			else _push(`<!---->`);
			_push(`</div><div class="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">`);
			if (unref(status) === "success") _push(ssrRenderComponent(_component_NuxtLink, {
				to: `/dashboard/invoice?registration_id=${unref(registrationId)}`,
				class: "rounded-full bg-amber-300 px-5 py-3 font-semibold text-slate-950"
			}, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`View invoice`);
					else return [createTextVNode("View invoice")];
				}),
				_: 1
			}, _parent));
			else if (unref(terminal)) _push(ssrRenderComponent(_component_NuxtLink, {
				to: "/dashboard/payment",
				class: "rounded-full bg-amber-300 px-5 py-3 font-semibold text-slate-950"
			}, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`Try payment again`);
					else return [createTextVNode("Try payment again")];
				}),
				_: 1
			}, _parent));
			else _push(`<button class="rounded-full border border-white/20 px-5 py-3"${ssrIncludeBooleanAttr(unref(checking)) ? " disabled" : ""}>Check again</button>`);
			_push(ssrRenderComponent(_component_NuxtLink, {
				to: "/dashboard",
				class: "rounded-full border border-white/20 px-5 py-3"
			}, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`Dashboard`);
					else return [createTextVNode("Dashboard")];
				}),
				_: 1
			}, _parent));
			_push(`</div>`);
			if (unref(errorMessage)) {
				_push(`<div class="mt-5 rounded-2xl border border-red-400/30 bg-red-950/30 p-4 text-red-100"><p>${ssrInterpolate(unref(errorMessage))}</p>`);
				if (unref(requestId)) _push(`<p class="mt-2 text-xs">Reference: ${ssrInterpolate(unref(requestId))}</p>`);
				else _push(`<!---->`);
				_push(`</div>`);
			} else _push(`<!---->`);
			_push(`</div></section>`);
		};
	}
});
//#endregion
//#region app/pages/dashboard/payment-status.vue
var _sfc_setup = payment_status_vue_vue_type_script_setup_true_lang_default.setup;
payment_status_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/dashboard/payment-status.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var payment_status_default = payment_status_vue_vue_type_script_setup_true_lang_default;

export { payment_status_default as default };
//# sourceMappingURL=payment-status-DaCNppxx.mjs.map
