globalThis.__timing__.logStart('Load chunks/build/announcements-DIRWO0y-');import { a as useSeoMeta$1 } from '../virtual/entry.mjs';
import { defineComponent, mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderList, ssrInterpolate } from 'vue/server-renderer';
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

//#region app/pages/dashboard/announcements.vue?vue&type=script&setup=true&lang.ts
var announcements_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "announcements",
	__ssrInlineRender: true,
	setup(__props) {
		useSeoMeta$1({ title: "Announcements | IWBIF 2026" });
		const items = [
			{
				type: "Preparation",
				date: "1 August 2026",
				title: "Complete registration details",
				text: "Submit full business profile details and ensure your directory preferences are updated before pre-matching opens."
			},
			{
				type: "Schedule",
				date: "1 August 2026",
				title: "Review business matching windows",
				text: "Opening and confirmation windows are announced in your participant inbox and dashboard timeline."
			},
			{
				type: "Security",
				date: "1 August 2026",
				title: "Protect your QR code",
				text: "Your QR code is private. Keep it off public channels and only share it for official check-in."
			}
		];
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<section${ssrRenderAttrs(mergeProps({ class: "mx-auto max-w-4xl px-4 py-12 sm:px-6" }, _attrs))}><p class="text-sm uppercase tracking-[.35em] text-cyan-200">Event Announcements</p><h1 class="mt-3 text-4xl font-black">Important participant updates</h1><div class="mt-8 space-y-5"><!--[-->`);
			ssrRenderList(items, (item) => {
				_push(`<article class="glass-card rounded-3xl p-6"><div class="flex flex-wrap justify-between gap-3"><span class="text-xs uppercase tracking-[.25em] text-orange-200">${ssrInterpolate(item.type)}</span><time class="text-xs text-slate-500">${ssrInterpolate(item.date)}</time></div><h2 class="mt-3 text-xl font-bold">${ssrInterpolate(item.title)}</h2><p class="mt-3 leading-7 text-slate-300">${ssrInterpolate(item.text)}</p></article>`);
			});
			_push(`<!--]--></div></section>`);
		};
	}
});
//#endregion
//#region app/pages/dashboard/announcements.vue
var _sfc_setup = announcements_vue_vue_type_script_setup_true_lang_default.setup;
announcements_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/dashboard/announcements.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var announcements_default = announcements_vue_vue_type_script_setup_true_lang_default;

export { announcements_default as default };;globalThis.__timing__.logEnd('Load chunks/build/announcements-DIRWO0y-');
//# sourceMappingURL=announcements-DIRWO0y-.mjs.map
