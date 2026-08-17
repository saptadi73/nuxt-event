globalThis.__timing__.logStart('Load chunks/build/tickets-CE3myhya');import { _ as _plugin_vue_export_helper_default, c as useSeoMeta$1, f as useAsyncData, N as NuxtLink } from '../virtual/entry.mjs';
import { u as useEvent } from './useEvent-D4WcF23a.mjs';
import { defineComponent, withAsyncContext, computed, mergeProps, unref, withCtx, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderList, ssrInterpolate, ssrRenderComponent } from 'vue/server-renderer';
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

//#region app/pages/tickets.vue?vue&type=script&setup=true&lang.ts
var tickets_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "tickets",
	__ssrInlineRender: true,
	async setup(__props) {
		let __temp, __restore;
		useSeoMeta$1({ title: "Delegate Packages | IWBIF 2026" });
		const { getEvents, getEventDelegatePackages } = useEvent();
		const { data: response, pending, error } = ([__temp, __restore] = withAsyncContext(async () => useAsyncData("iwbif-packages", async () => {
			const event = (await getEvents(1, 1)).data[0];
			if (!event) throw new Error("No IWBIF event is currently published.");
			return getEventDelegatePackages(event.id);
		})), __temp = await __temp, __restore(), __temp);
		const packages = computed(() => response.value?.data.filter((item) => item.is_active) ?? []);
		const money = (amount, currency) => new Intl.NumberFormat("en-US", {
			style: "currency",
			currency
		}).format(amount);
		return (_ctx, _push, _parent, _attrs) => {
			const _component_NuxtLink = NuxtLink;
			_push(`<section${ssrRenderAttrs(mergeProps({ class: "tickets-shell mx-auto max-w-7xl px-3 py-10 sm:px-6 lg:px-8" }, _attrs))} data-v-58d9cea6><div class="tickets-hero rounded-[2rem] border border-amber-200/20 bg-gradient-to-br from-amber-300/8 via-slate-950/80 to-slate-950/90 p-5 sm:p-8" data-v-58d9cea6><p class="text-sm uppercase tracking-[.35em] text-amber-200" data-v-58d9cea6>Delegate Packages</p><h1 class="mt-4 max-w-4xl text-3xl font-black sm:text-5xl" data-v-58d9cea6>Choose your IWBIF delegate experience.</h1><p class="mt-4 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base" data-v-58d9cea6>Select the participation tier that matches your objectives, from curated access to premium business matching and high-value networking.</p></div>`);
			if (unref(pending)) {
				_push(`<div class="mt-10 grid gap-5 md:grid-cols-2" data-v-58d9cea6><!--[-->`);
				ssrRenderList(2, (n) => {
					_push(`<div class="h-80 animate-pulse rounded-[2rem] bg-white/5" data-v-58d9cea6></div>`);
				});
				_push(`<!--]--></div>`);
			} else if (unref(error)) _push(`<div class="mt-10 rounded-3xl border border-red-400/30 bg-red-950/30 p-6 text-red-100" data-v-58d9cea6>${ssrInterpolate(unref(error).message)}</div>`);
			else if (!unref(packages).length) _push(`<div class="mt-10 rounded-3xl border border-white/10 bg-white/5 p-6 text-slate-300" data-v-58d9cea6>Delegate packages will be published soon.</div>`);
			else {
				_push(`<div class="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3" data-v-58d9cea6><!--[-->`);
				ssrRenderList(unref(packages), (item) => {
					_push(`<article class="ticket-card glass-card flex flex-col rounded-[2rem] p-5 sm:p-7" data-v-58d9cea6><div class="flex items-center justify-between gap-3" data-v-58d9cea6><p class="text-sm font-semibold text-amber-200" data-v-58d9cea6>${ssrInterpolate(item.code)}</p><span class="rounded-full border border-amber-200/20 bg-amber-300/10 px-2.5 py-1 text-[10px] uppercase tracking-[.2em] text-amber-100" data-v-58d9cea6>Standard</span></div><h2 class="mt-4 text-2xl font-bold text-white" data-v-58d9cea6>${ssrInterpolate(item.name)}</h2><p class="mt-4 text-3xl font-black text-white sm:text-4xl" data-v-58d9cea6>${ssrInterpolate(money(item.amount, item.currency))}</p><ul class="mt-5 space-y-3 text-sm leading-6 text-slate-300" data-v-58d9cea6><li class="flex items-center gap-2" data-v-58d9cea6><span class="h-1.5 w-1.5 rounded-full bg-amber-300" data-v-58d9cea6></span>Full event access</li><li class="flex items-center gap-2" data-v-58d9cea6><span class="h-1.5 w-1.5 rounded-full bg-amber-300" data-v-58d9cea6></span>Business matching eligibility</li><li class="flex items-center gap-2" data-v-58d9cea6><span class="h-1.5 w-1.5 rounded-full bg-amber-300" data-v-58d9cea6></span>Networking and session entry</li></ul>`);
					_push(ssrRenderComponent(_component_NuxtLink, {
						to: `/register/delegate?package=${item.id}`,
						class: "mt-7 rounded-full bg-amber-300 px-5 py-3 text-center font-semibold text-slate-950 shadow-[0_18px_35px_rgba(216,172,89,0.2)] transition hover:brightness-110"
					}, {
						default: withCtx((_, _push, _parent, _scopeId) => {
							if (_push) _push(`Select package`);
							else return [createTextVNode("Select package")];
						}),
						_: 2
					}, _parent));
					_push(`</article>`);
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
var tickets_default = /*#__PURE__*/ _plugin_vue_export_helper_default(tickets_vue_vue_type_script_setup_true_lang_default, [["__scopeId", "data-v-58d9cea6"]]);

export { tickets_default as default };;globalThis.__timing__.logEnd('Load chunks/build/tickets-CE3myhya');
//# sourceMappingURL=tickets-CE3myhya.mjs.map
