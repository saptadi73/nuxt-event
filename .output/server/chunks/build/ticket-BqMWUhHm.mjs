globalThis.__timing__.logStart('Load chunks/build/ticket-BqMWUhHm');import { c as useNuxtApp } from '../virtual/entry.mjs';
import { defineComponent, ref, withAsyncContext, mergeProps, unref, useSSRContext } from 'vue';
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
import '../routes/renderer.mjs';
import 'unhead/server';
import 'unhead/legacy';
import 'unhead/plugins';
import 'vue-bundle-renderer/runtime';
import 'devalue';
import '@vue/shared';
import 'unhead/utils';

//#region app/composables/useTicket.ts
function useTicket() {
	const api = useNuxtApp().$api;
	const getMyTickets = () => api("/tickets/me");
	const getQrByTicket = (ticketId) => api(`/tickets/${ticketId}/qr`);
	const reissueTicket = (ticketId) => api(`/tickets/${ticketId}/reissue`, { method: "POST" });
	return {
		getMyTickets,
		getQrByTicket,
		reissueTicket
	};
}
//#endregion
//#region app/pages/dashboard/ticket/index.vue?vue&type=script&setup=true&lang.ts
var index_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "index",
	__ssrInlineRender: true,
	async setup(__props) {
		let __temp, __restore;
		const { getMyTickets} = useTicket();
		const loading = ref(true);
		const reissuing = ref("");
		const tickets = ref([]);
		const error = ref(null);
		const qr = ref({
			ticket_id: "",
			ticket_number: "",
			token: "",
			imageUrl: ""
		});
		try {
			tickets.value = ([__temp, __restore] = withAsyncContext(() => getMyTickets()), __temp = await __temp, __restore(), __temp).data ?? [];
		} catch (e) {
			error.value = e;
		} finally {
			loading.value = false;
		}
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<section${ssrRenderAttrs(mergeProps({ class: "mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8" }, _attrs))}><p class="text-sm uppercase tracking-[0.3em] text-cyan-200/70">Ticket</p><h1 class="mt-3 text-4xl font-black text-white">Tiket Saya</h1><p class="mt-3 text-slate-300">Ambil daftar tiket, render QR, dan reissue bila diperlukan.</p>`);
			if (unref(loading)) {
				_push(`<div class="mt-8 grid gap-4 md:grid-cols-2"><!--[-->`);
				ssrRenderList(4, (item) => {
					_push(`<div class="h-40 animate-pulse rounded-[1.75rem] bg-white/5"></div>`);
				});
				_push(`<!--]--></div>`);
			} else if (unref(error)) _push(`<div class="mt-8 rounded-3xl border border-red-400/40 bg-red-950/40 p-5 text-red-100"> Gagal memuat tiket: ${ssrInterpolate(unref(error).message)}</div>`);
			else {
				_push(`<div class="mt-8 grid gap-4 md:grid-cols-2"><!--[-->`);
				ssrRenderList(unref(tickets), (ticket) => {
					_push(`<article class="rounded-[1.75rem] border border-white/10 bg-white/5 p-5"><div class="flex items-start justify-between gap-3"><div><p class="text-xs uppercase tracking-[0.25em] text-slate-400">Ticket</p><h2 class="mt-2 text-xl font-semibold text-white">${ssrInterpolate(ticket.ticket_number)}</h2><p class="mt-1 text-sm text-slate-300">${ssrInterpolate(ticket.status)}</p></div><button class="rounded-full border border-white/15 px-4 py-2 text-xs text-white"> Tampilkan QR </button></div><p class="mt-3 text-sm text-slate-300">Reg ID: ${ssrInterpolate(ticket.registration_id)}</p><div class="mt-4 space-y-3"><button class="rounded-full bg-cyan-400 px-4 py-2 text-sm font-semibold text-slate-950"${ssrIncludeBooleanAttr(unref(reissuing) === ticket.id) ? " disabled" : ""}>${ssrInterpolate(unref(reissuing) === ticket.id ? "Memproses..." : "Reissue")}</button></div></article>`);
				});
				_push(`<!--]--></div>`);
			}
			if (unref(qr).ticket_id) {
				_push(`<div class="mt-10 rounded-[1.75rem] border border-cyan-300/30 bg-cyan-300/10 p-6"><p class="text-sm uppercase tracking-[0.25em] text-cyan-100">QR Ticket</p><p class="mt-1 text-white">${ssrInterpolate(unref(qr).ticket_number)}</p><p class="mt-3 break-words text-sm text-slate-100">Token: ${ssrInterpolate(unref(qr).token)}</p>`);
				if (unref(qr).imageUrl) _push(`<img${ssrRenderAttr("src", unref(qr).imageUrl)} alt="QR ticket" class="mt-4 max-w-xs rounded-xl bg-white p-2">`);
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
var ticket_default = index_vue_vue_type_script_setup_true_lang_default;

export { ticket_default as default };;globalThis.__timing__.logEnd('Load chunks/build/ticket-BqMWUhHm');
//# sourceMappingURL=ticket-BqMWUhHm.mjs.map
