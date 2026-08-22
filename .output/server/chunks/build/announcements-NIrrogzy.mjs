import { a as useAsyncData, i as useRuntimeConfig } from '../virtual/entry.mjs';
import { u as useSeoMeta$1 } from './head-D-xrF-Fu.mjs';
import { u as useEvent } from './useEvent-B_Up9ELJ.mjs';
import { u as useEventUpdates } from './useEventUpdates-MW0eSvke.mjs';
import { defineComponent, ref, withAsyncContext, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderList } from 'vue/server-renderer';
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

//#region app/pages/dashboard/announcements.vue?vue&type=script&setup=true&lang.ts
var announcements_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "announcements",
	__ssrInlineRender: true,
	async setup(__props) {
		let __temp, __restore;
		useSeoMeta$1({ title: "Announcements | IWBIF 2026" });
		const config = useRuntimeConfig();
		const { getEvents } = useEvent();
		const { getAnnouncements } = useEventUpdates();
		const errorMessage = ref("");
		const { data: items, pending } = ([__temp, __restore] = withAsyncContext(async () => useAsyncData("dashboard-announcements", async () => {
			try {
				const events = (await getEvents(1, 100)).data;
				const event = events.find((item) => item.slug === config.public.eventSlug) || events[0];
				if (!event) return [];
				return (await getAnnouncements(event.id)).data || [];
			} catch (error) {
				errorMessage.value = error.data?.message || (error instanceof Error ? error.message : "Announcements could not be loaded.");
				return [];
			}
		}, { default: () => [] })), __temp = await __temp, __restore(), __temp);
		const formatDate = (value) => value ? new Intl.DateTimeFormat("en-GB", {
			dateStyle: "long",
			timeZone: "Asia/Jakarta"
		}).format(new Date(value)) : "";
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<section${ssrRenderAttrs(mergeProps({ class: "mx-auto max-w-4xl px-3 py-10 sm:px-6" }, _attrs))}><p class="text-sm uppercase tracking-[.35em] text-cyan-200">Event Announcements</p><h1 class="mt-3 text-3xl font-black sm:text-4xl">Important participant updates</h1>`);
			if (unref(pending)) _push(`<p class="glass-card mt-8 rounded-3xl p-6 text-slate-300">Loading announcements...</p>`);
			else if (unref(errorMessage)) _push(`<p class="mt-8 rounded-2xl border border-red-300/30 bg-red-950/30 p-4 text-red-100">${ssrInterpolate(unref(errorMessage))}</p>`);
			else if (!unref(items).length) _push(`<p class="glass-card mt-8 rounded-3xl p-6 text-slate-300">No announcements have been published yet.</p>`);
			else {
				_push(`<div class="mt-8 space-y-5"><!--[-->`);
				ssrRenderList(unref(items), (item) => {
					_push(`<article class="glass-card rounded-3xl p-4 sm:p-6"><div class="flex flex-wrap justify-between gap-3"><span class="text-xs uppercase tracking-[.25em] text-orange-200">Announcement</span><time class="text-xs text-slate-500">${ssrInterpolate(formatDate(item.published_at || item.created_at))}</time></div><h2 class="mt-3 text-lg font-bold sm:text-xl">${ssrInterpolate(item.title)}</h2><p class="mt-3 whitespace-pre-line text-sm leading-7 text-slate-300 sm:text-base">${ssrInterpolate(item.body)}</p></article>`);
				});
				_push(`<!--]--></div>`);
			}
			_push(`</section>`);
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

export { announcements_default as default };
//# sourceMappingURL=announcements-NIrrogzy.mjs.map
