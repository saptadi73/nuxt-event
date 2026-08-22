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

//#region app/pages/admin/certificates.vue?vue&type=script&setup=true&lang.ts
var certificates_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "certificates",
	__ssrInlineRender: true,
	async setup(__props) {
		let __temp, __restore;
		useSeoMeta$1({ title: "Manage Certificates | IWBIF 2026" });
		const api = useAdminOperations(), { getEvents } = useEvent();
		const { data: eventResponse } = ([__temp, __restore] = withAsyncContext(() => useAsyncData("certificate-events", () => getEvents(1, 100))), __temp = await __temp, __restore(), __temp);
		const events = computed(() => eventResponse.value?.data || []), eventId = ref(events.value[0]?.id || ""), users = ref([]), items = ref([]), loading = ref(false), saving = ref(false), modalOpen = ref(false), editingId = ref(""), feedback = ref("");
		const empty = () => ({
			user_id: "",
			certificate_number: "",
			title: "Certificate of Attendance",
			download_url: "",
			issued_at: ""
		}), form = reactive(empty());
		const errorText = (e) => e.data?.message || (e instanceof Error ? e.message : "Operation failed.");
		const load = async () => {
			if (!eventId.value) return;
			loading.value = true;
			try {
				const [result, userResult] = await Promise.all([api.getAdminCertificates(eventId.value), api.getUsers(1, 100)]);
				items.value = result.data || [];
				users.value = userResult.data || [];
			} catch (e) {
				feedback.value = errorText(e);
			} finally {
				loading.value = false;
			}
		};
		watch(eventId, load);
		if (eventId.value) [__temp, __restore] = withAsyncContext(() => load()), await __temp, __restore();
		const userLabel = (id) => {
			const user = users.value.find((item) => item.id === id);
			return user?.full_name || user?.email || id || "—";
		};
		const formatDate = (v) => v ? new Intl.DateTimeFormat("en-GB", { dateStyle: "medium" }).format(new Date(v)) : "—";
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<section${ssrRenderAttrs(mergeProps({ class: "mx-auto max-w-7xl px-3 py-10 sm:px-6" }, _attrs))} data-v-c882d933><div class="flex flex-wrap items-end justify-between gap-5" data-v-c882d933><div data-v-c882d933><p class="text-xs uppercase tracking-[.3em] text-cyan-200" data-v-c882d933>Recognition</p><h1 class="mt-3 text-3xl font-black" data-v-c882d933>Certificates</h1><p class="mt-3 text-slate-400" data-v-c882d933>Issue and maintain participant certificates.</p></div><button class="primary" data-v-c882d933>+ Issue certificate</button></div><label class="field mt-8 block max-w-md" data-v-c882d933><span data-v-c882d933>Event</span><select data-v-c882d933><!--[-->`);
			ssrRenderList(unref(events), (event) => {
				_push(`<option${ssrRenderAttr("value", event.id)} data-v-c882d933${ssrIncludeBooleanAttr(Array.isArray(unref(eventId)) ? ssrLooseContain(unref(eventId), event.id) : ssrLooseEqual(unref(eventId), event.id)) ? " selected" : ""}>${ssrInterpolate(event.name)}</option>`);
			});
			_push(`<!--]--></select></label>`);
			if (unref(feedback)) _push(`<p class="mt-5 rounded-2xl border border-cyan-300/20 bg-cyan-300/10 p-4" data-v-c882d933>${ssrInterpolate(unref(feedback))}</p>`);
			else _push(`<!---->`);
			_push(`<div class="mt-6 overflow-x-auto rounded-[2rem] border border-white/10 bg-slate-950/45" data-v-c882d933><table class="w-full min-w-[900px] text-left" data-v-c882d933><thead data-v-c882d933><tr data-v-c882d933><th data-v-c882d933>Certificate</th><th data-v-c882d933>User</th><th data-v-c882d933>Issued</th><th data-v-c882d933>Download</th><th class="text-right" data-v-c882d933>Actions</th></tr></thead><tbody data-v-c882d933>`);
			if (unref(loading)) _push(`<tr data-v-c882d933><td colspan="5" class="py-12 text-center" data-v-c882d933>Loading...</td></tr>`);
			else if (!unref(items).length) _push(`<tr data-v-c882d933><td colspan="5" class="py-12 text-center" data-v-c882d933>No certificates issued.</td></tr>`);
			else {
				_push(`<!--[-->`);
				ssrRenderList(unref(items), (item) => {
					_push(`<tr data-v-c882d933><td data-v-c882d933><strong data-v-c882d933>${ssrInterpolate(item.title)}</strong><small data-v-c882d933>${ssrInterpolate(item.certificate_number)}</small></td><td data-v-c882d933>${ssrInterpolate(userLabel(item.user_id))}</td><td data-v-c882d933>${ssrInterpolate(formatDate(item.issued_at))}</td><td data-v-c882d933>`);
					if (item.download_url) _push(`<a${ssrRenderAttr("href", item.download_url)} target="_blank" rel="noopener" class="text-cyan-200" data-v-c882d933>Open file</a>`);
					else _push(`<span data-v-c882d933>—</span>`);
					_push(`</td><td data-v-c882d933><div class="flex justify-end gap-2" data-v-c882d933><button class="table-button" data-v-c882d933>Edit</button><button class="table-button text-red-200" data-v-c882d933>Delete</button></div></td></tr>`);
				});
				_push(`<!--]-->`);
			}
			_push(`</tbody></table></div>`);
			ssrRenderTeleport(_push, (_push) => {
				if (unref(modalOpen)) {
					_push(`<div class="backdrop" data-v-c882d933><form class="modal" data-v-c882d933><header data-v-c882d933><div data-v-c882d933><p class="text-xs uppercase tracking-[.25em] text-cyan-200" data-v-c882d933>Certificate editor</p><h2 data-v-c882d933>${ssrInterpolate(unref(editingId) ? "Update" : "Issue")} certificate</h2></div><button type="button" data-v-c882d933>×</button></header><main data-v-c882d933><label class="field" data-v-c882d933><span data-v-c882d933>Recipient</span><select required data-v-c882d933><option value="" disabled data-v-c882d933${ssrIncludeBooleanAttr(Array.isArray(unref(form).user_id) ? ssrLooseContain(unref(form).user_id, "") : ssrLooseEqual(unref(form).user_id, "")) ? " selected" : ""}>Select user</option><!--[-->`);
					ssrRenderList(unref(users), (user) => {
						_push(`<option${ssrRenderAttr("value", user.id)} data-v-c882d933${ssrIncludeBooleanAttr(Array.isArray(unref(form).user_id) ? ssrLooseContain(unref(form).user_id, user.id) : ssrLooseEqual(unref(form).user_id, user.id)) ? " selected" : ""}>${ssrInterpolate(user.full_name || user.email)} — ${ssrInterpolate(user.email)}</option>`);
					});
					_push(`<!--]--></select></label><div class="grid gap-4 sm:grid-cols-2" data-v-c882d933><label class="field" data-v-c882d933><span data-v-c882d933>Certificate number</span><input${ssrRenderAttr("value", unref(form).certificate_number)} required data-v-c882d933></label><label class="field" data-v-c882d933><span data-v-c882d933>Issued at</span><input${ssrRenderAttr("value", unref(form).issued_at)} type="datetime-local" data-v-c882d933></label></div><label class="field" data-v-c882d933><span data-v-c882d933>Title</span><input${ssrRenderAttr("value", unref(form).title)} required data-v-c882d933></label><label class="field" data-v-c882d933><span data-v-c882d933>Download URL</span><input${ssrRenderAttr("value", unref(form).download_url)} type="url" data-v-c882d933></label></main><footer data-v-c882d933><button type="button" class="secondary" data-v-c882d933>Cancel</button><button class="primary"${ssrIncludeBooleanAttr(unref(saving)) ? " disabled" : ""} data-v-c882d933>${ssrInterpolate(unref(saving) ? "Saving..." : "Save")}</button></footer></form></div>`);
				} else _push(`<!---->`);
			}, "body", false, _parent);
			_push(`</section>`);
		};
	}
});
//#endregion
//#region app/pages/admin/certificates.vue
var _sfc_setup = certificates_vue_vue_type_script_setup_true_lang_default.setup;
certificates_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin/certificates.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var certificates_default = /*#__PURE__*/ _plugin_vue_export_helper_default(certificates_vue_vue_type_script_setup_true_lang_default, [["__scopeId", "data-v-c882d933"]]);

export { certificates_default as default };
//# sourceMappingURL=certificates-DTt-pNsM.mjs.map
