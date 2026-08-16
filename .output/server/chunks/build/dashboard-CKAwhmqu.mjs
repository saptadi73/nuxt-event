globalThis.__timing__.logStart('Load chunks/build/dashboard-CKAwhmqu');import { a as useSeoMeta$1, N as NuxtLink } from '../virtual/entry.mjs';
import { defineComponent, mergeProps, unref, withCtx, createVNode, toDisplayString, useSSRContext } from 'vue';
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
import 'vue-router';
import '../routes/renderer.mjs';
import 'unhead/server';
import 'unhead/legacy';
import 'unhead/plugins';
import 'vue-bundle-renderer/runtime';
import 'devalue';
import '@vue/shared';
import 'unhead/utils';

//#region app/pages/dashboard/index.vue?vue&type=script&setup=true&lang.ts
var index_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "index",
	__ssrInlineRender: true,
	setup(__props) {
		useSeoMeta$1({ title: "Participant Dashboard | IWBIF 2026" });
		const days = Math.max(0, Math.ceil(((/* @__PURE__ */ new Date("2026-10-14T09:00:00+07:00")).getTime() - Date.now()) / 864e5));
		const countdown = days > 0 ? `${days} days` : "Event day";
		const statuses = [
			{
				label: "Registration",
				value: "Check your status",
				note: "Complete all required participant details."
			},
			{
				label: "Payment",
				value: "Payment center",
				note: "Review transaction and confirmation status."
			},
			{
				label: "My Ticket",
				value: "Digital QR pass",
				note: "Keep your personal QR code secure."
			},
			{
				label: "Profile",
				value: "Build your network",
				note: "Complete your professional information."
			}
		];
		const menu = [
			{
				to: "/dashboard/ticket",
				label: "Access",
				title: "My Ticket & QR Code",
				text: "Open your event pass and check-in information."
			},
			{
				to: "/dashboard/profile",
				label: "Identity",
				title: "My Profile",
				text: "Update professional details, expertise, and interests."
			},
			{
				to: "/dashboard/directory",
				label: "Networking",
				title: "Participant Directory",
				text: "Discover potential collaborators across IWBIF."
			},
			{
				to: "/dashboard/schedule",
				label: "Agenda",
				title: "My Schedule",
				text: "Review the forum agenda and sessions."
			},
			{
				to: "/dashboard/payment",
				label: "Transaction",
				title: "Payment",
				text: "Create or continue your payment transaction."
			},
			{
				to: "/dashboard/invoice",
				label: "Document",
				title: "Invoice",
				text: "Review invoice and registration details."
			},
			{
				to: "/dashboard/certificate",
				label: "Recognition",
				title: "Certificate",
				text: "Access your certificate after attendance eligibility."
			},
			{
				to: "/dashboard/announcements",
				label: "Updates",
				title: "Announcements",
				text: "Read important information from the organizing team."
			},
			{
				to: "/directory-consent",
				label: "Privacy",
				title: "Directory Consent",
				text: "Understand and manage profile visibility."
			}
		];
		return (_ctx, _push, _parent, _attrs) => {
			const _component_NuxtLink = NuxtLink;
			_push(`<section${ssrRenderAttrs(mergeProps({ class: "mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8" }, _attrs))}><p class="text-sm uppercase tracking-[.35em] text-cyan-200">Participant Dashboard</p><div class="mt-3 flex flex-wrap items-end justify-between gap-5"><div><h1 class="text-4xl font-black">Welcome to IWBIF 2026</h1><p class="mt-3 text-slate-300">Your ticket, schedule, profile, networking, payment, and event updates in one place.</p></div><div class="glass-card rounded-2xl px-5 py-3 text-right"><p class="text-xs uppercase tracking-[.25em] text-slate-400">Event starts in</p><p class="mt-1 text-xl font-bold text-cyan-200">${ssrInterpolate(unref(countdown))}</p></div></div><div class="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"><!--[-->`);
			ssrRenderList(statuses, (status) => {
				_push(`<article class="glass-card rounded-3xl p-5"><p class="text-xs uppercase tracking-[.2em] text-slate-400">${ssrInterpolate(status.label)}</p><p class="mt-3 text-xl font-bold">${ssrInterpolate(status.value)}</p><p class="mt-2 text-sm text-slate-400">${ssrInterpolate(status.note)}</p></article>`);
			});
			_push(`<!--]--></div><h2 class="mt-10 text-2xl font-bold">Quick access</h2><div class="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"><!--[-->`);
			ssrRenderList(menu, (item) => {
				_push(ssrRenderComponent(_component_NuxtLink, {
					key: item.to,
					to: item.to,
					class: "glass-card rounded-3xl p-6 transition hover:-translate-y-1 hover:border-cyan-300/40"
				}, {
					default: withCtx((_, _push, _parent, _scopeId) => {
						if (_push) _push(`<p class="text-xs uppercase tracking-[.25em] text-cyan-200"${_scopeId}>${ssrInterpolate(item.label)}</p><h3 class="mt-3 text-xl font-bold"${_scopeId}>${ssrInterpolate(item.title)}</h3><p class="mt-2 text-sm leading-6 text-slate-400"${_scopeId}>${ssrInterpolate(item.text)}</p>`);
						else return [
							createVNode("p", { class: "text-xs uppercase tracking-[.25em] text-cyan-200" }, toDisplayString(item.label), 1),
							createVNode("h3", { class: "mt-3 text-xl font-bold" }, toDisplayString(item.title), 1),
							createVNode("p", { class: "mt-2 text-sm leading-6 text-slate-400" }, toDisplayString(item.text), 1)
						];
					}),
					_: 2
				}, _parent));
			});
			_push(`<!--]--></div></section>`);
		};
	}
});
//#endregion
//#region app/pages/dashboard/index.vue
var _sfc_setup = index_vue_vue_type_script_setup_true_lang_default.setup;
index_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/dashboard/index.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var dashboard_default = index_vue_vue_type_script_setup_true_lang_default;

export { dashboard_default as default };;globalThis.__timing__.logEnd('Load chunks/build/dashboard-CKAwhmqu');
//# sourceMappingURL=dashboard-CKAwhmqu.mjs.map
