import { u as useSeoMeta$1 } from './head-D-xrF-Fu.mjs';
import { _ as _plugin_vue_export_helper_default, a as useAsyncData, e as useApi } from '../virtual/entry.mjs';
import { u as useEvent } from './useEvent-B_Up9ELJ.mjs';
import { defineComponent, withAsyncContext, computed, ref, reactive, watch, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderList, ssrRenderAttr, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrInterpolate, ssrRenderClass, ssrRenderTeleport } from 'vue/server-renderer';
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

//#region app/composables/useEmailNotifications.ts
function useEmailNotifications() {
	const api = useApi();
	const base = (eventId) => `/admin/events/${encodeURIComponent(eventId)}/email-notifications`;
	const getTemplates = (eventId) => api(base(eventId));
	const updateTemplate = (eventId, type, body) => api(`${base(eventId)}/${encodeURIComponent(type)}`, {
		method: "PUT",
		body
	});
	const previewTemplate = (eventId, type, body) => api(`${base(eventId)}/${encodeURIComponent(type)}/preview`, {
		method: "POST",
		body
	});
	const sendTest = (eventId, type, email) => api(`${base(eventId)}/${encodeURIComponent(type)}/test-send`, {
		method: "POST",
		body: { email }
	});
	const getDeliveryHistory = (eventId, page = 1, size = 20) => api(`${base(eventId)}/deliveries?page=${page}&size=${size}`);
	return {
		getTemplates,
		updateTemplate,
		previewTemplate,
		sendTest,
		getDeliveryHistory
	};
}
//#endregion
//#region app/pages/admin/email-notifications.vue?vue&type=script&setup=true&lang.ts
var email_notifications_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "email-notifications",
	__ssrInlineRender: true,
	async setup(__props) {
		let __temp, __restore;
		useSeoMeta$1({ title: "Email Notifications | IWBIF 2026" });
		const emailApi = useEmailNotifications();
		const { getEvents } = useEvent();
		const { data: eventResponse } = ([__temp, __restore] = withAsyncContext(() => useAsyncData("email-notification-events", () => getEvents(1, 100))), __temp = await __temp, __restore(), __temp);
		const events = computed(() => eventResponse.value?.data || []);
		const eventId = ref(events.value[0]?.id || "");
		const templates = ref([]);
		const selectedType = ref("");
		const deliveries = ref([]);
		const loading = ref(false), saving = ref(false), previewing = ref(false), testing = ref(false), historyLoading = ref(false);
		const feedback = ref(""), feedbackTone = ref("success");
		const testEmail = ref("");
		const previewOpen = ref(false), previewData = ref(null);
		const form = reactive({
			subject: "",
			body_html: "",
			body_text: "",
			is_enabled: true
		});
		const selected = computed(() => templates.value.find((item) => item.notification_type === selectedType.value));
		const apiError = (error) => {
			const value = error;
			return value.data?.errors?.[0]?.message || value.data?.message || (error instanceof Error ? error.message : "The operation could not be completed.");
		};
		const selectTemplate = (item) => {
			selectedType.value = item.notification_type;
			Object.assign(form, {
				subject: item.subject || "",
				body_html: item.body_html || "",
				body_text: item.body_text || "",
				is_enabled: item.is_enabled !== false
			});
		};
		const loadTemplates = async () => {
			if (!eventId.value) return;
			loading.value = true;
			feedback.value = "";
			try {
				templates.value = (await emailApi.getTemplates(eventId.value)).data || [];
				const next = templates.value.find((item) => item.notification_type === selectedType.value) || templates.value.at(0);
				if (next) selectTemplate(next);
			} catch (error) {
				feedbackTone.value = "error";
				feedback.value = apiError(error);
				templates.value = [];
			} finally {
				loading.value = false;
			}
		};
		const loadHistory = async () => {
			if (!eventId.value) return;
			historyLoading.value = true;
			try {
				deliveries.value = (await emailApi.getDeliveryHistory(eventId.value)).data || [];
			} catch (error) {
				feedbackTone.value = "error";
				feedback.value = apiError(error);
			} finally {
				historyLoading.value = false;
			}
		};
		const normalizeVariable = (variable) => variable.includes("{{") ? variable : `{{ ${variable} }}`;
		const typeLabel = (value) => value ? value.replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase()) : "—";
		const formatDate = (value) => value ? new Intl.DateTimeFormat("en-GB", {
			dateStyle: "medium",
			timeStyle: "short"
		}).format(new Date(value)) : "—";
		watch(eventId, async () => {
			selectedType.value = "";
			await Promise.all([loadTemplates(), loadHistory()]);
		});
		if (eventId.value) [__temp, __restore] = withAsyncContext(() => Promise.all([loadTemplates(), loadHistory()])), await __temp, __restore();
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<section${ssrRenderAttrs(mergeProps({ class: "mx-auto max-w-7xl px-3 py-10 sm:px-6 lg:px-8" }, _attrs))} data-v-601221f1><div class="flex flex-wrap items-end justify-between gap-5" data-v-601221f1><div data-v-601221f1><p class="text-xs uppercase tracking-[.3em] text-cyan-200" data-v-601221f1>Admin settings</p><h1 class="mt-3 text-3xl font-black sm:text-4xl" data-v-601221f1>Email notifications</h1><p class="mt-3 max-w-2xl text-slate-400" data-v-601221f1>Manage event email templates, preview their content, send a test, and review delivery history.</p></div><label class="field min-w-64" data-v-601221f1><span data-v-601221f1>Event</span><select data-v-601221f1><!--[-->`);
			ssrRenderList(unref(events), (event) => {
				_push(`<option${ssrRenderAttr("value", event.id)} data-v-601221f1${ssrIncludeBooleanAttr(Array.isArray(unref(eventId)) ? ssrLooseContain(unref(eventId), event.id) : ssrLooseEqual(unref(eventId), event.id)) ? " selected" : ""}>${ssrInterpolate(event.name)}</option>`);
			});
			_push(`<!--]--></select></label></div>`);
			if (unref(feedback)) _push(`<p class="${ssrRenderClass([unref(feedbackTone), "notice"])}" data-v-601221f1>${ssrInterpolate(unref(feedback))}</p>`);
			else _push(`<!---->`);
			if (!unref(eventId)) _push(`<div class="empty mt-8" data-v-601221f1>No event is available. Create an event before configuring email notifications.</div>`);
			else {
				_push(`<div class="mt-8 grid gap-6 lg:grid-cols-[18rem_1fr]" data-v-601221f1><aside class="glass-card h-fit rounded-3xl p-3" data-v-601221f1><p class="px-3 py-2 text-xs font-bold uppercase tracking-[.2em] text-slate-400" data-v-601221f1>Templates</p><!--[-->`);
				ssrRenderList(unref(templates), (template) => {
					_push(`<button type="button" class="${ssrRenderClass([{ active: unref(selectedType) === template.notification_type }, "template-button"])}" data-v-601221f1><span data-v-601221f1><strong data-v-601221f1>${ssrInterpolate(template.name || typeLabel(template.notification_type))}</strong><small data-v-601221f1>${ssrInterpolate(template.notification_type)}</small></span><i class="${ssrRenderClass(template.is_enabled ? "enabled" : "disabled")}" data-v-601221f1>${ssrInterpolate(template.is_enabled ? "On" : "Off")}</i></button>`);
				});
				_push(`<!--]-->`);
				if (unref(loading)) _push(`<p class="px-3 py-6 text-sm text-slate-400" data-v-601221f1>Loading templates...</p>`);
				else if (!unref(templates).length) _push(`<p class="px-3 py-6 text-sm text-slate-400" data-v-601221f1>No templates returned by the API.</p>`);
				else _push(`<!---->`);
				_push(`</aside><div class="space-y-6" data-v-601221f1>`);
				if (unref(selected)) {
					_push(`<form class="glass-card rounded-3xl p-5 sm:p-7" data-v-601221f1><div class="flex flex-wrap items-center justify-between gap-4" data-v-601221f1><div data-v-601221f1><p class="text-xs uppercase tracking-[.2em] text-cyan-200" data-v-601221f1>Template editor</p><h2 class="mt-2 text-2xl font-bold" data-v-601221f1>${ssrInterpolate(unref(selected).name || typeLabel(unref(selected).notification_type))}</h2></div><label class="toggle" data-v-601221f1><input${ssrIncludeBooleanAttr(Array.isArray(unref(form).is_enabled) ? ssrLooseContain(unref(form).is_enabled, null) : unref(form).is_enabled) ? " checked" : ""} type="checkbox" data-v-601221f1><span data-v-601221f1>${ssrInterpolate(unref(form).is_enabled ? "Enabled" : "Disabled")}</span></label></div><label class="field mt-6" data-v-601221f1><span data-v-601221f1>Email subject</span><input${ssrRenderAttr("value", unref(form).subject)} required data-v-601221f1></label><label class="field mt-4" data-v-601221f1><span data-v-601221f1>HTML body</span><textarea rows="12" placeholder="&lt;p&gt;Hello {{ full_name }}&lt;/p&gt;" data-v-601221f1>${ssrInterpolate(unref(form).body_html)}</textarea></label><label class="field mt-4" data-v-601221f1><span data-v-601221f1>Plain-text body</span><textarea rows="7" placeholder="Fallback content for email clients that do not render HTML." data-v-601221f1>${ssrInterpolate(unref(form).body_text)}</textarea></label>`);
					if (unref(selected).available_variables?.length) {
						_push(`<div class="mt-4 rounded-2xl border border-white/10 bg-slate-950/50 p-4" data-v-601221f1><p class="text-xs font-bold uppercase tracking-[.16em] text-slate-400" data-v-601221f1>Available variables</p><div class="mt-3 flex flex-wrap gap-2" data-v-601221f1><!--[-->`);
						ssrRenderList(unref(selected).available_variables, (variable) => {
							_push(`<button type="button" class="variable" data-v-601221f1>${ssrInterpolate(normalizeVariable(variable))}</button>`);
						});
						_push(`<!--]--></div></div>`);
					} else _push(`<!---->`);
					_push(`<div class="mt-6 flex flex-wrap gap-3" data-v-601221f1><button class="primary"${ssrIncludeBooleanAttr(unref(saving)) ? " disabled" : ""} data-v-601221f1>${ssrInterpolate(unref(saving) ? "Saving..." : "Save template")}</button><button type="button" class="secondary"${ssrIncludeBooleanAttr(unref(previewing)) ? " disabled" : ""} data-v-601221f1>${ssrInterpolate(unref(previewing) ? "Loading..." : "Preview")}</button></div></form>`);
				} else _push(`<!---->`);
				if (unref(selected)) _push(`<section class="glass-card rounded-3xl p-5 sm:p-7" data-v-601221f1><h2 class="text-xl font-bold" data-v-601221f1>Send a test email</h2><form class="mt-4 flex flex-col gap-3 sm:flex-row" data-v-601221f1><input${ssrRenderAttr("value", unref(testEmail))} class="input flex-1" type="email" placeholder="recipient@example.com" required data-v-601221f1><button class="secondary"${ssrIncludeBooleanAttr(unref(testing)) ? " disabled" : ""} data-v-601221f1>${ssrInterpolate(unref(testing) ? "Sending..." : "Send test")}</button></form></section>`);
				else _push(`<!---->`);
				_push(`<section class="glass-card overflow-hidden rounded-3xl" data-v-601221f1><div class="flex items-center justify-between gap-4 p-5 sm:p-7" data-v-601221f1><div data-v-601221f1><h2 class="text-xl font-bold" data-v-601221f1>Delivery history</h2><p class="mt-1 text-sm text-slate-400" data-v-601221f1>Latest messages for this event.</p></div><button type="button" class="secondary"${ssrIncludeBooleanAttr(unref(historyLoading)) ? " disabled" : ""} data-v-601221f1>Refresh</button></div><div class="overflow-x-auto" data-v-601221f1><table data-v-601221f1><thead data-v-601221f1><tr data-v-601221f1><th data-v-601221f1>Recipient</th><th data-v-601221f1>Template</th><th data-v-601221f1>Status</th><th data-v-601221f1>Sent</th></tr></thead><tbody data-v-601221f1><!--[-->`);
				ssrRenderList(unref(deliveries), (item) => {
					_push(`<tr data-v-601221f1><td data-v-601221f1>${ssrInterpolate(item.recipient_email || item.recipient || "—")}</td><td data-v-601221f1>${ssrInterpolate(typeLabel(item.notification_type || ""))}</td><td data-v-601221f1><span class="${ssrRenderClass([item.status, "status"])}" data-v-601221f1>${ssrInterpolate(item.status)}</span>`);
					if (item.error_message) _push(`<small class="error-text" data-v-601221f1>${ssrInterpolate(item.error_message)}</small>`);
					else _push(`<!---->`);
					_push(`</td><td data-v-601221f1>${ssrInterpolate(formatDate(item.sent_at || item.created_at))}</td></tr>`);
				});
				_push(`<!--]-->`);
				if (!unref(historyLoading) && !unref(deliveries).length) _push(`<tr data-v-601221f1><td colspan="4" class="empty" data-v-601221f1>No delivery history yet.</td></tr>`);
				else _push(`<!---->`);
				_push(`</tbody></table></div></section></div></div>`);
			}
			ssrRenderTeleport(_push, (_push) => {
				if (unref(previewOpen)) {
					_push(`<div class="backdrop" data-v-601221f1><article class="preview-modal" data-v-601221f1><header data-v-601221f1><div data-v-601221f1><p class="text-xs uppercase tracking-[.2em] text-cyan-200" data-v-601221f1>Email preview</p><h2 data-v-601221f1>${ssrInterpolate(unref(previewData)?.subject)}</h2></div><button type="button" data-v-601221f1>×</button></header><div class="preview-body" data-v-601221f1>`);
					if (unref(previewData)?.body_html) _push(`<div data-v-601221f1>${unref(previewData).body_html ?? ""}</div>`);
					else _push(`<pre data-v-601221f1>${ssrInterpolate(unref(previewData)?.body_text)}</pre>`);
					_push(`</div></article></div>`);
				} else _push(`<!---->`);
			}, "body", false, _parent);
			_push(`</section>`);
		};
	}
});
//#endregion
//#region app/pages/admin/email-notifications.vue
var _sfc_setup = email_notifications_vue_vue_type_script_setup_true_lang_default.setup;
email_notifications_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin/email-notifications.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var email_notifications_default = /*#__PURE__*/ _plugin_vue_export_helper_default(email_notifications_vue_vue_type_script_setup_true_lang_default, [["__scopeId", "data-v-601221f1"]]);

export { email_notifications_default as default };
//# sourceMappingURL=email-notifications-DHMOSVUB.mjs.map
