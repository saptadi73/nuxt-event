import { _ as _plugin_vue_export_helper_default, a as useAsyncData, i as useRuntimeConfig } from '../virtual/entry.mjs';
import { u as useEvent } from './useEvent-B_Up9ELJ.mjs';
import { u as useMediaUrl } from './useMediaUrl-BgmpAAxd.mjs';
import { defineComponent, ref, withAsyncContext, computed, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderList, ssrRenderAttr } from 'vue/server-renderer';
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

//#region app/pages/speakers/index.vue?vue&type=script&setup=true&lang.ts
var index_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "index",
	__ssrInlineRender: true,
	async setup(__props) {
		let __temp, __restore;
		const config = useRuntimeConfig();
		const { getEventSpeakers } = useEvent();
		const { mediaUrl } = useMediaUrl();
		const unavailablePhotos = ref(/* @__PURE__ */ new Set());
		const initials = (name) => name.split(" ").map((part) => part[0]).slice(0, 2).join("").toUpperCase();
		const eventSlug = config.public.eventSlug;
		const { data: response, pending: loading, error, refresh } = ([__temp, __restore] = withAsyncContext(() => useAsyncData(`event-speakers-${eventSlug}`, () => getEventSpeakers(eventSlug))), __temp = await __temp, __restore(), __temp);
		const items = computed(() => response.value?.data ?? []);
		const displayItems = computed(() => [...items.value].sort((a, b) => {
			const nameA = (a.full_name || "").toLowerCase();
			const nameB = (b.full_name || "").toLowerCase();
			if (nameA === nameB) return (a.id || "").localeCompare(b.id || "");
			return nameA.localeCompare(nameB);
		}));
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<section${ssrRenderAttrs(mergeProps({ class: "mx-auto max-w-7xl px-3 py-10 sm:px-6 lg:px-8" }, _attrs))} data-v-243cd645><p class="text-sm uppercase tracking-[0.3em] text-cyan-200/70" data-v-243cd645>Speakers</p><div class="mt-3 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between" data-v-243cd645><h1 class="text-3xl font-black text-white sm:text-4xl lg:text-5xl" data-v-243cd645>Featured Speakers &amp; Ecosystem Leaders</h1><span class="inline-flex w-fit rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.25em] text-slate-200" data-v-243cd645>${ssrInterpolate(unref(loading) ? "Loading..." : `${unref(displayItems).length} speakers`)}</span></div>`);
			if (unref(loading)) {
				_push(`<div class="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3" role="status" aria-live="polite" aria-label="Loading speakers" data-v-243cd645><!--[-->`);
				ssrRenderList(6, (item) => {
					_push(`<article class="rounded-[1.75rem] border border-white/10 bg-white/5 p-4 sm:p-5" aria-hidden="true" data-v-243cd645><div class="speaker-skeleton h-20 w-20 rounded-2xl" data-v-243cd645></div><div class="speaker-skeleton mt-5 h-2.5 w-12 rounded-full" data-v-243cd645></div><div class="speaker-skeleton mt-3 h-5 w-3/4 rounded-full" data-v-243cd645></div><div class="speaker-skeleton mt-2 h-3 w-1/2 rounded-full" data-v-243cd645></div><div class="speaker-skeleton mt-5 h-3 w-2/3 rounded-full" data-v-243cd645></div><div class="mt-5 space-y-2" data-v-243cd645><div class="speaker-skeleton h-3 w-full rounded-full" data-v-243cd645></div><div class="speaker-skeleton h-3 w-5/6 rounded-full" data-v-243cd645></div><div class="speaker-skeleton h-3 w-2/3 rounded-full" data-v-243cd645></div></div></article>`);
				});
				_push(`<!--]--><span class="sr-only" data-v-243cd645>Loading speakers...</span></div>`);
			} else if (unref(error)) _push(`<div class="mt-8 rounded-[1.75rem] border border-orange-300/20 bg-orange-300/10 p-4 text-sm text-orange-100" data-v-243cd645><p class="font-semibold" data-v-243cd645>Unable to load speakers from backend.</p><p class="mt-1 text-orange-100/80" data-v-243cd645>Please check the API connection or try again.</p><button type="button" class="mt-3 rounded-full border border-orange-300/30 px-4 py-2 text-xs uppercase tracking-[.2em] text-orange-100" data-v-243cd645>Retry</button></div>`);
			else if (!unref(displayItems).length) _push(`<div class="mt-8 rounded-[1.75rem] border border-white/10 bg-white/5 p-4 text-sm text-slate-200" data-v-243cd645><p data-v-243cd645>No speakers found.</p></div>`);
			else {
				_push(`<div class="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3" data-v-243cd645><!--[-->`);
				ssrRenderList(unref(displayItems), (speaker) => {
					_push(`<article class="rounded-[1.75rem] border border-white/10 bg-white/5 p-4 sm:p-5" data-v-243cd645>`);
					if (speaker.profile_photo_url && !unref(unavailablePhotos).has(speaker.id)) _push(`<img${ssrRenderAttr("src", unref(mediaUrl)(speaker.profile_photo_url))}${ssrRenderAttr("alt", speaker.full_name)} class="mb-5 h-20 w-20 rounded-2xl object-cover" data-v-243cd645>`);
					else _push(`<div class="mb-5 flex h-20 w-20 items-center justify-center rounded-2xl bg-cyan-300/10 text-xl font-bold text-cyan-200" data-v-243cd645>${ssrInterpolate(initials(speaker.full_name))}</div>`);
					_push(`<p class="text-[10px] uppercase tracking-[.25em] text-slate-400 sm:text-xs" data-v-243cd645>${ssrInterpolate(speaker.country_code || "UNSPEC")}</p><h2 class="mt-3 text-xl font-semibold text-white" data-v-243cd645>${ssrInterpolate(speaker.full_name)}</h2><p class="mt-1 text-sm text-cyan-200/90" data-v-243cd645>${ssrInterpolate(speaker.professional_title || "Speaker")}</p><p class="mt-4 text-sm text-slate-300" data-v-243cd645>${ssrInterpolate(speaker.organization_name || "-")}</p><p class="mt-3 text-sm leading-7 text-slate-300" data-v-243cd645>${ssrInterpolate(speaker.biography)}</p>`);
					if (speaker.expertise_tags?.length) {
						_push(`<div class="mt-4 flex flex-wrap gap-2" data-v-243cd645><!--[-->`);
						ssrRenderList(speaker.expertise_tags, (tag) => {
							_push(`<span class="rounded-full bg-white/5 px-3 py-1 text-xs text-slate-300" data-v-243cd645>${ssrInterpolate(tag)}</span>`);
						});
						_push(`<!--]--></div>`);
					} else _push(`<!---->`);
					if (speaker.session_title) _push(`<p class="mt-4 border-t border-white/10 pt-4 text-sm text-orange-100" data-v-243cd645><strong data-v-243cd645>Forum Topic:</strong> ${ssrInterpolate(speaker.session_title)}</p>`);
					else _push(`<!---->`);
					_push(`</article>`);
				});
				_push(`<!--]--></div>`);
			}
			_push(`</section>`);
		};
	}
});
//#endregion
//#region app/pages/speakers/index.vue
var _sfc_setup = index_vue_vue_type_script_setup_true_lang_default.setup;
index_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/speakers/index.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var speakers_default = /*#__PURE__*/ _plugin_vue_export_helper_default(index_vue_vue_type_script_setup_true_lang_default, [["__scopeId", "data-v-243cd645"]]);

export { speakers_default as default };
//# sourceMappingURL=speakers-l4xsV9iv.mjs.map
