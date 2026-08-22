import { u as useSeoMeta$1 } from './head-D-xrF-Fu.mjs';
import { _ as _plugin_vue_export_helper_default, a as useAsyncData, N as NuxtLink } from '../virtual/entry.mjs';
import { u as useEvent } from './useEvent-B_Up9ELJ.mjs';
import { u as useAdminContent } from './useAdminContent-GiNaIDgL.mjs';
import { defineComponent, withAsyncContext, computed, ref, reactive, watch, mergeProps, withCtx, createTextVNode, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrIncludeBooleanAttr, ssrRenderList, ssrRenderAttr, ssrLooseContain, ssrLooseEqual, ssrInterpolate, ssrRenderClass, ssrRenderTeleport } from 'vue/server-renderer';
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

//#region app/pages/admin/program.vue?vue&type=script&setup=true&lang.ts
var program_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "program",
	__ssrInlineRender: true,
	async setup(__props) {
		let __temp, __restore;
		useSeoMeta$1({ title: "Manage Program | IWBIF 2026" });
		const { getEvents } = useEvent();
		const adminApi = useAdminContent();
		const { data: eventResponse } = ([__temp, __restore] = withAsyncContext(() => useAsyncData("admin-program-events", () => getEvents(1, 100))), __temp = await __temp, __restore(), __temp);
		const events = computed(() => eventResponse.value?.data || []);
		const selectedEventId = ref(events.value[0]?.id || "");
		const selectedEvent = computed(() => events.value.find((item) => item.id === selectedEventId.value));
		const sessions = ref([]);
		const loading = ref(false);
		const saving = ref(false);
		const editingId = ref("");
		const modalOpen = ref(false);
		const feedback = ref("");
		const feedbackTone = ref("success");
		const emptyForm = () => ({
			title: "",
			slug: "",
			description: "",
			session_type: "session",
			room_name: "",
			start_at: "",
			end_at: "",
			capacity: null,
			status: "published"
		});
		const form = reactive(emptyForm());
		const apiError = (error) => {
			const value = error;
			return value.data?.errors?.[0]?.message || value.data?.message || (error instanceof Error ? error.message : "The session could not be saved.");
		};
		const loadSessions = async () => {
			if (!selectedEvent.value?.slug) {
				sessions.value = [];
				return;
			}
			loading.value = true;
			try {
				sessions.value = (await adminApi.getSessions(selectedEvent.value.slug)).data || [];
			} catch (error) {
				feedbackTone.value = "error";
				feedback.value = apiError(error);
			} finally {
				loading.value = false;
			}
		};
		watch(selectedEventId, loadSessions);
		if (selectedEventId.value) [__temp, __restore] = withAsyncContext(() => loadSessions()), await __temp, __restore();
		const formatDay = (value) => new Intl.DateTimeFormat("en-GB", {
			dateStyle: "medium",
			timeZone: "Asia/Jakarta"
		}).format(new Date(value));
		const formatTime = (value) => new Intl.DateTimeFormat("en-GB", {
			hour: "2-digit",
			minute: "2-digit",
			timeZone: "Asia/Jakarta"
		}).format(new Date(value));
		return (_ctx, _push, _parent, _attrs) => {
			const _component_NuxtLink = NuxtLink;
			_push(`<section${ssrRenderAttrs(mergeProps({ class: "mx-auto max-w-7xl px-3 py-10 sm:px-6 lg:px-8" }, _attrs))} data-v-a571e3b1><div class="flex flex-wrap items-end justify-between gap-5" data-v-a571e3b1><div data-v-a571e3b1><p class="text-sm uppercase tracking-[.3em] text-cyan-200" data-v-a571e3b1>Event operations</p><h1 class="mt-3 text-3xl font-black sm:text-4xl" data-v-a571e3b1>Program &amp; agenda</h1><p class="mt-3 max-w-2xl text-sm leading-7 text-slate-300" data-v-a571e3b1>Manage schedules, rooms, capacity, and publication status.</p></div><div class="flex flex-wrap gap-3" data-v-a571e3b1>`);
			_push(ssrRenderComponent(_component_NuxtLink, {
				to: "/program",
				class: "action-secondary"
			}, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`View public program`);
					else return [createTextVNode("View public program")];
				}),
				_: 1
			}, _parent));
			_push(`<button class="action-primary"${ssrIncludeBooleanAttr(!unref(selectedEventId)) ? " disabled" : ""} data-v-a571e3b1>+ New session</button></div></div><div class="mt-8 flex flex-col gap-4 rounded-3xl border border-white/10 bg-white/[.04] p-4 sm:flex-row sm:items-end sm:justify-between" data-v-a571e3b1><label class="field w-full sm:max-w-md" data-v-a571e3b1><span data-v-a571e3b1>Event</span><select data-v-a571e3b1><!--[-->`);
			ssrRenderList(unref(events), (event) => {
				_push(`<option${ssrRenderAttr("value", event.id)} data-v-a571e3b1${ssrIncludeBooleanAttr(Array.isArray(unref(selectedEventId)) ? ssrLooseContain(unref(selectedEventId), event.id) : ssrLooseEqual(unref(selectedEventId), event.id)) ? " selected" : ""}>${ssrInterpolate(event.name)}</option>`);
			});
			_push(`<!--]--></select></label><p class="text-sm text-slate-400" data-v-a571e3b1>${ssrInterpolate(unref(sessions).length)} sessions</p></div>`);
			if (unref(feedback)) _push(`<p class="${ssrRenderClass([unref(feedbackTone) === "error" ? "border-red-400/30 bg-red-950/30 text-red-100" : "border-emerald-300/30 bg-emerald-950/30 text-emerald-100", "mt-5 rounded-2xl border p-4 text-sm"])}" data-v-a571e3b1>${ssrInterpolate(unref(feedback))}</p>`);
			else _push(`<!---->`);
			_push(`<div class="mt-6 overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950/45 shadow-2xl shadow-slate-950/30" data-v-a571e3b1><div class="overflow-x-auto" data-v-a571e3b1><table class="w-full min-w-[900px] text-left" data-v-a571e3b1><thead class="border-b border-white/10 bg-white/[.045] text-[11px] uppercase tracking-[.18em] text-slate-400" data-v-a571e3b1><tr data-v-a571e3b1><th class="px-5 py-4" data-v-a571e3b1>Session</th><th class="px-5 py-4" data-v-a571e3b1>Schedule</th><th class="px-5 py-4" data-v-a571e3b1>Room</th><th class="px-5 py-4" data-v-a571e3b1>Capacity</th><th class="px-5 py-4" data-v-a571e3b1>Status</th><th class="px-5 py-4 text-right" data-v-a571e3b1>Actions</th></tr></thead><tbody class="divide-y divide-white/[.07]" data-v-a571e3b1>`);
			if (unref(loading)) _push(`<tr data-v-a571e3b1><td colspan="6" class="px-5 py-12 text-center text-slate-400" data-v-a571e3b1>Loading program...</td></tr>`);
			else if (!unref(sessions).length) _push(`<tr data-v-a571e3b1><td colspan="6" class="px-5 py-12 text-center text-slate-400" data-v-a571e3b1>No sessions are available for this event.</td></tr>`);
			else {
				_push(`<!--[-->`);
				ssrRenderList(unref(sessions), (session) => {
					_push(`<tr class="transition hover:bg-cyan-300/[.035]" data-v-a571e3b1><td class="px-5 py-4" data-v-a571e3b1><p class="font-bold text-white" data-v-a571e3b1>${ssrInterpolate(session.title)}</p><p class="mt-1 text-xs capitalize text-cyan-200" data-v-a571e3b1>${ssrInterpolate(session.session_type || "session")}</p></td><td class="px-5 py-4 text-sm text-slate-300" data-v-a571e3b1><p data-v-a571e3b1>${ssrInterpolate(formatDay(session.start_at))}</p><p class="mt-1 text-xs text-slate-500" data-v-a571e3b1>${ssrInterpolate(formatTime(session.start_at))}–${ssrInterpolate(formatTime(session.end_at))}</p></td><td class="px-5 py-4 text-sm text-slate-300" data-v-a571e3b1>${ssrInterpolate(session.room_name || "TBA")}</td><td class="px-5 py-4 text-sm text-slate-300" data-v-a571e3b1>${ssrInterpolate(session.capacity || "—")}</td><td class="px-5 py-4" data-v-a571e3b1><span class="${ssrRenderClass([session.status === "published" ? "status-live" : session.status === "canceled" ? "status-off" : "status-draft", "status-pill"])}" data-v-a571e3b1>${ssrInterpolate(session.status || "published")}</span></td><td class="px-5 py-4" data-v-a571e3b1><div class="flex justify-end gap-2" data-v-a571e3b1><button class="table-button" data-v-a571e3b1>Edit</button><button class="table-button border-red-300/20 text-red-200 hover:border-red-300/50" data-v-a571e3b1>Delete</button></div></td></tr>`);
				});
				_push(`<!--]-->`);
			}
			_push(`</tbody></table></div></div>`);
			ssrRenderTeleport(_push, (_push) => {
				if (unref(modalOpen)) _push(`<div class="modal-backdrop" data-v-a571e3b1><form class="modal-card" data-v-a571e3b1><div class="flex items-start justify-between gap-4 border-b border-white/10 px-5 py-5 sm:px-7" data-v-a571e3b1><div data-v-a571e3b1><p class="text-xs uppercase tracking-[.24em] text-cyan-200" data-v-a571e3b1>Program editor</p><h2 class="mt-2 text-2xl font-black" data-v-a571e3b1>${ssrInterpolate(unref(editingId) ? "Update session" : "Create session")}</h2></div><button type="button" class="modal-close" aria-label="Close" data-v-a571e3b1>×</button></div><div class="max-h-[70vh] space-y-4 overflow-y-auto px-5 py-6 sm:px-7" data-v-a571e3b1><label class="field" data-v-a571e3b1><span data-v-a571e3b1>Session title</span><input${ssrRenderAttr("value", unref(form).title)} required data-v-a571e3b1></label><label class="field" data-v-a571e3b1><span data-v-a571e3b1>Slug</span><input${ssrRenderAttr("value", unref(form).slug)} placeholder="business-forum-opening" data-v-a571e3b1></label><label class="field" data-v-a571e3b1><span data-v-a571e3b1>Description</span><textarea rows="3" data-v-a571e3b1>${ssrInterpolate(unref(form).description)}</textarea></label><div class="grid gap-4 sm:grid-cols-2" data-v-a571e3b1><label class="field" data-v-a571e3b1><span data-v-a571e3b1>Session type</span><input${ssrRenderAttr("value", unref(form).session_type)} placeholder="panel" data-v-a571e3b1></label><label class="field" data-v-a571e3b1><span data-v-a571e3b1>Room</span><input${ssrRenderAttr("value", unref(form).room_name)} placeholder="Grand Ballroom" data-v-a571e3b1></label></div><div class="grid gap-4 sm:grid-cols-2" data-v-a571e3b1><label class="field" data-v-a571e3b1><span data-v-a571e3b1>Starts at</span><input${ssrRenderAttr("value", unref(form).start_at)} type="datetime-local" required data-v-a571e3b1></label><label class="field" data-v-a571e3b1><span data-v-a571e3b1>Ends at</span><input${ssrRenderAttr("value", unref(form).end_at)} type="datetime-local" required data-v-a571e3b1></label></div><div class="grid gap-4 sm:grid-cols-2" data-v-a571e3b1><label class="field" data-v-a571e3b1><span data-v-a571e3b1>Capacity</span><input${ssrRenderAttr("value", unref(form).capacity)} type="number" min="1" data-v-a571e3b1></label><label class="field" data-v-a571e3b1><span data-v-a571e3b1>Status</span><select data-v-a571e3b1><option value="draft" data-v-a571e3b1${ssrIncludeBooleanAttr(Array.isArray(unref(form).status) ? ssrLooseContain(unref(form).status, "draft") : ssrLooseEqual(unref(form).status, "draft")) ? " selected" : ""}>Draft</option><option value="published" data-v-a571e3b1${ssrIncludeBooleanAttr(Array.isArray(unref(form).status) ? ssrLooseContain(unref(form).status, "published") : ssrLooseEqual(unref(form).status, "published")) ? " selected" : ""}>Published</option><option value="canceled" data-v-a571e3b1${ssrIncludeBooleanAttr(Array.isArray(unref(form).status) ? ssrLooseContain(unref(form).status, "canceled") : ssrLooseEqual(unref(form).status, "canceled")) ? " selected" : ""}>Canceled</option></select></label></div></div><div class="flex justify-end gap-3 border-t border-white/10 px-5 py-5 sm:px-7" data-v-a571e3b1><button type="button" class="action-secondary" data-v-a571e3b1>Cancel</button><button class="action-primary"${ssrIncludeBooleanAttr(unref(saving)) ? " disabled" : ""} data-v-a571e3b1>${ssrInterpolate(unref(saving) ? "Saving..." : "Save session")}</button></div></form></div>`);
				else _push(`<!---->`);
			}, "body", false, _parent);
			_push(`</section>`);
		};
	}
});
//#endregion
//#region app/pages/admin/program.vue
var _sfc_setup = program_vue_vue_type_script_setup_true_lang_default.setup;
program_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin/program.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var program_default = /*#__PURE__*/ _plugin_vue_export_helper_default(program_vue_vue_type_script_setup_true_lang_default, [["__scopeId", "data-v-a571e3b1"]]);

export { program_default as default };
//# sourceMappingURL=program-Badg773x.mjs.map
