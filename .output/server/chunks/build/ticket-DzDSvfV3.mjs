globalThis.__timing__.logStart('Load chunks/build/ticket-DzDSvfV3');import { u as useAuthStore } from '../virtual/entry.mjs';
import { u as useTicket } from './useTicket-yGdsUCDV.mjs';
import { _ as _plugin_vue_export_helper_default } from './_plugin-vue_export-helper-BOaGB7Aw.mjs';
import { defineComponent, ref, computed, withAsyncContext, mergeProps, unref, useSSRContext } from 'vue';
import { p as publicAssetsURL } from '../routes/renderer.mjs';
import { ssrRenderAttrs, ssrRenderList, ssrInterpolate, ssrIncludeBooleanAttr, ssrRenderAttr } from 'vue/server-renderer';
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
import '@vue/shared';
import 'unhead/plugins';
import 'unhead/utils';
import 'unhead/server';
import 'unhead/legacy';
import 'vue-bundle-renderer/runtime';
import 'devalue';

//#region \0virtual:public?%2Fbranding%2Fai-asean.png
var _virtual_public__2Fbranding_2Fai_asean_default = publicAssetsURL("/branding/ai-asean.png");
//#endregion
//#region app/pages/dashboard/ticket/index.vue?vue&type=script&setup=true&lang.ts
var index_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "index",
	__ssrInlineRender: true,
	async setup(__props) {
		let __temp, __restore;
		const authStore = useAuthStore();
		const { getMyTickets} = useTicket();
		const loading = ref(true);
		const reissuing = ref("");
		const tickets = ref([]);
		const error = ref(null);
		const downloading = ref(false);
		ref(null);
		const qr = ref({
			ticket_id: "",
			ticket_number: "",
			token: "",
			imageUrl: "",
			imageError: ""
		});
		const participantName = computed(() => authStore.user?.full_name || authStore.user?.email || "Registered Participant");
		try {
			tickets.value = ([__temp, __restore] = withAsyncContext(() => getMyTickets()), __temp = await __temp, __restore(), __temp).data ?? [];
		} catch (e) {
			error.value = e;
		} finally {
			loading.value = false;
		}
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<section${ssrRenderAttrs(mergeProps({ class: "mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8" }, _attrs))} data-v-7288bea7><p class="text-sm uppercase tracking-[0.3em] text-cyan-200/70" data-v-7288bea7>Ticket</p><h1 class="mt-3 text-4xl font-black text-white" data-v-7288bea7>My Ticket</h1><p class="mt-3 text-slate-300" data-v-7288bea7>View your ticket list, render the QR code, and reissue it when needed.</p>`);
			if (unref(loading)) {
				_push(`<div class="mt-8 grid gap-4 md:grid-cols-2" data-v-7288bea7><!--[-->`);
				ssrRenderList(4, (item) => {
					_push(`<div class="h-40 animate-pulse rounded-[1.75rem] bg-white/5" data-v-7288bea7></div>`);
				});
				_push(`<!--]--></div>`);
			} else if (unref(error)) _push(`<div class="mt-8 rounded-3xl border border-red-400/40 bg-red-950/40 p-5 text-red-100" data-v-7288bea7> Failed to load tickets: ${ssrInterpolate(unref(error).message)}</div>`);
			else {
				_push(`<div class="mt-8 grid gap-4 md:grid-cols-2" data-v-7288bea7><!--[-->`);
				ssrRenderList(unref(tickets), (ticket) => {
					_push(`<article class="rounded-[1.75rem] border border-white/10 bg-white/5 p-5" data-v-7288bea7><div class="flex items-start justify-between gap-3" data-v-7288bea7><div data-v-7288bea7><p class="text-xs uppercase tracking-[0.25em] text-slate-400" data-v-7288bea7>Ticket</p><h2 class="mt-2 text-xl font-semibold text-white" data-v-7288bea7>${ssrInterpolate(ticket.ticket_number)}</h2><p class="mt-1 text-sm text-slate-300" data-v-7288bea7>${ssrInterpolate(ticket.status)}</p></div><button class="rounded-full border border-white/15 px-4 py-2 text-xs text-white" data-v-7288bea7> Show QR </button></div><p class="mt-3 text-sm text-slate-300" data-v-7288bea7>Reg ID: ${ssrInterpolate(ticket.registration_id)}</p><div class="mt-4 space-y-3" data-v-7288bea7><button class="rounded-full bg-cyan-400 px-4 py-2 text-sm font-semibold text-slate-950"${ssrIncludeBooleanAttr(unref(reissuing) === ticket.id) ? " disabled" : ""} data-v-7288bea7>${ssrInterpolate(unref(reissuing) === ticket.id ? "Processing..." : "Reissue")}</button></div></article>`);
				});
				_push(`<!--]--></div>`);
			}
			if (unref(qr).ticket_id) {
				_push(`<div class="print-ticket relative mt-10 overflow-hidden rounded-[2rem] border border-cyan-300/30 bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.18),_transparent_30%),linear-gradient(135deg,rgba(8,47,73,0.96),rgba(15,23,42,0.98))] p-5 shadow-[0_24px_80px_rgba(6,182,212,0.18)] sm:p-6" data-v-7288bea7><div class="absolute -left-4 top-1/2 h-8 w-8 -translate-y-1/2 rounded-full bg-slate-950 sm:-left-5 sm:h-10 sm:w-10" data-v-7288bea7></div><div class="absolute -right-4 top-1/2 h-8 w-8 -translate-y-1/2 rounded-full bg-slate-950 sm:-right-5 sm:h-10 sm:w-10" data-v-7288bea7></div><div class="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,transparent,rgba(255,255,255,0.06),transparent)] opacity-70" data-v-7288bea7></div><div class="pointer-events-none absolute inset-y-6 right-[18rem] hidden border-r border-dashed border-white/15 lg:block" data-v-7288bea7></div><div class="pointer-events-none absolute right-4 top-4 rounded-full border border-amber-300/20 bg-amber-300/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.35em] text-amber-100 sm:right-6 sm:top-6" data-v-7288bea7> VIP Access </div><div class="relative grid gap-8 lg:grid-cols-[1.35fr_280px] lg:items-center" data-v-7288bea7><div data-v-7288bea7><div class="flex flex-wrap items-center gap-3 pr-20" data-v-7288bea7><p class="text-xs uppercase tracking-[0.45em] text-cyan-100/80 sm:text-sm" data-v-7288bea7>Official Event Pass</p><span class="rounded-full border border-emerald-300/25 bg-emerald-300/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.28em] text-emerald-100" data-v-7288bea7> Confirmed </span></div><div class="mt-4 flex items-center gap-4" data-v-7288bea7><div class="flex h-16 w-16 items-center justify-center overflow-hidden rounded-3xl border border-cyan-200/25 bg-white/10 p-2 shadow-lg shadow-cyan-950/30 sm:h-20 sm:w-20" data-v-7288bea7><img${ssrRenderAttr("src", _virtual_public__2Fbranding_2Fai_asean_default)} alt="IWBIF 2026 event mark" class="h-full w-full rounded-xl object-contain" data-v-7288bea7></div><div data-v-7288bea7><p class="text-sm font-semibold uppercase tracking-[0.28em] text-white sm:text-base sm:tracking-[0.32em]" data-v-7288bea7>International Women Business</p><p class="text-sm uppercase tracking-[0.24em] text-cyan-100/70 sm:text-base sm:tracking-[0.28em]" data-v-7288bea7>&amp; Investment Forum 2026</p></div></div><h2 class="mt-3 max-w-2xl text-3xl font-black leading-tight text-white sm:text-4xl" data-v-7288bea7> You are officially registered for IWBIF 2026. </h2><p class="mt-4 max-w-2xl text-sm leading-7 text-slate-200 sm:text-base" data-v-7288bea7> Please present this QR code during re-registration and check-in at the venue. </p><div class="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4" data-v-7288bea7><div class="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-sm" data-v-7288bea7><p class="text-[11px] uppercase tracking-[0.3em] text-cyan-100/70" data-v-7288bea7>Participant</p><p class="mt-2 text-sm font-semibold leading-7 text-white sm:text-base sm:leading-8" data-v-7288bea7>${ssrInterpolate(unref(participantName))}</p></div><div class="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-sm" data-v-7288bea7><p class="text-[11px] uppercase tracking-[0.3em] text-cyan-100/70" data-v-7288bea7>Event</p><p class="mt-2 text-sm font-semibold leading-7 text-white sm:text-base sm:leading-8" data-v-7288bea7>IWBIF 2026</p></div><div class="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-sm" data-v-7288bea7><p class="text-[11px] uppercase tracking-[0.3em] text-cyan-100/70" data-v-7288bea7>Ticket Number</p><p class="mt-2 break-words text-sm font-semibold leading-7 text-white sm:text-[15px] sm:leading-8" data-v-7288bea7>${ssrInterpolate(unref(qr).ticket_number)}</p></div><div class="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-sm" data-v-7288bea7><p class="text-[11px] uppercase tracking-[0.3em] text-cyan-100/70" data-v-7288bea7>Date &amp; Venue</p><p class="mt-2 text-sm font-semibold leading-7 text-white sm:text-[15px]" data-v-7288bea7>14–17 October 2026</p><p class="mt-1 text-xs leading-5 text-slate-300 sm:leading-6" data-v-7288bea7>Jakarta, Indonesia</p></div></div><div class="ticket-actions mt-6 flex flex-wrap gap-3" data-v-7288bea7>`);
				if (unref(qr).imageUrl) _push(`<button type="button"${ssrIncludeBooleanAttr(unref(downloading)) ? " disabled" : ""} class="rounded-full bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 transition duration-200 hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-50" data-v-7288bea7>${ssrInterpolate(unref(downloading) ? "Downloading..." : "Download Ticket")}</button>`);
				else _push(`<!---->`);
				_push(`</div></div><div class="relative" data-v-7288bea7><div class="mx-auto max-w-[220px] rounded-[1.75rem] border border-white/15 bg-white p-3 shadow-2xl sm:max-w-[250px] sm:p-4" data-v-7288bea7>`);
				if (unref(qr).imageUrl) _push(`<img${ssrRenderAttr("src", unref(qr).imageUrl)} alt="QR ticket" class="w-full rounded-2xl" data-v-7288bea7>`);
				else _push(`<!---->`);
				_push(`</div><p class="mt-4 text-center text-xs uppercase tracking-[0.35em] text-cyan-100/70" data-v-7288bea7> Scan for verification </p></div></div>`);
				if (unref(qr).imageError) _push(`<p class="relative mt-4 text-sm text-red-100" data-v-7288bea7>${ssrInterpolate(unref(qr).imageError)}</p>`);
				else _push(`<!---->`);
				_push(`</div>`);
			} else _push(`<!---->`);
			_push(`</section>`);
		};
	}
});
//#endregion
//#region app/pages/dashboard/ticket/index.vue
var _sfc_setup = index_vue_vue_type_script_setup_true_lang_default.setup;
index_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/dashboard/ticket/index.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var ticket_default = /*#__PURE__*/ _plugin_vue_export_helper_default(index_vue_vue_type_script_setup_true_lang_default, [["__scopeId", "data-v-7288bea7"]]);

export { ticket_default as default };;globalThis.__timing__.logEnd('Load chunks/build/ticket-DzDSvfV3');
//# sourceMappingURL=ticket-DzDSvfV3.mjs.map
