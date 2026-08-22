import { c as useRoute, N as NuxtLink } from '../virtual/entry.mjs';
import { u as useSeoMeta$1 } from './head-D-xrF-Fu.mjs';
import { u as usePayment } from './usePayment-C_Rsx3yc.mjs';
import { defineComponent, ref, computed, mergeProps, unref, withCtx, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderList, ssrRenderComponent } from 'vue/server-renderer';
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

//#region app/pages/dashboard/payment-manual.vue?vue&type=script&setup=true&lang.ts
var payment_manual_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "payment-manual",
	__ssrInlineRender: true,
	setup(__props) {
		useSeoMeta$1({ title: "Manual Bank Transfer | IWBIF 2026" });
		useRoute();
		usePayment();
		const orderId = ref("");
		const order = ref(null);
		const loading = ref(true);
		const errorMessage = ref("");
		const bankDetails = computed(() => [
			{
				label: "Account Name",
				value: "Pers. Ikatan Wanita Pengusaha Indonesia"
			},
			{
				label: "Account Number",
				value: "1260010014735"
			},
			{
				label: "Bank Name",
				value: "PT Bank Mandiri (Persero) Tbk."
			},
			{
				label: "SWIFT Code / BIC",
				value: "BMRIIDJA"
			},
			{
				label: "Bank Address",
				value: "Jl. Jend. Gatot Subroto 36-38, Jakarta 12190, Indonesia"
			},
			{
				label: "Beneficiary Address",
				value: "Jl Kali Pasir No. 38 RT 9, RW 1, Cikini, Menteng, Jakarta Pusat, DKI Jakarta"
			},
			{
				label: "Payment reference",
				value: order.value?.order_number || orderId.value || "-"
			}
		]);
		const money = (amount, currency) => new Intl.NumberFormat("id-ID", {
			style: "currency",
			currency,
			maximumFractionDigits: 0
		}).format(amount);
		return (_ctx, _push, _parent, _attrs) => {
			const _component_NuxtLink = NuxtLink;
			_push(`<section${ssrRenderAttrs(mergeProps({ class: "mx-auto max-w-4xl px-3 py-10 sm:px-6" }, _attrs))}><div class="glass-card overflow-hidden rounded-[2rem] border border-amber-300/20"><div class="bg-gradient-to-r from-amber-300/15 via-transparent to-cyan-300/10 p-5 sm:p-8"><p class="text-xs font-bold uppercase tracking-[.3em] text-amber-200">Manual Bank Transfer</p><h1 class="mt-4 text-3xl font-black sm:text-4xl">Transfer instructions</h1><p class="mt-3 max-w-2xl text-sm leading-7 text-slate-300">Transfer the exact order amount and include your order number as the payment reference. Your order remains pending until the organizer verifies the bank transaction.</p></div><div class="p-5 sm:p-8"><div class="rounded-2xl border border-amber-300/25 bg-amber-300/5 p-4 text-sm leading-6 text-amber-100"><strong>Important.</strong> Verify the beneficiary name and transfer the exact order amount. Keep the receipt for organizer verification.</div>`);
			if (unref(loading)) _push(`<p class="mt-6 text-slate-300">Loading order...</p>`);
			else if (unref(errorMessage)) _push(`<div class="mt-6 rounded-2xl border border-red-400/30 bg-red-950/30 p-4 text-red-100">${ssrInterpolate(unref(errorMessage))}</div>`);
			else {
				_push(`<!--[--><dl class="mt-6 grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 sm:grid-cols-2"><!--[-->`);
				ssrRenderList(unref(bankDetails), (detail) => {
					_push(`<div class="bg-slate-950/75 p-5"><dt class="text-xs uppercase tracking-[.18em] text-slate-500">${ssrInterpolate(detail.label)}</dt><dd class="mt-2 break-words text-lg font-bold text-white">${ssrInterpolate(detail.value)}</dd></div>`);
				});
				_push(`<!--]--></dl><div class="mt-6 rounded-2xl border border-amber-300/20 bg-amber-300/5 p-5"><p class="text-sm text-slate-400">Exact transfer amount</p><p class="mt-2 text-3xl font-black text-amber-200">${ssrInterpolate(money(unref(order)?.total_amount || 0, unref(order)?.currency || "IDR"))}</p></div><ol class="mt-7 space-y-3 text-sm leading-7 text-slate-300"><li>1. Open your bank&#39;s mobile banking or internet banking service.</li><li>2. Transfer the exact amount to the account shown above.</li><li>3. Enter the order number in the payment reference or transfer notes.</li><li>4. Keep your transfer receipt for organizer verification.</li></ol><div class="mt-6 rounded-2xl border border-amber-300/20 bg-amber-300/5 p-4 text-sm leading-6 text-amber-100">Payment status: <strong>Pending verification</strong>. Only an authorized admin or organizer can confirm a manual transfer.</div><!--]-->`);
			}
			_push(`<div class="mt-8 flex flex-col gap-3 sm:flex-row">`);
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
				class: "rounded-full bg-amber-300 px-6 py-3 text-center font-bold text-slate-950"
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
//#region app/pages/dashboard/payment-manual.vue
var _sfc_setup = payment_manual_vue_vue_type_script_setup_true_lang_default.setup;
payment_manual_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/dashboard/payment-manual.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var payment_manual_default = payment_manual_vue_vue_type_script_setup_true_lang_default;

export { payment_manual_default as default };
//# sourceMappingURL=payment-manual-DYSEXEQe.mjs.map
