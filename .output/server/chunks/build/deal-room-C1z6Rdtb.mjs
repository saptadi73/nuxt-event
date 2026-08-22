import { u as useSeoMeta$1 } from './head-D-xrF-Fu.mjs';
import { _ as _plugin_vue_export_helper_default, N as NuxtLink } from '../virtual/entry.mjs';
import { defineComponent, mergeProps, withCtx, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderList, ssrInterpolate, ssrRenderComponent } from 'vue/server-renderer';
import 'nostics';
import 'unhead/plugins';
import 'unhead/utils';
import '../routes/renderer.mjs';
import '../_/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import 'unhead/server';
import 'unhead/legacy';
import 'vue-bundle-renderer/runtime';
import 'devalue';
import 'nostics/formatters/ansi';
import 'vue-router';
import '@vue/shared';

//#region app/pages/deal-room.vue?vue&type=script&setup=true&lang.ts
var deal_room_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "deal-room",
	__ssrInlineRender: true,
	setup(__props) {
		useSeoMeta$1({ title: "Deal Room | IWBIF 2026" });
		const steps = [
			{
				step: "01",
				title: "Discover",
				text: "Find aligned companies, buyers, investors, and partners."
			},
			{
				step: "02",
				title: "Meet",
				text: "Request and manage curated business meetings."
			},
			{
				step: "03",
				title: "Follow up",
				text: "Track commitments and 30/60/90-day next actions."
			}
		];
		const metrics = [
			{
				value: "1:1",
				label: "Curated meetings"
			},
			{
				value: "30/60",
				label: "Follow-up actions"
			},
			{
				value: "ROI",
				label: "Commercial momentum"
			}
		];
		return (_ctx, _push, _parent, _attrs) => {
			const _component_NuxtLink = NuxtLink;
			_push(`<section${ssrRenderAttrs(mergeProps({ class: "deal-shell mx-auto max-w-5xl px-3 py-10 sm:px-6 lg:px-8" }, _attrs))} data-v-a27637b8><div class="deal-hero rounded-[2rem] border border-amber-200/20 bg-gradient-to-br from-amber-300/8 via-slate-950/80 to-slate-950/90 p-5 sm:p-8" data-v-a27637b8><p class="text-sm uppercase tracking-[.35em] text-amber-200" data-v-a27637b8>Deal Room</p><h1 class="mt-4 text-3xl font-black sm:text-5xl" data-v-a27637b8>Move from introductions to outcomes.</h1><p class="mt-5 max-w-3xl text-sm leading-7 text-slate-300 sm:text-lg sm:leading-8" data-v-a27637b8>The IWBIF Deal Room supports focused conversations, meeting requests, and follow-up actions between confirmed delegates.</p></div><div class="mt-10 grid gap-5 md:grid-cols-3" data-v-a27637b8><!--[-->`);
			ssrRenderList(steps, (item) => {
				_push(`<article class="deal-card rounded-[2rem] p-5 sm:p-6" data-v-a27637b8><p class="text-xs uppercase tracking-[.25em] text-amber-200" data-v-a27637b8>${ssrInterpolate(item.step)}</p><h2 class="mt-3 text-xl font-bold sm:text-2xl" data-v-a27637b8>${ssrInterpolate(item.title)}</h2><p class="mt-3 text-sm leading-7 text-slate-300 sm:text-base" data-v-a27637b8>${ssrInterpolate(item.text)}</p></article>`);
			});
			_push(`<!--]--></div><div class="mt-8 rounded-[2rem] border border-amber-200/20 bg-amber-200/5 p-5 sm:p-7" data-v-a27637b8><p class="text-xs uppercase tracking-[.35em] text-amber-200" data-v-a27637b8>Business outcomes</p><p class="mt-3 text-lg leading-8 text-slate-200 sm:text-xl" data-v-a27637b8>A curated environment for partnership conversations, commercial follow-up, and measurable deal momentum.</p><div class="mt-6 grid gap-3 sm:grid-cols-3" data-v-a27637b8><!--[-->`);
			ssrRenderList(metrics, (metric) => {
				_push(`<div class="metric-box" data-v-a27637b8><span class="metric-value" data-v-a27637b8>${ssrInterpolate(metric.value)}</span><span class="metric-label" data-v-a27637b8>${ssrInterpolate(metric.label)}</span></div>`);
			});
			_push(`<!--]--></div>`);
			_push(ssrRenderComponent(_component_NuxtLink, {
				to: "/dashboard",
				class: "mt-6 inline-flex rounded-full bg-amber-300 px-6 py-3 font-semibold text-slate-950 shadow-[0_18px_35px_rgba(216,172,89,0.2)]"
			}, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`Open Participant Dashboard`);
					else return [createTextVNode("Open Participant Dashboard")];
				}),
				_: 1
			}, _parent));
			_push(`</div></section>`);
		};
	}
});
//#endregion
//#region app/pages/deal-room.vue
var _sfc_setup = deal_room_vue_vue_type_script_setup_true_lang_default.setup;
deal_room_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/deal-room.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var deal_room_default = /*#__PURE__*/ _plugin_vue_export_helper_default(deal_room_vue_vue_type_script_setup_true_lang_default, [["__scopeId", "data-v-a27637b8"]]);

export { deal_room_default as default };
//# sourceMappingURL=deal-room-C1z6Rdtb.mjs.map
