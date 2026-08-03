globalThis.__timing__.logStart('Load chunks/build/schedule-D3VrIUGJ');import { a as useSeoMeta$1, N as NuxtLink } from '../virtual/entry.mjs';
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

//#region app/pages/dashboard/schedule.vue?vue&type=script&setup=true&lang.ts
var schedule_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "schedule",
	__ssrInlineRender: true,
	setup(__props) {
		useSeoMeta$1({ title: "My Schedule | ASEAN AI for Education" });
		const days = [{
			date: "18 November 2026",
			title: "Inspiration and Collaboration",
			items: [
				{
					time: "07:30",
					title: "QR Code Check-In"
				},
				{
					time: "09:30",
					title: "The Future of AI in ASEAN Education"
				},
				{
					time: "10:45",
					title: "Responsible AI Panel"
				},
				{
					time: "13:00",
					title: "AI Architecture for Education"
				},
				{
					time: "16:00",
					title: "Team Formation and Ideation"
				},
				{
					time: "18:30",
					title: "ASEAN Developer Networking Night"
				}
			]
		}, {
			date: "19 November 2026",
			title: "Development and Demonstration",
			items: [
				{
					time: "08:00",
					title: "Participant Check-In"
				},
				{
					time: "09:00",
					title: "Hands-On Technical Workshop"
				},
				{
					time: "10:45",
					title: "Development Sprint One"
				},
				{
					time: "13:00",
					title: "Development Sprint Two"
				},
				{
					time: "15:00",
					title: "Project Demonstration"
				},
				{
					time: "17:00",
					title: "Awards and Closing"
				}
			]
		}];
		return (_ctx, _push, _parent, _attrs) => {
			const _component_NuxtLink = NuxtLink;
			_push(`<section${ssrRenderAttrs(mergeProps({ class: "mx-auto max-w-5xl px-4 py-12 sm:px-6" }, _attrs))}><p class="text-sm uppercase tracking-[.35em] text-cyan-200">My Schedule</p><h1 class="mt-3 text-4xl font-black">Your summit agenda</h1><div class="mt-8 grid gap-6 md:grid-cols-2"><!--[-->`);
			ssrRenderList(days, (day) => {
				_push(`<article class="glass-card rounded-[2rem] p-6"><p class="text-xs uppercase tracking-[.25em] text-orange-200">${ssrInterpolate(day.date)}</p><h2 class="mt-3 text-2xl font-bold">${ssrInterpolate(day.title)}</h2><div class="mt-5 space-y-4"><!--[-->`);
				ssrRenderList(day.items, (item) => {
					_push(`<div class="border-l-2 border-cyan-300/30 pl-4"><p class="font-mono text-xs text-cyan-200">${ssrInterpolate(item.time)}</p><p class="mt-1 font-semibold">${ssrInterpolate(item.title)}</p></div>`);
				});
				_push(`<!--]--></div></article>`);
			});
			_push(`<!--]--></div>`);
			_push(ssrRenderComponent(_component_NuxtLink, {
				to: "/program",
				class: "mt-7 inline-flex rounded-full border border-white/15 px-5 py-3 font-semibold"
			}, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`View complete program`);
					else return [createTextVNode("View complete program")];
				}),
				_: 1
			}, _parent));
			_push(`</section>`);
		};
	}
});
//#endregion
//#region app/pages/dashboard/schedule.vue
var _sfc_setup = schedule_vue_vue_type_script_setup_true_lang_default.setup;
schedule_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/dashboard/schedule.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var schedule_default = schedule_vue_vue_type_script_setup_true_lang_default;

export { schedule_default as default };;globalThis.__timing__.logEnd('Load chunks/build/schedule-D3VrIUGJ');
//# sourceMappingURL=schedule-D3VrIUGJ.mjs.map
