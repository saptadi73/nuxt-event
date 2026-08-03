globalThis.__timing__.logStart('Load chunks/build/tickets-C-zjnjSg');import { a as useSeoMeta$1, b as useAsyncData, N as NuxtLink } from '../virtual/entry.mjs';
import { u as useEvent } from './useEvent-Cd-tMHNN.mjs';
import { defineComponent, withAsyncContext, computed, mergeProps, unref, withCtx, createTextVNode, toDisplayString, useSSRContext } from 'vue';
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
		useSeoMeta$1({
			title: "Tickets | ASEAN AI for Education",
			description: "Live ticket packages for the 2026 summit."
		});
		const { getEvents, getEventTicketTypes } = useEvent();
		const { data: response, pending, error } = ([__temp, __restore] = withAsyncContext(async () => useAsyncData("public-ticket-types", async () => {
			const event = (await getEvents(1, 1)).data[0];
			if (!event?.slug) throw new Error("Event not found");
			return getEventTicketTypes(event.slug);
		})), __temp = await __temp, __restore(), __temp);
		const tickets = computed(() => response.value?.data.filter((item) => item.is_active) ?? []);
		const formatPrice = (price, currency) => new Intl.NumberFormat("en-US", {
			style: "currency",
			currency,
			maximumFractionDigits: 0
		}).format(price);
		const formatDate = (date) => date ? new Intl.DateTimeFormat("en-GB", {
			day: "numeric",
			month: "short",
			year: "numeric"
		}).format(new Date(date)) : "Not specified";
		return (_ctx, _push, _parent, _attrs) => {
			const _component_NuxtLink = NuxtLink;
			_push(`<section${ssrRenderAttrs(mergeProps({ class: "mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8" }, _attrs))}><p class="text-sm uppercase tracking-[0.35em] text-cyan-200">Ticket Packages</p><h1 class="mt-4 text-5xl font-black">Choose how you will join the summit.</h1>`);
			if (unref(pending)) {
				_push(`<div class="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4"><!--[-->`);
				ssrRenderList(4, (n) => {
					_push(`<div class="h-96 animate-pulse rounded-[2rem] bg-white/5"></div>`);
				});
				_push(`<!--]--></div>`);
			} else if (unref(error)) _push(`<div class="mt-10 rounded-3xl border border-red-400/30 bg-red-950/30 p-6 text-red-100">Ticket packages could not be loaded. Please try again.</div>`);
			else {
				_push(`<div class="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4"><!--[-->`);
				ssrRenderList(unref(tickets), (ticket) => {
					_push(`<article class="glass-card flex flex-col rounded-[2rem] p-7"><p class="text-sm text-cyan-200">${ssrInterpolate(ticket.name)}</p><p class="mt-4 text-4xl font-black">${ssrInterpolate(formatPrice(ticket.price, ticket.currency))}</p><p class="mt-3 flex-1 text-sm leading-7 text-slate-400">${ssrInterpolate(ticket.description)}</p><div class="mt-5 space-y-2 text-xs text-slate-400"><p>Capacity: ${ssrInterpolate(ticket.capacity)}</p><p>Sales end: ${ssrInterpolate(formatDate(ticket.sales_end_at))}</p></div>`);
					_push(ssrRenderComponent(_component_NuxtLink, {
						to: `/register?ticket=${ticket.id}`,
						class: "mt-7 rounded-full bg-cyan-400 px-5 py-3 text-center font-semibold text-slate-950"
					}, {
						default: withCtx((_, _push, _parent, _scopeId) => {
							if (_push) _push(`Choose ${ssrInterpolate(ticket.name)}`);
							else return [createTextVNode("Choose " + toDisplayString(ticket.name), 1)];
						}),
						_: 2
					}, _parent));
					_push(`</article>`);
				});
				_push(`<!--]--></div>`);
			}
			_push(`<div class="mt-8 rounded-3xl border border-white/10 bg-white/5 p-6 text-sm leading-7 text-slate-300"><strong class="text-white">Ticket information:</strong> Availability and prices are loaded directly from the event backend. Registration is confirmed only after successful payment verification.</div></section>`);
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
var tickets_default = tickets_vue_vue_type_script_setup_true_lang_default;

export { tickets_default as default };;globalThis.__timing__.logEnd('Load chunks/build/tickets-C-zjnjSg');
//# sourceMappingURL=tickets-C-zjnjSg.mjs.map
