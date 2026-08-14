globalThis.__timing__.logStart('Load chunks/build/deal-room-T9m7TnDU');import { a as useSeoMeta$1, N as NuxtLink } from '../virtual/entry.mjs';
import { defineComponent, mergeProps, withCtx, createTextVNode, useSSRContext } from 'vue';
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
		return (_ctx, _push, _parent, _attrs) => {
			const _component_NuxtLink = NuxtLink;
			_push(`<section${ssrRenderAttrs(mergeProps({ class: "mx-auto max-w-5xl px-4 py-14 sm:px-6 lg:px-8" }, _attrs))}><p class="text-sm uppercase tracking-[.35em] text-amber-200">Deal Room</p><h1 class="mt-4 text-5xl font-black">Move from introductions to outcomes.</h1><p class="mt-5 max-w-3xl text-lg leading-8 text-slate-300">The IWBIF Deal Room supports focused conversations, meeting requests, and follow-up actions between confirmed delegates.</p><div class="mt-10 grid gap-5 md:grid-cols-3"><!--[-->`);
			ssrRenderList(steps, (item) => {
				_push(`<article class="glass-card rounded-3xl p-6"><p class="text-xs uppercase tracking-[.25em] text-amber-200">${ssrInterpolate(item.step)}</p><h2 class="mt-3 text-xl font-bold">${ssrInterpolate(item.title)}</h2><p class="mt-3 text-sm leading-7 text-slate-400">${ssrInterpolate(item.text)}</p></article>`);
			});
			_push(`<!--]--></div>`);
			_push(ssrRenderComponent(_component_NuxtLink, {
				to: "/dashboard",
				class: "mt-8 inline-flex rounded-full bg-amber-300 px-6 py-3 font-semibold text-slate-950"
			}, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`Open Participant Dashboard`);
					else return [createTextVNode("Open Participant Dashboard")];
				}),
				_: 1
			}, _parent));
			_push(`</section>`);
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
var deal_room_default = deal_room_vue_vue_type_script_setup_true_lang_default;

export { deal_room_default as default };;globalThis.__timing__.logEnd('Load chunks/build/deal-room-T9m7TnDU');
//# sourceMappingURL=deal-room-T9m7TnDU.mjs.map
