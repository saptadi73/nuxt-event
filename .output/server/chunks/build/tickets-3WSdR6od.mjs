import { _ as _plugin_vue_export_helper_default, u as useAuthStore, h as useRegistrationFlow, b as useRoute, a as useAsyncData, N as NuxtLink } from '../virtual/entry.mjs';
import { u as useSeoMeta$1 } from './head-D-xrF-Fu.mjs';
import { u as useEvent } from './useEvent-B_Up9ELJ.mjs';
import { u as useStore } from './useStore-1GY6e7uC.mjs';
import { defineComponent, computed, ref, withAsyncContext, mergeProps, unref, withCtx, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderComponent, ssrRenderClass, ssrRenderList, ssrIncludeBooleanAttr } from 'vue/server-renderer';
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

//#region app/pages/tickets.vue?vue&type=script&setup=true&lang.ts
var tickets_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "tickets",
	__ssrInlineRender: true,
	async setup(__props) {
		let __temp, __restore;
		useSeoMeta$1({ title: "Delegate Packages | IWBIF 2026" });
		const { getEvents } = useEvent();
		const { getProducts} = useStore();
		const authStore = useAuthStore();
		const isAuthenticated = computed(() => authStore.isAuthenticated);
		useRegistrationFlow();
		const route = useRoute();
		const selectedType = computed(() => route.query.type === "exhibitor" ? "exhibitor" : "delegate");
		const eventId = ref("");
		const addingId = ref("");
		const notice = ref("");
		const noticeTone = ref("success");
		const { data: response, pending, error } = ([__temp, __restore] = withAsyncContext(async () => useAsyncData("iwbif-packages", async () => {
			const event = (await getEvents(1, 1)).data[0];
			if (!event) throw new Error("No IWBIF event is currently published.");
			eventId.value = event.id;
			return getProducts(event.id);
		})), __temp = await __temp, __restore(), __temp);
		const packages = computed(() => response.value?.data.filter((item) => item.is_active && item.product_type === selectedType.value) ?? []);
		const money = (amount, currency) => new Intl.NumberFormat("en-US", {
			style: "currency",
			currency
		}).format(amount);
		return (_ctx, _push, _parent, _attrs) => {
			const _component_NuxtLink = NuxtLink;
			_push(`<section${ssrRenderAttrs(mergeProps({ class: "tickets-shell mx-auto max-w-7xl px-3 py-10 sm:px-6 lg:px-8" }, _attrs))} data-v-aa4dfb0b><div class="tickets-hero rounded-[2rem] border border-amber-200/20 bg-gradient-to-br from-amber-300/8 via-slate-950/80 to-slate-950/90 p-5 sm:p-8" data-v-aa4dfb0b><p class="text-sm uppercase tracking-[.35em] text-amber-200" data-v-aa4dfb0b>${ssrInterpolate(unref(selectedType) === "exhibitor" ? "Exhibitor Packages" : "Delegate Packages")}</p><h1 class="mt-4 max-w-4xl text-3xl font-black sm:text-5xl" data-v-aa4dfb0b>Choose your IWBIF ${ssrInterpolate(unref(selectedType))} experience.</h1><p class="mt-4 max-w-4xl text-sm leading-7 text-slate-300 sm:text-base" data-v-aa4dfb0b>Select the ${ssrInterpolate(unref(selectedType))} package that matches your objectives. Your profile details can be completed after payment.</p></div>`);
			if (unref(isAuthenticated)) {
				_push(`<div class="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/5 p-4" data-v-aa4dfb0b><p class="text-sm text-slate-300" data-v-aa4dfb0b>Choose one or more packages, then review everything in your cart.</p>`);
				_push(ssrRenderComponent(_component_NuxtLink, {
					to: "/dashboard/cart",
					class: "rounded-full border border-amber-300/40 px-5 py-2.5 text-sm font-semibold text-amber-100"
				}, {
					default: withCtx((_, _push, _parent, _scopeId) => {
						if (_push) _push(`View cart`);
						else return [createTextVNode("View cart")];
					}),
					_: 1
				}, _parent));
				_push(`</div>`);
			} else _push(`<!---->`);
			if (unref(notice)) _push(`<div class="${ssrRenderClass([unref(noticeTone) === "error" ? "border-red-400/30 bg-red-950/30 text-red-100" : "border-emerald-300/30 bg-emerald-950/30 text-emerald-100", "mt-5 rounded-2xl border p-4 text-sm"])}" data-v-aa4dfb0b>${ssrInterpolate(unref(notice))}</div>`);
			else _push(`<!---->`);
			if (unref(pending)) {
				_push(`<div class="mt-10 grid gap-5 md:grid-cols-2" data-v-aa4dfb0b><!--[-->`);
				ssrRenderList(2, (n) => {
					_push(`<div class="h-80 animate-pulse rounded-[2rem] bg-white/5" data-v-aa4dfb0b></div>`);
				});
				_push(`<!--]--></div>`);
			} else if (unref(error)) _push(`<div class="mt-10 rounded-3xl border border-red-400/30 bg-red-950/30 p-6 text-red-100" data-v-aa4dfb0b>${ssrInterpolate(unref(error).message)}</div>`);
			else if (!unref(packages).length) _push(`<div class="mt-10 rounded-3xl border border-white/10 bg-white/5 p-6 text-slate-300" data-v-aa4dfb0b>Delegate packages will be published soon.</div>`);
			else {
				_push(`<div class="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3" data-v-aa4dfb0b><!--[-->`);
				ssrRenderList(unref(packages), (item) => {
					_push(`<article class="ticket-card glass-card flex flex-col rounded-[2rem] p-5 sm:p-7" data-v-aa4dfb0b><div class="flex items-center justify-between gap-3" data-v-aa4dfb0b><span class="rounded-full border border-amber-200/20 bg-amber-300/10 px-2.5 py-1 text-[10px] uppercase tracking-[.2em] text-amber-100" data-v-aa4dfb0b>${ssrInterpolate(item.product_type)}</span></div><h2 class="mt-4 text-2xl font-bold text-white" data-v-aa4dfb0b>${ssrInterpolate(item.name)}</h2><p class="mt-4 text-3xl font-black text-white sm:text-4xl" data-v-aa4dfb0b>${ssrInterpolate(money(item.amount ?? item.price ?? 0, item.currency))}</p><ul class="mt-5 space-y-3 text-sm leading-6 text-slate-300" data-v-aa4dfb0b><li class="flex items-center gap-2" data-v-aa4dfb0b><span class="h-1.5 w-1.5 rounded-full bg-amber-300" data-v-aa4dfb0b></span>Full event access</li><li class="flex items-center gap-2" data-v-aa4dfb0b><span class="h-1.5 w-1.5 rounded-full bg-amber-300" data-v-aa4dfb0b></span>Business matching eligibility</li><li class="flex items-center gap-2" data-v-aa4dfb0b><span class="h-1.5 w-1.5 rounded-full bg-amber-300" data-v-aa4dfb0b></span>Networking and session entry</li></ul><button type="button" class="mt-7 rounded-full bg-amber-300 px-5 py-3 text-center font-semibold text-slate-950 shadow-[0_18px_35px_rgba(216,172,89,0.2)] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"${ssrIncludeBooleanAttr(unref(addingId) === item.id) ? " disabled" : ""} data-v-aa4dfb0b>${ssrInterpolate(unref(addingId) === item.id ? "Adding..." : unref(isAuthenticated) ? "Add to cart" : "Register to purchase")}</button></article>`);
				});
				_push(`<!--]--></div>`);
			}
			_push(`</section>`);
		};
	}
});
//#endregion
//#region app/pages/tickets.vue
var _sfc_setup = tickets_vue_vue_type_script_setup_true_lang_default.setup;
tickets_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/tickets.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var tickets_default = /*#__PURE__*/ _plugin_vue_export_helper_default(tickets_vue_vue_type_script_setup_true_lang_default, [["__scopeId", "data-v-aa4dfb0b"]]);

export { tickets_default as default };
//# sourceMappingURL=tickets-3WSdR6od.mjs.map
