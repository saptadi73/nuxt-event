globalThis.__timing__.logStart('Load chunks/build/payment-DC6fTX3h');import { _ as _plugin_vue_export_helper_default, c as useSeoMeta$1, N as NuxtLink } from '../virtual/entry.mjs';
import { u as usePayment } from './usePayment-Bc46Nipp.mjs';
import { u as useRegistration } from './useRegistration-CYl8EOu6.mjs';
import { defineComponent, ref, reactive, mergeProps, unref, withCtx, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrRenderClass, ssrIncludeBooleanAttr, ssrRenderAttr, ssrInterpolate } from 'vue/server-renderer';
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
		useSeoMeta$1({ title: "Payment | IWBIF 2026" });
		usePayment();
		useRegistration();
		const loading = ref(true), submitting = ref(false), paid = ref(false), copied = ref(false), needsOtp = ref(false);
		const registrationId = ref(""), activePaymentId = ref(""), errorMessage = ref(""), requestId = ref(""), qrImage = ref(""), phoneNo = ref(""), deviceId = ref(""), bindingId = ref(""), otp = ref("");
		const methods = ref([]), selected = ref(null), va = ref(null), qris = ref(null);
		const brokenLogos = reactive(/* @__PURE__ */ new Set());
		const direct = ref({
			virtual_accounts: [],
			qris: false
		});
		const isSupported = (method) => method.category === "virtual_account" ? direct.value.virtual_accounts.map((code) => code.toUpperCase()).includes(method.code.toUpperCase()) : method.category === "qris" ? direct.value.qris : method.category === "direct_debit";
		const categoryLabel = (value) => ({
			virtual_account: "Virtual Account",
			qris: "QRIS",
			e_wallet: "e-Wallet",
			direct_debit: "Direct Debit"
		})[value] || value;
		const money = (amount, code) => new Intl.NumberFormat("id-ID", {
			style: "currency",
			currency: code || "IDR",
			maximumFractionDigits: 0
		}).format(amount);
		const formatDate = (value) => new Intl.DateTimeFormat("en-GB", {
			dateStyle: "medium",
			timeStyle: "short"
		}).format(new Date(value));
		return (_ctx, _push, _parent, _attrs) => {
			const _component_NuxtLink = NuxtLink;
			_push(`<section${ssrRenderAttrs(mergeProps({ class: "mx-auto max-w-4xl px-3 py-10 sm:px-6" }, _attrs))} data-v-5f8971a7><div class="glass-card rounded-[2rem] p-4 sm:p-7" data-v-5f8971a7><p class="text-sm uppercase tracking-[.3em] text-amber-200" data-v-5f8971a7>Secure payment</p><h1 class="mt-3 text-3xl font-black sm:text-4xl" data-v-5f8971a7>Choose payment method</h1><p class="mt-3 text-sm text-slate-300" data-v-5f8971a7>The backend determines the final amount from your delegate package.</p>`);
			if (unref(loading)) _push(`<p class="mt-8 text-slate-300" data-v-5f8971a7>Checking registration and active payment channels…</p>`);
			else if (unref(paid)) {
				_push(`<div class="mt-8 rounded-2xl border border-emerald-300/20 bg-emerald-300/5 p-5" data-v-5f8971a7><p class="text-lg font-semibold text-emerald-300" data-v-5f8971a7>Payment received</p><p class="mt-2 text-sm text-slate-300" data-v-5f8971a7>Organizer confirmation is handled separately.</p>`);
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
			} else if (!unref(registrationId)) _push(`<div class="notice" data-v-5f8971a7>No registration eligible for payment was found.</div>`);
			else if (!unref(methods).length) _push(`<div class="notice" data-v-5f8971a7>Payment methods are not available yet. Please try again later.</div>`);
			else {
				_push(`<!--[--><div class="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3" data-v-5f8971a7><!--[-->`);
				ssrRenderList(unref(methods), (method) => {
					_push(`<button type="button" class="${ssrRenderClass([unref(selected)?.id === method.id ? "border-amber-300 bg-amber-300/10" : "border-white/10 bg-white/5 hover:border-white/30", "flex min-h-24 items-center gap-4 rounded-2xl border p-4 text-left transition disabled:cursor-not-allowed disabled:opacity-50"])}"${ssrIncludeBooleanAttr(!isSupported(method)) ? " disabled" : ""} data-v-5f8971a7>`);
					if (method.logo_url && !unref(brokenLogos).has(method.id)) _push(`<img${ssrRenderAttr("src", method.logo_url)}${ssrRenderAttr("alt", method.display_name)} class="h-10 w-14 rounded bg-white object-contain p-1" data-v-5f8971a7>`);
					else _push(`<span class="flex h-10 w-14 items-center justify-center rounded bg-white/10 text-xs font-bold" data-v-5f8971a7>${ssrInterpolate(method.code)}</span>`);
					_push(`<span data-v-5f8971a7><strong class="block" data-v-5f8971a7>${ssrInterpolate(method.display_name)}</strong><small class="mt-1 block text-slate-400" data-v-5f8971a7>${ssrInterpolate(categoryLabel(method.category))}`);
					if (!isSupported(method)) _push(`<!--[--> · Coming soon<!--]-->`);
					else _push(`<!---->`);
					_push(`</small></span></button>`);
				});
				_push(`<!--]--></div>`);
				if (unref(selected)?.category === "direct_debit") _push(`<div class="mt-6 max-w-md space-y-3" data-v-5f8971a7><label class="block text-sm text-slate-300" data-v-5f8971a7>Mobile number registered with the bank<input${ssrRenderAttr("value", unref(phoneNo))} inputmode="tel" autocomplete="tel" placeholder="628123456789" class="mt-2 w-full rounded-xl border border-white/10 bg-slate-950/50 px-4 py-3 text-white" data-v-5f8971a7></label><label class="block text-sm text-slate-300" data-v-5f8971a7>Device ID <span class="text-slate-500" data-v-5f8971a7>(optional)</span><input${ssrRenderAttr("value", unref(deviceId))} class="mt-2 w-full rounded-xl border border-white/10 bg-slate-950/50 px-4 py-3 text-white" data-v-5f8971a7></label></div>`);
				else _push(`<!---->`);
				_push(`<button class="mt-6 w-full rounded-full bg-amber-300 px-6 py-3 font-semibold text-slate-950 disabled:opacity-50 sm:w-auto"${ssrIncludeBooleanAttr(!unref(selected) || unref(submitting) || unref(selected).category === "direct_debit" && !unref(phoneNo)) ? " disabled" : ""} data-v-5f8971a7>${ssrInterpolate(unref(submitting) ? "Preparing payment…" : "Continue")}</button><!--]-->`);
			}
			if (unref(va)) {
				_push(`<div class="mt-8 rounded-2xl border border-amber-300/20 bg-white/5 p-5" data-v-5f8971a7><p class="text-sm text-slate-400" data-v-5f8971a7>${ssrInterpolate(unref(va).bank_code)} Virtual Account</p><p class="mt-2 break-all text-2xl font-black text-amber-200" data-v-5f8971a7>${ssrInterpolate(unref(va).virtual_account_no)}</p><p class="mt-3" data-v-5f8971a7>${ssrInterpolate(money(unref(va).amount, unref(va).currency))}`);
				if (unref(va).expires_at) _push(`<span class="text-slate-400" data-v-5f8971a7> · Expires ${ssrInterpolate(formatDate(unref(va).expires_at))}</span>`);
				else _push(`<!---->`);
				_push(`</p><div class="mt-4 flex flex-wrap gap-3" data-v-5f8971a7><button class="rounded-full bg-amber-300 px-5 py-2 font-semibold text-slate-950" data-v-5f8971a7>${ssrInterpolate(unref(copied) ? "Copied" : "Copy VA number")}</button>`);
				if (unref(va).instructions_url) _push(`<a${ssrRenderAttr("href", unref(va).instructions_url)} target="_blank" rel="noopener noreferrer" class="rounded-full border border-white/20 px-5 py-2" data-v-5f8971a7>Payment instructions</a>`);
				else _push(`<!---->`);
				_push(`</div></div>`);
			} else _push(`<!---->`);
			if (unref(qris)) {
				_push(`<div class="mt-8 rounded-2xl border border-amber-300/20 bg-white/5 p-5 text-center" data-v-5f8971a7><p class="font-semibold" data-v-5f8971a7>Scan this QRIS code</p>`);
				if (unref(qrImage)) _push(`<img${ssrRenderAttr("src", unref(qrImage))} alt="QRIS payment code" class="mx-auto mt-4 w-64 rounded-xl bg-white p-3" data-v-5f8971a7>`);
				else _push(`<!---->`);
				_push(`<p class="mt-3" data-v-5f8971a7>${ssrInterpolate(money(unref(qris).amount, unref(qris).currency))}</p>`);
				if (unref(qris).expires_at) _push(`<p class="mt-1 text-sm text-slate-400" data-v-5f8971a7>Expires ${ssrInterpolate(formatDate(unref(qris).expires_at))}</p>`);
				else _push(`<!---->`);
				_push(`</div>`);
			} else _push(`<!---->`);
			if (unref(selected)?.category === "direct_debit" && unref(bindingId) && !unref(activePaymentId)) _push(`<div class="mt-8 rounded-2xl border border-amber-300/20 bg-white/5 p-5" data-v-5f8971a7><p class="font-semibold" data-v-5f8971a7>Bank account authorization</p><p class="mt-2 text-sm text-slate-300" data-v-5f8971a7>Complete the bank authorization, then continue to create the payment.</p><button class="mt-4 rounded-full bg-amber-300 px-5 py-2 font-semibold text-slate-950 disabled:opacity-50"${ssrIncludeBooleanAttr(unref(submitting)) ? " disabled" : ""} data-v-5f8971a7>Continue payment</button></div>`);
			else _push(`<!---->`);
			if (unref(needsOtp)) _push(`<div class="mt-8 max-w-md rounded-2xl border border-amber-300/20 bg-white/5 p-5" data-v-5f8971a7><label class="block text-sm text-slate-300" data-v-5f8971a7>Bank OTP<input${ssrRenderAttr("value", unref(otp))} inputmode="numeric" autocomplete="one-time-code" class="mt-2 w-full rounded-xl border border-white/10 bg-slate-950/50 px-4 py-3 text-white" data-v-5f8971a7></label><button class="mt-4 rounded-full bg-amber-300 px-5 py-2 font-semibold text-slate-950 disabled:opacity-50"${ssrIncludeBooleanAttr(unref(submitting) || !unref(otp)) ? " disabled" : ""} data-v-5f8971a7>Submit OTP</button></div>`);
			else _push(`<!---->`);
			if (unref(activePaymentId)) _push(ssrRenderComponent(_component_NuxtLink, {
				to: `/dashboard/payment-status?payment_id=${unref(activePaymentId)}&registration_id=${unref(registrationId)}`,
				class: "mt-5 inline-flex rounded-full border border-white/20 px-5 py-3"
			}, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`Check payment status`);
					else return [createTextVNode("Check payment status")];
				}),
				_: 1
			}, _parent));
			else _push(`<!---->`);
			if (unref(errorMessage)) {
				_push(`<div class="mt-5 rounded-2xl border border-red-400/30 bg-red-950/30 p-4 text-sm text-red-100" data-v-5f8971a7><p data-v-5f8971a7>${ssrInterpolate(unref(errorMessage))}</p>`);
				if (unref(requestId)) _push(`<p class="mt-2 text-xs opacity-70" data-v-5f8971a7>Reference: ${ssrInterpolate(unref(requestId))}</p>`);
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
var payment_default = /*#__PURE__*/ _plugin_vue_export_helper_default(payment_vue_vue_type_script_setup_true_lang_default, [["__scopeId", "data-v-5f8971a7"]]);

export { payment_default as default };;globalThis.__timing__.logEnd('Load chunks/build/payment-DC6fTX3h');
//# sourceMappingURL=payment-DC6fTX3h.mjs.map
