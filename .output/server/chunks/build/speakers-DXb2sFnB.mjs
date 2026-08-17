globalThis.__timing__.logStart('Load chunks/build/speakers-DXb2sFnB');import { c as useSeoMeta$1, f as useAsyncData, e as useNuxtApp } from '../virtual/entry.mjs';
import { u as useMediaUrl } from './useMediaUrl-CtPklTwb.mjs';
import { defineComponent, ref, withAsyncContext, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderList, ssrRenderAttr, ssrInterpolate, ssrIncludeBooleanAttr } from 'vue/server-renderer';
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

//#region app/composables/useSpeaker.ts
function useSpeaker() {
	const api = useNuxtApp().$api;
	const getSpeakers = (page = 1, size = 100) => api(`/speakers?page=${page}&size=${size}`);
	const uploadSpeakerPhoto = (speakerId, file) => {
		const body = new FormData();
		body.append("file", file);
		return api(`/speakers/${speakerId}/photo`, {
			method: "POST",
			body
		});
	};
	return {
		getSpeakers,
		uploadSpeakerPhoto
	};
}
//#endregion
//#region app/pages/admin/speakers/index.vue?vue&type=script&setup=true&lang.ts
var index_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "index",
	__ssrInlineRender: true,
	async setup(__props) {
		let __temp, __restore;
		useSeoMeta$1({ title: "Manage Speaker Photos | IWBIF 2026" });
		const { getSpeakers} = useSpeaker();
		const { mediaUrl } = useMediaUrl();
		const feedback = ref("");
		const uploadingId = ref("");
		const { data: response, pending } = ([__temp, __restore] = withAsyncContext(() => useAsyncData("admin-speakers", () => getSpeakers())), __temp = await __temp, __restore(), __temp);
		const speakers = ref(response.value?.data ?? []);
		const initials = (name) => name.split(" ").map((part) => part[0]).slice(0, 2).join("").toUpperCase();
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<section${ssrRenderAttrs(mergeProps({ class: "mx-auto max-w-4xl px-4 py-14 sm:px-6" }, _attrs))}><h1 class="text-4xl font-black">Manage Speaker Photos</h1><p class="mt-3 text-slate-300">Upload a JPG, PNG, or WebP profile photo (maximum 5 MB) for each speaker.</p>`);
			if (unref(pending)) {
				_push(`<div class="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3"><!--[-->`);
				ssrRenderList(6, (item) => {
					_push(`<div class="h-60 animate-pulse rounded-3xl bg-white/5"></div>`);
				});
				_push(`<!--]--></div>`);
			} else {
				_push(`<div class="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3"><!--[-->`);
				ssrRenderList(unref(speakers), (speaker) => {
					_push(`<article class="glass-card rounded-3xl p-6">`);
					if (speaker.profile_photo_url) _push(`<img${ssrRenderAttr("src", unref(mediaUrl)(speaker.profile_photo_url))}${ssrRenderAttr("alt", speaker.full_name)} class="h-20 w-20 rounded-2xl object-cover">`);
					else _push(`<div class="flex h-20 w-20 items-center justify-center rounded-2xl bg-cyan-300/10 text-xl font-bold text-cyan-200">${ssrInterpolate(initials(speaker.full_name))}</div>`);
					_push(`<h2 class="mt-4 text-xl font-bold">${ssrInterpolate(speaker.full_name)}</h2><p class="mt-1 text-sm text-slate-400">${ssrInterpolate(speaker.professional_title || "Speaker")}</p><label class="mt-5 block text-sm text-slate-300"><span class="mb-2 block">Replace photo</span><input type="file" accept="image/jpeg,image/png,image/webp"${ssrIncludeBooleanAttr(unref(uploadingId) === speaker.id) ? " disabled" : ""} class="block w-full text-xs text-slate-300 file:mr-3 file:rounded-full file:border-0 file:bg-cyan-400 file:px-3 file:py-2 file:font-semibold file:text-slate-950 disabled:opacity-50"></label></article>`);
				});
				_push(`<!--]--></div>`);
			}
			if (unref(feedback)) _push(`<p class="mt-6 rounded-2xl border border-cyan-300/30 bg-cyan-300/10 px-4 py-3 text-sm">${ssrInterpolate(unref(feedback))}</p>`);
			else _push(`<!---->`);
			_push(`</section>`);
		};
	}
});
//#endregion
//#region app/pages/admin/speakers/index.vue
var _sfc_setup = index_vue_vue_type_script_setup_true_lang_default.setup;
index_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin/speakers/index.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var speakers_default = index_vue_vue_type_script_setup_true_lang_default;

export { speakers_default as default };;globalThis.__timing__.logEnd('Load chunks/build/speakers-DXb2sFnB');
//# sourceMappingURL=speakers-DXb2sFnB.mjs.map
