globalThis.__timing__.logStart('Load chunks/build/pages-8p5mlxv8');import { a as useSeoMeta$1, N as NuxtLink } from '../virtual/entry.mjs';
import { _ as _virtual_public__2Ffoto_2Fai_summit2_default } from './_virtual_public-DfQ863O4.mjs';
import { defineComponent, withCtx, createTextVNode, useSSRContext } from 'vue';
import { p as publicAssetsURL } from '../routes/renderer.mjs';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderAttr, ssrRenderList, ssrInterpolate } from 'vue/server-renderer';
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

//#region \0virtual:public?%2Ffoto%2Fmasa_depan.png
var _virtual_public__2Ffoto_2Fmasa_depan_default = publicAssetsURL("/foto/masa_depan.png");
//#endregion
//#region app/pages/index.vue?vue&type=script&setup=true&lang.ts
var index_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "index",
	__ssrInlineRender: true,
	setup(__props) {
		useSeoMeta$1({
			title: "ASEAN AI for Education Summit 2026",
			description: "A two-day international AI summit and developer workshop in Jakarta, 18–19 November 2026.",
			ogTitle: "Build AI. Transform Education. Connect ASEAN.",
			ogDescription: "Join developers, educators, and institutions building practical AI solutions for education.",
			ogImage: "/foto/masa_depan.png"
		});
		const stats = [
			{
				value: "10",
				label: "ASEAN Countries"
			},
			{
				value: "300+",
				label: "Participants"
			},
			{
				value: "20+",
				label: "Speakers and Mentors"
			},
			{
				value: "12",
				label: "Technical Sessions"
			},
			{
				value: "5",
				label: "Workshop Tracks"
			}
		];
		const experiences = [
			{
				title: "Keynote Sessions",
				text: "Hear regional and international leaders discuss AI, education, workforce development, and collaboration."
			},
			{
				title: "Technical Workshops",
				text: "Build with AI architecture, prompt engineering, RAG, machine learning, analytics, and deployment."
			},
			{
				title: "Collaborative Development",
				text: "Join multidisciplinary teams, solve real educational challenges, and demonstrate a prototype."
			},
			{
				title: "ASEAN Networking",
				text: "Meet developers, researchers, educators, founders, institutions, and technology partners."
			}
		];
		return (_ctx, _push, _parent, _attrs) => {
			const _component_NuxtLink = NuxtLink;
			_push(`<div${ssrRenderAttrs(_attrs)}><section class="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.05fr_.95fr] lg:px-8 lg:py-20"><div class="self-center"><p class="text-sm font-semibold uppercase tracking-[0.35em] text-cyan-200">18–19 November 2026 · Jakarta</p><h1 class="mt-6 text-5xl font-black leading-[.96] sm:text-6xl lg:text-7xl">Building AI for the Future of ASEAN Education</h1><p class="mt-6 max-w-2xl text-lg leading-8 text-slate-300">A two-day international summit and developer workshop connecting technology professionals, educators, researchers, and institutions to create practical AI solutions for students and schools across Southeast Asia.</p><div class="mt-8 flex flex-wrap gap-3">`);
			_push(ssrRenderComponent(_component_NuxtLink, {
				to: "/register",
				class: "rounded-full bg-cyan-400 px-6 py-3 font-semibold text-slate-950"
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
				class: "rounded-full border border-orange-300/30 px-6 py-3 font-semibold text-orange-100"
			}, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`Become a Partner`);
					else return [createTextVNode("Become a Partner")];
				}),
				_: 1
			}, _parent));
			_push(`</div><div class="mt-9 grid gap-3 sm:grid-cols-2"><p class="glass-card rounded-2xl p-4 text-sm text-slate-300"><strong class="block text-white">Jakarta Convention Center</strong>Jakarta, Indonesia</p><p class="glass-card rounded-2xl p-4 text-sm text-slate-300"><strong class="block text-white">International Summit</strong>Technical conference and hands-on workshop</p></div></div><div class="relative"><img${ssrRenderAttr("src", _virtual_public__2Ffoto_2Fmasa_depan_default)} alt="The bright future of artificial intelligence" class="h-full min-h-[480px] w-full rounded-[2.5rem] object-cover"><div class="absolute bottom-5 left-5 right-5 rounded-3xl border border-white/15 bg-slate-950/80 p-5 backdrop-blur"><p class="text-sm uppercase tracking-[0.3em] text-orange-200">Main tagline</p><p class="mt-2 text-2xl font-bold">Build AI. Transform Education. Connect ASEAN.</p></div></div></section><section class="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8"><div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-5"><!--[-->`);
			ssrRenderList(stats, (stat) => {
				_push(`<article class="glass-card rounded-3xl p-5"><strong class="text-3xl text-white">${ssrInterpolate(stat.value)}</strong><p class="mt-2 text-sm leading-6 text-slate-400">${ssrInterpolate(stat.label)}</p></article>`);
			});
			_push(`<!--]--></div></section><section class="mx-auto grid max-w-7xl gap-7 px-4 py-14 sm:px-6 lg:grid-cols-2 lg:px-8"><div><p class="text-sm uppercase tracking-[0.35em] text-cyan-200">A Regional Movement</p><h2 class="mt-4 text-4xl font-black">From conversation to practical solutions.</h2><p class="mt-5 text-lg leading-8 text-slate-300">Artificial intelligence is transforming how people learn, teach, collaborate, and access information. This summit creates a regional platform where developers, educators, researchers, startups, universities, governments, and technology companies build responsibly together.</p>`);
			_push(ssrRenderComponent(_component_NuxtLink, {
				to: "/about",
				class: "mt-7 inline-flex text-sm font-semibold text-cyan-200"
			}, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`Discover why this event matters →`);
					else return [createTextVNode("Discover why this event matters →")];
				}),
				_: 1
			}, _parent));
			_push(`</div><img${ssrRenderAttr("src", _virtual_public__2Ffoto_2Fai_summit2_default)} alt="ASEAN technology professionals collaborating" class="h-80 w-full rounded-[2rem] object-cover"></section><section class="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8"><p class="text-sm uppercase tracking-[0.35em] text-orange-200">Event Experience</p><h2 class="mt-4 text-4xl font-black">Two intensive days of learning and building.</h2><div class="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4"><!--[-->`);
			ssrRenderList(experiences, (item) => {
				_push(`<article class="glass-card rounded-3xl p-6"><h3 class="text-xl font-bold">${ssrInterpolate(item.title)}</h3><p class="mt-3 text-sm leading-7 text-slate-300">${ssrInterpolate(item.text)}</p></article>`);
			});
			_push(`<!--]--></div></section><section class="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8"><div class="overflow-hidden rounded-[2.5rem] border border-cyan-300/20 bg-cyan-300/10 p-8 text-center sm:p-12"><p class="text-sm uppercase tracking-[.35em] text-cyan-100">ASEAN&#39;s AI Community</p><h2 class="mx-auto mt-4 max-w-4xl text-4xl font-black">Build the Future of Education With Us</h2><p class="mx-auto mt-4 max-w-2xl text-slate-300">Two days of learning. Two days of building. A long-term ASEAN network.</p><div class="mt-7 flex flex-wrap justify-center gap-3">`);
			_push(ssrRenderComponent(_component_NuxtLink, {
				to: "/register",
				class: "rounded-full bg-cyan-400 px-6 py-3 font-semibold text-slate-950"
			}, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`Register Now`);
					else return [createTextVNode("Register Now")];
				}),
				_: 1
			}, _parent));
			_push(ssrRenderComponent(_component_NuxtLink, {
				to: "/tickets",
				class: "rounded-full border border-white/20 px-6 py-3 font-semibold"
			}, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`View Ticket Options`);
					else return [createTextVNode("View Ticket Options")];
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

export { pages_default as default };;globalThis.__timing__.logEnd('Load chunks/build/pages-8p5mlxv8');
//# sourceMappingURL=pages-8p5mlxv8.mjs.map
