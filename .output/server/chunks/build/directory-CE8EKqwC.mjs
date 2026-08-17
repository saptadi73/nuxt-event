globalThis.__timing__.logStart('Load chunks/build/directory-CE8EKqwC');import { c as useSeoMeta$1, f as useAsyncData } from '../virtual/entry.mjs';
import { u as useMediaUrl } from './useMediaUrl-CtPklTwb.mjs';
import { u as useParticipant } from './useParticipant-CPMevOwd.mjs';
import { defineComponent, ref, withAsyncContext, computed, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderAttr, ssrRenderList, ssrInterpolate } from 'vue/server-renderer';
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

//#region app/pages/dashboard/directory.vue?vue&type=script&setup=true&lang.ts
var directory_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "directory",
	__ssrInlineRender: true,
	async setup(__props) {
		let __temp, __restore;
		useSeoMeta$1({ title: "Participant Directory | IWBIF 2026" });
		const { getParticipants } = useParticipant();
		const { mediaUrl } = useMediaUrl();
		const query = ref("");
		const { data: response, pending } = ([__temp, __restore] = withAsyncContext(() => useAsyncData("participants-directory", () => getParticipants(1, 100))), __temp = await __temp, __restore(), __temp);
		const people = computed(() => Array.isArray(response.value?.data) ? response.value.data : response.value?.data?.items ?? []);
		const filtered = computed(() => {
			const search = query.value.trim().toLowerCase();
			if (!search) return people.value;
			return people.value.filter((person) => `${person.full_name} ${person.organization_name || ""} ${person.biography || ""}`.toLowerCase().includes(search));
		});
		const initials = (name) => name.split(" ").map((part) => part[0]).slice(0, 2).join("").toUpperCase();
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<section${ssrRenderAttrs(mergeProps({ class: "mx-auto max-w-7xl px-3 py-10 sm:px-6 lg:px-8" }, _attrs))}><p class="text-sm uppercase tracking-[.35em] text-cyan-200">Participant Directory</p><h1 class="mt-3 text-3xl font-black sm:text-4xl">Connect With IWBIF Professionals</h1><p class="mt-3 max-w-3xl text-sm leading-7 text-slate-300 sm:text-base">Find collaborators, investors, business partners, and delegates aligned with your growth goals. Private contact information is never displayed.</p><div class="mt-8"><label><span class="sr-only">Search participants</span><input${ssrRenderAttr("value", unref(query))} type="search" placeholder="Search name, organization, or biography" class="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-4 outline-none focus:border-cyan-300"></label></div>`);
			if (unref(pending)) {
				_push(`<div class="mt-7 grid gap-5 md:grid-cols-2 lg:grid-cols-3"><!--[-->`);
				ssrRenderList(6, (item) => {
					_push(`<div class="h-64 animate-pulse rounded-3xl bg-white/5"></div>`);
				});
				_push(`<!--]--></div>`);
			} else {
				_push(`<div class="mt-7 grid gap-5 md:grid-cols-2 lg:grid-cols-3"><!--[-->`);
				ssrRenderList(unref(filtered), (person) => {
					_push(`<article class="glass-card rounded-3xl p-4 sm:p-6">`);
					if (person.profile_photo_url) _push(`<img${ssrRenderAttr("src", unref(mediaUrl)(person.profile_photo_url))}${ssrRenderAttr("alt", person.full_name)} class="h-14 w-14 rounded-2xl object-cover">`);
					else _push(`<div class="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-300/10 text-lg font-bold text-cyan-200">${ssrInterpolate(initials(person.full_name))}</div>`);
					_push(`<h2 class="mt-4 text-xl font-bold">${ssrInterpolate(person.full_name)}</h2><p class="mt-2 text-sm text-slate-400">${ssrInterpolate(person.organization_name || "Independent participant")}</p>`);
					if (person.biography) _push(`<p class="mt-4 text-sm leading-6 text-slate-300">${ssrInterpolate(person.biography)}</p>`);
					else _push(`<!---->`);
					_push(`</article>`);
				});
				_push(`<!--]--></div>`);
			}
			if (!unref(pending) && !unref(filtered).length) _push(`<div class="mt-7 rounded-3xl border border-dashed border-white/15 p-7 text-center text-slate-400">No participants match these filters.</div>`);
			else _push(`<!---->`);
			_push(`</section>`);
		};
	}
});
//#endregion
//#region app/pages/dashboard/directory.vue
var _sfc_setup = directory_vue_vue_type_script_setup_true_lang_default.setup;
directory_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/dashboard/directory.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var directory_default = directory_vue_vue_type_script_setup_true_lang_default;

export { directory_default as default };;globalThis.__timing__.logEnd('Load chunks/build/directory-CE8EKqwC');
//# sourceMappingURL=directory-CE8EKqwC.mjs.map
