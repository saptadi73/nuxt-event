globalThis.__timing__.logStart('Load chunks/build/payment-status-DxGUtF9_');import { u as usePayment } from './usePayment-B2J8chqq.mjs';
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

//#region app/pages/dashboard/payment-status.vue?vue&type=script&setup=true&lang.ts
var payment_status_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "payment-status",
	__ssrInlineRender: true,
	setup(__props) {
		usePayment();
		const orderId = ref("");
		const paymentId = ref("");
		const checking = ref(false);
		const order = ref(null);
		const payment = ref(null);
		const error = ref("");
		const formatCurrency = (value) => new Intl.NumberFormat("id-ID", {
			style: "currency",
			currency: "IDR",
			maximumFractionDigits: 0
		}).format(value);
		const formatDate = (value) => {
			if (!value) return "-";
			return new Intl.DateTimeFormat("id-ID", {
				day: "2-digit",
				month: "short",
				year: "numeric",
				hour: "2-digit",
				minute: "2-digit"
			}).format(new Date(value));
		};
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<section${ssrRenderAttrs(mergeProps({ class: "mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8" }, _attrs))}><div class="glass-card rounded-[2rem] p-6"><p class="text-sm uppercase tracking-[0.3em] text-cyan-200/70">Payment Status</p><h1 class="mt-3 text-4xl font-bold text-white">Monitoring status pembayaran</h1><p class="mt-3 text-slate-300"> Cek status terbaru dari \`GET /orders/{order_id}\` dan \`GET /payments/{payment_id}\` sesuai API. </p><div class="mt-8 grid gap-4 md:grid-cols-[1fr_1fr_auto] md:items-end"><label class="grid gap-2"><span class="text-sm text-slate-300">Order ID</span><input${ssrRenderAttr("value", unref(orderId))} class="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none" placeholder="uuid"></label><label class="grid gap-2"><span class="text-sm text-slate-300">Payment ID</span><input${ssrRenderAttr("value", unref(paymentId))} class="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none" placeholder="uuid"></label><button class="rounded-full bg-cyan-400 px-6 py-3 text-sm font-semibold text-slate-950"${ssrIncludeBooleanAttr(unref(checking)) ? " disabled" : ""}>${ssrInterpolate(unref(checking) ? "Memuat..." : "Cek Status")}</button></div><div class="mt-6 grid gap-4 md:grid-cols-2"><article class="rounded-[1.5rem] border border-white/10 bg-white/5 p-4"><p class="text-xs uppercase tracking-[0.25em] text-slate-400">Order</p>`);
			if (unref(order)) _push(`<div><p class="mt-2 text-white font-semibold">${ssrInterpolate(unref(order).order_number)}</p><p class="mt-2 text-sm text-slate-300">Status: ${ssrInterpolate(unref(order).status)}</p><p class="mt-1 text-sm text-slate-300">Subtotal: ${ssrInterpolate(formatCurrency(unref(order).subtotal))}</p><p class="mt-1 text-sm text-slate-300">Total: ${ssrInterpolate(formatCurrency(unref(order).total_amount))}</p><p class="mt-1 text-sm text-slate-300">Expires: ${ssrInterpolate(formatDate(unref(order).expires_at))}</p></div>`);
			else _push(`<p class="mt-2 text-sm text-slate-300">Belum query order.</p>`);
			_push(`</article><article class="rounded-[1.5rem] border border-white/10 bg-white/5 p-4"><p class="text-xs uppercase tracking-[0.25em] text-slate-400">Payment</p>`);
			if (unref(payment)) _push(`<div><p class="mt-2 text-white font-semibold">${ssrInterpolate(unref(payment).provider)}</p><p class="mt-2 text-sm text-slate-300">Status: ${ssrInterpolate(unref(payment).transaction_status)}</p><p class="mt-1 text-sm text-slate-300">Fraud: ${ssrInterpolate(unref(payment).fraud_status || "-")}</p><p class="mt-1 text-sm text-slate-300">Amount: ${ssrInterpolate(formatCurrency(unref(payment).gross_amount))}</p><p class="mt-1 text-sm text-slate-300">Paid At: ${ssrInterpolate(formatDate(unref(payment).paid_at))}</p></div>`);
			else _push(`<p class="mt-2 text-sm text-slate-300">Belum query payment.</p>`);
			_push(`</article></div>`);
			if (unref(error)) _push(`<p class="mt-4 text-sm text-red-200">Error: ${ssrInterpolate(unref(error))}</p>`);
			else _push(`<!---->`);
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

export { payment_status_default as default };;globalThis.__timing__.logEnd('Load chunks/build/payment-status-DxGUtF9_');
//# sourceMappingURL=payment-status-DxGUtF9_.mjs.map
