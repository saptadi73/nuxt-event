import { u as useSeoMeta$1 } from './head-D-xrF-Fu.mjs';
import { _ as _plugin_vue_export_helper_default, a as useAsyncData } from '../virtual/entry.mjs';
import { u as useAdminOperations } from './useAdminOperations-Cfti5GtJ.mjs';
import { u as useEvent } from './useEvent-B_Up9ELJ.mjs';
import { defineComponent, withAsyncContext, computed, ref, reactive, watch, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderList, ssrRenderAttr, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrInterpolate, ssrRenderTeleport } from 'vue/server-renderer';
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

//#region app/pages/admin/announcements.vue?vue&type=script&setup=true&lang.ts
var announcements_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "announcements",
	__ssrInlineRender: true,
	async setup(__props) {
		let __temp, __restore;
		useSeoMeta$1({ title: "Manage Announcements | IWBIF 2026" });
		const api = useAdminOperations(), { getEvents } = useEvent();
		const { data: eventResponse } = ([__temp, __restore] = withAsyncContext(() => useAsyncData("announcement-events", () => getEvents(1, 100))), __temp = await __temp, __restore(), __temp);
		const events = computed(() => eventResponse.value?.data || []), eventId = ref(events.value[0]?.id || ""), items = ref([]), loading = ref(false), saving = ref(false), modalOpen = ref(false), editingId = ref(""), feedback = ref("");
		const empty = () => ({
			title: "",
			body: "",
			status: "draft",
			published_at: ""
		}), form = reactive(empty());
		const errorText = (e) => e.data?.message || (e instanceof Error ? e.message : "Operation failed.");
		const load = async () => {
			if (!eventId.value) return;
			loading.value = true;
			try {
				items.value = (await api.getAdminAnnouncements(eventId.value)).data || [];
			} catch (e) {
				feedback.value = errorText(e);
			} finally {
				loading.value = false;
			}
		};
		watch(eventId, load);
		if (eventId.value) [__temp, __restore] = withAsyncContext(() => load()), await __temp, __restore();
		const formatDate = (v) => v ? new Intl.DateTimeFormat("en-GB", {
			dateStyle: "medium",
			timeStyle: "short"
		}).format(new Date(v)) : "—";
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<section${ssrRenderAttrs(mergeProps({ class: "mx-auto max-w-7xl px-3 py-10 sm:px-6" }, _attrs))} data-v-65e648b2><div class="flex flex-wrap items-end justify-between gap-5" data-v-65e648b2><div data-v-65e648b2><p class="text-xs uppercase tracking-[.3em] text-cyan-200" data-v-65e648b2>Communications</p><h1 class="mt-3 text-3xl font-black" data-v-65e648b2>Announcements</h1><p class="mt-3 text-slate-400" data-v-65e648b2>Draft, publish, archive, and remove event updates.</p></div><button class="primary" data-v-65e648b2>+ New announcement</button></div><label class="field mt-8 block max-w-md" data-v-65e648b2><span data-v-65e648b2>Event</span><select data-v-65e648b2><!--[-->`);
			ssrRenderList(unref(events), (event) => {
				_push(`<option${ssrRenderAttr("value", event.id)} data-v-65e648b2${ssrIncludeBooleanAttr(Array.isArray(unref(eventId)) ? ssrLooseContain(unref(eventId), event.id) : ssrLooseEqual(unref(eventId), event.id)) ? " selected" : ""}>${ssrInterpolate(event.name)}</option>`);
			});
			_push(`<!--]--></select></label>`);
			if (unref(feedback)) _push(`<p class="mt-5 rounded-2xl border border-cyan-300/20 bg-cyan-300/10 p-4" data-v-65e648b2>${ssrInterpolate(unref(feedback))}</p>`);
			else _push(`<!---->`);
			_push(`<div class="mt-6 overflow-x-auto rounded-[2rem] border border-white/10 bg-slate-950/45" data-v-65e648b2><table class="w-full min-w-[800px] text-left" data-v-65e648b2><thead data-v-65e648b2><tr data-v-65e648b2><th data-v-65e648b2>Title</th><th data-v-65e648b2>Status</th><th data-v-65e648b2>Published</th><th class="text-right" data-v-65e648b2>Actions</th></tr></thead><tbody data-v-65e648b2>`);
			if (unref(loading)) _push(`<tr data-v-65e648b2><td colspan="4" class="py-12 text-center" data-v-65e648b2>Loading...</td></tr>`);
			else if (!unref(items).length) _push(`<tr data-v-65e648b2><td colspan="4" class="py-12 text-center" data-v-65e648b2>No announcements.</td></tr>`);
			else {
				_push(`<!--[-->`);
				ssrRenderList(unref(items), (item) => {
					_push(`<tr data-v-65e648b2><td data-v-65e648b2><strong data-v-65e648b2>${ssrInterpolate(item.title)}</strong><small data-v-65e648b2>${ssrInterpolate(item.body.slice(0, 100))}</small></td><td data-v-65e648b2><span class="pill" data-v-65e648b2>${ssrInterpolate(item.status)}</span></td><td data-v-65e648b2>${ssrInterpolate(formatDate(item.published_at))}</td><td data-v-65e648b2><div class="flex justify-end gap-2" data-v-65e648b2><button class="table-button" data-v-65e648b2>Edit</button><button class="table-button text-red-200" data-v-65e648b2>Delete</button></div></td></tr>`);
				});
				_push(`<!--]-->`);
			}
			_push(`</tbody></table></div>`);
			ssrRenderTeleport(_push, (_push) => {
				if (unref(modalOpen)) _push(`<div class="backdrop" data-v-65e648b2><form class="modal" data-v-65e648b2><header data-v-65e648b2><div data-v-65e648b2><p class="text-xs uppercase tracking-[.25em] text-cyan-200" data-v-65e648b2>Announcement editor</p><h2 data-v-65e648b2>${ssrInterpolate(unref(editingId) ? "Update" : "Create")} announcement</h2></div><button type="button" data-v-65e648b2>×</button></header><main data-v-65e648b2><label class="field" data-v-65e648b2><span data-v-65e648b2>Title</span><input${ssrRenderAttr("value", unref(form).title)} required data-v-65e648b2></label><label class="field" data-v-65e648b2><span data-v-65e648b2>Message</span><textarea rows="7" required data-v-65e648b2>${ssrInterpolate(unref(form).body)}</textarea></label><div class="grid gap-4 sm:grid-cols-2" data-v-65e648b2><label class="field" data-v-65e648b2><span data-v-65e648b2>Status</span><select data-v-65e648b2><option value="draft" data-v-65e648b2${ssrIncludeBooleanAttr(Array.isArray(unref(form).status) ? ssrLooseContain(unref(form).status, "draft") : ssrLooseEqual(unref(form).status, "draft")) ? " selected" : ""}>Draft</option><option value="published" data-v-65e648b2${ssrIncludeBooleanAttr(Array.isArray(unref(form).status) ? ssrLooseContain(unref(form).status, "published") : ssrLooseEqual(unref(form).status, "published")) ? " selected" : ""}>Published</option><option value="archived" data-v-65e648b2${ssrIncludeBooleanAttr(Array.isArray(unref(form).status) ? ssrLooseContain(unref(form).status, "archived") : ssrLooseEqual(unref(form).status, "archived")) ? " selected" : ""}>Archived</option></select></label><label class="field" data-v-65e648b2><span data-v-65e648b2>Published at</span><input${ssrRenderAttr("value", unref(form).published_at)} type="datetime-local" data-v-65e648b2></label></div></main><footer data-v-65e648b2><button type="button" class="secondary" data-v-65e648b2>Cancel</button><button class="primary"${ssrIncludeBooleanAttr(unref(saving)) ? " disabled" : ""} data-v-65e648b2>${ssrInterpolate(unref(saving) ? "Saving..." : "Save")}</button></footer></form></div>`);
				else _push(`<!---->`);
			}, "body", false, _parent);
			_push(`</section>`);
		};
	}
});
//#endregion
//#region app/pages/admin/announcements.vue
var _sfc_setup = announcements_vue_vue_type_script_setup_true_lang_default.setup;
announcements_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin/announcements.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var announcements_default = /*#__PURE__*/ _plugin_vue_export_helper_default(announcements_vue_vue_type_script_setup_true_lang_default, [["__scopeId", "data-v-65e648b2"]]);

export { announcements_default as default };
//# sourceMappingURL=announcements-WyVqp7H8.mjs.map
