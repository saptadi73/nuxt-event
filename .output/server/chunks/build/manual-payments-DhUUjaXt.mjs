import { u as useSeoMeta$1 } from './head-D-xrF-Fu.mjs';
import { _ as _plugin_vue_export_helper_default, N as NuxtLink } from '../virtual/entry.mjs';
import { u as useAdminReport } from './useAdminReport-CUb4ebGl.mjs';
import { defineComponent, reactive, ref, mergeProps, withCtx, createTextVNode, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderAttr, ssrInterpolate, ssrRenderClass } from 'vue/server-renderer';
import 'nostics';
import 'unhead/plugins';
import 'unhead/utils';
import '../routes/renderer.mjs';
import '../_/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import 'unhead/server';
import 'unhead/legacy';
import 'vue-bundle-renderer/runtime';
import 'devalue';
import 'nostics/formatters/ansi';
import 'vue-router';
import '@vue/shared';

//#region app/pages/admin/manual-payments.vue?vue&type=script&setup=true&lang.ts
var manual_payments_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "manual-payments",
	__ssrInlineRender: true,
	setup(__props) {
		useSeoMeta$1({ title: "Confirm Manual Payment | IWBIF 2026" });
		useAdminReport();
		const form = reactive({
			payment_method: "manual_transfer",
			orderId: "",
			transfer_reference: "",
			notes: "",
			paid_at: ""
		});
		const confirmed = ref(false);
		const submitting = ref(false);
		const feedback = ref("");
		const requestId = ref("");
		const feedbackTone = ref("success");
		return (_ctx, _push, _parent, _attrs) => {
			const _component_NuxtLink = NuxtLink;
			_push(`<section${ssrRenderAttrs(mergeProps({ class: "mx-auto max-w-5xl px-3 py-10 sm:px-6 lg:px-8" }, _attrs))} data-v-ea3caa2d><div class="flex flex-wrap items-end justify-between gap-5" data-v-ea3caa2d><div data-v-ea3caa2d><p class="text-sm uppercase tracking-[.3em] text-amber-200" data-v-ea3caa2d>Organizer payment desk</p><h1 class="mt-3 text-3xl font-black sm:text-4xl" data-v-ea3caa2d>Confirm Manual Payment</h1><p class="mt-3 max-w-3xl text-sm leading-7 text-slate-300" data-v-ea3caa2d>Confirm a bank transfer or direct QR payment only after matching the amount and transaction reference. The backend will create the appropriate manual payment record and mark the order as paid.</p></div>`);
			_push(ssrRenderComponent(_component_NuxtLink, {
				to: "/admin/reports",
				class: "rounded-full border border-white/20 px-5 py-3 text-sm font-semibold"
			}, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`Open sales report`);
					else return [createTextVNode("Open sales report")];
				}),
				_: 1
			}, _parent));
			_push(`</div><div class="mt-8 grid gap-6 lg:grid-cols-[1fr_22rem]" data-v-ea3caa2d><form class="glass-card rounded-[2rem] p-5 sm:p-7" data-v-ea3caa2d><div class="rounded-2xl border border-amber-300/20 bg-amber-300/5 p-4 text-sm leading-6 text-amber-100" data-v-ea3caa2d><strong data-v-ea3caa2d>Verification required.</strong> This action changes the backend order to paid. Confirm the bank mutation before submitting.</div><div class="mt-6 space-y-5" data-v-ea3caa2d><label class="field" data-v-ea3caa2d><span data-v-ea3caa2d>Payment method</span><select required data-v-ea3caa2d><option value="manual_transfer" data-v-ea3caa2d${ssrIncludeBooleanAttr(Array.isArray(unref(form).payment_method) ? ssrLooseContain(unref(form).payment_method, "manual_transfer") : ssrLooseEqual(unref(form).payment_method, "manual_transfer")) ? " selected" : ""}>Manual Bank Transfer</option><option value="manual_qr_code" data-v-ea3caa2d${ssrIncludeBooleanAttr(Array.isArray(unref(form).payment_method) ? ssrLooseContain(unref(form).payment_method, "manual_qr_code") : ssrLooseEqual(unref(form).payment_method, "manual_qr_code")) ? " selected" : ""}>Manual QR Code Payment</option></select></label><label class="field" data-v-ea3caa2d><span data-v-ea3caa2d>Order ID</span><input${ssrRenderAttr("value", unref(form).orderId)} required placeholder="Order UUID" autocomplete="off" data-v-ea3caa2d></label><label class="field" data-v-ea3caa2d><span data-v-ea3caa2d>${ssrInterpolate(unref(form).payment_method === "manual_qr_code" ? "QR transaction reference" : "Transfer reference")}</span><input${ssrRenderAttr("value", unref(form).transfer_reference)} required minlength="3" maxlength="128"${ssrRenderAttr("placeholder", unref(form).payment_method === "manual_qr_code" ? "QR-TRANSACTION-REFERENCE" : "BCA-20260819-001")} autocomplete="off" data-v-ea3caa2d></label><label class="field" data-v-ea3caa2d><span data-v-ea3caa2d>Paid at <small data-v-ea3caa2d>(optional)</small></span><input${ssrRenderAttr("value", unref(form).paid_at)} type="datetime-local" data-v-ea3caa2d></label><label class="field" data-v-ea3caa2d><span data-v-ea3caa2d>Verification notes <small data-v-ea3caa2d>(optional)</small></span><textarea rows="4" maxlength="1000" placeholder="Bank statement checked by organizer" data-v-ea3caa2d>${ssrInterpolate(unref(form).notes)}</textarea></label><label class="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm leading-6 text-slate-300" data-v-ea3caa2d><input${ssrIncludeBooleanAttr(Array.isArray(unref(confirmed)) ? ssrLooseContain(unref(confirmed), null) : unref(confirmed)) ? " checked" : ""} type="checkbox" class="mt-1 h-4 w-4 accent-amber-300" data-v-ea3caa2d><span data-v-ea3caa2d>I have verified the recipient, amount, order, and transaction reference.</span></label><button class="w-full rounded-full bg-amber-300 px-6 py-3 font-bold text-slate-950 disabled:cursor-not-allowed disabled:opacity-50"${ssrIncludeBooleanAttr(unref(submitting) || !unref(confirmed)) ? " disabled" : ""} data-v-ea3caa2d>${ssrInterpolate(unref(submitting) ? "Confirming payment..." : "Confirm manual payment")}</button></div></form><aside class="glass-card h-fit rounded-[2rem] p-6" data-v-ea3caa2d><p class="text-xs font-bold uppercase tracking-[.22em] text-slate-400" data-v-ea3caa2d>What happens next</p><ol class="mt-5 space-y-4 text-sm leading-6 text-slate-300" data-v-ea3caa2d><li data-v-ea3caa2d>1. A <strong data-v-ea3caa2d>${ssrInterpolate(unref(form).payment_method)}</strong> payment record is created.</li><li data-v-ea3caa2d>2. The order status changes to paid.</li><li data-v-ea3caa2d>3. A linked registration is updated when applicable.</li><li data-v-ea3caa2d>4. Repeating the same valid confirmation is handled idempotently.</li></ol></aside></div>`);
			if (unref(feedback)) {
				_push(`<div class="${ssrRenderClass([unref(feedbackTone) === "error" ? "border-red-400/30 bg-red-950/30 text-red-100" : "border-emerald-300/30 bg-emerald-950/30 text-emerald-100", "mt-6 rounded-2xl border p-5 text-sm"])}" data-v-ea3caa2d><p class="font-bold" data-v-ea3caa2d>${ssrInterpolate(unref(feedbackTone) === "error" ? "Confirmation failed" : "Payment confirmed")}</p><p class="mt-2" data-v-ea3caa2d>${ssrInterpolate(unref(feedback))}</p>`);
				if (unref(requestId)) _push(`<p class="mt-2 text-xs opacity-70" data-v-ea3caa2d>Reference: ${ssrInterpolate(unref(requestId))}</p>`);
				else _push(`<!---->`);
				_push(`</div>`);
			} else _push(`<!---->`);
			_push(`</section>`);
		};
	}
});
//#endregion
//#region app/pages/admin/manual-payments.vue
var _sfc_setup = manual_payments_vue_vue_type_script_setup_true_lang_default.setup;
manual_payments_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin/manual-payments.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var manual_payments_default = /*#__PURE__*/ _plugin_vue_export_helper_default(manual_payments_vue_vue_type_script_setup_true_lang_default, [["__scopeId", "data-v-ea3caa2d"]]);

export { manual_payments_default as default };
//# sourceMappingURL=manual-payments-DhUUjaXt.mjs.map
