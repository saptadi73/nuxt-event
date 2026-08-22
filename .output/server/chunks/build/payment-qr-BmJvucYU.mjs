import { c as useRoute, N as NuxtLink } from '../virtual/entry.mjs';
import { u as useSeoMeta$1 } from './head-D-xrF-Fu.mjs';
import { u as usePayment } from './usePayment-C_Rsx3yc.mjs';
import { defineComponent, ref, mergeProps, unref, withCtx, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderAttr, ssrInterpolate, ssrRenderComponent } from 'vue/server-renderer';
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

//#region app/pages/dashboard/payment-qr.vue?vue&type=script&setup=true&lang.ts
var payment_qr_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "payment-qr",
	__ssrInlineRender: true,
	setup(__props) {
		useSeoMeta$1({ title: "Direct QR Code Pay | IWBIF 2026" });
		useRoute();
		usePayment();
		const orderId = ref("");
		const order = ref(null);
		const qrImage = ref("");
		const errorMessage = ref("");
		const money = (amount, currency) => new Intl.NumberFormat("id-ID", {
			style: "currency",
			currency,
			maximumFractionDigits: 0
		}).format(amount);
		return (_ctx, _push, _parent, _attrs) => {
			const _component_NuxtLink = NuxtLink;
			_push(`<section${ssrRenderAttrs(mergeProps({ class: "mx-auto max-w-4xl px-3 py-10 sm:px-6" }, _attrs))}><div class="glass-card grid overflow-hidden rounded-[2rem] border border-cyan-300/20 lg:grid-cols-[1fr_1.05fr]"><div class="flex items-center justify-center bg-gradient-to-br from-cyan-300/10 to-slate-950/70 p-6 sm:p-10"><div class="w-full max-w-sm rounded-[2rem] bg-[#fffaf0] p-5 text-center text-slate-950 shadow-2xl shadow-cyan-950/30"><p class="text-xs font-black uppercase tracking-[.25em] text-slate-500">Direct QR Code Pay</p><div class="mx-auto mt-5 aspect-square overflow-hidden rounded-2xl border border-slate-200 bg-white p-3">`);
			if (unref(qrImage)) _push(`<img${ssrRenderAttr("src", unref(qrImage))} alt="Temporary demo QR payment code" class="h-full w-full object-contain">`);
			else _push(`<div class="flex h-full items-center justify-center text-sm text-slate-500">Generating QR code...</div>`);
			_push(`</div><p class="mt-5 text-2xl font-black">${ssrInterpolate(money(unref(order)?.total_amount || 0, unref(order)?.currency || "IDR"))}</p><p class="mt-1 text-xs text-slate-500">${ssrInterpolate(unref(order)?.order_number || unref(orderId))}</p></div></div><div class="p-5 sm:p-8 lg:p-10"><p class="text-xs font-bold uppercase tracking-[.3em] text-cyan-200">Scan to pay</p><h1 class="mt-4 text-3xl font-black">Pay with your banking app</h1><p class="mt-4 text-base leading-8 text-slate-300">Scan this QR code using the QR payment channel in your mobile banking or supported bank payment application.</p><div class="mt-6 rounded-2xl border border-red-300/25 bg-red-950/25 p-4 text-sm leading-6 text-red-100"><strong>Demo QR only.</strong> This temporary code is for interface preview and cannot process a real payment.</div><ol class="mt-6 space-y-3 text-sm leading-7 text-slate-300"><li>1. Open your bank or payment application.</li><li>2. Select its QR payment or scan feature.</li><li>3. Scan the code and verify the order amount.</li><li>4. Keep the QR transaction reference for organizer verification.</li></ol><div class="mt-6 rounded-2xl border border-cyan-300/20 bg-cyan-300/5 p-4 text-sm leading-6 text-cyan-100">Payment status: <strong>Pending verification</strong>. A direct QR payment is considered paid only after an authorized admin confirms its transaction reference.</div>`);
			if (unref(errorMessage)) _push(`<div class="mt-5 rounded-2xl border border-red-400/30 bg-red-950/30 p-4 text-sm text-red-100">${ssrInterpolate(unref(errorMessage))}</div>`);
			else _push(`<!---->`);
			_push(`<div class="mt-8 flex flex-col gap-3">`);
			_push(ssrRenderComponent(_component_NuxtLink, {
				to: `/dashboard/payment?order_id=${encodeURIComponent(unref(orderId))}`,
				class: "rounded-full border border-white/20 px-6 py-3 text-center font-semibold"
			}, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`Choose another method`);
					else return [createTextVNode("Choose another method")];
				}),
				_: 1
			}, _parent));
			_push(ssrRenderComponent(_component_NuxtLink, {
				to: "/dashboard",
				class: "rounded-full bg-cyan-300 px-6 py-3 text-center font-bold text-slate-950"
			}, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`Return to dashboard`);
					else return [createTextVNode("Return to dashboard")];
				}),
				_: 1
			}, _parent));
			_push(`</div></div></div></section>`);
		};
	}
});
//#endregion
//#region app/pages/dashboard/payment-qr.vue
var _sfc_setup = payment_qr_vue_vue_type_script_setup_true_lang_default.setup;
payment_qr_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/dashboard/payment-qr.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var payment_qr_default = payment_qr_vue_vue_type_script_setup_true_lang_default;

export { payment_qr_default as default };
//# sourceMappingURL=payment-qr-BmJvucYU.mjs.map
