import { _ as _plugin_vue_export_helper_default, a as useAsyncData, N as NuxtLink, f as useNuxtApp } from '../virtual/entry.mjs';
import { u as useSeoMeta$1 } from './head-D-xrF-Fu.mjs';
import { u as useEvent } from './useEvent-D4WcF23a.mjs';
import { u as useAdminContent } from './useAdminContent-GiNaIDgL.mjs';
import { u as useMediaUrl } from './useMediaUrl-BgmpAAxd.mjs';
import { defineComponent, withAsyncContext, ref, computed, reactive, mergeProps, withCtx, createTextVNode, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrIncludeBooleanAttr, ssrRenderAttr, ssrRenderClass, ssrInterpolate, ssrRenderList, ssrRenderTeleport, ssrLooseContain, ssrLooseEqual } from 'vue/server-renderer';
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
		useSeoMeta$1({ title: "Manage Speakers | IWBIF 2026" });
		const { getSpeakers} = useSpeaker();
		useAdminContent();
		const { getEvents } = useEvent();
		const { mediaUrl } = useMediaUrl();
		const { data: response, pending } = ([__temp, __restore] = withAsyncContext(() => useAsyncData("admin-speakers", () => getSpeakers(1, 100))), __temp = await __temp, __restore(), __temp);
		const speakers = ref(response.value?.data ?? []);
		const { data: eventResponse } = ([__temp, __restore] = withAsyncContext(() => useAsyncData("admin-speaker-events", () => getEvents(1, 100))), __temp = await __temp, __restore(), __temp);
		const events = computed(() => eventResponse.value?.data || []);
		const selectedEventId = ref(events.value[0]?.id || "");
		const search = ref("");
		const filteredSpeakers = computed(() => {
			const query = search.value.toLowerCase();
			return query ? speakers.value.filter((item) => `${item.full_name} ${item.organization_name || ""}`.toLowerCase().includes(query)) : speakers.value;
		});
		const modalOpen = ref(false), editingId = ref(""), saving = ref(false), feedback = ref("");
		const feedbackTone = ref("success"), expertiseText = ref("");
		const selectedPhoto = ref(null), photoPreview = ref("");
		const emptyForm = () => ({
			full_name: "",
			professional_title: "",
			organization_name: "",
			country_code: "",
			biography: "",
			linkedin_url: "",
			website_url: "",
			session_title: "",
			is_featured: false,
			status: "published"
		});
		const form = reactive(emptyForm());
		const initials = (name) => name.split(" ").map((part) => part[0]).slice(0, 2).join("").toUpperCase();
		return (_ctx, _push, _parent, _attrs) => {
			const _component_NuxtLink = NuxtLink;
			_push(`<section${ssrRenderAttrs(mergeProps({ class: "mx-auto max-w-7xl px-3 py-10 sm:px-6 lg:px-8" }, _attrs))} data-v-23580e84><div class="flex flex-wrap items-end justify-between gap-5" data-v-23580e84><div data-v-23580e84><p class="text-sm uppercase tracking-[.3em] text-cyan-200" data-v-23580e84>Event operations</p><h1 class="mt-3 text-3xl font-black sm:text-4xl" data-v-23580e84>Speakers</h1><p class="mt-3 text-sm leading-7 text-slate-300" data-v-23580e84>Manage speaker profiles, publication, event placement, and photos.</p></div><div class="flex flex-wrap gap-3" data-v-23580e84>`);
			_push(ssrRenderComponent(_component_NuxtLink, {
				to: "/speakers",
				class: "action-secondary"
			}, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`View public speakers`);
					else return [createTextVNode("View public speakers")];
				}),
				_: 1
			}, _parent));
			_push(`<button class="action-primary"${ssrIncludeBooleanAttr(!unref(selectedEventId)) ? " disabled" : ""}${ssrRenderAttr("title", unref(selectedEventId) ? "Add speaker" : "Select event first")} data-v-23580e84>+ New speaker</button></div></div>`);
			if (unref(feedback)) _push(`<p class="${ssrRenderClass([unref(feedbackTone) === "error" ? "border-red-300/30 bg-red-950/30 text-red-100" : "border-emerald-300/30 bg-emerald-950/30 text-emerald-100", "mt-5 rounded-2xl border p-4 text-sm"])}" data-v-23580e84>${ssrInterpolate(unref(feedback))}</p>`);
			else _push(`<!---->`);
			_push(`<div class="mt-8 flex flex-col gap-4 rounded-3xl border border-white/10 bg-white/[.04] p-4 sm:flex-row sm:items-center sm:justify-between" data-v-23580e84><label class="relative block w-full sm:max-w-sm" data-v-23580e84><span class="sr-only" data-v-23580e84>Search speakers</span><input${ssrRenderAttr("value", unref(search))} class="w-full rounded-full border border-white/10 bg-slate-950/70 px-5 py-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-cyan-300/50" placeholder="Search name or organization..." data-v-23580e84></label><p class="text-sm text-slate-400" data-v-23580e84>${ssrInterpolate(unref(filteredSpeakers).length)} speakers</p></div><div class="mt-6 overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950/45 shadow-2xl shadow-slate-950/30" data-v-23580e84><div class="overflow-x-auto" data-v-23580e84><table class="w-full min-w-[900px] text-left" data-v-23580e84><thead class="border-b border-white/10 bg-white/[.045] text-[11px] uppercase tracking-[.18em] text-slate-400" data-v-23580e84><tr data-v-23580e84><th class="px-5 py-4" data-v-23580e84>Speaker</th><th class="px-5 py-4" data-v-23580e84>Organization</th><th class="px-5 py-4" data-v-23580e84>Country</th><th class="px-5 py-4" data-v-23580e84>Expertise</th><th class="px-5 py-4" data-v-23580e84>Status</th><th class="px-5 py-4 text-right" data-v-23580e84>Actions</th></tr></thead><tbody class="divide-y divide-white/[.07]" data-v-23580e84>`);
			if (unref(pending)) _push(`<tr data-v-23580e84><td colspan="6" class="px-5 py-12 text-center text-slate-400" data-v-23580e84>Loading speakers...</td></tr>`);
			else if (!unref(filteredSpeakers).length) _push(`<tr data-v-23580e84><td colspan="6" class="px-5 py-12 text-center text-slate-400" data-v-23580e84>No speakers found.</td></tr>`);
			else {
				_push(`<!--[-->`);
				ssrRenderList(unref(filteredSpeakers), (speaker) => {
					_push(`<tr class="transition hover:bg-cyan-300/[.035]" data-v-23580e84><td class="px-5 py-4" data-v-23580e84><div class="flex items-center gap-3" data-v-23580e84>`);
					if (speaker.profile_photo_url) _push(`<img${ssrRenderAttr("src", unref(mediaUrl)(speaker.profile_photo_url))}${ssrRenderAttr("alt", speaker.full_name)} class="h-12 w-12 rounded-xl object-cover ring-1 ring-white/10" data-v-23580e84>`);
					else _push(`<div class="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-300/10 font-bold text-cyan-200" data-v-23580e84>${ssrInterpolate(initials(speaker.full_name))}</div>`);
					_push(`<div data-v-23580e84><p class="font-bold text-white" data-v-23580e84>${ssrInterpolate(speaker.full_name)}</p><p class="mt-1 text-xs text-slate-400" data-v-23580e84>${ssrInterpolate(speaker.professional_title || "Speaker")}</p></div></div></td><td class="px-5 py-4 text-sm text-slate-300" data-v-23580e84>${ssrInterpolate(speaker.organization_name || "—")}</td><td class="px-5 py-4 text-sm uppercase text-slate-300" data-v-23580e84>${ssrInterpolate(speaker.country_code || "—")}</td><td class="px-5 py-4" data-v-23580e84><div class="flex max-w-xs flex-wrap gap-1" data-v-23580e84><!--[-->`);
					ssrRenderList((speaker.expertise_tags || []).slice(0, 2), (tag) => {
						_push(`<span class="rounded-full bg-white/[.07] px-2 py-1 text-[10px] text-slate-300" data-v-23580e84>${ssrInterpolate(tag)}</span>`);
					});
					_push(`<!--]-->`);
					if ((speaker.expertise_tags || []).length > 2) _push(`<span class="text-xs text-slate-500" data-v-23580e84>+${ssrInterpolate(speaker.expertise_tags.length - 2)}</span>`);
					else _push(`<!---->`);
					_push(`</div></td><td class="px-5 py-4" data-v-23580e84><span class="${ssrRenderClass([speaker.status === "published" ? "status-live" : "status-draft", "status-pill"])}" data-v-23580e84>${ssrInterpolate(speaker.status || "published")}</span>`);
					if (speaker.is_featured) _push(`<span class="ml-2 text-amber-200" title="Featured" data-v-23580e84>★</span>`);
					else _push(`<!---->`);
					_push(`</td><td class="px-5 py-4" data-v-23580e84><div class="flex justify-end gap-2" data-v-23580e84><button class="table-button" data-v-23580e84>Edit</button><button class="table-button border-red-300/20 text-red-200 hover:border-red-300/50" data-v-23580e84>Delete</button></div></td></tr>`);
				});
				_push(`<!--]-->`);
			}
			_push(`</tbody></table></div></div>`);
			ssrRenderTeleport(_push, (_push) => {
				if (unref(modalOpen)) {
					_push(`<div class="modal-backdrop" data-v-23580e84><form class="modal-card" data-v-23580e84><div class="flex items-start justify-between gap-4 border-b border-white/10 px-5 py-5 sm:px-7" data-v-23580e84><div data-v-23580e84><p class="text-xs uppercase tracking-[.24em] text-cyan-200" data-v-23580e84>Speaker editor</p><h2 class="mt-2 text-2xl font-black" data-v-23580e84>${ssrInterpolate(unref(editingId) ? "Update speaker" : "Create speaker")}</h2></div><button type="button" class="modal-close" aria-label="Close" data-v-23580e84>×</button></div><div class="max-h-[70vh] space-y-5 overflow-y-auto px-5 py-6 sm:px-7" data-v-23580e84><div class="flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/[.035] p-4 sm:flex-row sm:items-center" data-v-23580e84>`);
					if (unref(photoPreview)) _push(`<img${ssrRenderAttr("src", unref(photoPreview))} alt="Speaker photo preview" class="h-24 w-24 rounded-2xl object-cover" data-v-23580e84>`);
					else _push(`<div class="flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl bg-cyan-300/10 text-2xl font-bold text-cyan-200" data-v-23580e84>${ssrInterpolate(initials(unref(form).full_name || "Speaker"))}</div>`);
					_push(`<div data-v-23580e84><p class="font-semibold" data-v-23580e84>Profile photo</p><p class="mt-1 text-xs leading-5 text-slate-400" data-v-23580e84>JPG, PNG, or WebP; maximum 5 MB.</p><label class="mt-3 inline-flex cursor-pointer rounded-full bg-white/10 px-4 py-2 text-xs font-bold text-cyan-100 hover:bg-white/15" data-v-23580e84><span data-v-23580e84>${ssrInterpolate(unref(selectedPhoto) ? "Change selected photo" : unref(editingId) ? "Replace photo" : "Choose photo")}</span><input class="sr-only" type="file" accept="image/jpeg,image/png,image/webp" data-v-23580e84></label></div></div>`);
					if (!unref(editingId)) {
						_push(`<label class="field" data-v-23580e84><span data-v-23580e84>Event</span><select data-v-23580e84><option value="" disabled data-v-23580e84${ssrIncludeBooleanAttr(Array.isArray(unref(selectedEventId)) ? ssrLooseContain(unref(selectedEventId), "") : ssrLooseEqual(unref(selectedEventId), "")) ? " selected" : ""}>Select event</option><!--[-->`);
						ssrRenderList(unref(events), (event) => {
							_push(`<option${ssrRenderAttr("value", event.id)} data-v-23580e84${ssrIncludeBooleanAttr(Array.isArray(unref(selectedEventId)) ? ssrLooseContain(unref(selectedEventId), event.id) : ssrLooseEqual(unref(selectedEventId), event.id)) ? " selected" : ""}>${ssrInterpolate(event.name)}</option>`);
						});
						_push(`<!--]--></select>`);
						if (!unref(selectedEventId)) _push(`<small class="mt-2 block text-xs text-amber-200" data-v-23580e84>Pilih event terlebih dahulu untuk membuat speaker baru.</small>`);
						else _push(`<!---->`);
						_push(`</label>`);
					} else _push(`<!---->`);
					_push(`<div class="grid gap-4 sm:grid-cols-2" data-v-23580e84><label class="field" data-v-23580e84><span data-v-23580e84>Full name</span><input${ssrRenderAttr("value", unref(form).full_name)} required data-v-23580e84></label><label class="field" data-v-23580e84><span data-v-23580e84>Professional title</span><input${ssrRenderAttr("value", unref(form).professional_title)} data-v-23580e84></label></div><div class="grid gap-4 sm:grid-cols-2" data-v-23580e84><label class="field" data-v-23580e84><span data-v-23580e84>Organization</span><input${ssrRenderAttr("value", unref(form).organization_name)} data-v-23580e84></label><label class="field" data-v-23580e84><span data-v-23580e84>Country code</span><input${ssrRenderAttr("value", unref(form).country_code)} maxlength="3" placeholder="IDN" data-v-23580e84></label></div><label class="field" data-v-23580e84><span data-v-23580e84>Biography</span><textarea rows="4" data-v-23580e84>${ssrInterpolate(unref(form).biography)}</textarea></label><label class="field" data-v-23580e84><span data-v-23580e84>Expertise (comma separated)</span><input${ssrRenderAttr("value", unref(expertiseText))} placeholder="Investment, Global Trade" data-v-23580e84></label><label class="field" data-v-23580e84><span data-v-23580e84>Session title</span><input${ssrRenderAttr("value", unref(form).session_title)} data-v-23580e84></label><div class="grid gap-4 sm:grid-cols-2" data-v-23580e84><label class="field" data-v-23580e84><span data-v-23580e84>LinkedIn URL</span><input${ssrRenderAttr("value", unref(form).linkedin_url)} type="url" data-v-23580e84></label><label class="field" data-v-23580e84><span data-v-23580e84>Website URL</span><input${ssrRenderAttr("value", unref(form).website_url)} type="url" data-v-23580e84></label></div><div class="grid gap-4 sm:grid-cols-2" data-v-23580e84><label class="field" data-v-23580e84><span data-v-23580e84>Status</span><select data-v-23580e84><option value="draft" data-v-23580e84${ssrIncludeBooleanAttr(Array.isArray(unref(form).status) ? ssrLooseContain(unref(form).status, "draft") : ssrLooseEqual(unref(form).status, "draft")) ? " selected" : ""}>Draft</option><option value="published" data-v-23580e84${ssrIncludeBooleanAttr(Array.isArray(unref(form).status) ? ssrLooseContain(unref(form).status, "published") : ssrLooseEqual(unref(form).status, "published")) ? " selected" : ""}>Published</option></select></label><label class="flex items-center gap-3 pt-7 text-sm text-slate-300" data-v-23580e84><input${ssrIncludeBooleanAttr(Array.isArray(unref(form).is_featured) ? ssrLooseContain(unref(form).is_featured, null) : unref(form).is_featured) ? " checked" : ""} type="checkbox" data-v-23580e84> Featured speaker</label></div></div><div class="flex justify-end gap-3 border-t border-white/10 px-5 py-5 sm:px-7" data-v-23580e84><button type="button" class="action-secondary" data-v-23580e84>Cancel</button><button class="action-primary"${ssrIncludeBooleanAttr(unref(saving)) ? " disabled" : ""} data-v-23580e84>${ssrInterpolate(unref(saving) ? "Saving..." : "Save speaker")}</button></div></form></div>`);
				} else _push(`<!---->`);
			}, "body", false, _parent);
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
var speakers_default = /*#__PURE__*/ _plugin_vue_export_helper_default(index_vue_vue_type_script_setup_true_lang_default, [["__scopeId", "data-v-23580e84"]]);

export { speakers_default as default };
//# sourceMappingURL=speakers-D-2k3YAP.mjs.map
