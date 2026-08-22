import { u as useSeoMeta$1 } from './head-D-xrF-Fu.mjs';
import { _ as _plugin_vue_export_helper_default } from '../virtual/entry.mjs';
import { defineComponent, mergeProps, useSSRContext } from 'vue';
import { p as publicAssetsURL } from '../routes/renderer.mjs';
import { ssrRenderAttrs, ssrRenderList, ssrInterpolate, ssrRenderAttr } from 'vue/server-renderer';
import 'nostics';
import 'unhead/plugins';
import 'unhead/utils';
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
import 'unhead/server';
import 'unhead/legacy';
import 'vue-bundle-renderer/runtime';
import 'devalue';

//#region \0virtual:public?%2Ffoto%2Fpameran.png
var _virtual_public__2Ffoto_2Fpameran_default = publicAssetsURL("/foto/pameran.png");
//#endregion
//#region app/pages/partners.vue?vue&type=script&setup=true&lang.ts
var partners_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "partners",
	__ssrInlineRender: true,
	setup(__props) {
		useSeoMeta$1({
			title: "Partners | IWBIF 2026",
			description: "Partnership opportunities for IWBIF 2026 international business leaders."
		});
		const items = [
			{
				label: "Institutional",
				title: "Strategic Partner",
				text: "For institutions seeking visible leadership in women-led business ecosystems.",
				benefits: "Executive visibility · keynote access · networking forum · premium booth options"
			},
			{
				label: "Infrastructure",
				title: "Business Services Partner",
				text: "For financial, legal, logistics, technology, and business ecosystem firms.",
				benefits: "Program visibility · curated networking · branded roundtables · thought leadership access"
			},
			{
				label: "Academic",
				title: "Knowledge Partner",
				text: "For universities, training organizations, and research institutions.",
				benefits: "Business delegations · executive briefings · market insight sessions"
			},
			{
				label: "Ecosystem",
				title: "Community Partner",
				text: "For associations, women entrepreneur communities, and growth ecosystems.",
				benefits: "Community recognition · member visibility · media collaboration · cross-border promotion"
			}
		];
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<section${ssrRenderAttrs(mergeProps({ class: "partners-shell mx-auto max-w-7xl px-3 py-10 sm:px-6 lg:px-8" }, _attrs))} data-v-6fa5f67f><div class="partner-hero rounded-[2rem] border border-cyan-200/20 bg-gradient-to-br from-cyan-400/8 via-slate-950/80 to-slate-950/90 p-5 sm:p-8" data-v-6fa5f67f><p class="text-sm uppercase tracking-[0.35em] text-cyan-200" data-v-6fa5f67f>Partners and Sponsors</p><h1 class="mt-4 max-w-4xl text-3xl font-black sm:text-5xl" data-v-6fa5f67f>Connect global partners with women-led business opportunities</h1><p class="mt-5 max-w-3xl text-sm leading-7 text-slate-300 sm:text-lg sm:leading-8" data-v-6fa5f67f>Build trust-based visibility with ecosystem brands, financial institutions, chambers, and international collaborators.</p></div><div class="partner-cta mt-8 rounded-[2rem] border border-cyan-200/20 bg-cyan-400/5 p-5 sm:p-6" data-v-6fa5f67f><div data-v-6fa5f67f><p class="text-xs uppercase tracking-[.3em] text-cyan-200" data-v-6fa5f67f>Partnership opportunity</p><p class="mt-3 text-lg font-semibold text-white sm:text-xl" data-v-6fa5f67f>Shape a stronger future for women entrepreneurship and cross-border growth.</p></div><a href="mailto:partners@iwbif-event.example" class="mt-5 inline-flex rounded-full bg-cyan-300 px-5 py-3 font-semibold text-slate-950 shadow-[0_18px_35px_rgba(34,211,238,0.18)] sm:mt-0" data-v-6fa5f67f>Talk to the team</a></div><div class="mt-10 grid gap-5 md:grid-cols-2" data-v-6fa5f67f><!--[-->`);
			ssrRenderList(items, (item) => {
				_push(`<article class="partner-card rounded-[2rem] p-5 sm:p-7" data-v-6fa5f67f><p class="text-xs uppercase tracking-[.25em] text-orange-200" data-v-6fa5f67f>${ssrInterpolate(item.label)}</p><h2 class="mt-4 text-xl font-bold sm:text-2xl" data-v-6fa5f67f>${ssrInterpolate(item.title)}</h2><p class="mt-3 text-sm leading-7 text-slate-300 sm:text-base" data-v-6fa5f67f>${ssrInterpolate(item.text)}</p><p class="mt-5 text-sm text-cyan-200" data-v-6fa5f67f>${ssrInterpolate(item.benefits)}</p></article>`);
			});
			_push(`<!--]--></div><div class="mt-8 grid gap-6 overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 p-4 sm:p-7 md:grid-cols-2" data-v-6fa5f67f><img${ssrRenderAttr("src", _virtual_public__2Ffoto_2Fpameran_default)} alt="Partner exhibition at IWBIF" class="h-64 w-full rounded-3xl object-cover" data-v-6fa5f67f><div class="self-center" data-v-6fa5f67f><h2 class="text-2xl font-bold sm:text-3xl" data-v-6fa5f67f>Support the Future of International Women Entrepreneurship</h2><p class="mt-3 text-sm leading-7 text-slate-300 sm:text-base" data-v-6fa5f67f>Help businesses build sustainable cross-border relationships through sponsorship, strategic sessions, and program co-creation.</p><a href="mailto:partners@iwbif-event.example" class="mt-6 inline-flex w-full items-center justify-center rounded-full bg-cyan-400 px-6 py-3 font-semibold text-slate-950 shadow-[0_18px_35px_rgba(34,211,238,0.18)] sm:w-auto" data-v-6fa5f67f>Contact Partnership Team</a></div></div></section>`);
		};
	}
});
//#endregion
//#region app/pages/partners.vue
var _sfc_setup = partners_vue_vue_type_script_setup_true_lang_default.setup;
partners_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/partners.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var partners_default = /*#__PURE__*/ _plugin_vue_export_helper_default(partners_vue_vue_type_script_setup_true_lang_default, [["__scopeId", "data-v-6fa5f67f"]]);

export { partners_default as default };
//# sourceMappingURL=partners-C_Kz094J.mjs.map
