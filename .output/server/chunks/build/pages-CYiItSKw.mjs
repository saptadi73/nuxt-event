globalThis.__timing__.logStart('Load chunks/build/pages-CYiItSKw');import { a as useSeoMeta$1, N as NuxtLink } from '../virtual/entry.mjs';
import { defineComponent, withCtx, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrInterpolate } from 'vue/server-renderer';
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

//#region app/pages/index.vue?vue&type=script&setup=true&lang.ts
var index_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "index",
	__ssrInlineRender: true,
	setup(__props) {
		useSeoMeta$1({
			title: "IWBIF 2026 | International Women Business & Investment Forum",
			description: "Join IWBIF 2026 in Jakarta, 14–17 October, for global collaboration, investment, and women-led business growth.",
			ogTitle: "International Women Business & Investment Forum 2026",
			ogDescription: "Connect. Collaborate. Create."
		});
		const stats = [
			{
				value: "500+",
				label: "International delegates"
			},
			{
				value: "2 Days",
				label: "Core business forum program"
			},
			{
				value: "6",
				label: "Business matching sectors"
			},
			{
				value: "3",
				label: "International business networks"
			},
			{
				value: "1",
				label: "Industrial visit"
			},
			{
				value: "9+",
				label: "Global speakers"
			}
		];
		const experiences = [
			{
				title: "Keynote Sessions",
				text: "Strategic perspectives from government and global business leaders."
			},
			{
				title: "Expert Panels",
				text: "Finance, digital transformation, markets, and cross-border collaboration."
			},
			{
				title: "Business Matching",
				text: "Curated meetings with buyers, investors, distributors, and partners."
			},
			{
				title: "Partner Exhibition",
				text: "A premium showcase for women-led products, services, and opportunities."
			}
		];
		return (_ctx, _push, _parent, _attrs) => {
			const _component_NuxtLink = NuxtLink;
			_push(`<div${ssrRenderAttrs(_attrs)}><section class="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1.1fr_.9fr] lg:px-8 lg:py-24"><div class="self-center"><p class="text-sm font-semibold uppercase tracking-[.3em] text-amber-200">14–17 October 2026 · Jakarta, Indonesia</p><h1 class="mt-6 text-5xl font-black leading-[.96] sm:text-6xl lg:text-7xl">International Women Business &amp; Investment Forum 2026</h1><p class="mt-6 max-w-2xl text-xl italic leading-8 text-slate-200">Empowering Women Entrepreneurs Through Finance, Global Collaboration, and Digital Transformation.</p><p class="mt-5 max-w-2xl leading-8 text-slate-400">Join women entrepreneurs, investors, business leaders, government representatives, financial institutions, and global partners in a trusted ecosystem for cross-border growth.</p><div class="mt-8 flex flex-wrap gap-3">`);
			_push(ssrRenderComponent(_component_NuxtLink, {
				to: "/register",
				class: "rounded-full bg-amber-300 px-6 py-3 font-semibold text-slate-950"
			}, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`Register Now`);
					else return [createTextVNode("Register Now")];
				}),
				_: 1
			}, _parent));
			_push(ssrRenderComponent(_component_NuxtLink, {
				to: "/program",
				class: "rounded-full border border-white/20 px-6 py-3 font-semibold"
			}, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`Explore the Program`);
					else return [createTextVNode("Explore the Program")];
				}),
				_: 1
			}, _parent));
			_push(ssrRenderComponent(_component_NuxtLink, {
				to: "/partners",
				class: "rounded-full border border-amber-300/30 px-6 py-3 font-semibold text-amber-100"
			}, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`Become a Partner`);
					else return [createTextVNode("Become a Partner")];
				}),
				_: 1
			}, _parent));
			_push(`</div><div class="mt-9 grid gap-3 sm:grid-cols-2"><p class="glass-card rounded-2xl p-4 text-sm text-slate-300"><strong class="block text-white">Hotel Kempinski Indonesia</strong>Jakarta, Indonesia</p><p class="glass-card rounded-2xl p-4 text-sm text-slate-300"><strong class="block text-white">International Forum</strong>English, Indonesian, and Chinese</p></div></div><div class="glass-card flex min-h-[480px] items-end rounded-[2.5rem] p-7"><div><p class="text-sm uppercase tracking-[.3em] text-amber-200">Connect · Collaborate · Create</p><p class="mt-3 text-3xl font-bold">Turn trusted connections into global business opportunities.</p><p class="mt-4 leading-7 text-slate-300">Forum discussions, curated business matching, partner exhibition, and an industrial visit in one delegate journey.</p></div></div></section><section class="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8"><div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"><!--[-->`);
			ssrRenderList(stats, (stat) => {
				_push(`<article class="glass-card rounded-3xl p-5"><strong class="text-3xl text-white">${ssrInterpolate(stat.value)}</strong><p class="mt-2 text-sm leading-6 text-slate-400">${ssrInterpolate(stat.label)}</p></article>`);
			});
			_push(`<!--]--></div></section><section class="mx-auto grid max-w-7xl gap-8 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8"><div><p class="text-sm uppercase tracking-[.35em] text-amber-200">A trusted global ecosystem</p><h2 class="mt-4 text-4xl font-black">Build bridges. Unlock investment. Accelerate partnerships.</h2><p class="mt-5 text-lg leading-8 text-slate-300">IWBIF brings women entrepreneurs together with buyers, investors, embassies, business networks, and ecosystem leaders. The forum supports transparent, inclusive, and sustainable women-led business collaboration.</p>`);
			_push(ssrRenderComponent(_component_NuxtLink, {
				to: "/about",
				class: "mt-7 inline-flex text-sm font-semibold text-amber-200"
			}, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`Discover why Indonesia →`);
					else return [createTextVNode("Discover why Indonesia →")];
				}),
				_: 1
			}, _parent));
			_push(`</div><div class="grid gap-4 sm:grid-cols-2"><!--[-->`);
			ssrRenderList(experiences, (item) => {
				_push(`<article class="glass-card rounded-3xl p-6"><h3 class="text-xl font-bold">${ssrInterpolate(item.title)}</h3><p class="mt-3 text-sm leading-7 text-slate-300">${ssrInterpolate(item.text)}</p></article>`);
			});
			_push(`<!--]--></div></section><section class="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8"><div class="rounded-[2.5rem] border border-amber-300/20 bg-amber-300/10 p-8 text-center sm:p-12"><p class="text-sm uppercase tracking-[.35em] text-amber-100">IWBIF 2026</p><h2 class="mt-4 text-4xl font-black">Connect. Match. Make Deals.</h2><p class="mx-auto mt-4 max-w-2xl text-slate-300">Explore new markets, investment opportunities, strategic partnerships, and cross-border business connections.</p><div class="mt-7 flex flex-wrap justify-center gap-3">`);
			_push(ssrRenderComponent(_component_NuxtLink, {
				to: "/register",
				class: "rounded-full bg-amber-300 px-6 py-3 font-semibold text-slate-950"
			}, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`Register Now`);
					else return [createTextVNode("Register Now")];
				}),
				_: 1
			}, _parent));
			_push(ssrRenderComponent(_component_NuxtLink, {
				to: "/business-matching",
				class: "rounded-full border border-white/20 px-6 py-3 font-semibold"
			}, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`Business Matching`);
					else return [createTextVNode("Business Matching")];
				}),
				_: 1
			}, _parent));
			_push(`</div></div></section></div>`);
		};
	}
});
//#endregion
//#region app/pages/index.vue
var _sfc_setup = index_vue_vue_type_script_setup_true_lang_default.setup;
index_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/index.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var pages_default = index_vue_vue_type_script_setup_true_lang_default;

export { pages_default as default };;globalThis.__timing__.logEnd('Load chunks/build/pages-CYiItSKw');
//# sourceMappingURL=pages-CYiItSKw.mjs.map
