import { u as useSeoMeta$1 } from './head-D-xrF-Fu.mjs';
import { N as NuxtLink } from '../virtual/entry.mjs';
import { u as useEvent } from './useEvent-B_Up9ELJ.mjs';
import { u as useStore } from './useStore-1GY6e7uC.mjs';
import { defineComponent, ref, computed, mergeProps, withCtx, createTextVNode, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderList, ssrIncludeBooleanAttr } from 'vue/server-renderer';
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

//#region app/pages/dashboard/cart.vue?vue&type=script&setup=true&lang.ts
var cart_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "cart",
	__ssrInlineRender: true,
	setup(__props) {
		useSeoMeta$1({ title: "Shopping Cart | IWBIF 2026" });
		useEvent();
		useStore();
		ref("");
		const cart = ref(null);
		const loading = ref(true), checkingOut = ref(false), removingId = ref(""), errorMessage = ref("");
		const items = computed(() => cart.value?.items || []);
		const itemCount = computed(() => items.value.reduce((total, item) => total + item.quantity, 0));
		const total = computed(() => cart.value?.total_amount ?? cart.value?.subtotal ?? items.value.reduce((sum, item) => sum + (item.subtotal ?? (item.unit_price || 0) * item.quantity), 0));
		const money = (amount, currency) => new Intl.NumberFormat("id-ID", {
			style: "currency",
			currency: currency || "IDR",
			maximumFractionDigits: 0
		}).format(amount || 0);
		return (_ctx, _push, _parent, _attrs) => {
			const _component_NuxtLink = NuxtLink;
			_push(`<section${ssrRenderAttrs(mergeProps({ class: "mx-auto max-w-5xl px-3 py-10 sm:px-6" }, _attrs))}><div class="flex flex-wrap items-end justify-between gap-4"><div><p class="text-sm uppercase tracking-[.3em] text-amber-200">Shopping cart</p><h1 class="mt-3 text-3xl font-black sm:text-4xl">Review your packages</h1><p class="mt-3 text-sm text-slate-300">Prices and totals are calculated by the backend at checkout.</p></div>`);
			_push(ssrRenderComponent(_component_NuxtLink, {
				to: "/tickets",
				class: "rounded-full border border-white/20 px-5 py-3 text-sm font-semibold"
			}, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`Add another package`);
					else return [createTextVNode("Add another package")];
				}),
				_: 1
			}, _parent));
			_push(`</div>`);
			if (unref(loading)) _push(`<div class="glass-card mt-8 rounded-[2rem] p-7 text-slate-300">Loading your cart...</div>`);
			else if (unref(errorMessage)) _push(`<div class="mt-8 rounded-3xl border border-red-400/30 bg-red-950/30 p-6 text-red-100">${ssrInterpolate(unref(errorMessage))}</div>`);
			else if (!unref(items).length) {
				_push(`<div class="glass-card mt-8 rounded-[2rem] p-7"><h2 class="text-xl font-bold">Your cart is empty</h2><p class="mt-2 text-slate-400">Choose a delegate or exhibitor package to continue.</p>`);
				_push(ssrRenderComponent(_component_NuxtLink, {
					to: "/tickets",
					class: "mt-6 inline-flex rounded-full bg-amber-300 px-5 py-3 font-semibold text-slate-950"
				}, {
					default: withCtx((_, _push, _parent, _scopeId) => {
						if (_push) _push(`Browse packages`);
						else return [createTextVNode("Browse packages")];
					}),
					_: 1
				}, _parent));
				_push(`</div>`);
			} else {
				_push(`<div class="mt-8 grid gap-6 lg:grid-cols-[1fr_22rem]"><div class="space-y-4"><!--[-->`);
				ssrRenderList(unref(items), (item) => {
					_push(`<article class="glass-card flex flex-col gap-4 rounded-3xl p-5 sm:flex-row sm:items-center sm:justify-between"><div><p class="text-xs uppercase tracking-[.2em] text-amber-200">${ssrInterpolate(item.product?.product_type || "Package")}</p><h2 class="mt-2 text-xl font-bold">${ssrInterpolate(item.product?.name || item.product_name || item.name || "IWBIF Package")}</h2><p class="mt-2 text-sm text-slate-400">Quantity: ${ssrInterpolate(item.quantity)}</p></div><div class="sm:text-right"><p class="text-lg font-bold">${ssrInterpolate(money(item.subtotal ?? (item.unit_price || 0) * item.quantity, item.currency || item.product?.currency || unref(cart)?.currency || "IDR"))}</p><button class="mt-3 text-sm font-semibold text-red-300 disabled:opacity-50"${ssrIncludeBooleanAttr(unref(removingId) === item.product_id) ? " disabled" : ""}>${ssrInterpolate(unref(removingId) === item.product_id ? "Removing..." : "Remove")}</button></div></article>`);
				});
				_push(`<!--]--></div><aside class="glass-card h-fit rounded-[2rem] p-6"><p class="text-xs uppercase tracking-[.25em] text-slate-400">Order summary</p><div class="mt-5 flex justify-between text-sm text-slate-300"><span>Items</span><span>${ssrInterpolate(unref(itemCount))}</span></div><div class="mt-5 flex items-end justify-between border-t border-white/10 pt-5"><span class="text-slate-400">Total</span><strong class="text-2xl text-amber-200">${ssrInterpolate(money(unref(total), unref(cart)?.currency || unref(items)[0]?.currency || unref(items)[0]?.product?.currency || "IDR"))}</strong></div><button class="mt-6 w-full rounded-full bg-amber-300 px-5 py-3 font-bold text-slate-950 disabled:cursor-not-allowed disabled:opacity-60"${ssrIncludeBooleanAttr(unref(checkingOut)) ? " disabled" : ""}>${ssrInterpolate(unref(checkingOut) ? "Creating order..." : "Proceed to checkout")}</button><p class="mt-3 text-xs leading-5 text-slate-500">The backend validates availability, quantity, currency, and final price.</p></aside></div>`);
			}
			_push(`</section>`);
		};
	}
});
//#endregion
//#region app/pages/dashboard/cart.vue
var _sfc_setup = cart_vue_vue_type_script_setup_true_lang_default.setup;
cart_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/dashboard/cart.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var cart_default = cart_vue_vue_type_script_setup_true_lang_default;

export { cart_default as default };
//# sourceMappingURL=cart-N3pFqomG.mjs.map
