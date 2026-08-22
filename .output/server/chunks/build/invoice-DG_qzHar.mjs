import { c as useRoute, j as useState, N as NuxtLink } from '../virtual/entry.mjs';
import { u as useSeoMeta$1 } from './head-D-xrF-Fu.mjs';
import { u as usePayment } from './usePayment-C_Rsx3yc.mjs';
import { u as useRegistration } from './useRegistration-CYl8EOu6.mjs';
import { u as useTicket } from './useTicket-yGdsUCDV.mjs';
import { defineComponent, ref, mergeProps, unref, withCtx, createTextVNode, useSSRContext } from 'vue';
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

//#region app/pages/dashboard/invoice.vue?vue&type=script&setup=true&lang.ts
var invoice_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "invoice",
	__ssrInlineRender: true,
	setup(__props) {
		useSeoMeta$1({ title: "Invoice | IWBIF 2026" });
		usePayment();
		useRegistration();
		useTicket();
		useRoute();
		const invoice = ref(null);
		ref(null);
		useState("current-invoice", () => null);
		const pending = ref(true);
		const downloading = ref(false);
		const errorMessage = ref("");
		const formatCurrency = (amount, currency) => new Intl.NumberFormat("id-ID", {
			style: "currency",
			currency
		}).format(amount);
		const formatDate = (value) => value ? new Intl.DateTimeFormat("id-ID", {
			dateStyle: "long",
			timeStyle: "short"
		}).format(new Date(value)) : "-";
		return (_ctx, _push, _parent, _attrs) => {
			const _component_NuxtLink = NuxtLink;
			_push(`<section${ssrRenderAttrs(mergeProps({ class: "mx-auto max-w-4xl px-3 py-10 sm:px-6" }, _attrs))}><p class="text-sm uppercase tracking-[.35em] text-cyan-200">Payment and Invoice</p><h1 class="mt-3 text-3xl font-black sm:text-4xl">Registration invoice</h1>`);
			if (unref(pending)) _push(`<div class="glass-card mt-8 rounded-[2rem] p-7 text-slate-300">Loading invoice...</div>`);
			else if (unref(errorMessage)) _push(`<div class="mt-8 rounded-3xl border border-red-400/30 bg-red-950/30 p-6 text-red-100">${ssrInterpolate(unref(errorMessage))}</div>`);
			else if (!unref(invoice)) {
				_push(`<div class="glass-card mt-8 rounded-[2rem] p-7"><p class="text-lg font-semibold">No invoice is available yet.</p><p class="mt-2 text-slate-400">Your invoice will appear after your payment has been confirmed.</p>`);
				_push(ssrRenderComponent(_component_NuxtLink, {
					to: "/dashboard/payment",
					class: "mt-6 inline-flex rounded-full bg-cyan-400 px-5 py-3 font-semibold text-slate-950"
				}, {
					default: withCtx((_, _push, _parent, _scopeId) => {
						if (_push) _push(`Go to payment`);
						else return [createTextVNode("Go to payment")];
					}),
					_: 1
				}, _parent));
				_push(`</div>`);
			} else _push(`<article id="invoice" class="glass-card mt-8 rounded-[2rem] p-5 sm:p-7"><div class="flex flex-wrap justify-between gap-5 border-b border-white/10 pb-6"><div><p class="text-sm text-slate-400">${ssrInterpolate(unref(invoice).registration.event_name)}</p><p class="mt-1 font-semibold">Invoice ${ssrInterpolate(unref(invoice).order.order_number)}</p></div><span class="h-fit rounded-full bg-emerald-300/10 px-4 py-2 text-xs font-semibold uppercase tracking-[.2em] text-emerald-200">Paid</span></div><dl class="mt-6 grid gap-5 sm:grid-cols-2"><div><dt class="text-xs uppercase tracking-[.2em] text-slate-500">Registration number</dt><dd class="mt-2 text-lg font-semibold">${ssrInterpolate(unref(invoice).registration.registration_number)}</dd></div><div><dt class="text-xs uppercase tracking-[.2em] text-slate-500">Participant</dt><dd class="mt-2 text-lg font-semibold">${ssrInterpolate(unref(invoice).participant.full_name)}</dd><p class="text-sm text-slate-400">${ssrInterpolate(unref(invoice).participant.email)}</p></div><div><dt class="text-xs uppercase tracking-[.2em] text-slate-500">Delegate package</dt><dd class="mt-2 text-lg font-semibold">${ssrInterpolate(unref(invoice).registration.delegate_package_name || unref(invoice).registration.ticket_type_name || "-")}</dd></div><div><dt class="text-xs uppercase tracking-[.2em] text-slate-500">Payment status</dt><dd class="mt-2 text-lg font-semibold text-emerald-300">Paid</dd><p class="text-sm text-slate-400">${ssrInterpolate(formatDate(unref(invoice).payment.paid_at))}</p></div></dl><div class="mt-7 flex items-center justify-between border-t border-white/10 pt-6"><span class="text-slate-400">Total paid</span><strong class="text-2xl text-cyan-200">${ssrInterpolate(formatCurrency(unref(invoice).order.total_amount, unref(invoice).order.currency))}</strong></div><button class="mt-7 w-full rounded-full bg-cyan-400 px-5 py-3 font-semibold text-slate-950 disabled:cursor-not-allowed disabled:opacity-60 print:hidden sm:w-auto"${ssrIncludeBooleanAttr(unref(downloading)) ? " disabled" : ""}>${ssrInterpolate(unref(downloading) ? "Preparing PDF..." : "Download invoice PDF")}</button></article>`);
			_push(`</section>`);
		};
	}
});
//#endregion
//#region app/pages/dashboard/invoice.vue
var _sfc_setup = invoice_vue_vue_type_script_setup_true_lang_default.setup;
invoice_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/dashboard/invoice.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var invoice_default = invoice_vue_vue_type_script_setup_true_lang_default;

export { invoice_default as default };
//# sourceMappingURL=invoice-DG_qzHar.mjs.map
