import { _ as _plugin_vue_export_helper_default, u as useAuthStore, N as NuxtLink } from '../virtual/entry.mjs';
import { u as useSeoMeta$1 } from './head-D-xrF-Fu.mjs';
import { defineComponent, computed, mergeProps, unref, withCtx, createTextVNode, createVNode, toDisplayString, useSSRContext } from 'vue';
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
import '../routes/renderer.mjs';
import 'unhead/server';
import 'unhead/legacy';
import 'unhead/plugins';
import 'vue-bundle-renderer/runtime';
import 'devalue';
import 'vue-router';
import '@vue/shared';
import 'unhead/utils';

//#region app/pages/dashboard/index.vue?vue&type=script&setup=true&lang.ts
var index_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "index",
	__ssrInlineRender: true,
	setup(__props) {
		useSeoMeta$1({ title: "Participant Dashboard | IWBIF 2026" });
		const authStore = useAuthStore();
		const canViewSalesReport = computed(() => authStore.isAdminOrOrganizer);
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
				to: "/dashboard/cart",
				label: "Purchase",
				title: "Shopping Cart",
				text: "Review selected packages and create your checkout order."
			},
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
			},
			{
				to: "/dashboard/security",
				label: "Account",
				title: "Change Password",
				text: "Update the password used to sign in to your account."
			}
		];
		return (_ctx, _push, _parent, _attrs) => {
			const _component_NuxtLink = NuxtLink;
			_push(`<section${ssrRenderAttrs(mergeProps({ class: "dashboard-shell mx-auto max-w-7xl px-3 py-10 sm:px-6 lg:px-8" }, _attrs))} data-v-0b618fe9><p class="text-sm uppercase tracking-[.35em] text-cyan-200" data-v-0b618fe9>${ssrInterpolate(unref(canViewSalesReport) ? "Organizer Dashboard" : "Participant Dashboard")}</p><div class="mt-3 flex flex-wrap items-end justify-between gap-5" data-v-0b618fe9><div data-v-0b618fe9><h1 class="text-3xl font-black sm:text-4xl" data-v-0b618fe9>Welcome to IWBIF 2026</h1><p class="mt-3 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base" data-v-0b618fe9>Your ticket, schedule, profile, networking, payment, and event updates in one place.</p></div><div class="glass-card rounded-2xl px-4 py-3 text-left sm:text-right" data-v-0b618fe9><p class="text-[10px] uppercase tracking-[.25em] text-slate-400 sm:text-xs" data-v-0b618fe9>Event starts in</p><p class="mt-1 text-lg font-bold text-cyan-200 sm:text-xl" data-v-0b618fe9>${ssrInterpolate(unref(countdown))}</p></div></div><div class="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4" data-v-0b618fe9><!--[-->`);
			ssrRenderList(statuses, (status) => {
				_push(`<article class="glass-card rounded-3xl p-5" data-v-0b618fe9><p class="text-xs uppercase tracking-[.2em] text-slate-400" data-v-0b618fe9>${ssrInterpolate(status.label)}</p><p class="mt-3 text-xl font-bold" data-v-0b618fe9>${ssrInterpolate(status.value)}</p><p class="mt-2 text-sm text-slate-400" data-v-0b618fe9>${ssrInterpolate(status.note)}</p></article>`);
			});
			_push(`<!--]--></div>`);
			if (unref(canViewSalesReport)) {
				_push(`<div class="mt-8 rounded-3xl border border-amber-300/30 bg-amber-300/10 p-5 sm:p-6" data-v-0b618fe9><div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between" data-v-0b618fe9><div data-v-0b618fe9><p class="text-xs uppercase tracking-[.25em] text-amber-200" data-v-0b618fe9>Organizer view</p><h2 class="mt-2 text-2xl font-bold" data-v-0b618fe9>Ticket sales &amp; revenue report</h2></div><div class="flex flex-wrap gap-3" data-v-0b618fe9>`);
				_push(ssrRenderComponent(_component_NuxtLink, {
					to: "/admin/packages",
					class: "inline-flex items-center justify-center rounded-full bg-amber-300 px-5 py-3 text-sm font-bold text-slate-950 transition hover:brightness-110"
				}, {
					default: withCtx((_, _push, _parent, _scopeId) => {
						if (_push) _push(`Manage packages`);
						else return [createTextVNode("Manage packages")];
					}),
					_: 1
				}, _parent));
				_push(ssrRenderComponent(_component_NuxtLink, {
					to: "/admin/speakers",
					class: "inline-flex items-center justify-center rounded-full border border-amber-300/40 px-5 py-3 text-sm font-bold text-amber-100 transition hover:bg-amber-300/10"
				}, {
					default: withCtx((_, _push, _parent, _scopeId) => {
						if (_push) _push(`Manage speakers`);
						else return [createTextVNode("Manage speakers")];
					}),
					_: 1
				}, _parent));
				_push(ssrRenderComponent(_component_NuxtLink, {
					to: "/admin/program",
					class: "inline-flex items-center justify-center rounded-full border border-amber-300/40 px-5 py-3 text-sm font-bold text-amber-100 transition hover:bg-amber-300/10"
				}, {
					default: withCtx((_, _push, _parent, _scopeId) => {
						if (_push) _push(`Program &amp; agenda`);
						else return [createTextVNode("Program & agenda")];
					}),
					_: 1
				}, _parent));
				_push(ssrRenderComponent(_component_NuxtLink, {
					to: "/admin/users",
					class: "inline-flex items-center justify-center rounded-full border border-amber-300/40 px-5 py-3 text-sm font-bold text-amber-100 transition hover:bg-amber-300/10"
				}, {
					default: withCtx((_, _push, _parent, _scopeId) => {
						if (_push) _push(`Manage users`);
						else return [createTextVNode("Manage users")];
					}),
					_: 1
				}, _parent));
				_push(ssrRenderComponent(_component_NuxtLink, {
					to: "/admin/announcements",
					class: "inline-flex items-center justify-center rounded-full border border-white/20 px-5 py-3 text-sm font-bold text-white transition hover:border-white/40"
				}, {
					default: withCtx((_, _push, _parent, _scopeId) => {
						if (_push) _push(`Announcements`);
						else return [createTextVNode("Announcements")];
					}),
					_: 1
				}, _parent));
				_push(ssrRenderComponent(_component_NuxtLink, {
					to: "/admin/certificates",
					class: "inline-flex items-center justify-center rounded-full border border-white/20 px-5 py-3 text-sm font-bold text-white transition hover:border-white/40"
				}, {
					default: withCtx((_, _push, _parent, _scopeId) => {
						if (_push) _push(`Certificates`);
						else return [createTextVNode("Certificates")];
					}),
					_: 1
				}, _parent));
				_push(ssrRenderComponent(_component_NuxtLink, {
					to: "/admin/email-notifications",
					class: "inline-flex items-center justify-center rounded-full border border-white/20 px-5 py-3 text-sm font-bold text-white transition hover:border-white/40"
				}, {
					default: withCtx((_, _push, _parent, _scopeId) => {
						if (_push) _push(`Email notifications`);
						else return [createTextVNode("Email notifications")];
					}),
					_: 1
				}, _parent));
				_push(ssrRenderComponent(_component_NuxtLink, {
					to: "/admin/attendance",
					class: "inline-flex items-center justify-center rounded-full border border-cyan-300/40 bg-cyan-300/10 px-5 py-3 text-sm font-bold text-cyan-100 transition hover:bg-cyan-300/20"
				}, {
					default: withCtx((_, _push, _parent, _scopeId) => {
						if (_push) _push(`Attendance scanner`);
						else return [createTextVNode("Attendance scanner")];
					}),
					_: 1
				}, _parent));
				_push(ssrRenderComponent(_component_NuxtLink, {
					to: "/admin/reports",
					class: "inline-flex items-center justify-center rounded-full border border-white/20 px-5 py-3 text-sm font-bold text-white transition hover:border-white/40"
				}, {
					default: withCtx((_, _push, _parent, _scopeId) => {
						if (_push) _push(`Payment report`);
						else return [createTextVNode("Payment report")];
					}),
					_: 1
				}, _parent));
				_push(`</div></div></div>`);
			} else _push(`<!---->`);
			_push(`<h2 class="mt-10 text-2xl font-bold" data-v-0b618fe9>Quick access</h2><div class="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3" data-v-0b618fe9><!--[-->`);
			ssrRenderList(menu, (item) => {
				_push(ssrRenderComponent(_component_NuxtLink, {
					key: item.to,
					to: item.to,
					class: "glass-card rounded-3xl p-5 transition hover:-translate-y-1 hover:border-cyan-300/40 sm:p-6"
				}, {
					default: withCtx((_, _push, _parent, _scopeId) => {
						if (_push) _push(`<p class="text-xs uppercase tracking-[.25em] text-cyan-200" data-v-0b618fe9${_scopeId}>${ssrInterpolate(item.label)}</p><h3 class="mt-3 text-xl font-bold" data-v-0b618fe9${_scopeId}>${ssrInterpolate(item.title)}</h3><p class="mt-2 text-sm leading-6 text-slate-400" data-v-0b618fe9${_scopeId}>${ssrInterpolate(item.text)}</p>`);
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
var dashboard_default = /*#__PURE__*/ _plugin_vue_export_helper_default(index_vue_vue_type_script_setup_true_lang_default, [["__scopeId", "data-v-0b618fe9"]]);

export { dashboard_default as default };
//# sourceMappingURL=dashboard-CKN9KTgV.mjs.map
