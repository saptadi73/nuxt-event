import { u as useSeoMeta$1 } from './head-D-xrF-Fu.mjs';
import { _ as _plugin_vue_export_helper_default, h as useRegistrationFlow, N as NuxtLink } from '../virtual/entry.mjs';
import { defineComponent, ref, computed, withAsyncContext, unref, mergeProps, withCtx, createTextVNode, createVNode, useSSRContext } from 'vue';
import { p as publicAssetsURL } from '../routes/renderer.mjs';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderComponent, ssrRenderAttr, ssrRenderList } from 'vue/server-renderer';
import 'nostics';
import 'unhead/plugins';
import 'unhead/utils';
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
import '@vue/shared';
import 'unhead/server';
import 'unhead/legacy';
import 'vue-bundle-renderer/runtime';
import 'devalue';

//#region \0virtual:public?%2Fimages%2Fbusiness-matching.png
var _virtual_public__2Fimages_2Fbusiness_matching_default = publicAssetsURL("/images/business-matching.png");
//#endregion
//#region app/pages/business-matching.vue?vue&type=script&setup=true&lang.ts
var business_matching_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "business-matching",
	__ssrInlineRender: true,
	async setup(__props) {
		let __temp, __restore;
		useSeoMeta$1({
			title: "Business Matching | IWBIF 2026",
			description: "Curated cross-border business matching for IWBIF 2026 delegates."
		});
		const registrationFlow = useRegistrationFlow();
		const accessMessage = ref("Checking your registration progress...");
		const canAccessMatching = computed(() => {
			return registrationFlow.canEnterBusinessMatching.value;
		});
		const missingProfileType = computed(() => registrationFlow.profilePendingType.value);
		try {
			if (!registrationFlow.state.value) [__temp, __restore] = withAsyncContext(() => registrationFlow.loadFlow()), await __temp, __restore();
		} catch {
			accessMessage.value = "Unable to validate your registration status right now. Please try again from the dashboard.";
		}
		if (!canAccessMatching.value) {
			const profile = registrationFlow.profilePendingType.value;
			if (profile) accessMessage.value = profile === "delegate" ? "Complete your delegate profile first. Business matching is unlocked after delegate profile is complete." : "Complete your exhibitor profile first. Business matching is unlocked after exhibitor profile is complete.";
			else if (registrationFlow.state.value?.selected_types?.length) accessMessage.value = "You need to complete payment before Business Matching is available.";
			else accessMessage.value = "Please complete your registration and payment before accessing business matching.";
		}
		const sectors = [
			"Creative Economy",
			"Healthcare & Wellness",
			"Food & Beverage",
			"Fashion & Style",
			"Industrial Estate",
			"Cross-sector Opportunities"
		];
		return (_ctx, _push, _parent, _attrs) => {
			const _component_NuxtLink = NuxtLink;
			if (!unref(canAccessMatching)) {
				_push(`<section${ssrRenderAttrs(mergeProps({ class: "mx-auto max-w-5xl px-3 py-16 sm:px-6 lg:px-8" }, _attrs))} data-v-54d49a4c><div class="glass-card rounded-3xl border border-amber-300/25 bg-amber-300/10 p-6 sm:p-8" data-v-54d49a4c><p class="text-xs uppercase tracking-[.35em] text-amber-200" data-v-54d49a4c>Access control</p><h1 class="mt-3 text-3xl font-black" data-v-54d49a4c>Business Matching is currently unavailable</h1><p class="mt-4 max-w-3xl text-sm leading-7 text-slate-200 sm:text-base" data-v-54d49a4c>${ssrInterpolate(unref(accessMessage))}</p><div class="mt-6 flex flex-wrap gap-3" data-v-54d49a4c>`);
				_push(ssrRenderComponent(_component_NuxtLink, {
					to: "/dashboard/payment",
					class: "inline-flex rounded-full bg-amber-300 px-5 py-3 text-sm font-bold text-slate-950"
				}, {
					default: withCtx((_, _push, _parent, _scopeId) => {
						if (_push) _push(`Go to payment`);
						else return [createTextVNode("Go to payment")];
					}),
					_: 1
				}, _parent));
				if (unref(missingProfileType) === "delegate") _push(ssrRenderComponent(_component_NuxtLink, {
					to: "/register/delegate",
					class: "inline-flex rounded-full border border-white/20 px-5 py-3 text-sm"
				}, {
					default: withCtx((_, _push, _parent, _scopeId) => {
						if (_push) _push(`Complete delegate profile`);
						else return [createTextVNode("Complete delegate profile")];
					}),
					_: 1
				}, _parent));
				else _push(`<!---->`);
				if (unref(missingProfileType) === "exhibitor") _push(ssrRenderComponent(_component_NuxtLink, {
					to: "/register/exhibitor",
					class: "inline-flex rounded-full border border-white/20 px-5 py-3 text-sm"
				}, {
					default: withCtx((_, _push, _parent, _scopeId) => {
						if (_push) _push(`Complete exhibitor profile`);
						else return [createTextVNode("Complete exhibitor profile")];
					}),
					_: 1
				}, _parent));
				else _push(`<!---->`);
				_push(`</div></div></section>`);
			} else {
				_push(`<main${ssrRenderAttrs(mergeProps({ class: "business-page" }, _attrs))} data-v-54d49a4c><section class="mx-auto max-w-7xl px-3 pb-14 pt-6 sm:px-6 sm:pt-12 lg:px-8" data-v-54d49a4c><div class="business-hero" data-v-54d49a4c><img${ssrRenderAttr("src", _virtual_public__2Fimages_2Fbusiness_matching_default)} alt="Women business leaders meeting and building international partnerships" class="business-hero__image" data-v-54d49a4c><div class="business-hero__shade" aria-hidden="true" data-v-54d49a4c></div><div class="business-hero__content" data-v-54d49a4c><p class="text-xs font-semibold uppercase tracking-[.35em] text-[#f1d58f] sm:text-sm" data-v-54d49a4c>Business Matching</p><h1 class="mt-4 max-w-3xl text-4xl font-black leading-[1.02] text-white sm:text-5xl lg:text-7xl" data-v-54d49a4c>Connect. Match.<br data-v-54d49a4c>Make Deals.</h1><p class="mt-5 max-w-xl text-sm leading-7 text-white/80 sm:text-base lg:text-lg" data-v-54d49a4c>A curated process connecting buyers, sellers, investors, distributors, suppliers, and strategic partners with relevant international opportunities.</p>`);
				_push(ssrRenderComponent(_component_NuxtLink, {
					to: "/register/delegate",
					class: "business-hero__action"
				}, {
					default: withCtx((_, _push, _parent, _scopeId) => {
						if (_push) _push(`Join Business Matching <span aria-hidden="true" data-v-54d49a4c${_scopeId}>→</span>`);
						else return [createTextVNode("Join Business Matching "), createVNode("span", { "aria-hidden": "true" }, "→")];
					}),
					_: 1
				}, _parent));
				_push(`</div><div class="business-hero__label" data-v-54d49a4c><span data-v-54d49a4c>Jakarta</span><span class="h-1 w-1 rounded-full bg-[#d8ac59]" data-v-54d49a4c></span><span data-v-54d49a4c>15–16 October 2026</span></div></div><div class="mt-16 text-center" data-v-54d49a4c><p class="text-xs font-semibold uppercase tracking-[.32em] text-[#d8ac59]" data-v-54d49a4c>Six opportunity sectors</p><h2 class="mx-auto mt-4 max-w-3xl text-3xl font-black text-white sm:text-4xl" data-v-54d49a4c>Meet the right partners for your next move.</h2></div><div class="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-3" data-v-54d49a4c><!--[-->`);
				ssrRenderList(sectors, (sector, index) => {
					_push(`<article class="sector-card" data-v-54d49a4c><span class="sector-card__number" data-v-54d49a4c>0${ssrInterpolate(index + 1)}</span><h3 class="mt-8 text-xl font-bold text-white" data-v-54d49a4c>${ssrInterpolate(sector)}</h3><p class="mt-3 text-sm leading-7 text-slate-400" data-v-54d49a4c>Targeted discovery and meeting opportunities for delegates in this sector.</p></article>`);
				});
				_push(`<!--]--></div><section class="profile-callout" data-v-54d49a4c><div data-v-54d49a4c><p class="text-xs font-semibold uppercase tracking-[.3em] text-[#d8ac59]" data-v-54d49a4c>Get match-ready</p><h2 class="mt-3 text-3xl font-black text-white sm:text-4xl" data-v-54d49a4c>Prepare your business profile</h2><p class="mt-4 max-w-3xl leading-7 text-slate-300" data-v-54d49a4c>Confirmed delegates can add company information, products or services, business objectives, target markets, and preferred meeting categories from their dashboard.</p></div>`);
				_push(ssrRenderComponent(_component_NuxtLink, {
					to: "/register/delegate",
					class: "profile-callout__action"
				}, {
					default: withCtx((_, _push, _parent, _scopeId) => {
						if (_push) _push(`Register as a Delegate`);
						else return [createTextVNode("Register as a Delegate")];
					}),
					_: 1
				}, _parent));
				_push(`</section></section></main>`);
			}
		};
	}
});
//#endregion
//#region app/pages/business-matching.vue
var _sfc_setup = business_matching_vue_vue_type_script_setup_true_lang_default.setup;
business_matching_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/business-matching.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var business_matching_default = /*#__PURE__*/ _plugin_vue_export_helper_default(business_matching_vue_vue_type_script_setup_true_lang_default, [["__scopeId", "data-v-54d49a4c"]]);

export { business_matching_default as default };
//# sourceMappingURL=business-matching-v_l0u_R3.mjs.map
