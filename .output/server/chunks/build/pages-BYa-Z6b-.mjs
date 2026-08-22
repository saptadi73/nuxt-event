import { _ as _plugin_vue_export_helper_default, u as useAuthStore, s as storeToRefs, h as useRegistrationFlow, N as NuxtLink } from '../virtual/entry.mjs';
import { u as useSeoMeta$1 } from './head-D-xrF-Fu.mjs';
import { _ as _virtual_public__2Fimages_2Fwhy_indonesia_default } from './_virtual_public-klSSHraZ.mjs';
import { defineComponent, computed, ref, unref, withCtx, createTextVNode, toDisplayString, createVNode, useSSRContext } from 'vue';
import { p as publicAssetsURL } from '../routes/renderer.mjs';
import { ssrRenderAttrs, ssrRenderAttr, ssrRenderComponent, ssrInterpolate, ssrRenderList } from 'vue/server-renderer';
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

//#region \0virtual:public?%2Fimages%2Fiwbif-2026-hero-01.png
var _virtual_public__2Fimages_2Fiwbif_2026_hero_01_default = publicAssetsURL("/images/iwbif-2026-hero-01.png");
//#endregion
//#region app/pages/index.vue?vue&type=script&setup=true&lang.ts
var index_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "index",
	__ssrInlineRender: true,
	setup(__props) {
		const authStore = useAuthStore();
		const { isAuthenticated } = storeToRefs(authStore);
		const registrationFlow = useRegistrationFlow();
		const homeCtaTo = computed(() => isAuthenticated.value ? registrationFlow.ctaTo.value : "/auth/register");
		const homeCtaLabel = computed(() => {
			if (!isAuthenticated.value) return "Register Now!";
			if (registrationFlow.primaryStatus.value === "not_selected") return "Secure Your Seats";
			if (["selected", "payment_pending"].includes(registrationFlow.primaryStatus.value)) return `Continue as ${registrationFlow.primaryType.value === "exhibitor" ? "Exhibitor" : "Delegate"}`;
			return registrationFlow.ctaLabel.value;
		});
		useSeoMeta$1({
			title: "IWBIF 2026 | International Women Business & Investment Forum",
			description: "Join IWBIF 2026 in Jakarta for global collaboration, women-led investment and market access, and curated business matching.",
			ogTitle: "International Women Business & Investment Forum 2026",
			ogDescription: "Empowering Women Entrepreneurs Through Finance, Global Collaboration, and Digital Transformation.",
			ogImage: "/images/iwbif-2026-hero-01.png"
		});
		const featuredStats = [
			{
				label: "Delegates, buyers, investors, and ecosystem leaders",
				value: 500,
				suffix: "+"
			},
			{
				label: "Global speakers and strategic sessions",
				value: 9,
				suffix: "+"
			},
			{
				label: "Business Matching sectors and channels",
				value: 6,
				suffix: ""
			},
			{
				label: "International business network groups",
				value: 3,
				suffix: ""
			},
			{
				label: "Industrial visit for investment immersion",
				value: 1,
				suffix: ""
			},
			{
				label: "Event days on business outcomes",
				value: 4,
				suffix: ""
			}
		];
		const displayedStats = ref(featuredStats.map(() => 0));
		ref(false);
		const globalNetworks = [
			"AWEN",
			"BRICS WBA",
			"APEC BEST",
			"International Chambers of Commerce",
			"Global Business Organizations"
		];
		const experiences = [
			"Keynote Sessions",
			"Expert Panel Discussions",
			"Business Matching",
			"Partner Exhibition"
		];
		return (_ctx, _push, _parent, _attrs) => {
			const _component_NuxtLink = NuxtLink;
			_push(`<div${ssrRenderAttrs(_attrs)} data-v-29a10f2c><section class="hero-stage" aria-labelledby="hero-title" data-v-29a10f2c><h1 id="hero-title" class="sr-only" data-v-29a10f2c>International Women Business and Investment Forum 2026 Jakarta</h1><div class="hero-halo hero-halo-left" data-v-29a10f2c></div><div class="hero-halo hero-halo-right" data-v-29a10f2c></div><div class="hero-frame" data-v-29a10f2c><img${ssrRenderAttr("src", _virtual_public__2Fimages_2Fiwbif_2026_hero_01_default)} alt="IWBIF 2026 Jakarta featuring women business leaders, international collaboration, business matching, and investment opportunities" class="hero-image" width="1829" height="860" loading="eager" fetchpriority="high" data-v-29a10f2c><div class="hero-vignette" data-v-29a10f2c></div></div><nav class="hero-action-dock" aria-label="Main event action" data-v-29a10f2c><div class="hero-action-status" data-v-29a10f2c><span class="hero-live-dot" aria-hidden="true" data-v-29a10f2c></span>Registration is now open</div><div class="hero-action-links" data-v-29a10f2c>`);
			_push(ssrRenderComponent(_component_NuxtLink, {
				to: unref(homeCtaTo),
				class: "hero-button hero-button-primary hero-button-primary-large"
			}, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`${ssrInterpolate(unref(homeCtaLabel))} <span aria-hidden="true" data-v-29a10f2c${_scopeId}>→</span>`);
					else return [createTextVNode(toDisplayString(unref(homeCtaLabel)) + " ", 1), createVNode("span", { "aria-hidden": "true" }, "→")];
				}),
				_: 1
			}, _parent));
			_push(`</div></nav></section><section class="home-section mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16" data-v-29a10f2c><div class="grid gap-px overflow-hidden rounded-[2rem] border border-white/10 bg-white/10 sm:grid-cols-3" data-v-29a10f2c><!--[-->`);
			ssrRenderList(featuredStats, (stat, index) => {
				_push(`<article class="featured-stat-card p-6 sm:p-7" data-v-29a10f2c><strong class="text-3xl text-[#d8ac59] sm:text-4xl" data-v-29a10f2c>${ssrInterpolate(displayedStats.value[index])}${ssrInterpolate(stat.suffix)}</strong><p class="mt-2 text-sm leading-6 text-slate-300" data-v-29a10f2c>${ssrInterpolate(stat.label)}</p></article>`);
			});
			_push(`<!--]--></div></section><section class="home-section mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-16" data-v-29a10f2c><div class="glass-card rounded-[2rem] border border-white/10 bg-slate-950/35 p-8" data-v-29a10f2c><p class="text-xs uppercase tracking-[.35em] text-[#d8ac59]" data-v-29a10f2c>International Presence</p><h2 class="premium-title mt-3" data-v-29a10f2c>Trusted global ecosystem of <span class="title-highlight" data-v-29a10f2c>women-led business.</span></h2><p class="mt-4 max-w-3xl text-lg leading-8 text-slate-300" data-v-29a10f2c>IWBIF is positioned as a meeting ground for women entrepreneurs, investors, chambers, and ecosystem leaders to build credible, investable international partnerships.</p><div class="mt-6 grid gap-3 sm:grid-cols-3" data-v-29a10f2c><!--[-->`);
			ssrRenderList(globalNetworks, (network) => {
				_push(`<p class="rounded-full border border-white/15 px-4 py-2 text-sm" data-v-29a10f2c>${ssrInterpolate(network)}</p>`);
			});
			_push(`<!--]--></div></div></section><section class="home-section why-indonesia-section mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-20" data-v-29a10f2c><div class="why-heading" data-v-29a10f2c><div data-v-29a10f2c><p class="text-xs font-bold uppercase tracking-[.35em] text-[#d8ac59]" data-v-29a10f2c>Why Indonesia</p><h2 class="premium-title mt-4 max-w-3xl leading-tight text-[#f8f6f1]" data-v-29a10f2c>Where opportunity, connectivity, and <span class="title-highlight" data-v-29a10f2c>culture converge.</span></h2></div><span class="why-coordinate" aria-hidden="true" data-v-29a10f2c>06°12′S · 106°49′E</span></div><figure class="why-visual" data-v-29a10f2c><div class="why-image-wrap" data-v-29a10f2c><img${ssrRenderAttr("src", _virtual_public__2Fimages_2Fwhy_indonesia_default)} alt="Indonesia&#39;s modern infrastructure, manufacturing, cultural heritage, natural destinations, and global trade connections" class="why-image" width="1672" height="941" loading="lazy" data-v-29a10f2c><div class="why-image-overlay" aria-hidden="true" data-v-29a10f2c></div><span class="why-visual-label" data-v-29a10f2c>Indonesia · Gateway to ASEAN &amp; Asia</span></div><figcaption class="why-content-card" data-v-29a10f2c><p class="why-card-kicker" data-v-29a10f2c>A strategic home for growth</p><h3 class="mt-3 text-2xl font-black text-[#f8f6f1] sm:text-3xl" data-v-29a10f2c>Scale meets global possibility.</h3><p class="mt-4 leading-7 text-[#cbd2dc]" data-v-29a10f2c>A G20 economy with more than 283 million people, Indonesia connects ambitious businesses to ASEAN, Asia, trusted partners, and new investment pathways.</p><div class="why-proof-grid" data-v-29a10f2c><span data-v-29a10f2c><strong data-v-29a10f2c>283M+</strong> Domestic market</span><span data-v-29a10f2c><strong data-v-29a10f2c>G20</strong> Global convening power</span><span data-v-29a10f2c><strong data-v-29a10f2c>ASEAN</strong> Regional gateway</span></div>`);
			_push(ssrRenderComponent(_component_NuxtLink, {
				to: "/about",
				class: "why-link"
			}, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`Discover why Indonesia <span aria-hidden="true" data-v-29a10f2c${_scopeId}>→</span>`);
					else return [createTextVNode("Discover why Indonesia "), createVNode("span", { "aria-hidden": "true" }, "→")];
				}),
				_: 1
			}, _parent));
			_push(`</figcaption></figure></section><section class="home-section mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8" data-v-29a10f2c><div class="grid gap-6 lg:grid-cols-2" data-v-29a10f2c><article class="glass-card rounded-[2rem] p-8" data-v-29a10f2c><p class="text-xs uppercase tracking-[.35em] text-[#d8ac59]" data-v-29a10f2c>Event Experience</p><h3 class="mt-3 text-3xl font-black" data-v-29a10f2c>Deal-Ready Agenda Structure</h3><div class="mt-6 grid gap-3 sm:grid-cols-2" data-v-29a10f2c><!--[-->`);
			ssrRenderList(experiences, (item) => {
				_push(`<p class="rounded-2xl border border-white/10 px-4 py-3 text-sm" data-v-29a10f2c>${ssrInterpolate(item)}</p>`);
			});
			_push(`<!--]--></div></article><article class="glass-card rounded-[2rem] p-8" data-v-29a10f2c><p class="text-xs uppercase tracking-[.35em] text-[#d8ac59]" data-v-29a10f2c>Program Snapshot</p><h3 class="mt-3 text-3xl font-black" data-v-29a10f2c>Four days, business outcomes first</h3><div class="mt-6 space-y-4" data-v-29a10f2c>`);
			_push(ssrRenderComponent(_component_NuxtLink, {
				to: "/program",
				class: "block rounded-xl border border-white/15 px-4 py-3 transition hover:border-[#d8ac59]/60 hover:text-[#e6c477]"
			}, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`Explore full 4-day program`);
					else return [createTextVNode("Explore full 4-day program")];
				}),
				_: 1
			}, _parent));
			_push(ssrRenderComponent(_component_NuxtLink, {
				to: "/business-matching",
				class: "block rounded-xl border border-white/15 px-4 py-3 transition hover:border-[#d8ac59]/60 hover:text-[#e6c477]"
			}, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`Review matching windows and industries`);
					else return [createTextVNode("Review matching windows and industries")];
				}),
				_: 1
			}, _parent));
			_push(ssrRenderComponent(_component_NuxtLink, {
				to: "/deal-room",
				class: "block rounded-xl border border-white/15 px-4 py-3 transition hover:border-[#d8ac59]/60 hover:text-[#e6c477]"
			}, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`See Deal Room flow`);
					else return [createTextVNode("See Deal Room flow")];
				}),
				_: 1
			}, _parent));
			_push(`</div></article></div></section><section class="home-section mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8" data-v-29a10f2c><div class="rounded-[2.5rem] border border-[#d8ac59]/20 bg-[#d8ac59]/10 p-8 text-center sm:p-12" data-v-29a10f2c><p class="text-sm uppercase tracking-[.35em] text-[#f8f6f1]" data-v-29a10f2c>IWBIF 2026</p><h2 class="mt-4 text-4xl font-black" data-v-29a10f2c>Connect. Match. Make Deals.</h2><p class="mx-auto mt-4 max-w-2xl text-slate-300" data-v-29a10f2c>Explore new markets, investment opportunities, partnerships, and cross-border collaboration from one place.</p><div class="mt-7 flex flex-wrap justify-center gap-3" data-v-29a10f2c>`);
			_push(ssrRenderComponent(_component_NuxtLink, {
				to: unref(homeCtaTo),
				class: "rounded-full bg-[#e6c477] px-6 py-3 text-lg font-semibold text-[#04152d] sm:text-xl"
			}, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`${ssrInterpolate(unref(homeCtaLabel))}`);
					else return [createTextVNode(toDisplayString(unref(homeCtaLabel)), 1)];
				}),
				_: 1
			}, _parent));
			_push(ssrRenderComponent(_component_NuxtLink, {
				to: "/participants",
				class: "rounded-full border border-white/20 px-6 py-3 font-semibold"
			}, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`Explore Participants`);
					else return [createTextVNode("Explore Participants")];
				}),
				_: 1
			}, _parent));
			_push(ssrRenderComponent(_component_NuxtLink, {
				to: "/deal-room",
				class: "rounded-full border border-white/20 px-6 py-3 font-semibold"
			}, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`Open Deal Room`);
					else return [createTextVNode("Open Deal Room")];
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
var pages_default = /*#__PURE__*/ _plugin_vue_export_helper_default(index_vue_vue_type_script_setup_true_lang_default, [["__scopeId", "data-v-29a10f2c"]]);

export { pages_default as default };
//# sourceMappingURL=pages-BYa-Z6b-.mjs.map
